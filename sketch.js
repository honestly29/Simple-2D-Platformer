/*
	The Game Project Part 7:
    Stroll Across the Outskirts of Tokyo
*/
var gameChar_x;
var gameChar_y;
var floorPos_y;

// movement
var isLeft;
var isRight;
var isFalling;
var isPlummeting;

// decorations
var trees;
var gem;
var flag;
var clouds;
var mountains;
var canyon;

var cameraPosX;

// game state
var gameOver;
var levelComplete;

//game score
var gameScore;

//sky
var skyColour_1;
var skyColour_2;

var galaxy;
var skyBuffer;

//sounds
var backgroundSound;
var flagSound;
var canyonSound;

function preload(){
    backgroundSound = loadSound("/assets/Yugen-Emotional-Ethnic-Music(chosic.com).mp3");
    flagSound = loadSound("assets/SM64-Star-Sparkle-Sound.mp3");
    canyonSound = loadSound("assets/hurt_c_08-102842.mp3");
}

function setup()
{
	createCanvas(1024, 576);
    cameraPosX = 0;
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
    gameScore = 0;
    
    //hide cursor
    noCursor();

    //game state
    gameOver = false;
    levelComplete = false;
    
    //movement
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    
    //canyon
	canyon = {
        x_pos: [700, 1100, 1710, 2500, 3000, 3500], 
        width: [150, 120, 160, 120, 170, 200],
    };
    canyonSoundPlayed = false;
    
    //trees
    trees = {
        treePos_y: height/2 + 24,
        treesPos_x: [width/2 - 10, width/2+500, width/2+950, width/2+2150, width/2+2850],
    }
    
    
    //mountains
   mountains = {
        x: [0, 1000, 2700, 3500, 4800],
        y: 200,
    }

    //flag
    flag = {
        x:3900,
        y:260,
        isReached: false,
    }
    flagSoundPlayed = false;

    //gem
    gem = {
        x: [650, 940, 1300, 1600, 1900, 2400, 3460],
        y:409,
        scale:1.0,
        isFound:[false, false, false, false, false, false, false],
    }
    
    //flowers
    flowers = {
        x: [100, 600, 1100, 1400, 2150, 2900, 3300, 4100],
        y: 376,
        colour_petals: [],
        colour_centre: []
    }

    for (var i = 0; i < flowers.x.length; i++) {
        flowers.colour_petals[i] = color(random(255), random(255), random(255));
        flowers.colour_centre[i] = color(255, random(255), random(255));
    }

    //sky
    galaxy = { 
        size : 2,
    }

    skyBuffer = createGraphics(width, height);
    drawStarsOnBuffer();
}

function drawMountains(mountains){
    noStroke();
    for (i=0; i<mountains.x.length; i++){
        fill(100,100,100);
        triangle(mountains.x[i]+50, 432, mountains.x[i]+200, 200, mountains.x[i]+350, 432);

        fill(80,80,80);
        beginShape();
            vertex(mountains.x[i]+200,200);
            vertex(mountains.x[i]+350,432);
            vertex(mountains.x[i]+320,432);
            vertex();
        endShape();
        
        fill(240);
        triangle(mountains.x[i]+168, 249, mountains.x[i]+200, 200, mountains.x[i]+232, 249);
        
        fill(200,200,200);
        beginShape();
            vertex(mountains.x[i]+200,200);
            vertex(mountains.x[i]+231,249);
            vertex(mountains.x[i]+225, 248);
            vertex();
        endShape();
    }
}

function drawTrees(trees){
    //draw the trees
    for (i=0; i<trees.treesPos_x.length; i++){
        //trunk
        fill(77,38,0);
        rect(
            trees.treesPos_x[i]+3,
            trees.treePos_y,
            50,
            120
        );

        //leaves
        fill(255, 183, 197);
        ellipse(
            trees.treesPos_x[i],
            trees.treePos_y,
            70,
            70
        );

        ellipse(
            trees.treesPos_x[i]+27,
            trees.treePos_y-42,
            70,
            70
        );

        ellipse(
            trees.treesPos_x[i]+60,
            trees.treePos_y,
            70,
            70
        );
        }
}

function drawFlag(flag){
    fill(139,156,173);
    
    if (flag.isReached == true){
        rect(
            flag.x,
            flag.y-8,
            10,
            180
        );

        ellipse(
            flag.x+5,
            flag.y-4,
            16,
            10
        );

        //flag
        fill(255);
        triangle(
            flag.x+10,
            flag.y,
            flag.x+10,
            flag.y+80,
            flag.x+100,
            flag.y+40
        );

        //crown
        stroke(255,215,0);
        strokeWeight(3);
        fill(255,215,0);
        beginShape();
        vertex(flag.x+21,flag.y+31);
        vertex(flag.x+21,flag.y+49);
        vertex(flag.x+49,flag.y+49);
        vertex(flag.x+49,flag.y+31);
        vertex(flag.x+42,flag.y+40);
        vertex(flag.x+35,flag.y+31);
        vertex(flag.x+28,flag.y+40);
        endShape(CLOSE);

        stroke(255,0,0);
        strokeWeight(5);
        point(flag.x+23,flag.y+40);
        stroke(0,255,0);
        point(flag.x+35,flag.y+40);
        stroke(0,0,255);
        point(flag.x+47,flag.y+40)
    
    }   else{
            rect(
            flag.x,
            flag.y-8,
            10,
            180
            );

            ellipse(
                flag.x+5,
                flag.y-4,
                16,
                10
            );

            //flag
            fill(255);
            triangle(
                flag.x+10,
                flag.y+90,
                flag.x+10,
                flag.y+170,
                flag.x+100,
                flag.y+130
            );
    }
}

