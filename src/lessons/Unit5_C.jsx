// Unit5_C.jsx — Module 5 › Capstone — "Design an I/O Flow"
// Foothold CAPSTONE arc: The Mission (spec + a checklist mapping each tool to
// the unit that taught it) -> Build in Steps (v1 polling → v2 interrupts →
// v3 DMA, each adding ONE idea) -> Play It (an interactive I/O-method chooser
// showing CPU utilisation) -> The Full Flow (end-to-end path + challenges) ->
// Quiz. Module 5 is the final module, so completion also closes the course.
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

// ── Section 1: The Mission — spec + tool→unit checklist ──
function MissionWidget() {
  const tools = [
    { need: "Reach the disk controller's registers", tool: "Memory-mapped I/O", unit: "5.1" },
    { need: "Be told when the transfer is finished", tool: "Interrupts", unit: "5.2" },
    { need: "Enter the OS driver safely (privileged)", tool: "System call / supervisor mode", unit: "5.3" },
    { need: "Move the whole 4 KB block off the CPU", tool: "DMA controller", unit: "5.4" },
    { need: "Share the memory bus with the CPU", tool: "Bus arbitration", unit: "5.4" },
    { need: "Time each word across the bus", tool: "Synchronous bus + handshake", unit: "5.5" },
    { need: "Carry it over a real standard bus", tool: "PCI (+ SCSI/SATA at the disk)", unit: "5.6" },
  ];
  const [checked, setChecked] = useState([]);
  const toggle = (i) => setChecked((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);
  return (
    <div>
      <Frame><b>The mission:</b> a running program calls <code>read()</code> to pull a <b>4 KB block from disk
      into memory</b>, then continue. Design the complete I/O path. Tick each tool as you recall which unit
      gave it to you.</Frame>
      <div style={{ ...box }}>
        {tools.map((t, i) => (
          <button key={i} onClick={() => toggle(i)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", marginBottom: 4, borderRadius: 7, cursor: "pointer", background: checked.includes(i) ? C.green + "18" : "transparent", border: `1px solid ${checked.includes(i) ? C.green : C.border}` }}>
            <span style={{ fontSize: 15 }}>{checked.includes(i) ? "✅" : "⬜"}</span>
            <span style={{ flex: 1, fontSize: 12.5, color: C.text }}>{t.need}</span>
            <span style={{ fontSize: 11.5, color: C.accent, fontWeight: 600 }}>{t.tool}</span>
            <span style={{ fontSize: 10.5, color: C.muted, minWidth: 30, textAlign: "right" }}>▸{t.unit}</span>
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 12.5, color: checked.length === tools.length ? C.green : C.muted }}>
        {checked.length === tools.length ? "✓ Every tool accounted for — you have the whole toolkit." : `${checked.length} / ${tools.length} tools mapped`}
      </div>
      <Key>A complete I/O design is just these seven pieces working together. The rest of this capstone snaps
      them into one flow.</Key>
    </div>
  );
}

// ── Section 2: Build in steps — v1 polling → v2 interrupts → v3 DMA ──
function StepsWidget() {
  const [v, setV] = useState(0);
  const versions = [
    { tag: "v1 — Polling", col: C.red, why: "The obvious first try: ask the disk over and over. But the CPU spins for the entire ~10 ms seek, doing nothing. A game with one turn is barely a game; this is the wall busy-waiting hits.",
      code: `read_block(buf, n):
    issue READ command to disk
    for i in 0..n:
        while (DISK_STATUS.ready == 0)   # ← CPU spins here
            ;                            #   millions of wasted cycles
        buf[i] = DISK_DATA` },
    { tag: "v2 — Interrupts", col: C.yellow, why: "Add interrupts (Unit 5.2): the CPU runs other work and the disk taps it per word. No more idle spinning — but the ISR still fires once PER WORD, so 1024 interrupts for one block. Better, still heavy.",
      code: `read_block(buf, n):
    issue READ command, enable disk interrupt
    return to other work            # CPU is free!

on disk_interrupt():                # fires once PER WORD
    buf[i++] = DISK_DATA
    if i == n: wake_up(program)` },
    { tag: "v3 — DMA", col: C.green, why: "Hand the whole block to the DMA controller (Unit 5.4): give it the address, count and direction; it moves all 1024 words itself over the PCI bus (Unit 5.6), stealing bus cycles (Unit 5.4). The CPU is interrupted ONCE, at the end.",
      code: `read_block(buf, n):
    DMA.addr  = buf                 # start address
    DMA.count = n                   # word count
    DMA.rw    = WRITE_TO_MEMORY     # direction
    DMA.start()                     # controller takes over
    return to other work

on dma_complete_interrupt():        # fires ONCE
    wake_up(program)                # block is in memory` },
  ];
  const ver = versions[v];
  return (
    <div>
      <Frame>Real designs grow one idea at a time. Step v1 → v2 → v3 and watch each version fix the previous
      one's bottleneck.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {versions.map((x, i) => <button key={i} onClick={() => setV(i)} style={btn(v === i, x.col)}>{x.tag.split(" ")[0]}</button>)}
      </div>
      <div style={{ ...box, borderColor: ver.col + "66" }}>
        <div style={{ color: ver.col, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{ver.tag}</div>
        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 12, color: C.text, lineHeight: 1.6, overflowX: "auto" }}>{ver.code}</pre>
      </div>
      <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: ver.col + "18", border: `1px solid ${ver.col}44`, color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>{ver.why}</div>
      <Key color={C.green}>Same task, three designs — each removes the previous wall. That progression (poll → interrupt
      → DMA) is the entire arc of this module in three code blocks.</Key>
    </div>
  );
}

// ── Section 3: Play It — I/O method chooser (CPU utilisation) ──
function PlayWidget() {
  const [method, setMethod] = useState("dma");
  const [kb, setKb] = useState(64);
  const words = kb * 256; // 4 bytes/word
  // Toy model of CPU cost: polling burns ~all of the transfer window; interrupts
  // cost per-word overhead; DMA costs one setup + one completion interrupt.
  const models = {
    poll: { label: "Polling", col: C.red, cpu: 98, interrupts: 0, note: "CPU busy-waits through the whole transfer." },
    intr: { label: "Interrupt-driven", col: C.yellow, interrupts: words, cpu: Math.min(95, Math.round(words / (words + 2000) * 100)), note: `~${words.toLocaleString()} interrupts — one per word.` },
    dma: { label: "DMA", col: C.green, interrupts: 1, cpu: 6, note: "One setup + one completion interrupt; CPU free meanwhile." },
  };
  const m = models[method];
  return (
    <div>
      <Frame>You are the OS designer. Pick a method and a block size, and watch the CPU cost. This is the real
      decision behind every disk and network driver.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {Object.entries(models).map(([k, x]) => <button key={k} onClick={() => setMethod(k)} style={btn(method === k, x.col)}>{x.label}</button>)}
      </div>
      <label style={{ color: C.muted, fontSize: 12 }}>block size = <strong style={{ color: C.accent }}>{kb} KB</strong> ({words.toLocaleString()} words)</label>
      <input type="range" min={4} max={256} step={4} value={kb} onChange={(e) => setKb(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ ...box, marginTop: 12 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>CPU spent on this I/O</div>
        <div style={{ height: 22, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${m.cpu}%`, background: m.col, transition: "width 0.4s", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6, color: "#fff", fontSize: 11, fontWeight: 700 }}>{m.cpu}%</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12 }}>
          <span style={{ color: C.muted }}>CPU interruptions: <b style={{ color: m.col }}>{m.interrupts.toLocaleString()}</b></span>
          <span style={{ color: C.muted }}>{m.label}</span>
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>{m.note}</div>
      </div>
      <Key color={C.teal}>The larger the block, the more decisively DMA wins — its cost barely moves while the others
      scale with size. That's why every high-throughput device (disk, network, GPU) uses DMA.</Key>
    </div>
  );
}

// ── Section 4: The full flow (end to end) + challenges ──
function FlowWidget() {
  const steps = [
    "Program calls read() → software interrupt traps into the OS (user → supervisor mode).  [5.3]",
    "OS disk driver runs; it programs the DMA controller: start address, word count, direction (memory-mapped registers).  [5.1, 5.4]",
    "DMA controller raises Bus-Request; the arbiter grants the bus — it becomes bus master.  [5.4]",
    "It transfers the block over the PCI bus in a synchronous burst, one word per handshake, cycle-stealing from the CPU.  [5.5, 5.6]",
    "Word count hits 0 → Done set → the controller raises ONE completion interrupt.  [5.4, 5.2]",
    "The ISR wakes the program; the scheduler resumes it (supervisor → user mode) with its data in memory.  [5.2, 5.3]",
  ];
  return (
    <div>
      <Frame>Here is the whole journey of one <code>read()</code>, tool by tool. Every bracket is a unit you
      completed.</Frame>
      <div style={{ ...box }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < steps.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.accentGlow, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{ ...box, marginTop: 12, borderColor: C.purple + "55" }}>
        <div style={{ color: C.purple, fontWeight: 700, fontSize: 12.5, marginBottom: 6 }}>⚡ CHALLENGE UPGRADES</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.muted, fontSize: 12.5, lineHeight: 1.7 }}>
          <li>Two disks finish at nearly the same time — use interrupt <b>priority &amp; nesting</b> (5.2) to service the urgent one first.</li>
          <li>Give the disk controller <b>two DMA channels</b> (5.4) so both disks transfer independently.</li>
          <li>Swap the bus for <b>PCI Express</b> — how does a serial, packet-based link change the timing story of 5.5?</li>
        </ul>
      </div>
      <Key color={C.green}>You just designed a real operating-system I/O path from a user program's <code>read()</code>
      all the way to the hardware and back — using every idea in Module 5.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "In the final design, why is DMA chosen over interrupt-driven I/O for the 4 KB block?",
      options: ["It needs no OS", "It moves the whole block off the CPU, which is interrupted only once at completion", "It avoids the disk", "It is easier to type"],
      answer: 1, explain: "DMA transfers all words itself and raises a single completion interrupt — interrupt-driven I/O would interrupt once per word." },
    { q: "What lets a user program's read() safely reach the privileged disk driver?",
      options: ["A cache miss", "A system call that traps into supervisor mode", "A bus conflict", "A polling loop"],
      answer: 1, explain: "read() issues a software interrupt (system call) that switches the CPU to supervisor mode where the OS driver can do privileged I/O." },
    { q: "During the DMA transfer, how does the controller get to use the memory bus?",
      options: ["It disables the CPU permanently", "It wins the bus through arbitration (Bus-Request/Bus-Grant), stealing cycles", "It copies the CPU", "It uses the interrupt line"],
      answer: 1, explain: "The DMA controller is a bus master; it requests the bus, the arbiter grants it, and it cycle-steals to move words while the CPU runs." },
    { q: "As block size grows, which method's CPU cost stays almost flat?",
      options: ["Polling", "Interrupt-driven", "DMA", "All grow equally"],
      answer: 2, explain: "DMA's cost is roughly one setup + one completion interrupt regardless of size, so it barely rises — the reason big transfers always use it." },
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
          {score === 4 ? "Masterful — you designed a complete I/O system end to end." : score >= 2 ? "Strong finish. Re-skim 'The Full Flow' to seal the end-to-end path." : "Revisit 'Build in Steps' and 'The Full Flow' — they tie the whole module together."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.green}22, ${C.accentGlow}22)`, border: `1px solid ${C.green}66` }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 17, marginBottom: 8 }}>🎉 Module 5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've mastered Input/Output Organization — accessing devices, interrupts &amp; exceptions, DMA &amp;
            arbitration, synchronous/asynchronous buses, and the PCI/SCSI standards — and you designed a full I/O
            flow with them.<br /><br />
            <strong style={{ color: C.accent }}>That completes the Computer Organization &amp; Architecture course.</strong>
            From gates and the fetch–execute cycle, through pipelining and memory, to how the machine talks to the
            world — you've seen how a computer really works, end to end. 🔌🎓
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
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The Mission: read a disk block into memory</h3><MissionWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Build it in steps: polling → interrupts → DMA</h3><StepsWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Play it: choose the I/O method</h3><PlayWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The full flow, end to end</h3><FlowWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Capstone Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions tying Module 5 together.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏁</div>
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
            <button key={i} onClick={() => setActiveSection(i)} style={{ flex: 1, minWidth: 78, padding: "8px 6px", borderRadius: 7, background: activeSection === i ? C.accentGlow : "transparent", border: "none", color: activeSection === i ? "#fff" : C.muted, cursor: "pointer", fontSize: 11, fontWeight: activeSection === i ? 600 : 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s" }}>
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
