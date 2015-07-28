'use strict';
    app.controller('homeController', ['$scope','$location', function ($scope,$location) {
        
        $location.path('/login');
    }]);