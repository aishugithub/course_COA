// Unit2_3.jsx — Module 2 › Unit 2.3 — "Fetching a Word from Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 3 (Execution of Complete Instructions,
// Hamacher §5.1–5.3) — the single-bus fetch micro-sequence.
// Arc: why fetch (register vs memory) → the single-bus datapath → the fetch
// sequence step-by-step (MAR←PC, Read, MDR←M[MAR], IR←MDR) → waiting for MFC
// (memory is slow) → quiz.
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

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Need: a register is next door, memory is across town
// ══════════════════════════════════════════════════════════════════
function TheNeed() {
  const [where, setWhere] = useState("reg"); // "reg" | "mem"
  const isReg = where === "reg";

  // Clock strip: register read finishes in ONE pulse; a memory read spans
  // several (address out, wait, wait, data back).
  const pulses = isReg
    ? [{ lbl: "R2 ← [R1]", kind: "go" }]
    : [{ lbl: "addr out", kind: "go" }, { lbl: "wait", kind: "wait" }, { lbl: "wait", kind: "wait" }, { lbl: "data in", kind: "go" }];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In Unit 2.1 a value crossed from <strong style={{ color: C.teal }}>register to register</strong> in a
        <strong style={{ color: C.text }}> single clock pulse</strong> — registers sit side by side <em>inside</em> the
        processor, wired together. But the <strong style={{ color: C.text }}>instructions live in main memory, outside the
        processor</strong>, and reaching out there <strong style={{ color: C.orange }}>takes several clock cycles</strong>.
        Toggle and watch the clock.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["reg", "Register → register", C.teal], ["mem", "Memory → register", C.orange]].map(([k, label, col]) => (
          <button key={k} onClick={() => setWhere(k)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: where === k ? col + "22" : C.card,
            border: `2px solid ${where === k ? col : C.border}`, color: where === k ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      {/* the scene: processor boundary (registers inside) + memory outside */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 10 }}>
        <svg viewBox="0 0 520 190" style={{ width: "100%", display: "block" }} key={where}>
          {/* processor boundary */}
          <rect x={16} y={22} width={330} height={150} rx={12} fill={C.bg} stroke={C.purple} strokeWidth={1.6} strokeDasharray="6 4" />
          <text x={30} y={40} fill={C.purple} fontSize={10} fontWeight="700">PROCESSOR — registers live in here</text>

          {isReg ? (
            <>
              {/* R1 → R2 inside the processor, one pulse */}
              <rect x={70} y={80} width={90} height={44} rx={8} fill={C.teal + "1E"} stroke={C.teal} strokeWidth={1.8} />
              <text x={115} y={100} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">R1</text>
              <text x={115} y={116} textAnchor="middle" fill={C.text} fontSize={11} fontFamily="monospace">1011</text>
              <rect x={210} y={80} width={90} height={44} rx={8} fill={C.card} stroke={C.teal} strokeWidth={1.8} />
              <text x={255} y={100} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">R2</text>
              <line x1={160} y1={102} x2={210} y2={102} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#u23need)" />
              <circle r={4} fill={C.teal}><animate attributeName="cx" values="162;208" dur="0.9s" repeatCount="indefinite" /><animate attributeName="cy" values="102;102" dur="0.9s" repeatCount="indefinite" /></circle>
              <text x={185} y={92} textAnchor="middle" fill={C.teal} fontSize={9}>1 pulse</text>
            </>
          ) : (
            <>
              {/* a destination register inside, main memory outside */}
              <rect x={60} y={80} width={90} height={44} rx={8} fill={C.card} stroke={C.teal} strokeWidth={1.8} />
              <text x={105} y={100} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">IR / R</text>
              <text x={105} y={116} textAnchor="middle" fill={C.muted} fontSize={9}>destination</text>
              <rect x={380} y={60} width={130} height={84} rx={10} fill={C.surface} stroke={C.red} strokeWidth={1.8} />
              <text x={445} y={90} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="700">MAIN MEMORY</text>
              <text x={445} y={108} textAnchor="middle" fill={C.muted} fontSize={9}>outside the processor</text>
              {/* address out */}
              <line x1={150} y1={92} x2={380} y2={92} stroke={C.orange} strokeWidth={2} markerEnd="url(#u23need2)" />
              <text x={265} y={84} textAnchor="middle" fill={C.orange} fontSize={9}>① address + Read →</text>
              <circle r={3.5} fill={C.orange}><animate attributeName="cx" values="152;378" dur="3.6s" repeatCount="indefinite" /><animate attributeName="cy" values="92;92" dur="3.6s" repeatCount="indefinite" /></circle>
              {/* data back */}
              <line x1={380} y1={120} x2={150} y2={120} stroke={C.teal} strokeWidth={2} markerEnd="url(#u23need)" />
              <text x={265} y={138} textAnchor="middle" fill={C.teal} fontSize={9}>② …wait… then data back ←</text>
              <circle r={3.5} fill={C.teal}><animate attributeName="cx" values="378;152" dur="3.6s" begin="2.4s" repeatCount="indefinite" /><animate attributeName="cy" values="120;120" dur="3.6s" begin="2.4s" repeatCount="indefinite" /></circle>
            </>
          )}
          <defs>
            <marker id="u23need" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.teal} /></marker>
            <marker id="u23need2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.orange} /></marker>
          </defs>
        </svg>
      </div>

      {/* clock-pulse strip */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, alignItems: "center" }}>
        <span style={{ color: C.muted, fontSize: 11, width: 44 }}>clock:</span>
        {pulses.map((p, i) => (
          <div key={i} style={{
            flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 7, fontSize: 10, fontWeight: 700,
            background: p.kind === "wait" ? C.card : (isReg ? C.teal : C.orange) + "22",
            border: `1.5px solid ${p.kind === "wait" ? C.border : (isReg ? C.teal : C.orange)}`,
            color: p.kind === "wait" ? C.muted : (isReg ? C.teal : C.orange),
          }}>
            <div style={{ fontFamily: "monospace" }}>⌐{i + 1}</div>
            <div>{p.lbl}</div>
          </div>
        ))}
        <span style={{ color: isReg ? C.teal : C.orange, fontSize: 12, fontWeight: 700, marginLeft: 4 }}>
          {isReg ? "1 cycle" : `${pulses.length} cycles`}
        </span>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>
        {isReg
          ? <span>A register read is <strong style={{ color: C.teal }}>instant</strong> — both registers are inside the processor, already wired, so <code style={{ fontFamily: "monospace" }}>R2 ← [R1]</code> finishes in one clock. This is what Unit 2.1 handled.</span>
          : <span>Memory is <strong style={{ color: C.text }}>outside</strong> the processor. The CPU must <strong style={{ color: C.orange }}>put an address on the address lines</strong>, raise <strong style={{ color: C.orange }}>Read</strong>, then <strong style={{ color: C.red }}>wait</strong> several cycles until memory answers. That whole ritual is <strong style={{ color: C.text }}>fetching a word</strong>.</span>}
      </div>

      <Key color={C.accent}>
        Registers are <strong style={{ color: C.text }}>inside</strong> the processor — a transfer between them is one clock
        pulse. Main memory is <strong style={{ color: C.text }}>outside</strong>, so reaching it is
        <strong style={{ color: C.text }}> send address → raise Read → wait several cycles for the reply</strong>. Getting that
        ritual right is what "fetch" means.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The single-bus datapath (reveal MAR/MDR as the gateway)
