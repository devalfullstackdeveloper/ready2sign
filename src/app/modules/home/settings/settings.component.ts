import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { SettingsService } from '../../../core/service/settings.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../../../core/service/alert.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MapApiService, Maps } from 'src/app/core/service/mapApi.service';
import { google } from 'google-maps';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { transition, style, animate, trigger } from '@angular/animations';
import FroalaEditor from 'froala-editor';

declare var $: any;
export function removeSpaces(control: AbstractControl) {
  if (control && control.value && !control.value.replace(/\s/g, '').length) {
    control.setValue('');
  }
  return null;
}
export function patternValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }

    const regex = new RegExp('[0-9]{5,10}$');
    const valid = regex.test(control.value);
    return valid ? null : { invalidPhoneNumber: true };
  };
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class SettingsComponent implements OnInit, AfterViewInit {
  @ViewChild('signatureCanvas', { static: false }) signaturePad: SignaturePad;
  @ViewChild('infoPopup') optionPopUp: ElementRef;
  signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 1,
    canvasWidth: 455,
    canvasHeight: 100,
    'border-width': 1,
  };
  public toggle : boolean = false;
  public toggleShow : boolean = false;
  public _signature: any = null;

  currentUser = this.authenticationService.currentUserValue;

  public propagateChange: Function = null;

  InitialCountry = 'au';
  mobileFlagEvent;
  phoneFlagEvent;

  compProfileFlagEvent;

  selectedGrpId: number = null;
  accountNumber: Number = Number(
    JSON.parse(localStorage.getItem('acccountNumber'))
  );
  companyProfileForm: FormGroup;
  newuserform: FormGroup;
  edituserform: FormGroup;
  newgroupform: FormGroup;
  editgroupform: FormGroup;
  newuserformsubmitted = false;
  edituserformsubmitted = false;
  groupSubmitted = false;
  submitted = false;
  adminUsers: any = [];
  displayForm = 'CompanyProfile';
  invited = false;
  userUpdate = false;
  Message = '';
  companyProfileData: any = {};
  allUsers: any = [];
  noUser = false;
  userIndex: number;
  userMail: string;
  openActvBox: boolean = false;
  edtUsr: boolean = false;
  viewUser: boolean = false;
  userData: any;
  GroupsArrayInvite: Array<any> = [];
  access_level_edit: string;
  statusInEditUser: number;
  prtmngmnt: boolean = false;
  dflt: boolean = false;

  signatureAdded = false;

  loader: boolean = false;
  selectedId: any;
  newform_anim = false;
  edituserform_anim = false;
  createGrpModel_anim = false;
  newform_vis = false;
  createGrpModel = false;
  createGroup_anim = false;
  userEmailAlreadyExist = false;
  Groups = [
    { name: 'Default', id: 1 },
    { name: 'Property Management', id: 2 },
  ];

  filter: any = {
    top: 5,
    skip: 0,
    filterOn: 'FirstName',
    order: 'Asc',
    firstName: true,
    lastSignIn: false,
    firstSignIn: false,
    search: '',
    status: '',
  };

  groupFilter: any = {
    skip: 0,
    filterOn: 'Name',
    order: 'asc',
    Name: true,
    UserCount: false,
    TemplateCount: false,
    search: '',
    status: null,
  };

  propertyFilter: any = {
    filterOn: 'Id',
    order: 'Asc',
    app_srt: false,
    status_srt: false,
    search: '',
    status: [],
  };
  status_user = '';
  search_user_text = '';
  status_group = null;
  search_group_text = '';

  inviteUserJson: any = {
    FirstName: '',
    LastName: '',
    email: '',
    MobileNumber: null,
    Phone: null,
    password: 123456,
    confirmPassword: 123456,
    Branch: '',
    Position: '',
    AccountId: null,
    Role: 'Standard',
    Groups: [1],
  };
  access_level: string = this.inviteUserJson.Role;
  statusInInviteUser: number = 0;
  totalUsers: number = 0;
  totalActiveUser: number = 0;
  totalInActiveUser: number = 0;
  exactPage: any;
  numberArray: any = [];
  activePage: any = 1;
  pageNo: number = 1;
  options: any = [3, 5, 10, 20, 50];
  selectedQuantity = 5;
  rfrsToken: any;
  accToken: any;
  code: any;
  activeApp: boolean = true;
  InactiveApp: boolean = false;
  editGrpModel: boolean = false;
  viewGrpModel: boolean = false;
  editGroup_anim: boolean = false;
  // createGrpModel : boolean = false;

  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,4}$";

  propertyMeArray = [
    {
      name: 'PropertyMe',
      url: 'www.propertyme.com.au',
      status: true,
    },
    // {
    //   name:'PropertyMe2',
    //   url:'www.propertyme.com.au'
    // },
    // {
    //   name:'PropertyMe3',
    //   url:'www.propertyme.com.au'
    // }
  ];

  emailBuilderEditor;
  emailBuildorConfig: Object = {
    key: 'cJC7bD6A2E2C2G2D2yQNDMIJg1IQNSEa1EUAi1XVFQd1EaG3C2A5C4C4E3E3D4F2C2==',
    toolbarSticky: false,
    dragInline: false,
    fontSizeSelection: false,
    fontSizeDefaultSelection: '11',
    fontFamily: {
      'Arial,Helvetica,sans-serif': 'Arial',
      'Georgia,serif': 'Georgia',
      'Impact,Charcoal,sans-serif': 'Impact',
      'Tahoma,Geneva,sans-serif': 'Tahoma',
      "'Times New Roman',Times,serif": 'Times New Roman',
      'Verdana,Geneva,sans-serif': 'Verdana',
      "Roboto,sans-serif": 'Roboto',
      "Oswald,sans-serif": 'Oswald',
      "Montserrat,sans-serif": 'Montserrat',
      "'Open Sans Condensed',sans-serif": 'Open Sans Condensed'
    },
    fontFamilySelection: false,
    toolbarButtons: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          // 'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote',
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          // 'insertFile',
          'insertHR'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsMD: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          // 'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          // 'insertFile',
          'insertHR'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsSM: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          // 'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          // 'insertFile',
          'insertHR'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    toolbarButtonsXS: {
      moreText: {
        buttons: [
          'bold',
          'italic',
          'underline',
          // 'strikeThrough',
          // 'subscript',
          // 'superscript',
          'fontFamily',
          'fontSize',
          'textColor',
          'backgroundColor',
          // 'inlineClass',
          // 'inlineStyle',
          'clearFormatting',
          'pageBreaker'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'formatOLSimple',
          'alignRight',
          'alignJustify',
          'formatOL',
          'formatUL',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreRich: {
        buttons: [
          'insertLink',
          'insertImage',
          // 'insertVideo',
          'insertTable',
          // 'emoticons',
          'fontAwesome',
          'specialCharacters',
          'embedly',
          // 'insertFile',
          'insertHR'
        ],
        align: 'left',
        buttonsVisible: 2,
      },
      moreMisc: {
        buttons: [
          'undo',
          'redo',
          'fullscreen',
          // 'print',
          // 'getPDF',
          'spellChecker',
          'selectAll',
          'html',
          'help'
        ],
        align: 'right',
        buttonsVisible: 2,
      },
    },
    event: {
      contentChanged: () => {
        this.companyProfileForm.patchValue({
          defs: this.emailBuilderEditor.html.get(),
        });
      },
    },
  };

  allApps: any = [];

  groupArray: any = [];
  groupArrayById: any = [];
  groupModel: any = {};
  selectedProperty: any = null;
  selectedOption: any = null;
  groupDetails: any = [];
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public place: google.maps.places.PlaceResult;

  Roles: any = [];
  constructor(
    apiService: MapApiService,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) {
    this.Roles = this.activeRoute.snapshot.data['roles'];

    this.getAccount();
    this.getAdminUsers();
    this.getAllUsers();
    this.groupsList();
    this.groupListbyId();
    this.getAllApps();
    apiService.api.then((maps) => {
      this.initAutocomplete(maps);
    });
  }
  initAutocomplete(maps: Maps) {
    new maps.places.Autocomplete(this.searchElementRef.nativeElement);
  }
  ngOnInit(): void {

    this.companyProfileForm = new FormGroup({
      company: new FormControl('', [Validators.required, removeSpaces]),
      countrycode: new FormControl(''),
      phone: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          removeSpaces,
          patternValidator(),
        ])
      ),
      address: new FormControl('', [Validators.required, removeSpaces]),
      contact: new FormControl(''),
      defs: new FormControl('', [Validators.required, removeSpaces]),
    });

    this.newuserform = new FormGroup({
      userfirstname: new FormControl('', [Validators.required, removeSpaces]),
      userlastname: new FormControl('', [Validators.required, removeSpaces]),
      useremail: new FormControl('', [
        // Validators.email,
        Validators.required,
        removeSpaces,
      ]),
      usercountrycode: new FormControl('au'),
      usermobile: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          removeSpaces,
          patternValidator(),
        ])
      ),
      userworkcountrycode: new FormControl('au'),
      userworkphone: new FormControl(
        '',
        Validators.compose([
          removeSpaces,
          Validators.maxLength(10),
          patternValidator(),
        ])
      ),
      userbranch: new FormControl(''),
      userposition: new FormControl(''),
    });
    this.edituserform = new FormGroup({
      e_userfirstname: new FormControl('', [Validators.required, removeSpaces]),
      e_userlastname: new FormControl('', [Validators.required, removeSpaces]),
      e_useremail: new FormControl('', [
        // Validators.email,
        Validators.required,
        removeSpaces,
      ]),
      e_usercountrycode: new FormControl('au'),
      e_usermobile: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          removeSpaces,
          patternValidator(),
        ])
      ),
      e_userworkcountrycode: new FormControl('au'),
      e_userworkphone: new FormControl(
        '',
        Validators.compose([
          removeSpaces,
          Validators.maxLength(10),
          patternValidator(),
        ])
      ),
      e_userbranch: new FormControl(''),
      e_usersignatureurl: new FormControl(''),
      e_userposition: new FormControl(''),
      e_userstatus: new FormControl(0),
      e_expirydays: new FormControl(0),
    });

    this.newgroupform = new FormGroup({
      groupname: new FormControl('', [
        Validators.required,
        removeSpaces,
        Validators.maxLength(25),
      ]),
    });

    this.editgroupform = new FormGroup({
      e_groupname: new FormControl('', [
        Validators.required,
        removeSpaces,
        Validators.maxLength(25),
      ]),
    });

    this.authenticationService.getActiveAccountNumber().subscribe((data) => {
      this.currentUser = this.authenticationService.currentUserValue;

      let roleExist = this.Roles.find((role) => role === this.currentUser.role);
      if (!roleExist) {
        this.router.navigate(['/admin/home']);
      }

      this.accountNumber = data;
      this.getAdminUsers();
      this.getAccount();
      this.getAllUsers();
      this.groupsList();
      this.getAllApps();
    });
    this.activeRoute.queryParams.subscribe((params) => {
      this.code = params['code'];
    });

    if (this.code) {
      this.getAuthToken(this.code);
    }

    let routerFullUrl = this.router.url;
    let router_spl = routerFullUrl.split('/');

    let last_routerPath = router_spl[router_spl.length - 1];

    if (last_routerPath == 'CompanyProfile') {
      this.displayForm = 'CompanyProfile';
    } else if (last_routerPath == 'Users') {
      this.displayForm = 'Users';
    } else if (last_routerPath == 'Groups') {
      this.displayForm = 'Groups';
    } else if (last_routerPath == 'ConnectedApps') {
      this.displayForm = 'ConnectedApps';
    } else {
      this.displayForm = 'CompanyProfile';
    }
  }

  get companyProfileFormControl() {
    return this.companyProfileForm.controls;
  }
  get newuserFormControl() {
    return this.newuserform.controls;
  }
  get edituserFormControl() {
    return this.edituserform.controls;
  }

  get newgroupFormControl() {
    return this.newgroupform.controls;
  }

  get editgroupFormControl() {
    return this.editgroupform.controls;
  }

  ngAfterViewInit() {
    document.onclick = (event: any): void => {
      let selectedclass = event.target.className;
      if (
        selectedclass.includes('info-popup-sm') ||
        selectedclass.includes('setting-dots')
      ) {
      } else {
        this.openActvBox = false;
        for (var i = 0; i < this.groupArray.length; i++) {
          this.groupArray[i].options = false;
        }
      }
    };
  }

  cancelForm() {
    this.location.back();
  }
  getAccount() {
    if (this.accountNumber) {
      this.settings.getAccount(this.accountNumber).subscribe((res) => {
        this.companyProfileData = res;
        this.companyProfileForm.patchValue({
          company: res.Name,
          countrycode: res.CountryCode ? res.CountryCode : 'au',
          phone: res.Phone,
          address: res.StreetAddress,
          contact: res.PrimaryContactId,
          defs: res.Footer,
        });

        setTimeout(() => {
          if (this.phoneFlagEvent && res.CountryCode) {
            this.phoneFlagEvent.setCountry(res.CountryCode);
          }
        }, 300);
      });
    }
  }

  compProfileTelInputObject(event) {
    this.compProfileFlagEvent = event;
  }

  compProfileCountryChange(event) {
    this.companyProfileForm.patchValue({
      countrycode: event.iso2,
    });
  }

  getAdminUsers() {
    if (this.accountNumber) {
      this.settings.getAdminUsers(this.accountNumber).subscribe((res) => {
        for (const i of res) {
          this.adminUsers.push(i);
        }
      });
    }
  }

  companyProfileUpdate(address_data) {
    this.submitted = true;
    if (this.companyProfileForm.valid) {
      if (this.loader) return false;
      this.loader = true;
      this.spinner.show();
      this.companyProfileData.Name =
        this.companyProfileFormControl.company.value;
      this.companyProfileData.CountryCode =
        this.companyProfileFormControl.countrycode.value;
      this.companyProfileData.Phone =
        this.companyProfileFormControl.phone.value;
      this.companyProfileData.StreetAddress = address_data;
      this.companyProfileData.PrimaryContactId =
        this.companyProfileFormControl.contact.value || null;
      this.companyProfileData.Footer =
        this.companyProfileFormControl.defs.value;

      this.settings.updateCompanyProfile(this.companyProfileData).subscribe(
        (res) => {
          this.spinner.hide();
          this.alertService.successPage(res);
          this.loader = false;

          this.getAccount();
        },
        (error) => {
          this.spinner.hide();
          this.loader = false;
          this.alertService.error(error.Message);
        }
      );
    }
  }

  getAllUsers() {
    this.spinner.show();
    if (this.accountNumber) {
      this.settings
        .getAllUsers(this.accountNumber, this.filter)
        .subscribe((res) => {
          this.spinner.hide();
          if (res.Data.length > 0) {
            res.Data = res.Data.map((item) => {
              return {
                ...item,
                LastSignIn: item.LastSignIn
                  ? moment(item.LastSignIn).format(
                      'DD/MM/YYYY \xa0\xa0\xa0 hh:mm a'
                    )
                  : '',
                FirstSignIn: item.FirstSignIn
                  ? moment(item.FirstSignIn).format(
                      'DD/MM/YYYY \xa0\xa0\xa0 hh:mm a'
                    )
                  : '',
              };
            });
            this.allUsers = res.Data;
            if(this.allUsers.length == 0){
              this.noUser = true;
            }
            this.totalUsers = res.TotalCount;
            var Active = res.Data.filter((x) => {
              if (x.UserStatus == 'Active') {
                return x;
              }
            });
            this.totalActiveUser = Active.length;

            var InActive = res.Data.filter((x) => {
              if (x.UserStatus == 'InActive') {
                return x;
              }
            });
            this.totalInActiveUser = InActive.length;

            this.pageNoCalculation();
          } else {
            this.allUsers = [];
            this.noUser = true;
            this.totalUsers = 0;
            this.pageNoCalculation();
          }
        });
    }
    this.spinner.hide();
  }
  searchUser(value) {
    this.activePage = 1;
    if (value.length > 0) {
      this.filter.skip = 0;
      this.filter.search = value;
      this.getAllUsers();
    } else {
      this.filter.skip = 0;
      this.filter.search = '';
      this.getAllUsers();
    }
  }
  selectStatus(event) {
    if (event) {
      this.activePage = 1;
      if (event == 'All') {
        this.filter.status = '';
        this.getAllUsers();
      } else {
        this.filter.status = event;
        this.getAllUsers();
      }
    }
  }
  pageNoCalculation() {
    this.numberArray = [];
    let page = this.totalUsers / this.filter.top;
    let tempPage = page.toFixed();

    if (Number(tempPage) < page) {
      this.exactPage = Number(tempPage) + 1;
      for (let i = 0; i < this.exactPage; i++) {
        this.numberArray.push(this.pageNo);
        this.pageNo++;
      }
      this.pageNo = 1;
    } else {
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
    this.filter.skip = this.filter.top * (pgNo - 1);
    this.getAllUsers();
  }

  leftArrow() {
    if (this.activePage > 1) {
      this.activePage = Number(this.activePage - 1);
      this.filter.skip = this.filter.top * (this.activePage - 1);
      this.getAllUsers();
    }
  }
  rightArrow() {
    if (this.activePage < this.exactPage) {
      this.activePage = Number(this.activePage);
      this.filter.skip = this.filter.top * this.activePage;
      this.activePage++;
      this.getAllUsers();
    }
  }

  selectNoOfRows(no) {
    this.filter.top = no;
    this.getAllUsers();
  }

  filterBy(type) {
    this.activePage = 1;
    if (type == 'Name') {
      this.filter.firstName = !this.filter.firstName;
      this.filter.firstSignIn = false;
      this.filter.lastSignIn = false;
      this.filter.filterOn = 'FirstName';
      if (this.filter.firstName == true) this.filter.order = 'Asc';
      else this.filter.order = 'Desc';
    }
    if (type == 'lastSignIn') {
      this.filter.lastSignIn = !this.filter.lastSignIn;
      this.filter.firstSignIn = false;
      this.filter.firstName = false;
      this.filter.filterOn = 'LastSignIn';
      if (this.filter.lastSignIn == true) this.filter.order = 'Asc';
      else this.filter.order = 'Desc';
    }
    if (type == 'firstSignIn') {
      this.filter.firstSignIn = !this.filter.firstSignIn;
      this.filter.firstName = false;
      this.filter.lastSignIn = false;
      this.filter.filterOn = 'FirstSignIn';
      if (this.filter.firstSignIn == true) this.filter.order = 'Asc';
      else this.filter.order = 'Desc';
    }
    this.filter.skip = 0;
    if (this.accountNumber) {
      this.getAllUsers();
    }
  }

  setDisplay(page) {
    this.displayForm = page;
  }
  openActiveBox(id, mailId) {
    if (this.userIndex == id) {
      this.openActvBox = !this.openActvBox;
    } else {
      this.openActvBox = true;
    }
    this.userIndex = id;
    this.userMail = mailId;
  }

  changeGroup(val, isChecked: boolean) {
    if (isChecked) {
      this.GroupsArrayInvite.push(val);
    } else {
      let index = this.GroupsArrayInvite.indexOf(val);
      this.GroupsArrayInvite.splice(index, 1);
    }
    this.inviteUserJson.Groups = this.GroupsArrayInvite;

  }

  telInputObject(event) {
    this.mobileFlagEvent = event;
  }

  onCountryChange(event) {
    this.newuserform.patchValue({
      usercountrycode: event.iso2,
    });

    this.edituserform.patchValue({
      e_usercountrycode: event.iso2,
    });
  }

  worktelInputObject(event) {
    this.phoneFlagEvent = event;
  }

  workonCountryChange(event) {
    this.newuserform.patchValue({
      userworkcountrycode: event.iso2,
    });

    this.edituserform.patchValue({
      e_userworkcountrycode: event.iso2,
    });
  }

  sendInvitation() {
    this.newuserformsubmitted = true;
    if (this.newuserform.valid && this.GroupsArrayInvite.length !== 0 && !this.userEmailAlreadyExist) {
      this.spinner.show();
      this.inviteUserJson.AccountId = this.accountNumber;
      this.inviteUserJson.FirstName =
        this.newuserFormControl.userfirstname.value;
      this.inviteUserJson.LastName = this.newuserFormControl.userlastname.value;
      this.inviteUserJson.email = this.newuserFormControl.useremail.value;
      this.inviteUserJson.CountryCode =
        this.newuserFormControl.usercountrycode.value;
      this.inviteUserJson.MobileNumber =
        this.newuserFormControl.usermobile.value;
      this.inviteUserJson.WorkPhoneCountryCode =
        this.newuserFormControl.userworkcountrycode.value;
      this.inviteUserJson.Phone = this.newuserFormControl.userworkphone.value;
      this.inviteUserJson.Branch = this.newuserFormControl.userbranch.value;
      this.inviteUserJson.Position = this.newuserFormControl.userposition.value;
      this.inviteUserJson.Role = this.access_level;
      this.settings.inviteUser(this.inviteUserJson).subscribe(
        (res) => {
          this.spinner.hide();
          // if (res.WasSuccessful == true) {
            this.newuserform.reset();
            this.getAllUsers();
            this.newform_anim = false;
            this.newform_vis = false;
            this.createGrpModel = false;
            this.createGrpModel_anim = false;
            this.invited = true;
            this.signatureAdded = false;
            this.Message = res;
            setTimeout(() => {
              this.invited = false;
            }, 5000);
            this.groupsList();
          // }
        },
        (error) => {
          this.spinner.hide();
          var error_msg = '';
          for (const msg of error.Messages) {
            error_msg += msg + '\n';
          }
          this.alertService.error(error_msg);
        }
      );
    } else {
      this.alertService.error('Invalid Form !!');
    }
  }

  checkEmailExist(){

    this.settings.checkEmailExist(this.newuserFormControl.useremail.value,this.accountNumber).subscribe(res => {
      if(res.IsExit){
        console.log("Check Email Exist Response::---",res)
        this.userEmailAlreadyExist = true
      }else{
        this.userEmailAlreadyExist = false
      }


    },error => {
      this.alertService.error(error.Message);
    })
  }

  activateUser(user, stts) {
    this.spinner.show();
    this.settings.updateStatus(user.Id, stts, this.accountNumber).subscribe(
      (res) => {
        if (res.WasSuccessful) {
          this.getAllUsers();
        } else {
        }
      },
      (error) => {
        console.log('Error---', error);
      }
    );
    // this.settings.getUserById(user.Id).subscribe(res=>{
    //   console.log("get user by id--",res);
    // })
  }

  resetPassword(user) {
    console.log('User ::---', user);
    if (user.Email) {
      this.authenticationService.forgotPassword(user.Email).subscribe(
        (res) => {
          this.alertService.successPage(res);
        },
        (error) => {
          this.alertService.error(error.Message);
        }
      );
    }
  }

  resendInviteUser(user) {
    this.spinner.show();
    this.settings.resendUserInvite(user.Id).subscribe(
      (res) => {
        this.alertService.successPage(res);
        this.getAllUsers();
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error.Messages);
      }
    );
  }

  deleteInviteUser(user) {
    this.spinner.show();
    this.settings.deleteUserInvite(user.Id).subscribe(
      (res) => {
        this.alertService.successPage(res);
        this.getAllUsers();
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error.Messages);
      }
    );
  }

  deleteUser(user) {
    this.spinner.show();
    this.settings.deleteUser(user.Id).subscribe(
      (res) => {
        if (res.WasSuccessful) {
          this.getAllUsers();
        } else {
          this.spinner.hide();
        }
      },
      (error) => {
        console.log('Error---', error);
      }
    );
  }

  editOrViewUser(user, view) {
    //mapping edit data
    this.spinner.show();
    this.signatureAdded = false;
    this.dflt = false;
    this.prtmngmnt = false;

    // this.newform_anim = true
    // this.newform_vis = true

    this.settings.getUserById(user.Id, this.accountNumber).subscribe((res) => {
      console.log('Edit User res ---', res);
      this.spinner.hide();
      this.userData = res;

      if (res.SignatureUrl) {
        this.signatureAdded = true;
      }

      this.edituserform.patchValue({
        e_userfirstname: res.FirstName,
        e_userlastname: res.LastName,
        e_useremail: res.Email,
        e_usercountrycode: res.CountryCode,
        e_usermobile: res.MobileNumber,
        e_userworkcountrycode: res.WorkPhoneCountryCode
          ? res.WorkPhoneCountryCode
          : '',
        e_userworkphone: res.PhoneNumber,
        e_userbranch: res.Branch,
        e_userposition: res.Position,
        e_usersignatureurl: res.SignatureUrl,
        e_userstatus: res.UserStatus,
        e_expirydays: res.ExpiryDays,
      });

      setTimeout(() => {
        if (this.mobileFlagEvent && res.CountryCode) {
          console.log('Update Mobile Flag');
          this.mobileFlagEvent.setCountry(res.CountryCode);
        }

        if (this.phoneFlagEvent && res.WorkPhoneCountryCode) {
          console.log('Update Work Flag');
          this.phoneFlagEvent.setCountry(res.WorkPhoneCountryCode);
        }
      }, 300);

      this.access_level_edit = res.Role;
      this.statusInEditUser = res.UserStatus;
      console.log('user astatus----', this.userData, this.statusInEditUser);
      let grps = res.Groups;
      this.GroupsArrayInvite = res.Groups;
      // for(let i=0;i<grps.length;i++){
      //   if(grps[i] == 1){
      //     this.dflt = true;
      //   }
      //   if(grps[i] == 2){
      //     this.prtmngmnt = true;
      //   }
      // }
      // if(this.statusInEditUser == 2 || this.statusInEditUser == 3){
      this.edituserform_anim = true;
      this.edtUsr = true;

      if (view) {
        this.viewUser = true;
      }

      // }

      setTimeout(() => {
        if (this.signaturePad) {
          this.signaturePad.off();
        }
      }, 300);
    });
  }

  selectedRow(id) {
    console.log('id-----', id);
    this.selectedId = id;
  }

  changeGroupEdit(val, isChecked: boolean, user) {
    this.GroupsArrayInvite = user.Groups;
    if (isChecked) {
      this.GroupsArrayInvite.push(val);
    } else {
      let index = this.GroupsArrayInvite.indexOf(val);
      this.GroupsArrayInvite.splice(index, 1);
    }
    this.userData.Groups = this.GroupsArrayInvite;
  }

  checkGroupExist(id) {
    let grp_id = this.GroupsArrayInvite.find((g_id) => {
      if (g_id == id) {
        return g_id;
      }
    });

    if (grp_id) {
      return true;
    } else {
      return false;
    }
  }

  checkGroupValidation() {
    if (this.GroupsArrayInvite.length == 0) {
      return false;
    } else {
      return true;
    }
  }


  updateUser() {
    this.spinner.show();
    this.edituserformsubmitted = true;
    console.log('Groups array 1::---', this.GroupsArrayInvite);

    const groups = [];
    for (var i = 0; i < this.GroupsArrayInvite.length; i++) {
      let grpIdExist = this.groupArray.find((grp) => {
        if (grp.Id == this.GroupsArrayInvite[i]) {
          return true;
        }
      });

      if (grpIdExist) {
        groups.push(this.GroupsArrayInvite[i]);
      }
    }
    this.GroupsArrayInvite = groups;
    console.log('Groups array 2::---', this.GroupsArrayInvite);

    if (this.edituserform.valid && this.GroupsArrayInvite.length !== 0) {
      console.log('update user ---', this.userData);
      let req = {
        Id: this.userData.Id,
        AccountId: this.userData.AccountId,
        Status: 0,
        password: '123456',
        confirmPassword: '123456',
        FirstName: this.edituserFormControl.e_userfirstname.value,
        LastName: this.edituserFormControl.e_userlastname.value,
        email: this.edituserFormControl.e_useremail.value,
        CountryCode: this.edituserFormControl.e_usercountrycode.value,
        MobileNumber: this.edituserFormControl.e_usermobile.value,
        WorkPhoneCountryCode:
          this.edituserFormControl.e_userworkcountrycode.value,
        Phone: this.edituserFormControl.e_userworkphone.value,
        Branch: this.edituserFormControl.e_userbranch.value,
        Position: this.edituserFormControl.e_userposition.value,
        SignatureUrl: this.edituserFormControl.e_usersignatureurl.value,
        Role: this.access_level_edit,
        Groups: this.userData.Groups,
        Userstatus: this.statusInEditUser,
      };

      this.settings.updateUser(req).subscribe(
        (res) => {
          // if (res.WasSuccessful == true) {
            this.getAllUsers();
            this.edtUsr = false;
            this.invited = true;
            this.Message = res.Messages;

            this.edituserformsubmitted = false;
            setTimeout(() => {
              this.invited = false;
            }, 5000);
            this.groupsList();
          // }
        },
        (error) => {
          this.spinner.hide();
          console.log('error', error);
          this.edituserformsubmitted = false;
          this.alertService.error(error.Messages[0]);
        }
      );
    } else {
      this.alertService.error('Invalid Form !!');
      this.spinner.hide();
    }
  }

  // signature

  addNewSign() {
    this.signatureAdded = false;
  }

  close() {
    this.signatureAdded = true;
  }

  public writeValue(value: any): void {
    if (!value) {
      return;
    }
    this._signature = value;
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // no-op
  }

  drawComplete() {
    this.spinner.show();
    fetch(this.signaturePad.toDataURL())
      .then((res) => res.blob())
      .then((blob) => {
        var formData: any = new FormData();
        formData.append(
          'file',
          blob,
          'signature_file.' + blob.type.split('/')[1]
        );
        this.settings.uploadFile(formData).subscribe(
          (res) => {
            this.edituserform.patchValue({
              e_usersignatureurl: res[0].Url,
            });

            this.spinner.hide();
            console.log('file upload', res);
          },
          (error) => {
            this.spinner.hide();
            console.log('File Error----', error);
          }
        );
      });
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  drawMouse() {
    console.log('Draw mouse hover');
    if (this.viewUser) {
      this.signaturePad.off();
    }
  }

  public clear(): void {
    this.signaturePad.clear();
  }

  sendResetLink(data) {
    this.spinner.show();
    this.authenticationService.forgotPassword(data.Email).subscribe(
      (res) => {
        this.spinner.hide();
        this.alertService.successPage(res);
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  //------------------ Connected-App ------------

  getAllApps() {
    this.settings.getAllApps(this.accountNumber, this.propertyFilter).subscribe(
      (res) => {
        console.log('All Apps ::----', res);
        this.allApps = res.Data;
      },
      (error) => {
        console.log('Error ::----', error);
      }
    );
  }

  propertyOn(index) {
    this.propertyMeArray[index].status = true;
    // var url = "https://login.propertyme.com/connect/authorize?response_type=code&state=&client_id=8e9f08d6-566e-4ba1-b43f-c46511c8a17d&scope=contact:read%20activity:read%20property:read%20communication:read%20transaction:read%20offline_access&redirect_uri=http://localhost:65385/home/callback"
    var url =
      'https://login.propertyme.com/connect/authorize?response_type=code&state=&client_id=8e9f08d6-566e-4ba1-b43f-c46511c8a17d&scope=contact:read%20activity:read%20property:read%20communication:read%20transaction:read%20offline_access&redirect_uri=https://ready2sign.newpathstudio.com.au';
    window.open(url, '_blank');
  }

  propertyOff(app) {
    // this.propertyMeArray[index].status = false
    app.Active = false;
    console.log('App ::---', app);
    this.settings.updateApp(app).subscribe(
      (res) => {
        if (res.WasSuccessful) {
          this.getAllApps();
        } else {
          this.alertService.error(res.Messages);
        }
      },
      (error) => {
        this.alertService.error(error.Messages);
      }
    );
  }

  getAuthToken(code) {
    this.spinner.show();
    this.settings.getAuthToken(code).subscribe((res) => {
      this.spinner.hide();
      console.log('get auth token--', res);
      if (res.access_token && res.refresh_token) {
        // this.saveToken(res.access_token,res.refresh_token);
      }
    });
    this.accToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1OTgyODA2MjMsImV4cCI6MTU5ODI4NDIyMywiaXNzIjoiaHR0cHM6Ly9sb2dpbi5wcm9wZXJ0eW1lLmNvbSIsImF1ZCI6WyJodHRwczovL2xvZ2luLnByb3BlcnR5bWUuY29tL3Jlc291cmNlcyIsImh0dHBzOi8vYXBwLnByb3BlcnR5bWUuY29tL2FwaSJdLCJjbGllbnRfaWQiOiI4ZTlmMDhkNi01NjZlLTRiYTEtYjQzZi1jNDY1MTFjOGExN2QiLCJzdWIiOiJDdXN0b21lcklkX2E1MzgwMzFhLWY3MGMtNGJkNi1iYzg1LWQ2ZGIyNjZmYTMzMCIsImF1dGhfdGltZSI6MTU5ODI4MDYwNywiaWRwIjoibG9jYWwiLCJjdXN0b21lcl9pZCI6ImE1MzgwMzFhLWY3MGMtNGJkNi1iYzg1LWQ2ZGIyNjZmYTMzMCIsIm1lbWJlcl9pZCI6ImFiZmYwMDI0LWE4M2QtNGUwZS1hZTg0LWM1ZjgxYjNkZmRmZCIsIm1lbWJlcl9hY2Nlc3NfaWQiOiJhYmZmMDAyNC1hODNlLTQyNTEtOTU4Zi1lM2ZjYjIzYzAwZWIiLCJzY29wZSI6WyJwcm9wZXJ0eTpyZWFkIiwiY29tbXVuaWNhdGlvbjpyZWFkIiwiYWN0aXZpdHk6cmVhZCIsInRyYW5zYWN0aW9uOnJlYWQiLCJjb250YWN0OnJlYWQiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.UFehMRjEjEqbRsX71ASvLZFWi-4WP6Nk9TtaMHpXHYUlzQiuM0GL7lyTPEpeKE6xwT-ND0zOYp-1xkknWRSSlXTRzIDqROJRC-TrUgVltWKFKS2RtJDK5C-Zvt-laO_ytwmKqwJbfsgyS-mq0I0DeJmiNXK9Bowa1mmcpPmWXM_FuSt3KFfRAdcYdf7tT4AzVUBfczWTiu_pQhnONkU6YH_O8dPdL6CHrEz2s7Hr_kZOiAsUoAfSrsrdD6k6F27-unf2DEZHxdl4dMk1Njh9Jel1eLImREpCIYupFzKuNFJU64dz0wsexxOvEBk8d-9dbOmqQvYSG-c_FH0YtYzeRg';
    this.rfrsToken =
      'fc181d6d5bfdd86e1773c6c8df12aa2c30f4c02f7458e3c9bee4d99b176ef0d6';
    this.saveToken();
  }

  saveToken() {
    this.spinner.show();
    let data = {
      accountid: 1,
      refreshtoken: this.rfrsToken,
      accesstoken: this.accToken,
    };

    this.settings.saveToken(data).subscribe((res) => {
      this.spinner.hide();
      console.log('save Token--', res);
      if (res.WasSuccessful == true) {
      }
    });
  }

  selectStatusApps(event) {
    console.log('status---', event.target.value);
    if (event.target.value == 'All') {
      this.propertyFilter.status = '';
      this.getAllUsers();
    } else {
      this.propertyFilter.status = event.target.value;
      console.log('filter --', this.filter);
      this.getAllUsers();
    }
  }
  searchApps(event) {}
  appsFilterBy(type) {
    if (type == 'App') {
      this.propertyFilter.app_srt = !this.propertyFilter.app_srt;
      this.propertyFilter.status_srt = false;
      this.propertyFilter.filterOn = type;
      if (this.propertyFilter.app_srt == true)
        this.propertyFilter.order = 'Asc';
      else this.propertyFilter.order = 'Desc';
    }
    if (type == 'Status') {
      this.propertyFilter.status_srt = !this.propertyFilter.status_srt;
      this.propertyFilter.app_srt = false;
      this.propertyFilter.filterOn = type;
      if (this.propertyFilter.status_srt == true)
        this.propertyFilter.order = 'Asc';
      else this.propertyFilter.order = 'Desc';
    }
    console.log('this filter--', this.propertyFilter);
  }

  selectOption(index) {
    for (var i = 0; i < this.groupArray.length; i++) {
      if (i == index) {
        this.groupArray[index].options = !this.groupArray[index].options;
      } else {
        this.groupArray[i].options = false;
      }
    }
  }

  mouseHover(index) {
    this.selectedProperty = index;
  }

  mouseLeave() {
    this.selectedProperty = null;
  }

  closeEditOrViewGroupModel() {
    this.groupSubmitted = false;
    this.editGroup_anim = false;
    this.editgroupform.reset();
    setTimeout(() => {
      this.editGrpModel = false;
      this.viewGrpModel = false;
    }, 300);
  }

  displayEditOrViewGroupModel(grp, view) {
    console.log('Id ---', grp.Id);
    // if(grp.Id !== 1 && grp.Id !== 2){
    this.selectedGrpId = grp.Id;
    this.settings.getGroupDetailsById(grp.Id).subscribe(
      (res) => {
        console.log(res);
        this.groupDetails = res;
        this.editgroupform.patchValue({
          e_groupname: res.Name,
        });
        this.editGrpModel = true;
        this.editGroup_anim = true;

        if (view) {
          this.viewGrpModel = true;
        }

        this.loadScript();
      },
      (error) => {
        this.spinner.hide();
        console.log('error', error);
        this.alertService.error(error.Messages);
      }
    );
    // }
  }

  displayCreategroupModel() {
    this.createGrpModel = true;
    this.createGroup_anim = true;
    this.groupModel = {};
    // this.createGrpModel_anim = false;
    // setTimeout (() => {this.createGrpModel = false;}, 300);
    this.loadScript();
  }

  closeCreateGroupModel() {
    this.groupSubmitted = false;

    this.createGroup_anim = false;
    setTimeout(() => {
      this.createGrpModel = false;
    }, 300);
    this.newgroupform.reset();
  }

  getAddress(event) {
    this.spinner.show();
    console.log('word-----', event.target.value);
    this.settings.getAddressFromGoogle1(event.target.value).subscribe((res) => {
      this.spinner.hide();
      console.log('res from google-----', res);
    });
  }

  // ----------- Group Functionality ---------

  groupsList() {
    this.settings
      .getGropsList(this.accountNumber, this.groupFilter)
      .subscribe((res) => {
        console.log('grops----', res);
        console.log('Array', res.Items);
        this.groupArray = res.Items;
        // for(let i = 0;i < this.groupArray.length;i++){
        //   if(this.groupArray[i].Id == 1 || this.groupArray[i].Id == 2){
        //     this.groupArray[i].defaultGrp = true;
        //     if (this.groupArray[i].Id == 1) {
        //       this.groupArray[i].disabled = true
        //     }
        //   }
        //   else{
        //     this.groupArray[i].defaultGrp = false;
        //     this.groupArray[i].disabled = false
        //   }
        // }
      });
  }

  groupListbyId() {
    this.settings
      .getGropsList(this.accountNumber, this.groupFilter)
      .subscribe((res) => {
        let sortedArray = res.Items.sort(function (a, b) {
          return a.Id - b.Id;
        });
        this.groupArrayById = sortedArray;
      });
  }
  groupFilterBy(type) {
    if (type == 'Name') {
      this.groupFilter.Name = !this.groupFilter.Name;
      this.groupFilter.UserCount = false;
      this.groupFilter.TemplateCount = false;

      this.groupFilter.filterOn = 'Name';
      if (this.groupFilter.Name) {
        this.groupFilter.order = 'asc';
      } else {
        this.groupFilter.order = 'desc';
      }
    }

    if (type == 'UserCount') {
      this.groupFilter.Name = false;
      this.groupFilter.UserCount = !this.groupFilter.UserCount;
      this.groupFilter.TemplateCount = false;

      this.groupFilter.filterOn = 'UserCount';
      if (this.groupFilter.UserCount) {
        this.groupFilter.order = 'asc';
      } else {
        this.groupFilter.order = 'desc';
      }
    }

    if (type == 'TemplateCount') {
      this.groupFilter.Name = false;
      this.groupFilter.UserCount = false;
      this.groupFilter.TemplateCount = !this.groupFilter.TemplateCount;

      this.groupFilter.filterOn = 'TemplateCount';
      if (this.groupFilter.TemplateCount) {
        this.groupFilter.order = 'asc';
      } else {
        this.groupFilter.order = 'desc';
      }
    }

    this.groupFilter.skip = 0;

    this.groupsList();
  }

  searchGroup(value) {
    if (value.length > 0) {
      this.groupFilter.skip = 0;
      this.groupFilter.search = value;
      this.groupsList();
    } else {
      this.groupFilter.skip = 0;
      this.groupFilter.search = '';
      this.groupsList();
    }
  }

  statusGroup(event) {
    console.log('event ::----', event);
    if (event >= 0) {
      this.groupFilter.status = event;
      this.groupsList();
    } else {
      this.groupFilter.status = event;
      this.groupsList();
    }
  }

  createGroup() {
    this.groupSubmitted = true;
    this.spinner.show();
    this.groupModel.AccountId = this.accountNumber;
    console.log('selected grp id---', this.selectedGrpId);
    if (this.newgroupform.valid) {
      let req = {
        Name: this.newgroupFormControl.groupname.value,
        AccountId: this.accountNumber,
      };
      this.settings.createGroup(req).subscribe(
        (res) => {
          this.spinner.hide();
          if (res.WasSuccessful) {
            console.log('create grp ===', res);
            this.Message = res.Messages;
            this.invited = true;
            setTimeout(() => {
              this.invited = false;
            }, 5000);
            this.groupsList();
            this.resetGroupForm();
            this.createGrpModel = false;
            this.groupListbyId();
          }
        },
        (error) => {
          this.spinner.hide();
          console.log('error', error);
          this.alertService.error(error.Messages);
        }
      );
    } else {
      this.alertService.error('Invalid Form !!');
      this.spinner.hide();
      return;
    }
  }

  editGroup() {
    console.log('update grp');
    if (this.selectedGrpId) {
      if (this.editgroupform.valid) {
        let req = {
          Id: this.selectedGrpId,
          Name: this.editgroupFormControl.e_groupname.value,
          AccountId: this.accountNumber,
        };
        this.settings.editGroup(req).subscribe(
          (res) => {
            this.spinner.hide();
            if (res.WasSuccessful) {
              console.log('update grp ===', res);
              this.Message = res.Messages;
              this.invited = true;
              setTimeout(() => {
                this.invited = false;
              }, 5000);
              this.groupsList();
              this.editGrpModel = false;
            }
          },
          (error) => {
            this.spinner.hide();
            console.log('error', error);
            this.alertService.error(error.Messages);
          }
        );
      } else {
        this.alertService.error('Invalid Form !!');
        this.spinner.hide();
        return;
      }
    } else {
      console.log('edit form-----', this.selectedGrpId);
      this.selectedGrpId = null;
      this.spinner.hide();
    }
  }

  resetGroupForm() {
    this.groupSubmitted = false;
    this.newgroupform.reset();
  }
  deleteGroup(id) {
    this.spinner.show();
    this.settings.deleteGroup(id).subscribe(
      (res) => {
        console.log('delete res---', res);
        this.spinner.hide();
        this.groupsList();
      },
      (error) => {
        this.spinner.hide();
        console.log('error', error);
        this.alertService.error(error.Messages);
      }
    );
  }
  activateGroup(id) {
    this.spinner.show();
    this.settings.activateGroup(id).subscribe(
      (res) => {
        console.log('activ res---', res);
        this.spinner.hide();
        this.groupsList();
      },
      (error) => {
        this.spinner.hide();
        console.log('error', error);
        this.alertService.error(error.Messages);
      }
    );
  }

  inActivateGroup(id) {
    this.spinner.show();
    this.settings.inActivateGroup(id).subscribe(
      (res) => {
        console.log('deactive res---', res);
        this.spinner.hide();
        this.groupsList();
      },
      (error) => {
        this.spinner.hide();
        console.log('error', error);
        this.alertService.error(error.Messages);
      }
    );
  }

  firstCharecter(str) {
    if (str) {
      return String(str).charAt(0);
    } else {
      return null;
    }
  }

  toggleSidebar() {
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');
  }

  loadScript() {
    setTimeout(() => {
      $('.user-accordion-sec .accordion-item .accordion-trigger').click(
        function (e) {
          e.preventDefault();
          var $this = $(this);

          if ($this.next().hasClass('accordion-open')) {
            $this.next().removeClass('accordion-close');
            $this.next().slideUp(350);
          } else {
            $this
              .parent()
              .parent()
              .find('.user-accordion-sec .accordion-item .accordion-trigger')
              .removeClass('accordion-open');
            $this
              .parent()
              .parent()
              .find('.user-accordion-sec .accordion-item .accordion-trigger')
              .slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideToggle(350);
          }
        }
      );
    }, 300);
  }
  closeUserScreen() {
    this.newuserformsubmitted = false;
    this.newuserform.reset();
    this.newform_anim = false;
    setTimeout(() => {
      this.newform_vis = false;
    }, 300);
  }

  closeEditOrViewUserScreen() {
    this.edituserformsubmitted = false;
    this.edituserform.reset();
    this.edituserform_anim = false;
    setTimeout(() => {
      this.edtUsr = false;
      this.viewUser = false;
    }, 300);
  }
  openNewUser() {
    this.newuserformsubmitted = false;
    this.newuserform.reset();
    this.newform_anim = true;
    this.newform_vis = true;
    this.GroupsArrayInvite = [1];
  }

  // EmailBuilder Intialize
  initializeEmailBuilderLink(controls) {
    controls.initialize();
    this.emailBuilderEditor = controls.getEditor();
  }

  insertPageBreaker() {
    FroalaEditor.DefineIcon('pageBreaker', { NAME: 'pageBreaker', SVG_KEY: 'pageBreaker' });
    FroalaEditor.RegisterCommand('pageBreaker', {
      title: 'Insert Page Break',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function () {
        this.html.insert(`<p style="page-break-before: always"></p>`);
      },
    });
  }

  addClass(event){
    this.toggle = !this.toggle;
  }
  addClassTg(event){
    this.toggleShow = !this.toggleShow;
  }
}
