/**
 * Created by ericjohnson on 1/15/16.
 */

'use strict';

require.config({
    // Initialize the application with the main application file.
    baseUrl: 'assets/js',
    paths: {
        domReady: 'vendor/domReady/domReady',
        jquery: 'vendor/jquery/dist/jquery',
        knockout: 'vendor/knockout/dist/knockout',
        knockoutValidation: 'vendor/knockout-validation/dist/knockout.validation',
        knockoutMapping: 'vendor/bower-knockout-mapping/dist/knockout.mapping',
        knockoutProjections: 'vendor/knockout-projections/dist/knockout-projections',
        //knockoutPaging: 'vendor/knockout-paging/dist/knockout-paging',
        cyclops: 'https://assets.ctl.io/cyclops/1.1.3/scripts/cyclops',
        crossroads: 'vendor/crossroads/dist/crossroads',
        hasher: 'vendor/hasher/dist/js/hasher',
        signals: 'vendor/js-signals/dist/signals',
        text: 'vendor/text/text',
        bootstrap: 'vendor/bootstrap/dist/js/bootstrap',
        knockstrap: 'vendor/knockstrap/build/knockstrap',
        router: 'router',
        fixtures: 'fixtures',
        runner: 'runner',
        runnerConfig: 'runner.config',
        bluebird: 'vendor/bluebird/js/browser/bluebird',
        accountSwitcher: 'accountSwitcher',
        moment: 'vendor/moment/moment',
        momentDurationFormat: 'vendor/moment-duration-format/lib/moment-duration-format'
    },

    shim: {
        "cyclops": {
            deps: ["globaljquery", 'globalko']
            //deps: ["jquery", 'globalko']
        },
        "momentDurationFormat": {
            deps: ["moment"]
        },
        "knockoutValidation": {
            deps: ["knockout"]
        },
        "knockoutProjections": {
            deps: ["knockout"]
        },
        "knockoutMapping": {
            deps: ["knockout"]
        },
        //"knockoutPaging": {
        //    deps: ["knockout"]
        //}
    },

    deps: ['main']
});

define('globalko', ['knockout', 'knockoutValidation'], function(ko){
    // Manually set the global ko property so that Cyclops can use it.
    window.ko = ko;
});

//my additions to brian's majick
define('globaljquery', ['jquery'], function($){
    // Manually set the global $ property so that Cyclops can use it.
    window.$ = $;
});