// ══════════════════════════════════════════════════════════════════
function SingleBusDatapath() {
  const [reveal, setReveal] = useState(0); // 0..4 pieces shown

  const pieces = [
    "Zoom IN. This bus lives INSIDE the processor — it wires the CPU's own components (PC, IR, registers, ALU) to one another. It is NOT the Unit-1 system bus, which connected whole units: CPU, memory and I/O.",
    "PC, IR, the general registers and the ALU all hang off this one shared internal bus. One bus means one transfer per clock.",
    "MAR and MDR sit at the processor's edge. They are on the internal bus too — but they also face OUTWARD, toward main memory.",
    "The link from MAR / MDR out to main memory is the EXTERNAL memory bus: address bus (driven by MAR), data bus (through MDR), and a control bus (Read/Write, MFC). The internal bus never touches memory directly.",
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Before we trace the fetch, meet the road it drives on. We're <strong style={{ color: C.text }}>zooming in</strong> to the
        bus <em>inside</em> the processor — a different bus from the Unit-1 system bus. Reveal it piece by piece.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 250" style={{ width: "100%", display: "block" }}>
          {/* processor boundary */}
          <rect x={12} y={20} width={338} height={215} rx={12} fill={C.bg} stroke={C.purple} strokeWidth={1.6} strokeDasharray="6 4" />
          <text x={26} y={38} fill={C.purple} fontSize={10.5} fontWeight="700">PROCESSOR (we are inside the CPU)</text>

          {/* internal bus spine */}
          <line x1={40} y1={100} x2={330} y2={100} stroke={C.accent} strokeWidth={5} opacity={reveal >= 1 ? 1 : 0.22} style={{ transition: "opacity 0.3s" }} />
          <text x={150} y={92} textAnchor="middle" fill={C.accent} fontSize={10} fontWeight="700" opacity={reveal >= 1 ? 1 : 0.22}>internal processor bus</text>

          {/* PC, IR, ALU hanging below the bus */}
          {[["PC", 70, C.teal], ["IR", 140, C.teal], ["ALU", 210, C.purple]].map(([lbl, x, col]) => (
            <g key={lbl} opacity={reveal >= 1 ? 1 : 0.22} style={{ transition: "opacity 0.3s" }}>
              <line x1={x} y1={100} x2={x} y2={118} stroke={C.border} strokeWidth={1.5} />
              <rect x={x - 28} y={118} width={56} height={28} rx={6} fill={C.card} stroke={col} strokeWidth={1.7} />
              <text x={x} y={136} textAnchor="middle" fill={col} fontSize={11} fontWeight="700">{lbl}</text>
            </g>
          ))}

          {/* MAR (above bus) + MDR (below bus) at the right edge */}
          <g opacity={reveal >= 2 ? 1 : 0.2} style={{ transition: "opacity 0.3s" }}>
            <line x1={300} y1={85} x2={300} y2={100} stroke={C.border} strokeWidth={1.5} />
            <rect x={273} y={55} width={54} height={30} rx={6} fill={C.card} stroke={C.orange} strokeWidth={1.8} />
            <text x={300} y={74} textAnchor="middle" fill={C.orange} fontSize={11} fontWeight="700">MAR</text>
            <line x1={300} y1={100} x2={300} y2={150} stroke={C.border} strokeWidth={1.5} />
            <rect x={273} y={150} width={54} height={30} rx={6} fill={C.card} stroke={C.teal} strokeWidth={1.8} />
            <text x={300} y={169} textAnchor="middle" fill={C.teal} fontSize={11} fontWeight="700">MDR</text>
          </g>

          {/* main memory + the EXTERNAL memory bus */}
          <g opacity={reveal >= 3 ? 1 : 0.18} style={{ transition: "opacity 0.3s" }}>
            <rect x={410} y={48} width={95} height={150} rx={10} fill={C.surface} stroke={C.red} strokeWidth={1.8} />
            <text x={457} y={72} textAnchor="middle" fill={C.red} fontSize={11} fontWeight="700">MAIN</text>
            <text x={457} y={88} textAnchor="middle" fill={C.red} fontSize={11} fontWeight="700">MEMORY</text>
            <text x={457} y={108} textAnchor="middle" fill={C.muted} fontSize={8}>outside the CPU</text>
            {/* address bus: MAR → memory */}
            <line x1={327} y1={70} x2={410} y2={70} stroke={C.orange} strokeWidth={2.5} markerEnd="url(#u23ab)" />
            <text x={368} y={62} textAnchor="middle" fill={C.orange} fontSize={8.5} fontWeight="700">address bus</text>
            {/* data bus: MDR ↔ memory */}
            <line x1={327} y1={165} x2={410} y2={165} stroke={C.teal} strokeWidth={2.5} markerStart="url(#u23dbs)" markerEnd="url(#u23db)" />
            <text x={368} y={157} textAnchor="middle" fill={C.teal} fontSize={8.5} fontWeight="700">data bus</text>
            {/* control bus */}
            <line x1={340} y1={210} x2={457} y2={210} stroke={C.yellow} strokeWidth={2.5} markerStart="url(#u23cbs)" markerEnd="url(#u23cb)" />
            <line x1={340} y1={210} x2={340} y2={100} stroke={C.yellow} strokeWidth={1.5} opacity={0.5} strokeDasharray="3 3" />
            <line x1={457} y1={198} x2={457} y2={210} stroke={C.yellow} strokeWidth={1.5} opacity={0.6} />
            <text x={398} y={224} textAnchor="middle" fill={C.yellow} fontSize={8.5} fontWeight="700">control bus (Read/Write, MFC)</text>
            {/* boundary crossing label */}
            <text x={368} y={40} textAnchor="middle" fill={C.muted} fontSize={8}>external memory bus →</text>
          </g>

          <defs>
            <marker id="u23ab" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.orange} /></marker>
            <marker id="u23db" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.teal} /></marker>
            <marker id="u23dbs" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6 Z" fill={C.teal} /></marker>
            <marker id="u23cb" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.yellow} /></marker>
            <marker id="u23cbs" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6 Z" fill={C.yellow} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 56, lineHeight: 1.6, marginBottom: 10 }}>
        {reveal === 0 ? "Press Reveal to build up the datapath." : pieces[reveal - 1]}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setReveal(v => Math.min(4, v + 1))} disabled={reveal === 4} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: reveal === 4 ? C.card : C.accentGlow, color: reveal === 4 ? C.muted : "#fff",
          cursor: reveal === 4 ? "default" : "pointer",
        }}>Reveal ▶ ({reveal} / 4)</button>
        <button onClick={() => setReveal(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.yellow}>
        Two different buses, easy to confuse: the <strong style={{ color: C.accent }}>internal processor bus</strong> wires the
        CPU's own components together (this unit's zoom-in); the <strong style={{ color: C.text }}>external memory bus</strong>
        (address + data + control) carries <strong style={{ color: C.orange }}>MAR</strong>'s address and
        <strong style={{ color: C.teal }}> MDR</strong>'s data to main memory. MAR and MDR are the only bridge between them.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Fetching a WORD from memory into a register (full animation)
