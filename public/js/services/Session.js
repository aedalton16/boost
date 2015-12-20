'use strict';

var Session = function ($resource) {
  return $resource('/auth/session/');
};

module.exports = Session;

