( function () {
    'use strict';

    //    angular.module('wfaas.controller',[])
            /**/
            app
            /*Get all Jobs Controller*/
            .controller("jobsController", ['$scope', '$location', '$controller', '$filter', '$q', 'jobAPIService', function($scope, $location, $controller, $filter, $q, jobAPIService){
                /*Declaration*/
                $scope.jobsList = [];
                $scope.isJobloading = true;
                $scope.selectedJob = {};
                $scope.selectedJob.hosts = [];
                $scope.selectedJobId = null;
                $scope.activeLeftMenuIcon = "jobs";
                var currentPage = -1;
                var totalJobs = 0;

                var _fetchMoreJobs = function(isDefaultPage){
                    (isDefaultPage) ? currentPage = 0 : currentPage += 1;
                    var deferred = $q.defer();
                    jobAPIService.getAllJobs(currentPage).success(function (response){
                        //Get all jobs for an account Alias
                        if(totalJobs === 0) {
                            totalJobs = response.totalSize;
                        }
                        deferred.resolve(response.results);
                    });
                    return deferred.promise;
                };
                $scope.getJobsOnScroll = function(){
                    _fetchMoreJobs().then(function(moreJobs){
                        $scope.jobsList.push.apply($scope.jobsList, moreJobs);
                    });
                };
                $scope.getAllJobs = function(){
                    _fetchMoreJobs(true).then(function(allJobs){
                        $scope.jobsList = [];
                        $scope.jobsList.push.apply($scope.jobsList, allJobs);
                        $scope.selectedJob = $scope.jobsList[0];
                        if($scope.jobsList.length > 0){
                            $scope.loadJobMainSection($scope.selectedJob);                            
                        }
                        else {
                            $scope.loadMainSection('createJob');
                        }
                        $scope.isJobloading = false;    
                    });                    
                };

                $scope.getAllJobs();
                
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
                            $scope.getAllJobs();                              
                    }
                }
                $scope.loadCreateJobSection = function(){
                    $controller('createJobController', {$scope: $scope});
                    $scope.mainSectiontemplate = {
                        "createJobMainSection":  "views/wfaas/createJob.html"
                    }; 
                };
                $scope.loadJobMainSection = function(job){
                    $scope.activeLeftMenuIcon = "jobs";
                    $scope.selectedJob = job;
                    _setSelectedJob(job.id);
                    $controller('jobMainSectionController', {$scope: $scope});
                    $scope.mainSectiontemplate = {
                        "jobMainSection":  "views/wfaas/jobMainSection.html"
                    };                                    
                };
                $scope.addNewJobtoList = function(newJob) {
                    $scope.jobsList.unshift(newJob);
                };
                $scope.loadpbBuilderSection = function(){
                    $controller('pbBuilderController', {$scope: $scope});
                    $scope.mainSectiontemplate = {
                        "pbBuilderMainSection":  "views/wfaas/playbookBuilder.html"
                    }; 
                };
            }])
            
            /*Get Job Status Controller*/
            .controller("statusController", ['$scope', '$interval', '$routeParams', '$sce', '$timeout', 'statusAPIService', function($scope, $interval, $routeParams, $sce, $timeout, statusAPIService){
                $scope.isStatusLoading = true;
                $scope.trustAsHtml = $sce.trustAsHtml;
                $scope.openTag = '<pre class="brush: javascript">';
                $scope.closeTag = '</pre>';
                /*Get status details for a job execution*/
                getExecutionStatus();
                // SyntaxHighlighter.highlight();
                /*Check for latest job status details for every 15 seconds and stop after 10 pings*/
                // $interval(function(){
                //     getJobStatus();
                // }, 5000, 36);

                /*Get job details for the first time*/
                function getJobStatus(){
                    statusAPIService.getJobStatus($scope.selectedJob.id).success(function (response){
                        //Get all jobs for an account Alias
                        $scope.scriptBlock = $scope.openTag + JSON.stringify(response, null, '\t') + $scope.closeTag;
                        $timeout(function ($scope) {
                            SyntaxHighlighter.highlight();
                        });
                        $scope.isStatusLoading = false;
                    });
                }
                /*Get status details for a job execution*/
                function getExecutionStatus(){
                    statusAPIService.getExecutionStatus($scope.selectedJob.id, $scope.idSelectedItem).success(function (response){
                        $scope.scriptBlock = $scope.openTag + JSON.stringify(response, null, '\t') + $scope.closeTag;
                        $timeout(function ($scope) {
                            SyntaxHighlighter.highlight();
                        });
                        $scope.isStatusLoading = false;
                    });
                }
            }]);
}) ();