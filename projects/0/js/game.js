'use strict';
var WALL = '🌵';
var FOOD = ' . ';
var EMPTY = ' ';
var SUPER = '🍕';
var CHERRY = '🍒'

var gResetBtn = document.querySelector('.reset-btn');
var gElMsg = document.querySelector('.msg');

var gEmptyCells = [];
var gIsVictorious = false;
var gCherryInterval;

var gBoard;
var gGame = {
  score: 0,
  isOn: false
};


function init() {
  gIsVictorious = false;
  gElMsg.style.display = 'none';
  gResetBtn.style.display = 'none';
  gFoodAmount = -1;
  gFoodCount = 0;
  gBoard = buildBoard();
  gGame.score = 0;
  document.querySelector('header h3 span').innerText = gGame.score;

  createPacman(gBoard);
  createGhosts(gBoard);

  printMat(gBoard, '.board-container');
  // console.table(gBoard);
  gGame.isOn = true;

  gCherryInterval = setInterval(createCherry, 15000);

}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {
        board[i][j] = WALL;
      } else if ((i === 1 && j === 1) ||
        (i === 1 && j === SIZE - 2) ||
        (i === SIZE - 2 && j === 1) ||
        (i === SIZE - 2 && j === SIZE - 2)) {
        board[i][j] = SUPER;
      } else {
        board[i][j] = FOOD;
        gEmptyCells.push({
          i: i,
          j: j
        })
        gFoodAmount++;
      }
    }
  }
  // console.log(gEmptyCells);
  return board;
}

function createCherry() {
  var emptyCells = getCellsByChar(gBoard, EMPTY);
  if (!emptyCells) return;
  var cherryIdx = getRandomIntInclusive(0, emptyCells.length - 1);
  var cherryCell = emptyCells[cherryIdx];
  gBoard[cherryCell.i][cherryCell.j] = CHERRY;
  renderCell(cherryCell, CHERRY);
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;

  document.querySelector('header h3 span').innerText = gGame.score;
}


function gameOver() {
  // console.log('Game Over');
  gElMsg = document.querySelector('.msg');
  gElMsg.style.display = "block";
  if (gIsVictorious) {
    gElMsg.innerText = 'Winner winner chicken dinner';
  } else {
    gElMsg.innerText = 'You lose!';
  }
  gResetBtn.style.display = "block";
  // if(resetBtn.onclick)
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  gIntervalGhosts = null;
  clearInterval(createCherry);
  gCherryInterval = null;
}