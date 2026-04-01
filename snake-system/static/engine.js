class Point {
        constructor(x = 0, y = 0) {
                this.x = x;
                this.y = y;
        }
        setText() {
                document.getElementById(String(this.x)+String(this.y)).innerText='..';
        }
}

let p0 = new Point(0,0);
let snake = [p0]

const RIGHT = new Point(1,0);
const LEFT = new Point(-1,0)
const UP = new Point(0,1);
const DOWN = new Point(0,-1);

let direction = RIGHT;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function moveLeft() {
        if (snake[0].x > 0) {
                snake[0].x--;
        }
        else if (snake[0].x == 0) {
                snake[0].x = 9;
        }
}

function moveRight() {
        if (snake[0].x < 9) {
                snake[0].x++;
        }
        else if (snake[0].x == 9) {
                snake[0].x = 0;
        }
}

function moveUp() {
        if (snake[0].y > 0) {
                snake[0].y--;
        }
        else if (snake[0].y == 0) {
                snake[0].y = 9;
        }
}

function moveDown() {
        if (snake[0].y < 9) {
                snake[0].y++;
        }
        else if (snake[0]. y == 9) {
                snake[0].y = 0;
        }
}

function addLength() {
        let x = new Point(snake[snake.length-1].x,snake[snake.length-1].y)
        snake.push(x);
        snake.length
}

addLength();
addLength();
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
}

spawnPowerUP();

function physicsProcess() {
        let n = snake.length;
        document.getElementById(String(snake[0].x)+String(snake[0].y)).innerText='█';
        for (let i = n-1; i>0; i--) {
                document.getElementById(String(snake[i].x)+String(snake[i].y)).innerText='█';
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
        }
        if (direction == UP) moveUp();
        else if (direction == LEFT) moveLeft();
        else if (direction == RIGHT) moveRight();
        else if (direction == DOWN) moveDown();

        for (let i = 0; i<n; i++) {
                document.getElementById(String(snake[i].x)+String(snake[i].y)).innerText='..';
        }

        for (let i = 1; i < n; i++) {
                if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                        alert("game over");
                        location.reload();
                }
        }

        for (let i = powerups.length-1; i>=0; i--) {
                if (snake[0].x == powerups[i].x && snake[0].y == powerups[0].y) {
                        powerups.splice(i,1);
                        spawnPowerUP();
                        addLength();
                }
        }
}

setInterval (physicsProcess,100);
