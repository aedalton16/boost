var users = angular.module('users', ['welcome']);


users.controller('UserController', ['$scope', 'sharedProperties', function($scope, sharedProperties){
	$scope.stringValue = sharedProperties.getString(); // nec? 
	$scope.apply(); 
  
}]);
