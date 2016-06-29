var classrooms = angular.module('classrooms', ['welcome', 'users']);

drawings.controller('ClassroomsController', ['$scope', '$route', '$routeParams', 'Classrooms','socket', 'sharedProperties',
    function($scope, $route, $routeParams, Classrooms, socket, sharedProperties){

    	$scope.init = function() { 
    		Classrooms.get({classroomId: $routeParams.classroomId}
    			function(classroom){
    				
    			}
    			)}
    }