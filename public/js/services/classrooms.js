'use strict';

angular.module('classrooms').factory('Classrooms', ['$resource', function($resource){

	// resource(url, param defaults, actions)
    return $resource('classrooms/:classroomId', {
        drawingId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }	
    });

}]);