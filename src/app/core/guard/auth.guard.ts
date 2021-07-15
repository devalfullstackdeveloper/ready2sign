import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
         const currentUser = this.authenticationService.currentUserValue;
        //  console.log("Current-User---",currentUser)
         if (currentUser) {
          // logged in so return true
          if(route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){
            this.router.navigate(['/login']);
            return false
          }
            return true;
         }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
