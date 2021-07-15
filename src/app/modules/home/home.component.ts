import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loadAPI: Promise < any > ;
  constructor(
    private router: Router
  ) {
    this.loadAPI = new Promise((resolve) => {
			this.loadScript();
			resolve(true);
    });

    if(this.router.url == '/admin'){
      this.router.navigate(['/admin/home']);
    }
  }
  loadScript(){
    var isFound = false;
		var scripts = document.getElementsByTagName("script")
		for (var i = 0; i < scripts.length; ++i) {
			if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("loader")) {
				isFound = true;
			}
		}

		if (!isFound) {
			var dynamicScripts = [
        "assets/js/jquery-2-1.min.js",
				"assets/js/script.js",
			];

			for (var i = 0; i < dynamicScripts.length; i++) {
				let node = document.createElement('script');
				node.src = dynamicScripts[i];
				node.type = 'text/javascript';
				node.async = false;
				node.charset = 'utf-8';
				document.getElementsByTagName('head')[0].appendChild(node);
			}
		}
  }

  ngOnInit(): void {

    this.templateGroupHoverDropDown();
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



  // Menu expand and collapse funtionality
  // $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
  //   $('.page-content').toggleClass('page-expanded page-collapsed');


  //   $('.sidebar').on('mouseover', function() {
  //       $('.sidebar').addClass('sidebar-expanded');
  //       $('.sidebar').removeClass('sidebar-collapsed');
  //       $('.page-content').addClass('page-collapsed');
  //       $('.page-content').removeClass('page-expanded');
  //   });

  //   $('.sidebar').on('mouseout', function() {
  //       $('.sidebar').removeClass('sidebar-expanded');
  //       $('.sidebar').addClass('sidebar-collapsed');
  //       $('.page-content').removeClass('page-collapsed');
  //       $('.page-content').addClass('page-expanded');
  //   });
    })

  }

  templateGroupHoverDropDown(){
  //   $(document).ready(function(){
  //     $('span.group').on("mouseenter",function() {
  //       alert("mouseOver");
  //       $('.group-popup').removeClass('open-popup');
  //       $('.group-popup').slideUp('slow');
  //       $(this).parent().find('.group-popup').addClass('open-popup');
  //       // if ($(this).hasClass('g1')) {
  //       //   $(this).addClass('dark-blue-fill');
  //       // }
  //       // else if ($(this).hasClass('g2')) {
  //       //   $(this).toggleClass('light-blue-fill');
  //       // }
  //       // else {
  //       //   $(this).toggleClass('trans-fill');
  //       // }
  //       setTimeout(function() {
  //             $('.group-popup.open-popup').slideDown('slow');
  //         }, 110);
  //     })
  // });

  }

}
