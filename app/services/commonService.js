(function () {
    'use strict';
        /*Todo - Lot of clean up to be done*/
        app.factory('commonService',['$http', '$location', '$q', 'localStorageService', function($http, $location, $q, localStorageService){
            var commonServiceFactory = {};

            var environments = [{"id": 0, "name": "WFAD", "url": "https://api.dev.automation.ctl.io"},{"id": 1, "name": "WFAQ", "url": "https://api.qa.automation.ctl.io"},{"id": 2, "name": "localhost", "url": ""}];
            
            var _getEnvironments = function(){
                return environments;
            };

            var _setDefaultEnvironment = function() {
                _setData(($location.host().indexOf("qa.automation.ctl.io")===0) ? environments[1] : _getSelectedEnvironment());
            };
            var _setSelectedEnvironment = function(selectedEnvironment) {
                if (selectedEnvironment) {
                    localStorageService.set('targetAPIEndpoint', selectedEnvironment);
                }
                // localStorageService.remove('targetAPIEndpoint');
            };

            var _getSelectedEnvironment = function(){
                return ((localStorageService.get('targetAPIEndpoint')) ? localStorageService.get('targetAPIEndpoint') : environments[0]);
            };

            var _removeEnvironment = function () {
                localStorageService.remove('targetAPIEndpoint');
            };

            var _setData = function(data){
                if (data) {
                    localStorageService.set('targetAPIEndpoint', data);
                }
            };

            commonServiceFactory.getEnvironments = _getEnvironments;
            commonServiceFactory.setDefaultEnvironment = _setDefaultEnvironment;
            commonServiceFactory.setSelectedEnvironment = _setSelectedEnvironment;
            commonServiceFactory.getSelectedEnvironment = _getSelectedEnvironment;
            commonServiceFactory.removeEnvironment = _removeEnvironment;

            return commonServiceFactory;
        }]);
}) ();