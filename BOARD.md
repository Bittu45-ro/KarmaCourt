# KarmaCourt: The Hackathon Agent Board
> *Based on the Cal Hacks / Knight Hacks Agent Board Architecture*

## 👥 Assigned Roles & Skill Matrix

| Agent Role | Active Skills | Domain / Responsibility |
| :--- | :--- | :--- |
| **System Architect** | `typescript-pro`, `devvit` | Core game loop, Reddit Redis KV storage, time-based daily rotation. |
| **UI/UX Designer** | `better-ui`, `anti-slop-design` | Devvit component blocks, voting bars, color hierarchy, win states. |
| **Content Director** | `copywriting`, `pitch-psychologist` | Curation of viral daily dockets, dilemma pacing, Wordle share grid. |
| **QA & Compliance** | `code-reviewer`, `test-master` | Devvit sandbox limits, error boundaries, mobile responsiveness. |
| **Pitch & Demo Master**| `video-router`, `pitch-psychologist` | 2-minute pitch script, Devpost submission copy, architecture diagrams. |

---

## 🗂️ Folder Ownership Contract (Zero-Collision Structure)

```text
karmacourt/
├── src/
│   ├── main.tsx              <-- [System Architect] Devvit Custom Post Entry
│   ├── components/
│   │   ├── DocketCard.tsx    <-- [UI Designer] The Dilemma Reader
│   │   ├── VerdictGroup.tsx  <-- [UI Designer] Interactive YTA/NTA/ESH/NAH Buttons
│   │   └── ResultView.tsx    <-- [UI Designer] Live Consensus Bar & Top Quote
│   ├── data/
│   │   └── dockets.ts        <-- [Content Director] Curated Daily Moral Dilemmas
│   └── utils/
│       └── storage.ts        <-- [System Architect] Redis KV vote recording & streaks
├── docs/
│   ├── DEMO_SCRIPT.md        <-- [Pitch Master] 120-second video walkthrough
│   └── ARCHITECTURE.md       <-- [System Architect] Diagram and Devvit spec
├── package.json
├── tsconfig.json
└── devvit.yaml
```

---

## 📌 Pinned Sprint Board

- [x] **Task 01: Architecture & Folder Contract** (Assigned: System Architect)
- [ ] **Task 02: Core Game Logic & Devvit Setup** (Assigned: System Architect)
- [ ] **Task 03: Interactive UI & Consensus Bar** (Assigned: UI Designer)
- [ ] **Task 04: Curated Daily Dockets** (Assigned: Content Director)
- [ ] **Task 05: Devpost Pitch & Demo Script** (Assigned: Pitch Master)
