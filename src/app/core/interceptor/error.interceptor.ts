import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(catchError(err => {
            console.log("error in  interceptor--",err);
            // if (err.status === 401) {
            //     this.authenticationService.logout();
            // }
            // else {
            //     const error = err.error.message || err.statusText;
            //     return throwError(error);
            // }

            if (err.status === 401) {
                console.log("401----",err);
                this.authenticationService.logout();
            }
            else if(err.status === 400)
            {
                console.log("400----",err);
                return throwError(err.error);
            }
            else
            {
                console.log("any----",err);
                const error = err.error.message || err.statusText;
                return throwError(err);
            }
        }))
    }
}

