'use strict';

    var app = angular.module('wfaasApp', ['ngRoute','ngCookies']);
    // Declare app level module which depends on views, and components

        app.config(function($routeProvider){
            $routeProvider
            .when("/home", {
                controller: "homeController",
                templateUrl: "views/common/home.html"
            })
            .when("/login", {
                controller: "loginController",
                templateUrl: "views/common/login.html"
            })
            .when("/allJobs",{
                templateUrl: "views/wfaas/allJobs.html",
                controller: "jobsController"
            })
            .when("/status/:jobId",{
                templateUrl: "views/wfaas/jobDetails.html",
                controller: "statusController"
            })
            .otherwise({redirectTo: '/home'});
        });

        app.config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        });

        app.run(['authService', function (authService) {
            authService.getAuthData();
        }]);