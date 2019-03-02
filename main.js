var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var frames = 0;
var enemies = [];
var score = 0;
var interval;
var enemy1 = "./imagenes/cazatie.PNG";
var enemy2 = "./imagenes/cazatie2.PNG";
enemyImage = [enemy1, enemy2];
var health = 10;

var btn = document.querySelector("button");

var audio = new Audio();
audio.src = "./Audio/The Millennium Falcon.mp3";
audio.loop = true;

var endAudioBackground = new Audio();
endAudioBackground.src = "./Audio/Darth Vader's Theme.mp3";
endAudioBackground.loop = false;

var endAudioDarth = new Audio();
endAudioDarth.src = "./Audio/Darth Vader's Theme.mp3";
endAudioDarth.loop = false;

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

class Bullets {
  constructor(x, y) {
    this.x = halcon.x + 30;
    this.y = halcon.y - 20;
    this.width = 30;
    this.height = 50;
    this.image = new Image();
    this.image.src = "./imagenes/bala-dibujo-png-2.png";
  }
  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

function drawBullets() {
  bullets.forEach((bullet, i) => {
    bullet.y -= 7;
    if (bullet.y > canvas.height) {
      return bullets.splice(i, 1);
    }
    bullet.draw();
    enemies.forEach((enemy, index) => {
      if (bullet.collision(enemy)) {
        bullets.splice(i, 1);
        enemies.splice(index, 1);
        score += 100;
      }
    });
  });
}

class BulletsEnemy {
  constructor(x, y) {
    this.x = enemyImage.x + 30;
    this.y = enemyImage.y - 20;
    this.width = 30;
    this.height = 50;
    this.image = new Image();
    this.image.src = "./imagenes/hadouken.png";
  }
  collision(item) {
    return (
      this.x < item.x + item.width &&
      this.x + this.width > item.x &&
      this.y < item.y + item.height &&
      this.y + this.height > item.y
    );
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
function drawBalasEnemigo() {
    bulletsE.forEach((bulletE, i) => {
    bulletE.y += 7;
    if (bulletE.y > canvas.height) {
      return bulletsE.splice(i, 1);
    }
    bulletE.draw();
    
    /*halcon.forEach((halcon, index) => {
      if (bulletE.collision(halcon)) {
        bulletsE.splice(i, 1);
        health--;
        console.log(health);
      }
    });*/
  });
}

class Enemy {
  constructor(x, img) {
    this.x = x;
    this.y = 40;
    this.width = 80;
    this.height = 110;
    this.image = new Image();
    this.image.src = img;
  }

  draw() {
    if (frames % 10) this.x -= 5;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

function generateEnemies() {
  if (frames % 100 == 0 || frames % 60 == 0 || frames % 170 == 0) {
    const x = Math.floor(Math.random() * 15);
    var randomEnemy = Math.floor(Math.random() * enemyImage.length);
    enemies.push(new Enemy(x * 64, enemyImage[randomEnemy]));
    bulletsE.push(new BulletsEnemy);
  }
}
function drawEnemies() {
  enemies.forEach(function(enemy) {
    enemy.draw();
    //
  });
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

  gameOver() {
    clearInterval(interval);

    ctx.font = "30px Avenir";
    ctx.fillText("Game Over", 250, 190);
    interval = undefined;
    audio.pause();
    endAudioDarth.play();
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
var bullet = new Bullets();
let bullets = [];
let bulletE = new BulletsEnemy();
let bulletsE = [];

function update() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  halcon.draw();
  generateEnemies();
  drawEnemies();
  drawBullets();
  drawBalasEnemigo();
  ctx.fillStyle = "white";
  ctx.font = "25px VT323";
  ctx.fillText("SCORE " + score, 800, 20);
}

function start() {
  if (interval !== undefined) return;
  interval = setInterval(update, 1000 / 60);
  audio.play();
}

function restart() {
  if (interval !== undefined) return;
  frames = 0;
  interval = undefined;
  audio.currentTime = 0;
  start();
}

addEventListener("keydown", function(event) {
  if (event.keyCode === 39) {
    if (halcon.x < 900) halcon.x += 80;
  }
  if (event.keyCode === 37) {
    if (halcon.x > 50) halcon.x -= 80;
  }
  if (event.keyCode === 32) {
    bullets.push(new Bullets(halcon.x, halcon.y));
  }
});

addEventListener("click", e => {
  if (e.target.classList[0] == "btn") {
    start();
  }
});
