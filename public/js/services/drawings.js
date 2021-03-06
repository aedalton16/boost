'use strict';

angular.module('app').factory('Drawings', ['$resource', function($resource){

	// resource(url, param defaults, actions)
    return $resource('drawings/:drawingId', {
        drawingId: '@_id'
    }, 
    { 'update': { method: 'PUT' } },
    { 'query': { method: 'GET', isArray: false } }


    );

}]);