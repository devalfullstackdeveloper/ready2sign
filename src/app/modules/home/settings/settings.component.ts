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
    top : 3,
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
  totalUsers : number;
  exactPage : any;
  numberArray : any = [];
  activePage : any = 1;
  pageNo : number = 1;
  options : any = [3, 5, 10, 20, 50];
  selectedQuantity = 3;
  rfrsToken : any;
  accToken : any;
  code : any;

  constructor(private activeRoute:ActivatedRoute, private settings:SettingsService,private authenticationService:AuthenticationService,private alertService:AlertService) {
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
      this.allUsers = res.Data;
      this.totalUsers = res.TotalCount;
      console.log("get users all data---",res);
      console.log("get users---",this.allUsers);    
      this.pageNoCalculation();
    });    
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
    console.log("event--",event.target.value,"pgNo--",pgNo);
    this.filter.skip = this.filter.top * (pgNo - 1);
    console.log("count--",this.filter.skip);    
    this.getAllUsers();
  }

  leftArrow(){
    console.log("left arrow",this.activePage,this.filter);
    this.activePage = Number(this.activePage - 1);    
    this.filter.skip = this.filter.top * (this.activePage - 1);
    console.log("skip---",this.filter.skip);
  
    this.getAllUsers();
  }
  rightArrow(){
    console.log("right arrow",this.activePage,this.filter);
    this.activePage = Number(this.activePage);
    this.filter.skip = this.filter.top * (this.activePage);    
    console.log("skip---",this.filter.skip);
    this.getAllUsers();
    this.activePage ++;
  }

  selectNoOfRows(no){    
    console.log("select---",no,this.options,this.selectedQuantity);
    this.filter.top = no;
    this.getAllUsers();
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
    this.settings.getAllUsers(this.accountNumber,this.filter).subscribe(res=>{
      this.allUsers = res.Data;
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
      refreshtoken:this.accToken,
      accesstoken:this.rfrsToken
    };
    
    this.settings.saveToken(data).subscribe(res=>{
      console.log("save Token--",res);
    });
  }
}
