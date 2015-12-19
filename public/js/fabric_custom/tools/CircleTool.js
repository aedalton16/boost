var fabric = require('fabric').fabric;
var LabeledCircle = require('../elements/LabeledCircle');

var CircleTool = function (context){

  this.drawingMode = 'circle';

  this.drawingId = context.drawingId;
  this.fabricCanvas = context.fabricCanvas;
  this.socket = context.socket;

  this.fabricCanvas.on("object:added", function(o){
    if(o.target.type !== 'labeled-circle') return;
    this.setActiveObject(o.target);
  });

};

CircleTool.prototype.init = function(){
  this.fabricCanvas.isDrawingMode = false;
};


CircleTool.prototype.onMouseDown = function(options, context){

  this.currentColor = context.currentColor;
  this.strokeWidth = context.strokeWidth || 1;

  var pointer = this.fabricCanvas.getPointer(options.e);
  this.placeHolder = new fabric.Circle({
    strokeWidth: this.strokeWidth,
    stroke: this.currentColor,
    fill: '',
    radius: 1,
    top: pointer.y,
    left: pointer.x,
    originY: 'center',
    originX: 'center'
  });
  this.fabricCanvas.add(this.placeHolder);
};

CircleTool.prototype.onMouseMove = function(options){
  var pointer = this.fabricCanvas.getPointer(options.e);
  var w = this.placeHolder.left-pointer.x;
  var h = this.placeHolder.top-pointer.y;
  this.placeHolder.radius = Math.sqrt(w*w + h*h);
  this.fabricCanvas.renderAll();
};

CircleTool.prototype.onMouseUp = function(options){
  this.render();
  this.fabricCanvas.remove(this.placeHolder);
};

CircleTool.prototype.render = function(){
  var circle = new LabeledCircle({
    drawingId: this.drawingId,
    left: this.placeHolder.left,
    top: this.placeHolder.top,
    originX: 'center',
    originY: 'center',
    radius: this.placeHolder.radius,
    fill: '',
    stroke: this.currentColor,
    strokeWidth: this.strokeWidth
  });
  this.socket.emit('addObject', circle);
};

module.exports = CircleTool;

