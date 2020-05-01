$(document).ready(function ($) {

    // $(".rippler").rippler({
    //     effectClass: 'rippler-effect'
    //     , effectSize: 16      // Default size (width & height)
    //     , addElement: 'div'   // e.g. 'svg'(feature)
    //     , duration: 400
    // });
    $(".rippler").rippler({
        effectClass: 'rippler-effect'
        , effectSize: 0      // Default size (width & height)
        , addElement: 'div'   // e.g. 'svg'(feature)
        , duration: 400
    });


    $('.card-image').each(function (index, element) {
        var next_block = $(element).next()
        $(element).on('click', function () {
            $(next_block).slideToggle('slow')
        });
    });

    $('.card-reveal .close').each(function (index, element) {
        var parent_block = $(element).parent()
        $(element).on('click', function () {
            $(parent_block).slideToggle('slow')
        });
    });


    "use strict";

    //===== Prealoder

    $(window).on('load', function (event) {
        $('.preloader').delay(500).fadeOut(500);
    });


    //===== Mobile Menu

    $(".navbar-toggler").on('click', function () {
        $(this).toggleClass('active');
    });

    $(".navbar-nav a").on('click', function () {
        $(".navbar-toggler").removeClass('active');
    });


    //===== close navbar-collapse when a  clicked

    $(".navbar-nav a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });


    //===== Sticky

    $(window).on('scroll', function (event) {
        var scroll = $(window).scrollTop();
        if (scroll < 10) {
            $(".navigation").removeClass("sticky");
        } else {
            $(".navigation").addClass("sticky");
        }
    });


    //===== Section Menu Active

    var scrollLink = $('.page-scroll');
    // Active link switching
    $(window).scroll(function () {
        var scrollbarLocation = $(this).scrollTop();

        scrollLink.each(function () {
            if ($(this.hash).offset() != undefined) {
                var sectionOffset = $(this.hash).offset().top - 73;

                if (sectionOffset <= scrollbarLocation) {
                    $(this).parent().addClass('active');
                    $(this).parent().siblings().removeClass('active');
                }
            }
        });
    });



    // Parallaxmouse js

    function parallaxMouse() {
        if ($('#parallax').length) {
            var scene = document.getElementById('parallax');
            var parallax = new Parallax(scene);
        };
    };
    parallaxMouse();


    //===== Progress Bar

    if ($('.progress-line').length) {
        $('.progress-line').appear(function () {
            var el = $(this);
            var percent = el.data('width');
            $(el).css('width', percent + '%');
        }, { accY: 0 });
    }


    //===== Counter Up

    $('.counter').counterUp({
        delay: 10,
        time: 1600,
    });


    //===== Magnific Popup

    $('.image-popup').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });


    //===== Back to top

    // Show or hide the sticky footer button
    $(window).on('scroll', function (event) {
        if ($(this).scrollTop() > 600) {
            $('.back-to-top').fadeIn(200)
        } else {
            $('.back-to-top').fadeOut(200)
        }
    });


    //Animate the scroll to yop
    $('.back-to-top').on('click', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: 0,
        }, 1500);
    });


    /* Animations on scroll */
    $('.js--wp-1').waypoint(function (direction) {
        if (direction == 'down') {
            $('.js--wp-1').addClass('animated pulse');
        }
        else {
            $('.js--wp-1').removeClass('animated pulse');
        }
    }, {
        offset: '38%'
    });


    $('.js--wp-2').waypoint(function (direction) {
        if (direction == 'down') {
            $('.js--wp-2').addClass('animated tada');
        }
        else {
            $('.js--wp-2').removeClass('animated tada');
        }
    }, {
        offset: '50%'
    });

    $('.js--wp-3').waypoint(function (direction) {
        $('.js--wp-3').addClass('animated swing');
    }, {
        offset: '50%'
    });

    $('.js--wp-4').waypoint(function (direction) {
        $('.js--wp-4').addClass('animated pulse');
    }, {
        offset: '50%'
    });
    //=====

    $("[data-link]").click(function () {
        window.open($(this).attr("data-link"));
    });
}(jQuery));