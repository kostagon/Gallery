var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';

var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';


var gBallsCollected;				// check init function for further information :-)
var gBallsCounter;					// check init function for further information :-)
var gGamerPos = {};					// check init function for further information :-)
var gBoard;							// check init function for further information :-)
var gInterval;						// check init function for further information :-)

function init() {
	document.querySelector('.restart-btn').style.display = 'none';
	document.querySelector('.balls-count').innerText = '';
	gBallsCollected = 0;
	gBallsCounter = 2;
	gGamerPos = {
		i: 2,
		j: 9
	};
	gBoard = buildBoard();
	renderBoard(gBoard);
	gInterval= setInterval(function () {
		itemGenerator()
		renderBoard(gBoard);
	}, 3000);
}

function buildBoard() {
	// Create the Matrix 10 * 12 
	var board = new Array(10);
	for (var i = 0; i < board.length; i++) {
		board[i] = new Array(12);
	}
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR everywhere and WALL at edges
			board[i][j] = {
				type: 'FLOOR',
				gameElement: null
			}
			if (i === 0 || j === 0 ||
				i === board.length - 1 || j === board[0].length - 1) {
				board[i][j].type = WALL;
			}
		}
	}
	// Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;



	board[3][3].gameElement = BALL;
	board[3][8].gameElement = BALL;
	// console.table(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({
				i: i,
				j: j
			}) // e.g. - cell-3-8

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	var elBallsCount = document.querySelector('.balls-count');
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to ake sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	// if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
	if (iAbsDiff + jAbsDiff === 1) {
		// console.log('Moving to: ', i, j);

		if (targetCell.gameElement === BALL) {
			gBallsCollected++;
			console.log('Balls collected: ' + gBallsCollected);
			elBallsCount.innerText = `You have collected: ${gBallsCollected}`;
		}
		if (gBallsCounter === gBallsCollected) {
			var resetBtn = document.querySelector('.restart-btn');
			resetBtn.style.display = 'block';
			elBallsCount.innerText = 'You have won, now go pick on someone else :-)';

			clearInterval(gInterval);
		}

		// Move the gamer

		// Update the MODEL and DOM
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		renderCell(gGamerPos, '');

		gGamerPos.i = i;
		gGamerPos.j = j;

		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		renderCell(gGamerPos, GAMER_IMG);

	} else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}


function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;

}

function shuffle(nums) {
	var randIdx, keep, i;
	for (i = nums.length - 1; i > 0; i--) {
		randIdx = getRandomIntInclusive(0, nums.length - 1);
		keep = nums[i];
		nums[i] = nums[randIdx];
		nums[randIdx] = keep;
	}
	return nums;
}


function itemGenerator() {
	var iIdx = getRandomIntInclusive(1, gBoard.length - 2);
	var jIdx = getRandomIntInclusive(1, gBoard[0].length - 2);
	if (!gBoard.gameElement) {
		gBoard[iIdx][jIdx].gameElement = BALL;
		gBallsCounter++;
		console.log('gBallsCunter:  ' + gBallsCounter);
	}
}