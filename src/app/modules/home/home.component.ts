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

      // var selector = '.nav li';

      // $(selector).on('click', function(){
      //     $(selector).removeClass('active');
      //     $(this).addClass('active');
      // });

      $(".nav>li").click(function(){
        $(".nav>li").removeClass("active");
        $(this).addClass("active");
     })

  //    $(".nav>li").hover(function(){
  //     $(".nav>li").removeClass("active");
  //     $(this).addClass("active");
  //  })

      // $('.sidebar').on('mouseover', function() {
      //     // $('.sidebar').addClass('sidebar-expanded');
      //     // $('.sidebar').removeClass('sidebar-collapsed');
      //     $('.sidebar').removeClass('sidebar-collapsed');
      //     // $('.page___content').removeClass('page-expanded');
      // });

      // $('.sidebar').on('mouseout', function() {
      //     // $('.sidebar').removeClass('sidebar-expanded');
      //     // $('.sidebar').addClass('sidebar-collapsed');
      //     $('.sidebar').addClass('sidebar-collapsed');
      //     // $('.page___content').addClass('page-expanded');
      // });

     // Edit User Popup open close functionality

     $('selector').click(function() {
      $('selector.active').removeClass("active");
      $(this).addClass("active");
    });
  $('.invite-user-btn').on('click', function() {
    $('.site-search-wrapper.add-user-block').show();

    $(".site-search-wrapper.add-user-block .card").animate({
      right: "0%"
    });
  });

  $('.site-search-wrapper .close').on('click', function() {
    $('.site-search-wrapper.add-user-block').hide();

    $(".site-search-wrapper.add-user-block .card").animate({
      right: "-776px"
    });
  });

  // To close options block on outside of click
  $(document).mouseup(function(e) {
    var container = $(".info-popup-sm");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
  });

  // Menu expand and collapse funtionality
  $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.page-content').toggleClass('page-expanded page-collapsed');


    $('.sidebar').on('mouseover', function() {
      console.log("test");
        $('.sidebar').addClass('sidebar-expanded');
        $('.sidebar').removeClass('sidebar-collapsed');
        $('.page-content').addClass('page-collapsed');
        $('.page-content').removeClass('page-expanded');
    });

    $('.sidebar').on('mouseout', function() {
        $('.sidebar').removeClass('sidebar-expanded');
        $('.sidebar').addClass('sidebar-collapsed');
        $('.page-content').removeClass('page-collapsed');
        $('.page-content').addClass('page-expanded');
    });

    }) 
    
  }

}