function drawGem(gem){
    stroke(0);
    strokeWeight(1);
    fill(147, 112, 219);
    for (i=0; i<gem.x.length; i++){

        if (gem.isFound[i] == false){
            beginShape();
            vertex(
                gem.x[i], 
                gem.y
            );
            vertex(
                gem.x[i] + 17 * gem.scale,
                gem.y + 22 * gem.scale
            );
            vertex(
                gem.x[i] + 34 * gem.scale,
                gem.y
            );
            vertex(
                gem.x[i] + 17 * gem.scale + 9 * gem.scale,
                gem.y - 9 * gem.scale
            );
            vertex(
                gem.x[i] + 17 * gem.scale - 9 * gem.scale,
                gem.y - 9 * gem.scale
            );
            endShape(CLOSE);


            line(
                gem.x[i],
                gem.y,
                gem.x[i]+34 * gem.scale,
                gem.y
            );

            line(
                gem.x[i]+17 * gem.scale,
                gem.y+22 * gem.scale,
                gem.x[i]+10.6 * gem.scale,
                gem.y
            );

            line(
                gem.x[i]+17 * gem.scale,
                gem.y+22 * gem.scale,
                gem.x[i]+23.4 * gem.scale,
                gem.y
            );

            line(
                gem.x[i]+17 * gem.scale,
                gem.y+22 * gem.scale,
                gem.x[i]+8 * gem.scale,
                gem.y-9 * gem.scale
            );

            line(
                gem.x[i]+17 * gem.scale,
                gem.y+22 * gem.scale,
                gem.x[i]+26 * gem.scale,
                gem.y-9 * gem.scale
            );

            line(
                gem.x[i]+10.5 * gem.scale,
                gem.y,
                gem.x[i]+17 * gem.scale,
                gem.y-9 * gem.scale
            );

            line(
                gem.x[i]+23.5 * gem.scale,
                gem.y,
                gem.x[i]+17 * gem.scale,
                gem.y-9 * gem.scale
            );
        }
    }
}

