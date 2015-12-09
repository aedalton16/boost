var chats = angular.module('chats', ['welcome']);

// todo: tighten this up 
/*
*
* intentionally not writing to DB as of right now  
*/
chats.controller('ChatsController', ['$scope', "socket",
    function($scope, socket){

        socket.on('init', function(data){
           console.log('init');
        });
        socket.on('send:message', function(message){

            $scope.messages.push(message.text);
            
        });

        $scope.messages = [];

        $scope.sendMessage = function(){
            console.log('clicked send');
            socket.emit('send:message', {text: $scope.message
            });
            // $scope.messages.push({
            //     text: $scope.message
            // });
	    console.log($scope.messages);

            // clear message box
            $scope.message = '';

        };

   
}]);