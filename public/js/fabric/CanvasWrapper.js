var CanvasWrapper = function(id, context){

    this.canvas = new fabric.LabeledCanvas(id, context);
    this.socket = context.socket;
    this.mouseDown = false;
    this.activity = false; //
    this.currentColor = context.currentColor;
    this.strokeWidth = context.strokeWidth || '5';

    // how to handle listeners for multiple pages??? removing these potentially dangerous 
    this.socket.removeAllListeners();

    // drawing toolkit 
    this.tools = {
        LINE :      new LineTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        RECTANGLE : new RectangleTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        POLYGON : new PolygonTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        TRIANGLE :  new TriangleTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        CIRCLE :    new CircleTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        FREE :      new FreeDrawingTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        TEXT :      new TextTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        FILL :      new FillTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket}),
        DEFAULT :   new DefaultTool({'drawingId':this.canvas._id, 'fabricCanvas':this.canvas, 'socket':this.socket})
    };

    // always start with a freedraw 
    this.changeDrawingMode(context.drawingMode || this.tools.DEFAULT.drawingMode);

    // workaround b/c we lose our reference to 'this' with our listeners 
    var self = this;

    // init drawing mode 
    this.canvas.on("mouse:down", function(o){
        self.mouseDown = true;
        // so the polygon gets angry around here 
        if(self.canvas._hoveredTarget && self.handler.drawingMode !== 'default' && self.handler.drawingMode !== 'fill'){
            self.deactivatedTool = self.handler;
            self.handler = self.tools.DEFAULT;
            self.handler.init();
        }
        try { //TODO: fix Mr. polygons issue with var.x
            self.handler.onMouseDown(o, {'currentColor': self.currentColor, 'strokeWidth': self.strokeWidth});
        }
        catch(err){ // so we do crappy catch for now 
            console.log('polygon is throwing an error with the undefined x');
        }
    });

    // TODO: fix Mr. polygon's anger 
    // we out if we're done dragging 
    this.canvas.on("mouse:move", function(o){
        if(!self.mouseDown) return;
        try { 
        self.handler.onMouseMove(o);
        }
        catch(err){
            console.log('no mouse move');
        }
    });

    // completed path or addition of shape, action complete 
    this.canvas.on("mouse:up", function(o){
        console.log("MOUSE UP");
        try{
        self.handler.onMouseUp(o);
        }
        catch(err){
            console.log('mouseup undefined');
        }
        self.mouseDown = false;
        // this is actually covering up that we are not saving accurately when needed
        self.activity = true;
        // reactive drawing tool if we had disabled previously
        if(self.deactivatedTool){
            self.handler = self.deactivatedTool;
            self.deactivatedTool = null;
        }
    });

    this.canvas.on("mouse:over", function(e){

    });

