// Unit0_4.jsx — Module 0 › Unit 0.4 — "The Von Neumann Model"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Story arc: why stored-program (vs rewiring) → the five functional units →
// registers & the three buses → the fetch–execute cycle on a live datapath.
// This datapath diagram is the recurring visual for the whole course.
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
//  Section 1 — Stored Program (Need): rewiring vs changing a number
// ══════════════════════════════════════════════════════════════════
function StoredProgramWidget() {
  const [op, setOp] = useState("ADD");
  const a = 5, b = 3;
  const ops = { ADD: { sym: "+", val: a + b }, SUB: { sym: "−", val: a - b }, MUL: { sym: "×", val: a * b } };
  const [rewiring, setRewiring] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        ENIAC could compute — but to change <em>what</em> it computed, engineers rewired it by hand for
        days. Von Neumann's fix: keep the instruction in memory as just another number. Compare the two
        machines.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Hard-wired machine */}
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>❌ HARD-WIRED (ENIAC)</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>
            The operation is built into the cables. To switch tasks you physically re-plug the machine.
          </div>
          <button onClick={() => { setRewiring(true); setTimeout(() => setRewiring(false), 1400); }} style={{
            width: "100%", padding: "9px", borderRadius: 8, border: `1px solid ${C.red}55`, cursor: "pointer",
            background: C.red + "18", color: C.red, fontWeight: 600, fontSize: 12,
          }}>{rewiring ? "Rewiring… unplugging 27 cables…" : "Change the task →"}</button>
          {rewiring && <div style={{ marginTop: 8, fontSize: 11, color: C.muted }}>…2–3 days of work per change.</div>}
        </div>

        {/* Stored-program machine */}
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ STORED-PROGRAM</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>
            The instruction lives in memory. Change the task by changing one number — instantly.
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {Object.keys(ops).map((o) => (
              <button key={o} onClick={() => setOp(o)} style={{
                flex: 1, padding: "6px", borderRadius: 7, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12,
                background: op === o ? C.green : C.bg, color: op === o ? "#0D1117" : C.muted,
              }}>{o}</button>
            ))}
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", fontFamily: "monospace", fontSize: 13, color: C.text, textAlign: "center" }}>
            mem: [ {a} | {b} | <span style={{ color: C.green }}>{op}</span> ] → {a} {ops[op].sym} {b} = <strong style={{ color: C.green }}>{ops[op].val}</strong>
          </div>
        </div>
      </div>

      <Key color={C.green}>
        This is the whole idea of the machine you're about to study: instructions are just numbers in
        memory, sitting next to the data. One fixed piece of hardware can run any program — you only
        change the numbers.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Five Functional Units (clickable block diagram)
