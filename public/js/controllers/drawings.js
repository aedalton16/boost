var drawings = angular.module('drawings', ['welcome', 'users']);

// todo: tighten this up ...break into two 

drawings.controller('DrawingsController', [
  '$scope', 
  '$route', 
  '$routeParams', 
  'Drawings',
  'socket', 
  'sharedProperties',
  function($scope, $route, $routeParams, Drawings, socket, sharedProperties){

    // set the stage
    $scope.currentColor = 'red';
    $scope.strokeWidth = 2;
    $scope.points = 6;  // polygon value TODO: add drop down input menu but retain square & triangle 
    $scope.stringValue = sharedProperties.getString();
    // always init values
    $scope.drawingMode = 'free';

    // $scope.messages = {};

    // on each load 
    $scope.init = function(){

      // render our drawing 
      Drawings.get({drawingId: $routeParams.drawingId}, // how does it know tho...
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

    $scope.submitMessage = function(message){
      $scope.messages.push({name: 'message'});
      $scope.socket.emit('newMessage', message);
      // //$scope.$apply();
    };


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

    // shut it down 
    $scope.$on("$destroy",  function( event ) {
      $scope.canvas.dispose();
      console.log("FYI - Destroyed scope for DrawingController");
    });
    //    $scope.socket.on('newMessage', function(message){ never fired? 
    //     console.log('listeningevent fired drawings.js');
    // });

  }
]);
