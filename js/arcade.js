// ========================================================
// ALGOSSTORM — Arcade: 4 Competitive Algorithmic Mini-Games
// ========================================================

const ARCADE_STORAGE_KEY = 'algosstorm_arcade_highscores';

let activeGame = 'prefix'; // 'prefix' | 'diff' | 'parity' | 'greedy'
let gameScore = 0;
let gameStreak = 0;
let gameTimerInterval = null;
let gameTimeLeft = 100; // Percentage 0 - 100
let isGameRunning = false;
let currentGameData = null;

function getHighScores() {
  try {
    return JSON.parse(localStorage.getItem(ARCADE_STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveHighScore(gameName, score) {
  const scores = getHighScores();
  if (!scores[gameName] || score > scores[gameName]) {
    scores[gameName] = score;
    localStorage.setItem(ARCADE_STORAGE_KEY, JSON.stringify(scores));
  }
}

function switchArcadeGame(gameName) {
  if (isGameRunning) stopCurrentGame();
  activeGame = gameName;

  document.querySelectorAll('.arcade-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-game') === gameName);
  });

  if (typeof soundClick === 'function') soundClick();
  showStartOverlay();
}

function showStartOverlay() {
  const overlay = document.getElementById('arcadeOverlay');
  const board = document.getElementById('arcadeBoard');
  const title = document.getElementById('overlayTitle');
  const desc = document.getElementById('overlayDesc');
  const scores = getHighScores();
  const high = scores[activeGame] || 0;

  if (overlay) overlay.style.display = 'flex';
  if (board) board.style.display = 'none';

  const descriptions = {
    prefix: {
      title: '⚡ PREFIX SUM BLITZ',
      desc: 'Rapidly compute range sums sum(L..R) using mental prefix queries before the clock expires!'
    },
    diff: {
      title: '🍂 DIFFERENCE ARRAY DRIFT',
      desc: 'Range updates arrive in batches! Calculate the final value of the queried index.'
    },
    parity: {
      title: '⚡ PARITY & CONSTRUCTIVE STORM',
      desc: 'Rapid-fire True/False invariants on odd/even sums, XORs, and modulo arithmetic.'
    },
    greedy: {
      title: '🪙 GREEDY INTERVAL SNATCHER',
      desc: 'Click mutually compatible non-overlapping intervals to snatch the maximum count!'
    }
  };

  if (title) title.textContent = descriptions[activeGame].title;
  if (desc) {
    desc.innerHTML = `
      ${descriptions[activeGame].desc}<br>
      <span style="display:inline-block; margin-top: 10px; color: var(--amber-gold); font-weight:700;">
        Personal Best: ${high} pts
      </span>
    `;
  }
}

function startActiveGame() {
  const overlay = document.getElementById('arcadeOverlay');
  const board = document.getElementById('arcadeBoard');
  if (overlay) overlay.style.display = 'none';
  if (board) board.style.display = 'flex';

  gameScore = 0;
  gameStreak = 0;
  isGameRunning = true;
  updateArcadeHUD();

  if (typeof soundSuccess === 'function') soundSuccess();
  nextRound();
}

function stopCurrentGame() {
  isGameRunning = false;
  if (gameTimerInterval) {
    clearInterval(gameTimerInterval);
    gameTimerInterval = null;
  }
  saveHighScore(activeGame, gameScore);
}

function updateArcadeHUD() {
  const scoreElem = document.getElementById('arcadeScoreVal');
  const streakElem = document.getElementById('arcadeStreakVal');
  const fillElem = document.getElementById('arcadeTimerFill');

  if (scoreElem) scoreElem.textContent = `${gameScore} pts`;
  if (streakElem) streakElem.textContent = `Combo: ${gameStreak}x`;
  if (fillElem) fillElem.style.width = `${gameTimeLeft}%`;
}

function resetTimer(seconds, onExpire) {
  if (gameTimerInterval) clearInterval(gameTimerInterval);
  gameTimeLeft = 100;
  const stepMs = 50;
  const decrement = (100 / (seconds * 1000)) * stepMs;

  const timerFill = document.getElementById('arcadeTimerFill');
  gameTimerInterval = setInterval(() => {
    gameTimeLeft -= decrement;
    if (gameTimeLeft <= 0) {
      gameTimeLeft = 0;
      clearInterval(gameTimerInterval);
      if (typeof soundError === 'function') soundError();
      onExpire();
    }
    if (timerFill) timerFill.style.width = `${gameTimeLeft}%`;
  }, stepMs);
}

function handleCorrectAnswer(bonus = 100) {
  gameStreak++;
  const mult = Math.min(4, 1 + Math.floor(gameStreak / 3));
  gameScore += bonus * mult;
  updateArcadeHUD();
  if (typeof soundGameBeep === 'function') soundGameBeep();
  nextRound();
}

function handleWrongAnswer() {
  gameStreak = 0;
  updateArcadeHUD();
  if (typeof soundError === 'function') soundError();
  // Brief shake
  const board = document.getElementById('arcadeBoard');
  if (board) {
    board.style.transform = 'translateX(6px)';
    setTimeout(() => { board.style.transform = 'translateX(-6px)'; }, 50);
    setTimeout(() => { board.style.transform = 'translateX(0)'; }, 100);
  }
  nextRound();
}

function gameOver() {
  stopCurrentGame();
  const overlay = document.getElementById('arcadeOverlay');
  const title = document.getElementById('overlayTitle');
  const desc = document.getElementById('overlayDesc');
  const board = document.getElementById('arcadeBoard');

  if (overlay) overlay.style.display = 'flex';
  if (board) board.style.display = 'none';

  if (title) title.textContent = '⚡ TIME EXPIRED! ⚡';
  if (desc) {
    desc.innerHTML = `
      Final Score: <strong style="color: var(--amber-gold); font-size: 1.4rem;">${gameScore}</strong> points!<br>
      Streak: ${gameStreak}x · Rank: ${getRankTitle(Math.floor(gameScore / 300))}
    `;
  }
  if (typeof soundFanfare === 'function') soundFanfare();
}

function nextRound() {
  if (!isGameRunning) return;

  if (activeGame === 'prefix') setupPrefixRound();
  else if (activeGame === 'diff') setupDiffRound();
  else if (activeGame === 'parity') setupParityRound();
  else if (activeGame === 'greedy') setupGreedyRound();
}

// ----------------------------------------------------
// GAME 1: PREFIX SUM BLITZ
// ----------------------------------------------------
function setupPrefixRound() {
  const len = 6;
  const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
  const l = Math.floor(Math.random() * 3); // 0, 1, 2
  const r = l + Math.floor(Math.random() * 3) + 1; // l+1, l+2, l+3

  let expected = 0;
  for (let i = l; i <= r; i++) expected += arr[i];

  currentGameData = { arr, l, r, expected };

  const promptElem = document.getElementById('arcadePrompt');
  const tilesElem = document.getElementById('arcadeTiles');
  const controlsElem = document.getElementById('arcadeControls');

  if (promptElem) {
    promptElem.innerHTML = `Find Sum in Range: <span style="color: var(--amber-gold);">[${l + 1} ... ${r + 1}]</span> (1-indexed)`;
  }

  if (tilesElem) {
    tilesElem.innerHTML = arr.map((val, idx) => `
      <div class="num-tile ${idx >= l && idx <= r ? 'highlight' : ''}">
        ${val}
        <span style="position: absolute; bottom: 2px; font-size: 0.6rem; color: var(--text-muted);">${idx + 1}</span>
      </div>
    `).join('');
  }

  if (controlsElem) {
    controlsElem.innerHTML = `
      <div class="arcade-input-row">
        <input type="number" id="prefixAnswerInput" class="arcade-input" placeholder="?" autofocus>
        <button class="btn-glow" id="prefixSubmitBtn">Submit</button>
      </div>
    `;

    const input = document.getElementById('prefixAnswerInput');
    const btn = document.getElementById('prefixSubmitBtn');

    const check = () => {
      const val = parseInt(input.value, 10);
      if (val === currentGameData.expected) handleCorrectAnswer(120);
      else handleWrongAnswer();
    };

    if (btn) btn.onclick = check;
    if (input) {
      input.focus();
      input.onkeydown = (e) => { if (e.key === 'Enter') check(); };
    }
  }

  resetTimer(7, gameOver);
}

// ----------------------------------------------------
// GAME 2: DIFFERENCE ARRAY DRIFT
// ----------------------------------------------------
function setupDiffRound() {
  const baseArr = [0, 0, 0, 0, 0];
  const queryCount = 2;
  const ops = [];

  for (let q = 0; q < queryCount; q++) {
    const l = Math.floor(Math.random() * 3);
    const r = l + Math.floor(Math.random() * 2) + 1;
    const add = (Math.floor(Math.random() * 4) + 1) * 2;
    ops.push({ l, r, add });
    for (let i = l; i <= r; i++) baseArr[i] += add;
  }

  const queryIdx = Math.floor(Math.random() * baseArr.length);
  const expected = baseArr[queryIdx];
  currentGameData = { ops, queryIdx, expected };

  const promptElem = document.getElementById('arcadePrompt');
  const tilesElem = document.getElementById('arcadeTiles');
  const controlsElem = document.getElementById('arcadeControls');

  if (promptElem) {
    promptElem.innerHTML = `What is <span style="color:var(--amber-gold)">A[${queryIdx + 1}]</span> after these operations on A = [0, 0, 0, 0, 0]?`;
  }

  if (tilesElem) {
    tilesElem.innerHTML = ops.map((op, i) => `
      <div style="background: rgba(255, 255, 255, 0.06); padding: 8px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); font-family: var(--font-mono); font-size: 0.9rem;">
        Op #${i + 1}: Add <strong style="color: var(--storm-cyan)">+${op.add}</strong> to [${op.l + 1}..${op.r + 1}]
      </div>
    `).join('');
  }

  if (controlsElem) {
    // Generate 4 multiple-choice options
    const choices = new Set([expected]);
    while (choices.size < 4) {
      const offset = (Math.floor(Math.random() * 5) - 2) * 2;
      const fake = Math.max(0, expected + offset);
      choices.add(fake);
    }
    const shuffled = Array.from(choices).sort(() => Math.random() - 0.5);

    controlsElem.innerHTML = `
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        ${shuffled.map(choice => `
          <button class="btn-secondary" style="font-size: 1.15rem; min-width: 70px; justify-content: center;" onclick="checkDiffChoice(${choice})">
            ${choice}
          </button>
        `).join('')}
      </div>
    `;
  }

  resetTimer(8, gameOver);
}

window.checkDiffChoice = function(val) {
  if (currentGameData && val === currentGameData.expected) {
    handleCorrectAnswer(150);
  } else {
    handleWrongAnswer();
  }
};

// ----------------------------------------------------
// GAME 3: PARITY & CONSTRUCTIVE STORM
// ----------------------------------------------------
function setupParityRound() {
  const bank = [
    { q: "Is the sum of 4 odd integers ALWAYS even?", ans: true },
    { q: "If A ⊕ B = C, is A ⊕ C always equal to B?", ans: true },
    { q: "Can a graph with 5 vertices all of degree 3 exist?", ans: false },
    { q: "If N is prime and N > 2, is N always odd?", ans: true },
    { q: "Is 2^10 mod 7 equal to 2?", ans: true },
    { q: "Can the product of 3 consecutive integers be odd?", ans: false },
    { q: "Is GCD(A, B) always equal to GCD(B, A mod B)?", ans: true },
    { q: "If N % 4 == 0, is the XOR sum of 1..N always equal to N?", ans: true },
    { q: "Is every even integer > 2 expressible as sum of 2 primes in known tests?", ans: true }
  ];

  const pick = bank[Math.floor(Math.random() * bank.length)];
  currentGameData = pick;

  const promptElem = document.getElementById('arcadePrompt');
  const tilesElem = document.getElementById('arcadeTiles');
  const controlsElem = document.getElementById('arcadeControls');

  if (promptElem) {
    promptElem.textContent = "Invariant Check: TRUE or FALSE?";
  }

  if (tilesElem) {
    tilesElem.innerHTML = `
      <div style="font-size: 1.25rem; font-weight: 700; color: #fff; max-width: 500px; line-height: 1.4;">
        ${pick.q}
      </div>
    `;
  }

  if (controlsElem) {
    controlsElem.innerHTML = `
      <div style="display: flex; gap: 16px; justify-content: center;">
        <button class="btn-cyan" style="min-width: 120px;" onclick="checkParityAnswer(true)">TRUE ✓</button>
        <button class="btn-glow" style="min-width: 120px;" onclick="checkParityAnswer(false)">FALSE ✗</button>
      </div>
    `;
  }

  resetTimer(6, gameOver);
}

window.checkParityAnswer = function(userBool) {
  if (currentGameData && userBool === currentGameData.ans) {
    handleCorrectAnswer(100);
  } else {
    handleWrongAnswer();
  }
};

// ----------------------------------------------------
// GAME 4: GREEDY INTERVAL SNATCHER
// ----------------------------------------------------
function setupGreedyRound() {
  // Generate 4 intervals [s, e]
  const intervals = [
    { id: 1, s: 1, e: 3 },
    { id: 2, s: 2, e: 5 },
    { id: 3, s: 4, e: 7 },
    { id: 4, s: 6, e: 9 }
  ].sort(() => Math.random() - 0.5);

  currentGameData = { intervals, selected: [] };

  const promptElem = document.getElementById('arcadePrompt');
  const tilesElem = document.getElementById('arcadeTiles');
  const controlsElem = document.getElementById('arcadeControls');

  if (promptElem) {
    promptElem.textContent = "Select mutually compatible intervals to get 3 items!";
  }

  if (tilesElem) {
    renderGreedyTiles();
  }

  if (controlsElem) {
    controlsElem.innerHTML = `
      <button class="btn-glow" onclick="checkGreedyComplete()">Confirm Selection</button>
    `;
  }

  resetTimer(9, gameOver);
}

function renderGreedyTiles() {
  const tilesElem = document.getElementById('arcadeTiles');
  if (!tilesElem) return;

  tilesElem.innerHTML = currentGameData.intervals.map(int => {
    const isSel = currentGameData.selected.includes(int.id);
    return `
      <div class="num-tile ${isSel ? 'highlight' : ''}" style="width: auto; min-width: 80px; padding: 0 10px; cursor: pointer;" onclick="toggleGreedyInterval(${int.id})">
        [${int.s} - ${int.e}]
      </div>
    `;
  }).join('');
}

window.toggleGreedyInterval = function(id) {
  const idx = currentGameData.selected.indexOf(id);
  if (idx === -1) currentGameData.selected.push(id);
  else currentGameData.selected.splice(idx, 1);
  if (typeof soundClick === 'function') soundClick();
  renderGreedyTiles();
};

window.checkGreedyComplete = function() {
  const chosen = currentGameData.intervals.filter(i => currentGameData.selected.includes(i.id));
  chosen.sort((a, b) => a.s - b.s);

  let valid = true;
  for (let i = 0; i < chosen.length - 1; i++) {
    if (chosen[i].e > chosen[i + 1].s) {
      valid = false;
      break;
    }
  }

  if (valid && chosen.length >= 2) {
    handleCorrectAnswer(140 + chosen.length * 30);
  } else {
    handleWrongAnswer();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.arcade-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchArcadeGame(tab.getAttribute('data-game'));
    });
  });

  const startBtn = document.getElementById('arcadeStartBtn');
  if (startBtn) startBtn.onclick = startActiveGame;

  showStartOverlay();
});
