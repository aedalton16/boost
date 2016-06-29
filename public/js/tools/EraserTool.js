/*
* TODO: activate
*/

var EraserTool = function (context){

    this.drawingMode = 'erase';

    this.drawingId = context.drawingId;
    this.fabricCanvas = context.fabricCanvas;
    this.socket = context.socket;

    var self = this; // we lose 'this' reference 

};

EraserTool.prototype.init = function(){
    this.fabricCanvas.isDrawingMode = false;
};
EraserTool.prototype.onMouseDown = function(o, context){
    this.currentColor = context.currentColor; 
   
};

EraserTool.prototype.onMouseMove = function(o){

};

EraserTool.prototype.onMouseUp = function(o){
    console.log('hello');
    if (!this.fabricCanvas.getActiveObject()) return; 
    
    this.socket.emit('removeObject', this.fabricCanvas.getActiveObject());
    this.fabricCanvas.renderAll(); 
};

EraserTool.prototype.onPathCreated = function(o){

};
