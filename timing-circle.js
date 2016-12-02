$(function() {
  var anchorR = 10;
  var headR = 5;
  var padding = 10;
  var frameR;
  var startTime;
  var bpm;
  var beats;
  var divisions;
  
  // Animation methods courtesy of http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  
  function animateLiveCanvas(canvas, ctx) {
    var time = (new Date()).getTime() - startTime;
    var bpmTime = time/1000/60 * bpm % beats;
    var angle = -Math.PI*2*(bpmTime/beats);
    var newX = canvas.width/2 - (canvas.width/2-padding)*Math.sin(angle);
    var newY = canvas.height/2 - (canvas.height/2-padding)*Math.cos(angle);
    
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw arm
    ctx.beginPath();
    ctx.moveTo(newX,newY);
    ctx.lineTo(canvas.width/2 - (anchorR)*Math.sin(angle), canvas.height/2 - (anchorR)*Math.cos(angle));
    ctx.strokeStyle = "#D60500";
    ctx.stroke();
    
    // Draw arm head
    ctx.beginPath();
    ctx.arc(newX, newY, headR, 0, Math.PI*2, true);
    ctx.fillStyle = "red";
    ctx.fill();

    // request new frame
    requestAnimFrame(function() {
      console.log("wow");
      animateLiveCanvas(canvas, ctx);
    });
  }

  function initBgCanvas(canvas, ctx) {
    // Draw circular track
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, frameR, 0, Math.PI*2, true);
    ctx.strokeStyle = "#666";
    ctx.stroke();
    
    // Draw marker
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, padding);
    ctx.lineTo(canvas.width/2, canvas.height/2 - anchorR);
    ctx.strokeStyle = "#666";
    ctx.stroke();
    
    // Draw anchor
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, anchorR, 0, Math.PI*2, true);
    ctx.fillStyle= "green";
    ctx.fill();
  };
  
  function initLiveCanvas(canvas, ctx) {
    // Draw arm
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, padding);
    ctx.lineTo(canvas.width/2, canvas.height/2 - anchorR);
    ctx.strokeStyle = "#D60500";
    ctx.stroke();
    
    // Draw arm head
    ctx.beginPath();
    ctx.arc(canvas.width/2, padding, headR, 0, Math.PI*2, true);
    ctx.fillStyle = "red";
    ctx.fill();
  };
  
  function initTimingCircle() {
    var $wrapper = $('#tc-timing-circle');
    frameR = $('#tc-timing-circle').width()/2 - padding;
    
    var $bgCanvas = $('<canvas/>', {id: 'tc-canvas-bg'}).prop({width: $wrapper.width(), height: $wrapper.height()}).css({position: 'absolute'});
    $bgCanvas.appendTo($wrapper);
    initBgCanvas($bgCanvas[0], $bgCanvas[0].getContext("2d"));
    
    var $liveCanvas = $('<canvas/>', {id: 'tc-canvas-live', position: 'absolute'}).prop({width: $wrapper.width(), height: $wrapper.height()}).css({position: 'absolute'});
    $liveCanvas.appendTo($wrapper);
    initLiveCanvas($liveCanvas[0], $liveCanvas[0].getContext("2d"));

    bpm = 100;
    beats = 4;
    divisions = 4;
    setTimeout(function() {
        startTime = (new Date()).getTime();
        animateLiveCanvas($liveCanvas[0], $liveCanvas[0].getContext("2d"));
      }, 1000);
  }
  
  initTimingCircle();
});
