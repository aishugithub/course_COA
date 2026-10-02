// Unit5_6.jsx — Module 5 › Unit 5.6 — "Standard I/O Interfaces: PCI & SCSI"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: every CPU has its own bus, so devices need one agreed standard plus a
// bridge (phone-charger / travel-adapter analogy) -> the PCI signals, each
// name spelled out, and what the # suffix means -> a PCI burst read vs one
// word at a time (cycle count; address and data share the AD wires) -> SCSI
// initiator/target and its bus phases (courier-booking analogy, disconnect /
// reconnect) -> quiz. Uses sync bus + handshake (5.5) and DMA/arbitration (5.4).
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
  STD: { w: "standard interface", full: "Standard I/O interface", plain: "Published rules (wires, voltages, timing) that any company can build a device for." },
  BRIDGE: { w: "bridge", full: "Bridge", plain: "A circuit joining the CPU's own bus to the standard bus, translating between them. Like a travel plug adapter." },
  PCI: { w: "PCI", full: "Peripheral Component Interconnect", plain: "A standard synchronous bus on the motherboard, where cards such as network and sound cards plug in." },
  SCSI: { w: "SCSI", full: "Small Computer System Interface (said “scuzzy”)", plain: "A standard bus for hanging storage devices (disks, tape drives) off one controller." },
  INIT: { w: "initiator", full: "Initiator", plain: "The unit that starts a transaction: PCI's and SCSI's word for the master (Unit 5.5)." },
  TARGET: { w: "target", full: "Target", plain: "The unit that answers: PCI's and SCSI's word for the slave." },
  HASH: { w: "#", full: "Active-low marker", plain: "A # after a signal name means it is ON when the wire is at 0 volts (low). FRAME# “asserted” = wire at 0 V." },
  MUX: { w: "multiplexed", full: "Time-multiplexed lines", plain: "The same wires carry different things at different times: first the address, then the data." },
  BURST: { w: "burst", full: "Burst transfer", plain: "Send the starting address once, then many consecutive data words back to back." },
  ID: { w: "SCSI ID", full: "SCSI device identifier", plain: "A small number each device on a SCSI bus is set to. It names the device and sets its priority." },
  DISC: { w: "disconnect", full: "Disconnect / reconnect", plain: "A slow target lets go of the bus while it works, and grabs it back when the data is ready." },
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

// ── Section 1: Need — one standard bus + a bridge ──
function NeedWidget() {
  const [std, setStd] = useState(true);
  return (
    <div>
      <NewWords keys={["STD", "BRIDGE", "PCI", "SCSI"]} />
      <Frame>Remember when every phone brand had its own charger? Every processor family also has its own private
      bus, with its own wires and timing. If devices had to match it, a network card would fit only one brand of
      CPU. Toggle the two worlds.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => setStd(false)} style={btn(!std, C.red)}>🔌 Every device wired to this CPU's bus</button>
        <button onClick={() => setStd(true)} style={btn(std, C.green)}>🧩 One standard bus + a bridge</button>
      </div>
      <div style={{ ...box, borderColor: (std ? C.green : C.red) + "66", ...mono, fontSize: 12, color: C.text, lineHeight: 1.8 }}>
        {std ? (
          <pre style={{ margin: 0 }}>{`   [ CPU ]──[ processor bus ]
                  │
              [ BRIDGE ]────[ Main memory ]
                  │          (the travel adapter)
═══════════[ PCI bus ]════════   ← one published standard
    │           │          │
[network]   [sound]   [SCSI controller]──[disk][disk]
 any company's card fits any PC`}</pre>
        ) : (
          <pre style={{ margin: 0, color: C.muted }}>{`   [ CPU ]──[ processor bus ]
              │     │     │
         [disk] [network] [sound]
   each card built for THIS CPU's wires,
   voltages and timing ✗
   new CPU next year → every card redesigned ✗`}</pre>
        )}
      </div>
      <Key color={C.green}>A <b>standard I/O interface</b> fixes the wires and signalling rules, so any company's device fits.
      The <b>bridge</b> is the travel adapter between the processor's bus and the standard bus. Two classic standards:
      <b> PCI</b> inside the computer, and <b>SCSI</b> for chains of storage devices.</Key>
    </div>
  );
}

