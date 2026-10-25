// ========================================================
// ALGOSSTORM — SPA Application Controller & Countdown
// ========================================================

const CONTEST_SCHEDULE = [
  { id: 1, name: "Contest 1: Prefix Sum & Diff Array", date: new Date("2026-10-27T12:00:00Z"), link: "https://codeforces.com/contests" },
  { id: 2, name: "Contest 2: Constructive Logic", date: new Date("2026-11-01T12:00:00Z"), link: "https://codeforces.com/contests" },
  { id: 3, name: "Contest 3: Greedy Invariance", date: new Date("2026-11-06T12:00:00Z"), link: "https://codeforces.com/contests" },
  { id: 4, name: "Contest 4: Grand Storm Finals (Maths)", date: new Date("2026-11-12T12:00:00Z"), link: "https://codeforces.com/contests" }
];

let activeView = 'overview';

function switchView(viewName) {
  activeView = viewName;

  // Toggle view sections
  const views = ['overview', 'roadmap', 'contests', 'arcade', 'codex'];
  views.forEach(v => {
    const sec = document.getElementById(`view${capitalize(v)}`);
    if (sec) {
      sec.classList.toggle('active', v === viewName);
    }
  });

  // Toggle desktop nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === `btnNav${capitalize(viewName)}`);
  });

  // Toggle mobile nav buttons
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
  });

  if (typeof soundClick === 'function') soundClick();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --------------------------------------------------------
// CONTEST COUNTDOWN TIMER
// --------------------------------------------------------
function initCountdownTimer() {
  function tick() {
    const now = new Date();
    // Find next upcoming contest
    let nextContest = CONTEST_SCHEDULE.find(c => c.date > now);
    if (!nextContest) {
      nextContest = CONTEST_SCHEDULE[CONTEST_SCHEDULE.length - 1];
    }

    const diff = Math.max(0, nextContest.date.getTime() - now.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    const dElem = document.getElementById('timerDays');
    const hElem = document.getElementById('timerHours');
    const mElem = document.getElementById('timerMins');
    const sElem = document.getElementById('timerSecs');

    if (dElem) dElem.textContent = pad(days);
    if (hElem) hElem.textContent = pad(hours);
    if (mElem) mElem.textContent = pad(mins);
    if (sElem) sElem.textContent = pad(secs);

    const titleElem = document.getElementById('nextContestTitle');
    if (titleElem) {
      titleElem.textContent = `⚡ NEXT: ${nextContest.name}`;
    }
  }

  tick();
  setInterval(tick, 1000);
}

// --------------------------------------------------------
// TOAST NOTIFICATIONS
// --------------------------------------------------------
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🍂</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --------------------------------------------------------
// GLOBAL KEYBOARD SHORTCUTS
// --------------------------------------------------------
document.addEventListener('keydown', (e) => {
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
    return;
  }

  // Number keys 1-5 for view switching
  if (['1', '2', '3', '4', '5'].includes(e.key)) {
    const views = ['overview', 'roadmap', 'contests', 'arcade', 'codex'];
    const idx = parseInt(e.key, 10) - 1;
    if (views[idx]) switchView(views[idx]);
  } else if (e.key.toLowerCase() === 'm') {
    if (typeof toggleSound === 'function') toggleSound();
  }
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();

  // Mobile nav buttons binder
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-view');
      if (v) switchView(v);
    });
  });

  // Print welcome badge to console
  console.log(
    '%c⚡ ALGOSSTORM — AUTUMN EDITION 🍂%c\nOrganized by NLOGN — SST\nReady for Codeforces 21-Day Challenge!',
    'color: #fb8500; font-size: 16px; font-weight: bold;',
    'color: #38bdf8; font-size: 12px;'
  );
});
