var drawings = angular.module('drawings', []);

// todo: tighten this up 
drawings.controller('DrawingsController', ['$scope', '$route', '$routeParams', 'Drawings', 
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
    // update drawing mode 
    $scope.changeDrawingMode = function(drawingMode){
        $scope.drawingMode = drawingMode || $scope.drawingMode;
        $scope.canvas.discardActiveObject();
        $scope.canvas.changeDrawingMode($scope.drawingMode);
    };

    // respond to layer changes 
    $scope.changeLayerPosition = function(action){
        $scope.canvas.updateLayerPosition(action);
        return false;
    };

    // color 
    $scope.updateColor = function(color){
        $scope.currentColor = color;
        $scope.canvas.updateCurrentColor(color);
    };

    // polygon points TODO: penta- to dodeca- gon functionality 
    $scope.updatePoints = function(points){
        $scope.points = points;
        $scope.canvas.updateCurrentPoints(points);
    };

     $scope.clearCanvas = function(){
        $scope.canvas.clearCurrentCanvas();
    };


    // load our whiteboard
    $scope.initCanvas = function(drawing){

        $scope.drawing = drawing;

        // TODO: revise to loadfromjson
        // context vars for extended objects
        var context = {
            'name': $scope.drawing.name,
            '_id': $scope.drawing._id,
            'description': $scope.drawing.description,
            'currentColor': $scope.currentColor,
            'points': $scope.points,
            'strokeWidth': $scope.strokeWidth,
            'drawingMode': $scope.drawingMode,
            'socket': $scope.socket,
            'selection': false
        };
        // where should we put points 

        $scope.canvas = new CanvasWrapper('c', context);
        $scope.canvas.loadFromJSON(drawing);

        $scope.canvas.discardActiveObject();

        // get viewPort size
        var getViewPortSize = function() {
            return {
                height: window.innerHeight,
                width:  window.innerWidth
            };
        };

        // run on load
        $scope.canvas.updateCanvasSize(getViewPortSize());

        // handle window resizing
        $(window).on('resize', function() {
            $scope.canvas.updateCanvasSize(getViewPortSize());
        });

    };

    // shut it down 
    $scope.$on("$destroy",  function( event ) {
        $scope.canvas.dispose();
        console.log("FYI - Destroyed scope for DrawingController");
    });

}]);