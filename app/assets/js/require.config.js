/**
 * Created by ericjohnson on 1/15/16.
 */

'use strict';

console.log('require.config.js');


require.config({
    // Initialize the application with the main application file.
    baseUrl: 'assets/js',
    paths: {
        domReady: 'vendor/domReady/domReady',
        jquery: 'vendor/jquery/dist/jquery',
        knockout: 'vendor/knockout/dist/knockout',
        knockoutValidation: 'vendor/knockout-validation/dist/knockout.validation',
        mapping: 'vendor/bower-knockout-mapping/dist/knockout.mapping',
        projections: 'vendor/knockout-projections/dist/knockout-projections',
        //cyclops: 'cyclops',
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
        bluebird: 'vendor/bluebird/js/browser/bluebird'
    },

    shim: {
        "cyclops": {
            deps: ["jquery", 'knockout'],
            exports: 'jQuery'
        }
    },

    deps: ['main']
});

// Set a global ko object after Knockout is loaded so that
// Cyclops can use it.
require(['knockout'], function(ko){
    window.ko = ko;
});