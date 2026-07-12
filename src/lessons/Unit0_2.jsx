// Unit0_2.jsx — Module 0 › Unit 0.2 — "Bits & Boolean Logic" (SVG circuits)
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Story arc: one switch = one bit → Shannon's bridge (switches ARE logic) →
// the four gates → the half adder (gates that add). Forward hook: chaining
// full adders into a real ALU, seen later in Module 2.
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

// small 0/1 toggle button used across widgets
function BitToggle({ value, onClick, color = C.accent }) {
  const on = value === 1;
  return (
    <button onClick={onClick} style={{
      width: 46, height: 46, borderRadius: 10, cursor: "pointer",
      border: `2px solid ${on ? color : C.border}`,
      background: on ? color + "22" : C.bg,
      color: on ? color : C.muted, fontWeight: 800, fontSize: 18, transition: "all 0.15s",
    }}>{value}</button>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Switch & the Bit (Need): build numbers from switches
// ══════════════════════════════════════════════════════════════════
function SwitchWidget() {
  const [bits, setBits] = useState([0, 0, 0, 0]); // MSB..LSB, weights 8 4 2 1
  const weights = [8, 4, 2, 1];
  const supers = ["³", "²", "¹", "⁰"];
  const dec = bits.reduce((a, b, i) => a + (b ? weights[i] : 0), 0);
  const flip = (i) => setBits((bs) => bs.map((v, j) => (j === i ? (v ? 0 : 1) : v)));

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        Under all the software, a computer is just switches. Each has two states — OFF (0) and
        ON (1) — and one switch holds one <strong style={{ color: C.text }}>bit</strong>. Flip these
        four and watch a number appear. <strong style={{ color: C.text }}>Try to make 5, then 11, then 15.</strong>
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "18px 0", flexWrap: "wrap" }}>
        {bits.map((v, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>2{supers[i]} = {weights[i]}</div>
            <button onClick={() => flip(i)} style={{
              width: 54, height: 54, borderRadius: 12, cursor: "pointer",
              border: `3px solid ${v ? C.teal : C.border}`,
              background: v ? C.teal + "22" : C.bg, color: v ? C.teal : C.muted,
              fontWeight: 800, fontSize: 20, transition: "all 0.15s",
            }}>{v}</button>
            <div style={{ fontSize: 10, color: v ? C.teal : C.muted, marginTop: 6, fontWeight: 700 }}>{v ? "ON" : "OFF"}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>BINARY</div>
        <div style={{ fontFamily: "monospace", fontSize: 30, fontWeight: 800, color: C.teal, letterSpacing: 8 }}>{bits.join("")}</div>
        <div style={{ fontSize: 11, color: C.muted, margin: "8px 0 4px" }}>DECIMAL VALUE</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>
          {bits.map((v, i) => (v ? weights[i] : null)).filter(Boolean).join(" + ") || "0"}{dec > 0 ? ` = ${dec}` : ""}
        </div>
      </div>

      <Key color={C.teal}>
        Each position is worth double the one to its right (1, 2, 4, 8…). That's all a binary number
        is — switches in weighted columns. Four switches cover 0–15; add a switch and the range
        doubles. N switches represent 2<sup>N</sup> different values.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Shannon's Bridge: switches wired into logic
// ══════════════════════════════════════════════════════════════════
function ShannonWidget() {
  const [op, setOp] = useState("AND");
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const lit = op === "AND" ? a && b : op === "OR" ? a || b : !a; // NOT ignores b

  const ON = C.green, OFF = C.border;
  const caption = op === "AND" ? "AND = two switches in SERIES. Current must pass through BOTH, so both must close."
    : op === "OR" ? "OR = two switches in PARALLEL. Either branch closing gives the current a path."
      : "NOT = a normally-CLOSED switch. Current flows until you press it, then the contact breaks.";

  // ── SVG primitives ──
  const Wire = ({ p, live, k }) => <polyline key={k} points={p} fill="none" stroke={live ? ON : OFF} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />;
  const Vplus = ({ x, y }) => (
    <g>
      <circle cx={x} cy={y} r={13} fill={C.card} stroke={C.yellow} strokeWidth={2} />
      <text x={x} y={y + 4} fill={C.yellow} fontSize={11} fontWeight="700" textAnchor="middle">V+</text>
    </g>
  );
  const Bulb = ({ x, y, on }) => (
    <g>
      <circle cx={x} cy={y} r={17} fill={on ? ON + "44" : C.bg} stroke={on ? ON : C.border} strokeWidth={3} style={{ filter: on ? `drop-shadow(0 0 6px ${ON})` : "none" }} />
      <text x={x} y={y + 6} fontSize={17} textAnchor="middle">💡</text>
    </g>
  );
  // A switch: two contacts at x1 and x2 (same y). Closed = bridge line; open = lifted lever with a gap.
  const Switch = ({ x1, x2, y, closed, onClick, label, labelColor }) => (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <circle cx={x1} cy={y} r={4} fill={C.muted} />
      <circle cx={x2} cy={y} r={4} fill={C.muted} />
      {closed
        ? <line x1={x1} y1={y} x2={x2} y2={y} stroke={ON} strokeWidth={4} strokeLinecap="round" />
        : <line x1={x1} y1={y} x2={x2 - 6} y2={y - 17} stroke={C.muted} strokeWidth={4} strokeLinecap="round" />}
      <text x={(x1 + x2) / 2} y={y - 24} fill={labelColor || C.text} fontSize={12} fontWeight="700" textAnchor="middle">{label}</text>
      <rect x={x1 - 8} y={y - 30} width={x2 - x1 + 16} height={48} fill="transparent" />
    </g>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        In 1937 Claude Shannon proved the missing link: Boole's logic (AND, OR, NOT) is exactly how
        you wire switches. Pick an operation, click the switches, and follow the current — a wire glows
        green only where current actually flows.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {["AND", "OR", "NOT"].map((o) => (
          <button key={o} onClick={() => { setOp(o); setA(false); setB(false); }} style={{
            flex: 1, padding: "8px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
            background: op === o ? C.accentGlow : C.card, color: op === o ? "#fff" : C.muted,
          }}>{o}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 8px 6px" }}>
        <svg viewBox="0 0 300 170" style={{ width: "100%", maxWidth: 360, display: "block", margin: "0 auto" }}>
          {op === "AND" && (<>
            {/* series: V+ → A → B → bulb */}
            <Wire p="33,85 66,85" live={true} />
            <Wire p="114,85 150,85" live={a} />
            <Wire p="190,85 253,85" live={a && b} />
            <Vplus x={20} y={85} />
            <Switch x1={66} x2={106} y={85} closed={a} onClick={() => setA(v => !v)} label="A" labelColor={a ? ON : C.muted} />
            <Switch x1={150} x2={190} y={85} closed={b} onClick={() => setB(v => !v)} label="B" labelColor={b ? ON : C.muted} />
            <Bulb x={270} y={85} on={lit} />
          </>)}

          {op === "OR" && (<>
            {/* parallel: V+ → split → (A branch | B branch) → merge → bulb */}
            <Wire p="33,85 55,85" live={true} />
            <Wire p="55,45 55,125" live={true} />
            {/* top branch A */}
            <Wire p="55,45 80,45" live={true} />
            <Wire p="120,45 225,45 225,85" live={a} />
            {/* bottom branch B */}
            <Wire p="55,125 80,125" live={true} />
            <Wire p="120,125 225,125 225,85" live={b} />
            {/* merge → bulb */}
            <Wire p="225,85 253,85" live={a || b} />
            <Vplus x={20} y={85} />
            <Switch x1={80} x2={120} y={45} closed={a} onClick={() => setA(v => !v)} label="A" labelColor={a ? ON : C.muted} />
            <Switch x1={80} x2={120} y={125} closed={b} onClick={() => setB(v => !v)} label="B" labelColor={b ? ON : C.muted} />
            <circle cx={55} cy={85} r={3.5} fill={ON} />
            <circle cx={225} cy={85} r={3.5} fill={a || b ? ON : OFF} />
            <Bulb x={270} y={85} on={lit} />
          </>)}

          {op === "NOT" && (<>
            {/* normally-closed: V+ → switch(closed when !a) → bulb */}
            <Wire p="33,85 106,85" live={true} />
            <Wire p="190,85 253,85" live={!a} />
            <Vplus x={20} y={85} />
            <Switch x1={106} x2={190} y={85} closed={!a} onClick={() => setA(v => !v)} label={a ? "A pressed → open" : "A (click to press)"} labelColor={!a ? ON : C.red} />
            <Bulb x={270} y={85} on={lit} />
          </>)}
        </svg>
        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "0 8px", lineHeight: 1.5 }}>{caption}</div>
        <div style={{ marginTop: 8, marginBottom: 6, fontWeight: 700, fontSize: 14, color: lit ? ON : C.muted, textAlign: "center", fontFamily: "monospace" }}>
          {op === "NOT" ? `NOT ${a ? 1 : 0} = ${lit ? 1 : 0}` : `${a ? 1 : 0} ${op} ${b ? 1 : 0} = ${lit ? 1 : 0}`}
          <span style={{ color: C.muted, fontFamily: "inherit" }}> — bulb {lit ? "ON 💡" : "off"}</span>
        </div>
      </div>

      <Key color={C.green}>
        This is the bridge the whole field waited 90 years for: logic is just wiring. AND is switches
        in series (both must close); OR is switches in parallel (either path works). Design the logic
        with algebra on paper, then build it from switches.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Logic Gates: the four building blocks + truth table
// ══════════════════════════════════════════════════════════════════
function GateWidget() {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const out = (g, x, y) => (g === "AND" ? x & y : g === "OR" ? x | y : g === "XOR" ? x ^ y : x ? 0 : 1);
  const result = out(gate, a, b);
  const rows = [[0, 0], [0, 1], [1, 0], [1, 1]].filter((r) => gate !== "NOT" || r[1] === 0);
  const blurb = {
    AND: "1 only when BOTH inputs are 1.",
    OR: "1 when AT LEAST ONE input is 1.",
    XOR: "1 only when the inputs DIFFER.",
    NOT: "flips its single input.",
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A <strong style={{ color: C.text }}>gate</strong> is a small circuit that does one logic
        operation. A CPU has billions of them. Pick a gate, set the inputs, and watch the output and
        its truth table.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {["AND", "OR", "XOR", "NOT"].map((g) => (
          <button key={g} onClick={() => setGate(g)} style={{
            padding: "6px 16px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
            background: gate === g ? C.accentGlow : C.card, color: gate === g ? "#fff" : C.muted,
          }}>{g}</button>
        ))}
      </div>

      {/* the input switches you drive */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 10 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Input A</div>
          <BitToggle value={a} onClick={() => setA(a ? 0 : 1)} />
        </div>
        {gate !== "NOT" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Input B</div>
            <BitToggle value={b} onClick={() => setB(b ? 0 : 1)} />
          </div>
        )}
      </div>

      {/* the actual gate SYMBOL: wires for A/B flow in, the output wire flows out */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "8px 6px 2px", marginBottom: 8 }}>
        <svg viewBox="0 0 220 112" style={{ width: "100%", maxWidth: 380, display: "block", margin: "0 auto" }}>
          {/* input A wire (teal when 1) */}
          <text x={24} y={(gate === "NOT" ? 55 : 38) - 8} fill={C.muted} fontSize={11} textAnchor="middle">A</text>
          <text x={10} y={(gate === "NOT" ? 55 : 38) + 5} fill={a ? C.teal : C.muted} fontSize={13} fontWeight="800" textAnchor="middle">{a}</text>
          <line x1={20} y1={gate === "NOT" ? 55 : 38} x2={72} y2={gate === "NOT" ? 55 : 38} stroke={a ? C.teal : C.border} strokeWidth={4} strokeLinecap="round" />
          {gate !== "NOT" && (
            <g>
              <text x={24} y={64} fill={C.muted} fontSize={11} textAnchor="middle">B</text>
              <text x={10} y={77} fill={b ? C.teal : C.muted} fontSize={13} fontWeight="800" textAnchor="middle">{b}</text>
              <line x1={20} y1={72} x2={72} y2={72} stroke={b ? C.teal : C.border} strokeWidth={4} strokeLinecap="round" />
            </g>
          )}
          {/* gate symbol drawn over the wire tips for a clean join */}
          {gate === "AND" && <path d="M66,20 H102 A35,35 0 0 1 102,90 H66 Z" fill={C.card} stroke={C.accent} strokeWidth={3} />}
          {gate === "OR" && <path d="M60,20 Q100,20 138,55 Q100,90 60,90 Q80,55 60,20 Z" fill={C.card} stroke={C.accent} strokeWidth={3} />}
          {gate === "XOR" && (
            <g>
              <path d="M50,20 Q70,55 50,90" fill="none" stroke={C.accent} strokeWidth={3} />
              <path d="M62,20 Q102,20 140,55 Q102,90 62,90 Q82,55 62,20 Z" fill={C.card} stroke={C.accent} strokeWidth={3} />
            </g>
          )}
          {gate === "NOT" && (
            <g>
              <path d="M66,28 L122,55 L66,82 Z" fill={C.card} stroke={C.accent} strokeWidth={3} />
              <circle cx={130} cy={55} r={7} fill={C.card} stroke={C.accent} strokeWidth={3} />
            </g>
          )}
          {/* output wire + node (green when 1) */}
          <line x1={gate === "NOT" ? 137 : 139} y1={55} x2={182} y2={55} stroke={result ? C.green : C.border} strokeWidth={4} strokeLinecap="round" />
          <text x={198} y={30} fill={C.accent} fontSize={10} fontWeight="700" textAnchor="middle">OUT</text>
          <circle cx={198} cy={55} r={13} fill={result ? C.green + "33" : C.card} stroke={result ? C.green : C.border} strokeWidth={2.5} />
          <text x={198} y={60} fill={result ? C.green : C.muted} fontSize={14} fontWeight="800" textAnchor="middle">{result}</text>
          <text x={100} y={107} fill={C.accent} fontSize={12} fontWeight="800" textAnchor="middle">{gate} gate</text>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, maxWidth: 240, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, letterSpacing: 1 }}>TRUTH TABLE — {gate}</div>
        {rows.map(([x, y], i) => {
          const r = out(gate, x, y);
          const active = x === a && (gate === "NOT" || y === b);
          return (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 13,
              padding: "3px 8px", borderRadius: 6, marginBottom: 2,
              background: active ? C.accent + "22" : "transparent", color: active ? C.accent : C.muted,
            }}>
              <span>{gate === "NOT" ? `NOT ${x}` : `${x} ${gate} ${y}`}</span>
              <span style={{ fontWeight: 700 }}>= {r}</span>
            </div>
          );
        })}
      </div>

      <Key color={C.accent}>
        The <strong>{gate}</strong> gate: {blurb[gate]} Just a handful of gate types, wired together
        in the right pattern, can carry out any computation at all — including arithmetic.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The Half Adder: gates that add (the payoff)
// ══════════════════════════════════════════════════════════════════
function HalfAdderWidget() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const sum = a ^ b;
  const carry = a & b;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Binary addition has one tricky rule: <span style={{ fontFamily: "monospace", color: C.text }}>1 + 1 = 10</span>
        {" "}— a sum of 0 and a carry of 1. Compare the addition rules to two gates you just met:
        <strong style={{ color: C.text }}> XOR gives the sum, AND gives the carry.</strong> That circuit is a
        half adder. Set A and B and watch.
      </p>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Bit A</div>
          <BitToggle value={a} onClick={() => setA(a ? 0 : 1)} color={C.teal} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Bit B</div>
          <BitToggle value={b} onClick={() => setB(b ? 0 : 1)} color={C.teal} />
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px 4px" }}>
        <svg viewBox="0 0 340 210" style={{ width: "100%", maxWidth: 400, display: "block", margin: "0 auto" }}>
          {/* ── wires: A (teal when 1) branches to XOR + AND; B likewise ── */}
          {/* A into XOR top input, and down to AND top input */}
          <polyline points="42,60 150,60" fill="none" stroke={a ? C.teal : C.border} strokeWidth={4} strokeLinecap="round" />
          <polyline points="78,60 78,120 150,120" fill="none" stroke={a ? C.teal : C.border} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={78} cy={60} r={4} fill={a ? C.teal : C.border} />
          {/* B into AND bottom input, and up to XOR bottom input */}
          <polyline points="42,150 150,150" fill="none" stroke={b ? C.teal : C.border} strokeWidth={4} strokeLinecap="round" />
          <polyline points="108,150 108,85 150,85" fill="none" stroke={b ? C.teal : C.border} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={108} cy={150} r={4} fill={b ? C.teal : C.border} />

          {/* ── XOR gate (→ SUM) ── */}
          <path d="M150,47 Q192,47 214,72 Q192,97 150,97 Q166,72 150,47 Z" fill={C.card} stroke={C.accent} strokeWidth={2} />
          <path d="M143,47 Q159,72 143,97" fill="none" stroke={C.accent} strokeWidth={2} />
          <text x={180} y={77} fill={C.accent} fontSize={12} fontWeight="700" textAnchor="middle">XOR</text>
          {/* ── AND gate (→ CARRY) ── */}
          <path d="M150,112 H180 A25,25 0 0 1 180,162 H150 Z" fill={C.card} stroke={C.orange} strokeWidth={2} />
          <text x={172} y={142} fill={C.orange} fontSize={12} fontWeight="700" textAnchor="middle">AND</text>

          {/* ── output wires ── */}
          <polyline points="214,72 296,72" fill="none" stroke={sum ? C.green : C.border} strokeWidth={4} strokeLinecap="round" />
          <polyline points="205,137 296,137" fill="none" stroke={carry ? C.green : C.border} strokeWidth={4} strokeLinecap="round" />

          {/* ── bit labels flowing into the gates ── */}
          <text x={128} y={54} fill={a ? C.teal : C.muted} fontSize={12} fontWeight="700" textAnchor="middle">{a}</text>
          <text x={132} y={79} fill={b ? C.teal : C.muted} fontSize={12} fontWeight="700" textAnchor="middle">{b}</text>
          <text x={128} y={114} fill={a ? C.teal : C.muted} fontSize={12} fontWeight="700" textAnchor="middle">{a}</text>
          <text x={128} y={144} fill={b ? C.teal : C.muted} fontSize={12} fontWeight="700" textAnchor="middle">{b}</text>

          {/* ── input nodes ── */}
          <text x={28} y={40} fill={C.muted} fontSize={11} fontWeight="700" textAnchor="middle">A</text>
          <circle cx={28} cy={60} r={13} fill={a ? C.teal + "33" : C.card} stroke={a ? C.teal : C.border} strokeWidth={2} />
          <text x={28} y={65} fill={a ? C.teal : C.muted} fontSize={14} fontWeight="800" textAnchor="middle">{a}</text>
          <text x={28} y={130} fill={C.muted} fontSize={11} fontWeight="700" textAnchor="middle">B</text>
          <circle cx={28} cy={150} r={13} fill={b ? C.teal + "33" : C.card} stroke={b ? C.teal : C.border} strokeWidth={2} />
          <text x={28} y={155} fill={b ? C.teal : C.muted} fontSize={14} fontWeight="800" textAnchor="middle">{b}</text>

          {/* ── output nodes ── */}
          <circle cx={314} cy={72} r={15} fill={sum ? C.green + "33" : C.card} stroke={sum ? C.green : C.border} strokeWidth={2.5} />
          <text x={314} y={77} fill={sum ? C.green : C.muted} fontSize={15} fontWeight="800" textAnchor="middle">{sum}</text>
          <text x={314} y={100} fill={C.accent} fontSize={10} fontWeight="700" textAnchor="middle">SUM</text>
          <circle cx={314} cy={137} r={15} fill={carry ? C.green + "33" : C.card} stroke={carry ? C.green : C.border} strokeWidth={2.5} />
          <text x={314} y={142} fill={carry ? C.green : C.muted} fontSize={15} fontWeight="800" textAnchor="middle">{carry}</text>
          <text x={314} y={165} fill={C.orange} fontSize={10} fontWeight="700" textAnchor="middle">CARRY</text>
        </svg>
        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", paddingBottom: 4 }}>
          Green wire = carrying a 1 · gray = carrying a 0 &nbsp;|&nbsp; Sum = A ⊕ B &nbsp; Carry = A · B
        </div>
      </div>

      <div style={{ marginTop: 12, background: C.green + "14", border: `1px solid ${C.green}44`, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 15, color: C.green, fontWeight: 700 }}>
          {a} + {b} = {carry}{sum}<span style={{ color: C.muted }}> (carry {carry}, sum {sum})</span>
        </span>
        {a === 1 && b === 1 && (
          <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>
            1 + 1 = 10: the sum bit is 0 and the carry 1 spills into the next column — exactly what the AND gate produced.
          </div>
        )}
      </div>

      <Key color={C.green}>
        Two gates just did arithmetic — no "add" instruction anywhere, only logic. Chain a slightly
        bigger version (a <em>full adder</em>) four, thirty-two, or sixty-four times and you have the
        adder inside a real CPU. We build exactly that in Module 2's ALU.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — The Full Adder: two half adders + an OR (takes carry-in)
// ══════════════════════════════════════════════════════════════════
function FullAdderWidget() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [cin, setCin] = useState(1);
  const s1 = a ^ b, c1 = a & b;   // half adder 1
  const sum = s1 ^ cin, c2 = s1 & cin;   // half adder 2
  const cout = c1 | c2;
  const wire = (v) => (v ? C.teal : C.border);
  const owire = (v) => (v ? C.green : C.border);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A half adder can't accept a carry coming <em>in</em> from the column on its right — but real
        addition needs that. Chain <strong style={{ color: C.text }}>two half adders + one OR</strong> and
        you get a <strong style={{ color: C.text }}>full adder</strong>: three inputs (A, B, Carry-in), two
        outputs (Sum, Carry-out). Flip all three and watch the carry ripple.
      </p>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 16 }}>
        {[["A", a, setA], ["B", b, setB], ["Cin", cin, setCin]].map(([lab, v, set]) => (
          <div key={lab} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{lab}</div>
            <BitToggle value={v} onClick={() => set(v ? 0 : 1)} color={C.teal} />
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px 4px" }}>
        <svg viewBox="0 0 360 230" style={{ width: "100%", maxWidth: 420, display: "block", margin: "0 auto" }}>
          {/* inputs A, B into Half Adder 1; Cin routed round to Half Adder 2 */}
          <text x={18} y={52} fill={a ? C.teal : C.muted} fontSize={13} fontWeight="800" textAnchor="middle">A</text>
          <polyline points="30,48 92,48" fill="none" stroke={wire(a)} strokeWidth={4} strokeLinecap="round" />
          <text x={18} y={72} fill={b ? C.teal : C.muted} fontSize={13} fontWeight="800" textAnchor="middle">B</text>
          <polyline points="30,68 92,68" fill="none" stroke={wire(b)} strokeWidth={4} strokeLinecap="round" />
          <text x={16} y={196} fill={cin ? C.teal : C.muted} fontSize={13} fontWeight="800" textAnchor="middle">Cin</text>
          <polyline points="34,192 200,192 200,74 212,74" fill="none" stroke={wire(cin)} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />

          {/* Half Adder 1 */}
          <rect x={92} y={30} width={78} height={58} rx={8} fill={C.card} stroke={C.accent} strokeWidth={2} />
          <text x={131} y={54} fill={C.accent} fontSize={11} fontWeight="700" textAnchor="middle">Half</text>
          <text x={131} y={68} fill={C.accent} fontSize={11} fontWeight="700" textAnchor="middle">Adder 1</text>

          {/* HA1 outputs, labelled: Sum1 feeds HA2's top input; Cout1 drops into the OR gate */}
          <polyline points="170,46 212,46" fill="none" stroke={wire(s1)} strokeWidth={4} strokeLinecap="round" />
          <text x={191} y={40} fill={s1 ? C.teal : C.muted} fontSize={11} fontWeight="700" textAnchor="middle">Sum1</text>
          <polyline points="170,74 170,162 250,162" fill="none" stroke={wire(c1)} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <text x={148} y={116} fill={c1 ? C.teal : C.muted} fontSize={11} fontWeight="700" textAnchor="middle">Cout1</text>

          {/* Half Adder 2 */}
          <rect x={212} y={30} width={78} height={58} rx={8} fill={C.card} stroke={C.accent} strokeWidth={2} />
          <text x={251} y={54} fill={C.accent} fontSize={11} fontWeight="700" textAnchor="middle">Half</text>
          <text x={251} y={68} fill={C.accent} fontSize={11} fontWeight="700" textAnchor="middle">Adder 2</text>

          {/* Sum output ; Cout2 routes down and into the OR gate's second input */}
          <polyline points="290,46 320,46" fill="none" stroke={owire(sum)} strokeWidth={4} strokeLinecap="round" />
          <polyline points="290,74 310,74 310,194 250,194" fill="none" stroke={wire(c2)} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          <text x={324} y={116} fill={c2 ? C.teal : C.muted} fontSize={11} fontWeight="700" textAnchor="middle">Cout2</text>

          {/* OR gate: Cout1 (top input) OR Cout2 (bottom input) = the final Carry-out */}
          <path d="M250,162 Q276,162 292,178 Q276,194 250,194 Q260,178 250,162 Z" fill={C.card} stroke={C.orange} strokeWidth={2} />
          <text x={265} y={182} fill={C.orange} fontSize={10} fontWeight="700" textAnchor="middle">OR</text>
          <polyline points="292,178 320,178" fill="none" stroke={owire(cout)} strokeWidth={4} strokeLinecap="round" />

          {/* output nodes */}
          <text x={334} y={30} fill={C.accent} fontSize={9} fontWeight="700" textAnchor="middle">SUM</text>
          <circle cx={334} cy={46} r={14} fill={sum ? C.green + "33" : C.card} stroke={sum ? C.green : C.border} strokeWidth={2.5} />
          <text x={334} y={51} fill={sum ? C.green : C.muted} fontSize={14} fontWeight="800" textAnchor="middle">{sum}</text>
          <circle cx={334} cy={178} r={14} fill={cout ? C.green + "33" : C.card} stroke={cout ? C.green : C.border} strokeWidth={2.5} />
          <text x={334} y={183} fill={cout ? C.green : C.muted} fontSize={14} fontWeight="800" textAnchor="middle">{cout}</text>
          <text x={334} y={205} fill={C.orange} fontSize={9} fontWeight="700" textAnchor="middle">COUT</text>
        </svg>
        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", paddingBottom: 4 }}>
          Sum = A ⊕ B ⊕ Cin &nbsp;|&nbsp; Cout = (A·B) + (S1·Cin) — the two carries OR-ed together
        </div>
      </div>

      <div style={{ marginTop: 12, background: C.green + "14", border: `1px solid ${C.green}44`, borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
        <span style={{ fontFamily: "monospace", fontSize: 15, color: C.green, fontWeight: 700 }}>
          {a} + {b} + {cin} = {cout}{sum}<span style={{ color: C.muted }}> (carry-out {cout}, sum {sum})</span>
        </span>
      </div>

      <Key color={C.green}>
        The carry-out of one full adder feeds the carry-in of the next. Wire 32 (or 64) in a row and you
        have the <strong style={{ color: C.text }}>ripple-carry adder</strong> inside a real CPU's ALU —
        which we build in Module 2. Same two gates, all the way up.
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
      q: "Four switches are set to 1011. What decimal value is that? (weights 8 4 2 1)",
      options: ["7", "11", "13", "9"],
      answer: 1,
      explain: "1011 = 8 + 0 + 2 + 1 = 11. Each 1 adds its column's weight.",
    },
    {
      q: "Shannon showed an AND operation is built by wiring two switches how?",
      options: [
        "In parallel — either one lets current through",
        "In series — both must close for current to flow",
        "With a normally-closed contact",
        "Through an amplifier",
      ],
      answer: 1,
      explain: "AND = switches in series: the current has to pass through both, so both must be ON. (Parallel gives OR.)",
    },
    {
      q: "What does an XOR gate output when both inputs are 1?",
      options: ["1", "0", "2", "It is undefined"],
      answer: 1,
      explain: "XOR is 1 only when the inputs DIFFER. Two 1s are the same, so the output is 0 — which is exactly the sum bit when you add 1 + 1.",
    },
    {
      q: "In a half adder, which gates produce the sum and the carry?",
      options: [
        "AND for sum, OR for carry",
        "OR for sum, NOT for carry",
        "XOR for sum, AND for carry",
        "NOT for sum, XOR for carry",
      ],
      answer: 2,
      explain: "Sum = A XOR B (1 when they differ) and Carry = A AND B (1 only when both are 1) — matching the binary-addition columns exactly.",
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
          {score === 4 ? "Excellent — you can trace a number all the way down to switches and back."
            : score >= 2 ? "Nice work. Replay the Gates or Half Adder tab to firm up the truth tables."
              : "Give it another pass — the Gates and Half Adder tabs are worth a second look."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55`, textAlign: "left" }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 0.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now go from a light switch to a bit, from bits to binary numbers, from Boolean
            logic to real gates, and from gates to a circuit that adds.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 0.3 — The Von Neumann Model.</strong>{" "}
            We zoom back out: how memory, the ALU you just glimpsed, control, and I/O snap together
            into the single architecture behind every machine in this course.
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  return (
    <div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>Question {current + 1} of {questions.length}</div>
      <div style={{ color: C.text, fontWeight: 600, fontSize: 15, marginBottom: 16, fontFamily: q.q.includes("1011") ? "monospace" : "inherit" }}>{q.q}</div>
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
export default function Unit0_2({ student, onUnitComplete }) {
  const sections = [
    { id: "switch", label: "Switch & Bit" },
    { id: "shannon", label: "Shannon's Bridge" },
    { id: "gates", label: "Logic Gates" },
    { id: "adder", label: "The Half Adder" },
    { id: "fulladder", label: "The Full Adder" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>It all comes down to a switch</h3><SwitchWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Logic is just wiring</h3><ShannonWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The four building blocks</h3><GateWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Gates that add</h3><HalfAdderWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Adding with a carry-in</h3><FullAdderWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 0.2.</p>
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💡</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 0 › UNIT 0.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Bits &amp; Boolean Logic</div>
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
