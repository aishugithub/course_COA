// Unit5_2.jsx — Module 5 › Unit 5.2 — "Interrupts"
// Foothold formula: dark palette, free-nav tabs, one interactive widget per
// section, 🔑 callouts, 4-question quiz.
// Arc: polling wastes the CPU (Unit 5.1) -> let the device raise an interrupt,
// jump to an ISR, return (transfer of control) -> enable/disable & the auto-
// clear of IE that stops an infinite re-interrupt -> handling many devices
// (polling vs vectored, priority & nesting, daisy chain) -> quiz.
import { useState } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};
function Key({ color = C.purple, children }) {
  return <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>🔑 {children}</div>;
}
function Frame({ children }) { return <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>{children}</p>; }
const box = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 };
function btn(active, color) { return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? color : C.border}`, background: active ? color : "transparent", color: active ? "#fff" : C.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }; }

// ── Section 1: Need — polling vs interrupt, CPU time wasted ──
function NeedWidget() {
  const [idle, setIdle] = useState(60); // % of time device is not ready
  const wasted = idle;                  // polling burns the whole idle window
  const useful = 100 - idle;
  return (
    <div>
      <Frame>
        A device is ready only some of the time. Drag the slider: the longer it makes the CPU wait,
        the more of the CPU <b>polling</b> throws away — while <b>interrupts</b> keep it productive the
        whole time.
      </Frame>
      <label style={{ color: C.muted, fontSize: 12 }}>Device is NOT ready <strong style={{ color: C.accent }}>{idle}%</strong> of the time</label>
      <input type="range" min={0} max={95} value={idle} onChange={(e) => setIdle(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
        <div style={{ ...box, borderColor: C.red + "55" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>❌ POLLING</div>
          <Bar pct={wasted} col={C.red} label="wasted in wait-loop" />
          <Bar pct={useful} col={C.green} label="useful work" />
          <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>{wasted}% of the CPU spent asking “ready yet?”.</div>
        </div>
        <div style={{ ...box, borderColor: C.green + "55" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ INTERRUPTS</div>
          <Bar pct={0.5} col={C.red} label="tiny ISR overhead" />
          <Bar pct={100} col={C.green} label="useful work" />
          <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>CPU works until the device taps it — near 0% wasted.</div>
        </div>
      </div>
      <Key color={C.green}>An <b>interrupt request (IRQ)</b> is a hardware signal the device raises when it's ready.
      The processor stops asking and starts doing useful work; the device calls it only when there's
      actually something to do.</Key>
    </div>
  );
}
function Bar({ pct, col, label }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 2 }}>{label}</div>
      <div style={{ height: 9, borderRadius: 5, background: C.bg, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.max(1, Math.min(100, pct))}%`, background: col, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

