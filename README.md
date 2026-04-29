The actual game that runs on the browser will be made from html and javascript.

The game will be made by making an array of a class called point.
The class will have a vector2 form i.e. it stores the x & y position with two variables in the class x & y. It will also have a third type variable for image related info.
The array called 'snake' will have a length of the current score of the character + the initial length. An input system will be used to navigate the snake across the page. When the snake collects a powerup, it inncreases the length and score of the snake accordingly or gives a special benefit.

The sprites for all the animations of the snake and the power ups and collectibles, and all art for the game in general will be made through an app called libresprite, and the art style will be pixelated sprites.

The direction turning of a long snake at a particular point in the snake will be done by checking its previous point's position and the next point's position.

The end conditions will be when the snake head tries to occupy a position with the same position of another element in the snake array or if player hits vertical walls thrice.
The score at death will be taken using python and the bash script will help navigate the scores of previous players.
