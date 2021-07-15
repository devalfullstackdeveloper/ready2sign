import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { MustMatch } from './must-match.validator'
import { ToastrService } from 'ngx-toastr';

export function patternValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    const valid = regex.test(control.value);
    return valid ? null : { invalidPassword: true };
  };
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  submitted = false;
  accountId: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required,Validators.minLength(8)]],
      password: ['', [Validators.required,Validators.minLength(8), patternValidator()]],
      confirmPassword : ['', [Validators.required]]
    }, {
      validators : MustMatch('password', 'confirmPassword')
    });
    this.getMyProfile();
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  resetPassword(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    var request = {
      OldPassword : this.f.oldPassword.value,
      Password : this.f.password.value,
      confirmPassword : this.f.confirmPassword.value,
      AccountId: this.accountId
    }

    this.authenticationService.changePassword(request).subscribe(res => {
      this.toastr.success("Password changed successfully")
    },error => {
      this.toastr.error(error)
    });


  }

  getMyProfile(){
    this.authenticationService.getUserProfile().subscribe(res => {
      this.accountId = res.AccountId;
    })
  }

}
