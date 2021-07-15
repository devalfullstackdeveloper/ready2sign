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
    return this.http.get<any>(`${environment.apiUrl}/api/user/getadminusers/${data}`,{headers:this.httpHeader});
  }

  updateCompanyProfile(data){
    return this.http.put<any>(`${environment.apiUrl}/api/account`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getAllUsers(data,filter){
    const httpOptions = {
      headers: this.httpHeader,
      // params: {'$top': filter.top,'$skip':filter.skip,'$orderby':filter.filterOn+'_'+filter.order,'searchtext':filter.search,'status':filter.status}
      params: {'$skip':filter.skip,'$orderby':filter.filterOn+'_'+filter.order,'searchtext':filter.search,'status':filter.status}
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

  getUserById(data,accountId){
    return this.http.get<any>(`${environment.apiUrl}/api/user/${data}/${accountId}`,{headers:this.httpHeader})
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

  updateStatus(id,status,accountId){
    return this.http.patch<any>(`${environment.apiUrl}/api/user/setstatus/${id}/${status}/${accountId}`,{headers:this.httpHeader})
    .pipe(map(res => {
      return res;
    }))
  }

  resendUserInvite(id){
    return this.http.post<any>(`${environment.apiUrl}/api/user/resendinvite/${id}`,{headers:this.httpHeader})
    .pipe(map(res => {
      return res;
    }))
  }

  deleteUserInvite(id){
    return this.http.put<any>(`${environment.apiUrl}/api/user/deleteinvite/${id}`,{headers:this.httpHeader})
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

  uploadFile(data){
    return this.http.post<any>(`${environment.apiUrl}/api/file/upload`,data, {headers:this.httpHeader})
    .pipe(map(res=>{
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
    // console.log("data for send---",data,JSON.stringify(data));
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin':'*'
    })
    return this.http.post<any>(`https://login.propertyme.com/connect/token`,data,{headers:httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  saveToken(data){
    var User = this.currentUserSubject.value;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ User.access_token
    })
    return this.http.post<any>(`${environment.apiUrl}/api/app/token`,data,{headers:httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }
  getAllApps(data,filter){
    const httpOptions = {
      headers: this.httpHeader,
      params: {'$orderby':filter.filterOn+'_'+filter.order,'searchtext':filter.search,'status':filter.status}
    };

    return this.http.get<any>(`${environment.apiUrl}/api/app/${data}`,httpOptions)
    .pipe(map(res=>{
      return res;
    }))
  }

  updateApp(data){
    return this.http.put<any>(`${environment.apiUrl}/api/app/UpdateApp`,data, {headers: this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getAddressFromGoogle1(text){
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +text +'&key=AIzaSyA8rJ9jrXHQHgbGqcTq00XemqeIhXVDC0s';
    return this.http.get<any>(url)
    .pipe(map(res=>{
      return res;
    }))
  }
  // https://ready2signapi.newpathstudio.com.au/api/app/1?searchtext=prop&$orderby=Name_Asc&$filter=true

  getGropsList(data, filter){

    const httpOptions = {
      headers: this.httpHeader,
      params: {}
    }

    let filterString = ""

    if(filter.search){
      if(filterString){
        filterString += " and indexof(tolower(Name),tolower('"+String(filter.search)+"')) gt -1"
      }else{
        filterString += " indexof(tolower(Name),tolower('"+String(filter.search)+"')) gt -1"
      }
    }

    if(filterString){
      httpOptions.params = {'$skip':filter.skip,'$orderby':filter.filterOn+' '+filter.order,'searchtext':filter.search,'status':filter.status, '$filter':filterString}
    } else {
      httpOptions.params = {'$skip':filter.skip,'$orderby':filter.filterOn+' '+filter.order,'searchtext':filter.search,'status':filter.status}
    }

    return this.http.get<any>(`${environment.apiUrl}/api/account/getgridgroups/${data}`,httpOptions)
    // return this.http.get<any>(`${environment.apiUrl}/api/account/getgridgroups/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  createGroup(data){
    return this.http.post<any>(`${environment.apiUrl}/api/account/creategroup`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  editGroup(data){
    return this.http.post<any>(`${environment.apiUrl}/api/account/updategroup`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  activateGroup(data){
    return this.http.patch<any>(`${environment.apiUrl}/api/account/activategroup/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }
  inActivateGroup(data){
    return this.http.patch<any>(`${environment.apiUrl}/api/account/deactivategroup/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }
  deleteGroup(data){
    return this.http.delete<any>(`${environment.apiUrl}/api/account/deletegroup/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  checkEmailExist(email, accountId){
    return this.http.get<any>(`${environment.apiUrl}/api/user/IsEmailExist/${email}/${accountId}`,{headers:this.httpHeader})
    .pipe(map(res => {
      return res;
    }))
  }

  getGroupDetailsById(data){
    return this.http.get<any>(`${environment.apiUrl}/api/account/groupsdetail/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }
}
