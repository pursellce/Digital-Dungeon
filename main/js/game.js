
// Declaring variables. Any new objects added must be set up here.
var myGamePiece;
var wall = [];
var myObstacles = [];
var myScore;
var Frame;
var LastFrameXLocation;
var LastY;
//var q = [];
var questionToken = [];
//var answered = false;
var ladder;
var treasure = [];
var score = 0;
var myUpBtn, myDownBtn, myLeftBtn, myRightBtn;
var myA, myB, myC, myD; //multiple choices
//var crashed;
var question_count = 3;
var screenButton = 0;


function startGame() {
    myGamePiece = new component(30,30,"red",450,400,"icon", "images/player.png");//30, 30, "red", 10, 120);
    //myGamePiece.gravity = 0.05;  // Commenting this out disables gravity. Will probably fully remove gravity later.
    myScore = new component("30px", "Consolas", "black", 280, 40, "text","");

    Frame = new component("30px", "Consolas", "grey", 510, 40, "text", "");
	myUpBtn = new component(30, 30, "blue", 50, 10);
	myDownBtn = new component(30, 30, "blue", 50, 70);
	myLeftBtn = new component(30, 30, "blue", 20, 40);
	myRightBtn = new component(30, 30, "blue", 80, 40);
    
    //q[1].ans = "bad"
    
    //myA = new component(100,30, "black", 315, 403);
	//myB = new component("30px", "black", 310, 50,"text" );
	//myC = new component("30px", "black", 310, 90,"text");
	//myD = new component("30px", "black", 310, 130,"text");
    //crashed = false;
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
	
    for(i = 0; i < question_count; i++)//making all question tokens
    {
        //q.push(new component("20px", "Consolas", "grey",300,300-i*20, "question","This is the question"));
    //q.push(new component("20px", "Consolas", "grey",200,200, "question","This is the question"));
	    questionToken.push(new component(15,15,"gold", 400+i*40, 400-i*18,"token"));
    }
    for(i = 0; i < question_count;i++)//marks all crashes for tokens as false initially
    {
        questionToken[i].crashed = false;
    }//questionToken.push(new component(20,20,"gold", rand()%400, rand()%400));
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
        this.canvas.style = "position:absolute; left: 30%; width: 40%; height: 45%; text-align:center; top: 25%; border:5px solid #000000;";//center
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
    this.crashed =false;
    this.ans = "";
   
    this.imag = imag;
    this.gravity = 0;//do not remove
    this.gravitySpeed = 0;//do not remove
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (this.type == "question"){//this function is no longer used
            
            //ctx.font = this.width + " " + this.height;
            //ctx.fillStyle = color;
            //if(myGamePiece.crashWith(questionToken))
               //{ crashed = true;}
            //if((crashed) && (this.ans != "answer"))
            //{   
                /*while(i < this.text.length())
                {    
                    ctx.fillText(this.text.substring(0,i), this.x, this.y);
                    i++;
                }*/
                //ctx.fillText(this.text, this.x, this.y);
                
            //}

            
        } 
        else if (this.type == "icon") {
            const img = new Image();//creating image
            img.src = this.imag;//to load in image 
            ctx.drawImage(img, this.x, this.y, this.width, this.height);//drawing image
        } else if(this.type == "token") {//need a way to stop movement so multiple questions arent displayed
            if(myGamePiece.crashWith(this))
               {this.crashed = true;}
            if(!(this.crashed)){//if not crashed display token
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            else{
                if((this.crashed) && (this.ans != "answer"))//display question as long as wrong answer
                {   
                    ctx.font = this.width + " " + this.height;//not sure why text is large
                    ctx.fillStyle = color;
                    ctx.fillText(this.text, this.x, this.y); 
                }

            }
        }else {
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
	
	// This if statement makes sure that the next few lines are only applied for when the keyboard is being used and NOT when the on screen buttons are being used.
	if (screenButton == 0)
	{
		myGamePiece.speedX = 0;
		myGamePiece.speedY = 0;
	}

	// Next 4 if lines are for picking up keyboard input and moving the player.
	if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -2; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 2; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -2; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 2; }
	
    //for questions
    for(i = 0; i < question_count; i++)//needs work
    {//when the jgame peice crahses with the token it registers input, need a way to make different answers and maybe track responses
        if(myGamePiece.crashWith( questionToken[i])){
            if (myGameArea.keys && myGameArea.keys[65]) { questionToken[i].ans = "answer"; }//currently only marks A as right answer
            if (myGameArea.keys && myGameArea.keys[66]) { questionToken[i].ans = "bad"; }//b
        }
    }
	// Next group of if statements are for the OLD on screen controls.
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


  /*if (myGameArea.x && myGameArea.y) {//on screen buttons for questions
    if (myA.clicked()) {
       q1.ans = 1; //"answer";
    }
    if (myB.clicked()) {
        q1.ans = "bad answer";
    }
    if (myC.clicked()) {
        q1.ans = "bad answer";
    }
    if (myD.clicked()) {
        q1.ans = "bad answer";
    }
  }*/


    myGameArea.frameNo += 1;


	// Next two for loops are for handling collision with walls
	for (i = 0; i < wall.length; i += 1) {
		wall[i].update();
	}
	
	for (i = 0; i < wall.length; i += 1) {
        if (myGamePiece.crashWith(wall[i])) {
            myGamePiece.x = LastFrameXLocation;
			myGamePiece.y = LastY;
        } 
    }
	
	UpdateAndCheckTreasure();
	
	// These two variables are for helping handle collision. They are used to set the player back to their previous position if a collision occures.
	LastFrameXLocation = myGamePiece.x;
	LastY = myGamePiece.y;
	
    Frame.text="FRAME: " + myGameArea.frameNo;
    Frame.update();


    myScore.text="SCORE: " + score;
	myScore.update();

    for(i = 0; i < question_count; i++)//stops movement while answering question
    {
        if((questionToken[i].crashed) && (questionToken[i].ans != "answer"))
            {
                myGamePiece.speedX = 0;
                myGamePiece.speedY = 0;
                //myGamePiece.newPos();
            }
    }
    myGamePiece.newPos();
    myGamePiece.update();
	ladder.update();
    //myA.update();
    //myB.update();

	myUpBtn.update();
	myDownBtn.update();
	myLeftBtn.update();
	myRightBtn.update();
	
	//myA.text="right";
    //myB.text="wrong";
    //myC.text="wrong";
    //myD.text="wrong";
	
	questionToken[0].text = "How many leading zeros does 00001101 have? Press A for 4, B for 3";
    questionToken[1].text = "What is the logical and symbol? Press A for &&, B for ||";
    questionToken[2].text = "What will 0010 ^ 1001 give? A for 1011, B for 1101";
    for(i = 0; i < question_count;i++)//update all questions
    {
        //q[i].update();
        questionToken[i].update();
    }
}

function UpdateAndCheckTreasure(){
	for (i = 0; i < treasure.length; i += 1) {
        if (myGamePiece.crashWith(treasure[i])) {
            myGamePiece.x = LastFrameXLocation;
			myGamePiece.y = LastY;
			score += 50;
            //question.update();
        } 
		treasure[i].update();
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

function moveup() {
    myGamePiece.speedY -= 2; 
	screenButton = 1;
}

function movedown() {
    myGamePiece.speedY = 2;
	screenButton = 1;
}

function moveleft() {
    myGamePiece.speedX -= 2; 
	screenButton = 1;
}

function moveright() {
    myGamePiece.speedX += 2; 
	screenButton = 1;
}

function stopMove() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  screenButton = 0;
}