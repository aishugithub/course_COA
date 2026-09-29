// Unit5_6.jsx — Module 5 › Unit 5.6 — "Standard I/O Interfaces: PCI & SCSI"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: a processor-specific bus can't fit every device (need: standard bus +
// bridge) -> the PCI signals, click to reveal (anatomy) -> a PCI burst read
// (trace: address then data words) -> SCSI initiator/target & bus phases
// (trace) -> quiz. Uses the sync bus + arbitration ideas from 5.4/5.5.
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

// ── Section 1: Need — one standard bus + a bridge ──
function NeedWidget() {
  const [std, setStd] = useState(true);
  return (
    <div>
      <Frame>Every processor has its own private bus. If devices had to match it, a graphics card would only
      fit one brand of CPU. Toggle to see why a <b>standard</b> bus and a <b>bridge</b> solve this.</Frame>
      <button onClick={() => setStd((v) => !v)} style={{ ...btn(true, std ? C.green : C.red), marginBottom: 12 }}>
        {std ? "◀ Standard bus + bridge" : "▶ Devices wired to the processor bus"}
      </button>
      <div style={{ ...box, borderColor: (std ? C.green : C.red) + "66", textAlign: "center", fontFamily: "monospace", fontSize: 12, color: C.text, lineHeight: 1.9 }}>
        {std ? (
          <pre style={{ margin: 0 }}>{`   [ Processor bus ]
        │
     [ BRIDGE ]────[ Main memory ]
        │
════[ PCI bus ]════════  ← one agreed standard
   │      │       │
[disk] [Ethernet] [USB]   ← any vendor, any device`}</pre>
        ) : (
          <pre style={{ margin: 0, color: C.muted }}>{`   [ Processor bus ]
   │    │     │     │
[disk][GPU][USB]... each device must match
                     THIS exact processor's
                     signals, voltages, timing ✗`}</pre>
        )}
      </div>
      <Key color={C.green}>A <b>standard I/O interface</b> fixes the electrical and signalling rules so any vendor's
      device fits. A <b>bridge</b> connects the processor bus to the standard bus and translates transactions
      between them. Two classics: <b>PCI</b> and <b>SCSI</b>.</Key>
    </div>
  );
}

// ── Section 2: PCI signals click-to-reveal ──
function PciSignalsWidget() {
  const sigs = [
    { k: "CLK", col: C.accent, d: "The 33- or 66-MHz bus clock — PCI is a synchronous bus." },
    { k: "FRAME#", col: C.green, d: "Asserted by the initiator (master) to mark the start and duration of a transaction." },
    { k: "AD", col: C.purple, d: "32 (optionally 64) lines carrying the ADDRESS first, then the DATA — time-multiplexed on the same wires." },
    { k: "C/BE#", col: C.teal, d: "Command / byte-enable lines — say what operation and which bytes are active." },
    { k: "IRDY# / TRDY#", col: C.yellow, d: "Initiator-ready and Target-ready — the handshake that paces each data word." },
    { k: "DEVSEL#", col: C.orange, d: "Asserted by the target (slave) to say 'I recognise this address'." },
  ];
  const [sel, setSel] = useState(2);
  return (
    <div>
      <Frame>PCI (Peripheral Component Interconnect) is a low-cost, <b>processor-independent</b> bus on the
      motherboard. Click each signal to see its job — one trick is central: the <code>AD</code> lines carry
      address <i>and</i> data.</Frame>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {sigs.map((s, i) => <button key={i} onClick={() => setSel(i)} style={{ ...btn(sel === i, s.col), fontFamily: "monospace" }}>{s.k}</button>)}
      </div>
      <div style={{ ...box, borderColor: sigs[sel].col + "66" }}>
        <div style={{ color: sigs[sel].col, fontWeight: 700, fontSize: 13, fontFamily: "monospace", marginBottom: 6 }}>{sigs[sel].k}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{sigs[sel].d}</div>
      </div>
      <Key color={C.purple}>Multiplexing address and data onto one set of <code>AD</code> lines saves pins. A device
      on PCI appears to the processor as if wired straight to it — its registers live in the processor's
      address space. The two parties are the <b>initiator</b> (master) and the <b>target</b> (slave).</Key>
    </div>
  );
}

