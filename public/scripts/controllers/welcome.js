var welcome = angular.module('welcome', []);

welcome.controller('WelcomeController', ['$scope', '$location', 'Drawings', function($scope, $location, Drawings){

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
    $scope.socket.on("add-drawing", function(drawing){
        $scope.$apply(function(){
            $scope.drawings.push(drawing);
        });
    });

    // drawing deleted 
    $scope.socket.on("remove-drawing", function(drawing_id){
        $scope.$apply(function(){
            $scope.drawings.forEach(function(obj, index){
                if(obj._id === drawing_id){
                    $scope.drawings.splice(index, 1);
                }
            });
        });
    });

    /*
    * update our status 
    */
    $scope.socket.on('connect', function(){
        console.log('oh hai-- connected to server');
    });

    $scope.socket.on('disconnect', function(){
        console.log('okie bai-- disconnected from server');
    });


}]);