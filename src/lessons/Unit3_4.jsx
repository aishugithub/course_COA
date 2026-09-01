// Unit3_4.jsx — Module 3 › Unit 3.4 — "Instruction Hazards" (branch / control hazards)
// Rebuilt for interactivity to match Units 0–2: every section is a DIFFERENT interaction —
// a before/after toggle, an AUTO-PLAYING branch-flush pipeline, a predict-before-reveal
// delay-slot fill, and an interactive 2-bit-predictor finite-state machine. The PipelineGrid /
// buildStraightRows / buildRows helpers are copied in verbatim from Unit 3.2 (each lesson is
// self-contained). Source: Hamacher §6.6, class notes ch.4.
import { useState, useEffect } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};

// Stage → colour (shared across all Unit 3 pipeline diagrams)
const STAGE_COLOR = { IF: C.accent, ID: C.purple, EX: C.orange, MEM: C.teal, WB: C.green, "○": C.muted };

function Key({ color = C.purple, children }) {
  return (
    <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
      🔑 {children}
    </div>
  );
}

// ── buildStraightRows: instruction i occupies cycles (i+1 .. i+5) with stages IF..WB ──
// A "bubble" entry {after: s, count: c} inserts c stall cycles before stage index s.
function buildStraightRows(instrs) {
  return instrs.map((ins, i) => {
    const cells = {};
    ["IF", "ID", "EX", "MEM", "WB"].forEach((st, s) => { cells[i + 1 + s] = st; });
    return { label: ins.label, color: ins.color, cells };
  });
}

// ── buildRows: general schedule builder — place any stage (or a flushed "○" slot) at an explicit cycle ──
function buildRows(schedule) {
  // schedule: [{ label, color, stages: [{ name, cycle }] }]  — name is IF/ID/EX/MEM/WB, or "○" for a flushed/bubble slot
  return schedule.map((s) => {
    const cells = {};
    s.stages.forEach((st) => { cells[st.cycle] = st.name; });
    return { label: s.label, color: s.color, cells };
  });
}

