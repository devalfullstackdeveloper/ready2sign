import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/data/model/user/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  httpHeader:any;
  constructor(private http:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    var User = this.currentUserSubject.value;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ User.access_token
    })
  }

  getAccount(data){
    return this.http.get<any>(`${environment.apiUrl}/api/account/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getAdminUsers(data){
    return this.http.get<any>(`${environment.apiUrl}/api/user/getadminusers/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      res = [
        {
          "id":1,
          "name":"Alex Blundell"
        },
        {
          "id":2,
          "name":"Alex Blundell 2"
        },
        {
          "id":3,
          "name":"Alex Blundell 3"
        },
        {
          "id":4,
          "name":"Alex Blundell 4"
        }
      ]
      return res;
    }))
  }

  updateCompanyProfile(data){
    return this.http.put<any>(`${environment.apiUrl}/api/account`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getAllUsers(data,filter){    
    console.log("json--",data,filter);
    const httpOptions = {
      headers: this.httpHeader,
      params: {'$top': filter.top,'$skip':filter.skip,'$orderby':filter.filterOn+'_'+filter.order}
    };

    return this.http.get<any>(`${environment.apiUrl}/api/user/getusersbyaccount/${data}`,httpOptions)
    .pipe(map(res=>{
      return res;
    }))
  }  

  inviteUser(data){
    return this.http.post<any>(`${environment.apiUrl}/api/user/create`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getUserById(data){
    return this.http.get<any>(`${environment.apiUrl}/api/user/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  updateUser(data){
    return this.http.put<any>(`${environment.apiUrl}/api/user`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  updateStatus(id,status){
    return this.http.patch<any>(`${environment.apiUrl}/api/user/setstatus/${id}/${status}`,{headers:this.httpHeader})
    .pipe(map(res => {
      return res;
    }))
  }

  deleteUser(id){
    return this.http.delete<any>(`${environment.apiUrl}/api/user/${id}`,{headers:this.httpHeader})
    .pipe(map(res => {
      return res
    }))
  }

  saveToken(data){
    console.log("data---",data);
    var User = this.currentUserSubject.value;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ User.access_token
    })
    return this.http.post<any>(`${environment.apiUrl}/api/app/token`,data,{headers:httpHeader})
    .pipe(map(res=>{
      console.log("res---",res);
      return res;
    }))
  }

  getAuthToken(code){
    let data = {
      grant_type : "authorization_code",
      client_id : "8e9f08d6-566e-4ba1-b43f-c46511c8a17d",
      client_secret : "8ca09131-6e29-4e2c-a425-0d3b9f4bed13",
      redirect_uri : "http://localhost:65385/home/callback",
      code : code,
    }
    // JSON.stringify({email: email, password: password})
    console.log("data for send---",data,JSON.stringify(data));
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    return this.http.post<any>(`https://login.propertyme.com/connect/token`,data,{headers:httpHeader})
    .pipe(map(res=>{
      console.log("auth generated---",res);
      return res;
    }))
  }
}