// fix behavior 
    this.canvas.on("mouse:out", function(e){
    
    });

    this.canvas.on('object:modified', function(e){
        console.log('modified : saving canvas');
        self.socket.emit('saveDrawing', self.canvas);
    });

    this.canvas.on('object:selected', function(e){
        //console.log("selected");
    });

    this.canvas.on('object:moving', function(e){
        self.socket.emit('changing', e.target);
    });

    this.canvas.on('object:scaling', function(e){
        console.log("scaling");
        self.socket.emit('changing', e.target);
    });

     this.canvas.on('selection:cleared', function(e){
        console.log("cleared");
        // self.socket.emit('cleared', e.target); // TODO: come back here 
        self.socket.emit('saveDrawing', self.canvas);
        //self.checkAcitvity()
    });

    this.canvas.on('object:rotating', function(e){
        console.log("rotating");
        self.socket.emit('changing', e.target);
    });

    this.canvas.on("object:added", function(e){
        console.log('added');
    });

    this.canvas.on("object:removed", function(){
        console.log("removed");
    });

    // this.canvas.on("selection:cleared", function(e){
    //     console.log("selection cleared ");
    // });

    /**
     * listens for changing events, these are scaling, moving, color change, etc
     */
    this.socket.on('changing', function(o){
        var obj = self.canvas.findById(o._id);
        if(!obj) return;
        // this is pretty lame, i'm just transferring everything, surely a better way
        if(obj.type === "labeled-line"){
            obj.initialize([o.x1, o.y1, o.x2, o.y2], o);
        }else if(obj.type === "labeled-path"){
            obj.initialize(o.path, o);
        }else if(obj.type === "labeled-rect" || obj.type === "labeled-circle" || obj.type === "labeled-triangle" || obj.type ==="labeled-polygon"){
            obj.initialize(o);
        }else if(obj.type === "labeled-i-text"){
            // for some reason i can't just initialize text like the others - @hack
            obj.top = o.top;
            obj.left = o.left;
            obj.angle = o.angle;
            obj.flipX = o.flipX;
            obj.flipY = o.flipY;
            obj.scaleX = o.scaleX;
            obj.scaleY = o.scaleY;
            obj.height = o.height;
            obj.width = o.width;
        }
        obj.setCoords();
        self.checkActivity();
        self.canvas.renderAll();
    });

    this.socket.on('addObject', function(o){

      // TODO: filter
        if(o.drawingId !== self.canvas._id){
            console.log('got message from another drawing!! crap!! Need to fix this!!! Bailing out : '+o.drawingId + ' : '+self.canvas._id);
            return;
        }

        var type = fabric.util.string.camelize(fabric.util.string.capitalize(o.type));
        var newO = fabric[type].fromObject(o);
        self.canvas.add(newO);
        self.checkActivity();

    });

    /**
     * handles layer changing events - probably a more clever way to use a single method for all of these
     */
    this.socket.on('sendToBack', function(o){
        var obj = self.canvas.findById(o._id);
        if(!obj) return;
        // we must set to active every time, seems odd but only way to make it "real time" react
        self.canvas.setActiveObject(obj);
        obj.sendToBack();
        self.checkActivity();
    });

    /**
     * handles layer changing events - probably a more clever way to use a single method for all of these
     */
    this.socket.on('sendBackwards', function(o){
        var obj = self.canvas.findById(o._id);
        if(!obj) return;
        // we must set to active every time, seems odd but only way to make it "real time" react
        self.canvas.setActiveObject(obj);
        obj.sendBackwards();
        self.checkActivity();
    });

    /**
     * handles layer changing events - probably a more clever way to use a single method for all of these
     */
    this.socket.on('bringForward', function(o){
        var obj = self.canvas.findById(o._id);
        if(!obj) return;
        // we must set to active every time, seems odd but only way to make it "real time" react
        self.canvas.setActiveObject(obj);
        obj.bringForward();
        self.checkActivity();
    });

    /**
     * handles layer changing events - probably a more clever way to use a single method for all of these
     */
    this.socket.on('bringToFront', function(o){
        var obj = self.canvas.findById(o._id);
        if(!obj) return;
        // we must set to active every time, seems odd but only way to make it "real time" react
        self.canvas.setActiveObject(obj);
        obj.bringToFront();
        self.checkActivity();
    });

    /**
     * handles removing object from the drawing
     */
    this.socket.on('removeObject', function(o){
        var obj = self.canvas.findById(o._id);
        if(!obj) return;
        // remove the object we got
        self.canvas.remove(obj);
        self.checkActivity();
    });

};

// return to non drawing & set path 
CanvasWrapper.prototype.changeDrawingMode = function(mode){
    this.handler = this.tools[mode.toUpperCase()];
    this.handler.init();
};

// helper 
CanvasWrapper.prototype.resetDrawingMode = function(){
    this.changeDrawingMode('default');
};

// change fill of active object
CanvasWrapper.prototype.updateCurrentColor = function(currentColor) {
    this.currentColor = currentColor;
    if(this.canvas.getActiveObject()){
        this.canvas.getActiveObject().stroke = currentColor;
        this.canvas.getActiveObject().setCoords();
        this.socket.emit('changing', this.canvas.getActiveObject());
        this.activity = true;
    }
}

// TODO: parse out 
CanvasWrapper.prototype.clearCurrentCanvas = function(e) {
    this.canvas.clear(); 
}

CanvasWrapper.prototype.updateCurrentPoints = function(currentPoints) {
    this.currentPoints = currentPoints;
    if(this.canvas.getActiveObject()){
        this.canvas.getActiveObject().points = currentPoints;
        this.canvas.getActiveObject().setCoords();
        this.socket.emit('changing', this.canvas.getActiveObject());
        this.activity = true;
    }
}

//accepts teh layer move cmd 
CanvasWrapper.prototype.updateLayerPosition = function(action) {
    if(this.canvas.getActiveObject()){
        this.socket.emit(action, this.canvas.getActiveObject());
        this.activity = true;
    }
};
// resize canvas
CanvasWrapper.prototype.updateCanvasSize = function(viewPort) {
    this.canvas.setWidth(viewPort.width * .95);
    this.canvas.setHeight(viewPort.height * .65);
};

/**
 * wrapper forloadFromJSON method in the fJS canvas OKAY SO HERE 
 */
CanvasWrapper.prototype.loadFromJSON = function(data){
    this.canvas.loadFromJSON(data);
};

/**
 * dump the canvas of all objects and listeners.
 */
CanvasWrapper.prototype.dispose = function(){
    this.canvas.dispose();
};

CanvasWrapper.prototype.discardActiveObject = function(){
    this.canvas.discardActiveObject();
};


// TODO: inspect 
CanvasWrapper.prototype.checkActivity = function(){
    if(this.activity){
        console.log("saving");
        this.socket.emit('saveDrawing', this.canvas);
        this.activity = false;
    }
}