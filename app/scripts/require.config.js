/**
 * Created by ericjohnson on 1/15/16.
 */

'use strict';

console.log("require.config.js");

requirejs.config({
    //"baseUrl": "/scripts/",
    "paths": {
        "jquery": "/assets/vendor/jquery/dist/jquery",
        //"knockout": "/vendor/knockout/dist/knockout",
        "knockout": "https://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0",
        "knockout-projections": "/assets/vendor/knockout-projections/dist/knockout-projections",
        "cyclops": "https://assets.ctl.io/cyclops/1.1.2/scripts/cyclops.min",
        "crossroads": "/assets/vendor/crossroads/dist/crossroads",
        "hasher": "/assets/vendor/hasher/dist/js/hasher",
        "signals": "/assets/vendor/js-signals/dist/signals",
        "text": "/assets/vendor/text/text",
        "bootstrap": "/assets/vendor/bootstrap/dist/js/bootstrap",
        "knockstrap": "/assets/vendor/knockstrap/build/knockstrap",
        "router": "/scripts/router",
        //"fixtures": "fixtures",
        "runner": "runner"

    }
});

requirejs(["main"]);



  //<script src="https://code.jquery.com/jquery-2.1.4.min.js" ></script>
  //<script src="https://ajax.aspnetcdn.com/ajax/knockout/knockout-3.3.0.js" ></script>
  //<script src="https://cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min.js" ></script>
  //<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
  //<script src="https://assets.ctl.io/cyclops/1.1.2/scripts/cyclops.min.js" ></script>
  //<script src="./scripts/site.js" ></script>
