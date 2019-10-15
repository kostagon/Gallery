'use strict';
console.log('in-picture');

var gQuests = createQuests();
var gCurrQuestIdx = 0;

var gElWinnerMsg = document.querySelector('.winner');
var gElModal = document.querySelector('.root');
// console.log(gQuests);

function initGame() {
    // start game, on-load activates `renderQuest()` at 1st question. also 
    renderQuest();
}

function checkAnswer(optIdx) {
    // check optIdx.correctOptIndex, if true gCurrQuestIdx++
    optIdx = +optIdx.dataset.index;
    if (optIdx === gQuests[gCurrQuestIdx].correctOptIndex) {
        // console.log('Right answer!!!')
        gCurrQuestIdx++;
        renderQuest();
    } else {
        alert('Wrong Answer!');
    }
    // console.log(gCurrQuestIdx);

}

function renderQuest() {
    // renders a new question.
    if (gCurrQuestIdx < 3) {
        var strHTML = `<img src="./img/${gQuests[gCurrQuestIdx].img}" alt="" />`
        gElModal.innerHTML = strHTML;
    }

    var elBtnContainer = document.querySelector('.questions');
    if (gCurrQuestIdx < 3) {
        var btnHTML = '';
        for (var i = 0; i < gQuests[gCurrQuestIdx].opts.length; i++) {
            btnHTML += `<button onclick="checkAnswer(this, ${i})" data-index="${i}" class="btn">
                            ${gQuests[gCurrQuestIdx].opts[i]}
                        </button> `;
        }
        elBtnContainer.innerHTML = btnHTML;
    }else {
        gElWinnerMsg.style.display = 'block';
        gElModal.style.display = 'none';
        elBtnContainer.innerHTML = '<button onclick="resetGame()" class="reset-btn">Play again?</button>';
    }
}

function resetGame() {
        gCurrQuestIdx = 0;
        gElWinnerMsg.style.display = 'none';
        gElModal.style.display = 'block';
        renderQuest();
}

function createQuests() {
    // for now return a hard coded array that contains 3 objects
    var quests = [{
            id: 0,
            opts: ['Mario', 'Saddam Hussein'],
            correctOptIndex: 0,
            img: '1.png'
        },
        {
            id: 1,
            opts: ['Michelangelo', 'Koopa Troopa'],
            correctOptIndex: 1,
            img: '2.png'
        },
        {
            id: 2,
            opts: ['Yoshi', 'Luigi'],
            correctOptIndex: 1,
            img: '3.png'
        }
    ];

    return quests;
}