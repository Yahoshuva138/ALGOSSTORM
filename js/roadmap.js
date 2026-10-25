// ========================================================
// ALGOSSTORM — 21-Day Quest Roadmap Engine
// ========================================================

const QUEST_STORAGE_KEY = 'algosstorm_solved_days';

const QUEST_DATA = [
  // --- WEEK 1: PREFIX SUM & DIFFERENCE ARRAY ---
  {
    id: 1,
    day: "Day 01",
    date: "Oct 26",
    topic: "Prefix Sum",
    tagClass: "tag-prefix",
    title: "Kuriyama Mirai's Stones",
    rating: 1200,
    cfUrl: "https://codeforces.com/problemset/problem/433/B",
    hint: "Build two prefix sum arrays: one on the original list of stone costs, and one on the sorted list. Query each in O(1).",
    editorial: "pref[i] = pref[i-1] + v[i]. Range sum [l, r] is pref[r] - pref[l-1]."
  },
  {
    id: 2,
    day: "Day 02",
    date: "Oct 27",
    topic: "Prefix Sum",
    tagClass: "tag-prefix",
    title: "Ilya and Queries",
    rating: 1100,
    cfUrl: "https://codeforces.com/problemset/problem/313/B",
    hint: "Precompute an array where matched[i] = 1 if s[i] == s[i+1] else 0. Then take prefix sums.",
    editorial: "Answering count of adjacent identical characters in [l, r] is simply pref[r-1] - pref[l-1]."
  },
  {
    id: 3,
    day: "Day 03",
    date: "Oct 28",
    topic: "Difference Array",
    tagClass: "tag-diff",
    title: "Greg and Array",
    rating: 1400,
    cfUrl: "https://codeforces.com/problemset/problem/296/C",
    hint: "Apply difference array twice! First difference array counts how many times each operation runs, second applies the aggregated operations to the array.",
    editorial: "Two-stage difference arrays reduce an O(N * M * K) brute force to clean O(N + M + K)."
  },
  {
    id: 4,
    day: "Day 04",
    date: "Oct 29",
    topic: "Difference Array",
    tagClass: "tag-diff",
    title: "Little Girl and Maximum Sum",
    rating: 1500,
    cfUrl: "https://codeforces.com/problemset/problem/276/C",
    hint: "Count frequency of each index queried using a difference array. Sort both frequencies and array elements descending to greedily pair largest numbers with highest query counts.",
    editorial: "Diff array mark: diff[l]++; diff[r+1]--; Prefix sum gives frequencies. Greedy rearrangement theorem."
  },
  {
    id: 5,
    day: "Day 05",
    date: "Oct 30",
    topic: "Prefix Sum",
    tagClass: "tag-prefix",
    title: "Subarray Divisibility",
    rating: 1300,
    cfUrl: "https://codeforces.com/problemset/problem/1398/C",
    hint: "Subarray sum equals length if sum - length = 0. Rewrite as (a[i] - 1) prefix sums and count identical remainder frequencies using a hash map.",
    editorial: "Map storing prefix counts where sum(l..r) == r - l + 1."
  },
  {
    id: 6,
    day: "Day 06",
    date: "Oct 31",
    topic: "Difference Array",
    tagClass: "tag-diff",
    title: "Karen and Coffee",
    rating: 1400,
    cfUrl: "https://codeforces.com/problemset/problem/816/B",
    hint: "Temperatures range up to 200,000. Use difference array to compute recommendation counts at each degree, then prefix sum over temperatures >= k.",
    editorial: "Diff array on bounds 1..200000. Then pref[i] = pref[i-1] + (rec[i] >= k ? 1 : 0)."
  },
  {
    id: 7,
    day: "Day 07",
    date: "Nov 01",
    topic: "Prefix Sum",
    tagClass: "tag-prefix",
    title: "Good Subarrays",
    rating: 1300,
    cfUrl: "https://codeforces.com/problemset/problem/1398/C",
    hint: "Transform the condition sum(l..r) = r - l + 1 into pref[r] - r = pref[l-1] - (l-1). Store counts of (pref[x] - x).",
    editorial: "Each duplicate value of (pref[x] - x) forms a valid good subarray."
  },

  // --- WEEK 2: CONSTRUCTIVE ALGORITHMS & INVARIANTS ---
  {
    id: 8,
    day: "Day 08",
    date: "Nov 02",
    topic: "Constructive",
    tagClass: "tag-constructive",
    title: "Make It Good",
    rating: 1200,
    cfUrl: "https://codeforces.com/problemset/problem/1385/C",
    hint: "Work backwards from the end of the array! A sequence can be emptied greedily if and only if it increases then decreases toward the right.",
    editorial: "Scan from right to left: non-decreasing segment followed by non-increasing segment."
  },
  {
    id: 9,
    day: "Day 09",
    date: "Nov 03",
    topic: "Constructive",
    tagClass: "tag-constructive",
    title: "Even Subset Sum Problem",
    rating: 800,
    cfUrl: "https://codeforces.com/problemset/problem/1323/A",
    hint: "If any single element is even, that 1-element subset works. Otherwise, if you have at least two odd numbers, their sum is even!",
    editorial: "Check for 1 even element, else pick first 2 odd elements. If neither, output -1."
  },
  {
    id: 10,
    day: "Day 10",
    date: "Nov 04",
    topic: "Constructive",
    tagClass: "tag-constructive",
    title: "Array Cancellation",
    rating: 1000,
    cfUrl: "https://codeforces.com/problemset/problem/1405/B",
    hint: "Maintain a running tally of positive values available to cancel later negative numbers at 0 cost. The leftovers cost coins.",
    editorial: "Running positive balance. If negative number arrives, absorb as much positive balance as possible."
  },
  {
    id: 11,
    day: "Day 11",
    date: "Nov 05",
    topic: "Constructive",
    tagClass: "tag-constructive",
    title: "Permutation Minimization by Deque",
    rating: 1000,
    cfUrl: "https://codeforces.com/problemset/problem/1579/E1",
    hint: "To get the lexicographically smallest permutation, greedily prepend element to front if it is smaller than current front; otherwise append to back.",
    editorial: "Deque greedy choice: if (x < dq.front()) dq.push_front(x); else dq.push_back(x);"
  },
  {
    id: 12,
    day: "Day 12",
    date: "Nov 06",
    topic: "Constructive",
    tagClass: "tag-constructive",
    title: "Non-Zero Segments",
    rating: 1300,
    cfUrl: "https://codeforces.com/problemset/problem/1426/D",
    hint: "A zero-sum subarray occurs if a prefix sum value repeats. When a repeat is detected, greedily insert a large infinity value right before current index.",
    editorial: "Set of prefix sums. Clear set and reset prefix when collision happens, increment answer."
  },
  {
    id: 13,
    day: "Day 13",
    date: "Nov 07",
    topic: "Constructive",
    tagClass: "tag-constructive",
    title: "Omkar and Baseball",
    rating: 1100,
    cfUrl: "https://codeforces.com/problemset/problem/1372/B",
    hint: "Find the leftmost and rightmost mismatched elements. If all are in place: 0 moves. If all mismatches form a continuous block with none in correct place: 1 move. Otherwise 2 moves.",
    editorial: "Any permutation can be sorted in at most 2 special derangement operations."
  },
  {
    id: 14,
    day: "Day 14",
    date: "Nov 08",
    topic: "Constructive",
    tagClass: "tag-constructive",
    title: "Equalize the Array",
    rating: 1300,
    cfUrl: "https://codeforces.com/problemset/problem/1490/F",
    hint: "Count frequencies of each distinct number. If you choose target frequency C, every character with count < C is deleted, and count >= C is trimmed to C.",
    editorial: "Try all possible values of C from unique counts. Maximize elements kept: C * count_ge(C)."
  },

  // --- WEEK 3: GREEDY STRATEGIES & MODULAR MATHS ---
  {
    id: 15,
    day: "Day 15",
    date: "Nov 09",
    topic: "Greedy",
    tagClass: "tag-greedy",
    title: "Two Teams Composing",
    rating: 1100,
    cfUrl: "https://codeforces.com/problemset/problem/1335/C",
    hint: "Find the maximum frequency of any single skill M and number of distinct skills D. Answer is either min(M-1, D) or min(M, D-1).",
    editorial: "Compare (M == D) edge case vs typical min(M, D) partitioning."
  },
  {
    id: 16,
    day: "Day 16",
    date: "Nov 10",
    topic: "Greedy",
    tagClass: "tag-greedy",
    title: "BerSU Ball",
    rating: 1200,
    cfUrl: "https://codeforces.com/problemset/problem/489/B",
    hint: "Sort both boys' and girls' skill levels. Greedily pair the lowest skilled boy with the lowest compatible girl using two pointers.",
    editorial: "Standard greedy interval/matching on sorted arrays. O(N log N + M log M)."
  },
  {
    id: 17,
    day: "Day 17",
    date: "Nov 11",
    topic: "Greedy",
    tagClass: "tag-greedy",
    title: "Maximum Product Strikes Back",
    rating: 1600,
    cfUrl: "https://codeforces.com/problemset/problem/1660/D",
    hint: "Zeros divide the array into independent segments. Within each zero-free segment, count negative numbers: if even, keep all; if odd, drop up to the first or last negative.",
    editorial: "Greedy prefix/suffix trimming per zero-free segment to maximize power of 2 factor."
  },
  {
    id: 18,
    day: "Day 18",
    date: "Nov 12",
    topic: "Maths",
    tagClass: "tag-maths",
    title: "Product of Three Numbers",
    rating: 1300,
    cfUrl: "https://codeforces.com/problemset/problem/1294/C",
    hint: "Greedily find the smallest divisor a >= 2, then smallest divisor b > a of (n / a). If remainder c > b, you found 3 distinct factors!",
    editorial: "Smallest factor search up to sqrt(N). If three factors found, output YES, else NO."
  },
  {
    id: 19,
    day: "Day 19",
    date: "Nov 13",
    topic: "Maths",
    tagClass: "tag-maths",
    title: "Omkar and Last Class of Math",
    rating: 1300,
    cfUrl: "https://codeforces.com/problemset/problem/1372/B",
    hint: "To minimize LCM(a, b) where a + b = n, find the smallest prime divisor p of n. Then a = n / p, and b = n - a.",
    editorial: "LCM(a, n - a) is minimized when 'a' divides n, so 'a' should be n's largest proper divisor."
  },
  {
    id: 20,
    day: "Day 20",
    date: "Nov 14",
    topic: "Maths",
    tagClass: "tag-maths",
    title: "Same Parity Summands",
    rating: 1200,
    cfUrl: "https://codeforces.com/problemset/problem/1352/B",
    hint: "Try two constructions: either (k - 1) ones and the rest (n - k + 1) which must be positive odd; or (k - 1) twos and the rest (n - 2*(k - 1)) which must be positive even.",
    editorial: "Parity invariant verification: check both odd split and even split."
  },
  {
    id: 21,
    day: "Day 21",
    date: "Nov 15",
    topic: "Maths",
    tagClass: "tag-maths",
    title: "K-th Not Divisible by n",
    rating: 1200,
    cfUrl: "https://codeforces.com/problemset/problem/1352/C",
    hint: "In every block of n numbers, (n - 1) are not divisible by n. Use integer division to calculate skip blocks: ans = k + (k - 1) / (n - 1).",
    editorial: "Direct mathematical closed formula O(1) without looping or binary search."
  }
];

