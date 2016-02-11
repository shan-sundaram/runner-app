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

        var iCounter = 0;
        var fetchExecutions = false;
        $scope.executionsLiveFeedStart = function(){
            if(!$scope.executionsLiveFeed){
                $scope.executionsLiveFeed = $interval(function(){
                    iCounter++;
                    $scope.fetchExecutions();
                }, 2000);
            }
        };
        var _executionsLiveFeedStop = function (){
            if (angular.isDefined($scope.executionsLiveFeed)) {
                $interval.cancel($scope.executionsLiveFeed);
                $scope.executionsLiveFeed=undefined;
            };
        }
        $scope.executionsLiveFeedStop = function (){
            _executionsLiveFeedStop();
        };
        $scope.executionsLiveFeedStop();
        $scope.executionsLiveFeed = null;

        $scope.stopExecution = function(jobId, execution_id){
            jobAPIService.stopExecution(jobId, execution_id).success(function (response){
              $scope.loadExecDetails(response);
            });
        };

        $scope.fetchExecutions = function(){
            anyPendingExecution = false;
            fetchExecutions = false;
            _getExecutions().then(function(jobExecutions){
                $scope.executionList = [];
                $scope.executionList.push.apply($scope.executionList, jobExecutions);
                if (angular.isUndefined($scope.selectedExecution) || ($scope.selectedExecution.execution_id === undefined) || ($scope.executionList.length === 1)) {
                    fetchExecutions = true;
                }
                if (($scope.executionList.length > 1) && angular.isDefined($scope.executionList[0].execution_id) && (angular.isDefined($scope.selectedExecution.execution_id))) {
                    if($scope.selectedExecution.execution_id === $scope.executionList[0].execution_id){
                        fetchExecutions = true;
                    }
                }
                if(fetchExecutions){
                    $scope.selectedExecution = $scope.executionList[0];
                    if ($scope.executionList.length > 0) {
                        $scope.loadExecDetails($scope.selectedExecution);
                    };
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
                    execItem.timeStarted = (execItem.timers[0]) ? (new Date(execItem.timers[0].start)) : undefined;
                    execItem.timeCompleted = (execItem.timers[0]) ? ((execItem.timers[0].end) ? (new Date(execItem.timers[0].end)) : undefined) : undefined;
                    execItem.duration = undefined;
                    if(angular.isDefined(execItem.timeStarted) && angular.isDefined(execItem.timeCompleted)){
                        execItem.duration = new Date(execItem.timeCompleted.getTime() - execItem.timeStarted.getTime()).getMinutes();
                    }
                });
                deferred.resolve(responseExecutionList);
                if(!anyPendingExecution){
                    $scope.executionsLiveFeedStop();
                }
                else {
                    $scope.executionsLiveFeedStart();
                }
            }).error(function (response){
                $scope.executionsLiveFeedStop();
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
            case "RUNNING":
            anyPendingExecution = true;
            execItem.executionStatusStyle = "running";
            execItem.executionStatusIcon = "fa fa-cog fa-spin fa-lg";
            execItem.showStopExecution = true;
            break;

            case "SUCCESS":
            execItem.executionStatusStyle = "noerror";
            execItem.executionStatusIcon = "fa fa-check-circle fa-lg";
            execItem.showStopExecution = false;
            break;

            case "FAILURE":
            execItem.executionStatusStyle = "error";
            execItem.executionStatusIcon = "fa fa-times-circle fa-lg";
            execItem.showStopExecution = false;
            break;

            case "PENDING":
            anyPendingExecution = true;
            execItem.executionStatusStyle = "suspended";
            execItem.executionStatusIcon = "fa fa-clock-o fa-lg";
            execItem.showStopExecution = true;
            break;

            case "INITIALIZING":
            anyPendingExecution = true;
            execItem.executionStatusStyle = "suspended";
            execItem.executionStatusIcon = "fa fa-circle-o-notch fa-lg fa-spin";
            execItem.showStopExecution = true;
            break;

            case "STOPPING":
            anyPendingExecution = true;
            execItem.executionStatusStyle = "stopping";
            execItem.executionStatusIcon = "fa fa-ban fa-lg fa-spin";
            execItem.showStopExecution = false;
            break;

            case "STOPPED":
            execItem.executionStatusStyle = "stopped";
            execItem.executionStatusIcon = "fa fa-ban fa-lg";
            execItem.showStopExecution = false;
            break;

            case "KILLING":
            anyPendingExecution = true;
            execItem.executionStatusStyle = "killing";
            execItem.executionStatusIcon = "fa fa-minus-square fa-lg fa-spin";
            execItem.showKillExecution = false;
            break;

            case "KILLED":
            execItem.executionStatusStyle = "killed";
            execItem.executionStatusIcon = "fa fa-minus-square fa-lg";
            execItem.showKillExecution = false;
            break;
        }
        return execItem;
    };
}) ();
