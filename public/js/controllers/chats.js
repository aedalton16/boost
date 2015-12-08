var chats = angular.module('chats', []);

chats.controller('ChatsController', ['$scope', function($scope){

   // init 
    $scope.messages = {};

     // on load
    $scope.init = function(){
        console.log('chatslive');
    };

     $scope.submitMessage = function (message) {
    // Prevent markup from being injected into the message
    // message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message) {
    // $inputMessage.val('');
      // $scope.chat.newMessage(message);
        console.log('message button clicked');
        // tell server to execute 'new message' and send along one parameter
        $scope.socket.emit('newMessage', message);
    }
    };

   // write to our db on user save
    // $scope.create = function(){
    //     var c = new fabric.LabeledCanvas();
    //     c.name = $scope.newDrawing.name;
    //     c.description = $scope.newDrawing.description;
    //     Drawings.save(c,
    //         function(results){
    //             console.log("got something "+results._id);
    //             $scope.newDrawing = null;
    //             $location.path('drawings/'+results._id);
    //         }, function(response){
    //             console.log("got error "+response.status);
    //         });
    // };
    // drawing added 
    $scope.socket.on('newMessage', function(message){
        console.log('caught');
        $scope.$apply(function(){
            $scope.messages.push(message);
            console.log(messages);
        });
    });
    $scope.socket.on('connect', function(){
        console.log('oh ***-- messages connected to server');
    });

    $scope.socket.on('disconnect', function(){
        console.log('okie bai-- messages disconnected from server');
    });


}]);