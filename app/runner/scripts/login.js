/**
 * Created by ericjohnson on 1/12/16.
 */


$(document).ready(function () {
    console.log("document ready");

    ko.applyBindings(new runner.loginViewModel());

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//namespace our app
var runner = {};

//define our viewModel
runner.loginViewModel = function () {
    console.log("runner.LoginViewModel");
    var self = this;

    self.submitting = ko.observable(false);
    self.formComplete = ko.observable(false);

    self.user = {
        username: ko.observable(''),
        password: ko.observable('')
    };

    self.submitButtonText = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.submitButtonText");
        return self.submitting() ? "Processing..." : "Sign In";
    });

    self.isFormValid = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.isFormValid");
        return self.user.username() && self.user.password();
    });

    self.loginUser = function () {
        console.log("runner.LoginViewModel.loginUser");
        //console.log(self);
        //console.log(self.submitting);

        var user = ko.toJSON(self.user);
        //console.log(user);

        //console.log(self.submitButtonText());
        self.submitting(true);
        //console.log(self.submitButtonText());

        var jqxhr = $.ajax({
            url: "https://api.ctl.io/v2/authentication/Login",
            type: 'post',
            data: user,
            contentType: 'application/json'
        });

        jqxhr.done(function (data, textStatus, jqXHR) {
            console.log("runner.LoginViewModel.loginUser done");

            self.setResponseToLocalStorage(data);
            //example retrieve from local storage
            console.log(self.getAuthFromLocalStorage());

            //redirect when login is successful
            window.location.replace("/app/runner/main.html");
        });

        jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("runner.LoginViewModel.loginUser fail");
            //console.log(jqXHR);
            //console.log("textStatus: " + textStatus);
            //console.log("errorThrown: " + errorThrown);
            self.displayAlertForJqxhr(jqXHR);
        });

        jqxhr.always(function () {
            console.log("runner.LoginViewModel.loginUser always");
            self.submitting(false);
        });

    };

    self.displayAlertForJqxhr = function (jqXHR) {
        console.log("displayAlertForJsonResponse");

        var failMessage = JSON.parse(jqXHR.responseText).message;
        var statusText = jqXHR.statusText;

        //console.log(failMessage);

        var $alertConsole = $("#alert-console");

        var $alert = $("<div/>", {
            class: "alert alert-danger",
            role: "alert"
        });

        var $alertIconDiv = $("<div/>", {
            class: "alert-icon"
        });

        var $alertIconSvgDiv = $("<svg/>", {
            class: "cyclops-icon"
        });

        var $alertIconUse = "<use xlink:href='#icon-plus-circle'>";

        var $alerth4 = $("<h4/>", {
            text: statusText
        });

        var $alertP = $("<p/>", {
            text: failMessage
        });

        $alertIconSvgDiv.append($alertIconUse);
        $alertIconDiv.append($alertIconSvgDiv);
        $alert.append($alertIconDiv);
        $alert.append($alerth4);
        $alert.append($alertP);

        $alertConsole.html($alert);
    };

    self.setResponseToLocalStorage = function (response) {
        console.log("setResponseToLocalStorage");
        localStorage.setItem('auth', JSON.stringify(response));
    };

    self.getAuthFromLocalStorage = function () {
        console.log("getAuthFromLocalStorage");
        return JSON.parse(localStorage.getItem('auth'));
    };

};
