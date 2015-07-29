'use strict';

    app.controller('loginController', ['$scope', '$location', 'authService', function($scope, $location, authService){
        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";
        $scope.authentication = authService.authentication;
        console.log($scope.authentication.userName);
        $scope.login = function(){
//            var deferred = $q.defer();
            authService.login($scope.loginData)
                .success(function(response){
//                    deferred.resolve(response);
                    authService.setLocalAuthData(_setLoginData(response));
                    $location.path('/allJobs');
                })
                .error(function(err, status){
                    $scope.message = err.message;
//                    deferred.reject(err);
                });
//            return deferred.promise;
        }

        var _setLoginData = function(response){
            $scope.authentication.isAuth = true;
            $scope.authentication.userName = response.userName;
            $scope.authentication.accountAlias = response.accountAlias;
            $scope.authentication.bearerToken = 'Bearer ' + response.bearerToken;

            return $scope.authentication;
        }
    }]);