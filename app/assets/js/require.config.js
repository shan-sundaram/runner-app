/**
 * Created by ericjohnson on 1/15/16.
 */

'use strict';

console.log('require.config.js');

require.config({
    // Initialize the application with the main application file.
    baseUrl: 'assets/js',
    paths: {
        jquery: 'vendor/jquery/dist/jquery',
        //knockout: 'https://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0',
        knockout: 'vendor/knockout/dist/knockout',
        mapping: 'vendor/bower-knockout-mapping/dist/knockout.mapping',

        projections: 'vendor/knockout-projections/dist/knockout-projections',
        cyclops: 'https://assets.ctl.io/cyclops/1.1.2/scripts/cyclops.min',
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
    deps: ['main'],
    //callback: function (ko, mapping) {
    //    ko.mapping = mapping;
    //}
});



  //<script src='https://code.jquery.com/jquery-2.1.4.min.js' ></script>
  //<script src='https://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js' ></script>
  //<script src='https://cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min.js' ></script>
  //<script src='https://code.jquery.com/ui/1.11.4/jquery-ui.min.js'></script>
  //<script src='https://assets.ctl.io/cyclops/1.1.2/scripts/cyclops.min.js' ></script>
  //<script src='./scripts/site.js' ></script>