function drawCharacter(){
    strokeWeight(0.5);
    if(isLeft && (isFalling || isPlummeting))
	{
		// add your jumping-left code
        //body
        stroke(0);
        fill(40, 45, 63);
        rect(gameChar_x-7,gameChar_y-40,17,28);

        //hood
        fill(255,0,0);
        ellipse(gameChar_x+1,gameChar_y-40,24,9);

        //face
        stroke(0);
        fill(251, 210, 180);
        ellipse(gameChar_x,gameChar_y-53,32,32);

        //eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x-11,gameChar_y-53,7,6);
        fill(139,69,19);
        ellipse(gameChar_x-13,gameChar_y-53,2,2);
        ellipse();

        //right leg
        fill(40,45,63);
        noStroke(255,0,0)
        beginShape();
        vertex(gameChar_x-11,gameChar_y-3.4);
        vertex(gameChar_x+8,gameChar_y-11);
        vertex(gameChar_x+5,gameChar_y-19);
        vertex(gameChar_x-13,gameChar_y-11);
        endShape();
        //right shoe
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x-13.1,gameChar_y-11);
        vertex(gameChar_x-10.5,gameChar_y-3.7);
        vertex(gameChar_x-13.5,gameChar_y-2.4);
        vertex(gameChar_x-16.4,gameChar_y-9.5);
        endShape(CLOSE);

        //left arm
        fill(40,45,63);    
        noStroke()
        beginShape();
        vertex(gameChar_x-5,gameChar_y-32);
        vertex(gameChar_x-18,gameChar_y-38.5);
        vertex(gameChar_x-20,gameChar_y-32.5);
        vertex(gameChar_x-6,gameChar_y-25);
        endShape(CLOSE);
        //left hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x-19,gameChar_y-39);
        vertex(gameChar_x-21,gameChar_y-32.8);
        vertex(gameChar_x-18,gameChar_y-31.4);
        vertex(gameChar_x-16.1,gameChar_y-37.6);
        endShape();

        //hair
        fill(249,205,212);
        strokeWeight(0.5);
        stroke(0);
        beginShape();
        vertex(gameChar_x-7,gameChar_y-58);
        vertex(gameChar_x-4,gameChar_y-62);
        vertex(gameChar_x-2,gameChar_y-57.5);
        vertex(gameChar_x,gameChar_y-60);
        vertex(gameChar_x+2,gameChar_y-58);
        vertex(gameChar_x+4,gameChar_y-61);
        vertex(gameChar_x+6,gameChar_y-57);
        vertex(gameChar_x+10,gameChar_y-61);
        vertex(gameChar_x+11,gameChar_y-58);
        vertex(gameChar_x+14,gameChar_y-61);
        vertex(gameChar_x+15,gameChar_y-58);
        vertex(gameChar_x+15,gameChar_y-61);
        vertex(gameChar_x+18,gameChar_y-59);
        vertex(gameChar_x+17,gameChar_y-61);
        vertex(gameChar_x+19,gameChar_y-62);
        vertex(gameChar_x+17,gameChar_y-63);
        vertex(gameChar_x+19,gameChar_y-66.3);
        vertex(gameChar_x+15,gameChar_y-65.8);
        vertex(gameChar_x+18,gameChar_y-70);
        vertex(gameChar_x+13,gameChar_y-69.2);
        vertex(gameChar_x+14,gameChar_y-73);
        vertex(gameChar_x+10,gameChar_y-70);
        vertex(gameChar_x+8,gameChar_y-74.5);
        vertex(gameChar_x+4,gameChar_y-71);
        vertex(gameChar_x+2,gameChar_y-74);
        vertex(gameChar_x,gameChar_y-70);
        vertex(gameChar_x-3,gameChar_y-74);
        vertex(gameChar_x-6,gameChar_y-69);
        vertex(gameChar_x-9,gameChar_y-73);
        vertex(gameChar_x-9,gameChar_y-69);
        vertex(gameChar_x-13,gameChar_y-72);
        vertex(gameChar_x-11,gameChar_y-69);
        vertex(gameChar_x-15,gameChar_y-70);
        vertex(gameChar_x-12,gameChar_y-67);
        vertex(gameChar_x-17,gameChar_y-67);
        vertex(gameChar_x-14,gameChar_y-64);
        vertex(gameChar_x-18,gameChar_y-63);
        vertex(gameChar_x-15,gameChar_y-62);
        vertex(gameChar_x-18,gameChar_y-59);
        vertex(gameChar_x-14,gameChar_y-60);
        vertex(gameChar_x-12,gameChar_y-57);
        vertex(gameChar_x-9,gameChar_y-61);
        endShape(CLOSE);

        //smile
        noFill();
        stroke(255);
        strokeWeight(0.8);
        beginShape();
        arc(gameChar_x-12.7, gameChar_y-48, 16, 8, 0.3, PI/2);
        endShape();

        strokeWeight(0.5);

	}
	else if(isRight && (isFalling || isPlummeting))
	{
		// add your jumping-right code
        //body
        stroke(0);
        fill(40, 45, 63);
        rect(gameChar_x-7,gameChar_y-40,16,28);

        //hood
        fill(255,0,0);
        ellipse(gameChar_x,gameChar_y-40,24,9);

        //face
        stroke(0);
        fill(251, 210, 180);
        ellipse(gameChar_x,gameChar_y-53,32,32);

        //eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x+11,gameChar_y-53,7,6);
        fill(139,69,19);
        ellipse(gameChar_x+13,gameChar_y-53,2,2);
        ellipse();

        //left leg
        fill(40,45,63);
        //noFill();
        noStroke(255,0,0)
        beginShape();
        vertex(gameChar_x-3,gameChar_y-11);
        vertex(gameChar_x+12,gameChar_y-4);
        vertex(gameChar_x+16,gameChar_y-10);
        vertex(gameChar_x+2,gameChar_y-18);
        endShape(CLOSE);
        //left shoe
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x+10.7,gameChar_y-4.5);
        vertex(gameChar_x+13.5,gameChar_y-3.3);
        vertex(gameChar_x+17,gameChar_y-9.5);
        vertex(gameChar_x+14.3,gameChar_y-11);
        endShape(CLOSE);

        //right arm
        fill(40,45,63);    
        noStroke()
        beginShape();
        vertex(gameChar_x+7,gameChar_y-33);
        vertex(gameChar_x+17,gameChar_y-37);
        vertex(gameChar_x+18.8,gameChar_y-32);
        vertex(gameChar_x+6,gameChar_y-26);
        endShape(CLOSE);
        //right hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x+16,gameChar_y-36.8);
        vertex(gameChar_x+18,gameChar_y-31.5);
        vertex(gameChar_x+20.7,gameChar_y-32.6);
        vertex(gameChar_x+18.9,gameChar_y-37.6);
        endShape();

        //hair
        fill(249,205,212);
        strokeWeight(0.5);
        stroke(0);
        beginShape();
        vertex(gameChar_x-7,gameChar_y-58);
        vertex(gameChar_x-4,gameChar_y-62);
        vertex(gameChar_x-2,gameChar_y-57.5);
        vertex(gameChar_x,gameChar_y-60);
        vertex(gameChar_x+2,gameChar_y-58);
        vertex(gameChar_x+4,gameChar_y-61);
        vertex(gameChar_x+6,gameChar_y-57);
        vertex(gameChar_x+10,gameChar_y-61);
        vertex(gameChar_x+11,gameChar_y-58);
        vertex(gameChar_x+14,gameChar_y-61);
        vertex(gameChar_x+15,gameChar_y-58);
        vertex(gameChar_x+15,gameChar_y-61);
        vertex(gameChar_x+18,gameChar_y-59);
        vertex(gameChar_x+17,gameChar_y-61);
        vertex(gameChar_x+19,gameChar_y-62);
        vertex(gameChar_x+17,gameChar_y-63);
        vertex(gameChar_x+19,gameChar_y-66.3);
        vertex(gameChar_x+15,gameChar_y-65.8);
        vertex(gameChar_x+18,gameChar_y-70);
        vertex(gameChar_x+13,gameChar_y-69.2);
        vertex(gameChar_x+14,gameChar_y-73);
        vertex(gameChar_x+10,gameChar_y-70);
        vertex(gameChar_x+8,gameChar_y-74.5);
        vertex(gameChar_x+4,gameChar_y-71);
        vertex(gameChar_x+2,gameChar_y-74);
        vertex(gameChar_x,gameChar_y-70);
        vertex(gameChar_x-3,gameChar_y-74);
        vertex(gameChar_x-6,gameChar_y-69);
        vertex(gameChar_x-9,gameChar_y-73);
        vertex(gameChar_x-9,gameChar_y-69);
        vertex(gameChar_x-13,gameChar_y-72);
        vertex(gameChar_x-11,gameChar_y-69);
        vertex(gameChar_x-15,gameChar_y-70);
        vertex(gameChar_x-12,gameChar_y-67);
        vertex(gameChar_x-17,gameChar_y-67);
        vertex(gameChar_x-14,gameChar_y-64);
        vertex(gameChar_x-18,gameChar_y-63);
        vertex(gameChar_x-15,gameChar_y-62);
        vertex(gameChar_x-17,gameChar_y-59);
        vertex(gameChar_x-14,gameChar_y-60);
        vertex(gameChar_x-12,gameChar_y-57);
        vertex(gameChar_x-9,gameChar_y-61);
        endShape(CLOSE);

        //smile
        noFill();
        stroke(255);
        strokeWeight(0.8);
        beginShape();
        arc(gameChar_x+12.4, gameChar_y-48, 16, 8, HALF_PI, PI-0.2);
        endShape();

        strokeWeight(0.5);

	}
	else if(isLeft)
	{
		// add your walking left code
        //body
        stroke(0);
        fill(40, 45, 63);
        rect(gameChar_x-8,gameChar_y-40,18,28);

        //hood
        fill(255,0,0);
        ellipse(gameChar_x+1,gameChar_y-40,24,9);

        //face
        stroke(0);
        fill(251, 210, 180);
        ellipse(gameChar_x,gameChar_y-53,32,32);

        //eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x-11,gameChar_y-53,7,6);
        fill(139,69,19);
        ellipse(gameChar_x-13,gameChar_y-53,2,2);
        ellipse();

        //right leg
        fill(40,45,63);
        noStroke(255,0,0)
        beginShape();
        vertex(gameChar_x+2,gameChar_y-16);
        vertex(gameChar_x-2,gameChar_y-2);
        vertex(gameChar_x-10,gameChar_y-1);
        vertex(gameChar_x-6,gameChar_y-17);
        endShape(CLOSE);
        //right shoe
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x-10.6,gameChar_y+1);
        vertex(gameChar_x-3,gameChar_y+2);
        vertex(gameChar_x-2,gameChar_y-2);
        vertex(gameChar_x-9.6,gameChar_y-3);
        endShape(CLOSE);

        //left leg
        fill(40,45,63);
        noStroke();
        beginShape();
        vertex(gameChar_x+1,gameChar_y-16.3);
        vertex(gameChar_x+4,gameChar_y+2);
        vertex(gameChar_x+12,gameChar_y);
        vertex(gameChar_x+9,gameChar_y-17);
        endShape(CLOSE);
        //left shoe
        stroke(255,0,0);
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x+3.7,gameChar_y-1.3);
        vertex(gameChar_x+4.3,gameChar_y+1.8);
        vertex(gameChar_x+11.8,gameChar_y);
        vertex(gameChar_x+11.1,gameChar_y-3);
        endShape(CLOSE);

        //left arm
        fill(40,45,63);    
        noStroke()
        beginShape();
        vertex(gameChar_x-15,gameChar_y-22);
        vertex(gameChar_x-17,gameChar_y-29);
        vertex(gameChar_x-5,gameChar_y-35);
        vertex(gameChar_x-4,gameChar_y-27);
        endShape(CLOSE);
        //left hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x-17,gameChar_y-21);
        vertex(gameChar_x-18.9,gameChar_y-28);
        vertex(gameChar_x-16,gameChar_y-29.7);
        vertex(gameChar_x-14,gameChar_y-22.4);
        endShape();

        //hair
        fill(249,205,212);
        strokeWeight(0.5);
        stroke(0);
        beginShape();
        vertex(gameChar_x-7,gameChar_y-58);
        vertex(gameChar_x-4,gameChar_y-62);
        vertex(gameChar_x-2,gameChar_y-57.5);
        vertex(gameChar_x,gameChar_y-60);
        vertex(gameChar_x+2,gameChar_y-58);
        vertex(gameChar_x+4,gameChar_y-61);
        vertex(gameChar_x+6,gameChar_y-57);
        vertex(gameChar_x+10,gameChar_y-61);
        vertex(gameChar_x+11,gameChar_y-58);
        vertex(gameChar_x+13,gameChar_y-61);
        vertex(gameChar_x+14,gameChar_y-57);
        vertex(gameChar_x+15,gameChar_y-59);
        vertex(gameChar_x+19,gameChar_y-58);
        vertex(gameChar_x+17,gameChar_y-60);
        vertex(gameChar_x+19,gameChar_y-61);
        vertex(gameChar_x+18,gameChar_y-62);
        vertex(gameChar_x+17,gameChar_y-63);
        vertex(gameChar_x+19,gameChar_y-65.5);
        vertex(gameChar_x+16,gameChar_y-67);
        vertex(gameChar_x+18,gameChar_y-70);
        vertex(gameChar_x+13,gameChar_y-69.2);
        vertex(gameChar_x+13,gameChar_y-73);
        vertex(gameChar_x+10,gameChar_y-70);
        vertex(gameChar_x+8,gameChar_y-74.5);
        vertex(gameChar_x+4,gameChar_y-71);
        vertex(gameChar_x+2,gameChar_y-74);
        vertex(gameChar_x,gameChar_y-70);
        vertex(gameChar_x-3,gameChar_y-74);
        vertex(gameChar_x-6,gameChar_y-69);
        vertex(gameChar_x-9,gameChar_y-73);
        vertex(gameChar_x-9,gameChar_y-69);
        vertex(gameChar_x-13,gameChar_y-72);
        vertex(gameChar_x-11,gameChar_y-69);
        vertex(gameChar_x-15,gameChar_y-70);
        vertex(gameChar_x-12,gameChar_y-67);
        vertex(gameChar_x-17,gameChar_y-67);
        vertex(gameChar_x-14,gameChar_y-64);
        vertex(gameChar_x-18,gameChar_y-63);
        vertex(gameChar_x-15,gameChar_y-62);
        vertex(gameChar_x-18,gameChar_y-59);
        vertex(gameChar_x-14,gameChar_y-61);
        vertex(gameChar_x-12,gameChar_y-57);
        vertex(gameChar_x-9,gameChar_y-61);
        endShape(CLOSE);

        //smile
        noFill();
        stroke(255);
        strokeWeight(0.8);
        beginShape();
        arc(gameChar_x-12.7, gameChar_y-48, 16, 8, 0.3, PI/2);
        endShape();

        strokeWeight(0.5);

	}
	else if(isRight)
	{
		// add your walking right code
        //body
        stroke(0);
        fill(40, 45, 63);
        rect(gameChar_x-8,gameChar_y-40,18,28);

        //hood
        fill(255,0,0);
        ellipse(gameChar_x,gameChar_y-40,24,9);

        //face
        stroke(0);
        fill(251, 210, 180);
        ellipse(gameChar_x,gameChar_y-53,32,32);

        //eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x+11,gameChar_y-53,7,6);
        fill(139,69,19);
        ellipse(gameChar_x+13,gameChar_y-53,2,2);
        ellipse();

        //left leg
        fill(40,45,63);
        //noFill();
        noStroke(255,0,0)
        beginShape();
        vertex(gameChar_x+3,gameChar_y-16);
        vertex(gameChar_x-2,gameChar_y+2);
        vertex(gameChar_x-10,gameChar_y-1);
        vertex(gameChar_x-6,gameChar_y-17);
        endShape(CLOSE);
        //left shoe
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x-10,gameChar_y-1);
        vertex(gameChar_x-2,gameChar_y+2);
        vertex(gameChar_x-1,gameChar_y-1);
        vertex(gameChar_x-9.1,gameChar_y-4);
        endShape(CLOSE);

        //right leg
        fill(40,45,63);
        noStroke();
        beginShape();
        vertex(gameChar_x+1,gameChar_y-16);
        vertex(gameChar_x+3.8,gameChar_y+2);
        vertex(gameChar_x+12,gameChar_y);
        vertex(gameChar_x+9,gameChar_y-17);
        endShape(CLOSE);
        //right shoe
        stroke(255,0,0);
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x+3.7,gameChar_y-1);
        vertex(gameChar_x+4.1,gameChar_y+1.7);
        vertex(gameChar_x+11.9,gameChar_y+0.3);
        vertex(gameChar_x+11.2,gameChar_y-2.7);
        endShape(CLOSE);

        //right arm
        fill(40,45,63);    
        noStroke()
        beginShape();
        vertex(gameChar_x+13,gameChar_y-21);
        vertex(gameChar_x+17,gameChar_y-27);
        vertex(gameChar_x+7,gameChar_y-35);
        vertex(gameChar_x+8,gameChar_y-26);
        endShape(CLOSE);
        //right hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x+13,gameChar_y-21);
        vertex(gameChar_x+17,gameChar_y-27);
        vertex(gameChar_x+19,gameChar_y-25);
        vertex(gameChar_x+15,gameChar_y-19);
        endShape();

        //hair
        fill(249,205,212);
        strokeWeight(0.5);
        stroke(0);
        beginShape();
        vertex(gameChar_x-7,gameChar_y-58);
        vertex(gameChar_x-4,gameChar_y-62);
        vertex(gameChar_x-2,gameChar_y-57.5);
        vertex(gameChar_x,gameChar_y-60);
        vertex(gameChar_x+2,gameChar_y-58);
        vertex(gameChar_x+4,gameChar_y-61);
        vertex(gameChar_x+6,gameChar_y-57);
        vertex(gameChar_x+10,gameChar_y-61);
        vertex(gameChar_x+11,gameChar_y-58);
        vertex(gameChar_x+14,gameChar_y-61);
        vertex(gameChar_x+15,gameChar_y-57);
        vertex(gameChar_x+15.6,gameChar_y-60);
        vertex(gameChar_x+18,gameChar_y-58);
        vertex(gameChar_x+17,gameChar_y-61);
        vertex(gameChar_x+19,gameChar_y-61);
        vertex(gameChar_x+17,gameChar_y-64);
        vertex(gameChar_x+19,gameChar_y-65.5);
        vertex(gameChar_x+15,gameChar_y-67);
        vertex(gameChar_x+18,gameChar_y-70);
        vertex(gameChar_x+13,gameChar_y-69.2);
        vertex(gameChar_x+14,gameChar_y-73);
        vertex(gameChar_x+10,gameChar_y-70);
        vertex(gameChar_x+8,gameChar_y-74.5);
        vertex(gameChar_x+4,gameChar_y-70.5);
        vertex(gameChar_x+2,gameChar_y-74);
        vertex(gameChar_x,gameChar_y-70);
        vertex(gameChar_x-3,gameChar_y-74);
        vertex(gameChar_x-6,gameChar_y-69);
        vertex(gameChar_x-9,gameChar_y-73);
        vertex(gameChar_x-9,gameChar_y-69);
        vertex(gameChar_x-13,gameChar_y-72);
        vertex(gameChar_x-11,gameChar_y-69);
        vertex(gameChar_x-15,gameChar_y-70);
        vertex(gameChar_x-12,gameChar_y-67);
        vertex(gameChar_x-17,gameChar_y-67);
        vertex(gameChar_x-14,gameChar_y-64);
        vertex(gameChar_x-18,gameChar_y-63);
        vertex(gameChar_x-15,gameChar_y-62);
        vertex(gameChar_x-18,gameChar_y-59);
        vertex(gameChar_x-13,gameChar_y-61);
        vertex(gameChar_x-12,gameChar_y-57);
        vertex(gameChar_x-9,gameChar_y-61);
        endShape(CLOSE);

        //smile
        noFill();
        stroke(255);
        strokeWeight(0.8);
        beginShape();
        arc(gameChar_x+12.2, gameChar_y-48, 16, 8, HALF_PI, PI-0.2);
        vertex(100, 300);
        endShape();
    
        strokeWeight(0.5);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        //body
        stroke(0);
        fill(40, 45, 63);
        rect(gameChar_x-10,gameChar_y-34,20,23);

        //hood
        fill(255,0,0);
        ellipse(gameChar_x,gameChar_y-36,24,8);

        //face
        stroke(0);
        fill(251, 210, 180);
        ellipse(gameChar_x,gameChar_y-50,33,33);

        //mouth
        fill(255)
        strokeWeight(0.1)
        ellipse(gameChar_x,gameChar_y-43,10,10);
        stroke(0);
        line(gameChar_x-4.5,gameChar_y-41,gameChar_x+4.5,gameChar_y-41);

        //face 2
        noStroke();
        fill(251,210,180);
        rect(gameChar_x-7,gameChar_y-49,17,8);

        strokeWeight(1);

        //left eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x-6,gameChar_y-48,7,6);
        fill(139,69,19);
        ellipse(gameChar_x-6,gameChar_y-48,2,2);

        //right eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x+6,gameChar_y-48,7,6);
        fill(139,69,19);
        ellipse(gameChar_x+6,gameChar_y-48,2,2);

        //left leg
        stroke(0);
        fill(40, 45, 63);
        beginShape();
        vertex(gameChar_x-10,gameChar_y-14);
        vertex(gameChar_x-13,gameChar_y-3);
        vertex(gameChar_x-6,gameChar_y-1.5);
        vertex(gameChar_x-2,gameChar_y-15);
        endShape(CLOSE);
        //left shoe
        noStroke(0);
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x-12,gameChar_y-7.7);
        vertex(gameChar_x-13.3,gameChar_y-2.9);
        vertex(gameChar_x-6,gameChar_y-1.5);
        vertex(gameChar_x-4.4,gameChar_y-7);
        endShape(CLOSE);

        fill(40, 45, 63);
        noStroke();

        //right leg
        strokeWeight(0.1);
        stroke(0);
        beginShape();
        vertex(gameChar_x+10,gameChar_y-15);
        vertex(gameChar_x+12,gameChar_y-3);
        vertex(gameChar_x+5,gameChar_y-1.5);
        vertex(gameChar_x+2,gameChar_y-15);
        endShape(CLOSE);
        //right shoe
        noStroke(0);
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x+4,gameChar_y-6.4);
        vertex(gameChar_x+5,gameChar_y-1.3);
        vertex(gameChar_x+12,gameChar_y-3);
        vertex(gameChar_x+11.3,gameChar_y-7.9);
        endShape(CLOSE);

        fill(40, 45, 63);
        noStroke();

        //left arm
        beginShape();
        vertex(gameChar_x-20,gameChar_y-37);
        vertex(gameChar_x-22,gameChar_y-31);
        vertex(gameChar_x-9,gameChar_y-23);
        vertex(gameChar_x-7,gameChar_y-30);
        endShape();
        //left hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x-18,gameChar_y-36);
        vertex(gameChar_x-20,gameChar_y-29.9);
        vertex(gameChar_x-23,gameChar_y-31.4);
        vertex(gameChar_x-21,gameChar_y-37.5);
        endShape();

        //right arm
        fill(40, 45, 63);
        noStroke();
        beginShape();
        vertex(gameChar_x+20,gameChar_y-36);
        vertex(gameChar_x+20.5,gameChar_y-29);
        vertex(gameChar_x+7,gameChar_y-22);
        vertex(gameChar_x+9,gameChar_y-30);
        endShape();
        //right hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x+18,gameChar_y-34.9);
        vertex(gameChar_x+19,gameChar_y-28);
        vertex(gameChar_x+22,gameChar_y-30);
        vertex(gameChar_x+21,gameChar_y-36.7);
        endShape(CLOSE);

        //hair
        fill(249,205,212);
        strokeWeight(0.5);
        stroke(0);
        beginShape();
        vertex(gameChar_x+16,gameChar_y-59);
        vertex(gameChar_x+20,gameChar_y-61);
        vertex(gameChar_x+16,gameChar_y-62);
        vertex(gameChar_x+19,gameChar_y-65);
        vertex(gameChar_x+16,gameChar_y-65);
        vertex(gameChar_x+17,gameChar_y-68);
        vertex(gameChar_x+14,gameChar_y-66);
        vertex(gameChar_x+14,gameChar_y-70);
        vertex(gameChar_x+11,gameChar_y-68);
        vertex(gameChar_x+10,gameChar_y-71.5);
        vertex(gameChar_x+8,gameChar_y-68);
        vertex(gameChar_x+7,gameChar_y-71);
        vertex(gameChar_x+5,gameChar_y-69);
        vertex(gameChar_x+3,gameChar_y-71.5);
        vertex(gameChar_x+1,gameChar_y-68);
        vertex(gameChar_x-1,gameChar_y-72);
        vertex(gameChar_x-4,gameChar_y-68);
        vertex(gameChar_x-7,gameChar_y-71);
        vertex(gameChar_x-9,gameChar_y-67);
        vertex(gameChar_x-12,gameChar_y-71);
        vertex(gameChar_x-13,gameChar_y-66);
        vertex(gameChar_x-15,gameChar_y-69);
        vertex(gameChar_x-15,gameChar_y-65);
        vertex(gameChar_x-19,gameChar_y-66);
        vertex(gameChar_x-16,gameChar_y-63);
        vertex(gameChar_x-20,gameChar_y-63);
        vertex(gameChar_x-17,gameChar_y-61);
        vertex(gameChar_x-20,gameChar_y-59);
        vertex(gameChar_x-16,gameChar_y-58);
        vertex(gameChar_x-18,gameChar_y-55);
        vertex(gameChar_x-15,gameChar_y-57);
        vertex(gameChar_x-15,gameChar_y-53);
        vertex(gameChar_x-13,gameChar_y-56);
        vertex(gameChar_x-11,gameChar_y-52);
        vertex(gameChar_x-9,gameChar_y-56);
        vertex(gameChar_x-7,gameChar_y-53);
        vertex(gameChar_x-4,gameChar_y-58);
        vertex(gameChar_x-2,gameChar_y-55);
        vertex(gameChar_x+1,gameChar_y-59);
        vertex(gameChar_x+3,gameChar_y-55);
        vertex(gameChar_x+5,gameChar_y-59);
        vertex(gameChar_x+7,gameChar_y-55);
        vertex(gameChar_x+9,gameChar_y-59);
        vertex(gameChar_x+11,gameChar_y-54);
        vertex(gameChar_x+12,gameChar_y-58);
        vertex(gameChar_x+14,gameChar_y-54);
        vertex(gameChar_x+15,gameChar_y-57);
        vertex(gameChar_x+18,gameChar_y-56);
        endShape(CLOSE);

        //uniform
        stroke(32, 37, 55);
        strokeWeight(1.5);
        line(gameChar_x+6,gameChar_y-31,gameChar_x+6,gameChar_y-15.5);

        strokeWeight(3);
        stroke(255,215,0);
        point(gameChar_x+6,gameChar_y-30.3);

        strokeWeight(0.5);

	}
	else
	{
		// add your standing front facing code
        //body
        stroke(0);
        fill(40, 45, 63);
        rect(gameChar_x-10,gameChar_y-34,20,23);
    
        //hood
        fill(255,0,0);
        ellipse(gameChar_x,gameChar_y-36,24,8);
    
        //face
        stroke(0);
        fill(251, 210, 180);
        ellipse(gameChar_x,gameChar_y-50,33,33);
    
        //mouth
        fill(255)
        strokeWeight(0.1)
        ellipse(gameChar_x,gameChar_y-43,10,10);
        stroke(0);
        line(gameChar_x-4.5,gameChar_y-41,gameChar_x+4.5,gameChar_y-41);

        //face 2
        noStroke();
        fill(251,210,180);
        rect(gameChar_x-7,gameChar_y-49,17,8);

        strokeWeight(1);

        //left eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x-6,gameChar_y-48,7,6);
        fill(139,69,19);
        ellipse(gameChar_x-6,gameChar_y-48,2,2);

        //right eye
        strokeWeight(0.1);
        stroke(0);
        fill(255);
        ellipse(gameChar_x+6,gameChar_y-48,7,6);
        fill(139,69,19);
        ellipse(gameChar_x+6,gameChar_y-48,2,2);

        //left leg
        noStroke();
        fill(40, 45, 63);
        beginShape();
        vertex(gameChar_x-10,gameChar_y-11);
        vertex(gameChar_x-13,gameChar_y+1);
        vertex(gameChar_x-6,gameChar_y+2.5);
        vertex(gameChar_x-2,gameChar_y-11);
        endShape(CLOSE);
        //left shoe
        stroke(255,0,0);
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x-12,gameChar_y-1.5);
        vertex(gameChar_x-12.7,gameChar_y+1);
        vertex(gameChar_x-6.2,gameChar_y+2.4);
        vertex(gameChar_x-5.5,gameChar_y);
        endShape(CLOSE);
    
        fill(40, 45, 63);
        noStroke();

        //right leg
        beginShape();
        vertex(gameChar_x+10,gameChar_y-11);
        vertex(gameChar_x+12,gameChar_y+1);
        vertex(gameChar_x+5,gameChar_y+2.5);
        vertex(gameChar_x+2,gameChar_y-11);
        endShape(CLOSE);
        //right shoe
        stroke(255,0,0);
        strokeWeight(0.5);
        fill(255,0,0);
        beginShape();
        vertex(gameChar_x+4.6,gameChar_y);
        vertex(gameChar_x+5,gameChar_y+2.3);
        vertex(gameChar_x+11.8,gameChar_y+1);
        vertex(gameChar_x+11.3,gameChar_y-1.5);
        endShape(CLOSE);

        fill(40, 45, 63);
        noStroke();

        //left arm
        beginShape();
        vertex(gameChar_x-10,gameChar_y-31);
        vertex(gameChar_x-20,gameChar_y-20);
        vertex(gameChar_x-14,gameChar_y-17);
        vertex(gameChar_x-10,gameChar_y-21);
        vertex();
        endShape();
        //left hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x-20,gameChar_y-20);
        vertex(gameChar_x-21.7,gameChar_y-18);
        vertex(gameChar_x-15.3,gameChar_y-15);
        vertex(gameChar_x-14,gameChar_y-17);
        endShape();

        //right arm
        fill(40, 45, 63);
        noStroke();
        beginShape();
        vertex(gameChar_x+10,gameChar_y-31);
        vertex(gameChar_x+20,gameChar_y-22);
        vertex(gameChar_x+17,gameChar_y-17);
        vertex(gameChar_x+10,gameChar_y-22);
        endShape();
        //right hand
        noStroke();
        fill(251,210,180);
        beginShape();
        vertex(gameChar_x+17,gameChar_y-17);
        vertex(gameChar_x+19,gameChar_y-15.3);
        vertex(gameChar_x+21,gameChar_y-21.3);
        vertex(gameChar_x+19,gameChar_y-23);
        endShape(CLOSE);

        //hair
        fill(249,205,212);
        strokeWeight(0.5);
        stroke(0);
        beginShape();
        vertex(gameChar_x+16,gameChar_y-59);
        vertex(gameChar_x+20,gameChar_y-61);
        vertex(gameChar_x+16,gameChar_y-62);
        vertex(gameChar_x+19,gameChar_y-65);
        vertex(gameChar_x+16,gameChar_y-65);
        vertex(gameChar_x+17,gameChar_y-68);
        vertex(gameChar_x+14,gameChar_y-66);
        vertex(gameChar_x+14,gameChar_y-70);
        vertex(gameChar_x+11,gameChar_y-68);
        vertex(gameChar_x+10,gameChar_y-71.5);
        vertex(gameChar_x+8,gameChar_y-68);
        vertex(gameChar_x+7,gameChar_y-71);
        vertex(gameChar_x+5,gameChar_y-69);
        vertex(gameChar_x+3,gameChar_y-71.5);
        vertex(gameChar_x+1,gameChar_y-68);
        vertex(gameChar_x-1,gameChar_y-72);
        vertex(gameChar_x-4,gameChar_y-68);
        vertex(gameChar_x-7,gameChar_y-71);
        vertex(gameChar_x-9,gameChar_y-67);
        vertex(gameChar_x-12,gameChar_y-71);
        vertex(gameChar_x-13,gameChar_y-66);
        vertex(gameChar_x-16,gameChar_y-69);
        vertex(gameChar_x-15,gameChar_y-65);
        vertex(gameChar_x-19,gameChar_y-66);
        vertex(gameChar_x-16,gameChar_y-63);
        vertex(gameChar_x-20,gameChar_y-63);
        vertex(gameChar_x-17,gameChar_y-61);
        vertex(gameChar_x-20,gameChar_y-59);
        vertex(gameChar_x-16,gameChar_y-58);
        vertex(gameChar_x-18,gameChar_y-55);
        vertex(gameChar_x-15,gameChar_y-57);
        vertex(gameChar_x-15,gameChar_y-53);
        vertex(gameChar_x-13,gameChar_y-56);
        vertex(gameChar_x-11,gameChar_y-52);
        vertex(gameChar_x-9,gameChar_y-56);
        vertex(gameChar_x-7,gameChar_y-53);
        vertex(gameChar_x-4,gameChar_y-58);
        vertex(gameChar_x-2,gameChar_y-55);
        vertex(gameChar_x+1,gameChar_y-59);
        vertex(gameChar_x+3,gameChar_y-55);
        vertex(gameChar_x+5,gameChar_y-59);
        vertex(gameChar_x+7,gameChar_y-55);
        vertex(gameChar_x+9,gameChar_y-59);
        vertex(gameChar_x+11,gameChar_y-54);
        vertex(gameChar_x+12,gameChar_y-58);
        vertex(gameChar_x+14,gameChar_y-54);
        vertex(gameChar_x+15,gameChar_y-57);
        vertex(gameChar_x+18,gameChar_y-56);
        endShape(CLOSE);

        //uniform
        stroke(32, 37, 55);
        strokeWeight(1.5);
        line(gameChar_x+6,gameChar_y-31,gameChar_x+6,gameChar_y-13);

        strokeWeight(3);
        stroke(255,215,0);
        point(gameChar_x+6,gameChar_y-30.3);

        strokeWeight(0.5);

	}
}

