( function () {
	'use strict';
	    app.controller('homeController', ['$scope','$location','authService', function ($scope,$location, authService) {
	        $scope.authentication = authService.authentication;
	        $location.path('/login');
	    }]);
}) ();