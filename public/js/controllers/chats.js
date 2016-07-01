var chats = angular.module('chats', ['welcome', 'users']);

// todo: tighten this up 
/*
*
* intentionally not writing to DB as of right now  
*/
chats.controller('ChatsController', ['$scope', "socket", 'sharedProperties',
    function($scope, socket, sharedProperties){
        $scope.user = 'aa';
        socket.on('init', function(data){
           console.log('init');
        });

        socket.on('send:message', function(message){

            $scope.messages.push(message.username + ": " + message.text);
            
        });

        socket.on('user:login', function(message){
            $scope.user = message.currentUser || 'demo'; 
            
        });

        $scope.messages = [];

        // username
       // $scope.stringValue = sharedProperties.getString();

        $scope.sendMessage = function(){
            console.log('clicked send');
             
            socket.emit('send:message', {'username': $scope.user, 'text': $scope.message
            });
            // $scope.messages.push({
            //     text: $scope.message
            // });
            console.log($scope.messages);

            // clear message box
            $scope.message = '';

        };

   
}]);