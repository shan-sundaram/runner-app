( function () {
	'user strict';

		/*New job creation*/
		app.controller("createJobController", ['$scope', '$location', 'jobAPIService', function($scope, $location, jobAPIService) {
			$scope.isNewJobInProgress = false;
            $scope.jobResponseDocument = {};
            $scope.job = {}
            $scope.responseStyle = "";
            // $scope.job.hosts = [];
            $scope.checkboxModel = {
                runImmediate: false
            };
            $scope.jobCreationError = {};

		    $scope.createJob = function (){
                $scope.isNewJobInProgress = true;
                jobAPIService.createJob($scope.job.jobDocument, $scope.checkboxModel.runImmediate).then(function (response){
                    $scope.isNewJobInProgress = false;
                    $scope.jobResponseDocument = response.data;
                    $scope.responseStyle = "success";                 
                },
                function (err) {
                    $scope.isNewJobInProgress = false;
                    $scope.jobResponseDocument = err.data;
                    $scope.responseStyle = "error";                  
                });
            };

            $scope.cancelJob = function(){
                $scope.newJob = $scope.checkboxModel.runImmediate = false;
                $scope.job = {};
            };
		}]);

}) ();