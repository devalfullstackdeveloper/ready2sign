import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  submitted = false;
  success:boolean= false;
  error:boolean= false;
  successRes = "";
  errorRes = "";

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.forgotForm.controls; }

  resetPassword(){
    console.log("Password reset-----");

    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotForm.invalid) {
        return;
    }

    this.authenticationService.forgotPassword(this.f.email.value).subscribe(res => {
      
      this.success = true;
      this.error = false;
      this.successRes = res;
      console.log("success--",res);
    },error => {      
      console.log(error.Message);
      this.error = true;
      this.success = false;
      this.errorRes = error.Message;
    })
  }
}
