'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

var sockets;

/**
 * init our controller, must be called explicitly
 */
exports.init = function(io){
    sockets = io.sockets;
    io.sockets.on('connection', listener);
};

/**
 * gets all of our drawings
 * @param req
 * @param res
 */
exports.all = function(req, res){
    User.find().exec(function(err, users){
        if(err){
            console.log("ERRORORERWER 500");
        } else {
            res.jsonp(users);
        }
    });
};

/*
 * creates a new drawing
 */
exports.create = function(req, res){

    var user = new User(req.body);
    User.save(function(err){
        if(err){
            console.log("Error "+err);
            res.send(500);
        } else {
            res.jsonp(drawing);
            sockets.emit("add-drawing", user);
        }
    });

};

/*
 * returns a specific drawing
 */
exports.findById = function(req, res){

    User.findOne({'_id': req.params.userId}, function(err, user){
        if(err){
            //res.render('error', {status:500});
            console.log('error', {status:500});
        } else {
            res.jsonp(user);
        }
    });

};

/*
 * deletes a drawing by id
 */


/*
* socket listener
*/
function listener(socket_io){

    socket_io.on('changing', function(message){
        sockets.emit('changing', message);
    });
    socket_io.on('text-changing', function(message){
        sockets.emit('text-changing', message);
    });
    socket_io.on('sendToBack', function(message){
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
        var o = new User(message);
        // TODO: simplify update
        User.remove({_id: o._id}, function(err){
            if(err) return console.error(err);
            o.save(function(err, object){
                if(err) return console.error(err);
            });
        });
    });


}