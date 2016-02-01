define(["jquery", "knockout", "crossroads", "hasher"], function ($, ko, crossroads, hasher) {
    var routeConfig = {
        routes: [
            {
                url: '',
                params: {
                    page: 'library'
                }
            },
            {
                url: 'library',
                params: {
                    page: 'library'
                }
            },


            {
                url: 'job/{id}/run',
                params: {
                    page: 'job-run'
                }
            },
            {
                url: 'job/{id}',
                params: {
                    page: 'job'
                }
            },
            {
                url: 'job/{id}/schedule',
                params: {
                    page: 'job-schedule'
                }
            },
            {
                url: 'job/build',
                params: {
                    page: 'job-build'
                }
            },


            {
                url: 'job-executions',
                params: {
                    page: 'job-executions'
                }
            },






            {
                url: 'job/{idJob}/job-execution/{idJobExecution}',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job/{idJob}/job-execution/{idJobExecution}/stop',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job/{idJob}/job-execution/{idJobExecution}/kill',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job/{idJob}/job-execution/{idJobExecution}/log',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job/{idJob}/job-execution/{idJobExecution}/log/download',
                params: {
                    page: 'job-execution'
                }
            }



/*

            {
                url: 'job-execution/{id}',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job-execution/{id}/stop',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job-execution/{id}/kill',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job-execution/{id}/log',
                params: {
                    page: 'job-execution'
                }
            },
            {
                url: 'job-execution/{id}/log/download',
                params: {
                    page: 'job-execution'
                }
            }
*/

        ]
    };

    return new Router(routeConfig);

    //function change(state) {
    //    if (state === null) {
    //        crossroads.parse('/');
    //    } else {
    //        crossroads.parse(state.url);
    //    }
    //}

    //$(window).bind("popstate", function (e) {
    //    change(e.originalEvent.state);
    //});

    function Router(config) {
        console.log("Router changeHash config:");
        console.log(config);

        var currentRoute = this.currentRoute = ko.observable({});

        ko.utils.arrayForEach(config.routes, function (route) {
            crossroads.addRoute(route.url, function (requestParams) {
                currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });
        crossroads.routed.add(console.log, console);
        activateCrossroads();
    }

    function activateCrossroads() {
        function parseHash(newHash, oldHash) {
            console.log("activateCrossroads parseHash [newHash: " + newHash + ", oldHash: " + oldHash + "]");
            //if (newHash == "")
            //{
            //    if(location.pathname != "/" && location.pathname.length > 1)
            //    {
            //        newHash = location.pathname.slice(1);
            //    }
            //}
            crossroads.parse(newHash);
        }

        function changeHash(newHash, oldHash) {
            console.log("activateCrossroads changeHash [newHash: " + newHash + ", oldHash: " + oldHash + "]");

            var route = newHash;
            //if (route) {
            //    history.replaceState({url: route}, "", location.protocol + '//' + location.host + '/' + route);
            //}
            //else {
            //    history.replaceState({url: '/' }, "", location.protocol + '//' + location.host);
            //}
            crossroads.parse(newHash);
        }

        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

        hasher.initialized.add(parseHash);
        hasher.changed.add(changeHash);
        hasher.init();
    }
});
