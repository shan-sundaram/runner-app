'use strict';
app.factory('authInterceptorService', ['$q', '$injector','$location', function ($q, $injector, $location) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};
        var authService = $injector.get('authService');

        if (authService.authentication.isAuth) {
            config.headers.Authorization = authService.authentication.bearerToken;
        }

        return config;
    }

//    var _responseError = function (rejection) {
//        if (rejection.status === 401) {
//            var authService = $injector.get('authService');
//            var authData = localStorageService.get('authorizationData');
//
//            if (authData) {
//                if (authData.useRefreshTokens) {
//                    $location.path('/refresh');
//                    return $q.reject(rejection);
//                }
//            }
//            authService.logOut();
//            $location.path('/login');
//        }
//        return $q.reject(rejection);
//    }

    authInterceptorServiceFactory.request = _request;
//    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);