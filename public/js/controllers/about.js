var about = angular.module('about', ['users']);

about.controller('AboutController', ['$scope', 'sharedProperties', 'socket', function($scope, sharedProperties, socket){
	$scope.currentUser = sharedProperties.getString();
	// $scope.bgimg = "image.jpg";
	socket.on("login", function(user){
        // $scope.$apply(function(){
            console.log(user);
        // });
    });
}]);