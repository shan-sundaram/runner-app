( function() {
	'use strict';
    var anyPendingExecution = true;
	app.controller("executionController", ['$scope', '$filter', '$q', '$interval', 'jobAPIService', function($scope, $filter, $q, $interval, jobAPIService){
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
        $scope.executionsLiveFeed = null;
        var iCounter = 0;
        
        $scope.executionsLiveFeedStart = function(){
            $scope.executionsLiveFeed = $interval(function(){
                iCounter++;
                console.log('start feed - ' + iCounter);
                $scope.fetchExecutions();
            }, 2000);
        };
        $scope.executionsLiveFeedStop = function (){
            // if (angular.isDefined($scope.executionsLiveFeedStart)) {
                $interval.cancel($scope.executionsLiveFeed);
            // };
        };
        $scope.fetchExecutions = function(){
            // $scope.isExecloading = true;
            anyPendingExecution = false;
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
                responseExecutionList = $filter('orderBy')(response, new Date('start'), false).results;
                
                angular.forEach(responseExecutionList, function (execItem) {
                    execItem = _setExecutionStatusAttrs(execItem);
                });
                deferred.resolve(responseExecutionList); 
                if(!anyPendingExecution){
                    console.log('anyPendingExecution - ' + anyPendingExecution);
                    $scope.executionsLiveFeedStop();
                };
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
            anyPendingExecution = true;
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
            anyPendingExecution = true;
            execItem.executionStatusStyle = "suspended";
            execItem.executionStatusIcon = "fa fa-clock-o fa-lg";
            break;
        }
        return execItem;
    };
}) ();