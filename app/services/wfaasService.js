(function () {
    'use strict';

    //    angular.module('wfaas.service',[])
            app.factory('jobAPIService',['$http', 'authService', function($http, authService){
                var jobAPI = {};
                var accountAlias = authService.authentication.accountAlias;

                jobAPI.getAllJobs = function(){
                    return $http({
                        method: 'GET',
                        url: 'http://wfaas-job-api-svc-v1.service.consul:30000/jobs/' + accountAlias //Dev url
                       // url: 'http://64.15.188.230/jobs/wfaq', //QA url
                    });
                };

                jobAPI.createJob = function (jobData, immediate) {
                    return $http({
                        method: 'PUT',
                        url: 'http://wfaas-job-api-svc-v1.service.consul:30000/jobs/' + accountAlias + '?immediate=' + immediate, //Dev url
                        // url: 'http://64.15.188.230/jobs/wfaq?immediate=' + immediate, //QA url
                        data: jobData
                    });
                };
                jobAPI.startJob = function(jobId){
                    return $http({
                        method: 'POST',
                        url: 'http://wfaas-job-api-svc-v1.service.consul:30000/jobs/' + accountAlias + '/' + jobId + '/start', //Dev url
                        // url: 'http://64.15.188.230/jobs/wfaq/' + jobId + '/start', //QA url
                        data: '{}'
                    });
                };
                jobAPI.deleteJob = function(jobId){
                    return $http({
                        method: 'DELETE',
                        url: 'http://wfaas-job-api-svc-v1.service.consul:30000/jobs/' + accountAlias + '/' + jobId //Dev url
                        // url: 'http://64.15.188.230/jobs/wfaq/' + jobId //QA url
                    });
                };
                return jobAPI;

            }])
            .factory('statusAPIService',['$http',function($http){
                var statusAPI = {};

                statusAPI.getJobDetails = function(jobId){
                    return $http({
                        method: 'GET',
                        url: 'http://wfaas-status-api-svc-v1.service.consul:30003/status/' + accountAlias + '/job/' + jobId //Dev url
                       // url: 'http://64.15.188.230/status/wfaq/job/' + jobId //QA url
                    });
                };
                return statusAPI;
            }]);
            // .factory('clcAPIService',['$http', function($http){
            //     var clcAPI = {};

            //     clcAPI.getAuthenticationToken = function(loginData){
            //         return $http({
            //             method: 'POST',
            //             url: 'https://api.ctl.io/v2/authentication/login',
            //             data: loginData
            //         });
            //     }
            //     return  clcAPI;
            // }]);
}) ();