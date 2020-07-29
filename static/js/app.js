//HTML ELements
const statusDiv = document.querySelector('.status');
const resetDiv = document.querySelector('.reset');
const cellDivs = document.querySelectorAll('.game-cell');
const playerScore = document.querySelector('.player-score');
const computerScore = document.querySelector('.com-score');
const easyDiv = document.querySelector('.easy');
const mediumDiv = document.querySelector('.medium');
const hardDiv = document.querySelector('.hard');
const playerStartDiv = document.querySelector('.player-start');

//game variables
var game = {
    scorePlayer: 0,
    scoreComputer: 0,
    Player: 'x',
    Computer: 'o',
    gameIsLive: true,
    playerTurn: true,
    playerStarts: true,
    gameBoard: [' ',' ',' ',' ',' ',' ',' ',' ',' '],
    difficulty: 2
}

//event handlers

//Reset function
const handleReset = (e) => {
    for (const cellDiv of cellDivs) {
        cellDiv.classList.remove('x');
        cellDiv.classList.remove('o');
        cellDiv.classList.remove('won');
    }

    //Update Scores
    game['gameIsLive'] = true;
    playerScore.innerHTML = `Player Score: ${game['scorePlayer']}`;
    computerScore.innerHTML = `Computer Score: ${game['scoreComputer']}`;
    resetBoard();

    // 'x' always starts
    if(game['playerStarts']) {
        game['playerTurn'] = true;
        game['Player'] = 'x';
        game['Computer'] = 'o';
    }

    else {
        game['playerTurn'] = false;
        game['Player'] = 'o';
        game['Computer'] = 'x';
        calculateMove();
    }
}

// Adds mark to board
const handleCellClick = (e) => {
    const classList = e.target.classList;
    const pos = classList[1]
    const cellNo = positionToIndex(pos)
    
    // Return if cell is already occupied or game is not live
    if(!game['gameIsLive'] || classList[2] == game['Player'] || classList[2] == game['Computer']) {
        return;
    }
    
    if (game['playerTurn']) {
        classList.add(game['Player']);
        game['gameBoard'][cellNo] = game['Player']
        game['playerTurn'] = !game['playerTurn']
        checkGameStatus()
    }

    if(!game['gameIsLive']) {
        return;
    }

    //Make computer move
    calculateMove()
}

//Change difficulty to easy
const handleEasyClick = (e) => {
    const classList = e.target.classList;
    classList.add('currentDifficulty')
    mediumDiv.classList.remove('currentDifficulty')
    hardDiv.classList.remove('currentDifficulty')
    game['difficulty'] = 0;
    handleReset()
}

//Change difficulty to medium
const handleMediumClick = (e) => {
    const classList = e.target.classList;
    classList.add('currentDifficulty')
    easyDiv.classList.remove('currentDifficulty')
    hardDiv.classList.remove('currentDifficulty')
    game['difficulty'] = 1;
    handleReset()
}

//Change difficulty to hard
const handleHardClick = (e) => {
    const classList = e.target.classList;
    classList.add('currentDifficulty')
    mediumDiv.classList.remove('currentDifficulty')
    easyDiv.classList.remove('currentDifficulty')
    game['difficulty'] = 2;
    handleReset()
}

//Toggle player start
const handlePlayerStartClick = (e) => {
    const classList = e.target.classList;
    if(classList[2] == 'player-start-set')  {
        game['playerStarts'] = !game['playerStarts']
        classList.remove('player-start-set')
    }
    else {
        game['playerStarts'] = !game['playerStarts']
        classList.add('player-start-set')
    }
}

//event listeners
resetDiv.addEventListener('click', handleReset);

for (const cellDiv of cellDivs) {
    cellDiv.addEventListener('click',handleCellClick);
}

easyDiv.addEventListener('click',handleEasyClick);
mediumDiv.addEventListener('click',handleMediumClick);
hardDiv.addEventListener('click',handleHardClick);

playerStartDiv.addEventListener('click',handlePlayerStartClick);

