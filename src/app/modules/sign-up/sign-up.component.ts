import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../../core/service/alert.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit,AfterViewInit {
    showLoginButton = false;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    check = false;
    User : any = {}
    disableUser : any = {
      FirstName : false,
      LastName : false,
      Email : false,
      Branch : false,
      Position : false,
      Mobile : false,
      Phone: false,
      AccountId: false
    }

    mobileFlagEvent

    showPassword = false;
    showConfirmPassword = false;

  constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService : AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

    //params
    this.route.params.subscribe(params => {
      var Id = params['id'];
      // call api
      // this.authenticationService.getUserById(Id).subscribe(res=>{
      //   console.log("user--",res);
      // })


        // this.settings.getUserById(user.Id).subscribe(res=>{
        //   console.log("get user by id--",res);
        //   this.userData = res;
        //   this.access_level_edit = res.Role;
        //   this.statusInEditUser = res.UserStatus;
        //   console.log("type 1--",this.statusInEditUser);

        //   let grps= res.Groups;
        //   for(let i=0;i<grps.length;i++){
        //     console.log("value-", grps[i]);
        //     if(grps[i] == 1){
        //       this.dflt = true;
        //     }
        //     if(grps[i] == 2){
        //       this.prtmngmnt = true;
        //     }
        //   }
        // })
        // this.edtUsr = true;

    })


    this.route.queryParamMap.subscribe((params) => {

      if(params['params'].isactive){
        if(params['params'].isactive == 'true'){
          this.router.navigate(['/login']);
        }
      }

      if(params['params'].name) {
        this.User.FirstName = params['params'].name
        this.disableUser.FirstName = true
      }

      if(params['params'].lastname) {
        this.User.LastName = params['params'].lastname;
        this.disableUser.LastName = true;
      }

      if(params['params'].email) {
        this.User.Email = params['params'].email;
        this.disableUser.Email = true;
      }

      if(params['params'].branch){
        this.User.Branch = params['params'].branch;
        this.disableUser.Branch = true;
      }

      if(params['params'].position){
        this.User.Position = params['params'].position;
        this.disableUser.Position = true;
      }

      if(params['params'].mobile){
        this.User.Mobile = params['params'].mobile;
        this.disableUser.Mobile = true;
      }

      if(params['params'].countrycode){
        this.mobileFlagEvent.setCountry(params['params'].countrycode)
      }

      if(params['params'].phone){
        this.User.Phone = params['params'].phone;
        this.disableUser.Phone = true;
      }

      if(params['params'].accountid){
        this.User.AccountId = params['params'].accountid;
        this.disableUser.AccountId = true;
      }


    })
  }

  ngOnInit(): void {

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit(){
  }


  click(){
    this.check = true;
  }

  onSubmit() {
    // delete this.User.acceptTerms;
    let data : any = {
      email :this.User.Email,
      password:this.User.Password,
      confirmPassword:this.User.confirm_Password,
    }

    data.branch = this.User.Branch;
    data.firstName = this.User.FirstName;
    data.lastName = this.User.LastName;
    data.mobileNumber = this.User.Mobile;
    data.phone = this.User.Phone;
    data.position = this.User.Position;
    data.accountId = this.User.AccountId;

      this.submitted = true;

      this.loading = true;
      this.authenticationService.registerUser(data)
      .subscribe(res=>{
        if(res.WasSuccessful == true){
          this.showLoginButton = true;
          this.alertService.successPage("User activated");
        }
        else{
          this.showLoginButton = false;
          this.alertService.error("Something went wrong, Please try again");
        }
      },error => {
        this.alertService.error(error.Messages[0]);
      })
      // this.authenticationService.login(this.f.username.value, this.f.password.value)
      //     .pipe(first())
      //     .subscribe(
      //         data => {
      //             this.router.navigate([this.returnUrl]);
      //         },
      //         error => {
      //             this.error = error;
      //             this.loading = false;
      //         });
  }

  // For Mobile Flag
  telInputObject(event) {
    this.mobileFlagEvent = event
  }

  onCountryChange(event){

  }

  showpass(){
    this.showPassword = !this.showPassword
  }

  showconfirmpass(){
    this.showConfirmPassword = !this.showConfirmPassword
  }
}
