'use strict';

angular.module('users')
  .controller('SignupCtrl', function ($scope, Auth, sharedProperties, $location, socket) {
    $scope.register = function(form) {
      Auth.createUser({
          email: $scope.user.email,
          username: $scope.user.username,
          password: $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            
            sharedProperties.setCurrentUser($scope.user.username);
            socket.emit('user:login', {'currentUser': $scope.user.email});
            $location.path('#/draw');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          }
        });

    };
  });