function drawCanyons(canyon){
    noStroke();
    fill(92, 40, 0);
    for (i = 0; i < canyon.x_pos.length; i++){
        rect(canyon.x_pos[i], floorPos_y, canyon.width[i], height -floorPos_y);
    }
}

function gameOverFunction(){
    if (gameOver){
        //game over text
        fill("black")
        stroke("black")
        textFont("FixedSys");
        textSize(80);
        text("Game Over", width/2-180, height/2-100);

        //press space to restart text
        fill("black")
        stroke("black")
        textFont("FixedSys");
        textSize(20);
        text("Press Space to Restart", width/2-90, height/2-50);

        if (!canyonSoundPlayed) {
            canyonSound.play();
            canyonSoundPlayed = true;
        }
    }
}

function levelCompleteFunction(){
     //level complete
     if (levelComplete){
        //level complete text
        fill("green")
        stroke("green")
        textFont("FixedSys");
        textSize(80);
        text("Level Complete", width/2-240, height/2-100);

        //press space to restart text
        fill("green")
        stroke("green")
        textFont("FixedSys");
        textSize(20);
        text("Press Space to Restart", width/2-100, height/2-50);
    }
}   

function gameScoreFunction(){
    //game score
    fill("black")
    stroke("black")
    textFont("FixedSys");
    textSize(20);
    text("Score: " + gameScore, 20, 25);
}