// game logic functions

//Check if game is won or tied
const checkGameStatus = () => {
    const topLeft = cellDivs[0].classList[2];
    const topMid = cellDivs[1].classList[2];
    const topRight = cellDivs[2].classList[2];
    const midLeft = cellDivs[3].classList[2];
    const midMid = cellDivs[4].classList[2];
    const midRight = cellDivs[5].classList[2];
    const botLeft = cellDivs[6].classList[2];
    const botMid = cellDivs[7].classList[2];
    const botRight = cellDivs[8].classList[2];

    //Horizontal Win
    if(topLeft && topLeft == topMid && topLeft == topRight ) {
        handleWin(topLeft,0,1,2);
        return;
    }
    else if(midLeft && midLeft == midMid && midLeft == midRight ) {
        handleWin(midLeft,3,4,5);
        return;
    }
    else if(botLeft && botLeft == botMid && botLeft == botRight ) {
        handleWin(botLeft,6,7,8);
        return;
    }

    //Vertical Win
    else if(topLeft && topLeft == midLeft && topLeft == botLeft ) {
        handleWin(topLeft,0,3,6);
        return;
    }
    else if(topMid && topMid == midMid && topMid == botMid ) {
        handleWin(topMid,1,4,7);
        return;
    }
    else if(topRight && topRight == midRight && topRight == botRight ) {
        handleWin(topRight,2,5,8);
        return;
    }

    //Diagonal Win
    if(topLeft && topLeft == midMid && topLeft == botRight ) {
        handleWin(topLeft,0,4,8);
        return;
    }
    if(topRight && topRight == midMid && topRight == botLeft ) {
        handleWin(topRight,2,4,6);
        return;
    }
    
    // Tie
    if(!boardEmpty()) {
        handleTie()
    }
}

// Update color of winning combination and scores
const handleWin = (mark,cell1, cell2, cell3) => {
    game['gameIsLive'] = false;
    cellDivs[cell1].classList.add('won')
    cellDivs[cell2].classList.add('won')
    cellDivs[cell3].classList.add('won')

    if(game['Player'] == mark) {
        game['scorePlayer'] = game['scorePlayer'] + 1
    }
    else {
        game['scoreComputer'] = game['scoreComputer'] +  1
    }
}

const handleTie = () => {
    game['gameIsLive'] = false;
}

const resetBoard = () => {
    game['gameBoard'] = [' ',' ',' ',' ',' ',' ',' ',' ',' ']
}

// Returns true if board is empty 
const boardEmpty = () => {
    for (const cell of game['gameBoard']) {
        if (cell == ' ') {
            return true
        }
    }
    return false
}

// Returns index based on class of cell
const positionToIndex = (pos) => {
    if(pos == 'top-left') {
        return 0
    }
    else if(pos == 'top-mid') {
        return 1
    }
    else if(pos == 'top-right') {
        return 2
    }
    else if(pos == 'mid-left') {
        return 3
    }
    else if(pos == 'mid-mid') {
        return 4
    }
    else if(pos == 'mid-right') {
        return 5
    }
    else if(pos == 'bot-left') {
        return 6
    }
    else if(pos == 'bot-mid') {
        return 7
    }
    else if(pos == 'bot-right') {
        return 8
    }
}

// Send a request to calculate computer move
const calculateMove = () => {
    const data = JSON.stringify({'difficulty':game['difficulty'],'board':game['gameBoard'], 'computer':game['Computer'], 'player':game['Player']})
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/move')
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onreadystatechange = comMove
    xhr.send(data)
}

// Update the board according to response
function comMove() {
    if(this.readyState == 4 && this.status == 200) {      
        response = JSON.parse(this.responseText)
        cellNo = response['computerMove']
        if(cellNo == -1) {
            return;
        }
        const classList = cellDivs[cellNo].classList
        classList.add(game['Computer']);
        game['gameBoard'][cellNo] = game['Computer']
        game['playerTurn'] = !game['playerTurn']
        checkGameStatus()
    }
}