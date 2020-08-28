import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { SettingsService } from '../../../core/service/settings.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../../../core/service/alert.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';
import { Toast } from 'ngx-toastr';
import { error } from 'protractor';
import { skip } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
  userUpdate = false;
  Message = "";
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
  selectedId : any;
  Groups = [
    {name :"Default", id: 1},
    {name :"Property Management", id: 2}
  ];  

  filter : any = {
    top : 5,
    skip : 0,
    filterOn : 'FirstName',
    order : 'Asc',
    firstName : false,
    lastSignIn : false,
    firstSignIn : false,
    search : "",
    status : ""
  }

  propertyFilter : any = {   
    filterOn : 'FirstName',
    order : 'Asc',
    app_srt : false,
    status_srt : false,    
    search : "",
    status : ""
  }
  status_user = "";

  inviteUserJson : any = {FirstName:"",LastName:"",email:"",MobileNumber:null,Phone:null,password:123456,
    confirmPassword: 123456,Branch:"",Position:"",AccountId:null,Role:"Standard",Groups:[1]};
  access_level : string = this.inviteUserJson.Role;
  statusInInviteUser :number = 0;
  totalUsers : number;
  exactPage : any;
  numberArray : any = [];
  activePage : any = 1;
  pageNo : number = 1;
  options : any = [3, 5, 10, 20, 50];
  selectedQuantity = 5;
  rfrsToken : any;
  accToken : any;
  code : any;
  activeApp : boolean = true;
  InactiveApp : boolean = false;
  constructor(private location: Location,private activeRoute:ActivatedRoute, private settings:SettingsService,private authenticationService:AuthenticationService,private alertService:AlertService) {
      console.log("Constructure Calling-----", (<any>window).activeAcountNumber);
    this.accountNumber = (<any>window).activeAcountNumber;
    this.getAccount();
    this.getAdminUsers();
    this.getAllUsers();

    // this.authenticationService.getActiveAccountNumber().subscribe(data => {
    //     this.accountNumber = data
    //     console.log("acc no",this.accountNumber);
    //     this.getAccount();
    //     this.getAdminUsers();
    //     this.getAllUsers();
    //   })
     }

  ngOnInit(): void {
    this.authenticationService.getActiveAccountNumber().subscribe(data => {
      this.accountNumber = data
      console.log("acc no",this.accountNumber);
      this.getAccount();
      this.getAdminUsers();
      this.getAllUsers();
    })
    this.activeRoute.queryParams.subscribe(params=>{
      console.log("parms--",params);
      console.log("code--",params['code']);
      this.code = params['code'];
    });

    if(this.code){
      console.log("get auth token api call---");
      this.getAuthToken(this.code);
    }   
  }

  ngAfterViewInit(){

  }

  cancelForm(){
    this.location.back();
  }
  getAccount(){
    if(this.accountNumber){
      this.settings.getAccount(this.accountNumber).subscribe(res=>{
        this.companyProfileData = res;   
        console.log("company data===",this.companyProfileData);   
      })
    }
  }

  getAdminUsers(){
    if(this.accountNumber){
      this.settings.getAdminUsers(this.accountNumber).subscribe(res=>{     
        this.adminUsers = res;
        console.log("admin users--",this.adminUsers);
      })
    }    
  }

  companyProfileUpdate(){
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.companyProfileData, null, 4));
    this.companyProfileData.PrimaryContactId = null;
    this.settings.updateCompanyProfile(this.companyProfileData).subscribe(res=>{
      console.log("updated---",res);
      this.alertService.successPage(res);
    },error=>{
      this.alertService.error(error.Message);
    })
  }

  getAllUsers(){
    if(this.accountNumber){
      this.settings.getAllUsers(this.accountNumber,this.filter).subscribe(res=>{
        console.log("resss---",res);
        if(res.Data.length > 0){
          this.allUsers = res.Data;
          this.totalUsers = res.TotalCount;       
          this.pageNoCalculation();
        }
        else
        {
          this.allUsers = [];
          this.totalUsers = 0;       
          this.pageNoCalculation();
          // this.alertService.successPage("Data Not Found.");
        }
      });
    }        
  }
  searchUser(event){
    if(event.target.value.length > 0){
      this.filter.search = event.target.value;
      console.log("search text--",this.filter);
      this.getAllUsers();
    } 
    else{
      this.filter.search = "";
      this.getAllUsers();
    }   
    
  }
  selectStatus(event){
    console.log("status---",event.target.value);
    if(event.target.value == 'All'){
      this.filter.status = "";
      this.getAllUsers();
    }
    else{
      this.filter.status = event.target.value;
      console.log("filter --",this.filter);
      this.getAllUsers();
    }    
  }
  pageNoCalculation(){
    this.numberArray = [];
    let page= this.totalUsers/this.filter.top;
      let tempPage = page.toFixed();     
      
      if(Number(tempPage) < page){
        this.exactPage = Number(tempPage) + 1;        
        for(let i=0;i<this.exactPage;i++)
        {          
          this.numberArray.push(this.pageNo);
          this.pageNo++;              
        }          
        this.pageNo = 1;
      }
      else{
        this.exactPage = Number(tempPage);       
        for(let i=0;i<this.exactPage;i++)
        {          
          this.numberArray.push(this.pageNo);
          this.pageNo++;                
        }        
        this.pageNo = 1;  
      }
  }

  pageNoClick(event,pgNo){
    this.activePage = pgNo;    
    this.filter.skip = this.filter.top * (pgNo - 1);    
    this.getAllUsers();
  }

  leftArrow(){
    if(this.activePage > 1){
      this.activePage = Number(this.activePage - 1);  
      console.log("active page--",this.activePage);  
      this.filter.skip = this.filter.top * (this.activePage - 1); 
      this.getAllUsers();
    }   
  }
  rightArrow(){
    if(this.activePage < this.exactPage){
      this.activePage = Number(this.activePage);
      this.filter.skip = this.filter.top * (this.activePage);        
      this.activePage ++;
      console.log("this page---",this.activePage);
      this.getAllUsers();
    }  
  }

  selectNoOfRows(no){
    this.filter.top = no;
    this.getAllUsers();
  }
  
  filterBy(type){   
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
    if(this.accountNumber){
      this.settings.getAllUsers(this.accountNumber,this.filter).subscribe(res=>{
        this.allUsers = res.Data;
      });
    }   
    else{
      console.log("account no noy found");
    }
  }

  setDisplay(page){    
    this.displayForm = page;
  }
  displayModel(){
    this.showInviteModel = !this.showInviteModel;
  }
  openActiveBox(id,mailId){   
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
    this.inviteUserJson.Groups = this.GroupsArrayInvite;
  }

  sendInvitation(inviteUserForm){
    
    this.inviteUserJson.AccountId = this.accountNumber;
    console.log("invide json--",this.inviteUserJson);
    this.settings.inviteUser(this.inviteUserJson).subscribe(res=>{
      if(res.WasSuccessful == true){
        inviteUserForm.reset();
        this.getAllUsers();
        this.showInviteModel = false;
        this.invited = true;
        this.Message = "User successfully invited "
        setTimeout (() => {          
          this.invited = false;
       }, 5000);
      }
    },error=>{
      this.alertService.error(error);
    })
  }

  activateUser(user,stts){
    this.settings.updateStatus(user.Id,stts).subscribe(res => {      
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
      this.userData = res;
      // this
      this.access_level_edit = res.Role;
      this.statusInEditUser = res.UserStatus;      
console.log("user astatus----",this.userData,this.statusInEditUser);
      let grps= res.Groups;
      for(let i=0;i<grps.length;i++){        
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

  selectedRow(id){
    console.log("id-----",id);
    this.selectedId = id;
  }
  changeAccessLevelEdit(level){
    this.access_level_edit = level;
    this.userData.Role = level;
  }

  changeStatusEdit(stts){
    this.statusInEditUser = stts;
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
    this.userData.Groups = this.GroupsArrayInvite;

  }

  updateUser(){    
    console.log("update user ---",this.userData);
    let req = {
      email: this.userData.Email,
      password: "123456",
      confirmPassword: "123456",
      FirstName: this.userData.FirstName,
      LastName: this.userData.LastName,
      Position: this.userData.Position,
      AccountId: this.userData.AccountId,
      Groups: this.userData.Groups,
      Status: 0,
      Role: this.userData.Role,
      Phone: this.userData.PhoneNumber,
      MobileNumber: this.userData.MobileNumber,
      Branch: this.userData.Branch,
      Userstatus: this.userData.UserStatus,
      Id: this.userData.Id
    }

    this.settings.updateUser(req).subscribe(res=>{       
      if(res.WasSuccessful == true){        
        this.getAllUsers();
        this.edtUsr = false;
        this.invited = true;
        this.Message = res.Messages   
        setTimeout (() => {          
          this.invited = false;
       }, 5000);
      }
    },error=>{
      console.log("error",error);
      this.alertService.error(error.Messages[0]);
    });
  }

  displayEditModel(){
    console.log("displayEditModel Calling---------")
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
    console.log("Edit- model---",this.edtUsr);
    console.log("Reset-Data-----",data);
    this.authenticationService.forgotPassword(data.Email).subscribe(res => {
      console.log("Res---",res)
      console.log("Edit- model-1--",this.edtUsr);
      // this.edtUsr = true
      this.alertService.successPage(res);
    },error => {
      this.alertService.error(error);
    })
  }

  //------------------ Connected-App ------------
  propertyOn(){
    var url = "https://login.propertyme.com/connect/authorize?response_type=code&state=&client_id=8e9f08d6-566e-4ba1-b43f-c46511c8a17d&scope=contact:read%20activity:read%20property:read%20communication:read%20transaction:read%20offline_access&redirect_uri=http://localhost:65385/home/callback"
    // var url = "https://login.propertyme.com/connect/authorize?response_type=code&state=&client_id=8e9f08d6-566e-4ba1-b43f-c46511c8a17d&scope=contact:read%20activity:read%20property:read%20communication:read%20transaction:read%20offline_access&redirect_uri=http://localhost:65385/admin/settings"
    window.open(url,'_blank')
  }
  
  getAuthToken(code){
    console.log("code -----",code);

    // let res = {
    //     access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1OTgyODA2MjMsImV4cCI6MTU5ODI4NDIyMywiaXNzIjoiaHR0cHM6Ly9sb2dpbi5wcm9wZXJ0eW1lLmNvbSIsImF1ZCI6WyJodHRwczovL2xvZ2luLnByb3BlcnR5bWUuY29tL3Jlc291cmNlcyIsImh0dHBzOi8vYXBwLnByb3BlcnR5bWUuY29tL2FwaSJdLCJjbGllbnRfaWQiOiI4ZTlmMDhkNi01NjZlLTRiYTEtYjQzZi1jNDY1MTFjOGExN2QiLCJzdWIiOiJDdXN0b21lcklkX2E1MzgwMzFhLWY3MGMtNGJkNi1iYzg1LWQ2ZGIyNjZmYTMzMCIsImF1dGhfdGltZSI6MTU5ODI4MDYwNywiaWRwIjoibG9jYWwiLCJjdXN0b21lcl9pZCI6ImE1MzgwMzFhLWY3MGMtNGJkNi1iYzg1LWQ2ZGIyNjZmYTMzMCIsIm1lbWJlcl9pZCI6ImFiZmYwMDI0LWE4M2QtNGUwZS1hZTg0LWM1ZjgxYjNkZmRmZCIsIm1lbWJlcl9hY2Nlc3NfaWQiOiJhYmZmMDAyNC1hODNlLTQyNTEtOTU4Zi1lM2ZjYjIzYzAwZWIiLCJzY29wZSI6WyJwcm9wZXJ0eTpyZWFkIiwiY29tbXVuaWNhdGlvbjpyZWFkIiwiYWN0aXZpdHk6cmVhZCIsInRyYW5zYWN0aW9uOnJlYWQiLCJjb250YWN0OnJlYWQiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.UFehMRjEjEqbRsX71ASvLZFWi-4WP6Nk9TtaMHpXHYUlzQiuM0GL7lyTPEpeKE6xwT-ND0zOYp-1xkknWRSSlXTRzIDqROJRC-TrUgVltWKFKS2RtJDK5C-Zvt-laO_ytwmKqwJbfsgyS-mq0I0DeJmiNXK9Bowa1mmcpPmWXM_FuSt3KFfRAdcYdf7tT4AzVUBfczWTiu_pQhnONkU6YH_O8dPdL6CHrEz2s7Hr_kZOiAsUoAfSrsrdD6k6F27-unf2DEZHxdl4dMk1Njh9Jel1eLImREpCIYupFzKuNFJU64dz0wsexxOvEBk8d-9dbOmqQvYSG-c_FH0YtYzeRg",
    //     expires_in: 3600,
    //     token_type: "Bearer",
    //     refresh_token: "fc181d6d5bfdd86e1773c6c8df12aa2c30f4c02f7458e3c9bee4d99b176ef0d6"
    // };
    // if(res.access_token && res.refresh_token){
    //   this.saveToken(res.access_token,res.refresh_token);
    // }
    this.settings.getAuthToken(code).subscribe(res=>{
      console.log("get auth token--",res);
      if(res.access_token && res.refresh_token){
        // this.saveToken(res.access_token,res.refresh_token);
      }
    });
    this.accToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE1OTgyODA2MjMsImV4cCI6MTU5ODI4NDIyMywiaXNzIjoiaHR0cHM6Ly9sb2dpbi5wcm9wZXJ0eW1lLmNvbSIsImF1ZCI6WyJodHRwczovL2xvZ2luLnByb3BlcnR5bWUuY29tL3Jlc291cmNlcyIsImh0dHBzOi8vYXBwLnByb3BlcnR5bWUuY29tL2FwaSJdLCJjbGllbnRfaWQiOiI4ZTlmMDhkNi01NjZlLTRiYTEtYjQzZi1jNDY1MTFjOGExN2QiLCJzdWIiOiJDdXN0b21lcklkX2E1MzgwMzFhLWY3MGMtNGJkNi1iYzg1LWQ2ZGIyNjZmYTMzMCIsImF1dGhfdGltZSI6MTU5ODI4MDYwNywiaWRwIjoibG9jYWwiLCJjdXN0b21lcl9pZCI6ImE1MzgwMzFhLWY3MGMtNGJkNi1iYzg1LWQ2ZGIyNjZmYTMzMCIsIm1lbWJlcl9pZCI6ImFiZmYwMDI0LWE4M2QtNGUwZS1hZTg0LWM1ZjgxYjNkZmRmZCIsIm1lbWJlcl9hY2Nlc3NfaWQiOiJhYmZmMDAyNC1hODNlLTQyNTEtOTU4Zi1lM2ZjYjIzYzAwZWIiLCJzY29wZSI6WyJwcm9wZXJ0eTpyZWFkIiwiY29tbXVuaWNhdGlvbjpyZWFkIiwiYWN0aXZpdHk6cmVhZCIsInRyYW5zYWN0aW9uOnJlYWQiLCJjb250YWN0OnJlYWQiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.UFehMRjEjEqbRsX71ASvLZFWi-4WP6Nk9TtaMHpXHYUlzQiuM0GL7lyTPEpeKE6xwT-ND0zOYp-1xkknWRSSlXTRzIDqROJRC-TrUgVltWKFKS2RtJDK5C-Zvt-laO_ytwmKqwJbfsgyS-mq0I0DeJmiNXK9Bowa1mmcpPmWXM_FuSt3KFfRAdcYdf7tT4AzVUBfczWTiu_pQhnONkU6YH_O8dPdL6CHrEz2s7Hr_kZOiAsUoAfSrsrdD6k6F27-unf2DEZHxdl4dMk1Njh9Jel1eLImREpCIYupFzKuNFJU64dz0wsexxOvEBk8d-9dbOmqQvYSG-c_FH0YtYzeRg";
    this.rfrsToken = "fc181d6d5bfdd86e1773c6c8df12aa2c30f4c02f7458e3c9bee4d99b176ef0d6";
    this.saveToken();
  }

  saveToken(){
    let data = {
      accountid:1,
      refreshtoken:this.rfrsToken,
      accesstoken:this.accToken
    };
    
    this.settings.saveToken(data).subscribe(res=>{
      console.log("save Token--",res);
      if(res.WasSuccessful == true){
        
      }
    });
  }

  selectStatusApps(event){
    console.log("status---",event.target.value);
    if(event.target.value == 'All'){
      this.propertyFilter.status = "";
      this.getAllUsers();
    }
    else{
      this.propertyFilter.status = event.target.value;
      console.log("filter --",this.filter);
      this.getAllUsers();
    } 
  }
  searchApps(event){

  }
  appsFilterBy(type){
    if(type == 'App'){      
      this.propertyFilter.app_srt = !this.propertyFilter.app_srt;
      this.propertyFilter.status_srt = false;      
      this.propertyFilter.filterOn = type;
      if(this.propertyFilter.app_srt == true)
        this.propertyFilter.order = 'Asc';
      else 
        this.propertyFilter.order = 'Desc';
    }
    if(type == 'Status'){      
      this.propertyFilter.status_srt = !this.propertyFilter.status_srt;
      this.propertyFilter.app_srt = false;      
      this.propertyFilter.filterOn = type;
      if(this.propertyFilter.status_srt == true)
        this.propertyFilter.order = 'Asc';
      else 
        this.propertyFilter.order = 'Desc'; 
    }
    console.log("this filter--",this.propertyFilter);

    // if(this.accountNumber){
    //   this.settings.getAllUsers(this.accountNumber,this.filter).subscribe(res=>{
    //     this.allUsers = res.Data;
    //   });
    // }   
    // else{
    //   console.log("account no noy found");
    // }
  }  
}
