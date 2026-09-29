// Unit5_1.jsx — Module 5 › Unit 5.1 — "Accessing I/O Devices"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: the CPU only speaks to memory, so how does it reach a keyboard? ->
// memory-mapped I/O (Load/Store reach a device register) -> the device
// interface (data/status/control registers) -> the polling wait-loop, and why
// it wastes the CPU (sets up Unit 5.2 interrupts) -> quiz.
// Scaffolds on Unit1_4 (addresses) and Unit2_3/2_4 (Load/Store to memory).
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
function Frame({ children }) {
  return <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>{children}</p>;
}
const box = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 };

// ── Section 1: Need — the CPU can only address memory ──
function NeedWidget() {
  const [mapped, setMapped] = useState(true);
  return (
    <div>
      <Frame>
        Your processor knows exactly one trick for reaching the outside world: <b>read and write
        addresses</b>. A keyboard is not an address. So how does <code>Load</code>/<code>Store</code>
        ever touch it? Flip the switch to see the idea that makes it work.
      </Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMapped(false)} style={btn(!mapped, C.orange)}>Separate I/O world</button>
        <button onClick={() => setMapped(true)} style={btn(mapped, C.green)}>Memory-mapped I/O</button>
      </div>
      {!mapped ? (
        <div style={{ ...box, borderColor: C.orange + "66" }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>⚙️ IF DEVICES LIVED IN A SEPARATE WORLD</div>
          <pre style={{ fontFamily: "monospace", fontSize: 13, color: C.text, margin: 0, lineHeight: 1.6 }}>{`In   R2, PORT_5      ; a WHOLE new instruction,
                  ; a new address space, a new
                  ; control line just for I/O`}</pre>
          <p style={{ color: C.muted, fontSize: 12.5, marginTop: 10, marginBottom: 0 }}>Extra opcodes, a second address space, extra wiring. This is <b>isolated (port-mapped) I/O</b> — it exists, but it is more machinery.</p>
        </div>
      ) : (
        <div style={{ ...box, borderColor: C.green + "66" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>✅ GIVE THE DEVICE AN ADDRESS</div>
          <pre style={{ fontFamily: "monospace", fontSize: 13, color: C.text, margin: 0, lineHeight: 1.6 }}>{`Load  R2, DATAIN     ; DATAIN is just an address...
Store R2, DATAOUT    ; ...that happens to be a device!`}</pre>
          <p style={{ color: C.muted, fontSize: 12.5, marginTop: 10, marginBottom: 0 }}>Hand a few addresses to the device instead of to memory. Now every instruction that already talks to memory talks to the device too. No new opcodes.</p>
        </div>
      )}
      <Key color={C.green}>The whole chapter rests on one move: make a device <b>look like memory</b>. Reserve some
      addresses for device registers instead of RAM, and the processor reaches hardware with the
      same <code>Load</code>/<code>Store</code> it already knows.</Key>
    </div>
  );
}

// ── Section 2: Anatomy — memory-mapped address space ──
function MapWidget() {
  const [sel, setSel] = useState(null);
  const rows = [
    { a: "0x0000", who: "RAM", d: "Ordinary main memory — your program and its data.", col: C.teal },
    { a: "0x3FFF", who: "RAM", d: "…the memory region continues up to here.", col: C.teal },
    { a: "0x4000", who: "KBD_DATA", d: "Keyboard data register — the last key's ASCII code. A Load here reads a keystroke.", col: C.accent },
    { a: "0x4004", who: "KBD_STATUS", d: "Keyboard status register — the KIN flag says 'a key is waiting'.", col: C.purple },
    { a: "0x4010", who: "DISP_DATA", d: "Display data register — a Store here prints a character.", col: C.accent },
    { a: "0x4014", who: "DISP_STATUS", d: "Display status register — the DOUT flag says 'ready for the next character'.", col: C.purple },
  ];
  return (
    <div>
      <Frame>
        This is one processor's <b>address map</b>. Most rows are memory; a handful are hijacked for
        device registers. Click any row — nothing about the <i>instruction</i> changes, only <i>which
        address</i> you name.
      </Frame>
      <div style={{ ...box, padding: 8 }}>
        {rows.map((r, i) => (
          <button key={i} onClick={() => setSel(i)} style={{
            width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "center",
            padding: "9px 12px", marginBottom: 4, borderRadius: 7, cursor: "pointer",
            background: sel === i ? r.col + "22" : "transparent",
            border: `1px solid ${sel === i ? r.col : C.border}`,
          }}>
            <span style={{ fontFamily: "monospace", color: r.col, fontSize: 13, minWidth: 66 }}>{r.a}</span>
            <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{r.who}</span>
            <span style={{ marginLeft: "auto", color: r.who === "RAM" ? C.muted : r.col, fontSize: 11 }}>{r.who === "RAM" ? "memory" : "device"}</span>
          </button>
        ))}
      </div>
      {sel !== null && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: rows[sel].col + "18", border: `1px solid ${rows[sel].col}44`, color: C.muted, fontSize: 13 }}>
          {rows[sel].d}
        </div>
      )}
      <Key>Notice the device registers are spaced 4 bytes apart — <b>word-aligned</b> in a 32-bit machine.
      To the programmer a device is just a small cluster of named addresses.</Key>
    </div>
  );
}

