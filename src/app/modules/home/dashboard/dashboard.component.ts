import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/data/service/user.service';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data : any = []
  selectedType = 'draft'

  drafts : any = [];
  approvals : any = [];
  sents : any = [];
  withdrawns : any = [];
  completeds : any = [];
  expireds : any = [];

  selectedDraft : any


  accountNumber : any
  constructor(
    private userService: UserService, private authenticationService:AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.staticData()
    this.authenticationService.getActiveAccountNumber().subscribe(data => {
      
      this.accountNumber = data
      console.log("---Dashboard-Init---",this.accountNumber);
      // console.log("Account-Number---",data);
      // console.log("Acc-No---",(<any>window).activeAcountNumber)
    })
  }

  click(){
    this.userService.get().subscribe((res)=>{
      //console.log(res);
    });
  }

  signOut(){
    this.authenticationService.logout();
  }

  documentChange(type){
    // console.log("Selected type---",type)
    this.selectedType = type
  }

  staticData(){
    this.data = [
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 28,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 30,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 15,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 35,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 17,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 45,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 10,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 55,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 37,
        city : 'Pardi'
      },
      {
        name : 'Soham',
        email : 'test@gmail.com',
        age : 39,
        city : 'Pardi'
      }
    ]

    this.drafts = [
      {
        id: 1,
        title:'Property agreement xyz 1',
        email:'adam1.richards@r2s.com',
        modified:'23/05/2020 14:23',
        recipient_email: 'adam1.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status:'Draft',
        number: null,
        options: false
      },
      {
        id:2,
        title:'Property agreement xyz 2',
        email:'adam2.richards@r2s.com',
        modified:'23/05/2020 14:23',
        recipient_email: 'adam2.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status:'Sent',
        number: 7,
        options: false
      },
      {
        id:3,
        title:'Property agreement xyz 3',
        email:'adam3.richards@r2s.com',
        modified:'23/05/2020 14:23',
        recipient_email: 'adam2.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status:'Sent',
        number: 8,
        options: false
      },
      {
        id:4,
        title:'Property agreement xyz 4',
        email:'adam4.richards@r2s.com',
        modified:'23/05/2020 14:23',
        recipient_email: 'adam4.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status:'Draft',
        number: null,
        options: false
      },
      {
        id:5,
        title:'Property agreement xyz 5',
        email:'adam5.richards@r2s.com',
        modified:'23/05/2020 14:23',
        recipient_email: 'adam5.richards@r2s.com',
        recipient_date: '23/05/2020 14:23',
        status:'Completed',
        number: null,
        options: false
      }
    ]

  }

  selectDraft(id){
    this.selectedDraft = id
  }

  selectOption(index){
    for(var i=0;i < this.drafts.length; i++){
      if(i == index){
        this.drafts[index].options = !this.drafts[index].options
      }else{
        this.drafts[i].options = false
      }
    }
  }

  addDuplicate(index,draft){
    // let dd1 = this.drafts[index]
    // let dd = dd1
    // console.log("Length---", this.drafts.length)

    // dd.id = this.drafts.length + 1
    // dd.options = false
    // console.log("new-Draft----",dd);
    // console.log("old-Draft---",this.drafts[index])
    // this.drafts.splice(index,0, dd)

    // console.log("Length--1-", this.drafts.length)

    var dd: any = {}

    for(const property in draft){
      dd[property] = draft[property];
    }

    dd.id = this.drafts.length + 1
    dd.options = false

    this.drafts.splice(index+1,0, dd)

    // set
    this.drafts[index].options = false

  }

  deleteDraft(index){
    this.drafts.splice(index,1)
  }

}
