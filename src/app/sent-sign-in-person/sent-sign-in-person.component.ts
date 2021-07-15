import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';
// import { DocumentService } from '../core/service/document.service';
import { AlertService } from '../core/service/alert.service';
// import { SettingsService } from '../core/service/settings.service';
import { AuthenticationService } from '../core/service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { transition, style, animate, trigger } from '@angular/animations';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import {DatePickerComponent, DatePickerDirective, IDatePickerConfig} from 'ng2-date-picker';
import * as moment from "moment";
import * as jsPDF from 'jspdf';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import domtoimage from 'dom-to-image';
import { MediaObserver } from '@angular/flex-layout';
import { CONSTANTS } from 'src/common/constants';
import { countrys } from 'src/common/countrys'
declare var $: any;

@Component({
  selector: 'app-sent-sign-in-person',
  templateUrl: './sent-sign-in-person.component.html',
  styleUrls: ['./sent-sign-in-person.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('500ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ],
  // encapsulation : ViewEncapsulation.Emulated
})
export class SentSignInPersonComponent implements OnInit, OnDestroy {
  countrys: any = countrys
  constant = CONSTANTS
  @ViewChild('signatureCanvas', {static: false}) signaturePad: SignaturePad;
  @ViewChild('initialSignatureCanvas', {static: false}) initialSignaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 330,
    'canvasHeight': 95,
    'border-width':1
  };

  initialSignaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 220,
    'canvasHeight': 95,
    'border-width':1
  };

  @ViewChild('dayPicker') datePicker: DatePickerComponent
  open() { this.datePicker.api.open(); }
  close() { this.datePicker.api.close(); }

  percentage = 0

  YY_MM_DD_config : IDatePickerConfig ={
    format:'YYYY-MM-DD',
    openOnFocus : true,
    // openOnClick : true
  }

  MM_DD_YY_config : IDatePickerConfig ={
    format:'MM-DD-YYYY',
    openOnFocus : true,
    // openOnClick : true
  }

  DD_MM_YY_config : IDatePickerConfig ={
    format:'DD-MM-YYYY',
    openOnFocus : true,
    // openOnClick : true
  }

  linkFrom = "";

  selected : any = 1;
  initialSelected : any = 1;
  public _signature: any = null;
  showDiv = "document";
  showSignDocument  : Boolean = false;
  show_sign_document_anim : Boolean = false;

  showUploadDocument : Boolean = false;
  show_upload_document_anim : Boolean = false;

  withdrawModelOpen : Boolean = false;
  withdrawModelOpen_anim : Boolean = false;
  withdrawnMessage  = "";

  divType = 'draw';
  finishModelShow : Boolean = false;
  documentId : any = null;
  partyId : any = null;
  documentData : any = {};

  SignaturerName

  disabledFileDrop = false

  partyData : any = {}
  partyExist = false

  detailForm : any = {};

  createDoc : any = {};

  HasInitial = false;
  HasInitialText = "";

  smsVerification = false;
  otpSent = false
  otpSentTime = moment().format('hh:mm a, DD MMMM YYYY')
  verifiedOtp = false
  OTP = ""

  // webCam Config
  public showWebcam = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  //Show WebCam
  showWebCamdriverLicenceFront = false
  showWebcamdriverLicenceBack = false;

  showWebcamhealthCardFront = false;
  showWebcamhealthCardBack = false;

  showWebcampassportFront = false;

  //Uploaded Image
  driverLicenceFront : any = "";
  driverLicenceBack : any = "";

  healthCardFront : any = "";
  healthCardBack : any = "";

  passportFront : any = "";
  passportBack : any = "";

  latestDoc : any;

  signature;
  initialSignature;
  uploadedSignature;

  senderData : any = {};
  // partyData : any = {};

  isMobile = false

  progressCalculationIntervalId
  constructor(
    private authenticationService:AuthenticationService,
    // private documentService : DocumentService,
    private alertService: AlertService,
    // private settingsService : SettingsService,
    private router : Router,
    private spinner: NgxSpinnerService,
    private media: MediaObserver,
    private route: ActivatedRoute) {
      this.media.media$.subscribe(res => {
        if(res.mqAlias == 'xs' || res.mqAlias == 'sm'){
          this.isMobile = true
        }else{
          this.isMobile = false
        }
      })
     }

  ngOnInit(): void {

    this.route.queryParamMap
      .subscribe((params) => {
        this.documentId = Number(params['params'].Id);
        this.partyId = Number(params['params'].PartyId);
        this.linkFrom = params['params'].from

        if(this.linkFrom){

        }
        this.getDocument();
      }
    );

    this.progressCalculationIntervalId = setInterval(() => {
      this.progressCalculation();
    },1000)
  }

  ngOnDestroy() {
    if(this.progressCalculationIntervalId){
      clearInterval(this.progressCalculationIntervalId);
    }
  }

  async opensignInModel(){
    this.latestDoc = {
      Id : this.documentData.Id ? this.documentData.Id : 0,
      DocumentNumber : this.documentData.DocumentNumber ? this.documentData.DocumentNumber : '',
      AccountId : this.documentData.AccountId,
      Title : this.createDoc.Title,
      Property : this.createDoc.Property,
      Tenancy : this.createDoc.Tenancy,
      Groups : this.createDoc.Groups,
      ExpiryDays : this.documentData.ExpiryDays,
      ExpiryDate : this.documentData.ExpiryDate ? this.documentData.ExpiryDate : '',
      IsDraft : this.documentData.IsDraft ? true : false,
      IsLinked: this.documentData.IsLinked ? this.documentData.IsLinked : false,
      IsSent : true,
      Reminders : this.documentData.Reminders,
      Content : this.documentData.Content,
      Attachments : this.documentData.Attachments,
      // EmailBuilder : this.documentData.EmailBuilder ? this.documentData.EmailBuilder : null,
      EmailBuilder : this.createDoc.EmailBuilder ? this.createDoc.EmailBuilder : {Subject :'',Body:''},
      Sections : this.documentData.Sections,
      Parties : [],

      //Set Other Field
      CreatedBy: this.documentData.CreatedBy,
      CreatedOn: this.documentData.CreatedOn,
      PartyTypeId : this.documentData.PartyTypeId,
      SendDetail: this.documentData.SendDetail,
    }

    for(var i=0; i < this.documentData.Parties.length; i++){
      // let party = this.documentData.Parties[i]
      let PartyFields = this.documentData.Parties[i].PartyFields
      let TemplateFields = this.documentData.Parties[i].TemplateFields

      for(var j=0; j < this.documentData.Parties[i].CustomFields.length;j++){
        if(this.createDoc[`${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`]){
          this.documentData.Parties[i].CustomFields[j].Value = this.createDoc[`${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`]
        }
      }

      let CustomFields = this.documentData.Parties[i].CustomFields

      let party = this.documentData.Parties[i]
      delete party.PartyFields
      delete party.TemplateFields
      delete party.CustomFields

      party.Fields = []
      party.CustomFields = CustomFields
      party.DocumentPartyContact = []
      if(this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]){
        let docCustomPartyContactDetails = this.createDoc[`${this.documentData.Parties[i].PartyName}-details`];
        if(!docCustomPartyContactDetails.FirstName || !docCustomPartyContactDetails.LastName ||
          !docCustomPartyContactDetails.Email){

        }else{
          party.DocumentPartyContact.push(this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]);
        }
      }
      this.latestDoc.Parties.push(party)
    }


    // //Update Data In Content
    // this.latestDoc.Content = this.setFieldInFroala();

    if(this.partyData.ProofOfIdentity){
      this.showUploadDocument = true;
      this.show_upload_document_anim = true;
    }else{

      // this.showSignDocument = true
      // this.show_sign_document_anim = true

      // Edit Document
      let updated = await this.updateDocument();

      if(updated){
        if(this.partyData.ProofOfIdentity){
          this.showUploadDocument = true;
          this.show_upload_document_anim = true;
        }else{
          this.showSignDocument = true
          this.show_sign_document_anim = true
        }
      }else{
        this.showSignDocument = true
        this.show_sign_document_anim = true
      }

      // // Edit API
      // this.spinner.show()
      // this.authenticationService.editDocument(this.latestDoc).subscribe(res => {
      //   this.spinner.hide()
      //   console.log("Edit Api Response---",res);
      //   if(res.WasSuccessful){

      //     if(this.partyData.ProofOfIdentity){
      //       this.showUploadDocument = true;
      //       this.show_upload_document_anim = true;
      //     }else{
      //       this.showSignDocument = true
      //       this.show_sign_document_anim = true
      //     }
      //   }
      // },error => {
      //   this.spinner.hide()
      //   console.log("Edit Api Error---",error);
      //   this.alertService.error(error.Message)
      // })
    }
  }

  setFieldInFroala(){
    var doc = new DOMParser().parseFromString(this.documentData.Content, "text/html");
    // var doc = this.editor.html.get()
    let froalaPartysFields = doc.getElementsByClassName("partyFields");
    let froalaCustomPartysFields = doc.getElementsByClassName("customFields");

    for(var i=0; i <froalaPartysFields.length;i++){
      let dir_str = froalaPartysFields[i].attributes['dir'].value;
      let spl_dir = dir_str.split("-%n%-");

      if(spl_dir[0] && spl_dir[1]){
        let partyData = this.documentData.Parties.find(p_field => {
          if(p_field.UUID == spl_dir[0]){
            return p_field
          }
        })
        if(partyData){
          let froalaFieldId = ''
          let fieldValue = ''
          let isImage = false

          // First Name
          if(spl_dir[1] == 12){
            froalaFieldId = partyData.PartyName+'-'+'First Name'
            fieldValue = partyData.DocumentPartyContact[0] ? partyData.DocumentPartyContact[0].FirstName : ''
          }

          // Last Name
          if(spl_dir[1] == 13){
            froalaFieldId = partyData.PartyName+'-'+'Last Name'
            fieldValue = partyData.DocumentPartyContact[0] ? partyData.DocumentPartyContact[0].LastName : ''
          }

          // Email
          if(spl_dir[1] == 14){
            froalaFieldId = partyData.PartyName+'-'+'Email'
            fieldValue = partyData.DocumentPartyContact[0] ? partyData.DocumentPartyContact[0].Email : ''
          }

          // Mobile
          if(spl_dir[1] == 15){
            froalaFieldId = partyData.PartyName+'-'+'Mobile'
            fieldValue = partyData.DocumentPartyContact[0] ? partyData.DocumentPartyContact[0].Phone : ''
          }

          //Company
          if(spl_dir[1] == 16){
            froalaFieldId = partyData.PartyName+'-'+'Company'
            fieldValue = partyData.DocumentPartyContact[0] ? partyData.DocumentPartyContact[0].Company : ''
          }

          //Position
          if(spl_dir[1] == 17){
            froalaFieldId = partyData.PartyName+'-'+'Position'
            fieldValue = partyData.DocumentPartyContact[0] ? partyData.DocumentPartyContact[0].Position : ''
          }

          //Phone
          if(spl_dir[1] == 18){
            froalaFieldId = partyData.PartyName+'-'+'Phone'
            fieldValue = ''
          }

          // Signature
          if(spl_dir[1] == 19){
            froalaFieldId = partyData.PartyName+'-'+'Signature'
            isImage = true;
            fieldValue = ''
            if(partyData.UUID == spl_dir[0] && partyData.Id == this.partyId){
              // fieldValue = this.uploadedSignature;

              if(!this.uploadedSignature && this.signature){
                fieldValue = URL.createObjectURL(this.signature);
              }

              if(this.uploadedSignature){
                fieldValue = this.uploadedSignature;
              }

              //field click open sign UI
              setTimeout(() => {
                var signTargetEl = document.getElementById(froalaFieldId)

                if(signTargetEl){
                  var sign_el = document.querySelectorAll(`[id='${froalaFieldId}']`);
                  let _this = this
                  for(var s_el = 0; s_el < sign_el.length; s_el++){
                    sign_el[s_el].addEventListener('click',function(e) {
                      // _this.opensignInModel()btn-next
                      // console.log("Button click");
                      if(_this.isMobile){
                        _this.loadScript();
                        setTimeout(() => {
                          document.getElementById('btn-next').click();
                        }, 300);
                      }else {
                        document.getElementById('btn-next').click();
                      }
                    })
                  }
                }
              }, 500);

            }
            // fieldValue = 'https://readytosign.blob.core.windows.net/signature/83a38fcb-a0b4-44fe-82a4-db86fd8d2985-.png'
          }

          // Home Phone
          if(spl_dir[1] == 20){
            froalaFieldId = partyData.PartyName+'-'+'Home Phone'
            fieldValue = ''
          }

          // Work Phone
          if(spl_dir[1] == 21){
            froalaFieldId = partyData.PartyName+'-'+'Work Phone'
            fieldValue = ''
          }

          // Physical Address
          if(spl_dir[1] == 22){
            froalaFieldId = partyData.PartyName+'-'+'Physical Address'
            fieldValue = ''
          }

          //Update Value In Froala
          if(froalaFieldId && fieldValue){
            if(!isImage){
              // doc.getElementById(froalaFieldId).innerHTML = fieldValue

              var elms = doc.querySelectorAll(`[id='${froalaFieldId}']`);
              for(var f = 0; f < elms.length; f++){
                elms[f].innerHTML = fieldValue;
              }
            }else{
              // var imageTag = `<img style="height: 10%; width: 15%;" src="${fieldValue}" />`
              // doc.getElementById(froalaFieldId).style.padding = '0px';
              // doc.getElementById(froalaFieldId).style.border = '0px'
              // doc.getElementById(froalaFieldId).innerHTML = imageTag

              var imageTag = `<img style="height: 49px; width: 179px; object-fit:cover;" src="${fieldValue}" />`;
              var elms : NodeListOf<Element> = doc.querySelectorAll(`[id='${froalaFieldId}']`);
              for(var t = 0; t < elms.length; t++){
                elms[t].setAttribute('style', 'background: none; padding: 0px; border: 0px');
                elms[t].innerHTML = imageTag;
              }
            }

          }
        }

      }

    }

    for(var j=0; j <froalaCustomPartysFields.length;j++){
      let dir_str = froalaCustomPartysFields[j].attributes['dir'].value;
      let spl_dir = dir_str.split("-%n%-");

      if(spl_dir[0] && spl_dir[1]){
        let partyData = this.documentData.Parties.find(p_field => {
          if(p_field.UUID == spl_dir[0]){
            return p_field
          }
        })
        if(partyData){
          let froalaFieldId = ''
          let fieldValue = ''
          let isImage = false
          let customClickEvent = false

          let customPartys = partyData.CustomFields.find(c_field => {
            if(c_field.FieldTypeId == spl_dir[1]){
              return c_field
            }else if(c_field.UUID == spl_dir[1]){
              return c_field
            }else{
              return undefined
            }
          })
          if(customPartys){
            froalaFieldId = partyData.PartyName+'-'+customPartys.Name
            fieldValue = customPartys.Value

            if(customPartys.FieldTypeId == this.constant.ImageFieldTypeId){
              isImage = true
            }

            //Click events for custom Field in froala
            if(partyData.Id == this.partyId){
              customClickEvent = true

              // doc.getElementById(froalaFieldId).addEventListener("click",(e) => {this.frFieldClickEvent(e)}, { capture: false });
              // console.log("::::: Event listner setted :::::")

              setTimeout(() => {
                var targetEl = document.getElementById(froalaFieldId)

                if(targetEl){
                  var tar_cust = document.querySelectorAll(`[id='${froalaFieldId}']`);
                  for(var tr_c = 0; tr_c < tar_cust.length; tr_c++){
                    let _this = this
                    tar_cust[tr_c].addEventListener('click',function(e) {
                      // alert("custom Field Click")
                      // e.preventDefault();
                      var findEl = document.getElementById(`${froalaFieldId}-custField`)

                      if(!$('.person-sec-right').hasClass('show_block') || _this.isMobile){
                        _this.loadScript();
                        setTimeout(() => {
                          findEl.scrollIntoView()
                          findEl.focus();
                        }, 300);
                      } else {
                        findEl.scrollIntoView()
                        findEl.focus();
                      }


                    })
                  }
                }
              }, 1000);

            }
          }

          if(froalaFieldId && fieldValue){
            if(!isImage){
              // doc.getElementById(froalaFieldId).innerHTML = fieldValue

              var cust_elms = doc.querySelectorAll(`[id='${froalaFieldId}']`);
              for(var ce = 0; ce < cust_elms.length; ce++){
                cust_elms[ce].innerHTML = fieldValue;

              }
            } else {
              // var imageTag = `<img style="height: 15%; width: 20%;" src="${fieldValue}" />`
              // doc.getElementById(froalaFieldId).style.padding = '0px';
              // doc.getElementById(froalaFieldId).style.border = '0px'
              // doc.getElementById(froalaFieldId).innerHTML = imageTag

              var imageTag = `<img style="height: 105px; width: 273px; object-fit:cover" src="${fieldValue}" />`;
              var cust_elms_i : NodeListOf<Element> = doc.querySelectorAll(`[id='${froalaFieldId}']`);
              for(var cei = 0; cei < cust_elms_i.length; cei++){
                cust_elms_i[cei].setAttribute('style', 'padding: 0px; border: 0px');
                cust_elms_i[cei].innerHTML = imageTag;
              }
            }

          }

        }
      }
    }

    // this.editor.html.set(doc.body.outerHTML);
    this.documentData.Content = doc.body.outerHTML
    //this.documentData.Content = doc.body

    if(this.documentData.Content){
      setTimeout(()=>{

        let docs = new jsPDF('p','pt', 'a4');
        var width = docs.internal.pageSize.getWidth();
        var height = docs.internal.pageSize.getHeight();
        docs.fromHTML(this.documentData.Content,15,15,{
          'width': width-25,
          'height':height-25
        });

        var blobPDF = new Blob([docs.output('blob')], { type : 'application/pdf'});
        var blobUrl = URL.createObjectURL(blobPDF)

        document.getElementById('showContent').setAttribute("src",blobUrl)
      },200)
    }

    return doc.body.outerHTML;
  }

  frFieldClickEvent(event){
  }

  closeModel(){
    this.signature = "";
    // this.SignaturerName=""
    this.show_sign_document_anim = false
    setTimeout (() => {
      this.showSignDocument = false;
    }, 300)

  }

  closeUploadDocumentModel(){
    this.show_upload_document_anim = false;
    setTimeout (() => {
      this.showUploadDocument = false;
    }, 300)
  }

  async openSignDocument(){

    var valid = false;

    if(this.partyData.DriverLicence && this.partyData.MedicalCard){
      if(this.driverLicenceFront && this.healthCardFront){
        valid = true;
      }
    }

    if(this.partyData.DriverLicence && this.partyData.Passport){
      if(this.driverLicenceFront && this.passportFront){
        valid = true;
      }
    }

    if(this.partyData.MedicalCard && this.partyData.Passport){
      if(this.healthCardFront && this.passportFront){
        valid = true;
      }
    }

    if(this.partyData.DriverLicence && !this.partyData.MedicalCard && !this.partyData.Passport){
      if(this.driverLicenceFront){
        valid = true;
      }
    }

    if(!this.partyData.DriverLicence && this.partyData.MedicalCard && !this.partyData.Passport){
      if(this.healthCardFront){
        valid = true;
      }
    }

    if(!this.partyData.DriverLicence && !this.partyData.MedicalCard && this.partyData.Passport){
      if(this.passportFront){
        valid = true;
      }
    }

    if(!valid){
      this.alertService.error('Please upload documents')
    } else {
      this.showSignDocument = true
      this.show_sign_document_anim = true

      var partyIndex = this.latestDoc.Parties.findIndex(x => x.Id == this.partyId);
      var partyData = this.latestDoc.Parties[partyIndex];

      if(partyData){
        partyData.DrivingLicenseFront = this.driverLicenceFront;
        partyData.DrivingLicenseBack = this.driverLicenceBack;

        partyData.HealthCardFront = this.healthCardFront;
        partyData.HealthCardBack = this.healthCardBack;

        partyData.PassportFront = this.passportFront;
        partyData.PassportBack = this.passportBack;

        this.latestDoc.Parties[partyIndex] = partyData;
      }

      // Edit Document
      this.spinner.show()
      let updated = await this.updateDocument();
      this.spinner.hide()

      if(updated){
        this.showSignDocument = true
        this.show_sign_document_anim = true
      }else{
        this.alertService.error("Document not updated")
      }


      // // Edit API
      // this.spinner.show()
      // this.authenticationService.editDocument(this.latestDoc).subscribe(res => {
      //   this.spinner.hide()
      //   console.log("Edit Api Response---",res);
      //   if(res.WasSuccessful){

      //     // if(this.partyData.ProofOfIdentity){
      //     //   this.showUploadDocument = true;
      //     //   this.show_upload_document_anim = true;
      //     // }else{
      //       this.showSignDocument = true
      //       this.show_sign_document_anim = true
      //     // }
      //   }
      // },error => {
      //   this.spinner.hide()
      //   console.log("Edit Api Error---",error);
      //   this.alertService.error(error.Message)
      // })
    }
  }

  toggleType(val){
    this.divType = val;

    this.signature = null;
    this.initialSignature = null;
  }

  async FinalSignDoc(){

    if(this.divType == 'type'){
      var node;
      var initialSignNode
      if(this.selected == 1){
        node = document.getElementById('type1Sign')
      }

      if(this.selected == 2){
        node = document.getElementById('type2Sign')
      }

      if(this.initialSelected == 1){
        initialSignNode = document.getElementById('initialType1Sign')
      }

      if(this.initialSelected == 2){
        initialSignNode = document.getElementById('initialType2Sign')
      }

      // convert dom to image
      if(node && this.SignaturerName){
        let blob : any = await this.convertDomToImage(node)
        const file = new File([blob], "signature.png",{ type: "image/png"})
        if(file){
          this.signature = file;
        }
      }

      // convert dom to image
      if(initialSignNode && this.HasInitialText){
        let initial_blob : any = await this.convertDomToImage(initialSignNode)
        const initial_file = new File([initial_blob], "initialSignature.png",{ type: "image/png"})
        if(initial_file){
          this.initialSignature = initial_file;
        }
      }
    }

    if(!this.signature){
      this.alertService.error("Please sign document")
    }else if(this.HasInitial && !this.initialSignature){
      this.alertService.error("Please add Initials");
    }else if(this.smsVerification && !this.verifiedOtp){
      this.alertService.error("Please verify your number")
    }else{

      // convertBlobToFile()

      var formData: any = new FormData();
      formData.append("file",this.signature)
      this.spinner.show()
      this.authenticationService.uploadFile(formData).subscribe(async res => {

        if(res && res.length > 0 && res[0].Url){
          this.uploadedSignature = res[0].Url;

          let signRequest = {
            DocumentId : this.documentId,
            PartyId : this.partyId,
            Code : this.OTP,
            SignUrl : res[0].Url
          }
          // this.spinner.hide()
          // await this.setFieldInFroala();

          // Edit Document
          let updated = await this.updateDocument();

          this.authenticationService.signDocument(signRequest).subscribe(signed => {
            this.spinner.hide()
            if(signed.WasSuccessful){
              this.alertService.successPage(signed.Messages);
              this.finishModel();
              setTimeout(() => {
                if(this.linkFrom){
                  this.router.navigate(['/thank-you']);
                }else{
                  this.router.navigate(['/admin/sentDocument',this.documentId])
                }

              }, 1500)
            }else{
              this.alertService.error("Something went wrong")
            }

          },error => {
            this.spinner.hide()
            this.alertService.error(error.Message)
          })
        }else{
          this.spinner.hide()
        }
      },error => {
        this.spinner.hide()
        this.alertService.error(error.Message)
      })
    }
  }

  convertDomToImage(node){
    return new  Promise((resolve) => {
      domtoimage.toBlob(node).then((blob) => {
        // var img = new Image();
        // img.src = dataUrl;
        resolve(blob);
      },error => {
        resolve(null);
      })
    })
  }

  finishModel(){
    this.finishModelShow = !this.finishModelShow;
  }

  drawComplete(type) {
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());

    if(type == 'signature'){
      fetch(this.signaturePad.toDataURL())
      .then(res => res.blob())
      .then(blob => {
        var formData: any = new FormData();
        const file = new File([blob], "signature.png",{ type: "image/png"})

        this.signature = file

        this.setFieldInFroala()
      })
    }

    if(type == 'initial'){
      fetch(this.initialSignaturePad.toDataURL())
      .then(res => res.blob())
      .then(blob => {
        var formData: any = new FormData();
        const file = new File([blob], "signature.png",{ type: "image/png"})

        this.initialSignature = file

        this.setFieldInFroala()
      })
    }



  }

  // For Withdrawn
  openWithdrawnModel(){
    if(this.documentData.IsSigned){
      this.alertService.error("You have already signed the document.")
    }else{
      this.withdrawModelOpen = true;
      this.withdrawModelOpen_anim = true;
    }
  }

  closeWithdrawModel(){
    this.withdrawnMessage = "";
    this.withdrawModelOpen_anim = false;
    setTimeout(() => {
      this.withdrawModelOpen = false;
    }, 300);
  }

  documentWithdrawn(){

    if(this.partyData && this.partyData.DocumentPartyContact && this.partyData.DocumentPartyContact[0]){
      let request = {
        DocumentId: this.documentId,
        DocumentPartyId: this.partyId,
        // PartyId: this.partyData.DocumentPartyContact[0].Id,
        Message: this.withdrawnMessage
      };

      this.authenticationService.withdrawnByRecipient(request).subscribe(res => {
        if(res.WasSuccessful == true) {
          this.alertService.successPage(res.Messages);
          this.closeWithdrawModel();
          this.router.navigate(['/withdraw-thank-you']);
        }
      },error => {
        this.alertService.error(error.Message)
      })
    }else{
      this.alertService.error("Document party id not found")
    }
  }

  // -----------------

  getDocument(){
    this.spinner.show();
    this.authenticationService.getDocumentDetailById(this.documentId, this.partyId).subscribe(res => {
      this.spinner.hide()
      this.documentData = res;
      res.IsExpired ? this.documentData.IsExpired = false : null
      if(res.IsExpired){
        this.alertService.error('This document has been expired');
      }

      if(res.IsSigned){
        this.alertService.error("You have already signed the document.")
      }

      this.setDocumentData();

      // find sign party details from partyList.
      let partyFound = this.documentData.Parties.find(party => {
        if(party.Id == this.partyId){
          return party
        }
      })


      var senderData =  this.documentData.Parties.find(party => {
        if(party.PartyTypeId == 9){
          this.senderData = party;
          return party
        }
      })

      if(senderData){
        let data: any = {};
        if(senderData && senderData.DocumentPartyContact[0]){
          data = senderData.DocumentPartyContact[0];
        }

        this.senderData = data;
      }

      if(partyFound){
        this.partyExist = true
        this.partyData = partyFound

        this.driverLicenceFront = partyFound.DrivingLicenseFront ? partyFound.DrivingLicenseFront : '';
        this.driverLicenceBack = partyFound.DrivingLicenseBack ? partyFound.DrivingLicenseBack : '';

        this.healthCardFront = partyFound.HealthCardFront ? partyFound.HealthCardFront : '';
        this.healthCardBack = partyFound.HealthCardBack ? partyFound.HealthCardBack : '';

        this.passportFront = partyFound.PassportFront ? partyFound.PassportFront : '';
        this.passportBack = partyFound.PassportBack ? partyFound.PassportBack : '';
      }

      for(var i=0; i < this.partyData.CustomFields.length; i++){
        if(this.partyData.CustomFields[i] && this.partyData.CustomFields[i].Value){
          this.detailForm[`${this.partyData.PartyName}-${this.partyData.CustomFields[i].Name}`] = this.partyData.CustomFields[i].Value
        }else{
          this.detailForm[`${this.partyData.PartyName}-${this.partyData.CustomFields[i].Name}`] = ""
        }
      }

      this.detailForm['FirstName'] = this.partyData.DocumentPartyContact[0].FirstName
      this.detailForm['LastName'] = this.partyData.DocumentPartyContact[0].LastName
      this.detailForm['Email'] = this.partyData.DocumentPartyContact[0].Email
      this.detailForm['Phone'] = this.partyData.DocumentPartyContact[0].Phone
      this.detailForm['Company'] = this.partyData.DocumentPartyContact[0].Company
      this.detailForm['Position'] = this.partyData.DocumentPartyContact[0].Position

      if(this.partyData.SMSVerificationRequired) {
        this.smsVerification = true;
      }

      if(this.partyData.HasInitial){
        this.HasInitial = true
      }

      if(this.partyData.DocumentPartyContact[0].FirstName || this.partyData.DocumentPartyContact[0].LastName){
        this.SignaturerName = this.partyData.DocumentPartyContact[0].FirstName+" "+ this.partyData.DocumentPartyContact[0].LastName
        this.divType = "type"
      }

      //
      if(this.partyData.CustomFields.length == 0){
        // if(this.partyExist && this.partyData.ProofOfIdentity && !this.documentData.IsExpired && !this.documentData.IsSigned) {
        //   this.showUploadDocument = true;
        //   this.show_upload_document_anim = true;
        // }else {
        //   this.showSignDocument = true
        //   this.show_sign_document_anim = true
        // }
        // this.loadScript()
        // this.opensignInModel();
      }

      // if(this.documentData.Content){
      //   setTimeout(()=>{

      //     let docs = new jsPDF('p','pt', 'a4');
      //     var width = docs.internal.pageSize.getWidth();
      //     var height = docs.internal.pageSize.getHeight();
      //     docs.fromHTML(this.documentData.Content,15,15,{
      //       'width': width-25,
      //       'height':height-25
      //     });

      //     var blobPDF = new Blob([docs.output('blob')], { type : 'application/pdf'});
      //     var blobUrl = URL.createObjectURL(blobPDF)

      //     document.getElementById('showContent').setAttribute("src",blobUrl)
      //   },200)
      // }
      // console.log("Form----",this.detailForm)
    },error => {
      this.spinner.hide()
      this.alertService.error(error.Message)
    })
  }


  setDocumentData(){
    this.createDoc = {
      Title: this.documentData.Title,
      Property : this.documentData.Property,
      Tenancy : this.documentData.Tenancy,
      Groups : this.documentData.Groups ? this.documentData.Groups : [],
      EmailBuilder : this.documentData.EmailBuilder ? this.documentData.EmailBuilder :{Subject :'',Body:''}
    }
    for(let i=0; i<this.documentData.Parties.length;i++){
      if(this.documentData.Parties[i].DocumentPartyContact[0]){
        this.createDoc[this.documentData.Parties[i].PartyName] = this.documentData.Parties[i].DocumentPartyContact[0].FirstName+" "+this.documentData.Parties[i].DocumentPartyContact[0].LastName

        this.createDoc[`${this.documentData.Parties[i].PartyName}-details`] = this.documentData.Parties[i].DocumentPartyContact[0]
        let partyDetails =this.createDoc[`${this.documentData.Parties[i].PartyName}-details`];
        if(!partyDetails.FirstName || !partyDetails.LastName || !partyDetails.Email || !partyDetails.Phone){
          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`].detailAdded = false
        }else{
          this.createDoc[`${this.documentData.Parties[i].PartyName}-details`].detailAdded = true
        }
      }else{
        this.createDoc[this.documentData.Parties[i].PartyName] = ""

        this.createDoc[`${this.documentData.Parties[i].PartyName}-details`] = {
          FirstName:'',
          LastName : '',
          Email : '',
          CountryCode: 'au',
          Phone : '',
          Position : '',
          Company : '',
          detailAdded : false
        };
      }

      for(var j=0; j < this.documentData.Parties[i].CustomFields.length; j++){
        if(this.documentData.Parties[i].CustomFields[j] && this.documentData.Parties[i].CustomFields[j].Value){
          this.createDoc[`${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`] = this.documentData.Parties[i].CustomFields[j].Value
        }else{
          this.createDoc[`${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`] = ""
        }

      }
    }

    if(this.documentData.Content){
      setTimeout(()=>{
        this.setFieldInFroala();
        let docs = new jsPDF('p','pt', 'a4');
        // let docs = new jsPDF({
        //   orientation: "landscape",
        //   unit: "cm",
        //   format: [2, 2, 2, 2]
        // });
        var width = docs.internal.pageSize.getWidth();
        var height = docs.internal.pageSize.getHeight();
        docs.fromHTML(this.documentData.Content,15,15,{
          'width': width-25,
          'height':height-25
        });

        var blobPDF = new Blob([docs.output('blob')], { type : 'application/pdf'});
        var blobUrl = URL.createObjectURL(blobPDF)
        // document.getElementById('showContent').setAttribute("src",blobUrl)


      },200)
    }
  }

  // -------------- send verification code --------------
  sendCode(){
    this.verifiedOtp = false
    var dialCode = '61';
    if(this.partyData && this.partyData.DocumentPartyContact && this.partyData.DocumentPartyContact[0]){

      if(this.partyData.DocumentPartyContact[0].CountryCode){
        this.countrys.find(country => {
          if(country.iso2 == this.partyData.DocumentPartyContact[0].CountryCode){
            dialCode = country.dialCode
          }
        })
      }
    }

    let data = {
      Id:this.documentId,
      PartyId:this.partyId,
      DialCode: `+${dialCode}`
    }
    this.spinner.show()
    this.authenticationService.sendVerificationCode(data).subscribe(res=>{
      this.otpSentTime = moment().format('hh:mm a, DD MMMM YYYY')
      this.spinner.hide()
      this.otpSent = true

      if(res.WasSuccessful){
        this.alertService.successPage(res.Messages);
      }
    },error => {
      this.spinner.hide()
      this.alertService.error(error.Message)
    })
  }
  // -------------- verify code --------------

  verifyCode(){
    if(this.OTP){
      let data = {
        Id:this.documentId,
        PartyId:this.partyId,
        code: this.OTP
        }

      this.spinner.show()
      this.authenticationService.verifyCode(data).subscribe(res=>{
        this.spinner.hide()
        this.verifiedOtp = true

        if(res.WasSuccessful){
          this.alertService.successPage(res.Messages);
        }
      },error => {
        this.spinner.hide()
        this.alertService.error(error.Message);
      })
    }else{
      this.alertService.error("Please Enter OTP");
    }
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
  }

  public clear(): void {
    this.signaturePad.clear();

    this.signature = null
  }

  public clearInitialSign(): void {
    this.initialSignaturePad.clear();

    this.initialSignature = null
  }
  styleSelected(val){
    this.selected = val;
  }

  styleSelectedForInitial(val){
    this.initialSelected = val;
  }


  convertNumberToXXX(number){
    var nw_number = number.replace(/\s/g,'')
    let numberLength = nw_number.length;
    if(numberLength > 6){
      let x_length = numberLength - 6;

      var char = "";
      while(char.length !== x_length){
        char += 'X'
      }
      nw_number = nw_number.substring(0, 0) + char + nw_number.substring(x_length)
      return nw_number
    } else {

      let x_length = numberLength / 2;
      var char = "";

      while(char.length !== x_length){
        char += 'X'
      }
      nw_number = nw_number.substring(0, 0) + char + nw_number.substring(x_length)
      return nw_number
    }
  }


  datePickerChange1(event, PartyName, customField, format){
    let nwDate = moment(event.date).format(format);
    this.createDoc[PartyName+'-'+customField] = nwDate

    this.datePicker.api.close();
  }

  datePickerChange2(event, PartyName, customField, format){
    let nwDate = moment(event.date).format(format);
    this.createDoc[PartyName+'-'+customField] = nwDate

    this.datePicker.api.close();
  }
  datePickerChange3(event, PartyName, customField, format){
    let nwDate = moment(event.date).format(format);
    this.createDoc[PartyName+'-'+customField] = nwDate

    this.datePicker.api.close();
  }

  changeCustomCheckValue(partyName, customFieldName, checkedValue, checkBoxName) {
    var checkedList = JSON.parse(this.createDoc[partyName+'-'+customFieldName]);

    if(checkedValue) {
      checkedList.push(checkBoxName);
      // console.log("Checked Values ::----",checkedList)
      this.createDoc[partyName+'-'+customFieldName] = JSON.stringify(checkedList)
    } else {
      let existIndex = checkedList.findIndex(x => x == checkBoxName)
      checkedList.splice(existIndex, 1);
      // console.log("Checked Values ::----",checkedList)
      this.createDoc[partyName+'-'+customFieldName] = JSON.stringify(checkedList)
    }
  }

  checkCheckBoxExist(partyName, customFieldName,checkBoxName){
    const checkedList = JSON.parse(this.createDoc[partyName+'-'+customFieldName]);

    var checkExist = checkedList.find(x => {
      if(x == checkBoxName) {
        return x;
      }
    });

    // console.log("check Exist ::----",checkBoxName,'::',checkExist);
    return checkExist ? true : false;
  }

  parseInJSON(data){
    return JSON.parse(data)
  }


  //------------- Web Cam Functions
  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public handleInitError(error: WebcamInitError, name): void {
    // this.errors.push(error);
    this[name]=false
    this.alertService.error(error.message)
  }

  public handleImage(webcamImage: WebcamImage,name): void {

    if(this.disabledFileDrop){
      this.disabledFileDrop = false
    }else{

      fetch(webcamImage.imageAsDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "signature.png",{ type: "image/png"})
          // this.driverLicenceFront = file
          // this.showWebcam = false

          var formData: any = new FormData();
          formData.append("file",file)
          this.spinner.show()
          this.authenticationService.uploadFile(formData).subscribe(res => {
            this.spinner.hide()

            if(res && res.length > 0 && res[0].Url){

              if(name == "driverLicenceFront"){

                this.driverLicenceFront = res[0].Url;
                this.showWebCamdriverLicenceFront = false;

              } else if (name == "driverLicenceBack") {

                this.driverLicenceBack = res[0].Url;
                this.showWebcamdriverLicenceBack = false;

              } else if (name == "healthCardFront") {

                this.healthCardFront = res[0].Url;
                this.showWebcamhealthCardFront = false;

              } else if (name == "healthCardBack") {

                this.healthCardBack = res[0].Url;
                this.showWebcamhealthCardBack = false;

              } else if (name == "passportFront") {

                this.passportFront = res[0].Url;
                this.showWebcampassportFront = false;

              }else{

              }

              // this.showWebcam = false
            }
          }, error => {
            this.spinner.hide()
            this.alertService.error(error.Message)
          })
      })
    }
  }

  async  uploadBrowseImage(files: NgxFileDropEntry[] , name){

    var formData: any = new FormData();
    if(files.length > 0){
      const droppedFile = files[0]

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = await droppedFile.fileEntry as FileSystemFileEntry;
        let fileDd: any = await this.getFile(fileEntry)

        if(fileDd.success){
          formData.append("file",fileDd.file);

          this.spinner.show()
          this.authenticationService.uploadFile(formData).subscribe(res => {
            this.spinner.hide()

            if(res && res.length > 0 && res[0].Url){

              if(name == "driverLicenceFront"){

                this.driverLicenceFront = res[0].Url;
                this.showWebCamdriverLicenceFront = false;

              } else if (name == "driverLicenceBack") {

                this.driverLicenceBack = res[0].Url;
                this.showWebcamdriverLicenceBack = false;

              } else if (name == "healthCardFront") {

                this.healthCardFront = res[0].Url;
                this.showWebcamhealthCardFront = false;

              } else if (name == "healthCardBack") {

                this.healthCardBack = res[0].Url;
                this.showWebcamhealthCardBack = false;

              } else if (name == "passportFront") {

                this.passportFront = res[0].Url;
                this.showWebcampassportFront = false;

              }else{

              }

              // this.showWebcam = false
            }
          }, error => {
            this.spinner.hide()
            this.alertService.error(error.Message)
          })
        }else{
          this.alertService.error(fileDd.message);
        }
      }else{
        this.alertService.error('Please upload image');
      }
    }
  }

  async getFile(fileEntry) {
    return new Promise(async(resolve) => {
      fileEntry.file(async (file: File) => {
          let validFileType = await this.isFileTypeAllowed(file.name);
          if(validFileType){
            let dd = {
              success : true,
              file : file,
              message : "",
            }
            resolve(dd)
          }else{
            let fileTypeError = {
              success : false,
              message : `${file.name} file is not image type`,
            }
            resolve(fileTypeError)
          }
      })
    })
  }

  isFileTypeAllowed(fileName: string) {
    let isFileAllowed = false;
    const allowedFiles = ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG'];
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
        for (const ext of allowedFiles) {
            if (ext === extension[0]) {
                isFileAllowed = true;
            }
        }
    }
    return isFileAllowed;
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId

    this.nextWebcam.next(directionOrDeviceId);
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  fileOver(){
    this.disabledFileDrop = true
  }

  fileLeave(){
    this.disabledFileDrop = false
  }

  takeSnapShot(name){
    // this.showWebcam = true
    this[name]= true;
  }

  progressCalculation(){
    var percent = 0;
    if (this.smsVerification) {

      // if(this.signature || this.SignaturerName){
      //   percent += 50
      // }

      // if(this.otpSent){
      //   percent += 25
      // }

      // if(this.verifiedOtp){
      //   percent += 25
      // }

      if(this.HasInitial){

        if(this.divType == 'type'){
          if(this.HasInitialText){
            percent += 25
          }

          if(this.SignaturerName){
            percent += 25
          }
        }else{
          if(this.initialSignature){
            percent += 25
          }

          if(this.signature){
            percent += 25
          }
        }


        if(this.otpSent){
          percent += 25
        }

        if(this.verifiedOtp){
          percent += 25
        }

      } else {
        if(this.divType == 'type'){

          if(this.SignaturerName){
            percent += 50
          }
        }else{

          if(this.signature){
            percent += 50
          }
        }

        if(this.otpSent){
          percent += 25
        }

        if(this.verifiedOtp){
          percent += 25
        }
      }

    } else {

      // if(this.signature || this.SignaturerName){
      //   percent += 100
      // }

      if(this.HasInitial){
        if(this.divType == 'type'){
          if(this.HasInitialText){
            percent += 50
          }

          if(this.SignaturerName){
            percent += 50
          }
        }else{
          if(this.initialSignature){
            percent += 50
          }

          if(this.signature){
            percent += 50
          }
        }
      } else {
        if(this.divType == 'type'){
          if(this.SignaturerName){
            percent += 100
          }
        }else{
          if(this.signature){
            percent += 100
          }
        }
      }
    }

    this.percentage = percent
  }


  updateDocument(){

    return new Promise((resolve) => {
      // this.latestDoc = {
      //   Id : this.documentData.Id ? this.documentData.Id : 0,
      //   DocumentNumber : this.documentData.DocumentNumber ? this.documentData.DocumentNumber : '',
      //   AccountId : this.documentData.AccountId,
      //   Title : this.createDoc.Title,
      //   Property : this.createDoc.Property,
      //   Tenancy : this.createDoc.Tenancy,
      //   Groups : this.createDoc.Groups,
      //   ExpiryDays : this.documentData.ExpiryDays,
      //   ExpiryDate : this.documentData.ExpiryDate ? this.documentData.ExpiryDate : '',
      //   IsDraft : this.documentData.IsDraft ? true : false,
      //   IsSent : true,
      //   Reminders : this.documentData.Reminders,
      //   Content : this.documentData.Content,
      //   Attachments : this.documentData.Attachments,
      //   // EmailBuilder : this.documentData.EmailBuilder ? this.documentData.EmailBuilder : null,
      //   EmailBuilder : this.createDoc.EmailBuilder ? this.createDoc.EmailBuilder : {Subject :'',Body:''},
      //   Sections : this.documentData.Sections,
      //   Parties : [],

      //   //Set Other Field
      //   CreatedBy: this.documentData.CreatedBy,
      //   CreatedOn: this.documentData.CreatedOn,
      //   PartyTypeId : this.documentData.PartyTypeId,
      //   SendDetail: this.documentData.SendDetail,
      // }

      // for(var i=0; i < this.documentData.Parties.length; i++){
      //   // let party = this.documentData.Parties[i]
      //   let PartyFields = this.documentData.Parties[i].PartyFields
      //   let TemplateFields = this.documentData.Parties[i].TemplateFields

      //   for(var j=0; j < this.documentData.Parties[i].CustomFields.length;j++){
      //     if(this.createDoc[`${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`]){
      //       this.documentData.Parties[i].CustomFields[j].Value = this.createDoc[`${this.documentData.Parties[i].PartyName}-${this.documentData.Parties[i].CustomFields[j].Name}`]
      //     }
      //   }

      //   let CustomFields = this.documentData.Parties[i].CustomFields

      //   let party = this.documentData.Parties[i]
      //   delete party.PartyFields
      //   delete party.TemplateFields
      //   delete party.CustomFields

      //   party.Fields = []
      //   party.CustomFields = CustomFields
      //   party.DocumentPartyContact = []
      //   if(this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]){
      //     let docCustomPartyContactDetails = this.createDoc[`${this.documentData.Parties[i].PartyName}-details`];
      //     if(!docCustomPartyContactDetails.FirstName || !docCustomPartyContactDetails.LastName ||
      //       !docCustomPartyContactDetails.Email){

      //     }else{
      //       party.DocumentPartyContact.push(this.createDoc[`${this.documentData.Parties[i].PartyName}-details`]);
      //     }
      //   }
      //   console.log("Latest Doc Push")
      //   this.latestDoc.Parties.push(party)
      // }

      //Update Data In Content
      this.latestDoc.Content = this.setFieldInFroala();

      this.authenticationService.editDocument(this.latestDoc).subscribe(res => {
        resolve(true)
        // if(res.WasSuccessful){

        //   if(this.partyData.ProofOfIdentity){
        //     this.showUploadDocument = true;
        //     this.show_upload_document_anim = true;
        //   }else{
        //     this.showSignDocument = true
        //     this.show_sign_document_anim = true
        //   }
        // }

      },error => {
        resolve(false)
        // this.spinner.hide()
        // console.log("Edit Api Error---",error);
        // this.alertService.error(error.Message)
      })
    })
  }


  loadScript(){
    $(".person-sec-right").toggleClass('show_block');
    $('.person-sec-left').toggleClass('adjust_width');
    $('.edit-party-footer').toggleClass('active');
    $('.withdraw-btn').toggleClass('active');
  }

  onImageChange(event, partyName, customFieldName, i, j){
    if(event.target.files[0]){
      var file = event.target.files[0];

      var size = file.size / 1024
      if(size > 2048){
        this.createDoc[partyName+'-'+customFieldName] = ""
        this.documentData.Parties[i].CustomFields[j].Format = ""
        this.alertService.error('File size greater than 2 MB');
      } else {
        var formData: any = new FormData();
        formData.append('file', file);

        this.spinner.show();
        this.authenticationService.uploadFile(formData).subscribe((res) => {
          this.spinner.hide();
          if(res[0]) {
            this.createDoc[partyName+'-'+customFieldName] = res[0].Url

            this.documentData.Parties[i].CustomFields[j].Value = res[0].Url
            this.documentData.Parties[i].CustomFields[j].Format = file.name
            //
            this.setFieldInFroala()
          }
        },error => {
          this.spinner.hide();
        })
      }
    }
  }
}
