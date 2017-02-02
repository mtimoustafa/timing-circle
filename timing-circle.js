$(function() {
  // Properties =======================
  var bpm = 100;
  var beats = 5;
  var divisions = 4;
  var anchorR = 5; // %
  var beatR = 3; // %
  var headR = 2.5; // %
  var padding = 5; // %
  // ==================================
  
  var canvas;
  var ctx;
  var frameR;
  var startTime;
  var currentBeat = 0;
  var stopAnim = true;
  var canvasClickPos = {X: 0, Y: 0};
  
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
    ctx.strokeStyle = "#D60500";
    ctx.lineWidth = 3.0;
    ctx.stroke();
    ctx.lineWidth = 1.0;
    
    // Draw beat markers
    var angle; var newX; var newY;
    for (let beat = 0; beat < beats; beat++) {
      angle = -Math.PI*2*(beat/beats);
      newX = canvas.width/2 - (canvas.width/2-padding)*Math.sin(angle);
      newY = canvas.height/2 - (canvas.height/2-padding)*Math.cos(angle);
      
      ctx.beginPath();
      ctx.arc(newX, newY, beatR, 0, Math.PI*2, true);
      ctx.fillStyle = "#D60500";
      ctx.fill();
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

    clearCanvas();
    drawBg();

    // Draw arm
    ctx.beginPath();
    ctx.moveTo(newX,newY);
    ctx.lineTo(canvas.width/2 - (anchorR)*Math.sin(angle), canvas.height/2 - (anchorR)*Math.cos(angle));
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineWidth = 1.0;
    
    // Update beat counter
    currentBeat = Math.floor(bpmTime);

    // Request new frame
    if (!stopAnim) {
      requestAnimFrame(function() {
        animateCanvas();
      });
    } else {
      initCanvas();
    }
  }
  
  function initCanvas() {
    clearCanvas();
    drawBg();
    
    // Draw arm
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, padding);
    ctx.lineTo(canvas.width/2, canvas.height/2 - anchorR);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  
  function clearCanvas () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  function initTimingCircle() {
    // Attach canvas
    var $wrapper = $('#tc-timing-circle');
    var $canvas = $('<canvas/>', {id: 'tc-canvas'}).prop({width: $wrapper.width(), height: $wrapper.width()});
    $canvas.appendTo($wrapper);
    canvas = $canvas[0];
    ctx = $canvas[0].getContext("2d");
    
    // Accommodate HiDPI displays e.g. Apple retina displays
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
    if (devicePixelRatio !== backingStoreRatio) {
      canvas.width *= devicePixelRatio / backingStoreRatio;
      canvas.height *= devicePixelRatio / backingStoreRatio;
      canvas.style.width = $wrapper.width() + 'px';
      canvas.style.height = $wrapper.height() + 'px';
    }
    
    // Clicking canvas toggles animation start/stop
    $canvas.click(function(e) {
      // Click position detection from Stack Overflow - thanks!
      // http://stackoverflow.com/questions/3234977/using-jquery-how-to-get-click-coordinates-on-the-target-element
      canvasClickPos.X = e.pageX - $(this).offset().left;
      canvasClickPos.Y = e.pageY - $(this).offset().top;
      stopAnim = !stopAnim;
    	if (!stopAnim) {
      	startTime = (new Date()).getTime();
        animateCanvas();
      }
    });
    
    // Set properties to absolute values
    anchorR = canvas.width * anchorR/100;
    beatR = canvas.width * beatR/100;
    headR = canvas.width * headR/100;
    padding = canvas.width * padding/100;
    frameR = canvas.width/2 - padding;
    
    initCanvas();
  }
  
  initTimingCircle();
});
