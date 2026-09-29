// Unit5_3.jsx — Module 5 › Unit 5.3 — "Exceptions & Interrupts in the OS"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: interrupts aren't only for I/O — any unplanned jump reuses the same
// hardware (need) -> the taxonomy of exceptions (interrupt vs trap) -> the
// timer interrupt that makes multitasking possible (trace) -> system calls &
// user/supervisor privilege -> quiz. Builds directly on Unit 5.2's mechanism.
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

// ── Section 1: Need — classify events as interrupt (external) vs trap (internal) ──
function NeedWidget() {
  const events = [
    { e: "A disk finishes reading a block", t: "interrupt", why: "External device signalled — asynchronous to your code." },
    { e: "Your code divides by zero", t: "trap", why: "The running instruction itself caused it — synchronous." },
    { e: "A key is pressed", t: "interrupt", why: "An external device (keyboard) asked for attention." },
    { e: "Program calls read() to open a file", t: "trap", why: "A deliberate software interrupt (system call) into the OS." },
    { e: "An illegal opcode is executed", t: "trap", why: "Detected while executing the instruction — synchronous fault." },
  ];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const ev = events[i];
  return (
    <div>
      <Frame>The interrupt hardware from Unit 5.2 does far more than I/O. <b>Any</b> unplanned jump to a
      handler is an <b>exception</b>. Guess whether each event is an external <b>interrupt</b> or an internal
      <b> trap</b> — then see why.</Frame>
      <div style={{ ...box, marginBottom: 12, textAlign: "center", fontSize: 15, color: C.text }}>{ev.e}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={() => setPicked("interrupt")} style={btn(picked === "interrupt", C.accent)}>Interrupt (external)</button>
        <button onClick={() => setPicked("trap")} style={btn(picked === "trap", C.orange)}>Trap (internal)</button>
      </div>
      {picked && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: (picked === ev.t ? C.green : C.red) + "18", border: `1px solid ${(picked === ev.t ? C.green : C.red)}44`, color: C.muted, fontSize: 13 }}>
          {picked === ev.t ? "✓ Correct — " : `✗ It's a ${ev.t}. `}{ev.why}
        </div>
      )}
      <button onClick={() => { setI((x) => (x + 1) % events.length); setPicked(null); }} style={{ ...btn(false, C.border), marginTop: 12 }}>Next event →</button>
      <Key>Both interrupts and traps use the <b>same</b> save-state → vector → return machinery. The only
      difference is the trigger: an <b>interrupt</b> is external and asynchronous; a <b>trap/exception</b> is
      caused synchronously by the instruction running right now.</Key>
    </div>
  );
}

