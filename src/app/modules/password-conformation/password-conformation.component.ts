import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { MustMatch } from '../../reset-password/must-match.validator'
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../core/service/alert.service'

@Component({
  selector: 'app-password-conformation',
  templateUrl: './password-conformation.component.html',
  styleUrls: ['./password-conformation.component.css']
})
export class PasswordConformationComponent implements OnInit {
  token : any
  email : any;
  resetForm: FormGroup;
  submitted = false;
  passMatch : boolean = false;
  passwrd : boolean = false;
  showLoginButton : boolean = false;
  password : any = "";
  confirmPassword :any = "";

  constructor(
    private alertservice : AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
    // this.route.params.subscribe(params => {
    //   this.token = params['token']

    //   console.log("Token-----",this.token)
    // })

    this.route.queryParamMap.subscribe(queryParams => {
      console.log("Token---",queryParams.get("code"))
      this.token = queryParams.get("code")
      this.email = queryParams.get("encrp_email");
      console.log("email--",this.email);
      if(this.token && this.email){
        this.verifyEmailandCode();
      }
      else
      {
        // this.router.navigate(['/login']);
      }
    })
   }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      confirmPassword : ['', [Validators.required]]
    }, {
      validators : MustMatch('password', 'confirmPassword')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }


  

  confirmPasswordChange(event){
    console.log("confrm pass==",event.target.value,this.resetForm.value.password);
    // this.resetForm.value.password
    if(event.target.value === this.resetForm.value.password || event.target.value == this.password){
      this.confirmPassword = event.target.value;
      this.passMatch = true;
    }
    else{
      this.confirmPassword = event.target.value;
      this.passMatch = false;
    }
    this.storeconfrmPass(event.target.value);
  }
  storeconfrmPass(pass){
    this.confirmPassword = pass;
  }

  PasswordChange(event){
    console.log("pass--",this.password,event.target.value);
    console.log("confirm pass--",this.confirmPassword);
    if(event.target.value.length >= 6){
      console.log("pass--",event.target.value);
      this.password = event.target.value;
      this.passwrd = true;
      if(event.taget.value == this.confirmPassword){
        this.passMatch = true;
      }
      else{
        this.passMatch = false;
      }
    }
    else{
      this.passwrd = false;
      if(event.taget.value == this.confirmPassword){
        this.passMatch = true;
      }
      else{
        this.passMatch = false;
      }
    }    
    this.storePass(event.target.value);
  }
  storePass(pass){
    this.password = pass;
  }
  resetPassword(){
    this.submitted = true;
    console.log("Reset Password-----");

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }
    var request = {
     email : this.f.email.value,
     password : this.f.password.value,
     confirmpassword : this.f.confirmPassword.value,
     code : this.token
    }
    this.authenticationService.passwordConfirmation(request).subscribe(res => {
      this.toastr.success(res)
      console.log("Res----",res)
      if(res){
        this.showLoginButton = true;
      }
    },error => {
      this.toastr.error(error.Message)
      console.log("Error----",error)
    })
  }

  verifyEmailandCode(){
    let req = {
      email : this.email,
      code : this.token
    };
    this.authenticationService.verifyEmailandCode(req).subscribe(res=>{
      console.log("res---",res);
    },error=>{
      this.alertservice.error(error.Messages);
      // this.router.navigate(['/login']);
    })
  }
}
