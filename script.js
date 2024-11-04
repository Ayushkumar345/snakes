const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const boxSize = 20;
let score = 0;
let isGameOver = false;

let snake = [{ x: boxSize * 5, y: boxSize * 5 }];
let food = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
};

let dx = boxSize;
let dy = 0;
let changingDirection = false;

document.addEventListener("keydown", changeDirection);

function main() {
    if (isGameOver) return;

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        updateScore();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "#4CAF50";
    ctx.strokeStyle = "#000";
    snake.forEach(part => {
        ctx.fillText("🐍", part.x, part.y + boxSize - 5);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    if (gameOver()) {
        isGameOver = true;
        showGameOver();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
    food.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;

    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) generateFood();
    });
}

function drawFood() {
    ctx.font = "20px Arial";
    ctx.fillText("🍎", food.x, food.y + boxSize - 5);
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const key = event.keyCode;
    const goingUp = dy === -boxSize;
    const goingDown = dy === boxSize;
    const goingRight = dx === boxSize;
    const goingLeft = dx === -boxSize;

    if (key === 37 && !goingRight) { dx = -boxSize; dy = 0; }
    if (key === 38 && !goingDown) { dx = 0; dy = -boxSize; }
    if (key === 39 && !goingLeft) { dx = boxSize; dy = 0; }
    if (key === 40 && !goingUp) { dx = 0; dy = boxSize; }
}

function gameOver() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function updateScore() {
    document.getElementById("scoreDisplay").innerHTML = `Score: ${score}`;
}

function showGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
    document.getElementById("restartBtn").style.display = "block";
}

function restartGame() {
    snake = [{ x: boxSize * 5, y: boxSize * 5 }];
    dx = boxSize;
    dy = 0;
    score = 0;
    isGameOver = false;
    document.getElementById("restartBtn").style.display = "none";
    generateFood();
    main();
}

generateFood();
main();
