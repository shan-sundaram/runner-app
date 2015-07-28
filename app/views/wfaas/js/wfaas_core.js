'use strict';

    angular.module('wfaasApp', ['ngRoute','wfaas.controller', 'wfaas.service'])
        .config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
          $routeProvider
            .when("/allJobs",{templateUrl: "view/wfaas/allJobs.html", controller: "jobsController"})
            .when("/status/:jobId",{templateUrl: "view/wfaas/jobDetails.html", controller: "statusController"});
//            otherwise({redirectTo: '/login',{templateUrl: "view/common/login.html", controller: "loginController"});

          //use the HTML5 History API
//          $locationProvider.html5Mode(true);

        }])
        .run(['$rootScope','clcAPIService', function($rootScope,clcAPIService){
            console.log('Inside runner');
            console.log(clcAPIService.getAuthenticationToken("{username: 'shan.sundaram.wfaq', password: 'Els3vier'}"));
//            $injector.get('$http').defaults.transformRequest = function(data, headersGetter){
//                if($rootScope.oauth) headersGetter()['Authorization'] = 'Bearer ' + $rootScope.oauth.access_token;
//                if(data){
//                    console.log(data);
//                    return angular.toJson(data);
//                }
//            };
        }])