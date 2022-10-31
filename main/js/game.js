
// Declaring variables. Any new objects added must be set up here.
var myGamePiece;
var wall = [];
var myObstacles = [];
var myScore;
var Frame;
var LastFrameXLocation;
var LastY;
var questionToken = [];
var ladder;
var treasure = [];
var score = 0;
var myUpBtn, myDownBtn, myLeftBtn, myRightBtn;
var myA, myB, myC, myD; //multiple choices
var question_count = 4;
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

    //myA = new component(100,30, "black", 315, 403);
	//myB = new component("30px", "black", 310, 50,"text" );
	//myC = new component("30px", "black", 310, 90,"text");
	//myD = new component("30px", "black", 310, 130,"text");

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
	    questionToken.push(new component(15,15,"gold", 400+i*40, 400-i*18,"token"));
    }
    for(i = 0; i < question_count;i++)//marks all crashes for tokens as false initially
    {
        questionToken[i].crashed = false;
    }
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
    this.text_spot=0;
    this.imag = imag;
    this.done = false;
    this.gravity = 0;//do not remove
    this.gravitySpeed = 0;//do not remove
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
        } else if(this.type == "token") {//need a way to stop movement so multiple questions arent displayed
            if(this.crashWith(myGamePiece))
               {this.crashed = true;}
            if(!(this.crashed)){//if not crashed display token
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            else{ 
            if((this.ans != this.correct) && !this.done)//display question as long as wrong answer
                {   
                    ctx.fillStyle = 'rgb(151, 100, 90)';//text box values
                    ctx.fillRect(60, 420, 840, 100); 

                    ctx.font = "25px consolas";//adust to change font 
                    ctx.fillStyle = color;
                    var linestart = 450;
                    
                   /* while(this.text_spot < this.text.length)
                    {
                       // if(this.text.substring(i)=='#')
                         //   {linestart += 20;}
                        if((myGameArea.frameNo % 100) == 0)
                            {this.text_spot++;}
                        else{
                            break;}
                        ctx.fillText(this.text.substring(0,this.text_spot), 70,linestart );//this.x, this.y);
                        
                    }
                    if(this.text_spot == this.text.length)
                        {
                            ctx.fillText(this.text.substring(0,this.text_spot), 70,linestart );//this.x, this.y);
                        } */

                    ctx.fillText(this.text.substring(0,60), 70,linestart );//line 1
                    ctx.fillText(this.text.substring(61,121), 70,linestart+30);//line 2
                    ctx.fillText(this.text.substring(122,183), 70,linestart+60);//line 3
                }
                if(this.ans == this.correct){this.done = true;}

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
        if(myGamePiece.crashWith( questionToken[i]) && !questionToken[i].done){//doesnt run if already answered
            if (myGameArea.keys && myGameArea.keys[65]) { questionToken[i].ans = "A"; }//
            else if (myGameArea.keys && myGameArea.keys[66]) { questionToken[i].ans = "B"; }//b
            else if (myGameArea.keys && myGameArea.keys[67]) { questionToken[i].ans = "C"; }//
            else if (myGameArea.keys && myGameArea.keys[68]) { questionToken[i].ans = "D"; }
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
        if (myGamePiece.crashWith(wall[i])) {
            myGamePiece.x = LastFrameXLocation;
			myGamePiece.y = LastY;
        } 
    }
	

	
	// These two variables are for helping handle collision. They are used to set the player back to their previous position if a collision occures.
	LastFrameXLocation = myGamePiece.x;
	LastY = myGamePiece.y;


    for(i = 0; i < question_count; i++)//stops movement while answering question
    {
        if((questionToken[i].crashed) && (questionToken[i].ans != questionToken[i].correct))
            {
                myGamePiece.speedX = 0;
                myGamePiece.speedY = 0;

            }
    }
    updateAllElements();//calls all of the updates
    questionToken[0].text = "How many leading zeros does 00001101 have? Press A for 4, B for 3, c for 2, D for 1";
    questionToken[0].correct = "A";
    questionToken[1].text = "What is the logical and symbol? Press A for ||, B for &&, Press C for |, D for & ";
    questionToken[1].correct = "B";
    questionToken[2].text = "What will 0010 ^ 1001 give? A for 0000, B for 1101, C for 1011, D for 1101";
    questionToken[2].correct = "C";
    questionToken[3].text = "What will 0010 + 1001 give? A for 0000, B for 1101, C for 1111, D for 1011";
    questionToken[3].correct = "D";

}

function updateAllElements(){
    for(i = 0; i < question_count;i++)//update all questions
    {
        //q[i].update();
        questionToken[i].update();
    }
    for (i = 0; i < wall.length; i += 1) {
		wall[i].update();
	}
	
    Frame.text="FRAME: " + myGameArea.frameNo;
    Frame.update();


    myScore.text="SCORE: " + score;
	myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
	ladder.update();
    UpdateAndCheckTreasure();
	myUpBtn.update();
	myDownBtn.update();
	myLeftBtn.update();
	myRightBtn.update();
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