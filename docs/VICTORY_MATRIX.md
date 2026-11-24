# KarmaCourt: 360° Hackathon Victory Matrix

This document outlines the multi-skill engineering, psychological, and judging optimizations deployed across the **KarmaCourt** project to maximize our odds for the $35,000 prize pool.

---

## 🏛️ Skill Pillar 1: Behavioral Psychology & Viral Loops (`ux-persuasion-engineer`, `growth-engine`)
* **The Hook Model Implementation:**
  1. **Trigger:** The daily case drops at 00:00 UTC with an arresting title and moral dilemma.
  2. **Low-Friction Action:** Sub-30-second read; single-tap decision buttons (`YTA`, `NTA`, `ESH`, `NAH`).
  3. **Variable Reward:** Instant comparison against the community jury. Did you rule with the majority (`ACCORD`) or stand alone (`DISSENT`)?
  4. **Investment & Retention:** Daily streak counters and a 1-click **Wordle-style emoji summary** formatted for Reddit comment threads.

---

## ⚡ Skill Pillar 2: Systems & Database Architecture (`typescript-pro`, `database-optimizer`)
* **Redis KV Storage Schema:**
  * `karmacourt:case:{caseId}:votes` (Hash: `YTA`, `NTA`, `ESH`, `NAH` count)
  * `karmacourt:user:{userId}:{caseId}:voted` (String: boolean flag preventing ballot stuffing)
  * `karmacourt:user:{userId}:streak` (Integer: consecutive days voted)
* **Atomic Transactions:** Utilizes Devvit's native Redis `hIncrBy` to prevent race conditions during viral traffic spikes.

---

## 🛡️ Skill Pillar 3: Security & Compliance (`secure-code-guardian`, `code-reviewer`)
* **Ballot Hardening:** Verifies `context.userId` against Redis before registering votes.
* **Input Sanitization:** Strips external markdown formatting from community quotes to prevent rendering injection.
* **Graceful Degradation:** Fallbacks to cached offline statistics if Redis is temporarily unreachable.

---

## 🎨 Skill Pillar 4: Accessible Design System (`anti-slop-design`, `better-ui`, `better-colors`)
* **Contrast Ratios:** Compliant with WCAG AAA for dark mode readability (`#0A0E17` obsidian background with `#F8FAFC` high-contrast typography).
* **Color Psychology:**
  * **YTA (Guilty):** Crimson Red (`#EF4444`) – Signals transgression.
  * **NTA (Acquitted):** Emerald Green (`#10B981`) – Signals justice/clearance.
  * **ESH (Everyone Sucks):** Violet (`#A855F7`) – Signals compromise.
  * **NAH (No Assholes):** Slate Gray (`#64748B`) – Signals neutrality.

---

## 🎬 Skill Pillar 5: Judging Rubric Optimization (`pitch-psychologist`)
* **Reproducibility Guarantee:** Clean GitHub Actions CI verifying build integrity.
* **Documentation Polish:** Mermaid architecture diagrams, typed API contracts, and a step-by-step 120-second video demo walkthrough.
