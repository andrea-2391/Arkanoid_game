var c = document.getElementById("myArkanoid");
var ctx = c.getContext("2d");

var radius = 10;
var puntoX = c.width / 2;
var puntoY = c.height - 10;

var dx  = 2;
var dy = -2;

var paddlex = c.width / 2;
var paddley = c.height - 10;
var paddlew = 60;
var paddleh = 12;

var rightMove = false;
var leftMove = false;

var brickRows = 3;
var brickCOlumns = 5;

var brickWidth = 60;
var brickHeight = 20;

var brickPadding = 12;
var brickOfSetTop = 30;
var brickOfSetLeft = 100;

var bricks = [];

var gameIsOver = false;

var restartBtn = {
    x: c.width / 2 - 60,
    y: c.height / 2,
    w: 120,
    h: 40
};

for(let i = 0; i < brickCOlumns; i++) {
    bricks[i] = [];
    for(let j = 0; j < brickRows; j++) {
        bricks[i][j] = {x:0, y:0, drawBrick:true}
    }
}

var score = 0;
var lives = 5;

document.addEventListener("keydown", KeyDownHandler, false);
document.addEventListener("keyup", KeyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

document.addEventListener("click", function (e) {
    if (!gameIsOver) return;

    var rect = c.getBoundingClientRect();
    var clickX = e.clientX - rect.left;
    var clickY = e.clientY - rect.top;

    if (
        clickX > restartBtn.x &&
        clickX < restartBtn.x + restartBtn.w &&
        clickY > restartBtn.y &&
        clickY < restartBtn.y + restartBtn.h
    ) {
        restartGame();
    }
});

function KeyDownHandler(e) {
    if(e.keyCode == 37) {
        leftMove = true;
    } else {
        if(e.keyCode == 39) {
            rightMove = true;
        }
    }
}

function KeyUpHandler(e) {
    if(e.keyCode == 37) {
        leftMove = false;
    } else {
        if(e.keyCode == 39) {
            rightMove = false;
        }
    }
}

function mouseMoveHandler(e) {
    var mouseRelativeX = e.clientX - c.offsetLeft;
    if(mouseRelativeX > 0 && mouseRelativeX < c.width) {
        paddlex = mouseRelativeX - paddlew / 2;
    }
}

console.log("mi variable puntoX es : " + puntoX);
console.log("mi variable puntoY es : " + puntoY);
console.log("mi variable radius es : " + radius);

function drawBall() {
    ctx.beginPath();
    ctx.arc(puntoX, puntoY, radius, 0, 2*Math.PI);
    ctx.fillStyle = "#0066cc";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlex, paddley, paddlew, paddleh);
    ctx.fillStyle = "#ff3300";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let i = 0; i < brickCOlumns; i++) {
        for(let j = 0; j < brickRows; j++) {
            if(bricks[i][j].drawBrick) {
                var bx = (i * (brickWidth + brickPadding)) + brickOfSetLeft;
                var by = (j * (brickHeight + brickPadding)) + brickOfSetTop;
                bricks[i][j].x = bx;
                bricks[i][j].y = by;
                ctx.beginPath();
                ctx.rect(bx, by, brickWidth, brickHeight);
                ctx.fillStyle = "#ff3300";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function detectHits() {
    for(let i = 0; i < brickCOlumns; i++) {
        for(let j = 0; j < brickRows; j++) {
            var brick = bricks[i][j];
            if(bricks[i][j].drawBrick) {
                if(puntoX > brick.x && puntoX < brick.x + brickWidth
                    && puntoY > brick.y && puntoY < brick.y + brickHeight) {
                        dy = -dy;
                        brick.drawBrick = false;
                        score++;
                        if(score == brickCOlumns * brickRows) {
                            alert("Eres el mejor!");
                        }
            }
            }
        }
    }
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033cc";
    ctx.fillText("Score: " + score, 10, 20);
}

function drawLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033cc";
    ctx.fillText("Lives: " + lives, c.width - 100, 20);
}

//
function drawRestartButton() {
    ctx.fillStyle = "#0066cc";
    ctx.fillRect(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(
        "Reiniciar",
        restartBtn.x + restartBtn.w / 2,
        restartBtn.y + 27
    );
}

function restartGame() {
    score = 0;
    lives = 5;
    puntoX = c.width / 2;
    puntoY = c.height - 10;
    dx = 2;
    dy = -2;
    paddlex = c.width / 2;
    gameIsOver = false;

    for (let i = 0; i < brickCOlumns; i++) {
        for (let j = 0; j < brickRows; j++) {
            bricks[i][j].drawBrick = true;
        }
    }

    draw();
}


function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    if (gameIsOver) {
        // Dibujar fondo semitransparente
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, c.width, c.height);
        
        ctx.font = "40px Arial";
        ctx.fillStyle = "#ff0000";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", c.width / 2, c.height / 2 - 40);

        drawRestartButton();
        return;
    }
    
    drawPaddle();
    drawBall();
    drawBricks();
    detectHits();
    drawScore();
    drawLives();

    // Colisión con paredes laterales
    if(puntoX + dx > c.width - radius || puntoX + dx < radius) {
        dx = -dx;
    }
    
    // Colisión con techo
    if(puntoY + dy < radius) {
        dy = -dy;
    }

    // Verificar si la bola pasó el límite inferior
    if(puntoY >= c.height - radius) {
        // Verificar si la bola está sobre el paddle
        if(puntoX >= paddlex && puntoX <= paddlex + paddlew && puntoY <= c.height) {
            dy = -dy;
            puntoY = c.height - radius - 1; // Ajustar posición
        } else {
            // Perdió una vida
            lives--;
            
            if(lives <= 0) {
                gameIsOver = true;
                requestAnimationFrame(draw); // Forzar un redibujado inmediato
                return;
            } else {
                // Resetear posición de la bola
                puntoX = c.width / 2;
                puntoY = c.height - 100;
                dx = 2;
                dy = -2;
                paddlex = (c.width - paddlew) / 2;
            }
        }
    }

    // Movimiento del paddle
    if(leftMove && paddlex > 0) {
        paddlex -= 8;
    }
    if(rightMove && paddlex < (c.width - paddlew)) {
        paddlex += 8;
    }

    // Actualizar posición de la bola
    puntoX += dx;
    puntoY += dy;

    requestAnimationFrame(draw);
}


/*function gameOver() {
    document.getElementById("myArkanoidGameOver").style.display = "block";
}
*/
function gameOver() {
    gameIsOver = true;
}

draw();