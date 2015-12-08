var chats = angular.module('chats', []);

// todo: tighten this up 
chats.controller('ChatsController', ['$scope',
    function($scope){
    $scope.messages = {}; 

    // on each load 
    $scope.init = function(){

        $scope.initChat();

    };
    // update drawing mode 

     $scope.submitMessage = function(message){
        $scope.messages.push(message);
        $scope.socket.emit('newMessage', message);
     //$scope.$apply();
     };


    // load our whiteboard
    $scope.initChat = function(){

        // $scope.chat = chat;

        // TODO: revise to loadfromjson
        // context vars for extended objects
        var context = {
            'socket': $scope.socket
        };
        // where should we put points 

        $scope.chat = new ChatWrapper(context);
        // $scope.canvas.loadFromJSON(drawing);

        // $scope.canvas.discardActiveObject();

    };

    // shut it down 
    $scope.$on("$destroy",  function( event ) {
        $scope.canvas.dispose();
        console.log("FYI - Destroyed scope for DrawingController");
    });
    // $scope.socket.on('newMessage', function(message){
    //     console.log('listeningevent fired chats.js');
    //     $scope.chat.newMessage(message);
    // });

}]);