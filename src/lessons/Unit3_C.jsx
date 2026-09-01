// Unit3_C.jsx — Module 3 › Capstone — "Schedule to Avoid Stalls"
// The playable close of the pipelining module: the learner reorders instructions and watches
// the bubbles disappear in the live pipeline diagram. Shared helpers (C, STAGE_COLOR, Key,
// btn, PipelineGrid) are copied verbatim from Unit3_2 so every Unit 3 diagram behaves the same.
import { useState, useEffect } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};

const STAGE_COLOR = { IF: C.accent, ID: C.purple, EX: C.orange, MEM: C.teal, WB: C.green, "○": C.muted };

function Key({ color = C.purple, children }) {
  return (
    <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
      🔑 {children}
    </div>
  );
}

function btn(bg, col = "#fff") {
  return { padding: "7px 14px", borderRadius: 7, background: bg, border: "none", color: col, fontWeight: 600, fontSize: 12.5, cursor: "pointer" };
}

// buildRows: schedule = [{ label, color, stages: [{ name, cycle }] }] → { label, color, cells }
function buildRows(schedule) {
  return schedule.map((s) => {
    const cells = {};
    s.stages.forEach((st) => { cells[st.cycle] = st.name; });
    return { label: s.label, color: s.color, cells };
  });
}