// ══════════════════════════════════════════════════════════════════
function FiveUnitsWidget() {
  const parts = {
    input: { name: "Input", color: C.teal, role: "Brings data and programs into the machine — keyboard, sensors, disk, network." },
    control: { name: "Control Unit", color: C.purple, role: "The conductor: fetches each instruction and tells every other unit what to do, when." },
    alu: { name: "ALU", color: C.orange, role: "The calculator: arithmetic and logic. The adder you built in Unit 0.2 lives right here." },
    memory: { name: "Memory", color: C.accent, role: "Holds BOTH instructions and data, as numbers in addressed cells. Von Neumann's key idea." },
    output: { name: "Output", color: C.green, role: "Sends results back to the world — screen, speaker, disk, network." },
  };
  const [sel, setSel] = useState("memory");
  const box = (id, x, y, w, h) => {
    const p = parts[id], on = sel === id;
    return (
      <g onClick={() => setSel(id)} style={{ cursor: "pointer" }}>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={on ? p.color + "22" : C.card} stroke={on ? p.color : C.border} strokeWidth={on ? 2.5 : 1.5} />
        <text x={x + w / 2} y={y + h / 2 + 4} fill={on ? p.color : C.text} fontSize={12} fontWeight="700" textAnchor="middle">{p.name}</text>
      </g>
    );
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every von Neumann computer is five cooperating units. Tap each block to see its job. Notice the
        <strong style={{ color: C.text }}> CPU is just the Control Unit + ALU</strong> working together.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px" }}>
        <svg viewBox="0 0 320 210" style={{ width: "100%", maxWidth: 380, display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="ar3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.muted} /></marker>
          </defs>
          {/* Memory on top */}
          {box("memory", 110, 15, 100, 34)}
          {/* CPU dashed container */}
          <rect x={100} y={70} width={120} height={110} rx={10} fill="none" stroke={C.border} strokeDasharray="4 4" />
          <text x={160} y={84} fill={C.muted} fontSize={10} fontWeight="700" textAnchor="middle">CPU</text>
          {box("control", 112, 90, 96, 32)}
          {box("alu", 112, 132, 96, 32)}
          {/* Input / Output */}
          {box("input", 15, 108, 70, 34)}
          {box("output", 235, 108, 70, 34)}
          {/* buses */}
          <line x1={85} y1={125} x2={100} y2={125} stroke={C.muted} strokeWidth={2} markerEnd="url(#ar3)" />
          <line x1={220} y1={125} x2={235} y2={125} stroke={C.muted} strokeWidth={2} markerEnd="url(#ar3)" />
          <line x1={160} y1={70} x2={160} y2={49} stroke={C.muted} strokeWidth={2} />
          <line x1={160} y1={49} x2={160} y2={70} stroke={C.muted} strokeWidth={2} markerStart="url(#ar3)" markerEnd="url(#ar3)" />
        </svg>
      </div>

      <div style={{ marginTop: 10, background: parts[sel].color + "14", border: `1px solid ${parts[sel].color}44`, borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ color: parts[sel].color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{parts[sel].name}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{parts[sel].role}</div>
      </div>

      <Key color={C.accent}>
        Input, Output, Memory, ALU, Control Unit. The CPU = Control + ALU. And crucially, memory holds
        instructions and data together — that's what makes it a stored-program machine.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Registers & the Three Buses
// ══════════════════════════════════════════════════════════════════
function RegistersBusWidget() {
  const items = {
    PC: { name: "PC — Program Counter", color: C.purple, text: "Holds the address of the NEXT instruction to fetch. Steps forward after each one." },
    IR: { name: "IR — Instruction Register", color: C.teal, text: "Holds the instruction currently being decoded and executed." },
    MAR: { name: "MAR — Memory Address Register", color: C.orange, text: "Holds the address the CPU wants to access. Drives the ADDRESS bus." },
    MDR: { name: "MDR — Memory Data Register", color: C.green, text: "Holds the data going to / coming from memory. Sits on the DATA bus." },
    addr: { name: "Address bus", color: C.orange, text: "One-way CPU → memory: which cell? Carries the address from the MAR." },
    data: { name: "Data bus", color: C.green, text: "Two-way: the value being read or written travels here, via the MDR." },
    ctrl: { name: "Control bus", color: C.red, text: "Carries commands like READ / WRITE and timing signals from the Control Unit." },
  };
  const [sel, setSel] = useState("MAR");
  const on = (k) => sel === k;
  const reg = (k, x, y) => (
    <g onClick={() => setSel(k)} style={{ cursor: "pointer" }}>
      <rect x={x} y={y} width={62} height={28} rx={6} fill={on(k) ? items[k].color + "22" : C.bg} stroke={on(k) ? items[k].color : C.border} strokeWidth={on(k) ? 2.5 : 1.5} />
      <text x={x + 31} y={y + 18} fill={on(k) ? items[k].color : C.text} fontSize={12} fontWeight="700" textAnchor="middle">{k}</text>
    </g>
  );
  const busColor = (k) => (on(k) ? items[k].color : C.muted);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Inside the CPU, tiny fast stores called <strong style={{ color: C.text }}>registers</strong> hold
        what's in play right now. The CPU talks to memory over three <strong style={{ color: C.text }}>buses</strong>.
        Tap any register or bus.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px" }}>
        <svg viewBox="0 0 340 200" style={{ width: "100%", maxWidth: 400, display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="arA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={busColor("addr")} /></marker>
            <marker id="arD1" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={busColor("data")} /></marker>
            <marker id="arD2" markerWidth="9" markerHeight="9" refX="3" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6 Z" fill={busColor("data")} /></marker>
            <marker id="arC" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={busColor("ctrl")} /></marker>
          </defs>
          {/* CPU box */}
          <rect x={12} y={15} width={150} height={170} rx={10} fill="none" stroke={C.border} strokeWidth={1.5} />
          <text x={30} y={30} fill={C.muted} fontSize={10} fontWeight="700">CPU</text>
          {reg("PC", 24, 40)}
          {reg("IR", 96, 40)}
          {reg("MAR", 24, 82)}
          {reg("MDR", 96, 82)}
          <rect x={48} y={128} width={78} height={40} rx={6} fill={C.card} stroke={C.border} strokeWidth={1.5} />
          <text x={87} y={152} fill={C.muted} fontSize={11} fontWeight="700" textAnchor="middle">ALU</text>
          {/* Memory */}
          <rect x={258} y={40} width={72} height={128} rx={8} fill={C.card} stroke={on("data") || on("addr") ? C.accent : C.border} strokeWidth={1.5} />
          <text x={294} y={58} fill={C.text} fontSize={11} fontWeight="700" textAnchor="middle">Memory</text>
          {[0, 1, 2].map((i) => <rect key={i} x={268} y={68 + i * 30} width={52} height={22} rx={4} fill={C.bg} stroke={C.border} />)}
          {/* buses */}
          <line x1={162} y1={70} x2={258} y2={70} stroke={busColor("addr")} strokeWidth={on("addr") ? 4 : 2.5} markerEnd="url(#arA)" />
          <text x={205} y={64} fill={busColor("addr")} fontSize={9} fontWeight="700" textAnchor="middle">ADDRESS</text>
          <line x1={162} y1={110} x2={258} y2={110} stroke={busColor("data")} strokeWidth={on("data") ? 4 : 2.5} markerEnd="url(#arD1)" markerStart="url(#arD2)" />
          <text x={205} y={104} fill={busColor("data")} fontSize={9} fontWeight="700" textAnchor="middle">DATA</text>
          <line x1={162} y1={150} x2={258} y2={150} stroke={busColor("ctrl")} strokeWidth={on("ctrl") ? 4 : 2.5} markerEnd="url(#arC)" />
          <text x={205} y={144} fill={busColor("ctrl")} fontSize={9} fontWeight="700" textAnchor="middle">CONTROL</text>
        </svg>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {["addr", "data", "ctrl"].map((k) => (
          <button key={k} onClick={() => setSel(k)} style={{
            flex: 1, minWidth: 90, padding: "7px", borderRadius: 7, border: `1px solid ${on(k) ? items[k].color : C.border}`,
            background: on(k) ? items[k].color + "18" : C.card, color: on(k) ? items[k].color : C.muted, fontWeight: 700, fontSize: 11, cursor: "pointer",
          }}>{items[k].name}</button>
        ))}
      </div>

      <div style={{ marginTop: 10, background: items[sel].color + "14", border: `1px solid ${items[sel].color}44`, borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ color: items[sel].color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{items[sel].name}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{items[sel].text}</div>
      </div>

      <Key color={C.orange}>
        To touch memory the CPU puts an address in the MAR (onto the address bus), says READ or WRITE on
        the control bus, and the value travels on the data bus through the MDR. Every memory access, all
        course long, is this handshake.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The Fetch–Execute Cycle (step-through datapath)
// ══════════════════════════════════════════════════════════════════
function FetchExecuteWidget() {
  const program = ["LOD 5", "ADD 3", "OUT"]; // tiny program: 5 + 3 → out
  // Plain-English meaning of each instruction (students haven't seen assembly).
  const glossary = {
    LOD: { name: "LOAD", desc: "copy a number into the accumulator (the ALU's working store)" },
    ADD: { name: "ADD", desc: "add a number to whatever is already in the accumulator" },
    OUT: { name: "OUTPUT", desc: "send the accumulator's value out — e.g. to the screen" },
  };
  // Precomputed steps. `phase` drives the progression strip; `arrow` drives the
  // animated data-flow; `meaning` (on decode steps) drives the glossary highlight.
  const steps = [
    { phase: "Ready", note: "PC = 0. The Program Counter points at the first instruction in memory.", active: ["PC"], regs: { PC: 0, MAR: "–", MDR: "–", IR: "–", ACC: 0 }, cell: null },
    { phase: "Fetch", note: "The address in the PC (0) is copied into the MAR, out onto the address bus.", active: ["PC", "MAR"], arrow: ["PC", "MAR"], regs: { PC: 0, MAR: 0, MDR: "–", IR: "–", ACC: 0 }, cell: 0 },
    { phase: "Fetch", note: "Memory cell 0 is read; its contents come back on the data bus into the MDR.", active: ["MEM", "MDR"], arrow: ["MEM", "MDR"], regs: { PC: 0, MAR: 0, MDR: "LOD 5", IR: "–", ACC: 0 }, cell: 0 },
    { phase: "Fetch", note: "The instruction moves from the MDR into the IR.", active: ["MDR", "IR"], arrow: ["MDR", "IR"], regs: { PC: 0, MAR: 0, MDR: "LOD 5", IR: "LOD 5", ACC: 0 }, cell: 0 },
    { phase: "Decode", note: "The Control Unit reads the IR to work out what to do.", meaning: "LOD 5", active: ["IR"], regs: { PC: 0, MAR: 0, MDR: "LOD 5", IR: "LOD 5", ACC: 0 }, cell: 0 },
    { phase: "Execute", note: "Execute: the accumulator loads the value 5.", active: ["IR", "ALU"], arrow: ["IR", "ALU"], regs: { PC: 0, MAR: 0, MDR: "LOD 5", IR: "LOD 5", ACC: 5 }, cell: 0 },
    { phase: "Next", note: "The PC steps to 1, ready for the next instruction.", active: ["PC"], regs: { PC: 1, MAR: 0, MDR: "LOD 5", IR: "LOD 5", ACC: 5 }, cell: null },
    { phase: "Fetch", note: "Fetch again: the PC (1) is copied into the MAR.", active: ["PC", "MAR"], arrow: ["PC", "MAR"], regs: { PC: 1, MAR: 1, MDR: "LOD 5", IR: "LOD 5", ACC: 5 }, cell: 1 },
    { phase: "Fetch", note: "Memory cell 1 is read into the MDR and on into the IR.", active: ["MEM", "MDR", "IR"], arrow: ["MEM", "IR"], regs: { PC: 1, MAR: 1, MDR: "ADD 3", IR: "ADD 3", ACC: 5 }, cell: 1 },
    { phase: "Decode", note: "The Control Unit decodes the new instruction in the IR.", meaning: "ADD 3", active: ["IR"], regs: { PC: 1, MAR: 1, MDR: "ADD 3", IR: "ADD 3", ACC: 5 }, cell: 1 },
    { phase: "Execute", note: "Execute: the ALU adds 3 to the accumulator → 8.", active: ["IR", "ALU"], arrow: ["IR", "ALU"], regs: { PC: 1, MAR: 1, MDR: "ADD 3", IR: "ADD 3", ACC: 8 }, cell: 1 },
    { phase: "Next", note: "PC → 2. The whole cycle repeats — fetch, decode, execute — billions of times a second.", active: ["PC"], regs: { PC: 2, MAR: 1, MDR: "ADD 3", IR: "ADD 3", ACC: 8 }, cell: null },
  ];
  const [i, setI] = useState(0);
  const st = steps[i];
  const A = (k) => st.active.includes(k);
  const phases = ["Fetch", "Decode", "Execute", "Next"];
  const mnem = st.meaning ? st.meaning.split(" ")[0] : null;
  const operand = st.meaning ? st.meaning.split(" ")[1] : null;

  const ctr = { PC: [70, 54], MAR: [70, 92], MDR: [70, 130], IR: [70, 168], ALU: [153, 148], MEM: [258, 118] };
  const rbox = (k, label, x, y) => (
    <g>
      <rect x={x} y={y} width={72} height={28} rx={6} fill={A(k) ? C.accent + "22" : C.bg} stroke={A(k) ? C.accent : C.border} strokeWidth={A(k) ? 2.5 : 1.5} style={{ filter: A(k) ? `drop-shadow(0 0 4px ${C.accent})` : "none" }} />
      <text x={x + 8} y={y + 18} fill={C.muted} fontSize={10} fontWeight="700">{label}</text>
      <text x={x + 64} y={y + 18} fill={A(k) ? C.accent : C.text} fontSize={11} fontWeight="700" textAnchor="end">{String(st.regs[k])}</text>
    </g>
  );

  // Data-flow arrow = animated dashes ("marching ants") moving toward the target.
  let arrowEl = null;
  if (st.arrow) {
    const [f, t] = st.arrow;
    const [x1, y1] = ctr[f], [x2, y2] = ctr[t];
    arrowEl = <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.yellow} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="2 7" markerEnd="url(#feAr)" style={{ animation: "feMarch 0.5s linear infinite", filter: `drop-shadow(0 0 3px ${C.yellow})` }} />;
  }

  return (
    <div>
      <style>{`@keyframes feMarch { to { stroke-dashoffset: -18; } }`}</style>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every instruction runs the same four-beat loop. Two things move here, and they're different:
        the <strong style={{ color: C.text }}>phase chips</strong> show which beat we're on (the progression),
        and the <strong style={{ color: C.yellow }}>yellow moving dots</strong> show data flowing along a wire
        (this step). Step through this tiny program that computes 5 + 3.
      </p>

      {/* ── PROGRESSION: the fetch-decode-execute-next phase strip ── */}
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1 }}>CYCLE</span>
        {phases.map((p) => {
          const on = st.phase === p;
          return (
            <div key={p} style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              background: on ? C.accentGlow : C.card, border: `1px solid ${on ? C.accent : C.border}`,
              color: on ? "#fff" : C.muted, transition: "all 0.2s",
            }}>{p === "Next" ? "↻ Next" : p}</div>
          );
        })}
      </div>

      {/* ── FLOW: the datapath with animated dotted data-flow arrow ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px" }}>
        <svg viewBox="0 0 340 210" style={{ width: "100%", maxWidth: 400, display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="feAr" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.yellow} /></marker>
          </defs>
          <rect x={14} y={20} width={185} height={180} rx={10} fill="none" stroke={C.border} strokeWidth={1.5} />
          <text x={30} y={35} fill={C.muted} fontSize={10} fontWeight="700">CPU</text>
          {rbox("PC", "PC", 34, 40)}
          {rbox("MAR", "MAR", 34, 78)}
          {rbox("MDR", "MDR", 34, 116)}
          {rbox("IR", "IR", 34, 154)}
          <rect x={120} y={128} width={66} height={40} rx={6} fill={A("ALU") ? C.orange + "22" : C.bg} stroke={A("ALU") ? C.orange : C.border} strokeWidth={A("ALU") ? 2.5 : 1.5} />
          <text x={153} y={146} fill={A("ALU") ? C.orange : C.muted} fontSize={10} fontWeight="700" textAnchor="middle">ALU</text>
          <text x={153} y={160} fill={C.text} fontSize={11} fontWeight="700" textAnchor="middle">ACC {st.regs.ACC}</text>
          <rect x={230} y={34} width={100} height={162} rx={8} fill={A("MEM") ? C.accent + "14" : C.card} stroke={A("MEM") ? C.accent : C.border} strokeWidth={1.5} />
          <text x={280} y={50} fill={C.text} fontSize={11} fontWeight="700" textAnchor="middle">Memory</text>
          {program.map((ins, k) => (
            <g key={k}>
              <rect x={240} y={60 + k * 34} width={80} height={26} rx={5} fill={st.cell === k ? C.yellow + "22" : C.bg} stroke={st.cell === k ? C.yellow : C.border} strokeWidth={st.cell === k ? 2 : 1} />
              <text x={247} y={77 + k * 34} fill={C.muted} fontSize={9}>{k}</text>
              <text x={312} y={77 + k * 34} fill={st.cell === k ? C.yellow : C.text} fontSize={11} fontWeight="700" textAnchor="end">{ins}</text>
            </g>
          ))}
          {arrowEl}
        </svg>
        <div style={{ fontSize: 10.5, color: C.muted, textAlign: "center", paddingTop: 4, lineHeight: 1.5 }}>
          <span style={{ color: C.accent }}>▮</span> phase chips = progression (which beat)
          &nbsp;·&nbsp; <span style={{ color: C.yellow }}>▸▸▸</span> moving dots = data flowing this step
        </div>
      </div>

      {/* ── step narration ── */}
      <div style={{ marginTop: 10, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", minHeight: 40 }}>
        <span style={{ color: C.muted, fontSize: 11, fontWeight: 700 }}>STEP {i + 1} / {steps.length} · {st.phase.toUpperCase()} · </span>
        <span style={{ color: C.text, fontSize: 13 }}>{st.note}</span>
      </div>

      {/* ── GLOSSARY: what the instructions mean ── */}
      <div style={{ marginTop: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>WHAT THESE INSTRUCTIONS MEAN</div>
        {Object.entries(glossary).map(([k, v]) => {
          const hot = mnem === k;
          return (
            <div key={k} style={{ display: "flex", gap: 8, alignItems: "baseline", padding: "4px 8px", borderRadius: 6, marginBottom: 2, background: hot ? C.accent + "18" : "transparent" }}>
              <span style={{ fontFamily: "monospace", fontWeight: 700, color: hot ? C.accent : C.text, minWidth: 40 }}>{k}</span>
              <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}><strong style={{ color: hot ? C.accent : C.text }}>{v.name}</strong> — {v.desc}</span>
            </div>
          );
        })}
        {st.meaning && (
          <div style={{ marginTop: 8, background: C.accent + "14", border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.text, lineHeight: 1.5 }}>
            Decoding: the IR holds <span style={{ fontFamily: "monospace", color: C.accent, fontWeight: 700 }}>{st.meaning}</span> →{" "}
            {glossary[mnem].name}{operand ? ` ${operand}` : ""}: {glossary[mnem].desc}.
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button onClick={() => setI(Math.min(steps.length - 1, i + 1))} disabled={i >= steps.length - 1} style={{
          padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
          background: i >= steps.length - 1 ? C.border : C.accentGlow, color: "#fff", cursor: i >= steps.length - 1 ? "default" : "pointer",
        }}>Step ▶ ({i + 1}/{steps.length})</button>
        <button onClick={() => setI(0)} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>↺ Reset</button>
      </div>

      <Key color={C.accent}>
        Fetch (PC → MAR → read → MDR → IR), decode, execute (ALU), then PC++. That four-beat loop, repeated
        billions of times a second, IS a running program. Module 2 opens up the "execute" step in full.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, instant feedback, explanation, completion card
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "What is the core idea of the stored-program (von Neumann) computer?",
      options: [
        "Instructions are wired into the hardware permanently",
        "Instructions and data are stored together in memory, as numbers",
        "Each program needs its own machine",
        "Data is stored, but instructions are entered by hand each time",
      ],
      answer: 1,
      explain: "Instructions are just numbers living in memory beside the data, so one fixed machine runs any program — you only change the numbers.",
    },
    {
      q: "In the von Neumann model, the CPU is made of which two units?",
      options: [
        "Memory and Input",
        "ALU and Output",
        "Control Unit and ALU",
        "Registers and Buses",
      ],
      answer: 2,
      explain: "CPU = Control Unit (directs everything) + ALU (does the arithmetic and logic). Memory and I/O sit outside the CPU.",
    },
    {
      q: "Which register holds the address of the NEXT instruction to fetch?",
      options: ["IR (Instruction Register)", "MDR (Memory Data Register)", "MAR (Memory Address Register)", "PC (Program Counter)"],
      answer: 3,
      explain: "The Program Counter points at the next instruction and steps forward after each fetch. The IR holds the current instruction being executed.",
    },
    {
      q: "Put the FETCH steps in the right order.",
      options: [
        "PC → MAR → read memory → MDR → IR",
        "IR → PC → MAR → MDR → memory",
        "MDR → PC → IR → MAR → memory",
        "MAR → IR → PC → memory → MDR",
      ],
      answer: 0,
      explain: "The address in the PC goes to the MAR, memory is read, the value returns via the MDR, and lands in the IR to be decoded.",
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
          {score === 4 ? "Excellent — you can read the datapath and trace an instruction end to end."
            : score >= 2 ? "Good. Replay the Registers & Buses and Fetch–Execute tabs to firm it up."
              : "Worth another pass — the Five Units and Fetch–Execute tabs are the ones to revisit."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.green}22, ${C.accentGlow}22)`, border: `1px solid ${C.green}55`, textAlign: "left" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🏁 Module 0 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've gone from the firing-table crisis, to bits and gates, to the stored-program machine and
            its fetch–execute heartbeat. You can now read the datapath every later module builds on.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Module 1 — Basic Structure of Computers.</strong>{" "}
            We zoom into these five units for real: functional units, bus structures, memory addresses, and
            how instructions are sequenced.
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
          background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14,
        }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Main — header, progress bar, tab strip, content card, continue btn
// ══════════════════════════════════════════════════════════════════
export default function Unit0_4({ student, onUnitComplete }) {
  const sections = [
    { id: "stored", label: "Stored Program" },
    { id: "units", label: "Five Units" },
    { id: "buses", label: "Registers & Buses" },
    { id: "cycle", label: "Fetch–Execute" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>One machine, any program</h3><StoredProgramWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The five functional units</h3><FiveUnitsWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Registers and the three buses</h3><RegistersBusWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The heartbeat: fetch, decode, execute</h3><FetchExecuteWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 0.4.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💡</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 0 › UNIT 0.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>The Von Neumann Model</div>
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
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s",
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
            background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>Mark Complete &amp; Continue →</button>
        )}
      </div>
    </div>
  );
}
