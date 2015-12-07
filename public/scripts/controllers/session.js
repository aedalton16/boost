var drawings = angular.module('canvas', []);

// additional tools....integrate 
drawings.controller('CanvasController', ['$scope', '$route', '$routeParams', 'Drawings', 
    function($scope, $route, $routeParams, Drawings){

    // set the stage
    $scope.currentColor = 'red';
    $scope.strokeWidth = 2;
    $scope.points = 6;  // polygon value TODO: add drop down input menu but retain square & triangle 

    // always init values
    $scope.drawingMode = 'free';

    // on each load 
    $scope.init = function(){

        // render our drawing 
        Drawings.get({drawingId: $routeParams.drawingId},
            function(drawing){
                $scope.initCanvas(drawing);
            },
            function(response){
                console.log("error happened "+response);
            }
        );

    };

    $scope.canvas.on('object:removed', function(e) {
        var fabricObject = e.target
        socket.emit('object:removed', JSON.stringify(fabricObject))
    })

    $scope.socket.on('object:removed', function(rawObject) {
        var fabricObject = canvas.getObjectByUUID(rawObject.uuid)
        if(fabricObject) {
            canvas.remove(fabricObject)
        } else {
            console.warn('No object found in scene:', rawObject.uuid)
        }
    })

}]);