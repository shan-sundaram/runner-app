/**
 * Created by ericjohnson on 1/15/16.
 */


// Start the main app logic.
define([
    'knockout',
    'jquery',
    'router',
    'domReady',
    'cyclops'
], function (
    ko,
    $,
    router,
    domReady,
    cyclops
) {

    var self = this;

    ko.components.register("navigation", {
        require: '/components/navigation/navigation.js'
    });

    ko.components.register("library", {
        require: '/components/library/library.js'
    });

    ko.components.register("playbook-build", {
        require: '/components/playbook-build/playbook-build.js'
    });

    ko.components.register("playbook-run", {
        require: '/components/playbook-run/playbook-run.js'
    });

    ko.components.register("jobs", {
        require: '/components/jobs/jobs.js'
    });

    ko.components.register("playbook", {
        require: '/components/playbook/playbook.js'
    });

    ko.components.register("job", {
        require: '/components/job/job.js'
    });


    ko.components.register("footer-view", {
        require: '/components/footer-view/footer-view.js'
    });

    ko.components.register("library-tabs", {
        require: '/components/library-tabs/library-tabs.js'
    });

    ko.components.register("playbooks-public", {
        require: '/components/playbooks-public/playbooks-public.js'
    });


    // Start the application
    ko.applyBindings({route: router.currentRoute});



    domReady(function () {
        console.log("domReady");


        $('.action-toolbar-left a').actionToolbarConfirm();

        //$(function(){
        //    $('.action-toolbar-left a').actionToolbarConfirm()
        //})

        self.setResponseToLocalStorage = function (response) {
            console.log("setResponseToLocalStorage");
            localStorage.setItem('auth', JSON.stringify(response));
        };

        self.getAuthFromLocalStorage = function () {
            console.log("getAuthFromLocalStorage");
            return JSON.parse(localStorage.getItem('auth'));
        };


        var qwerty = {
            foo: "bar"
        };

        var fakeToken = {
            token: "djbhvdjhdhknjbfvnfjvhdgkjnfvijdlkhdfkbdkjggdfjkdhfgjdckj"
        };

        //self.setResponseToLocalStorage(null);
        var foo = self.getAuthFromLocalStorage();

        if (foo) {
            console.log("you are in");
            //alert("you are in");

            console.log('foo', foo);
        } else {
            //alert("do SSO");
            setResponseToLocalStorage(fakeToken);
            var fakeGet = self.getAuthFromLocalStorage();
            console.log('fakeGet', fakeGet);
        }

    });




/*
    $(document).ready(function () {
        console.log("document ready");

    });
*/
















});















