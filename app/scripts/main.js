/**
 * Created by ericjohnson on 1/15/16.
 */


// Start the main app logic.
define(['knockout', 'jquery', 'router'], function (ko, $, router) {
    ko.components.register("navigation", {
        require: 'components/navigation'
    });

    ko.components.register("library", {
        require: 'components/library'
    });

    ko.components.register("playbook-build", {
        require: 'components/playbook-build'
    });

    ko.components.register("playbook-run", {
        require: 'components/playbook-run'
    });

    ko.components.register("jobs", {
        require: 'components/jobs'
    });



    ko.components.register("playbook", {
        require: 'components/playbook'
    });

    ko.components.register("job", {
        require: 'components/job'
    });

    ko.components.register("footer", {
        require: 'components/footer'
    });


    // Start the application
    ko.applyBindings({route: router.currentRoute});
});
