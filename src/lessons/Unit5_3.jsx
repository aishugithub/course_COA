// Unit5_3.jsx — Module 5 › Unit 5.3 — "Exceptions & Interrupts in the OS"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: the doorbell hardware of Unit 5.2 rings for more than devices (fire
// alarm vs a student's own question: interrupt vs trap sorting game) -> the
// families of exceptions, each traced trigger → handler → afterwards -> the
// timer interrupt that makes multitasking possible (switch it off and a
// runaway loop freezes the machine) -> user vs supervisor mode and system
// calls (pharmacy-counter analogy) -> quiz. Builds directly on Unit 5.2.
// Every abbreviation is spelled out before use.
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
const mono = { fontFamily: "monospace" };
function btn(active, color) { return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? color : C.border}`, background: active ? color : "transparent", color: active ? "#fff" : C.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }; }

// ── Glossary: every short name used in this unit, spelled out ──
const G = {
  OS: { w: "OS", full: "Operating System", plain: "The manager program (Windows, Linux, Android) that runs all other programs and controls the hardware for them." },
  EXC: { w: "exception", full: "Exception", plain: "Any event that makes the CPU stop the current program and jump to a handler. Interrupts and traps are both exceptions." },
  INT: { w: "interrupt", full: "Interrupt (external)", plain: "An exception caused by something OUTSIDE the program, like a device. It can arrive at any moment." },
  TRAP: { w: "trap", full: "Trap (internal)", plain: "An exception caused by the instruction the program is running right now, like dividing by zero." },
  HANDLER: { w: "handler", full: "Exception handler", plain: "The routine the CPU jumps to for an exception. For a device it is the ISR (Interrupt-Service Routine) of Unit 5.2." },
  SYSCALL: { w: "system call", full: "System call", plain: "An instruction a program runs ON PURPOSE to trap into the OS and ask for a service, like “print this” or “read this file”." },
  DEBUG: { w: "breakpoint", full: "Breakpoint (debugging)", plain: "A marked instruction where a debugger pauses your program so you can inspect variables. The red dot in VS Code." },
  SCHED: { w: "scheduler", full: "Scheduler", plain: "The part of the OS that decides which program gets the CPU next." },
  SLICE: { w: "time slice", full: "Time slice", plain: "The short turn each program gets on the CPU before the timer interrupt lets the OS choose again." },
  MULTI: { w: "multitasking", full: "Pre-emptive multitasking", plain: "Running many programs by switching between them quickly. “Pre-emptive” means the OS can take the CPU away; the program does not have to agree." },
  USER: { w: "user mode", full: "User mode", plain: "The restricted mode ordinary programs run in. Some instructions and addresses are off-limits." },
  SUPER: { w: "supervisor mode", full: "Supervisor (privileged) mode", plain: "The full-power mode the OS runs in. A mode bit in the PS (Processor Status register) says which mode the CPU is in." },
  PRIV: { w: "privileged instruction", full: "Privileged instruction", plain: "An instruction allowed only in supervisor mode, e.g. one that changes the IE bit or the mode bit in PS." },
};

// Tap-to-expand chip for re-looking-up a word anywhere in the lesson
function Term({ k, label }) {
  const [open, setOpen] = useState(false);
  const g = G[k];
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((o) => !o)} title={g.full} style={{ ...mono, fontSize: 12, padding: "0 6px", margin: "0 1px", borderRadius: 5, border: `1px dashed ${C.teal}88`, background: C.teal + "14", color: C.teal, cursor: "pointer" }}>{label || g.w}</button>
      {open && (
        <span style={{ position: "absolute", left: 0, top: "120%", zIndex: 5, width: 240, padding: "8px 10px", borderRadius: 8, background: C.surface, border: `1px solid ${C.teal}66`, fontSize: 12, color: C.muted, lineHeight: 1.5, boxShadow: "0 6px 20px #0008" }}>
          <b style={{ color: C.text }}>{g.full}</b><br />{g.plain}
        </span>
      )}
    </span>
  );
}
function NewWords({ keys }) {
  return (
    <div style={{ ...box, background: C.teal + "0D", borderColor: C.teal + "44", padding: "10px 14px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>📖 NEW WORDS IN THIS SECTION</div>
      {keys.map((k) => (
        <div key={k} style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginBottom: 3 }}>
          <span style={{ ...mono, color: C.teal, fontWeight: 700 }}>{G[k].w}</span>{" = "}<b style={{ color: C.text }}>{G[k].full}</b>. {G[k].plain}
        </div>
      ))}
    </div>
  );
}

// ── Section 1: Need — interrupt (from outside) vs trap (from your own instruction) ──
const EVENTS = [
  { e: "💽 The disk finishes reading a file block", t: "interrupt", why: "The disk is outside your program and could finish at any moment." },
  { e: "➗ Your program computes total / count with count = 0", t: "trap", why: "The divide instruction itself caused it. Run the program again and it happens at exactly the same instruction." },
  { e: "⌨️ The student presses a key", t: "interrupt", why: "The keyboard is an outside device; the program has no idea when a key will come." },
  { e: "🖨️ Your Python program runs print(\"Hi\")", t: "trap", why: "Printing needs the OS, so the program deliberately runs a system-call instruction. Caused by your own code." },
  { e: "❓ The CPU fetches bytes that are not any valid instruction", t: "trap", why: "The instruction being decoded right now is illegal. That is internal to the program." },
  { e: "🌐 A WhatsApp message packet arrives at the network card", t: "interrupt", why: "The network card is outside the CPU and the message arrives whenever it arrives." },
];
function NeedWidget() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const ev = EVENTS[i];
  const pick = (p) => { if (picked) return; setPicked(p); if (p === ev.t) setScore((s) => s + 1); };
  return (
    <div>
      <NewWords keys={["OS", "EXC", "INT", "TRAP"]} />
      <Frame>In class, two things can stop the teacher mid-sentence: the <b>fire alarm</b> (from outside, at any
      moment) or a <b>student's question about the line just written</b> (caused by the lesson itself). The CPU
      has the same two kinds. Sort each event.</Frame>
      <div style={{ ...box, marginBottom: 12, textAlign: "center", fontSize: 15, color: C.text }}>{ev.e}</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <button onClick={() => pick("interrupt")} style={btn(picked === "interrupt", C.accent)}>🚨 Interrupt (from outside)</button>
        <button onClick={() => pick("trap")} style={btn(picked === "trap", C.orange)}>✋ Trap (from this instruction)</button>
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.muted, alignSelf: "center" }}>Event {i + 1}/{EVENTS.length} · score {score}</span>
      </div>
      {picked && (
        <div style={{ padding: "10px 14px", borderRadius: 8, background: (picked === ev.t ? C.green : C.red) + "18", border: `1px solid ${(picked === ev.t ? C.green : C.red)}44`, color: C.muted, fontSize: 13 }}>
          {picked === ev.t ? "✓ Correct. " : `✗ It's a ${ev.t}. `}{ev.why}
        </div>
      )}
      <button onClick={() => { setI((x) => (x + 1) % EVENTS.length); setPicked(null); if (i === EVENTS.length - 1) setScore(0); }} style={{ ...btn(false, C.border), marginTop: 12 }}>Next event →</button>
      <Key>Both kinds use the <b>same</b> machinery from Unit 5.2: save PC and PS, jump to a handler, return.
      The general name for both is an <b>exception</b>. An <b>interrupt</b> comes from outside and can arrive
      at any time. A <b>trap</b> is caused by the instruction running right now.</Key>
    </div>
  );
}