// ── Section 2: Trace — transfer of control ──
function TraceWidget() {
  const steps = [
    { run: "MAIN", pc: "i", save: false, note: "MAIN program runs normally, instruction by instruction." },
    { run: "MAIN", pc: "i", save: false, irq: true, note: "⚡ Device raises IRQ during instruction i. The CPU finishes i first." },
    { run: "→ISR", pc: "i+1", save: true, note: "Save PC (=i+1) and the status register PS, so we can come back." },
    { run: "ISR", pc: "isr", note: "Jump to the Interrupt-Service Routine. Service the device." },
    { run: "ISR", pc: "isr", note: "Device is told 'request seen', so it drops its IRQ line." },
    { run: "←MAIN", pc: "i+1", restore: true, note: "Return-from-interrupt restores saved PC and PS." },
    { run: "MAIN", pc: "i+1", note: "MAIN resumes at i+1 — as if nothing happened, only a little later." },
  ];
  const [s, setS] = useState(0);
  const st = steps[Math.min(s, steps.length - 1)];
  return (
    <div>
      <Frame>An interrupt is like a subroutine call the program never asked for. Step through it and watch
      the <b>PC</b> get parked and restored.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ ...box, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted }}>Currently running</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: st.run.includes("ISR") ? C.orange : C.green, margin: "6px 0" }}>{st.run}</div>
          {st.irq && <div style={{ fontSize: 12, color: C.red, fontWeight: 700 }}>IRQ ⚡</div>}
        </div>
        <div style={{ ...box, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted }}>Program Counter</div>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: C.accent, margin: "6px 0" }}>{st.pc}</div>
          <div style={{ fontSize: 11, color: st.save ? C.yellow : st.restore ? C.teal : C.muted }}>
            {st.save ? "saving PC + PS" : st.restore ? "restoring PC + PS" : " "}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, minHeight: 34 }}>{st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setS((x) => Math.min(steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Step ▶ ({Math.min(s + 1, steps.length)}/{steps.length})</button>
        <button onClick={() => setS(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key>Only the <b>PC</b> and <b>PS</b> are saved automatically — the minimum to return safely. The delay
      from IRQ to the first ISR instruction is the <b>interrupt latency</b>.</Key>
    </div>
  );
}

// ── Section 3: Broken toggle — IE and the infinite re-interrupt ──
function EnableWidget() {
  const [safe, setSafe] = useState(true);
  return (
    <div>
      <Frame>The device keeps its IRQ line high until the ISR services it. If interrupts stay enabled, the
      same request fires <i>again</i> the instant the ISR starts. Toggle the fix.</Frame>
      <button onClick={() => setSafe((v) => !v)} style={{ ...btn(true, safe ? C.green : C.red), marginBottom: 12 }}>
        {safe ? "◀ IE auto-cleared on entry (safe)" : "▶ What if IE stays 1 in the ISR?"}
      </button>
      {safe ? (
        <div style={{ ...box, borderColor: C.green + "55" }}>
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>{`accept IRQ  → save PC, PS
            → clear IE   ; further interrupts OFF
ISR runs    → service device (IRQ drops)
Return-from-interrupt → restore PS
            → IE = 1 again  ; interrupts back ON`}</pre>
          <div style={{ color: C.green, fontSize: 12.5, marginTop: 10 }}>✓ The ISR runs to completion exactly once, then interrupts resume.</div>
        </div>
      ) : (
        <div style={{ ...box, borderColor: C.red + "66" }}>
          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>{`accept IRQ  → save PC, PS   (IE still 1)
ISR starts  → IRQ line STILL high...
            → accept IRQ AGAIN → save...
            → accept IRQ AGAIN → save...
            → accept IRQ AGAIN → ...`}</pre>
          <div style={{ color: C.red, fontSize: 12.5, marginTop: 10 }}>⚠️ Infinite re-interruption — the stack fills and the system never makes progress.</div>
        </div>
      )}
      <Key color={safe ? C.teal : C.red}>The processor <b>automatically clears the IE bit</b> in the status
      register when it accepts an interrupt, and restores it on Return-from-interrupt. Two ends control
      interrupts: the processor's <code>IE</code> bit and each device's own enable bit.</Key>
    </div>
  );
}

// ── Section 4: Handling multiple devices — polling vs vectored + priority ──
function MultiWidget() {
  const [mode, setMode] = useState("vectored");
  const devices = ["Timer", "Keyboard", "Disk", "Network"];
  const [requester] = useState(2); // Disk is requesting
  return (
    <div>
      <Frame>Many devices, one processor. Two questions: <b>which</b> device interrupted, and <b>where</b>
      is its service routine? Compare the two ways to answer.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setMode("polling")} style={btn(mode === "polling", C.orange)}>Polling</button>
        <button onClick={() => setMode("vectored")} style={btn(mode === "vectored", C.green)}>Vectored</button>
      </div>
      <div style={{ ...box }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{devices[requester]} raises an interrupt. How does the CPU find its ISR?</div>
        {mode === "polling" ? (
          <div>
            {devices.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 6, marginBottom: 3, background: i <= requester ? C.card : "transparent", border: `1px solid ${i === requester ? C.green : C.border}` }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: C.muted }}>check IRQ bit →</span>
                <span style={{ color: i === requester ? C.green : C.text, fontSize: 12.5 }}>{d}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: i < requester ? C.red : i === requester ? C.green : C.muted }}>
                  {i < requester ? "0 (skip)" : i === requester ? "1 ✓ found!" : "not reached"}
                </span>
              </div>
            ))}
            <div style={{ color: C.orange, fontSize: 12, marginTop: 8 }}>The ISR scans every device in software until it finds IRQ=1. Simple, but slow.</div>
          </div>
        ) : (
          <div>
            <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 12, color: C.text, lineHeight: 1.7 }}>{`${devices[requester]} sends its vector code = ${requester}
        │
        ▼   index into the interrupt-vector table
vector_table[${requester}] = 0x${(0x2000 + requester * 4).toString(16).toUpperCase()}  →  load into PC`}</pre>
            <div style={{ color: C.green, fontSize: 12, marginTop: 8 }}>The device names itself; the CPU jumps straight to the right ISR. No scanning.</div>
          </div>
        )}
      </div>
      <Key color={C.teal}>Two more ideas ride on top: <b>priority</b> — the CPU accepts a request only from a
      device of higher priority than the routine it's running, letting an urgent interrupt <b>nest</b> inside
      a lower one; and <b>daisy-chaining</b> — devices share one line and the acknowledge signal ripples down
      the chain, so the first device with a pending request wins (position = priority).</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "What does a device do to get serviced without the CPU polling it?",
      options: ["Writes to the program counter", "Raises an interrupt-request (IRQ) signal", "Clears main memory", "Increases the clock speed"],
      answer: 1, explain: "The device raises an IRQ; the processor suspends its program and runs the interrupt-service routine." },
    { q: "What does the processor save automatically when it accepts an interrupt?",
      options: ["All general registers", "The whole cache", "The program counter (PC) and status register (PS)", "Nothing at all"],
      answer: 2, explain: "Only PC and PS are saved automatically — the minimum needed to return; anything else is saved by the ISR itself." },
    { q: "Why is the IE bit automatically cleared when an interrupt is accepted?",
      options: ["To speed up the ISR", "To stop the still-active request from re-interrupting endlessly", "To save power", "To erase the vector table"],
      answer: 1, explain: "The device holds its IRQ high until serviced; without clearing IE the same request would re-interrupt immediately and loop forever." },
    { q: "How do vectored interrupts beat polling for identifying a device?",
      options: ["They disable all devices", "The device sends a code that indexes the vector table, so the CPU jumps straight to the ISR", "They use DMA", "They poll faster"],
      answer: 1, explain: "The requesting device identifies itself with a vector; the CPU indexes the interrupt-vector table and enters the correct ISR without scanning." },
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
          {score === 4 ? "Excellent — you own the interrupt cycle." : score >= 2 ? "Good. Replay 'Enable/Disable' for the IE auto-clear." : "Revisit 'Transfer of Control' and 'Enable/Disable' — they are the core."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can trace an interrupt end to end, keep it from looping, and route many devices to the
            right ISR.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.3 — Exceptions & Interrupts in the OS.</strong>
            The same hardware handles divide-by-zero, system calls, and the timer that runs multitasking.
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

export default function Unit5_2({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "trace", label: "Control" },
    { id: "enable", label: "Enable/Disable" },
    { id: "multi", label: "Many Devices" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Stop asking — let the device call you</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Transfer of control: IRQ → ISR → return</h3><TraceWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Enabling & disabling interrupts</h3><EnableWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Handling multiple devices</h3><MultiWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.2.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔌</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Interrupts</div>
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
