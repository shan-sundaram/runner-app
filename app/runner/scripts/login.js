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

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //  Begin Dynamic Alerts
    ////////////////////////////////////////////////////////////////////////////////////////////////

    self.alertVisibleVar = ko.observable(false);
    self.isAlertVisible = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.isAlertVisible");
        return self.alertVisibleVar();
    }, self);

    self.alertClassVar = ko.observable('alert alert-success');
    self.alertClass = ko.pureComputed(function () {
        return self.alertClassVar();
    }, self);

    self.alertIconHrefVar = ko.observable('#icon-plus-circle');
    self.alertIconHref = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.alertIconHref");
        return self.alertIconHrefVar();
    }, self);

    self.alertTitleVar = ko.observable('Success!');
    self.alertTitle = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.alertTitle");
        return self.alertTitleVar();
    }, self);

    self.alertMessageVar = ko.observable('This is a successful message.');
    self.alertMessage = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.alertMessage");
        return self.alertMessageVar();
    }, self);

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //  End Dynamic Alerts
    ////////////////////////////////////////////////////////////////////////////////////////////////

    self.user = {
        username: ko.observable(''),
        password: ko.observable('')
    };

    self.submitting = ko.observable(false);
    self.submitButtonText = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.submitButtonText");
        return self.submitting() ? "Processing..." : "Sign In";
    }, self);

    self.isFormValid = ko.pureComputed(function () {
        console.log("runner.LoginViewModel.isFormValid");
        return self.user.username() && self.user.password();
    }, self);

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

            self.alertVisibleVar(false);

            //redirect when login is successful
            window.location.replace("/app/runner/index.html");
        });

        jqxhr.fail(function (jqXHR, textStatus, errorThrown) {
            console.log("runner.LoginViewModel.loginUser fail");
            //console.log(jqXHR);
            //console.log("textStatus: " + textStatus);
            //console.log("errorThrown: " + errorThrown);

            var thisAlertTitle = jqXHR.statusText;
            var thisAlertMessage = JSON.parse(jqXHR.responseText).message;

            self.alertClassVar('alert alert-danger');
            self.alertIconHrefVar('#icon-ban');
            self.alertTitleVar(thisAlertTitle);
            self.alertMessageVar(thisAlertMessage);

            self.alertVisibleVar(true);
        });

        jqxhr.always(function () {
            console.log("runner.LoginViewModel.loginUser always");
            self.submitting(false);
        });

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
