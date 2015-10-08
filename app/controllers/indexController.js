( function () {
	'use strict';

	    app.controller('indexController',['$scope','$location','authService', 'commonService', function($scope, $location, authService, commonService){
	        $scope.logOut = function () {
	            authService.logOut();
	            $location.path('/home');
	        };
	        $scope.environments = commonService.getSelectedEnvironment();
	        
	        $scope.getClass = function (viewLocation) { 
	        	return viewLocation === $location.path();
		    };
		   	$scope.authentication = authService.authentication;
		   	$scope.toggleClass1 = "dropdown dropdown open";
	    }]);

}) ();