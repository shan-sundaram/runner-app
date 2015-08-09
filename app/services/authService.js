'use strict';
    /*Todo - Lot of clean up to be done*/
    app.factory('authService',['$http', '$q', 'localStorageService', function($http, $q, localStorageService){
        var authServiceFactory = {};
        var clcAuthenticationUrl = 'https://api.ctl.io/v2/authentication/login';

        var _authentication = {
            isAuth: false,
            userName: "",
            accountAlias: "",
            bearerToken: ""
        };

        /*Todo - Lot of scenarios to be considered
        1. Auth API as constant in app.js*/
        var _login = function(loginData) {

            var deferred = $q.defer();

            $http.post(clcAuthenticationUrl, loginData, { headers: {'Content-Type': 'application/json' } }).success( function (response){
                _setAuthData(response);
                deferred.resolve(response);
            })
            .error( function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };

        var _logOut = function(){
            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = _authentication.accountAlias = _authentication.bearerToken = "";
        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _setAuthData(authData);
            }
        };

        var _setAuthData = function (authData) {
            
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.accountAlias = authData.accountAlias;
                _authentication.bearerToken = authData.bearerToken;
                localStorageService.set('authorizationData', _authentication);
            }
        }

        authServiceFactory.authentication = _authentication;
        authServiceFactory.login = _login;
        authServiceFactory.fillAuthData = _fillAuthData;
        // authServiceFactory.getAuthData = _getAuthData;
        authServiceFactory.logOut = _logOut;

        return authServiceFactory;
    }]);
