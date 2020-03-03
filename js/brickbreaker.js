// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle = "orange";
ctx.strokeStyle = "black";
ctx.lineWidth = 2.5;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.textAlign = "center";
ctx.font = '40px "Roboto", monospace';


// Variables
let dx;
let dxFactor;
let speed;
let gameStarted = false;

// Objects
let bricks = [];

let ball = {
    x: undefined,
    y: undefined,
    radius: 10,
    right: true,
    up: true
};

let paddle = {
    x: (canvas.width / 2) - 40,
    y: canvas.height - 10,
    width: 80,
    height: 5,
    movement: 1
};

let brickImage = new Image();
brickImage.src = "img/brick.png";

let bollImage = new Image();
bollImage.src = "img/boll.png";


// Event Listeners
window.onload = function() {
    document.getElementById("reset-button").onclick = init;
    game();
}
document.addEventListener("keydown", getArrowKeys);
document.getElementById("canvas").addEventListener("mousemove", getMouse);


// Functions
function init() {
    document.getElementById("reset-button").innerHTML = "Reset";
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.right = true;
    ball.up = true;
    paddle.x = (canvas.width / 2) - 40;
    paddle.y = canvas.height - 10;
    dxFactor = 1;
    speed = 0;
    bricks = [];
    createbricks();
    gameStarted = true;
}

function game() {
    if (gameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        checkCollision();
        changeDirection();
        if (bricks.length === 0) {
            win();
        }
    }

    setTimeout(game, 20 - speed);
}

function checkCollision() {
    if (ball.x - ball.radius <= 0) {
        ball.right = true;
    }
    if (ball.x + ball.radius >= canvas.width) {
        ball.right = false;
    }
    if (ball.y - ball.radius <= 0) {
        ball.up = false;
    }
    if (ball.y - ball.radius >= canvas.height) {
        gameOver();
    }

    for (let j = 0; j < bricks.length; j++) {
        if (ball.up && ball.y - ball.radius <= bricks[j].y + bricks[j].height && ball.y - ball.radius > bricks[j].y + bricks[j].height - 12 && ball.x >= bricks[j].x - ball.radius && ball.x < bricks[j].x + bricks[j].width + ball.radius) {
            ball.up = false;
            ctx.clearRect(bricks[j].x, bricks[j].y, bricks[j].width, bricks[j].height);
            bricks.splice(j, 1);
            break;
        }
        else if (!ball.up && ball.y + ball.radius >= bricks[j].y && ball.y + ball.radius < bricks[j].y + 12 && ball.x >= bricks[j].x - ball.radius && ball.x < bricks[j].x + bricks[j].width + ball.radius) {
            ball.up = true;
            ctx.clearRect(bricks[j].x, bricks[j].y, bricks[j].width, bricks[j].height);
            bricks.splice(j, 1);
            break;
        }
        else if (ball.right && ball.x + ball.radius >= bricks[j].x && ball.x + ball.radius < bricks[j].x + 12 && ball.y >= bricks[j].y - ball.radius && ball.y < bricks[j].y + bricks[j].height + ball.radius) {
            ball.right = false;
            ctx.clearRect(bricks[j].x, bricks[j].y, bricks[j].width, bricks[j].height);
            bricks.splice(j, 1);
            break;
        }
        else if (!ball.right && ball.x - ball.radius <= bricks[j].x + bricks[j].width && ball.x - ball.radius > bricks[j].x + bricks[j].width - 12 && ball.y >= bricks[j].y - ball.radius && ball.y < bricks[j].y + bricks[j].height + ball.radius) {
            ball.right = true;
            ctx.clearRect(bricks[j].x, bricks[j].y, bricks[j].width, bricks[j].height);
            bricks.splice(j, 1);
            break;
        }
    }

    if (ball.y + ball.radius >= paddle.y && ball.y <= paddle.y + paddle.height) {
        let a = 3;
        const DX_FACTOR_CHANGE = a / 25;
        for (let i = 2; i <= 100; i += 2) {
            if (ball.x >= paddle.x - ball.radius + i - 2 && ball.x < paddle.x - ball.radius + i) {
                if (i < 50) {
                    ball.up = true;
                    ball.right = false;
                    ball.y = canvas.height - 20;
                    speed = (speed >= 14) ? speed = 14 : speed + 0.5;
                    dxFactor = Math.abs(a);
                }
                else if (i >= 50) {
                    ball.up = true;
                    ball.right = true;
                    ball.y = canvas.height - 20;
                    speed = (speed >= 14) ? speed = 14 : speed + 0.5;
                    dxFactor = Math.abs(a);
                }
                break;
            }
            else {
                a -= DX_FACTOR_CHANGE;
            }
        }
    }

    if (paddle.x + paddle.width > canvas.width) {
        paddle.movement = 0;
        paddle.x = canvas.width - paddle.width;
    }
    else if (paddle.x < 0) {
        paddle.movement = 0;
        paddle.x = 0;
    }
    else {
        paddle.movement = 1;
    }
}

