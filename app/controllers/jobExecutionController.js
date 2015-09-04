( function() {
	'use strict';

	app.controller("executionController", ['$scope', 'jobAPIService', function($scope, jobAPIService){
		$scope.executionList = [];
		$scope.executionStatusIcon = "";
		jobAPIService.getExecutions($scope.selectedJob.id).success(function (response){
            //Get all job executions for a job
            $scope.executionList = response;
        });

        $scope.getExecutionStatusStyle = function(executionStatus){
        	var executionStatusStyle;
            switch (executionStatus)
            {
            	//Below status is not valid for executions
                case "RUNNING": 
                executionStatusStyle = "running";
                $scope.executionStatusIcon = "fa fa-cog fa-spin";
                break;

                case "SUCCESS":
                executionStatusStyle = "noerror";
                $scope.executionStatusIcon = "fa fa-check-circle"; 
                break;

                case "FAILURE":
                executionStatusStyle = "error";
                $scope.executionStatusIcon = "fa fa-times-circle";
                break;

                //Below status is future feature.
                case "SUSPENDED":
                executionStatusStyle = "suspended";
                $scope.executionStatusIcon = "fa fa-clock-o";
                break;
            }
            return executionStatusStyle;
        };

	}]);

}) ();