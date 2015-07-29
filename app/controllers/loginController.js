'use strict';

    app.controller('loginController', ['$scope', '$location', 'authService', function($scope, $location, authService){
        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";
        $scope.authentication = authService.authentication;

        $scope.login = function(){
            authService.login($scope.loginData)
                .success(function(response){
                    authService.fillAuthData(response);
                    $location.path('/allJobs');
                })
                .error(function(err, status){
                    $scope.message = err.message;
                });
        }
    }]);