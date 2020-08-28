import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { AlertService } from '../../core/service/alert.service';


@Component({ templateUrl: 'login.component.html',styleUrls: ['./login.component.css'] })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private alert : AlertService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            // email: ['', [Validators.required,Validators.email]],
            password: ['', [Validators.required,Validators.minLength(6)]],
            // acceptTerms: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
      console.log("Calling---")
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    // this.router.navigate([this.returnUrl]);
                    this.router.navigate(['/admin/home']);
                },
                error => {                    
                    this.error = error;
                    this.loading = false;
                    this.alert.error(error.error_description);
                });
    }

    acceptsTC(e){
      console.log("target---",e.target.value)
      // this.f.acceptTerms = true
      // this.loginForm.setValue({acceptTerms : true})
    }
}
