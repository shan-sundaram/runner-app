/**
 * Created by ericjohnson on 1/15/16.
 */

'use strict';

console.log('require.config.js');



window.ko = require(['knockout']);
window.$ = require(['jquery']);
//window.$.ui = require(['jqueryUi']);
window.ko.validation = require(['knockoutValidation']);
//window.moment = require(['moment']);


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
        //'cyclops': ['knockout', 'jquery']
        //'cyclops': {
        //    deps: ['jquery', 'knockout'],
        //    exports: 'cyclops'
        //},
        "cyclops": {
            deps: ["jquery", 'knockout'],
            exports: 'jQuery'
        }
        //'jquery.actionToolbarConfirm': {
        //    deps: ['jquery', 'cyclops'],
        //    exports: 'jQuery.fn.actionToolbarConfirm'
        //}


    },

    //shim: {
    //    //'cyclops': ['knockout', 'jquery']
    //    'cyclops': {
    //        deps: ['jquery', 'knockout'],
    //        exports: 'cyclops'
    //    },
    ////    //'jquery.actionToolbarConfirm': {
    ////    //    deps: ['jquery'],
    ////    //    exports: 'jQuery.fn.actionToolbarConfirm'
    ////    //},
    ////    //
    //    'jquery': {
    //        exports: '$'
    //    },
    //    'knockout': {
    //        exports: 'ko'
    //    }
    //},
    deps: ['main']
});





//require(['https://assets.ctl.io/cyclops/1.1.3/scripts/cyclops.js', 'knockout'], function(cyclops, ko){
//    console.log('cyclops start');
//
//});

//define('jquery', function () { return jQuery; });
//define('knockout', ko);


  //<script src='https://code.jquery.com/jquery-2.1.4.min.js' ></script>
  //<script src='https://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js' ></script>
  //<script src='https://cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min.js' ></script>
  //<script src='https://code.jquery.com/ui/1.11.4/jquery-ui.min.js'></script>
  //<script src='https://assets.ctl.io/cyclops/1.1.2/scripts/cyclops.min.js' ></script>
  //<script src='./scripts/site.js' ></script>
