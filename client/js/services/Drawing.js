'use strict';

var Drawing = function($resource){
  return $resource('drawings/:drawingId', {
    drawingId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }	
  });
};

module.exports = Drawing;
