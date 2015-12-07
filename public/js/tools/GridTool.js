var GridTool = function(context){

    this.drawingMode = 'grid';

    this.drawingId = context.drawingId;
    this.currentColor = context.currentColor;
    this.fabricCanvas = context.fabricCanvas;
    this.socket = context.socket;
}
// Toggle for lined paper? 
GridTool.prototype.init = function(){
    this.fabricCanvas.isDrawingMode = false;
    var gridsize = 5;
    var canvas = this.fabricCanvas; 
	for(var x=1;x<(canvas.width/gridsize);x++)
	{
		// callback? 
		// render all? 
		canvas.add(new fabric.Line([0, 100*x, canvas.width, 100*x],{ stroke: "#000000", strokeWidth: 1, selectable:false, strokeDashArray: [5, 5]}));
		canvas.add(new fabric.Line([100*x, 0, 100*x, canvas.width],{ stroke: "#000000", strokeWidth: 1, selectable:false, strokeDashArray: [5, 5]}));
		
	}
};

GridTool.prototype.onMouseDown = function(o, context){
};

GridTool.prototype.onMouseMove = function(o){
}

GridTool.prototype.onMouseUp = function(o){
}