// ── Section 2: Taxonomy click-to-reveal ──
function TaxonomyWidget() {
  const cats = [
    { k: "I/O interrupt", col: C.accent, d: "A device signals it is ready or a transfer completed — the case from Unit 5.2. External and asynchronous." },
    { k: "Error / hardware fault", col: C.red, d: "Divide-by-zero, arithmetic overflow, illegal opcode, memory-parity error. The handler reports or recovers; the instruction may be retried or the program aborted." },
    { k: "Debugging support", col: C.yellow, d: "A trace exception fires after every instruction (single-stepping); a breakpoint exception fires at a marked instruction. This is how a debugger pauses a program." },
    { k: "System call (software interrupt)", col: C.green, d: "A user program deliberately traps into the OS to request a service (read a file, print). Same hardware, triggered on purpose." },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div>
      <Frame>Exceptions come in a few families. Click each to see an example.</Frame>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {cats.map((c, i) => (
          <button key={i} onClick={() => setSel(i)} style={btn(sel === i, c.col)}>{c.k}</button>
        ))}
      </div>
      <div style={{ ...box, borderColor: cats[sel].col + "66" }}>
        <div style={{ color: cats[sel].col, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{cats[sel].k}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{cats[sel].d}</div>
      </div>
      <Key color={C.teal}>One mechanism, many uses. That reuse is why a computer needs only <i>one</i>
      interrupt/exception system to handle devices, program errors, debuggers, and the operating system's
      own service requests.</Key>
    </div>
  );
}

// ── Section 3: Timer interrupt → multitasking trace ──
function TimerWidget() {
  const slice = ["A", "A", "B", "B", "C", "A", "A", "B"]; // which process runs each tick
  const [t, setT] = useState(0);
  const cur = slice[Math.min(t, slice.length - 1)];
  const prev = t > 0 ? slice[t - 1] : null;
  const switched = prev !== null && prev !== cur;
  return (
    <div>
      <Frame>How does the OS run three programs "at once" on one CPU? A hardware <b>timer</b> interrupts at
      fixed intervals; its handler is the OS <b>scheduler</b>, which may switch to another program. Step the
      clock and watch control hop between A, B and C.</Frame>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        {["A", "B", "C"].map((p) => (
          <div key={p} style={{ ...box, padding: "14px 20px", textAlign: "center", borderColor: cur === p ? C.green : C.border, background: cur === p ? C.green + "1f" : C.card }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: cur === p ? C.green : C.muted }}>{p}</div>
            <div style={{ fontSize: 10.5, color: C.muted }}>{cur === p ? "running" : "waiting"}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 10, justifyContent: "center" }}>
        {slice.map((p, i) => (
          <div key={i} style={{ width: 26, height: 26, borderRadius: 5, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", color: i <= t ? "#fff" : C.muted, background: i < t ? C.accentGlow + "88" : i === t ? C.accentGlow : C.card, border: `1px solid ${C.border}` }}>{p}</div>
        ))}
      </div>
      <div style={{ fontSize: 12.5, color: switched ? C.yellow : C.muted, minHeight: 20, textAlign: "center" }}>
        {t === 0 ? "Tick 1 — process A gets the CPU." : switched ? `⏱ Timer interrupt! Scheduler switched ${prev} → ${cur}.` : `Tick ${t + 1} — ${cur} keeps running (same time-slice).`}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => setT((x) => Math.min(slice.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Timer tick ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.yellow}>Without the timer interrupt, a program that never gives up the CPU could freeze the
      whole machine. The timer is what makes <b>pre-emptive multitasking</b> possible — the OS always gets
      control back.</Key>
    </div>
  );
}

// ── Section 4: System calls & privilege modes ──
function PrivilegeWidget() {
  const [viaSyscall, setViaSyscall] = useState(true);
  return (
    <div>
      <Frame>A user program is <b>not</b> allowed to touch a device directly — that is a privileged operation.
      It must ask the OS. Toggle how a program tries to read the disk.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setViaSyscall(false)} style={btn(!viaSyscall, C.red)}>Touch the disk directly</button>
        <button onClick={() => setViaSyscall(true)} style={btn(viaSyscall, C.green)}>Ask via system call</button>
      </div>
      <div style={{ ...box, borderColor: (viaSyscall ? C.green : C.red) + "66" }}>
        {viaSyscall ? (
          <div>
            <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>{`USER mode:  read(file)      ; software interrupt
   │  trap into the OS
   ▼
SUPERVISOR mode: OS driver drives the disk (allowed)
   │  return-from-interrupt
   ▼
USER mode:  program continues with its data`}</pre>
            <div style={{ color: C.green, fontSize: 12.5, marginTop: 10 }}>✓ The trap switches the CPU to supervisor mode, the OS does the privileged work, then drops back to user mode.</div>
          </div>
        ) : (
          <div>
            <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>{`USER mode:  Store R1, DISK_CMD   ; privileged!
   │
   ▼
⚠️  PRIVILEGE-VIOLATION EXCEPTION
    the OS terminates (or traps) the program`}</pre>
            <div style={{ color: C.red, fontSize: 12.5, marginTop: 10 }}>✗ A user program executing a privileged instruction itself causes an exception — protecting shared hardware from rogue code.</div>
          </div>
        )}
      </div>
      <Key color={C.teal}>The processor runs in <b>user mode</b> or <b>supervisor (privileged) mode</b>. Handling an
      exception switches it into supervisor mode so the OS can run privileged instructions; Return-from-interrupt
      drops it back. This two-mode split is the foundation of memory protection and secure multitasking.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "What is the difference between an interrupt and a trap (exception)?",
      options: ["Interrupts are slower", "An interrupt is external/asynchronous; a trap is caused synchronously by the running instruction", "Traps cannot be handled", "There is no difference"],
      answer: 1, explain: "An interrupt comes from outside the CPU (a device); a trap/exception is generated by the instruction executing right now (overflow, syscall)." },
    { q: "Which of these is an exception but NOT an I/O interrupt?",
      options: ["A disk finishing a read", "A key being pressed", "A divide-by-zero fault", "A network packet arriving"],
      answer: 2, explain: "Divide-by-zero is an internally-generated fault (trap); the others are external device interrupts." },
    { q: "Why is the timer interrupt essential to a multitasking OS?",
      options: ["It speeds up memory", "It lets the OS regain control periodically and switch processes", "It stores the program", "It encrypts data"],
      answer: 1, explain: "The timer fires at fixed intervals so the scheduler runs and can pre-empt the current program — no program can hog the CPU forever." },
    { q: "Why can't a user program access an I/O device directly?",
      options: ["The device is too slow", "It is a privileged operation; the program must trap into the OS via a system call", "There aren't enough registers", "Interrupts are disabled"],
      answer: 1, explain: "Device access is privileged. A user program uses a system call to trap into supervisor mode, where the OS performs the operation safely." },
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
          {score === 4 ? "Superb — you see the interrupt system as the OS's backbone." : score >= 2 ? "Good. Replay 'Timer & Multitasking' to cement the scheduler idea." : "Revisit 'Taxonomy' and 'Timer' — they carry this unit."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You now see interrupts as the engine behind faults, debuggers, system calls and multitasking.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.4 — Direct Memory Access.</strong> Even
            interrupts are too slow for a whole disk block — so we hand the transfer to dedicated hardware.
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

export default function Unit5_3({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "tax", label: "Taxonomy" },
    { id: "timer", label: "Timer & OS" },
    { id: "priv", label: "System Calls" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Interrupts aren't only for I/O</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The families of exceptions</h3><TaxonomyWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The timer interrupt runs multitasking</h3><TimerWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>System calls & privilege modes</h3><PrivilegeWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.3.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔌</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Exceptions &amp; Interrupts in the OS</div>
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
