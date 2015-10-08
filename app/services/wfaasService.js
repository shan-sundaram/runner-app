(function () {
    'use strict';
    var accountAlias = "";
    var apiHostUrl = "";
    //    angular.module('wfaas.service',[])
            app.factory('jobAPIService',['$http', '$location', 'authService', 'commonService', function($http, $location, authService, commonService){
                var jobAPI = {};
                accountAlias = authService.authentication.accountAlias;
                var devAutomationUrl = "https://api.dev.automation.ctl.io";
                var qaAutomationUrl = "https://api.dev.automation.ctl.io";
                
                // apiHostUrl = ($location.host().indexOf("dev.automation.ctl.io")===0) ? devAutomationUrl : qaAutomationUrl;
                jobAPI.getAllJobs = function(fetchPage){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + accountAlias + '?page=' + fetchPage + '&size=100'
                    });
                };

                jobAPI.createJob = function (jobData, immediate) {
                    return $http({
                        method: 'PUT',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + accountAlias + '?immediate=' + immediate,
                        data: jobData
                    });
                };
                jobAPI.startJob = function(jobId){
                    return $http({
                        method: 'POST',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + accountAlias + '/' + jobId + '/start',
                        data: '{}'
                    });
                };
                jobAPI.deleteJob = function(jobId){
                    return $http({
                        method: 'DELETE',
                        url: commonService.getSelectedEnvironment().url+ '/jobs/' + accountAlias + '/' + jobId
                    });
                };
                jobAPI.getExecutions = function(jobId){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url + '/jobs/' + accountAlias + '/' + jobId + '/executions'
                    });
                };
                return jobAPI;

            }])
            .factory('statusAPIService',['$http',function($http){
                var statusAPI = {};

                statusAPI.getJobStatus = function(jobId){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url+ '/status/' + accountAlias + '/job/' + jobId
                    });
                };

                statusAPI.getExecutionStatus = function(jobId, jobExecutionId){
                    return $http({
                        method: 'GET',
                        url: commonService.getSelectedEnvironment().url+ '/status/' + accountAlias + '/job/' + jobId + '/execution/' + jobExecutionId
                    });
                };
                return statusAPI;
            }]);
}) ();