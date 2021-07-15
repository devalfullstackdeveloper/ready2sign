import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/core/service/document.service';
import { AlertService } from '../../../core/service/alert.service';
import { SettingsService } from '../../../core/service/settings.service';
import { AuthenticationService } from '../../../core/service/authentication.service';
import { DatePickerComponent, DatePickerDirective, IDatePickerConfig } from 'ng2-date-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { saveAs } from 'file-saver';

import * as jsPDF from 'jspdf';

import { NgxSpinnerService } from "ngx-spinner";
import { transition, style, animate, trigger } from '@angular/animations';
declare var $: any;

@Component({
  selector: 'app-sent-document',
  templateUrl: './sent-document.component.html',
  styleUrls: ['./sent-document.component.css'],
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
export class SentDocumentComponent implements OnInit {

  accountNumber: Number = Number(JSON.parse(localStorage.getItem('acccountNumber')))
  companyProfileData: any = {};

  selectedSection: string = 'Activity';
  withdrawModelOpen: Boolean = false;
  withdrawModelOpen_anim: Boolean = false;
  rejectModelOpen: Boolean = false;
  rejectModelOpen_anim: Boolean = false;
  approveModelOpen: Boolean = false;
  expireDate: Boolean = false;
  documentId
  sendDocumentDetails: any = {};
  createDoc: any = {};
  approveBtn: Boolean = false;
  rejectBtn: Boolean = false;
  withdrawBtn: Boolean = false;
  userProfile: any = {}
  userAccounts: any = [];
  selectedaccount = '';
  documentContent: any = '';
  ExpireDate: any;

  loginUserPartyData: any;

  editPartyIndex: any = 0
  updateParty: any = {
    DocumentPartyId: 0,
    email: '',
    Phone: ''
  }
  YY_MM_DD_config: IDatePickerConfig = {
    format: 'YYYY-MM-DD'
  }
  docData: any = {
    DocumentId: null,
    PartyId: null,
    Message: ""
  };

  constructor(
    private authenticationService: AuthenticationService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private settings: SettingsService,
    private router: Router,
    private alert: AlertService,
    private spinner: NgxSpinnerService
  ) {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.documentId = params['id'];
        this.constructorFunctionCall();
      }
    })
  }

  ngOnInit(): void {
    this.authenticationService.getActiveAccountNumber().subscribe(data => {
      this.accountNumber = data;

      this.getAccount()
    })
  }

  async constructorFunctionCall() {

    // New Api for content
    await this.getDocumentContent();

    await this.getUserProfile();

    this.getDocumentDetails();

    this.getAccount();
  }

  getUserProfile() {
    return new Promise(resolve => {
      this.authenticationService.getUserProfile().subscribe(res => {
        this.userProfile = res;
        resolve(res)
      }, error => {
        resolve(null)
      })
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


  selectSection(section) {
    this.selectedSection = section;
    this.loadScript();
  }
  // ---------------approve document---------------
  approveDocument() {
    let approver = this.sendDocumentDetails.Parties.find(x => {
      if (x.PartyTypeId == 8 && (x.UserId == this.userProfile.Id)) {
        return x;
      }
    })

    if (approver && approver.Id) {
      this.docData.DocumentId = Number(this.documentId);
      this.docData.PartyId = approver.Id;

      // this.spinner.show()
      this.documentService.approveDocument(this.docData).subscribe(res => {
        this.spinner.hide()
        if (res.WasSuccessful == true) {
          this.alert.successPage(res.Messages);
          this.docData = {
            DocumentId: null,
            PartyId: null,
            Message: ""
          };
          this.router.navigate(['/admin/home']);
        }
      }, error => {
        this.spinner.hide()
        this.alert.error(error.Message)
      })
    }
    else {
      this.alert.error('Party id not found')
    }
  }


  // -------------------------withdraw model------------------------
  openWithdrawModel() {
    this.withdrawModelOpen = true;
    this.withdrawModelOpen_anim = true;
  }

  closeWithdrawModel() {
    this.withdrawModelOpen_anim = false;
    this.docData = {
      DocumentId: null,
      PartyId: null,
      Message: ""
    };
    setTimeout(() => { this.withdrawModelOpen = false; }, 300);
  }


  // ----------------------- Approve Model ---------------
  openApproveModel() {
    this.approveModelOpen = !this.approveModelOpen
  }

  closeApproveModel() {
    this.approveModelOpen = !this.approveModelOpen
    this.docData = {
      DocumentId: null,
      PartyId: null,
      Message: ""
    };
  }

  // -------------------------Reject model------------------------
  openRejectModel() {
    this.rejectModelOpen = true;
    this.rejectModelOpen_anim = true;
  }

  closeRejectModel() {
    this.rejectModelOpen_anim = false;
    this.docData = {
      DocumentId: null,
      PartyId: null,
      Message: ""
    };
    setTimeout(() => { this.rejectModelOpen = false; }, 300);
  }

  // ----------------------change expiry date------------------------------
  changeExpiryDate() {
    if (this.sendDocumentDetails.StatusId !== 4) {
      // this.expireDate = !this.expireDate;

      if (!this.expireDate) {
        this.expireDate = true
      } else {

        let data = {
          // partyId : (this.loginUserPartyData && this.loginUserPartyData.Id) ? this.loginUserPartyData.Id : null,
          id: this.sendDocumentDetails.Id,
          ExpiryDate: this.ExpireDate,
          CreatedBy: this.sendDocumentDetails.CreatedBy,
          ModifiedBy: this.sendDocumentDetails.ModifiedBy,
          ModifiedOn: this.sendDocumentDetails.ModifiedOn,
          CreatedOn: this.sendDocumentDetails.ModifiedOn,
        }
        this.spinner.show()
        this.documentService.editExpityDateofDocument(data).subscribe(async res => {
          this.spinner.hide()
          this.expireDate = false;

          // New Api for content
          await this.getDocumentContent();

          this.getDocumentDetails();
        }, error => {
          this.spinner.hide()
          this.alert.error(error.Message)
        })
      }
    }
  }

  dateChange(event) {
    this.ExpireDate = event
    // let data = {
    //   id:this.sendDocumentDetails.Id,
    //   ExpiryDate: this.ExpireDate
    // }
    // this.spinner.show()
    // this.documentService.editExpityDateofDocument(data).subscribe(res=>{
    //   this.spinner.hide()
    //   console.log("update ---",res);
    //   this.expireDate = !this.expireDate;
    //   this.getDocumentDetails();
    // },error => {
    //   this.spinner.hide()
    //   this.alert.error(error.Message)
    // })
  }

  //Load script
  loadScript() {
    setTimeout(() => {
      $(document).ready(() => {
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

  withdrwDoc() {
    this.docData.DocumentId = Number(this.documentId);
    this.docData.DocumentPartyId = this.sendDocumentDetails.SenderId;
    this.docData.PartyId = (this.loginUserPartyData && this.loginUserPartyData.Id) ? this.loginUserPartyData.Id : null;
    this.spinner.show()
    this.documentService.withdrawDocument(this.docData).subscribe(res => {
      this.spinner.hide()
      if (res.WasSuccessful == true) {
        this.alert.successPage(res.Messages);
        this.router.navigate(['/withdraw-thank-you']);
      }
    }, error => {
      this.spinner.hide()
      this.alert.error(error.Message)
    })
  }

  // -------------- reject document --------------
  rejectDoc() {

    var matchedParty = this.sendDocumentDetails.Parties.find(party => {
      if(party.UserId == this.userProfile.Id){
        return party
      }
    })



    this.docData.DocumentId = Number(this.documentId);
    this.docData.DocumentPartyId = this.sendDocumentDetails.SenderId;
    this.docData.PartyId = matchedParty ? matchedParty.Id : null
    this.spinner.show()
    this.documentService.rejectDocument(this.docData).subscribe(res => {
      this.spinner.hide()
      if (res.WasSuccessful == true) {
        this.alert.successPage(res.Messages);
        this.router.navigate(['/admin/home']);
      }
    }, error => {
      this.spinner.hide()
      this.alert.error(error.Message)
    })
  }

  // ---------------sign in person --------------------
  signInPerson(partyId) {
    this.router.navigate(['/sent-signin-person'], { queryParams: { 'Id': this.documentId, 'PartyId': partyId } });
  }

  //----------- Edit email and mobile number --------------
  editBtnClick(index, partyData) {
    this.updateParty = {
      DocumentPartyId: partyData.Id,
      // DocumentPartyId : partyData.PartyTypeId,
      email: partyData.Email,
      Phone: partyData.Mobile,
    }
    this.editPartyIndex = index
  }

  async UpdatePartyContact(partyData) {
    this.updateParty = {
      DocumentPartyId: partyData.Id,
      // DocumentPartyId : partyData.PartyTypeId,
      email: partyData.Email,
      Phone: partyData.Mobile,
    }
    if (!this.updateParty.email || !this.updateParty.Phone) {
      this.alert.error("Please enter email and mobile")
    } else {
      this.spinner.show();
      this.documentService.updatePartyContact(this.updateParty).subscribe(async res => {
        // this.spinner.hide()
        this.alert.successPage("")

        // New Api for content
        await this.getDocumentContent();

        this.getDocumentDetails();
        this.resetUpdatePartyForm();
      }, error => {
        this.spinner.hide()
        this.alert.error(error.Message)
      })
    }
  }

  resetUpdatePartyForm() {
    this.updateParty = {
      DocumentPartyId: 0,
      email: '',
      Phone: ''
    }

    this.editPartyIndex = 0
  }

  cancelPartyContact() {
    this.editPartyIndex = 0
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 43 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  //Api Calls
  getDocumentDetails() {
    this.spinner.show()
    this.documentService.getSendDocument(this.documentId).subscribe(res => {
      this.spinner.hide()
      this.sendDocumentDetails = res;
      this.sendDocumentDetails.Content = this.documentContent
      // console.log('this.sendDocumentDetails', JSON.stringify(this.sendDocumentDetails));
      if (!res.DocumentExpiryDaysLeft) {
        this.alert.error('This document has been expired');
      }

      let Parties = this.sendDocumentDetails.Parties.sort((a, b) => {

        if (a.Order > b.Order) {
          return 1;
        } else if (a.Order < b.Order) {
          return -1;
        } else {
          return 0;
        }
      })


      this.sendDocumentDetails.Parties = Parties

      // if(this.sendDocumentDetails.ExpiryDates.length > 0){
      //   let expiryLength = this.sendDocumentDetails.ExpiryDates.length
      //   this.ExpireDate = this.sendDocumentDetails.ExpiryDates[expiryLength - 1].ExpiryDate
      // }

      if (this.sendDocumentDetails.DocumentExpiryDate) {
        this.ExpireDate = this.sendDocumentDetails.DocumentExpiryDate
      }


      // if (res.Content) {
      if (this.documentContent) {
        // document.getElementById('showContent').setAttribute("src",res.Content)

        setTimeout(() => {

          let docs = new jsPDF('p', 'pt', 'a4');
          var width = docs.internal.pageSize.getWidth();
          var height = docs.internal.pageSize.getHeight();
          // docs.fromHTML(res.Content, 15, 15, {
          //   'width': width - 20,
          //   'height': height - 20
          // });
          docs.fromHTML(this.documentContent, 15, 15, {
            'width': width - 20,
            'height': height - 20
          });

          var blobPDF = new Blob([docs.output('blob')], { type: 'application/pdf' });
          var blobUrl = URL.createObjectURL(blobPDF)

          // document.getElementById('showContent').setAttribute("src", blobUrl)

        }, 200)
      }

      // console.log("---- Sender User ID :-----", this.sendDocumentDetails.SenderUserId);
      // console.log("---- Login User Profile Id ::--", this.userProfile.Id);

      if (this.userProfile.Id == this.sendDocumentDetails.SenderUserId) {

        this.loginUserPartyData = this.sendDocumentDetails.Parties.find(x => {
          if (x.UserId == this.userProfile.Id) {
            return x
          }
        })

        this.withdrawBtn = true
      }
      else {

        let allUser = this.sendDocumentDetails.Parties.filter(x => {
          if (x.PartyTypeId == 8) {
            return x;
          }
        })

        // console.log("All Users ----", allUser)

        this.loginUserPartyData = allUser.find(x => {
          if (x.UserId == this.userProfile.Id) {
            return x
          }
        })

        // console.log("Matched User----", this.loginUserPartyData)

        if(this.loginUserPartyData && (this.loginUserPartyData.Status == 10)){
          this.approveBtn = true;
        }
      }
      this.setDocumentData();
    }, error => {
      this.spinner.hide()
      this.alert.error(error.error.Message)
    })
  }

  getDocumentContent(){
    return new Promise((resolve) => {
      this.documentService.getDocumentContent(this.documentId).subscribe(res => {
        this.documentContent = res.Content
        resolve(res)
      },error => {
        resolve(null)
      })
    })

  }

  printDocument() {
    window.frames["showContent"].print();
  }

  setDocumentData() {
    this.createDoc = {
      Title: this.sendDocumentDetails.Title
    }
  }

  toggleSidebar() {
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');
  }

  resendDocument(partyId, documentId){
    this.documentService.resendDocument(documentId, partyId).subscribe(res => {
      this.alert.successPage(res.Messages);
    })
  }

  downloadDocument(documentId){
    this.spinner.show()
    this.documentService.downloadDocument(documentId).subscribe(res => {
      this.spinner.hide()
      const byteArray = new Uint8Array(atob(res.FileStream._buffer).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      saveAs(url,this.sendDocumentDetails.DocumentNumber)
    },error => {
      this.spinner.hide()
    })
  }
}
