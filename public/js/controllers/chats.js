var chats = angular.module('chats', []);

// todo: tighten this up 
chats.controller('ChatsController', ['$scope', "socket",
    function($scope, socket){

        $scope.socket.on('init', function(data){
           console.log('init');
        });
        $scope.socket.on('send:message', function(message){
            console.log('heard send');
            $scope.messages.push(message);
        });

        $scope.messages = [];

        $scope.sendMessage = function(){
            console.log('clicked send');
            socket.emit('send:message', {message: $scope.message
            });
            $scope.messages.push({
                message: $scope.message
            });

            // clear message box
            $scope.message = '';

        };

   
}]);