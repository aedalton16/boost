
var sockets;
 
exports.init = function(io){
    sockets = io.sockets;
    io.sockets.on('connection', listener);
};




function listener(socket_io){
  // when the client emits 'new message', this listens and executes
  socket_io.on('newMessage', function (data) { // and dis is just zee one? 
    // we tell the client to execute 'new message'
     console.log('new message hotdog');
    sockets.emit('newMessage', data); // i tink dis is all of dem? 

  });
}