import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from 'src/environments/environment';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private spinner : NgxSpinnerService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.spinner.hide();
                this.authenticationService.logout();
            } else if (err.status === 400) {
                return throwError(err.error);
            } else {
                const error = err.error.message || err.statusText;
                return throwError(err);
            }
        }))
    }
}

