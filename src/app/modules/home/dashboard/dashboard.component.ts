import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/data/service/user.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { first } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/service/document.service';
import { TemplateService } from 'src/app/core/service/template.service';
import { PropertyMeService } from 'src/app/core/service/property-me.service';
import { SettingsService } from 'src/app/core/service/settings.service';
import { AlertService } from '../../../core/service/alert.service';
import { Router, Route } from '@angular/router';
import { INgxSelectOption } from 'ngx-select-ex';
import { DatePickerComponent, DatePickerDirective, IDatePickerConfig } from 'ng2-date-picker';
import * as moment from "moment";
import { trigger, transition, style, animate } from '@angular/animations';
import { NgxSpinnerService } from "ngx-spinner";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CONSTANTS } from 'src/common/constants';
declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
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
export class DashboardComponent implements OnInit {
  constant = CONSTANTS;
  cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  selectedCar: number;
  data: any = []
  selectedType = 'draft'
  allDocument: any = []
  selectedDaysId: any = '';
  //----------------new changes---------------

  isLoading: boolean = true;

  companyProfileData: any = {};

  // accountNumber : Number = (<any>window).activeAcountNumber;
  accountNumber: Number = Number(JSON.parse(localStorage.getItem('acccountNumber')))
  sidebarData: any = []
  selectedSidebar = 0;
  advanceDom = false

  // For Flag Object
  mobileFlagEvent


  //-------- Template
  templateData: any = {}

  //
  YY_MM_DD_config: IDatePickerConfig = {
    format: 'YYYY-MM-DD'
  }

  MM_DD_YY_config: IDatePickerConfig = {
    format: 'MM-DD-YYYY'
  }

  DD_MM_YY_config: IDatePickerConfig = {
    format: 'DD-MM-YYYY'
  }

  @ViewChild('dayPicker') datePicker: DatePickerComponent
  open() { this.datePicker.api.open(); }
  close() { this.datePicker.api.close(); }

  // Paginator
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: any;
  public pageSize = 50;
  public currentPage = 0;

  //-------- In Create Document
  sender = ""

  selectedPartyIndex = 0
  selectedTenantIndex = 0
  contactList: any = [];

  tenantLabelExist = false
  ownerLabelExist = false

  clickedNewContact = false

  tempDoc: any = {
    Title: '',
    Property: '',
    LotId: '',
    TenantId:'',
    Tenancy: '',
    SenderId: null,
    QaId: null,
    PropertyAddress: '',
    RentSequence: '',
    ProrataTo: '',
    ManagerName: ''
  }

  createDoc: any = {}

  partyContact: any = {};

  //----set filter to get all users
  allUsersMain: any = []
  allUsers: any = []
  senderUserList: any = []
  filter: any = {
    top: 0,
    skip: 0,
    filterOn: 'CreatedOn',
    order: 'desc',
    Title: false,
    Sender: false,
    Modified: false,
    Recepient: false,
    Status: false,
    Days: false,
    search: "",
    status: ""
  }

  // Property-me List and Tenancy List
  propertyFocus = false;
  propertyMeListMain: any = [];
  propertyMeList: any = [];
  propertyFilter: any = {
    filterOn: 'Id',
    order: 'Asc',
    app_srt: false,
    status_srt: false,
    search: '',
    status: '',
  };

  tenancyFocus = false;
  tenancyListMain: any = [];
  tenancyList: any = [];


  //----------------New changes End---------------------


  drafts: any = [];
  approvals: any = [];
  sents: any = [];
  withdrawns: any = [];
  completeds: any = [];
  expireds: any = [];

  selectedDraft: any

  // create document
  openPage: string = '';
  doc_vis = false;
  create_doc_anim = false;

  // template filter for Select Template
  templateFilter: any = {
    top: 10,
    skip: 0,
    type: 2,
    filterOn: 'CreatedAt',
    order: 'desc',
    title: false,
    created: false,
    modified: false,
    groups: false,
    status: false,
    search: "",
    author: '',
    selectedGroup: ''
  }
  allTemplate: any = [];
  totalTemplate: number;
  numberArray: any = [];
  exactPage: any;
  pageNo: number = 1;
  activePage: any = 1;
  activeGroups: any;
  templateGroups: any = [];
  activeGroupsArray: Array<any> = [];
  searchText = '';
  docListSearchText = '';
  clickOffIndex = 0;
  propertyMe: any;

  allApps : any = [];
  propertyMeDisable = false

  popupView = false
  constructor(
    private alertService: AlertService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private settings: SettingsService,
    private documentService: DocumentService,
    private templateService: TemplateService,
    private propertyMeService: PropertyMeService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    // this.accountNumber = (<any>window).activeAcountNumber;
    setTimeout(() => {
      // this.accountNumber = this.authenticationService.selectedAccountNumberValue

      // this.getSidebarData();
      // this.getDocumentSidebarWise();
      // this.getActiveGroups();
      // this.getAccount();

      this.loadConstructorsFunction();
    }, 300)
  }

  ngOnInit(): void {
    this.getAllConnectedApps();
    this.getAllTemplate();
    this.staticData()
    this.authenticationService.getActiveAccountNumber().subscribe(data => {
      this.getAllConnectedApps();
      this.accountNumber = data
      this.getAllTemplate();
      this.getActiveGroups();

      this.getSidebarData()
      this.getDocumentSidebarWise();

      this.getAccount();
    })

    // this.loadScript();
  }

  loadConstructorsFunction() {
    setTimeout(async () => {
      await this.getSidebarData();

      let routerFullUrl = this.router.url;
      let router_spl = routerFullUrl.split("/")

      let last_routerPath = router_spl[router_spl.length - 1]

      if (last_routerPath == 'All') {
        this.selectedSidebar = 0;
      } else if (last_routerPath == 'Drafts') {
        this.selectedSidebar = 1;
      } else if (last_routerPath == 'Sent') {
        this.selectedSidebar = 2;
      } else if (last_routerPath == 'Withdrawn') {
        this.selectedSidebar = 3;
      } else if (last_routerPath == 'Completed') {
        this.selectedSidebar = 4;
      } else if (last_routerPath == 'Expired') {
        this.selectedSidebar = 5;
      } else if (last_routerPath == 'Approval') {
        this.selectedSidebar = 6;
      } else {
        this.selectedSidebar = 0;
      }

      this.getDocumentSidebarWise();
      this.getActiveGroups();
      this.getAccount();
    }, 300);
  }

  clickAdvance() {
    this.advanceDom = !this.advanceDom;
  }

  editDoucment(document) {

    if (document.Status == "Draft") {
      if(document.IsLinked && this.propertyMeDisable && document.Status) {
        // document not need to open
        this.popupView = true
      } else {
        this.router.navigate(['/admin/editDocument', document.Id]);
      }
    } else {
      this.router.navigate(['/admin/sentDocument', document.Id]);
    }

  }

  click() {
    this.userService.get().subscribe((res) => {
      //console.log(res);
    });
  }
  // detail of document
  documentDetailById() {
    this.spinner.show();
    this.documentService.getDocumentDetailById(this.accountNumber).subscribe(res => {
      this.spinner.hide();
    })
  }

  signOut() {
    this.authenticationService.logout();
  }

  documentChange(type) {
    this.selectedType = type
  }

  docFilterBy(type) {
    for (var key in this.filter) {
      if (typeof (this.filter[key]) == 'boolean' && key !== type) {
        this.filter[key] = false
      }
    }

    this.filter[type] = this.filter[type] ? false : true
    this.filter.filterOn = type

    if (this.filter[type]) {
      this.filter.order = 'asc';
    } else {
      this.filter.order = 'desc';
    }

    this.getDocumentSidebarWise();

  }

