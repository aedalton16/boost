var DefaultTool = function(context){

  this.drawingMode = 'default';

  this.drawingId = context.drawingId;
  this.currentColor = context.currentColor;
  this.fabricCanvas = context.fabricCanvas;
  this.socket = context.socket;
}

DefaultTool.prototype.init = function(){
  this.fabricCanvas.isDrawingMode = false;
};

DefaultTool.prototype.onMouseDown = function(o, context){
};

DefaultTool.prototype.onMouseMove = function(o){
}

DefaultTool.prototype.onMouseUp = function(o){
}

module.exports = DefaultTool;

