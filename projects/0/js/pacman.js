'use strict';

var gPacman;
const PACMAN = '😲';

var gFoodAmount = null;
var gFoodCount = null;

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;

  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    updateScore(1);
    gFoodCount++;
    if (gFoodCount === gFoodAmount) {
      gIsVictorious = true;
      gameOver();
    }
  }
  if (nextCell === CHERRY) {
    updateScore(10);
  }

  if (nextCell === SUPER) {
    if (gPacman.isSuper) return;
    gPacman.isSuper = true;
    handleSuper();
  }
  if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      handleFragile(nextLocation);

    } else {
      gameOver();
      renderCell(gPacman.location, EMPTY);
      return;
    }
  }

  // Update the model to reflect movement
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);
}

function handleFragile(coords) {
  var eatenGhosts = [];
  for (var i = 0; i < gGhosts.length; i++) {
    var currGhost = gGhosts[i]
    if (currGhost.location.i === coords.i && currGhost.location.j === coords.j) {
      gGhosts.splice(i, 1);
      eatenGhosts.push(currGhost);
    }
  }

  setTimeout(function () {
    for (var i = 0; i < eatenGhosts.length; i++) {
      gGhosts.push(eatenGhosts[i])
      
    }
    for(var i = 0; i < eatenGhosts.length; i++) {
      eatenGhosts[i].color = getRandomColor();
    }
    for (var i = 0; i < gGhosts.length; i++) { 
      renderCell(gGhosts[i].location, getGhostHTML(gGhosts[i]))
    }
  }, 5000);
}

function handleSuper() {
  var ghostColors = [];
  for (var i = 0; i < gGhosts.length; i++) {
    ghostColors.push(gGhosts[i].color);
    gGhosts[i].color = 'blue';
    renderCell(gGhosts[i].location, `<span style="color:blue">${GHOST}</span>`);
  }

  setTimeout(() => {
    gPacman.isSuper = false;
    for (var i = 0; i < gGhosts.length; i++) {
      gGhosts[i].color = ghostColors[i];
    }
  }, 5000)
}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };

  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      break;
    case 'ArrowRight':
      nextLocation.j++;
      break;
    default:
      return null;
  }

  return nextLocation;
}