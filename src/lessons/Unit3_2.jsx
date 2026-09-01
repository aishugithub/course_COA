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
//  Section 2 — Count the Cycles: guess first, then the k+(n-1) reveal
// ══════════════════════════════════════════════════════════════════
function CountTheCycles() {
  const [guess, setGuess] = useState(null);
  const guesses = [25, 24, 100, 5];
  const correct = 24;

  const [n, setN] = useState(20);
  const k = 5;
  const serial = k * n;
  const pipelined = k + (n - 1);
  const speedup = (serial / pipelined).toFixed(2);
  const pct = Math.min(100, (speedup / k) * 100);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Before any formula — <strong style={{ color: C.text }}>guess</strong>. A 5-stage pipe runs 20 independent
        instructions. How many cycles does it take once you account for the fill-up you just watched?
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        {guesses.map((g) => {
          let bg = C.card, bd = C.border, col = C.text;
          if (guess !== null) {
            if (g === correct) { bg = C.green + "22"; bd = C.green; col = C.green; }
            else if (g === guess) { bg = C.red + "22"; bd = C.red; col = C.red; }
          }
          return (
            <button key={g} onClick={() => guess === null && setGuess(g)} style={{
              padding: "10px 18px", borderRadius: 8, background: bg, border: `1.5px solid ${bd}`, color: col,
              fontWeight: 700, fontSize: 14, cursor: guess === null ? "pointer" : "default",
            }}>{guess !== null && g === correct ? "✓ " : guess === g && g !== correct ? "✗ " : ""}{g}</button>
          );
        })}
      </div>

      {guess !== null && (
        <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>
          💡 It's <strong style={{ color: C.green }}>k + (n − 1) = 5 + 19 = 24</strong> cycles. Not 100 (that's the no-overlap
          k × n), not 25 (that would be n=21), and definitely not 5. Now drag n and watch the speedup climb.
        </div>
      )}

      {guess !== null && (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.muted, fontSize: 12 }}>n (instructions) = <strong style={{ color: C.teal }}>{n}</strong></label>
            <input type="range" min={1} max={200} value={n} onChange={(e) => setN(Number(e.target.value))} style={{ width: "100%", accentColor: C.teal }} />
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center", marginBottom: 12 }}>
              <div><div style={{ fontSize: 11, color: C.muted }}>no pipeline: k × n</div><div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>{serial}</div></div>
              <div><div style={{ fontSize: 11, color: C.muted }}>pipelined: k + (n − 1)</div><div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{pipelined}</div></div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>speedup {speedup}× &nbsp;→&nbsp; ideal ceiling {k}×</div>
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

      <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 10, lineHeight: 1.6 }}>
        Same program (same N), same clock (same R). The ONLY thing pipelining changes is S — from 5 down toward 1. That's
        the whole ballgame:
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
        Non-pipelined S = 5; ideal pipelined S = 1 — an up-to <strong style={{ color: C.text }}>5× throughput gain</strong> from
        one term of the equation. Once S = 1 the throughput equals the clock rate R exactly.
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
//  Section 4 — How Many Stages? trade-off (slider drives a visible pipe)
// ══════════════════════════════════════════════════════════════════
function HowManyStages() {
  const [k, setK] = useState(5);
  const clockGhz = (0.5 + k * 0.35).toFixed(2);
  const risk = k <= 4 ? "low" : k <= 8 ? "moderate" : k <= 14 ? "high" : "very high";
  const riskColor = k <= 4 ? C.green : k <= 8 ? C.yellow : k <= 14 ? C.orange : C.red;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        More stages = less work per stage = a shorter clock period = a higher clock rate R. But more instructions are
        in flight at once, so more of them can depend on one still in the pipe. Drag k and watch both sides move — and
        watch how many instructions are in flight (coloured) at once.
      </p>

      <div style={{ marginBottom: 14 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>k (pipeline stages) = <strong style={{ color: C.accent }}>{k}</strong></label>
        <input type="range" min={2} max={16} value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>

      {/* in-flight visual: k slots, all coloured = all busy at steady state */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14, justifyContent: "center" }}>
        {Array.from({ length: k }).map((_, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 5, background: riskColor + "33", border: `1px solid ${riskColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: riskColor, fontWeight: 700 }}>S{i + 1}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ CLOCK RATE ↑</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>~{clockGhz} GHz</div>
          <div style={{ color: C.muted, fontSize: 10.5, marginTop: 4 }}>less work per stage → shorter period</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${riskColor}44`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ color: riskColor, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⚠️ HAZARD RISK</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text, textTransform: "capitalize" }}>{risk}</div>
          <div style={{ color: C.muted, fontSize: 10.5, marginTop: 4 }}>{k} in flight → more dependencies, bigger branch penalty</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>
        The clock can't go below the <strong>slowest basic operation</strong> (usually the ALU). Gains flatten past a point;
        real designs use roughly 10–20 stages at several GHz — balancing both sides, not maximising either.
      </div>

      <Key color={C.purple}>
        Ideal speedup approaches the number of stages, but every stall pulls the real gain below ideal — which is exactly
        what <strong style={{ color: C.text }}>Unit 3.3, Data Hazards</strong> is about.
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
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🧮 Count the Cycles — guess, then k + (n − 1)</h3><CountTheCycles /></div>,
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
