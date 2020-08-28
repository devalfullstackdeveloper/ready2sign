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
      var Id = params['id']
      console.log("id--",Id);
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
    let data = {
      email :this.User.Email,
      password:this.User.Password,
      confirmPassword:this.User.confirm_Password,
    }
    console.log("Calling---",this.User);
      this.submitted = true;

      this.loading = true;
      this.authenticationService.registerUser(data)
      .subscribe(res=>{
        console.log("res-->",res);
        if(res.WasSuccessful == true){
          this.showLoginButton = true;
          this.alertService.successPage("It is under development");
        }
        else{
          this.showLoginButton = false;
          this.alertService.error("It is under development");
        }
      },error => {
        console.log("Error------",error)
        this.alertService.error(error);
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
}
