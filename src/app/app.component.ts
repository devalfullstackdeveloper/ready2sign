import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
// import { PropertyMeService } from './core/service/property-me.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from './core/service/alert.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ngRtsapp';
  accountNumber : Number = Number(JSON.parse(localStorage.getItem('acccountNumber')))
  currentUser
  code

  constructor(private router : Router,private route: ActivatedRoute,
    private authenticationService:AuthenticationService,
    private alertService : AlertService){
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      // console.log("code---",params['code'])
    })
  }

  ngOnInit(): void {
    this.authenticationService.getActiveAccountNumber().subscribe(data => {
      this.accountNumber = data
    });
  }
  checkLogin(){
    this.currentUser = this.authenticationService.currentUserValue;
    // console.log("Current-User---",this.currentUser)
    if (this.currentUser) {
      if(this.code){
        this.callPropertyMe();
      }else{
        this.router.navigate(['/admin/home']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  callPropertyMe(){
    let request = {
      code : this.code,
      accountid : this.accountNumber
    }

    const token = (this.currentUser && this.currentUser.access_token) ? this.currentUser.access_token : '';
    this.alertService.clear();
    this.authenticationService.propertyMe(request,token).subscribe(res => {
      // console.log("Property Res----",res);
      this.authenticationService.refreshToken().subscribe(refresh => {
        // console.log("Refresh Data----",refresh);
        this.router.navigate(['/admin/settings/ConnectedApps'])
      },error => {
        this.router.navigate(['/admin/settings/ConnectedApps'])
      })
    },error => {
      // console.log("Property error---",error)

      setTimeout(() => {
        this.alertService.error(error ? error.message ? error.message : error : error);
      }, 300);

      this.router.navigate(['/admin']);
    })
  }
}