// ── Section 2: PCI signals, every name spelled out ──
const SIGS = [
  { k: "CLK", full: "CLocK", col: C.accent, d: "The bus clock, 33 or 66 MHz. PCI is a synchronous bus (Unit 5.5): things happen on clock ticks.", like: "the school bell" },
  { k: "AD", full: "Address/Data lines", col: C.purple, d: "32 wires (64 on wider slots) that carry the ADDRESS first, then the DATA. The same wires, used at different times.", like: "one road used by the morning school bus and the evening goods truck" },
  { k: "C/BE#", full: "Command / Byte Enable", col: C.teal, d: "During the address phase these lines say WHAT to do (e.g. memory read). During data phases they say WHICH bytes of the word are wanted.", like: "the order slip" },
  { k: "FRAME#", full: "FRAME (transaction in progress)", col: C.green, d: "Driven by the initiator. Asserted at the start of a transaction and kept on until the last data word.", like: "the “meeting in progress” sign on a door" },
  { k: "IRDY#", full: "Initiator ReaDY", col: C.yellow, d: "The initiator says “I am ready for this data word”.", like: "“I'm ready to catch”" },
  { k: "TRDY#", full: "Target ReaDY", col: C.yellow, d: "The target says “this data word is ready”. A word moves only on a clock tick where IRDY# AND TRDY# are both asserted.", like: "“I'm ready to throw”" },
  { k: "DEVSEL#", full: "DEVice SELect", col: C.orange, d: "Driven by the target to say “that address is mine, I'm answering”.", like: "raising your hand when your roll number is called" },
];
function PciSignalsWidget() {
  const [sel, setSel] = useState(1);
  const s = SIGS[sel];
  return (
    <div>
      <NewWords keys={["INIT", "TARGET", "HASH", "MUX"]} />
      <Frame>PCI is processor-independent: it is the same bus whatever CPU sits behind the bridge. Its signals have
      short names. Click each one to see what the letters stand for and what job it does.</Frame>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {SIGS.map((x, i) => <button key={x.k} onClick={() => setSel(i)} style={{ ...btn(sel === i, x.col), ...mono }}>{x.k}</button>)}
      </div>
      <div style={{ ...box, borderColor: s.col + "66" }}>
        <div style={{ ...mono, color: s.col, fontWeight: 700, fontSize: 15 }}>{s.k}</div>
        <div style={{ color: C.text, fontSize: 13, fontWeight: 600, margin: "4px 0 8px" }}>= {s.full}{s.k.endsWith("#") ? " (active-low)" : ""}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{s.d}</div>
        <div style={{ color: C.purple, fontSize: 12, marginTop: 8 }}>Think of it as: {s.like}</div>
      </div>
      <Key color={C.purple}>Sharing the <b>AD</b> wires between address and data saves dozens of pins on every chip and
      slot. The <b>#</b> means active-low: <code>FRAME#</code> is “on” when its wire is at 0 V. To the CPU, a PCI device's
      registers simply appear at some addresses: memory-mapped I/O again (Unit 5.1).</Key>
    </div>
  );
}

