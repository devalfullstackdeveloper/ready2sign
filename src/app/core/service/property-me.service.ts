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
export class PropertyMeService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  httpHeader:any;

  constructor(private http:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    var User = this.currentUserSubject.value;
    this.httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer '+ User.access_token
    })
   }

  propertyMe(data){
    // return this.http.post<any>("https://login.propertyme.com/connect/token",data,{headers:this.httpHeader})
    return this.http.post<any>(`${environment.apiUrl}/api/propertyme/token`,data,{headers:this.httpHeader})
    .pipe(map(res => {
      return res;
    }));
  }

  salerPropertyMe(id){
    return this.http.get<any>(`${environment.apiUrl}/api/propertyme/sales/${id}`)
    .pipe(map(res => {
      return res;
    }));
  }

  rentalPropertyMe(id){
    return this.http.get<any>(`${environment.apiUrl}/api/propertyme/rentals/${id}`)
    .pipe(map(res => {
      return res;
    }));
  }

  tenancyPropertyMe(accountId,id){
    return this.http.get<any>(`${environment.apiUrl}/api/propertyme/tenancies/${accountId}/${id}`)
    .pipe(map(res => {
      return res;
    }));
  }

  contactsPropertyMe(accountId,ids){
    return this.http.get<any>(`${environment.apiUrl}/api/propertyme/contacts/${accountId}/${ids}`)
    .pipe(map(res => {
      return res;
    }));
  }

  getPropertyDetailUsingLotId(accountId, folioId){
    return this.http.get<any>(`${environment.apiUrl}/api/propertyme/properties/${folioId}/${accountId}`)
    .pipe(map(res => {
      return res;
    }));
  }
}
