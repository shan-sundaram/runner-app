( function () {
	'user strict';

		/*New job creation*/
		app.controller("createJobController", ['$scope', '$location', 'jobAPIService', function($scope, $location, jobAPIService) {
			$scope.newJob = $scope.isError = $scope.isSuccess = false;
			$scope.job = {};
            // $scope.job.hosts = [];
            $scope.checkboxModel = {
                runImmediate: false
            };
            $scope.jobCreationError = {};

		    $scope.createJob = function (){
                $scope.isError = $scope.isSuccess = false;
                jobAPIService.createJob($scope.job.jobDocument, $scope.checkboxModel.runImmediate).then(function (response){
                    $scope.jobResponseDocument = response.data;
                    $scope.isSuccess = true;                    
                },
                function (err) {
                    $scope.jobCreationError = err.data;
                    $scope.isError = true;                    
                });
            };

            $scope.cancelJob = function(){
                $scope.newJob = $scope.checkboxModel.runImmediate = false;
                $scope.job = {};
            };
		}]);

}) ();