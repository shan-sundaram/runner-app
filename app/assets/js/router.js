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
                url: 'playbooks',
                params: {
                    page: 'library'
                }
            },
            //{
            //    url: 'playbooks/public',
            //    params: {
            //        page: 'library'
            //    }
            //},
            //{
            //    url: 'playbooks/private',
            //    params: {
            //        page: 'library'
            //    }
            //},


            {
                url: 'playbook/{id}/run',
                params: {
                    page: 'playbook-run'
                }
            },
            {
                url: 'playbook/{id}',
                params: {
                    page: 'playbook'
                }
            },
            {
                url: 'playbook/{id}/schedule',
                params: {
                    page: 'playbook-schedule'
                }
            },
            {
                url: 'playbook/build',
                params: {
                    page: 'playbook-build'
                }
            },


            {
                url: 'jobs',
                params: {
                    page: 'jobs'
                }
            },
            //{
            //    url: 'jobs/mine',
            //    params: {
            //        page: 'jobs'
            //    }
            //},
            //{
            //    url: 'jobs/active',
            //    params: {
            //        page: 'jobs'
            //    }
            //},
            //{
            //    url: 'jobs/errored',
            //    params: {
            //        page: 'jobs'
            //    }
            //},
            //{
            //    url: 'jobs/successful',
            //    params: {
            //        page: 'jobs'
            //    }
            //},


            {
                url: 'job/{id}',
                params: {
                    page: 'job'
                }
            },
            {
                url: 'job/{id}/stop',
                params: {
                    page: 'job'
                }
            },
            {
                url: 'job/{id}/kill',
                params: {
                    page: 'job'
                }
            },
            {
                url: 'job/{id}/log',
                params: {
                    page: 'job'
                }
            },
            {
                url: 'job/{id}/log/download',
                params: {
                    page: 'job'
                }
            },


            {
                url: 'playbooks/all',
                params: {
                    page: 'library'
                }
            },
            {
                url: 'playbook/{id}/view',
                params: {
                    page: 'playbook'
                }
            },
            {
                url: 'jobs/all',
                params: {
                    page: 'jobs'
                }
            },
            {
                url: 'job/{id}/log/view',
                params: {
                    page: 'job'
                }
            },
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
