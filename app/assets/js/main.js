/**
 * Created by ericjohnson on 1/15/16.
 */


// Start the main app logic.
define(['knockout', 'jquery', 'router'], function (ko, $, router) {


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


    // Start the application
    ko.applyBindings({route: router.currentRoute});
});