// ── Section 3: PCI burst read vs one word at a time ──
function PciReadWidget() {
  const [burst, setBurst] = useState(true);
  const [t, setT] = useState(0);
  const burstSteps = [
    { ad: "Address 0x8000", sig: ["FRAME#"], note: "Address phase: the initiator asserts FRAME#, puts the address on AD and 'memory read' on C/BE#." },
    { ad: "(turnaround)", sig: ["FRAME#", "IRDY#", "DEVSEL#"], note: "AD changes hands from initiator to target: one idle cycle. The target claims the address with DEVSEL#; the initiator asserts IRDY#." },
    { ad: "Data word 1", sig: ["FRAME#", "IRDY#", "TRDY#", "DEVSEL#"], note: "The target asserts TRDY# and puts word 1 on the SAME AD wires. IRDY# and TRDY# are both on, so it transfers." },
    { ad: "Data word 2", sig: ["FRAME#", "IRDY#", "TRDY#", "DEVSEL#"], note: "Word 2 (from 0x8004). No new address needed: the target counts up by itself." },
    { ad: "Data word 3", sig: ["FRAME#", "IRDY#", "TRDY#", "DEVSEL#"], note: "Word 3: one word per clock tick." },
    { ad: "Data word 4", sig: ["IRDY#", "TRDY#", "DEVSEL#"], note: "Word 4. The initiator drops FRAME# to mark this as the last word. Done in 6 cycles." },
  ];
  const singleSteps = Array.from({ length: 4 }).flatMap((_, w) => [
    { ad: `Address 0x${(0x8000 + w * 4).toString(16).toUpperCase()}`, sig: ["FRAME#"], note: `Word ${w + 1}: send its address.` },
    { ad: "(turnaround)", sig: ["IRDY#", "DEVSEL#"], note: `Word ${w + 1}: AD changes hands.` },
    { ad: `Data word ${w + 1}`, sig: ["IRDY#", "TRDY#", "DEVSEL#"], note: `Word ${w + 1} transfers, and the transaction ends.` },
  ]);
  const steps = burst ? burstSteps : singleSteps;
  const st = steps[Math.min(t, steps.length - 1)];
  const isData = st.ad.startsWith("Data");
  return (
    <div>
      <NewWords keys={["BURST"]} />
      <Frame>The DMA controller of Unit 5.4 wants 4 words from <code>0x8000</code>. Step the clock in
      <b> burst</b> mode, then switch to one word at a time and count the cycles.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => { setBurst(true); setT(0); }} style={btn(burst, C.green)}>🚀 Burst: one address, 4 words</button>
        <button onClick={() => { setBurst(false); setT(0); }} style={btn(!burst, C.orange)}>🐢 4 separate transactions</button>
      </div>
      <div style={{ ...box, marginBottom: 10, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.muted }}>The AD wires carry →</div>
        <div style={{ fontSize: 21, fontWeight: 800, ...mono, color: isData ? C.teal : st.ad.startsWith("Address") ? C.accent : C.muted, margin: "6px 0" }}>{st.ad}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {["FRAME#", "IRDY#", "TRDY#", "DEVSEL#"].map((s) => {
            const on = st.sig.includes(s);
            return <span key={s} style={{ fontSize: 10.5, ...mono, padding: "3px 7px", borderRadius: 4, color: on ? "#fff" : C.muted, background: on ? C.accentGlow : C.card, border: `1px solid ${C.border}` }}>{s} {on ? "on" : "off"}</span>;
          })}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: C.text, minHeight: 36, lineHeight: 1.6 }}>{st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setT((x) => Math.min(steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Clock ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: burst ? C.green : C.orange }}>cycle {t + 1} of {steps.length}</span>
      </div>
      <Key color={C.teal}>Same 4 words: <b>6 cycles</b> as a burst, <b>12 cycles</b> as separate transactions (in this
      simplified model). Sending the address once and streaming the rest is exactly what DMA block transfers want, and
      IRDY#/TRDY# are the ready handshake from Unit 5.5, timed by the clock.</Key>
    </div>
  );
}

