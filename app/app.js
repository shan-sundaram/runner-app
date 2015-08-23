'use strict';

    var app = angular.module('wfaasApp', ['ngRoute', 'LocalStorageModule']);
    // Declare app level module which depends on views, and components

        app.config(function($routeProvider){
            $routeProvider
            .when("/home", {
                templateUrl: "views/common/home.html",
                controller: "homeController"                
            })
            .when("/login", {
                templateUrl: "views/common/login.html",
                controller: "loginController"                
            })
            .when("/allJobs",{
                templateUrl: "views/wfaas/allJobs.html",
                controller: "jobsController"
            })
            .when("/status/:jobId",{
                templateUrl: "views/wfaas/jobDetails.html",
                controller: "statusController"
            })
            .when("/createJob", {
                templateUrl : "views/wfaas/createJob.html",
                controller: "createJobController"
            })
            .when("/playbookBuilder", {
                templateUrl: "views/wfaas/playbookBuilder.html",
                controller: "pbBuilderController"
            })
            .otherwise({redirectTo: '/home'});
        });

        app.config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        });

        app.run(['authService', function (authService) {
            authService.fillAuthData();
        }]);

        app.directive('highlightOnClick', function(){
            return {
                restrict: 'A',
                link: function($scope, element){
                    element.bind('click', function(){
                        element.toggleClass($scope.toggleClass1).toggleClass($scope.toggleClass2);
                    })
                }
            }
        })