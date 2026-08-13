// Unit2_5.jsx — Module 2 › Unit 2.5 — "Executing a Complete Instruction"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 3 (Execution of Complete Instructions,
// Hamacher §5.1–5.3) — the full single-bus control sequence for Add (R3),R1.
// Arc: the whole journey (fetch·decode·execute) → why the temp registers Y and Z
// exist on a single bus → reading the control signals (PCout, MARin, WMFC…) →
// the 7-step control sequence traced live → quiz.
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
//  Section 1 — The whole journey: fetch · decode · execute
// ══════════════════════════════════════════════════════════════════
function TheJourney() {
  const [phase, setPhase] = useState(0); // 0..3

  const phases = [
    { name: "Fetch", color: C.green, body: "Bring the instruction word from memory into IR — the exact three beats you built in Unit 2.3. Every instruction starts here." },
    { name: "Decode", color: C.teal, body: "The control unit reads the opcode in IR and works out WHAT to do — here, 'Add the memory operand at (R3) into R1' — and which registers to read." },
    { name: "Execute", color: C.orange, body: "Actually do the work: read the memory operand (a fetch, from Unit 2.3), add it in the ALU, and write the result back to R1." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        You now have the pieces: RTL and control functions (Unit 2.1), the ALU (Unit 2.2), fetch (2.3) and store (2.4). One
        machine instruction strings them into a single ordered run — three phases:
        <strong style={{ color: C.green }}> Fetch</strong> → <strong style={{ color: C.teal }}>Decode</strong> →
        <strong style={{ color: C.orange }}> Execute</strong>. Our instruction under trace:
        <code style={{ color: C.purple, fontFamily: "monospace" }}> Add (R3), R1</code>.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {phases.map((p, i) => (
          <div key={p.name} style={{
            flex: 1, textAlign: "center", padding: "12px 6px", borderRadius: 10, transition: "all 0.25s",
            background: phase > i ? p.color + "1E" : C.card,
            border: `2px solid ${phase > i ? p.color : C.border}`,
          }}>
            <div style={{ color: phase > i ? p.color : C.muted, fontWeight: 700, fontSize: 13 }}>{i + 1}. {p.name}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 56, lineHeight: 1.6, marginBottom: 10 }}>
        {phase === 0
          ? <span style={{ color: C.muted }}>Press Reveal to walk the three phases. Read <code style={{ fontFamily: "monospace", color: C.purple }}>Add (R3), R1</code> as: "add the value stored at the address in R3 to R1."</span>
          : <span><strong style={{ color: phases[phase - 1].color }}>{phases[phase - 1].name}: </strong>{phases[phase - 1].body}</span>}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setPhase(v => Math.min(3, v + 1))} disabled={phase === 3} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: phase === 3 ? C.card : C.accentGlow, color: phase === 3 ? C.muted : "#fff",
          cursor: phase === 3 ? "default" : "pointer",
        }}>Reveal phase ▶ ({phase} / 3)</button>
        <button onClick={() => setPhase(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.accent}>
        Every instruction is <strong style={{ color: C.green }}>Fetch</strong> · <strong style={{ color: C.teal }}>Decode</strong>
        · <strong style={{ color: C.orange }}>Execute</strong>. Fetch is always identical; decode and execute differ per opcode.
        The control unit turns this plan into a precise beat-by-beat sequence of control signals — the rest of this unit.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Why Y and Z? (the single-bus two-operand problem)
// ══════════════════════════════════════════════════════════════════
function WhyYandZ() {
  const [useY, setUseY] = useState(true);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The ALU needs <strong style={{ color: C.text }}>two</strong> inputs to add. But a single bus carries only
        <strong style={{ color: C.text }}> one value per clock</strong>. So how do both operands reach the ALU? The answer is a
        latch register <strong style={{ color: C.teal }}>Y</strong> on one ALU input, and <strong style={{ color: C.purple }}>Z</strong>
        on the output. Toggle Y on and off.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[[true, "With register Y ✓", C.green], [false, "No Y — bus only ✗", C.red]].map(([v, label, col]) => (
          <button key={String(v)} onClick={() => setUseY(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: useY === v ? col + "22" : C.card,
            border: `2px solid ${useY === v ? col : C.border}`, color: useY === v ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 170" style={{ width: "100%", display: "block" }}>
          {/* bus */}
          <line x1={30} y1={40} x2={490} y2={40} stroke={C.accent} strokeWidth={4} />
          <text x={260} y={26} textAnchor="middle" fill={C.accent} fontSize={10} fontWeight="700">single bus — one value at a time</text>
          {/* Y latch */}
          <rect x={70} y={70} width={80} height={36} rx={7} fill={useY ? C.teal + "1E" : C.card} stroke={useY ? C.teal : C.border} strokeWidth={1.8} opacity={useY ? 1 : 0.3} />
          <text x={110} y={93} textAnchor="middle" fill={useY ? C.teal : C.muted} fontSize={12} fontWeight="700">Y</text>
          <line x1={110} y1={70} x2={110} y2={40} stroke={useY ? C.teal : C.border} strokeWidth={1.5} opacity={useY ? 1 : 0.3} />
          {/* ALU */}
          <polygon points="200,66 270,88 270,112 200,134" fill={C.accent + "1E"} stroke={C.accent} strokeWidth={1.8} />
          <text x={230} y={104} textAnchor="middle" fill={C.accent} fontSize={12} fontWeight="700">ALU</text>
          <line x1={150} y1={88} x2={200} y2={92} stroke={useY ? C.teal : C.red} strokeWidth={2} opacity={useY ? 1 : 0.5} />
          <text x={175} y={78} textAnchor="middle" fill={useY ? C.teal : C.red} fontSize={9}>input 1 = Y</text>
          <line x1={110} y1={40} x2={200} y2={110} stroke={C.accent} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.5} />
          <text x={160} y={128} fill={C.muted} fontSize={9}>input 2 = bus</text>
          {/* Z latch */}
          <rect x={310} y={78} width={80} height={36} rx={7} fill={C.purple + "1E"} stroke={C.purple} strokeWidth={1.8} />
          <text x={350} y={101} textAnchor="middle" fill={C.purple} fontSize={12} fontWeight="700">Z</text>
          <line x1={270} y1={100} x2={310} y2={96} stroke={C.purple} strokeWidth={2} />
          <line x1={350} y1={78} x2={350} y2={40} stroke={C.purple} strokeWidth={1.5} />
          <text x={410} y={100} fill={C.muted} fontSize={9}>result → back on bus</text>
        </svg>
      </div>

      <div style={{ background: useY ? C.green + "12" : C.red + "12", border: `1px solid ${useY ? C.green : C.red}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {useY
          ? <span>✓ Beat 1: gate operand A onto the bus and latch it into <strong style={{ color: C.teal }}>Y</strong>. Beat 2: gate operand B onto the bus; the ALU adds it to Y and latches the sum into <strong style={{ color: C.purple }}>Z</strong>. Beat 3: gate Z back to the destination. <strong style={{ color: C.green }}>Two operands, one bus — solved.</strong></span>
          : <span>✗ Without Y, both operands would have to be on the single bus at the same instant — impossible. The ALU would only ever see one input. <strong style={{ color: C.red }}>The add can't happen.</strong></span>}
      </div>

      <Key color={C.teal}>
        On a single bus, <strong style={{ color: C.teal }}>Y</strong> holds the first operand steady while the second travels the
        bus into the ALU, and <strong style={{ color: C.purple }}>Z</strong> holds the ALU result until it can be gated back.
        These are the interstage latches that make one-bus arithmetic possible.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Reading the control signals (anatomy click-to-reveal)
// ══════════════════════════════════════════════════════════════════
function ControlSignals() {
  const [pick, setPick] = useState(null);

  const sigs = [
    { key: "out", label: "PCout", color: C.teal, title: "Rout — gate a register ONTO the bus",
      body: "Xout opens register X's driver so its value rides the bus this beat. PCout puts the program counter on the bus; R1out puts R1 on it. Exactly one 'out' per beat (one value on the bus)." },
    { key: "in", label: "MARin", color: C.orange, title: "Rin — latch the bus INTO a register",
      body: "Xin opens register X's load line so it captures whatever is on the bus at the clock edge. MARin loads MAR from the bus; IRin loads IR; R1in loads R1. This is the control function P : X ← bus from Unit 2.1." },
    { key: "rw", label: "Read", color: C.green, title: "Read / Write — memory direction",
      body: "Read tells memory to fetch M[MAR] into MDR; Write tells it to store MDR into M[MAR]. Raised in the same beat the address is placed in MAR." },
    { key: "wmfc", label: "WMFC", color: C.red, title: "WMFC — Wait for Memory Function Complete",
      body: "Freeze the sequence until memory raises MFC. Because memory is slow, the beat that starts a Read/Write is followed by a WMFC before the data in MDR can be trusted (Unit 2.3)." },
    { key: "z", label: "Zin / Zout", color: C.purple, title: "Zin / Zout — the ALU output latch",
      body: "The ALU result is captured into Z by Zin, then gated back onto the bus by Zout on a later beat. Add·Zin means 'ALU does Add, latch the sum into Z.'" },
    { key: "end", label: "End", color: C.yellow, title: "End — last microstep",
      body: "End marks the final beat of the instruction and restarts the counter at the fetch sequence for the next instruction. It is the loop-back you'll see in the control unit, Unit 2.7." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The control sequence is written as a list of tiny signal names per beat — like
        <code style={{ color: C.accent, fontFamily: "monospace" }}> PCout, MARin, Read</code>. They look cryptic but each is one
        of a handful of verbs. Tap each to learn it before the full trace.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {sigs.map((s) => (
          <button key={s.key} onClick={() => setPick(s.key)} style={{
            padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "monospace",
            background: pick === s.key ? s.color + "2A" : C.card,
            border: `2px solid ${pick === s.key ? s.color : C.border}`, color: s.color,
          }}>{s.label}</button>
        ))}
      </div>

      {pick && (
        <div style={{ background: sigs.find(s => s.key === pick).color + "12", border: `1px solid ${sigs.find(s => s.key === pick).color}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 4 }}>
          <div style={{ color: sigs.find(s => s.key === pick).color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            {sigs.find(s => s.key === pick).title}
          </div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{sigs.find(s => s.key === pick).body}</div>
        </div>
      )}

      <Key color={C.accent}>
        Every beat is just a set of these verbs fired together: some register drives the bus (<strong style={{ color: C.teal }}>Xout</strong>),
        others latch it (<strong style={{ color: C.orange }}>Xin</strong>), the ALU picks a function, and memory/timing signals
        (<strong style={{ color: C.green }}>Read</strong>/<strong style={{ color: C.red }}>WMFC</strong>) keep it honest.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The 7-step control sequence, traced live (flagship)
// ══════════════════════════════════════════════════════════════════
function ControlSequence() {
  const [step, setStep] = useState(0);

  // Hamacher single-bus control sequence for Add (R3), R1.
  // Story: PC=100; M[100]=instruction; R3=200 (operand address); M[200]=5; R1=3 → R1=8.
  const steps = [
    { sig: "—", phase: "start", narr: "Before execution. PC = 100 points at the instruction. R3 = 200 is the address of the memory operand (value 5). R1 = 3.",
      st: { PC: "100", MAR: "—", MDR: "—", IR: "—", R1: "3", R3: "200", Y: "—", Z: "—" }, mfc: false },
    { sig: "PCout, MARin, Read, Select4, Add, Zin", phase: "Fetch", narr: "1 — PC → MAR and start Read; in parallel the ALU adds 4 to PC and parks 104 in Z.",
      st: { PC: "100", MAR: "100", MDR: "—", IR: "—", R1: "3", R3: "200", Y: "—", Z: "104" }, mfc: false },
    { sig: "Zout, PCin, Yin, WMFC", phase: "Fetch", narr: "2 — Z (104) → PC, so PC now points at the next instruction. Wait for MFC; the instruction word arrives in MDR.",
      st: { PC: "104", MAR: "100", MDR: "Add(R3),R1", IR: "—", R1: "3", R3: "200", Y: "104", Z: "104" }, mfc: true },
    { sig: "MDRout, IRin", phase: "Fetch", narr: "3 — MDR → IR. The instruction is now in IR; the control unit decodes 'Add (R3), R1'. Fetch complete.",
      st: { PC: "104", MAR: "100", MDR: "Add(R3),R1", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "104", Z: "104" }, mfc: false },
    { sig: "R3out, MARin, Read", phase: "Execute", narr: "4 — the operand's address is in R3 (200). R3 → MAR, start Read to fetch the memory operand.",
      st: { PC: "104", MAR: "200", MDR: "Add(R3),R1", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "104", Z: "104" }, mfc: false },
    { sig: "R1out, Yin, WMFC", phase: "Execute", narr: "5 — R1 (3) → Y, latching the first operand. Wait for MFC; meanwhile the memory operand 5 lands in MDR.",
      st: { PC: "104", MAR: "200", MDR: "5", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "3", Z: "104" }, mfc: true },
    { sig: "MDRout, SelectY, Add, Zin", phase: "Execute", narr: "6 — MDR (5) → bus, ALU adds it to Y (3): 3 + 5 = 8, latched into Z.",
      st: { PC: "104", MAR: "200", MDR: "5", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "3", Z: "8" }, mfc: false },
    { sig: "Zout, R1in, End", phase: "Execute", narr: "7 — Z (8) → R1. R1 now holds 8. End restarts the counter at Fetch for the next instruction.",
      st: { PC: "104", MAR: "200", MDR: "5", IR: "Add(R3),R1", R1: "8", R3: "200", Y: "3", Z: "8" }, mfc: false },
  ];
  const s = steps[step];
  const phaseColor = s.phase === "Fetch" ? C.green : s.phase === "Execute" ? C.orange : C.muted;

  const order = ["PC", "IR", "R1", "R3", "MAR", "MDR", "Y", "Z"];
  const colorFor = { PC: C.teal, IR: C.purple, R1: C.green, R3: C.teal, MAR: C.orange, MDR: C.yellow, Y: C.teal, Z: C.purple };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The whole instruction as a <strong style={{ color: C.accent }}>7-beat control sequence</strong> — Hamacher's classic
        example. Beats 1–3 are Fetch (from Unit 2.3); 4–7 are Execute (an operand fetch + an ALU add + a write-back). Step
        through and watch every register. <code style={{ color: C.purple, fontFamily: "monospace" }}>R1 = 3 + M[200] = 3 + 5 = 8.</code>
      </p>

      {/* live register grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
        {order.map((k) => {
          const v = s.st[k];
          const on = v !== "—";
          return (
            <div key={k} style={{ background: C.card, border: `1.5px solid ${on ? colorFor[k] : C.border}`, borderRadius: 8, padding: "7px 4px", textAlign: "center", transition: "all 0.25s" }}>
              <div style={{ color: C.muted, fontSize: 10 }}>{k}</div>
              <div style={{ color: on ? colorFor[k] : C.muted, fontFamily: "monospace", fontSize: 11, fontWeight: 700, wordBreak: "break-all" }}>{v}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
        <div style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: phaseColor + "22", border: `1.5px solid ${phaseColor}`, color: phaseColor }}>
          {s.phase === "start" ? "ready" : s.phase}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.mfc ? C.teal + "22" : C.card, border: `1.5px solid ${s.mfc ? C.teal : C.border}`, color: s.mfc ? C.teal : C.muted }}>
          MFC {s.mfc ? "● arrived" : "○"}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
        <div style={{ fontFamily: "monospace", fontSize: 12.5, color: step === 0 ? C.muted : C.accent, fontWeight: 700, marginBottom: 6 }}>
          {step === 0 ? "(idle)" : `Step ${step}:  ${s.sig}`}
        </div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{s.narr}</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStep(v => Math.min(7, v + 1))} disabled={step === 7} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: step === 7 ? C.card : C.accentGlow, color: step === 7 ? C.muted : "#fff",
          cursor: step === 7 ? "default" : "pointer",
        }}>Next beat ▶ ({step} / 7)</button>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      {step === 7 && (
        <div style={{ marginTop: 10, background: C.green + "14", border: `1px solid ${C.green}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.green, lineHeight: 1.6 }}>
          ✓ One instruction, <strong>7 clock beats</strong>: 3 to fetch, 4 to execute. R1 went from 3 to 8. End loops back to
          beat 1 for the next instruction.
        </div>
      )}

      <Key color={C.orange}>
        A complete instruction is a fixed script of control-signal sets, one per beat. Notice how it <strong style={{ color: C.text }}>reuses</strong>
        everything: fetch (2.3), a second memory read for the operand, Y/Z to feed the ALU (2.2), and a write-back — all
        sequenced by the control unit.
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
      q: "What are the three phases every instruction passes through?",
      options: [
        "Read, Write, Erase",
        "Fetch, Decode, Execute",
        "Load, Add, Store",
        "Input, Process, Output",
      ],
      answer: 1,
      explain: "Fetch brings the instruction into IR, Decode works out what it is, Execute carries it out. Fetch is identical for every instruction; decode and execute vary by opcode.",
    },
    {
      q: "On a single-bus datapath, why is the register Y needed for an ALU add?",
      options: [
        "To store the opcode",
        "Because the ALU needs two inputs but the bus carries only one value per clock — Y holds the first operand",
        "To hold the program counter",
        "To speed up memory",
      ],
      answer: 1,
      explain: "One bus = one value per beat, but addition needs two operands. Y latches the first operand so the second can travel the bus into the ALU on a later beat. Z then latches the ALU result.",
    },
    {
      q: "In a control sequence, what does 'PCout, MARin' accomplish in one beat?",
      options: [
        "Adds PC and MAR together",
        "Gates the PC onto the bus and latches it into MAR — i.e. MAR ← [PC]",
        "Writes MAR to memory",
        "Clears both registers",
      ],
      answer: 1,
      explain: "Xout drives register X onto the bus; Xin latches the bus into register X. Together PCout + MARin perform the transfer MAR ← [PC] in a single beat — a control function from Unit 2.1.",
    },
    {
      q: "During Execute of Add (R3), R1, why does the sequence do a second memory Read (beat 4)?",
      options: [
        "To re-fetch the same instruction",
        "Because (R3) is a memory operand — R3 holds the address, so its value must be read from memory before the add",
        "To store the result early",
        "To update the program counter again",
      ],
      answer: 1,
      explain: "(R3) means 'the value at the address in R3.' Beat 4 puts that address in MAR and reads it; the operand arrives in MDR (beat 5), then the ALU adds it to R1 (via Y) and writes back to R1.",
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
          {score === 4 ? "Perfect! You can drive a full instruction beat by beat, Y, Z, WMFC and all." :
            score >= 2 ? "Good work! Replay 'The Control Sequence' — walk all 7 beats once more." :
              "Revisit 'Why Y and Z' and 'The Control Sequence' — the whole unit rests on those two."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now run a whole instruction as a 7-beat control sequence — fetch, decode, then execute with Y and Z feeding
            the ALU on a single bus.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.6 — Multiple-Bus Organization.</strong>{" "}
            Seven beats for one add feels slow. What if we gave the datapath more than one bus so operands could travel at once?
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
export default function Unit2_5({ student, onUnitComplete }) {
  const sections = [
    { id: "journey", label: "The Whole Journey" },
    { id: "yz", label: "Why Y and Z" },
    { id: "signals", label: "Control Signals" },
    { id: "seq", label: "The Control Sequence" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🧭 The Whole Journey — fetch · decode · execute</h3>
      <TheJourney />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔁 Why Y and Z?</h3>
      <WhyYandZ />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎛️ Reading the Control Signals</h3>
      <ControlSignals />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>▶️ The Control Sequence — Add (R3), R1</h3>
      <ControlSequence />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.5.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.5</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Executing a Complete Instruction</div>
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
