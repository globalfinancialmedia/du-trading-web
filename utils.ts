declare const $: any;
declare const jQuery: any;
declare const mApp1: any;
// import * as noty from 'noty';
export class Utils {

    /**
     * Show error messages whenever occured.
     * @todo use a plugin to toast error notifications.
     * @param text string
     * @param error obj
     */
    public static showErrorMessage(text, error) {
        console.log(error);
    }

    /**
     * Show loader on an element
     * @param element element selector e.g. #div-id
     */
    public static showLoader(element) {
        mApp1.showLoader(element);
    }

    /**
     * Hide loader on an element
     * @param element element selector e.g. #div-id
     */
    public static hideLoader(element) {
        mApp1.hideLoader(element);
    }

    /**
     * Show loader on entire page
     */
    public static blockPage() {
        mApp1.blockPage();
    }

    /**
     * Hide loader from the page
     */
    public static unblockPage() {
        mApp1.unblockPage();
    }

    public static initSlider() {
        let screenH2 = 0;
        let offsetArrow2 = 0;
        if ($(window).width() >= 992) {
      screenH2 = $(window).height() - 123;
      offsetArrow2 = 100;
    } else {
      screenH2 = $(window).height() - 70;
      offsetArrow2 = 20;
    }

        if ($(window).height() < 768 && $(window).width() >= 992) {
      screenH2 = $(window).height() - 90;
    }
        jQuery('#rev_slider_1_1_forcefullwidth').show().revolution({

      responsiveLevels: [1900, 992, 768, 576],
      gridwidth: [1900, 992, 768, 576],
      minHeight: 650,
      delay: 4000,

      sliderLayout: 'fullwidth',
      spinner: 'spinner2',

      navigation: {

        keyboardNavigation: 'on',
        keyboard_direction: 'horizontal',
        onHoverStop: 'off',

        touch: {

          touchenabled: 'on',
          swipe_threshold: 75,
          swipe_min_touches: 1,
          swipe_direction: 'horizontal',
          drag_block_vertical: true

        },

        arrows: {
          enable: false,
          style: 'gyges',
          hide_onmobile: true,
          hide_onleave: true,
          left: {
            container: 'slider',
            h_align: 'left',
            v_align: 'center',
            h_offset: offsetArrow2,
            v_offset: 0
          },

          right: {
            container: 'slider',
            h_align: 'right',
            v_align: 'center',
            h_offset: offsetArrow2,
            v_offset: 0
          }
        },

        bullets: {
          enable: true,
          style: 'persephone',
          tmp: '<div class="tp-bullet-inner"></div>',
          hide_onleave: false,
          h_align: 'center',
          v_align: 'bottom',
          h_offset: 0,
          v_offset: 40,
          space: 12
        }
      }
    });
        $('.wrap-slick5').each(function() {
      const wrapSlick = $(this);
      const slick = $(this).find('.slick5');


      let showDot = false;
      if ($(wrapSlick).find('.wrap-dot-slick5').length > 0) {
        showDot = true;
      }

      let showArrow = false;
      if ($(wrapSlick).find('.wrap-arrow-slick5').length > 0) {
        showArrow = true;
      }

      $(wrapSlick).find('.slick5').slick({
        pauseOnFocus: false,
        pauseOnHover: false,
        slidesToShow: 6,
        slidesToScroll: 6,
        fade: false,
        infinite: false,
        autoplay: false,
        autoplaySpeed: 6000,
        arrows: showArrow,
        appendArrows: $(wrapSlick).find('.wrap-arrow-slick5'),
        prevArrow: $(wrapSlick).find('.prev-slick5'),
        nextArrow: $(wrapSlick).find('.next-slick5'),
        dots: showDot,
        appendDots: $(wrapSlick).find('.wrap-dot-slick5'),
        dotsClass: 'slick5-dots',
        customPaging(slick, index) {
          return '<div></div>';
        },
        responsive: [
          {
            breakpoint: 1900,
            settings: {
              slidesToShow: 6,
              slidesToScroll: 6
            }
          },
          {
            breakpoint: 1680,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 5
            }
          },
          {
            breakpoint: 1420,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 575,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]

      });

    });
        $('.wrap-slick7').each(function() {
      const wrapSlick = $(this);
      const slick = $(this).find('.slick7');


      let showDot = false;
      if ($(wrapSlick).find('.wrap-dot-slick7').length > 0) {
        showDot = true;
      }

      let showArrow = false;
      if ($(wrapSlick).find('.wrap-arrow-slick7').length > 0) {
        showArrow = true;
      }

      $(wrapSlick).find('.slick7').slick({
        pauseOnFocus: false,
        pauseOnHover: false,
        slidesToShow: 2,
        slidesToScroll: 2,
        fade: false,
        infinite: false,
        autoplay: false,
        autoplaySpeed: 6000,
        arrows: showArrow,
        appendArrows: $(wrapSlick).find('.wrap-arrow-slick7'),
        prevArrow: $(wrapSlick).find('.prev-slick7'),
        nextArrow: $(wrapSlick).find('.next-slick7'),
        dots: showDot,
        appendDots: $(wrapSlick).find('.wrap-dot-slick7'),
        dotsClass: 'slick7-dots',
        customPaging(slick, index) {
          return '<div></div>';
        },
        responsive: [
          {
            breakpoint: 1199,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 575,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]

      });

    });
    }
}
