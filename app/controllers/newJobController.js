( function () {
	'user strict';

		/*New job creation*/
		app.controller("createJobController", ['$scope', '$location', 'jobAPIService', function($scope, $location, jobAPIService) {
			$scope.isNewJobInProgress = false;
            $scope.jobResponseDocument = {};
            $scope.hostVars = {};
            $scope.properties = {};
            $scope.job = {};
            $scope.responseStyle = "";
            $scope.repoType = $scope.githubAccessType = '';
            $scope.job.hosts = [];
            $scope.job.hosts.hostVars = $scope.job.properties = {};

            $scope.callbackLevels = ['Debug', 'Error', 'Result'];
            $scope.callbackSelect  = $scope.callbackLevels[2];
            $scope.hideForm = true;

            $scope.checkboxModel = {
                runImmediate: false
            };

            $scope.jobCreationError = {};

            $scope.addToList = function(objType){
                switch(objType){
                    case "properties":
                        _addAdditonalProperty();
                        break;
                }
            };
            $scope.removeFromList = function(keyName, objType){
                switch(objType){
                    case "properties":
                        delete $scope.job.properties[keyName];
                        // $scope.job.properties.splice(index, 1);
                        // _removeFromList($scope.job.properties);
                        break;
                }
            }
		    $scope.createJob = function (){
                $scope.isNewJobInProgress = true;
                jobAPIService.createJob($scope.job.jobDocument, $scope.checkboxModel.runImmediate).then(function (response){
                    $scope.isNewJobInProgress = false;
                    $scope.jobResponseDocument = response.data;
                    $scope.addNewJobtoList(response.data);
                    $scope.responseStyle = "success";                 
                },
                function (err) {
                    $scope.isNewJobInProgress = false;
                    $scope.jobResponseDocument = err.data;
                    $scope.responseStyle = "error";                  
                });
            };

            var _addAdditonalProperty = function (){
                $scope.job.properties[$scope.properties.key] = $scope.properties.value;
                $scope.properties = {};
            };

            $scope.cancelJob = function(){
                $scope.newJob = $scope.checkboxModel.runImmediate = false;
                $scope.job = $scope.jobResponseDocument = {};
            };
		}]);

}) ();