// ── Section 3: The interface — data / status / control registers ──
function InterfaceWidget() {
  const parts = [
    { k: "DATA", col: C.accent, d: "The buffer that holds the byte being moved — KBD_DATA holds the key just pressed; DISP_DATA holds the character to show." },
    { k: "STATUS", col: C.purple, d: "Read-only flags reporting the device's condition — KIN = 'a key is ready', DOUT = 'display can take the next character'. The processor polls these." },
    { k: "CONTROL", col: C.orange, d: "Bits the processor WRITES to steer the device — e.g. an interrupt-enable bit (you'll use this in Unit 5.2)." },
  ];
  const [sel, setSel] = useState(0);
  return (
    <div>
      <Frame>
        A device doesn't touch the bus directly — it sits behind an <b>interface</b> holding three
        kinds of register. Click each block of the keyboard interface.
      </Frame>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {parts.map((p, i) => (
          <button key={i} onClick={() => setSel(i)} style={{
            textAlign: "left", padding: "12px 14px", borderRadius: 9, cursor: "pointer",
            background: sel === i ? p.col + "1f" : C.card,
            border: `1.5px solid ${sel === i ? p.col : C.border}`,
          }}>
            <div style={{ color: p.col, fontWeight: 700, fontSize: 13, fontFamily: "monospace" }}>KBD_{p.k}</div>
            {sel === i && <div style={{ color: C.muted, fontSize: 12.5, marginTop: 6, lineHeight: 1.6 }}>{p.d}</div>}
          </button>
        ))}
      </div>
      <Key color={C.teal}>Data · Status · Control — three registers are all an interface needs to hand a slow
      device over to a fast processor. Everything in this unit and the next is built on these three.</Key>
    </div>
  );
}

