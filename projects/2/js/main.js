'use strict';
console.log(`Touch nums ;)`)
var gDifficulty = 0;
var gCount = 1;
var gNums;
var gStatus = 0;
var gTime = 0;
var gDifficulties = document.querySelector('.select-difficulty');
var gBoard = document.querySelector('.game-body');
var gMsg = document.querySelector('.msg');

function initGame() {
    gNums = randomiseArray(gDifficulty);
    document.querySelector('.header').style.display = 'block';
    gMsg.style.display = 'none';
    render();
}

function render() {
    var strHTML = '';
    var rowsCols = Math.sqrt(gDifficulty);
    var startNum = 0;
    for (var i = 0; i < rowsCols; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < rowsCols; j++) {
            strHTML += `<td onclick="cellClicked(this)">${gNums[startNum++]}</td>`;
        }
        strHTML += '</tr>';
    }
    // gBoard.classList.remove('hidden');
    gBoard.innerHTML = strHTML;
}

function difficultySelect(elBtn) {
    if (elBtn.innerText === "Easy") {
        gDifficulty = 16;
    } else if (elBtn.innerText === "Medium") {
        gDifficulty = 25;
    } else {
        gDifficulty = 36;
    }
    gDifficulties.classList.add('hidden');
    initGame();
}

function randomiseArray(num) {
    var res = [];
    if (gDifficulty) {
        for (var i = 0; i < num; i++) {
            res.push(i + 1);
        }
    }
    shuffle(res);
    return res;
}

function cellClicked(elCell) {
    if (+elCell.innerText === gCount) {
        elCell.classList.add('check');
        gCount++;
    }
    if (gCount === 2) {
        setTimeout(start, 100);
    } else if (gCount === gNums.length + 1) {
        gStatus = 0;
        // var resetGame = confirm('Play again?')
        document.querySelector('.header').style.display = 'none';
        gMsg.style.display = 'block';
        gDifficulties.style.display = 'block';
        // if (resetGame) {
        //     gDifficulties.classList.remove('hidden');
        //     // gBoard.classList.add('hidden');
        //     gTime = 0;
        //     initGame();
        // }
    }
}

function timer() {
    if (gStatus === 1) {
        setTimeout(function () {
            gTime++;
            var min = Math.floor(gTime / 100 / 60);
            var sec = Math.floor(gTime / 100);
            var mSec = gTime % 100;

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
            document.querySelector(".timer").innerHTML = min + ":" + sec + ":" + mSec;
            timer();
        }, 10)
    }
}

function start() {
    var elTimer = document.querySelector('.timer-display');
    elTimer.style.display = 'block';
    gStatus = 1;
    timer();
}

function shuffle(arr) {
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}
