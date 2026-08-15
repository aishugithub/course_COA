// Unit2_2.jsx — Module 2 › Unit 2.2 — "Arithmetic & Logic Operations"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 2 (Arithmetic, Logic & Shift Microops).
// Arc: six ops, one adder (× = repeated add) → subtract via 2's complement
// (one adder, two jobs) → one adder + MUX = many ops (playground) → logic
// microops & masking (AND clears / OR sets) → shifts (×2 / ÷2) → quiz.
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
//  Section 1 — Six operations, one adder (× = repeated addition)
// ══════════════════════════════════════════════════════════════════
function OneAdder() {
  const [count, setCount] = useState(0); // how many times we've added 3
  const target = 4;                       // 3 × 4
  const total = count * 3;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        An ALU seems to need a circuit for each of <strong style={{ color: C.text }}>+ − × ÷ +1 −1</strong>. Six operations,
        six circuits? Start with <strong style={{ color: C.accent }}>×</strong>. Multiplying is nothing but
        <strong style={{ color: C.text }}> repeated addition</strong>: 3 × 4 means add 3, four times. Press the button and
        watch <em>one</em> adder do it.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 12, textAlign: "center" }}>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>the SAME adder, its output fed back in as a running total</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ padding: "10px 16px", borderRadius: 10, background: C.accent + "1E", border: `2px solid ${C.accent}` }}>
            <div style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>ONE ADDER</div>
            <div style={{ color: C.muted, fontSize: 11 }}>+3 each press</div>
          </div>
          <div style={{ fontSize: 22, color: C.muted }}>→</div>
          <div style={{ padding: "10px 22px", borderRadius: 10, background: total === 12 ? C.green + "22" : C.card, border: `2px solid ${total === 12 ? C.green : C.teal}` }}>
            <div style={{ color: C.muted, fontSize: 11 }}>running total</div>
            <div style={{ color: total === 12 ? C.green : C.teal, fontSize: 28, fontWeight: 800, fontFamily: "monospace" }}>{total}</div>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 10, fontFamily: "monospace" }}>
          {count === 0 ? "0" : Array.from({ length: count }).map(() => "3").join(" + ")} {count > 0 ? `= ${total}` : ""}
          {"  "}({count} of {target} adds)
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={() => setCount(c => Math.min(target, c + 1))} disabled={count === target} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: count === target ? C.card : C.accentGlow, color: count === target ? C.muted : "#fff",
          cursor: count === target ? "default" : "pointer",
        }}>➕ Add 3 again ({count}/{target})</button>
        <button onClick={() => setCount(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      {count === target && (
        <div style={{ background: C.green + "14", border: `1px solid ${C.green}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.green, lineHeight: 1.6, marginBottom: 4 }}>
          ✓ 3 added four times = <strong>3 × 4 = 12</strong>. So <strong>×</strong> needs no new box — just the adder, used
          repeatedly. And ÷ is repeated subtraction… but can the same adder go the <em>other</em> way?
        </div>
      )}

      <div style={{ background: C.yellow + "12", border: `1px solid ${C.yellow}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginTop: 10 }}>
        ⚠️ <strong style={{ color: C.yellow }}>Reality check:</strong> a real ALU does <em>not</em> multiply by naive repeated
        addition — that would take up to 15 adds for 4-bit numbers. Actual hardware uses <strong style={{ color: C.text }}>shift-and-add</strong>
        with <strong style={{ color: C.text }}>shifters</strong> (at most one add per bit). You'll meet those shifters later in this unit.
      </div>

      <Key color={C.accent}>
        <strong style={{ color: C.accent }}>×</strong> is repeated addition, <strong style={{ color: C.accent }}>÷</strong> is
        repeated subtraction — so <em>in principle</em> neither needs its own circuit. The whole ALU can be built around
        <strong style={{ color: C.text }}> one adder</strong> (plus shifters for a fast multiply), if only it can also subtract.
        That's next.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Subtract by the method of complements (PLAIN MATH)
//  No MUX, no XOR, no hardware — just work the arithmetic so students see
//  A − B is really A + (2's complement of B). Deck Ch2 "subtract without a
//  subtractor". Circuit comes in the NEXT section.
// ══════════════════════════════════════════════════════════════════
function AdderSubtractor() {
  const [step, setStep] = useState(0); // 0..4 reveal of the worked example

  // 5 − 3, worked in binary. A = 0101 (5), B = 0011 (3).
  const lines = [
    { txt: "We want 5 − 3. But our only tool is an adder — it can only ADD. Turn the subtraction into an addition.", show: null },
    { txt: "① Write B = 3 in binary: 0011. Flip every bit (one's complement): 0011 → 1100.", show: "flip" },
    { txt: "② Add 1 to get the two's complement: 1100 + 1 = 1101. This 1101 represents −3.", show: "twos" },
    { txt: "③ Now just ADD: A + (−3) = 0101 + 1101 = 1 0010 (a 5-bit result with a carry-out).", show: "add" },
    { txt: "④ Throw away the carried-out 1 → 0010 = 2. Same answer as 5 − 3, using only addition. ✓", show: "drop" },
  ];
  const s = lines[step];

  const Bits = ({ v, color, strike }) => (
    <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, letterSpacing: 3, color, textDecoration: strike ? "line-through" : "none" }}>{v}</span>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Repeating only ever <em>adds</em>. To subtract we seem to need new hardware — unless we turn a subtraction into an
        addition. The trick, in <strong style={{ color: C.text }}>plain arithmetic</strong>:
        <strong style={{ color: C.text }}> A − B = A + (2's complement of B)</strong>, and the 2's complement is just
        <strong style={{ color: C.orange }}> flip every bit, then add 1</strong>. Let's work out <strong style={{ color: C.text }}>5 − 3</strong>.
      </p>

      {/* the worked calculation */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: C.muted, fontSize: 12, width: 130 }}>A = 5</span>
            <Bits v="0101" color={C.teal} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: step >= 1 ? 1 : 0.25, transition: "opacity 0.3s" }}>
            <span style={{ color: C.muted, fontSize: 12, width: 130 }}>B = 3</span>
            <Bits v="0011" color={C.text} />
            {step >= 1 && <span style={{ color: C.muted, fontSize: 12 }}>→ flip →</span>}
            {step >= 1 && <Bits v="1100" color={C.orange} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: step >= 2 ? 1 : 0.25, transition: "opacity 0.3s" }}>
            <span style={{ color: C.muted, fontSize: 12, width: 130 }}>+1 → 2's comp of 3</span>
            <Bits v="1101" color={C.purple} />
            {step >= 2 && <span style={{ color: C.muted, fontSize: 12 }}>= −3</span>}
          </div>
          <div style={{ height: 1, background: C.border, margin: "2px 0" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: step >= 3 ? 1 : 0.25, transition: "opacity 0.3s" }}>
            <span style={{ color: C.muted, fontSize: 12, width: 130 }}>A + (−3)</span>
            <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 800, letterSpacing: 3, color: C.text }}>
              0101 + 1101 ={" "}
              {step >= 3 && <span style={{ color: step >= 4 ? C.muted : C.text }}>{step >= 4 ? <span style={{ color: C.red }}>1</span> : "1"}</span>}
              {step >= 3 && <span style={{ color: C.green }}>0010</span>}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: step >= 4 ? 1 : 0.25, transition: "opacity 0.3s" }}>
            <span style={{ color: C.muted, fontSize: 12, width: 130 }}>drop carry-out</span>
            <span style={{ color: C.red, fontFamily: "monospace", fontSize: 13 }}>✕1</span>
            <Bits v="0010" color={C.green} />
            {step >= 4 && <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>= 2 ✓</span>}
          </div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 44, lineHeight: 1.6, marginBottom: 10 }}>
        {s.txt}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStep(v => Math.min(4, v + 1))} disabled={step === 4} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: step === 4 ? C.card : C.accentGlow, color: step === 4 ? C.muted : "#fff",
          cursor: step === 4 ? "default" : "pointer",
        }}>Work the next step ▶ ({step} / 4)</button>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.orange}>
        Subtraction is <strong style={{ color: C.text }}>addition in disguise</strong>: A − B = A + (2's complement of B) =
        A + B̄ + 1. Flip B's bits, add 1, then add to A and drop the final carry. No subtractor needed — just an adder.
        <strong style={{ color: C.text }}> Next: the actual circuit</strong> that flips B and sets that "+1".
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — One adder + one 4-input MUX = many operations (ANIMATED)
//  Click an op → the chosen MUX input, the route through the MUX, Y, the
//  adder, Cin and the result all light green. A = 5, B = 3, in bin + dec.
//  Mirrors the classroom-deck "one circuit, many operations" datapath.
// ══════════════════════════════════════════════════════════════════
function ArithmeticUnit() {
  const [op, setOp] = useState(null); // "add" | "sub" | "inc" | "dec"

  // Each op selects ONE of the four MUX inputs (idx 0..3) and a carry-in.
  //   idx0 = B (0011) · idx1 = B̄ (1100) · idx2 = 0000 · idx3 = 1111
  const OPS = {
    add: { label: "ADD  A+B", idx: 0, s: "00", y: "0011", cin: "0", res: "1000", dec: 8, color: C.green,
      rtn: "S1S0 = 00 passes Y = B = 0011, Cin = 0. Adder: 0101 + 0011 = 1000 = 8." },
    sub: { label: "SUB  A−B", idx: 1, s: "01", y: "1100", cin: "1", res: "0010", dec: 2, color: C.orange,
      rtn: "S1S0 = 01 passes Y = B̄ = 1100 (B flipped), Cin = 1 is the +1 that completes the 2's complement. 0101 + 1100 + 1 = 0010 = 2." },
    inc: { label: "INC  A+1", idx: 2, s: "10", y: "0000", cin: "1", res: "0110", dec: 6, color: C.teal,
      rtn: "S1S0 = 10 passes Y = 0000, Cin = 1. Adder: 0101 + 0000 + 1 = 0110 = 6 = A + 1." },
    dec: { label: "DEC  A−1", idx: 3, s: "11", y: "1111", cin: "0", res: "0100", dec: 4, color: C.purple,
      rtn: "S1S0 = 11 passes Y = 1111 (= −1), Cin = 0. Adder: 0101 + 1111 = 0100 = 4 = A − 1." },
  };
  const o = op ? OPS[op] : null;
  const lit = C.green;            // colour of the enabled (glowing) data path
  const litW = 3.2, dimW = 1.6;

  const inputs = [
    { name: "B", val: "0011", sub: "(= 3)" },
    { name: "B̄", val: "1100", sub: "(B flipped)" },
    { name: "0", val: "0000", sub: "(for +1)" },
    { name: "1", val: "1111", sub: "(= −1)" },
  ];
  const iy = [46, 92, 138, 184];  // y of each input row
  const on = (cond) => (cond ? lit : C.border);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Now the circuit. Put a <strong style={{ color: C.accent }}>4-input MUX</strong> on the adder's second input:
        it can feed <strong style={{ color: C.text }}>B</strong>, <strong style={{ color: C.text }}>B̄</strong>,
        <strong style={{ color: C.text }}> 0000</strong> or <strong style={{ color: C.text }}>1111</strong>. Pair that with the
        carry-in and the same adder does four operations. Press one — the whole active path lights up. (A = 5, B = 3.)
      </p>

      {/* control buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {Object.entries(OPS).map(([k, v]) => (
          <button key={k} onClick={() => setOp(k)} style={{
            padding: "10px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "monospace",
            background: op === k ? v.color + "22" : C.card,
            border: `2px solid ${op === k ? v.color : C.border}`, color: op === k ? v.color : C.muted,
          }}>{v.label}</button>
        ))}
      </div>

      {/* the datapath */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 250" style={{ width: "100%", display: "block" }}>
          {/* four MUX inputs */}
          {inputs.map((inp, i) => {
            const sel = o && o.idx === i;
            return (
              <g key={i}>
                <rect x={12} y={iy[i] - 16} width={92} height={32} rx={6} fill={sel ? lit + "22" : C.card} stroke={on(sel)} strokeWidth={sel ? 2.2 : 1.4} style={{ transition: "all 0.25s" }} />
                <text x={58} y={iy[i] - 2} textAnchor="middle" fill={sel ? lit : C.muted} fontSize={11} fontWeight="700" fontFamily="monospace">{inp.name} = {inp.val}</text>
                <text x={58} y={iy[i] + 11} textAnchor="middle" fill={C.muted} fontSize={8}>{inp.sub}</text>
                {/* wire input → MUX */}
                <line x1={104} y1={iy[i]} x2={182} y2={115} stroke={on(sel)} strokeWidth={sel ? litW : dimW} opacity={sel ? 1 : 0.5} style={{ transition: "all 0.25s" }} />
                {sel && (
                  <circle r={3} fill={lit}>
                    <animate attributeName="cx" values="106;180" dur="0.9s" repeatCount="indefinite" />
                    <animate attributeName="cy" values={`${iy[i]};115`} dur="0.9s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* MUX (4 → 1) */}
          <polygon points="182,60 214,95 214,135 182,170" fill={o ? lit + "18" : C.card} stroke={o ? lit : C.accent} strokeWidth={1.8} style={{ transition: "all 0.25s" }} />
          <text x={198} y={118} textAnchor="middle" fill={o ? lit : C.accent} fontSize={10} fontWeight="700">MUX</text>
          {/* select line */}
          <line x1={198} y1={210} x2={198} y2={170} stroke={o ? C.accent : C.muted} strokeWidth={2} markerEnd="url(#u22sel)" />
          <text x={198} y={224} textAnchor="middle" fill={C.accent} fontSize={9} fontWeight="700">S1S0 = {o ? o.s : "--"}</text>

          {/* Y wire MUX → adder */}
          <line x1={214} y1={115} x2={300} y2={128} stroke={o ? lit : C.border} strokeWidth={o ? litW : dimW} style={{ transition: "all 0.25s" }} />
          <text x={255} y={108} textAnchor="middle" fill={o ? lit : C.muted} fontSize={9} fontWeight="700">Y = {o ? o.y : "----"}</text>

          {/* A into adder top */}
          <rect x={300} y={30} width={92} height={30} rx={6} fill={C.teal + "1E"} stroke={C.teal} strokeWidth={1.6} />
          <text x={346} y={49} textAnchor="middle" fill={C.teal} fontSize={11} fontWeight="700" fontFamily="monospace">A = 0101</text>
          <line x1={346} y1={60} x2={346} y2={95} stroke={o ? lit : C.border} strokeWidth={o ? litW : dimW} style={{ transition: "all 0.25s" }} />

          {/* adder */}
          <rect x={300} y={95} width={92} height={70} rx={9} fill={o ? lit + "14" : C.card} stroke={o ? lit : C.accent} strokeWidth={1.8} style={{ transition: "all 0.25s" }} />
          <text x={346} y={126} textAnchor="middle" fill={o ? lit : C.accent} fontSize={12} fontWeight="700">n-bit</text>
          <text x={346} y={143} textAnchor="middle" fill={o ? lit : C.accent} fontSize={12} fontWeight="700">ADDER</text>

          {/* Cin into adder bottom */}
          <line x1={346} y1={210} x2={346} y2={165} stroke={o ? C.yellow : C.muted} strokeWidth={2} markerEnd="url(#u22cin)" />
          <text x={346} y={224} textAnchor="middle" fill={C.yellow} fontSize={9} fontWeight="700">Cin = {o ? o.cin : "-"}</text>

          {/* adder → result */}
          <line x1={392} y1={130} x2={432} y2={130} stroke={o ? lit : C.border} strokeWidth={o ? litW : dimW} style={{ transition: "all 0.25s" }} />
          <rect x={432} y={104} width={78} height={52} rx={8} fill={o ? lit + "22" : C.surface} stroke={o ? lit : C.border} strokeWidth={1.8} style={{ transition: "all 0.25s" }} />
          <text x={471} y={124} textAnchor="middle" fill={C.muted} fontSize={8}>result</text>
          <text x={471} y={142} textAnchor="middle" fill={o ? lit : C.muted} fontSize={14} fontWeight="800" fontFamily="monospace">{o ? o.res : "----"}</text>
          <text x={471} y={172} textAnchor="middle" fill={C.muted} fontSize={9}>carry-out dropped</text>

          <defs>
            <marker id="u22sel" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.accent} /></marker>
            <marker id="u22cin" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.yellow} /></marker>
          </defs>
        </svg>
      </div>

      {/* readout in binary AND decimal */}
      {o && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", justifyContent: "center", fontFamily: "monospace", fontSize: 13 }}>
          <span style={{ color: C.teal }}>A = 0101 (5)</span>
          <span style={{ color: C.muted }}>{op === "sub" || op === "dec" ? "+" : "+"}</span>
          <span style={{ color: o.color }}>Y = {o.y}</span>
          <span style={{ color: C.muted }}>+ Cin {o.cin}</span>
          <span style={{ color: C.muted }}>=</span>
          <span style={{ color: lit, fontWeight: 800 }}>{o.res} ({o.dec})</span>
        </div>
      )}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, minHeight: 40, lineHeight: 1.6, fontFamily: "monospace" }}>
        {o ? o.rtn : "Press ADD, SUB, INC or DEC — the selected MUX input, the MUX, Y, the adder and the result all light up green."}
      </div>

      <Key color={C.accent}>
        One adder + one <strong style={{ color: C.text }}>4-input MUX</strong> + two control lines = a whole
        <strong style={{ color: C.text }}> arithmetic unit</strong>. The select line picks the word into Y (B, B̄, 0000, 1111)
        and the carry-in finishes the job — so the same hardware adds, subtracts, increments or decrements. This is why an ALU is small.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Logic microoperations & masking (AND clears / OR sets)
// ══════════════════════════════════════════════════════════════════
function Masking() {
  // A 4-bit status register of named flags; learner masks one bit at a time.
  const flagNames = ["ENABLE", "READY", "BUSY", "ERROR"];
  const [flags, setFlags] = useState([1, 0, 0, 1]); // current status word
  const [target, setTarget] = useState(3);           // which flag to act on (index)
  const [lastOp, setLastOp] = useState(null);

  const bitStr = (arr) => arr.join("");

  // OR with a 1-only mask sets the target bit; AND with a 0-only mask clears it.
  const setBit = () => {
    const mask = flags.map((_, i) => (i === target ? 1 : 0));
    const out = flags.map((b, i) => (b | mask[i]));
    setLastOp({ kind: "OR (set)", mask, out, color: C.green });
    setFlags(out);
  };
  const clearBit = () => {
    const mask = flags.map((_, i) => (i === target ? 0 : 1)); // 0 only at target
    const out = flags.map((b, i) => (b & mask[i]));
    setLastOp({ kind: "AND (clear)", mask, out, color: C.orange });
    setFlags(out);
  };
  const toggleBit = () => {
    const mask = flags.map((_, i) => (i === target ? 1 : 0));
    const out = flags.map((b, i) => (b ^ mask[i]));
    setLastOp({ kind: "XOR (toggle)", mask, out, color: C.purple });
    setFlags(out);
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Arithmetic treats the word as one number. <strong style={{ color: C.text }}>Logic works on the individual bits</strong>.
        Why? A status register packs many one-bit flags into one word — and we must change <em>one</em> flag while leaving its
        neighbours untouched. A plain overwrite can't. A <strong style={{ color: C.accent }}>mask</strong> can. Pick a flag,
        then set / clear / toggle it.
      </p>

      {/* the status register */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, justifyContent: "center" }}>
        {flags.map((b, i) => (
          <button key={i} onClick={() => setTarget(i)} style={{
            flex: 1, maxWidth: 110, padding: "10px 6px", borderRadius: 9, cursor: "pointer",
            background: target === i ? C.accent + "1E" : C.card,
            border: `2px solid ${target === i ? C.accent : C.border}`, textAlign: "center",
          }}>
            <div style={{ color: C.muted, fontSize: 10 }}>{flagNames[i]}</div>
            <div style={{ color: b ? C.green : C.muted, fontFamily: "monospace", fontSize: 22, fontWeight: 800 }}>{b}</div>
            <div style={{ color: target === i ? C.accent : C.muted, fontSize: 9, marginTop: 2 }}>{target === i ? "◉ target" : "pick"}</div>
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center", color: C.muted, fontSize: 12, marginBottom: 12, fontFamily: "monospace" }}>
        status word = <strong style={{ color: C.text }}>{bitStr(flags)}</strong>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={setBit} style={{ flex: 1, padding: "9px", borderRadius: 8, border: `2px solid ${C.green}`, background: C.green + "18", color: C.green, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>OR · set → 1</button>
        <button onClick={clearBit} style={{ flex: 1, padding: "9px", borderRadius: 8, border: `2px solid ${C.orange}`, background: C.orange + "18", color: C.orange, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>AND · clear → 0</button>
        <button onClick={toggleBit} style={{ flex: 1, padding: "9px", borderRadius: 8, border: `2px solid ${C.purple}`, background: C.purple + "18", color: C.purple, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>XOR · toggle</button>
      </div>

      {lastOp && (
        <div style={{ background: lastOp.color + "12", border: `1px solid ${lastOp.color}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, fontFamily: "monospace", lineHeight: 1.8 }}>
          <div style={{ color: lastOp.color, fontWeight: 700, fontFamily: "'Segoe UI', sans-serif", marginBottom: 6 }}>{lastOp.kind} on {flagNames[target]}</div>
          <div style={{ display: "flex", gap: 12 }}><span style={{ color: C.muted, width: 44 }}>mask</span> {bitStr(lastOp.mask)}</div>
          <div style={{ display: "flex", gap: 12 }}><span style={{ color: C.muted, width: 44 }}>result</span> <span style={{ color: lastOp.color, fontWeight: 700 }}>{bitStr(lastOp.out)}</span></div>
        </div>
      )}

      <Key color={C.accent}>
        A <strong style={{ color: C.orange }}>0 in an AND-mask clears</strong> a bit (a 1 lets it pass); a
        <strong style={{ color: C.green }}> 1 in an OR-mask sets</strong> a bit (a 0 leaves it alone);
        <strong style={{ color: C.purple }}> XOR toggles</strong> the marked bits. This is how a field is extracted or inserted,
        and how one flag / GPIO pin is driven without disturbing the rest. All 16 logic ops reduce to just AND, OR, XOR, NOT.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Shifts (logical L / logical R / arithmetic R / circular R)
//  Whole 4-bit word shifts between two MARGINS: a bit falls out past one
//  margin, a bit is inserted at the vacated cell (0, the sign, or the
//  wrapped bit). Both 0s AND 1s are shown as filled cells.
// ══════════════════════════════════════════════════════════════════
function Shifter() {
  const [kind, setKind] = useState("shl");
  const [playKey, setPlayKey] = useState(1); // bump to replay the animation

  // Each mode uses a start value chosen to teach it clearly. MSB = index 0.
  const MODES = {
    shl:  { label: "Logical Left", arrow: "←", start: [0, 1, 1, 0], color: C.green,
      meaning: "logical shift left = ×2",
      detail: "The whole word moves one place LEFT: the MSB falls out past the left margin, and a fresh 0 slides into the vacated RIGHT cell. 0110 (6) → 1100 (12)." },
    shr:  { label: "Logical Right", arrow: "→", start: [0, 1, 1, 0], color: C.accent,
      meaning: "logical shift right = ÷2 (unsigned)",
      detail: "The word moves one place RIGHT: the LSB falls out past the right margin, and a 0 slides into the vacated LEFT cell. 0110 (6) → 0011 (3)." },
    ashr: { label: "Arithmetic Right", arrow: "→", start: [1, 0, 1, 0], color: C.orange,
      meaning: "arithmetic shift right = ÷2, sign kept",
      detail: "Like logical right, but the vacated LEFT cell is filled with a COPY of the sign bit (here 1), so a negative number stays negative. 1010 (−6) → 1101 (−3)." },
    ror:  { label: "Circular Right", arrow: "↻", start: [1, 0, 0, 1], color: C.purple,
      meaning: "rotate / circular right — no bit lost",
      detail: "The bit leaving the right margin WRAPS around into the vacated left cell — nothing is lost or invented. 1001 → 1100." },
  };
  const m = MODES[kind];
  const b = m.start;

  // Compute after-word, the ejected bit + side, and the inserted bit + kind.
  let after, ejectSide, ejectBit, insertIndex, insertBit, insertKind;
  if (kind === "shl") {
    after = [b[1], b[2], b[3], 0]; ejectSide = "left"; ejectBit = b[0]; insertIndex = 3; insertBit = 0; insertKind = "fresh 0";
  } else if (kind === "shr") {
    after = [0, b[0], b[1], b[2]]; ejectSide = "right"; ejectBit = b[3]; insertIndex = 0; insertBit = 0; insertKind = "fresh 0";
  } else if (kind === "ashr") {
    after = [b[0], b[0], b[1], b[2]]; ejectSide = "right"; ejectBit = b[3]; insertIndex = 0; insertBit = b[0]; insertKind = "sign bit";
  } else {
    after = [b[3], b[0], b[1], b[2]]; ejectSide = "right"; ejectBit = b[3]; insertIndex = 0; insertBit = b[3]; insertKind = "wrapped bit";
  }

  const decBefore = parseInt(b.join(""), 2);
  const decAfter = parseInt(after.join(""), 2);

  // A single bit cell — BOTH 0s and 1s get a visible filled cell.
  const Cell = ({ bit, highlight, anim }) => (
    <div style={{
      width: 42, height: 46, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace", fontSize: 22, fontWeight: 800,
      background: highlight ? m.color + "33" : (bit ? C.teal + "22" : C.surface),
      border: `2px solid ${highlight ? m.color : (bit ? C.teal : C.muted)}`,
      color: highlight ? m.color : (bit ? C.teal : C.text),
      animation: anim || "none",
    }}>{bit}</div>
  );

  const Margin = () => (
    <div style={{ width: 4, height: 58, borderRadius: 2, background: C.yellow, opacity: 0.8 }} />
  );

  // ejected chip sits just OUTSIDE the relevant margin, faded, sliding away.
  const EjectChip = ({ animName }) => (
    <div style={{
      width: 36, height: 40, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace", fontSize: 18, fontWeight: 800, color: kind === "ror" ? C.purple : C.red,
      background: (kind === "ror" ? C.purple : C.red) + "1E", border: `2px dashed ${kind === "ror" ? C.purple : C.red}`,
      animation: `${animName} 0.8s ease`,
    }}>{ejectBit}</div>
  );

  const Row = ({ bits, isAfter }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <div style={{ width: 40, textAlign: "right", fontSize: 10, color: C.muted, marginRight: 2 }}>
        {isAfter && ejectSide === "left" ? <EjectChip animName="u22ejectL" /> : null}
      </div>
      <Margin />
      {bits.map((bit, i) => (
        <Cell key={i} bit={bit}
          highlight={isAfter && i === insertIndex}
          anim={isAfter && i === insertIndex ? "u22pop 0.7s ease" : undefined} />
      ))}
      <Margin />
      <div style={{ width: 40, textAlign: "left", fontSize: 10, color: C.muted, marginLeft: 2 }}>
        {isAfter && ejectSide === "right" ? <EjectChip animName="u22ejectR" /> : null}
      </div>
    </div>
  );

  return (
    <div>
      <style>{`
        @keyframes u22pop { 0%{transform:scale(.35);opacity:0} 60%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
        @keyframes u22ejectL { 0%{opacity:1;transform:translateX(30px)} 100%{opacity:.25;transform:translateX(0)} }
        @keyframes u22ejectR { 0%{opacity:1;transform:translateX(-30px)} 100%{opacity:.25;transform:translateX(0)} }
      `}</style>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A shift is two actions: <strong style={{ color: C.text }}>① move every bit one place between the two margins,
        ② fill the vacated cell</strong>. All four types move the word the same way — they differ only in
        <em> which bit is inserted</em>, and that decides what the shift <em>means</em>. Pick one and replay it.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {Object.entries(MODES).map(([k, v]) => (
          <button key={k} onClick={() => { setKind(k); setPlayKey((n) => n + 1); }} style={{
            flex: 1, minWidth: 110, padding: "9px 6px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 11.5,
            background: kind === k ? v.color + "22" : C.card,
            border: `2px solid ${kind === k ? v.color : C.border}`,
            color: kind === k ? v.color : C.muted,
          }}>{v.label} {v.arrow}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 10px", marginBottom: 12 }} key={playKey}>
        {/* margin labels */}
        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 320, margin: "0 auto 4px", padding: "0 44px" }}>
          <span style={{ color: C.yellow, fontSize: 9 }}>◄ left margin</span>
          <span style={{ color: C.yellow, fontSize: 9 }}>right margin ►</span>
        </div>

        <div style={{ marginBottom: 4 }}>
          <div style={{ textAlign: "center", color: C.muted, fontSize: 10, marginBottom: 4 }}>before &nbsp;=&nbsp; {decBefore}{kind === "ashr" ? " (−6 signed)" : ""}</div>
          <Row bits={b} isAfter={false} />
        </div>

        <div style={{ textAlign: "center", color: m.color, fontSize: 20, margin: "6px 0", fontWeight: 700 }}>
          {m.arrow} shift {kind === "shl" ? "left" : "right"}{kind === "ror" ? " (rotate)" : ""}
        </div>

        <div>
          <Row bits={after} isAfter={true} />
          <div style={{ textAlign: "center", color: m.color, fontSize: 10, marginTop: 4 }}>
            after &nbsp;=&nbsp; {decAfter}{kind === "ashr" ? " (−3 signed)" : ""} &nbsp;·&nbsp;
            inserted <strong>{insertBit}</strong> ({insertKind}), bit <strong>{ejectBit}</strong> left the {ejectSide} margin{kind === "ror" ? " and wrapped in" : ""}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button onClick={() => setPlayKey((n) => n + 1)} style={{
            padding: "7px 18px", borderRadius: 8, border: `1px solid ${m.color}`, background: m.color + "18",
            color: m.color, fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>▶ Replay shift</button>
        </div>
      </div>

      <div style={{ background: m.color + "12", border: `1px solid ${m.color}55`, borderRadius: 8, padding: "10px 14px", marginBottom: 4 }}>
        <div style={{ color: m.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{m.label} — {m.meaning}</div>
        <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>{m.detail}</div>
      </div>

      <Key color={C.yellow}>
        <strong style={{ color: C.green }}>Left ≈ ×2</strong>, <strong style={{ color: C.accent }}>right ≈ ÷2</strong> — a shift
        is far cheaper than a full multiply, and it's the heart of <strong style={{ color: C.text }}>shift-and-add</strong>
        multiplication. The vacated cell decides the type: <strong style={{ color: C.accent }}>0</strong> = logical,
        <strong style={{ color: C.orange }}> sign bit</strong> = arithmetic (keeps the sign),
        <strong style={{ color: C.purple }}> wrapped bit</strong> = circular.
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
      q: "Why does an ALU NOT need a separate multiply circuit?",
      options: [
        "Because multiplication is rarely used",
        "Because × is repeated addition — the same adder, used repeatedly (shift-and-add)",
        "Because the MUX multiplies for free",
        "Because multiplication is done in software only",
      ],
      answer: 1,
      explain: "× is repeated addition and ÷ is repeated subtraction, so both reuse the adder. Real hardware uses the smarter shift-and-add: at most one add per bit of the multiplier.",
    },
    {
      q: "To compute A − B, the adder–subtractor sets mode M = 1. What does that do?",
      options: [
        "It rewires the adder into a dedicated subtractor",
        "It flips every bit of B (via XOR) and sets carry-in = 1 — forming A + B̄ + 1",
        "It flips every bit of A instead",
        "It multiplies B by −1 using a second circuit",
      ],
      answer: 1,
      explain: "M feeds every B-XOR (flipping B) and the carry-in. A + B̄ + 1 is exactly A + (2's complement of B) = A − B. One mode line, one adder, two jobs.",
    },
    {
      q: "You want to force ONLY the READY flag to 1 in a status word, leaving the others untouched. Which operation?",
      options: [
        "AND with a mask that has 1 only at READY",
        "OR with a mask that has 1 only at READY",
        "XOR with a mask of all 1s",
        "Overwrite the whole word",
      ],
      answer: 1,
      explain: "OR with a 1-only mask sets that bit (0s in the mask leave the rest alone). AND with a 0-only mask would instead CLEAR a bit. A plain overwrite would disturb the neighbouring flags.",
    },
    {
      q: "Why is arithmetic shift-right (ashr) different from logical shift-right?",
      options: [
        "It shifts by two places at once",
        "It copies the sign bit back into the top, so dividing a negative number by 2 stays negative",
        "It fills the vacated bit with a 1 always",
        "It wraps the exiting bit around to the other end",
      ],
      answer: 1,
      explain: "Logical shift-right feeds a 0 into the top bit, which flips a negative number positive. Arithmetic shift-right re-inserts the sign bit, so −8 >> 1 = −4 — a true ÷2. Circular shift is the one that wraps.",
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
          {score === 4 ? "Perfect! You can build an ALU from one adder, a MUX, and a handful of select lines." :
            score >= 2 ? "Good work! Replay 'The Adder–Subtractor' and 'Shifts' to lock in the details." :
              "Revisit 'One Adder, Many Operations' and 'Masking' — those two ideas carry the whole unit."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've turned a lone adder into a full ALU: subtract by 2's complement, add / subtract / increment / decrement
            through one MUX, mask and toggle single bits, and shift to multiply or divide by two.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.3 — Fetching a Word from Memory.</strong>{" "}
            You can now move bits and compute with them. Time to watch a complete instruction ride the datapath, one clock
            beat at a time.
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
export default function Unit2_2({ student, onUnitComplete }) {
  const sections = [
    { id: "adder", label: "One Adder" },
    { id: "subtract", label: "2's-Comp Subtract" },
    { id: "arith", label: "Many Operations" },
    { id: "logic", label: "Logic & Masking" },
    { id: "shift", label: "Shifts" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>➕ Six Operations, One Adder</h3>
      <OneAdder />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>➖ Subtract by 2's Complement — plain arithmetic</h3>
      <AdderSubtractor />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎚️ One Adder + One MUX = Many Operations</h3>
      <ArithmeticUnit />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎭 Logic Microoperations & Masking</h3>
      <Masking />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>↔️ Shifts — multiply and divide by two</h3>
      <Shifter />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.2.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧮</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Arithmetic & Logic Operations</div>
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
