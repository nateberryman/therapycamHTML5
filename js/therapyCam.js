//////////////////////////////////////////////////////////////////
//                                                              //
// HTML5 Therapy Camera - Nathan Berryman 2013                  //
//                                                              //
//////////////////////////////////////////////////////////////////

//This is a helper to get the prefix from certain browsers to make a unified variable
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

//This is the main therapyCam object. Methods are called with the . operator
//(i.e. therapyCam.sizeToScreen(); will call the sizeToScreen method.)

var therapyCam = {
	supported:false,
	drawRefreshRate:24,
	windowWidth:0,
	windowHeight:0,
	canvasWidth:0,
	canvasHeight:0,
	init:function(){
		log("init() called.");
		this.sizeToScreen();
		this.startCamera();
	},
	sizeToScreen:function(){
		log("sizeToScreen() called.");
		var canvas = $('#therapyCamCanvas').get(0);
		var canvasOverlay = $('#therapyCamCanvasOverlay').get(0);
		var video = $('#therapyCamVideo').get(0);
		therapyCam.windowWidth = window.innerWidth;
		therapyCam.windowHeight = window.innerHeight;  
		therapyCam.canvasWidth = window.innerWidth;
		therapyCam.canvasHeight = window.innerHeight;
		canvas.width = therapyCam.windowWidth;
		canvas.height = therapyCam.windowHeight;
		canvasOverlay.width = therapyCam.windowWidth;
		canvasOverlay.height = therapyCam.windowHeight;
		therapyCam.flipImage();
	},
	getCanvasWidth:function(canvas){
		var width = $(canvas).width();
		return width;
	}, 
	getCanvasHeight:function(canvas){
		var height = $(canvas).height();
		return height;
	},
	startCamera:function(){
		if (navigator.getUserMedia) {
    		// Call the getUserMedia method here
    		log("Device supports getUserMedia");
    		navigator.getUserMedia({video: true}, therapyCam.getCamSuccess, therapyCam.getCamFailure);
		} else {
    		// Display a friendly "sorry" message to the user.
    		log('Native device media streaming (getUserMedia) not supported in this browser. Please upgrade your browser and try again.');
		}
	},
	getCamSuccess:function(stream){
		log("Success. Got a webcam.");
		var video = $('#therapyCamVideo').get(0);       
		if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
        } else {
            video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        }
        therapyCam.sizeToScreen();

        //play the video and then call the function that writes the video to the canvas    	
        video.play();
       	therapyCam.drawCamToCanvas();   	
	},
	getCamFailure:function(e){
		this.throwError("Failure. Couldn't get a webcam: " + e);
	}, 
	throwError:function(message){
		log("ERROR:"+message);
	}, 
	flipImage:function(){
		log("flipImage() called");
		var canvas = $('#therapyCamCanvas').get(0);
    	var context = canvas.getContext('2d');
    	context.translate(therapyCam.windowWidth, 0);
		context.scale(-1, 1);
	}, 
	drawCamToCanvas:function(){
		var video = $('#therapyCamVideo').get(0);
		var canvas = $('#therapyCamCanvas').get(0);
    	var context = canvas.getContext('2d');

    	setInterval(function () { 
    		try{
    			context.drawImage(video, 0, 0,therapyCam.windowWidth,therapyCam.windowHeight);
    			therapyCam.drawSomethingToOverCanvas();
    		}
    		catch(err){
    			//put error catching here for loop if need be
    		}
		}, 1000/therapyCam.drawRefreshRate);
		
	},
	drawSomethingToOverCanvas:function(){
		var c=document.getElementById("therapyCamCanvasOverlay");
		var ctx=c.getContext("2d");
		ctx.fillStyle="#ff6633";
		ctx.fillRect((therapyCam.canvasWidth/2)-75,(therapyCam.canvasHeight/2)-75,150,150);
	}
};
//End of therapyCam object

//Window.log replacement - written by Paul Irish
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};


//Call the init function on the therapyCam object when the page is loaded.
$(document).ready(function() {
	therapyCam.init();
});

//Call the therapyCam.sizeToScreen() function when the window is resized.
$(window).resize(function() {
	therapyCam.sizeToScreen();
});