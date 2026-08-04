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

      <Key color={C.accent}>
        <strong style={{ color: C.accent }}>×</strong> is repeated addition, <strong style={{ color: C.accent }}>÷</strong> is
        repeated subtraction — so neither needs its own circuit. The whole ALU can be built around
        <strong style={{ color: C.text }}> one adder</strong>, if only it can also subtract. That's next.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Subtract via 2's complement (adder–subtractor, mode M)
// ══════════════════════════════════════════════════════════════════
function AdderSubtractor() {
  const [m, setM] = useState(0); // mode: 0 = add, 1 = subtract

  const A = "0101"; // 5
  const B = "0011"; // 3
  const Bbar = "1100";
  const yIntoAdder = m === 0 ? B : Bbar;
  const cin = m;
  const result = m === 0 ? "1000 = 8" : "0010 = 2";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Repeating only ever <em>adds</em>. To subtract we seem to need new hardware — unless we turn a subtraction into an
        addition. The trick: <strong style={{ color: C.text }}>A − B = A + (2's complement of B)</strong>, and 2's complement
        is easy — <strong style={{ color: C.orange }}>flip every bit, then add 1</strong>. Flip the mode line M:
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[0, 1].map((v) => (
          <button key={v} onClick={() => setM(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: m === v ? (v === 0 ? C.green + "22" : C.orange + "22") : C.card,
            border: `2px solid ${m === v ? (v === 0 ? C.green : C.orange) : C.border}`,
            color: m === v ? (v === 0 ? C.green : C.orange) : C.muted,
          }}>M = {v} · {v === 0 ? "ADD (A + B)" : "SUBTRACT (A − B)"}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 200" style={{ width: "100%", display: "block" }}>
          {/* A input */}
          <rect x={20} y={30} width={110} height={40} rx={7} fill={C.card} stroke={C.teal} strokeWidth={2} />
          <text x={75} y={48} textAnchor="middle" fill={C.muted} fontSize={10}>A = 5</text>
          <text x={75} y={63} textAnchor="middle" fill={C.teal} fontSize={14} fontWeight="700" fontFamily="monospace">{A}</text>
          {/* B input through the XOR row (controlled NOT) */}
          <rect x={20} y={130} width={110} height={40} rx={7} fill={C.card} stroke={C.orange} strokeWidth={2} />
          <text x={75} y={148} textAnchor="middle" fill={C.muted} fontSize={10}>B = 3 {m === 1 ? "→ flipped" : ""}</text>
          <text x={75} y={163} textAnchor="middle" fill={C.orange} fontSize={14} fontWeight="700" fontFamily="monospace">{yIntoAdder}</text>
          {/* XOR gate row driven by M */}
          <rect x={160} y={128} width={80} height={44} rx={7} fill={m === 1 ? C.orange + "22" : C.card} stroke={m === 1 ? C.orange : C.border} strokeWidth={m === 1 ? 2.5 : 1.5} style={{ transition: "all 0.3s" }} />
          <text x={200} y={148} textAnchor="middle" fill={m === 1 ? C.orange : C.muted} fontSize={11} fontWeight="700">XOR row</text>
          <text x={200} y={163} textAnchor="middle" fill={C.muted} fontSize={9}>M = {m}</text>
          {/* mode line M going to XOR + carry-in */}
          <line x1={200} y1={186} x2={200} y2={172} stroke={m === 1 ? C.orange : C.muted} strokeWidth={2} />
          <text x={200} y={198} textAnchor="middle" fill={m === 1 ? C.orange : C.muted} fontSize={9}>mode M → XOR + Cin</text>
          {/* adder */}
          <rect x={300} y={60} width={110} height={90} rx={9} fill={C.card} stroke={C.accent} strokeWidth={2} />
          <text x={355} y={100} textAnchor="middle" fill={C.accent} fontSize={13} fontWeight="700">n-bit ADDER</text>
          <text x={355} y={120} textAnchor="middle" fill={C.muted} fontSize={10} fontFamily="monospace">Cin = {cin}</text>
          {/* wires */}
          <line x1={130} y1={50} x2={300} y2={85} stroke={C.teal} strokeWidth={1.5} opacity={0.6} />
          <line x1={240} y1={150} x2={300} y2={125} stroke={C.orange} strokeWidth={1.5} opacity={0.6} />
          {/* result */}
          <rect x={430} y={80} width={80} height={50} rx={8} fill={m === 0 ? C.green + "1E" : C.orange + "1E"} stroke={m === 0 ? C.green : C.orange} strokeWidth={2} />
          <text x={470} y={100} textAnchor="middle" fill={C.muted} fontSize={9}>result</text>
          <text x={470} y={118} textAnchor="middle" fill={m === 0 ? C.green : C.orange} fontSize={13} fontWeight="800" fontFamily="monospace">{result.split(" = ")[1]}</text>
          <line x1={410} y1={105} x2={430} y2={105} stroke={C.muted} strokeWidth={1.5} />
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.7, marginBottom: 4, fontFamily: "monospace" }}>
        {m === 0
          ? <span>M = 0 → B passes unchanged, Cin = 0. Adder: <strong style={{ color: C.green }}>0101 + 0011 = 1000 = 8</strong>.</span>
          : <span>M = 1 → B is flipped to <span style={{ color: C.orange }}>1100</span>, Cin = 1 (the "+1"). Adder: <strong style={{ color: C.orange }}>0101 + 1100 + 1 = 0010 = 2</strong> = 5 − 3. ✓</span>}
      </div>

      <Key color={C.orange}>
        One mode line M does both jobs: it feeds every B-XOR (flip or pass) <em>and</em> the carry-in.
        <strong style={{ color: C.green }}> M = 0 → A + B</strong>;
        <strong style={{ color: C.orange }}> M = 1 → A + B̄ + 1 = A − B</strong>. Cin = 1 is exactly the "+1" that completes the
        2's complement. One circuit, two jobs — no subtractor needed.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — One adder + one MUX = many operations (playground)
// ══════════════════════════════════════════════════════════════════
function ArithmeticUnit() {
  const [op, setOp] = useState(null); // "add" | "sub" | "inc" | "dec"

  // A = 5 (0101) fixed; the MUX picks what goes into Y, and Cin is set per op.
  const OPS = {
    add: { label: "ADD  A+B", s: "00", y: "0011", yName: "B", cin: "0", res: "1000 = 8", color: C.green,
      rtn: "S1S0 = 00 passes Y = B = 0011, Cin = 0. Adder: 0101 + 0011 = 1000 = 8." },
    sub: { label: "SUB  A−B", s: "01", y: "1100", yName: "B̄", cin: "1", res: "0010 = 2", color: C.orange,
      rtn: "S1S0 = 01 passes Y = B̄ = 1100, Cin = 1 completes the 2's complement. 0101 + 1100 + 1 = 0010 = 2." },
    inc: { label: "INC  A+1", s: "10", y: "0000", yName: "0…0", cin: "1", res: "0110 = 6", color: C.teal,
      rtn: "S1S0 = 10 passes Y = 0000, Cin = 1. Adder: 0101 + 0 + 1 = 0110 = 6 = A + 1." },
    dec: { label: "DEC  A−1", s: "11", y: "1111", yName: "1…1", cin: "0", res: "0100 = 4", color: C.purple,
      rtn: "S1S0 = 11 passes Y = 1111 (= −1), Cin = 0. Adder: 0101 + (−1) = 0100 = 4 = A − 1." },
  };
  const o = op ? OPS[op] : null;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Our adder already subtracts. Now put a <strong style={{ color: C.accent }}>MUX</strong> on its second input Y and let
        the control unit choose the word — the same box does <strong style={{ color: C.text }}>add, subtract, increment,
        decrement</strong>. Press an op and watch the select line and Cin change. (A = 5, B = 3.)
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

      {/* datapath readout */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: C.teal + "1E", border: `2px solid ${C.teal}`, textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 10 }}>A</div>
            <div style={{ color: C.teal, fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>0101</div>
          </div>
          <div style={{ fontSize: 20, color: C.muted }}>+</div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: o ? o.color + "1E" : C.surface, border: `2px solid ${o ? o.color : C.border}`, textAlign: "center", minWidth: 90 }}>
            <div style={{ color: C.muted, fontSize: 10 }}>MUX → Y {o ? `(${o.yName})` : ""}</div>
            <div style={{ color: o ? o.color : C.muted, fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>{o ? o.y : "----"}</div>
          </div>
          <div style={{ fontSize: 20, color: C.muted }}>+</div>
          <div style={{ padding: "8px 12px", borderRadius: 8, background: C.surface, border: `2px solid ${C.border}`, textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 10 }}>Cin</div>
            <div style={{ color: C.yellow, fontFamily: "monospace", fontSize: 15, fontWeight: 700 }}>{o ? o.cin : "-"}</div>
          </div>
          <div style={{ fontSize: 20, color: C.muted }}>=</div>
          <div style={{ padding: "8px 14px", borderRadius: 8, background: o ? o.color + "22" : C.surface, border: `2px solid ${o ? o.color : C.border}`, textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 10 }}>result</div>
            <div style={{ color: o ? o.color : C.muted, fontFamily: "monospace", fontSize: 18, fontWeight: 800 }}>{o ? o.res : "----"}</div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: C.muted, fontSize: 11, marginTop: 10, fontFamily: "monospace" }}>
          select line S1S0 = <strong style={{ color: C.accent }}>{o ? o.s : "--"}</strong> · carry-out is dropped
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, minHeight: 40, lineHeight: 1.6, fontFamily: "monospace" }}>
        {o ? o.rtn : "Press ADD, SUB, INC or DEC to route the MUX and set the carry-in."}
      </div>

      <Key color={C.accent}>
        One adder + one MUX + a couple of select lines = a whole <strong style={{ color: C.text }}>arithmetic unit</strong>.
        The control unit picks the word fed to Y (B, B̄, all-0s, all-1s) and the carry-in — and the same hardware adds,
        subtracts, increments or decrements. This is why an ALU is small.
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
//  Section 5 — Shifts (logical / arithmetic / circular; ×2 and ÷2)
// ══════════════════════════════════════════════════════════════════
function Shifter() {
  const [kind, setKind] = useState("shl"); // shl | ashr | cir

  // Start value chosen so ×2 / ÷2 and the sign story both read clearly.
  const start = [0, 1, 1, 0]; // 0110 = 6

  // Compute one shift of each kind on a 4-bit word.
  const doShift = (bits, k) => {
    if (k === "shl") return [...bits.slice(1), 0];                 // logical left: 0 fills right
    if (k === "ashr") return [bits[0], ...bits.slice(0, 3)];        // arith right: sign copied in
    if (k === "cir") return [bits[3], ...bits.slice(0, 3)];         // circular right: bit wraps
    return bits;
  };

  const before = start;
  const after = doShift(before, kind);
  const valBefore = parseInt(before.join(""), 2);
  const valAfterUnsigned = parseInt(after.join(""), 2);

  const notes = {
    shl: { title: "Logical left (shl) — fresh 0 slides in", math: `0110 (6) << 1 = 1100 (12) — ×2`, color: C.green,
      body: "Every bit moves up one place, worth twice as much; a fresh 0 enters at the right. Left shift ≈ ×2." },
    ashr: { title: "Arithmetic right (ashr) — sign bit copied in", math: `0110 (6) >> 1 = 0011 (3) — ÷2`, color: C.accent,
      body: "Every bit moves down one place, worth half. The old sign (MSB) is re-inserted, so dividing a NEGATIVE number by 2 still stays negative. A logical shift would flip the sign." },
    cir: { title: "Circular right (cir) — the exiting bit wraps", math: `0110 → 0011 (the bit that falls off re-enters the other end)`, color: C.purple,
      body: "No bit is lost or invented — the bit that exits one end re-enters the other. Used for rotations, not for ×2/÷2." },
  };
  const n = notes[kind];

  const Cell = ({ b, faded }) => (
    <div style={{
      width: 42, height: 48, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "monospace", fontSize: 22, fontWeight: 800,
      background: b ? n.color + "22" : C.card, border: `2px solid ${b ? n.color : C.border}`,
      color: b ? n.color : C.muted, opacity: faded ? 0.4 : 1, transition: "all 0.3s",
    }}>{b}</div>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A shift is two actions: <strong style={{ color: C.text }}>① move every bit one place, ② fill the vacated end</strong>.
        Every shift moves bits the same way — the three <em>types</em> differ only in step ②, and that one choice decides what
        the shift <em>means</em>. Switch between them:
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["shl", "Logical ← ×2"], ["ashr", "Arithmetic → ÷2"], ["cir", "Circular ↻"]].map(([k, label]) => (
          <button key={k} onClick={() => setKind(k)} style={{
            flex: 1, padding: "9px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12,
            background: kind === k ? n.color + "22" : C.card,
            border: `2px solid ${kind === k ? notes[k].color : C.border}`,
            color: kind === k ? notes[k].color : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ color: C.muted, fontSize: 11, width: 54, textAlign: "right" }}>before</span>
          {before.map((b, i) => <Cell key={i} b={b} />)}
          <span style={{ color: C.muted, fontSize: 12, marginLeft: 6, fontFamily: "monospace" }}>= {valBefore}</span>
        </div>
        <div style={{ textAlign: "center", color: C.muted, fontSize: 18, margin: "2px 0" }}>↓ {kind === "shl" ? "shift left" : "shift right"}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ color: n.color, fontSize: 11, width: 54, textAlign: "right", fontWeight: 700 }}>after</span>
          {after.map((b, i) => <Cell key={i} b={b} />)}
          <span style={{ color: n.color, fontSize: 12, marginLeft: 6, fontFamily: "monospace", fontWeight: 700 }}>= {valAfterUnsigned}</span>
        </div>
      </div>

      <div style={{ background: n.color + "12", border: `1px solid ${n.color}55`, borderRadius: 8, padding: "10px 14px", marginBottom: 4 }}>
        <div style={{ color: n.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{n.title}</div>
        <div style={{ color: C.text, fontSize: 12.5, fontFamily: "monospace", marginBottom: 6 }}>{n.math}</div>
        <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>{n.body}</div>
      </div>

      <Key color={C.yellow}>
        <strong style={{ color: C.green }}>Left ≈ ×2</strong>, <strong style={{ color: C.accent }}>right ≈ ÷2</strong> — a shift
        is far cheaper than a full multiply. And it's the heart of <strong style={{ color: C.text }}>shift-and-add</strong>
        multiplication: a number is a sum of powers of two, so multiplying = adding shifted copies of the multiplicand — at most
        one add per bit. Arithmetic (logic) shift keeps the sign; logical loses it; circular wraps.
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
    { id: "subtract", label: "Adder–Subtractor" },
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
      <h3 style={{ color: C.text, marginBottom: 6 }}>➖ The Adder–Subtractor — one circuit, two jobs</h3>
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