function drawFuji(){
      // Base of the mountain
      noStroke();
      fill(90); 
      beginShape();
      //base left
      vertex(width/2+1250, 432);
      //peak left
      vertex(width/2+1418, 150);
      //peak right
      vertex(width/2+1632, 150); 
      //base right
      vertex(width/2+ 1800, 432);
      endShape(CLOSE);
  
      //snow top
      fill(255); 
      beginShape();
      //base left
      vertex(width/2+1400, 180);
      //peak left
      vertex(width/2+1450, 100);
      //peak right
      vertex(width/2+1600, 100);
      //base right
      vertex(width/2+1650, 180);
      //snow spikes
      vertex(2129, 250);
      vertex(2064, 200);
      vertex(2021, 242);
      vertex(1973, 192);
      vertex(1938, 228);
      endShape(CLOSE);
}

function drawHills(){
    //green hills
    for (i = 0; i < width; i++){
        fill(60, 145, 57);
        arc(50+i*900, floorPos_y, 650, 80, PI, TWO_PI);
        fill(69, 168, 66);
        arc(440+i*900, floorPos_y, 650, 80, PI, TWO_PI);
    }
}

function gradientSky(){
    skyColour_1 = color(0, 51, 102);
    skyColour_2 = color(204, 153, 255);

    for(i=0; i<height; i++){
        n = map(i,0,height,0,1);
        new_colour = lerpColor(skyColour_1,skyColour_2,n);
        stroke(new_colour);
        line(0,i,width, i);
    }
}

