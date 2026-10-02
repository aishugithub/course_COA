// Unit5_C.jsx — Module 5 › Capstone — "Design an I/O Flow"
// Foothold CAPSTONE arc: The Mission (open a 4 KB photo; module word bank +
// match each need to the tool and unit that gave it) -> Build in Steps
// (v1 polling → v2 interrupts → v3 DMA, each adding ONE idea, every line
// commented) -> Play It (I/O-method chooser with a stated cost model) ->
// The Full Flow (step-through of one read() across app, OS, DMA, bus, disk,
// memory, with the user/supervisor mode shown) -> Quiz. Module 5 is the final
// module, so completion also closes the course.
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

// ── Module 5 word bank: every short name, with the unit that introduced it ──
const BANK = [
  ["I/O", "Input/Output", "5.1"],
  ["KIN", "Keyboard INput-ready flag", "5.1"],
  ["IRQ", "Interrupt ReQuest: the doorbell wire", "5.2"],
  ["ISR", "Interrupt-Service Routine: the code that answers it", "5.2"],
  ["PC", "Program Counter: the bookmark", "1.2 / 5.2"],
  ["PS", "Processor Status register", "5.2"],
  ["IE", "Interrupt-Enable bit (inside PS)", "5.2"],
  ["OS", "Operating System", "5.3"],
  ["read()", "A system call: the program asks the OS to read a file", "5.3"],
  ["DMA", "Direct Memory Access", "5.4"],
  ["BR / BG", "Bus Request / Bus Grant", "5.4"],
  ["KB", "Kilobyte = 1024 bytes = 256 four-byte words", "5.4"],
  ["ns, MB/s", "nanosecond, megabytes per second", "5.5"],
  ["PCI", "Peripheral Component Interconnect", "5.6"],
  ["SCSI", "Small Computer System Interface", "5.6"],
];
function WordBank() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ ...box, background: C.teal + "0D", borderColor: C.teal + "44", padding: "10px 14px", marginBottom: 16 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ background: "none", border: "none", color: C.teal, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.5, cursor: "pointer", padding: 0 }}>
        📖 MODULE 5 WORD BANK ({BANK.length} terms) {open ? "▲ hide" : "▼ show"}
      </button>
      {open && (
        <div style={{ marginTop: 8 }}>
          {BANK.map(([w, full, u]) => (
            <div key={w} style={{ display: "flex", gap: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
              <span style={{ ...mono, color: C.teal, fontWeight: 700, minWidth: 70 }}>{w}</span>
              <span style={{ flex: 1 }}>{full}</span>
              <span style={{ fontSize: 11, color: C.muted }}>Unit {u}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section 1: The Mission — match each need to its tool ──
const NEEDS = [
  { need: "The app is in user mode, but disks belong to the OS", ok: "System call", opts: ["System call", "Polling", "Burst"], unit: "5.3" },
  { need: "The OS must reach the disk controller's registers", ok: "Memory-mapped I/O", opts: ["Bus arbitration", "Memory-mapped I/O", "Timer interrupt"], unit: "5.1" },
  { need: "Move 1024 words without the CPU carrying each one", ok: "DMA controller", opts: ["Polling loop", "DMA controller", "Slave-ready"], unit: "5.4" },
  { need: "The DMA controller and CPU both want the one bus", ok: "Bus arbitration (BR/BG)", opts: ["Bus arbitration (BR/BG)", "Daisy-chain ISR", "Supervisor mode"], unit: "5.4" },
  { need: "Carry the words between card and memory, any vendor's card", ok: "PCI burst", opts: ["Port-mapped I/O", "PCI burst", "Trap"], unit: "5.5 / 5.6" },
  { need: "Tell the OS the photo has arrived, without polling", ok: "One interrupt (IRQ)", opts: ["One interrupt (IRQ)", "Busy-waiting", "Clearing IE"], unit: "5.2" },
];
function MissionWidget() {
  const [pick, setPick] = useState({});
  const right = NEEDS.filter((n, i) => pick[i] === n.ok).length;
  return (
    <div>
      <WordBank />
      <Frame><b>The mission:</b> in a gallery app, a student taps a photo. The app calls <code>read()</code> to bring the
      <b> 4 KB photo</b> from the disk into memory, then shows it. Design the full path. For each need, choose the tool
      that solves it.</Frame>
      <div style={{ ...box, padding: 10 }}>
        {NEEDS.map((n, i) => {
          const p = pick[i];
          return (
            <div key={i} style={{ padding: "8px 6px", borderBottom: i < NEEDS.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 12.5, color: C.text, marginBottom: 6 }}>{i + 1}. {n.need}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                {n.opts.map((o) => <button key={o} onClick={() => setPick((x) => ({ ...x, [i]: o }))} style={{ ...btn(p === o, p === o ? (o === n.ok ? C.green : C.red) : C.border), padding: "4px 10px", fontSize: 12 }}>{o}</button>)}
                {p && <span style={{ fontSize: 11.5, color: p === n.ok ? C.green : C.red }}>{p === n.ok ? `✓ from Unit ${n.unit}` : "✗ try again"}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 12.5, color: right === NEEDS.length ? C.green : C.muted }}>
        {right === NEEDS.length ? "✓ Every need matched. You have the whole toolkit." : `${right} / ${NEEDS.length} needs matched`}
      </div>
      <Key>A complete I/O design is these six tools working together. The rest of this capstone snaps them into one flow.</Key>
    </div>
  );
}

// ── Section 2: Build in steps — v1 polling → v2 interrupts → v3 DMA ──
function StepsWidget() {
  const [v, setV] = useState(0);
  const versions = [
    { tag: "v1 — Polling (Unit 5.1)", col: C.red,
      why: "The obvious first try: keep asking the disk “ready yet?”. The CPU spins for the whole time the disk is working, millions of loop runs, and cannot run the app or anything else meanwhile.",
      code: `read_block(buf, n):
    send READ command to the disk controller
    for i in 0 .. n-1:
        while DISK_STATUS.ready == 0:   # busy-wait: ask again and again
            pass                        # ← CPU stuck here
        buf[i] = DISK_DATA              # copy ONE word into memory` },
    { tag: "v2 — Interrupts (Unit 5.2)", col: C.yellow,
      why: "Add a doorbell: the CPU runs other work and the disk interrupts it when each word is ready. No more spinning, but the ISR still runs once PER WORD: 1024 interrupts for one 4 KB photo.",
      code: `read_block(buf, n):
    send READ command, set the disk's interrupt-enable bit
    go back to other work             # CPU is free!

disk_ISR():                           # runs once PER WORD
    buf[i] = DISK_DATA                # copy one word
    i = i + 1
    if i == n: wake up the app        # the whole photo has arrived` },
    { tag: "v3 — DMA (Unit 5.4)", col: C.green,
      why: "Hire the porter: fill in the DMA controller's job slip (start address, word count, direction). It moves all 1024 words over the PCI bus itself, borrowing bus cycles through arbitration. The CPU is interrupted ONCE.",
      code: `read_block(buf, n):
    DMA.start_address = buf           # where in memory
    DMA.word_count    = n             # how many words (1024)
    DMA.direction     = 0             # R/W = 0: device → memory
    DMA.IE            = 1             # ring once when finished
    DMA.go()                          # controller takes over
    go back to other work

dma_done_ISR():                       # runs ONCE
    wake up the app                   # the photo is in memory` },
  ];
  const ver = versions[v];
  return (
    <div>
      <Frame>Real designs grow one idea at a time. Step v1 → v2 → v3 and see how each version removes the previous
      version's bottleneck. The code is <b>pseudocode</b>: plain-English steps written like code, not a real language.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {versions.map((x, i) => <button key={i} onClick={() => setV(i)} style={btn(v === i, x.col)}>{x.tag.split(" ")[0]}</button>)}
      </div>
      <div style={{ ...box, borderColor: ver.col + "66" }}>
        <div style={{ color: ver.col, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{ver.tag}</div>
        <pre style={{ margin: 0, ...mono, fontSize: 12, color: C.text, lineHeight: 1.6, overflowX: "auto" }}>{ver.code}</pre>
      </div>
      <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: ver.col + "18", border: `1px solid ${ver.col}44`, color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>{ver.why}</div>
      <Key color={C.green}>Same task, three designs, each removing the previous wall. Poll → interrupt → DMA is the whole
      story of this module in three code blocks.</Key>
    </div>
  );
}

// ── Section 3: Play It — choose the I/O method (stated cost model) ──
function PlayWidget() {
  const [method, setMethod] = useState("dma");
  const [kb, setKb] = useState(4);
  const words = kb * 256;
  const PER_IRQ = 50, SETUP = 20; // illustrative instruction counts
  const fmt = (n) => n.toLocaleString("en-IN");
  const models = {
    poll: { label: "Polling", col: C.red, irqs: 0, cost: null, note: "The CPU is stuck in the wait loop for the entire transfer. It can run nothing else." },
    intr: { label: "Interrupt per word", col: C.yellow, irqs: words, cost: words * PER_IRQ, note: `${fmt(words)} interrupts × ~${PER_IRQ} instructions each.` },
    dma: { label: "DMA", col: C.green, irqs: 1, cost: SETUP + PER_IRQ, note: `~${SETUP} instructions to fill the job slip + one ISR of ~${PER_IRQ}.` },
  };
  const m = models[method];
  const maxCost = words * PER_IRQ;
  const pct = m.cost === null ? 100 : Math.max(1, (m.cost / maxCost) * 100);
  return (
    <div>
      <Frame>You are the OS designer. Pick a method and a photo size and watch what it costs the CPU. This is the real
      decision behind every disk and network driver.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        {Object.entries(models).map(([k, x]) => <button key={k} onClick={() => setMethod(k)} style={btn(method === k, x.col)}>{x.label}</button>)}
      </div>
      <label style={{ color: C.muted, fontSize: 12 }}>photo size = <strong style={{ color: C.accent }}>{kb} KB</strong> ({fmt(words)} words)</label>
      <input type="range" min={4} max={1024} step={4} value={kb} onChange={(e) => setKb(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ ...box, marginTop: 12 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>CPU effort spent on this transfer</div>
        <div style={{ height: 22, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: m.col, transition: "width 0.4s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12.5, flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: C.muted }}>CPU interruptions: <b style={{ color: m.col }}>{fmt(m.irqs)}</b></span>
          <span style={{ color: C.muted }}>CPU instructions: <b style={{ color: m.col }}>{m.cost === null ? "all of them, for the whole transfer" : `≈ ${fmt(m.cost)}`}</b></span>
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>{m.note}</div>
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Model: ~{PER_IRQ} instructions per interrupt and ~{SETUP} to set up DMA are illustrative round numbers.</div>
      <Key color={C.teal}>The bigger the block, the more clearly DMA wins: its cost stays flat while interrupt-per-word grows
      with every word. That is why disks, network cards and graphics cards all use DMA.</Key>
    </div>
  );
}

// ── Section 4: The full flow — one read(), end to end ──
const PARTS = [
  { id: "app", label: "📱 App" },
  { id: "os", label: "🛡️ OS" },
  { id: "dma", label: "🧑‍🔧 DMA" },
  { id: "bus", label: "🛣️ PCI bus" },
  { id: "disk", label: "💽 SCSI disk" },
  { id: "mem", label: "💾 Memory" },
];
const FLOW = [
  { on: ["app"], mode: "user", t: "The app calls read(photo). That is a system call: a trap into the OS.", u: "5.3" },
  { on: ["os"], mode: "super", t: "Trap: PC and PS are saved, and the CPU switches to supervisor mode. The OS disk driver runs.", u: "5.2, 5.3" },
  { on: ["os", "dma"], mode: "super", t: "The driver fills in the DMA job slip with ordinary Stores to memory-mapped registers: address, 1024 words, direction 0, IE = 1.", u: "5.1, 5.4" },
  { on: ["dma", "disk"], mode: "user", t: "The controller asks the SCSI disk for the blocks. Meanwhile the scheduler runs another program; the CPU is free.", u: "5.3, 5.6" },
  { on: ["dma", "bus"], mode: "user", t: "Data ready: the DMA controller raises BR, the arbiter answers BG, and it becomes bus master.", u: "5.4" },
  { on: ["bus", "mem"], mode: "user", t: "It sends the start address once and bursts the words into memory, paced by the IRDY#/TRDY# ready handshake on the clock.", u: "5.5, 5.6" },
  { on: ["dma"], mode: "super", t: "Word count reaches 0, so Done = 1 and the controller raises ONE IRQ. The CPU enters the ISR in supervisor mode.", u: "5.2, 5.4" },
  { on: ["os", "app"], mode: "user", t: "The ISR marks the app ready; the scheduler resumes it in user mode. read() returns and the photo appears.", u: "5.2, 5.3" },
];
function FlowWidget() {
  const [s, setS] = useState(0);
  const st = FLOW[s];
  return (
    <div>
      <Frame>Here is the whole journey of one <code>read()</code>. Step through it and watch which part of the machine is
      busy, and which mode the CPU is in. Every unit tag is a unit you completed.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 10 }}>
        {PARTS.map((p) => {
          const on = st.on.includes(p.id);
          return <div key={p.id} style={{ ...box, padding: "10px 4px", textAlign: "center", fontSize: 11.5, color: on ? C.text : C.muted, borderColor: on ? C.green : C.border, background: on ? C.green + "1f" : C.card }}>{p.label}</div>;
        })}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        <div style={{ ...box, padding: 10, textAlign: "center", minWidth: 120, borderColor: st.mode === "user" ? C.accent : C.orange }}>
          <div style={{ fontSize: 10.5, color: C.muted }}>CPU mode</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: st.mode === "user" ? C.accent : C.orange, marginTop: 4 }}>{st.mode === "user" ? "👤 user" : "🔑 supervisor"}</div>
        </div>
        <div style={{ ...box, padding: 12, flex: 1, fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>
          <span style={{ color: C.muted }}>Step {s + 1}/{FLOW.length}: </span>{st.t}
          <span style={{ display: "block", fontSize: 11, color: C.purple, marginTop: 4 }}>Units {st.u}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setS((x) => Math.max(0, x - 1))} style={btn(false, C.border)}>◀ Back</button>
        <button onClick={() => setS((x) => Math.min(FLOW.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Step ▶</button>
        <button onClick={() => setS(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <div style={{ ...box, marginTop: 14, borderColor: C.purple + "55" }}>
        <div style={{ color: C.purple, fontWeight: 700, fontSize: 12.5, marginBottom: 6 }}>⚡ CHALLENGE UPGRADES</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.muted, fontSize: 12.5, lineHeight: 1.7 }}>
          <li>The keyboard and the disk ring at the same moment. Use <b>priority and nesting</b> (5.2) to decide who goes first, and why.</li>
          <li>Two photos load from two disks at once. Give the controller <b>two DMA channels</b> (5.4): what must the arbiter now decide?</li>
          <li>Modern PCs use <b>PCI Express</b>, a newer serial version of PCI that sends data in packets over a few wire pairs. Which parts of the Unit 5.5 timing story change?</li>
        </ul>
      </div>
      <Key color={C.green}>You just followed a real operating-system I/O path from a tap on a photo all the way down to the
      hardware and back, using every idea in Module 5.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "Why does the final design use DMA rather than one interrupt per word for the 4 KB photo?",
      options: ["DMA needs no OS at all", "The controller moves all 1024 words itself and interrupts the CPU only once", "DMA avoids using the disk", "Interrupts cannot carry photos"],
      answer: 1, explain: "One interrupt per word would mean 1024 ISRs. DMA does the copying in hardware and rings once when the whole block is in memory." },
    { q: "What lets the app's read() safely reach the disk driver?",
      options: ["A cache miss", "A system call that traps into supervisor mode", "A bus conflict", "A polling loop"],
      answer: 1, explain: "read() is a system call: a deliberate trap that saves PC and PS and switches the CPU to supervisor mode, where the OS driver may touch devices." },
    { q: "How does the DMA controller get to use the memory bus?",
      options: ["It switches the CPU off", "It raises BR (Bus Request), the arbiter answers BG (Bus Grant), and it becomes bus master", "It uses the IRQ wire", "It waits for the CPU to finish all its programs"],
      answer: 1, explain: "Request → grant → use → release. With cycle stealing the CPU only loses the odd bus cycle." },
    { q: "As the photo gets bigger, which method's CPU cost stays almost flat?",
      options: ["Polling", "Interrupt per word", "DMA", "All grow equally"],
      answer: 2, explain: "DMA costs one setup plus one completion interrupt whatever the size. The other two grow with every extra word." },
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
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🏆" : "🎓"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Masterful. You designed a complete I/O system end to end." : score >= 2 ? "Strong finish. Step through 'Full Flow' once more to seal the end-to-end path." : "Revisit 'Build in Steps' and 'Full Flow'. They tie the whole module together."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.green}22, ${C.accentGlow}22)`, border: `1px solid ${C.green}66` }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 17, marginBottom: 8 }}>🎉 Module 5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You have covered Input/Output organisation: reaching devices, interrupts and exceptions, DMA and arbitration,
            synchronous and asynchronous buses, and the PCI and SCSI standards, and you designed a full I/O flow with them.<br /><br />
            <strong style={{ color: C.accent }}>That completes the Computer Organization &amp; Architecture course.</strong>{" "}
            From gates and the fetch–execute cycle, through pipelining and memory, to how the machine talks to the world:
            you have seen how a computer really works, end to end. 🔌🎓
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

export default function Unit5_C({ student, onUnitComplete }) {
  const sections = [
    { id: "mission", label: "The Mission" },
    { id: "steps", label: "Build in Steps" },
    { id: "play", label: "Play It" },
    { id: "flow", label: "Full Flow" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const quizIdx = sections.length - 1;
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The Mission: open a photo from disk</h3><MissionWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Build it in steps: polling → interrupts → DMA</h3><StepsWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Play it: choose the I/O method</h3><PlayWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The full flow, end to end</h3><FlowWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Capstone Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of the whole module.</p>
      <Quiz onComplete={() => { markComplete(quizIdx); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏗️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › CAPSTONE</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Design an I/O Flow</div>
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