  documentSearchTemplate(value) {
    if (value.length > 0) {
      this.filter.search = value
      this.getDocumentSidebarWise();
    } else {
      this.filter.search = ""
      this.getDocumentSidebarWise();
    }
  }

  staticData() {
    this.data = [
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 28,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 30,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 15,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 35,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 17,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 45,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 10,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 55,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 37,
        city: 'Pardi'
      },
      {
        name: 'Soham',
        email: 'test@gmail.com',
        age: 39,
        city: 'Pardi'
      }
    ]

    this.drafts = [
      {
        id: 1,
        title: 'Property agreement xyz 1',
        email: 'adam1.richards@r2s.com',
        modified: '23/05/2020 14:23',
        recipient_email: 'adam1.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status: 'Draft',
        number: null,
        options: false
      },
      {
        id: 2,
        title: 'Property agreement xyz 2',
        email: 'adam2.richards@r2s.com',
        modified: '23/05/2020 14:23',
        recipient_email: 'adam2.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status: 'Sent',
        number: 7,
        options: false
      },
      {
        id: 3,
        title: 'Property agreement xyz 3',
        email: 'adam3.richards@r2s.com',
        modified: '23/05/2020 14:23',
        recipient_email: 'adam2.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status: 'Sent',
        number: 8,
        options: false
      },
      {
        id: 4,
        title: 'Property agreement xyz 4',
        email: 'adam4.richards@r2s.com',
        modified: '23/05/2020 14:23',
        recipient_email: 'adam4.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status: 'Draft',
        number: null,
        options: false
      },
      {
        id: 5,
        title: 'Property agreement xyz 5',
        email: 'adam5.richards@r2s.com',
        modified: '23/05/2020 14:23',
        recipient_email: 'adam5.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status: 'Completed',
        number: null,
        options: false
      }
    ]

  }

  daysHover(id) {
    this.selectedDaysId = id;
  }
  daysMouseLeave() {
    this.selectedDaysId = '';
  }

  selectDraft(id) {
    this.selectedDraft = id
  }

  selectOption(index,document) {
    if(document.Status == "Draft" && document.IsLinked && this.propertyMeDisable){

    }else {
      this.clickOffIndex = index + 1;
      for (var i = 0; i < this.dataSource.length; i++) {
        if (i == index) {
          this.dataSource[index].options = !this.dataSource[index].options
        } else {
          this.dataSource[i].options = false
        }
      }
    }


  }

  onClickedOutside(index) {
    if (this.clickOffIndex) {
      if (index + 1 == this.clickOffIndex) {
        for (var i = 0; i < this.allTemplate.length; i++) {
          if (this.dataSource[index].options == true) {
            this.dataSource[index].options = !this.dataSource[index].options
          }
        }
        this.clickOffIndex = 0;
      }
    }
  }

  addDuplicate(index, draft) {
    var dd: any = {}

    for (const property in draft) {
      dd[property] = draft[property];
    }

    dd.id = this.drafts.length + 1
    dd.options = false

    this.drafts.splice(index + 1, 0, dd)

    // set
    this.drafts[index].options = false

  }

  deleteDraft(index) {
    // this.drafts.splice(index,1)

  }

  // open select Template
  openSelectTemplate() {
    this.openPage = "selectTemplate";
    this.doc_vis = true;
    setTimeout(() => {
      this.loadScript();
    }, 1000)
  }
  // get All template
  async getAllTemplate() {
    let allApps: any = await this.getAllApps();
    allApps.forEach(element => {
      if(element.Id == 1){
          this.propertyMe = element.Active
      }
    })

    if (this.accountNumber) {
      this.templateService.getAllTemplates(this.accountNumber, this.templateFilter).subscribe(res => {
        if(this.propertyMe == false){
          res.Items = res.Items.filter(item => item.IsLinked == false);
        }
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
        // setTimeout(() => {
        //   this.loadScript();
        // },1000)
      }, error => {
        this.alertService.error("Data not Found")
      });
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

  //Return First Character
  firstCharecter(str) {
    if (str) {
      return String(str).charAt(0)
    } else {
      return null
    }
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

      this.templateFilter.filterOn = "Title";
      if (this.templateFilter.title == true)
        this.templateFilter.order = 'asc';
      else
        this.templateFilter.order = 'desc';

    }

    if (this.accountNumber) {
      this.templateService.getAllTemplates(this.accountNumber, this.templateFilter).subscribe(res => {
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

  // get active groups
  getActiveGroups() {
    this.templateService.getActiveGroups(this.accountNumber).subscribe(res => {
      this.activeGroups = res.slice(0);

      var grps = []
      for (var i = 0; i < res.length; i++) {
        if (res[i].Name == 'Default') {
          res[i].checked = false
        } else {
          res[i].checked = false
        }

        grps.push(res[i]);
      }
      this.templateGroups = grps;
      this.activeGroupsArray = grps;
    });
  }

  groupChange(value) {
    if (value !== undefined) {
      this.templateFilter.selectedGroup = value
      this.getAllTemplate();
    }
  }


  loadScript() {
    $(document).ready(function () {
      $('.group').on('mouseenter', function () {
        $('.group-popup').removeClass('open-popup');
        $('.group-popup').slideUp('fast');
        $(this).parent().find('.group-popup').addClass('open-popup');
        // setTimeout(function() {
        //       $('.group-popup.open-popup').slideDown('fast');
        //   }, 110);
        this.timeoutId = window.setTimeout(function () {
          $('.group-popup.open-popup').slideDown('fast');
        }, 300);
      });
      $('td.groud_td').on('mouseleave', function (e) {
        var container = $(".group").parent();
        // if the target of the click isn't the container nor a descendant of the container
        // if (!container.is(e.target) && container.has(e.target).length === 0) {
        //     $('.group-popup.open-popup').slideUp('fast');
        // }
        $('.group-popup.open-popup').slideUp('fast');
      });
    });
    setTimeout(() => {
      $(document).ready(() => {
        $(document).mouseup(function (e) {
          var container = $(".info-popup-sm");
          // if the target of the click isn't the container nor a descendant of the container
          if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
          }
        });
        $('.acc-expand').click(function (e) {
          e.preventDefault();
          var $this = $(this);
          if ($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.next().slideUp(350);
            $this.removeClass('open');
          } else {
            $('.acc-expand').removeClass('open');
            $('.acc-child').slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideDown(350);
            $this.addClass('open');
          }
        })
      })
    }, 100)
  }

  //----------------------------------------------------------------------
  //------------------------------ New coding ----------------------------
  //----------------------------------------------------------------------

  // Set sidebar selected value
  setDisplay(status, statusName) {

    if (this.selectedSidebar !== status) {
      this.selectedSidebar = status, status;
      this.router.navigate(['/admin/home/', statusName]);
      this.filter.search = '';
      this.searchText = '';
      this.getDocumentSidebarWise();
    }
  }

  getSidebarData() {
    this.documentService.getDocSidebarData(this.accountNumber).subscribe(res => {
      this.sidebarData = res;
    }, error => {
      this.alertService.error(error)
    })
  }

  getDocumentSidebarWise() {
    // this.spinner.show();
    this.isLoading = true
    this.documentService.getDocumentsSideWise(this.accountNumber, this.selectedSidebar, this.filter).subscribe(res => {
      // this.spinner.hide();
      this.isLoading = false
      res.Items = res.Items.map(item => {
        return {
          ...item,
          Modified: item.Modified ? moment(item.Modified).format('DD/MM/YYYY') : '',
          RecepientDate: item.RecepientDate ? moment(item.RecepientDate).format('DD/MM/YYYY \xa0\xa0\xa0 hh:mm a') : '',
          CreatedOn: item.CreatedOn ? moment(item.CreatedOn).format('DD/MM/YYYY \xa0\xa0\xa0 hh:mm a') : '',
        }
      })
      this.allDocument = res.Items;
      // public pageSize = 5;
      this.currentPage = 0;
      this.dataSource = new MatTableDataSource<Element>(this.allDocument);
      this.dataSource.paginator = this.paginator;
      this.iterator();
    }, error => {
      // this.spinner.hide();
      this.isLoading = false
    })
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
    const part = this.allDocument.slice(start, end);
    this.dataSource = part;
  }

  deleteDocument(id) {
    this.spinner.show();
    this.documentService.deleteDocument(id).subscribe(res => {
      this.getDocumentSidebarWise();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.alertService.error(error);
    })
  }

  addDuplicateDocument(id) {
    this.spinner.show();
    this.documentService.duplicateDocument(id).subscribe(res => {
      this.spinner.hide();
      this.getDocumentSidebarWise();
    }, error => {
      this.spinner.hide();
      this.alertService.error(error);
    })
  }

  //--------------Create Document Section
  openPageChange(page_name) {
    this.openPage = page_name;
  }
  // open select Template
  openSelectDocument() {
    this.openPage = "createDocument";
    this.create_doc_anim = true;
  }

  closePageChange() {
    this.doc_vis = false;
    this.searchText = ""
    setTimeout(() => {
      this.openPage = "";
    }, 300);
    this.searchTemplate("");
  }

  closeCreateDocPage(page_name) {
    this.create_doc_anim = false;
    this.doc_vis = false;
    setTimeout(() => {
      // this.openPage = page_name;
      this.openPage = "";
    }, 300);
    this.searchText = ""
    this.searchTemplate("");
  }

  setPartyIndex(index, partyName) {
    this.selectedPartyIndex = index;

    if (index) {
      let partyContact = this.createDoc[partyName + '-details']

      setTimeout(() => {
        if (this.mobileFlagEvent && partyContact.CountryCode) {
          this.mobileFlagEvent.setCountry(partyContact.CountryCode);
        }
      }, 300);
    }
  }

  senderRefreshValue(event) {

  }

  senderSelected(event) {

  }

  senderRemoved(event) {

  }

  senderTyped(event) {

  }

  senderSelectionChanges(event: INgxSelectOption[]) {
    // this.sender = String(event[0].value)
    // console.log("this sender---",this.sender);
    // let senderIndex = this.allUsers.indexOf(this.sender)
    // console.log("Sender Index----",senderIndex);
  }

  //---
  partyFocusIn(index) {
    this.templateData.TemplateParties[index]['focus'] = true

    let partyName = this.templateData.TemplateParties[index].PartyName;
    if (this.createDoc[partyName + '-details']?.detailAdded) {
      this.selectedPartyIndex = index + 1;
    }
  }

  partyFocusOut(index) {
    // this.templateData.TemplateParties[index]['focus'] = false
    this.searchText = '';
    setTimeout(() => {
      this.templateData.TemplateParties[index]['focus'] = false;
    }, 500)
  }

  // propertyMe
  propertyFocusIn() {
    this.propertyFocus = true;
  }

  propertyFocusOut() {
    setTimeout(() => {
      this.propertyFocus = false;
    }, 500);
  }

  searchPropertyMe(value) {
    if (value) {
      this.createDoc.propertyEnterName = value;

      this.propertyMeList = this.propertyMeListMain.filter(x =>
        // x.FirstName.trim().toLowerCase().includes(value.trim().toLowerCase()) || x.LastName.trim().toLowerCase().includes(value.trim().toLowerCase()) || x.Email.trim().toLowerCase().includes(value.trim().toLowerCase())
        x.AddressText.trim().toLowerCase().includes(value.trim().toLowerCase())
      )
    } else {
      this.createDoc.propertyEnterName = "";

      this.createDoc.Property = ""
      this.createDoc.Tenancy = ""
      this.propertyMeList = []

      this.tenancyListMain = [];
      this.tenancyList = [];
    }
  }

  async setProperty(property) {

    this.createDoc.Property = property.AddressText
    this.createDoc.LotId = property.Id

    var ids = ""

    if (property.OwnerContactId && property.BuyerContactId) {
      ids = property.OwnerContactId + "," + property.BuyerContactId;
    } else if (property.OwnerContactId) {
      ids = property.OwnerContactId;
    } else if (property.BuyerContactId) {
      ids = property.BuyerContactId;
    }

    if (this.createDoc.PartyTypeId == this.constant.PartyTypeId_Rentals || this.createDoc.PartyTypeId == this.constant.PartyTypeId_Rentals_Tenant) {
      this.getTenancyList(property.Id);
    }

    // if(ids){
    //   this.getPropertyMeContacts(ids);
    // }

    if (property.OwnerContactId) {
      var ownerOrSallerContacts = await this.fetchPropertyMeContacts(property.OwnerContactId)
      var ownerOrSallerList = []
      // this check for owner / sales
      if (this.createDoc.PartyTypeId == this.constant.PartyTypeId_Rentals || this.createDoc.PartyTypeId == this.constant.PartyTypeId_Rentals_Owner) {
        ownerOrSallerList = this.templateData.TemplateParties.filter(owner => {
          if (owner.PartyTypeId == this.constant.PartyTypeId_Rentals_Owner) {
            return owner
          }
        });
      }

      if (this.createDoc.PartyTypeId == this.constant.PartyTypeId_Sales || this.createDoc.PartyTypeId == this.constant.PartyTypeId_Sales_Seller) {
        ownerOrSallerList = this.templateData.TemplateParties.filter(seller => {
          if (seller.PartyTypeId == this.constant.PartyTypeId_Sales_Seller) {
            return seller
          }
        });
      }

      for (let i = 0; i < ownerOrSallerList.length; i++) {
        if (ownerOrSallerContacts[i]) {
          let nwContact = {
            FirstName: ownerOrSallerContacts[i].FirstName ? ownerOrSallerContacts[i].FirstName : '',
            LastName: ownerOrSallerContacts[i].LastName ? ownerOrSallerContacts[i].LastName : '',
            Email: ownerOrSallerContacts[i].Email ? ownerOrSallerContacts[i].Email : '',
            CountryCode: ownerOrSallerContacts[i].CountryCode ? ownerOrSallerContacts[i].CountryCode : 'au',
            Phone: ownerOrSallerContacts[i].CellPhone ? ownerOrSallerContacts[i].CellPhone : '',
            Position: ownerOrSallerContacts[i].Position ? ownerOrSallerContacts[i].Position : '',
            Company: ownerOrSallerContacts[i].CompanyName ? ownerOrSallerContacts[i].CompanyName : '',
            detailAdded: true,
            PhoneRequired: false,
            PropertyMeContactId: ownerOrSallerContacts[i].Id,
            HomePhone: ownerOrSallerContacts[i].HomePhone ? ownerOrSallerContacts[i].HomePhone : '',
            WorkPhone: ownerOrSallerContacts[i].WorkPhone ? ownerOrSallerContacts[i].WorkPhone : '',
            PhysicalAddress: ownerOrSallerContacts[i].PhysicalAddress ? ownerOrSallerContacts[i].PhysicalAddress.Text ? ownerOrSallerContacts[i].PhysicalAddress.Text : '' : '',
            PostalAddress: ownerOrSallerContacts[i].PostalAddress ? ownerOrSallerContacts[i].PostalAddress.Text ? ownerOrSallerContacts[i].PostalAddress.Text : '' : '',
            ContactId: 0
          }

          if(this.createDoc[ownerOrSallerList[i].PartyName + '-details'].PhoneRequired){
            nwContact.PhoneRequired = true
          } else {
            nwContact.PhoneRequired = false
          }

          if (ownerOrSallerContacts[i].FirstName && ownerOrSallerContacts[i].LastName && ownerOrSallerContacts[i].Email && (nwContact.PhoneRequired && ownerOrSallerContacts[i].CellPhone || !nwContact.PhoneRequired)) {
            this.createDoc[ownerOrSallerList[i].PartyName] = ownerOrSallerContacts[i].FirstName + ' ' + ownerOrSallerContacts[i].LastName;

            this.createDoc[ownerOrSallerList[i].PartyName + '-details'] = nwContact;

            // Add First and Last name in Document title Of First Recipient.
            this.updateTitleWhenFirstRecipientSelect(ownerOrSallerList[i].Order, nwContact, true);
          }
        }
      }


    }

    if (property.BuyerContactId) {
      var buyerContacts = await this.fetchPropertyMeContacts(property.BuyerContactId);
      var buyerList = this.templateData.TemplateParties.filter(buyer => {
        if (buyer.PartyTypeId == this.constant.PartyTypeId_Sales_Buyer) {
          return buyer
        }
      });

      for (let j = 0; j < buyerList.length; j++) {
        if (buyerContacts[j]) {
          let nwContact = {
            FirstName: buyerContacts[j].FirstName ? buyerContacts[j].FirstName : '',
            LastName: buyerContacts[j].LastName ? buyerContacts[j].LastName : '',
            Email: buyerContacts[j].Email ? buyerContacts[j].Email : '',
            CountryCode: buyerContacts[j].CountryCode ? buyerContacts[j].CountryCode : 'au',
            Phone: buyerContacts[j].CellPhone ? buyerContacts[j].CellPhone : '',
            Position: buyerContacts[j].Position ? buyerContacts[j].Position : '',
            Company: buyerContacts[j].CompanyName ? buyerContacts[j].CompanyName : '',
            detailAdded: true,
            PhoneRequired: false,
            PropertyMeContactId: buyerContacts[j].Id,
            HomePhone: buyerContacts[j].HomePhone ? buyerContacts[j].HomePhone : '',
            WorkPhone: buyerContacts[j].WorkPhone ? buyerContacts[j].WorkPhone : '',
            PhysicalAddress: buyerContacts[j].PhysicalAddress ? buyerContacts[j].PhysicalAddress.Text ? buyerContacts[j].PhysicalAddress.Text : '' : '',
            PostalAddress: buyerContacts[j].PostalAddress ? buyerContacts[j].PostalAddress.Text ? buyerContacts[j].PostalAddress.Text : '' : '',
            ContactId : 0
          }

          if(this.createDoc[buyerList[j].PartyName + '-details'].PhoneRequired){
            nwContact.PhoneRequired = true
          } else {
            nwContact.PhoneRequired = false
          }

          if (buyerContacts[j].FirstName && buyerContacts[j].LastName && buyerContacts[j].Email && (nwContact.PhoneRequired && buyerContacts[j].CellPhone || !nwContact.PhoneRequired)) {
            this.createDoc[buyerList[j].PartyName] = buyerContacts[j].FirstName + ' ' + buyerContacts[j].LastName;

            this.createDoc[buyerList[j].PartyName + '-details'] = nwContact;

            // Add First and Last name in Document title Of First Recipient.
            this.updateTitleWhenFirstRecipientSelect(buyerList[j].Order, nwContact, true);
          }
        }
      }
    }

    this.propertyMeList = [];
  }

  // tenancy

  tenancyFocusIn() {
    this.tenancyFocus = true;
  }

  tenancyFocusOut() {
    setTimeout(() => {
      this.tenancyFocus = false;
    }, 500);
  }

  searchTenancy(value) {

    if(!value){
      this.createDoc.tenancyEnterName = "";
      this.tenancyList = this.tenancyListMain
    } else {
      var searchTenancyList = this.tenancyListMain.filter(x =>
        x.Label.trim().toLowerCase().includes(value.trim().toLowerCase())
      )

      this.tenancyList = [...new Set([...searchTenancyList,...this.tenancyListMain])]
    }
  }

  async setTenancy(tenancy) {
    this.createDoc.Tenancy = tenancy.Label
    this.createDoc.TenantId = tenancy.ContactId

    var tenantContacts = await this.fetchPropertyMeContacts(tenancy.ContactId);

    var tenantList = this.templateData.TemplateParties.filter(tenant => {
      if (tenant.PartyTypeId == this.constant.PartyTypeId_Rentals_Tenant) {
        return tenant
      }
    });

    for (let i = 0; i < tenantList.length; i++) {
      if (tenantContacts[i]) {
        let nwContact = {
          FirstName: tenantContacts[i].FirstName ? tenantContacts[i].FirstName : '',
          LastName: tenantContacts[i].LastName ? tenantContacts[i].LastName : '',
          Email: tenantContacts[i].Email ? tenantContacts[i].Email : '',
          CountryCode: tenantContacts[i].CountryCode ? tenantContacts[i].CountryCode : 'au',
          Phone: tenantContacts[i].CellPhone ? tenantContacts[i].CellPhone : '',
          Position: tenantContacts[i].Position ? tenantContacts[i].Position : '',
          Company: tenantContacts[i].CompanyName ? tenantContacts[i].CompanyName : '',
          detailAdded: true,
          PhoneRequired: false,
          PropertyMeContactId: tenantContacts[i].Id,
          HomePhone: tenantContacts[i].HomePhone ? tenantContacts[i].HomePhone : '',
          WorkPhone: tenantContacts[i].WorkPhone ? tenantContacts[i].WorkPhone : '',
          PhysicalAddress: tenantContacts[i].PhysicalAddress ? tenantContacts[i].PhysicalAddress.Text ? tenantContacts[i].PhysicalAddress.Text : '' : '',
          PostalAddress: tenantContacts[i].PostalAddress ? tenantContacts[i].PostalAddress.Text ? tenantContacts[i].PostalAddress.Text : '' : '',
          ContactId : 0
        }

        if(this.createDoc[tenantList[i].PartyName + '-details'].PhoneRequired){
          nwContact.PhoneRequired = true
        } else {
          nwContact.PhoneRequired = false
        }

        // if (tenantContacts[i].FirstName && tenantContacts[i].LastName && tenantContacts[i].Email && tenantContacts[i].CellPhone) {
        if (tenantContacts[i].FirstName && tenantContacts[i].LastName && tenantContacts[i].Email && (nwContact.PhoneRequired && tenantContacts[i].CellPhone || !nwContact.PhoneRequired)) {
          this.createDoc[tenantList[i].PartyName] = tenantContacts[i].FirstName + ' ' + tenantContacts[i].LastName;

          this.createDoc[tenantList[i].PartyName + '-details'] = nwContact;

          // Add First and Last name in Document title Of First Recipient.
          this.updateTitleWhenFirstRecipientSelect(tenantList[i].Order, nwContact, true);
        }
      }
    }

    this.tenancyList = [];
  }

  getTenancyList(id) {
    this.spinner.show();
    this.propertyMeService.tenancyPropertyMe(this.accountNumber, id).subscribe(tenancy_list => {
      this.spinner.hide();
      this.tenancyListMain = tenancy_list
      this.tenancyList = tenancy_list;
    }, error => {
      this.spinner.hide();
    })
  }

  // getPropertyMeContacts(ids){
  //   this.propertyMeService.contactsPropertyMe(this.accountNumber,ids).subscribe(async contacts_list => {
  //     console.log("PropertyMe Contact List----",contacts_list);

  //     let ownerContacts = [];
  //     let buyerContacts = [];

  //     for (var i = 0; i < contacts_list.length; i++) {
  //       if (i == 0 && contacts_list[i].ContactPersons) {
  //         ownerContacts = contacts_list[i].ContactPersons;
  //       }

  //       if (i == 1 && contacts_list[i].ContactPersons) {
  //         buyerContacts = contacts_list[i].ContactPersons
  //       }
  //     }

  //     console.log("ownerContacts:-:-:----",ownerContacts);
  //     console.log("buyerContacts:-:-:----",buyerContacts);

  //     if(this.createDoc.PropertyMeTypeId == 4) {
  //       let ownerList = this.templateData.TemplateParties.filter(owner => {
  //         if(owner.PartyTypeId == 13){
  //           return owner
  //         }
  //       });

  //       let tenantList = this.templateData.TemplateParties.filter(tenant => {
  //         if(tenant.PartyTypeId == 14){
  //           return tenant
  //         }
  //       });

  //       // let owner_length = prop_length > 1 ? Math.ceil(prop_length/2) : prop_length;
  //       // let tenant_length = prop_length > 1 ? (prop_length - owner_length) : 0;
  //       // console.log("prop_length:-:-:---", prop_length);

  //       console.log("ownerList:-:-:----",ownerList);
  //       console.log("tenantList:-:-:----",tenantList)

  //       for (let i = 0; i < ownerList.length; i++) {
  //         if (ownerContacts[i]) {
  //           let nwContact = {
  //             FirstName: ownerContacts[i].FirstName ? ownerContacts[i].FirstName : '',
  //             LastName : ownerContacts[i].LastName ? ownerContacts[i].LastName : '',
  //             Email : ownerContacts[i].Email ? ownerContacts[i].Email : '',
  //             CountryCode: ownerContacts[i].CountryCode ? ownerContacts[i].CountryCode : 'au',
  //             Phone : ownerContacts[i].CellPhone ? ownerContacts[i].CellPhone : '',
  //             Position : ownerContacts[i].Position ? ownerContacts[i].Position : '',
  //             Company : ownerContacts[i].CompanyName ? ownerContacts[i].CompanyName : '',
  //             detailAdded : true
  //           }

  //           if (ownerContacts[i].FirstName && ownerContacts[i].LastName && ownerContacts[i].Email && ownerContacts[i].CellPhone) {
  //             this.createDoc[ownerList[i].PartyName] = ownerContacts[i].FirstName + ' ' + ownerContacts[i].LastName;

  //             this.createDoc[ownerList[i].PartyName+'-details'] = nwContact;

  //             // Add First and Last name in Document title Of First Recipient.
  //             this.updateTitleWhenFirstRecipientSelect(ownerList[i].Order, nwContact, true);
  //           }
  //         }
  //       }

  //       for (let i = 0; i < tenantList.length; i++) {
  //         if (buyerContacts[i]) {
  //           let nwContact = {
  //             FirstName: buyerContacts[i].FirstName ? buyerContacts[i].FirstName : '',
  //             LastName : buyerContacts[i].LastName ? buyerContacts[i].LastName : '',
  //             Email : buyerContacts[i].Email ? buyerContacts[i].Email : '',
  //             CountryCode: buyerContacts[i].CountryCode ? buyerContacts[i].CountryCode : 'au',
  //             Phone : buyerContacts[i].CellPhone ? buyerContacts[i].CellPhone : '',
  //             Position : buyerContacts[i].Position ? buyerContacts[i].Position : '',
  //             Company : buyerContacts[i].CompanyName ? buyerContacts[i].CompanyName : '',
  //             detailAdded : true
  //           }

  //           if (buyerContacts[i].FirstName && buyerContacts[i].LastName && buyerContacts[i].Email && buyerContacts[i].CellPhone) {
  //             this.createDoc[tenantList[i].PartyName] = buyerContacts[i].FirstName + ' ' + buyerContacts[i].LastName;

  //             this.createDoc[tenantList[i].PartyName+'-details'] = nwContact;

  //             if(ownerList.length == 0){
  //               // Add First and Last name in Document title Of First Recipient.
  //               this.updateTitleWhenFirstRecipientSelect(tenantList[i].Order, nwContact, true);
  //             }
  //           }

  //         }
  //       }
  //     }

  //     if(this.createDoc.PropertyMeTypeId == 6) {
  //       let buyerList = this.templateData.TemplateParties.filter(owner => {
  //         if(owner.PartyTypeId == 16){
  //           return owner
  //         }
  //       });

  //       let sellerList = this.templateData.TemplateParties.filter(tenant => {
  //         if(tenant.PartyTypeId == 17){
  //           return tenant
  //         }
  //       });

  //       console.log("buyerList:-:-:----",buyerList);
  //       console.log("sellerList:-:-:----",sellerList);

  //       for (let i = 0; i < buyerList.length; i++) {
  //         if (ownerContacts[i]) {
  //           let nwContact = {
  //             FirstName: ownerContacts[i].FirstName ? ownerContacts[i].FirstName : '',
  //             LastName : ownerContacts[i].LastName ? ownerContacts[i].LastName : '',
  //             Email : ownerContacts[i].Email ? ownerContacts[i].Email : '',
  //             CountryCode: ownerContacts[i].CountryCode ? ownerContacts[i].CountryCode : 'au',
  //             Phone : ownerContacts[i].CellPhone ? ownerContacts[i].CellPhone : '',
  //             Position : ownerContacts[i].Position ? ownerContacts[i].Position : '',
  //             Company : ownerContacts[i].CompanyName ? ownerContacts[i].CompanyName : '',
  //             detailAdded : true
  //           }

  //           if (ownerContacts[i].FirstName && ownerContacts[i].LastName && ownerContacts[i].Email && ownerContacts[i].CellPhone) {
  //             this.createDoc[buyerList[i].PartyName] = ownerContacts[i].FirstName + ' ' + ownerContacts[i].LastName;

  //             this.createDoc[buyerList[i].PartyName+'-details'] = nwContact;

  //             // Add First and Last name in Document title Of First Recipient.
  //             this.updateTitleWhenFirstRecipientSelect(buyerList[i].Order, nwContact, true);

  //           }
  //         }
  //       }

  //       for (let i = 0; i < sellerList.length; i++) {
  //         if (buyerContacts[i]) {
  //           let nwContact = {
  //             FirstName: buyerContacts[i].FirstName ? buyerContacts[i].FirstName : '',
  //             LastName : buyerContacts[i].LastName ? buyerContacts[i].LastName : '',
  //             Email : buyerContacts[i].Email ? buyerContacts[i].Email : '',
  //             CountryCode: buyerContacts[i].CountryCode ? buyerContacts[i].CountryCode : 'au',
  //             Phone : buyerContacts[i].CellPhone ? buyerContacts[i].CellPhone : '',
  //             Position : buyerContacts[i].Position ? buyerContacts[i].Position : '',
  //             Company : buyerContacts[i].CompanyName ? buyerContacts[i].CompanyName : '',
  //             detailAdded : true
  //           }

  //           if (buyerContacts[i].FirstName && buyerContacts[i].LastName && buyerContacts[i].Email && buyerContacts[i].CellPhone) {
  //             this.createDoc[sellerList[i].PartyName] = buyerContacts[i].FirstName + ' ' + buyerContacts[i].LastName;

  //             this.createDoc[sellerList[i].PartyName+'-details'] = nwContact;

  //             if(buyerList.length == 0){
  //               // Add First and Last name in Document title Of First Recipient.
  //               this.updateTitleWhenFirstRecipientSelect(sellerList[i].Order, nwContact, true);
  //             }
  //           }
  //         }
  //       }
  //     }


  //   },error => {

  //   })
  // }

  fetchPropertyMeContacts(id) {
    return new Promise((resolve) => {
      this.propertyMeService.contactsPropertyMe(this.accountNumber, id).subscribe(async contacts_list => {
        resolve(contacts_list[0].ContactPersons)
      }, error => {
        resolve([])
      })
    })
  }

  changePartyName(value, index, partyName) {
    this.templateData.TemplateParties[index]['EnterName'] = value

    if (value.length > 2) {
      this.getContacts(value);
    }
    else {
      this.contactList = [];

      if (!value) {
        // text box clean update clear partyData
        this.clearPartyData(index, partyName)
      }
    }
  }

  changeApprover(value, index, partyName) {
    if (!value) {
      this.allUsers = this.allUsersMain

      // text box clean update clear partyData
      this.clearPartyData(index, partyName);
    } else {
      let activeUser = [];
      this.allUsersMain.forEach(element => {
        if (element.UserStatus == "Active") {
          element.FullName = element.FirstName.concat(" ",element.LastName);
          activeUser.push(element);
        }
      });
      var searchUsers = activeUser.filter(x =>
        x.FirstName.trim().toLowerCase().includes(value.trim().toLowerCase()) || x.LastName.trim().toLowerCase().includes(value.trim().toLowerCase()) || x.Email.trim().toLowerCase().includes(value.trim().toLowerCase()) || x.FullName.trim().toLowerCase().includes(value.trim().toLowerCase())
      )

      // this.allUsers = searchUsers.concat(activeUser);
      this.allUsers = [...new Set([...searchUsers,...activeUser])]

    }
  }

  checkOwnerTenantValidation(partyName) {
    let detailForm = this.createDoc[partyName + '-details']
    if (detailForm.FirstName && detailForm.LastName && detailForm.Email) {
      return true
    } else {
      return false
    }
  }

  changeCustomCheckValue(partyName, customFieldName, checkedValue, checkBoxName) {
    var checkedList = JSON.parse(this.createDoc[partyName + '-' + customFieldName]);

    if (checkedValue) {
      checkedList.push(checkBoxName);
      this.createDoc[partyName + '-' + customFieldName] = JSON.stringify(checkedList)
    } else {
      let existIndex = checkedList.findIndex(x => x == checkBoxName)
      checkedList.splice(existIndex, 1);
      this.createDoc[partyName + '-' + customFieldName] = JSON.stringify(checkedList)
    }
  }

  checkCheckBoxExist(partyName, customFieldName, checkBoxName) {
    if(this.createDoc[partyName + '-' + customFieldName]){
      const checkedList = JSON.parse(this.createDoc[partyName + '-' + customFieldName]);

      var checkExist = checkedList.find(x => {
        if (x == checkBoxName) {
          return x;
        }
      });

      return checkExist ? true : false;
    } else {
      return false
    }

  }

  nextEdit() {
    // console.log("Create Data value---",this.createDoc)
    // let setDocData = {
    //   name : 'soham 1',
    //   date : Date.now()
    // }

    // // console.log("Set Request----",setDocData);
    // this.documentService.docData = setDocData;
    this.templateData.TemplateParties

    var formValid = true

    let latestDoc = {
      TemplateId: this.createDoc.TemplateId,
      AccountId: this.accountNumber,
      Title: this.createDoc.Title,
      Property: this.createDoc.Property,
      LotId: this.createDoc.LotId,
      TenantId: this.createDoc.TenantId,
      Groups: this.createDoc.Groups,
      Tenancy: this.createDoc.Tenancy,
      PartyTypeId: this.templateData.PartyTypeId,
      PropertyMeTypeId: this.templateData.PropertyMeTypeId,
      IsLinked: this.createDoc.IsLinked,
      ExpiryDays: this.templateData.ExpirationDays,
      Reminders: this.templateData.ReminderDays,
      Content: this.templateData.Content,
      Attachments: this.templateData.Attachments,
      EmailBuilder: this.templateData.EmailBuilder,
      Sections: [],
      Parties: []
    }

    for (var i = 0; i < this.templateData.TemplateParties.length; i++) {
      // let party = this.templateData.TemplateParties[i]
      let PartyFields = this.templateData.TemplateParties[i].PartyFields
      let TemplateFields = this.templateData.TemplateParties[i].TemplateFields

      for (var j = 0; j < this.templateData.TemplateParties[i].TemplateCustomFields.length; j++) {
        if (this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-${this.templateData.TemplateParties[i].TemplateCustomFields[j].Name}`]) {
          this.templateData.TemplateParties[i].TemplateCustomFields[j].Value = this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-${this.templateData.TemplateParties[i].TemplateCustomFields[j].Name}`]
        }
      }

      let TemplateCustomFields = this.templateData.TemplateParties[i].TemplateCustomFields

      let party = this.templateData.TemplateParties[i]
      delete party.PartyFields
      delete party.TemplateFields
      delete party.TemplateCustomFields

      party.Fields = []
      party.CustomFields = TemplateCustomFields
      party.DocumentPartyContact = []
      if (this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-details`]) {
        party.DocumentPartyContact.push(this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-details`]);
      }

      latestDoc.Parties.push(party)

      if(this.templateData.TemplateParties[i].Mandatory && !this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-details`].detailAdded){
        formValid = false
      }
    }

    for (var j = 0; j < this.templateData.TemplateSections.length; j++) {
      let section = {
        EnableBulleting: this.templateData.TemplateSections[j].EnableBulleting,
        Id: this.templateData.TemplateSections[j].Id,
        Name: this.templateData.TemplateSections[j].Name,
        Clauses: this.templateData.TemplateSections[j].TemplateClauses,
        UUID: this.templateData.TemplateSections[j].UUID,
        IsAdded: this.templateData.TemplateSections[j].IsAdded,
        Index: this.templateData.TemplateSections[j].Index
      }
      latestDoc.Sections.push(section);
    }

    if(!formValid){
      this.alertService.error("Invalid Form !!")
    } else {
      this.documentService.docData = latestDoc;

      this.router.navigate(['/admin/editDocument', 'create']);
    }
  }

  detailChange() {

  }

  partyDetailForm(partyName, index) {

    if (this.clickedNewContact) {
      let partyDetail = this.createDoc[partyName + '-details']
      partyDetail.Accountid = this.accountNumber
      this.spinner.show()
      this.documentService.createContact(partyDetail).subscribe(res => {
        this.spinner.hide()

        // this.documentData.Parties[this.selectedPartyIndex-1].UserId= contact.Id
        this.createDoc[partyName + '-details'].detailAdded = true
        this.createDoc[partyName] = partyDetail.FirstName + ' ' + partyDetail.LastName;

        this.alertService.successPage(res.Messages)

        this.selectedPartyIndex = 0
        this.clickedNewContact = false

        // Add First and Last name in Document title Of First Recipient.
        this.updateTitleWhenFirstRecipientSelect(index, partyDetail, false);
      }, error => {
        this.spinner.hide()
        this.alertService.error(error.Messages)
      })
    } else {
      let partyData = this.createDoc[partyName + '-details']
      partyData.AccountId = this.accountNumber
      partyData['Id'] = this.templateData.TemplateParties[this.selectedPartyIndex - 1].UserId
      this.documentService.updateContact(partyData).subscribe(res => {
        this.createDoc[partyName + '-details'].detailAdded = true
        this.createDoc[partyName] = partyData.FirstName + ' ' + partyData.LastName;
        this.selectedPartyIndex = 0

        // Add First and Last name in Document title Of First Recipient.
        this.updateTitleWhenFirstRecipientSelect(index, partyData, false);
      },error => {
        this.alertService.error(error.Messages);
      })


    }
  }

  //----- Get Template data by template id
  getTemplateDetail(Id) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.createDoc = {};
    this.templateService.getTemplateById(Id).subscribe(res => {
      // this.spinner.hide();
      // this.templateData = res

      // Set In Order
      let partys = res.TemplateParties.sort((a, b) => {
        if (a.Order > b.Order) {
          return 1;
        } else if (a.Order < b.Order) {
          return -1;
        } else {
          return 0;
        }
      })

      res.TemplateParties = partys

      this.templateData = res

      //Get Users
      this.getAllUsers('');

      // this.createDoc = this.tempDoc;
      this.createDoc = {
        TemplateId: Id,
        Title: this.templateData.Title,
        Property: '',
        LotId: '',
        TenantId: '',
        propertyEnterName: '',
        Tenancy: '',
        tenancyEnterName: '',
        Groups: this.templateData.Groups,
        PartyTypeId: this.templateData.PartyTypeId,
        PropertyMeTypeId: this.templateData.PropertyMeTypeId,
        IsLinked: this.templateData.IsLinked ? true : false
      }
      for (let i = 0; i < this.templateData.TemplateParties.length; i++) {
        this.createDoc[this.templateData.TemplateParties[i].PartyName] = ""

        // if(this.templateData.TemplateParties[i].PartyName == 'Owner 1'){
        //   this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-details`] ="";
        // }

        if (this.templateData.TemplateParties[i].PartyTypeId == 14) {
          this.tenantLabelExist = true
        }

        if (this.templateData.TemplateParties[i].PartyTypeId == 13) {
          this.ownerLabelExist = true

          // this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-details`] = {
          //   FirstName:'',
          //   LastName : '',
          //   Email : '',
          //   Phone : '',
          //   Position : '',
          //   Company : ''
          // };
        }

        this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-details`] = {
          FirstName: '',
          LastName: '',
          Email: '',
          CountryCode: 'au',
          Phone: '',
          Position: '',
          Company: '',
          detailAdded: false,
          PhoneRequired: this.templateData.TemplateParties[i].SMSVerificationRequired ? true : false,
          PropertyMeContactId: null,
          HomePhone: '',
          WorkPhone: '',
          PhysicalAddress: '',
          PostalAddress: '',
          ContactId: 0
        };

        if (this.templateData.TemplateParties[i].HasSignature) {
          this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-details`].Signature = ""
        }

        for (var j = 0; j < this.templateData.TemplateParties[i].TemplateCustomFields.length; j++) {

          if (this.templateData.TemplateParties[i].TemplateCustomFields[j].FieldTypeId == this.constant.CheckboxFieldTypeId) {
            this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-${this.templateData.TemplateParties[i].TemplateCustomFields[j].Name}`] = "[]"
          } else {
            this.createDoc[`${this.templateData.TemplateParties[i].PartyName}-${this.templateData.TemplateParties[i].TemplateCustomFields[j].Name}`] = ""
          }
        }
      }

      if (this.templateData.PropertyMeTypeId && this.templateData.PropertyMeTypeId == this.constant.PropertyMeTypeId_Rentals) {
        this.propertyMeService.rentalPropertyMe(this.accountNumber).subscribe(rental_res => {
          this.propertyMeListMain = rental_res;
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
        })
      }

      if (this.templateData.PropertyMeTypeId && this.templateData.PropertyMeTypeId == this.constant.PropertyMeTypeId_Sales) {
        this.propertyMeService.salerPropertyMe(this.accountNumber).subscribe(seller_res => {
          this.propertyMeListMain = seller_res;
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
        })
      }

      if (!this.templateData.PropertyMeTypeId) {
        this.spinner.hide();
      }
    })
  }

  getContacts(searchText) {
    // this.spinner.show();
    this.documentService.getContacts(this.accountNumber, searchText).subscribe(res => {
      // this.spinner.hide();
      this.contactList = res
    }, error => {
      // this.spinner.hide();
    })
  }

  clearPartyData(index, partyName) {
    this.templateData.TemplateParties[index].UserId = ''
    let nwContact = {
      FirstName: '',
      LastName: '',
      Email: '',
      CountryCode: 'au',
      Phone: '',
      Position: '',
      Company: '',
      detailAdded: false,
      PhoneRequired: this.templateData.TemplateParties[index].SMSVerificationRequired ? true : false,
      PropertyMeContactId: null,
      HomePhone: '',
      WorkPhone: '',
      PhysicalAddress: '',
      PostalAddress: '',
      ContactId: 0
    }

    this.createDoc[partyName] = ''
    this.createDoc[partyName + '-details'] = nwContact

    this.selectedPartyIndex = 0

    // Add First and Last name in Document title Of First Recipient.
    this.updateTitleWhenFirstRecipientSelect(index, nwContact, false);
  }

  cancelFormValidCheck(valid, partyName){
    if(valid){
      this.createDoc[partyName + '-details'].detailAdded = true
    } else {
      this.createDoc[partyName + '-details'].detailAdded = false
      this.createDoc[partyName] = "";
    }

  }

  partyContactSelected(contact, index, partyName, PartyTypeId) {
    var exist = false
    if (PartyTypeId == 8 || PartyTypeId == 9) {
      let selectedUsers = this.templateData.TemplateParties.filter(x => {
        if (x.PartyTypeId == 8 || x.PartyTypeId == 9) {
          return x
        }
      })

      let selectExist = selectedUsers.find(x => {
        if (x.UserId == contact.Id) {
          return x;
        }
      })

      if (selectExist) {
        exist = true
        this.alertService.error("This user already selected")
      } else {
        exist = false
      }

    }

    if (!exist) {
      this.clickedNewContact = false
      // this.selectedPartyIndex = index + 1

      setTimeout(() => {
        if (this.mobileFlagEvent && contact.CountryCode) {
          this.mobileFlagEvent.setCountry(contact.CountryCode);
        }
      }, 300);

      let nwContact: any = {
        FirstName: contact.FirstName ? contact.FirstName : '',
        LastName: contact.LastName ? contact.LastName : '',
        Email: contact.Email ? contact.Email : '',
        CountryCode: contact.CountryCode ? contact.CountryCode : 'au',
        Phone: contact.MobileNumber ? contact.MobileNumber : contact.PhoneNumber ? contact.PhoneNumber : contact.Phone ? contact.Phone : contact.CellPhone ? contact.CellPhone : '',
        Position: contact.Position ? contact.Position : '',
        Company: contact.Company ? contact.Company : '',
        detailAdded: true,
        PhoneRequired: this.templateData.TemplateParties[index].SMSVerificationRequired ? true : false,
        PropertyMeContactId: null,
        HomePhone: contact.HomePhone ? contact.HomePhone : '',
        WorkPhone: contact.WorkPhone ? contact.WorkPhone : '',
        PhysicalAddress: contact.PhysicalAddress ? contact.PhysicalAddress : '',
        PostalAddress: contact.PostalAddress ? contact.PostalAddress : '',
        ContactId: contact.Id ? contact.Id : 0
      }

      if ('Signature' in this.createDoc[partyName + '-details']) {
        nwContact.Signature = this.createDoc[partyName + '-details'].Signature
      }


      if (nwContact.FirstName && nwContact.LastName && nwContact.Email) {

        if (nwContact.PhoneRequired && !nwContact.Phone ) {
          nwContact.detailAdded = false
        }

        this.createDoc[partyName] = contact.FirstName + ' ' + contact.LastName;
        this.createDoc[partyName + '-details'] = nwContact

        this.templateData.TemplateParties[index].UserId = contact.Id

        // Add First and Last name in Document title Of First Recipient.
        this.updateTitleWhenFirstRecipientSelect(index, nwContact, false);

      } else {
        this.createDoc[partyName] = null;
        this.templateData.TemplateParties[index].UserId = null;

        let err_message = "This user/contact does not have "
        let f_name = !nwContact.FirstName ? 'FirstName' : '';
        let l_name = !nwContact.LastName ? ((f_name) ? ', LastName' : 'LastName') : '';
        let email = !nwContact.Email ? ((f_name || l_name) ? ', Email' : 'Email') : '';
        let number = !nwContact.Phone ? ((f_name || l_name || email) ? ', PhoneNumber' : 'PhoneNumber') : ''

        this.alertService.error(err_message + f_name + l_name + email + number);
      }


      //Set users list as it is
      this.allUsers = this.allUsersMain
      // this.contactList = []
    }
  }

  assignMeAsSender(index, partyName) {
    this.spinner.show();
    this.authenticationService.getUserProfile().subscribe(userProfile => {
      this.spinner.hide();

      let nwContact = {
        FirstName: userProfile.FirstName ? userProfile.FirstName : '',
        LastName: userProfile.LastName ? userProfile.LastName : '',
        Email: userProfile.Email ? userProfile.Email : '',
        CountryCode: userProfile.CountryCode ? userProfile.CountryCode : 'au',
        Phone: userProfile.PhoneNumber ? userProfile.PhoneNumber : userProfile.Phone ? userProfile.Phone : '',
        Position: userProfile.Position ? userProfile.Position : '',
        Company: userProfile.Company ? userProfile.Company : '',
        PropertyMeContactId: null,
        HomePhone: userProfile.HomePhone ? userProfile.HomePhone : '',
        WorkPhone: userProfile.WorkPhone ? userProfile.WorkPhone : '',
        PhysicalAddress: userProfile.PhysicalAddress ? userProfile.PhysicalAddress : '',
        PostalAddress: userProfile.PostalAddress ? userProfile.PostalAddress : ''
      }


      if (nwContact.FirstName && nwContact.LastName && nwContact.Email && nwContact.Phone) {
        this.createDoc[partyName] = userProfile.FirstName + ' ' + userProfile.LastName
        this.createDoc[partyName + '-details'] = nwContact
        this.templateData.TemplateParties[index].UserId = userProfile.Id
      } else {
        this.createDoc[partyName] = null
        this.templateData.TemplateParties[index].UserId = null;

        let err_message = "This user/contact does not have "
        let f_name = !nwContact.FirstName ? 'FirstName' : '';
        let l_name = !nwContact.LastName ? ((f_name) ? ', LastName' : 'LastName') : '';
        let email = !nwContact.Email ? ((f_name || l_name) ? ', Email' : 'Email') : '';
        let number = !nwContact.Phone ? ((f_name || l_name || email) ? ', PhoneNumber' : 'PhoneNumber') : ''

        this.alertService.error(err_message + f_name + l_name + email + number);
      }

    }, error => {
      this.spinner.hide();
    })
  }

  // Update Template Title as First recipient select
  updateTitleWhenFirstRecipientSelect(index, nwContact, fromPropertyMe) {
    // Add First and Last name in Document title Of First Recipient.
    var recipients = this.templateData.TemplateParties.filter(x => {
      if (x.PartyTypeId !== 8 && x.PartyTypeId !== 9) {
        return x;
      }
    })

    if (recipients.length > 0) {
      if (recipients[0].Order == index) {
        var propertyAddress = this.createDoc.Property ? this.createDoc.Property : ''
        if (nwContact && nwContact.FirstName && nwContact.LastName) {

          if (fromPropertyMe) {
            this.createDoc.Title = this.templateData.Title + ' - ' + propertyAddress + ' - ' + nwContact.FirstName + ' ' + nwContact.LastName;
          } else {
            this.createDoc.Title = this.templateData.Title + ' - ' + nwContact.FirstName + ' ' + nwContact.LastName;
          }
        } else {
          this.createDoc.Title = this.templateData.Title + ' - ' + propertyAddress;
        }
      }
    }
  }

  clickNewContact(index) {
    this.clickedNewContact = true
    this.selectedPartyIndex = index + 1
  }

  getAllUsers(searchText) {
    // this.settings.getAllUsers(this.accountNumber,this.filter).subscribe(userData => {
    //   console.log("All users---",userData);
    //   this.allUsers = userData
    // },error => {
    //   console.log("Get Users Error---",error)
    // })

    // this.authenticationService.getUserProfile().subscribe(userProfile => {
    //   console.log("User Profile---",userProfile);

    let Groups = this.templateData.Groups
    let groups = ""
    if (Groups && Groups.length > 0) {

      for (var i = 0; i < Groups.length; i++) {
        if (i == Groups.length - 1) {
          groups += Groups[i]
        } else {
          groups += Groups[i] + ","
        }
      }
    } else {
    }

    // this.spinner.show();
    this.documentService.getAllUsers(this.accountNumber, searchText, groups).subscribe(userData => {
      // this.spinner.hide();
      var allUsersList = userData.Data
      var MainAllUsersList = userData.Data
      this.allUsersMain = MainAllUsersList.slice(0)
      this.allUsers = allUsersList
    }, error => {
      // this.spinner.hide();
    })
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

  // For Mobile Flag
  telInputObject(event) {
    this.mobileFlagEvent = event
  }

  onCountryChange(event, partyName) {
    this.createDoc[partyName + '-details'].CountryCode = event.iso2
  }

  getError(i) {
    return i
  }

  toggleSidebar() {
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');
  }

  datePickerChange1(event, PartyName, customField, format) {
    let nwDate = moment(event.date).format(format);
    this.createDoc[PartyName + '-' + customField] = nwDate
  }

  datePickerChange2(event, PartyName, customField, format) {
    let nwDate = moment(event.date).format(format);
    this.createDoc[PartyName + '-' + customField] = nwDate
  }
  datePickerChange3(event, PartyName, customField, format) {
    let nwDate = moment(event.date).format(format);
    this.createDoc[PartyName + '-' + customField] = nwDate
  }

  parseInJSON(data) {
    return JSON.parse(data)
  }

  checkDropDown(partyName, fieldName) {
  }

  getAllApps() {
    return new Promise((resolve) => {
      this.settings.getAllApps(this.accountNumber, this.propertyFilter).subscribe(
        (res) => {
          if (res.Data) {
            resolve(res.Data);
          } else {
            resolve([]);
          }
        },
        (error) => {
          resolve([])
        }
      );
    })

  }

  getAllConnectedApps() {
    this.settings.getAllApps(this.accountNumber, this.propertyFilter).subscribe((res) => {
      if (res.Data) {
        this.allApps = res.Data

        var propertyMeApp = this.allApps.find(app => {
          if(app.Id == 1){
            return app
          }
        })

        if (propertyMeApp && propertyMeApp.Active) {
          this.propertyMeDisable = false
        } else {
          this.propertyMeDisable = true
        }
      }else{
        this.allApps = []
      }
    },error => {
      this.allApps = []
    })
  }

  closePopup(){
    this.popupView = false
  }

  onImageChange(event, partyName, customFieldName, i, j){
    if(event.target.files[0]){
      var file = event.target.files[0];

      var size = file.size / 1024
      if(size > 2048){
        this.alertService.error('File size greater than 2 MB');
      } else {
        var formData: any = new FormData();
        formData.append('file', file);

        this.spinner.show();
        this.templateService.uploadFile(formData).subscribe((res) => {
          this.spinner.hide();
          if(res[0]) {
            this.createDoc[partyName+'-'+customFieldName] = res[0].Url
            this.templateData.TemplateParties[i].TemplateCustomFields[j].Format = file.name
          }
        },error => {
          this.spinner.hide();
        })
      }
    }
  }
}


