'use strict';

//    angular.module('wfaas.service',[])
        app.factory('jobAPIService',['$http', function($http){
            var jobAPI = {};
            /*TODO - 
                1. Add Content json to the headers in interceptor
                2. Account alias from local storage
                3. Login data in local storage */

            jobAPI.getAllJobs = function(){
                return $http({
                    method: 'GET',
                    url: 'http://10.121.41.26:8080/jobs/wfad' //Dev url
//                    url: 'http://64.15.188.230/jobs/wfaq', //QA url
                });
            }

            jobAPI.createJob = function (jobData, immediate) {
                return $http({
                    method: 'PUT',
                    url: 'http://10.121.41.26:8080/jobs/wfad?immediate=' + immediate, //Dev url
                    data: jobData
                });
            }
            jobAPI.startJob = function(jobId){
                return $http({
                    method: 'POST',
                    url: 'http://10.121.41.26:8080/jobs/wfad/' + jobId + '/start', //Dev url
                    data: '{}'
                });
            }
            return jobAPI;

        }])
        .factory('statusAPIService',['$http',function($http){
            var statusAPI = {};

            statusAPI.getJobDetails = function(jobId){
                return $http({
                    method: 'GET',
                    url: 'http://10.121.41.26:8084/status/wfad/job/' + jobId //Dev url
//                    url: 'http://64.15.188.230/status/wfad/job/' + jobId, //QA url
                });
            }
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