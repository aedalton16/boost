/*
* text is pretty buggy.....super slow, intermittent response 
* TODO: ^ 
*/
var TextTool = function(context){

    this.drawingMode = 'text';

    this.drawingId = context.drawingId;
    this.fabricCanvas = context.fabricCanvas;
    this.socket = context.socket;

    var self = this;

    this.fabricCanvas.on('text:changed', function(o){
        console.log(o.target.text);
        self.socket.emit('text-changing', o.target);
        self.socket.emit('saveDrawing', self.fabricCanvas);
    });

    this.socket.on('text-changing', function(o){
        if(o.type !== "labeled-i-text") return;
        var obj = self.fabricCanvas.findById(o._id);
        // we must set to active every time, seems odd but only way to make it "real time" react
        self.fabricCanvas.setActiveObject(obj);
        if(obj.text !== o.text){
            console.log(obj.text + " in the socket");
            obj.text = o.text;
            self.fabricCanvas.renderAll();
        }
        self.fabricCanvas.setActiveObject(obj);
        obj.enterEditing();
    });

    this.fabricCanvas.on("object:added", function(o){
        if(o.target.type !== 'labeled-i-text') return;
        this.setActiveObject(o.target);
        o.target.enterEditing();
    });

};

TextTool.prototype.init = function(){
    this.fabricCanvas.isDrawingMode = false;
};

TextTool.prototype.onMouseDown = function(options, context){

    this.currentColor = context.currentColor;
    this.strokeWidth = context.strokeWidth || 6;

    var self = this;

    var pointer = this.fabricCanvas.getPointer(options.e);

    this.placeHolder = new fabric.LabeledIText('', {
        drawingId: this.drawingId,
        left: pointer.x,
        top: pointer.y,
        padding: 7
    });
};


TextTool.prototype.onMouseMove = function(options){
}


TextTool.prototype.onMouseUp = function(options){
    this.socket.emit('addObject', this.placeHolder);
}