// ── Section 4: Polling trace — the busy-wait loop ──
function PollWidget() {
  const code = [
    "READWAIT: LoadByte R4, KBD_STATUS",   // 0
    "          And      R4, R4, #2",        // 1  test KIN (bit 1)
    "          Branch_if_[R4]=0  READWAIT", // 2
    "          LoadByte R5, KBD_DATA",      // 3
  ];
  const [step, setStep] = useState(0);
  const [kin, setKin] = useState(0);
  // A synthetic trace: loop spins on lines 0-1-2 while KIN=0, escapes when KIN=1.
  const seq = kin === 0
    ? [0, 1, 2, 0, 1, 2, 0, 1, 2]                       // spinning forever
    : [0, 1, 2, 3];                                     // key ready → falls through
  const line = seq[Math.min(step, seq.length - 1)];
  const atEnd = kin === 1 && step >= seq.length - 1;
  const spinning = kin === 0 && step >= seq.length - 1;
  return (
    <div>
      <Frame>
        With only polling, the processor reads the status flag over and over. Press <b>Step</b> and watch
        it spin on lines 0–2. Then press <b>“a key is pressed”</b> (sets KIN=1) and step again to see it
        finally escape and read the character.
      </Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        <div style={{ ...box, padding: 12 }}>
          {code.map((l, i) => (
            <pre key={i} style={{
              margin: 0, fontFamily: "monospace", fontSize: 12, padding: "4px 8px", borderRadius: 5,
              color: line === i ? "#fff" : C.muted,
              background: line === i ? C.accentGlow : "transparent",
              borderLeft: line === i ? `3px solid ${C.accent}` : "3px solid transparent",
            }}>{line === i ? "▶ " : "  "}{l}</pre>
          ))}
        </div>
        <div>
          <div style={{ ...box, padding: 12, marginBottom: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted }}>KIN flag</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: kin ? C.green : C.red }}>{kin}</div>
            <div style={{ fontSize: 11, color: kin ? C.green : C.red }}>{kin ? "key waiting" : "no key yet"}</div>
          </div>
          <div style={{ ...box, padding: 12, textAlign: "center", background: C.bg }}>
            <div style={{ fontSize: 11, color: C.muted }}>R5 (read char)</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "monospace", color: atEnd ? C.teal : C.muted }}>{atEnd ? "'A'" : "—"}</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, color: spinning ? C.red : atEnd ? C.green : C.muted, minHeight: 18 }}>
        {atEnd ? "✓ KIN was 1 — the branch fell through and the character was read into R5."
          : spinning ? "⟳ KIN is still 0 — the branch keeps jumping back. The CPU is doing NO useful work."
            : "Reading status, testing the KIN bit, branching back if it is 0…"}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={() => setStep((s) => s + 1)} style={btn(true, C.accentGlow)}>Step ▶</button>
        <button onClick={() => { setKin(1); setStep(0); }} style={btn(true, C.green)}>a key is pressed (KIN=1)</button>
        <button onClick={() => { setKin(0); setStep(0); }} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.red}>This spinning is called <b>busy-waiting</b>. A keyboard delivers ~10 keys/second, so the
      CPU can poll <b>millions</b> of times between keystrokes — all wasted. Unit 5.2 fixes exactly this by
      letting the <i>device</i> call the processor.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "In memory-mapped I/O, how does the processor read a device register?",
      options: ["With special In/Out instructions only", "With the same Load/Store used for memory", "By raising an interrupt", "Through the DMA controller"],
      answer: 1, explain: "Memory-mapped I/O assigns the device an address, so ordinary Load/Store reach it — no special I/O instructions needed." },
    { q: "Which register tells the processor a device is ready?",
      options: ["The data register", "The status register", "The control register", "The program counter"],
      answer: 1, explain: "The status register holds flags like KIN/DOUT that the processor polls to know when to transfer." },
    { q: "What does the processor write to steer how a device behaves (e.g. enable interrupts)?",
      options: ["The status register", "The data register", "The control register", "The stack pointer"],
      answer: 2, explain: "The control register holds bits the processor writes — such as the interrupt-enable bit used in Unit 5.2." },
    { q: "Why is program-controlled (polling) I/O wasteful for a keyboard?",
      options: ["It needs extra wires", "The CPU busy-waits, doing no useful work between keystrokes", "It cannot read ASCII", "It corrupts memory"],
      answer: 1, explain: "The processor spins in a wait loop reading the status flag — millions of useless polls between two slow keystrokes." },
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
          {score === 4 ? "Perfect — you can see a device as just a few addresses." : score >= 2 ? "Good. Re-open 'The Interface' to lock in data vs status vs control." : "Revisit 'Memory-mapped I/O' and 'The Interface' — they carry the whole unit."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can reach any device through memory-mapped data/status/control registers, and you've felt
            why polling wastes the CPU.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.2 — Interrupts.</strong> Instead of the CPU
            asking "ready yet?" a million times, let the device tap the CPU on the shoulder.
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
          return (
            <button key={i} onClick={() => choose(i)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: 8, background: bg, border: `1.5px solid ${border}`, color: col, cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s" }}>
              {i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}
            </button>
          );
        })}
      </div>
      {selected !== null && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.purple + "18", border: `1px solid ${C.purple}44`, color: C.muted, fontSize: 13 }}>💡 {q.explain}</div>}
      {selected !== null && <button onClick={next} style={{ marginTop: 14, padding: "10px 24px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>}
    </div>
  );
}

function btn(active, color) {
  return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? color : C.border}`, background: active ? color : "transparent", color: active ? "#fff" : C.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer" };
}

export default function Unit5_1({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "map", label: "Mapped I/O" },
    { id: "iface", label: "The Interface" },
    { id: "poll", label: "Polling" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The processor only understands addresses</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Memory-mapped I/O — a device is a few addresses</h3><MapWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The device interface: data, status, control</h3><InterfaceWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Program-controlled I/O: the polling wait-loop</h3><PollWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.1.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔌</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.1</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Accessing I/O Devices</div>
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
