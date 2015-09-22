( function () {
	'use strict';
	    app.controller('homeController', ['$scope','$location','authService', function ($scope,$location, authService) {
	        $scope.authentication = authService.getAuthData();
	        if(!$scope.authentication)
	        {
	      	    $location.path('/login');
	      	} else
	      	{
				$location.path('/allJobs');	      		
	      	}
	    }]);
}) ();