function changeDirection() {
    if (ball.right) {
        dx = 3 * dxFactor;
    }
    else {
        dx = -3 * dxFactor;
    }
    if (ball.up) {
        dy = -3;
    }
    else {
        dy = 3;
    }
    ball.x += dx;
    ball.y += dy;
}

function draw() {
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.drawImage(bollImage, ball.x - ball.radius, ball.y - ball.radius);

    for (let i = 0; i < bricks.length; i++) {
        ctx.drawImage(brickImage, bricks[i].x, bricks[i].y);
    }

    ctx.font = '24px "Roboto", monospace';
    ctx.fillStyle = "lightgray";
    ctx.textAlign = "left";
    ctx.fillText("Bricks Left: " + bricks.length, 10, canvas.height - 20);

    ctx.textAlign = "right";
    ctx.fillText("Speed: " + (Math.floor(speed) + 1), canvas.width - 10, canvas.height - 20);
    ctx.font = '50px "Roboto", monospace';

    ctx.fillStyle = "rgb(200, 0, 0, 0.7)";
    ctx.textAlign = "center";
}

function getArrowKeys(event) {
    if (gameStarted) {
        if (event.keyCode == 37) {
            let timer = setInterval(() => paddle.x -= paddle.movement, 4);
            setTimeout(() => { clearInterval(timer); }, 100);
        }
        else if (event.keyCode == 39) {
            let timer2 = setInterval(() => paddle.x += paddle.movement, 4);
            setTimeout(() => { clearInterval(timer2); }, 100);
        }
    }
}

function getMouse(event2) {
    paddle.x = event2.offsetX - (paddle.width / 2);
}

function createbricks() {
    for (let y = 0; y <= 80; y += 40) {
        for (let x = 0; x < canvas.width; x += canvas.width / 10) {
            // let hasPowerUp = (Math.random() > 0.9) ? true : false;
            // let powerUp;
            // if (hasPowerUp) {
            //     let powerUpSelector = randomInteger(3);
            //     switch(powerUpSelector) {
            //         case 0:
            //             powerUp = "speed down";
            //             break;
            //         case 1:
            //             powerUp = "large paddle";
            //             break;
            //         case 2:
            //             powerUp = "uh";
            //             break;
            //     }
            // }
            let brickTemplate = {
                x: x,
                y: y,
                width: canvas.width / 10,
                height: 40
            };
            bricks.push(brickTemplate);
        }
    }
}

function gameOver() {
    gameStarted = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let gameOverStats = (bricks.length === 29) ? (30 - bricks.length) + " brick broken out of 30" : (30 - bricks.length) + " bricks broken out of 30";
    ctx.strokeText("GAME OVER", canvas.width / 2, (canvas.height / 2) - 40);
    ctx.fillText("GAME OVER", canvas.width / 2, (canvas.height / 2) - 40);
    ctx.strokeText(gameOverStats, canvas.width / 2, (canvas.height / 2) + 40);
    ctx.fillText(gameOverStats, canvas.width / 2, (canvas.height / 2) + 40);
    document.getElementById("reset-button").innerHTML = "Play Again!";
}

function win() {
    gameStarted = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeText("CONGRATULATIONS!", canvas.width / 2, (canvas.height / 2) - 40);
    ctx.fillText("CONGRATULATIONS!", canvas.width / 2, (canvas.height / 2) - 40);
    ctx.strokeText("You win!", canvas.width / 2, (canvas.height / 2) + 40);
    ctx.fillText("You win!", canvas.width / 2, (canvas.height / 2) + 40);
    document.getElementById("reset-button").innerHTML = "Play Again!";
}

function randomInteger(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
