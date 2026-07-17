// Unit1_1.jsx — Module 1 › Unit 1.1 — "The Five Functional Units"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: chaos without a coordinator → the clock beat → the five units run a
// program → the memory speed shelf → quiz.
import { useState, useRef, useEffect } from "react";

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
//  Section 1 — The Chaos Machine (why we need a coordinator)
// ══════════════════════════════════════════════════════════════════
function ChaosMachine() {
  const [controlOn, setControlOn] = useState(false);
  const [phase, setPhase] = useState("idle");   // idle | running | done
  const [beat, setBeat] = useState(0);          // 1..4 when control is on
  const [output, setOutput] = useState(null);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setOutput(null); setBeat(0); setPhase("running");
    if (!controlOn) {
      // everyone fires at once — Output blurts 8 before the increment happens
      timers.current.push(setTimeout(() => { setOutput(8); setPhase("done"); }, 1400));
    } else {
      [1, 2, 3, 4].forEach((b) =>
        timers.current.push(setTimeout(() => {
          setBeat(b);
          if (b === 4) { setOutput(9); setPhase("done"); }
        }, b * 900))
      );
    }
  };
  const reset = () => { timers.current.forEach(clearTimeout); timers.current = []; setPhase("idle"); setBeat(0); setOutput(null); };

  const chaos = phase === "running" && !controlOn;
  const beatLabels = ["", "INPUT reads 5 and 3", "ALU adds: 5 + 3 = 8", "ALU increments: 8 + 1 = 9", "OUTPUT displays 9"];

  // which unit is "live" on each ordered beat
  const liveOn = { INPUT: beat === 1, MEMORY: beat >= 1, ALU: beat === 2 || beat === 3, OUTPUT: beat === 4 };

  const Unit = ({ name, color, note }) => {
    const lit = chaos || (controlOn && phase !== "idle" && liveOn[name]);
    return (
      <div style={{
        flex: 1, minWidth: 90, padding: "10px 6px", borderRadius: 10, textAlign: "center",
        background: lit ? (chaos ? C.red + "22" : color + "22") : C.card,
        border: `2px solid ${lit ? (chaos ? C.red : color) : C.border}`,
        transition: "all 0.3s",
        animation: chaos ? "chaosFlicker 0.25s infinite alternate" : "none",
      }}>
        <div style={{ color: lit ? (chaos ? C.red : color) : C.muted, fontWeight: 700, fontSize: 12 }}>{name}</div>
        <div style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>{note}</div>
      </div>
    );
  };

  return (
    <div>
      <style>{`@keyframes chaosFlicker { from { opacity: 1; } to { opacity: 0.45; } }`}</style>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Five units, one small program: <strong style={{ color: C.text }}>take 5 and 3, ADD them,
        INCREMENT the result, DISPLAY the answer</strong>. Correct answer: <strong style={{ color: C.green }}>9</strong>.
        First run it with <strong style={{ color: C.red }}>no one in charge</strong> — then flip Control on and run it again.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.teal}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontFamily: "monospace", fontSize: 12, color: C.teal }}>
        MEMORY holds the program: read 5, 3 → add → increment → display
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <Unit name="INPUT" color={C.green} note="gives 5, 3" />
        <Unit name="MEMORY" color={C.teal} note="holds program" />
        <Unit name="ALU" color={C.accent} note="adds, increments" />
        <Unit name="OUTPUT" color={C.orange} note="shows result" />
      </div>

      {/* Control unit — the toggle IS the lesson */}
      <div style={{ display: "flex", gap: 10, alignItems: "stretch", marginBottom: 14 }}>
        <button onClick={() => { setControlOn(v => !v); reset(); }} style={{
          flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
          background: controlOn ? C.yellow + "22" : C.card,
          border: `2px solid ${controlOn ? C.yellow : C.border}`,
          color: controlOn ? C.yellow : C.muted, fontWeight: 700, fontSize: 13,
        }}>
          🎼 CONTROL: {controlOn ? "ON — conducting" : "OFF — nobody in charge"}
        </button>
        <button onClick={run} disabled={phase === "running"} style={{
          flex: 1, padding: "10px", borderRadius: 10,
          background: phase === "running" ? C.card : C.accentGlow, border: "none",
          color: phase === "running" ? C.muted : "#fff", fontWeight: 700, fontSize: 13,
          cursor: phase === "running" ? "default" : "pointer",
        }}>
          ▶ RUN {controlOn ? "with Control" : "without Control"}
        </button>
      </div>

      {/* live commentary + output */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", minHeight: 64 }}>
        {phase === "idle" && <div style={{ color: C.muted, fontSize: 13 }}>Press RUN to see what happens…</div>}
        {chaos && <div style={{ color: C.red, fontSize: 13, fontWeight: 600 }}>⚡ Everyone moves at once! ALU is adding while OUTPUT is already shouting…</div>}
        {controlOn && phase !== "idle" && beat > 0 && (
          <div style={{ color: C.yellow, fontSize: 13, fontWeight: 600 }}>👏 Clap {beat}: <span style={{ color: C.text }}>{beatLabels[beat]}</span></div>
        )}
        {output !== null && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              padding: "8px 22px", borderRadius: 8, fontFamily: "monospace", fontSize: 26, fontWeight: 800,
              background: output === 9 ? C.green + "22" : C.red + "22",
              border: `2px solid ${output === 9 ? C.green : C.red}`,
              color: output === 9 ? C.green : C.red,
            }}>{output}</div>
            <div style={{ fontSize: 13, color: output === 9 ? C.green : C.red, lineHeight: 1.5 }}>
              {output === 9
                ? "Correct! Every unit acted in order, one step per clap."
                : "WRONG — Output blurted 5 + 3 = 8 before the increment ever happened. Nobody decided the ORDER."}
            </div>
          </div>
        )}
      </div>

      <Key color={C.yellow}>
        Five capable units still compute garbage if nothing fixes the <strong style={{ color: C.text }}>order</strong>.
        The coordinator that keeps every unit acting at the right time is the <strong style={{ color: C.yellow }}>Control unit</strong> —
        and its "clap" is what we meet next.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Beat (clock + control signals)
