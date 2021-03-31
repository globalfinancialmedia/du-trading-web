
jQuery(document).ready(function(){
// Sticky navbar
// =========================
    // Custom function which toggles between sticky class (is-sticky)
    // var stickyToggle = function (sticky, stickyWrapper, scrollElement) {
    //     var stickyHeight = sticky.outerHeight();
    //     var stickyTop = stickyWrapper.offset().top;
    //     if (scrollElement.scrollTop() >= stickyTop) {
    //         stickyWrapper.height(stickyHeight);
    //         sticky.addClass("is-sticky");
    //     }
    //     else {
    //         sticky.removeClass("is-sticky");
    //         stickyWrapper.height('auto');
    //     }
    // };

    // // Find all data-toggle="sticky-onscroll" elements
    // jQuery('[data-toggle="sticky-onscroll"]').each(function () {
    //     var sticky = jQuery(this);
    //     var stickyWrapper = jQuery('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
    //     sticky.before(stickyWrapper);
    //     sticky.addClass('sticky');

    //     // Scroll & resize events
    //     jQuery(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function () {
    //         stickyToggle(sticky, stickyWrapper, jQuery(this));
    //     });

    //     // On page load
    //     stickyToggle(sticky, stickyWrapper, jQuery(window));
    // });
    // var normalNavTop = jQuery('.sticky-wrapper').offset().top;
    // // var scrollTop = jQuery(window).scrollTop();
    
    // // jQuery(window).scroll(function() {
    // // //     console.log('normalNavTop', normalNavTop)
    // // // console.log('scrollTop', scrollTop)
    // //     if(scrollTop > normalNavTop) {
    // //         jQuery('.sticky-wrapper').addClass('sticky-header');
    // //     } if(scrollTop < normalNavTop) {
    // //         jQuery('.sticky-wrapper').removeClass('sticky-header');
    // //     }
    // // });

    // var normalNav = function(){
    // var scrollTop = jQuery(window).scrollTop();  
    // // Kondisi jika discroll maka .nav ditambahkan class normal dan sebaliknya      
    // if (scrollTop > normalNavTop) { 
    //     jQuery('.sticky-wrapper').addClass('sticky-header');
    // } else {
    //     jQuery('.sticky-wrapper').removeClass('sticky-header');
    // }
    // };
    // normalNav();
    // jQuery(window).scroll(function() {
    //   normalNav();
    // });
    var stickyHeight = jQuery('.sticky-wrapper').height();
    // var stickyNavTop = jQuery('.sticky-wrapper').offset().top;
		   	// our function that decides weather the navigation bar should have "fixed" css position or not.
		   	var stickyNav = function(){
			    var scrollTop = jQuery(window).scrollTop(); // our current vertical position from the top
			         
			    // if we've scrolled more than the navigation, change its position to fixed to stick to top,
			    // otherwise change it back to relative
			    if (scrollTop > stickyHeight) { 
			        jQuery('.sticky-wrapper').addClass('cs-sticky');
			    } else {
			        jQuery('.sticky-wrapper').removeClass('cs-sticky'); 
			    }
			};

			stickyNav();
			// and run it again every time you scroll
			jQuery(window).scroll(function() {
				stickyNav();
			});
            jQuery('.paid-courses-carousel').owlCarousel({
                loop:true,
                margin:20,
                nav:false,
                dots:false,
                autoplay:true,
                autoplayTimeout:2000,
                autoplayHoverPause:true,
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:3
                    },
                    1000:{
                        items:3.2
                    }
                }
            });
            jQuery('.free-courses-carousel').owlCarousel({
                loop:true,
                margin:10,
                nav:false,
                dots:false,
                autoplay:true,
                autoplayTimeout:2500,
                autoplayHoverPause:true,
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:3
                    },
                    1000:{
                        items:3.2
                    }
                }
            });
            jQuery('.top-categories-carousel').owlCarousel({
                loop:true,
                margin:10,
                nav:false,
                dots:false,
                autoplay:true,
                autoplayTimeout:2000,
                autoplayHoverPause:true,
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:3
                    },
                    1000:{
                        items:3.2
                    }
                }
            });
            jQuery('.lecture-carousel').owlCarousel({
                loop:true,
                margin:10,
                nav:false,
                dots:false,
                // autoplay:true,
                // autoplayTimeout:2000,
                // autoplayHoverPause:true,
                nav: true,
      navText: ["<div class='du-normal-size-btn main-outline-btn'>Previous</div>", "<div class='du-normal-size-btn main-btn'>Next</div>"],

                responsive:{
                    0:{
                        items:1
                    }
                }
            });
            
  });