// ── Section 4: SCSI — initiator/target and bus phases ──
function ScsiWidget() {
  const [slow, setSlow] = useState(false);
  const [i, setI] = useState(0);
  const base = [
    { p: "Arbitration", like: "Win the shared phone line", d: "The controller competes for the SCSI bus. Each device has a SCSI ID, and the highest priority wins." },
    { p: "Selection", like: "Dial the shop", d: "The winner (the initiator, usually the controller) selects the target disk by its ID." },
    { p: "Command", like: "Place the order", d: "The initiator sends the command: “read 8 blocks starting at block 5000”." },
  ];
  const fast = [
    { p: "Data", like: "Goods delivered", d: "The disk sends the blocks across the bus." },
    { p: "Status", like: "Receipt", d: "The target reports success, and the bus is free." },
  ];
  const slowPath = [
    { p: "Disconnect", like: "“I'll call you back”", d: "The disk must first move its read head (milliseconds!). Instead of holding the bus idle, it disconnects. Other devices can use the bus meanwhile." },
    { p: "Reselection", like: "The shop calls back", d: "Data ready: the disk wins arbitration itself and reconnects to the controller." },
    ...fast,
  ];
  const phases = [...base, ...(slow ? slowPath : fast)];
  const ph = phases[Math.min(i, phases.length - 1)];
  return (
    <div>
      <NewWords keys={["ID", "DISC"]} />
      <Frame>A SCSI bus hangs several storage devices off one <b>controller</b>, which itself sits on PCI. A transfer is
      like booking a courier by phone: it goes through fixed <b>phases</b>. Step through, then switch on a slow disk.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => { setSlow(false); setI(0); }} style={btn(!slow, C.accent)}>Disk has the data ready</button>
        <button onClick={() => { setSlow(true); setI(0); }} style={btn(slow, C.orange)}>Slow disk (must seek first)</button>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {phases.map((x, k) => (
          <div key={x.p} style={{ flex: 1, minWidth: 74, textAlign: "center", padding: "7px 3px", borderRadius: 6, fontSize: 10.5, color: k <= i ? "#fff" : C.muted, background: k === i ? C.accentGlow : k < i ? C.accentGlow + "66" : C.card, border: `1px solid ${["Disconnect", "Reselection"].includes(x.p) ? C.orange : C.border}` }}>{x.p}</div>
        ))}
      </div>
      <div style={{ ...box, minHeight: 70 }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13 }}>{ph.p} <span style={{ color: C.purple, fontWeight: 400, fontSize: 12 }}>· {ph.like}</span></div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginTop: 6 }}>{ph.d}</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setI((x) => Math.min(phases.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Next phase ▶</button>
        <button onClick={() => setI(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.orange}>On SCSI the <b>initiator</b> (usually the controller) gives commands and the <b>target</b>
      (a disk) carries them out. <b>Disconnect/reconnect</b> stops a slow disk from wasting the shared bus, the same
      “don't wait idle” idea as interrupts. PCI is the system bus near the CPU; SCSI is a peripheral bus one level
      further out. Today SAS (Serial Attached SCSI) keeps SCSI's initiator/target model.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "Why does a computer use a bridge and a standard bus like PCI?",
      options: ["To make the CPU faster", "So any company's card fits, whatever CPU is behind the bridge", "To remove the need for memory", "Because PCI has no clock"],
      answer: 1, explain: "The bridge translates between the CPU's private bus and the published standard, so devices are built once for PCI, not for each CPU." },
    { q: "What does the # in FRAME# tell you?",
      options: ["It is a number", "It is active-low: ON when the wire is at 0 V", "It is optional", "It is a comment"],
      answer: 1, explain: "# marks an active-low signal. Asserting FRAME# means pulling its wire down to 0 V." },
    { q: "In a PCI burst read of 4 words, how many times is the address sent?",
      options: ["Once", "Four times", "Twice", "Never"],
      answer: 0, explain: "The address goes on the AD wires once; the target then streams consecutive words. That is why a burst took 6 cycles here instead of 12." },
    { q: "A SCSI disk needs milliseconds to move its head before it has the data. What does it do?",
      options: ["Holds the bus idle until ready", "Disconnects, freeing the bus, then reselects the controller when the data is ready", "Sends random data", "Asks the CPU to poll it"],
      answer: 1, explain: "Disconnect/reconnect lets other devices use the bus during the slow seek, the same 'don't wait idle' idea as interrupts." },
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
          {score === 4 ? "Excellent. You can read a real bus standard." : score >= 2 ? "Good. Step through 'PCI Burst' again in both modes." : "Revisit 'PCI Signals' and 'PCI Burst'. Tap any teal word for its full name."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.6 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can explain why standard buses exist, decode PCI's signals, trace a burst, and follow a SCSI transaction.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Capstone — Design an I/O Flow.</strong>{" "}
            One photo, from disk to memory, using every tool in Module 5.
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

export default function Unit5_6({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "pci", label: "PCI Signals" },
    { id: "read", label: "PCI Burst" },
    { id: "scsi", label: "SCSI" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const quizIdx = sections.length - 1;
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>One charger for every phone: standard buses</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>PCI's signals, letter by letter</h3><PciSignalsWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>A PCI burst read</h3><PciReadWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>SCSI: booking a courier for your data</h3><ScsiWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.6.</p>
      <Quiz onComplete={() => { markComplete(quizIdx); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧩</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.6</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Standard I/O Interfaces: PCI & SCSI</div>
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
