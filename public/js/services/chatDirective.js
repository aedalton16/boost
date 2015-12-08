'use strict';


angular.module('chat.directives', []).
  directive('chatVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);