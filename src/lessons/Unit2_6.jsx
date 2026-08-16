// Unit2_6.jsx — Module 2 › Unit 2.6 — "Executing a Complete Instruction"
// (Comes AFTER Unit 2.5 "Bus Organization & the Datapath": the road is built,
// now we drive a whole program across it.)
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck Ch 3 + the NonPipelined_Simulator.html datapath.
// Program (textbook convention: FIRST operand is the destination):
//   Load R1, A ; Load R2, B ; Add R4, R1, R2 ; Store R4, C   (A=5, B=3 → C=8)
// Arc: the five beats (Fetch·Decode·Execute·Memory·Write-back) + order-the-beats
// activity → the control signals → "Be the Control Unit" (drive the whole program
// one control-signal fire at a time, step-by-step data flow) → quiz.
import { useState, useEffect } from "react";

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

// The program every section uses.
const PROGRAM = [
  { addr: 0, asm: "Load  R1, A", tag: "absolute" },
  { addr: 4, asm: "Load  R2, B", tag: "absolute" },
  { addr: 8, asm: "Add   R4, R1, R2", tag: "reg–reg" },
  { addr: 12, asm: "Store R4, C", tag: "absolute" },
];

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Five Beats + arrange-the-beats activity
// ══════════════════════════════════════════════════════════════════
function FiveBeats() {
  const beats = [
    { n: "Fetch", color: C.green, body: "Bring the instruction from memory into IR (MAR←[PC], Read, MDR→IR); PC += 4." },
    { n: "Decode", color: C.teal, body: "Control reads the opcode and works out the destination + which source registers to read." },
    { n: "Execute", color: C.yellow, body: "The ALU does the work — the add, or (for indexed modes) computes the address." },
    { n: "Memory", color: C.orange, body: "Read or write the data word — only Load and Store use this beat." },
    { n: "Write-back", color: C.purple, body: "The result returns to the destination register." },
  ];

  // ----- order-the-beats mini-activity -----
  const correct = ["Fetch", "Decode", "Execute", "Memory", "Write-back"];
  const jumbled = ["Memory", "Fetch", "Write-back", "Execute", "Decode"];
  const [placed, setPlaced] = useState([]); // names placed in order
  const [wrong, setWrong] = useState(null);
  const nextNeeded = correct[placed.length];

  const clickTile = (name) => {
    if (placed.includes(name)) return;
    if (name === nextNeeded) { setPlaced((p) => [...p, name]); setWrong(null); }
    else { setWrong(name); setTimeout(() => setWrong(null), 500); }
  };
  const done = placed.length === correct.length;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every instruction runs through the same <strong style={{ color: C.text }}>five beats</strong>. We'll drive this whole
        program across the datapath: <code style={{ color: C.purple, fontFamily: "monospace" }}>Load R1,A · Load R2,B · Add R4,R1,R2 · Store R4,C</code>
        (A = 5, B = 3 → C = 8). First, meet the beats.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {beats.map((b, i) => (
          <div key={b.n} style={{ flex: 1, minWidth: 140, background: b.color + "12", border: `1px solid ${b.color}44`, borderRadius: 9, padding: "10px 12px" }}>
            <div style={{ color: b.color, fontWeight: 700, fontSize: 13 }}>{i + 1}. {b.n}</div>
            <div style={{ color: C.muted, fontSize: 11.5, marginTop: 3, lineHeight: 1.5 }}>{b.body}</div>
          </div>
        ))}
      </div>

      {/* activity */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
        <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>🧩 Put the beats back in order — click them Fetch → Write-back.</div>

        {/* slots */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {correct.map((name, i) => (
            <div key={i} style={{
              flex: 1, minWidth: 88, textAlign: "center", padding: "9px 4px", borderRadius: 8,
              border: `1.5px dashed ${placed[i] ? C.green : C.border}`,
              background: placed[i] ? C.green + "1E" : "transparent",
              color: placed[i] ? C.green : C.muted, fontSize: 11.5, fontWeight: 700,
            }}>{placed[i] || `${i + 1}.`}</div>
          ))}
        </div>

        {/* jumbled tiles */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {jumbled.map((name) => {
            const used = placed.includes(name);
            const isWrong = wrong === name;
            return (
              <button key={name} onClick={() => clickTile(name)} disabled={used} style={{
                flex: 1, minWidth: 88, padding: "9px 4px", borderRadius: 8, cursor: used ? "default" : "pointer",
                fontSize: 11.5, fontWeight: 700,
                background: used ? C.card : isWrong ? C.red + "22" : C.surface,
                border: `1.5px solid ${used ? C.border : isWrong ? C.red : C.accent}`,
                color: used ? C.muted : isWrong ? C.red : C.text, opacity: used ? 0.4 : 1,
              }}>{name}</button>
            );
          })}
        </div>

        {done && (
          <div style={{ marginTop: 10, background: C.green + "14", border: `1px solid ${C.green}55`, borderRadius: 8, padding: "8px 12px", fontSize: 12.5, color: C.green }}>
            🎉 Correct order! Fetch → Decode → Execute → Memory → Write-back. Every instruction follows this rhythm.
          </div>
        )}
        {placed.length > 0 && !done && (
          <div style={{ marginTop: 8, fontSize: 11.5, color: C.muted }}>Next: <strong style={{ color: C.text }}>{nextNeeded}</strong> · <button onClick={() => { setPlaced([]); setWrong(null); }} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 11.5 }}>↺ restart</button></div>
        )}
      </div>

      <Key color={C.accent}>
        <strong style={{ color: C.text }}>Fetch → Decode → Execute → Memory → Write-back.</strong> Fetch and Decode are the same
        for every instruction; Memory is used only by Load/Store; Write-back only when a register changes. Next we watch YOU
        drive each beat, signal by signal.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The control signals (anatomy click-to-reveal, expanded)
// ══════════════════════════════════════════════════════════════════
function ControlSignals() {
  const [pick, setPick] = useState(null);

  const sigs = [
    { key: "out", label: "PCout / Rout", color: C.teal, title: "Xout — gate a register ONTO the bus",
      body: "Xout opens register X's driver so its value rides the bus. PCout puts the program counter on the bus; R1out puts R1 on it. Exactly one 'out' per transfer." },
    { key: "in", label: "MARin / IRin / R1in", color: C.orange, title: "Xin — latch the bus INTO a register",
      body: "Xin opens register X's load line so it captures the bus at the clock edge. MARin loads MAR; IRin loads IR; R1in loads R1. This is the control function P : X ← bus from Unit 2.1." },
    { key: "rarb", label: "RAin / RBin", color: C.purple, title: "RAin / RBin — latch the operand registers",
      body: "On the multi-bus datapath (Unit 2.5), the two source operands read from the register file are latched into RA and RB so the ALU sees stable inputs." },
    { key: "rw", label: "Read / Write", color: C.green, title: "Read / Write — memory direction",
      body: "Read tells memory to fetch M[MAR] into MDR; Write stores MDR into M[MAR]. Raised in the same beat the address is in MAR." },
    { key: "wmfc", label: "WMFC / MFC", color: C.red, title: "WMFC — Wait for Memory-Function-Completed",
      body: "Because memory is slow, the beat that starts a Read/Write is followed by a wait until memory raises MFC — only then is MDR trustworthy (Unit 2.3)." },
    { key: "alu", label: "Add / Select · Zin", color: C.yellow, title: "ALU function + Zin",
      body: "Select routes the right word to the ALU's second input, Add (or Sub…) picks the operation, and Zin latches the result into RZ (Unit 2.2)." },
    { key: "muxy", label: "MuxY select · RYin", color: C.accent, title: "MuxY + RYin — the write-back chooser",
      body: "MuxY picks the ALU result (RZ) for arithmetic or the memory data (MDR) for a load; RYin latches the winner into RY, ready for write-back (Unit 2.5)." },
    { key: "end", label: "End", color: C.purple, title: "End — last microstep",
      body: "End marks the final beat and restarts the counter at the next instruction's fetch — the loop-back you'll build in the control unit (Unit 2.7)." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The control unit drives the datapath by raising tiny signals like
        <code style={{ color: C.accent, fontFamily: "monospace" }}> PCout, MARin, Read</code>. Each is one of a handful of verbs.
        Tap each to learn it — you'll fire them yourself in the next section.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {sigs.map((s) => (
          <button key={s.key} onClick={() => setPick(s.key)} style={{
            padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "monospace",
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
        Every beat is a set of these verbs fired together: some register drives the bus (<strong style={{ color: C.teal }}>Xout</strong>),
        others latch it (<strong style={{ color: C.orange }}>Xin</strong>), the ALU picks a function (<strong style={{ color: C.yellow }}>Add·Zin</strong>),
        and memory/timing signals (<strong style={{ color: C.green }}>Read</strong>/<strong style={{ color: C.red }}>WMFC</strong>) keep it honest.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — "Be the Control Unit": drive the whole program, one fire
//  at a time. Each click fires ONE control signal, animates ONLY that
//  transfer, shows the RTL, advances the beat's clock-pulse bar, and
//  highlights the current phase. Runs Load·Load·Add·Store through to C=8.
// ══════════════════════════════════════════════════════════════════

// ---- datapath geometry ----
const WIRES = {
  "pc-mar": "M100,65 L150,65",
  "pc-inc": "M62,84 L62,104",
  "mar-mem": "M226,65 L278,68",
  "mem-mdr": "M382,65 L436,65",
  "mdr-ir": "M482,84 L482,104",
  "imm-mar": "M500,104 C360,58 250,42 200,56",
  "rf-ra": "M142,268 L172,266",
  "rf-rb": "M142,320 L172,320",
  "alu-rz": "M340,300 L384,296",
  "rz-ry": "M440,296 L520,299",
  "mdr-ry": "M500,84 C610,150 560,300 520,300",
  "ry-rf": "M578,299 C660,392 96,398 84,360",
  "rf-rm": "M142,258 C300,180 350,214 384,222",
  "rm-mdr": "M412,210 C420,150 460,110 470,84",
  "mdr-mem": "M436,72 L384,72",
};

// build the 5 fetch micro-steps for an instruction
function fetchSteps(word, addr, nextPC) {
  return [
    { ph: "Fetch", sig: "PCout", rtl: "PC out → bus", wire: "pc-mar", pkt: String(addr), nodes: ["PC"],
      note: "You fire PCout — the PC drives address " + addr + " onto the bus toward MAR.", set: {} },
    { ph: "Fetch", sig: "MARin", rtl: "MAR ← [PC]", wire: "pc-mar", pkt: String(addr), nodes: ["MAR"],
      note: "You fire MARin — MAR latches address " + addr + ".", set: { MAR: String(addr) } },
    { ph: "Fetch", sig: "Read", rtl: "MDR ← M[MAR]", wire: "mem-mdr", pkt: "instr", nodes: ["MEM", "MDR"],
      note: "You fire Read. The address goes to memory; after MFC, the instruction word arrives in MDR.", set: { MDR: word } },
    { ph: "Fetch", sig: "MDRout, IRin", rtl: "IR ← [MDR]", wire: "mdr-ir", pkt: "instr", nodes: ["MDR", "IR"],
      note: "You fire MDRout and IRin — the instruction moves into IR.", set: { IR: word } },
    { ph: "Fetch", sig: "PCin (+4)", rtl: "PC ← PC + 4", wire: "pc-inc", pkt: "+4", nodes: ["PC"],
      note: "PC steps to " + nextPC + ". Fetch complete — the instruction is now in IR.", set: { PC: String(nextPC) } },
  ];
}

const STEPS = [
  // ── Load R1, A  (A at 100 = 5) ──
  ...fetchSteps("Load R1,A", 0, 4),
  { ins: 0, ph: "Decode", sig: "decode", rtl: "decode Load;  dest = R1", wire: null, nodes: ["IR"],
    note: "Control reads the opcode (Load) and destination R1. A is absolute — no source register to read.", set: {} },
  { ins: 0, ph: "Execute", idle: true, sig: "—", rtl: "— no ALU work", wire: null, nodes: ["ALU"],
    note: "Absolute load: the address A is already in the instruction, so the ALU is idle this beat.", set: {} },
  { ins: 0, ph: "Memory", sig: "MARin ← A", rtl: "MAR ← A", wire: "imm-mar", pkt: "A=100", nodes: ["MAR"],
    note: "The operand address A (100) goes into MAR.", set: { MAR: "100" } },
  { ins: 0, ph: "Memory", sig: "Read", rtl: "MDR ← M[MAR]", wire: "mem-mdr", pkt: "5", nodes: ["MEM", "MDR"],
    note: "Read: memory returns the value 5 into MDR.", set: { MDR: "5" } },
  { ins: 0, ph: "Memory", sig: "MDRout, RYin", rtl: "RY ← [MDR]", wire: "mdr-ry", pkt: "5", nodes: ["MDR", "MUXY", "RY"],
    note: "MuxY selects MDR; RY latches 5.", set: { RY: "5" } },
  { ins: 0, ph: "Write-back", sig: "RYout, R1in", rtl: "R1 ← [RY]", wire: "ry-rf", pkt: "5", nodes: ["RY", "RF"],
    note: "RY (5) is written into R1 through the register-file write port. R1 = 5.", set: { R1: "5" } },

  // ── Load R2, B  (B at 204 = 3) ──
  ...fetchSteps("Load R2,B", 4, 8),
  { ins: 1, ph: "Decode", sig: "decode", rtl: "decode Load;  dest = R2", wire: null, nodes: ["IR"],
    note: "Control reads Load, destination R2. B is absolute.", set: {} },
  { ins: 1, ph: "Execute", idle: true, sig: "—", rtl: "— no ALU work", wire: null, nodes: ["ALU"],
    note: "Absolute load — ALU idle.", set: {} },
  { ins: 1, ph: "Memory", sig: "MARin ← B", rtl: "MAR ← B", wire: "imm-mar", pkt: "B=204", nodes: ["MAR"],
    note: "The operand address B (204) goes into MAR.", set: { MAR: "204" } },
  { ins: 1, ph: "Memory", sig: "Read", rtl: "MDR ← M[MAR]", wire: "mem-mdr", pkt: "3", nodes: ["MEM", "MDR"],
    note: "Read: memory returns 3 into MDR.", set: { MDR: "3" } },
  { ins: 1, ph: "Memory", sig: "MDRout, RYin", rtl: "RY ← [MDR]", wire: "mdr-ry", pkt: "3", nodes: ["MDR", "MUXY", "RY"],
    note: "MuxY selects MDR; RY latches 3.", set: { RY: "3" } },
  { ins: 1, ph: "Write-back", sig: "RYout, R2in", rtl: "R2 ← [RY]", wire: "ry-rf", pkt: "3", nodes: ["RY", "RF"],
    note: "RY (3) is written into R2. R2 = 3.", set: { R2: "3" } },

  // ── Add R4, R1, R2 ──
  ...fetchSteps("Add R4,R1,R2", 8, 12),
  { ins: 2, ph: "Decode", sig: "R1out, RAin", rtl: "RA ← [R1]", wire: "rf-ra", pkt: "5", nodes: ["RF", "RA"],
    note: "Read the first source register: R1 (5) → RA.", set: { RA: "5" } },
  { ins: 2, ph: "Decode", sig: "R2out, RBin", rtl: "RB ← [R2]", wire: "rf-rb", pkt: "3", nodes: ["RF", "RB"],
    note: "Read the second source register: R2 (3) → RB. Destination is R4.", set: { RB: "3" } },
  { ins: 2, ph: "Execute", sig: "Add, Zin", rtl: "RZ ← [RA] + [RB]", wire: "alu-rz", pkt: "8", nodes: ["RA", "RB", "ALU", "RZ"],
    note: "The ALU adds 5 + 3 = 8 into RZ — the same adder you built in Unit 2.2.", set: { RZ: "8" } },
  { ins: 2, ph: "Memory", sig: "RZout, RYin", rtl: "RY ← [RZ]", wire: "rz-ry", pkt: "8", nodes: ["RZ", "MUXY", "RY"],
    note: "Arithmetic touches no memory. MuxY selects RZ; the result moves RZ → RY.", set: { RY: "8" } },
  { ins: 2, ph: "Write-back", sig: "RYout, R4in", rtl: "R4 ← [RY]", wire: "ry-rf", pkt: "8", nodes: ["RY", "RF"],
    note: "RY (8) is written into R4. R4 = 8.", set: { R4: "8" } },

  // ── Store R4, C  (C at 108) ──
  ...fetchSteps("Store R4,C", 12, 16),
  { ins: 3, ph: "Decode", sig: "R4out, RMin", rtl: "RM ← [R4]", wire: "rf-rm", pkt: "8", nodes: ["RF", "RM"],
    note: "Store reads the data to be written, R4 (8), into RM. C is absolute. (RM is used only by Store.)", set: { RM: "8" } },
  { ins: 3, ph: "Execute", idle: true, sig: "—", rtl: "— no ALU work", wire: null, nodes: ["ALU"],
    note: "Absolute store — ALU idle.", set: {} },
  { ins: 3, ph: "Memory", sig: "MARin ← C", rtl: "MAR ← C", wire: "imm-mar", pkt: "C=108", nodes: ["MAR"],
    note: "The destination address C (108) goes into MAR.", set: { MAR: "108" } },
  { ins: 3, ph: "Memory", sig: "RMout, MDRin", rtl: "MDR ← [RM]", wire: "rm-mdr", pkt: "8", nodes: ["RM", "MDR"],
    note: "The store data moves RM → MDR — every memory access goes through MDR.", set: { MDR: "8" } },
  { ins: 3, ph: "Memory", sig: "Write", rtl: "M[MAR] ← [MDR]", wire: "mdr-mem", pkt: "8", nodes: ["MDR", "MEM"],
    note: "Write: MDR (8) is stored into memory at C (108). Now C = 8 — the program is done!", set: { memC: "8" } },
  { ins: 3, ph: "Write-back", idle: true, sig: "—", rtl: "— idle", wire: null, nodes: [],
    note: "A Store writes nothing back to a register, so Write-back is idle. C = A + B = 8. ✓", set: {} },
];

const PHASES = ["Fetch", "Decode", "Execute", "Memory", "Write-back"];
const INIT = { PC: "0", MAR: "–", MDR: "–", IR: "–", RA: "–", RB: "–", RZ: "–", RM: "–", RY: "–", R1: "–", R2: "–", R4: "–", memC: "–" };

function BeTheControlUnit() {
  const [k, setK] = useState(0); // 0 = nothing fired yet; 1..N = after step k
  const [playing, setPlaying] = useState(false);

  // state after k fires
  const st = { ...INIT };
  for (let i = 0; i < k; i++) Object.assign(st, STEPS[i].set || {});
  const s = k > 0 ? STEPS[k - 1] : null;
  const phase = s ? s.ph : null;

  // per-phase clock-pulse progress (this beat's fires / total in the beat)
  let prog = 0, beatSig = "";
  if (s) {
    let a = k - 1, b = k - 1;
    while (a > 0 && STEPS[a - 1].ph === s.ph && sameInstr(a - 1, k - 1)) a--;
    while (b < STEPS.length - 1 && STEPS[b + 1].ph === s.ph && sameInstr(b + 1, k - 1)) b++;
    prog = (k - 1 - a + 1) / (b - a + 1);
    beatSig = `beat ${a + 1}–${b + 1}`;
  }
  function sameInstr(i, j) {
    // instruction boundary = a PCout step (start of a fetch). Group by counting.
    return instrOf(i) === instrOf(j);
  }

  useEffect(() => {
    if (!playing) return;
    if (k >= STEPS.length) { setPlaying(false); return; }
    const id = setTimeout(() => setK((v) => v + 1), 850);
    return () => clearTimeout(id);
  }, [playing, k]);

  const fire = () => { setPlaying(false); setK((v) => Math.min(STEPS.length, v + 1)); };
  const prev = () => { setPlaying(false); setK((v) => Math.max(0, v - 1)); };
  const reset = () => { setPlaying(false); setK(0); };

  const topDim = phase && phase !== "Fetch";   // fade fetch cluster once past fetch
  const botDim = phase === "Fetch";            // fade execute cluster during fetch
  const glow = (id) => s && s.nodes.includes(id);

  // a register box
  const Node = ({ id, x, y, w, h, label, val, lblCol, dim }) => {
    const on = glow(id);
    return (
      <g opacity={dim && !on ? 0.4 : 1} style={{ transition: "opacity 0.3s" }}>
        <rect x={x} y={y} width={w} height={h} rx={7} fill={on ? lblCol + "22" : C.card} stroke={on ? lblCol : C.border} strokeWidth={on ? 2.4 : 1.5} style={{ transition: "all 0.2s" }} />
        <text x={x + w / 2} y={y + (val !== undefined ? h / 2 - 1 : h / 2 + 4)} textAnchor="middle" fill={on ? lblCol : lblCol} fontSize={11} fontWeight="700">{label}</text>
        {val !== undefined && <text x={x + w / 2} y={y + h - 6} textAnchor="middle" fill={val !== "–" ? C.text : C.muted} fontSize={9} fontFamily="monospace">{val}</text>}
      </g>
    );
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Now <strong style={{ color: C.text }}>you are the control unit</strong>. Each press fires the next control signal — and
        <strong style={{ color: C.text }}> only that one transfer</strong> flows on the datapath, with its RTL shown. Watch the
        clock-pulse bar fill across each beat, the phase move Fetch → Write-back, and run all four instructions through to
        <code style={{ color: C.green, fontFamily: "monospace" }}> C = 8</code>.
      </p>

      {/* program strip — current instruction highlighted */}
      <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
        {PROGRAM.map((ins, i) => {
          const cur = k > 0 && instrOf(k - 1) === i;
          const doneIns = k > 0 && instrOf(k - 1) > i;
          return (
            <div key={i} style={{
              flex: 1, minWidth: 130, padding: "6px 8px", borderRadius: 7, fontFamily: "monospace", fontSize: 11,
              background: cur ? C.accentGlow : C.card, border: `1.5px solid ${cur ? C.accent : C.border}`,
              color: cur ? "#fff" : doneIns ? C.green : C.muted,
            }}>{doneIns ? "✓ " : cur ? "▶ " : ""}{ins.asm}</div>
          );
        })}
      </div>

      {/* phase chips */}
      <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
        {PHASES.map((p) => {
          const active = phase === p;
          return (
            <div key={p} style={{
              flex: 1, minWidth: 74, textAlign: "center", padding: "5px 4px", borderRadius: 20, fontSize: 10.5, fontWeight: 700,
              background: active ? C.accent : C.card, border: `1.5px solid ${active ? C.accent : C.border}`,
              color: active ? "#0D1117" : C.muted,
            }}>{p}</div>
          );
        })}
      </div>

      {/* datapath */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 8 }}>
        <svg viewBox="0 0 660 400" style={{ width: "100%", display: "block" }}>
          {/* wires (faint) */}
          {Object.entries(WIRES).map(([id, d]) => (
            <path key={id} d={d} fill="none" stroke={s && s.wire === id ? C.accent : C.border} strokeWidth={s && s.wire === id ? 3 : 1.6} opacity={s && s.wire === id ? 1 : 0.3} strokeDasharray={s && s.wire === id ? "7 5" : "none"} style={{ transition: "all 0.2s" }} markerEnd={s && s.wire === id ? "url(#u26ah)" : undefined} />
          ))}

          {/* top cluster: fetch path */}
          <Node id="PC" x={24} y={46} w={76} h={38} label="PC" val={st.PC} lblCol={C.teal} dim={topDim} />
          <text x={62} y={116} textAnchor="middle" fill={C.muted} fontSize={8} opacity={topDim ? 0.4 : 1}>+4</text>
          <Node id="MAR" x={150} y={46} w={76} h={38} label="MAR" val={st.MAR} lblCol={C.orange} dim={topDim} />
          <Node id="MEM" x={278} y={28} w={104} h={88} label="MEMORY" lblCol={C.red} dim={topDim} />
          <text x={330} y={70} textAnchor="middle" fill={C.muted} fontSize={8} opacity={topDim ? 0.4 : 1}>A=5@100</text>
          <text x={330} y={82} textAnchor="middle" fill={C.muted} fontSize={8} opacity={topDim ? 0.4 : 1}>B=3@204</text>
          <text x={330} y={94} textAnchor="middle" fill={st.memC === "8" ? C.green : C.muted} fontSize={8} opacity={topDim ? 0.4 : 1}>C={st.memC}@108</text>
          <Node id="MDR" x={436} y={46} w={92} h={38} label="MDR" val={st.MDR} lblCol={C.teal} dim={topDim} />
          <Node id="IR" x={436} y={104} w={150} h={34} label="IR" val={st.IR} lblCol={C.purple} dim={phase && phase !== "Fetch" && phase !== "Decode"} />

          {/* bottom cluster: execute path */}
          <g opacity={botDim ? 0.4 : 1} style={{ transition: "opacity 0.3s" }}>
            {/* register file */}
            <rect x={24} y={250} width={118} height={108} rx={9} fill={glow("RF") ? C.teal + "22" : C.card} stroke={glow("RF") ? C.teal : C.border} strokeWidth={glow("RF") ? 2.4 : 1.5} style={{ transition: "all 0.2s" }} />
            <text x={83} y={268} textAnchor="middle" fill={C.teal} fontSize={10} fontWeight="700">Register file</text>
            {[["R1", st.R1, 284], ["R2", st.R2, 312], ["R4", st.R4, 340]].map(([r, v, yy]) => (
              <g key={r}>
                <rect x={38} y={yy - 13} width={90} height={22} rx={4} fill={C.bg} stroke={C.border} strokeWidth={1} />
                <text x={46} y={yy + 2} fill={C.muted} fontSize={9} fontFamily="monospace">{r}</text>
                <text x={120} y={yy + 2} textAnchor="end" fill={v !== "–" ? C.teal : C.muted} fontSize={9} fontFamily="monospace" fontWeight="700">{v}</text>
              </g>
            ))}
          </g>
          <Node id="RA" x={172} y={252} w={60} h={30} label="RA" val={st.RA} lblCol={C.purple} dim={botDim} />
          <Node id="RB" x={172} y={306} w={60} h={30} label="RB" val={st.RB} lblCol={C.purple} dim={botDim} />
          {/* ALU */}
          <g opacity={botDim && !glow("ALU") ? 0.4 : 1} style={{ transition: "opacity 0.3s" }}>
            <polygon points="268,246 340,274 340,336 268,364" fill={glow("ALU") ? C.accent + "22" : C.card} stroke={glow("ALU") ? C.accent : C.border} strokeWidth={glow("ALU") ? 2.4 : 1.5} style={{ transition: "all 0.2s" }} />
            <text x={300} y={309} textAnchor="middle" fill={C.accent} fontSize={11} fontWeight="700">ALU</text>
          </g>
          <Node id="RM" x={384} y={206} w={56} h={30} label="RM" val={st.RM} lblCol={C.orange} dim={botDim} />
          <Node id="RZ" x={384} y={282} w={56} h={30} label="RZ" val={st.RZ} lblCol={C.purple} dim={botDim} />
          {/* MuxY */}
          <g opacity={botDim && !glow("MUXY") ? 0.4 : 1} style={{ transition: "opacity 0.3s" }}>
            <polygon points="466,278 466,320 502,308 502,290" fill={glow("MUXY") ? C.accent + "22" : C.card} stroke={glow("MUXY") ? C.accent : C.border} strokeWidth={glow("MUXY") ? 2.2 : 1.4} style={{ transition: "all 0.2s" }} />
            <text x={484} y={302} textAnchor="middle" fill={C.muted} fontSize={7.5} fontWeight="700">MuxY</text>
          </g>
          <Node id="RY" x={520} y={284} w={58} h={30} label="RY" val={st.RY} lblCol={C.purple} dim={botDim} />

          {/* moving packet on the active wire */}
          {s && s.wire && s.pkt && (
            <g>
              <rect x={-15} y={-8} width={30} height={16} rx={3} fill={C.yellow} />
              <text y={4} textAnchor="middle" fill="#0D1117" fontSize={8} fontWeight="800">{s.pkt}</text>
              <animateMotion dur="0.9s" repeatCount="indefinite" path={WIRES[s.wire]} />
            </g>
          )}

          <defs>
            <marker id="u26ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.accent} /></marker>
          </defs>
        </svg>
      </div>

      {/* the fired signal + RTL, sitting above the clock-pulse bar */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
        <div style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 800, fontFamily: "monospace", background: s && !s.idle ? C.green + "22" : C.card, border: `1.5px solid ${s && !s.idle ? C.green : C.border}`, color: s && !s.idle ? C.green : C.muted }}>
          {s ? "⚡ " + s.sig : "ready"}
        </div>
        <div style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: C.accent, fontWeight: 700 }}>
          {s ? "RTL:  " + s.rtl : "Press Fire to start executing Load R1, A"}
        </div>
      </div>
      {/* clock-pulse progress bar for the current beat */}
      <div style={{ height: 8, background: C.card, borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${Math.round(prog * 100)}%`, background: `linear-gradient(90deg, ${C.accentGlow}, ${C.green})`, transition: "width 0.25s" }} />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", fontSize: 12.5, color: C.text, minHeight: 40, lineHeight: 1.55, marginBottom: 10 }}>
        {s ? s.note : "You'll fire ~43 control signals to run the whole program. Fire them one by one, or hit Auto-run to watch a phase play out."}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={prev} disabled={k === 0} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`, fontWeight: 700, fontSize: 12.5,
          background: C.card, color: k === 0 ? C.muted : C.text, cursor: k === 0 ? "default" : "pointer", opacity: k === 0 ? 0.5 : 1,
        }}>◀ Prev</button>
        <button onClick={fire} disabled={k >= STEPS.length} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: k >= STEPS.length ? C.card : C.accentGlow, color: k >= STEPS.length ? C.muted : "#fff",
          cursor: k >= STEPS.length ? "default" : "pointer",
        }}>{k >= STEPS.length ? "✓ Program complete — C = 8" : "⚡ Fire next signal ▶"}</button>
        <button onClick={() => setPlaying((p) => !p)} disabled={k >= STEPS.length} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`, fontWeight: 700, fontSize: 12.5,
          background: playing ? C.red + "18" : C.card, color: playing ? C.red : C.text, cursor: k >= STEPS.length ? "default" : "pointer",
        }}>{playing ? "⏸ Pause" : "⏩ Auto-run"}</button>
        <button onClick={reset} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer",
        }}>↺ Reset</button>
      </div>
      <div style={{ textAlign: "center", color: C.muted, fontSize: 11, marginTop: 6 }}>
        signal {k} / {STEPS.length} · {beatSig}
      </div>

      <Key color={C.green}>
        A whole program is just this: the control unit firing signals in order, each moving one value along one wire, beat by
        beat, instruction after instruction. <strong style={{ color: C.text }}>Fetch → Decode → Execute → Memory → Write-back</strong>,
        four times, and <code style={{ fontFamily: "monospace" }}>C = A + B = 8</code> lands in memory. Next: who <em>generates</em>
        these signals? That's the control unit — Unit 2.7.
      </Key>
    </div>
  );
}

// helper used above: which instruction a step index belongs to (0..3)
function instrOf(i) {
  // each instruction contributes a run of steps; a new instruction starts at a PCout fetch step
  let ins = -1;
  for (let j = 0; j <= i; j++) {
    if (STEPS[j].ph === "Fetch" && STEPS[j].sig === "PCout") ins++;
  }
  return ins;
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, instant feedback, completion card
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "What are the five beats every instruction passes through, in order?",
      options: [
        "Read, Decode, Add, Store, Reset",
        "Fetch, Decode, Execute, Memory, Write-back",
        "Fetch, Execute, Decode, Write-back, Memory",
        "Input, Process, Output, Store, Loop",
      ],
      answer: 1,
      explain: "Fetch (bring the instruction in) → Decode (read opcode + source registers) → Execute (ALU) → Memory (Load/Store only) → Write-back (result to a register).",
    },
    {
      q: "During the Fetch of every instruction, what do PCout and MARin accomplish together?",
      options: [
        "They add PC and MAR",
        "They perform MAR ← [PC] — the PC's value is gated onto the bus and latched into MAR",
        "They write the instruction to memory",
        "They clear the program counter",
      ],
      answer: 1,
      explain: "PCout drives the PC onto the bus; MARin latches it into MAR. Together they do MAR ← [PC], so memory knows which instruction to fetch.",
    },
    {
      q: "For Add R4, R1, R2, which beats read the source registers and produce the result?",
      options: [
        "Fetch reads them; Memory produces the result",
        "Decode latches R1→RA and R2→RB; Execute computes RZ ← [RA]+[RB]",
        "Write-back reads them; Fetch computes",
        "Memory reads them; Decode computes",
      ],
      answer: 1,
      explain: "Decode reads the two source registers into RA and RB; Execute runs the ALU (RZ ← RA + RB). Then Memory just moves RZ → RY, and Write-back puts RY into R4.",
    },
    {
      q: "In this program, which register is used ONLY by the Store instruction?",
      options: ["RY", "RZ", "RM — it holds the data going out to memory", "RA"],
      answer: 2,
      explain: "RM carries the register value out to memory on a Store (RM → MDR → memory). Loads and arithmetic never use it — their write-back path is RZ/MDR → MuxY → RY.",
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
          {score === 4 ? "Perfect! You drove a whole program across the datapath, beat by beat." :
            score >= 2 ? "Good work! Replay 'Be the Control Unit' — fire through one instruction end to end." :
              "Revisit 'The Five Beats' and 'Be the Control Unit', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.6 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You executed a whole program — Load, Load, Add, Store — beat by beat, firing every control signal yourself and
            watching each transfer flow across the datapath until C = 8.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.7 — Microprogrammed Control.</strong>{" "}
            You fired the signals by hand. Now: what machine <em>generates</em> them, in the right order, every clock?
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
export default function Unit2_6({ student, onUnitComplete }) {
  const sections = [
    { id: "beats", label: "The Five Beats" },
    { id: "signals", label: "Control Signals" },
    { id: "control", label: "Be the Control Unit" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🥁 The Five Beats of an Instruction</h3>
      <FiveBeats />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎛️ The Control Signals</h3>
      <ControlSignals />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎮 Be the Control Unit — run the whole program</h3>
      <BeTheControlUnit />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.6.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(3); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>▶️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.6</div>
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