// ── Section 2: Families — trigger → handler → afterwards ──
const FAMILIES = [
  { k: "I/O interrupt", col: C.accent, ex: "The keyboard rings because 'A' was pressed.", handler: "The keyboard ISR reads KBD_DATA (Unit 5.2).", after: "Resume the program at the next instruction. Nothing was wrong." },
  { k: "Error (fault)", col: C.red, ex: "average = total / count, with count = 0.", handler: "The OS's divide-by-zero handler.", after: "The program usually cannot continue: the OS stops it and reports a divide-by-zero error." },
  { k: "Debugging", col: C.yellow, ex: "You put a breakpoint (red dot) on line 12 in your editor.", handler: "The debugger's handler pauses and shows your variables.", after: "When you press Continue, the program resumes exactly where it stopped." },
  { k: "System call", col: C.green, ex: "print(\"Hi\") needs the screen, which belongs to the OS.", handler: "The OS's print service writes to the display.", after: "Return to the program, which carries on after print." },
];
function FamilyWidget() {
  const [sel, setSel] = useState(0);
  const f = FAMILIES[sel];
  return (
    <div>
      <NewWords keys={["HANDLER", "SYSCALL", "DEBUG"]} />
      <Frame>Exceptions come in four families. Pick one and follow it through the same three steps: what
      triggers it, which <Term k="HANDLER" /> runs, and what happens afterwards.</Frame>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {FAMILIES.map((c, i) => <button key={c.k} onClick={() => setSel(i)} style={btn(sel === i, c.col)}>{c.k}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[["1 · Trigger", f.ex], ["2 · Handler", f.handler], ["3 · Afterwards", f.after]].map(([h, d], i) => (
          <div key={h} style={{ ...box, padding: 12, borderColor: f.col + "66" }}>
            <div style={{ fontSize: 11, color: f.col, fontWeight: 700, marginBottom: 6 }}>{h}</div>
            <div style={{ fontSize: 12.5, color: i === 0 ? C.text : C.muted, lineHeight: 1.55 }}>{d}</div>
          </div>
        ))}
      </div>
      <Key color={C.teal}>One mechanism, four jobs. The only thing that changes is the <b>handler</b> and what it
      decides to do afterwards: resume, pause, or stop the program. That reuse is why a computer needs only
      <i> one</i> exception system.</Key>
    </div>
  );
}

// ── Section 3: Timer interrupt → multitasking (and what breaks without it) ──
const PROGS = [
  { id: "A", icon: "🎵", name: "Music player" },
  { id: "B", icon: "🌐", name: "Browser" },
  { id: "C", icon: "🐍", name: "while True: pass" },
];
function TimerWidget() {
  const [timerOn, setTimerOn] = useState(true);
  const [t, setT] = useState(0);
  const order = ["A", "B", "C"];
  // With the timer: round-robin every tick. Without it: whoever holds the CPU keeps it; C never gives it back.
  const owner = (k) => (timerOn ? order[k % 3] : k < 2 ? order[k] : "C");
  const cur = owner(t);
  const ms = (t + 1) * 10;
  return (
    <div>
      <NewWords keys={["SCHED", "SLICE", "MULTI"]} />
      <Frame>One CPU, three programs. Program C is a buggy Python loop that never stops. A hardware
      <b> timer</b> can interrupt every 10 ms (an illustrative value); its handler is the OS
      <Term k="SCHED" />. Step the clock with the timer ON, then switch it OFF and try again.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => { setTimerOn(true); setT(0); }} style={btn(timerOn, C.green)}>⏱️ Timer interrupt ON</button>
        <button onClick={() => { setTimerOn(false); setT(0); }} style={btn(!timerOn, C.red)}>🚫 Timer interrupt OFF</button>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
        {PROGS.map((p) => (
          <div key={p.id} style={{ ...box, padding: "10px 14px", textAlign: "center", minWidth: 130, borderColor: cur === p.id ? C.green : C.border, background: cur === p.id ? C.green + "1f" : C.card }}>
            <div style={{ fontSize: 20 }}>{p.icon}</div>
            <div style={{ fontSize: 12, color: C.text }}>{p.name}</div>
            <div style={{ fontSize: 10.5, color: cur === p.id ? C.green : C.muted }}>{cur === p.id ? "running" : "waiting"}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 10, justifyContent: "center" }}>
        {Array.from({ length: 9 }).map((_, k) => (
          <div key={k} style={{ width: 30, height: 26, borderRadius: 5, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", color: k <= t ? "#fff" : C.muted, background: k > t ? C.card : owner(k) === "C" && !timerOn && k >= 2 ? C.red : C.accentGlow, border: `1px solid ${C.border}` }}>{k <= t ? owner(k) : ""}</div>
        ))}
      </div>
      <div style={{ fontSize: 12.5, color: !timerOn && t >= 2 ? C.red : C.muted, minHeight: 36, textAlign: "center", lineHeight: 1.6 }}>
        {timerOn
          ? (t === 0 ? "0–10 ms: the music player has the CPU." : `${ms - 10} ms: ⏱️ timer interrupt → scheduler saves ${owner(t - 1)} and switches to ${cur}. Everyone gets a turn; the music never stutters.`)
          : (t < 2 ? `${ms - 10} ms: ${cur} runs and hands over politely when it finishes a small job.` : `${ms - 10} ms: the Python loop has the CPU and never gives it back. No timer → the OS never runs again. 🎵 stops. The machine looks frozen.`)}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
        <button onClick={() => setT((x) => Math.min(8, x + 1))} style={btn(true, C.accentGlow)}>Clock +10 ms ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.yellow}>The timer interrupt guarantees the OS <b>gets the CPU back</b> every time slice, whatever
      the program is doing. That is what makes <b>pre-emptive multitasking</b> possible: a buggy program can
      waste its own turns but cannot freeze the whole machine.</Key>
    </div>
  );
}

// ── Section 4: User vs supervisor mode, system calls ──
const ATTEMPTS = {
  syscall: {
    label: "✅ print(\"Hi\") via a system call", col: C.green,
    steps: [
      { mode: "user", t: "Your program runs the system-call instruction: “OS, please print Hi”." },
      { mode: "super", t: "Trap! PC and PS are saved, and the mode bit switches to SUPERVISOR. The CPU jumps to the OS." },
      { mode: "super", t: "The OS display driver stores 'H', 'i' into DISP_DATA (Unit 5.1). Allowed: it is in supervisor mode." },
      { mode: "user", t: "Return-from-interrupt restores PS, so the mode bit goes back to USER. Your program continues after print." },
    ],
  },
  direct: {
    label: "❌ Store straight into DISP_DATA", col: C.red,
    steps: [
      { mode: "user", t: "Your program runs Store R2, DISP_DATA itself." },
      { mode: "super", t: "The OS has marked device addresses as off-limits to user mode, so the hardware raises an exception." },
      { mode: "super", t: "The OS handler decides: this program broke the rules. It stops the program with an access error." },
    ],
  },
  ie: {
    label: "❌ Turn off interrupts (clear IE)", col: C.red,
    steps: [
      { mode: "user", t: "Your program tries an instruction that clears the IE bit in PS, so nobody can interrupt it." },
      { mode: "super", t: "That is a privileged instruction. In user mode it causes a privilege exception." },
      { mode: "super", t: "The OS stops the program. Otherwise any program could switch off the timer and freeze the machine." },
    ],
  },
};
function PrivilegeWidget() {
  const [which, setWhich] = useState("syscall");
  const [s, setS] = useState(0);
  const a = ATTEMPTS[which];
  const st = a.steps[s];
  return (
    <div>
      <NewWords keys={["USER", "SUPER", "PRIV"]} />
      <Frame>In a hospital, patients cannot walk into the pharmacy and take medicine. They ask at the
      <b> counter</b>, and the pharmacist, who holds the key, hands it over. Ordinary programs are the
      patients (<Term k="USER" />); the OS is the pharmacist (<Term k="SUPER" />); the
      <Term k="SYSCALL" /> is the counter. Try three ways to get something done.</Frame>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {Object.entries(ATTEMPTS).map(([k, x]) => <button key={k} onClick={() => { setWhich(k); setS(0); }} style={{ ...btn(which === k, x.col), textAlign: "left" }}>{x.label}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: 10 }}>
        <div style={{ ...box, textAlign: "center", padding: 10, borderColor: st.mode === "user" ? C.accent : C.orange }}>
          <div style={{ fontSize: 10.5, color: C.muted }}>Mode bit in PS</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: st.mode === "user" ? C.accent : C.orange, marginTop: 4 }}>{st.mode === "user" ? "👤 USER" : "🔑 SUPERVISOR"}</div>
        </div>
        <div style={{ ...box, padding: 12, fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>
          <span style={{ color: C.muted }}>Step {s + 1}/{a.steps.length}: </span>{st.t}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setS((x) => Math.min(a.steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Step ▶</button>
        <button onClick={() => setS(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.teal}>Every exception switches the CPU into <b>supervisor mode</b> so the OS can do protected
      work, and Return-from-interrupt drops it back to <b>user mode</b>. This two-mode split is why one buggy or
      malicious app cannot take over the screen, the disk, or the whole machine.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "Your program divides by a variable that happens to be 0. What kind of exception is this?",
      options: ["An interrupt, because it is unexpected", "A trap, because the running instruction caused it", "A system call", "Not an exception at all"],
      answer: 1, explain: "It was caused by the divide instruction itself, so it is a trap. Run the program again and it happens at the same place. An interrupt comes from outside." },
    { q: "Which of these is an INTERRUPT rather than a trap?",
      options: ["print(\"Hi\") asking the OS to print", "Executing an illegal instruction", "A network packet arriving", "A breakpoint you placed on line 12"],
      answer: 2, explain: "The packet comes from the network card, outside the program, at an unpredictable moment. The other three are caused by the program's own instructions." },
    { q: "A buggy program runs 'while True: pass'. Why does the music player keep playing?",
      options: ["The music player has a higher clock speed", "The timer interrupt hands control back to the OS every time slice, and the scheduler switches programs", "The buggy program is stopped by the compiler", "Music runs on the keyboard"],
      answer: 1, explain: "The timer interrupt guarantees the OS regains the CPU. Without it, the loop would keep the CPU forever and everything else would freeze." },
    { q: "Why can't a user program just Store into DISP_DATA to print?",
      options: ["Display registers have no address", "Device addresses are off-limits in user mode, so it must ask the OS through a system call", "Store only works with RAM", "The display is too slow"],
      answer: 1, explain: "The OS protects devices. A user-mode program traps into the OS with a system call; the OS, in supervisor mode, does the Store." },
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
          {score === 4 ? "Excellent. You can see the OS in every exception." : score >= 2 ? "Good. Replay the sorting game in 'Why?' to sharpen interrupt vs trap." : "Go back to 'Why?' and sort the events again. Tap any teal word to see what it means."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can tell an interrupt from a trap, follow each family of exception, and explain how the timer and
            supervisor mode keep the OS in charge.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.4 — Direct Memory Access.</strong>{" "}
            Copying a 4 KB photo with one interrupt per word means 1024 doorbells. What if a helper carried the whole block?
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
    { id: "fam", label: "Four Families" },
    { id: "timer", label: "Timer & OS" },
    { id: "priv", label: "System Calls" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const quizIdx = sections.length - 1;
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Fire alarm or a student's question?</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The four families of exceptions</h3><FamilyWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The timer interrupt keeps the OS in charge</h3><TimerWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>User mode, supervisor mode & system calls</h3><PrivilegeWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.3.</p>
      <Quiz onComplete={() => { markComplete(quizIdx); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Exceptions & Interrupts in the OS</div>
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
        {activeSection < quizIdx && (
          <button onClick={goNext} style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mark Complete & Continue →</button>
        )}
      </div>
    </div>
  );
}
