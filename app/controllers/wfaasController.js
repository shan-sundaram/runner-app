( function () {
    'use strict';

    //    angular.module('wfaas.controller',[])
            /**/
            app
            /*Get all Jobs Controller*/
            .controller("jobsController", ['$scope', '$location', '$controller', '$filter', 'jobAPIService', function($scope, $location, $controller, $filter, jobAPIService){
                /*Declaration*/
                $scope.jobsList = [];
                $scope.isJobloading = true;
                $scope.selectedJob = {};
                $scope.selectedJob.hosts = [];
                $scope.selectedJobId = null;
                $scope.activeSection = "";
                // $scope.newJob = false;
                // $scope.job = {};
                // $scope.job.hosts = [];
                // $scope.checkboxModel = {
                //     runImmediate: false
                // };
                
                $scope.toggleClass1 = "fa-star-o fa-star";
                $scope.toggleClass2 = "fa-star-none fa-star-fav";

                
                $controller('createJobController', {$scope: $scope});
                $scope.template = {
                    "createJob": "views/wfaas/createJob.html"
                };

                jobAPIService.getAllJobs().success(function (response){
                    //Get all jobs for an account Alias
                    $scope.jobsList = $filter('orderBy')(response, 'lastUpdatedTime', true);
                    $scope.selectedJob = $scope.jobsList[0];
                    if($scope.jobsList.length > 0){
                        $scope.loadJobMainSection($scope.selectedJob);
                    }
                    $scope.isJobloading = false;
                });

                var _setSelectedJob = function (idSelectedItem) {
                    $scope.selectedJobId = idSelectedItem;
                };
                
                $scope.loadJobMainSection = function(job){
                    $scope.selectedJob = job;
                    _setSelectedJob(job.id);
                    $scope.jobDetailSelection('executions'); 
                    // $scope.loadExecutions();                                        
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

                $scope.loadExecutions = function(){
                    $controller('executionController', {$scope: $scope});
                    $scope.template = {
                        "jobExecutions": "views/wfaas/jobExecutions.html",
                        "jobRecentActivity": "views/wfaas/jobRecentActivity.html"
                    };
                };

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
            }])
            
            /*Get Job Status Controller*/
            .controller("statusController", ['$scope', '$interval', '$routeParams', '$sce', '$timeout', 'statusAPIService', function($scope, $interval, $routeParams, $sce, $timeout, statusAPIService){
                // $scope.jobId = $routeParams.jobId;
                $scope.isStatusLoading = true;
                $scope.trustAsHtml = $sce.trustAsHtml;
                $scope.openTag = '<pre class="brush: javascript">';
                $scope.closeTag = '</pre>';
                /*Get job details for the first time*/
                getJobStatus();
                // SyntaxHighlighter.highlight();
                /*Check for latest job status details for every 15 seconds and stop after 10 pings*/
                // $interval(function(){
                //     getJobStatus();
                // }, 5000, 36);

                /*Get job details for the first time*/
                function getJobStatus(){
                    // $scope.loading = true;
                    statusAPIService.getJobStatus($scope.selectedJob.id).success(function (response){
                        //Get all jobs for an account Alias
                        $scope.scriptBlock = $scope.openTag + JSON.stringify(response, null, '\t') + $scope.closeTag;
                        $timeout(function ($scope) {
                            SyntaxHighlighter.highlight();
                        });
                        // $scope.jobStatus = response;
                        $scope.isStatusLoading = false;
                    });
                }
            }]);
}) ();