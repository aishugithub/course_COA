// Unit5_4.jsx — Module 5 › Unit 5.4 — "Direct Memory Access & Bus Arbitration"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: even interrupts cost per-word overhead — too slow for a whole block
// (need) -> the DMA controller's registers (anatomy) -> a block transfer with
// the CPU interrupted only once (trace) -> cycle-stealing vs burst + bus
// arbitration (BR/BG, priority) -> quiz. Builds on Unit 5.2 interrupts.
import { useState } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};
function Key({ color = C.purple, children }) { return <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>🔑 {children}</div>; }
function Frame({ children }) { return <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>{children}</p>; }
const box = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 };
function btn(active, color) { return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? color : C.border}`, background: active ? color : "transparent", color: active ? "#fff" : C.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }; }

// ── Section 1: Need — interrupt count explodes with block size ──
function NeedWidget() {
  const [words, setWords] = useState(256);
  return (
    <div>
      <Frame>Interrupt-driven I/O still moves data <b>one word at a time through the CPU</b>. Drag the block
      size: interrupt-driven I/O interrupts the CPU once <i>per word</i>, while DMA interrupts it <b>once</b>
      for the whole block.</Frame>
      <label style={{ color: C.muted, fontSize: 12 }}>block size = <strong style={{ color: C.accent }}>{words}</strong> words</label>
      <input type="range" min={4} max={4096} step={4} value={words} onChange={(e) => setWords(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
        <div style={{ ...box, borderColor: C.red + "55", textAlign: "center" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>❌ INTERRUPT-DRIVEN</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.red }}>{words.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: C.muted }}>CPU interruptions (one per word)</div>
        </div>
        <div style={{ ...box, borderColor: C.green + "55", textAlign: "center" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ DMA</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.green }}>1</div>
          <div style={{ fontSize: 11, color: C.muted }}>CPU interruption (at completion)</div>
        </div>
      </div>
      <Key color={C.green}><b>Direct Memory Access (DMA)</b> hands the whole block to a dedicated
      <b> DMA controller</b> that moves data straight between memory and the device. The CPU only sets it up
      and gets one interrupt when it's done.</Key>
    </div>
  );
}

// ── Section 2: Anatomy — the DMA controller registers ──
function RegWidget() {
  const regs = [
    { k: "Starting address", col: C.accent, d: "Where in main memory the block begins. The controller increments this itself for each word." },
    { k: "Word count", col: C.teal, d: "How many words to move. The controller decrements it and stops when it hits zero." },
    { k: "R/W̄ bit", col: C.purple, d: "Direction: 1 = read (memory → device), 0 = write (device → memory). Set by the CPU at setup." },
    { k: "Done / IE / IRQ", col: C.green, d: "Status bits: Done set when finished; IE enables the completion interrupt; IRQ set when that interrupt is raised." },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div>
      <Frame>To start a transfer, an OS routine writes a few registers in the DMA controller, then steps
      back. Click each register.</Frame>
      <div style={{ ...box, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 10.5, color: C.muted, marginBottom: 4 }}><span>31</span><span>30</span><span>… bits …</span><span>1</span><span>0</span></div>
        <div style={{ display: "flex", gap: 4 }}>
          {["IRQ", "IE", "status", "Done", "R/W̄"].map((b, i) => (
            <div key={i} style={{ flex: b === "status" ? 4 : 1, textAlign: "center", padding: "8px 2px", borderRadius: 5, fontSize: 10.5, background: C.bg, border: `1px solid ${C.border}`, color: C.muted }}>{b}</div>
          ))}
        </div>
        <div style={{ textAlign: "right", fontSize: 10.5, color: C.muted, marginTop: 2 }}>status &amp; control register</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {regs.map((r, i) => <button key={i} onClick={() => setSel(i)} style={btn(sel === i, r.col)}>{r.k}</button>)}
      </div>
      <div style={{ ...box, borderColor: regs[sel].col + "66" }}>
        <div style={{ color: regs[sel].col, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{regs[sel].k}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{regs[sel].d}</div>
      </div>
      <Key>Three registers — starting address, word count, and a status/control word — are all the CPU writes
      to launch a transfer of thousands of words.</Key>
    </div>
  );
}

// ── Section 3: DMA transfer trace ──
function TraceWidget() {
  const total = 4;
  const [i, setI] = useState(0); // words transferred
  const addr = 0x2000 + i * 4;
  const remaining = total - i;
  const done = i >= total;
  return (
    <div>
      <Frame>Watch the controller move a 4-word block. Each step: it drives the address, transfers one word,
      bumps the address, and counts down. Only at the end does it interrupt the CPU.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <Stat label="Memory address" val={"0x" + addr.toString(16).toUpperCase()} col={C.accent} mono />
        <Stat label="Words remaining" val={remaining} col={remaining === 0 ? C.green : C.teal} />
        <Stat label="Done flag" val={done ? "1" : "0"} col={done ? C.green : C.muted} />
      </div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 10 }}>
        {Array.from({ length: total }).map((_, k) => (
          <div key={k} style={{ width: 42, height: 30, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: "monospace", color: k < i ? "#fff" : C.muted, background: k < i ? C.green + "cc" : k === i && !done ? C.accentGlow : C.card, border: `1px solid ${C.border}` }}>W{k}</div>
        ))}
      </div>
      <div style={{ fontSize: 12.5, color: done ? C.green : C.muted, minHeight: 20, textAlign: "center" }}>
        {done ? "✓ Word count = 0 → Done set, IRQ raised → the CPU gets its single interrupt." : `Transferring word W${i} to 0x${addr.toString(16).toUpperCase()} — the CPU is free to run other code.`}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => setI((x) => Math.min(total, x + 1))} style={btn(true, C.accentGlow)}>Transfer word ▶</button>
        <button onClick={() => setI(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.teal}>The controller does exactly the bookkeeping the CPU would have done — supply the address,
      generate control signals, increment, count — but without running any program. The CPU is interrupted
      <b> once</b>, not once per word.</Key>
    </div>
  );
}
function Stat({ label, val, col, mono }) {
  return (
    <div style={{ ...box, textAlign: "center", padding: 12 }}>
      <div style={{ fontSize: 10.5, color: C.muted }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: col, fontFamily: mono ? "monospace" : "inherit", marginTop: 4 }}>{val}</div>
    </div>
  );
}

// ── Section 4: Arbitration + cycle stealing vs burst ──
function ArbWidget() {
  const [mode, setMode] = useState("steal");
  // Timeline of 12 bus cycles: who owns the bus?
  const steal = ["P", "D", "P", "D", "P", "D", "P", "D", "P", "D", "P", "D"];
  const burst = ["P", "P", "D", "D", "D", "D", "D", "D", "D", "D", "P", "P"];
  const tl = mode === "steal" ? steal : burst;
  return (
    <div>
      <Frame>Both the CPU and the DMA controller need the one memory bus, so a <b>bus arbiter</b> decides who
      drives it. Toggle how DMA takes its turns.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("steal")} style={btn(mode === "steal", C.teal)}>Cycle stealing</button>
        <button onClick={() => setMode("burst")} style={btn(mode === "burst", C.orange)}>Burst mode</button>
      </div>
      <div style={{ ...box, marginBottom: 8 }}>
        <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 6 }}>bus owner, cycle by cycle →</div>
        <div style={{ display: "flex", gap: 3 }}>
          {tl.map((who, i) => (
            <div key={i} style={{ flex: 1, height: 30, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", background: who === "P" ? C.accentGlow : C.orange }}>{who}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 11 }}>
          <span style={{ color: C.accent }}>■ P = processor</span><span style={{ color: C.orange }}>■ D = DMA</span>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: C.muted }}>
        {mode === "steal" ? "Cycle stealing: DMA grabs the occasional cycle; the CPU keeps running, only slightly slowed."
          : "Burst mode: DMA holds the bus for the whole block — fastest for the transfer, but the CPU stalls meanwhile."}
      </div>
      <div style={{ ...box, marginTop: 12 }}>
        <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 6 }}>How the DMA controller <i>gets</i> the bus — centralized arbitration:</div>
        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 12, color: C.text, lineHeight: 1.7 }}>{`DMA raises Bus-Request (BR)  →  arbiter
