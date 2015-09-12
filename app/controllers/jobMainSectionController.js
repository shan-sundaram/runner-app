( function(){
	'use strict';

	app.controller('jobMainSectionController', ['$scope', '$location', '$controller', '$filter', 'jobAPIService', function($scope, $location, $controller, $filter, jobAPIService){
		$scope.activeSection = "";
        $controller('createJobController', {$scope: $scope});
        $scope.template = {
            "createJob": "views/wfaas/createJob.html"
        };
		$scope.loadExecutions = function(){
            $controller('executionController', {$scope: $scope});
            $scope.template = {
                "jobExecutions": "views/wfaas/jobExecutions.html",
                "jobRecentActivity": "views/wfaas/jobRecentActivity.html"
            };
        };
        
		$scope.jobDetailSelection = function(selectedSection){
            switch(selectedSection){
                case "playbook":
                    $scope.activeSection = "playbook";
                    break;

                case "status":
                    $scope.loadStatus(); 
                    $scope.activeSection = "status"; 
                    break;

                default:
                    $scope.loadExecutions();
                    $scope.activeSection = "executions";  
            }
        };
        $scope.jobDetailSelection('executions'); 

        

        $scope.loadStatus = function(){
            $controller('statusController', {$scope: $scope});
            $scope.template = {
                "jobStatus":  "views/wfaas/jobStatus.html"
            };
        };

        $scope.createJob = function (){
            // jobAPIService.createJob($scope.job, $scope.checkboxModel.runImmediate).success(function (response){
            //     $location.path("/status/" + response.id);
            // });
        };

        $scope.startJob = function(){
            // jobAPIService.startJob(jobId).success(function (response){
            //     $location.path("/status/"+jobId);
            // });
        };

        //TODO- Refresh table scope again after deletion
        $scope.deleteJob = function(job){
            // jobAPIService.deleteJob(job.id).success(function (response){
            //     $scope.jobsList.splice($scope.jobsList.indexOf(job), 1);
            // });
        };

        $scope.cancelJob = function(){
            // $scope.newJob = false;
        };

	}]);

}) ();