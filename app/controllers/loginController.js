(function () {
    'use strict';

        app.controller('loginController', ['$scope', '$location', 'authService', 'commonService', function($scope, $location, authService, commonService){
            $scope.loginData = {
                userName: "",
                password: ""
            };

            $scope.message = "";
            $scope.localhostUrl = "";
            $scope.environments = commonService.getEnvironments();
            $scope.defaultEnvironment = $scope.environments[0];
            commonService.removeEnvironment();

            $scope.changeEnvironment = function(selectedEnvironment){
                commonService.setSelectedEnvironment(selectedEnvironment);
                $scope.defaultEnvironment = selectedEnvironment;
            };
            $scope.setlocalhosturlEnvironment = function(){
                $scope.defaultEnvironment.url = $scope.localhostUrl;
                commonService.setSelectedEnvironment($scope.defaultEnvironment);
            };
            $scope.login = function(){
                if(($scope.defaultEnvironment.id == 2) && ($scope.localhostUrl == "")) {
                    $scope.message = "url is required.";
                } else {
                    authService.login($scope.loginData).then(function (response) {
                        $location.path('/allJobs');
                    },
                     function (err) {
                        $scope.message = err.message;
                     });
                }
            };
        }]);
}) ();