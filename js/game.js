
var myGamePiece;
var wall = [];
var myObstacles = [];
var myScore;
var LastX;
var LastY;

function startGame() {
    myGamePiece = new component(30,30,"red",450,400,"icon", "images/player.png");//30, 30, "red", 10, 120);
    //myGamePiece.gravity = 0.05;  // Commenting this out disables gravity. Will probably fully remove gravity later.
    myScore = new component("30px", "Consolas", "black", 280, 40, "text","");
	GenerateLevel1();
    myGameArea.start();
}



function GenerateLevel1() {
	wall.push(new component(10, 540, "green", 0, 0, "icon", "images/wall.jpg"));
	wall.push(new component(960, 10, "green", 0, 0, "icon", "images/wall.jpg"));
	wall.push(new component(10, 540, "green", 950, 0, "icon", "images/wall.jpg"));
	wall.push(new component(960, 10, "green", 0, 530, "icon", "images/wall.jpg"));
	wall.push(new component(100, 100, "green", 325, 165, "icon", "images/wall.jpg"));
}

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
        
		
		window.addEventListener('keydown', function (e) {		// Next 5 lines are a part of getting keyboard input.
			//myGameArea.key = e.keyCode;
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = true;
		})
		window.addEventListener('keyup', function (e) {
			//myGameArea.key = false;
			myGameArea.keys[e.keyCode] = false;
		})
		
		
	},
		
    clear : function() {
        this.context.fillStyle = "brown";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);//makes all pixels rectangle
    }
}

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
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
	
	for (i = 0; i < wall.length; i += 1) {
        if (myGamePiece.crashWith(wall[i])) {
            myGamePiece.speedX = 0;
			myGamePiece.speedY = 0;
			//return;
        } 
    }
	
    myGameArea.clear();
	
	// Next 4 if lines are for picking up keyboard input and moving the player.
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;
	/*if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -2; }
	if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 2; }		
	if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -2; }
	if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 2; }*/
	
	if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -2; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 2; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -2; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 2; }
	

	
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
	
	for (i = 0; i < wall.length; i += 1) {
		wall[i].update();
	}
	
	for (i = 0; i < wall.length; i += 1) {
        if (myGamePiece.crashWith(wall[i])) {
            myGamePiece.x = LastX;
			myGamePiece.y = LastY;
			//myGamePiece.speedX = 0;
			//myGamePiece.speedY = 0;
			//return;
        } 
    }
	
	LastX = myGamePiece.x;
	LastY = myGamePiece.y;
	
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
	wall.update();
	
	
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}