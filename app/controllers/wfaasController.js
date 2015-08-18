( function () {
    'use strict';

    //    angular.module('wfaas.controller',[])
            /**/
            app.controller("clcController", ['$scope', '$interval', 'clcAPIService', function($scope, $interval, clcAPIService){
                $scope.accessToken = [];

                $interval(function(){
                });
                return clcAPIService.getAuthenticationToken();

            }])
            /*Get all Jobs Controller*/
            .controller("jobsController", ['$scope', '$location', 'jobAPIService', function($scope, $location, jobAPIService){
                /*Declaration*/
                $scope.jobsList = [];
                $scope.loading = true;
                $scope.newJob = false;
                $scope.job = {};
                $scope.job.hosts = [];
                // $scope.job.callbacks = [];
                $scope.checkboxModel = {
                    runImmediate: false
                };

                $scope.template = {
                    "createJob": "views/wfaas/createJob.html"
                };

                jobAPIService.getAllJobs().success(function (response){
                    //Get all jobs for an account Alias
                    $scope.jobsList = response;
                    $scope.loading = false;
                });

                
                $scope.createJob = function (){
                    jobAPIService.createJob($scope.job, $scope.checkboxModel.runImmediate).success(function (response){
                        $location.path("/status/" + response.id);
                    });
                };

                $scope.startJob = function(jobId){
                    jobAPIService.startJob(jobId).success(function (response){
                        $location.path("/status/"+jobId);
                    });
                };
                //TODO- Refresh table scope again after deletion
                $scope.deleteJob = function(job){
                    jobAPIService.deleteJob(job.id).success(function (response){
                        $scope.jobsList.splice($scope.jobsList.indexOf(job), 1);
                    });
                };
                $scope.cancelJob = function(){
                    $scope.newJob = false;
                };
            }])

            /*Get Job Status Controller*/
            .controller("statusController", ['$scope', '$interval', '$routeParams', 'statusAPIService', function($scope, $interval, $routeParams, statusAPIService){
                $scope.jobId = $routeParams.jobId;
                $scope.jobDetails = [];

                /*Get job details for the first time*/
                getJobStatus();

                /*Check for latest job status details for every 15 seconds and stop after 10 pings*/
                $interval(function(){
                    getJobStatus();
                }, 5000, 36);

                /*Get job details for the first time*/
                function getJobStatus(){
                    $scope.loading = true;
                    statusAPIService.getJobDetails($scope.jobId).success(function (response){
                        //Get all jobs for an account Alias
                        $scope.jobDetails = response;
                        $scope.loading = false;
                    });
                }
            }]);
}) ();