var fabric = require('fabric').fabric;
var LabeledRect  = require('../elements/LabeledRect');
var RectangleTool = function (context){

  this.drawingMode = 'rectangle';

  this.drawingId = context.drawingId;
  this.fabricCanvas = context.fabricCanvas;
  this.socket = context.socket;

  this.fabricCanvas.on("object:added", function(o){
    if(o.target.type !== 'labeled-rect') return;
    this.setActiveObject(o.target);
  });
};

RectangleTool.prototype.init = function(){
  this.fabricCanvas.isDrawingMode = false;
};

RectangleTool.prototype.onMouseDown = function(options, context){

  //get the current tool settings 
  this.currentColor = context.currentColor;
  this.stroke = context.currentColor;
  this.strokeWidth = context.strokeWidth || 1;

  var pointer = this.fabricCanvas.getPointer(options.e);
  this.placeHolder = new fabric.Rect({
    strokeWidth: this.strokeWidth,
    stroke: this.currentColor,
    fill: '',
    top: pointer.y,
    left: pointer.x,
    originY: 'top',
    originX: 'left'
  });
  this.fabricCanvas.add(this.placeHolder);
};

// ive seen clever ways to bind 
RectangleTool.prototype.onMouseMove = function(options){
  var pointer = this.fabricCanvas.getPointer(options.e);

  var width = pointer.x - this.placeHolder.left;
  var height = pointer.y - this.placeHolder.top;

  this.placeHolder.width = width;
  this.placeHolder.height = height;
  this.fabricCanvas.renderAll();
};


RectangleTool.prototype.onMouseUp = function(options){
  this.render();
  this.fabricCanvas.remove(this.placeHolder);
};


RectangleTool.prototype.render = function(){
  var rect = new LabeledRect({
    drawingId: this.drawingId,
    left: this.placeHolder.left,
    top: this.placeHolder.top,
    originX: 'left',
    originY: 'top',
    width: this.placeHolder.width,
    height: this.placeHolder.height,
    fill: '',
    stroke: this.currentColor,
    strokeWidth: this.strokeWidth
  });
  this.socket.emit('addObject', rect);
};

module.exports = RectangleTool;
