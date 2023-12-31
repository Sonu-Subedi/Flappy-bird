const container = document.querySelector(".container");
let canvasWidth = 420;
let canvasHeight = 640;
let context;

// Declaring bird variables
let birdWidth = 34;
let birdHeight = 24;
let birdX = canvasWidth / 8;
let birdY = canvasHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

///for pipes

let pipeArray = [];
let pipeWidth = 54;
let pipeHeight = 412;
let pipeX = canvasWidth;
let pipeY = 0;

let topImg1;
let bottomImg;
////game physics
let velocityX = -1.5;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;

let score = 0;

function gameStart() {
  const canvas = document.getElementById("canvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext("2d");

  birdImg = new Image();
  birdImg.src = "assets/bluebird-upflap.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topImg = new Image();
  topImg.src = "assets/toppipe.png";
  bottomImg = new Image();
  bottomImg.src = "assets/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(createPipe, 2500);
  document.addEventListener("keydown", function (e) {
    moveBird(e);
  });

  canvas.addEventListener("click", moveBird);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.type === "click") {
    velocityY = -4;
  }
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  velocityY += gravity;
  bird.y += velocityY;

  bird.y = Math.max(bird.y, 0);

  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  if (bird.y > canvas.height) {
    gameOver = true;
  }

  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }
    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  ///for clearing pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  //for displaying score
  context.fillStyle = "green";
  context.font = "40px sans-serif";
  context.fillText("Score: " + score, 5, 45);
  if (gameOver) {
    const gameOverImage = new Image();
    gameOverImage.src = "assets/gameover.png";
    const imageWidth = 200;
    const imageHeight = 100;
    context.drawImage(gameOverImage, 110, 220, imageWidth, imageHeight);
  }
}
function createPipe() {
  if (gameOver) {
    // gameOvertext();
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let space = canvas.height / 4;

  let topPipe = {
    img: topImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  let bottomPipe = {
    img: bottomImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + space,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);
  pipeArray.push(bottomPipe);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    if (gameOver) {
      restartGame();
    } else {
      moveBird();
    }
  }
});

function restartGame() {
  bird.y = birdY;
  pipeArray = [];
  score = 0;
  gameOver = false;
  velocityY = 0;
}

// for collision
function detectCollision(a, b) {
  if (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  ) {
    return true;
  }
  return false;
}

window.onload = () => {
  gameStart();
  canvas.addEventListener("click", moveBird);
};
