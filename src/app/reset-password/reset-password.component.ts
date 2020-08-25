import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { MustMatch } from './must-match.validator'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required,Validators.minLength(6)]],
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
      OldPassword : this.f.oldPassword.value,
      Password : this.f.password.value,
      confirmPassword : this.f.confirmPassword.value
    }

    this.authenticationService.changePassword(request).subscribe(res => {
      console.log("Res----",res);
      this.toastr.success("Password changed successfully")
    },error => {
      this.toastr.error(error)
      console.log("Error---",error);
    });


  }

}
