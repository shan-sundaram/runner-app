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
            $scope.jobsList = [];
            /*TODO - Get all jobs*/
            $scope.loading = true;
            console.log($scope.loading);
            jobAPIService.getAllJobs().success(function (response){
                //Get all jobs for an account Alias
                $scope.jobsList = response;
                $scope.loading = false;
            });

            $scope.startJob = function(jobId){
                jobAPIService.startJob(jobId).success(function (response){
                    $location.path("/status/"+jobId);
                });
            }
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
            }, 1000, 15);

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