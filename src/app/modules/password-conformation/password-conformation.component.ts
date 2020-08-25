import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { MustMatch } from '../../reset-password/must-match.validator'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-password-conformation',
  templateUrl: './password-conformation.component.html',
  styleUrls: ['./password-conformation.component.css']
})
export class PasswordConformationComponent implements OnInit {
  token : any

  resetForm: FormGroup;
  submitted = false;

  constructor(
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
    },error => {
      this.toastr.error(error)
      console.log("Error----",error)
    })


  }

}
