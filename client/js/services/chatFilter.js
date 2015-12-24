'use strict';

var chatFilter = function(version) {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  }
};

module.exports = chatFilter;