arbiter answers Bus-Grant (BG)  →  DMA becomes bus master
DMA finishes, drops BR  →  arbiter drops BG`}</pre>
      </div>
      <Key color={C.orange}>Any unit that can drive the bus is a <b>bus master</b>. <b>Centralized</b> arbitration uses one
      arbiter with BR/BG lines and priorities; <b>distributed</b> arbitration lets masters decide among
      themselves. Fairness matters — no master may be starved forever.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "Why is DMA preferred over interrupt-driven I/O for a large disk block?",
      options: ["It uses less memory", "It moves the whole block without per-word CPU involvement, interrupting once at the end", "It needs no bus", "It is easier to program"],
      answer: 1, explain: "The DMA controller moves every word itself; the CPU sets up once and is interrupted only when the block is complete." },
    { q: "What three things does the CPU write to start a DMA transfer?",
      options: ["Opcode, operand, result", "Starting address, word count, and direction", "Cache tag, index, offset", "PC, PS, stack pointer"],
      answer: 1, explain: "The starting memory address, the number of words, and the R/W̄ direction bit are loaded into the controller's registers." },
    { q: "In cycle stealing, what happens to the processor during a DMA transfer?",
      options: ["It halts completely until done", "It keeps running, only slightly slowed as DMA takes occasional bus cycles", "It loses its registers", "It reboots"],
      answer: 1, explain: "Cycle stealing grabs the odd bus cycle; the CPU runs between them and is only mildly slowed — unlike burst mode, which holds the bus." },
    { q: "Why does DMA make bus arbitration necessary?",
      options: ["Because DMA is slow", "Because the DMA controller and the processor both need the single memory bus", "Because interrupts are disabled", "Because memory is read-only"],
      answer: 1, explain: "Both are potential bus masters contending for one shared bus, so an arbiter must decide who drives it, using Bus-Request/Bus-Grant lines." },
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
          {score === 4 ? "Excellent — DMA and arbitration are yours." : score >= 2 ? "Good. Replay 'Cycle Stealing vs Burst' to lock in bus sharing." : "Revisit 'The Registers' and 'Transfer Trace' — they are the core."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can set up a DMA transfer and explain how the bus is shared and arbitrated.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.5 — Synchronous vs Asynchronous Buses.</strong>
            We've been saying "the bus" — now see the exact timing rules that move a word across it.
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
          if (selected !== null) { if (i === q.answer) { bg = C.green + "22"; border = C.green; col = C.green; } else if (i === selected) { bg = C.red + "22"; border = C.red; col = C.red; } }
          return <button key={i} onClick={() => choose(i)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: 8, background: bg, border: `1.5px solid ${border}`, color: col, cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s" }}>{i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}</button>;
        })}
      </div>
      {selected !== null && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.purple + "18", border: `1px solid ${C.purple}44`, color: C.muted, fontSize: 13 }}>💡 {q.explain}</div>}
      {selected !== null && <button onClick={next} style={{ marginTop: 14, padding: "10px 24px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>}
    </div>
  );
}

export default function Unit5_4({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "regs", label: "Registers" },
    { id: "trace", label: "Transfer" },
    { id: "arb", label: "Arbitration" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>One word at a time is too slow for a block</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The DMA controller's registers</h3><RegWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>A block transfer, step by step</h3><TraceWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Sharing the bus: cycle stealing, burst & arbitration</h3><ArbWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.4.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔌</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Direct Memory Access &amp; Bus Arbitration</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>{completed.length} / {sections.length} done</div>
      </div>
      <div style={{ height: 3, background: C.border }}>
        <div style={{ height: "100%", width: `${(completed.length / sections.length) * 100}%`, background: C.green, transition: "width 0.4s ease" }} />
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: C.surface, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          {sections.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)} style={{ flex: 1, minWidth: 72, padding: "8px 6px", borderRadius: 7, background: activeSection === i ? C.accentGlow : "transparent", border: "none", color: activeSection === i ? "#fff" : C.muted, cursor: "pointer", fontSize: 11, fontWeight: activeSection === i ? 600 : 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s" }}>
              {completed.includes(i) && <span style={{ color: C.green }}>✓</span>}{s.label}
            </button>
          ))}
        </div>
        <div style={{ background: C.surface, borderRadius: 12, padding: "24px 20px", border: `1px solid ${C.border}`, minHeight: 300 }}>{content[activeSection]}</div>
        {activeSection < sections.length - 1 && (
          <button onClick={goNext} style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mark Complete & Continue →</button>
        )}
      </div>
    </div>
  );
}
