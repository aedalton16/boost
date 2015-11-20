document.addEventListener("DOMContentLoaded", function() {
	var mouse = { 
	    click: false,
	    move: false,
	    pos: {x:0, y:0},
	    pos_prev: false
	};
	var settings = {
		strokeWidth: 2, 
		backgroundColor: "#fff",
		clr : [0,0,225,0.5],
		lineW : 1, 
		undoBtn: "#undo",
		redoBtn: "#redo",

		downloadCanvasLink: "",
	};
	// get canvas element and create context
	var canvas  = document.getElementById('drawing');
	var context = canvas.getContext('2d');
	var width   = window.innerWidth;
	var height  = window.innerHeight;
	var socket  = io.connect();
	// var room = window.location.pathname.split("/")[2];

	// set canvas to full browser width/height
	canvas.width = width; 
	canvas.height = height;

	var history = []; 
	var undoHistory = [];
	var currentLine = []; 
	var recording = false; 
	if(settings.backgroundColor) {
			context.fillStyle = settings.backgroundColor;
			context.fillRect(0,0,canvas.width,canvas.height);
		}

	canvas.drawLine = function(data){
		// { line: [ mouse.pos, mouse.pos_prev ] }
		var line = data.line; // use data 
		// var context = canvas.getContext('2d');
		context.beginPath();
		context.lineCap = "round";
		context.moveTo(line[0].x, line[0].y); //here
		context.lineTo(line[1].x, line[1].y);
		
		// console.log(settings.clr[0]);
		// var trial = "#"+(settings.clr[0]).toString(16)+(settings.clr[1]).toString(16)+(settings.clr[2]).toString(16);
		context.strokeStyle = settings.clr;
		// console.log(trial);
		context.lineWidth = settings.lineW; 

		context.stroke();

	};
	// register mouse event handlers
	canvas.onmousedown = function(e){ 
		mouse.click = true; 
		currentLine = []; 
		undoHistory = []; 
		recording = true; // necessary? 
		// $("#undo").removeClass("disabled");

	};
	canvas.onmouseup = function(e){ 
		mouse.click = false; 
		recording = false; 
		if(currentLine != null && currentLine.length > 0) {
				history.push(currentLine);
				$("#undo").removeClass("disabled");
				currentLine = [];
			}

	};
//"#"+(155).toString(16)+(102).toString(16)+(102).toString(16);
	canvas.onmousemove = function(e) { // place socket.emit here 
		var BB=canvas.getBoundingClientRect();

     // calc mouse position based on the bounding box
     	mouse.pos.x = e.clientX - BB.left; //canvas.offsetLeft; //parseInt(e.clientX-BB.left); //window.pageXOffset + e.clientX - canvas.offsetLeft; 
     	mouse.pos.y = e.clientY- BB.top; //canvas.offsetTop; //parseInt(e.clientY-BB.top);//window.pageYOffset + e.clientY - canvas.offsetTop; //

     	// console.log(mouse.pos.x+"/"+mouse.pos.y);

	    // console.log("mouse.down");
	    mouse.move = true;

	};

	$(settings.undoBtn).click(function(){
		console.log('undo.clicked');

		if (history.length > 0){
			undoHistory.push(history.pop());
			context.clearRect(0, 0, canvas.width, canvas.height);
			for (var i in history){
				for (var j in history[i]){
						canvas.drawLine(history[i][j], settings.Clr);
					}	
			}		
		}
		console.log(history);
		$(settings.redoBtn).removeClass("disabled");
		if(history.length == 0) {
			$(settings.undoBtn).addClass("disabled");
		}
		return false;

	});

	$(settings.redoBtn).click(function(){
		console.log('redo.clicked');
		if (undoHistory.length > 0 ){
			var redoLine = undoHistory.pop(); 
			for (var i in redoLine){
				canvas.drawLine(redoLine[i]);
			}
			history.push(redoLine);
			if (undoHistory.length == 0){
				$(settings.redoBtn).addClass("disabled");
			}
		}
		return false; 
	});
	// Safari Color Button Events
	$("#greyBtn").click(function(){
		console.log('black.clicked');
		settings.clr = "000000"; 
	});
	$("#blueBtn").click(function(){
		console.log('blue.clicked');
		settings.clr = "#0000ff"; 
	});
	$("#greenBtn").click(function(){
		console.log('green.clicked');
		settings.clr = "#006600"; 
	});

	$("#tealBtn").click(function(){
		console.log('teal.clicked');
		settings.clr = "#ff0000"; 
	});

	$("#orangeBtn").click(function(){
		console.log('orange.clicked');
		settings.clr = "#ff6600"; 
	})
	;
	$("#redBtn").click(function(){
		console.log('red.clicked');
		settings.clr = "#ff0000"; 
	});
	$('#favcolor').on('input', function() { 
		settings.clr = document.getElementById('favcolor').value; 
	 } ); 

	$("#incBtn").click(function(){
		// var context = canvas.getContext('2d');
		console.log('plus.clicked');
		if (settings.lineW < 50)
			settings.lineW += 3;
		else 
			settings.lineW = 1;  
	});
	$("#decBtn").click(function(){
		// var context = canvas.getContext('2d');
		console.log('plus.clicked');
		if (1 < settings.lineW < 50)
			settings.lineW -= 3;
		else 
			settings.lineW = 1;  
	});
	$("#eraseBtn").click(function(){
		// var context = canvas.getContext('2d');
		console.log('erase.clicked');
		settings.clr = settings.backgroundColor;
	});

	// Download Button 
	$("#dlBtn").click(function(){

		var dataURL = canvas.toDataURL('image/png');
    	this.setAttribute('download', 'BoostSession.png'); 
    	this.setAttribute('href', dataURL.replace("image/png")); //, "image/octet-stream")); //.href = dataURL;
	});
	function getColor(){
		return settings.clr; 

	}getColor(); 

	// draw line received from server
	socket.on('draw_line', function (data) {

		canvas.drawLine(data);
		// console.log(data.apple.toString() + " data listen");
		if (recording){
			currentLine.push(data);
		}

	});
	// socket.on('connect', function() {
 //    	socket.emit('join', {room: room});
	// });

   
	// main loop, runs every 25ms
	function mainLoop() {
	    // check if the user is drawing
	    if (mouse.click && mouse.move && mouse.pos_prev) {
		// send line to to the server

		var data = {
			line: [mouse.pos, mouse.pos_prev]
		};
		socket.emit('draw_line', data);
		console.log(data);
		mouse.move = false;
	    }
	    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
	    setTimeout(mainLoop, 25);
	}
	mainLoop();
    });