// ── Section 3: PCI burst read trace ──
function PciReadWidget() {
  const steps = [
    { ad: "Address", note: "Initiator asserts FRAME#, drives the address on AD and the command on C/BE#." },
    { ad: "—", note: "Target decodes; asserts DEVSEL# — 'that's me'. Initiator asserts IRDY#." },
    { ad: "Data #1", note: "Target asserts TRDY# and drives the first data word on the SAME AD lines." },
    { ad: "Data #2", note: "Both ready → second word transfers. One word per clock now." },
    { ad: "Data #3", note: "Third word — a burst: address sent once, many words back-to-back." },
    { ad: "Data #4", note: "Fourth word. Initiator drops FRAME# on the last word; transfer ends." },
  ];
  const [t, setT] = useState(0);
  const st = steps[Math.min(t, steps.length - 1)];
  const isData = st.ad.startsWith("Data");
  return (
    <div>
      <Frame>Watch a PCI <b>burst read</b>: one address, then several data words on the very same wires. Step
      the clock.</Frame>
      <div style={{ ...box, marginBottom: 10, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.muted }}>AD lines carry →</div>
        <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "monospace", color: isData ? C.teal : st.ad === "Address" ? C.accent : C.muted, margin: "6px 0" }}>{st.ad}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {["FRAME#", "IRDY#", "TRDY#", "DEVSEL#"].map((s) => {
            const active = (s === "FRAME#" && t <= 4) || (s === "IRDY#" && t >= 1) || (s === "TRDY#" && t >= 2) || (s === "DEVSEL#" && t >= 1);
            return <span key={s} style={{ fontSize: 10, fontFamily: "monospace", padding: "3px 6px", borderRadius: 4, color: active ? "#fff" : C.muted, background: active ? C.accentGlow : C.card, border: `1px solid ${C.border}` }}>{s}</span>;
          })}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: C.muted, minHeight: 34, textAlign: "center" }}>{st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => setT((x) => Math.min(steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Clock ▶ ({Math.min(t + 1, steps.length)}/{steps.length})</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.teal}>Sending the address once and then a <b>burst</b> of consecutive words is exactly what DMA
      block transfers want (Unit 5.4). IRDY#/TRDY# are the synchronous handshake (Unit 5.5) that paces each
      word.</Key>
    </div>
  );
}

// ── Section 4: SCSI initiator/target + bus phases ──
function ScsiWidget() {
  const phases = [
    { p: "Arbitration", d: "A device wins control of the shared SCSI bus (each device has a SCSI ID and priority)." },
    { p: "Selection", d: "The initiator selects a target by its ID." },
    { p: "Command", d: "The initiator sends the command — e.g. 'read block N'." },
    { p: "Data", d: "The block is transferred. A slow target may disconnect here and reconnect later, freeing the bus." },
    { p: "Status / Message", d: "The target reports completion; the transaction ends." },
  ];
  const [i, setI] = useState(0);
  return (
    <div>
      <Frame>SCSI (Small Computer System Interface) hangs storage devices off one controller in a daisy-chain.
      A transaction walks through a fixed set of <b>bus phases</b>. Step through them.</Frame>
      <div style={{ display: "flex", gap: 4, marginBottom: 12, flexWrap: "wrap" }}>
        {phases.map((ph, k) => (
          <div key={k} style={{ flex: 1, minWidth: 70, textAlign: "center", padding: "8px 4px", borderRadius: 6, fontSize: 10.5, color: k <= i ? "#fff" : C.muted, background: k === i ? C.accentGlow : k < i ? C.accentGlow + "66" : C.card, border: `1px solid ${C.border}` }}>{ph.p}</div>
        ))}
      </div>
      <div style={{ ...box, minHeight: 60 }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{phases[i].p}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{phases[i].d}</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setI((x) => Math.min(phases.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Next phase ▶</button>
        <button onClick={() => setI(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.orange}>Every SCSI unit is an <b>initiator</b> (issues commands — usually the controller) or a
      <b> target</b> (carries them out). PCI is the <b>system interconnect</b> near the processor; SCSI is a
      <b> peripheral bus</b> hanging storage off one PCI controller — they work at different levels of the
      machine. Modern SATA/SAS descend from SCSI's initiator/target model.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "What connects the processor bus to a standard I/O bus like PCI?",
      options: ["A DMA controller", "A bridge", "An interrupt handler", "A cache"],
      answer: 1, explain: "A bridge joins the processor bus to the PCI bus (and hosts main memory), translating transactions between them." },
    { q: "What is special about PCI's AD lines?",
      options: ["They only carry addresses", "They carry the address first, then the data, multiplexed on the same wires", "They are the clock", "They select interrupts"],
      answer: 1, explain: "PCI time-multiplexes address and data onto one set of AD lines, saving pins." },
    { q: "Why does a PCI burst read suit DMA block transfers?",
      options: ["It disables interrupts", "One address is sent, then many consecutive data words transfer back-to-back", "It needs no clock", "It uses SCSI phases"],
      answer: 1, explain: "A burst sends the address once and streams consecutive words — exactly the block pattern DMA moves." },
    { q: "In SCSI, what are the initiator and target?",
      options: ["Two clocks", "The initiator issues commands (usually the controller); the target carries them out (the device)", "Two bridges", "Address and data lines"],
      answer: 1, explain: "The initiator (controller) issues commands; the target (e.g. a disk) executes them, across phases like Selection, Command, Data, Status." },
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
          {score === 4 ? "Excellent — you can read PCI and SCSI at a glance." : score >= 2 ? "Good. Re-step the 'PCI Read' burst to lock in AD multiplexing." : "Revisit 'PCI Signals' and 'PCI Read' — they carry this unit."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.6 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've seen the whole I/O toolkit made real in PCI and SCSI.<br /><br />
            <strong style={{ color: C.accent }}>Next up: the Module 5 Capstone — Design an I/O Flow.</strong>
            Put polling, interrupts, DMA, buses and standards together to move a disk block end to end.
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
    { id: "read", label: "PCI Read" },
    { id: "scsi", label: "SCSI" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Why devices need a standard bus</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The PCI signals</h3><PciSignalsWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>A PCI burst read</h3><PciReadWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The SCSI bus: initiator, target, phases</h3><ScsiWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.6.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔌</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.6</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Standard I/O Interfaces: PCI &amp; SCSI</div>
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
