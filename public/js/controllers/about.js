var about = angular.module('about', ['users']);

about.controller('AboutController', ['$scope', 'sharedProperties', 'socket', function($scope, sharedProperties, socket){
	$scope.stringValue = sharedProperties.getString();
	// $scope.$apply();
	// $scope.bgimg = "image.jpg";
	$scope.$on("login", function(user){
        // $scope.$apply(function(){
            console.log(user);
        // });
    });
}]);