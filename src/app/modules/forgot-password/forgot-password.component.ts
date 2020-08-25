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
      // console.log("Res----",res)
      this.toastr.success(res)
    },error => {
      this.toastr.error(error);
    })

  }

}
