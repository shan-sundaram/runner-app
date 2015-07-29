'use strict';

//    angular.module('wfaas.service',[])
        app.factory('jobAPIService',['$http', function($http){
            var jobAPI = {};

            jobAPI.getAllJobs = function(){
                return $http({
                    method: 'GET',
                    url: 'http://10.121.41.26:8080/jobs/wfad',
//                    url: 'http://64.15.188.230/jobs/wfaq',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            return jobAPI;

            /*TODO - CLC Login Authentication and use it for any subsequent API request*/
        }])
        .factory('statusAPIService',['$http',function($http){
            var statusAPI = {};

            statusAPI.getJobDetails = function(jobId){
                return $http({
                    method: 'GET',
                    url: 'http://10.121.41.26:8084/status/wfad/job/' + jobId,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            return statusAPI;

            /*TODO - CLC Login Authentication and use it for any subsequent API request*/
        }])
        .factory('clcAPIService',['$http', function($http){
            var clcAPI = {};

            clcAPI.getAuthenticationToken = function(loginData){
                return $http({
                    method: 'POST',
                    url: 'https://api.ctl.io/v2/authentication/login',
                    data: loginData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            return  clcAPI;
        }]);