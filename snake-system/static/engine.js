class Point {
        constructor(x = 0, y = 0, type) {
                this.x = x;
                this.y = y;
        }
        setText() {
                document.getElementById(String(this.x)+","+String(this.y)).innerText='█';
        }
        setInvis() {
                document.getElementById(String(this.x)+","+String(this.y)).innerText='█';
        }
        setClass(classname)  {
                document.getElementById(String(this.x)+","+String(this.y)).className = classname;
        }
}

let p0 = new Point(0,0);
p0.setClass("snakeHead");
let snake = [p0]

const RIGHT = new Point(1,0);
const LEFT = new Point(-1,0)
const UP = new Point(0,1);
const DOWN = new Point(0,-1);

let direction = RIGHT;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let speed = 100;

window.addEventListener('keydown', (event) => {

        if ((event.key === "d" || event.key === 'ArrowRight') && direction != LEFT) {
                direction = RIGHT;
        }
        if ((event.key === "a" || event.key === 'ArrowLeft') && direction != RIGHT) {
                direction = LEFT;
        }
        if ((event.key === "w" || event.key === 'ArrowUp') && direction != DOWN) {
                direction = UP;
        }
        if ((event.key === "s" || event.key === 'ArrowDown') && direction != UP) {
                direction = DOWN;       
        }

});

function setImg() {
        let bgimages = document.getElementsByClassName("backdrop");
        for (let i=0; i < bgimages.length; i++) {
                bgimages[i].src = "backtile.png";
        }

        let snakeimages = document.getElementsByClassName("snake");
        for (let i=0; i < snakeimages.length; i++) {
                snakeimages[i].src = "snakebod.png";
        }

        let snakeHimages = document.getElementsByClassName("snakeHorizontal");
        for (let i=0; i < snakeHimages.length; i++) {
                snakeHimages[i].src = "snakebod.png";
        }

        let snakeVimages = document.getElementsByClassName("snakeVertical");
        for (let i=0; i < snakeVimages.length; i++) {
                snakeVimages[i].src = "snakebod.png";
        }

        let snakeTRimages = document.getElementsByClassName("snakeTurnTR");
        for (let i=0; i < snakeTRimages.length; i++) {
                snakeTRimages[i].src = "snakeCurve.png";
        }
        let snakeBRimages = document.getElementsByClassName("snakeTurnBR");
        for (let i=0; i < snakeBRimages.length; i++) {
                snakeBRimages[i].src = "snakeCurve.png";
        }
        let snakeTLimages = document.getElementsByClassName("snakeTurnTL");
        for (let i=0; i < snakeTLimages.length; i++) {
                snakeTLimages[i].src = "snakeCurve.png";
        }
        let snakeBLimages = document.getElementsByClassName("snakeTurnBL");
        for (let i=0; i < snakeBLimages.length; i++) {
                snakeBLimages[i].src = "snakeCurve.png";
        }

        if (direction == LEFT) document.querySelector(".snakeHeadLeft").src = "snakehead.png";
        else if (direction == RIGHT) document.querySelector(".snakeHeadRight").src = "snakehead.png";
        else if (direction == UP) document.querySelector(".snakeHeadUp").src = "snakehead.png";
        else if (direction == DOWN) document.querySelector(".snakeHeadDown").src = "snakehead.png";
}

function moveLeft() {
        if (snake[0].x > 0) {
                snake[0].x--;
        }
        else if (snake[0].x == 0) {
                snake[0].x = 14;
        }
}

