const mApp1 = function () {
    return {
        blockPage: function () {
            $('.blockPage').show();
        },
        unblockPage: () => {
            $('.blockPage').hide();
        },
        showLoader: (element) => {
            $(element).encapsulateOverlay({
                iconClass: 'fa fa-spinner fa-spin fa-2x'
            }).encapsulateOverlay('show')
        },
        hideLoader: (element) => {
            $(element).encapsulateOverlay('hide');
        },
        initNavbar: () => {
            var $tabsNav = $('.popup-tabs-nav'),
                $tabsNavLis = $tabsNav.children('li');

            $tabsNav.each(function () {
                var $this = $(this);

                $this.next().children('.popup-tab-content').stop(true, true).hide().first().show();
                $this.children('li').first().addClass('active').stop(true, true).show();
            });

            $tabsNavLis.on('click', function (e) {
                var $this = $(this);

                $this.siblings().removeClass('active').end().addClass('active');

                $this.parent().next().children('.popup-tab-content').stop(true, true).hide()
                    .siblings($this.find('a').attr('href')).fadeIn();

                e.preventDefault();
            });
            setTimeout(() => {
                /** Header notifications and dropdowns */
                $(".header-notifications").each(function () {
                    var userMenu = $(this);
                    var userMenuTrigger = $(this).find('.header-notifications-trigger a');

                    $(userMenuTrigger).on('click', function (event) {
                        event.preventDefault();
                        if ($(this).closest(".header-notifications").is(".active")) {
                            // $('.header-notifications').removeClass("active");
                        } else {
                            $('.header-notifications').removeClass("active");
                            userMenu.addClass('active');
                        }
                    });
                });

                /** Popup */
                $('.popup-with-zoom-anim').magnificPopup({
                    type: 'inline',

                    fixedContentPos: false,
                    fixedBgPos: true,

                    overflowY: 'auto',

                    closeBtnInside: true,
                    preloader: false,

                    midClick: true,
                    removalDelay: 300,
                    mainClass: 'my-mfp-zoom-in'
                });

                /** Dashboard menu */
                $('.dashboard-nav ul li a').on('click', function (e) {
                    if ($(this).closest("li").children("ul").length) {
                        if ($(this).closest("li").is(".active-submenu")) {
                            $('.dashboard-nav ul li').removeClass('active-submenu');
                        } else {
                            $('.dashboard-nav ul li').removeClass('active-submenu');
                            $(this).parent('li').addClass('active-submenu');
                        }
                        e.preventDefault();
                    }
                });
            }, 1000);
        },
        initTabs: () => {
            if ($(".tabs")[0]) {
                $('.tabs').each(function () {

                    var thisTab = $(this);

                    // Intial Border Position
                    var activePos = thisTab.find('.tabs-header .active').position();

                    function changePos() {

                        // Update Position
                        activePos = thisTab.find('.tabs-header .active').position();

                        // Change Position & Width
                        thisTab.find('.tab-hover').stop().css({
                            left: activePos.left,
                            width: thisTab.find('.tabs-header .active').width()
                        });
                    }

                    changePos();

                    // Intial Tab Height
                    var tabHeight = thisTab.find('.tab.active').outerHeight();

                    // Animate Tab Height
                    function animateTabHeight() {
                        // Update Tab Height
                        tabHeight = thisTab.find('.tab.active').outerHeight();
                        // Animate Height
                        thisTab.find('.tabs-content').stop().css({
                            height: tabHeight + 'px'
                        });
                    }

                    animateTabHeight();

                    // Change Tab
                    function changeTab() {
                        var getTabId = thisTab.find('.tabs-header .active a').attr('data-tab-id');

                        // Remove Active State
                        thisTab.find('.tab').stop().fadeOut(300, function () {
                            // Remove Class
                            $(this).removeClass('active');
                        }).hide();

                        thisTab.find('.tab[data-tab-id=' + getTabId + ']').stop().fadeIn(300, function () {
                            // Add Class
                            $(this).addClass('active');

                            // Animate Height
                            animateTabHeight();
                        });
                    }

                    // Tabs
                    thisTab.find('.tabs-header a').on('click', function (e) {
                        e.preventDefault();

                        // Tab Id
                        var tabId = $(this).attr('data-tab-id');

                        // Remove Active State
                        thisTab.find('.tabs-header a').stop().parent().removeClass('active');

                        // Add Active State
                        $(this).stop().parent().addClass('active');

                        changePos();

                        // Update Current Itm
                        tabCurrentItem = tabItems.filter('.active');

                        // Remove Active State
                        thisTab.find('.tab').stop().fadeOut(300, function () {
                            // Remove Class
                            $(this).removeClass('active');
                        }).hide();

                        // Add Active State
                        thisTab.find('.tab[data-tab-id="' + tabId + '"]').stop().fadeIn(300, function () {
                            // Add Class
                            $(this).addClass('active');

                            // Animate Height
                            animateTabHeight();
                        });
                    });

                    // Tab Items
                    var tabItems = thisTab.find('.tabs-header ul li');

                    // Tab Current Item
                    var tabCurrentItem = tabItems.filter('.active');

                    // Next Button
                    thisTab.find('.tab-next').on('click', function (e) {
                        e.preventDefault();

                        var nextItem = tabCurrentItem.next();

                        tabCurrentItem.removeClass('active');

                        if (nextItem.length) {
                            tabCurrentItem = nextItem.addClass('active');
                        } else {
                            tabCurrentItem = tabItems.first().addClass('active');
                        }

                        changePos();
                        changeTab();
                    });

                    // Prev Button
                    thisTab.find('.tab-prev').on('click', function (e) {
                        e.preventDefault();

                        var prevItem = tabCurrentItem.prev();

                        tabCurrentItem.removeClass('active');

                        if (prevItem.length) {
                            tabCurrentItem = prevItem.addClass('active');
                        } else {
                            tabCurrentItem = tabItems.last().addClass('active');
                        }

                        changePos();
                        changeTab();
                    });
                });
            }
        },
        initKeywords: () => {
            $(".keywords-container").each(function () {

                var keywordInput = $(this).find(".keyword-input");
                var keywordsList = $(this).find(".keywords-list");

                // adding keyword
                function addKeyword() {
                    var $newKeyword = $("<span class='keyword'><span class='keyword-remove'></span><span class='keyword-text'>" + keywordInput.val() + "</span></span>");
                    keywordsList.append($newKeyword).trigger('resizeContainer');
                    keywordInput.val("");
                }

                // add via enter key
                keywordInput.on('keyup', function (e) {
                    if ((e.keyCode == 13) && (keywordInput.val() !== "")) {
                        addKeyword();
                    }
                });

                // prevent form submission
                keywordInput.on('keydown', function (e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        return false;
                    }
                });

                // add via button
                $('.keyword-input-button').on('click', function () {
                    if ((keywordInput.val() !== "")) {
                        addKeyword();
                    }
                });

                // removing keyword
                $(document).on("click", ".keyword-remove", function () {
                    $(this).parent().addClass('keyword-removed');

                    function removeFromMarkup() {
                        $(".keyword-removed").remove();
                    }
                    setTimeout(removeFromMarkup, 500);
                    keywordsList.css({ 'height': 'auto' }).height();
                });


                // animating container height
                keywordsList.on('resizeContainer', function () {
                    var heightnow = $(this).height();
                    var heightfull = $(this).css({ 'max-height': 'auto', 'height': 'auto' }).height();

                    $(this).css({ 'height': heightnow }).animate({ 'height': heightfull }, 200);
                });

                $(window).on('resize', function () {
                    keywordsList.css({ 'height': 'auto' }).height();
                });

                // Auto Height for keywords that are pre-added
                $(window).on('load', function () {
                    var keywordCount = $('.keywords-list').children("span").length;

                    // Enables scrollbar if more than 3 items
                    if (keywordCount > 0) {
                        keywordsList.css({ 'height': 'auto' }).height();

                    }
                });

            });
            $.fn.extend({
                keywordInput: function (option) {
                    if (option == 'value') {
                        let keywords = [];
                        $(this).find('.keywords-list .keyword').each(function (index, element) {
                            keywords.push($(element).find('.keyword-text').text());
                        });
                        return keywords;
                    }
                }
            })
        },
        getKeywords(target) {
            return $(target).keywordInput('value');
        },
        inlineBG: () => {
            $(document).inlineBG();
        },
        initAccordion: () => {
            var radios = document.querySelectorAll('.payment-tab-trigger > input');

            for (var i = 0; i < radios.length; i++) {
                radios[i].addEventListener('change', expandAccordion);
            }

            function expandAccordion(event) {
                /* jshint validthis: true */
                var tabber = this.closest('.payment');
                var allTabs = tabber.querySelectorAll('.payment-tab');
                for (var i = 0; i < allTabs.length; i++) {
                    allTabs[i].classList.remove('payment-tab-active');
                }
                event.target.parentNode.parentNode.classList.add('payment-tab-active');
            }

            $('.billing-cycle-radios').on("click", function () {
                if ($('.billed-yearly-radio input').is(':checked')) { $('.pricing-plans-container').addClass('billed-yearly'); }
                if ($('.billed-monthly-radio input').is(':checked')) { $('.pricing-plans-container').removeClass('billed-yearly'); }
            });
        }
    }
}();

