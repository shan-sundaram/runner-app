(function () {
    'use strict';
    var accountAlias = "";
    var apiHostUrl = "";
    //    angular.module('wfaas.service',[])
            app.factory('jobAPIService',['$http', '$location', 'authService', 'commonService', function($http, $location, authService, commonService){
                var jobAPI = {};
                
                jobAPI.getAllJobs = function(fetchPage){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + authService.authentication.accountAlias + '?page=' + fetchPage + '&size=100'
                    });
                };

                jobAPI.createJob = function (jobData, immediate) {
                    return $http({
                        method: 'POST',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + authService.authentication.accountAlias + '?immediate=' + immediate,
                        data: jobData
                    });
                };
                jobAPI.startJob = function(jobId){
                    return $http({
                        method: 'POST',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + authService.authentication.accountAlias + '/' + jobId + '/start',
                        data: '{}'
                    });
                };
                jobAPI.deleteJob = function(jobId){
                    return $http({
                        method: 'DELETE',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + authService.authentication.accountAlias + '/' + jobId
                    });
                };
                jobAPI.getExecutions = function(jobId){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url + '/jobs/' + authService.authentication.accountAlias + '/' + jobId + '/executions'
                    });
                };
                return jobAPI;

            }])
            .factory('statusAPIService',['$http', 'authService', 'commonService', function($http, authService, commonService){
                var statusAPI = {};

                statusAPI.getJobStatus = function(jobId){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url+ '/status/' + authService.authentication.accountAlias + '/job/' + jobId
                    });
                };

                statusAPI.getExecutionStatus = function(jobId, jobExecutionId){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url+ '/status/' + authService.authentication.accountAlias + '/job/' + jobId + '/execution/' + jobExecutionId
                    });
                };
                return statusAPI;
            }]);
}) ();
