
var sockets;
 
exports.init = function(io){
    sockets = io.sockets;
    io.sockets.on('connection', listener);
};




function listener(socket_io){
  // when the client emits 'new message', this listens and executes
  socket_io.on('send:message', function (data) { // and dis is just zee one? 
    // we tell the client to execute 'new message'
     console.log('new message :' + data);
        sockets.emit('send:message', data); // i tink dis is all of dem? 

  });

  socket.io_on('change:name', function(data){
  	changeName(data.oldName, data.newName);
  });
  socket.on('user:join', function(data))

}