// ══════════════════════════════════════════════════════════════════
//  Shared PipelineGrid — an auto-playing space-time (reservation) diagram.
//  rows: [{ label, color, cells: { <cycleNumber>: <stageLabel> } }], plus totalCycles.
//  Reveals every cell whose cycle ≤ the current clock; Play advances it on its own.
// ══════════════════════════════════════════════════════════════════
function PipelineGrid({ rows, totalCycles, caption, speed = 650, height }) {
  const [clock, setClock] = useState(0);      // 0 = pipeline empty, nothing issued yet
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (clock >= totalCycles) { setPlaying(false); return; }
    const t = setTimeout(() => setClock((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [playing, clock, totalCycles, speed]);

  // How many instructions have fully retired (their WB cycle ≤ current clock)?
  const wbCycleOf = (r) => Math.max(...Object.keys(r.cells).filter((cy) => r.cells[cy] === "WB").map(Number));
  const done = rows.filter((r) => wbCycleOf(r) <= clock).length;

  const cycleNums = Array.from({ length: totalCycles }, (_, i) => i + 1);

  return (
    <div>
      {/* controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => { if (clock >= totalCycles) setClock(0); setPlaying((p) => !p); }}
          style={btn(playing ? C.orange : C.green)}>
          {playing ? "⏸ Pause" : clock >= totalCycles ? "↺ Replay" : "▶ Run cycles"}
        </button>
        <button onClick={() => { setPlaying(false); setClock((c) => Math.min(totalCycles, c + 1)); }} style={btn(C.accentGlow)}>Step ▶</button>
        <button onClick={() => { setPlaying(false); setClock(0); }} style={btn(C.card, C.muted)}>↺ Reset</button>
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>
          clock = <strong style={{ color: C.accent }}>{clock}</strong> / {totalCycles} · done = <strong style={{ color: C.green }}>{done}</strong> / {rows.length}
        </div>
      </div>

      {/* grid (horizontal scroll so it never gets shoved off-screen) */}
      <div style={{ overflowX: "auto", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: `88px repeat(${totalCycles}, 40px)`, gap: 4, minWidth: "fit-content" }}>
          {/* header row: cycle numbers */}
          <div style={{ fontSize: 10, color: C.muted, alignSelf: "center" }}>instr \ cycle</div>
          {cycleNums.map((cy) => (
            <div key={cy} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: cy === clock ? C.accent : C.muted }}>{cy}</div>
          ))}
          {/* one row per instruction — flat map so no React.Fragment import is needed */}
          {rows.flatMap((r, ri) => [
            <div key={`lbl-${ri}`} style={{ fontSize: 12, fontFamily: "monospace", color: r.color, alignSelf: "center", whiteSpace: "nowrap" }}>{r.label}</div>,
            ...cycleNums.map((cy) => {
              const st = r.cells[cy];
              const shown = st && cy <= clock;
              return (
                <div key={`c-${ri}-${cy}`} style={{
                  height: 30, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10.5, fontWeight: 700,
                  background: shown ? STAGE_COLOR[st] + (st === "○" ? "22" : "33") : "transparent",
                  border: shown ? `1px solid ${STAGE_COLOR[st]}` : `1px dashed ${C.border}`,
                  color: shown ? STAGE_COLOR[st] : "transparent",
                }}>{shown ? st : "·"}</div>
              );
            }),
          ])}
        </div>
      </div>

      {caption && <div style={{ marginTop: 10, fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>{caption(clock, done)}</div>}
    </div>
  );
}

function btn(bg, col = "#fff") {
  return { padding: "7px 14px", borderRadius: 7, background: bg, border: "none", color: col, fontWeight: 600, fontSize: 12.5, cursor: "pointer" };
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Branch Problem (before/after toggle + analogy)
// ══════════════════════════════════════════════════════════════════
function BranchProblem() {
  const [resolved, setResolved] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Imagine a kitchen that <strong style={{ color: C.text }}>starts cooking the next dish before the order arrives</strong>. Most
        nights the guess is right and no time is lost. But when the order finally comes back different, the half-cooked dish gets
        thrown out — pure wasted effort. A pipeline does exactly this: to stay full, <strong style={{ color: C.text }}>Fetch grabs the
        next instruction in sequence every single cycle</strong> (the datapath from Unit 2.5 can't sit idle), long before a branch has
        been decided. Toggle to see what happens when the guess is wrong.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setResolved(false)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !resolved ? C.red + "22" : C.card, border: `2px solid ${!resolved ? C.red : C.border}`, color: !resolved ? C.red : C.muted,
        }}>❌ Branch not yet resolved</button>
        <button onClick={() => setResolved(true)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: resolved ? C.green + "22" : C.card, border: `2px solid ${resolved ? C.green : C.border}`, color: resolved ? C.green : C.muted,
        }}>✅ Branch resolved, target known</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
        {!resolved ? (
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
            Fetch keeps grabbing the instructions that sit <strong>right after</strong> the branch (the "fall-through" path), because it
            must fetch <em>something</em> each cycle. If the branch turns out to be <strong>taken</strong>, every one of those
            already-fetched instructions is the <strong style={{ color: C.red }}>wrong dish</strong> — it has to be discarded.
          </div>
        ) : (
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
            Once the branch's outcome and target ARE known, Fetch can finally grab the <strong style={{ color: C.green }}>correct</strong> next
            instruction. Everything fetched wrongly in the meantime was thrown out — those lost cycles are the
            <strong> branch penalty</strong>.
          </div>
        )}
      </div>

      <Key color={C.orange}>
        The jargon for this is a <strong style={{ color: C.text }}>control hazard</strong> (a.k.a. instruction hazard): unlike the data
        hazards of Unit 3.3 — where an instruction waited on a <em>result</em> — here the pipeline doesn't even know <em>which</em>
        instruction comes next. And it happens often: branches are roughly <strong style={{ color: C.text }}>20%</strong> of all
        instructions, so even a small per-branch penalty adds up fast.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Branch Penalty (FLAGSHIP: auto-playing branch-flush animation)
// ══════════════════════════════════════════════════════════════════
function BranchPenalty() {
  // beq resolves in EX (cycle 3). The two fall-through instrs fetched in cycles 2–3 are squashed to ○.
  const schedule = [
    { label: "beq  R6,R0,T", color: C.accent, stages: [
      { name: "IF", cycle: 1 }, { name: "ID", cycle: 2 }, { name: "EX", cycle: 3 }, { name: "MEM", cycle: 4 }, { name: "WB", cycle: 5 },
    ] },
    { label: "add  (wrong)", color: C.red, stages: [
      { name: "IF", cycle: 2 }, { name: "○", cycle: 3 }, { name: "○", cycle: 4 },
    ] },
    { label: "or   (wrong)", color: C.red, stages: [
      { name: "IF", cycle: 3 }, { name: "○", cycle: 4 },
    ] },
    { label: "sub  (target)", color: C.green, stages: [
      { name: "IF", cycle: 4 }, { name: "ID", cycle: 5 }, { name: "EX", cycle: 6 }, { name: "MEM", cycle: 7 }, { name: "WB", cycle: 8 },
    ] },
  ];
  const rows = buildRows(schedule);
  const total = 8;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Hit <strong style={{ color: C.green }}>▶ Run cycles</strong> and watch the wrong guesses get thrown out. The branch
        <code style={{ color: C.accent }}> beq</code> resolves in its <strong style={{ color: C.orange }}>EX</strong> stage — but by
        then Fetch has already pulled in the two fall-through instructions behind it.
      </p>

      <PipelineGrid rows={rows} totalCycles={total} caption={(clk) =>
        clk === 0 ? "Cycle 0 — pipeline empty. beq will be fetched first." :
        clk < 3 ? `Cycle ${clk} — beq is still moving down the pipe. Fetch has ALREADY grabbed the fall-through add and or, because it must fetch something every cycle.` :
        clk === 3 ? "Cycle 3 — beq resolves in EX and it was TAKEN. That makes add and or the WRONG instructions." :
        clk < total ? `Cycle ${clk} — add and or are SQUASHED to bubbles (○). The correct target (sub) couldn't be fetched until cycle 4 — cycles 2 and 3 of fetch were wasted.` :
        `Cycle ${total} — target retired. Two fetched-then-flushed slots = a 2-cycle branch penalty, paid every time a branch this design is taken.`
      } />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>❌ FLUSHED</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>2</div>
          <div style={{ color: C.muted, fontSize: 11 }}>wrongly-fetched instrs (add, or) → ○</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.orange}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⏱ PENALTY</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>2 cycles</div>
          <div style={{ color: C.muted, fontSize: 11 }}>target slips from cycle 2 → cycle 4</div>
        </div>
      </div>

      <p style={{ color: C.muted, fontSize: 12.5, marginTop: 14, lineHeight: 1.6 }}>
        Resolve the branch <strong style={{ color: C.text }}>one stage earlier</strong> (in Decode instead of Compute — an extra adder
        and comparator wired into ID) and only ONE instruction is fetched wrongly: the penalty drops from 2 cycles to 1.
      </p>

      <Key color={C.accent}>
        Every squashed instruction is a cycle where nothing retires — exactly like the stalls from Unit 3.3, it pushes the average
        cycles-per-instruction <strong style={{ color: C.text }}>S above the ideal 1</strong>. That feeds straight into
        <strong style={{ color: C.text }}> T = N·S/R</strong> from Unit 3.2: the branch penalty is a term that raises S, so cutting it
        directly shrinks execution time.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The Delay Slot (predict-before-reveal: which instr can safely move in?)
// ══════════════════════════════════════════════════════════════════
function DelaySlot() {
  const [guess, setGuess] = useState(null);

  // The slot right after the branch is fetched anyway — put a genuinely independent instruction there.
  const options = [
    { id: 0, code: "sub  R6, R7, R8", note: "computes the value the branch tests", correct: false,
      why: "The branch compares R6 — if you move this BELOW the branch, the branch would test a stale R6. It's a dependency, not independent." },
    { id: 1, code: "add  R1, R2, R3", note: "unrelated bookkeeping, always needed", correct: true,
      why: "This touches R1/R2/R3 — nothing the branch or the target depends on. It runs no matter which way the branch goes, so it safely fills the slot." },
    { id: 2, code: "NOP", note: "do nothing", correct: false,
      why: "A NOP is the fallback when NO independent instruction exists — but here one does, so a NOP would waste a perfectly good slot." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here's the clever trick. The slot right after a branch gets fetched <strong style={{ color: C.text }}>anyway</strong> — so
        instead of squashing it, some designs <em>always execute it</em> and let the compiler drop something useful in. This is the
        <strong style={{ color: C.text }}> branch delay slot</strong>. Consider this code, where the branch takes effect one
        instruction late:
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
        <pre style={{ fontFamily: "monospace", fontSize: 13, color: C.text, margin: 0, lineHeight: 1.9 }}>
{`sub  R6, R7, R8      ; feeds the branch condition
add  R1, R2, R3      ; unrelated work
beq  R6, R0, TARGET  ; the branch
________             ; ← delay slot (always executes)`}
        </pre>
      </div>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 10, lineHeight: 1.7 }}>
        <strong style={{ color: C.text }}>Predict first:</strong> which instruction can the compiler safely move DOWN into the delay
        slot, so the slot does real work?
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
        {options.map((o) => {
          let bg = C.card, bd = C.border, col = C.text;
          if (guess !== null) {
            if (o.correct) { bg = C.green + "22"; bd = C.green; col = C.green; }
            else if (o.id === guess) { bg = C.red + "22"; bd = C.red; col = C.red; }
          }
          return (
            <button key={o.id} onClick={() => guess === null && setGuess(o.id)} style={{
              textAlign: "left", padding: "11px 14px", borderRadius: 8, background: bg, border: `1.5px solid ${bd}`, color: col,
              cursor: guess === null ? "pointer" : "default", fontSize: 13,
            }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700 }}>
                {guess !== null && o.correct ? "✓ " : guess === o.id && !o.correct ? "✗ " : ""}{o.code}
              </span>
              <span style={{ color: C.muted, fontSize: 11.5 }}> — {o.note}</span>
            </button>
          );
        })}
      </div>

      {guess !== null && (
        <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
          💡 The safe move is <strong style={{ color: C.green }}>add R1, R2, R3</strong>. {options.find((o) => o.id === guess).why}
          {" "}Moved into the slot, it runs whichever way the branch goes and the wasted cycle disappears — this is
          <strong style={{ color: C.text }}> delayed branching</strong>.
        </div>
      )}

      <Key color={C.green}>
        This only works when the compiler can actually find a genuinely independent instruction — which happens about
        <strong style={{ color: C.text }}> 70%</strong> of the time. When it can't, a NOP fills the slot and the penalty comes back.
        That's why modern designs lean less on delay slots and more on the predictor coming up next.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The 2-Bit Predictor (interactive finite-state machine) + static & BTB note
// ══════════════════════════════════════════════════════════════════
function BranchPredictor() {
  const states = ["SNT", "WNT", "WT", "ST"];
  const stateNames = ["Strongly Not-Taken", "Weakly Not-Taken", "Weakly Taken", "Strongly Taken"];
  const predictTaken = [false, false, true, true]; // states 2 & 3 predict "taken"
  const [state, setState] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [log, setLog] = useState([]);

  // Standard saturating counter: taken → +1 (cap ST), not-taken → −1 (floor SNT).
  const step = (actualTaken) => {
    const predicted = predictTaken[state];
    const correct = predicted === actualTaken;
    const next = actualTaken ? Math.min(3, state + 1) : Math.max(0, state - 1);
    if (correct) setHits((h) => h + 1); else setMisses((m) => m + 1);
    setLog((l) => [...l.slice(-11), { actualTaken, correct }]);
    setState(next);
  };
  const reset = () => { setState(0); setHits(0); setMisses(0); setLog([]); };

  const total = hits + misses;
  const acc = total ? Math.round((hits / total) * 100) : 0;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Instead of always guessing the same way, let the hardware <strong style={{ color: C.text }}>learn a habit</strong> — like
        knowing a friend takes the same route to work every day. One unusual detour shouldn't make you forget their routine. A
        <strong style={{ color: C.text }}> 2-bit saturating counter</strong> does exactly that: it needs <strong style={{ color: C.text }}>two
        wrong guesses in a row</strong> to actually flip its prediction. Feed it real outcomes and watch the state (and the tally) move.
      </p>

      {/* the four FSM states */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 4 }}>
        {states.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: "center", padding: "12px 4px", borderRadius: 10,
            background: i === state ? (predictTaken[i] ? C.green + "22" : C.red + "22") : C.card,
            border: `2px solid ${i === state ? (predictTaken[i] ? C.green : C.red) : C.border}`,
          }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: i === state ? (predictTaken[i] ? C.green : C.red) : C.muted }}>{s}</div>
            <div style={{ fontSize: 9, color: C.muted, marginTop: 3, lineHeight: 1.3 }}>{stateNames[i]}</div>
            <div style={{ fontSize: 9.5, color: C.muted, marginTop: 4 }}>{predictTaken[i] ? "→ predict TAKEN" : "→ predict not-taken"}</div>
          </div>
        ))}
      </div>

      {/* current prediction banner */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", marginBottom: 12, fontSize: 12.5, color: C.muted, textAlign: "center" }}>
        current state <strong style={{ color: C.accent }}>{states[state]}</strong> → next branch will be predicted{" "}
        <strong style={{ color: predictTaken[state] ? C.green : C.red }}>{predictTaken[state] ? "TAKEN" : "NOT taken"}</strong>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => step(true)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: C.green, color: "#0D1117", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Branch TAKEN</button>
        <button onClick={() => step(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: C.red, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>NOT taken</button>
        <button onClick={reset} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.muted, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>↺</button>
      </div>

      {/* running tally */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10, textAlign: "center" }}>
        <div style={{ background: C.card, border: `1px solid ${C.green}44`, borderRadius: 8, padding: "8px 4px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.green }}>{hits}</div>
          <div style={{ fontSize: 10, color: C.muted }}>hits</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "8px 4px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.red }}>{misses}</div>
          <div style={{ fontSize: 10, color: C.muted }}>misses</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 4px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.accent }}>{acc}%</div>
          <div style={{ fontSize: 10, color: C.muted }}>accuracy</div>
        </div>
      </div>

      {log.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          {log.map((l, i) => (
            <div key={i} style={{
              flex: 1, height: 24, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, color: l.correct ? C.green : C.red,
              background: (l.correct ? C.green : C.red) + "18", border: `1.5px solid ${l.correct ? C.green : C.red}`,
            }}>{l.correct ? "✓" : "✗"}</div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
        Try it: click <strong style={{ color: C.green }}>TAKEN</strong> four times (a loop looping back), then one
        <strong style={{ color: C.red }}> NOT taken</strong> (the loop exits) — the state only slips ST → WT and still predicts taken.
        A 1-bit predictor would have flipped and mispredicted the next iteration too.
      </div>

      {/* static prediction + BTB note */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
        <div style={{ background: C.card, border: `1px solid ${C.orange}44`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: C.muted, lineHeight: 1.55 }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Static prediction</div>
          The simpler cousin: <strong style={{ color: C.text }}>always guess the same way</strong>, no learning — e.g. "assume
          not-taken," or "a backward branch (a loop's end) is usually taken," or a compiler hint bit on the instruction.
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.teal}44`, borderRadius: 10, padding: "12px 14px", fontSize: 12, color: C.muted, lineHeight: 1.55 }}>
          <div style={{ color: C.teal, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Branch Target Buffer</div>
          A prediction is only useful if it's ready in <strong style={{ color: C.text }}>cycle 1</strong>. The
          <strong style={{ color: C.text }}> BTB</strong> is a small fast table keyed by the branch's own address — a hit hands back the
          counter bits <em>and</em> the target, so the very next fetch goes to the predicted-correct instruction.
        </div>
      </div>

      <Key color={C.purple}>
        Two bits of history beat one because a single anomaly (that loop-exit branch) can't flip the prediction — only a sustained
        change does. Combined with an early decode, a filled delay slot, and a BTB, the control-hazard penalty from Unit 3.2's
        <strong style={{ color: C.text }}> S</strong> shrinks toward zero, pushing the pipeline back toward the ideal S = 1.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, instant feedback, completion card
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "Why is a branch a special problem for the pipeline, even though it's just one more instruction?",
      options: [
        "Branches take more ALU cycles than other instructions",
        "The pipeline must fetch something every cycle, but a branch's target/outcome isn't known until it's decoded or computed — so it may fetch the wrong instructions and have to discard them",
        "Branches can't be stored in the instruction cache",
        "Branches always cause a data hazard too",
      ],
      answer: 1,
      explain: "Fetch has to guess the next instruction every cycle. A branch may redirect execution, but that's only known once it resolves — anything fetched in the meantime that turns out wrong must be squashed, costing the branch penalty.",
    },
    {
      q: "In the animation, the branch resolved in EX and TWO instructions were flushed to ○. Resolving it one stage earlier (in Decode) would change the penalty to what?",
      options: [
        "0 cycles — no instruction is ever fetched wrongly",
        "1 cycle — only one instruction gets fetched before the branch is known, so only one needs squashing",
        "3 cycles — earlier resolution is slower",
        "It stays 2 cycles regardless",
      ],
      answer: 1,
      explain: "Each stage earlier the decision is made means one fewer wrongly-fetched instruction downstream. Extra hardware (an adder + comparator in Decode) buys exactly one stage of earliness, cutting the penalty from 2 cycles to 1.",
    },
    {
      q: "A 2-bit predictor is in the Strongly-Taken (ST) state. The branch is NOT taken once (an odd iteration), then taken again. What happens?",
      options: [
        "It immediately predicts not-taken on the very next branch",
        "It slips ST → Weakly-Taken but STILL predicts taken — a single miss can't flip the prediction, so the normal pattern is predicted correctly next time",
        "It resets to Strongly-Not-Taken",
        "It stops predicting until reset",
      ],
      answer: 1,
      explain: "The 2-bit counter needs two wrong guesses in a row to flip. One odd iteration only nudges ST → WT — and both states predict 'taken' — so the next (normal) branch is still predicted correctly. This is exactly why 2 bits beat 1 bit.",
    },
    {
      q: "Why must the Branch Target Buffer (BTB) be looked up in cycle 1, using just the branch's address?",
      options: [
        "To save memory",
        "A prediction only helps if it's ready BEFORE Fetch would otherwise stall — waiting until Decode/Compute to predict defeats the purpose of predicting at all",
        "The BTB replaces the Decode stage entirely",
        "It has nothing to do with timing",
      ],
      answer: 1,
      explain: "The whole point of prediction is to keep Fetch supplied without waiting. A BTB hit in cycle 1 — keyed just by address, before the instruction is even decoded — returns both the prediction and the target address in time for the very next fetch.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === questions[current].answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (current < questions.length - 1) { setCurrent((c) => c + 1); setSelected(null); }
    else { setDone(true); onComplete && onComplete(); }
  };

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🎉" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Perfect! Branch penalty, delay slots, and 2-bit prediction are all locked in." :
            score >= 2 ? "Good work! Replay the branch-flush animation and the 2-bit predictor to lock in the details." :
              "Revisit 'The Branch Problem' and 'Branch Penalty' — everything else builds on those two ideas."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now explain the branch penalty, the delay slot, static vs 2-bit dynamic prediction, and the BTB's role — every
            one of them a way to keep the control-hazard term in T = N·S/R small.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.5 — Instruction Sets, Datapath &amp; Control.</strong> You've spent
            three units fighting hazards on a fixed 5-stage pipe; next you'll see how the instruction set itself — the opcodes,
            addressing modes, and the control signals that drive the datapath — was shaped by exactly these pipeline pressures.
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>Question {current + 1} of {questions.length}</div>
      <div style={{ color: C.text, fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          let bg = C.card, border = C.border, col = C.text;
          if (selected !== null) {
            if (i === q.answer) { bg = C.green + "22"; border = C.green; col = C.green; }
            else if (i === selected) { bg = C.red + "22"; border = C.red; col = C.red; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              textAlign: "left", padding: "10px 14px", borderRadius: 8,
              background: bg, border: `1.5px solid ${border}`, color: col,
              cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s",
            }}>
              {i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.purple + "18", border: `1px solid ${C.purple}44`, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
          💡 {q.explain}
        </div>
      )}
      {selected !== null && (
        <button onClick={next} style={{
          marginTop: 14, padding: "10px 24px", borderRadius: 8,
          background: C.accentGlow, border: "none", color: "#fff",
          fontWeight: 600, cursor: "pointer", fontSize: 14,
        }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Main — header, progress bar, tab strip, content card, continue btn
// ══════════════════════════════════════════════════════════════════
export default function Unit3_4({ student, onUnitComplete }) {
  const sections = [
    { id: "problem", label: "The Branch Problem" },
    { id: "penalty", label: "Branch Penalty" },
    { id: "delay", label: "Delay Slot" },
    { id: "predictor", label: "2-Bit Predictor" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🍳 The Branch Problem — cooking before the order arrives</h3><BranchProblem /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>💥 Branch Penalty — watch the wrong guesses get flushed</h3><BranchPenalty /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🎯 The Delay Slot — never waste the fetch</h3><DelaySlot /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🔮 The 2-Bit Predictor — learning a habit</h3><BranchPredictor /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.4.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › UNIT 3.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Instruction Hazards</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>{completed.length} / {sections.length} done</div>
      </div>

      <div style={{ height: 3, background: C.border }}>
        <div style={{ height: "100%", width: `${(completed.length / sections.length) * 100}%`, background: C.green, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: C.surface, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          {sections.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)} style={{
              flex: 1, minWidth: 80, padding: "8px 6px", borderRadius: 7,
              background: activeSection === i ? C.accentGlow : "transparent",
              border: "none", color: activeSection === i ? "#fff" : C.muted,
              cursor: "pointer", fontSize: 11, fontWeight: activeSection === i ? 600 : 400,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              transition: "all 0.2s",
            }}>
              {completed.includes(i) && <span style={{ color: C.green }}>✓</span>}
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "24px 20px", border: `1px solid ${C.border}`, minHeight: 300 }}>
          {content[activeSection]}
        </div>

        {activeSection < sections.length - 1 && (
          <button onClick={goNext} style={{
            marginTop: 16, width: "100%", padding: "12px", borderRadius: 8,
            background: C.accentGlow, border: "none", color: "#fff",
            fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>Mark Complete &amp; Continue →</button>
        )}
      </div>
    </div>
  );
}
