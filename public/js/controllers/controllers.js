angular.module('app.controllers', [ ]).

  .controller('SignupCtrl', [function ($scope, Auth, sharedProperties, $location) {
    $scope.register = function(form) {
      Auth.createUser({
          email: $scope.user.email,
          username: $scope.user.username,
          password: $scope.user.password
        },
        function(err) {
          $scope.errors = {};

          if (!err) {
            
            sharedProperties.setCurrentUser($scope.user.username);
            $location.path('#/draw');
          } else {
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.type;
            });
          }
        });

    };
  }])

  .controller('WelcomeController', ['$scope', '$location', 'Drawings', 'socket', function($scope, $location, Drawings, socket){

   // init 
    $scope.newDrawing = {};

     // on load
    $scope.init = function(){
        Drawings.query(function(drawings){
            $scope.drawings = drawings;
        });
    };

   // write to our db on user save
    $scope.create = function(){
        var c = new fabric.LabeledCanvas();
        c.name = $scope.newDrawing.name;
        c.description = $scope.newDrawing.description;
        Drawings.save(c,
            function(results){
                console.log("got something "+results._id);
                $scope.newDrawing = null;
                $location.path('drawings/'+results._id);
            }, function(response){
                console.log("got error "+response.status);
            });
    };
    // drawing added 
    socket.on("add-drawing", function(drawing){
        // $scope.$apply(function(){
            $scope.drawings.push(drawing);
        // });
    });

    // drawing deleted 
    socket.on("remove-drawing", function(drawing_id){
        // $scope.$apply(function(){
            $scope.drawings.forEach(function(obj, index){
                if(obj._id === drawing_id){
                    $scope.drawings.splice(index, 1);
                }
            });
        // });
    });

    /*
    * update our status 
    */
    socket.on('connect', function(){
        console.log('oh hai-- connected to server');
    });

    socket.on('login', function(){
        console.log('login heard at welcome');
        
    });
    socket.on('disconnect', function(){
        console.log('okie bai-- disconnected from server');
    });


}])
.