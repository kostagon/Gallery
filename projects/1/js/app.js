'use strict';
var MARK = '📌';
var EXPLOSION = '💥';
var MINE = '💣';
var EMPTY = ' ';

var gStatus = 0;
var gEndingMsg = document.querySelector('.msg');
var gResetBtn = document.querySelector('.reset-btn');

document.querySelector('.helper').style.display = 'none';
document.querySelector('.board-container').style.display = 'none';
document.querySelector('.container-head').style.display = 'none';

var gBoard;
var gMinesLocation;

var gTotalCells;

var gGame;

function initGame() {
    gResetBtn.innerText = '😃';
    gEndingMsg.innerText = '';
    gTotalCells = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;
    gGame = {
        isOn: false,
        showCount: 0,
        markedCount: 0,
        secsPassed: 0,
        isFirstClick: true,
        isLost: false,
        status: 0,
        hints: 2
    };
    gMinesLocation = generateMineIdxs(gLevel.MINES);
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    gGame.isOn = 1;

    var numOfMines = gLevel.MINES;
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }

    }
    for (i = 0; i < numOfMines; i++) {
        var mineLocationI = gMinesLocation[i].idxI;
        var mineLocationJ = gMinesLocation[i].idxJ;
        if (board[gMinesLocation[i].idxI][gMinesLocation[i].idxJ] !== prevIdxs) {
            board[gMinesLocation[i].idxI][gMinesLocation[i].idxJ] = {
                minesAroundCount: true,
                isShown: false,
                isMine: true,
                isMarked: false,
                symbol: MINE
            }
        }
        var prevIdxs = board[gMinesLocation[i].idxI][gMinesLocation[i].idxJ];
        setMinesNegsCount(board, mineLocationI, mineLocationJ);
    }

    return board;
}

function setMinesNegsCount(board, mineIdxI, mineIdxJ) {
    for (var i = mineIdxI - 1; i <= mineIdxI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = mineIdxJ - 1; j <= mineIdxJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === mineIdxI && j === mineIdxJ) continue;
            board[i][j].minesAroundCount++;
        }
    }

}

function renderBoard(board) {
    var strHTML = '';
    strHTML += '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var className = (board[i][j].isShown) ? 'hidden' : '';
            var strData = `data-i="${i}" data-j="${j}"`;
            strHTML += `<td class="${className} col-${i}-${j}" ${strData}
            onmousedown="checkEvent(event, this, ${i}, ${j})">`;

            if (board[i][j].isMarked) strHTML += MARK;

            if (board[i][j].isMine && board[i][j].isShown) {
                strHTML += board[i][j].symbol;
            } else if (board[i][j].minesAroundCount && board[i][j].isShown) {
                strHTML += board[i][j].minesAroundCount;
            }

            strHTML += '</td>';
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var boardContainer = document.querySelector('.board-container');
    boardContainer.innerHTML = strHTML;
}

function giveHint() {
    var notMines = [];
    var helperBtn = document.querySelector('.helper');
    if (gGame.hints >= 0) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                var currCell = gBoard[i][j];
                if (!currCell.isMine && !currCell.isShown) notMines.push({
                    i,
                    j
                });
            }
        }
        var rndCell = notMines[getRandomInt(0, notMines.length - 1)];
        gGame.hints--;
        helperBtn.innerText = `${gGame.hints + 1} hints left`;
        var x = document.querySelector(`.col-${rndCell.i}-${rndCell.j}`);
        console.log(x);
        x.style.backgroundColor = '#d5dfd7';
        setTimeout(() => {
            x.style.backgroundColor = 'white';
        }, 3000)
    } else {
        helperBtn.innerText = 'Nigmar'
    }

}

function checkEvent(ev, elCell, i, j) {
    if (!ev.button) {
        cellClicked(elCell, i, j);
    } else if (ev.button === 2) {
        cellMarked(elCell);
    } else return;
}