//  We execute Load R1, A: fetch the data word stored at address A from main
//  memory into register R1 (the register file). The control unit fires MARin,
//  Read, then MDRout/R1in; the three external buses each carry animated
//  traffic — address out, data back, Read out + MFC back on the control bus.
// ══════════════════════════════════════════════════════════════════
function FetchSequence() {
  const [step, setStep] = useState(0);

  // Story: Load R1, A — already decoded. A = address 1000, M[1000] = 25.
  // After the fetch, register R1 holds 25.
  // bus: "int-ir-mar" | "addr" | "data" | "int-mdr-r1" | null
  const steps = [
    { beat: "—", rtl: "—", sig: [], bus: null, waiting: false, read: false, mfc: false,
      ir: "Load R1,A", r1: "—", mar: "—", mdr: "—",
      narr: "The instruction Load R1, A is decoded in IR. It says: fetch the word at address A (1000) from memory into R1. Let's do exactly that." },
    { beat: "T1", rtl: "MAR ← A", sig: ["MARin"], bus: "int-ir-mar", waiting: false, read: false, mfc: false,
      ir: "Load R1,A", r1: "—", mar: "1000", mdr: "—",
      narr: "Control fires MARin. The operand address A (1000), taken from the instruction, rides the internal bus into MAR — this is the memory word we want." },
    { beat: "T2", rtl: "Read", sig: ["Read"], bus: "addr", waiting: false, read: true, mfc: false,
      ir: "Load R1,A", r1: "—", mar: "1000", mdr: "—",
      narr: "MAR holds the address, so control raises Read. The address 1000 goes out on the ADDRESS bus, and Read travels out on the CONTROL bus to memory." },
    { beat: "wait", rtl: "wait for MFC", sig: [], bus: "addr", waiting: true, read: true, mfc: false,
      ir: "Load R1,A", r1: "—", mar: "1000", mdr: "—",
      narr: "Memory is slow. The CPU waits — often several clock cycles — with the address and Read still asserted, until the word is ready." },
    { beat: "—", rtl: "MDR ← M[MAR]", sig: ["MFC"], bus: "data", waiting: false, read: false, mfc: true,
      ir: "Load R1,A", r1: "—", mar: "1000", mdr: "25",
      narr: "Memory finishes and sends MFC back on the CONTROL bus. The word 25 comes back on the DATA bus into MDR." },
    { beat: "T3", rtl: "R1 ← [MDR]", sig: ["MDRout", "R1in"], bus: "int-mdr-r1", waiting: false, read: false, mfc: false,
      ir: "Load R1,A", r1: "25", mar: "1000", mdr: "25",
      narr: "Control fires MDRout and R1in: the word 25 moves from MDR over the internal bus into R1. The word has been fetched from memory into the register file — R1 = 25." },
  ];
  const s = steps[step];
  const active = (name) => s.sig.includes(name);

  const Sig = ({ name, y, input }) => {
    const on = active(name);
    const col = input ? C.teal : C.green;
    return (
      <g>
        <rect x={16} y={y} width={80} height={22} rx={5} fill={on ? col + "26" : C.card} stroke={on ? col : C.border} strokeWidth={on ? 2 : 1} style={{ transition: "all 0.2s" }} />
        <text x={56} y={y + 15} textAnchor="middle" fill={on ? col : C.muted} fontSize={10} fontWeight="700">{name}{on ? " ●" : ""}</text>
      </g>
    );
  };

  // a moving packet along ANY straight segment (from→to), while its bus is active
  const Packet = ({ x1, y1, x2, y2, label, color }) => (
    <g>
      <rect x={-16} y={-9} width={32} height={18} rx={4} fill={color} />
      <text y={4} textAnchor="middle" fill="#0D1117" fontSize={8} fontWeight="800">{label}</text>
      <animateMotion dur="1s" repeatCount="indefinite" path={`M ${x1} ${y1} L ${x2} ${y2}`} />
    </g>
  );

  const Reg = ({ x, y, w, label, val, col }) => {
    const has = val !== "—";
    return (
      <g>
        <rect x={x} y={y} width={w} height={30} rx={6} fill={has ? col + "1E" : C.card} stroke={has ? col : C.border} strokeWidth={1.7} style={{ transition: "all 0.25s" }} />
        <text x={x + w / 2} y={y + 13} textAnchor="middle" fill={col} fontSize={10} fontWeight="700">{label}</text>
        <text x={x + w / 2} y={y + 25} textAnchor="middle" fill={has ? C.text : C.muted} fontSize={8} fontFamily="monospace">{val}</text>
      </g>
    );
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Now fetch a real <strong style={{ color: C.text }}>word from memory into the register file</strong>, using the Load
        instruction. We execute <code style={{ color: C.purple, fontFamily: "monospace" }}>Load R1, A</code>: bring the word
        stored at address A (1000) into R1. The <strong style={{ color: C.text }}>control unit</strong> fires the signals; the
        three external buses each carry animated traffic. <code style={{ color: C.teal, fontFamily: "monospace" }}>M[1000] = 25</code>.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 10 }}>
        <svg viewBox="0 0 540 290" style={{ width: "100%", display: "block" }}>
          {/* control unit */}
          <rect x={8} y={20} width={98} height={250} rx={10} fill={C.surface} stroke={C.purple} strokeWidth={1.6} />
          <text x={57} y={38} textAnchor="middle" fill={C.purple} fontSize={10} fontWeight="700">CONTROL UNIT</text>
          <Sig name="MARin" y={48} />
          <Sig name="Read" y={78} />
          <Sig name="MDRout" y={120} />
          <Sig name="R1in" y={150} />
          <text x={57} y={222} textAnchor="middle" fill={C.muted} fontSize={8}>input from memory ↓</text>
          <Sig name="MFC" y={230} input />

          {/* processor boundary */}
          <rect x={118} y={20} width={296} height={250} rx={10} fill={C.bg} stroke={C.purple} strokeWidth={1.3} strokeDasharray="5 4" />
          <text x={130} y={36} fill={C.purple} fontSize={9} fontWeight="700">PROCESSOR</text>

          {/* internal bus */}
          <line x1={135} y1={95} x2={395} y2={95} stroke={s.bus && s.bus.startsWith("int") ? C.accent : C.border} strokeWidth={s.bus && s.bus.startsWith("int") ? 5 : 3} style={{ transition: "all 0.2s" }} />
          <text x={195} y={88} fill={C.accent} fontSize={8.5} fontWeight="700">internal bus</text>

          {/* IR (holds the instruction) + R1 (register file, the destination) */}
          <line x1={168} y1={95} x2={168} y2={115} stroke={C.border} strokeWidth={1.4} />
          <Reg x={135} y={115} w={66} label="IR" val={s.ir} col={C.purple} />
          <line x1={245} y1={95} x2={245} y2={115} stroke={C.border} strokeWidth={1.4} />
          <Reg x={220} y={115} w={50} label="R1" val={s.r1} col={C.green} />
          {/* MAR above bus, MDR below bus (right edge) */}
          <line x1={368} y1={78} x2={368} y2={95} stroke={C.border} strokeWidth={1.4} />
          <Reg x={343} y={48} w={54} label="MAR" val={s.mar} col={C.orange} />
          <line x1={368} y1={95} x2={368} y2={150} stroke={C.border} strokeWidth={1.4} />
          <Reg x={343} y={150} w={54} label="MDR" val={s.mdr} col={C.teal} />

          {/* main memory */}
          <rect x={452} y={45} width={80} height={200} rx={10} fill={C.surface} stroke={C.red} strokeWidth={1.6} />
          <text x={492} y={70} textAnchor="middle" fill={C.red} fontSize={10} fontWeight="700">MAIN</text>
          <text x={492} y={84} textAnchor="middle" fill={C.red} fontSize={10} fontWeight="700">MEMORY</text>
          <rect x={462} y={100} width={60} height={30} rx={4} fill={C.card} stroke={s.mdr !== "—" ? C.accent : C.border} />
          <text x={492} y={112} textAnchor="middle" fill={C.muted} fontSize={7}>M[1000]</text>
          <text x={492} y={124} textAnchor="middle" fill={C.text} fontSize={11} fontFamily="monospace" fontWeight="700">25</text>

          {/* address bus: MAR → memory */}
          <line x1={397} y1={63} x2={452} y2={63} stroke={s.read || s.waiting ? C.orange : C.border} strokeWidth={s.read || s.waiting ? 3 : 2} style={{ transition: "all 0.2s" }} markerEnd="url(#u23f_ab)" />
          <text x={424} y={56} textAnchor="middle" fill={C.orange} fontSize={7.5} fontWeight="700">address bus</text>
          {/* data bus: memory → MDR */}
          <line x1={452} y1={165} x2={397} y2={165} stroke={s.bus === "data" ? C.teal : C.border} strokeWidth={s.bus === "data" ? 3 : 2} style={{ transition: "all 0.2s" }} markerEnd="url(#u23f_db)" />
          <text x={424} y={158} textAnchor="middle" fill={C.teal} fontSize={7.5} fontWeight="700">data bus</text>
          {/* control bus: Read out / MFC in (L-shaped: processor ↓ then → memory) */}
          <line x1={330} y1={258} x2={492} y2={258} stroke={s.read || s.mfc ? C.yellow : C.border} strokeWidth={s.read || s.mfc ? 3 : 2} style={{ transition: "all 0.2s" }} />
          <line x1={330} y1={258} x2={330} y2={95} stroke={s.read || s.mfc ? C.yellow : C.border} strokeWidth={1.4} opacity={0.5} strokeDasharray="3 3" />
          <line x1={492} y1={245} x2={492} y2={258} stroke={s.read || s.mfc ? C.yellow : C.border} strokeWidth={1.4} opacity={0.6} />
          <text x={405} y={283} textAnchor="middle" fill={C.yellow} fontSize={7.5} fontWeight="700">control bus</text>

          {/* moving packets on each active bus */}
          {s.bus === "int-ir-mar" && <Packet x1={168} y1={95} x2={368} y2={95} label="1000" color={C.orange} />}
          {s.bus === "int-mdr-r1" && <Packet x1={368} y1={95} x2={245} y2={95} label="25" color={C.green} />}
          {(s.read || s.waiting) && <Packet x1={399} y1={63} x2={450} y2={63} label="1000" color={C.orange} />}
          {s.bus === "data" && <Packet x1={450} y1={165} x2={399} y2={165} label="25" color={C.teal} />}
          {/* control-bus packets: Read travels OUT to memory; MFC comes BACK */}
          {(s.read || s.waiting) && <Packet x1={340} y1={258} x2={486} y2={258} label="Read" color={C.yellow} />}
          {s.mfc && <Packet x1={486} y1={258} x2={340} y2={258} label="MFC" color={C.yellow} />}

          {/* waiting indicator */}
          {s.waiting && (
            <text x={424} y={100} textAnchor="middle" fill={C.red} fontSize={9} fontWeight="700">⏳ waiting…
              <animate attributeName="opacity" values="0.35;1;0.35" dur="1s" repeatCount="indefinite" />
            </text>
          )}

          <defs>
            <marker id="u23f_ab" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.orange} /></marker>
            <marker id="u23f_db" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.teal} /></marker>
          </defs>
        </svg>
      </div>

      {/* RTL + beat + narration */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <div style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.waiting ? C.red + "22" : C.accentGlow, border: `1.5px solid ${s.waiting ? C.red : C.accent}`, color: s.waiting ? C.red : "#fff" }}>
          {s.beat === "—" ? (step === 0 ? "ready" : "MFC") : s.beat}
        </div>
        <div style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: step === 0 ? C.muted : C.accent, fontWeight: 700 }}>
          RTL: {s.rtl}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 44, lineHeight: 1.6, marginBottom: 10 }}>
        {s.narr}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStep(v => Math.min(steps.length - 1, v + 1))} disabled={step === steps.length - 1} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: step === steps.length - 1 ? C.card : C.accentGlow, color: step === steps.length - 1 ? C.muted : "#fff",
          cursor: step === steps.length - 1 ? "default" : "pointer",
        }}>Next step ▶ ({step} / {steps.length - 1})</button>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.accent}>
        Fetching a word from memory is the control unit firing signals in order:
        <code style={{ fontFamily: "monospace" }}> MARin</code> (operand address into MAR),
        <code style={{ fontFamily: "monospace" }}> Read</code> (address out, Read out on the control bus), wait for
        <strong style={{ color: C.teal }}> MFC</strong> (the word comes back on the data bus into MDR), then
        <code style={{ fontFamily: "monospace" }}> MDRout·R1in</code> (the word into R1). That is how
        <strong style={{ color: C.text }}> Load R1, A</strong> pulls a word into the register file.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Waiting for MFC (memory is slower than the CPU)
