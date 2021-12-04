var origBoard;
const humanPlayer = 'O';
const aiPlayer = 'X';
const numOfCells = 9;
const delayInMilliseconds = 500;

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
]

const cells = document.querySelectorAll('.cell');
startGame();

// Button (onClick) Function
function startGame() {
    // endGame div to be displayed none
	document.querySelector(".endGame").style.display = "none";
	// origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    origBoard = Array.from(Array(numOfCells).keys());
    // for each cell -- start an eventListener -- remove any added property CSS 
	for (let i = 0; i < numOfCells; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
    let target = square.target.id;
	if (typeof origBoard[target] == 'number') {
		turn(target, humanPlayer)
		if (!checkWin(origBoard, humanPlayer) && !checkTie()) {
            setTimeout(function() {
                turn(bestSpot(), aiPlayer);
            }, delayInMilliseconds);
        }
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    // ALL THE ID'S NUMBER FOR THE CURRENT PLAYER
    // arr.reduce((prev_value, curr_value, curr_index) => (LOGIC HERE TO RETURN), initial_value)
    let plays = board.reduce((prev_value, curr_value, curr_index) => 
        (curr_value === player) ? prev_value.concat(curr_index) : prev_value, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
        // arr.every((element) => (LOGIC RETURN TRUE OR FALSE))
        // The logic should return for every elemnt in arr TRUE value to get out of every() function a TRUE value
		if (win.every(ele => plays.indexOf(ele) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == humanPlayer ? "skyblue" : "rgb(243, 103, 103)";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "Congratulation, Human!" : "Congratulation, Computer!");
}

function declareWinner(str) {
	document.querySelector(".endGame").style.display = "block";
	document.querySelector(".endGame .text").innerText = str;
}

function emptySquares() {
	return origBoard.filter((ele) => typeof ele === 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < numOfCells; i++) {
			cells[i].style.backgroundColor = 'rgb(123, 189, 123)';
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Game Tie!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availCells = emptySquares();

    // As miniMax's basically recursion Algorithm
    // The BASE case 
    // If Human wins, Then Score -1
    // If Computer wins, Then Score 1
    // If Tie, Then Score 0
	if (checkWin(newBoard, humanPlayer)) {
		return {score: -1};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 1};
	} else if (availCells.length === 0) {
		return {score: 0};
	}

    // all the terminal boards from every empty Cell
	let moves = [];
	for (let i = 0; i < availCells.length; i++) {
		let move = {};
		move.index = newBoard[availCells[i]];
		newBoard[availCells[i]] = player;

        let result;
		if (player == aiPlayer) {
            result = minimax(newBoard, humanPlayer);
		} else {
			result = minimax(newBoard, aiPlayer);
		}
        move.score = result.score;
		newBoard[availCells[i]] = move.index;
		moves.push(move);
	}

	let bestMove, bestScore;
	if(player === aiPlayer) {
		bestScore = -Infinity;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		bestScore = Infinity;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	return moves[bestMove];
}

// THE END :)
