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

  getAllUsers(data,filterstring){
    console.log("json--",filterstring);
    return this.http.get<any>(`${environment.apiUrl}/api/user/getusersbyaccount/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getAllUsers2(data,filter){
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
}
