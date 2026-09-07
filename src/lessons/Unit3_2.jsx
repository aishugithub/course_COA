// Unit3_2.jsx — Module 3 › Unit 3.2 — "Pipeline Performance"
// Rebuilt for interactivity: the four-sliders-in-a-row version is gone. Each section is
// now a DIFFERENT interaction — an auto-playing space-time pipeline, a predict-before-reveal,
// a click-to-reveal equation, and a visual stage-count trade-off. The PipelineGrid /
// buildStraightRows helpers defined here are the shared animation the other Unit 3 lessons
// reuse (copied in, since every lesson is self-contained).
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
//  Section 1 — Why? Watch the pipe fill and drain (auto-play animation)
// ══════════════════════════════════════════════════════════════════
function WhyItMatters() {
  const instrs = [
    { label: "I1  add", color: C.text }, { label: "I2  sub", color: C.text },
    { label: "I3  and", color: C.text }, { label: "I4  or", color: C.text }, { label: "I5  xor", color: C.text },
  ];
  const rows = buildStraightRows(instrs);
  const total = 9; // 5 + (5-1)

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Unit 3.1 showed you WHAT pipelining does — overlap instructions on the datapath you built in Unit 2.5.
        This unit puts real numbers on <strong style={{ color: C.text }}>how much</strong> that overlap buys. Hit
        <strong style={{ color: C.green }}> ▶ Run cycles</strong> and watch five instructions march through the five stages.
      </p>

      <PipelineGrid rows={rows} totalCycles={total} caption={(clk, done) =>
        clk === 0 ? "Cycle 0 — pipeline empty. Nothing has been issued yet." :
        clk < 5 ? `Cycle ${clk} — the pipe is still FILLING. Not one instruction has finished (the first result appears only at cycle 5).` :
        clk === 5 ? "Cycle 5 — the FIRST instruction finally reaches WB. This 5-cycle ramp-up is the fixed cost of pipelining." :
        clk < total ? `Cycle ${clk} — now in STEADY STATE: one instruction retires every single cycle. ${done} done so far.` :
        `Cycle ${total} — all 5 done. Took 5 + (5−1) = 9 cycles, versus 5 × 5 = 25 without overlap.`
      } />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>❌ NO OVERLAP</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>25</div>
          <div style={{ color: C.muted, fontSize: 11 }}>cycles = k × n = 5 × 5</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ PIPELINED</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>9</div>
          <div style={{ color: C.muted, fontSize: 11 }}>cycles = k + (n − 1) = 5 + 4</div>
        </div>
      </div>

      <Key color={C.green}>
        The pipe still needs 5 cycles to push the FIRST instruction all the way through — that ramp-up never
        disappears. It just matters less and less as more instructions follow behind it.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Count the Cycles: DERIVE k + (n-1) yourself, step by step.
//  Previously this section jumped straight from "pick a number out of a
//  hat" to stating the formula outright -- a flat multiple-choice guess
//  with the answer handed over one line later. Rewritten (per Aishu's
//  feedback, Sept 2026) into a four-beat guided derivation, so the FORMULA
//  is something the student assembles with their own clicks, not something
//  they are simply told:
//    Beat ① — recall check: how long until the very FIRST instruction
//             finishes? (answer: k -- nothing shortens I1's own trip)
//    Beat ② — recall check: once the pipe is FULL, how far apart do two
//             consecutive instructions finish? (answer: 1 -- Unit 3.1's
//             throughput idea, restated as a number)
//    Beat ③ — BUILD IT BY HAND: click through instructions I2..I20 one at
//             a time. Each click is one more "+1 cycle" landing, live, on
//             screen -- the derivation is the clicking, not a sentence.
//    Beat ④ — the formula is unveiled as the ALGEBRAIC NAME for what was
//             just built: k + (n − 1). "k" = beat ①'s answer. "n − 1" =
//             every instruction beat ③ added one at a time.
//  The "explore any n" slider that follows is the same generalisation tool
//  the old version had (drag n, watch speedup climb toward k) -- kept,
//  because feeling the k−1 fixed cost shrink in relative terms is still
//  the best payoff of dragging that slider. It now only appears once the
//  student has actually derived the formula in Beat ④, not before.
// ══════════════════════════════════════════════════════════════════
function CountTheCycles() {
  // Beats ① and ② are small recall checks. Each just needs to know whether
  // the student has clicked an option yet -- answering (right or wrong)
  // unlocks the next beat, the same progressive-reveal idiom every other
  // Unit 3 lesson uses (e.g. WhyPipelineRegisters in Unit3_1.jsx).
  const [beat1, setBeat1] = useState(null); // student's pick: cycles until I1 finishes
  const [beat2, setBeat2] = useState(null); // student's pick: gap between consecutive finishes

  // Beat ③ runs the fixed scenario the OLD quiz asked about cold: k=5
  // stages, n=20 instructions, correct answer 24 -- except now the student
  // reaches 24 by clicking instructions in one at a time, not by picking
  // it off a 4-option list.
  const K = 5;
  const N_DEMO = 20;
  const [built, setBuilt] = useState(0);         // how many of I2..I20 the student has clicked in (0..19)
  const runningTotal = K + built;                 // cycle at which the most-recently-added instruction finishes
  const derivationDone = built >= N_DEMO - 1;      // true once all 19 "extra" instructions have been placed

  // Beat ④ unlocks the moment the derivation completes, and STAYS unlocked
  // even if the student resets the builder afterwards to play with it again
  // -- resetting shouldn't take away the payoff they already earned.
  const [formulaRevealed, setFormulaRevealed] = useState(false);
  useEffect(() => { if (derivationDone) setFormulaRevealed(true); }, [derivationDone]);

  // "Explore any n" -- unchanged in spirit from the old version's slider,
  // just gated behind Beat ④ now instead of behind a single guess.
  const [n, setN] = useState(20);
  const serial = K * n;
  const pipelined = K + (n - 1);
  const speedup = (serial / pipelined).toFixed(2);
  const pct = Math.min(100, (speedup / K) * 100);

  const beat1Options = [
    { v: 5, label: "5 — one cycle per stage" },
    { v: 1, label: "1 — pipelining makes it instant" },
    { v: 20, label: "20 — one cycle per instruction in the program" },
    { v: 100, label: "100 — it touches every stage of every other instruction" },
  ];
  const beat2Options = [
    { v: 1, label: "1 cycle — a new one finishes every cycle" },
    { v: 5, label: "5 cycles — same as any single instruction" },
    { v: 2, label: "2 cycles" },
    { v: 0, label: "0 — they all finish at once" },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Don't reach for a formula yet. Answer two questions you already know from Section 1 — then build the cycle
        count for 20 instructions <strong style={{ color: C.text }}>one instruction at a time, by hand</strong>, before
        any algebra shows up.
      </p>

      {/* ---------------- Beat ① ---------------- */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: C.accent, fontWeight: 700, marginBottom: 10 }}>① How many cycles until the very FIRST instruction (I1) reaches WB?</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {beat1Options.map((o) => {
            let bg = C.bg, bd = C.border, col = C.text;
            if (beat1 !== null) {
              if (o.v === K) { bg = C.green + "22"; bd = C.green; col = C.green; }
              else if (o.v === beat1) { bg = C.red + "22"; bd = C.red; col = C.red; }
            }
            return (
              <button key={o.v} onClick={() => beat1 === null && setBeat1(o.v)} style={{
                textAlign: "left", padding: "8px 12px", borderRadius: 7, background: bg, border: `1.5px solid ${bd}`, color: col,
                fontSize: 12.5, cursor: beat1 === null ? "pointer" : "default", flex: "1 1 220px",
              }}>{beat1 !== null && o.v === K ? "✓ " : beat1 === o.v && o.v !== K ? "✗ " : ""}{o.label}</button>
            );
          })}
        </div>
        {beat1 !== null && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
            💡 Every instruction — the first one included — walks through all k = 5 stages. Nothing shortens that trip; I1 has no earlier instruction to overlap with yet.
          </div>
        )}
      </div>

      {/* ---------------- Beat ② (unlocked once Beat ① is answered) ---------------- */}
      {beat1 !== null && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, color: C.accent, fontWeight: 700, marginBottom: 10 }}>② Once the pipe is FULL (Section 1's steady state), how many cycles apart do two consecutive instructions finish?</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {beat2Options.map((o) => {
              let bg = C.bg, bd = C.border, col = C.text;
              if (beat2 !== null) {
                if (o.v === 1) { bg = C.green + "22"; bd = C.green; col = C.green; }
                else if (o.v === beat2) { bg = C.red + "22"; bd = C.red; col = C.red; }
              }
              return (
                <button key={o.v} onClick={() => beat2 === null && setBeat2(o.v)} style={{
                  textAlign: "left", padding: "8px 12px", borderRadius: 7, background: bg, border: `1.5px solid ${bd}`, color: col,
                  fontSize: 12.5, cursor: beat2 === null ? "pointer" : "default", flex: "1 1 220px",
                }}>{beat2 !== null && o.v === 1 ? "✓ " : beat2 === o.v && o.v !== 1 ? "✗ " : ""}{o.label}</button>
              );
            })}
          </div>
          {beat2 !== null && (
            <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
              💡 Right — once every stage is busy, one instruction retires every single cycle. That's the throughput win from Unit 3.1, now as a number.
            </div>
          )}
        </div>
      )}

      {/* ---------------- Beat ③: build it by hand (unlocked once Beat ② is answered) ---------------- */}
      {beat2 !== null && (
        <div style={{ background: C.card, border: `1.5px solid ${C.teal}55`, borderRadius: 10, padding: "16px", marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, color: C.teal, fontWeight: 700, marginBottom: 10 }}>③ Now build it. I1 finishes at cycle {K}. Click to bring in I2, I3, … one at a time — each one lands exactly 1 cycle after the last (that's ② talking).</div>

          {/* the running total in big friendly digits — this IS the derivation, happening live as they click */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: "14px 0" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.muted }}>instructions placed</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{1 + built} <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/ {N_DEMO}</span></div>
            </div>
            <div style={{ fontSize: 22, color: C.muted }}>→</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.muted }}>cycle the LAST one finishes</div>
              <div style={{ fontSize: 34, fontWeight: 800, color: C.green }}>{runningTotal}</div>
            </div>
          </div>

          {/* the chip strip: I1 is fixed at cycle K; every click reveals the next chip's finish cycle */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 14 }}>
            {Array.from({ length: N_DEMO }, (_, i) => i + 1).map((instrNum) => {
              const placed = instrNum === 1 || instrNum - 1 <= built; // I1 always placed; I(m) placed once built >= m-1
              const finishCycle = K + (instrNum - 1);
              const justAdded = instrNum === 1 + built; // the most recently revealed chip, highlighted
              return (
                <div key={instrNum} style={{
                  width: 46, height: 34, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: placed ? (justAdded ? C.teal + "33" : C.card) : C.bg,
                  border: `1px solid ${placed ? (justAdded ? C.teal : C.border) : C.border}`,
                  opacity: placed ? 1 : 0.35,
                }}>
                  <div style={{ fontSize: 8.5, color: C.muted }}>I{instrNum}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: placed ? C.text : C.muted }}>{placed ? finishCycle : "?"}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setBuilt((b) => Math.min(N_DEMO - 1, b + 1))} disabled={derivationDone} style={btn(derivationDone ? C.border : C.teal)}>+ Add next instruction</button>
            <button onClick={() => setBuilt((b) => Math.min(N_DEMO - 1, b + 5))} disabled={derivationDone} style={btn(derivationDone ? C.border : C.accentGlow)}>+5 instructions</button>
            <button onClick={() => setBuilt(0)} style={btn(C.card, C.muted)}>↺ Reset</button>
          </div>
        </div>
      )}

      {/* ---------------- Beat ④: the formula, unveiled as the NAME for what just happened ---------------- */}
      {formulaRevealed && (
        <div style={{ background: `linear-gradient(135deg, ${C.green}22, ${C.teal}18)`, border: `1px solid ${C.green}55`, borderRadius: 10, padding: "16px", marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 6 }}>🎉 THAT'S THE FORMULA — YOU JUST BUILT IT</div>
          <div style={{ fontFamily: "monospace", fontSize: 20, color: C.text, marginBottom: 6 }}>
            k + (n − 1) &nbsp;=&nbsp; 5 + (20 − 1) &nbsp;=&nbsp; <strong style={{ color: C.green }}>24</strong>
          </div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
            "k" is the head start I1 alone needed (5 cycles, from ①). "n − 1" is every OTHER instruction, each adding
            just 1 more cycle (from ②) — because it lands one cycle behind the one before it, not five.
          </div>
        </div>
      )}

      {/* ---------------- explore any n (same tool as before, now gated behind the derivation) ---------------- */}
      {formulaRevealed && (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.muted, fontSize: 12 }}>Now generalise — drag n (instructions) = <strong style={{ color: C.teal }}>{n}</strong></label>
            <input type="range" min={1} max={200} value={n} onChange={(e) => setN(Number(e.target.value))} style={{ width: "100%", accentColor: C.teal }} />
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center", marginBottom: 12 }}>
              <div><div style={{ fontSize: 11, color: C.muted }}>no pipeline: k × n</div><div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>{serial}</div></div>
              <div><div style={{ fontSize: 11, color: C.muted }}>pipelined: k + (n − 1)</div><div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{pipelined}</div></div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>speedup {speedup}× &nbsp;→&nbsp; ideal ceiling {K}×</div>
            <div style={{ height: 14, background: C.bg, borderRadius: 7, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.green})`, transition: "width 0.3s" }} />
            </div>
          </div>
        </>
      )}

      <Key color={C.yellow}>
        Speedup <strong style={{ color: C.text }}>approaches k</strong> as n grows, but never equals it — the k − 1 cycles
        spent filling and draining the pipe are a fixed one-time cost. Push n to 200 and the bar still stops short of 5×.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The Performance Equation: click each term to reveal it
// ══════════════════════════════════════════════════════════════════
function PerformanceEquation() {
  const [part, setPart] = useState(null);
  // Drives the NEW "S converges toward 1" widget below: cpiN is the program
  // length (n) the student is exploring; everything else (cpiValue, the
  // marker position, the checkpoint bars) is derived from it each render.
  const [cpiN, setCpiN] = useState(5);
  const K_REF = 5; // this course's own pipeline depth, used as the S=5 endpoint throughout Unit 3
  const cpiValue = (K_REF + (cpiN - 1)) / cpiN;               // Section 2's total-cycle formula, divided across n -- literally what "average CPI" means
  const cpiMarkerPct = Math.min(100, Math.max(0, ((cpiValue - 1) / (K_REF - 1)) * 100)); // 0% at S=1 (ideal), 100% at S=5 (no overlap)
  const CPI_CHECKPOINTS = [1, 2, 5, 10, 20, 50, 100, 200]; // fixed n's for the staircase mini-chart, so the trend reads even without dragging
  const terms = {
    T: { color: C.text, name: "T — execution time", body: "The total wall-clock time to run the program. This is what we're ultimately trying to shrink." },
    N: { color: C.teal, name: "N — instruction count", body: "How many instructions actually execute. Set by the program and the compiler — pipelining doesn't change N." },
    S: { color: C.orange, name: "S — average cycles per instruction (CPI)", body: "The big one. No pipeline: S = k = 5 (each instruction takes all 5 stages before the next starts). Ideal pipeline: S = 1 — one instruction finishes every cycle." },
    R: { color: C.purple, name: "R — clock rate", body: "Cycles per second. A faster clock lowers T, but only if S doesn't rise to cancel it out." },
  };

  const Span = ({ k, children }) => (
    <span onClick={() => setPart(k)} style={{
      cursor: "pointer", color: terms[k].color, fontWeight: 800,
      textDecoration: part === k ? "underline" : "none", padding: "0 2px",
    }}>{children}</span>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The "cycles saved by overlap" idea gets formalised into one equation used for <em>any</em> processor. Click each
        term to see what it means:
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px", textAlign: "center", marginBottom: 14, fontFamily: "monospace", fontSize: 20 }}>
        <Span k="T">T</Span> = ( <Span k="N">N</Span> × <Span k="S">S</Span> ) / <Span k="R">R</Span>
      </div>

      {part && (
        <div style={{ background: terms[part].color + "18", border: `1px solid ${terms[part].color}44`, borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ color: terms[part].color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{terms[part].name}</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{terms[part].body}</div>
        </div>
      )}

      {/* ---------------- NEW: S doesn't jump from 5 to 1 — it EARNS its way there as n grows ---------------- */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", marginBottom: 16 }}>
        <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 12, lineHeight: 1.6 }}>
          S doesn't jump straight from 5 to 1 — it <strong style={{ color: C.text }}>earns</strong> its way there as the program gets
          longer. S is just Section 2's total-cycle count divided across n instructions:
          <strong style={{ color: C.text }}> S = (k + (n − 1)) / n</strong>. Drag n and watch it fall.
        </p>

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: C.muted, fontSize: 12 }}>n (instructions in the program) = <strong style={{ color: C.orange }}>{cpiN}</strong></label>
          <input type="range" min={1} max={200} value={cpiN} onChange={(e) => setCpiN(Number(e.target.value))} style={{ width: "100%", accentColor: C.orange }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted }}>average CPI at this n</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.orange }}>{cpiValue.toFixed(2)}</div>
          </div>
          {/* a track from S=1 (ideal, left) to S=5 (no overlap, right) with a marker at the live value */}
          <div style={{ flex: "1 1 200px", maxWidth: 240 }}>
            <div style={{ position: "relative", height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${C.green}, ${C.orange}, ${C.red})` }}>
              <div style={{ position: "absolute", top: -4, left: `calc(${cpiMarkerPct}% - 6px)`, width: 12, height: 18, borderRadius: 3, background: C.text, border: `2px solid ${C.bg}`, transition: "left 0.2s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: C.muted, marginTop: 3 }}><span>S=1 (ideal)</span><span>S=5 (no pipeline)</span></div>
          </div>
        </div>

        {/* Plug THIS n and S straight back into the formula above -- the equation stays visible and live, not a separate fact. With R=1 (one cycle per "tick") T comes out in cycles, and it always lands exactly on Section 2's k+(n-1) -- the two sections are describing the same number two different ways. */}
        <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 13, color: C.muted, marginBottom: 14, background: C.bg, borderRadius: 8, padding: "8px 10px" }}>
          T = N × S / R &nbsp;=&nbsp; {cpiN} × {cpiValue.toFixed(2)} / R &nbsp;=&nbsp; <strong style={{ color: C.text }}>{Math.round(cpiN * cpiValue)}</strong> cycles (R = 1)
          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 4 }}>— exactly Section 2's k + (n − 1) = 5 + {cpiN - 1} = {5 + (cpiN - 1)}. Same number, two routes to it.</div>
        </div>

        {/* checkpoint staircase — the same curve at a handful of fixed n's, so the DOWNWARD TREND reads at a glance without dragging */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, justifyContent: "center", height: 70 }}>
          {CPI_CHECKPOINTS.map((cn) => {
            const s = (K_REF + (cn - 1)) / cn;
            const h = Math.max(6, ((s - 1) / (K_REF - 1)) * 60);
            const active = cn === cpiN;
            return (
              <div key={cn} style={{ textAlign: "center" }}>
                <div style={{ width: 22, height: h, borderRadius: "4px 4px 0 0", background: active ? C.orange : C.orange + "55", border: `1px solid ${C.orange}` }} />
                <div style={{ fontSize: 8.5, color: active ? C.text : C.muted, fontWeight: active ? 700 : 400, marginTop: 3 }}>{cn}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 10, color: C.muted, textAlign: "center", marginTop: 4 }}>n (instructions) — bar height = average CPI at that n. Longer program, shorter bar, closer to S=1.</div>
      </div>

      <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 10, lineHeight: 1.6 }}>
        Same program (same N), same clock (same R). The ONLY thing pipelining changes is S — from 5 down toward 1. Here
        are the two ends of the curve you just dragged through:
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.red}55`, borderRadius: 10, padding: 12 }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 11.5, marginBottom: 8, textAlign: "center" }}>NO PIPELINE · S = 5</div>
          <MiniPipe stagger={false} />
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}55`, borderRadius: 10, padding: 12 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 11.5, marginBottom: 8, textAlign: "center" }}>IDEAL PIPELINE · S = 1</div>
          <MiniPipe stagger={true} />
        </div>
      </div>

      <Key color={C.accent}>
        S = 1 is a LIMIT, not a guarantee — it's only reached as n → ∞. Every real, finite program's average CPI sits a
        little above 1, but the longer the program runs, the closer it gets — which is why the up-to-5× ceiling from
        Section 2 is a target that longer programs approach and short snippets fall well short of.
      </Key>
    </div>
  );
}

