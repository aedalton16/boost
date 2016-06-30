var about = angular.module('about', ['users']);

about.controller('AboutController', ['$scope', 'sharedProperties', function($scope, sharedProperties){
	$scope.stringValue = sharedProperties.getString();
	// $scope.bgimg = "image.jpg";

}]);