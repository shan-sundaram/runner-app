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
            // alert('request complete');
            $scope.executionList = $filter('orderBy')(response, new Date('start'), true);
            $scope.selectedExecution = $scope.executionList[0];
            if ($scope.executionList.length > 0) {
                // $scope.idSelectedItem = $scope.selectedExecution.id;
                $scope.loadExecDetails($scope.selectedExecution);                
            }
            // alert($scope.executionList.length);
            $scope.isExecloading = false;
        });

        $scope.loadExecDetails = function(execution){
            $scope.selectedExecution = execution;

            _setSelected(execution.id);
            var executionStatusAttrs = _setExecutionStatusAttrs(execution.exit_status);
            $scope.selectedStatusStyle = executionStatusAttrs.executionStatusStyle;
            $scope.selectedStatusIcon = executionStatusAttrs.executionStatusIcon;            
        };

        var _setSelected = function (idSelectedItem) {
            $scope.idSelectedItem = idSelectedItem;
        };
	}]);
    var _setExecutionStatusAttrs = function(executionStatus){
        var setExecutionStatusAttrs = {
            "executionStatusStyle": "",
            "executionStatusIcon": ""
        };
        switch (executionStatus)
        {
            //Below status is not valid for executions
            case "RUNNING": 
            setExecutionStatusAttrs.executionStatusStyle = "running";
            setExecutionStatusAttrs.executionStatusIcon = "fa fa-cog fa-spin";
            break;

            case "SUCCESS":
            setExecutionStatusAttrs.executionStatusStyle = "noerror";
            setExecutionStatusAttrs.executionStatusIcon = "fa fa-check-circle fa-lg"; 
            break;

            case "FAILURE":
            setExecutionStatusAttrs.executionStatusStyle = "error";
            setExecutionStatusAttrs.executionStatusIcon = "fa fa-times-circle fa-lg";
            break;

            //Below status is future feature.
            case "SUSPENDED":
            setExecutionStatusAttrs.executionStatusStyle = "suspended";
            setExecutionStatusAttrs.executionStatusIcon = "fa fa-clock-o";
            break;
        }
        return setExecutionStatusAttrs;
    };

}) ();