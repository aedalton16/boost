'use strict';

angular.module('users')
  .controller('SignupCtrl', function ($scope, Auth, sharedProperties, $location) {
    $scope.register = function(form) {
      Auth.createUser({
          email: $scope.user.email,
          username: $scope.user.username,
          password: $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            $location.path('#/draw');
            sharedProperties.setCurrentUser($scope.user.username);
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          }
        });

    };
  });