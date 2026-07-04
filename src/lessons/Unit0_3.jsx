// Unit0_3.jsx — Module 0 › Unit 0.3 — "From Relays to Transistors"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Story arc: build a gate from RELAYS → the problem → from VACUUM TUBES →
// the problem → the timeline of progress → the TRANSISTOR (celebrated) →
// how transistors transformed MEMORY (magnetic cores → transistor cells).
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

function Problem({ children }) {
  return (
    <div style={{ marginTop: 14, background: C.red + "12", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "12px 16px" }}>
      <div style={{ color: C.red, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚠️ The problem</div>
      <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Gates from Relays
// ══════════════════════════════════════════════════════════════════
function RelayGateWidget() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const lit = a && b; // AND = two relays in series
  const ON = C.green, OFF = C.border;

  // one relay: contacts at (x1,y)-(x2,y); coil below; energized => armature closes
  const Relay = ({ x1, x2, y, energized, label }) => (
    <g>
      {/* contacts */}
      <circle cx={x1} cy={y} r={4} fill={C.muted} />
      <circle cx={x2} cy={y} r={4} fill={C.muted} />
      {/* armature: closed bridges the gap; open lifts up */}
      {energized
        ? <line x1={x1} y1={y} x2={x2} y2={y} stroke={ON} strokeWidth={4} strokeLinecap="round" />
        : <line x1={x1} y1={y} x2={x2 - 6} y2={y - 15} stroke={C.muted} strokeWidth={4} strokeLinecap="round" />}
      {/* coil driven by the input */}
      <rect x={(x1 + x2) / 2 - 13} y={y + 20} width={26} height={16} rx={3} fill={energized ? C.yellow + "33" : C.card} stroke={energized ? C.yellow : C.border} strokeWidth={1.5} />
      <text x={(x1 + x2) / 2} y={y + 32} fill={energized ? C.yellow : C.muted} fontSize={9} fontWeight="700" textAnchor="middle">coil</text>
      {/* magnetic pull when energized */}
      {energized && <line x1={(x1 + x2) / 2} y1={y + 4} x2={(x1 + x2) / 2} y2={y + 19} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="2 2" />}
      <text x={(x1 + x2) / 2} y={y - 22} fill={energized ? ON : C.muted} fontSize={12} fontWeight="700" textAnchor="middle">{label}</text>
    </g>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A gate needs a controllable switch. The first electrical one was the <strong style={{ color: C.text }}>relay</strong>:
        a small current energises a coil, the coil's magnet pulls a metal arm shut, and that closes the
        circuit. Two relays in series make an <strong style={{ color: C.text }}>AND</strong> gate. Toggle the inputs.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setA(v => !v)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${a ? C.green : C.border}`, background: a ? C.green + "22" : C.card, color: a ? C.green : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Input A = {a ? 1 : 0}</button>
        <button onClick={() => setB(v => !v)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${b ? C.green : C.border}`, background: b ? C.green + "22" : C.card, color: b ? C.green : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Input B = {b ? 1 : 0}</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px" }}>
        <svg viewBox="0 0 320 150" style={{ width: "100%", maxWidth: 380, display: "block", margin: "0 auto" }}>
          <circle cx={22} cy={70} r={13} fill={C.card} stroke={C.yellow} strokeWidth={2} />
          <text x={22} y={74} fill={C.yellow} fontSize={11} fontWeight="700" textAnchor="middle">V+</text>
          <line x1={35} y1={70} x2={60} y2={70} stroke={ON} strokeWidth={4} strokeLinecap="round" />
          <Relay x1={60} x2={110} y={70} energized={a} label="Relay A" />
          <line x1={110} y1={70} x2={160} y2={70} stroke={a ? ON : OFF} strokeWidth={4} strokeLinecap="round" />
          <Relay x1={160} x2={210} y={70} energized={b} label="Relay B" />
          <line x1={210} y1={70} x2={270} y2={70} stroke={lit ? ON : OFF} strokeWidth={4} strokeLinecap="round" />
          <circle cx={288} cy={70} r={17} fill={lit ? ON + "44" : C.bg} stroke={lit ? ON : C.border} strokeWidth={3} style={{ filter: lit ? `drop-shadow(0 0 6px ${ON})` : "none" }} />
          <text x={288} y={76} fontSize={16} textAnchor="middle">💡</text>
        </svg>
        <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: lit ? ON : C.muted, paddingBottom: 4 }}>
          {a ? 1 : 0} AND {b ? 1 : 0} = {lit ? 1 : 0}
        </div>
      </div>

      <Problem>
        The arm is a moving metal part. It's <strong style={{ color: C.text }}>slow</strong> (~10&nbsp;ms per
        switch → only ~1,000 operations/second), <strong style={{ color: C.text }}>noisy</strong> (a constant
        clicking you can hear), it <strong style={{ color: C.text }}>wears out</strong> and it
        <strong style={{ color: C.text }}> sparks</strong>. Zuse's Z3 (1941) used 2,000 of them.
      </Problem>

      <Key color={C.green}>
        Relays proved Boolean logic can be built as real hardware — but anything with moving metal parts
        is too slow and fragile to scale up.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Gates from Vacuum Tubes
// ══════════════════════════════════════════════════════════════════
function TubeGateWidget() {
  const [on, setOn] = useState(false);

  return (
    <div>
      <style>{`@keyframes riseE { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-46px); opacity: 0; } }`}</style>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The next switch had <strong style={{ color: C.text }}>no moving parts</strong>. A vacuum tube heats a
        cathode so it sprays electrons; a control <strong style={{ color: C.text }}>grid</strong> decides
        whether they reach the plate. Grid on → current flows (1); grid off → blocked (0). Switching now
        happens at the speed of electrons.
      </p>

      <button onClick={() => setOn(v => !v)} style={{ width: "100%", padding: "9px", borderRadius: 8, border: `2px solid ${on ? C.yellow : C.border}`, background: on ? C.yellow + "22" : C.card, color: on ? C.yellow : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 12 }}>
        Grid voltage: {on ? "POSITIVE → tube conducts (ON, 1)" : "negative → electrons blocked (OFF, 0)"}
      </button>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px" }}>
        <svg viewBox="0 0 260 180" style={{ width: "100%", maxWidth: 300, display: "block", margin: "0 auto" }}>
          {/* glass envelope */}
          <rect x={90} y={20} width={80} height={130} rx={38} fill={on ? C.yellow + "10" : C.bg} stroke={on ? C.yellow : C.border} strokeWidth={2} />
          {/* anode (plate) top */}
          <rect x={115} y={38} width={30} height={6} rx={2} fill={on ? C.yellow : C.muted} />
          <text x={190} y={44} fill={C.muted} fontSize={10}>anode (plate)</text>
          {/* grid (dashed) */}
          <line x1={112} y1={92} x2={148} y2={92} stroke={on ? C.green : C.muted} strokeWidth={2} strokeDasharray="3 3" />
          <text x={190} y={95} fill={C.muted} fontSize={10}>grid (control)</text>
          {/* cathode filament */}
          <line x1={130} y1={110} x2={130} y2={140} stroke={on ? C.red : C.muted} strokeWidth={3} style={{ filter: on ? `drop-shadow(0 0 4px ${C.red})` : "none" }} />
          <text x={190} y={135} fill={C.muted} fontSize={10}>cathode (heated)</text>
          {/* electrons rising when on */}
          {on && [0, 1, 2].map((i) => (
            <circle key={i} cx={124 + i * 6} cy={112} r={2.6} fill={C.accent} style={{ animation: `riseE 1s ${i * 0.3}s infinite linear` }} />
          ))}
          {/* output wire + bulb */}
          <line x1={130} y1={38} x2={130} y2={12} stroke={on ? C.green : C.border} strokeWidth={3} />
          <text x={130} y={168} fill={on ? C.green : C.muted} fontSize={12} fontWeight="700" textAnchor="middle">{on ? "conducting → 1" : "blocked → 0"}</text>
        </svg>
      </div>

      <Problem>
        Each tube is a glass bulb with a heated filament — so it runs <strong style={{ color: C.text }}>hot</strong>,
        guzzles <strong style={{ color: C.text }}>power</strong>, and <strong style={{ color: C.text }}>burns out</strong>
        like a light bulb. ENIAC (1945) had 18,000 tubes, drew 150&nbsp;kW, filled a room, and failed roughly
        one tube a day. But it switched ~1,000× faster than a relay.
      </Problem>

      <Key color={C.yellow}>
        No moving parts meant a 1,000× speed jump — microseconds, not milliseconds. The price was heat,
        size, and short life. A thumb-sized switch can never become billions on a chip.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The Timeline of Progress (stepper)
// ══════════════════════════════════════════════════════════════════
function EraTimelineWidget() {
  const eras = [
    { year: "1941", name: "Relay", switch: "Electromagnet + metal arm", speed: 1, size: 1, note: "Moving parts. ~1 kHz. You can hear it click." },
    { year: "1945", name: "Vacuum tube", switch: "Heated cathode + grid", speed: 3, size: 1, note: "No moving parts, ~1 MHz — but hot and burns out." },
    { year: "1947", name: "Transistor", switch: "Semiconductor junction", speed: 6, size: 4, note: "Solid-state. Small, cool, reliable. The turning point." },
    { year: "1958", name: "Integrated circuit", switch: "Many transistors on one chip", speed: 8, size: 7, note: "No wiring by hand — grow them together on silicon." },
    { year: "2024", name: "VLSI / MOSFET", switch: "Billions of field-effect switches", speed: 10, size: 10, note: "~2 nm gates. 100+ billion switches on a fingernail." },
  ];
  const [n, setN] = useState(0);
  const e = eras[n];

  const Bar = ({ label, val, color, invLabel }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 3 }}>
        <span>{label}</span><span>{invLabel}</span>
      </div>
      <div style={{ height: 8, background: C.bg, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${val * 10}%`, background: color, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Step through the switch's journey. Watch <strong style={{ color: C.text }}>speed climb</strong> and
        <strong style={{ color: C.text }}> size shrink</strong> — while the logic (AND, OR, NOT) never changes.
      </p>

      {/* era dots */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {eras.map((er, i) => (
          <button key={i} onClick={() => setN(i)} style={{
            flex: 1, padding: "6px 2px", borderRadius: 7, cursor: "pointer",
            background: i === n ? C.accentGlow : i < n ? C.accent + "22" : C.card,
            border: `1px solid ${i === n ? C.accent : C.border}`, color: i === n ? "#fff" : C.muted,
            fontSize: 10, fontWeight: 700,
          }}>{er.year}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div style={{ color: C.accent, fontWeight: 800, fontSize: 17 }}>{e.name}</div>
          <div style={{ color: C.muted, fontSize: 12 }}>{e.year}</div>
        </div>
        <div style={{ color: C.text, fontSize: 13, marginBottom: 14 }}>{e.switch}</div>
        <Bar label="Speed" val={e.speed} color={C.green} invLabel={e.speed <= 1 ? "slow" : e.speed >= 10 ? "GHz" : ""} />
        <Bar label="Smallness (transistor density)" val={e.size} color={C.teal} invLabel={e.size <= 1 ? "bulky" : e.size >= 10 ? "nanometres" : ""} />
        <div style={{ marginTop: 10, color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{e.note}</div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button onClick={() => setN(Math.min(eras.length - 1, n + 1))} disabled={n >= eras.length - 1} style={{ padding: "9px 20px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13, background: n >= eras.length - 1 ? C.border : C.accentGlow, color: "#fff", cursor: n >= eras.length - 1 ? "default" : "pointer" }}>Step ▶ ({n + 1}/{eras.length})</button>
        <button onClick={() => setN(0)} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>↺ Reset</button>
      </div>

      <Key color={C.accent}>
        Relay → tube → transistor → IC → VLSI. Each step kept the exact same logic and just made the switch
        faster, smaller and cooler. Progress in computing is largely the story of a better switch.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The Transistor (celebrated)
// ══════════════════════════════════════════════════════════════════
function TransistorWidget() {
  const scales = [
    { year: "1947", label: "1 transistor", n: "1", note: "Bardeen, Brattain & Shockley, Bell Labs — a single point-contact device." },
    { year: "1971", label: "Intel 4004", n: "2,300", note: "The first microprocessor — a whole CPU on one chip." },
    { year: "1989", label: "Intel 486", n: "1.2 million", note: "Transistors now measured in millions." },
    { year: "2024", label: "Apple M-series", n: "100+ billion", note: "Billions of switches on a chip the size of a fingernail." },
  ];
  const [i, setI] = useState(0);
  const sc = scales[i];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In December 1947 at Bell Labs, <strong style={{ color: C.text }}>Bardeen, Brattain and Shockley</strong>
        {" "}made a switch from a solid piece of semiconductor — the <strong style={{ color: C.text }}>transistor</strong>.
        No glass, no vacuum, no heater. They won the 1956 Nobel Prize, and it may be the most consequential
        invention of the 20th century.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.yellow}44`, borderRadius: 10, padding: 12 }}>
          <div style={{ color: C.yellow, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>💡 VACUUM TUBE</div>
          {[["Size", "~5 cm"], ["Power", "~5 W each"], ["Speed", "~1 MHz"], ["Life", "weeks"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}><span style={{ color: C.muted }}>{k}</span><span style={{ color: C.text }}>{v}</span></div>
          ))}
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 12 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>🔬 TRANSISTOR</div>
          {[["Size", "~1 mm → 2 nm"], ["Power", "µW – fJ"], ["Speed", "~5 GHz"], ["Life", "decades"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}><span style={{ color: C.muted }}>{k}</span><span style={{ color: C.text }}>{v}</span></div>
          ))}
        </div>
      </div>

      <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>And it shrinks without limit — drag through the decades:</div>
      <input type="range" min={0} max={scales.length - 1} value={i} onChange={(e) => setI(+e.target.value)} style={{ width: "100%", accentColor: C.green }} />
      <div style={{ background: C.green + "14", border: `1px solid ${C.green}44`, borderRadius: 10, padding: "12px 16px", marginTop: 8, textAlign: "center" }}>
        <div style={{ color: C.muted, fontSize: 12 }}>{sc.year} · {sc.label}</div>
        <div style={{ color: C.green, fontWeight: 800, fontSize: 22, margin: "2px 0" }}>{sc.n} transistors</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{sc.note}</div>
      </div>

      <Key color={C.green}>
        Solid-state, tiny, cool, reliable — and endlessly shrinkable. That last property is why one chip can
        hold billions of the gates you built in Unit 0.2. The transistor is the switch that made everything
        after it possible.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Transistors Transformed Memory (magnetic → transistor)
// ══════════════════════════════════════════════════════════════════
function MemoryEvolutionWidget() {
  const [tech, setTech] = useState("core"); // "core" | "dram"
  const [bit, setBit] = useState(0);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Transistors didn't just change computing — they changed <strong style={{ color: C.text }}>memory</strong>.
        Before them, a bit was stored in the <strong style={{ color: C.text }}>magnetic direction</strong> of a tiny
        iron ring, threaded by hand. Compare the old way with the transistor cell. Tap the store to flip its bit.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setTech("core")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${tech === "core" ? C.orange : C.border}`, background: tech === "core" ? C.orange + "18" : C.card, color: tech === "core" ? C.orange : C.muted, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🧲 Magnetic core (1950s)</button>
        <button onClick={() => setTech("dram")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${tech === "dram" ? C.green : C.border}`, background: tech === "dram" ? C.green + "18" : C.card, color: tech === "dram" ? C.green : C.muted, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🔬 Transistor cell (DRAM)</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 6px" }}>
        <svg viewBox="0 0 260 150" style={{ width: "100%", maxWidth: 300, display: "block", margin: "0 auto", cursor: "pointer" }} onClick={() => setBit(bit ? 0 : 1)}>
          {tech === "core" ? (<>
            {/* wires threading the ring */}
            <line x1={20} y1={75} x2={240} y2={75} stroke={C.border} strokeWidth={2} />
            <line x1={130} y1={20} x2={130} y2={130} stroke={C.border} strokeWidth={2} />
            {/* ferrite ring */}
            <circle cx={130} cy={75} r={34} fill="none" stroke={bit ? C.orange : C.muted} strokeWidth={10} />
            {/* magnetisation direction arrow (clockwise = 1) */}
            <path d={bit ? "M130,45 A30,30 0 0 1 160,75" : "M130,45 A30,30 0 0 0 100,75"} fill="none" stroke={bit ? C.green : C.teal} strokeWidth={3} markerEnd="url(#mdir)" />
            <defs><marker id="mdir" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={bit ? C.green : C.teal} /></marker></defs>
            <text x={130} y={80} fill={C.text} fontSize={18} fontWeight="800" textAnchor="middle">{bit}</text>
            <text x={130} y={148} fill={C.muted} fontSize={11} textAnchor="middle">magnetised {bit ? "clockwise → 1" : "anticlockwise → 0"}</text>
          </>) : (<>
            {/* transistor (box + gate) */}
            <rect x={60} y={55} width={40} height={40} rx={5} fill={C.card} stroke={C.accent} strokeWidth={2} />
            <text x={80} y={80} fill={C.accent} fontSize={10} fontWeight="700" textAnchor="middle">T</text>
            <line x1={30} y1={75} x2={60} y2={75} stroke={C.muted} strokeWidth={2} />
            <text x={30} y={66} fill={C.muted} fontSize={9}>word line</text>
            {/* capacitor */}
            <line x1={100} y1={75} x2={140} y2={75} stroke={bit ? C.green : C.border} strokeWidth={3} />
            <line x1={140} y1={58} x2={140} y2={92} stroke={bit ? C.green : C.muted} strokeWidth={3} />
            <line x1={156} y1={58} x2={156} y2={92} stroke={bit ? C.green : C.muted} strokeWidth={3} />
            <text x={148} y={110} fill={C.muted} fontSize={10} textAnchor="middle">capacitor</text>
            {/* charge indicator */}
            {bit === 1 && [0, 1, 2].map((i) => <circle key={i} cx={144 + i * 3} cy={68 + i * 5} r={2} fill={C.green} />)}
            <text x={200} y={80} fill={C.text} fontSize={18} fontWeight="800" textAnchor="middle">{bit}</text>
            <text x={130} y={135} fill={C.muted} fontSize={11} textAnchor="middle">capacitor {bit ? "charged → 1" : "empty → 0"}</text>
          </>)}
        </svg>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        <div style={{ background: C.card, border: `1px solid ${C.orange}33`, borderRadius: 10, padding: 10 }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>MAGNETIC CORE</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>One ring = one bit, threaded by hand. A cabinet held a few kilobytes. Kept its value with the power off.</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.green}33`, borderRadius: 10, padding: 10 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 11, marginBottom: 6 }}>TRANSISTOR DRAM</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>One transistor + one capacitor = one bit. Billions on a chip, made by machine, and far faster.</div>
        </div>
      </div>

      <Key color={C.green}>
        The same transistor that computes can also store. Memory went from hand-threaded magnetic rings — a
        few KB filling a cabinet — to billions of cells on a fingernail. That's what makes von Neumann's
        stored-program idea practical at real scale.
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
      q: "A logic gate can be built from relays. What is the main drawback of a relay?",
      options: [
        "It cannot represent a 1",
        "It has a moving metal part — slow, noisy, and it wears out",
        "It needs a vacuum inside",
        "It only works with decimal numbers",
      ],
      answer: 1,
      explain: "A relay switches by physically moving a metal arm: ~10 ms per switch, loud clicking, and mechanical wear. Logic works, but it can't scale.",
    },
    {
      q: "In a vacuum tube, what decides whether current flows?",
      options: [
        "The colour of the glass",
        "A spring inside the tube",
        "The voltage on the control grid, steering electrons from the heated cathode",
        "The number of tubes wired together",
      ],
      answer: 2,
      explain: "A heated cathode emits electrons; the grid's voltage lets them reach the plate (ON) or blocks them (OFF) — switching at electron speed, no moving parts.",
    },
    {
      q: "Why were vacuum tubes eventually replaced?",
      options: [
        "They were too quiet to notice",
        "They ran hot, used lots of power, and burned out like light bulbs",
        "They could not perform AND or OR",
        "They were made of plastic",
      ],
      answer: 1,
      explain: "Tubes had a heated filament, so they were hot, power-hungry, bulky and short-lived (ENIAC lost ~1 tube/day). The solid-state transistor fixed all of that.",
    },
    {
      q: "Before transistor memory, how did early computers commonly store a bit in main memory?",
      options: [
        "As the magnetisation direction of a tiny iron ring (magnetic core)",
        "As ink printed on paper",
        "As a sound wave in a speaker",
        "As the position of a mechanical gear",
      ],
      answer: 0,
      explain: "Magnetic-core memory stored each bit as the magnetic direction of a hand-threaded ferrite ring. Transistor DRAM/SRAM later shrank this to billions of cells on a chip.",
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
          {score === 4 ? "Excellent — you can trace the switch from clicking relays to billions of transistors."
            : score >= 2 ? "Good. Replay the Timeline and Memory tabs to firm up the progression."
              : "Worth another pass — the Vacuum Tubes and Memory tabs are the ones to revisit."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55`, textAlign: "left" }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 0.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've seen the same logic built from relays, tubes, and transistors — and watched memory move from
            magnetic rings to transistor cells. You now know what the machine is physically made of.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 0.4 — The Von Neumann Model.</strong>{" "}
            We assemble these switches and memory cells into the architecture behind every computer in this course.
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
export default function Unit0_3({ student, onUnitComplete }) {
  const sections = [
    { id: "relay", label: "Relay Gates" },
    { id: "tube", label: "Vacuum Tubes" },
    { id: "timeline", label: "Timeline" },
    { id: "transistor", label: "The Transistor" },
    { id: "memory", label: "Memory" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>A gate built from relays</h3><RelayGateWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>A faster switch: the vacuum tube</h3><TubeGateWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The march of the switch</h3><EraTimelineWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The invention that changed everything</h3><TransistorWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>How memory was transformed</h3><MemoryEvolutionWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 0.3.</p>
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💡</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 0 › UNIT 0.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>From Relays to Transistors</div>
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
              flex: 1, minWidth: 74, padding: "8px 6px", borderRadius: 7,
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
