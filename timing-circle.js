$(function() {
  // Properties =======================
  var bpm = 100;
  var beats = 5;
  var divisions = 4;
  var anchorR = 5; // %
  var headR = 2.5; // %
  var padding = 5; // %
  // ==================================
  
  var canvas;
  var ctx;
  var frameR;
  var startTime;
  var currentBeat = 0;
  
  // Animation methods courtesy of http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  
  function drawBg() {
    // Draw circular track
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, frameR, 0, Math.PI*2, true);
    ctx.strokeStyle = "#666";
    ctx.stroke();
    
    // Draw beat markers
    var angle; var newX; var newY;
    for (let beat = 0; beat < beats; beat++) {
      angle = -Math.PI*2*(beat/beats);
      newX = canvas.width/2 - (canvas.width/2-padding)*Math.sin(angle);
      newY = canvas.height/2 - (canvas.height/2-padding)*Math.cos(angle);
      
      ctx.beginPath();
      ctx.moveTo(newX, newY);
      ctx.lineTo(canvas.width/2 - (anchorR)*Math.sin(angle), canvas.height/2 - (anchorR)*Math.cos(angle));
      ctx.strokeStyle = "#666";
      ctx.stroke();
    }
    
    // Draw anchor
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, anchorR, 0, Math.PI*2, true);
    ctx.fillStyle= "green";
    ctx.fill();
  };
  
  function animateCanvas() {
    var time = (new Date()).getTime() - startTime;
    var bpmTime = time/1000/60 * bpm % beats;
    var angle = -Math.PI*2*(bpmTime/beats);
    var newX = canvas.width/2 - (canvas.width/2-padding)*Math.sin(angle);
    var newY = canvas.height/2 - (canvas.height/2-padding)*Math.cos(angle);

    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBg();

    // Draw arm
    ctx.beginPath();
    ctx.moveTo(newX,newY);
    ctx.lineTo(canvas.width/2 - (anchorR)*Math.sin(angle), canvas.height/2 - (anchorR)*Math.cos(angle));
    ctx.strokeStyle = "#D60500";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineWidth = 1.0;
    
    // Draw arm head
    ctx.beginPath();
    ctx.arc(newX, newY, headR, 0, Math.PI*2, true);
    ctx.fillStyle = "red";
    ctx.fill();
    
    // Update beat counter
    currentBeat = Math.floor(bpmTime);

    // Request new frame
    requestAnimFrame(function() {
      animateCanvas();
    });
  }
  
  function initCanvas() {
    drawBg();
    
    // Draw arm
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, padding);
    ctx.lineTo(canvas.width/2, canvas.height/2 - anchorR);
    ctx.strokeStyle = "#D60500";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Draw arm head
    ctx.beginPath();
    ctx.arc(canvas.width/2, padding, headR, 0, Math.PI*2, true);
    ctx.fillStyle = "red";
    ctx.fill();
  };
  
  function initTimingCircle() {
    var $wrapper = $('#tc-timing-circle');
    
    var $canvas = $('<canvas/>', {id: 'tc-canvas', position: 'absolute'}).prop({width: $wrapper.width(), height: $wrapper.width()}).css({position: 'absolute'});
    $canvas.appendTo($wrapper);
    canvas = $canvas[0];
    ctx = $canvas[0].getContext("2d");
    
    anchorR = canvas.width * anchorR/100;
    headR = canvas.width * headR/100;
    padding = canvas.width * padding/100;
    frameR = canvas.width/2 - padding;
    
    initCanvas();

    setTimeout(function() {
        startTime = (new Date()).getTime();
        animateCanvas();
      }, 500);
  }
  
  initTimingCircle();
});
