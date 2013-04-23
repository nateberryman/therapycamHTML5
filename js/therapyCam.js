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
	windowWidth:0,
	windowHeight:0,
	canvasWidth:100,
	canvasHeight:100,
	init:function(){
		log("init() called.");
		this.sizeToScreen();
		this.startCamera();
	},
	sizeToScreen:function(){
		log("sizeToScreen() called.");
		var canvas = $('#therapyCamCanvas').get(0);
		var video = $('#therapyCamVideo').get(0);
		therapyCam.windowWidth = window.innerWidth;
		therapyCam.windowHeight = window.innerHeight;  
		canvas.width = therapyCam.windowWidth;
		canvas.height = therapyCam.windowHeight;
		video.width = therapyCam.windowWidth;
		video.height = therapyCam.windowHeight;
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
        video.play();
	},
	getCamFailure:function(e){
		log("Failure. Couldn't get a webcam: " + e);
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