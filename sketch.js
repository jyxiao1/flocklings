var table, tableDelegates;
var bush, carson, clinton, huckabee, kasich, omalley, paul, rubio, sanders, santorum, trump;
var voter;
var delegate;
var superdelegate;
var candidates;
var candidateNum = 0;
var currNum = 0;
var totalNum = 0;
var voteNum = 0;
var fr = 1; //starting FPS
var framecount = 1;
var framecap = 60;
var acceleration = 1;
var flag = 0;
var cap = 0;
var state = "voting";
var buttonState = "";
var button;
var voterText = "During the 2016 Primary, voters gather together to vote for their favorite candidate";
var voterText = "In reality though, they are simply voting for delegates to vote on their behalf";
var delegateText = "Most delegates are divided proportionally amongst candidates, however...";
var superdelegateText = "Superdelegates, or unpledged delegates, can vote for whomever they like, often skewing election results.";

var counter = 0;
var finishedNum = 0;
var sandersCount = 0;
var clintonCount = 0;
var omalleyCount = 0;
var amt = 0;
var stateDelegates = 0;
var stateSuperdelegates = 0;
var delegates = "";

var background;
//var currNumVoters;

var canvasHeight = 600;
var canvasWidth = 1200;
var arrayOfVoters = []; // array of Voters
//var arrayOfRepublicanCandidates = [];
function preload(){ //preload resources
    fontBold = loadFont('https://res.cloudinary.com/drf15xu5r/raw/upload/v1542748919/Signika-Bold.ttf');
    fontLight = loadFont('https://res.cloudinary.com/drf15xu5r/raw/upload/v1542757533/Signika-Light.ttf');
    fontRegular = loadFont('https://res.cloudinary.com/drf15xu5r/raw/upload/v1542757528/Signika-Regular.ttf');
    fontSemibold = loadFont('https://res.cloudinary.com/drf15xu5r/raw/upload/v1542757529/Signika-Semibold.ttf');

    tableMainData = loadTable("https://res.cloudinary.com/drf15xu5r/raw/upload/v1542757531/electiondata.csv", "csv", "header");
    tableDelegates = loadTable("https://res.cloudinary.com/drf15xu5r/raw/upload/v1542748870/democraticDelegates.csv", "csv", "header");

    voter = loadImage("https://res.cloudinary.com/drf15xu5r/image/upload/v1542748880/person.png");
    delegate = loadImage("https://res.cloudinary.com/drf15xu5r/image/upload/v1542748868/delegate.png");
    superdelegate = loadImage("https://res.cloudinary.com/drf15xu5r/image/upload/v1542757529/superdelegate.png");

    //bush = loadImage("resources/bushBooth.png");
    //carson = loadImage("resources/carsonBooth.png");
    //cruz = loadImage("resources/cruzBooth.png");
    clinton = loadImage("https://res.cloudinary.com/drf15xu5r/image/upload/v1542748880/clintonBooth.png");
    //huckabee = loadImage("resources/huckabeeBooth.png");
    //kasich = loadImage("resources/kasichBooth.png");
    omalley = loadImage("https://res.cloudinary.com/drf15xu5r/image/upload/v1542748877/omalleyBooth.png");
    //paul = loadImage("resources/paulBooth.png");
    //rubio = loadImage("resources/rubioBooth.png");
    sanders = loadImage("https://res.cloudinary.com/drf15xu5r/image/upload/v1542748921/sandersBooth.png");
    //santorum = loadImage("resources/santorumBooth.png");
    //trump = loadImage("resources/trumpBooth.png");

    bg = loadImage("https://res.cloudinary.com/drf15xu5r/image/upload/v1542757533/voteBackground.png");
}


function setup() {
    createCanvas(canvasWidth,canvasHeight);
    candidates = getNumberOfVotersByCounty("Houghton","Michigan");
    textFont(fontBold);
    textSize(32)
    textAlign(CENTER);
    frameRate(120);
    for(i = 0; i < candidates.length; i++)
    {
        candidates[i].setCoordinates(i,candidates.length);
        totalNum += int(candidates[i].numVotes);
    }
}

