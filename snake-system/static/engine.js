const pi = Math.PI;

//defining canvas elements
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas');

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 640;

//defining images
const bg = new Image();
bg.src = 'backtile2.png';

const sHead = new Image();
sHead.src = 'snakehead.png';

const sBod = new Image();
sBod.src = 'snakebod.png';

const sCurve = new Image();
sCurve.src = 'snakeCurve.png';

const sTail = new Image();
sTail.src = 'snaketail.png';

const greenApple = new Image();
greenApple.src = 'Apple.png';

//defining the Point class(used to store positions of snake parts and to define direction)
//for the type variable, 0 = snake head, 1 = snake body, 2 = curve, 3 = tail, 10 = powerup 1
class Point {
        constructor(x = 0, y = 0, type) {
                this.x = x;
                this.y = y;
                this.type = type;
        }
}

//defining the snake array with initial element as snake head
let p0 = new Point(0,0,0);
let snake = [p0]

//setting a seperate variable for 
let n=snake.length;

//defining the directions wrt grid
const RIGHT = new Point(1,0);
const LEFT = new Point(-1,0)
const UP = new Point(0,1);
const DOWN = new Point(0,-1);

let direction = RIGHT;
let nextDirection = RIGHT;

//defining a randomizer function
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//defining the speed of the game (frequency at which game loop repeats(in ms)). one "game tick" is just this amount of time(again, in ms)
let speed = 100;

//making variables to make sure snake doesnt go through itself
let leftDelay = 0;
let rightDelay = 0;
let upDelay = 0;
let downDelay = 0;

//changing direction based on keyboard inputs. direction is assigned to newDirection instead of direction directly to prevent multiple direction changes in the same game tick
window.addEventListener('keydown', (event) => {

        if ((event.key === "d" || event.key === 'ArrowRight') && direction != LEFT) {
                nextDirection = RIGHT;
        }
        if ((event.key === "a" || event.key === 'ArrowLeft') && direction != RIGHT) {
                nextDirection = LEFT;
        }
        if ((event.key === "w" || event.key === 'ArrowUp') && direction != DOWN) {
                nextDirection = UP;
        }
        if ((event.key === "s" || event.key === 'ArrowDown') && direction != UP) {
                nextDirection = DOWN;
        }

});

