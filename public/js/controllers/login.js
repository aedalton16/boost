'use strict';

angular.module('users').controller('LoginCtrl', function ($scope, Auth, sharedProperties, $location) {
	    $scope.error = {};
	    $scope.user = {};

	    $scope.login = function(form) {
	    	// console
		Auth.login('password', {
			'email': $scope.user.email,
			'password': $scope.user.password
		    },
		    function(err) {
			$scope.errors = {};

			if (!err) {
				console.log('ok');
				console.log($scope.user.email);
				sharedProperties.setCurrentUser($scope.user.email);
			    $location.path('#/draw');

			} else {
			    angular.forEach(err.errors, function(error, field) {
				    form[field].$setValidity('mongoose', false);
				    $scope.errors[field] = error.type;
				});
			    $scope.error.other = err.message;
			}
		    });
		 //$scope.setString($scope.user.email); //new 
	    };

	 
	});