function draw() {
    text(candidates[0].percent, 50,50)
    var arrayOfVotersLength = arrayOfVoters.length;
    background(bg);
    //display title
    textAlign(CENTER);
    text("The Democratic Primary in Bingham, Idaho", 600, 50);

    //show candidates
    if(state == "voting")
    {
        if(framecount >= framecap)
        {
            if(arrayOfVotersLength < (totalNum*0.9))
            {
                framecap -= 5;
            }
            createVoters(candidates); //create voters at varying speeds
            framecount = 0;
        }
        framecount++;
        if(arrayOfVotersLength < 5000)
        {
            for(i = 0; i < arrayOfVotersLength; i++)
            {
                arrayOfVoters[i].display();
                arrayOfVoters[i].jitter();
            }
        }else{
            for(i = arrayOfVotersLength - 5000; i < arrayOfVotersLength; i++)
            {
                arrayOfVoters[i].display();
                arrayOfVoters[i].jitter();
            }
        }
        if(buttonState == "voterText")
        {
            button = createButton("Show distribution of popular vote");
            button.style("height","50px");
            button.position(canvasWidth/2 - 50, canvasHeight*5/6);
            button.mousePressed(changeStateToTally);
        }
    }else if(state == "tallying")
    {
        button.remove();
        finishedNum = 0;
        for(k = 0; k < counter; k++)
        {
            arrayOfVoters[k].moveVoterToBooth();
        }
        for(l = counter; l < arrayOfVotersLength; l++)
        {
            arrayOfVoters[l].jitter();
        }
        for(j = 0; j < arrayOfVotersLength; j++)
        {
            if(arrayOfVoters[j].finishedState == 1)
            {
                finishedNum++;
            }
            arrayOfVoters[j].display();
        }
        for(i = 0; i < candidates.length; i++)
        {
            candidates[i].display();
            //candidates[i].displayCount();
        }
        if(counter < arrayOfVotersLength && (counter + 10) < arrayOfVotersLength)
        {
            counter += 10;
        }else if(counter < arrayOfVotersLength)
        {
            counter += 1;
        }
        if(finishedNum >= (arrayOfVotersLength))
        {
            state = "displayResults";
        }
    }else if(state == "displayResults"){
        for(a = 0; a < candidates.length; a++)
        {
            if(candidates[a].x > 100)
            {
                candidates[a].x -= 10;
            }else{
                state = "showBarChart";
            }
            candidates[a].display();
        }
    }else if(state == "showBarChart"){
        if(amt < 1)
        {
            amt += .025;
        }
        for(a = 0; a < candidates.length; a++)
        {
            candidates[a].displayCount();
            candidates[a].showthebars();
            candidates[a].display();
        }
    }
    var blk = color('black');
    fill(blk);
    textAlign(RIGHT);
    text("Total vote count " + currNum, 1150, 550);
}




//voter class
function Voter(candidate){
    this.finishedState = 0;
    this.candidate = candidate;
    this.x = random(50, 400);
    this.y = random(100, 500);
    this.stepnumberX = 0;
    this.stepnumberY = 0;

    this.xdistance = (this.candidate.x + 30 - this.x)/100;
    this.ydistance = (this.candidate.y + 40 - this.y)/100;

    this.offsetX = 0;
    this.offsetY = 0;

    if((this.x >= 50 && this.x <= 60) || (this.x >= 390 && this.x <= 400))
    {
        this.x = this.x + random(-15,15);
    }
    if((this.y >= 100 && this.y <= 110) || (this.y >= 490 && this.y <= 500))
    {
        this.y = this.y + random(-15,15);
    }

    this.display = function(){
        image(voter, this.x, this.y, 19, 40);
    };

    this.jitter = function(){
        var jitterX;
        var jitterY;

        if(this.offsetX <= -5)
        {
            jitterX = random(0, 1);
        }else if(this.offsetX >= 5){
            jitterX = random(-1, 0);
        }else{
            jitterX = random(-1, 1);
        }
        this.x += jitterX;
        this.offsetX += jitterX;

        if(this.offsetY <= -5)
        {
            jitterY = random(0, 1);
        }else if(this.offsetY >= 5){
            jitterY = random(-1, 0);
        }else{
            jitterY = random(-1, 1);
        }
        this.y += jitterY;
        this.offsetY += jitterY;
    };


    this.moveVoterToBooth = function(){
        myCandidate = this.candidate;
        if(this.stepnumberX != 100)
        {
            this.x += this.xdistance;
            this.stepnumberX++;
        }
        if(this.stepnumberY != 100)//(this.y <= (myCandidate.y + 31) && this.y >= (myCandidate.y + 27)))
        {
            this.y += this.ydistance;
            this.stepnumberY++;
        }

        if(this.stepnumberX == 100 && this.stepnumberY == 100)
        {
            this.finishedState = 1;
        }
    };
}

