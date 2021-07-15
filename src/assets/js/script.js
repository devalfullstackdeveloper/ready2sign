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



  // Menu expand and collapse funtionality
  // $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');
  //   $('.page-content').toggleClass('page-expanded page-collapsed');


    // $('.sidebar').on('mouseover', function() {
    //   console.log("test");
    //     $('.sidebar').addClass('sidebar-expanded');
    //     $('.sidebar').removeClass('sidebar-collapsed');
    //     $('.page-content').addClass('page-collapsed');
    //     $('.page-content').removeClass('page-expanded');
    // });

    // $('.sidebar').on('mouseout', function() {
    //     $('.sidebar').removeClass('sidebar-expanded');
    //     $('.sidebar').addClass('sidebar-collapsed');
    //     $('.page-content').removeClass('page-collapsed');
    //     $('.page-content').addClass('page-expanded');
    // });

    $('#select_account').click(function() {
      $(this).toggleClass('opened');
      $('.selected-dropdown').slideToggle('slow');
    })

    $('.group').mouseover(function() {
      $('.group-popup').removeClass('open-popup');
      $('.group-popup').slideUp('slow');
      $(this).parent().find('.group-popup').addClass('open-popup');
      // if ($(this).hasClass('g1')) {
      //   $(this).addClass('dark-blue-fill');
      // }
      // else if ($(this).hasClass('g2')) {
      //   $(this).toggleClass('light-blue-fill');
      // }
      // else {
      //   $(this).toggleClass('trans-fill');
      // }
      setTimeout(function() {
            $('.group-popup.open-popup').slideDown('slow');
        }, 110);
    })

    // .parent().mouseout(function() {
    //   $(this).find('.group-popup').slideUp('slow');
    //  })

    $(document).mouseup(function(e) {
        var container = $(".group").parent();
        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            $('.group-popup.open-popup').slideUp('slow');
        }
    });

    // $('.close').click(function() {
    //   $('.site-search-wrapper').animate({
    //     right: 'toggle'
    //   }, 310);
    // })

    $('.button-wrapper button').click(function(e) {
      e.preventDefault();
      $('.button-wrapper button').removeClass('btn-active');
      $(this).addClass('btn-active');
    })

    $('.approver').click(function() {
      if ($('.approver').hasClass('btn-active')) {
      $(this).next('.type-selection-error').addClass('no-match');
      $('.groups-block').hide();
    }
    })

    $('.recipient').click(function() {
      if ($('.recipient').hasClass('btn-active')) {
      $(this).parent().find('.type-selection-error').removeClass('no-match');
      $('.groups-block').show();
    }
    })



    // $('input[type="checkbox"]').change(function() {
    //   $(this).parent().find('.child-selection').toggleClass('show');
    // })

    //  $('.add-party').click(function(e) {
    //     e.preventDefault();
    //     var parent_form = $(this).parent().parent();
    //     var parent_sec = $(this).parent().parent().parent().parent();
    //     $(this).parent().animate({ opacity: 0 }).hide();
    //     // $(this).next().animate({ opacity: 1 }).show();
    //     // $(this).parent().removeClass('grey-bg');
    //     parent_form.find('.insert-name').animate({ opacity: 1 }).show();
    //     parent_form.find('.fields-selection').animate({ opacity: 1 }).show();
    //     parent_form.find('.btn-group').animate({ opacity: 1 }).show();
    //     parent_form.find('.form-footer').animate({ opacity: 1 }).show();
    //     parent_sec.find('.template-settings-wrapper').animate({ opacity: 1, right: 0 }).show();
    //     parent_form.find('.list-block').animate({ opacity: 0 }).hide();
    //     if (parent_form.hasClass('fields-block')) {
    //       parent_form.find('.form-footer').animate({ opacity: 0 }).hide();
    //     }
    // })

    //  $('.text-only').click(function(e) {
    //     e.preventDefault();
    //     var parent_form = $(this).parent().parent();
    //     parent_form.find('.insert-name').animate({ opacity: 0 }).hide();
    //     parent_form.find('.btn-group').animate({ opacity: 0 }).hide();
    //     parent_form.find('.form-footer').animate({ opacity: 0 }).hide();
    //     parent_form.find('.fields-selection').animate({ opacity: 0 }).hide();
    //     parent_form.find('.fields-detail').animate({ opacity: 0 }).hide();
    //     parent_form.find('.list-block').animate({ opacity: 1 }).show();
    //     parent_form.find('.add-party-block').animate({ opacity: 1 }).show();
    //     // $('.fields-block .add-party-block').addClass('grey-bg')
    // })

    // $('.site-search-wrapper .close').click(function(e) {
    //     e.preventDefault();
    //     var parent_sec = $(this).parent().parent().parent();
    //     parent_sec.animate({ right: "100%", opacity: 0 }).hide();
    //     parent_sec.prev('.template-table').find('.add-party-block').animate({ opacity: 1 }).show();
    //     parent_sec.prev('.template-table').find('.list-block').animate({ opacity: 1 }).show();
    // })

    $('.select-template-wrapper .close').click(function(e) {
      e.preventDefault();
      var parent_sec = $(this).parent().parent().parent();
      parent_sec.animate({ right: "100%", opacity: 0 }).hide();
      parent_sec.prev('.template-table').find('.add-party-block').animate({ opacity: 1 }).show();
      parent_sec.prev('.template-table').find('.list-block').animate({ opacity: 1 }).show();
  })

