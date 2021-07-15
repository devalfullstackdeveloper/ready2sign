import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl,FormControl,FormGroup,ValidatorFn,Validators } from '@angular/forms';
import { SettingsService } from '../../../core/service/settings.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../../../core/service/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';
import { NgxSpinnerService } from "ngx-spinner";
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

    const regex = new RegExp('[0-9]{10}$');
    const valid = regex.test(control.value);
    return valid ? null : { invalidPhoneNumber: true };
  };
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  accountNumber : Number = Number(JSON.parse(localStorage.getItem('acccountNumber')));
  companyProfileData : any = {};

  @ViewChild('signatureCanvas', {static: false}) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 455,
    'canvasHeight': 100,
    'border-width':1
  };

  myprofileform:FormGroup;
  myprofileformsubmitted = false;
  myProfileData : any = {};

  InitialCountry = 'au';

  signatureAdded = false
  accountId:any;

  mobileFlagEvent
  phoneFlagEvent

  constructor(
    private router : Router,
    private settings:SettingsService,
    private authenticationService:AuthenticationService,
    private alertService : AlertService,
    private spinner: NgxSpinnerService) {
      this.getAccount();
    }

  ngOnInit(): void {

    // this.spinner.show()
    // this.spinner.hide()
    // this.spinner.subscribe(dd => {
    //   console.log("DD ::---",dd);
    // })

    this.authenticationService.getActiveAccountNumber().subscribe(data => {
      this.accountNumber = data;

      this.getAccount();
    })

    this.myprofileform= new FormGroup({
      userfirstname: new FormControl('',[Validators.required,removeSpaces]),
      userlastname: new FormControl('',[Validators.required,removeSpaces]),
      useremail: new FormControl('',[Validators.email,Validators.required,removeSpaces]),
      usercountrycode: new FormControl(''),
      usermobile: new FormControl('',Validators.compose([Validators.required, Validators.maxLength(10), removeSpaces, patternValidator()])),
      userworkphone: new FormControl('',Validators.compose([removeSpaces, Validators.maxLength(10), patternValidator()])),
      userworkcountrycode : new FormControl(''),
      usersignature: new FormControl(''),
      userbranch:new FormControl(''),
      userposition:new FormControl('')
    });

    this.getMyProfile();
  }

  get myprofileFormControl() {
    return this.myprofileform.controls;
  }

  getMyProfile(){
    this.authenticationService.getUserProfile().subscribe(res => {
      this.myProfileData = res;
      if(res.SignatureUrl){
        this.signatureAdded = true
      }
      this.accountId = res.AccountId;
      this.myprofileform.patchValue({
        userfirstname: res.FirstName ,
        userlastname: res.LastName ,
        useremail: res.Email ,
        usercountrycode : res.CountryCode,
        usermobile: res.MobileNumber ,
        userworkphone: res.PhoneNumber ,
        userworkcountrycode : res.WorkPhoneCountryCode ? res.WorkPhoneCountryCode : '',
        userposition: res.Position ,
        userbranch: res.Branch,
        usersignature : res.SignatureUrl
      })

      if(this.mobileFlagEvent){
        this.mobileFlagEvent.setCountry(res.CountryCode)
      }
    },error => {
      // console.log("My Profile Error ---",error);
    })
  }

  updateProfile(){
    this.myprofileformsubmitted = true
    this.spinner.show();
    if(this.myprofileform.valid){
      var req = {
        FirstName: this.myprofileFormControl.userfirstname.value,
        LastName: this.myprofileFormControl.userlastname.value,
        Email: this.myprofileFormControl.useremail.value,
        Position: this.myprofileFormControl.userposition.value,
        CountryCode: this.myprofileFormControl.usercountrycode.value,
        Branch: this.myprofileFormControl.userbranch.value,
        Phone: this.myprofileFormControl.userworkphone.value,
        WorkPhoneCountryCode: this.myprofileFormControl.userworkcountrycode.value,
        MobileNumber: this.myprofileFormControl.usermobile.value,
        SignatureUrl: this.myprofileFormControl.usersignature.value,
        AccountId: this.accountId
      }

      this.authenticationService.updateUserProfile(req).subscribe(res => {
        this.getMyProfile();
        this.alertService.successPage(res.Messages);
        this.spinner.hide();
      },error => {
        this.alertService.error(error.message);
        this.spinner.hide();
      })
    }else{
      this.spinner.hide();
      this.alertService.error('Invalid Form !!');
    }
  }

  // Get Account Details
  getAccount(){
    if(this.accountNumber){
      this.settings.getAccount(this.accountNumber).subscribe(res=>{
        this.companyProfileData = res;
      },error => {
        this.companyProfileData = {}
      })
    }
  }

  // toggle
  toggleSidebar(){
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');
  }

  hasError(event){
    // console.log("Country Error Event :---",event)
  }

  getNumber(event) {
    // console.log("Get Number Event :----",event);
  }

  telInputObject(event) {
    this.mobileFlagEvent = event
    // event.intlTelInput('separateDialCode',true);

    // console.log("All Country--",JSON.stringify(event.p));
  }

  onCountryChange(event) {
    this.myprofileform.patchValue({
      usercountrycode: event.iso2
    })
  }

  // For --------- Work Phone --------
  workTelInputObject(event) {
    this.phoneFlagEvent = event
    // console.log("All Country--",JSON.stringify(event.p));
  }

  workOnCountryChange(event) {
    this.myprofileform.patchValue({
      userworkcountrycode: event.iso2
    })
  }

  drawComplete() {
    // this.spinner.show();
    fetch(this.signaturePad.toDataURL())
      .then(res => res.blob())
      .then(blob => {
        var formData: any = new FormData();
        formData.append("file",blob, 'signature_file.'+ blob.type.split('/')[1])
        this.settings.uploadFile(formData).subscribe(res=>{
          this.myprofileform.patchValue({
            usersignature: res[0].Url
          })

          // this.spinner.hide();
        },error => {
          // this.spinner.hide();
          this.alertService.error(error.Messages)
        })
       })
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
  }

  public clear(): void {
    this.signaturePad.clear();
  }

  close(){
    this.signatureAdded = true
  }

  addNewSign(){
    this.signatureAdded = false
  }

  resetPassword(){
    if(this.myProfileData.Email){
      this.authenticationService.forgotPassword(this.myProfileData.Email).subscribe(res => {
        this.alertService.successPage(res);
      },error => {
        this.alertService.error(error.Message)
      })
    }
  }

}
