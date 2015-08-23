(function () {
	'use strict';
		app.controller('pbBuilderController', ['$scope', '$location', 'pbBuilderService','$sce', '$timeout', function($scope, $location, pbBuilderService, $sce, $timeout) {
			$scope.os_List = [];
			$scope.os_script = $scope.server_script = $scope.db_script = $scope.ext_script = "";

			$scope.server_list = [];
			$scope.db_list = [];
			$scope.extras_list = [];

			$scope.os_List = pbBuilderService.getOSList();
			$scope.server_list = pbBuilderService.getServerList();
			$scope.db_list = pbBuilderService.getDBList();
			$scope.extras_list = pbBuilderService.getExtrasList();
			$scope.trustAsHtml = $sce.trustAsHtml;
			$scope.showScript = true;
			
			$scope.scriptBlock = "";
			var scriptDefaultText = "Your playbook will be displayed here once you have added any build items";
			$scope.openTag = '<pre class="brush: yml">--- ';
			$scope.closeTag = '</pre>';
			
			$scope.scriptBlock = scriptDefaultText;

			$scope.scriptRestart = function() {
				$scope.scriptBlock = scriptDefaultText;
				$scope.os_script = $scope.server_script = $scope.db_script = $scope.ext_script ="";
				$scope.osSelected = $scope.svrSelected = $scope.dbSelected = $scope.extSelected = "";
			}
			$scope.renderScript = function (itemType, item) {
				switch(itemType){
					case "os":
						$scope.os_script = item.scriptTag;
						$scope.osSelected = item;
						break;
					case "server":
						$scope.server_script = item.scriptTag;
						$scope.svrSelected = item;
						break;
					case "db":
						$scope.db_script = item.scriptTag;
						$scope.dbSelected = item;
						break;
					case "ext":
						$scope.ext_script = item.scriptTag;
						$scope.extSelected = item;
						break;
				}
				$scope.scriptBlock = $scope.openTag + $scope.os_script +  $scope.server_script +  $scope.db_script +  $scope.ext_script + $scope.closeTag;

				$timeout(function ($scope) {
					SyntaxHighlighter.highlight();
				});

				$scope.showScript =true;
			};

			$scope.isActiveOs = function(item) {
	       		return $scope.osSelected === item;
			};

			$scope.isActiveSvr = function(item) {
	       		return $scope.svrSelected === item;
			};
			$scope.isActiveDb = function(item) {
	       		return $scope.dbSelected === item;
			};

			$scope.isActiveExt = function(item) {
	       		return $scope.extSelected === item;
			};
		}]);
}) ();