// ── Shared PipelineGrid (verbatim from Unit3_2) ──
function PipelineGrid({ rows, totalCycles, caption, speed = 650 }) {
  const [clock, setClock] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (clock >= totalCycles) { setPlaying(false); return; }
    const t = setTimeout(() => setClock((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [playing, clock, totalCycles, speed]);

  const wbCycleOf = (r) => Math.max(...Object.keys(r.cells).filter((cy) => r.cells[cy] === "WB").map(Number));
  const done = rows.filter((r) => wbCycleOf(r) <= clock).length;
  const cycleNums = Array.from({ length: totalCycles }, (_, i) => i + 1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => { if (clock >= totalCycles) setClock(0); setPlaying((p) => !p); }} style={btn(playing ? C.orange : C.green)}>
          {playing ? "⏸ Pause" : clock >= totalCycles ? "↺ Replay" : "▶ Run cycles"}
        </button>
        <button onClick={() => { setPlaying(false); setClock((c) => Math.min(totalCycles, c + 1)); }} style={btn(C.accentGlow)}>Step ▶</button>
        <button onClick={() => { setPlaying(false); setClock(0); }} style={btn(C.card, C.muted)}>↺ Reset</button>
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>
          clock = <strong style={{ color: C.accent }}>{clock}</strong> / {totalCycles} · done = <strong style={{ color: C.green }}>{done}</strong> / {rows.length}
        </div>
      </div>

      <div style={{ overflowX: "auto", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${totalCycles}, 40px)`, gap: 4, minWidth: "fit-content" }}>
          <div style={{ fontSize: 10, color: C.muted, alignSelf: "center" }}>instr \ cycle</div>
          {cycleNums.map((cy) => (
            <div key={cy} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: cy === clock ? C.accent : C.muted }}>{cy}</div>
          ))}
          {rows.flatMap((r, ri) => [
            <div key={`lbl-${ri}`} style={{ fontSize: 11.5, fontFamily: "monospace", color: r.color, alignSelf: "center", whiteSpace: "nowrap" }}>{r.label}</div>,
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

// ══════════════════════════════════════════════════════════════════
//  The program the whole capstone works on (a classic load-use example).
//  writes/reads name the registers; external inputs (R2,R4,R7) are written
//  by nobody, so they never create a dependency.
// ══════════════════════════════════════════════════════════════════
const PROGRAM = [
  { id: "A", label: "lw  R1, 0(R2)", color: C.teal, writes: "R1", reads: ["R2"], isLoad: true },
  { id: "B", label: "add R3, R1, R4", color: C.text, writes: "R3", reads: ["R1", "R4"], isLoad: false },
  { id: "C", label: "lw  R5, 4(R2)", color: C.teal, writes: "R5", reads: ["R2"], isLoad: true },
  { id: "D", label: "sub R6, R5, R7", color: C.text, writes: "R6", reads: ["R5", "R7"], isLoad: false },
];

// A load-use stall = an instruction reads a register the IMMEDIATELY preceding lw just loaded
// (forwarding can't rescue a load in time — the value isn't ready until after MEM). One bubble each.
function analyze(order) {
  let cycle = 1;
  const schedule = [];
  let bubbles = 0;
  order.forEach((ins, i) => {
    const prev = order[i - 1];
    const stall = i > 0 && prev.isLoad && ins.reads.includes(prev.writes);
    if (stall) { cycle += 1; bubbles += 1; }
    const stages = [
      ...(stall ? [{ name: "○", cycle: cycle - 1 }] : []),
      { name: "IF", cycle }, { name: "ID", cycle: cycle + 1 }, { name: "EX", cycle: cycle + 2 },
      { name: "MEM", cycle: cycle + 3 }, { name: "WB", cycle: cycle + 4 },
    ];
    schedule.push({ label: ins.label, color: ins.color, stages });
    cycle += 1;
  });
  const total = cycle + 3; // last WB
  // correctness: every read of a register produced in this program must come AFTER its producer
  let valid = true;
  order.forEach((ins, i) => {
    ins.reads.forEach((r) => {
      const producerBefore = order.slice(0, i).some((p) => p.writes === r);
      const producerAnywhere = PROGRAM.some((p) => p.writes === r);
      if (producerAnywhere && !producerBefore) valid = false;
    });
  });
  return { schedule, bubbles, total, valid };
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Mission (spec + tool checklist mapping to prior units)
// ══════════════════════════════════════════════════════════════════
function Mission() {
  const tools = [
    { t: "Read the 5-stage pipeline", u: "Unit 3.1" },
    { t: "Count cycles & speedup (k + n − 1)", u: "Unit 3.2" },
    { t: "Spot a load-use data hazard (RAW)", u: "Unit 3.3" },
    { t: "Know forwarding can't rescue a load in time", u: "Unit 3.3" },
    { t: "Fill a wasted slot with useful work (delay slot)", u: "Unit 3.4" },
  ];
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Your mission: take a short program the compiler emitted, and <strong style={{ color: C.text }}>reorder its
        instructions</strong> so the pipeline runs with <strong style={{ color: C.green }}>zero stalls</strong> — without
        changing what the program computes. This is exactly what a real compiler's instruction scheduler does. Everything you
        need you already built:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tools.map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
            <span style={{ color: C.green, fontWeight: 800 }}>✓</span>
            <span style={{ color: C.text, fontSize: 13, flex: 1 }}>{x.t}</span>
            <span style={{ color: C.accent, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{x.u}</span>
          </div>
        ))}
      </div>
      <Key color={C.accent}>
        Scheduling changes only the <strong style={{ color: C.text }}>order</strong> of independent instructions — never the
        result. If instruction B needs A's value, A must still come first. The art is finding safe work to slip into the gap.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Problem: the naive order, auto-played, 2 stalls
// ══════════════════════════════════════════════════════════════════
function TheProblem() {
  const naive = analyze(PROGRAM);
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here is the program as written: load R1, use it; load R5, use it. Each <span style={{ color: C.text }}>add/sub</span>
        {" "}reads a register the <span style={{ color: C.teal }}>lw</span> right before it just loaded — a
        {" "}<strong style={{ color: C.red }}>load-use hazard</strong>. Press ▶ and watch two bubbles (○) appear.
      </p>
      <PipelineGrid rows={buildRows(naive.schedule)} totalCycles={naive.total} caption={(clk) =>
        clk === 0 ? "Naive order — press ▶ Run cycles." :
        `Watch rows 2 and 4 slip one cycle right: the bubble (○) is the pipeline waiting for the load. Total: ${naive.total} cycles, ${naive.bubbles} bubbles.`
      } />
      <Key color={C.red}>
        Forwarding already helps every add/sub read an ALU result with no delay — but a <strong style={{ color: C.text }}>load</strong>
        {" "}finishes only after MEM, one stage too late. That's why load-use is the one hazard scheduling has to design around.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Play It: reorder the instructions, watch bubbles vanish
// ══════════════════════════════════════════════════════════════════
function PlayIt() {
  const [order, setOrder] = useState([...PROGRAM]);
  const { schedule, bubbles, total, valid } = analyze(order);

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  };
  const reset = () => setOrder([...PROGRAM]);

  const won = valid && bubbles === 0;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Use ▲▼ to reorder. Keep each <span style={{ color: C.text }}>add/sub</span> after the <span style={{ color: C.teal }}>lw</span>
        {" "}that feeds it (the panel warns you if you break that), and try to reach <strong style={{ color: C.green }}>0 bubbles</strong>.
        Hint: the two loads are independent — what if they went back-to-back first?
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {order.map((ins, i) => (
          <div key={ins.id} style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `1px solid ${ins.isLoad ? C.teal + "55" : C.border}`, borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ color: C.muted, fontSize: 11, width: 16 }}>{i + 1}</span>
            <span style={{ fontFamily: "monospace", fontSize: 13, color: ins.color, flex: 1 }}>{ins.label}</span>
            {ins.isLoad && <span style={{ fontSize: 9.5, color: C.teal, fontWeight: 700 }}>LOAD</span>}
            <button onClick={() => move(i, -1)} disabled={i === 0} style={{ ...btn(i === 0 ? C.surface : C.accentGlow), padding: "4px 10px", opacity: i === 0 ? 0.4 : 1 }}>▲</button>
            <button onClick={() => move(i, 1)} disabled={i === order.length - 1} style={{ ...btn(i === order.length - 1 ? C.surface : C.accentGlow), padding: "4px 10px", opacity: i === order.length - 1 ? 0.4 : 1 }}>▼</button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ padding: "8px 16px", borderRadius: 8, background: bubbles === 0 ? C.green + "22" : C.red + "22", border: `1px solid ${bubbles === 0 ? C.green : C.red}`, color: bubbles === 0 ? C.green : C.red, fontWeight: 800 }}>
          bubbles: {bubbles}
        </div>
        <div style={{ padding: "8px 16px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, color: C.text, fontSize: 13 }}>total: {total} cycles</div>
        {!valid && <div style={{ padding: "8px 16px", borderRadius: 8, background: C.orange + "22", border: `1px solid ${C.orange}`, color: C.orange, fontSize: 12, fontWeight: 700 }}>⚠️ a use now runs before its load — result would be wrong</div>}
        <button onClick={reset} style={btn(C.card, C.muted)}>↺ Reset order</button>
      </div>

      <PipelineGrid key={order.map((o) => o.id).join("")} rows={buildRows(schedule)} totalCycles={total} caption={(clk) => clk === 0 ? "Press ▶ to run your current schedule." : `Your schedule: ${total} cycles, ${bubbles} bubble(s).`} />

      {won && (
        <div style={{ marginTop: 16, padding: 18, borderRadius: 12, background: `linear-gradient(135deg, ${C.green}22, ${C.accent}22)`, border: `1px solid ${C.green}66`, textAlign: "center" }}>
          <div style={{ fontSize: 30 }}>🏆</div>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 15, marginTop: 4 }}>Stall-free schedule found!</div>
          <div style={{ color: C.muted, fontSize: 12.5, marginTop: 6, lineHeight: 1.6 }}>
            Two loads first, then the two ALU ops — each load's value is 2 cycles old by the time it's used, so no bubble.
            Same result, {PROGRAM.length + 4} cycles instead of {analyze(PROGRAM).total}.
          </div>
        </div>
      )}

      <Key color={C.green}>
        You just did compiler-grade instruction scheduling: separate each load from its use by at least one independent
        instruction, and the load-use bubble disappears — for free, with no extra hardware.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Why It Works (the principle + the final schedule)
// ══════════════════════════════════════════════════════════════════
function WhyItWorks() {
  const fixed = analyze([PROGRAM[0], PROGRAM[2], PROGRAM[1], PROGRAM[3]]);
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The stall-free order is <span style={{ fontFamily: "monospace", color: C.text }}>lw R1 · lw R5 · add · sub</span>. The
        loads don't depend on each other, so moving the second load up is always safe — and it buys the exact gap each
        <span style={{ color: C.teal }}> use</span> needed.
      </p>
      <PipelineGrid rows={buildRows(fixed.schedule)} totalCycles={fixed.total} caption={() => `Scheduled order: ${fixed.total} cycles, ${fixed.bubbles} bubbles — every stage packed.`} />
      <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>
        The scheduling rule in one line: <strong style={{ color: C.accent }}>keep every instruction after the ones it depends on,
        and put at least one independent instruction between a load and its first use.</strong> When there's no safe filler, the
        hardware inserts the bubble for you — correctness always wins over speed.
      </div>
      <Key color={C.purple}>
        This closes the loop from Unit 3.2: fewer bubbles means S drops back toward the ideal 1 in T = N·S/R — so smarter
        <strong style={{ color: C.text }}> software</strong> buys real speed on the very same hardware.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, module-complete card
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "Why does a load-use hazard cost a bubble even WITH forwarding?",
      options: [
        "Forwarding is disabled for loads",
        "The loaded value isn't ready until after the MEM stage — one stage too late to forward into the next instruction's EX",
        "Loads take 10 cycles",
        "It doesn't — forwarding removes it completely",
      ],
      answer: 1,
      explain: "An ALU result exists at the end of EX and can be forwarded to the next EX. A loaded value only exists after MEM — one stage later — so the immediately following use still waits one cycle.",
    },
    {
      q: "Reordering lw R1 · add(R1) · lw R5 · sub(R5) into lw R1 · lw R5 · add · sub removes both stalls because…",
      options: [
        "the adds got deleted",
        "each load is now separated from its use by an independent instruction, so its value is ready in time",
        "the clock got faster",
        "loads became ALU operations",
      ],
      answer: 1,
      explain: "Putting an independent instruction between a load and its first use gives the load an extra cycle to finish — exactly the gap the load-use hazard needed.",
    },
    {
      q: "What must instruction scheduling NEVER do?",
      options: [
        "Move an independent instruction earlier",
        "Reorder two loads that don't depend on each other",
        "Move an instruction ahead of one whose result it reads",
        "Leave the total result unchanged",
      ],
      answer: 2,
      explain: "Correctness first: if B reads a value A produces, A must stay before B. Scheduling only rearranges instructions that are independent of each other.",
    },
    {
      q: "Scheduling drops bubbles, so in T = N·S/R it mainly improves…",
      options: ["N (instruction count)", "R (clock rate)", "S (average cycles per instruction)", "nothing"],
      answer: 2,
      explain: "Same instructions (N) and same clock (R); removing stalls lowers the average cycles per instruction S back toward the ideal 1 — a pure software win.",
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
          {score === 4 ? "Perfect! You can schedule instructions to kill stalls like a real compiler." :
            score >= 2 ? "Good work! Replay 'Play It' and settle the load-use rule." :
              "Revisit 'The Problem' — load-use is the one hazard scheduling is built to dodge."}
        </div>
        <div style={{ padding: "20px", borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🏭 Module 3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You turned the CPU into an assembly line, measured its speedup, met every hazard — data, control, structural — and
            learned to schedule around them.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Module 4 — Memory Organization.</strong> The pipeline can now fire an
            instruction every cycle… as long as memory can keep up. Next you'll see how it fakes being fast, big, and cheap all
            at once — the memory hierarchy and the cache.
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
export default function Unit3_C({ student, onUnitComplete }) {
  const sections = [
    { id: "mission", label: "The Mission" },
    { id: "problem", label: "The Problem" },
    { id: "play", label: "Play It: Reorder" },
    { id: "why", label: "Why It Works" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🎯 The Mission — schedule away every stall</h3><Mission /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🐌 The Problem — two load-use bubbles</h3><TheProblem /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🎮 Play It — reorder to 0 bubbles</h3><PlayIt /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>💡 Why It Works — the scheduling rule</h3><WhyItWorks /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to close out Module 3.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏆</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › CAPSTONE</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Schedule to Avoid Stalls</div>
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
