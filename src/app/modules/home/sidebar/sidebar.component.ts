import { Component, OnInit,AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../../../core/service/authentication.service';
import { AlertService } from '../../../core/service/alert.service'
import { ActivatedRoute, Router} from '@angular/router'
import { Subject} from 'rxjs'
import { Route } from '@angular/compiler/src/core';
import { CONSTANTS } from 'src/common/constants'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit,AfterViewInit {

  constant = CONSTANTS
  public $accountNumber = new Subject<any>();
  activeclass: string = "";
  userProfile: any = {}
  userAccounts : any = [];
  selectedaccount = ''
  currentUser : any = {};
  selectedSidebar = '';
  userName = '';
  constructor(private authenticationService:AuthenticationService,private router: Router, private alertService: AlertService) { }

  options = false;
  pro_options = false;

  ngOnInit(): void {
    this.currentUser = this.authenticationService.currentUserValue
    this.getUserProfile()
  }

  ngAfterViewInit() {
    // document.onclick = (event: any) : void => {
    //   let selectedclass = event.target.className;
    //   if ( selectedclass.includes("info-popup-sm") || selectedclass.includes("other-popup") || selectedclass.includes("more-info-sec") || selectedclass.includes("user-info") || selectedclass.includes("user-image")) {}
    //   else{
    //   this.options = false;
    //   this.pro_options = false;
    //  }
    // }
  }

  getUserProfile(){
    this.authenticationService.getUserProfile().subscribe(res => {

      this.userProfile = res
      this.userAccounts = res.UserAccounts
      if(this.userProfile.FirstName && this.userProfile.LastName){
        this.userName = this.userProfile.FirstName +' '+ this.userProfile.LastName;
      }
      if(res.UserAccounts && res.UserAccounts.length > 0){
        // this.currentUser.role = res.UserAccounts[0].RoleName
        var selected = false
        for(var i = 0; i < res.UserAccounts.length; i++){
          if(!selected){

            if(res.UserAccounts[i].StatusId == this.constant.UserStatus_Active){
              this.currentUser.role = res.UserAccounts[i].RoleName;

              this.selectedaccount = res.UserAccounts[i].Id
              localStorage.setItem('acccountNumber',JSON.stringify(res.UserAccounts[i].Id))
              this.authenticationService.setActiveAccountNumber(res.UserAccounts[i].Id)

              selected = true
            }
          }
        }

        if(!selected){
          this.alertService.error("There are no one account is Active");
          this.router.navigate(['/login'])
        }
        // this.authenticationService.currentUserValue.role =
        this.authenticationService.currentUserSubject.next(this.currentUser);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

      }else{
        this.currentUser.role = res.Role
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
    },error => {
      // console.log("Error---",error);
    })
  }

  getUserProfileAfterChange(){

    // this.authenticationService.getUserProfile().subscribe(res => {
    //   console.log("Get User Profile----",res);
    //   this.currentUser.role = res.Role
    //   localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    //   this.userProfile = res
    //   // this.userAccounts = res.UserAccounts
    //   if(this.userProfile.FirstName && this.userProfile.LastName){
    //     this.userName = this.userProfile.FirstName +' '+ this.userProfile.LastName;
    //   }
    // },error => {
    //   console.log("Error---",error);
    // })
  }

  accountChange(e){
    // console.log("Account Value---",e.target.value)
    var accountId = e.target.value
    let account = this.userAccounts.find(ac => {
      if(ac.Id == accountId){
        return ac
      }
    })

    if(account){
      this.currentUser.role = account.RoleName
      this.authenticationService.currentUserSubject.next(this.currentUser);
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    localStorage.setItem('acccountNumber',JSON.stringify(accountId));

    this.authenticationService.setActiveAccountNumber(accountId);

    // this.getUserProfileAfterChange();
  }

  signOut(){
    this.authenticationService.logout();
  }

  optionChange(){
    this.options = !this.options;
    this.pro_options = false;
  }
  profileoption(){
    this.pro_options = !this.pro_options;
    this.options = false;
  }

  viewProfile(){
    this.pro_options = false;
    this.options = false;

    this.router.navigate(['/admin/myProfile'])
  }

  closeOption(){
    this.options = false
  }

  home(){
    this.activeclass = "home";
    // this.router.navigate(['/admin/home/All'])
  }

  templates(){
    this.activeclass = "templates";
    // this.router.navigate(['/admin/templates/All'])
  }

  setting(){
    this.activeclass = "settings";
    // this.router.navigate(['/admin/settings/CompanyProfile'])

    // [routerLink]="['/settings']"
  }

  onClickedOutside(){
    this.pro_options = false;
    this.options = false;
  }

  firstCharacter(name) {
    let trm_name = name.trim();
    trm_name = trm_name.toLocaleUpperCase();
    return trm_name.charAt(0)
  }
}
