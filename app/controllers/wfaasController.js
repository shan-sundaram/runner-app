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
                $scope.activeLeftMenuIcon = "jobs";

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
                
                $scope.loadMainSection = function(sectionName){
                    switch(sectionName){
                        case "createJob":
                            $scope.loadCreateJobSection();
                            $scope.activeLeftMenuIcon = "createJob";
                            break;

                        case "pbBuilder":
                            $scope.loadpbBuilderSection(); 
                            $scope.activeLeftMenuIcon = "pbBuilder"; 
                            break;

                        default:
                            $scope.loadJobMainSection($scope.selectedJob);
                            $scope.activeLeftMenuIcon = "jobs";  
                    }
                }
                $scope.loadCreateJobSection = function(){
                    //TODO: Implementation for create job section
                };
                $scope.loadJobMainSection = function(job){
                    $scope.selectedJob = job;
                    _setSelectedJob(job.id);
                    $controller('jobMainSectionController', {$scope: $scope});
                    $scope.mainSectiontemplate = {
                        "jobMainSection":  "views/wfaas/jobMainSection.html"
                    };                                    
                };
                $scope.loadpbBuilderSection = function(){
                    //TODO: Implementation for playbook builder section
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