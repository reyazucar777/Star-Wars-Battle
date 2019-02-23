var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var frames = 0;
var enemies = [];


class Halcon {
  constructor() {
    this.x = 20;
    this.y = 470;
    this.width = 100;
    this.height = 120;
    this.image = new Image();
    this.image.src = "./imagenes/halcon.png";
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Enemy{
    constructor(x){
        this.x = x;
        this.y = 40;
        this.width = 80;
        this.height = 110;
        this.image = new Image();
        this.image.src = "./imagenes/cazatie.PNG" ;  
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); 
    }
}    
function generateEnemies(){
    if(frames % 100 == 0 || frames % 60 == 0 || frames % 170 == 0){
    const x = Math.floor(Math.random() * 15)
    
    enemies.push(new Enemy(x *64));
    }
}
function drawEnemies (){
    enemies.forEach(function(enemy){
        enemy.draw()}
        )
}

class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.image = new Image();
    this.image.src = "./imagenes/espacio-negro-sin-patrón.jpg";
  }

  draw() {
    this.y++;
    if (this.y > +canvas.height) this.y = 0;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x,
      this.y - this.height,
      this.width,
      this.height
    );
  }
}

background = new Background();
var halcon = new Halcon();

setInterval(function() {
  frames++;
  background.draw();
  halcon.draw();
  generateEnemies();
  drawEnemies();
}, 1000 / 60);

addEventListener("keydown", function(event) {
  if (event.keyCode === 39) {
    if (halcon.x < 900) halcon.x += 80;
  }
  if (event.keyCode === 37) {
    if (halcon.x > 50) halcon.x -= 80;
  }
});
