var chats = angular.module('chats', ['welcome', 'users']);

// todo: tighten this up 
/*
*
* intentionally not writing to DB as of right now  
*/
chats.controller('ChatsController', ['$scope', "socket", 'sharedProperties',
    function($scope, socket, sharedProperties){

        socket.on('init', function(data){
           console.log('init');
        });
        socket.on('send:message', function(message){

            $scope.messages.push(message.username + ": " + message.text);
            
        });

        $scope.messages = [];

        // username
       $scope.stringValue = sharedProperties.getString();

        $scope.sendMessage = function(){
            console.log('clicked send');
            socket.emit('send:message', {username: $scope.stringValue, text: $scope.message
            });
            // $scope.messages.push({
            //     text: $scope.message
            // });
	    console.log($scope.messages);

            // clear message box
            $scope.message = '';

        };

   
}]);