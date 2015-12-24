var fabric = require('fabric').fabric;
var LabeledTriangle = require('../elements/LabeledTriangle');
var TriangleTool = function (context){

    this.drawingMode = 'rectangle';

    this.drawingId = context.drawingId;
    this.fabricCanvas = context.fabricCanvas;
    this.socket = context.socket;

    this.fabricCanvas.on("object:added", function(o){
        if(o.target.type !== 'labeled-triangle') return;
        this.setActiveObject(o.target);
    });
};

TriangleTool.prototype.init = function(){
    this.fabricCanvas.isDrawingMode = false;
};

// inits drawing of Mr. Triangle 
TriangleTool.prototype.onMouseDown = function(options, context){
    
    this.currentColor = context.currentColor;
    this.strokeWidth = context.strokeWidth || 1;
    
    var pointer = this.fabricCanvas.getPointer(options.e);
    this.placeHolder = new fabric.Triangle({
        strokeWidth: this.strokeWidth,
        stroke: this.currentColor,
        fill: '',
        top: pointer.y,
        left: pointer.x,
        height: 1,
        width: 1,
        originY: 'top',
        originX: 'left'
    });
    this.fabricCanvas.add(this.placeHolder);
};

TriangleTool.prototype.onMouseMove = function(options){
    var pointer = this.fabricCanvas.getPointer(options.e);

    var width = pointer.x - this.placeHolder.left;
    var height = pointer.y - this.placeHolder.top;

    this.placeHolder.width = width;
    this.placeHolder.height = height;
    this.fabricCanvas.renderAll();
};

// this could be better...theres gotta be a way to remove the need for an intermediate shape 
TriangleTool.prototype.onMouseUp = function(options){
    this.render();
    this.fabricCanvas.remove(this.placeHolder);
};

TriangleTool.prototype.render = function(){
    var rect = new LabeledTriangle({
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

module.exports = TriangleTool;
