'use strict';

var User = function($resource) {
  return $resource('/auth/users/:id/', {}, {
    'update': {
      method: 'PUT'
    }
  });
};

module.exports = User;

