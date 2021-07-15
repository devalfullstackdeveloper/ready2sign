import { Component, OnInit, AfterContentInit, AfterViewInit, ViewChild } from '@angular/core';
import { TemplateService } from '../../../core/service/template.service';
import { SettingsService } from 'src/app/core/service/settings.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../../../core/service/alert.service';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, transition, style, animate } from '@angular/animations';
import * as moment from "moment";
declare var $: any;

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class TemplatesComponent implements OnInit, AfterViewInit {

  isLoading: boolean = true;
  allApps: any = []
  propertyFilter: any = {
    filterOn: 'Id',
    order: 'Asc',
    app_srt: false,
    status_srt: false,
    search: "",
    status: ""
  }

  activeApp = false;

  companyProfileData: any = {};
  currentUser: any = {};

  // create template
  doc_vis = false;
  clickedCreateTemp = false;

  // accountNumber : Number = (<any>window).activeAcountNumber;
  accountNumber: Number = Number(JSON.parse(localStorage.getItem('acccountNumber')))
  timeoutId = null;
  searchText = ''

  sidebarData: any = []

  allTemplate: any = [];
  displayForm: any = 'All';
  allPartyStatus: any;
  allPropertyMeTypes: any;
  statusSet: any = 1;
  template: any = { Groups: [], IsLocked: 0, StatusId: 1, ExpirationDays: 30, IsLinked: 0, PropertyMeTypeId: null, PartyTypeId: null };
  ReminderDay : any = 7
  allRoles = [];

  allAuthors: any = [];

  activeGroups: any;

  templateGroups: any = [];
  activeGroupsArray: Array<any> = [];
  numberArray: any = [];
  totalTemplate: number;
  exactPage: any;
  pageNo: number = 1;
  activePage: any = 1;

  templateFilter: any = {
    top: 5,
    skip: 0,
    type: 0,
    // filterOn: 'Title',
    // order: 'asc',
    filterOn: 'CreatedAt',
    order: 'desc',
    title: false,
    created: true,
    modified: false,
    groups: false,
    status: false,
    isLocked: false,
    search: "",
    author: 0,
    selectedGroup: ''
  }
  clickOffIndex = 0;

  deletePopup = false;
  deleteTemplateId = null;

  userProfile: any;

  Roles: any = []

  // Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: any;
  public pageSize = 50;
  public currentPage = 0;

  propertyMeStatus: any;
  constructor(private templateService: TemplateService,
    private alertService: AlertService,
    private settings: SettingsService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router) {
    this.loadConstructorsFunction();
    this.Roles = this.route.snapshot.data['roles'];
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {

    this.spinner.hide();

    this.currentUser = this.authenticationService.currentUserValue;
    this.getUserProfile();
    this.authenticationService.getActiveAccountNumber().subscribe(data => {
      this.currentUser = this.authenticationService.currentUserValue;
      this.accountNumber = data
      // this.template.AccountId = this.accountNumber;

      let roleExist = this.Roles.find(role => role === this.currentUser.role);
      if (!roleExist) {
        this.router.navigate(['/admin/home']);
      }

      if (this.accountNumber) {
        this.getAllTemplate();
        this.getActiveGroups(this.accountNumber);
        this.getAllAuthors();
        this.getAccount();
      }
      this.getpartystatus();
      this.getPropertyMeTypes();
      this.getSidebarData();
      this.getUserProfile();

      // this.getActiveGroups(this.accountNumber);
    });

    if (!this.accountNumber) {
      this.accountNumber = (<any>window).activeAcountNumber
    }
  }

  async loadConstructorsFunction() {
    await this.getSidebarData();

    let routerFullUrl = this.router.url;
    let router_spl = routerFullUrl.split("/")

    let last_routerPath = router_spl[router_spl.length - 1]

    if (last_routerPath == 'All') {
      this.displayForm = 'All';
    } else if (last_routerPath == 'Drafts') {
      this.displayForm = 'Drafts';
    } else if (last_routerPath == 'Published' || last_routerPath == 'Publish') {
      // this.displayForm = 'Published';
      this.displayForm = last_routerPath;
    } else if (last_routerPath == 'Archive') {
      this.displayForm = 'Archive';
    } else {
      this.displayForm = 'All';
    }

    let selectSideData = this.sidebarData.find(sd => {
      if (sd.StatusName == this.displayForm) {
        return sd
      }
    });
    this.templateFilter.type = selectSideData.StatusId

    this.getAllTemplate();
    this.getActiveGroups(this.accountNumber);
    this.getAllAuthors();

    this.getpartystatus();
    this.getPropertyMeTypes();

    this.getAccount()
  }

  getAllApps() {
    this.settings.getAllApps(this.accountNumber, this.propertyFilter).subscribe(res => {
      this.allApps = res.Data;
    }, error => {
      // console.log("Error ::----", error);
    })
  }

  clickedCreateTemplate() {
    this.doc_vis = true;
    this.clickedCreateTemp = true;
    this.template.IsLinked = 0;
    this.getAllApps();
    setTimeout(() => {
      this.loadScript();
    }, 300)
  }

  closeCreatetemplate() {
    this.doc_vis = false
    setTimeout(() => {
      this.clickedCreateTemp = false;
    }, 300);
    this.template = { IsLocked: 0, StatusId: 1, ExpirationDays: 30, PropertyMeTypeId: null, PartyTypeId: null, IsLinked: 0 };
    this.ReminderDay = 7
  }

  getAllTemplate() {
    if (this.accountNumber) {
      // this.spinner.show()
      this.getPropertyMeStatus();
      this.isLoading = true;
      this.templateService.getAllTemplates(this.accountNumber, this.templateFilter).subscribe(res => {
        // this.spinner.hide()
        this.isLoading = false;
        if (res.Items.length > 0) {

          res.Items = res.Items.map(item => {
            return {
              ...item,
              CreatedAt: item.CreatedAt ? moment(item.CreatedAt).format('DD/MM/YYYY \xa0\xa0\xa0 hh:mm a') : '',
              ModifiedAt: item.ModifiedAt ? moment(item.ModifiedAt).format('DD/MM/YYYY \xa0\xa0\xa0 hh:mm a') : ''
            }
          })

          this.allTemplate = res.Items;
          this.totalTemplate = res.Count;

          this.currentPage = 0;
          this.dataSource = new MatTableDataSource<Element>(this.allTemplate);
          this.dataSource.paginator = this.paginator;
          this.iterator();

          this.pageNoCalculation();
        }
        else {
          this.allTemplate = [];
          this.totalTemplate = 0;

          this.currentPage = 0;
          this.dataSource = new MatTableDataSource<Element>(this.allTemplate);
          this.dataSource.paginator = this.paginator;
          this.iterator();

          this.pageNoCalculation();
        }
        setTimeout(() => {
          this.loadScript();
        }, 1000)
      }, error => {
        // this.spinner.hide()
        this.isLoading = false;
        this.alertService.error("Data not Found")
      });
    }
  }

  handlePage(e: any) {
    this.clickOffIndex = 0;

    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.allTemplate.slice(start, end);
    this.dataSource = part;
  }

  setDisplay(page, type) {
    if (this.templateFilter.type !== type) {
      this.displayForm = page;
      this.router.navigate(['/admin/templates/', page]);
      this.templateFilter.type = type
      this.templateFilter.selectedGroup = '';
      this.templateFilter.search = '';
      this.searchText = '';
      this.getAllTemplate()
    }
  }

  getpartystatus() {
    this.templateService.getpartystatus().subscribe(res => {
      this.allPartyStatus = res;
    });
  }

  getPropertyMeTypes() {
    this.templateService.getPropertyMeTypes().subscribe(res => {
      this.allPropertyMeTypes = res;
    })
  }

  statusChange(stts) {
    this.statusSet = stts;
    this.template.StatusId = this.statusSet;
  }

  getActiveGroups(acc) {
    this.templateService.getActiveGroups(acc).subscribe(res => {
      this.activeGroups = res.slice(0);

      var grps = []
      for (var i = 0; i < res.length; i++) {
        if (res[i].Name == 'Default') {
          res[i].checked = true
        } else {
          res[i].checked = false
        }

        grps.push(res[i]);
      }
      this.templateGroups = grps;
      this.activeGroupsArray = grps;
    });
  }

  getAllAuthors() {
    this.templateService.getAllAuthors(this.accountNumber).subscribe(res => {
      this.allAuthors = res
    })
  }

  getSidebarData() {
    return new Promise(resolve => {
      this.templateService.getSidebarData(this.accountNumber).subscribe(res => {
        this.sidebarData = res
        resolve(res)
      })
    });
  }

  getUserProfile() {
    this.authenticationService.getUserProfile().subscribe(res => {
      this.userProfile = res
      // this.userAccounts = res.UserAccounts
      // if(this.userProfile.FirstName && this.userProfile.LastName){
      //   this.userName = this.userProfile.FirstName +' '+ this.userProfile.LastName;
      // }
      // if(res.UserAccounts && res.UserAccounts.length > 0){
      //   this.selectedaccount = res.UserAccounts[0].Id
      //   localStorage.setItem('acccountNumber',JSON.stringify(res.UserAccounts[0].Id))
      //   this.authenticationService.setActiveAccountNumber(res.UserAccounts[0].Id)
      // }
    }, error => {
      // console.log("Error---", error);
    })
  }

  //Author Filter Change Event
  authorChange(value) {
    this.templateFilter.author = value
    this.getAllTemplate()
  }

  changeStatus(value) {
    let vl = this.sidebarData.find(x => {
      if (x.StatusId == Number(value)) {
        return x
      }
    })
    this.setDisplay(vl.StatusName, vl.StatusId);
  }

  groupChange(value) {
    if (value) {
      this.templateFilter.selectedGroup = value
      this.getAllTemplate();
    }
  }

  changeLink(event) {

    if (event !== undefined) {
      if (event == '0' || event == 'null') {
        this.template.PropertyMeTypeId = null;
        this.template.PartyTypeId = null
      }
    }
  }

  changeSection(event) {
    if (event !== undefined) {
      this.template.PartyTypeId = null
      this.allRoles = [];
      var selectedSection = this.allPropertyMeTypes.find(e => {
        if (e.Id == event) {
          return e
        }
      })
      var arrType = Array.isArray(selectedSection.PartyType)
      selectedSection.PartyType.forEach(element => {
        this.allRoles.push(element);
      });
    }
  }

  changeGroups(index) {
    // if(isChecked){
    //   this.activeGroupsArray.push(val);
    // }
    // else{
    //   let index = this.activeGroupsArray.indexOf(val);
    //   this.activeGroupsArray.splice(index,1);
    // }
    // this.template.Groups = this.activeGroupsArray;
    // console.log("this.template.groups---------",this.template.Groups);


    this.activeGroupsArray[index].checked = !this.activeGroupsArray[index].checked
  }

  changePermission(val) {
    this.template.IsLocked = val;
  }

  filterBy(type) {
    this.templateFilter.top = 5;
    this.templateFilter.skip = 0;
    this.activePage = 1;
    if (type == 'Title') {
      this.templateFilter.title = !this.templateFilter.title;
      this.templateFilter.created = false;
      this.templateFilter.modified = false;
      this.templateFilter.groups = false;
      this.templateFilter.status = false;
      this.templateFilter.isLocked = false;

      this.templateFilter.filterOn = "Title";
      if (this.templateFilter.title == true)
        this.templateFilter.order = 'asc';
      else
        this.templateFilter.order = 'desc';
    }
    if (type == 'Created') {
      this.templateFilter.title = false;
      this.templateFilter.created = !this.templateFilter.created;
      this.templateFilter.modified = false;
      this.templateFilter.groups = false;
      this.templateFilter.status = false;
      this.templateFilter.isLocked = false;

      this.templateFilter.filterOn = "CreatedAt";
      if (this.templateFilter.created == true)
        this.templateFilter.order = 'asc';
      else
        this.templateFilter.order = 'desc';
    }
    if (type == 'Modified') {
      this.templateFilter.title = false;
      this.templateFilter.created = false;
      this.templateFilter.modified = !this.templateFilter.modified;
      this.templateFilter.groups = false;
      this.templateFilter.status = false;
      this.templateFilter.isLocked = false;

      this.templateFilter.filterOn = "ModifiedAt";
      if (this.templateFilter.modified == true)
        this.templateFilter.order = 'asc';
      else
        this.templateFilter.order = 'desc';
    }
    if (type == 'Groups') {
      this.templateFilter.title = false;
      this.templateFilter.created = false;
      this.templateFilter.modified = false;
      this.templateFilter.groups = !this.templateFilter.groups;
      this.templateFilter.status = false;
      this.templateFilter.isLocked = false;

      this.templateFilter.filterOn = "Groups";
      if (this.templateFilter.groups == true)
        this.templateFilter.order = 'asc';
      else
        this.templateFilter.order = 'desc';
    }
    if (type == 'Status') {
      this.templateFilter.title = false;
      this.templateFilter.created = false;
      this.templateFilter.modified = false;
      this.templateFilter.groups = false;
      this.templateFilter.status = !this.templateFilter.status;
      this.templateFilter.isLocked = false;

      this.templateFilter.filterOn = "TemplateStatus";
      if (this.templateFilter.status == true)
        this.templateFilter.order = 'asc';
      else
        this.templateFilter.order = 'desc';
    }

    if (type == 'IsLocked') {
      this.templateFilter.title = false;
      this.templateFilter.created = false;
      this.templateFilter.modified = false;
      this.templateFilter.groups = false;
      this.templateFilter.status = false;
      this.templateFilter.isLocked = !this.templateFilter.isLocked

      this.templateFilter.filterOn = "IsLocked";
      if (this.templateFilter.isLocked) {
        this.templateFilter.order = 'asc';
      } else {
        this.templateFilter.order = 'desc';
      }
    }

    if (this.accountNumber) {
      this.spinner.show()
      this.templateService.getAllTemplates(this.accountNumber, this.templateFilter).subscribe(res => {
        this.spinner.hide()

        res.Items = res.Items.map(item => {
          return {
            ...item,
            CreatedAt: item.CreatedAt ? moment(item.CreatedAt).format('DD/MM/YYYY \xa0\xa0\xa0 hh:mm a') : '',
            ModifiedAt: item.ModifiedAt ? moment(item.ModifiedAt).format('DD/MM/YYYY \xa0\xa0\xa0 hh:mm a') : ''
          }
        })

        if (res.Items.length > 0) {
          this.allTemplate = res.Items;
          this.totalTemplate = res.Count;
          this.pageNoCalculation();
        }
        else {
          this.allTemplate = [];
          this.totalTemplate = 0;
          this.pageNoCalculation();
        }

        setTimeout(() => {
          this.loadScript();
        }, 1000)
        // this.allTemplate = res.Items;
        // this.totalTemplate = res.Count;
      }, error => {
        this.spinner.hide()
        this.alertService.error(error.Message)
      });
    }
  }

  searchTemplate(value) {
    if (value.length > 0) {
      this.templateFilter.search = value;
      this.getAllTemplate();
    }
    else {
      this.templateFilter.search = "";
      this.getAllTemplate();
    }
  }

  pageNoCalculation() {
    this.numberArray = [];
    let page = this.totalTemplate / this.templateFilter.top;
    let tempPage = page.toFixed();

    if (Number(tempPage) < page) {

      this.exactPage = Number(tempPage) + 1;
      for (let i = 0; i < this.exactPage; i++) {
        this.numberArray.push(this.pageNo);
        this.pageNo++;
      }
      this.pageNo = 1;
    }
    else {
      this.exactPage = Number(tempPage);
      for (let i = 0; i < this.exactPage; i++) {
        this.numberArray.push(this.pageNo);
        this.pageNo++;
      }
      this.pageNo = 1;
    }
  }

  pageNoClick(event, pgNo) {
    this.activePage = pgNo;
    this.templateFilter.skip = this.templateFilter.top * (pgNo - 1);
    this.getAllTemplate();
  }

  leftArrow() {
    if (this.activePage > 1) {
      this.activePage = Number(this.activePage - 1);
      this.templateFilter.skip = this.templateFilter.top * (this.activePage - 1);
      this.getAllTemplate();
    }
  }

  rightArrow() {
    if (this.activePage < this.exactPage) {
      this.activePage = Number(this.activePage);
      this.templateFilter.skip = this.templateFilter.top * (this.activePage);
      this.activePage++;
      this.getAllTemplate();
    }
  }

  createTemplate() {
    let data = {};
    // let reminder = [];
    this.template.AccountId = this.accountNumber
    // reminder[0] = this.template.ReminderDays;
    this.template.Groups = [];

    let fnd = this.activeGroupsArray.find(e => {
      if (e.checked) {
        return e
      }
    })

    if (!fnd) {
      // grops was not checked
    } else {
      for (var i = 0; i < this.activeGroupsArray.length; i++) {
        if (this.activeGroupsArray[i].checked) {
          this.template.Groups.push(this.activeGroupsArray[i].Id)
        }
      }

      // this.template.ReminderDays = reminder;
      this.template['ReminderDays'] = [this.ReminderDay]
      this.templateService.createTemplate(this.template).subscribe(res => {
        if (res.WasSuccessful) {
          this.closeCreatetemplate();
          this.template = { IsLocked: 0, StatusId: 1, ExpirationDays: 0, PropertyMeTypeId: null, PartyTypeId: null, IsLinked: 0 };
          this.ReminderDay = 7;

          this.activeGroupsArray = this.templateGroups
          if (res.Messages.Id) {
            this.editTemplate(res.Messages.Id)
          }
          else {
            this.getAllTemplate();
            this.getSidebarData();
          }
          this.alertService.successPage("Template created successfully")
        } else {
          this.alertService.error(res.Messages.Messages)
        }
      }, error => {
        this.alertService.error(error.Message)
      })
    }
  }

  editTemplate(id) {
    // if (this.propertyMeStatus == false && IsLinked == true) {

    // } else {
      this.router.navigate(['/admin/editTemplate', id]);
    // }

  }

  deleteTemplate() {
    this.spinner.show()
    this.templateService.deleteTemplateById(this.deleteTemplateId).subscribe(res => {
      this.spinner.hide()
      // console.log("delete template response---",res)
      if (res.WasSuccessful) {
        this.deletePopup = false
        this.alertService.successPage(res.Messages ? res.Messages : 'Template deleted successfully')
        this.getAllTemplate()
      } else {
        this.deletePopup = false
        this.alertService.error(res.Messages)
      }
    }, error => {
      this.spinner.hide()
      this.deletePopup = false
      this.alertService.error(error.Message)
    })
  }

  deletePopupChange(id) {
    this.deleteTemplateId = id
    if (id) {
      this.deletePopup = true
    } else {
      this.deletePopup = false
    }

  }

  duplicateTemplate(id) {
    this.spinner.show()
    this.templateService.duplicateTemplateById(id).subscribe(res => {
      this.spinner.hide()
      // console.log("duplicate template response---",res)
      if (res.WasSuccessful) {
        this.alertService.successPage(res.Messages ? res.Messages.Message ? res.Messages.Message : 'Template duplicated successfully' : 'Template duplicated successfully')
        if (res.Messages && res.Messages.Id) {
          this.router.navigate(['/admin/editTemplate', res.Messages.Id]);
        } else {
          this.getAllTemplate()
        }

      } else {
        this.alertService.error(res.Messages)
      }

    }, error => {
      this.spinner.hide()
      this.alertService.error(error.Message)
    })
  }

  //check group validation
  checkGroupValidation() {
    var check = false
    // if(this.template.Groups.length > 0){
    //   var fnd = this.template.Groups.find(e => {
    //     if(e){
    //       return e
    //     }
    //   })

    //   console.log("fnd----",fnd);
    //   if(fnd){
    //     check = true
    //     return check
    //   }else{
    //     return check
    //   }
    // }else{
    //   return check
    // }

    var fnd = this.activeGroupsArray.find(e => {
      if (e.checked) {
        return e
      }
    })

    if (fnd) {
      check = true
      return check
    } else {
      return check
    }
  }

  //Return First Character
  firstCharecter(str) {
    if (str) {
      return String(str).charAt(0)
    } else {
      return null
    }
  }

  selectOption(index) {
    this.clickOffIndex = index + 1;
    for (var i = 0; i < this.allTemplate.length; i++) {
      if (i == index) {
        this.allTemplate[i].dropdown = !this.allTemplate[i].dropdown
      } else {
        this.allTemplate[i].dropdown = false
      }
    }
  }
  onClickedOutside(index) {
    if (this.clickOffIndex) {
      if (index + 1 == this.clickOffIndex) {
        for (var i = 0; i < this.allTemplate.length; i++) {
          if (this.allTemplate[i].dropdown == true) {
            this.allTemplate[i].dropdown = !this.allTemplate[i].dropdown
          }
        }
        this.clickOffIndex = 0;
      }
    }
  }

  // Get Account Details
  getAccount() {
    if (this.accountNumber) {
      this.settings.getAccount(this.accountNumber).subscribe(res => {
        this.companyProfileData = res;
      }, error => {
        this.companyProfileData = {}
      })
    }
  }

  loadScript() {
    $(document).ready(function () {
      // $('span.group').on("mouseenter",function() {
      //   alert("mouseOver");
      //   $('.group-popup').removeClass('open-popup');
      //   $('.group-popup').slideUp('slow');
      //   $(this).parent().find('.group-popup').addClass('open-popup');
      //   // if ($(this).hasClass('g1')) {
      //   //   $(this).addClass('dark-blue-fill');
      //   // }
      //   // else if ($(this).hasClass('g2')) {
      //   //   $(this).toggleClass('light-blue-fill');
      //   // }
      //   // else {
      //   //   $(this).toggleClass('trans-fill');
      //   // }
      //   setTimeout(function() {
      //         $('.group-popup.open-popup').slideDown('slow');
      //     }, 110);
      // })
      // alert("In Load Script")
      $('.group').on('mouseenter', function () {
        $('.group-popup').removeClass('open-popup');
        $('.group-popup').slideUp('fast');
        $(this).parent().find('.group-popup').addClass('open-popup');
        // if ($(this).hasClass('g1')) {
        //   $(this).addClass('dark-blue-fill');
        // }
        // else if ($(this).hasClass('g2')) {
        //   $(this).toggleClass('light-blue-fill');
        // }
        // else {
        //   $(this).toggleClass('trans-fill');
        // }
        this.timeoutId = window.setTimeout(function () {
          $('.group-popup.open-popup').slideDown('fast');
        }, 300);
        // setTimeout(function() {
        //       $('.group-popup.open-popup').slideDown('fast');
        //   }, 110);
      });
      $('td.default-cursor').on('mouseleave', function (e) {
        var container = $(".group").parent();
        // if the target of the click isn't the container nor a descendant of the container
        // if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.group-popup.open-popup').slideUp('fast');
        // }
      });
    });

  }

  toggleSidebar() {
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');
  }

  async getPropertyMeStatus() {
    let allApps: any = await this.getAllApp();
    allApps.forEach(element => {
      if (element.Id == 1) {
        this.propertyMeStatus = element.Active;
      }

      if(element.Active && !this.activeApp){
        this.activeApp = true
      }
    });
  }

  getAllApp() {
    return new Promise((resolve) => {
      this.settings.getAllApps(this.accountNumber, this.propertyFilter).subscribe(res => {
        if (res.Data) {
          resolve(res.Data);
        } else {
          resolve([]);
        }
      }, (error) => {
        resolve([])
      })
    })
  }
}
