'use strict';

angular.module('users')
  .factory('Session', function ($resource) {
    return $resource('/login');
  });