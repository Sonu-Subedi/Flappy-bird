const container = document.querySelector(".container");
let canvasWidth = 320;
let canvasHeight = 540;
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

let topImg;
let bottomImg;
////game physics
let velocityX = -1.5;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;

let score = 0;

// gameOverImg = new Image();
// gameOverImg.src = "sprites/gameover.png";

function gameStart() {
  const canvas = document.getElementById("canvas");
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  context = canvas.getContext("2d");

  //   context.fillstyle = "blue";
  //   context.fillRect(birdImg, bird.x, bird.y, bird.width, bird.height);

  birdImg = new Image();
  birdImg.src = "../sprites/bluebird-upflap.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topImg = new Image();
  topImg.src = "/sprites/toppipe.png";
  bottomImg = new Image();
  bottomImg.src = "/sprites/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(createPipe, 2500);
  document.addEventListener("keydown", moveBird);
  canvas.addEventListener("click", moveBird);
  canvas.addEventListener("click", moveBird);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.type === "click") {
    velocityY = -4;
  }
}

function update() {
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  velocityY += gravity;
  console.log(velocityY);
  bird.y += velocityY;

  bird.y = Math.max(bird.y, 0);

  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  if (bird.y > canvas.height) {
    gameOver = true;
  }
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    console.log(pipe);
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
  context.fillStyle = "red";
  context.font = "40px sans-serif";
  context.fillText(score, 5, 45);
  if (gameOver) {
    context.fillText("Game Over", 5, 90);
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

canvas.addEventListener("click", () => {
  if (gameOver) {
    restartGame();
  } else {
    moveBird();
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

// function gameOvertext() {
//   context.drawImage(gameOverImg, 5, canvasHeight / 2.9, 350, 70);
//   context.fillText(`Final score: ${score}`, 100, 330);
//   context.fillText(`Click to play again`, 65, 380);
// }

window.onload = () => {
  gameStart();
  canvas.addEventListener("click", moveBird);
};
