(function () {
    'use strict';

    //    angular.module('wfaas.service',[])
            app.factory('jobAPIService',['$http', '$location', 'authService', function($http, $location, authService){
                var jobAPI = {};
                var accountAlias = authService.authentication.accountAlias;
                var devAutomationUrl = "https://api.dev.automation.ctl.io";
                var qaAutomationUrl = "https://api.qa.automation.ctl.io";
                
                var apiHostUrl = ($location.host().indexOf("dev.automation.ctl.io")===0) ? devAutomationUrl : qaAutomationUrl;
                
                jobAPI.getAllJobs = function(){
                    return $http({
                        method: 'GET',
                        url: apiHostUrl+ '/jobs/' + accountAlias
                    });
                };

                jobAPI.createJob = function (jobData, immediate) {
                    console.log(apiHostUrl);
                    return $http({
                        method: 'PUT',
                        url: apiHostUrl+ '/jobs/' + accountAlias + '?immediate=' + immediate,
                        data: jobData
                    });
                };
                jobAPI.startJob = function(jobId){
                    return $http({
                        method: 'POST',
                        url: apiHostUrl+ '/jobs/' + accountAlias + '/' + jobId + '/start',
                        data: '{}'
                    });
                };
                jobAPI.deleteJob = function(jobId){
                    return $http({
                        method: 'DELETE',
                        url: apiHostUrl+ '/jobs/' + accountAlias + '/' + jobId
                    });
                };
                return jobAPI;

            }])
            .factory('statusAPIService',['$http',function($http){
                var statusAPI = {};

                statusAPI.getJobDetails = function(jobId){
                    return $http({
                        method: 'GET',
                        url: apiHostUrl+ '/status/' + accountAlias + '/job/' + jobId
                    });
                };
                return statusAPI;
            }]);
}) ();