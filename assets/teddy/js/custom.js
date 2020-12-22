'use strict';

$(document).ready(function() {
    
    // Animation on Scroll
    AOS.init({
        once: true,
        disable: 'mobile'
    });
    
    // Smoothscroll function
    function smoothScroll(smoothHash) {
        var navbarHeight = $('#navbar').height(),
        navbarCollapse = $('.navbar-collapse').height(),
        navbarBrand = $('.navbar-brand').height(),
        scrollHash = $(smoothHash).offset().top,
        scrollTo = 0;
        if ($('.navbar-collapse.show').length > 0 ) {
            scrollTo = scrollHash  - navbarHeight + navbarCollapse + navbarBrand;
        } else {
            scrollTo = scrollHash - navbarHeight;
        }
        $('html, body').animate({
            scrollTop: scrollTo
        });
    };
    
    // Link smoothscroll
    $('.smoothscroll').on('click', function(event) {
        if ($(this).attr("href") !== '') {
            event.preventDefault();
            var smoothHash = $(this).attr("href");
            smoothScroll(smoothHash);
        }
    });
    
    // Navbar sticky
    if ($('#navbar').length > 0 ) {
        addSticky()
        document.onscroll = function() {
            addSticky();
        };
        function addSticky() {
            var navbar = document.getElementById('navbar'),
            sticky = navbar.offsetTop;
            if ( (window.pageYOffset != sticky) && $(window).scrollTop() >= 0 ) {
                navbar.classList.add('sticky')
            } else {
                navbar.classList.remove('sticky');
            }
        }
    }
    
    // Navbar Mobile
    $('button.navbar-toggler').on('click', function(event) {
        $('body').toggleClass('hide-overflow');
        $(".burger").toggleClass("active");
    });
    $('.nav-item a').on('click', function(event) {
        if ($('.navbar-collapse.show').length > 0 ) {
            $( 'button.navbar-toggler' ).trigger( 'click' );
        }
    });
    
    // Dropdown On Hover
    function dropdownOnHover() {
        var dropdown = $(".dropdown"),
        dropdownToggle = $(".dropdown-toggle"),
        dropdownMenu = $(".dropdown-menu"),
        showClass = "show";

        if (window.matchMedia("(min-width: 1024px)").matches) {
            dropdown.hover(
                function() {
                  var $this = $(this);
                  $this.addClass(showClass);
                  $this.find(dropdownToggle).attr("aria-expanded", "true");
                  $this.find(dropdownMenu).addClass(showClass);
                },
                function() {
                  var $this = $(this);
                  $this.removeClass(showClass);
                  $this.find(dropdownToggle).attr("aria-expanded", "false");
                  $this.find(dropdownMenu).removeClass(showClass);
                }
            );
        } 
        else {
          dropdown.off("mouseenter mouseleave");
          $(dropdownToggle).on('click', function(event) {
              event.preventDefault();
              var link = $(this).attr('href');
              window.location.href = link;
          });
        }
    }
    dropdownOnHover();
    $(window).on("resize", function() {
        dropdownOnHover();
    });
    
    // Progress bar circle (Bootstrap adjustment)
    if ($('.bar--circle').length > 0 ) {
        $('.bar--circle').each(function() {
            var value = $(this).children().attr('data-value'),
            left = $(this).find('.progress-left .progress-bar'),
            right = $(this).find('.progress-right .progress-bar');
            if (value > 0) {
                if (value <= 50) {
                    right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
                } else {
                    right.css('transform', 'rotate(180deg)')
                    left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
                }
            }
        });
        function percentageToDegrees(percentage) {
            return percentage / 100 * 360
        };
    };
    
    // Owl Bulletbar Carousel
    $('.owl-bulletbar').owlCarousel({
        responsive: {
            1400: {
                margin: 30,
                items: 3,
                stagePadding: 0,
            },
            900:{
                margin: 30,
                items: 2,
                stagePadding: 0,
            },
            0: {
                margin: 0,
                items: 1,
                stagePadding: 0,
                autoplay: true,
            }
        }
    });
    
    // Modal video
    var videoSrc;  
    $('.video-btn').on('click', function(event) {
        videoSrc = $(this).data( "src" );
    });
    $('#videoModal').on('shown.bs.modal', function (e) {
        $("#video").attr('src', videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
    })
    $('#videoModal').on('hide.bs.modal', function (e) {
        $("#video").attr('src', videoSrc); 
    })
    
    // Donation form
    if ($('#donation').length > 0 ) {
        $('#inputAmountCustom').on('click', function(event) {
            $('#donation-amount').find('.btn').each(function() {
                $(this).removeClass( "active" );
            });
        });
    }
    
});

// Site Preloader
$(window).on('load', function () {
    if ($('#preloader').length > 0 ) {
        setTimeout(function(){ $('#preloader').fadeOut() }, 500);
        $('body').removeClass('preload');
    }
});