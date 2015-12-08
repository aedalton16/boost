var ChatWrapper = function(id, context){
	var self = this;

	this.socket = context.socket;

	this.socket.removeAllListeners();
	
	this.socket.on('newMessage', function(o){
		console.log('fired away');
	});
	this.socket.on('newMessage', function(data){
	    context.messages.append($('<li>').text(data));
	});


// this.socket.removeAllListeners();
}; 

ChatWrapper.prototype.newMessage = function(o) {
	console.log('newChatWrapMessage : ' + o); //hopefully that didnt write to the DB
	
	this.socket.emit('newMessage', o);

}

//handling multiple sockets 