// Unit1_7.jsx — Module 1 › Unit 1.7 — "Instruction Sequencing"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: straight-line (PC += 4) → unconditional branch → conditional branch
// (a loop) → Unit 1 on one map → quiz. This is the LAST unit of Module 1, so
// the completion screen announces "Module 1 Complete" and previews Module 2.
import { useState } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};

function Key({ color = C.purple, children }) {
  return (
    <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
      🔑 {children}
    </div>
  );
}

// Small reusable memory-listing viewer with a PC arrow.
// A row's `asm` is the instruction ONLY (monospace). A human note goes in a
// separate `comment` field, rendered with an explicit "comment" chip and a
// distinct serif-italic font — never glued onto the instruction with a bare ";",
// which students read as part of the code.
function Listing({ rows, pc, done }) {
  return (
    <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "12px 10px" }}>
      {rows.map((r) => {
        const here = r.addr === pc && !done;
        return (
          <div key={r.addr} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 6,
            background: here ? C.accent + "22" : "transparent",
            border: `1px solid ${here ? C.accent : "transparent"}`,
          }}>
            <span style={{ width: 16, color: C.accent }}>{here ? "▶" : ""}</span>
            <span style={{ width: 36, fontFamily: "monospace", fontSize: 12, color: C.muted }}>{r.addr}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flex: 1 }}>
              <span style={{ fontFamily: "monospace", fontSize: 13, color: here ? C.text : C.muted, fontWeight: here ? 700 : 400 }}>{r.asm}</span>
              {r.comment && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 8, letterSpacing: 0.6, textTransform: "uppercase", color: C.green, border: `1px solid ${C.green}66`, background: C.green + "14", borderRadius: 4, padding: "1px 5px", fontFamily: "'Segoe UI', sans-serif" }}>comment</span>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontSize: 12.5, color: C.green }}>{r.comment}</span>
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Straight-Line Sequencing (just keep adding to the PC)
// ══════════════════════════════════════════════════════════════════
function StraightLine() {
  const rows = [
    { addr: 100, asm: "Load  R2, A" },
    { addr: 104, asm: "Load  R3, B" },
    { addr: 108, asm: "Add   R4, R2, R3" },
    { addr: 112, asm: "Store R4, C" },
  ];
  const [step, setStep] = useState(0); // 0..4 (4 = done)
  const pc = 100 + step * 4;
  const done = step >= rows.length;

  const regFor = (s) => {
    const r = { R2: "–", R3: "–", R4: "–", C: "–" };
    if (s >= 1) r.R2 = "5";
    if (s >= 2) r.R3 = "3";
    if (s >= 3) r.R4 = "8";
    if (s >= 4) r.C = "8";
    return r;
  };
  const reg = regFor(step);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Who decides what runs next? The <strong style={{ color: C.accent }}>Program Counter</strong>. By default it just
        adds the word length (4 bytes) after each fetch — so instructions run top to bottom. Step through our
        <code style={{ color: C.teal }}> C = A + B</code> program and watch the PC climb.
      </p>

      <Listing rows={rows} pc={pc} done={done} />

      <div style={{ display: "flex", gap: 10, margin: "12px 0", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 120, padding: "10px 12px", borderRadius: 8, background: C.accent + "12", border: `1px solid ${C.accent}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>PC (next to fetch)</div>
          <div style={{ color: C.text, fontFamily: "monospace", fontSize: 22, fontWeight: 800 }}>{done ? "—" : pc}</div>
        </div>
        <div style={{ flex: 2, minWidth: 180, padding: "10px 12px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          {Object.entries(reg).map(([k, v]) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.teal }}>{k}</div>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: v === "–" ? C.muted : C.text, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setStep((s) => Math.min(rows.length, s + 1))} disabled={done} style={{
          flex: 1, padding: "10px", borderRadius: 8, cursor: done ? "default" : "pointer", fontSize: 13, fontWeight: 600,
          background: done ? C.card : C.accentGlow, border: "none", color: done ? C.muted : "#fff",
        }}>{done ? "Program finished — C = 8 ✓" : `Fetch & run  →  then PC += 4`}</button>
        <button onClick={() => setStep(0)} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 12 }}>↺</button>
      </div>

      <Key>
        <strong style={{ color: C.text }}>Straight-line sequencing:</strong> after each fetch, PC ← PC + 4. No decisions,
        no jumps — the machine walks straight down memory. That's the default rhythm of every program.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Unconditional Branch (a forced jump)
// ══════════════════════════════════════════════════════════════════
function Unconditional() {
  const rows = [
    { addr: 100, asm: "Load  R2, A" },
    { addr: 104, asm: "Jump  200", jump: 200 },
    { addr: 108, asm: "Add   R4, R2, R3", skipped: true },
    { addr: 112, asm: "Store R4, C", skipped: true },
    { addr: 200, asm: "…continue here" },
  ];
  // execution order of PC values
  const path = [100, 104, 200];
  const [i, setI] = useState(0);
  const done = i >= path.length;
  const pc = done ? -1 : path[i];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A <strong style={{ color: C.purple }}>branch</strong> (jump) breaks the straight line: instead of PC + 4, it
        <em> loads a brand-new address into the PC</em>. An <strong>unconditional</strong> branch always takes it. Step
        and watch 108 &amp; 112 get skipped.
      </p>

      <Listing rows={rows} pc={pc} done={done} />

      <div style={{ margin: "12px 0", padding: "10px 12px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, minHeight: 40, lineHeight: 1.6 }}>
        {done ? (
          <span style={{ color: C.green }}>Done. Notice 108 and 112 never ran — the jump leapt over them.</span>
        ) : pc === 104 ? (
          <span><code style={{ color: C.purple }}>Jump 200</code>: PC ← 200 (not 108!). The next fetch will be at 200.</span>
        ) : (
          <span>PC = {pc}. Straight-line so far…</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setI((v) => Math.min(path.length, v + 1))} disabled={done} style={{
          flex: 1, padding: "10px", borderRadius: 8, cursor: done ? "default" : "pointer", fontSize: 13, fontWeight: 600,
          background: done ? C.card : C.accentGlow, border: "none", color: done ? C.muted : "#fff",
        }}>{done ? "Finished" : "Fetch & run →"}</button>
        <button onClick={() => setI(0)} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 12 }}>↺</button>
      </div>

      <Key color={C.purple}>
        Branch = <strong style={{ color: C.text }}>PC ← target address</strong>. An unconditional branch is a one-way
        detour taken every time — the basis of skipping code and calling routines.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Conditional Branch (a loop)
// ══════════════════════════════════════════════════════════════════
function Conditional() {
  const rows = [
    { addr: 200, asm: "Load  R1, #3", comment: "set the counter to 3" },
    { addr: 204, asm: "Sub   R1, R1, #1", loopBody: true },
    { addr: 208, asm: "Branch>0  204", comment: "if R1 > 0, loop back to 204", loopBody: true },
    { addr: 212, asm: "Store R1, RESULT" },
  ];

  // simulate the loop as a list of (pc, R1) states
  const trace = [];
  let r1 = null;
  trace.push({ pc: 200, r1: "–" });
  r1 = 3; trace.push({ pc: 204, r1 });      // about to run Sub? we show state as we ARRIVE
  // build proper step trace
  const steps = [];
  steps.push({ pc: 200, r1: "–", msg: "Load counter" });
  r1 = 3;
  let guard = 0;
  let pc = 204;
  while (guard++ < 12) {
    steps.push({ pc: 204, r1, msg: "R1 ← R1 − 1" });
    r1 = r1 - 1;
    steps.push({ pc: 208, r1, msg: r1 > 0 ? `R1=${r1} > 0 → branch back to 204` : `R1=${r1}, not > 0 → fall through` });
    if (r1 > 0) { pc = 204; continue; }
    break;
  }
  steps.push({ pc: 212, r1, msg: "Store result" });
  steps.push({ pc: -1, r1, msg: "Done — loop ran 3 times" });

  const [i, setI] = useState(0);
  const cur = steps[Math.min(i, steps.length - 1)];
  const done = cur.pc === -1;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A <strong style={{ color: C.orange }}>conditional</strong> branch only jumps if a test passes — that's how loops
        exist. This one counts <code style={{ color: C.teal }}>R1</code> down from 3 and branches back while R1 &gt; 0.
        Step and watch it circle.
      </p>

      <p style={{ color: C.muted, fontSize: 12, marginBottom: 12, lineHeight: 1.6, background: C.green + "10", border: `1px solid ${C.green}33`, borderRadius: 8, padding: "8px 12px" }}>
        📝 Anything tagged <span style={{ fontSize: 8, letterSpacing: 0.6, textTransform: "uppercase", color: C.green, border: `1px solid ${C.green}66`, background: C.green + "14", borderRadius: 4, padding: "1px 5px" }}>comment</span>{" "}
        <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: C.green }}>in this italic font</span> is a note for
        humans — the CPU ignores it. It is <strong style={{ color: C.text }}>not</strong> part of the instruction.
      </p>

      <Listing rows={rows} pc={cur.pc} done={done} />

      <div style={{ display: "flex", gap: 10, margin: "12px 0", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 110, padding: "10px 12px", borderRadius: 8, background: C.teal + "12", border: `1px solid ${C.teal}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>R1 (counter)</div>
          <div style={{ color: C.text, fontFamily: "monospace", fontSize: 22, fontWeight: 800 }}>{cur.r1}</div>
        </div>
        <div style={{ flex: 2, minWidth: 180, padding: "10px 12px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, display: "flex", alignItems: "center", lineHeight: 1.5 }}>
          {cur.msg}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))} disabled={done} style={{
          flex: 1, padding: "10px", borderRadius: 8, cursor: done ? "default" : "pointer", fontSize: 13, fontWeight: 600,
          background: done ? C.card : C.accentGlow, border: "none", color: done ? C.muted : "#fff",
        }}>{done ? "Loop finished ✓" : "Step →"}</button>
        <button onClick={() => setI(0)} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 12 }}>↺</button>
      </div>

      <Key color={C.orange}>
        Conditional branch = <strong style={{ color: C.text }}>PC ← target only if the test is true</strong>, else PC + 4.
        Loop back while a condition holds, fall through when it fails — that single idea gives you every loop and every
        <em>if</em>.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Unit 1 on One Map (module recap)
