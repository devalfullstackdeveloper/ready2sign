import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public subject = new Subject<any>();
  constructor(private router: Router, private toastr: ToastrService) {
    router.events.subscribe(event => {
      this.subject.next();
    });
   }

   success(message: string) {
    this.subject.next({ type: 'success', text: message });
  }

  successPage(message: string) {
    this.subject.next({ type: 'success', text: message });
    this.toastr.success(message)
  }


  error(message: string) {
    this.subject.next({ type: 'danger', text: message });
    this.toastr.error(message)
  }



  warning(message: string) {
      this.subject.next({ type: 'warning', text: message });
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
