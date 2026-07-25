// Unit1_3.jsx — Module 1 › Unit 1.3 — "Bus Structures"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: wire explosion (why we need a shared path) → single-bus (take turns) →
// more buses (parallelism vs cost) → the three buses by job → quiz.
// Scaffolds on Unit 1.1 (five functional units) — now we wire them together.
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
//  Section 1 — Wire Explosion (the NEED: why not a private wire per pair?)
// ══════════════════════════════════════════════════════════════════
function WireExplosion() {
  const [n, setN] = useState(5);
  const [shared, setShared] = useState(false);

  const names = ["Input", "ALU", "Control", "Memory", "Output", "Reg A", "Reg B", "Reg C"];
  const units = names.slice(0, n);

  // point-to-point: every pair needs its own link  → n(n-1)/2
  const p2p = (n * (n - 1)) / 2;

  // lay the units around a circle so the wires are easy to see
  const cx = 190, cy = 150, R = 110;
  const pos = units.map((_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) };
  });

  const busY = cy; // horizontal shared line

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In Unit 1.1 you met the five units. They must swap data <em>constantly</em>. The lazy first idea:
        run a private wire between every pair. Drag the slider and watch how fast that gets out of hand —
        then flip to <strong style={{ color: C.green }}>one shared bus</strong>.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <label style={{ color: C.muted, fontSize: 12 }}>Units: <strong style={{ color: C.text }}>{n}</strong></label>
        <input type="range" min={3} max={8} value={n} onChange={(e) => setN(+e.target.value)} style={{ flex: 1, minWidth: 140, accentColor: C.accent }} />
        <button onClick={() => setShared((s) => !s)} style={{
          padding: "7px 14px", borderRadius: 7, border: `1px solid ${shared ? C.green : C.border}`,
          background: shared ? C.green + "22" : "transparent", color: shared ? C.green : C.muted,
          cursor: "pointer", fontSize: 12, fontWeight: 600,
        }}>{shared ? "◉ Shared bus" : "○ Point-to-point"}</button>
      </div>

      <svg viewBox="0 0 380 300" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
        {shared ? (
          <>
            {/* one horizontal highway, each unit taps in with a short stub */}
            <line x1={40} y1={busY} x2={340} y2={busY} stroke={C.green} strokeWidth={5} strokeLinecap="round" />
            {units.map((u, i) => {
              const x = 55 + (i * 270) / Math.max(1, n - 1);
              const up = i % 2 === 0;
              const uy = up ? busY - 55 : busY + 55;
              return (
                <g key={i}>
                  <line x1={x} y1={busY} x2={x} y2={uy} stroke={C.green} strokeWidth={2} />
                  <rect x={x - 26} y={uy - 15} width={52} height={30} rx={6} fill={C.card} stroke={C.green} />
                  <text x={x} y={uy + 4} fontSize={9} fill={C.text} textAnchor="middle">{u}</text>
                </g>
              );
            })}
          </>
        ) : (
          <>
            {/* draw a line for every pair */}
            {pos.map((a, i) => pos.slice(i + 1).map((b, j) => (
              <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.red} strokeWidth={1.4} opacity={0.6} />
            )))}
            {pos.map((p, i) => (
              <g key={i}>
                <rect x={p.x - 26} y={p.y - 14} width={52} height={28} rx={6} fill={C.card} stroke={C.orange} />
                <text x={p.x} y={p.y + 4} fontSize={9} fill={C.text} textAnchor="middle">{units[i]}</text>
              </g>
            ))}
          </>
        )}
      </svg>

      <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 150, padding: "12px 14px", borderRadius: 8, background: C.red + "14", border: `1px solid ${C.red}44` }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 13 }}>Point-to-point</div>
          <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>{p2p} wires</div>
          <div style={{ color: C.muted, fontSize: 11 }}>= n(n−1)/2 — grows like n²</div>
        </div>
        <div style={{ flex: 1, minWidth: 150, padding: "12px 14px", borderRadius: 8, background: C.green + "14", border: `1px solid ${C.green}44` }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>Shared bus</div>
          <div style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>{n} taps</div>
          <div style={{ color: C.muted, fontSize: 11 }}>one line, each unit taps in — grows like n</div>
        </div>
      </div>

      <Key>
        A <strong style={{ color: C.text }}>bus</strong> is just a shared set of wires that many units take turns using.
        Private wires per pair explode as n²; one shared bus grows only as n. We trade a little speed
        (they must take turns) for a massive win in simplicity and cost.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Single-Bus Organisation (one highway, take turns)
// ══════════════════════════════════════════════════════════════════
function SingleBus() {
  const devices = ["R0", "R1", "R2", "Memory", "ALU"];
  const [src, setSrc] = useState(null);
  const [dst, setDst] = useState(null);

  const pick = (i) => {
    if (src === null) { setSrc(i); return; }
    if (i === src) { setSrc(null); return; }
    setDst(i);
  };
  const reset = () => { setSrc(null); setDst(null); };

  const busActive = src !== null;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here every unit hangs off <strong style={{ color: C.accent }}>one</strong> bus. Click a <strong>source</strong>
        (who puts data on the bus), then a <strong>destination</strong> (who reads it). Only one source may drive the
        bus at a time — the others stay disconnected via <em>tri-state buffers</em>.
      </p>

      <svg viewBox="0 0 380 210" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
        {/* the single shared bus */}
        <line x1={30} y1={105} x2={350} y2={105} stroke={busActive ? C.accent : C.muted} strokeWidth={6} strokeLinecap="round" />
        <text x={190} y={98} fontSize={10} fill={busActive ? C.accent : C.muted} textAnchor="middle">SINGLE COMMON BUS</text>

        {devices.map((d, i) => {
          const x = 45 + (i * 290) / (devices.length - 1);
          const up = i % 2 === 0;
          const uy = up ? 45 : 165;
          const isSrc = i === src, isDst = i === dst;
          const col = isSrc ? C.green : isDst ? C.teal : C.border;
          return (
            <g key={i} onClick={() => pick(i)} style={{ cursor: "pointer" }}>
              <line x1={x} y1={105} x2={x} y2={up ? uy + 16 : uy - 16} stroke={isSrc || isDst ? col : C.muted} strokeWidth={2} />
              {/* animated data packet travelling source → bus → dest */}
              {isSrc && dst !== null && (
                <circle r={4} fill={C.green}>
                  <animate attributeName="cy" values={`${up ? uy + 16 : uy - 16};105`} dur="0.6s" repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${x};${x}`} dur="0.6s" repeatCount="indefinite" />
                </circle>
              )}
              <rect x={x - 30} y={uy - 16} width={60} height={32} rx={7} fill={C.card} stroke={col} strokeWidth={isSrc || isDst ? 2 : 1} />
              <text x={x} y={uy - 2} fontSize={10} fill={C.text} textAnchor="middle">{d}</text>
              <text x={x} y={uy + 11} fontSize={8} fill={col} textAnchor="middle">{isSrc ? "SOURCE" : isDst ? "DEST" : ""}</text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, minHeight: 46 }}>
        {src === null ? (
          <span style={{ color: C.muted, fontSize: 13 }}>Click a unit to make it the source…</span>
        ) : dst === null ? (
          <span style={{ color: C.green, fontSize: 13 }}><strong>{devices[src]}</strong> is driving the bus. Now click a destination.</span>
        ) : (
          <span style={{ color: C.text, fontSize: 14 }}>
            <strong style={{ color: C.green }}>{devices[src]}</strong> → bus →
            <strong style={{ color: C.teal }}> {devices[dst]}</strong>. One transfer, one bus cycle.
            <span style={{ color: C.yellow }}> Everyone else had to wait.</span>
          </span>
        )}
      </div>
      <button onClick={reset} style={{ marginTop: 10, padding: "6px 14px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 12 }}>↺ Reset</button>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 150, padding: "10px 12px", borderRadius: 8, background: C.green + "12", border: `1px solid ${C.green}33` }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>✔ Advantages</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Fewest wires, cheapest, easy to add a new device — just tap the same line.</div>
        </div>
        <div style={{ flex: 1, minWidth: 150, padding: "10px 12px", borderRadius: 8, background: C.red + "12", border: `1px solid ${C.red}33` }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>✘ Disadvantage</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Only <strong>one</strong> transfer at a time — the bus is a bottleneck. Everything happens in single file.</div>
        </div>
      </div>

      <Key color={C.accent}>
        Single-bus = one shared highway. A <strong style={{ color: C.text }}>tri-state buffer</strong> lets exactly one
        source drive the line while the rest float disconnected — so the wires are never fought over.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — More Buses (parallelism vs cost)
// ══════════════════════════════════════════════════════════════════
function MultiBus() {
  const [buses, setBuses] = useState(1);

  // The job: R3 ← R1 + R2. Move two operands IN, one result OUT.
  // 1 bus  → 3 sequential steps.  2 buses → 2 steps.  3 buses → 1 step.
  const steps = buses === 1 ? 3 : buses === 2 ? 2 : 1;
  const labels = {
    1: "Single bus: send R1, then R2, then write R3 back — three trips down the one lane.",
    2: "Two buses: two operands can move at once; the result still needs its own trip.",
    3: "Three buses (A, B, C): both operands reach the ALU AND the result returns — all in one step.",
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The ALU is greedy: to compute <code style={{ color: C.teal }}>R3 ← R1 + R2</code> it wants <strong>two</strong>
        operands in and <strong>one</strong> result out. On one bus that is three separate trips. Add buses and watch
        the trips collapse.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[1, 2, 3].map((b) => (
          <button key={b} onClick={() => setBuses(b)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: `1px solid ${buses === b ? C.accent : C.border}`,
            background: buses === b ? C.accentGlow : "transparent",
            color: buses === b ? "#fff" : C.muted,
          }}>{b} bus{b > 1 ? "es" : ""}</button>
        ))}
      </div>

      <svg viewBox="0 0 380 180" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
        {/* register file on the left, ALU on the right, N buses between */}
        <rect x={20} y={40} width={70} height={100} rx={8} fill={C.card} stroke={C.purple} />
        <text x={55} y={30} fontSize={10} fill={C.purple} textAnchor="middle">Registers</text>
        <text x={55} y={70} fontSize={11} fill={C.text} textAnchor="middle">R1</text>
        <text x={55} y={95} fontSize={11} fill={C.text} textAnchor="middle">R2</text>
        <text x={55} y={120} fontSize={11} fill={C.text} textAnchor="middle">R3</text>

        <rect x={290} y={55} width={70} height={70} rx={8} fill={C.card} stroke={C.orange} />
        <text x={325} y={95} fontSize={12} fill={C.orange} textAnchor="middle">ALU</text>

        {Array.from({ length: buses }).map((_, i) => {
          const y = 55 + (i * 70) / Math.max(1, buses - 1 || 1);
          const isC = buses === 3 && i === 2; // Bus C carries the result back
          const col = isC ? C.green : C.accent;
          return (
            <g key={i}>
              <line x1={90} y1={y} x2={290} y2={y} stroke={col} strokeWidth={4} strokeLinecap="round" />
              <text x={190} y={y - 6} fontSize={9} fill={col} textAnchor="middle">
                Bus {String.fromCharCode(65 + i)}{isC ? " (result →)" : " (operand →)"}
              </text>
              <circle r={4} fill={col}>
                <animate attributeName="cx" values={isC ? "290;90" : "90;290"} dur="1s" repeatCount="indefinite" />
                <animate attributeName="cy" values={`${y};${y}`} dur="1s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "stretch", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 130, padding: "12px 14px", borderRadius: 8, background: C.accent + "14", border: `1px solid ${C.accent}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Steps to do R3 ← R1 + R2</div>
          <div style={{ color: C.text, fontSize: 30, fontWeight: 800 }}>{steps}</div>
        </div>
        <div style={{ flex: 2, minWidth: 180, padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.6, display: "flex", alignItems: "center" }}>
          {labels[buses]}
        </div>
      </div>

      <Key>
        More buses = more transfers in parallel = fewer steps per instruction = faster. But each bus is
        real copper, real multiplexers, real chip area. Designers pick the number of buses to balance
        <strong style={{ color: C.text }}> speed against cost</strong> — you'll meet a 3-bus datapath again in Module 2.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Three Buses by Job (address / data / control)
// ══════════════════════════════════════════════════════════════════
function ThreeBuses() {
  const [pick, setPick] = useState("addr");

  const info = {
    addr: {
      name: "Address bus", color: C.accent, dir: "One-way  (CPU → memory)",
      body: "Carries WHICH location the CPU wants. Its width sets how many locations you can name: a 32-bit address bus can point at 2³² bytes = 4 GB. The CPU always drives it; memory only listens.",
    },
    data: {
      name: "Data bus", color: C.teal, dir: "Two-way  (CPU ↔ memory)",
      body: "Carries the actual value being read or written. Its width is usually one word — a 32-bit data bus moves 32 bits per transfer. On a Read data flows in; on a Write it flows out.",
    },
    ctrl: {
      name: "Control bus", color: C.orange, dir: "Signals both ways",
      body: "Carries the timing and command lines that say WHAT to do and WHEN: the Read/Write line, clock, and ready signals. Without it, address and data are just numbers with no instruction to act.",
    },
  };
  const cur = info[pick];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        What we casually call "the system bus" is really <strong>three</strong> buses bundled together, each with one
        job. Click each to see what rides on it.
      </p>

      <svg viewBox="0 0 380 150" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 12 }}>
        <rect x={20} y={55} width={70} height={40} rx={8} fill={C.card} stroke={C.purple} />
        <text x={55} y={80} fontSize={12} fill={C.text} textAnchor="middle">CPU</text>
        <rect x={290} y={55} width={70} height={40} rx={8} fill={C.card} stroke={C.purple} />
        <text x={325} y={80} fontSize={11} fill={C.text} textAnchor="middle">Memory</text>

        {[["addr", 40], ["data", 75], ["ctrl", 110]].map(([k, y]) => {
          const on = pick === k;
          return (
            <g key={k} onClick={() => setPick(k)} style={{ cursor: "pointer" }}>
              <line x1={90} y1={y} x2={290} y2={y} stroke={on ? info[k].color : C.border} strokeWidth={on ? 6 : 3} strokeLinecap="round" />
              <text x={190} y={y - 6} fontSize={9} fill={on ? info[k].color : C.muted} textAnchor="middle">{info[k].name}</text>
              {on && (
                <circle r={4} fill={info[k].color}>
                  <animate attributeName="cx" values={k === "data" ? "90;290;90" : k === "ctrl" ? "90;290;90" : "90;290"} dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${y};${y}`} dur="1.2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {Object.keys(info).map((k) => (
          <button key={k} onClick={() => setPick(k)} style={{
            flex: 1, padding: "8px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
            border: `1px solid ${pick === k ? info[k].color : C.border}`,
            background: pick === k ? info[k].color + "22" : "transparent",
            color: pick === k ? info[k].color : C.muted,
          }}>{info[k].name}</button>
        ))}
      </div>

      <div style={{ padding: "14px 16px", borderRadius: 10, background: cur.color + "12", border: `1px solid ${cur.color}44` }}>
        <div style={{ color: cur.color, fontWeight: 700, fontSize: 15 }}>{cur.name}</div>
        <div style={{ color: C.text, fontSize: 12, margin: "4px 0 8px", fontFamily: "monospace" }}>{cur.dir}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{cur.body}</div>
      </div>

      <Key color={C.orange}>
        Address = <em>where</em>, Data = <em>what</em>, Control = <em>when / which operation</em>. Every memory access in
        this course rides these three together — remember the trio when we do Load and Store in Unit 1.5.
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
      q: "Why does a single shared bus beat a private wire between every pair of units?",
      options: [
        "A bus is faster for every possible transfer",
        "Private wires grow as n² while a bus grows as n — far fewer wires and easy to extend",
        "A bus lets every unit transfer at the same time",
        "Private wires cannot carry binary data",
      ],
      answer: 1,
      explain: "n units need n(n−1)/2 private links (grows like n²). One shared bus needs just n taps. The trade-off: units must take turns on the bus.",
    },
    {
      q: "On a single common bus, how many transfers can happen at once?",
      options: [
        "As many as there are devices",
        "Exactly one — the bus is a single-file bottleneck",
        "Two: one read and one write",
        "It depends on the clock speed",
      ],
      answer: 1,
      explain: "Only one source may drive the bus per cycle (the rest are held off by tri-state buffers). That single-transfer-at-a-time limit is the single bus's main weakness.",
    },
    {
      q: "To compute R3 ← R1 + R2 in ONE step, how many buses does the datapath need?",
      options: ["One bus", "Two buses", "Three buses (A, B and C)", "It can never be done in one step"],
      answer: 2,
      explain: "Two operands must reach the ALU and the result must return — three simultaneous transfers, so three buses. This is exactly the multiple-bus organisation you'll build in Module 2.",
    },
    {
      q: "In the address / data / control split, which bus carries WHICH memory location the CPU wants?",
      options: [
        "The data bus",
        "The control bus",
        "The address bus — and its width sets how many locations can be named",
        "All three share that job equally",
      ],
      answer: 2,
      explain: "Address = where, Data = what, Control = when/which-operation. A wider address bus can name more locations (32 bits → 2³² addresses).",
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
          {score === 4 ? "Perfect! You can see the whole machine wired together now." :
            score >= 2 ? "Good work! Replay 'More Buses' — watch how the step count drops as buses are added." :
              "Revisit 'Wire Explosion' and 'Single Bus' — get the n² vs n idea solid, then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 1.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            The five units now share one highway — and you know why one bus is cheap-but-slow, why more buses
            buy parallelism, and how address, data and control split the work.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 1.4 — Memory Locations &amp; Addresses.</strong>{" "}
            The data bus moves a "word" — but what exactly IS a word, and how does every byte get its own address?
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
//  Main — header, progress bar, tab strip, content card, continue btn
// ══════════════════════════════════════════════════════════════════
export default function Unit1_3({ student, onUnitComplete }) {
  const sections = [
    { id: "wires", label: "Wire Explosion" },
    { id: "single", label: "Single Bus" },
    { id: "multi", label: "More Buses" },
    { id: "three", label: "Address/Data/Control" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🕸️ Wire Explosion — why share at all?</h3>
      <WireExplosion />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛣️ Single-Bus Organisation — one highway, take turns</h3>
      <SingleBus />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🚦 More Buses — buy speed with parallelism</h3>
      <MultiBus />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎯 One Bus, Three Jobs — address, data, control</h3>
      <ThreeBuses />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 1.3.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛣️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Bus Structures</div>
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
