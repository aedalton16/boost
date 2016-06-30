'use strict';
// was it the seperate controller instances/ probably not can do both though to make smaller? 
var mongoose = require('mongoose');
var Drawing = mongoose.model('Drawing');
var DrawingObject = mongoose.model('DrawingObject');

var sockets;
// var drawingController = require('../controllers/drawingController');
/*
 * initializes controller, must be called explicitly
 */
exports.init = function(io){ // this right here...........dup?..
    sockets = io.sockets;
    io.sockets.on('connection', listener);
};

/*
 * gets all of our drawings
 */
exports.all = function(req, res){
    Drawing.find().exec(function(err, drawings){
        if(err){
            console.log("ERRORORERWER 500");
        } else {
            res.jsonp(drawings);
        }
    });
};

/*
 * creates a new drawing
 */
exports.create = function(req, res){

    var drawing = new Drawing(req.body);
    drawing.save(function(err){
        if(err){
            console.log("Error "+err);
            res.send(500);
        } else {
            res.jsonp(drawing);
            sockets.emit("add-drawing", drawing);
        }
    });
};

/*
 * returns a drawing by id
 */
exports.findById = function(req, res){

    Drawing.findOne({'_id': req.params.drawingId}, function(err, drawing){
        if(err){
            //res.render('error', {status:500});
            console.log('error', {status:500});
        } else {
            res.jsonp(drawing);
        }
    });

};

/*
 * deletes a specific drawing by id
 */
exports.deleteById = function(req, res){

    Drawing.remove({_id: req.params.drawingId}, function(err, result){
        if(err) return console.error(err);
        console.log('got result '+ result);
        sockets.emit("remove-drawing", req.params.drawingId);
        res.jsonp(result);
    });

};


/*
 * socket listener
 */
function listener(socket_io){ // these fire, a lot.... 

    socket_io.on('changing', function(message){
        console.log('drawingController fired changing');
        sockets.emit('changing', message);
    });
    socket_io.on('text-changing', function(message){
        console.log('drawingController fired text-changing');
        sockets.emit('text-changing', message);
    });

    // when the client emits 'send:message', we hear it, then broadcast the message to others 
     socket_io.on('send:message', function (data) { // and dis is just zee one? 
    // we tell the client to execute 'new message'
     console.log('new message :' + data);
        sockets.emit('send:message', data); // i tink dis is all of dem? 

  });

    socket_io.on('sendToBack', function(message){
        console.log('drawingController fired sendToBack');
        sockets.emit('sendToBack', message);
    });
    socket_io.on('sendBackwards', function(message){
        sockets.emit('sendBackwards', message);
    });
    socket_io.on('bringForward', function(message){
        sockets.emit('bringForward', message);
    });
    socket_io.on('bringToFront', function(message){
        sockets.emit('bringToFront', message);
    });
    socket_io.on('removeObject', function(message){
        sockets.emit('removeObject', message);
    });

    socket_io.on('saveDrawing', function (message) {
        var o = new Drawing(message);
        // TODO: simplify update
        Drawing.remove({_id: o._id}, function(err){
            if(err) return console.error(err);
            o.save(function(err, object){
                if(err) return console.error(err);
            });
        });
    });

    socket_io.on('addObject', function (message) {
        var o = new DrawingObject(message);
        o.save(function(err, object){
            if(err) return console.error(err);
            sockets.emit("addObject", object );
        });
    });

}