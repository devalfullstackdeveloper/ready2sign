$(document).ready(function(){
  // Edit User Popup open close functionality
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

});

