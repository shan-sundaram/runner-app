'use strict';

    app.controller('loginController', ['$scope', '$location', 'authService', function($scope, $location, authService){
        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";
        $scope.authentication = authService.authentication;

        $scope.login = function(){
//            var deferred = $q.defer();
            authService.login($scope.loginData)
                .success(function(response){
//                    deferred.resolve(response);
                    authService.fillAuthData(response);
                    console.log(authService.authentication.userName);
                    $location.path('/allJobs');
                })
                .error(function(err, status){
                    $scope.message = err.message;
//                    deferred.reject(err);
                });
//            return deferred.promise;
        }
    }]);