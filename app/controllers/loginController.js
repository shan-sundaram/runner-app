'use strict';

    app.controller('loginController', ['$scope', '$location', '$cookies', 'authService', function($scope, $location, $cookies, authService){
        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";

        $scope.login = function(){
//            var deferred = $q.defer();
            authService.login($scope.loginData)
                .success(function(response){
//                    deferred.resolve(response);
                    authService.fillAuthData(response);
                    $cookies.putObject('authData', authService.authentication);
                    $location.path('/allJobs');
                })
                .error(function(err, status){
                    $scope.message = err.message;
//                    deferred.reject(err);
                });
//            return deferred.promise;
        }
    }]);