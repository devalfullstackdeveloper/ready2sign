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
export class TemplateService {
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

  getAllTemplates(data,filter){
    const httpOptions = {
      headers: this.httpHeader,
      params:{}
    }
    let filterString = ""

    if(filter.selectedGroup){
      if(filterString){
        filterString += " and Groups/any(d:d/Id eq "+filter.selectedGroup+")";
      }else{
        filterString += "Groups/any(d:d/Id eq "+filter.selectedGroup+")";
      }

    }

    if(filter.author){
      if(filterString){
        filterString += " and indexof(Author,'"+String(filter.author)+"') gt -1"
      }else{
        filterString += "indexof(Author,'"+String(filter.author)+"') gt -1"
      }
    }

    if(filter.search){
      if(filterString){
        filterString += " and indexof(tolower(Title),tolower('"+String(filter.search)+"')) gt -1"
      }else{
        filterString += " indexof(tolower(Title),tolower('"+String(filter.search)+"')) gt -1"
      }
    }

    if(filterString){
      // httpOptions.params = {'$top': filter.top,'$skip':filter.skip,'$inlinecount':'allpages','$orderby':filter.filterOn+' '+filter.order,'$filter':filterString}
      httpOptions.params = {'$skip':filter.skip,'$inlinecount':'allpages','$orderby':filter.filterOn+' '+filter.order,'$filter':filterString}
    }else{
      // httpOptions.params = {'$top': filter.top,'$skip':filter.skip,'$inlinecount':'allpages','$orderby':filter.filterOn+' '+filter.order}
      httpOptions.params = {'$skip':filter.skip,'$inlinecount':'allpages','$orderby':filter.filterOn+' '+filter.order}
    }

    return this.http.get<any>(`${environment.apiUrl}/api/template/getTemplates/${data}/${filter.type}`,httpOptions)
    .pipe(map(res=>{
      return res;
    }))
  }
  getpartystatus(){
    return this.http.get<any>(`${environment.apiUrl}/api/template/getpartystatus`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getPropertyMeTypes(){
    return this.http.get<any>(`${environment.apiUrl}/api/template/GetPartyTypes`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getActiveGroups(data){
    return this.http.get<any>(`${environment.apiUrl}/api/account/groups/${data}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getAllAuthors(id){
    return this.http.get<any>(`${environment.apiUrl}/api/template/getauthors/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getSidebarData(id){
    return this.http.get<any>(`${environment.apiUrl}/api/template/getstatuscount/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  createTemplate(data){
    return this.http.post<any>(`${environment.apiUrl}/api/template/create`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getTemplateById(id){
    return this.http.get<any>(`${environment.apiUrl}/api/template/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  updateTemplate(data) :Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/template/`,data, {headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  deleteTemplateById(id){
    return this.http.delete<any>(`${environment.apiUrl}/api/template/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  duplicateTemplateById(id){
    return this.http.post<any>(`${environment.apiUrl}/api/template/duplicate/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  uploadFile(data){
    return this.http.post<any>(`${environment.apiUrl}/api/file/upload`,data, {headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  deleteFile(data){
    return this.http.post<any>(`${environment.apiUrl}/api/file/deletefile`,data, {headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getCluses(id){
    return this.http.get<any>(`${environment.apiUrl}/api/template/getaccountclauses/${id}`, {headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  restoreTemplate(id){
    return this.http.patch<any>(`${environment.apiUrl}/api/Template/draft/${id}`, {headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getCurrency(){
    return this.http.get<any>(`${environment.apiUrl}/api/Template/getCurrencies`, {headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }
}
