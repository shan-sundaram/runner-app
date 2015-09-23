( function() {
	'use strict';

	app.controller("executionController", ['$scope', '$filter', 'jobAPIService', function($scope, $filter, jobAPIService){
		$scope.executionList = [];
		$scope.selectedStatusStyle = $scope.selectedStatusIcon = "";
        $scope.selectedExecution = {};
        $scope.idSelectedItem = null;
        $scope.isExecloading = true;

		//Get all job executions for a job
        jobAPIService.getExecutions($scope.selectedJob.id).success(function (response){
            $scope.executionList = $filter('orderBy')(response, new Date('start'), true).results;
            
            angular.forEach($scope.executionList, function (execItem) {
                var executionStatusAttrs = _setExecutionStatusAttrs(execItem.status);
                execItem.executionStatusStyle = executionStatusAttrs.executionStatusStyle;
                execItem.executionStatusIcon = executionStatusAttrs.executionStatusIcon; 
            });
            
            $scope.selectedExecution = $scope.executionList[0];
            if ($scope.executionList.length > 0) {
                $scope.loadExecDetails($scope.selectedExecution);                
            }
            $scope.isExecloading = false;
        });

        $scope.loadExecDetails = function(execution){
            $scope.selectedExecution = execution;
            _setSelected(execution.execution_id);          
        };

        var _setSelected = function (idSelectedItem) {
            $scope.idSelectedItem = idSelectedItem;
        };
	}]);
    var _setExecutionStatusAttrs = function(executionStatus){
        var execution = {
            "executionStatusStyle": "",
            "executionStatusIcon": ""
        };
        switch (executionStatus)
        {
            //Below status is not valid for executions
            case "RUNNING": 
            execution.executionStatusStyle = "running";
            execution.executionStatusIcon = "fa fa-cog fa-spin fa-lg";
            break;

            case "SUCCESS":
            execution.executionStatusStyle = "noerror";
            execution.executionStatusIcon = "fa fa-check-circle fa-lg"; 
            break;

            case "FAILURE":
            execution.executionStatusStyle = "error";
            execution.executionStatusIcon = "fa fa-times-circle fa-lg";
            break;

            //Below status is future feature.
            case "PENDING":
            execution.executionStatusStyle = "suspended";
            execution.executionStatusIcon = "fa fa-clock-o fa-lg";
            break;
        }
        return execution;
    };

}) ();