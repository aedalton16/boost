'use strict';

var LoginCtrl = function ($scope, AuthService, sharedProperties, $location) {
  $scope.error = {};
  $scope.user = {};

  $scope.login = function(form) {
    AuthService.login('password', {
      'username': $scope.user.username,
      'password': $scope.user.password
    }, function(err) {
      $scope.errors = {};

      if (!err) {
        $location.path('/');
      } else {
        angular.forEach(err.errors, function(error, field) {
          form[field].$setValidity('mongoose', false);
          $scope.errors[field] = error.type;
        });
        $scope.error.other = err.message;
      }
    });

    console.log($scope.user.username);
    sharedProperties.setCurrentUser($scope.user.username); //$scope.setString($scope.user.email); //new 
  };
};

module.exports = LoginCtrl;