function setSnakeClass() {

        for (let i = 1; i < snake.length-1; i++) {
                if (snake[i-1].y == snake[i+1].y) snake[i].setClass("snakeHorizontal");
                else if (snake[i-1].x == snake[i+1].x) snake[i].setClass("snakeVertical");
                else {
                        let dx1 = snake[i].x-snake[i-1].x;
                        let dy1 = snake[i].y-snake[i-1].y;

                        let dx2 = snake[i+1].x - snake[i].x;
                        let dy2 = snake[i+1].y - snake[i].y;

                        if (dx1 == 1 && dy2 == 1 || dx2 == -1 && dy1 == -1) snake[i].setClass("snakeTurnBL");
                        if (dx2 == 1 && dy1 == -1 || dx1 == -1 && dy2 == 1) snake[i].setClass("snakeTurnBR");
                        if (dx2 == -1 && dy1 == 1 || dx1 == 1 && dy2 == -1) snake[i].setClass("snakeTurnTL");
                        if (dx1 == -1 && dy2 == -1 || dx2 == 1 && dy1 == 1) snake[i].setClass("snakeTurnTR")
                }
        }

        if (snake[snake.length-1].x == snake[snake.length-2].x) snake[snake.length-1].setClass("snakeVertical");
        else if (snake[snake.length-1].y == snake[snake.length-2].y) snake[snake.length-1].setClass("snakeHorizontal");

}

function moveRight() {
        if (snake[0].x < 14) {
                snake[0].x++;
        }
        else if (snake[0].x == 14) {
                snake[0].x = 0;
        }
}

function moveUp() {
        if (snake[0].y > 0) {
                snake[0].y--;
        }
        else if (snake[0].y == 0) {
                snake[0].y =19;
        }
}

function moveDown() {
        if (snake[0].y < 19) {
                snake[0].y++;
        }
        else if (snake[0]. y == 19) {
                snake[0].y = 0;
        }
}

function addLength() {
        let x = new Point(snake[snake.length-1].x,snake[snake.length-1].y)
        x.setClass("snake")
        snake.push(x);
}

addLength();
addLength();
addLength();

let powerups = [];

function spawnPowerUP() {
        let xPower = getRandomInt(0,9);
        let yPower = getRandomInt(0,9);

        let isOccupied = false;
        
        for (let i = snake.length - 1; i >= 0; i--) {
                if (xPower == snake[i].x && yPower == snake[i].y) {
                        isOccupied = true;
                        break;
                }
                else isOccupied = false;
        }

        if (isOccupied) {
                xPower = getRandomInt(0,9);
                yPower = getRandomInt(0,9);

                for (let i = snake.length - 1; i >= 0; i--) {
                        if (xPower == snake[i].x && yPower == snake[i].y) {
                                isOccupied = true;
                                break;
                        }
                        else isOccupied = false;
                }
        }

        powerups.push(new Point(xPower, yPower));
        powerups[powerups.length-1].setText();
        powerups[powerups.length-1].setClass("snake");
}

spawnPowerUP();

let score = 0;

function addScore() {
        score++;
        document.getElementById("score").innerText="score : "+String(score);
}

function physicsProcess() {
        let n = snake.length;
        document.getElementById(String(snake[0].x)+","+String(snake[0].y)).innerText='█';
        for (let i = n-1; i>0; i--) {
                snake[i].setInvis();
                snake[i].setClass("backdrop");
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
        }
        if (direction == UP) moveUp();
        else if (direction == LEFT) moveLeft();
        else if (direction == RIGHT) moveRight();
        else if (direction == DOWN) moveDown();

        setSnakeClass();

        if (direction == LEFT) snake[0].setClass("snakeHeadLeft");
        else if (direction == RIGHT) snake[0].setClass("snakeHeadRight");
        else if (direction == UP) snake[0].setClass("snakeHeadUp");
        else if (direction == DOWN) snake[0].setClass("snakeHeadDown");
        

        for (let i = 1; i < n; i++) {
                if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                        snake[0].x = -1;
                        snake[0].y = -1;
                        alert("game over");
                        location.reload();
                }
        }

        for (let i = powerups.length-1; i>=0; i--) {
                if (snake[0].x == powerups[i].x && snake[0].y == powerups[0].y) {
                        powerups.splice(i,1);
                        spawnPowerUP();
                        addScore();
                        addLength();
                }
        }
        setImg();
}

setInterval (physicsProcess,speed);