// ══════════════════════════════════════════════════════════════════
function UnitMap() {
  const nodes = [
    { n: "1 · Five Units", color: C.teal, body: "Input, Memory, ALU, Output, Control — the whole skeleton (Unit 1.1)." },
    { n: "2 · Operation", color: C.accent, body: "Stored program; PC/IR/MAR/MDR; fetch–decode–execute (Unit 1.2)." },
    { n: "3 · Buses", color: C.green, body: "One shared highway vs many; address/data/control (Unit 1.3)." },
    { n: "4 · Addresses", color: C.purple, body: "Bit·byte·word, byte-addressable memory, endianness (Unit 1.4)." },
    { n: "5 · Instructions", color: C.orange, body: "Read/Write, RTN vs assembly, RISC vs CISC (Unit 1.5)." },
    { n: "6 · Addressing modes", color: C.red, body: "Immediate, register, direct, indirect, index, autoinc/dec, relative (Unit 1.6)." },
    { n: "7 · Sequencing", color: C.yellow, body: "PC += 4, unconditional & conditional branches (this unit)." },
  ];
  const [sel, setSel] = useState(0);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Seven stops, one machine. Click each to see how it feeds the next — from bare parts to a program that steers
        itself.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
        {nodes.map((nd, i) => (
          <button key={i} onClick={() => setSel(i)} style={{
            padding: "12px 8px", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700,
            border: `1px solid ${sel === i ? nd.color : C.border}`,
            background: sel === i ? nd.color + "22" : C.card,
            color: sel === i ? nd.color : C.muted,
          }}>{nd.n}</button>
        ))}
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 10, background: nodes[sel].color + "12", border: `1px solid ${nodes[sel].color}44`, minHeight: 60 }}>
        <div style={{ color: nodes[sel].color, fontWeight: 700, fontSize: 14 }}>{nodes[sel].n}</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{nodes[sel].body}</div>
      </div>

      <Key color={C.yellow}>
        You started with five inert boxes and ended with a program that fetches, computes, and branches on its own. That
        is the entire <strong style={{ color: C.text }}>basic structure of a computer</strong> — the foundation everything
        in Modules 2–5 builds on.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "In straight-line sequencing, what happens to the PC after each instruction is fetched?",
      options: [
        "It stays the same until a branch",
        "It is incremented to point at the next instruction (PC ← PC + word length)",
        "It is reset to 0",
        "It copies the address of the previous instruction",
      ],
      answer: 1,
      explain: "Straight-line = PC ← PC + 4 (one word) after each fetch, so execution walks down memory in order until something changes the PC.",
    },
    {
      q: "What does a branch instruction fundamentally do?",
      options: [
        "Adds two registers",
        "Loads a new address into the PC, redirecting what runs next",
        "Copies memory into MDR",
        "Increments the counter register",
      ],
      answer: 1,
      explain: "A branch overwrites the PC with a target address. The next fetch then comes from there instead of PC + 4 — that's how execution changes course.",
    },
    {
      q: "What is the difference between an unconditional and a conditional branch?",
      options: [
        "Unconditional is faster hardware",
        "Unconditional always jumps; conditional jumps only if a test is true, else falls through",
        "Conditional cannot be used in loops",
        "They are the same thing",
      ],
      answer: 1,
      explain: "Unconditional branches always redirect the PC. Conditional branches redirect only when their test passes — which is exactly what makes loops and if-statements possible.",
    },
    {
      q: "Why is the conditional branch the key to writing a loop?",
      options: [
        "It makes the ALU faster",
        "It lets the program jump BACK to an earlier instruction while a condition still holds",
        "It stores the result in memory",
        "It doubles the word length",
      ],
      answer: 1,
      explain: "By branching back to the loop's start while (say) a counter is still > 0, the same instructions run again and again — a loop — until the condition fails and the PC falls through.",
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
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🏆" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Perfect! You can trace straight-line flow, jumps, and loops by hand." :
            score >= 2 ? "Good work! Re-run the conditional-branch loop — watch WHEN the PC jumps back vs falls through." :
              "Revisit 'Straight-Line' and the two branch widgets, then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.green}22, ${C.accentGlow}22)`,
          border: `1px solid ${C.green}66`,
        }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>🎉 Module 1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've assembled the whole <strong style={{ color: C.text }}>basic structure of a computer</strong>: five units,
            operational concepts, buses, addresses, instructions, addressing modes, and now the sequencing that ties them
            into a running program.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Module 2 — Inside the Processor.</strong>{" "}
            We crack open the CPU and follow a single instruction through the datapath, one clock tick at a time —
            starting with Register Transfers (RTL).
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
          const isAns = i === q.answer;
          const isPick = i === selected;
          let bg = "transparent", bd = C.border, col = C.text;
          if (selected !== null) {
            if (isAns) { bg = C.green + "22"; bd = C.green; col = C.green; }
            else if (isPick) { bg = C.red + "22"; bd = C.red; col = C.red; }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={selected !== null} style={{
              textAlign: "left", padding: "11px 14px", borderRadius: 8,
              background: bg, border: `1px solid ${bd}`, color: col,
              cursor: selected === null ? "pointer" : "default", fontSize: 13.5, lineHeight: 1.5,
            }}>{opt}{selected !== null && isAns ? "  ✓" : ""}</button>
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
//  Main
// ══════════════════════════════════════════════════════════════════
export default function Unit1_7({ student, onUnitComplete }) {
  const sections = [
    { id: "straight", label: "Straight-Line" },
    { id: "uncond", label: "Branch" },
    { id: "cond", label: "Loop" },
    { id: "map", label: "Unit 1 Map" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⬇️ Straight-Line Sequencing — just keep adding to the PC</h3>
      <StraightLine />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>↪️ Unconditional Branch — a forced jump</h3>
      <Unconditional />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔁 Conditional Branch — how a loop is born</h3>
      <Conditional />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗺️ Unit 1 on One Map — the whole module at a glance</h3>
      <UnitMap />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to finish Unit 1.7 — and Module 1.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.7</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Instruction Sequencing</div>
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
