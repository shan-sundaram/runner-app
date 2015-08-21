( function () {
	'user strict';

		/*New job creation*/
		app.controller("createJobController", ['$scope', '$location', 'jobAPIService', function($scope, $location, jobAPIService) {
			$scope.newJob = false;
			$scope.job = {};
            $scope.job.hosts = [];
            $scope.checkboxModel = {
                runImmediate: false
            };

		    $scope.createJob = function (){
		    	jobAPIService.createJob($scope.job, $scope.checkboxModel.runImmediate).success(function (response){
                    $location.path("/status/" + response.id);
                });
            };

            $scope.cancelJob = function(){
                $scope.newJob = false;
            };
		}]);

}) ();