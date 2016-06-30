var users = angular.module('users', []);


users.controller('UserController', ['$scope', 'sharedProperties', function($scope, sharedProperties){
	$scope.stringValue = sharedProperties.getString(); // nec? 
  
}]);
