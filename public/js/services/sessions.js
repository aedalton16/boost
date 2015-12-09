'use strict';

angular.module('welcome')
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
  });
