// Unit1_5.jsx — Module 1 › Unit 1.5 — "Memory Operations & Instructions"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-1 classroom deck, Chapter 5 (Memory Operations & Instructions,
// Hamacher §2.2–2.4 / Mano §5).
// Arc: Read/Write OVERVIEW → the mechanism IN DEPTH (address/data/control buses
// + MAR/MDR, read then write, step by step) → two languages (RTN vs assembly) →
// three ways to classify instructions → RISC vs CISC → quiz.
// Reuses the canonical C = A + B program from Unit 1.2 (textbook load/store).
import React, { useState } from "react";

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
//  Section 1 — The Two Memory Operations: Read & Write
// ══════════════════════════════════════════════════════════════════
function ReadWrite() {
  const [op, setOp] = useState("read");
  const isRead = op === "read";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        No matter how fancy a program looks, memory only ever does <strong>two</strong> things:
        <strong style={{ color: C.green }}> Read</strong> (copy a word <em>out</em> of memory) and
        <strong style={{ color: C.orange }}> Write</strong> (copy a word <em>into</em> memory). Both go through
        MAR (address) and MDR (data), just as you saw in Unit 1.2.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["read", "Read (Load)"], ["write", "Write (Store)"]].map(([k, lbl]) => (
          <button key={k} onClick={() => setOp(k)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: `1px solid ${op === k ? (k === "read" ? C.green : C.orange) : C.border}`,
            background: op === k ? (k === "read" ? C.green : C.orange) + "22" : "transparent",
            color: op === k ? (k === "read" ? C.green : C.orange) : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      <svg viewBox="0 0 380 150" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
        {/* CPU register on the left, Memory on the right */}
        <rect x={20} y={50} width={90} height={50} rx={8} fill={C.card} stroke={C.purple} />
        <text x={65} y={72} fontSize={11} fill={C.text} textAnchor="middle">Register</text>
        <text x={65} y={88} fontSize={11} fill={C.teal} textAnchor="middle">R2</text>

        <rect x={270} y={40} width={95} height={70} rx={8} fill={C.card} stroke={C.accent} />
        <text x={317} y={34} fontSize={10} fill={C.accent} textAnchor="middle">Memory</text>
        <text x={317} y={72} fontSize={10} fill={C.muted} textAnchor="middle">location A</text>
        <text x={317} y={90} fontSize={13} fill={C.text} textAnchor="middle" fontFamily="monospace">5</text>

        {/* the transfer arrow */}
        <line x1={110} y1={75} x2={270} y2={75} stroke={isRead ? C.green : C.orange} strokeWidth={4} strokeLinecap="round" />
        <circle r={5} fill={isRead ? C.green : C.orange}>
          <animate attributeName="cx" values={isRead ? "270;110" : "110;270"} dur="1.1s" repeatCount="indefinite" />
          <animate attributeName="cy" values="75;75" dur="1.1s" repeatCount="indefinite" />
        </circle>
        <text x={190} y={65} fontSize={10} fill={isRead ? C.green : C.orange} textAnchor="middle">{isRead ? "◀ data in" : "data out ▶"}</text>
      </svg>

      <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 10, background: (isRead ? C.green : C.orange) + "12", border: `1px solid ${(isRead ? C.green : C.orange)}44` }}>
        <div style={{ color: isRead ? C.green : C.orange, fontWeight: 700, fontSize: 14 }}>{isRead ? "Read — copy FROM memory" : "Write — copy TO memory"}</div>
        <div style={{ fontFamily: "monospace", fontSize: 16, color: C.text, margin: "8px 0" }}>
          {isRead ? "R2 ← [A]" : "M[C] ← [R4]"}
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
          {isRead
            ? "The contents of location A are copied into R2. A keeps its value — a read is non-destructive."
            : "The contents of R4 are copied into location C, overwriting whatever was there."}
        </div>
      </div>

      <Key>
        Every data movement in this course is built from these two primitives. In our textbook machine only
        <strong style={{ color: C.text }}> Load</strong> (a Read) and <strong style={{ color: C.text }}>Store</strong>
        (a Write) touch memory — arithmetic happens only between registers. This is the overview; the next section opens the
        hood and shows <em>how</em> a word actually crosses to and from memory.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Inside a Memory Access (3 buses + MAR/MDR, step by step)
//  The DEPTH the overview only hinted at. Deck Ch 5 Read/Write, plus a
//  MAR/MDR view (the deck shows the buses but not the two registers driving
//  them, so this widget adds that).
// ══════════════════════════════════════════════════════════════════
function MemoryAccess() {
  const [op, setOp] = useState("read");   // "read" | "write"
  const [step, setStep] = useState(0);    // 0..4
  const isRead = op === "read";

  // Story: the CPU wants location 200. It currently holds 25. A Write stores 99.
  const readSteps = [
    { narr: "Idle. The CPU wants the word at address 200. Memory location 200 currently holds 25.",
      mar: "—", mdr: "—", loc: "25", addr: false, data: false, ctrl: false, ctrlWord: "" },
    { narr: "① MAR ← 200. The processor loads the address it wants into the Memory Address Register.",
      mar: "200", mdr: "—", loc: "25", addr: false, data: false, ctrl: false, ctrlWord: "" },
    { narr: "② MAR drives the ADDRESS BUS, and Read is asserted on the CONTROL BUS — together. Memory now knows where and what to do.",
      mar: "200", mdr: "—", loc: "25", addr: true, data: false, ctrl: true, ctrlWord: "Read" },
    { narr: "③ Memory reads location 200 and puts a COPY (25) on the DATA BUS. The location itself is unchanged.",
      mar: "200", mdr: "—", loc: "25", addr: true, data: true, ctrl: true, ctrlWord: "Read" },
    { narr: "④ MDR ← 25. The Memory Data Register latches the value off the data bus. Read done — and location 200 still holds 25 (non-destructive).",
      mar: "200", mdr: "25", loc: "25", addr: false, data: false, ctrl: false, ctrlWord: "" },
  ];
  const writeSteps = [
    { narr: "Idle. The CPU wants to store 99 into address 200, which currently holds 25.",
      mar: "—", mdr: "—", loc: "25", addr: false, data: false, ctrl: false, ctrlWord: "" },
    { narr: "① MAR ← 200. The destination address goes into the Memory Address Register.",
      mar: "200", mdr: "—", loc: "25", addr: false, data: false, ctrl: false, ctrlWord: "" },
    { narr: "② MDR ← 99. The data to be written is loaded into the Memory Data Register (from a CPU register).",
      mar: "200", mdr: "99", loc: "25", addr: false, data: false, ctrl: false, ctrlWord: "" },
    { narr: "③ Address (200), data (99) and Write ALL go out together — address bus, data bus and control bus are all outbound. Nothing needs to come back.",
      mar: "200", mdr: "99", loc: "25", addr: true, data: true, ctrl: true, ctrlWord: "Write" },
    { narr: "④ Memory stores it: location 200 becomes 99, OVERWRITING 25 — which is gone for good. That's the difference from a Read.",
      mar: "200", mdr: "99", loc: "99", addr: false, data: false, ctrl: false, ctrlWord: "" },
  ];
  const steps = isRead ? readSteps : writeSteps;
  const s = steps[step];

  // A bus line: coloured + a moving packet when active. Data bus reverses
  // direction on a Read (memory → CPU) vs a Write (CPU → memory).
  const Bus = ({ y, label, color, on, back, packet }) => (
    <g>
      <line x1={150} y1={y} x2={330} y2={y} stroke={on ? color : C.border} strokeWidth={on ? 5 : 3} strokeLinecap="round" />
      <text x={240} y={y - 7} fontSize={8.5} fill={on ? color : C.muted} textAnchor="middle" fontWeight="700">{label}</text>
      {on && packet && (
        <g>
          <rect x={-14} y={-8} width={28} height={16} rx={3} fill={color}>
            <animateMotion dur="1s" repeatCount="indefinite" path={back ? `M 330 ${y} L 150 ${y}` : `M 150 ${y} L 330 ${y}`} />
          </rect>
          <text fontSize={9} fill="#0D1117" fontWeight="800" textAnchor="middle">
            <animateMotion dur="1s" repeatCount="indefinite" path={back ? `M 330 ${y} L 150 ${y}` : `M 150 ${y} L 330 ${y}`} />
            {packet}
          </text>
        </g>
      )}
    </g>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Now the real mechanism. Every memory access rides <strong style={{ color: C.text }}>three buses</strong> —
        <strong style={{ color: C.teal }}> address</strong> (where), <strong style={{ color: C.green }}>data</strong> (what),
        <strong style={{ color: C.yellow }}> control</strong> (which operation) — and passes through two registers:
        <strong style={{ color: C.orange }}> MAR</strong> holds the address, <strong style={{ color: C.accent }}>MDR</strong>
        holds the data. Pick Read or Write and step through.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["read", "Read — fetch a word"], ["write", "Write — store a word"]].map(([k, lbl]) => (
          <button key={k} onClick={() => { setOp(k); setStep(0); }} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 700,
            border: `2px solid ${op === k ? (k === "read" ? C.green : C.orange) : C.border}`,
            background: op === k ? (k === "read" ? C.green : C.orange) + "22" : C.card,
            color: op === k ? (k === "read" ? C.green : C.orange) : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      <svg viewBox="0 0 480 210" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
        {/* processor with MAR + MDR */}
        <rect x={20} y={30} width={130} height={150} rx={10} fill={C.card} stroke={C.purple} strokeWidth={1.6} />
        <text x={85} y={48} fontSize={11} fill={C.purple} textAnchor="middle" fontWeight="700">PROCESSOR</text>
        <rect x={38} y={70} width={94} height={34} rx={6} fill={s.mar !== "—" ? C.orange + "22" : C.surface} stroke={s.mar !== "—" ? C.orange : C.border} strokeWidth={1.5} />
        <text x={52} y={83} fontSize={9} fill={C.muted}>MAR</text>
        <text x={100} y={92} fontSize={13} fill={s.mar !== "—" ? C.orange : C.muted} textAnchor="middle" fontFamily="monospace" fontWeight="700">{s.mar}</text>
        <rect x={38} y={120} width={94} height={34} rx={6} fill={s.mdr !== "—" ? C.accent + "22" : C.surface} stroke={s.mdr !== "—" ? C.accent : C.border} strokeWidth={1.5} />
        <text x={52} y={133} fontSize={9} fill={C.muted}>MDR</text>
        <text x={100} y={142} fontSize={13} fill={s.mdr !== "—" ? C.accent : C.muted} textAnchor="middle" fontFamily="monospace" fontWeight="700">{s.mdr}</text>

        {/* memory */}
        <rect x={370} y={30} width={95} height={150} rx={10} fill={C.surface} stroke={C.teal} strokeWidth={1.6} />
        <text x={417} y={48} fontSize={11} fill={C.teal} textAnchor="middle" fontWeight="700">MEMORY</text>
        <rect x={385} y={92} width={66} height={44} rx={6} fill={C.card} stroke={s.loc === "99" ? C.green : C.border} strokeWidth={s.loc === "99" ? 2 : 1} />
        <text x={418} y={107} fontSize={9} fill={C.muted} textAnchor="middle">[200]</text>
        <text x={418} y={126} fontSize={15} fill={s.loc === "99" ? C.green : C.text} textAnchor="middle" fontFamily="monospace" fontWeight="700">{s.loc}</text>

        {/* three buses */}
        <Bus y={70}  label="ADDRESS BUS →" color={C.teal}   on={s.addr} back={false}   packet={s.addr ? s.mar : ""} />
        <Bus y={110} label={`DATA BUS ${isRead ? "↔" : "→"}`} color={C.green} on={s.data} back={isRead} packet={s.data ? (isRead ? s.loc : s.mdr) : ""} />
        <Bus y={150} label="CONTROL BUS →" color={C.yellow} on={s.ctrl} back={false} packet={s.ctrlWord} />
      </svg>

      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, lineHeight: 1.6, minHeight: 52 }}>
        {s.narr}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button onClick={() => setStep(v => Math.min(4, v + 1))} disabled={step === 4} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: step === 4 ? C.card : C.accentGlow, color: step === 4 ? C.muted : "#fff",
          cursor: step === 4 ? "default" : "pointer",
        }}>Next step ▶ ({step} / 4)</button>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={isRead ? C.green : C.orange}>
        <strong style={{ color: C.orange }}>MAR</strong> always drives the address bus; <strong style={{ color: C.accent }}>MDR</strong>
        always holds the data. <strong style={{ color: C.green }}>Read:</strong> address + Read go out, a <em>copy</em> comes back on the
        data bus into MDR — source unchanged. <strong style={{ color: C.orange }}>Write:</strong> address + data + Write all go out
        together, and the old value is <em>overwritten</em> for good.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Two Languages for One Action (RTN vs Assembly)
