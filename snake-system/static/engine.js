//variable to check whether game has started or not
let start = false;

//start button, main page stuff
let playerName = '';
let best = 0;

document.getElementById('startBtn').addEventListener('click', function() {
        let name = document.getElementById('Username').value.trim();
        if (name === '') {
                document.getElementById('errorMsg').style.display = 'block';
                document.getElementById('Username').style.borderColor = '#f44336';
                return;
        }
        playerName = name.split(' ')[0];
        document.getElementById('errorMsg').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
        document.getElementById('score').classList.remove("hidden");
        document.getElementById('gameCanvas').classList.remove("hidden");
        document.getElementById('gameTime').classList.remove("hidden");
        document.getElementById('health1').classList.remove("hidden");
        document.getElementById('health2').classList.remove("hidden");
        document.getElementById('health3').classList.remove("hidden");
        start = true;
        direction = RIGHT;
        //difficulty variable

        let difficulty = Number(document.getElementById("diffSlider").value);
        if (difficulty == 1) speed = 200;
        else if (difficulty == 2) speed = 100;
        else speed = 50;
        console.log(speed);
        
        startGame();
});

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
bg.src = 'static/backtile2.png';

const sHead = new Image();
sHead.src = 'static/snakehead.png';

const sBod = new Image();
sBod.src = 'static/snakebod.png';

const sCurve = new Image();
sCurve.src = 'static/snakeCurve.png';

const sTail = new Image();
sTail.src = 'static/snaketail.png';

const greenApple = new Image();
greenApple.src = 'static/Apple.png';

const goldenApple = new Image();
goldenApple.src = 'static/goldenApple.png';

const cookie = new Image();
cookie.src = 'static/cookie.png';

const borders = new Image();
borders.src = 'static/borders.png';

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

//creating score variable
score = 0;
//creating health variable
health = 3;

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
let speed;

//making variables to make sure snake doesnt go through itself
let leftDelay = 0;
let rightDelay = 0;
let upDelay = 0;
let downDelay = 0;

//playtime variable
time = 0;