function cellClicked(elCell, cellIdxI, cellIdxJ) {
    if (gBoard[cellIdxI][cellIdxJ].isMine && gGame.isFirstClick) {
        initGame();
    } else {
        if (gGame.isFirstClick) start();
        gGame.isFirstClick = false;

        if (elCell.innerText === MARK) return;
        if (!gBoard[cellIdxI][cellIdxJ].minesAroundCount && !gBoard[cellIdxI][cellIdxJ].isShown) {
            expandShown(gBoard, elCell, cellIdxI, cellIdxJ);
        }
        if (gBoard[cellIdxI][cellIdxJ].isShown) return;
        gBoard[cellIdxI][cellIdxJ].isShown = true;
        if (gBoard[cellIdxI][cellIdxJ]) {

            gGame.showCount++;
        }

        checkGameOver();
        if (gBoard[cellIdxI][cellIdxJ].isMine) {
            gBoard[cellIdxI][cellIdxJ].symbol = EXPLOSION;
            gGame.isOn = false;
            gGame.isLost = true;
        }
        checkGameOver();
        renderBoard(gBoard);
    }

}

function cellMarked(elCell) {
    var currCell = gBoard[elCell.dataset.i][elCell.dataset.j];
    if (currCell.isShown) return;
    if (elCell.innerText === MARK) {
        elCell.innerText = EMPTY;
        gGame.markedCount--;
        currCell.isMarked = false;
    } else {
        elCell.innerText = MARK;
        gGame.markedCount++;
        currCell.isMarked = true;
        checkGameOver();
    }
}
var gLevel;

function setDiff(el) {
    document.querySelector('.difficulties').style.display = 'none';
    document.querySelector('.helper').style.display = 'block';
    document.querySelector('.board-container').style.display = 'block';
    document.querySelector('.container-head').style.display = 'block';
    if (el.innerText === '👶') {
        gLevel = {
            SIZE: 4,
            MINES: 2
        }
    } else if (el.innerText === '👦') {
        gLevel = {
            SIZE: 8,
            MINES: 12
        }
    } else {
        gLevel = {
            SIZE: 12,
            MINES: 30
        }

    }
    initGame();
}

function checkGameOver(cellIdxI, cellIdxJ) {
    if (gGame.isLost) {
        gResetBtn.innerText = '🌵';
        gEndingMsg.innerText = 'Try Again :)'
        gGame.status = 0;
    }
    if (gGame.showCount >= gTotalCells && gGame.markedCount === gLevel.MINES) {
        gResetBtn.innerText = '😎';
        gEndingMsg.innerText = 'Play again champ?'
        gGame.status = 0;
    }

}

function expandShown(board, elCell, cellIdxI, cellIdxJ) {
    for (var i = cellIdxI - 1; i <= cellIdxI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellIdxJ - 1; j <= cellIdxJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellIdxI && j === cellIdxJ) continue;
            if (board[i][j].isMarked) continue;
            else {
                gGame.showCount++;
                // console.log(board[i][j])
            }
            board[i][j].isShown = true;
        }
    }
    renderBoard(board);
}

function generateMineIdxs(num) {
    var mines = [];
    for (var i = 0; i < num; i++) {
        mines[i] = {
            idxI: getRandomInt(0, gLevel.SIZE - 1),
            idxJ: getRandomInt(0, gLevel.SIZE - 1)
        }
    }
    return mines;
}


function btnFn() {
    if (!gGame.isLost) gResetBtn.innerText = '😫';
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function timer() {
    if (gGame.status === 1) {
        setTimeout(function () {
            gGame.secsPassed++;
            var min = Math.floor(gGame.secsPassed / 100 / 60 / 6);
            var sec = Math.floor(gGame.secsPassed / 100 / 60);
            var mSec = Math.floor(gGame.secsPassed / 10);

            if (min < 10) {
                min = "0" + min;
            }
            if (sec >= 60) {
                sec = sec % 60;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            if (mSec < 10) {
                mSec = "0" + mSec;
            }
            document.querySelector(".timer").innerHTML = mSec;
            timer();
        }, 100)
    }
}

function start() {
    var elTimer = document.querySelector('.timer');
    elTimer.style.display = 'block';
    gGame.status = 1;
    timer();
}