//Candidate class
function Candidate(name, clr, numVotes, booth, percent, numDelegates, numSuperdelegates) {
    this.name = name;
    this.clr = color(clr);
    this.numVotes = numVotes;
    this.numDelegates = numDelegates;
    this.numSuperdelegates = numSuperdelegates;
    this.booth = booth;
    this.percent = percent;

    this.setCoordinates = function(currCandidateNum, totalCandidateNum){
        this.x = 900;
        this.y = ((400/(totalCandidateNum+1))+95)*(currCandidateNum) + 100;
    };

    this.display = function(){
        image(this.booth, this.x, this.y, 100, 189);
    };

    this.displayCount = function(){
        var blk = color('black');
        fill(blk);
        text(this.numVotes, this.x + 50, this.y - 10);
    };

    this.showthebars = function(){
        fill(this.clr);
        rect(this.x + 120, this.y + 20, float(this.percent)*5*amt, 50);
    };/*
  this.setNumStateVotes = function(numStateVotes){
    //TODO something
    this.numStateVotes = numStateVotes;
  };*/
}

function createVoters(candidates){ //candidates has name, numvotes
    var voteDiff;
    if(voteNum < candidates[candidateNum].numVotes)
    {
        if((currNum < 100) || (voteNum + 3 > candidates[candidateNum].numVotes) || (currNum > totalNum - 100))
        {
            voteDiff = 1;
        }else if (currNum < 250 || (voteNum + 7 > candidates[candidateNum].numVotes))
        {
            voteDiff = 3;
        }else if (currNum < 500 || (voteNum + 11 > candidates[candidateNum].numVotes))
        {
            voteDiff = 7;
        }else if (currNum < 1000 || (voteNum + 111 > candidates[candidateNum].numVotes))
        {
            voteDiff = 11;
        }else{
            voteDiff = 31;
        }

        for(i = 0; i < voteDiff; i++)
        {
            arrayOfVoters[currNum] = new Voter(candidates[candidateNum]);
            currNum++;
        }
        voteNum += voteDiff;
    }else if(candidateNum < candidates.length - 1){
        candidateNum++;
        voteNum = 0;
    }else{
        buttonState = "voterText";
    }
}

function getNumberOfVotersByCounty(countyName, stateName){
    var countyColumn = tableMainData.getColumn("County");
    var stateColumn = tableMainData.getColumn("State");
    var delegateStateColumn = tableDelegates.getColumn("State");

    var sandersNumVotesColumn = tableMainData.getColumn("Bernie_Sanders_Number_of_Votes");
    var sandersPercentVotesColumn = tableMainData.getColumn("Bernie_Sanders_Percent_of_Votes");
    var sandersNumDelegatesColumn = tableDelegates.getColumn("Bernie_Sanders_Number_Of_Delegates");

    var clintonNumVotesColumn = tableMainData.getColumn("Hillary_Clinton_Number_of_Votes");
    var clintonPercentVotesColumn = tableMainData.getColumn("Hillary_Clinton_Percent_of_Votes");
    var clintonNumDelegatesColumn = tableDelegates.getColumn("Hillary_Clinton_Number_Of_Delegates");

    var omalleyNumVotesColumn = tableMainData.getColumn("Martin_O'Malley_Number_of_Votes");
    var omalleyPercentVotesColumn = tableMainData.getColumn("Martin_O'Malley_Percent_of_Votes");

    var delegateColumn = tableDelegates.getColumn("Delegates");
    var superdelegateColumn = tableDelegates.getColumn("Superdelegates");

    for(row = 0; row < countyColumn.length; row++)
    {
        if(countyColumn[row] == countyName)
        {
            if(stateColumn[row] == stateName)
            {
                var numCandidates = 0;
                var democraticCandidates = [];  //array of Candidates
                for(delRow = 0; delRow < delegateStateColumn.length; delRow++)
                {
                    if(stateColumn[row] == delegateStateColumn[delRow])
                    {
                        stateSuperdelegates = superdelegateColumn[delRow];
                        stateDelegates = delegateColumn[delRow];
                        if(sandersNumVotesColumn[row] != 0)
                        {
                            democraticCandidates[numCandidates] = new Candidate('sanders', 'lightpink', sandersNumVotesColumn[row], sanders, sandersPercentVotesColumn[row], sandersNumDelegatesColumn[delRow], 0);
                            numCandidates++;
                        }
                        if(clintonNumVotesColumn[row] != 0)
                        {
                            democraticCandidates[numCandidates] = new Candidate('clinton', 'lightred', clintonNumVotesColumn[row], clinton, clintonPercentVotesColumn[row], clintonNumDelegatesColumn[delRow], 0);
                            numCandidates++;
                        }
                        if(omalleyNumVotesColumn[row] != 0)
                        {
                            democraticCandidates[numCandidates] = new Candidate('omalley', 'lightblue', omalleyNumVotesColumn[row], omalley, omalleyPercentVotesColumn[row], 0, 0);
                        }
                    }
                }
                return democraticCandidates;
            }
        }
    }
}

function changeStateToTally(){
    button.hide();
    button.remove();
    state = "tallying";
}