// ══════════════════════════════════════════════════════════════════
function WaitForMFC() {
  const [wait, setWait] = useState(true); // does the CPU wait for MFC?

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Why the extra "wait for MFC" beat? Because <strong style={{ color: C.text }}>memory is far slower than the
        processor</strong>. After Read is raised, the word is <em>not</em> in MDR yet. Memory signals it has finished by raising
        <strong style={{ color: C.teal }}> MFC</strong> (Memory-Function-Completed). Toggle whether the CPU waits, and see what
        lands in IR.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[[true, "CPU waits for MFC ✓", C.green], [false, "CPU rushes ahead ✗", C.red]].map(([v, label, col]) => (
          <button key={String(v)} onClick={() => setWait(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: wait === v ? col + "22" : C.card,
            border: `2px solid ${wait === v ? col : C.border}`, color: wait === v ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 150" style={{ width: "100%", display: "block" }}>
          {/* CPU clock ticks vs memory readiness bar */}
          <text x={40} y={30} fill={C.muted} fontSize={10}>CPU clock</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={120 + i * 70} y1={18} x2={120 + i * 70} y2={40} stroke={C.accent} strokeWidth={2} />
          ))}
          <line x1={120} y1={40} x2={400} y2={40} stroke={C.accent} strokeWidth={1.5} />

          <text x={40} y={80} fill={C.muted} fontSize={10}>memory busy</text>
          <rect x={120} y={64} width={210} height={20} rx={4} fill={C.orange + "44"} stroke={C.orange} strokeWidth={1.5} />
          <text x={225} y={78} textAnchor="middle" fill={C.orange} fontSize={10} fontWeight="700">reading… (3 CPU clocks)</text>
          <rect x={330} y={64} width={20} height={20} rx={4} fill={C.teal + "44"} stroke={C.teal} strokeWidth={1.5} />
          <text x={340} y={100} textAnchor="middle" fill={C.teal} fontSize={9} fontWeight="700">MFC</text>

          {/* sample point */}
          <line x1={wait ? 340 : 190} y1={110} x2={wait ? 340 : 190} y2={135} stroke={wait ? C.green : C.red} strokeWidth={2.5} />
          <text x={wait ? 340 : 190} y={148} textAnchor="middle" fill={wait ? C.green : C.red} fontSize={10} fontWeight="700">
            {wait ? "MDR sampled here ✓" : "MDR sampled here ✗"}
          </text>
        </svg>
      </div>

      <div style={{ background: wait ? C.green + "12" : C.red + "12", border: `1px solid ${wait ? C.green : C.red}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {wait
          ? <span>✓ The CPU freezes the fetch until MFC arrives, then samples MDR. IR gets the <strong style={{ color: C.green }}>correct instruction word</strong>. Correct, but those idle wait-clocks are exactly why memory is the bottleneck.</span>
          : <span>✗ The CPU samples MDR before memory has finished. IR loads <strong style={{ color: C.red }}>garbage</strong> — a half-formed or stale word — and the whole program derails. This is why the MFC handshake exists.</span>}
      </div>

      <Key color={C.teal}>
        <strong style={{ color: C.teal }}>MFC</strong> is memory's "I'm done" handshake. The CPU raises Read, then
        <strong style={{ color: C.text }}> waits</strong> for MFC before trusting MDR. Slow memory means more wait-clocks — the
        motivation for caches (Module 3) and for multiple buses (next units), which shave beats off exactly this path.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, instant feedback, completion card
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "Why can't the CPU read an instruction from memory the way it reads a register?",
      options: [
        "Memory stores instructions in a different language",
        "Memory is external — the CPU must send an address, raise Read, and wait for a reply",
        "Registers are read-only, memory is read/write",
        "Instructions must be decrypted first",
      ],
      answer: 1,
      explain: "A register sits inside the CPU with wires already touching the bus. Memory is outside and reached only through MAR/MDR — send an address, raise Read, and wait. That multi-step ritual is 'fetching a word.'",
    },
    {
      q: "On the single-bus datapath, how does the processor reach main memory?",
      options: [
        "Any register can drive the address and data straight onto memory",
        "Through MAR (address) and MDR (data) only — the two-register bridge",
        "Through the ALU",
        "Through the program counter directly",
      ],
      answer: 1,
      explain: "Main memory is external. MAR holds the address going out, MDR holds the data coming back. Nothing on the internal bus touches memory directly — the MAR/MDR rule from Unit 2.1.",
    },
    {
      q: "What is the correct order of the fetch micro-sequence?",
      options: [
        "IR ← [MDR]; then MAR ← [PC]; then MDR ← M[MAR]",
        "MAR ← [PC], Read; wait for MFC, MDR ← M[MAR], PC ← PC + 4; IR ← [MDR]",
        "PC ← PC + 4; IR ← M[PC]; MAR ← [MDR]",
        "MDR ← [PC]; MAR ← [MDR]; IR ← [MAR]",
      ],
      answer: 1,
      explain: "Address out first (MAR ← [PC] + Read), then once memory answers the word arrives in MDR and PC advances, then the word is copied MDR → IR ready for decoding.",
    },
    {
      q: "What does the MFC signal do during a fetch?",
      options: [
        "It multiplies the fetched value",
        "It tells the CPU that memory has finished, so MDR now holds valid data",
        "It clears the instruction register",
        "It selects which register to load",
      ],
      answer: 1,
      explain: "Memory is slower than the CPU. MFC (Memory-Function-Completed) is memory's 'I'm done' handshake. If the CPU sampled MDR before MFC, it would latch garbage into IR.",
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
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🎉" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Perfect! You can trace a fetch beat by beat, MFC and all." :
            score >= 2 ? "Good work! Replay 'The Fetch Sequence' and 'Waiting for MFC' to lock it in." :
              "Revisit 'The Single-Bus Datapath' and 'The Fetch Sequence' — the whole unit rests on those two."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now walk the single-bus fetch: MAR ← [PC] + Read, wait for MFC, MDR ← M[MAR], IR ← [MDR] — and explain why
            the MFC handshake is unavoidable.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.4 — Storing a Word in Memory.</strong>{" "}
            Reading pulled a word IN. Now send a result the other way — and watch which register feeds MDR this time.
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
          if (selected !== null) {
            if (i === q.answer) { bg = C.green + "22"; border = C.green; col = C.green; }
            else if (i === selected) { bg = C.red + "22"; border = C.red; col = C.red; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              textAlign: "left", padding: "10px 14px", borderRadius: 8,
              background: bg, border: `1.5px solid ${border}`, color: col,
              cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s",
            }}>
              {i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}
            </button>
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
//  Main — header, progress bar, tab strip, content card, continue btn
// ══════════════════════════════════════════════════════════════════
export default function Unit2_3({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Fetch?" },
    { id: "datapath", label: "Single-Bus Datapath" },
    { id: "seq", label: "The Fetch Sequence" },
    { id: "mfc", label: "Waiting for MFC" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📥 Why Fetch at All?</h3>
      <TheNeed />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛣️ The Single-Bus Datapath</h3>
      <SingleBusDatapath />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⏱️ The Fetch — driven by the control unit</h3>
      <FetchSequence />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🤝 Waiting for MFC</h3>
      <WaitForMFC />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.3.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📥</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Fetching a Word from Memory</div>
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
