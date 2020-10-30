const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const maxCharCount = 200;
const fontSize = 10;
const maxColumns = WIDTH / fontSize;
const fallingCharArr = new Array(maxColumns);

canvas.width = canvas2.width = WIDTH;
canvas.height = canvas2.height = HEIGHT;

// SVG Information, recalc on resize?
let svgElement = null;
let geometries = null;
let SVG_WINDOW_WIDTH = 124;
let SVG_WINDOW_HEIGHT = 76;
let svgPointHolder = null;
let SVG_SCALE = 2;
let lookup = {};

const svgContainsPoint = (x, y) => {
  //   const point = svgElement.createSVGPoint();
  const point = svgPointHolder;
  point.x =
    // SVG_WINDOW_WIDTH * SVG_SCALE -
    parseInt((SVG_WINDOW_WIDTH / window.innerWidth) * SVG_SCALE * x) -
    SVG_WINDOW_WIDTH / SVG_SCALE;
  //   point.y = parseInt(
  //     (y / window.innerHeight) * SVG_WINDOW_HEIGHT * SVG_SCALE +
  //       SVG_WINDOW_HEIGHT * (1 - SVG_SCALE)
  //   );

  point.y =
    parseInt(((SVG_WINDOW_WIDTH / window.innerHeight) * y * SVG_SCALE) / 1.2) -
    SVG_WINDOW_WIDTH / SVG_SCALE / 1.2;

  let containsPoint = false;
  if (lookup[point.x] && point.y in lookup[point.x]) {
    return lookup[point.x][point.y];
  }
  geometries.forEach((path) => {
    const isInStroke = path.isPointInStroke && path.isPointInStroke(point);
    const isInFill = path.isPointInFill && path.isPointInFill(point);
    if (isInStroke || isInFill) {
      containsPoint = true;
      return;
    }
  });

  if (!(point.x in lookup)) {
    lookup[point.x] = {};
  }
  lookup[point.x][point.y] = containsPoint;
  return containsPoint;
};

const randomInt = (min, max) => {
  return Math.floor(randomFloat(min, max));
};

const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomCharacter = () => {
  return String.fromCharCode(randomInt(65, 91));
};

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.draw = function (ctx) {
  this.value = getRandomCharacter();
  this.speed = randomFloat(1, 5);

  ctx2.fillStyle = "rgba(0,0,0,0.8)";
  ctx2.font = fontSize + "px san-serif";
  ctx2.fillText(this.value, this.x, this.y);

  if (svgContainsPoint(this.x, this.y)) {
    // ctx.fillStyle = "#6b290a";
    ctx.fillStyle = "#eb6123";
  } else {
    // ctx.fillStyle = "#eb6123";
    ctx.fillStyle = "#000000";
  }
  ctx.font = fontSize + "px san-serif";
  ctx.fillText(this.value, this.x, this.y);

  this.y += this.speed;
  if (this.y > HEIGHT) {
    this.y = randomFloat(-100, 0);
    this.speed = randomFloat(2, 5);
  }
};

const onLoad = () => {
  svgElement = document.querySelector("object").contentDocument.documentElement;
  geometries = svgElement.querySelectorAll("*");
  SVG_WINDOW_WIDTH = svgElement.viewBox.baseVal.width; //124;
  SVG_WINDOW_HEIGHT = svgElement.viewBox.baseVal.height; //76;
  svgPointHolder = svgElement.createSVGPoint();

  for (let i = 0; i < maxCharCount; i++) {
    fallingCharArr[i] = new Point(i * fontSize, randomFloat(-1200, 0));
  }

  var update = function () {
    ctx.fillStyle = "rgba(0,0,0,0.01)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx2.clearRect(0, 0, WIDTH, HEIGHT);

    fallingCharArr.forEach((character) => {
      //   if (svgContainsPoint(character.x, character.y)) {
      //   } else {
      //     // ctx.fillStyle = "rgba(0,0,0,0.05)";
      //   }
      character.draw(ctx);
    });

    requestAnimationFrame(update);
  };

  update();
};

document.getElementById("svg-image").addEventListener("load", onLoad);
