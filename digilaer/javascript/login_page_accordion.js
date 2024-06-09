function toggleManualLogin() {
    require(['jquery'], function($) {
        if ($("#manual-login-toggler").hasClass("active")) {
            $("#manual-login-toggler").removeClass("active");
            $("#manual-login-inner").slideUp(300);
        }
        else {
            $("#manual-login-toggler").addClass("active");
            $("#manual-login-inner").slideDown(300);
        }
    });

}

function getURLParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

require(['jquery'], function($) {
    var errorCode = getURLParameterByName("errorcode");
    if (errorCode !== null && errorCode !== undefined) {
        if (errorCode === "3") {
            $("#login-error-message").text("Ugyldig brukernavn eller passord");
        } else {
            $("#login-error-message").text("Ugyldig innlogging");
        }

        $("#manual-login-toggler").addClass("active");
        $("#manual-login-inner").slideDown(0);
    }

    if (getURLParameterByName("manualloginexpanded") == 1) {
        $("#manual-login-toggler").addClass("active");
        $("#manual-login-inner").slideDown(0);
    }
});