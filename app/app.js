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
        app.filter('map', function() {
          return function(input, propName) {
            return input.map(function(item) {
              return item[propName];
            });
          };
        });
        app.directive('highlightOnClick', function(){
            return {
                restrict: 'A',
                link: function($scope, element){
                    element.bind('click', function(){
                        element.toggleClass($scope.toggleClass1).toggleClass($scope.toggleClass2);
                    });
                }
            };
        });
        app.directive('scroll', function(){
            return {
                restrict: 'A',
                link: function($scope, element, attrs){
                    element.bind('scroll', function(){
                        
                        if(element[0].scrollTop === 0 ){
                            $scope.yourClass = 'scroll-animate-show';
                        }
                        else {
                            $scope.yourClass = 'scroll-animate-hide';
                        }
                        $scope.$apply();
                    });
                }
            };
        });
        app.directive('infinitescroll', function(){ 
            return {
                    restrict: 'A',
                    link: function($scope, element, attr){ 
                    var raw = element[0]; 
                    element.bind('scroll', function() { 
                        if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                            $scope.$apply(attr.infinitescroll); 
                        }
                    });
                }
            };
        });
        app.directive( 'keyvalueedit', function() {
            return {
            restrict: 'E',
            // scope: { keyName: '=', valueText: '=' },
            templateUrl: 'views/wfaas/templates/keyValue.html',
            link: function ( $scope, element, attrs ) {
                // $scope.editing = false;
                // element.bind('click', function(){
                //     $scope.editing = true;
                // });
              // Let's get a reference to the input element, as we'll want to reference it.
              var inputElement = angular.element( element.children()[1] );

              // This directive should have a set class so we can style it.
              element.addClass( 'edit-in-place' );

              // Initially, we're not editing.
              $scope.editing = false;

              // ng-dblclick handler to activate edit-in-place
              $scope.edit = function () {
                $scope.editing = true;

                // We control display through a class on the directive itself. See the CSS.
                element.addClass( 'active' );

                // And we must focus the element.
                // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
                // we have to reference the first element in the array.
                inputElement.focus();
              };

              // When we leave the input, we're done editing.
              inputElement.on("blur",function  () {
                $scope.editing = false;
                element.removeClass( 'active' );
              });

            }
            };
        });