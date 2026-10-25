# 🍂 ALGOSSTORM — Autumn Edition ⚡

> **Presented by NLOGN — SST**  
> 21-Day Codeforces Challenge to learn, solve, struggle a little, and see who can ride out the storm!

![ALGOSSTORM Banner](main%20poster.jpeg)

---

## ⚡ Overview

**ALGOSSTORM** is a high-performance, responsive Single-Page Application (SPA) built for competitive programmers participating in the 21-Day Autumn Challenge on Codeforces. It provides interactive progress tracking, 4 reflex mini-games, an in-browser hacker terminal (`~`), curated algorithmic cheatsheets, and live contest countdowns.

---

## 🎯 5 Core Topics

1. **Prefix Sums (1D & 2D)**: $O(1)$ range sum queries after $O(N)$ precomputation.
2. **Difference Arrays**: $O(1)$ batch range updates $[L..R]$ with prefix reconstruction.
3. **Constructive Algorithms**: Parity invariants, extreme element logic, and game-play proofs.
4. **Greedy Algorithms**: Optimal substructure, interval scheduling, and exchange argument theorems.
5. **Number Theory & Maths**: Modular arithmetic, Fermat's Little Theorem, Euclidean GCD, and prime factorization.

---

## 📅 Contest Schedule (24-Hour Windows)

| Contest | Date | Topic Focus |
|---|---|---|
| **Contest 1** | **27 Oct 2026** | Prefix Sums & Difference Arrays |
| **Contest 2** | **01 Nov 2026** | Constructive Logic & Invariants |
| **Contest 3** | **06 Nov 2026** | Greedy Strategies & Sorting Invariance |
| **Contest 4** | **12 Nov 2026** | **Grand Storm Finale:** Maths & Mixed |

---

## 🕹️ Algorithmic Arcade

Train your CP reflexes before contests with 4 built-in retro mini-games:
- **Prefix Blitz**: Rapid-fire range sum calculation against the countdown timer.
- **Difference Drift**: Mental range update simulator.
- **Parity Storm**: Rapid-fire true/false invariant evaluation.
- **Greedy Snatcher**: Real-time interval selection challenge.

---

## 💻 Storm-Shell Terminal (`~`)

Press the **`~`** key or click the **`>_`** button in the header to open the embedded terminal:
- `help` — Show command manual
- `quest [day]` — Inspect problem and hints for any day (1–21)
- `contests` — View 24h contest window dates
- `cf <handle>` — Live fetch user stats via the Codeforces API
- `storm` — Trigger lightning and thunder Web Audio effects
- `sound` — Toggle synthesizer audio

---

## 📚 Bundled Reference Handbooks

Directly accessible within the portal:
- `CPH.pdf` — *Competitive Programmer's Handbook* (Antti Laaksonen)
- `PAPS.pdf` — *Principles of Algorithmic Problem Solving*
- `cpp.pdf` — *C++ Standard Library & STL Reference*

---

## 🚀 Quick Start (Local Run)

Simply open `index.html` in any modern web browser:
```bash
# On Windows PowerShell:
Start-Process index.html
```

---

## 🛠️ Project Structure

```text
d:\SST_CONTENT\ALGOSSTORM\
├── index.html              # Main application entrypoint
├── assets/
│   ├── logo.svg            # Autumn maple & lightning vector logo
│   └── favicon.svg         # Favicon icon
├── css/
│   ├── style.css           # Core styling, tokens, animations
│   └── components.css      # HUD, cards, arcade, terminal, modals
├── js/
│   ├── audio.js            # Web Audio 8-bit synthesizer engine
│   ├── weather.js          # Canvas 2D autumn leaves physics
│   ├── auth.js             # Codeforces handle & Google Identity auth
│   ├── roadmap.js          # 21-Day quest ladder & persistence
│   ├── arcade.js           # 4 algorithmic mini-games
│   ├── terminal.js         # Storm-Shell CLI (~) modal
│   └── app.js              # SPA navigation & contest timer
├── docs/
│   ├── ROADMAP.md          # 21-Day curriculum specification
│   └── SYSTEM_LOGS.md      # Architecture Decision Records (ADRs)
└── [Handbooks]
    ├── CPH.pdf
    ├── PAPS.pdf
    └── cpp.pdf
```
