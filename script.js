const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const maxCharCount = 100;
const fontSize = 10;
const maxColumns = WIDTH / fontSize;
const fallingCharArr = new Array(maxColumns);

canvas.width = canvas2.width = WIDTH;
canvas.height = canvas2.height = HEIGHT;

const randomInt = (min, max) => {
  return Math.floor(randomFloat(min, max));
};

const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

function Point(x, y) {
  this.x = x;
  this.y = y;
}

const getRandomCharacter = () => {
  return String.fromCharCode(randomInt(65, 91));
};

Point.prototype.draw = function (ctx) {
  this.value = getRandomCharacter();
  this.speed = randomFloat(1, 5);

  ctx2.fillStyle = "rgba(255,255,255,0.8)";
  ctx2.font = fontSize + "px san-serif";
  ctx2.fillText(this.value, this.x, this.y);

  ctx.fillStyle = "#eb6123";
  ctx.font = fontSize + "px san-serif";
  ctx.fillText(this.value, this.x, this.y);

  this.y += this.speed;
  if (this.y > HEIGHT) {
    this.y = randomFloat(-100, 0);
    this.speed = randomFloat(2, 5);
  }
};

for (let i = 0; i < maxColumns; i++) {
  fallingCharArr[i] = new Point(i * fontSize, randomFloat(-500, 0));
}

var update = function () {
  ctx.fillStyle = "rgba(0,0,0,0.05)";

  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx2.clearRect(0, 0, WIDTH, HEIGHT);

  fallingCharArr.forEach((character) => character.draw(ctx));

  requestAnimationFrame(update);
};

update();
