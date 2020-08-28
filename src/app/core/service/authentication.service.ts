import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/data/model/user/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public $accountNumber = new Subject<any>();

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router,) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        // this.$accountNumber = (<any>window).activeAcountNumber
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        const body = new HttpParams()
            .set('username', username)
            .set('password', password)
            .set('grant_type', 'password');
        return this.http.post<any>(`${environment.apiUrl}/token`, body.toString(), {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
        })
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }

    logout() {
        this.stopRefreshTokenTimer();
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    refreshToken() {
        var refreshToken = this.getRefreshToken();
        console.log("refresh-token---",refreshToken)
        const body = new HttpParams()
            .set('refresh_token', refreshToken)
            .set('grant_type', 'refresh_token');
        return this.http.post<any>(`${environment.apiUrl}/token`, body.toString(), {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')
        }).pipe(map(user => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.startRefreshTokenTimer();
            return user;
        }));
    }

    private getRefreshToken() {
        var storageJson = localStorage.getItem("currentUser");
        var tokenDetails = JSON.parse(storageJson);
        console.log(tokenDetails);
        if (tokenDetails != null)
            return tokenDetails["refresh_token"];
        else
            return null;
    }


    // helper methods

    private refreshTokenTimeout;

    public startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
            const tokenInfo = this.currentUserValue; //JSON.parse(atob(this.userValue.jwtToken.split('.')[1]));
            // set a timeout to refresh the token a minute before it expires
            const expiresgmtTime = new Date(tokenInfo[".expires"]);

            const localGmtTime = new Date(expiresgmtTime.toLocaleString());
            const timeout = localGmtTime.getTime() - Date.now() - (60 * 1000);
            this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    forgotPassword(email : string){
      return this.http.post<any>(`${environment.apiUrl}/api/Authorize/forgotPassword`,{email : email})
        .pipe(map(res => {
          return res
        }))
    }

    passwordConfirmation(data){
      return this.http.post<any>(`${environment.apiUrl}/api/Authorize/resetPassword`,data)
        .pipe(map(res => {
          return res
        }))
    }

    changePassword(data){
      // console.log("User",this.currentUserSubject.value)
      var User = this.currentUserSubject.value;

      const httpHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ User.access_token
      })

      return this.http.post<any>(`${environment.apiUrl}/api/Authorize/ChangePassword`,data,{headers: httpHeader})
      .pipe(map(res => {
        return res
      }))
    }

    getUserProfile(){
      var User = this.currentUserSubject.value

      const httpHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ User.access_token
      })

      return this.http.get<any>(`${environment.apiUrl}/api/user/userprofile`,{headers: httpHeader})
      .pipe(map(res => {
        return res
      }))
    }

    getUserById(data){
      var User = this.currentUserSubject.value

      const httpHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ User.access_token
      })
      return this.http.get<any>(`${environment.apiUrl}/api/user/${data}`,{headers:httpHeader})
      .pipe(map(res=>{
        return res;
      }))
    }
    setActiveAccountNumber(number){
      (<any>window).activeAcountNumber = number
      this.$accountNumber.next(number);
      // console.log("Set-Account-Number---",(<any>window).activeAcountNumber)
    }

    getActiveAccountNumber(){
      console.log("Account Number---",(<any>window).activeAcountNumber)
      return this.$accountNumber.asObservable()
    }

    registerUser(data){
      const httpHeader = new HttpHeaders({
        'Content-Type': 'application/json'        
      })
       return this.http.post<any>(`${environment.apiUrl}/api/authorize/register`,data,{headers:httpHeader})
       .pipe(map(res=>{
         return res;
       }))
    }
    
    verifyEmailandCode(data){
      const httpHeader = new HttpHeaders({
        'Content-Type': 'application/json'        
      })
       return this.http.post<any>(`${environment.apiUrl}/api/Authorize/verifyurl`,data,{headers:httpHeader})
       .pipe(map(res=>{
         return res;
       }))
    }

}
