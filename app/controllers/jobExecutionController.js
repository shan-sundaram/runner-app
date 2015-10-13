( function() {
	'use strict';

	app.controller("executionController", ['$scope', '$filter', '$q', 'jobAPIService', function($scope, $filter, $q, jobAPIService){
		// $scope.executionList = [];
		$scope.selectedStatusStyle = $scope.selectedStatusIcon = "";
        $scope.selectedExecution = {};
        $scope.idSelectedItem = null;
        $scope.isExecloading = true;
        $scope.executionList = [];

		//Get all job executions for a job
        // jobAPIService.getExecutions($scope.selectedJob.id).success(function (response){
        //     $scope.executionList = $filter('orderBy')(response, new Date('start'), true).results;
            
        //     angular.forEach($scope.executionList, function (execItem) {
        //         var executionStatusAttrs = _setExecutionStatusAttrs(execItem.status);
        //         execItem.executionStatusStyle = executionStatusAttrs.executionStatusStyle;
        //         execItem.executionStatusIcon = executionStatusAttrs.executionStatusIcon; 
        //     });
        //     $scope.selectedExecution = $scope.executionList[0];
        //     if ($scope.executionList.length > 0) {
        //         $scope.loadExecDetails($scope.selectedExecution);                
        //     }
        //     $scope.isExecloading = false;
        // });
        $scope.fetchExecutions = function(){
            $scope.isExecloading = true;
            _getExecutions().then(function(jobExecutions){
                $scope.executionList = [];
                $scope.executionList.push.apply($scope.executionList, jobExecutions);
                $scope.selectedExecution = $scope.executionList[0];
                if ($scope.executionList.length > 0) {
                    $scope.loadExecDetails($scope.selectedExecution);                
                }
                $scope.isExecloading = false;
            });            
        };
        var _getExecutions = function(){
            var deferred = $q.defer();
            var responseExecutionList = [];
            jobAPIService.getExecutions($scope.selectedJob.id).success(function (response){
                responseExecutionList = $filter('orderBy')(response, new Date('start'), true).results;
                
                angular.forEach(responseExecutionList, function (execItem) {
                    execItem = _setExecutionStatusAttrs(execItem);
                });
                deferred.resolve(response.results);
            });
            return deferred.promise;
        };
        $scope.fetchExecutions();
        $scope.loadExecDetails = function(execution){
            $scope.selectedExecution = execution;
            _setSelected(execution.execution_id);          
        };

        $scope.addNewExecutiontoList = function(newExecution){
            newExecution = _setExecutionStatusAttrs(newExecution)
            $scope.executionList.unshift(newExecution);
        };

        var _setSelected = function (idSelectedItem) {
            $scope.idSelectedItem = idSelectedItem;
        };
	}]);
    var _setExecutionStatusAttrs = function(execItem){
        switch (execItem.status)
        {
            //Below status is not valid for executions
            case "RUNNING": 
            execItem.executionStatusStyle = "running";
            execItem.executionStatusIcon = "fa fa-cog fa-spin fa-lg";
            break;

            case "SUCCESS":
            execItem.executionStatusStyle = "noerror";
            execItem.executionStatusIcon = "fa fa-check-circle fa-lg"; 
            break;

            case "FAILURE":
            execItem.executionStatusStyle = "error";
            execItem.executionStatusIcon = "fa fa-times-circle fa-lg";
            break;

            //Below status is future feature.
            case "PENDING":
            execItem.executionStatusStyle = "suspended";
            execItem.executionStatusIcon = "fa fa-clock-o fa-lg";
            break;
        }
        return execItem;
    };
}) ();