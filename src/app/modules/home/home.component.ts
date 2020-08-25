import { Component, OnInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $(document).ready(() => {
      $('.sidebar').on('mouseover', function() {
          // $('.sidebar').addClass('sidebar-expanded');
          // $('.sidebar').removeClass('sidebar-collapsed');
          $('.sidebar').addClass('sidebar-collapsed');
          // $('.page___content').removeClass('page-expanded');
      });

      $('.sidebar').on('mouseout', function() {
          // $('.sidebar').removeClass('sidebar-expanded');
          // $('.sidebar').addClass('sidebar-collapsed');
          $('.sidebar').removeClass('sidebar-collapsed');
          // $('.page___content').addClass('page-expanded');
      });
    }) 
  }

}