// ══════════════════════════════════════════════════════════════════
function TwoLanguages() {
  // The canonical C = A + B program (A=5, B=3 → C=8), from Unit 1.2.
  const prog = [
    { addr: 100, asm: "Load  R2, A", rtn: "R2 ← [A]", note: "copy A (5) into R2" },
    { addr: 104, asm: "Load  R3, B", rtn: "R3 ← [B]", note: "copy B (3) into R3" },
    { addr: 108, asm: "Add   R4, R2, R3", rtn: "R4 ← [R2] + [R3]", note: "register-to-register add → 8" },
    { addr: 112, asm: "Store R4, C", rtn: "M[C] ← [R4]", note: "write 8 back to C" },
  ];
  const [sel, setSel] = useState(2);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The same instruction can be written two ways: <strong style={{ color: C.teal }}>RTN</strong> to <em>describe</em>
        precisely what moves where, and <strong style={{ color: C.accent }}>Assembly</strong> to actually <em>program</em>
        it with mnemonics. Click a line to line them up.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr", gap: 6, alignItems: "stretch" }}>
        <div style={{ color: C.muted, fontSize: 10, textAlign: "center", alignSelf: "end" }}>ADDR</div>
        <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, textAlign: "center" }}>Assembly — to program</div>
        <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, textAlign: "center" }}>RTN — to describe</div>

        {prog.map((p, i) => {
          const on = sel === i;
          return (
            <React.Fragment key={i}>
              <button onClick={() => setSel(i)} style={{ ...cell(on), color: C.muted, fontFamily: "monospace", fontSize: 12 }}>{p.addr}</button>
              <button onClick={() => setSel(i)} style={{ ...cell(on, C.accent), fontFamily: "monospace", fontSize: 13, color: C.text, textAlign: "left" }}>{p.asm}</button>
              <button onClick={() => setSel(i)} style={{ ...cell(on, C.teal), fontFamily: "monospace", fontSize: 13, color: C.text, textAlign: "left" }}>{p.rtn}</button>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
        <strong style={{ color: C.text }}>Line {prog[sel].addr}:</strong> <code style={{ color: C.accent }}>{prog[sel].asm}</code>
        {"  "}means{"  "}<code style={{ color: C.teal }}>{prog[sel].rtn}</code> — {prog[sel].note}.
      </div>

      <Key color={C.teal}>
        RTN is math-like and unambiguous (great for reasoning); assembly is what you hand the assembler. Same action,
        two notations — and only Load/Store mention memory, exactly as the load/store rule promises.
      </Key>
    </div>
  );
}
function cell(on, accent = C.border) {
  return {
    padding: "9px 10px", borderRadius: 7, cursor: "pointer",
    border: `1px solid ${on ? accent : C.border}`,
    background: on ? accent + "18" : C.card,
    transition: "all 0.15s",
  };
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Classify Instructions (three lenses)
// ══════════════════════════════════════════════════════════════════
function Classify() {
  const [lens, setLens] = useState("func");

  const funcGroups = [
    { g: "Data transfer", color: C.teal, ex: "Load, Store, Move", body: "Copy data between memory and registers without changing it." },
    { g: "Arithmetic / Logic", color: C.orange, ex: "Add, Sub, And, Or", body: "The ALU work — the actual computing." },
    { g: "Control flow", color: C.purple, ex: "Branch, Jump, Call", body: "Change which instruction runs next (Unit 1.6)." },
    { g: "I/O", color: C.green, ex: "In, Out", body: "Move data to/from the outside world." },
  ];

  const operandForms = [
    { n: "3-address", code: ["Add C, A, B"], body: "Name all three: two sources + destination. C ← A + B in one line." },
    { n: "2-address", code: ["Move C, A", "Add  C, B"], body: "Destination doubles as a source: C ← C + B." },
    { n: "1-address", code: ["Load A", "Add  B", "Store C"], body: "A single accumulator is the implied operand." },
    { n: "0-address", code: ["Push A", "Push B", "Add", "Pop  C"], body: "A stack machine — operands are implied on top of the stack." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        There are thousands of instructions — we tame them by classifying. Three useful lenses:
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {[["func", "By functionality"], ["operands", "By # of operands"], ["format", "By format"]].map(([k, lbl]) => (
          <button key={k} onClick={() => setLens(k)} style={{
            flex: 1, minWidth: 110, padding: "8px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
            border: `1px solid ${lens === k ? C.accent : C.border}`,
            background: lens === k ? C.accentGlow : "transparent", color: lens === k ? "#fff" : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      {lens === "func" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {funcGroups.map((f) => (
            <div key={f.g} style={{ padding: "11px 13px", borderRadius: 9, background: f.color + "12", border: `1px solid ${f.color}44` }}>
              <div style={{ color: f.color, fontWeight: 700, fontSize: 13 }}>{f.g}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.text, margin: "3px 0" }}>{f.ex}</div>
              <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.5 }}>{f.body}</div>
            </div>
          ))}
        </div>
      )}

      {lens === "operands" && (
        <div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>Same job — compute <code style={{ color: C.teal }}>C = A + B</code> — expressed with fewer and fewer explicit operands:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {operandForms.map((o) => (
              <div key={o.n} style={{ padding: "11px 13px", borderRadius: 9, background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{o.n}</div>
                <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>{o.code.join("\n")}</pre>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 5, lineHeight: 1.5 }}>{o.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lens === "format" && (
        <div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10, lineHeight: 1.6 }}>
            By <strong style={{ color: C.text }}>where the operand lives</strong> — the three basic instruction formats. The same
            idea gets different mnemonics on each machine, so each row shows <em>generic</em> examples and the
            <em> Morris&nbsp;Mano</em> textbook set.
          </div>
          {[
            { n: "Memory-reference", color: C.green, where: "operand is at a MEMORY ADDRESS",
              fields: ["opcode", "memory address"],
              generic: ["Load R2, A", "Store R4, C", "Add R1, LOC"],
              mano: ["LDA 200", "STA 200", "ADD 200", "BUN 200"] },
            { n: "Register-reference", color: C.teal, where: "operand is INSIDE the CPU — no memory address",
              fields: ["opcode", "register(s)"],
              generic: ["Add R4, R2, R3", "Increment R1", "Clear R2", "Halt"],
              mano: ["CLA", "CMA", "INC", "CIR", "HLT"] },
            { n: "Input–Output", color: C.yellow, where: "operand is an I/O DEVICE — no memory address",
              fields: ["opcode", "device"],
              generic: ["In R1, KBD", "Out R1, DISP"],
              mano: ["INP", "OUT", "SKI", "SKO", "ION"] },
          ].map((f) => (
            <div key={f.n} style={{ marginBottom: 10, padding: "10px 12px", borderRadius: 9, background: f.color + "10", border: `1px solid ${f.color}44` }}>
              <div style={{ color: f.color, fontWeight: 700, fontSize: 13 }}>{f.n}</div>
              <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>{f.where}</div>
              <div style={{ display: "flex", gap: 3, marginBottom: 7 }}>
                {f.fields.map((fl, i) => (
                  <div key={i} style={{ flex: i === 0 ? 0.7 : 1, padding: "5px 4px", textAlign: "center", borderRadius: 5, background: f.color + "22", border: `1px solid ${f.color}66`, fontSize: 10, color: C.text, fontFamily: "monospace" }}>{fl}</div>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 5 }}>
                <span style={{ color: C.muted, fontSize: 10, alignSelf: "center" }}>generic:</span>
                {f.generic.map((ex) => (
                  <code key={ex} style={{ fontSize: 10.5, color: C.text, background: C.card, borderRadius: 4, padding: "2px 6px", fontFamily: "monospace" }}>{ex}</code>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                <span style={{ color: C.muted, fontSize: 10, alignSelf: "center" }}>Mano:</span>
                {f.mano.map((ex) => (
                  <code key={ex} style={{ fontSize: 10.5, color: f.color, background: C.card, borderRadius: 4, padding: "2px 6px", fontFamily: "monospace" }}>{ex}</code>
                ))}
              </div>
            </div>
          ))}
          <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.6, marginTop: 2 }}>
            Why two name-sets? Assembly is <strong style={{ color: C.text }}>machine-specific</strong> — the same idea is
            <code style={{ color: C.text }}> Load</code> here, <code style={{ color: C.text }}>LDA</code> in Mano,
            <code style={{ color: C.text }}> MOV</code> on x86, <code style={{ color: C.text }}>LDR</code> on ARM.
          </div>
        </div>
      )}

      <Key>
        By <strong style={{ color: C.text }}>functionality</strong> = what it does; by <strong style={{ color: C.text }}>number
        of operands</strong> = how many it names (3 → 0); by <strong style={{ color: C.text }}>format</strong> = where the
        operand lives (memory / register / I-O). Three lenses on the same instruction set.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — RISC vs CISC
// ══════════════════════════════════════════════════════════════════
function RiscCisc() {
  const [side, setSide] = useState("risc");
  const isRisc = side === "risc";

  const risc = ["Load  R2, A", "Load  R3, B", "Add   R4, R2, R3", "Store R4, C"];
  const cisc = ["Add C, A, B"];

  // CISC instructions vary in LENGTH (bytes) — the defining trait. Illustrative
  // x86-style byte counts, to make "variable-length" concrete.
  const ciscLengths = [
    { asm: "INC R1", bytes: 1, note: "no operands — 1 byte" },
    { asm: "MOV R1, R2", bytes: 2, note: "register to register" },
    { asm: "ADD R1, 5", bytes: 3, note: "register + small constant" },
    { asm: "MOV R1, [2000]", bytes: 5, note: "carries a full memory address" },
    { asm: "ADD [3000], [4000]", bytes: 7, note: "memory-to-memory — two addresses" },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        This is the first time we meet these two philosophies. They answer one question: how much should a <em>single</em>
        instruction do?
      </p>

      {/* the two expansions, spelled out — first introduction */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 190, padding: "10px 12px", borderRadius: 9, background: C.green + "12", border: `1px solid ${C.green}44` }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 15 }}>RISC</div>
          <div style={{ color: C.text, fontSize: 12.5, fontWeight: 600 }}>Reduced Instruction Set Computer</div>
          <div style={{ color: C.muted, fontSize: 11.5, marginTop: 3, lineHeight: 1.5 }}>A small, simple set; each instruction runs in about one clock cycle.</div>
        </div>
        <div style={{ flex: 1, minWidth: 190, padding: "10px 12px", borderRadius: 9, background: C.orange + "12", border: `1px solid ${C.orange}44` }}>
          <div style={{ color: C.orange, fontWeight: 800, fontSize: 15 }}>CISC</div>
          <div style={{ color: C.text, fontSize: 12.5, fontWeight: 600 }}>Complex Instruction Set Computer</div>
          <div style={{ color: C.muted, fontSize: 11.5, marginTop: 3, lineHeight: 1.5 }}>A large, rich set; single instructions do complex, multi-cycle work and may touch memory directly.</div>
        </div>
      </div>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 10, lineHeight: 1.7 }}>
        Watch the same <code style={{ color: C.teal, fontFamily: "monospace" }}>C = A + B</code> under each:
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["risc", "RISC"], ["cisc", "CISC"]].map(([k, lbl]) => (
          <button key={k} onClick={() => setSide(k)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: `1px solid ${side === k ? (k === "risc" ? C.green : C.orange) : C.border}`,
            background: side === k ? (k === "risc" ? C.green : C.orange) + "22" : "transparent",
            color: side === k ? (k === "risc" ? C.green : C.orange) : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ color: isRisc ? C.green : C.orange, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
          {isRisc ? "4 simple, one-word instructions · load/store · register-to-register" : "1 multi-word instruction · operates directly on memory operands"}
        </div>
        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 14, color: C.text, lineHeight: 1.7 }}>{(isRisc ? risc : cisc).join("\n")}</pre>
      </div>

      {/* CISC variable-length illustration */}
      <div style={{ padding: "12px 14px", borderRadius: 10, background: C.orange + "10", border: `1px solid ${C.orange}44`, marginBottom: 4 }}>
        <div style={{ color: C.orange, fontWeight: 700, fontSize: 13, marginBottom: 3 }}>CISC instructions are variable-length</div>
        <div style={{ color: C.muted, fontSize: 11.5, marginBottom: 10, lineHeight: 1.5 }}>
          The defining CISC trait: instructions are <strong style={{ color: C.text }}>not all the same size</strong>. A simple one
          is 1 byte; one carrying a memory address is several. (RISC keeps every instruction one fixed word.)
        </div>
        {ciscLengths.map((c) => (
          <div key={c.asm} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <code style={{ width: 140, fontSize: 11, color: C.text, fontFamily: "monospace" }}>{c.asm}</code>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: c.bytes }).map((_, i) => (
                <div key={i} style={{ width: 13, height: 13, borderRadius: 2, background: C.orange + "55", border: `1px solid ${C.orange}` }} />
              ))}
            </div>
            <span style={{ color: C.orange, fontSize: 10.5, fontFamily: "monospace", width: 46 }}>{c.bytes} byte{c.bytes > 1 ? "s" : ""}</span>
            <span style={{ color: C.muted, fontSize: 10 }}>{c.note}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <div style={{ flex: 1, minWidth: 150, padding: "11px 13px", borderRadius: 8, background: C.green + "10", border: `1px solid ${C.green}33` }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>RISC · used in</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Fixed-length, load/store, pipeline-friendly. Mobile, IoT, automotive — <strong style={{ color: C.text }}>ARM, RISC-V</strong>.</div>
        </div>
        <div style={{ flex: 1, minWidth: 150, padding: "11px 13px", borderRadius: 8, background: C.orange + "10", border: `1px solid ${C.orange}33` }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>CISC · used in</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Variable-length, memory operands, more work per instruction. Desktops, servers — <strong style={{ color: C.text }}>x86 (Intel/AMD)</strong>.</div>
        </div>
      </div>

      <Key color={C.green}>
        <strong style={{ color: C.text }}>RISC</strong> = Reduced Instruction Set Computer;
        <strong style={{ color: C.text }}> CISC</strong> = Complex Instruction Set Computer. Our textbook machine is
        RISC-style load/store — fixed-length, arithmetic only between registers — which is why C = A + B is always four lines.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "During a memory READ, what happens on the three buses?",
      options: [
        "Address, data and Read all go out together; nothing returns",
        "The address goes out with the Read signal; then a COPY of the data comes back on the data bus",
        "Only the data bus is used, in both directions",
        "The data goes out first, then the address comes back",
      ],
      answer: 1,
      explain: "Read = address (on the address bus) + Read (on the control bus) go out together; only THEN does memory answer with a copy on the data bus. The source location is unchanged — a read is non-destructive.",
    },
    {
      q: "What is the difference between MAR and MDR?",
      options: [
        "MAR holds the data, MDR holds the address",
        "MAR holds the address (drives the address bus); MDR holds the data (on the data bus)",
        "They are two names for the same register",
        "MAR is in memory, MDR is in the ALU",
      ],
      answer: 1,
      explain: "MAR (Memory Address Register) drives the address bus — WHERE. MDR (Memory Data Register) holds the word on the data bus — WHAT. Every access passes through this pair.",
    },
    {
      q: "By the 'where the operand lives' format, which instruction is register-reference (no memory address)?",
      options: [
        "Load R2, A",
        "Store R4, C",
        "Add R4, R2, R3",
        "LDA 200",
      ],
      answer: 2,
      explain: "Add R4, R2, R3 works entirely inside the CPU — no memory address. Load/Store and LDA 200 are memory-reference. Register-reference examples: Add R4,R2,R3, Increment R1, Halt (Mano: CLA, CMA, INC).",
    },
    {
      q: "What do RISC and CISC stand for, and how do their instruction lengths differ?",
      options: [
        "Reduced/Complex Instruction Set Computer — RISC uses fixed-length instructions, CISC variable-length",
        "Rapid/Careful Integer Set Computer — both fixed-length",
        "Reduced/Complex Instruction Set Computer — both variable-length",
        "Register/Cache Instruction Set Computer — RISC variable-length",
      ],
      answer: 0,
      explain: "RISC = Reduced Instruction Set Computer (few, simple, fixed-length, load/store). CISC = Complex Instruction Set Computer (rich, variable-length, may compute on memory operands directly).",
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
          {score === 4 ? "Perfect! You can read an instruction in both languages and place it in every classification." :
            score >= 2 ? "Good work! Replay 'Two Languages' — match each assembly line to its RTN." :
              "Revisit the Read/Write widget and 'Two Languages', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 1.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now write an instruction, describe it in RTN, classify it, and tell RISC from CISC.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 1.6 — Addressing Modes.</strong>{" "}
            Every instruction must say WHERE its operand is — a constant, a register, an address, or a pointer. How many ways can one instruction reach its data?
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
          const isAns = i === q.answer;
          const isPick = i === selected;
          let bg = "transparent", bd = C.border, col = C.text;
          if (selected !== null) {
            if (isAns) { bg = C.green + "22"; bd = C.green; col = C.green; }
            else if (isPick) { bg = C.red + "22"; bd = C.red; col = C.red; }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={selected !== null} style={{
              textAlign: "left", padding: "11px 14px", borderRadius: 8,
              background: bg, border: `1px solid ${bd}`, color: col,
              cursor: selected === null ? "pointer" : "default", fontSize: 13.5, lineHeight: 1.5,
            }}>{opt}{selected !== null && isAns ? "  ✓" : ""}</button>
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
//  Main
// ══════════════════════════════════════════════════════════════════
export default function Unit1_5({ student, onUnitComplete }) {
  const sections = [
    { id: "rw", label: "Read & Write" },
    { id: "access", label: "Inside a Memory Access" },
    { id: "lang", label: "Two Languages" },
    { id: "classify", label: "Classify" },
    { id: "risccisc", label: "RISC vs CISC" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📥 Read &amp; Write — the only two memory operations</h3>
      <ReadWrite />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔬 Inside a Memory Access — the three buses &amp; MAR/MDR</h3>
      <MemoryAccess />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗣️ Two Languages for One Action — RTN &amp; Assembly</h3>
      <TwoLanguages />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗂️ Classify Instructions — three useful lenses</h3>
      <Classify />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⚖️ RISC vs CISC — how much per instruction?</h3>
      <RiscCisc />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 1.5.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📝</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.5</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Memory Operations &amp; Instructions</div>
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
