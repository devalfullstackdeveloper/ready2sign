import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
// import { PropertyMeService } from '../core/service/property-me.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../core/service/alert.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  editorContent = "Hi Soham"
  accountNumber : Number = Number(JSON.parse(localStorage.getItem('acccountNumber')))
  currentUser
  code = ""
  constructor(private router: Router,private route: ActivatedRoute,
    private authenticationService:AuthenticationService,
    //  private propertMeService : PropertyMeService,
     private alertService : AlertService) {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      // this.callPropertyMe()
    })
  }

  ngOnInit(): void {
    this.authenticationService.getActiveAccountNumber().subscribe(data => {

      this.accountNumber = data
    })


    setTimeout(() => {
      this.checkLogin();
    }, 300)
  }

  testButton(){
    // this.router.navigate(['/dashboard']);
  }


  // callPropertyMe(){
  //   let request = {
  //     code : this.code,
  //     accountid : this.accountNumber
  //   }

  //   this.propertMeService.propertyMe(request).subscribe(res => {
  //     console.log("Property Res----",res);
  //     this.authenticationService.refreshToken().subscribe(refresh => {
  //       console.log("Refresh Data----",refresh);
  //       this.router.navigate(['/admin/settings/ConnectedApps'])
  //     },error => {
  //       console.log("refresh error---",error)
  //     })
  //   },error => {
  //     console.log("Property error---",error)
  //   })
  // }



  checkLogin(){
    this.currentUser = this.authenticationService.currentUserValue;
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
      this.authenticationService.refreshToken().subscribe(refresh => {
        this.router.navigate(['/admin/settings/ConnectedApps'])
      },error => {

        setTimeout(() => {
          this.alertService.error('Something went wrong');
        }, 300);

        this.router.navigate(['/admin']);
      })
    },error => {


      setTimeout(() => {
        this.alertService.error('Something went wrong');
      }, 300);

      this.router.navigate(['/admin']);
    })
  }

}
