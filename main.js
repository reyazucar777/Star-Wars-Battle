var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var frames = 0;
var enemies = [];
var score = 0;
var interval;
var enemy1 = "./imagenes/cazatie.PNG";
var enemy2 = "./imagenes/cazatie2.PNG";
enemyImage = [enemy1, enemy2];
var bosshealth = 1000;

var btn = document.querySelector("button");

var audio = new Audio();
audio.src = "./Audio/The Millennium Falcon.mp3";
audio.loop = true;

var shootHalcon = new Audio();
shootHalcon.src = "./Audio/shootcorto3.mp3";

var explosion = new Audio();
explosion.src = "./Audio/explosión.mp3";

var audioBoss = new Audio();
audioBoss.src = "./Audio/Boss Imperial March.mp3";

var endAudioBackground = new Audio();
endAudioBackground.src =
  "./Audio/You Don_t Know the Power of the Dark Side(MP3_160K).mp3";
endAudioBackground.loop = false;

var endAudioDarth = new Audio();
endAudioDarth.src = "./Audio/Darth Vader's Theme.mp3";
endAudioDarth.loop = false;

class Halcon {
  constructor() {
    this.x = 20;
    this.y = 470;
    this.health = 10;
    this.width = 100;
    this.height = 120;
    this.player = true;
    this.image = new Image();
    this.image.src = "./imagenes/halcon.png";
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Bullets {
  constructor(x, y, direction = "up") {
    this.x = direction == "up" ? x + 30 : x;
    this.y = direction === "up" ? y - 20 : y + 20;
    this.width = 30;
    this.height = 50;
    this.direction = direction;
    this.image = new Image();
    this.image.src =
      this.direction === "up"
        ? "./imagenes/bala-dibujo-png-2.png"
        : "./imagenes/bala.png";
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
    this.direction == "up" ? (this.y -= 7) : (this.y += 7);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

function drawBullets() {
  bullets.forEach((bullet, i) => {
    if (bullet.y > canvas.height) {
      return bullets.splice(i, 1);
    }
    bullet.draw();
    enemies.forEach((enemy, index) => {
      if (bullet.collision(enemy) && bullet.direction !== "down") {
        explosion.play();
        bullets.splice(i, 1);
        enemies.splice(index, 1);
        score += 100;
      }
    });

    if (bullet.collision(halcon) && bullet.direction !== "up") {
      halcon.health -= 1;
      bullets.splice(i, 1);
      if (halcon.health <= 0) clearInterval(interval);
    }
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

  shoot() {
    bullets.push(new Bullets(this.x, this.y, "down"));
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
  }
}
function drawEnemies() {
  enemies.forEach(function(enemy) {
    enemy.draw();
    if (frames % 300 === 0 || frames % 180 == 0 || frames % 100 === 0)
      enemy.shoot();
  });
}

class Boss {
  constructor(x) {
    this.x = x;
    this.y = 40;
    this.width = 80;
    this.height = 110;
    this.image = new Image();
    this.image.src = "./imagenes/darthnave.PNG";
  }
  draw() {
    if (score > 2000) {
      Audio.pause();
      audioBoss.play();
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
var boss = new Boss();

function generateBoss() {
  if (score >= 2000) {
    boss.draw();
    boss.visible = true;
  }
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
    if (halcon.health === 0) {
      clearInterval(interval);
      ctx.font = "30px Avenir";
      ctx.fillText("Game Over", 250, 190);
      interval = undefined;
      audio.pause();
      endAudioBackground.play();
      endAudioDarth.play();
    }
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

function update() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  halcon.draw();
  generateEnemies();
  drawEnemies();
  drawBullets();
  boss.draw();
  generateBoss();
  ctx.fillStyle = "white";
  ctx.font = "25px VT323";
  ctx.fillText("SCORE " + score, 800, 20);
  background.gameOver();
}

function start() {
  if (interval !== undefined) return;
  interval = setInterval(update, 1000 / 60);
  audio.play();
}

/*function restart() {
  if (interval !== undefined) return;
  frames = 0;
  interval = undefined;
  audio.currentTime = 0;
  start();
}*/

addEventListener("keydown", function(event) {
  if (event.keyCode === 39) {
    if (halcon.x < 900) halcon.x += 80;
  }
  if (event.keyCode === 37) {
    if (halcon.x > 50) halcon.x -= 80;
  }
  if (event.keyCode === 32) {
    bullets.push(new Bullets(halcon.x, halcon.y));
    shootHalcon.play();
  }
});

addEventListener("click", e => {
  if (e.target.classList[0] == "btn") {
    start();
  }
});
