$(document).ready(function() {
    if ( //iOS
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i)
        )
    {
        $.mobile.defaultPageTransition = "slide";
        $.mobile.defaultDialogTransition = "pop";
    }
    else if( //Android, WP, BB, webOS
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/Windows Phone/i) ||
        navigator.userAgent.match(/BlackBerry/) ||
        navigator.userAgent.match(/ZuneWP7/i) ||
        navigator.userAgent.match(/webOS/i)
        )
    {
        $.mobile.defaultPageTransition = "none";
        $.mobile.defaultDialogTransition = "none";
    }
    else{ //Ander OS
        $.mobile.defaultPageTransition = "slide";
        $.mobile.defaultDialogTransition = "pop";
    }
});


