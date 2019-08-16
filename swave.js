var colors = {
  'blue': 'rgba(0, 0, 0,',
  'green': 'rgba(103, 197, 8,',
  'pink': 'rgba(5, 77, 111,',
  'yellow': 'rgba(255, 216, 1,'
};

var return_acc = 0.5;

var analyser;
var ctx;

function Point (colour) {
    this.x = 0;
    this.y = 0;
    this.xv = (Math.floor((Math.random() * 50) + 1)-25)/20;
    this.yv = (Math.floor((Math.random() * 50) + 1)-25)/20;

    this.alpha = 0.1;

    // this.color = colour;
}

Point.prototype = {
  constructor: Point,

  update_position: function(i){
    this.x += this.xv*(-i/50);
    this.y += this.yv*(-i/50);
  },

  update_velocity: function(){
    if (this.x <= -canvasW/2){
      this.xv *= -1;
    }
    if (this.x >= canvasW/2){
      this.xv *= -1;
    }

    if (this.y <= -canvasH/2){
      this.yv *= -1;
    }
    if (this.y >= canvasH/2){
      this.yv *= -1;
    }
  },

  update_alpha: function(hight){
    this.alpha = hight;
  }
}

canvasW = 0;
canvasH = 0;

var points = [];
var nopoints = 100;
var globalalpha = 0.9;
var context;

var shift = 0;
var shift_direction = 1;

function init() {

  var audio = document.getElementById("audio");
  audio.crossOrigin = "anonymous";
  audio.src = 'Black_Coast_-_TRNDSTTR_(Lucian_Remix).mp3';
  audio.load();

  audio.oncanplaythrough = function() {
    if (audio.currentTime == 0) {
      audio.currentTime = 70;

      var AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();
      var src = context.createMediaElementSource(audio);
      analyser = context.createAnalyser();

      src.connect(analyser);
      analyser.connect(context.destination);

      analyser.fftSize = 128;

      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);

      for (i = 0; i < bufferLength; i++) {
        point = new Point();
        points.push(point);
      }

      canvas = document.getElementById("main");
      canvas.width = document.body.clientWidth; //document.width is obsolete
      canvas.height = document.body.clientHeight; //document.height is obsolete
      canvasW = canvas.width;
      canvasH = canvas.height;

      ctx = document.getElementById('main').getContext('2d');

      ctx.fillStyle = colors['green'] + globalalpha.toString() + ')';
      ctx.strokeStyle = colors['green'] + globalalpha.toString() + ')';

      ctx.restore();

      var img = new Image();
      img.onload = function() {
          ctx.drawImage(img, (canvasW/2) - 150, (canvasH/2) -150, 300,300);
      }
      img.src = "play-button-svgrepo-com.svg";

      function draw() {
        if (shift >= (canvasW/2)-500){
          shift_direction = shift_direction * -1;
        }
        else if (shift <= (canvasW/-2)+500) {
          shift_direction = shift_direction * -1;
        }

        shift = shift + (1/4)*shift_direction;

        // console.log(shift)

        canvas.width = document.body.clientWidth; //document.width is obsolete
        canvas.height = document.body.clientHeight; //document.height is obsolete
        canvasW = canvas.width;
        canvasH = canvas.height;

        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0, 0, canvasW, canvasH); // clear canvas

        ctx.fillStyle = colors['green'] + globalalpha.toString() + ')';
        ctx.strokeStyle = colors['green'] + globalalpha.toString() + ')';

        analyser.getByteFrequencyData(dataArray);

        for (i = 0; i < points.length; i++) {

          var point = points[i]

          point.update_velocity();
          point.update_position(dataArray[i]);

          ctx.beginPath();
          ctx.arc(canvasW/2 + point.x + (shift*dataArray[i]/100), canvasH/2 + point.y + dataArray[i], dataArray[i]/10, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(canvasW/2 + (shift*dataArray[i])/200, canvasH/2 + dataArray[i] - 200, dataArray[i]+10, 0, Math.PI * 2, false);
          ctx.stroke();
        }

        var grd = ctx.createLinearGradient(0, 0, canvasW*(dataArray[10]/100), canvasH*(dataArray[10]/100));
        grd.addColorStop(0, colors['pink'] + globalalpha.toString() + ')');
        grd.addColorStop(1, colors['blue'] + globalalpha.toString() + ')');

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvasW, canvasH);

        window.requestAnimationFrame(draw);
      }
      document.body.addEventListener('click', function () {
        if(context.state === 'suspended') {
          context.resume();
          audio.play();
          window.requestAnimationFrame(draw);
        }
        else {
          context.suspend();
        }
      }, true);
      document.body.addEventListener('touchend', function () {
        if(context.state === 'suspended') {
          context.resume();
          audio.play();
          window.requestAnimationFrame(draw);
        }
        else {
          context.suspend();
        }
      }, false);
    }
  }
}


init();
