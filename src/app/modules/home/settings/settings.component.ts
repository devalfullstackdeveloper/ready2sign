import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { SettingsService } from '../../../core/service/settings.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../../../core/service/alert.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';
import { Toast } from 'ngx-toastr';
import { error } from 'protractor';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {

  @ViewChild('signatureCanvas', {static: false}) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 3,
    'canvasWidth': 455,
    'canvasHeight': 200,
    'border-width':1
  };

  public _signature: any = null;

  public propagateChange: Function = null;


  accountNumber : any
  companyProfileForm:FormGroup;
  submitted = false;
  adminUsers : any;
  displayForm = "companyProfile";
  invited = false;
  showInviteModel = false;
  companyProfileData : any = {};
  allUsers : any;
  userIndex : number;
  userMail : string;
  openActvBox : boolean = false;
  edtUsr : boolean = false;
  userData : any;
  GroupsArrayInvite: Array<any> = [];
  access_level_edit : string;
  statusInEditUser : number;
  prtmngmnt : boolean = false;
  dflt : boolean = false;
  Groups = [
    {name :"Default", id: 1},
    {name :"Property Management", id: 2}
  ];  

  filter : any = {
    top : 10,
    skip : 0,
    filterOn : 'FirstName',
    order : 'Asc',
    firstName : false,
    lastSignIn : false,
    firstSignIn : false
  }

  inviteUserJson : any = {FirstName:"",LastName:"",email:"",MobileNumber:null,Phone:null,password:123456,
    confirmPassword: 123456,Branch:"",Position:"",AccountId:null,Role:"Standard",Groups:[]};
  access_level : string = this.inviteUserJson.Role;
  statusInInviteUser :number = 0;

  constructor(private settings:SettingsService,private authenticationService:AuthenticationService,private alertService:AlertService) {
      console.log("Constructure Calling-----", (<any>window).activeAcountNumber);
    this.accountNumber = (<any>window).activeAcountNumber;
    this.getAccount();
    this.getAdminUsers();
    this.getAllUsers();

    this.authenticationService.getActiveAccountNumber().subscribe(data => {
        this.accountNumber = data
        console.log("acc no",this.accountNumber);
        this.getAccount();
        this.getAdminUsers();
        this.getAllUsers();
      })
     }

  ngOnInit(): void {
  }

  ngAfterViewInit(){

  }

  getAccount(){
    this.settings.getAccount(this.accountNumber).subscribe(res=>{
      this.companyProfileData = res;
      console.log("get account==>",this.companyProfileData);
    })
  }

  getAdminUsers(){
    this.settings.getAdminUsers(this.accountNumber).subscribe(res=>{
      console.log("get admin usres--",res);
      this.adminUsers = res
    })
  }

  onSubmit(){
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.companyProfileData, null, 4));
    this.settings.updateCompanyProfile(this.companyProfileData).subscribe(res=>{
      console.log("updated---",res);
    })
  }

  getAllUsers(){
    this.settings.getAllUsers(this.accountNumber,this.filter).subscribe(res=>{
      this.allUsers = res;
      console.log("get users---",this.allUsers);
    });
  }

  filterBy(type){
    console.log("usr",type);    
    if(type == 'Name'){      
      this.filter.firstName = !this.filter.firstName;
      this.filter.firstSignIn = false;
      this.filter.lastSignIn = false;
      this.filter.filterOn = "FirstName";
      if(this.filter.firstName == true)
        this.filter.order = 'Asc';
      else 
        this.filter.order = 'Desc';
    }
    if(type == 'lastSignIn'){      
      this.filter.lastSignIn = !this.filter.lastSignIn;
      this.filter.firstSignIn = false;
      this.filter.firstName = false;
      this.filter.filterOn = "LastSignIn";
      if(this.filter.lastSignIn == true)
        this.filter.order = 'Asc';
      else 
        this.filter.order = 'Desc'; 
    }
    if(type == 'firstSignIn'){
      this.filter.firstSignIn = !this.filter.firstSignIn; 
      this.filter.firstName = false;
      this.filter.lastSignIn = false;
      this.filter.filterOn = "FirstSignIn";
      if(this.filter.firstSignIn == true)
        this.filter.order = 'Asc';
      else 
        this.filter.order = 'Desc';
    }    
    this.settings.getAllUsers2(this.accountNumber,this.filter).subscribe(res=>{
      this.allUsers = res;
      console.log("get users---",this.allUsers);
    });
    
  }

  setDisplay(page){
    console.log("page--",page);
    this.displayForm = page;
  }
  displayModel(){
    this.showInviteModel = !this.showInviteModel;
  }
  openActiveBox(id,mailId){
    console.log("id",id);
    console.log("mail",mailId);
    if(this.userIndex == id){
      this.openActvBox = !this.openActvBox;
    }
    else
    {
      this.openActvBox = true;
    }
    this.userIndex = id;
    this.userMail = mailId;
  }

  changeAccessLevel(level){
    console.log(level);
    this.access_level = level;
    this.inviteUserJson.Role = level;
  }


  changeGroup(val,isChecked: boolean){
    if(isChecked){
      this.GroupsArrayInvite.push(val);
    }
    else{
      let index = this.GroupsArrayInvite.indexOf(val);
      this.GroupsArrayInvite.splice(index,1);
    }
    console.log("check box 3 --",this.GroupsArrayInvite);
    this.inviteUserJson.Groups = this.GroupsArrayInvite;
  }

  sendInvitation(){
    this.inviteUserJson.AccountId = this.accountNumber;

    console.log("inviteUserJson---",this.inviteUserJson);

    this.settings.inviteUser(this.inviteUserJson).subscribe(res=>{
      console.log("user create--",res);
      if(res.WasSuccessful == true){
        this.getAllUsers();
        this.showInviteModel = false;
        this.invited = true;
      }
    })
  }

  activateUser(user,stts){
    console.log("user --",user,stts);
    this.settings.updateStatus(user.Id,stts).subscribe(res => {
      console.log("Update Status Res---",res)
      if(res.WasSuccessful){
        this.getAllUsers();
      }else{

      }
    },error => {
      console.log("Error---", error);
    })
    // this.settings.getUserById(user.Id).subscribe(res=>{
    //   console.log("get user by id--",res);
    // })
  }

  deleteUser(user){
    this.settings.deleteUser(user.Id).subscribe(res => {
      console.log("Delete User Res---",res)
      if(res.WasSuccessful){
        this.getAllUsers();
      }else{

      }
    },error => {
      console.log("Error---", error);
    })
  }

  editUser(user){
    this.settings.getUserById(user.Id).subscribe(res=>{
      console.log("get user by id--",res);
      this.userData = res;
      this.access_level_edit = res.Role;
      this.statusInEditUser = res.UserStatus;
      console.log("type 1--",this.statusInEditUser);

      let grps= res.Groups;
      for(let i=0;i<grps.length;i++){
        console.log("value-", grps[i]);
        if(grps[i] == 1){
          this.dflt = true;
        }
        if(grps[i] == 2){
          this.prtmngmnt = true;
        }
      }
    })
    this.edtUsr = true;
  }

  changeAccessLevelEdit(level){
    this.access_level_edit = level;
    this.userData.Role = level;
  }

  changeStatusEdit(stts){
    this.statusInEditUser = stts;
    console.log("type--",typeof(stts));
    console.log("type 1--",typeof(this.statusInEditUser));
    this.userData.UserStatus = stts;
  }

  changeGroupEdit(val,isChecked: boolean,user){
    this.GroupsArrayInvite = user.Groups;
    if(isChecked){
      this.GroupsArrayInvite.push(val);
    }
    else{
      let index = this.GroupsArrayInvite.indexOf(val);
      this.GroupsArrayInvite.splice(index,1);
    }
    console.log("check box 3 --",this.GroupsArrayInvite);
    this.userData.Groups = this.GroupsArrayInvite;

  }

  updateUser(){
    console.log("userData--",this.userData);
    this.settings.updateUser(this.userData).subscribe(res=>{
      console.log("update user--",res);
    });
  }

  displayEditModel(){
    this.edtUsr = !this.edtUsr;
  }

  // signature



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
    // will be notified of szimek/signature_pad's onEnd event
    // console.log(this.signaturePad.toDataURL());

    fetch(this.signaturePad.toDataURL())
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "signature",{ type: "image/png"})

        console.log("File----",file)
      })
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  public clear(): void {
    this.signaturePad.clear();
  }

  sendResetLink(data){
    console.log("Reset-Data-----",data);
    this.authenticationService.forgotPassword(data.Email).subscribe(res => {
      console.log("Res---",res)
      this.alertService.successPage(res);
    },error => {
      this.alertService.error(error);
    })
  }

  //------------------ Connected-App ------------
  propertyOn(){
    // var url = "https://login.propertyme.com/connect/authorize?response_type=code&state=&client_id=8e9f08d6-566e-4ba1-b43f-c46511c8a17d&scope=contact:read%20activity:read%20property:read%20communication:read%20transaction:read%20offline_access&redirect_uri=http://localhost:65385/home/callback"
    var url = "https://login.propertyme.com/connect/authorize?response_type=code&state=&client_id=8e9f08d6-566e-4ba1-b43f-c46511c8a17d&scope=contact:read%20activity:read%20property:read%20communication:read%20transaction:read%20offline_access&redirect_uri=http://localhost:4200/admin/settings"
    window.open(url,'_blank')
  }
  
}