// ══════════════════════════════════════════════════════════════════
function FlipCard({ front, frontColor, back }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(f => !f)} style={{
      flex: 1, minWidth: 140, minHeight: 110, cursor: "pointer", borderRadius: 10,
      background: flipped ? frontColor + "18" : C.card,
      border: `2px solid ${flipped ? frontColor : C.border}`,
      padding: "14px 12px", transition: "all 0.3s", textAlign: "center",
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}>
      {!flipped ? (
        <>
          <div style={{ color: frontColor, fontWeight: 800, fontSize: 15 }}>{front}</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>tap to flip</div>
        </>
      ) : (
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{back}</div>
      )}
    </div>
  );
}

function BeatWidget() {
  const [hz, setHz] = useState(1);
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTicks(t => t + 1), 1000 / hz);
    return () => clearInterval(id);
  }, [hz]);

  const dur = (1 / hz).toFixed(3);
  // four pulse paths, CONTROL centre → each unit corner
  const paths = [
    "M 250 110 L 70 45", "M 350 110 L 530 45",
    "M 250 150 L 70 210", "M 350 150 L 530 210",
  ];
  const units = [
    { x: 10, y: 20, label: "MEMORY", color: C.teal },
    { x: 470, y: 20, label: "ALU", color: C.accent },
    { x: 10, y: 185, label: "INPUT", color: C.green },
    { x: 470, y: 185, label: "OUTPUT", color: C.orange },
  ];

  return (
    <div>
      <style>{`
        @keyframes pulseGo { from { offset-distance: 0%; opacity: 1; } 90% { opacity: 1; } to { offset-distance: 100%; opacity: 0; } }
        @keyframes unitFlash { 0%, 60% { opacity: 0.45; } 80% { opacity: 1; } 100% { opacity: 0.55; } }
      `}</style>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        That "clap" has a real name: the <strong style={{ color: C.yellow }}>clock pulse</strong>. Control
        generates a steady beat and sends it to <strong style={{ color: C.text }}>every unit at once</strong> —
        one pulse, one step, then everyone freezes till the next pulse. Drag the slider: a faster clock
        is a faster computer (same parts, more steps per second!).
      </p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>
          Clock speed: <strong style={{ color: C.yellow, fontFamily: "monospace" }}>{hz} Hz</strong> = {hz} tick{hz > 1 ? "s" : ""}/second
          <span style={{ marginLeft: 12, color: C.muted }}>(a real CPU: ~3&nbsp;GHz = 3,000,000,000/s)</span>
        </label>
        <input type="range" min={1} max={4} value={hz} onChange={(e) => setHz(Number(e.target.value))} style={{ width: "100%", accentColor: C.yellow }} />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "8px 4px" }}>
        <svg viewBox="0 0 600 260" style={{ width: "100%", display: "block" }}>
          {/* wires */}
          {paths.map((d, i) => <path key={i} d={d} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="5 5" fill="none" opacity={0.5} />)}
          {/* CONTROL — the source of the beat */}
          <rect x={230} y={100} width={140} height={60} rx={10} fill={C.yellow + "22"} stroke={C.yellow} strokeWidth={2.5} />
          <text x={300} y={126} textAnchor="middle" fill={C.yellow} fontSize={15} fontWeight="800">CONTROL</text>
          <text x={300} y={146} textAnchor="middle" fill={C.muted} fontSize={10}>the clock lives here</text>
          {/* units flash in lock-step with the pulse arrival */}
          {units.map((u) => (
            <g key={u.label} style={{ animation: `unitFlash ${dur}s linear infinite` }}>
              <rect x={u.x} y={u.y} width={120} height={50} rx={9} fill={C.card} stroke={u.color} strokeWidth={2} />
              <text x={u.x + 60} y={u.y + 30} textAnchor="middle" fill={u.color} fontSize={13} fontWeight="700">{u.label}</text>
            </g>
          ))}
          {/* travelling pulses — one per wire, duration = one clock cycle */}
          {paths.map((d, i) => (
            <circle key={"p" + i} r={6} fill={C.yellow} style={{ offsetPath: `path('${d}')`, animation: `pulseGo ${dur}s linear infinite` }} />
          ))}
        </svg>
        <div style={{ textAlign: "center", fontFamily: "monospace", fontSize: 12, color: C.muted, paddingBottom: 6 }}>
          ticks so far: <span style={{ color: C.yellow, fontWeight: 700 }}>{ticks}</span> — every unit stepped {ticks} times, together
        </div>
      </div>

      <p style={{ color: C.muted, fontSize: 13, margin: "16px 0 10px", lineHeight: 1.7 }}>
        The clock is only <em>half</em> of Control's job. Flip both cards — this WHEN/WHAT pair is a favourite exam question:
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <FlipCard front="① Clock (timing) signals" frontColor={C.yellow}
          back={<span><strong style={{ color: C.yellow }}>WHEN</strong> — the steady beat. Every unit acts on the tick, then waits. Ticks per second = the clock rate (Hz).</span>} />
        <FlipCard front="② Control signals" frontColor={C.purple}
          back={<span><strong style={{ color: C.purple }}>WHAT</strong> to do on that tick — "latch this register", "put that value on the bus", "tell the ALU to add".</span>} />
      </div>

      <Key color={C.yellow}>
        Control sends <strong style={{ color: C.yellow }}>clock signals (WHEN)</strong> +
        <strong style={{ color: C.purple }}> control signals (WHAT)</strong>. One clock cycle = the time
        from one pulse to the next — the beat the whole computer marches to.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The Five at Work (student-stepped program run)