let currentTopicFilter = 'All';
let currentStatusFilter = 'All';
let currentSearchQuery = '';

function getSolvedDays() {
  try {
    return JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function setSolvedDays(solvedArray) {
  try {
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(solvedArray));
  } catch (e) {}
  updateRoadmapHUD();
}

function toggleDaySolved(dayId) {
  const solved = getSolvedDays();
  const index = solved.indexOf(dayId);
  const isNowSolved = (index === -1);

  if (isNowSolved) {
    solved.push(dayId);
    if (typeof soundSuccess === 'function') soundSuccess();
    if (typeof showToast === 'function') {
      showToast(`⚡ Quest Day ${dayId} Marked Complete! +100 Storm XP`);
    }
  } else {
    solved.splice(index, 1);
    if (typeof soundClick === 'function') soundClick();
  }

  setSolvedDays(solved);
  renderRoadmap();
}

function toggleHint(dayId) {
  const drawer = document.getElementById(`hintDrawer_${dayId}`);
  if (drawer) {
    drawer.classList.toggle('open');
    if (typeof soundClick === 'function') soundClick();
  }
}

function getRankTitle(solvedCount) {
  if (solvedCount >= 21) return '⚡ Thunder Grandmaster';
  if (solvedCount >= 15) return '🌪️ Tempest Solver';
  if (solvedCount >= 8) return '💨 Gale Coder';
  if (solvedCount >= 3) return '🍂 Autumn Apprentice';
  return '🌱 Storm Initiate';
}

function updateRoadmapHUD() {
  const solved = getSolvedDays();
  const count = solved.length;
  const total = QUEST_DATA.length;
  const pct = Math.round((count / total) * 100);

  // HUD elements
  const hudCount = document.getElementById('hudSolvedCount');
  const hudPct = document.getElementById('hudPctText');
  const hudProgress = document.getElementById('hudProgressBar');
  const hudRank = document.getElementById('hudRankBadge');

  if (hudCount) hudCount.textContent = `${count}/${total}`;
  if (hudPct) hudPct.textContent = `${pct}% Complete`;
  if (hudProgress) hudProgress.style.width = `${pct}%`;
  if (hudRank) hudRank.textContent = getRankTitle(count);

  // Overview Hero counters
  const heroSolved = document.getElementById('heroSolvedCounter');
  if (heroSolved) heroSolved.textContent = `${count}/21`;
}

function renderRoadmap() {
  const container = document.getElementById('questGrid');
  if (!container) return;

  const solved = getSolvedDays();

  const filtered = QUEST_DATA.filter(item => {
    // Topic filter
    if (currentTopicFilter !== 'All' && item.topic !== currentTopicFilter) {
      return false;
    }

    // Status filter
    const isSolved = solved.includes(item.id);
    if (currentStatusFilter === 'Solved' && !isSolved) return false;
    if (currentStatusFilter === 'Unsolved' && isSolved) return false;

    // Search query
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTopic = item.topic.toLowerCase().includes(q);
      const matchDay = item.day.toLowerCase().includes(q);
      if (!matchTitle && !matchTopic && !matchDay) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🍂</div>
        <p style="font-weight: 600; font-size: 1.1rem; color: #fff;">No quests match your criteria.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Try clearing your search or topic filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isSolved = solved.includes(item.id);
    return `
      <div class="quest-card ${isSolved ? 'solved' : ''}" id="questCard_${item.id}">
        <div class="quest-card-top">
          <span class="day-badge">${item.day} · ${item.date}</span>
          <span class="topic-tag ${item.tagClass}">${item.topic}</span>
        </div>
        <div class="quest-title-row">
          <h4 class="quest-title">${item.title}</h4>
          <a href="${item.cfUrl}" target="_blank" rel="noopener noreferrer" class="cf-link" title="Open on Codeforces">
            ↗
          </a>
        </div>
        <div class="quest-meta">
          <span>Rating: <strong class="rating-chip">${item.rating}</strong></span>
          <span>•</span>
          <span>CF Problem</span>
        </div>
        
        <div class="quest-card-bottom">
          <label class="solve-toggle-label">
            <input type="checkbox" class="solve-checkbox" ${isSolved ? 'checked' : ''} onchange="toggleDaySolved(${item.id})">
            <span>${isSolved ? 'Solved ✓' : 'Mark Solved'}</span>
          </label>
          <button class="btn-hint-toggle" onclick="toggleHint(${item.id})">
            💡 Hint
          </button>
        </div>

        <div class="hint-drawer" id="hintDrawer_${item.id}">
          <p><strong>Clue:</strong> ${item.hint}</p>
          <p style="margin-top: 6px; font-size: 0.78rem; color: var(--amber-gold);">
            <strong>Key Insight:</strong> ${item.editorial}
          </p>
        </div>
      </div>
    `;
  }).join('');
}

// Filter button binders
function initRoadmapControls() {
  const pills = document.querySelectorAll('.filter-pill[data-topic]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentTopicFilter = pill.getAttribute('data-topic');
      if (typeof soundClick === 'function') soundClick();
      renderRoadmap();
    });
  });

  const searchInput = document.getElementById('questSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      renderRoadmap();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateRoadmapHUD();
  initRoadmapControls();
  renderRoadmap();
});
