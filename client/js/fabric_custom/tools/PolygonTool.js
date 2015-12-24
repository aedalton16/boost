// okay a lot of what we have done so far does not like Mr. Polygon 
// google docs have indicated known fabricJs issues with bounding box  
var fabric = require('fabric').fabric;
var LabeledPolygon = require('../elements/LabeledPolygon');
var PolygonTool = function (context){

  this.drawingMode = 'polygon';

  this.drawingId = context.drawingId;
  this.fabricCanvas = context.fabricCanvas;
  this.socket = context.socket;

  // Mr. Text gets cranky so we have to have an individualized listener for each shape, otherwise this would 
  // be shared 
  this.fabricCanvas.on("object:added", function(o){
    if(o.target.type !== 'labeled-rect') return;
    this.setActiveObject(o.target);
  });
};

PolygonTool.prototype.init = function(){
  this.fabricCanvas.isDrawingMode = false;
};

// thanks stackoverflow for this method 
PolygonTool.prototype.calcPoints = function(sides, radius){
  var sweep=Math.PI*2/sides;
  var cx=radius;
  var cy=radius;
  var points=[];
  for(var i=0;i<sides;i++){
    var x=cx+radius*Math.cos(i*sweep);
    var y=cy+radius*Math.sin(i*sweep);
    points.push({x:x,y:y});
  }
  return(points);
};

// init draw 
PolygonTool.prototype.onMouseDown = function(options, context){

  this.currentColor = context.currentColor;
  this.stroke = context.currentColor;
  this.points = context.currentPoints;
  this.strokeWidth = context.strokeWidth || 1;
  var points = this.calcPoints(6, 20);

  var pointer = this.fabricCanvas.getPointer(options.e);
  this.placeHolder = new fabric.Polygon(points, {
    strokeWidth: this.strokeWidth,
    strokeDashArray: [5, 3],
    stroke: this.currentColor,
    fill: '',
    top: pointer.y,
    left: pointer.x,
    originY: 'top',
    originX: 'left'
  });
  this.fabricCanvas.add(this.placeHolder);
  this.render();
  this.fabricCanvas.remove(this.placeHolder);
};


// these guys are being annoying so im leaving them out for now 
PolygonTool.prototype.onMouseMove = function(options){
};


PolygonTool.prototype.onMouseUp = function(options){
  this.socket.emit('addObject', this.placeHolder);
};


// send this bad boy out to our other canvases 
PolygonTool.prototype.render = function(){
  var Polygon = new LabeledPolygon({
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
  this.socket.emit('addObject', Polygon);
};

module.exports = PolygonTool;
