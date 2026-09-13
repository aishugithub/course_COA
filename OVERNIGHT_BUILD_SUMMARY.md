# Foothold COA — Unit 3 build summary

Working tree: `course_COA`, branch `main`. Nothing was pushed to GitHub — all commits are
local, waiting for review and a manual `git push` when you're ready.

## What got built (7 commits, all on `main`)

| Commit | Lesson | What it covers |
|---|---|---|
| `bb651e1` | `Unit2_7.jsx` (reworked) | Added deck-level depth to the control unit lesson: a `HardwiredAnatomy` widget (decoder / step counter / flags → signal generator) and an `AddressGenAndSequencing` widget (opcode → µPC start address, plus the 4-case sequencing taxonomy), matching `Unit2_Deck.html`'s coverage. |
| `d0cdce6` | `Unit3_1.jsx` | **The Role of Cache Memory** — scoped strictly to cache-as-stall-source (Fig 6.7); general cache hierarchy/mapping is left for Module 4. |
| `debeab3` | `Unit3_2.jsx` | **The Pipeline Idea & Performance** — overlap diagram (Fig 6.1), k+(n−1), T=N·S/R, the notes' exact k=5,n=20 worked example, stage-count trade-off. |
| `062c78a` | `Unit3_3.jsx` | **Data Hazards** — RAW naming, the Fig 6.3 "3-cycle stall vs 2 bubbles" resolution, forwarding, NOP/reorder, the load-use hazard. |
| `8aa7695` | `Unit3_4.jsx` | **Instruction Hazards** — branch penalty (Compute vs Decode resolution), delay slot, static prediction, interactive 2-bit predictor FSM, branch target buffer. |
| `d0ed633` | `Unit3_5.jsx` | **Instruction Sets, Datapath & Control** — RISC/CISC influence, side effects, structural hazards (shared vs split cache), S=1+δstall+δbranch+δmiss with Example 6.2. |
| `d5c0341` | `Unit3_C.jsx` | **Capstone: Schedule to Avoid Stalls** — ties every idea above into a hands-on instruction-reordering puzzle (click-to-swap, live stall counting), mirroring a real compiler scheduler. Ends with "Module 3 Complete!". |

All six `Unit3_*` files were already registered in `config/course.config.js` beforehand —
no config changes were needed this run.

## Judgment calls worth double-checking

1. **AVPS example choice.** Only `ex1_hamacherRAW` (matching Hamacher Fig 6.3 exactly,
   `stallBefore: 3`) was used as a cross-reference. Most other AVPS examples use Patterson &
   Hennessy-style RISC-V conventions (DADD/DSUB, x1/x2 registers) — those were deliberately
   **not** pulled into any lesson, since they'd contradict the Hamacher register naming
   (R2, R3, ...) used throughout your notes and deck.
2. **Cache scoping (Unit3_1).** Kept strictly to "a miss stalls the pipeline" — cache
   mapping, hit-rate mechanics, and replacement policy are explicitly called out as
   Module 4's job in both the framing text and a quiz question, per your correction that
   cache belongs to pipelining context only in this unit.
3. **Superscalar (ch.7) — out of scope.** `course.config.js` only lists Unit3_1 through
   Unit3_C (six units, no separate superscalar unit), so multiple-issue execution is only
   teased as a one-line forward hook in the Unit3_5 quiz wrap-up, not built as a section.
4. **RAW naming resolution (Unit3_3).** Verified against the textbook and echoed exactly as
   worked out with you: RAW names the *program-order* dependency (write, then read after
   it); the hazard is the pipeline letting the read jump the queue. Same logic noted for
   WAR/WAW without building them out (not covered in your notes).
5. **The "3-cycle stall vs 2 bubbles" resolution (Unit3_3).** Built as an interactive
   cycle-by-cycle trace (`StallTrace` widget) that shows cycle 3 = held normal Decode,
   cycles 4–5 = the two extra bubbles, so 2 bubbles + 1 held cycle = 3 total. Cross-
   references that AVPS agrees exactly and only shows ≤2 bubble cards on screen due to its
   animation style, not a data disagreement.

## A stray git branch — needs your attention

At one point mid-session the device connection dropped and reconnected. When it came back,
`git commit` unexpectedly landed one commit (`dd0336b`, message "chap 3 - all", containing
just `Unit3_C.jsx` added on top of what was otherwise identical content) onto a **new,
separate `master` branch** instead of `main` — `main` was correctly at `d0ed633` when this
happened. I did not touch or delete this `master` branch, since I couldn't be certain
whether something on your end (you working locally at the same time) was involved.

I checked out `main` again and re-committed `Unit3_C.jsx` properly as `d5c0341` — so `main`
is complete and correct as described above. But you now have a leftover local `master`
branch sitting at `dd0336b` that isn't needed. When you're back at the machine, take a look
with `git log master --oneline -3` and `git branch`, and delete it yourself if it's not
something you created intentionally (`git branch -D master`) — I left it alone rather than
guess.

## What's left

- **Push to GitHub**: none of tonight's/today's commits were pushed — review the diffs
  locally, then `git push origin main` when you're ready.
- **Figure 6.2 "B1 strikethrough" bug**: still unresolved — couldn't be found anywhere in
  the deck's source HTML/SVG. Needs a screenshot from you to diagnose; the deck itself was
  left untouched throughout, per your instruction to stop modifying it.
- Nothing else from the original task list is outstanding — both Task 1 (control unit
  rework) and Task 2 (all six Unit 3 lessons) are complete.