//defining functions to move the snake head
function moveLeft() {
        if (snake[0].x > 0) {
                snake[0].x--;
        }
        else if (snake[0].x == 0) {
                snake[0].x = 14;
        }
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

function setType(n) {
        snake[0].type = 0;
        for (let i = 1; i < n-1; i++) {
                if (snake[i-1].y == snake[i+1].y) snake[i].type = 1
                else if (snake[i-1].x == snake[i+1].x) snake[i].type = 1;
                else snake[i].type = 2;
        }
        snake[n-1].type = 3;
}

//drawing images for all points of snake
function setImage() {
        console.log("snake:", JSON.stringify(snake));
        console.log("n:", n);
        
        //setting snake body length
        for(let i = 1; i < n-1; i++){
                ctx.save();
                ctx.translate(snake[i].x * 32 + 16, snake[i].y * 32 + 16);
                if (snake[i].type == 1){
                        if (snake[i-1].y == snake[i+1].y){
                                ctx.rotate(pi/2);
                                ctx.drawImage(sBod, -16, -16);
                        }
                        else if (snake[i-1].x == snake[i+1].x) ctx.drawImage(sBod, -16, -16);
                }

                else if (snake[i].type == 2){
                        //defining variables based on change from previous and next point on snake
                        let dx1 = snake[i].x-snake[i-1].x;
                        let dy1 = snake[i].y-snake[i-1].y;

                        let dx2 = snake[i+1].x - snake[i].x;
                        let dy2 = snake[i+1].y - snake[i].y;

                        //defining a variable to set rotation. rot is multiplied by pi/2 in the end to get desired rotation
                        //base image has its concave corner facing towards the bottom right (i.e. the desired rotation for a turn to the right wrt snake head).
                        let rot;

                        if (dx1 == 1 && dy2 == 1 || dx2 == -1 && dy1 == -1) rot=1;
                        else if (dx2 == 1 && dy1 == -1 || dx1 == -1 && dy2 == 1) rot=0;
                        else if (dx2 == -1 && dy1 == 1 || dx1 == 1 && dy2 == -1) rot=2;
                        else if (dx1 == -1 && dy2 == -1 || dx2 == 1 && dy1 == 1) rot=-1;

                        else if (dx1 == 1 && dy2 == -19 || dx2 == -1 && dy1 == 19) rot=1;
                        else if (dx1 == -1 && dy2 == -19 || dx2 == 1 && dy1 == 19) rot=0;
                        else if (dx1 == 1 && dy2 == 19 || dx2 == -1 && dy2 == -19) rot=2;
                        else if (dx1 == -1 && dy2 == 19 || dx2 == 1 && dy1 == -19) rot=-1;

                        else if (dx1 == 14 && dy1 == 1 || dx2 == -14 && dy2 == -1) rot=0;
                        else if (dx1 == 14 && dy2 == -1 || dx2 == -14 && dy1 == 1) rot=-1;
                        else if (dx1 == -14 && dy2 == 1 || dx2 == 14 && dy1 == -1) rot=1;
                        else if (dx1 == -14 && dy2 == -1 || dx2 == 14 && dy1 == 1) rot=2;

                        ctx.rotate(pi/2 * rot);
                        ctx.drawImage(sCurve, -16, -16);
                }
                ctx.restore();
        }

        //setting tail image
        ctx.save();
        ctx.translate(snake[n-1].x * 32 + 16, snake[n-1].y * 32 + 16);
        if(n>1) {
                if (snake[n-1].x == snake[n-2].x){
                        if(snake[n-1].y < snake[n-2].y || (snake[n-2].y == 0 && snake[n-1].y == 19)){
                                ctx.drawImage(sTail, -16, -16);
                        }
                        else if(snake[n-1].y > snake[n-2].y || (snake[n-2].y == 19 && snake[n-1].y == 0)){
                                ctx.rotate(pi);
                                ctx.drawImage(sTail, -16, -16);
                        }
                }

                else if (snake[n-1].y == snake[n-2].y){
                        if(snake[n-1].x < snake[n-2].x || (snake[n-2].x == 0 && snake[n-1].x == 14)){
                                ctx.rotate(-pi/2);
                                ctx.drawImage(sTail, -16, -16);
                        }
                        else if(snake[n-1].x > snake[n-2].x || (snake[n-2].x == 14 && snake[n-1].x == 0)){
                                ctx.rotate(pi/2);
                                ctx.drawImage(sTail, -16, -16);
                        }
                }
        }
        ctx.restore();
        
        //setting image for powerups
        let k = powerups.length;

        for(let i = 0; i < k; i++) {
                ctx.save();
                ctx.translate(powerups[i].x * 32 + 16, powerups[i].y * 32 +16);
                ctx.drawImage(greenApple, -16, -16);
                ctx.restore();
        }

        //setting head image
        ctx.save();
        ctx.translate(snake[0].x * 32 + 16, snake[0].y * 32 + 16);
        if (direction == UP){
                ctx.drawImage(sHead, -16, -16);
        }
        else if (direction == RIGHT){
                ctx.rotate(pi/2);
                ctx.drawImage(sHead, -16, -16);
        }
        else if (direction == DOWN){
                ctx.rotate(pi);
                ctx.drawImage(sHead, -16, -16);
        }
        else if (direction == LEFT){
                ctx.rotate(-pi/2);
                ctx.drawImage(sHead, -16, -16);
        }
        ctx.restore();
}

//defining function to add point to the length of the snake
function addLength() {
        let x = new Point(snake[snake.length-1].x,snake[snake.length-1].y)
        snake.push(x);
}

//adding initial three snake body parts
addLength();
addLength();
addLength();

let powerups = [];

let dead = 0;

function spawnPowerUP() {

        let grid = [];
        for (let x = 0; x < 15; x++) {
                for (let y = 0; y < 20; y++){
                        grid.push({x: x, y: y});
                }
        }

        for (let i = 0; i < n; i++) {
                for (let j = 0; j < grid.length; j++){
                        if (snake[i].x == grid[j].x && snake[i].y == grid[j].y){
                                grid.splice(j,1);
                        }
                }
        }

        let rand = grid[getRandomInt(0, grid.length-1)];

        let xPower = rand.x;
        let yPower = rand.y;

        powerups.push(new Point(xPower, yPower));
        powerups[powerups.length-1].type = 10;
}

spawnPowerUP();

function physicsProcess() {
        ctx.clearRect(0, 0, 480, 640);
        ctx.drawImage(bg, 0, 0, 480, 640)

        n=snake.length;

        //to ensure direction change is only measured once per tick
        direction = nextDirection;

        //copies state of i-1th point for ith point
        //all calculations for image display, logic etc are done after this
        for (let i = n-1; i>0; i--) {
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
        }

        //move head according to direction
        if (direction == UP) moveUp();
        else if (direction == LEFT) moveLeft();
        else if (direction == RIGHT) moveRight();
        else if (direction == DOWN) moveDown();

        //setting type variable for each point of the snake so that engine knows which image to assign. done after movement to make sure images are according to current state of game
        setType(n);

        //checking for collision with powerup
        for (let i = powerups.length-1; i>=0; i--) {
                if (snake[0].x == powerups[i].x && snake[0].y == powerups[0].y) {
                        powerups.splice(i,1);
                        spawnPowerUP();
                        addLength();
                }
        }
        //checking for snake overlapping
        for (let i = 1; i < n; i++) {
                if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                        speed = 10000000000;
                        snake[0].x = -1;
                        snake[0].y = -1;
                        alert("game over");
                        location.reload();
                        dead = 1;
                }
        }

        //setting image for each point
        setImage();
        console.log(snake[0].x + " " + snake[0].y)
}

if(!dead){
        setInterval (physicsProcess, speed);
}
