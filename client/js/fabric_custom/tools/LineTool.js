var fabric = require('fabric').fabric;
var LabeledLine = require('../elements/LabeledLine');
var LineTool = function(context){

  this.drawingMode = 'line';

  this.drawingId = context.drawingId;
  this.fabricCanvas = context.fabricCanvas;
  this.socket = context.socket;
  this.fabricCanvas.isDrawingMode = false;

  this.fabricCanvas.on("object:added", function(o){
    if(o.target.type !== 'labeled-line') return;
    this.setActiveObject(o.target);
  });
}

LineTool.prototype.init = function(){
  this.fabricCanvas.isDrawingMode = false;
};

LineTool.prototype.onMouseDown = function(options, context){

  this.currentColor = context.currentColor;
  this.strokeWidth = context.strokeWidth || 6;

  var pointer = this.fabricCanvas.getPointer(options.e);
  var points = [ pointer.x, pointer.y, pointer.x, pointer.y ];

  this.placeHolder = new fabric.Line(points, {
    strokeWidth: this.strokeWidth,
    strokeDashArray: [5, 3],
    stroke: this.currentColor,
    fill: '',
    originX: 'center',
    originY: 'center'
  });
  this.fabricCanvas.add(this.placeHolder);
};

LineTool.prototype.onMouseMove = function(options){
  var pointer = this.fabricCanvas.getPointer(options.e);
  this.placeHolder.set({ x2: pointer.x, y2: pointer.y });
  this.fabricCanvas.renderAll();
}

// done drawing 
LineTool.prototype.onMouseUp = function(options){
  this.render();
  this.fabricCanvas.remove(this.placeHolder);
}

LineTool.prototype.render = function(){
  var newLine = new LabeledLine([this.placeHolder.x1, this.placeHolder.y1, this.placeHolder.x2, this.placeHolder.y2], {
    drawingId: this.drawingId,
    strokeWidth: this.strokeWidth,
    fill: '',
    stroke: this.currentColor,
    originX: 'center',
    originY: 'center'
  });
  this.socket.emit('addObject', newLine);
}

module.exports = LineTool;
