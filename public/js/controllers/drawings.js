var drawings = angular.module('drawings', ['welcome', 'users']);

// todo: tighten this up ...break into two 

drawings.controller('DrawingsController', ['$scope', '$route', '$stateParams', 'Drawings','socket', 'sharedProperties',
    function($scope, $route, $stateParams, Drawings, socket, sharedProperties){

    // set the stage
    $scope.currentColor = 'red';
    $scope.strokeWidth = 2;
    $scope.points = 6;  // polygon value TODO: add drop down input menu but retain square & triangle 
    $scope.stringValue = sharedProperties.getString();
    // always init values
    $scope.drawingMode = 'free';

    // this is when it hears a socket call
    socket.on('remote:change', function(message){
        $scope.drawingMode = message || $scope.drawingMode;
        // $scope.canvas.discardActiveObject();
        $scope.canvas.changeDrawingMode($scope.drawingMode);
        console.log(message);
    });
     socket.on('send:message', function(message){
        console.log(message);
    });
    // $scope.messages = {};

    // on each load 
    // need to put this elsewhere TODO: NEST CONTROLLERS**
    $scope.status = {
        isopen: false
    };
    // **HERE? dup? 
    $scope.toggled = function(open) {
        console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));

    $scope.init = function(){
        // profile
        // render our drawing 
        Drawings.get({drawingId: $stateParams.drawingId}, // resource bad config
            function(drawing){
                $scope.initCanvas(drawing);
            },
            function(response){
                console.log("error happened "+response);
            }
        );

    };

    // this is for its own button 
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

    // is this dry is this an opp for a direc
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
    $scope.updateBackground = function(){
        console.log('click');
        $scope.canvas.updateCurrentBackground();
    };

     $scope.updateStrokeWidth = function(val){
        var inc = Number(val); 

        $scope.strokeWidth = $scope.strokeWidth + inc;
        console.log($scope.strokeWidth);
        $scope.canvas.updateCurrentStrokeWidth($scope.strokeWidth);
    };

  $scope.submitMessage = function(message){ // HERE?
        $scope.messages.push({name: 'message'});
      $scope.socket.emit('newMessage', message);
     // //$scope.$apply();
      };

      //like profile..**
    // load our whiteboard
    $scope.initCanvas = function(drawing){
        console.log('socket'); // debugger
        $scope.drawing = drawing;
        $scope.messages = $("#messages");
        

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
            'socket': socket,
            'artist' : $scope.stringValue,
            'chat' : $scope.messages, 
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

    $scope.$on("$destroy",  function( event ) {
        $scope.canvas.dispose();
        console.log("FYI - Destroyed scope for DrawingController");
    });

}]);