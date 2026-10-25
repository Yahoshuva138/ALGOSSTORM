// ========================================================
// ALGOSSTORM — Storm-Shell CLI Terminal (~) Modal Engine
// ========================================================

const TERMINAL_HISTORY = [];
let historyIndex = -1;

function openTerminal() {
  const modal = document.getElementById('terminalModal');
  if (modal) {
    modal.classList.add('open');
    if (typeof soundClick === 'function') soundClick();
    const input = document.getElementById('terminalCliInput');
    if (input) setTimeout(() => input.focus(), 80);
  }
}

function closeTerminal() {
  const modal = document.getElementById('terminalModal');
  if (modal) {
    modal.classList.remove('open');
    if (typeof soundClick === 'function') soundClick();
  }
}

function printToTerminal(content, type = 'normal') {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const line = document.createElement('div');
  line.className = `term-line term-${type}`;
  line.innerHTML = content;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

async function executeCommand(cmdStr) {
  const raw = cmdStr.trim();
  if (!raw) return;

  TERMINAL_HISTORY.push(raw);
  historyIndex = TERMINAL_HISTORY.length;

  printToTerminal(`<span class="term-prompt">user@algosstorm:~$</span> ${escapeHtml(raw)}`, 'cmd');

  const tokens = raw.split(/\s+/);
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (typeof soundGameBeep === 'function') soundGameBeep();

  switch (cmd) {
    case 'help':
      printToTerminal(`
        <strong style="color:var(--amber-gold)">ALGOSSTORM Storm-Shell Commands:</strong><br>
        &nbsp;&nbsp;<strong>help</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show this command list<br>
        &nbsp;&nbsp;<strong>quest [day]</strong>&nbsp;&nbsp;&nbsp;- Inspect problem details (e.g. quest 1)<br>
        &nbsp;&nbsp;<strong>contests</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Display 4 contest dates & deadlines<br>
        &nbsp;&nbsp;<strong>stats</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show your 21-day progress & tier<br>
        &nbsp;&nbsp;<strong>cf &lt;handle&gt;</strong>&nbsp;&nbsp;&nbsp;- Fetch Codeforces user rating & rank<br>
        &nbsp;&nbsp;<strong>storm</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Trigger thunder and lightning flash<br>
        &nbsp;&nbsp;<strong>sound</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Toggle audio synthesizer effects<br>
        &nbsp;&nbsp;<strong>clear</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the terminal buffer<br>
        &nbsp;&nbsp;<strong>exit</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close the terminal modal
      `, 'info');
      break;

    case 'quest':
      if (args.length === 0) {
        printToTerminal(`Usage: <code>quest &lt;day 1-21&gt;</code> (e.g. <code>quest 1</code>)`, 'info');
      } else {
        const dayNum = parseInt(args[0], 10);
        if (isNaN(dayNum) || dayNum < 1 || dayNum > 21) {
          printToTerminal(`Error: Day must be an integer between 1 and 21.`, 'err');
        } else {
          const quest = (typeof QUEST_DATA !== 'undefined') ? QUEST_DATA.find(q => q.id === dayNum) : null;
          if (quest) {
            printToTerminal(`
              <strong>${quest.day} (${quest.date})</strong>: ${quest.title}<br>
              Topic: <span style="color:var(--amber-gold)">${quest.topic}</span> | Rating: ${quest.rating}<br>
              URL: <a href="${quest.cfUrl}" target="_blank" style="color:var(--lightning-blue)">${quest.cfUrl}</a><br>
              Hint: ${quest.hint}
            `, 'success');
          } else {
            printToTerminal(`Day ${dayNum} quest not found.`, 'err');
          }
        }
      }
      break;

    case 'contests':
      printToTerminal(`
        <strong style="color:var(--amber-gold)">⚡ 4 CONTEST SCHEDULE (24-Hour Windows):</strong><br>
        1. <strong>27 Oct</strong> - Prefix Sum & Difference Array Surge<br>
        2. <strong>01 Nov</strong> - Constructive Algorithms & Invariants<br>
        3. <strong>06 Nov</strong> - Greedy Strategies & Invariance Tempest<br>
        4. <strong>12 Nov</strong> - Grand Storm Finale (Maths & Mixed)
      `, 'info');
      break;

    case 'stats':
      let solved = [];
      try {
        solved = JSON.parse(localStorage.getItem('algosstorm_solved_days') || '[]');
      } catch (e) {}
      printToTerminal(`
        Quests Solved: <strong style="color:var(--storm-cyan)">${solved.length} / 21</strong> (${Math.round((solved.length / 21) * 100)}%)<br>
        Current Rank: <strong style="color:var(--amber-gold)">${typeof getRankTitle === 'function' ? getRankTitle(solved.length) : 'Storm Initiate'}</strong>
      `, 'success');
      break;

    case 'cf':
      if (args.length === 0) {
        printToTerminal(`Usage: <code>cf &lt;handle&gt;</code> (e.g. <code>cf tourist</code>)`, 'info');
      } else {
        const handle = args[0];
        printToTerminal(`Querying Codeforces API for: <strong>${escapeHtml(handle)}</strong>...`, 'info');
        try {
          const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`);
          const data = await res.json();
          if (data.status === 'OK' && data.result && data.result.length > 0) {
            const u = data.result[0];
            printToTerminal(`
              <strong>Handle:</strong> ${u.handle} (${u.firstName || ''} ${u.lastName || ''})<br>
              <strong>Rating:</strong> <span style="color:var(--amber-gold)">${u.rating || 'Unrated'}</span> (Max: ${u.maxRating || 'N/A'})<br>
              <strong>Rank:</strong> ${u.rank || 'Unrated'} (Max: ${u.maxRank || 'N/A'})<br>
              <strong>Contribution:</strong> ${u.contribution}
            `, 'success');
          } else {
            printToTerminal(`User "${handle}" not found on Codeforces.`, 'err');
          }
        } catch (e) {
          printToTerminal(`Network error while fetching Codeforces info. Try again later.`, 'err');
        }
      }
      break;

    case 'storm':
    case 'lightning':
      printToTerminal(`⚡ Summoning lightning storm...`, 'info');
      if (typeof triggerLightning === 'function') {
        triggerLightning();
      }
      break;

    case 'sound':
    case 'mute':
      if (typeof toggleSound === 'function') {
        toggleSound();
        printToTerminal(`Audio set to: ${soundEnabled ? 'ENABLED 🔊' : 'MUTED 🔇'}`, 'info');
      }
      break;

    case 'clear':
      const body = document.getElementById('terminalBody');
      if (body) body.innerHTML = '';
      break;

    case 'exit':
      closeTerminal();
      break;

    default:
      printToTerminal(`Command not recognized: "${escapeHtml(cmd)}". Type <code>help</code> for options.`, 'err');
      break;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.addEventListener('DOMContentLoaded', () => {
  const terminalToggle = document.getElementById('terminalToggle');
  if (terminalToggle) terminalToggle.onclick = openTerminal;

  const closeBtn = document.getElementById('closeTerminalBtn');
  if (closeBtn) closeBtn.onclick = closeTerminal;

  const backdrop = document.getElementById('terminalModal');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeTerminal();
    });
  }

  const input = document.getElementById('terminalCliInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value;
        input.value = '';
        executeCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          input.value = TERMINAL_HISTORY[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < TERMINAL_HISTORY.length - 1) {
          historyIndex++;
          input.value = TERMINAL_HISTORY[historyIndex] || '';
        } else {
          historyIndex = TERMINAL_HISTORY.length;
          input.value = '';
        }
      }
    });
  }

  // Keyboard shortcut: '~' or '`' to open terminal
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
      const modal = document.getElementById('terminalModal');
      if (modal && modal.classList.contains('open')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });
});
