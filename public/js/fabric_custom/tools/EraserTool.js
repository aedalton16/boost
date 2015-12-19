/*
 * TODO: activate
 */

var LabeledPath = require('../elements/LabeledPath');
var EraserTool = function (context){

  this.drawingMode = 'erase';

  this.drawingId = context.drawingId;
  this.fabricCanvas = context.fabricCanvas;
  this.socket = context.socket;

  var self = this; // we lose 'this' reference 

  this.fabricCanvas.on("path:created", function(e){
    console.log("path created");
    self.activity= true;
    self.onPathCreated(e);
  });

  //text gets super cranky 
  // set the added object to active 
  this.fabricCanvas.on("object:added", function(o){
    if(o.target.type !== 'labeled-path') return;
    this.setActiveObject(o.target);
  });

};

EraserTool.prototype.init = function(){
  this.fabricCanvas.isDrawingMode = true;
};
EraserTool.prototype.onMouseDown = function(o, context){

  this.currentColor = context.backgroundColor;
  this.strokeWidth = context.strokeWidth || 6;
};

EraserTool.prototype.onMouseMove = function(o){
};

EraserTool.prototype.onMouseUp = function(o){
};

EraserTool.prototype.onPathCreated = function(o){

  var newPath = new LabeledPath(o.path.path);
  newPath.set(o.path);
  newPath.set({type: 'labeled-path'});
  newPath.set({drawingId: this.drawingId});
  newPath.set({stroke:this.fabricCanvas.backgroundColor});
  newPath.set({strokeWidth:this.strokeWidth});
  this.fabricCanvas.remove(o.path);
  this.socket.emit('addObject', newPath.toObject(['drawingId']));

};

module.exports = EraserTool;
