// Unit2_7.jsx — Module 2 › Unit 2.7 — "Microprogrammed Control"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 5 (Control Unit, Mano §7 / Hamacher §5.4).
// Arc: the need for a conductor → hardwired control (a signal is a Boolean
// equation, Read = T1 + T4·LOAD) → microprogrammed control (signals stored in a
// control store, μPC walks a microroutine) → head-to-head trade-off → quiz.
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
//  Section 1 — The Need: a datapath is idle wires without a conductor
// ══════════════════════════════════════════════════════════════════
function TheConductor() {
  const [signals, setSignals] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Units 2.3–2.6 built the datapath — registers, ALU, buses, MAR/MDR. But those are just wires. In Unit 2.6 you saw every
        beat is a set of control signals (<code style={{ color: C.accent, fontFamily: "monospace" }}>PCout, MARin, Read…</code>).
        <strong style={{ color: C.text }}> Something must raise the right ones, in the right order, every clock.</strong> Turn the
        conductor on.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 150" style={{ width: "100%", display: "block" }}>
          {/* control unit */}
          <rect x={40} y={55} width={130} height={50} rx={10} fill={signals ? C.purple + "1E" : C.card} stroke={signals ? C.purple : C.border} strokeWidth={1.8} />
          <text x={105} y={78} textAnchor="middle" fill={signals ? C.purple : C.muted} fontSize={12} fontWeight="700">Control Unit</text>
          <text x={105} y={95} textAnchor="middle" fill={C.muted} fontSize={9}>the conductor</text>
          {/* signal wires */}
          {[65, 80, 95].map((y, i) => (
            <line key={i} x1={170} y1={y} x2={330} y2={y} stroke={signals ? C.yellow : C.border} strokeWidth={2} opacity={signals ? 1 : 0.35} strokeDasharray={signals ? "none" : "3 3"} />
          ))}
          <text x={250} y={45} textAnchor="middle" fill={signals ? C.yellow : C.muted} fontSize={9}>control signals</text>
          {/* datapath */}
          <rect x={340} y={45} width={140} height={70} rx={10} fill={C.card} stroke={signals ? C.teal : C.border} strokeWidth={1.8} />
          <text x={410} y={76} textAnchor="middle" fill={signals ? C.teal : C.muted} fontSize={12} fontWeight="700">Datapath</text>
          <text x={410} y={94} textAnchor="middle" fill={C.muted} fontSize={9}>{signals ? "running ▶" : "idle wires"}</text>
        </svg>
      </div>

      <button onClick={() => setSignals(s => !s)} style={{
        width: "100%", padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
        background: signals ? C.card : C.accentGlow, color: signals ? C.muted : "#fff", cursor: "pointer",
        borderColor: C.border, marginBottom: 12, ...(signals ? { border: `1px solid ${C.border}` } : {}),
      }}>{signals ? "↺ Silence the control unit" : "▶ Raise the control signals"}</button>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {signals
          ? <span>With the conductor firing signals each beat, the datapath actually executes. <strong style={{ color: C.text }}>The control unit is what turns a lifeless datapath into a processor.</strong> It has one job — and two ways to build it.</span>
          : <span>Silent: no loads, no bus enables, no ALU function. The hardware sits there. A datapath with no control is an orchestra with no conductor.</span>}
      </div>

      <Key color={C.purple}>
        The <strong style={{ color: C.purple }}>control unit</strong> reads the IR (which instruction), a step counter (which
        beat) and flags, and each clock raises exactly the control signals that beat needs. Two designs do this:
        <strong style={{ color: C.accent }}> hardwired</strong> and <strong style={{ color: C.purple }}>microprogrammed</strong>.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2a — Hardwired anatomy: three parts, one combinational box
//  (matches the classroom deck's "open the box" diagram — this was the
//  piece missing before: WHERE the equation in the next widget comes from)
// ══════════════════════════════════════════════════════════════════
function HardwiredAnatomy() {
  const parts = [
    { key: "ir", label: "Instruction decoder", color: C.teal, blurb: "Reads the opcode out of the IR. Its output says which instruction — LOAD, ADD, STORE…" },
    { key: "step", label: "Step counter", color: C.accent, blurb: "A small counter (Hamacher: modulo-5, T1–T5 · Mano: a 4-bit sequence counter) that says which beat of the instruction we're on right now." },
    { key: "flags", label: "Flags Z N C V", color: C.yellow, blurb: "Condition-code bits, so a signal can also depend on the last ALU result (e.g. a conditional branch's control line)." },
  ];
  const [open, setOpen] = useState("ir");
  const p = parts.find((x) => x.key === open);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        "A fixed circuit" is vague until you open the box. Inside are exactly <strong style={{ color: C.text }}>three</strong> pieces
        feeding one <strong style={{ color: C.accent }}>control signal generator</strong> — click each one.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {parts.map((x) => (
          <button key={x.key} onClick={() => setOpen(x.key)} style={{
            flex: 1, minWidth: 130, padding: "10px 8px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
            background: open === x.key ? x.color + "22" : C.card, border: `2px solid ${open === x.key ? x.color : C.border}`,
            color: open === x.key ? x.color : C.muted,
          }}>{x.label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 90" style={{ width: "100%", display: "block", marginBottom: 10 }}>
          {parts.map((x, i) => (
            <g key={x.key}>
              <rect x={10 + i * 170} y={10} width={150} height={40} rx={8}
                fill={open === x.key ? x.color + "22" : "transparent"} stroke={open === x.key ? x.color : C.border} strokeWidth={1.8} />
              <text x={85 + i * 170} y={34} textAnchor="middle" fontSize={10.5} fontWeight="700" fill={open === x.key ? x.color : C.muted}>{x.label}</text>
              <line x1={85 + i * 170} y1={50} x2={260} y2={70} stroke={open === x.key ? x.color : C.border} strokeWidth={1.6} />
            </g>
          ))}
          <rect x={185} y={65} width={150} height={22} rx={6} fill={C.accent + "18"} stroke={C.accent} strokeWidth={1.6} />
          <text x={260} y={80} textAnchor="middle" fontSize={9.5} fontWeight="700" fill={C.accent}>Control signal generator</text>
        </svg>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{p.blurb}</div>
      </div>

      <Key color={C.accent}>
        <strong style={{ color: C.teal }}>Decoder</strong> says <em>which</em> instruction, the <strong style={{ color: C.accent }}>step
        counter</strong> says <em>which beat</em>, and the <strong style={{ color: C.accent }}>generator</strong> ANDs/ORs those inputs
        (plus flags) into every control signal. What the generator actually computes is the equation you'll build in the next widget.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Hardwired: a signal is a Boolean equation
// ══════════════════════════════════════════════════════════════════
function Hardwired() {
  const [beat, setBeat] = useState(1);       // T1..T5
  const [opcode, setOpcode] = useState("LOAD"); // LOAD | ADD

  // Read = T1 + T4·LOAD  (Hamacher's example)
  const termT1 = beat === 1;
  const termT4LOAD = beat === 4 && opcode === "LOAD";
  const readHigh = termT1 || termT4LOAD;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        <strong style={{ color: C.accent }}>Hardwired</strong> control freezes the decision into logic gates. Each control
        signal is just a <strong style={{ color: C.text }}>Boolean equation</strong>: the OR of the beats that need it. Take
        memory Read: <code style={{ color: C.accent, fontFamily: "monospace" }}>Read = T1 + T4·LOAD</code>. Set the beat and the
        opcode and watch the line.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5].map((t) => (
          <button key={t} onClick={() => setBeat(t)} style={{
            flex: 1, minWidth: 48, padding: "8px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12,
            background: beat === t ? C.accentGlow : C.card, border: `2px solid ${beat === t ? C.accent : C.border}`,
            color: beat === t ? "#fff" : C.muted,
          }}>T{t}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["LOAD", "ADD"].map((op) => (
          <button key={op} onClick={() => setOpcode(op)} style={{
            flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "monospace",
            background: opcode === op ? C.teal + "22" : C.card, border: `2px solid ${opcode === op ? C.teal : C.border}`,
            color: opcode === op ? C.teal : C.muted,
          }}>opcode = {op}</button>
        ))}
      </div>

      {/* the equation lighting up */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800 }}>
          <span style={{ color: readHigh ? C.green : C.muted }}>Read</span>
          <span style={{ color: C.muted }}> = </span>
          <span style={{ color: termT1 ? C.green : C.muted, background: termT1 ? C.green + "22" : "transparent", padding: "2px 6px", borderRadius: 5 }}>T1</span>
          <span style={{ color: C.muted }}> + </span>
          <span style={{ color: termT4LOAD ? C.green : C.muted, background: termT4LOAD ? C.green + "22" : "transparent", padding: "2px 6px", borderRadius: 5 }}>T4·LOAD</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 22, fontWeight: 800, color: readHigh ? C.green : C.red }}>
          Read = {readHigh ? "1  ●" : "0  ○"}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {termT1
          ? <span>On <strong style={{ color: C.green }}>T1</strong>, fetch always reads the instruction — the first term fires, no matter the opcode.</span>
          : termT4LOAD
            ? <span>On <strong style={{ color: C.green }}>T4</strong> with opcode <strong style={{ color: C.teal }}>LOAD</strong>, the operand is read — the second term fires.</span>
            : <span>Neither term is true this beat, so the Read line stays <strong style={{ color: C.red }}>low</strong>. (An ADD never reads on T4 — it has no memory operand here.)</span>}
      </div>

      <Key color={C.accent}>
        Hardwired = <strong style={{ color: C.text }}>instruction decoder + step counter + a gate for every signal</strong>. Each
        signal is a Boolean OR of the beats that raise it (e.g. <code style={{ fontFamily: "monospace" }}>MARin = T1 + T4·(LOAD+STORE)</code>).
        Fast — one gate delay — but changing the design means rewiring the chip.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3a — Address generator + how the µPC picks its NEXT address
//  (the deck's missing piece: opcode -> start address, and the four
//  sequencing cases hiding inside "increment or branch")
// ══════════════════════════════════════════════════════════════════
function AddressGenAndSequencing() {
  const [opcode, setOpcode] = useState("LOAD");
  const starts = { LOAD: 40, ADD: 90, STORE: 130 };

  const seqCases = [
    { key: "inline", label: "In-line", color: C.green, blurb: "Increment the control-address register (CAR) — the usual next step, most beats." },
    { key: "branch", label: "Branch", color: C.yellow, blurb: "Unconditional, or conditional — test a flag (Z, N, C, V) and jump elsewhere in the routine." },
    { key: "map", label: "Map", color: C.teal, blurb: "Right after fetch, the opcode maps to this instruction's own microroutine start address — the step you just drove above." },
    { key: "end", label: "End", color: C.red, blurb: "The End bit forces a jump back to the shared fetch microroutine — done with this instruction." },
  ];
  const [seq, setSeq] = useState("map");
  const s = seqCases.find((x) => x.key === seq);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Before the µPC can walk a routine, something has to tell it <strong style={{ color: C.text }}>where to start</strong>. That's the
        job of the <strong style={{ color: C.yellow }}>address generator</strong>: it reads the freshly-fetched opcode and produces the
        control-store address of that opcode's microroutine. Pick an opcode.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {Object.keys(starts).map((op) => (
          <button key={op} onClick={() => setOpcode(op)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5, fontFamily: "monospace",
            background: opcode === op ? C.teal + "22" : C.card, border: `2px solid ${opcode === op ? C.teal : C.border}`,
            color: opcode === op ? C.teal : C.muted,
          }}>{op}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ padding: "8px 12px", borderRadius: 8, background: C.yellow + "1E", border: `2px solid ${C.yellow}`, fontSize: 12, fontWeight: 700, color: C.yellow }}>IR = {opcode}</div>
        <div style={{ color: C.muted, fontSize: 18 }}>→</div>
        <div style={{ padding: "8px 12px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>address generator</div>
        <div style={{ color: C.muted, fontSize: 18 }}>→</div>
        <div style={{ padding: "8px 14px", borderRadius: 8, background: C.purple + "1E", border: `2px solid ${C.purple}`, fontSize: 14, fontWeight: 800, color: C.purple, fontFamily: "monospace" }}>µPC ← {starts[opcode]}</div>
      </div>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 10, lineHeight: 1.7 }}>
        That's one of <strong style={{ color: C.text }}>four</strong> ways the sequencing word can set the next address every beat.
        Tap each to see when it fires.
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {seqCases.map((x) => (
          <button key={x.key} onClick={() => setSeq(x.key)} style={{
            flex: 1, minWidth: 90, padding: "8px 6px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 11.5,
            background: seq === x.key ? x.color + "22" : C.card, border: `2px solid ${seq === x.key ? x.color : C.border}`,
            color: seq === x.key ? x.color : C.muted,
          }}>{x.label}</button>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>{s.blurb}</div>

      <Key color={C.yellow}>
        Every microinstruction's sequencing bits pick exactly one of these four moves. That's the whole mechanism behind "the µPC
        walks the routine" — it is never a mystery, always one of: <strong style={{ color: C.green }}>increment</strong>,
        <strong style={{ color: C.yellow }}> branch</strong>, <strong style={{ color: C.teal }}>map</strong>, or
        <strong style={{ color: C.red }}> End</strong>.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Microprogrammed: signals stored in a control store
// ══════════════════════════════════════════════════════════════════
function Microprogrammed() {
  const [upc, setUpc] = useState(0); // which microinstruction is being read

  // A tiny control store: the shared fetch microroutine + a 2-word execute stub.
  const store = [
    { addr: 0, sig: "PCout, MARin, Read, Zin", seq: "increment", end: false, note: "fetch — send PC to memory, start read" },
    { addr: 1, sig: "Zout, PCin, WMFC", seq: "increment", end: false, note: "fetch — update PC, wait for memory" },
    { addr: 2, sig: "MDRout, IRin", seq: "map (opcode)", end: false, note: "fetch — instruction into IR; jump to its routine" },
    { addr: 3, sig: "R3out, MARin, Read", seq: "increment", end: false, note: "execute — read the memory operand" },
    { addr: 4, sig: "MDRout, Add, Zin, then Zout, R1in", seq: "End", end: true, note: "execute — add and write back; End loops to fetch" },
  ];
  const row = store[upc];

  const step = () => setUpc((v) => (v >= store.length - 1 ? 0 : v + 1));

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        <strong style={{ color: C.purple }}>Microprogrammed</strong> control flips the idea: instead of <em>computing</em>
        signals with gates, <strong style={{ color: C.text }}>look them up</strong>. Each beat is one word in a tiny memory —
        the <strong style={{ color: C.accent }}>control store</strong>. The <strong style={{ color: C.purple }}>μPC</strong> walks
        the words; each word's bits <em>are</em> the control signals. Step the μPC.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
        <div style={{ padding: "8px 14px", borderRadius: 10, background: C.purple + "1E", border: `2px solid ${C.purple}`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 10 }}>μPC</div>
          <div style={{ color: C.purple, fontFamily: "monospace", fontSize: 20, fontWeight: 800 }}>{row.addr}</div>
        </div>
        <div style={{ color: C.muted, fontSize: 12, flex: 1 }}>points at the next microinstruction in the control store →</div>
      </div>

      {/* control store rows */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ display: "flex", padding: "6px 10px", background: C.surface, fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 0.5 }}>
          <div style={{ width: 34 }}>ADDR</div>
          <div style={{ flex: 1 }}>CONTROL WORD (signal bits)</div>
          <div style={{ width: 78 }}>SEQUENCING</div>
        </div>
        {store.map((r) => {
          const active = r.addr === upc;
          return (
            <div key={r.addr} style={{
              display: "flex", padding: "8px 10px", alignItems: "center", fontSize: 11.5,
              background: active ? C.purple + "18" : "transparent",
              borderTop: `1px solid ${C.border}`, transition: "background 0.2s",
            }}>
              <div style={{ width: 34, fontFamily: "monospace", color: active ? C.purple : C.muted, fontWeight: 800 }}>{r.addr}</div>
              <div style={{ flex: 1, fontFamily: "monospace", color: active ? C.text : C.muted }}>{r.sig}</div>
              <div style={{ width: 78, fontSize: 10, color: r.end ? C.red : C.green, fontWeight: 700 }}>{r.seq}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 38, lineHeight: 1.6, marginBottom: 10 }}>
        {row.note}{row.end && <strong style={{ color: C.red }}> — the End bit restarts the μPC at address 0 (fetch).</strong>}
      </div>

      <button onClick={step} style={{
        width: "100%", padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
        background: C.accentGlow, color: "#fff", cursor: "pointer",
      }}>Step μPC ▶ {row.end ? "(End → back to fetch)" : ""}</button>

      <Key color={C.purple}>
        Each <strong style={{ color: C.text }}>microinstruction</strong> = a control word (the signal bits) + a sequencing word
        (increment, branch, opcode-map, or <strong style={{ color: C.red }}>End</strong>). The μPC walks a
        <strong style={{ color: C.purple }}> microroutine</strong> per opcode. A CPU is a tiny computer running microcode beneath
        your assembly — flexible, but a memory read per beat makes it slower.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Head to head: pick a scenario, see which wins
// ══════════════════════════════════════════════════════════════════
function HeadToHead() {
  const [scn, setScn] = useState(null);

  const scenarios = [
    { key: "speed", label: "Need max speed, simple regular ISA", win: "Hardwired", color: C.accent,
      why: "Signals appear in one gate delay with no memory lookup. A small, regular RISC instruction set keeps the gate-logic tiny — so modern RISC CPUs are hardwired." },
    { key: "newinstr", label: "Add a new complex instruction after fabrication", win: "Microprogrammed", color: C.purple,
      why: "Just rewrite the control store — edit microcode, no re-fabrication. Rich CISC instruction sets grew this way. The cost is a memory read every beat (slower)." },
    { key: "iot", label: "Tiny low-power IoT microcontroller, rich instructions", win: "Microprogrammed", color: C.purple,
      why: "Complex instructions in a small chip are far easier to express as microcode than as a huge combinational gate network. Flexibility and area win over raw speed here." },
  ];
  const s = scn ? scenarios.find((x) => x.key === scn) : null;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Both styles raise the same signals — they differ only on <strong style={{ color: C.text }}>where the decision lives</strong>:
        frozen in gates, or stored as microcode. Pick a design goal and see which wins.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {scenarios.map((x) => (
          <button key={x.key} onClick={() => setScn(x.key)} style={{
            textAlign: "left", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
            background: scn === x.key ? x.color + "1E" : C.card,
            border: `2px solid ${scn === x.key ? x.color : C.border}`, color: scn === x.key ? x.color : C.text,
          }}>{x.label}</button>
        ))}
      </div>

      {s && (
        <div style={{ background: s.color + "12", border: `1px solid ${s.color}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 4 }}>
          <div style={{ color: s.color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>→ {s.win} wins</div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{s.why}</div>
        </div>
      )}

      {/* mini comparison table */}
      <div style={{ marginTop: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
        {[
          ["Decision lives in", "fixed gates", "a control store"],
          ["Speed", "faster (1 gate delay)", "slower (memory read/beat)"],
          ["Flexibility", "rigid — rewire", "flexible — rewrite microcode"],
          ["Best fit", "RISC (simple)", "CISC (rich)"],
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", fontSize: 11.5, borderTop: i ? `1px solid ${C.border}` : "none" }}>
            <div style={{ flex: 1, padding: "7px 10px", color: C.muted }}>{r[0]}</div>
            <div style={{ flex: 1, padding: "7px 10px", color: C.accent, fontWeight: 600 }}>{r[1]}</div>
            <div style={{ flex: 1, padding: "7px 10px", color: C.purple, fontWeight: 600 }}>{r[2]}</div>
          </div>
        ))}
        <div style={{ display: "flex", fontSize: 10, background: C.surface, color: C.muted, fontWeight: 700 }}>
          <div style={{ flex: 1, padding: "6px 10px" }}>PROPERTY</div>
          <div style={{ flex: 1, padding: "6px 10px", color: C.accent }}>HARDWIRED</div>
          <div style={{ flex: 1, padding: "6px 10px", color: C.purple }}>MICROPROGRAMMED</div>
        </div>
      </div>

      <Key color={C.yellow}>
        One sentence for the exam: <strong style={{ color: C.accent }}>hardwired trades flexibility for speed</strong>;
        <strong style={{ color: C.purple }}> microprogrammed trades speed for flexibility</strong>. Same job, opposite bets.
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
      q: "What is the control unit's one job?",
      options: [
        "To store the program in memory",
        "Each clock, raise exactly the control signals the current step needs",
        "To perform arithmetic",
        "To hold the operands for the ALU",
      ],
      answer: 1,
      explain: "The control unit reads IR, a step counter and flags, and every beat asserts precisely the signals (register loads, bus enables, ALU function, Read/Write) that step requires — turning idle wires into a running processor.",
    },
    {
      q: "In hardwired control, what is each control signal?",
      options: [
        "A word stored in memory",
        "A Boolean equation — the OR of the beats (and opcodes) that need it, e.g. Read = T1 + T4·LOAD",
        "A single transistor",
        "An instruction written by the programmer",
      ],
      answer: 1,
      explain: "Hardwired control is combinational logic. Each signal line is the OR of the timing steps that raise it, gated by opcode where needed. Fast (one gate delay), but changing it means redesigning the gates.",
    },
    {
      q: "In microprogrammed control, what does the μPC (μ program counter) do?",
      options: [
        "It stores the ALU result",
        "It walks through microinstructions in the control store, one per beat",
        "It counts memory accesses",
        "It decodes the opcode into gates",
      ],
      answer: 1,
      explain: "The μPC holds the address of the next microinstruction in the control store. Each beat it reads one word whose bits are the control signals, then increments, branches, maps on opcode, or ends.",
    },
    {
      q: "You must add a new complex instruction after the chip is fabricated. Which control style makes that easier, and what's the cost?",
      options: [
        "Hardwired — but it needs more memory",
        "Microprogrammed — just rewrite the control store; the cost is a slower memory read per beat",
        "Hardwired — free and instant",
        "Neither can be changed after fabrication",
      ],
      answer: 1,
      explain: "Microprogrammed control is flexible: edit the microcode in the control store, no re-fabrication. The trade-off is speed — every beat needs a control-store read. Hardwired would require redesigning and re-fabricating the gates.",
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
          {score === 4 ? "Perfect! You can build a control unit both ways and defend the trade-off." :
            score >= 2 ? "Good work! Replay 'Hardwired' and 'Microprogrammed' to lock the two designs in." :
              "Revisit 'Hardwired' and 'Microprogrammed' — the whole unit is those two boxes."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.7 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now explain the control unit's job and build it two ways: hardwired (Boolean gates, fast, RISC) and
            microprogrammed (a control store the μPC walks, flexible, CISC).
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.C — Capstone: Build the Control Sequence.</strong>{" "}
            You have every piece. Time to assemble the full control sequence for one instruction yourself, end to end.
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
export default function Unit2_7({ student, onUnitComplete }) {
  const sections = [
    { id: "conductor", label: "The Conductor" },
    { id: "hardwired", label: "Hardwired" },
    { id: "micro", label: "Microprogrammed" },
    { id: "head", label: "Head to Head" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎼 The Conductor — control over the datapath</h3>
      <TheConductor />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔧 Hardwired — three parts, one Boolean equation</h3>
      <HardwiredAnatomy />
      <div style={{ height: 22 }} />
      <Hardwired />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>💾 Microprogrammed — address, sequencing &amp; the control store</h3>
      <AddressGenAndSequencing />
      <div style={{ height: 22 }} />
      <Microprogrammed />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⚖️ Head to Head — which wins?</h3>
      <HeadToHead />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.7.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎛️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.7</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Microprogrammed Control</div>
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
