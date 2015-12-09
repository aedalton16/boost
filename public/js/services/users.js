'use strict';

angular.module('users').factory('Users', ['$resource', function($resource){

    return $resource('users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }	
    });

}]);