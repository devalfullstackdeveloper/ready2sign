import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, Subject, of } from 'rxjs';
import { map, catchError  } from 'rxjs/operators';
import { User } from 'src/app/data/model/user/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    public $accountNumber = new Subject<any>();
    private selectedAccountNumber : BehaviorSubject<Number>

    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router,) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        // this.$accountNumber = (<any>window).activeAcountNumber
        this.selectedAccountNumber = new BehaviorSubject<Number>(JSON.parse(localStorage.getItem('acccountNumber')))
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get selectedAccountNumberValue(): Number {
      return this.selectedAccountNumber.value
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
                this.currentUserSubject.next(user);
                this.startRefreshTokenTimer();
                localStorage.setItem('currentUser', JSON.stringify(user));
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
        }),
        catchError(error => {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          // return of(0)
          throw new Error(error)
        }));
    }

    private getRefreshToken() {
        var storageJson = localStorage.getItem("currentUser");
        var tokenDetails = JSON.parse(storageJson);
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

    updateUserProfile(data){
      var User = this.currentUserSubject.value;

      const httpHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ User.access_token
      })

      return this.http.put<any>(`${environment.apiUrl}/api/user/updateuserprofile`, data, {headers: httpHeader})
      .pipe(map(res=>{
        return res;
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
    }

    getActiveAccountNumber(){
      // console.log("Account Number---",(<any>window).activeAcountNumber)
      // console.log("Subject Account---",this.$accountNumber)
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

    getDocumentDetailById(id, partyId){
      return this.http.get<any>(`${environment.apiUrl}/api/document/${id}/${partyId}`)
      .pipe(map(res=>{
        return res;
      }))
    }

    editDocument(data){
    return this.http.put<any>(`${environment.apiUrl}/api/Document/UpdateDocumentViaLink`,data)
    .pipe(map(res=>{
      return res;
    }))
  }

    signDocument(data){
      return this.http.post<any>(`${environment.apiUrl}/api/document/signdocument/`,data)
      .pipe(map(res=>{
        return res;
      }))
    }

    sendVerificationCode(data){
      return this.http.post<any>(`${environment.apiUrl}/api/smsauthenticator/requestcode`,data)
      .pipe(map(res=>{
        return res;
      }))
    }

    verifyCode(data){
      return this.http.post<any>(`${environment.apiUrl}/api/smsauthenticator/verifycode`,data)
      .pipe(map(res=>{
        return res;
      }))
    }

    uploadFile(data){
      return this.http.post<any>(`${environment.apiUrl}/api/file/upload`,data)
      .pipe(map(res=>{
        return res;
      }))
    }

    withdrawnByRecipient(data){
      return this.http.post<any>(`${environment.apiUrl}/api/document/withdrawnbyrecipient/`,data)
      .pipe(map(res=>{
        return res;
      }))
    }

    propertyMe(data,token){
      var httpHeader = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': 'Bearer '+ token
      })

      // return this.http.post<any>("https://login.propertyme.com/connect/token",data,{headers:this.httpHeader})
      return this.http.post<any>(`${environment.apiUrl}/api/propertyme/token`,data,{headers: httpHeader})
      .pipe(map(res => {
        return res;
      }));
    }

}
