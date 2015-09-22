(function () {
    'use strict';
    app.factory('authInterceptorService', ['$q', '$injector','$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};
            config.headers['Content-Type'] = 'application/json';
            var authData = localStorageService.get('authorizationData');
              
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.bearerToken;
            }
            else {
                $location.path('/login');
            }

            return config;
        };

        authInterceptorServiceFactory.request = _request;

        return authInterceptorServiceFactory;
    }]);
}) ();