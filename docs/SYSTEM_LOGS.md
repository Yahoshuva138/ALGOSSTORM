# ⚡ ALGOSSTORM — System Logs & Architecture Documentation

## 1. System Overview
**ALGOSSTORM Autumn Edition** is a client-side Single-Page Application (SPA) designed to support NLOGN — SST's 21-day competitive programming training cycle on Codeforces. The architecture requires **zero server-side setup**, operating entirely from static files with full client-side state persistence.

---

## 2. Directory Architecture

```text
d:\SST_CONTENT\ALGOSSTORM\
├── index.html              # Clean semantic SPA entrypoint
├── assets/
│   ├── logo.svg            # Glowing vector master logo (Maple + Lightning)
│   └── favicon.svg         # High-resolution vector favicon
├── css/
│   ├── style.css           # Design tokens, layout, typography, animations
│   └── components.css      # Specialized UI (HUD, Cards, Arcade, Modals)
├── js/
│   ├── audio.js            # Web Audio 8-bit synthesizer engine
│   ├── weather.js          # Canvas 2D autumn leaf physics & lightning
│   ├── auth.js             # Codeforces handle linking & Google Identity (GIS)
│   ├── roadmap.js          # 21-Day quest ladder, filters & progress HUD
│   ├── arcade.js           # 4 competitive CP reflex mini-games
│   ├── terminal.js         # Storm-Shell CLI (~) modal
│   └── app.js              # SPA navigation & 24h contest countdown timer
├── docs/
│   ├── ROADMAP.md          # 21-Day curriculum & contest deadlines
│   └── SYSTEM_LOGS.md      # Architecture Decision Records & system specs
└── [Reference Handbooks]
    ├── CPH.pdf             # Competitive Programmer's Handbook
    ├── PAPS.pdf            # Principles of Algorithmic Problem Solving
    └── cpp.pdf             # C++ Reference Manual
```

---

## 3. Architecture Decision Records (ADR)

### ADR 001: Modular Vanilla JavaScript & Zero Bundler Dependency
- **Decision:** Build entirely with ES6+ Vanilla JS without Vite, Webpack, or npm dependencies.
- **Rationale:** Enables instant local testing by opening `index.html` directly in any web browser, avoids broken build chains, and maximizes loading speeds.

### ADR 002: Client-Side Audio Synthesis via Web Audio API
- **Decision:** Generate all 8-bit retro sounds procedurally (`OscillatorNode`, `BiquadFilterNode`, `GainNode`) rather than loading external `.mp3` or `.wav` files.
- **Rationale:** Guarantees zero latency, zero 404 asset errors, zero external bandwidth consumption, and procedural variety (e.g. thunder rumble noise buffers).

### ADR 003: Canvas 2D Autumn Leaf Simulation
- **Decision:** Render falling maple leaves with interactive wind vortex using a lightweight 2D canvas overlay with `pointer-events: none`.
- **Rationale:** Leaves float behind the UI text layers without interfering with click events or scrolling, maintaining 60 FPS even on lower-tier hardware.

### ADR 004: Local Storage Schema Specification
All user state is persisted in standard browser `localStorage`:
- `algosstorm_user_profile`: `{ handle: string, name: string, avatar: string, isGuest: boolean }`
- `algosstorm_solved_days`: `Array<number>` (IDs of completed quest days, e.g. `[1, 2, 5]`)
- `algosstorm_sound`: `boolean` (Sound enable/mute preference)
- `algosstorm_arcade_highscores`: `{ prefix: number, diff: number, parity: number, greedy: number }`

---

## 4. Verification Checklist
- [x] All directories (`assets/`, `css/`, `js/`, `docs/`) created.
- [x] All 7 modular JavaScript files written and linked without errors.
- [x] Semantic HTML entrypoint `index.html` with all 5 active views.
- [x] Responsive layout tested for both desktop and mobile viewports.
- [x] Handbooks (`CPH.pdf`, `PAPS.pdf`, `cpp.pdf`) linked in Codex & Overview.