// ══════════════════════════════════════════════════════════════════
function FiveAtWork() {
  const [predict, setPredict] = useState(null); // learner's guess for the output
  const [step, setStep] = useState(0);          // 0..4

  // precomputed trace — the Step button just moves the index
  const steps = [
    { r1: "", r2: "", r3: "", out: "", pkt: null, narr: "Ready. Press Step to run the first instruction." },
    { r1: "7", r2: "", r3: "", out: "", pkt: { x: 205, y: 78, v: "7" }, narr: "① INPUT R1 — the first number (7) is read straight into register R1." },
    { r1: "7", r2: "5", r3: "", out: "", pkt: { x: 305, y: 78, v: "5" }, narr: "② INPUT R2 — the second number (5) goes into R2." },
    { r1: "7", r2: "5", r3: "12", out: "", pkt: { x: 405, y: 78, v: "12" }, narr: "③ ADD R3, R1, R2 — the ALU reads R1 and R2, computes 7 + 5, writes 12 into R3." },
    { r1: "7", r2: "5", r3: "12", out: "12", pkt: { x: 555, y: 160, v: "12" }, narr: "④ OUTPUT R3 — the result 12 leaves through the output unit. Program done!" },
  ];
  const s = steps[step];

  const Reg = ({ x, name, val }) => (
    <g>
      <rect x={x} y={60} width={80} height={44} rx={8} fill={C.card} stroke={val ? C.teal : C.border} strokeWidth={val ? 2.5 : 1.5} style={{ transition: "all 0.3s" }} />
      <text x={x + 12} y={78} fill={C.muted} fontSize={11}>{name}</text>
      <text x={x + 40} y={96} textAnchor="middle" fill={C.teal} fontSize={16} fontWeight="700" fontFamily="monospace">{val}</text>
    </g>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        Now watch all five units run a real program together. Memory holds four instructions; the user
        types <strong style={{ color: C.green }}>7</strong> and <strong style={{ color: C.green }}>5</strong>.
        <strong style={{ color: C.text }}> Before you step through it — predict what OUTPUT will finally show.</strong>
      </p>

      {/* predict-first gate */}
      <div style={{ background: C.card, border: `1px solid ${C.purple}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ color: C.purple, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>🤔 PREDICT: what number reaches OUTPUT?</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[7, 12, 75, 35].map((v) => (
            <button key={v} onClick={() => predict === null && setPredict(v)} style={{
              flex: 1, minWidth: 60, padding: "8px", borderRadius: 8, fontFamily: "monospace", fontWeight: 700, fontSize: 14,
              background: predict === v ? (v === 12 ? C.green + "22" : C.yellow + "22") : C.card,
              border: `2px solid ${predict === v ? (v === 12 ? C.green : C.yellow) : C.border}`,
              color: predict === v ? (v === 12 ? C.green : C.yellow) : C.text,
              cursor: predict === null ? "pointer" : "default",
            }}>{v}</button>
          ))}
        </div>
        {predict !== null && (
          <div style={{ marginTop: 8, fontSize: 12, color: C.muted }}>
            You predicted <strong style={{ color: C.text }}>{predict}</strong> — now step through and see if the machine agrees.
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", opacity: predict === null ? 0.45 : 1, transition: "opacity 0.3s" }}>
          <svg viewBox="0 0 640 240" style={{ width: "100%", display: "block" }}>
            {/* MEMORY strip with the program */}
            <rect x={10} y={10} width={160} height={104} rx={8} fill={C.surface} stroke={C.teal} strokeWidth={1.5} />
            <text x={90} y={28} textAnchor="middle" fill={C.teal} fontSize={11} fontWeight="700">MEMORY · program</text>
            {["Input R1", "Input R2", "Add R3,R1,R2", "Output R3"].map((line, i) => (
              <text key={i} x={22} y={48 + i * 18} fill={step === i + 1 ? C.yellow : C.teal} fontSize={11} fontFamily="monospace" fontWeight={step === i + 1 ? 800 : 400}>
                {step === i + 1 ? "▶ " : "  "}{line}
              </text>
            ))}
            {/* PROCESSOR box: R1 R2 R3 + ALU + CONTROL */}
            <rect x={190} y={40} width={310} height={180} rx={10} fill="none" stroke={C.purple} strokeWidth={1.5} />
            <text x={345} y={56} textAnchor="middle" fill={C.purple} fontSize={11} fontWeight="700">PROCESSOR</text>
            <Reg x={205} name="R1" val={s.r1} />
            <Reg x={305} name="R2" val={s.r2} />
            <Reg x={405} name="R3" val={s.r3} />
            <rect x={215} y={130} width={130} height={70} rx={9} fill={C.card} stroke={step === 3 ? C.green : C.accent} strokeWidth={step === 3 ? 3 : 2} style={{ transition: "all 0.3s" }} />
            <text x={280} y={162} textAnchor="middle" fill={C.accent} fontSize={14} fontWeight="700">ALU</text>
            <text x={280} y={182} textAnchor="middle" fill={step === 3 ? C.green : C.muted} fontSize={11} fontFamily="monospace">{step === 3 ? "7 + 5 = 12" : "waits"}</text>
            <rect x={365} y={130} width={120} height={70} rx={9} fill={C.card} stroke={C.yellow} strokeWidth={2} />
            <text x={425} y={162} textAnchor="middle" fill={C.yellow} fontSize={13} fontWeight="700">CONTROL</text>
            <text x={425} y={182} textAnchor="middle" fill={C.muted} fontSize={10}>keeps the beat</text>
            {/* INPUT and OUTPUT flank the processor */}
            <rect x={10} y={140} width={110} height={60} rx={9} fill={C.card} stroke={step === 1 || step === 2 ? C.green : C.border} strokeWidth={2} style={{ transition: "all 0.3s" }} />
            <text x={65} y={166} textAnchor="middle" fill={C.green} fontSize={12} fontWeight="700">INPUT</text>
            <text x={65} y={186} textAnchor="middle" fill={C.muted} fontSize={10}>types 7, then 5</text>
            <rect x={520} y={140} width={110} height={60} rx={9} fill={C.card} stroke={step === 4 ? C.orange : C.border} strokeWidth={step === 4 ? 3 : 2} style={{ transition: "all 0.3s" }} />
            <text x={575} y={166} textAnchor="middle" fill={C.orange} fontSize={12} fontWeight="700">OUTPUT</text>
            <text x={575} y={188} textAnchor="middle" fill={s.out ? C.green : C.muted} fontSize={s.out ? 16 : 10} fontWeight="800" fontFamily="monospace">{s.out || "blank"}</text>
            {/* the travelling data packet — glides to its target on each step */}
            {s.pkt && (
              <g style={{ transition: "all 0.6s ease" }} transform={`translate(${s.pkt.x}, ${s.pkt.y})`}>
                <rect x={-18} y={-14} width={36} height={26} rx={6} fill={C.yellow} />
                <text x={0} y={5} textAnchor="middle" fill={C.bg} fontSize={13} fontWeight="800" fontFamily="monospace">{s.pkt.v}</text>
              </g>
            )}
          </svg>
        </div>

        {/* live register panel */}
        <div style={{ display: "flex", gap: 10 }}>
          {[["R1", s.r1], ["R2", s.r2], ["R3", s.r3]].map(([n, v]) => (
            <div key={n} style={{ flex: 1, background: C.card, border: `1.5px solid ${v ? C.teal : C.border}`, borderRadius: 8, padding: "8px", textAlign: "center", transition: "all 0.3s" }}>
              <div style={{ color: C.muted, fontSize: 10 }}>{n}</div>
              <div style={{ color: C.teal, fontFamily: "monospace", fontSize: 18, fontWeight: 700, minHeight: 24 }}>{v || "—"}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 42 }}>
          {s.narr}
          {step === 4 && predict !== null && (
            <div style={{ marginTop: 6, color: predict === 12 ? C.green : C.orange, fontWeight: 600 }}>
              {predict === 12 ? "🎯 Your prediction was spot on!" : `Your prediction was ${predict} — the machine says 12: it ADDS 7 and 5, it doesn't glue them together.`}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setStep(v => Math.min(4, v + 1))} disabled={predict === null || step === 4} style={{
            flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
            background: predict === null || step === 4 ? C.card : C.accentGlow,
            color: predict === null || step === 4 ? C.muted : "#fff",
            cursor: predict === null || step === 4 ? "default" : "pointer",
          }}>Step ▶ ({step} / 4)</button>
          <button onClick={() => { setStep(0); setPredict(null); }} style={{
            flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
            color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>↺ Reset</button>
        </div>
      </div>

      <Key color={C.accent}>
        Data flows <strong style={{ color: C.green }}>Input</strong> → <strong style={{ color: C.teal }}>registers</strong> →
        <strong style={{ color: C.accent }}> ALU</strong> → <strong style={{ color: C.orange }}>Output</strong>, with
        <strong style={{ color: C.yellow }}> Control</strong> conducting every move. Note the pattern: operands are loaded
        into <em>registers</em> before the ALU touches them — remember that for the next section.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Memory's Three Floors (+ speed table with a guess)
// ══════════════════════════════════════════════════════════════════
function MemoryFloors() {
  const [sel, setSel] = useState(null);     // which shelf level is zoomed
  const [rows, setRows] = useState(0);      // revealed rows of the speed table
  const [guess, setGuess] = useState(null); // learner's guess for the hard-disk row

  const floors = [
    {
      id: 0, label: "REGISTERS", color: C.teal, tag: "inside the CPU · fastest",
      detail: "A few tiny cells INSIDE the processor. The ALU reads and writes them directly, in about one clock tick — which is exactly why operands are loaded into registers before any calculation.",
    },
    {
      id: 1, label: "CACHE", color: C.purple, tag: "on the CPU · SRAM · tiny",
      detail: "Small, costly SRAM hugging the CPU. Keeps the data used most right now. A cache HIT feeds the processor almost as fast as a register, sparing a slow trip out to main memory.",
    },
    {
      id: 2, label: "MAIN MEMORY (RAM)", color: C.accent, tag: "on the board · DRAM · volatile",
      detail: "DRAM on the motherboard, reached over the bus. Holds the ENTIRE running program and its data. Random-access: any address takes the same time. Volatile: empties when power is cut.",
    },
    {
      id: 3, label: "SECONDARY (SSD · HDD)", color: C.orange, tag: "big · cheap · non-volatile",
      detail: "SSD, hard disk, flash. Non-volatile — keeps your files with the power off. But not truly random-access (disks seek, SSDs work in blocks), so data must first be copied into RAM before the CPU can touch it.",
    },
  ];

  const table = [
    { level: "Register", where: "inside the CPU", time: "~0.3 ns", scaled: "1 second", color: C.green },
    { level: "L1 cache", where: "on the CPU", time: "~1 ns", scaled: "~3 seconds", color: C.green },
    { level: "Main memory (RAM)", where: "on the board", time: "~80 ns", scaled: "~4 minutes", color: C.yellow },
    { level: "SSD", where: "secondary", time: "~100 µs", scaled: "~4 days", color: C.orange },
    { level: "Hard disk", where: "secondary", time: "~10 ms", scaled: "~1 YEAR", color: C.red },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        The Memory unit isn't one thing — it's a <strong style={{ color: C.text }}>building with floors</strong>:
        the higher the floor, the faster and smaller; the lower, the bigger and slower.
        <strong style={{ color: C.text }}> Click each floor</strong> to zoom in.
      </p>

      {/* the shelf */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {floors.map((f) => (
          <button key={f.id} onClick={() => setSel(sel === f.id ? null : f.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
            background: sel === f.id ? f.color + "1E" : C.card,
            border: `2px solid ${sel === f.id ? f.color : C.border}`,
            cursor: "pointer", textAlign: "left", transition: "all 0.25s",
            marginLeft: f.id * 14, // staircase: each floor bigger/slower → wider offset
          }}>
            <span style={{ color: f.color, fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>{f.label}</span>
            <span style={{ color: C.muted, fontSize: 11 }}>{f.tag}</span>
            <span style={{ marginLeft: "auto", color: C.muted, fontSize: 12 }}>{sel === f.id ? "▲" : "🔍"}</span>
          </button>
        ))}
      </div>
      {sel !== null && (
        <div style={{ background: floors[sel].color + "12", border: `1px solid ${floors[sel].color}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 12, fontSize: 13, color: C.text, lineHeight: 1.65 }}>
          {floors[sel].detail}
        </div>
      )}

      {/* speed table — reveal row by row, guess before the last row */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
          ⏱️ Feel the gap: if a register access took <span style={{ color: C.green }}>1 second</span>…
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["Level", "Where", "Real time", "Scaled time"].map((h) => (
                <th key={h} style={{ textAlign: "left", color: C.accent, padding: "6px 8px", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.slice(0, rows).map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 8px", color: C.text, borderBottom: `1px solid ${C.border}33` }}>{r.level}</td>
                <td style={{ padding: "6px 8px", color: C.muted, borderBottom: `1px solid ${C.border}33` }}>{r.where}</td>
                <td style={{ padding: "6px 8px", color: C.muted, fontFamily: "monospace", borderBottom: `1px solid ${C.border}33` }}>{r.time}</td>
                <td style={{ padding: "6px 8px", color: r.color, fontWeight: 700, borderBottom: `1px solid ${C.border}33` }}>{r.scaled}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows < 4 && (
          <button onClick={() => setRows(r => r + 1)} style={{
            marginTop: 10, padding: "8px 18px", borderRadius: 8, background: C.accentGlow,
            border: "none", color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer",
          }}>Reveal next level ▼</button>
        )}
        {rows === 4 && guess === null && (
          <div style={{ marginTop: 10 }}>
            <div style={{ color: C.purple, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
              🤔 Last one — a HARD DISK (~10 ms). On this scale, how long is that?
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["~1 hour", "~1 day", "~1 year"].map((g) => (
                <button key={g} onClick={() => { setGuess(g); setRows(5); }} style={{
                  flex: 1, minWidth: 80, padding: "8px", borderRadius: 8, background: C.card,
                  border: `1.5px solid ${C.purple}55`, color: C.text, fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>{g}</button>
              ))}
            </div>
          </div>
        )}
        {guess !== null && (
          <div style={{ marginTop: 10, fontSize: 12, color: guess === "~1 year" ? C.green : C.orange, lineHeight: 1.6 }}>
            {guess === "~1 year" ? "🎯 Exactly — about ONE YEAR." : `You guessed ${guess} — it's actually about ONE YEAR!`} The
            processor would rather <em>wait</em> than touch the disk. That single fact is the reason cache and RAM exist at all.
          </div>
        )}
      </div>

      {/* quick cards for the remaining units */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <FlipCard front="🧮 ALU" frontColor={C.accent}
          back={<span>Performs all <strong style={{ color: C.accent }}>arithmetic & logic</strong>: add, subtract, compare, AND, OR. Your Unit-0 full-adder lives inside it!</span>} />
        <FlipCard front="⌨️ Input" frontColor={C.green}
          back={<span>Accepts <strong style={{ color: C.green }}>coded information</strong> from outside — keyboard, mouse, mic, camera, network — and turns it into binary.</span>} />
        <FlipCard front="🖥️ Output" frontColor={C.orange}
          back={<span>The counterpart: sends <strong style={{ color: C.orange }}>results back to the world</strong> — display, print, sound. A touchscreen does both → "I/O unit".</span>} />
      </div>

      <Key color={C.teal}>
        <strong style={{ color: C.text }}>Register → Cache → RAM → Disk</strong>: each step down is
        10–100× slower but far bigger and cheaper. And remember:
        <strong style={{ color: C.purple }}> ALU + Control + registers = the processor</strong>. We build
        this whole hierarchy properly in Module 4.
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
      q: "Which list names the five functional units of a computer?",
      options: [
        "Input, Memory, ALU, Output, Control",
        "Keyboard, RAM, CPU, Monitor, Mouse",
        "Input, Cache, ALU, Output, Bus",
        "Memory, ALU, Control, Bus, Clock",
      ],
      answer: 0,
      explain: "The five functionally independent units are Input, Memory, ALU, Output, and Control. Keyboards and monitors are just examples of input/output devices; the bus and clock are not units.",
    },
    {
      q: "The Control unit sends out two kinds of signal. What does each say?",
      options: [
        "Clock says WHAT to do; control signals say WHEN",
        "Clock says WHEN (the beat); control signals say WHAT to do on that beat",
        "Both say WHEN — they are the same signal at different speeds",
        "Clock signals go only to memory; control signals go only to the ALU",
      ],
      answer: 1,
      explain: "Clock (timing) signals set WHEN each step may happen — the beat. Control signals set WHAT happens on that tick: latch a register, drive the bus, select the ALU operation.",
    },
    {
      q: "Rank these by access speed, FASTEST first:",
      options: [
        "Cache → Register → RAM → Disk",
        "Register → RAM → Cache → Disk",
        "Register → Cache → RAM → Disk",
        "RAM → Cache → Register → Disk",
      ],
      answer: 2,
      explain: "Registers (inside the CPU) are fastest, then cache, then main memory, then disk. Each step down is roughly 10–100× slower but bigger and cheaper — remember the '1 second vs 1 year' table!",
    },
    {
      q: "Which units together form the PROCESSOR?",
      options: [
        "ALU + Memory + Input",
        "ALU + Control + registers",
        "Control + Cache + Output",
        "ALU + RAM + Control",
      ],
      answer: 1,
      explain: "Processor = ALU + Control unit + registers. Main memory (RAM) sits OUTSIDE the processor, reached over the bus.",
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
          {score === 4 ? "Perfect! You've got the whole machine mapped — all five units and their speeds." :
            score >= 2 ? "Good work! Replay 'The Beat' and 'Memory's Three Floors' to lock in the details." :
              "Revisit 'The Chaos Machine' and 'The Five at Work' — watch WHO does WHAT, and in what order."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 1.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now name all five functional units, explain why a coordinator is essential,
            and rank every level of memory by speed. A ₹500 smart-watch and a ₹50-crore supercomputer —
            you now know the blueprint of both.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 1.2 — Basic Operational Concepts.</strong>{" "}
            The five boxes are wired. But nothing has RUN yet — what actually makes a lifeless
            list of numbers in memory start executing?
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
export default function Unit1_1({ student, onUnitComplete }) {
  const sections = [
    { id: "chaos", label: "The Chaos Machine" },
    { id: "beat", label: "The Beat" },
    { id: "five", label: "The Five at Work" },
    { id: "memory", label: "Memory's Floors" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎭 The Chaos Machine — why we need a coordinator</h3>
      <ChaosMachine />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🥁 The Beat — the clock cycle</h3>
      <BeatWidget />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⚙️ The Five at Work — run a real program</h3>
      <FiveAtWork />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🏢 Memory's Three Floors (and the other units)</h3>
      <MemoryFloors />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 1.1.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧩</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.1</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>The Five Functional Units</div>
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