$('.property-details-block-wrapper .close').click(function(e) {
      e.preventDefault();
      var parent_sec = $(this).parent().parent().parent();
      parent_sec.animate({ right: "100%", opacity: 0 }).hide();
      parent_sec.prev('.template-table').find('.add-party-block').animate({ opacity: 1 }).show();
      parent_sec.prev('.template-table').find('.list-block').animate({ opacity: 1 }).show();
  })

  $('.send-document-block-wrapper .close').click(function(e) {
    e.preventDefault();
    var parent_sec = $(this).parent().parent().parent();
    parent_sec.animate({ right: "100%", opacity: 0 }).hide();
    parent_sec.prev('.template-table').find('.add-party-block').animate({ opacity: 1 }).show();
    parent_sec.prev('.template-table').find('.list-block').animate({ opacity: 1 }).show();
})

    //  $('.tile').click(function() {
    //   $('.fields-selection').animate({ opacity: 0 }).hide();
    //   if ($(this).hasClass('date-type')) {
    //     $('.date-field').animate({ opacity: 1 }).show();
    //     $(this).parent().parent().parent().find('.form-footer').animate({ opacity: 1 }).show();
    //   }
    //  })

    //  $('ul.wrapper-status-groups li').click(function(e) {
    //   e.preventDefault();
    //   $('.insert-name').animate({ opacity: 0 }).hide();
    //   $('.btn-group').animate({ opacity: 0 }).hide();
    //   $('.form-footer').animate({ opacity: 0 }).hide();
    //   $('.fields-selection').animate({ opacity: 0 }).hide();
    //   $('.fields-detail').animate({ opacity: 0 }).hide();
    //   $('.list-block').animate({ opacity: 1 }).show();
    //   $('.add-party-block').animate({ opacity: 1 }).show();
    //   $('ul.wrapper-status-groups li').removeClass('selected');
    //   $('.template-table fieldset').animate({ opacity: 0 }).hide();
    //   $(this).addClass('selected');
    //     if ($(this).hasClass('parties')) {
    //       $('.people-block').animate({ opacity: 1 }, 110).show();
    //     }
    //     else if ($(this).hasClass('fields')) {
    //       $('.fields-block').animate({ opacity: 1 }, 110).show();
    //     }
    //     else if ($(this).hasClass('clauses')) {
    //       $('.clauses-block').animate({ opacity: 1 }, 110).show();
    //       $('.template-table .clauses-block .form-footer').animate({ opacity: 1 }, 110).show();
    //     }
    //     else if ($(this).hasClass('attachements')) {
    //       $('.attach-block').animate({ opacity: 1 }, 110).show();
    //     }
    //     else if ($(this).hasClass('mail')) {
    //       $('.mail-block').animate({ opacity: 1 }, 110).show();
    //     }
    //     else {
    //       $('.setting-block').animate({ opacity: 1 }, 110).show();
    //     }
    //  })

    //  if ($('.parties').hasClass('selected')) {
    //       $('.template-table fieldset').hide();
    //       $('.people-block').animate({ opacity: 1 }).show();
    //     }
    //     else if ($('.fields').hasClass('selected')) {
    //       $('.template-table fieldset').hide();
    //       $('.fields-block').animate({ opacity: 1 }).show();
    //     }
    //     else if ($('.clauses').hasClass('selected')) {
    //       $('.template-table fieldset').hide();
    //       $('.clauses-block').animate({ opacity: 1 }).show();
    //     }
    //     else if ($('.attachements').hasClass('selected')) {
    //       $('.template-table fieldset').hide();
    //       $('.attach-block').animate({ opacity: 1 }).show();
    //     }
    //     else if ($('.mail').hasClass('selected')) {
    //       $('.template-table fieldset').hide();
    //       $('.mail-block').animate({ opacity: 1 }).show();
    //     }
    //     else {
    //       $('.template-table fieldset').hide();
    //       $('.setting-block').animate({ opacity: 1 }).show();
    //     }

        $('.acc-expand').click(function(e) {
          alert("click from script-js")
          e.preventDefault();
          var $this = $(this);
          if ($this.next().hasClass('show')) {
              $this.next().removeClass('show');
              $this.next().slideUp(350);
              $this.removeClass('open');
          } else {
              $('.acc-expand').removeClass('open');
              $('.acc-child').slideUp(350);
              $this.next().toggleClass('show');
              $this.next().slideDown(350);
              $this.addClass('open');
          }
        })

        $('.user-accordion-sec .accordion-item .accordion-trigger').click(function(e) {
          e.preventDefault();

          var $this = $(this);

          if ($this.next().hasClass('accordion-open')) {
            $this.next().removeClass('accordion-close');
            $this.next().slideUp(350);
          } else {
            $this.parent().parent().find('.user-accordion-sec .accordion-item .accordion-trigger').removeClass('accordion-open');
            $this.parent().parent().find('.user-accordion-sec .accordion-item .accordion-trigger').slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideToggle(350);
          }
        });

});