// Tiny static illustration for the S=5 vs S=1 contrast (non-interactive, so it stays cheap)
function MiniPipe({ stagger }) {
  const stages = ["IF", "ID", "EX", "MEM", "WB"];
  const instrs = [0, 1, 2];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {instrs.map((i) => (
        <div key={i} style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: stagger ? 3 + 4 : 15 }).map((_, c) => {
            let st = null;
            if (stagger) { if (c >= i && c < i + 5) st = stages[c - i]; }
            else { const base = i * 5; if (c >= base && c < base + 5) st = stages[c - base]; }
            return <div key={c} style={{ width: 15, height: 13, borderRadius: 3, background: st ? STAGE_COLOR[st] + "44" : "transparent", border: st ? `1px solid ${STAGE_COLOR[st]}` : `1px dashed ${C.border}` }} />;
          })}
        </div>
      ))}
      <div style={{ fontSize: 9.5, color: C.muted, marginTop: 4, textAlign: "center" }}>{stagger ? "overlapped — 7 cycles for 3" : "serial — 15 cycles for 3"}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — How Many Stages? A relay of painters, and two animations.
//  Second rewrite of this section. The first rewrite explained the two
//  mechanisms in words and numbers but the numbers were ugly decimals
//  (TOTAL_DELAY=12 / ALU_FLOOR=1.2 -> "2.40") and nothing MOVED. Per
//  Aishu's feedback this pass: (a) whole-number-friendly constants -- her
//  own example, 10 units of delay over 5 stages = 2, exactly -- with every
//  displayed period rounded to a whole unit; (b) a concrete physical
//  analogy (painting a 10-minute fence in relay, one station per stage)
//  instead of an abstract "combinational delay"; (c) two actual animations,
//  not just static numbers: a token crossing the delay bar (Mechanism A --
//  same total job, more/shorter ticks as k rises), and a step-through
//  misprediction flush (Mechanism B -- watch the wasted instructions get
//  discarded one at a time instead of seeing them all appear at once).
//  TOTAL_DELAY / ALU_FLOOR remain illustrative teaching units, not real
//  hardware nanoseconds -- what matters is the SHAPE (rises, then flattens
//  at the floor), which is exactly what Hamacher's own bullet points
//  describe qualitatively.
// ══════════════════════════════════════════════════════════════════
function HowManyStages() {
  const [k, setK] = useState(5);

  // ---- Mechanism A numbers: same as before, just whole-number-friendly ----
  const TOTAL_DELAY = 10;  // "the fence takes 10 minutes to paint, start to finish, with one painter doing it alone"
  const ALU_FLOOR = 1;     // "no painter can dip the brush and lay even one stroke in under 1 minute" -- the ALU floor
  const idealStageDelay = TOTAL_DELAY / k;                    // what the split WOULD be with no floor (kept unrounded for correct floor logic)
  const actualPeriodRaw = Math.max(idealStageDelay, ALU_FLOOR);
  const actualPeriod = Math.round(actualPeriodRaw);           // ROUNDED for display only -- Aishu's ask: no more "2.40", just "2"
  const floorHit = idealStageDelay < ALU_FLOOR;
  const period5 = Math.max(TOTAL_DELAY / 5, ALU_FLOOR);       // this course's own k=5 pipeline = the "1.00x" baseline (works out to a clean 2)
  const relClock = (period5 / actualPeriodRaw).toFixed(2);    // a genuine ratio/multiplier, so decimals here are normal (e.g. "1.67x"), not a raw unit count

  // ---- Mechanism A animation: a token crossing the SAME fixed-length job, cut into k stations ----
  // The whole crossing always takes ANIM_MS in real time, however many stations k there are -- that's
  // the point: it's the SAME 10-minute job either way. What changes is how many times the "tick" fires
  // along the way (once per station), which is the whole clock-rate story made visible.
  const ANIM_MS = 3000;
  const [tick, setTick] = useState(0);      // how many station-boundaries the token has crossed, 0..k
  const [running, setRunning] = useState(false);
  useEffect(() => { setTick(0); setRunning(false); }, [k]); // dragging k mid-animation resets it cleanly
  useEffect(() => {
    if (!running) return;
    if (tick >= k) { setRunning(false); return; }
    const t = setTimeout(() => setTick((t2) => t2 + 1), ANIM_MS / k);
    return () => clearTimeout(t);
  }, [running, tick, k]);

  // ---- Mechanism B numbers ----
  const branchPenalty = k - 1; // worst case: branch resolves at the very last stage, so every earlier-fetched instruction behind it is wasted
  const risk = k <= 4 ? "low" : k <= 8 ? "moderate" : k <= 14 ? "high" : "very high";
  const riskColor = k <= 4 ? C.green : k <= 8 ? C.yellow : k <= 14 ? C.orange : C.red;

  // ---- Mechanism B animation: reveal the flushed instructions one at a time instead of all at once ----
  const [flushed, setFlushed] = useState(0); // how many of the k-1 red boxes have been "discarded" so far
  const [flushing, setFlushing] = useState(false);
  useEffect(() => { setFlushed(0); setFlushing(false); }, [k]);
  useEffect(() => {
    if (!flushing) return;
    if (flushed >= branchPenalty) { setFlushing(false); return; }
    const t = setTimeout(() => setFlushed((f) => f + 1), 260);
    return () => clearTimeout(t);
  }, [flushing, flushed, branchPenalty]);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Picture a 10-minute fence-painting job, done solo. Now cut that SAME job into k stations along the fence, one
        painter per station, each passing the brush down the line — exactly like the datapath stages you already know.
        Two things change as you add stations, and they pull in opposite directions. Drag k.
      </p>

      <div style={{ marginBottom: 18 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>k (pipeline stages / painting stations) = <strong style={{ color: C.accent }}>{k}</strong></label>
        <input type="range" min={2} max={16} value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>

      {/* ---------------- Mechanism A: why clock rate rises (and then stops) ---------------- */}
      <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12.5, color: C.green, fontWeight: 700, marginBottom: 8 }}>Why clock rate rises — the SAME 10-minute job, cut into more pieces</div>
        <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 10, lineHeight: 1.6 }}>
          The whole fence still takes <strong style={{ color: C.text }}>{TOTAL_DELAY}</strong> minutes to paint, start to finish — cutting it
          into stations doesn't shrink the total job. But with k stations sharing it, each one only has to paint for about
          <strong style={{ color: C.text }}> {idealStageDelay.toFixed(1)}</strong> minutes before passing the brush on — and the clock can tick
          exactly that often.
        </p>

        {/* the delay bar: fixed total width, split into k equal stations */}
        <div style={{ display: "flex", gap: 1, height: 22, borderRadius: 5, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 4, position: "relative" }}>
          {Array.from({ length: k }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i < tick ? C.green + "55" : C.green + "18", borderRight: i < k - 1 ? `1px solid ${C.bg}` : "none", transition: "background 0.15s" }} />
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 10 }}>{TOTAL_DELAY} minutes of fence, split into {k} equal station{k > 1 ? "s" : ""} — {tick} of {k} crossed so far</div>

        {/* the animation controls: watch the SAME job cross the bar, ticking once per station */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <button onClick={() => { if (tick >= k) setTick(0); setRunning((r) => !r); }} style={btn(running ? C.orange : C.green)}>
            {running ? "⏸ Pause" : tick >= k ? "↺ Replay" : "▶ Watch the brush travel"}
          </button>
          <button onClick={() => { setRunning(false); setTick(0); }} style={btn(C.card, C.muted)}>↺ Reset</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted }}>actual clock period (rounded)</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{actualPeriod}</div>
            <div style={{ fontSize: 9.5, color: floorHit ? C.orange : C.muted }}>{floorHit ? "⚠ floored by the 1-minute brush-dip — more stations won't help" : "≈ the fence-length ÷ k"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.muted }}>clock rate, relative to k=5</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{relClock}×</div>
            <div style={{ fontSize: 9.5, color: C.muted }}>this course's own pipeline is the 1.00× baseline</div>
          </div>
        </div>
      </div>

      {/* ---------------- Mechanism B: why hazard risk rises ---------------- */}
      <div style={{ background: C.card, border: `1.5px solid ${riskColor}44`, borderRadius: 10, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12.5, color: riskColor, fontWeight: 700, marginBottom: 8 }}>Why hazard risk rises — more painters are ALWAYS mid-stroke</div>
        <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 10, lineHeight: 1.6 }}>
          At steady state there are always exactly k instructions inside the pipe. Worst case: a branch's outcome isn't
          known until it reaches the very LAST station. Everything fetched behind it — k − 1 instructions — has to be
          thrown away if the branch was mispredicted. Press play to watch them go, one wasted cycle at a time.
        </p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10, justifyContent: "center" }}>
          {Array.from({ length: k }).map((_, i) => {
            const isBranch = i === 0;
            const isFlushed = !isBranch && i <= flushed; // revealed progressively by the animation below
            const col = isBranch ? C.accent : C.red;
            return (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9.5, fontWeight: 700, transition: "all 0.2s",
                background: isBranch ? col + "33" : (isFlushed ? col + "55" : C.bg),
                border: `1.5px solid ${isBranch ? col : (isFlushed ? col : C.border)}`,
                color: isBranch ? col : (isFlushed ? col : C.muted),
                transform: isFlushed ? "scale(1.08)" : "scale(1)",
              }}>
                {isBranch ? "BR" : (isFlushed ? "✕" : "·")}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => { if (flushed >= branchPenalty) setFlushed(0); setFlushing((f) => !f); }} disabled={branchPenalty === 0} style={btn(branchPenalty === 0 ? C.border : (flushing ? C.orange : C.red))}>
            {flushing ? "⏸ Pause" : flushed >= branchPenalty && branchPenalty > 0 ? "↺ Replay" : "▶ Simulate a misprediction"}
          </button>
          <button onClick={() => { setFlushing(false); setFlushed(0); }} style={btn(C.card, C.muted)}>↺ Reset</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted }}>worst-case branch penalty</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.red }}>{branchPenalty} cycle{branchPenalty === 1 ? "" : "s"}</div>
            <div style={{ fontSize: 9.5, color: C.muted }}>= k − 1 instructions flushed</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.muted }}>qualitative hazard risk</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, textTransform: "capitalize" }}>{risk}</div>
            <div style={{ fontSize: 9.5, color: C.muted }}>{k} in flight → more possible dependencies too</div>
          </div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>
        Notice the two mechanisms don't move together: Mechanism A flattens out once the 1-minute brush-dip floor is hit,
        but Mechanism B (the flush count) keeps climbing with every extra station, forever. That mismatch — one side
        capping out, the other not — is exactly why real designs stop around 10–20 stages instead of pushing k as high
        as possible.
      </div>

      <Key color={C.purple}>
        Push k up in T = N·S/R: R rises (Mechanism A) — but S can rise too, because bigger stalls and a bigger branch
        penalty (Mechanism B) mean more wasted cycles per instruction. The two effects fight each other directly in that
        one equation, so more stages is not automatically more speed. Learning to fight the S side of that fight is
        exactly what <strong style={{ color: C.text }}>Unit 3.3, Data Hazards</strong> teaches next.
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
      q: "A 5-stage pipeline runs 20 independent instructions. How many cycles does it take?",
      options: ["100 cycles", "24 cycles", "25 cycles", "5 cycles"],
      answer: 1,
      explain: "k + (n − 1) = 5 + 19 = 24. Without pipelining it would be k × n = 100 — over 4× slower.",
    },
    {
      q: "Why doesn't the speedup ever exactly equal k, no matter how large n gets?",
      options: [
        "Because clock rate limits it",
        "The k − 1 cycles to fill and drain the pipe are a fixed cost that shrinks relative to n but never hits zero",
        "Because caches always miss",
        "It does exactly equal k for large n",
      ],
      answer: 1,
      explain: "The fill/drain overhead is spread over more instructions as n grows, so speedup approaches k — but never reaches it for any finite n.",
    },
    {
      q: "In T = (N × S) / R, what is S for an IDEAL pipeline with no stalls?",
      options: ["S = k (number of stages)", "S = N", "S = 1", "S = R"],
      answer: 2,
      explain: "An ideal pipeline retires one instruction every cycle once full, so average cycles-per-instruction S = 1 — versus S = 5 for a non-pipelined 5-stage design.",
    },
    {
      q: "Why don't real processors just keep adding pipeline stages forever?",
      options: [
        "More stages have no effect on clock rate",
        "More stages raise R but also raise in-flight dependencies and branch penalty, so gains flatten out",
        "Pipelining only works up to exactly 5 stages",
        "Adding stages always slows the clock",
      ],
      answer: 1,
      explain: "More stages → shorter period → higher R (good), but more instructions in flight → more stalls and a bigger branch penalty (bad). The net gain flattens; real designs land around 10–20 stages.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (i) => { if (selected !== null) return; setSelected(i); if (i === questions[current].answer) setScore((s) => s + 1); };
  const next = () => { if (current < questions.length - 1) { setCurrent((c) => c + 1); setSelected(null); } else { setDone(true); onComplete && onComplete(); } };

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🎉" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Perfect! You can derive cycle counts and read the performance equation cold." :
            score >= 2 ? "Good work! Replay 'Count the Cycles' and 'The Performance Equation' to lock in the formulas." :
              "Revisit 'Why It Matters' — the pipe's fixed fill/drain cost is the idea everything else builds on."}
        </div>
        <div style={{ padding: "20px", borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can compute pipeline cycle counts, explain why speedup approaches but never reaches k, use T = N·S/R, and reason
            about the stage-count trade-off.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.3 — Data Hazards.</strong> The ideal S = 1 only holds when instructions
            are independent. Next you'll see exactly what happens when one instruction needs a result the one ahead hasn't produced yet.
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
            <button key={i} onClick={() => choose(i)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: 8, background: bg, border: `1.5px solid ${border}`, color: col, cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s" }}>
              {i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.purple + "18", border: `1px solid ${C.purple}44`, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>💡 {q.explain}</div>
      )}
      {selected !== null && (
        <button onClick={next} style={{ marginTop: 14, padding: "10px 24px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Main
// ══════════════════════════════════════════════════════════════════
export default function Unit3_2({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Watch It Fill" },
    { id: "count", label: "Count the Cycles" },
    { id: "equation", label: "T = N·S/R" },
    { id: "stages", label: "How Many Stages?" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⏳ Watch It Fill — the ramp-up nobody escapes</h3><WhyItMatters /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🧮 Count the Cycles — derive k + (n − 1) yourself</h3><CountTheCycles /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📐 The Performance Equation — T = N·S/R</h3><PerformanceEquation /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⚖️ How Many Stages? — the trade-off</h3><HowManyStages /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.2.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › UNIT 3.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Pipeline Performance</div>
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
              background: activeSection === i ? C.accentGlow : "transparent", border: "none",
              color: activeSection === i ? "#fff" : C.muted, cursor: "pointer", fontSize: 11,
              fontWeight: activeSection === i ? 600 : 400, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 4, transition: "all 0.2s",
            }}>
              {completed.includes(i) && <span style={{ color: C.green }}>✓</span>}{s.label}
            </button>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "24px 20px", border: `1px solid ${C.border}`, minHeight: 300 }}>
          {content[activeSection]}
        </div>

        {activeSection < sections.length - 1 && (
          <button onClick={goNext} style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mark Complete &amp; Continue →</button>
        )}
      </div>
    </div>
  );
}
