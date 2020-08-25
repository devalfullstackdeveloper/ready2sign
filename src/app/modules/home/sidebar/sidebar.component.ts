import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/service/authentication.service'
import { ActivatedRoute, Router} from '@angular/router'
import { Subject} from 'rxjs'
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public $accountNumber = new Subject<any>();

  userProfile: any = {}
  userAccounts : any = [];
  selectedaccount = ''

  constructor(private authenticationService:AuthenticationService,private router: Router) { }

  options = false

  ngOnInit(): void {
    this.getUserProfile()
  }

  getUserProfile(){
    this.authenticationService.getUserProfile().subscribe(res => {
      console.log("Get User Profile----",res);
      this.userProfile = res
      this.userAccounts = res.UserAccounts

      if(res.UserAccounts && res.UserAccounts.length > 0){
        this.selectedaccount = res.UserAccounts[0].Id

        this.authenticationService.setActiveAccountNumber(res.UserAccounts[0].Id)
      }
    },error => {
      console.log("Error---",error);
    })
  }

  accountChange(e){
    // console.log("Account Value---",e.target.value)
    this.authenticationService.setActiveAccountNumber(e.target.value);
  }

  signOut(){
    this.authenticationService.logout();
  }

  optionChange(){
    this.options = !this.options
  }

  closeOption(){
    this.options = false
  }

  home(){
    this.router.navigate(['/admin/home'])
  }

  setting(){
    this.router.navigate(['/admin/settings'])

    // [routerLink]="['/settings']"
  }

}