!function ($) {
    "use strict";
    var defaults = {
        'displayIcon': true,
        'iconColor': 'text-main',
        'iconClass': 'fa fa-refresh fa-spin fa-2x',
        'title': '',
        'desc': ''
    };
    var uID = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    var methods = {
        'show': function (el) {
            var target = $(el),
                ovId = 'encapsulate-overlay-' + uID() + uID() + "-" + uID(),
                panelOv = $('<div id="' + ovId + '" class="panel-overlay"></div>');

            el.prop('disabled', true).data('encapsulateOverlay', ovId);
            target.addClass('panel-overlay-wrap');
            panelOv.appendTo(target).html(el.data('overlayTemplate'));
            return null;
        },
        'hide': function (el) {
            var target = $(el);
            var boxLoad = $('#' + el.data('encapsulateOverlay'));

            if (boxLoad.length) {
                el.prop('disabled', false);
                target.removeClass('panel-overlay-wrap');
                boxLoad.hide().remove();
            }
            return null;
        }
    };
    var loadBox = function (el, options) {
        if (el.data('overlayTemplate')) {
            return null;
        }
        var opt = $.extend({}, defaults, options),
            icon = `
            <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>`;
        el.data('overlayTemplate', '<div class="panel-overlay-content pad-all unselectable">' + icon + '<h4 class="panel-overlay-title">' + opt.title + '</h4><p>' + opt.desc + '</p></div>');
        return null;
    };

    $.fn.encapsulateOverlay = function (method) {
        if (methods[method]) {
            return methods[method](this);
        } else if (typeof method === 'object' || !method) {
            return this.each(function () {
                loadBox($(this), method);
            });
        }
        return null;
    };

}(jQuery);

!function ($) {
    /*----------------------------------------------------*/
	/*  Inline CSS replacement for backgrounds
	/*----------------------------------------------------*/

    $.fn.inlineBG = function () {
        // Common Inline CSS
        $(".single-page-header, .intro-banner").each(function () {
            var attrImageBG = $(this).attr('data-background-image');

            if (attrImageBG !== undefined) {
                $(this).append('<div class="background-image-container"></div>');
                $('.background-image-container').css('background-image', 'url(' + attrImageBG + ')');
            }
        });
    }
}(jQuery);