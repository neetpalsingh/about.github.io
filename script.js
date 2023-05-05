$(document).ready(function() {
    $(window).scroll(function() {
        // sticky navbar on scroll script
        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
        } else {
            $('.navbar').removeClass("sticky");
        }

        // scroll-up button show/hide script
        if (this.scrollY > 500) {
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function() {
        $('html').animate({ scrollTop: 0 });
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function() {
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function() {
        $('.navbar .menu').toggleClass("active");
        $('.navbar .menu.icon').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["Data Scientst", "ML Engineer", "Data Analyst", "AI Engineer", "Data Engineer", "Tableau Expert"],
        typeSpeed: 100,
        backSpeed: 60,
        loop: true
    });

    var typed = new Typed(".typing-2", {
        strings: ["Predictive Analysis", "A/B Testing", "Deep Learning", "Reporting & Dashboard Creation", "SQL Query", "Advance Excel", "VBA, Macros & Pivot Table", "C & C++ Programming", "Python", "Numpy", "Pandas", "Scipy", "Matplotlib", "Seaborn", "SciKit Learn", "Tensorflow", "Open_CV", "NLTK"],
        typeSpeed: 150,
        backSpeed: 60,
        loop: true
    });

    // owl carousel script
    $('.carousel').owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 300,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            300: {
                items: 2,
                nav: false
            },
            600: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4,
                nav: false
            },
        },
    });

    // Date and time start
    function showDateTime() {
        var myDiv = document.getElementById("myDiv");

        var date = new Date();
        var dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        var dayName = dayList[date.getDay()];
        var monthName = monthNames[date.getMonth()];
        var today = `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;

        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        var time = hour + ":" + min + ":" + sec;
        myDiv.innerText = `Today is  ${today}. Time is ${time}`;
    }
    setInterval(showDateTime, 1000);
    // date and time  and

});

var $box = $('.box');

$('.closei').each(function() {
    var color = $(this).css('backgroundColor');
    var content = $(this).html();
    $(this).click(function() {
        $box.css('backgroundColor', color);
        $box.addClass('open');
        $box.find('p').html(content);
    });

    $('.close').click(function() {
        $box.removeClass('open');
        $box.css('backgroundColor', 'transparent');

    });

    $('body').toggleClass('overlay');
    $("#pop-toggle").click(function() {
        $(".popup").toggle();
        $('body').toggleClass('overlay');
    })
    $(".close").click(function() {
        $(".popup").toggle();
        $('body').toggleClass('overlay');
    });

});
alert("Please Use Desktop Mode For Good Experience")

function showDateTime() {
    var myDiv = document.getElementById("myDiv");

    var date = new Date();
    var dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    var dayName = dayList[date.getDay()];
    var monthName = monthNames[date.getMonth()];
    var today = `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;

    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    var time = hour + ":" + min + ":" + sec;
    myDiv.innerText = `Today is  ${today}. Time is ${time}`;
}
setInterval(showDateTime, 1000);