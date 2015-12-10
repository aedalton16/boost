'use strict';

angular.module('users').controller('SignupCtrl', function ($scope, Auth, sharedProperties, $location) {
	    $scope.register = function(form) {
		Auth.createUser({
			username: $scope.user.username, 
			password: $scope.user.password
		    },
		    function(err) {
			$scope.errors = {};

			if (!err) {
			    $location.path('/');
			} else {
			    angular.forEach(err.errors, function(error, field) {
				    form[field].$setValidity('mongoose', false);
				    $scope.errors[field] = error.type;
				});
			}
		    }
		    );
			sharedProperties.setCurrentUser($scope.user.email);
	    };
	});