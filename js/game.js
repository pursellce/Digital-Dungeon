
// Declaring variables. Any new objects added must be set up here.
var myGamePiece;
var wall = [];
var myObstacles = [];
var myScore;
var Frame;
var LastX;
var LastY;
var ladder;
var treasure = [];
var score = 0;
var myUpBtn, myDownBtn, myLeftBtn, myRightBtn;



function startGame() {
    myGamePiece = new component(30,30,"red",450,400,"icon", "images/player.png");//30, 30, "red", 10, 120);
    //myGamePiece.gravity = 0.05;  // Commenting this out disables gravity. Will probably fully remove gravity later.
    myScore = new component("30px", "Consolas", "black", 280, 40, "text","");
	Frame = new component("30px", "Consolas", "grey", 510, 40, "text", "");
	myUpBtn = new component(30, 30, "blue", 50, 10);
	myDownBtn = new component(30, 30, "blue", 50, 70);
	myLeftBtn = new component(30, 30, "blue", 20, 40);
	myRightBtn = new component(30, 30, "blue", 80, 40);
	GenerateLevel1();
    myGameArea.start();
}


// Function used to generate level 1.
function GenerateLevel1() {
	// (width, height, color, x, y, type, imag)
	// First 4 walls drawn are the border walls. EVERY LEVEL MUST HAVE THESE!
	wall.push(new component(10, 540, "green", 0, 0, "icon", "images/wall.jpg"));
	wall.push(new component(960, 10, "green", 0, 0, "icon", "images/wall.jpg"));
	wall.push(new component(10, 540, "green", 950, 0, "icon", "images/wall.jpg"));
	wall.push(new component(960, 10, "green", 0, 530, "icon", "images/wall.jpg"));
	
	// Additional walls for the level's unique design.
	wall.push(new component(100, 100, "green", 325, 165, "icon", "images/wall.jpg"));
	
	// Objects that the level has.
	ladder = new component(30, 30, "red", 800, 400, "icon", "images/ladder.png");
	treasure.push(new component(35, 35, "gold", 60, 100, "icon", "images/Treasure.png"));
	treasure.push(new component(35, 35, "gold", 800, 200, "icon", "images/Treasure.png"));
	// wall.push(new component(960, 10, "green", 100, 30, "icon", "images/Treasure.jpg"));
	
}

// This section basically sets up the game window
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 960;
        this.canvas.height = 540;
        this.context = this.canvas.getContext("2d");/*2d here means a 2d landscape*/
        
        document.body.insertBefore(this.canvas, document.body.childNodes[25]);/*adjust node number to move game*/
        this.canvas.style = "position:absolute; left: 50%; width: 800px; margin-left: -400px; margin-top: -300px; border:5px solid #000000;";//center
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        
		
		window.addEventListener('keydown', function (e) {		// Next few lines are a part of getting keyboard input.
			//myGameArea.key = e.keyCode;
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = true;
		})
		window.addEventListener('keyup', function (e) {
			//myGameArea.key = false;
			myGameArea.keys[e.keyCode] = false;
		})
		
		// Next 4 "window" statements are for detecting touch.
		window.addEventListener('mousedown', function (e) {
			myGameArea.x = e.pageX; //  - 550
			myGameArea.y = e.pageY; //  - 211
		})
		window.addEventListener('mouseup', function (e) {
			myGameArea.x = false;
			myGameArea.y = false;
		})
		window.addEventListener('touchstart', function (e) {
			myGameArea.x = e.pageX;
			myGameArea.y = e.pageY;
		})
		window.addEventListener('touchend', function (e) {
			myGameArea.x = false;
			myGameArea.y = false;
		})
		
	},
		
    clear : function() {
        this.context.fillStyle = "brown";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);//makes all pixels rectangle
    }
}

// Component is basically how all objects get set up
function component(width, height, color, x, y, type, imag) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.imag = imag;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else if (this.type == "icon") {
            const img = new Image();//creating image
            img.src = this.imag;//to load in image 
            ctx.drawImage(img, this.x, this.y, this.width, this.height);//drawing image
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
	
	this.clicked = function() {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var clicked = true;
    if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
      clicked = false;
    }
    return clicked;
  }
}

// updateGameArea is the game loop. The game goes through here every frame to check things like if the player is holding an input down or if the player is colliding with an object.
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
	
	// This is for handling collision with walls. More wall collisin related things further down.
	for (i = 0; i < wall.length; i += 1) {
        if (myGamePiece.crashWith(wall[i])) {
            myGamePiece.speedX = 0;
			myGamePiece.speedY = 0;
			//return;
        } 
    }
	
    myGameArea.clear();
	
	
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;

	// Next 4 if lines are for picking up keyboard input and moving the player.
	if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -2; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 2; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -2; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 2; }
	
	
	// Next group of if statements are for the on screen controls.
	if (myGameArea.x && myGameArea.y) {
    if (myUpBtn.clicked()) {
      myGamePiece.y -= 2;
    }
    if (myDownBtn.clicked()) {
      myGamePiece.y += 2;
    }
    if (myLeftBtn.clicked()) {
      myGamePiece.x += -2;
    }
    if (myRightBtn.clicked()) {
      myGamePiece.x += 2;
    }
  }

	
	
    myGameArea.frameNo += 1;
    /*if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0,"icon","images/wall.jpg"));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap,"icon","images/wall.jpg"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }*/


	// Next two for loops are for handling collision with walls
	for (i = 0; i < wall.length; i += 1) {
		wall[i].update();
	}
	
	for (i = 0; i < wall.length; i += 1) {
        if (myGamePiece.crashWith(wall[i])) {
            myGamePiece.x = LastX;
			myGamePiece.y = LastY;
        } 
    }
	
	for (i = 0; i < treasure.length; i += 1) {
		treasure[i].update();
	}
	
	// This loop handles collision for treasure chests.
	for (i = 0; i < treasure.length; i += 1) {
        if (myGamePiece.crashWith(treasure[i])) {
            myGamePiece.x = LastX;
			myGamePiece.y = LastY;
			score += 50;
        } 
    }
	
	// These two variables are for helping handle collision. They are used to set the player back to their previous position if a collision occures.
	LastX = myGamePiece.x;
	LastY = myGamePiece.y;
	
    Frame.text="FRAME: " + myGameArea.frameNo;
    Frame.update();
	myScore.text="SCORE: " + score;
	myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
	ladder.update();
	myUpBtn.update();
	myDownBtn.update();
	myLeftBtn.update();
	myRightBtn.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}