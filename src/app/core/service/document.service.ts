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
export class DocumentService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  httpHeader:any;

  //----- this is test for set and get data between 2 component
  private _createDoc : BehaviorSubject<any> = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('Document')));

  public docData$ = this._createDoc.asObservable();

  constructor(private http:HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    var User = this.currentUserSubject.value;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ User.access_token
    })
  }

  //get created data
  get docData() : any {
    return this._createDoc.value;
  }

  set docData(value: any) {
    localStorage.setItem('Document',JSON.stringify(value))
    this._createDoc.next(value);
  }

  getDocumentDetailById(data){
    return this.http.get<any>(`${environment.apiUrl}/api/document/${data}`)
    .pipe(map(res=>{
      return res;
    }))
  }

  sendDocuments(data){
    return this.http.post<any>(`${environment.apiUrl}/api/document/sent/`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getUserProfile(){
    return this.http.get<any>(`${environment.apiUrl}/api/user/userprofile`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getDocSidebarData(acc_number){
    return this.http.get<any>(`${environment.apiUrl}/api/document/getlabelcounts/${acc_number}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getDocumentsSideWise(acc_number,type,filter){
    const httpOptions = {
      headers: this.httpHeader,
      params:{}
    }

    let filterString = ""

    if(filter.search){
      if(filterString){
        filterString += " and indexof(tolower(Title),tolower('"+String(filter.search)+"')) gt -1"
      }else{
        filterString += " indexof(tolower(Title),tolower('"+String(filter.search)+"')) gt -1"
      }
    }

    if(filterString){
      httpOptions.params = {'$skip':filter.skip,'$inlinecount':'allpages','$orderby':filter.filterOn+' '+filter.order,'$filter':filterString}
    }else{
      httpOptions.params = {'$skip':filter.skip,'$inlinecount':'allpages','$orderby':filter.filterOn+' '+filter.order}
    }

    return this.http.get<any>(`${environment.apiUrl}/api/document/getdocuments/${acc_number}/${type == 0 ? null : type}`, httpOptions)
    .pipe(map(res=>{
      return res;
    }))
  }

  getContacts(acc_number,searchText){
    return this.http.get<any>(`${environment.apiUrl}/api/contact/getcontactsbyaccount/${acc_number}/${searchText}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  createDocument(data){
    return this.http.post<any>(`${environment.apiUrl}/api/document/`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  editDocument(data){
    return this.http.put<any>(`${environment.apiUrl}/api/document/`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  deleteDocument(id){
    return this.http.delete<any>(`${environment.apiUrl}/api/document/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  duplicateDocument(id){
    return this.http.post<any>(`${environment.apiUrl}/api/document/duplicate/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getAllUsers(acc_number,search_text,groups){
    const httpOptions = {
      headers: this.httpHeader,
      params:{searchtext : search_text,group : groups ? groups : ''}
    };

    return this.http.get<any>(`${environment.apiUrl}/api/user/getusersbyaccount/${acc_number}`,httpOptions)
    .pipe(map(res=>{
      return res;
    }))
  }

  withdrawDocument(data){
    return this.http.post<any>(`${environment.apiUrl}/api/document/withdrawn/`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  rejectDocument(data){
    return this.http.post<any>(`${environment.apiUrl}/api/document/reject`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  approveDocument(data){
    return this.http.post<any>(`${environment.apiUrl}/api/document/approve/`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getSendDocument(id){
    return this.http.get<any>(`${environment.apiUrl}/api/document/getsenddocument/${id}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  getDocumentContent(id){
    return this.http.get<any>(`${environment.apiUrl}/api/document/getsenddocumentcontent/${id}`,{headers:this.httpHeader})
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
    return this.http.post<any>(`${environment.apiUrl}/api/smsauthenticator/sendcode`,data)
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

  editExpityDateofDocument(data){
    return this.http.put<any>(`${environment.apiUrl}/api/document/update_expiry_date`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  updatePartyContact(data){
    return this.http.put<any>(`${environment.apiUrl}/api/document/updatepartycontact`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  createContact(data){
    return this.http.post<any>(`${environment.apiUrl}/api/contact/`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  updateContact(data){
    return this.http.put<any>(`${environment.apiUrl}/api/contact/updatecontact`,data,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  resendDocument(documentid, partyId){
    return this.http.post<any>(`${environment.apiUrl}/api/document/Resend/${documentid}/${partyId}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }

  downloadDocument(documentid){
    return this.http.get<any>(`${environment.apiUrl}/api/document/downloadCompleteDoc/${documentid}`,{headers:this.httpHeader})
    .pipe(map(res=>{
      return res;
    }))
  }
}
