'use strict';
    /*Todo - Lot of clean up to be done*/
    app.factory('authService',['$http', '$cookies', function($http, $cookies){
        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            accountAlias: "",
            bearerToken: ""
        };

        /*Todo - Lot of scenarios to be considered
        1. Auth API as constant in app.js*/
        var _login = function(loginData){
            return $http({
                                method: 'POST',
                                url: 'https://api.ctl.io/v2/authentication/login',
                                data: loginData,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
        };

        var _logOut = function(){
            _authentication.isAuth = false;
            _authentication.userName = _authentication.accountAlias = _authentication.bearerToken = "";
        };

        var _fillAuthData = function () {
            var authData = _getLocalAuthData();
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.accountAlias = authData.accountAlias;
                _authentication.bearerToken = authData.bearerToken;
            }
        };

        var _getLocalAuthData = function () {
            return $cookies.getObject('authData');
        }

        var _setLocalAuthData = function (newAuthData){
            $cookies.putObject('authData', newAuthData);
        }

        authServiceFactory.authentication = _authentication;
        authServiceFactory.login = _login;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.setLocalAuthData = _setLocalAuthData;
        authServiceFactory.logOut = _logOut;

        return authServiceFactory;
    }]);