function drawStarsOnBuffer() {
    skyBuffer.fill(255);
    skyBuffer.noStroke();
    for (let i = 0; i < 70; i++) {
        skyBuffer.ellipse(random(width), random(0, 134), galaxy.size, galaxy.size);
    }
}

function drawFlowers(){
    for (i = 0; i < flowers.x.length; i++) {
        //stem
        stroke(0,105,0);
        strokeWeight(2);
        line(flowers.x[i]-12,flowers.y+5,flowers.x[i]-12,flowers.y+55)

        //petals
        noStroke();
        fill(flowers.colour_petals[i]);
        ellipse(flowers.x[i]-15,flowers.y+20,  20,20)
        ellipse(flowers.x[i],flowers.y+15,  20,20)
        ellipse(flowers.x[i]-25,flowers.y+10,  20,20)
        ellipse(flowers.x[i]-17,flowers.y-5,  20,20)
        ellipse(flowers.x[i],flowers.y,  20,  20)
        
        //centre
        fill (flowers.colour_centre[i]);
        ellipse(flowers.x[i]-12,flowers.y+8,  22,22) 
    }
}

function draw()
{

	///////////DRAWING CODE//////////
    if (isRight){
        cameraPosX +=4
    }
    if (isLeft){
        cameraPosX -=4
    }

    //sky 
    gradientSky();
    image(skyBuffer, 0, 0);

    //green ground
    noStroke();
    fill(0,155,0);
    rect(0, floorPos_y, 10000, height - floorPos_y); 
    
    push();
    translate(-cameraPosX, 0);

    //mount fuji
    drawFuji();

    //3d mountains
    drawMountains(mountains);
    
    //green hills
    drawHills();

    //trees
    drawTrees(trees);
    
    //flowers
    drawFlowers();
    
    //draw the canyon
	drawCanyons(canyon);
    
    //flag pole 
    drawFlag(flag);
    
    //gem
    drawGem(gem);
    
	//the game character
	drawCharacter();
    
    pop();

    //game over
    gameOverFunction();

    //level complete
    levelCompleteFunction();

    //game score
    gameScoreFunction();

	///////////INTERACTION CODE//////////

    //moving left
    if (isLeft == true){
        gameChar_x-=4;
    }
    
    //moving right
    if (isRight == true){
        gameChar_x+=4;
    }
    
    //falling
    if (gameChar_y < floorPos_y){
        gameChar_y+=2.0;
        isFalling = true
    }else{
        isFalling = false
    }

    //gem collected interaction
    for (i = 0; i < gem.x.length; i++) {
        if (dist(gem.x[i] + 17, gem.y + 20, gameChar_x, gameChar_y) < 30 && !gem.isFound[i]) {
            gem.isFound[i] = true;
            gameScore += 1;
        }
    }


    //flag reached interaction 
    if (flag.x < gameChar_x+14 && gameChar_y > 270){
        flag.isReached = true;
        levelComplete = true;
        isLeft = false;
        isRight = false;
        
        if (!flagSoundPlayed) {
            flagSound.play();
            flagSoundPlayed = true;
        }
    }
    
    //character in canyon
    for (i = 0; i < canyon.x_pos.length; i++){
        if (gameChar_x > canyon.x_pos[i]+8 && gameChar_x < canyon.x_pos[i]-8 + canyon.width[i] && gameChar_y == floorPos_y){
            isPlummeting = true;
            isLeft = false;
            isRight = false;
        }
   }
    
    //character plummeting down canyon
    if (isPlummeting == true){
        gameChar_y += 3.0;
        if (gameChar_y > height){
            gameOver = true;
        }
    }

    //prevent character from leaving map
    if (gameChar_x < 350){
        gameChar_x = 350;
        isLeft = false;
    }

}


function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
    
    //press space to restart
    if((gameOver || levelComplete) && key == ' ')
    {
        window.location.reload();
        return;
    }

    // if game over or level complete, user cannot move
    if (gameOver || levelComplete){
        return;
    }

    //if character is plummeting, user cannot move
    if (isPlummeting) return;
    
    // Play sound on user interaction (Chrome requires user intraction to play sound)
    backgroundSound.setVolume(0.1);
    backgroundSound.play();
      
    //movement
    if (key == 'a'){
        isLeft = true;
    }

     if (key == 'd'){
        isRight = true;
    }

    // character jump (prevents double jump)
    if (gameChar_y == floorPos_y){
        if (key == 'w'){
            gameChar_y -= 100; 
        }
    }
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
     if (key == 'a'){
        isLeft = false;
    }
    
     if (key == 'd'){
        isRight = false;
    }
}



/*MUSIC CREDITS
Yugen - Emotional Ethnic Music by Keys of Moon | https://soundcloud.com/keysofmoon
Attribution 4.0 International (CC BY 4.0)
https://creativecommons.org/licenses/by/4.0/
Music promoted by https://www.chosic.com/free-music/all/
*/