//changing direction based on keyboard inputs. direction is assigned to newDirection instead of direction directly to prevent multiple direction changes in the same game tick
window.addEventListener('keydown', (event) => {

        if ((event.key === "d" || event.key === 'ArrowRight') && direction != LEFT && start && !dead) {
                nextDirection = RIGHT;
        }
        if ((event.key === "a" || event.key === 'ArrowLeft') && direction != RIGHT && start && !dead) {
                nextDirection = LEFT;
        }
        if ((event.key === "w" || event.key === 'ArrowUp') && direction != DOWN && start && !dead) {
                nextDirection = UP;
        }
        if ((event.key === "s" || event.key === 'ArrowDown') && direction != UP && start && !dead) {
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
                if (powerups[i].type == 1) ctx.drawImage(greenApple, -16, -16);
                else if (powerups[i].type == 2) ctx.drawImage(goldenApple, -16, -16);
                else if (powerups[i].type == 3) ctx.drawImage(cookie, -16, -16);
                
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

//adding a countdown for the cookie powerup
let cookieTime = 0;

function spawnPowerUP() {

        let grid = [];
        for (let x = 1; x < 14; x++) {
                for (let y = 1; y < 19; y++){
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

        let rng = Math.random();
        let type;
        if (rng >0.4) type = 1;
        else if (rng > 0.15) type = 2;
        else if (rng <= 0.15 && cookieTime != 0) type = 2;
        else type = 3;

        powerups.push(new Point(xPower, yPower, type));
}

spawnPowerUP();

function addScore() {
        score++;
        document.getElementById("score").innerText="Score : " + String(score);
}

//checking for collision with edge
let colliding = false;

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
                if (snake[0].x == powerups[i].x && snake[0].y == powerups[i].y) {
                        if (powerups[i].type == 1) {
                                addLength();
                                addScore();
                        }

                        else if (powerups[i].type == 2) {
                                addLength();
                                addLength();
                                addLength();
                                addScore();
                                addScore();
                                addScore();
                        }

                        else if (powerups[i].type == 3) {
                                cookieTime = 10;
                                cookieHit();
                        }
                        powerups.splice(i,1);
                        spawnPowerUP();
                        
                }
        }
        //checking for snake overlapping
        for (let i = 1; i < n; i++) {
                if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                        die(0);
                }
        }

        //collision logic
        if (((snake[0].x == 0 && direction != RIGHT) || (snake[0].x == 14 && direction != LEFT)) && cookieTime == 0 && !dead) {
                if (!colliding) {
                        health--;
                        document.getElementById("health"+String(health+1)).classList.add("hidden");
                        colliding = true;
                        console.log("hit");
                        if (health == 0) die(1);
                }
        }
        else {
                colliding = false;
        }


        //setting image for each point
        setImage();
        ctx.save();
        ctx.moveTo(0,0);
        ctx.drawImage(borders, 0, 0);
        ctx.restore();

        //making cookie invincibilty visible when it is non zero
        if (cookieTime != 0) {
                if (document.getElementById("cookieTime").classList.contains("hidden") && !dead) {
                        document.getElementById("cookieTime").classList.remove("hidden");
                }
                document.getElementById("cookieTime").innerText = "Barrier immunity: " + String(cookieTime);
        }
        else {
                if (!document.getElementById("cookieTime").classList.contains("hidden") || dead) {
                        document.getElementById("cookieTime").classList.add("hidden");
                }
        }

        if (!document.getElementById("cookieTime").classList.contains("hidden") && dead) {
                        document.getElementById("cookieTime").classList.add("hidden");
        }
}

let cookieInterval = null;

function cookieTimer() {
        if (cookieTime>0) cookieTime--;
        if (cookieTime == 0) {
                clearInterval(cookieInterval);
                cookieInterval = null;
        }
        console.log(cookieTime)
}

function cookieHit() {
        
        if (cookieInterval !== null) {
                clearInterval(cookieInterval);
                cookieInterval = null;
        }
        cookieInterval = setInterval (cookieTimer, 1000);
}

function timeIncrease() {
        time++;
        document.getElementById("gameTime").innerText = "Time: " + time;
}

let gameInterval = null;
let timeInterval = null;

function startGame() {
        direction = RIGHT;
        if(!dead && start){

                if (gameInterval !== null) {
                        clearInterval(gameInterval);
                }

                if (timeInterval !== null) {
                        clearInterval(timeInterval);
                }

                gameInterval = setInterval (physicsProcess, speed);
                timeInterval = setInterval (timeIncrease, 1000);
        }
        else {

        }
}

function die(cause) {
        dead = true;
        start = false;
        cookieTime = 0;

        
        if(score > best){
                best = score;
        }
        let wallLines = [
                "The wall was not a door.",
                "Walls: 1, You: 0",
                "You hit a wall... literally.",
                "The boundary wins again!",
                "That wall came out of nowhere!",
                "Splat! Wall collision!"
                ];
        let selfLines = [
                "You ate yourself. Tasty?",
                "Self-destruction activated!",
                "You became your own enemy.",
                "Plot twist: the snake bites back."
                ]


        document.getElementById("gameCanvas").classList.add("hidden");
        document.getElementById("gameoverbox").classList.remove("hidden");
        document.getElementById("score").classList.add("hidden");
        document.getElementById('gameTime').classList.add("hidden");
        document.getElementById('health1').classList.add("hidden");
        document.getElementById('health2').classList.add("hidden");
        document.getElementById('health3').classList.add("hidden");
        document.getElementById("endScore").innerText = score;
        document.getElementById("time").innerText = String(time) + "s";
        document.getElementById("NAME").innerHTML=playerName;
        document.getElementById("best").innerHTML=best;

        let now = new Date();

        let timestamp = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');

        document.getElementById("timestamp").innerHTML= timestamp;

        if (gameInterval !== null) {
                clearInterval(gameInterval);
                gameInterval=null;
        }

        if (cookieInterval !== null) {
                clearInterval(cookieInterval);
                cookieInterval = null;
        }

        if (timeInterval !== null) {
                clearInterval(timeInterval);
                timeInterval=null;
        }

        if (cause == 0) {
                document.getElementById("line").innerHTML=selfLines[Math.floor(Math.random() * selfLines.length)];
                document.getElementById("deathbox").style.borderColor="#DC143C";
                document.getElementById("causeofdeath").innerHTML="SELF DEATH";
                document.getElementById("causeofdeath").style.color="#DC143C";
        }
        else {
                document.getElementById("line").innerHTML=wallLines[Math.floor(Math.random() * wallLines.length)];
                document.getElementById("deathbox").style.borderColor="#00BFFF";
                document.getElementById("causeofdeath").innerHTML="WALL COLLISION";
                document.getElementById("causeofdeath").style.color="#00BFFF";
        }

        console.log(time);
}

document.getElementById("playagain").addEventListener('click', function () {
        if (dead) {
                reset();
        }
});


function reset() {
        score = 0;
        health = 3;
        cookieTime = 0;
        time = 0;

        document.getElementById("score").innerText = "Score: 0";

        snake.splice(0,snake.length);

        let p0 = new Point(0,0,0);
        snake = [p0];

        addLength();
        addLength();
        addLength();

        let rpoint = new Point(1,0);
        nextDirection = RIGHT;

        document.getElementById("gameCanvas").classList.remove("hidden");
        document.getElementById("gameoverbox").classList.add("hidden");
        document.getElementById("score").classList.remove("hidden");
        document.getElementById('gameTime').classList.remove("hidden");
        document.getElementById('health1').classList.remove("hidden");
        document.getElementById('health2').classList.remove("hidden");
        document.getElementById('health3').classList.remove("hidden");

        start = true;
        dead = false;

        startGame();
}
