var colors = {
  'blue': 'rgba(8, 247, 254,',
  'green': 'rgba(9, 251, 211,',
  'pink': 'rgba(254, 83, 187,',
  'yellow': 'rgba(245, 211, 0,'
};

var return_acc = 0.5;

function Point () {
    this.x = 0;
    this.y = 0;
    this.xv = (Math.floor((Math.random() * 50) + 1)-25)/10;
    this.yv = (Math.floor((Math.random() * 50) + 1)-25)/10;

    this.alpha = 0.1;
}

Point.prototype = {
  constructor: Point,

  update_position: function(){
    this.x += this.xv;
    this.y += this.yv;
  },

  update_velocity: function(){
    if (this.x <= -canvasW/2){
      this.xv += return_acc;
    }
    if (this.x >= canvasW/2){
      this.xv += -return_acc;
    }

    if (this.y <= -canvasH/2){
      this.yv += return_acc;
    }
    if (this.y >= canvasH/2){
      this.yv += -return_acc;
    }
  },

  update_alpha: function(hight){
    this.alpha = hight;
  }
}

var sun = new Image();
var moon = new Image();
var earth = new Image();
canvasW = 0;
canvasH = 0;

var points = [];
var nopoints = 100;
var globalalpha = 0.9;

function init() {
  var audio = document.getElementById("audio");
  // audio.autoplay = true;
  audio.src = 'https://github.com/muir-t/muir-t.github.io/blob/master/Lorde_-_Tennis_Court_Flume_Remix.mp3?raw=true';
  audio.load();
  audio.oncanplaythrough = function() {
    if (audio.currentTime == 0) {
      audio.currentTime = 90;
      audio.play();
      for (i = 0; i < nopoints; i++) {
        point = new Point();
        points.push(point);
      }

      canvas = document.getElementById("main");
      canvas.width = document.body.clientWidth; //document.width is obsolete
      canvas.height = document.body.clientHeight; //document.height is obsolete
      canvasW = canvas.width;
      canvasH = canvas.height;

      window.requestAnimationFrame(draw);
    }
  }
}

function draw() {
  var ctx = document.getElementById('main').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, canvasW, canvasH); // clear canvas

  ctx.fillStyle = colors['green'] + globalalpha.toString() + ')';
  ctx.strokeStyle = colors['green'] + globalalpha.toString() + ')';

  for (i = 0; i < points.length; i++) {

    var point = points[i]

    point.update_velocity();
    point.update_position();

    ctx.beginPath();
    ctx.arc(canvasW/2 + point.x, canvasH/2 + point.y, 10, 0, Math.PI * 2, false); // Earth orbit
    ctx.fill();
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(canvasW/2, canvasH/2, 200, 0, Math.PI * 2, false); // Earth orbit
  ctx.stroke();

  ctx.font = "30px Arial";
  ctx.fillStyle = 'white';
  ctx.textAlign = "center";
  ctx.fillText("Tom Muir", canvas.width/2, canvas.height/2);

  // var grd = ctx.createLinearGradient(0, 0, canvasW, canvasH);
  // grd.addColorStop(0, colors['pink'] + globalalpha.toString() + ')');
  // grd.addColorStop(1, colors['blue'] + globalalpha.toString() + ')');
  //
  // ctx.fillStyle = grd;
  // ctx.fillRect(0, 0, canvasW, canvasH);

  window.requestAnimationFrame(draw);
}

init();
