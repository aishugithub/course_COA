// Unit2_6.jsx — Module 2 › Unit 2.6 — "Multiple-Bus Organization"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 4 (Bus Organization, Hamacher §5.2–5.4).
// Arc: the single-bus bottleneck (the Y-shuffle from Unit 2.5) → single-bus
// recap → the three-bus datapath (both operands at once) → cycles saved
// (re-trace Add R4,R2,R3: 3 beats → 1) + who builds which → quiz.
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
//  Section 1 — The Need: one bus is a bottleneck
// ══════════════════════════════════════════════════════════════════
function TheBottleneck() {
  const [lit, setLit] = useState(0); // how many operands "want" the bus at once

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In Unit 2.5 a simple add took several beats — we had to park one operand in <strong style={{ color: C.teal }}>Y</strong>,
        send the second across, then send the result back. All that shuffling exists for one reason: on a single bus,
        <strong style={{ color: C.text }}> only one value can travel at a time</strong>. Try to send both operands together.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 150" style={{ width: "100%", display: "block" }}>
          <line x1={40} y1={75} x2={480} y2={75} stroke={lit > 1 ? C.red : C.accent} strokeWidth={6} />
          <text x={260} y={60} textAnchor="middle" fill={lit > 1 ? C.red : C.accent} fontSize={11} fontWeight="700">
            {lit > 1 ? "two values collide — impossible!" : "single bus"}
          </text>
          {/* R2 */}
          <rect x={60} y={95} width={90} height={34} rx={6} fill={lit >= 1 ? C.teal + "1E" : C.card} stroke={lit >= 1 ? C.teal : C.border} strokeWidth={1.8} />
          <text x={105} y={117} textAnchor="middle" fill={lit >= 1 ? C.teal : C.muted} fontSize={12} fontWeight="700">R2 = 5</text>
          {lit >= 1 && <line x1={105} y1={95} x2={105} y2={75} stroke={C.teal} strokeWidth={2} />}
          {/* R3 */}
          <rect x={370} y={95} width={90} height={34} rx={6} fill={lit >= 2 ? C.purple + "1E" : C.card} stroke={lit >= 2 ? C.purple : C.border} strokeWidth={1.8} />
          <text x={415} y={117} textAnchor="middle" fill={lit >= 2 ? C.purple : C.muted} fontSize={12} fontWeight="700">R3 = 3</text>
          {lit >= 2 && <line x1={415} y1={95} x2={415} y2={75} stroke={C.purple} strokeWidth={2} />}
        </svg>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={() => setLit(v => Math.min(2, v + 1))} disabled={lit === 2} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: lit === 2 ? C.card : C.accentGlow, color: lit === 2 ? C.muted : "#fff",
          cursor: lit === 2 ? "default" : "pointer",
        }}>Put an operand on the bus ▶ ({lit} / 2)</button>
        <button onClick={() => setLit(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <div style={{ background: lit > 1 ? C.red + "12" : C.card, border: `1px solid ${lit > 1 ? C.red : C.border}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>
        {lit === 0 ? "The add needs R2 AND R3 at the ALU. Start sending them."
          : lit === 1 ? "One operand rides the bus. The other must wait its turn — hence register Y."
            : <span>✗ Both at once is a collision — the single bus physically can't carry two values. That's the bottleneck. <strong style={{ color: C.red }}>The fix isn't a trick; it's more buses.</strong></span>}
      </div>

      <Key color={C.accent}>
        A single bus forces a register-to-register add into several beats because operands must queue. The question of this unit:
        <strong style={{ color: C.text }}> what if the datapath had more than one bus</strong>, so both operands could reach the
        ALU in the same tick?
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Single-bus recap (one shared highway)
// ══════════════════════════════════════════════════════════════════
function SingleBusRecap() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Before adding buses, pin down the one we have. In the <strong style={{ color: C.accent }}>single-bus</strong>
        organization every register and the ALU hang off one shared highway; memory is reached through MAR/MDR. Reveal its
        one defining rule.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 130" style={{ width: "100%", display: "block" }}>
          <line x1={40} y1={70} x2={480} y2={70} stroke={C.accent} strokeWidth={5} />
          {[["Regs", 90, C.teal], ["ALU", 200, C.purple], ["MDR", 310, C.yellow], ["MAR", 420, C.yellow]].map(([lbl, x, col]) => (
            <g key={lbl}>
              <rect x={x - 40} y={40} width={80} height={28} rx={6} fill={C.card} stroke={col} strokeWidth={1.6} />
              <text x={x} y={58} textAnchor="middle" fill={col} fontSize={11} fontWeight="700">{lbl}</text>
              <line x1={x} y1={70} x2={x} y2={68} stroke={C.border} strokeWidth={1.5} />
            </g>
          ))}
          {show && <text x={260} y={104} textAnchor="middle" fill={C.yellow} fontSize={13} fontWeight="700">only ONE value on the bus per clock</text>}
        </svg>
      </div>

      <button onClick={() => setShow(s => !s)} style={{
        width: "100%", padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
        background: C.accentGlow, color: "#fff", cursor: "pointer", marginBottom: 12,
      }}>{show ? "↺ Hide" : "Reveal the defining rule ▶"}</button>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        Cheap and simple: few wires, one driver active at a time. But that single lane is the price — an ALU operation spreads
        across several clocks, and every memory access is <code style={{ fontFamily: "monospace" }}>register → MDR → memory</code>,
        addressed by MAR.
      </div>

      <Key color={C.yellow}>
        <strong style={{ color: C.yellow }}>One bus = one transfer per clock.</strong> Minimal hardware, maximal beats. Great for
        tiny, cost-sensitive chips; a bottleneck when you want speed. The three-bus design attacks exactly this rule.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The three-bus datapath (both operands at once)
// ══════════════════════════════════════════════════════════════════
function ThreeBus() {
  const [reveal, setReveal] = useState(0); // 0..3

  const notes = [
    "Bus A carries the FIRST operand from the register file to the ALU.",
    "Bus B carries the SECOND operand at the same time — the ALU now sees both inputs in one tick.",
    "Bus C carries the result straight back to the register file. Read both, compute, write — one step.",
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The fix: give the datapath <strong style={{ color: C.green }}>three</strong> buses. Two feed the ALU, one returns the
        result. No more Y-shuffle — both operands arrive together. Reveal the buses one at a time.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 200" style={{ width: "100%", display: "block" }}>
          {/* register file */}
          <rect x={40} y={70} width={110} height={70} rx={10} fill={C.card} stroke={C.teal} strokeWidth={1.8} />
          <text x={95} y={100} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">Register</text>
          <text x={95} y={116} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">file</text>
          {/* ALU */}
          <polygon points="360,72 430,100 430,140 360,168" fill={C.accent + "1E"} stroke={C.accent} strokeWidth={1.8} />
          <text x={390} y={124} textAnchor="middle" fill={C.accent} fontSize={12} fontWeight="700">ALU</text>
          {/* Bus A */}
          <g opacity={reveal >= 1 ? 1 : 0.18} style={{ transition: "opacity 0.3s" }}>
            <line x1={150} y1={90} x2={360} y2={90} stroke={C.green} strokeWidth={4} />
            <text x={255} y={82} textAnchor="middle" fill={C.green} fontSize={11} fontWeight="700">Bus A — operand 1</text>
          </g>
          {/* Bus B */}
          <g opacity={reveal >= 2 ? 1 : 0.18} style={{ transition: "opacity 0.3s" }}>
            <line x1={150} y1={125} x2={360} y2={125} stroke={C.yellow} strokeWidth={4} />
            <text x={255} y={145} textAnchor="middle" fill={C.yellow} fontSize={11} fontWeight="700">Bus B — operand 2</text>
          </g>
          {/* Bus C */}
          <g opacity={reveal >= 3 ? 1 : 0.18} style={{ transition: "opacity 0.3s" }}>
            <path d="M 430 120 L 470 120 L 470 185 L 95 185 L 95 142" stroke={C.purple} strokeWidth={4} fill="none" markerEnd="url(#u26c)" />
            <text x={255} y={178} textAnchor="middle" fill={C.purple} fontSize={11} fontWeight="700">Bus C — result back to registers</text>
          </g>
          <defs><marker id="u26c" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.purple} /></marker></defs>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6, marginBottom: 10 }}>
        {reveal === 0 ? "Press Reveal to add the buses." : notes[reveal - 1]}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setReveal(v => Math.min(3, v + 1))} disabled={reveal === 3} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: reveal === 3 ? C.card : C.accentGlow, color: reveal === 3 ? C.muted : "#fff",
          cursor: reveal === 3 ? "default" : "pointer",
        }}>Reveal bus ▶ ({reveal} / 3)</button>
        <button onClick={() => setReveal(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.green}>
        <strong style={{ color: C.green }}>Bus A</strong> + <strong style={{ color: C.yellow }}>Bus B</strong> carry both operands
        to the ALU simultaneously; <strong style={{ color: C.purple }}>Bus C</strong> returns the result. Read → compute →
        write-back collapse into <strong style={{ color: C.text }}>one step</strong> — no interstage Y needed.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Cycles saved: re-trace Add R4, R2, R3
// ══════════════════════════════════════════════════════════════════
function CyclesSaved() {
  const [bus, setBus] = useState("one"); // "one" | "three"

  const single = [
    "R2out, Yin  — Y ← [R2]",
    "R3out, SelectY, Add, Zin  — Z ← [R2]+[R3]",
    "Zout, R4in  — R4 ← [Z]",
  ];
  const three = [
    "R2 on Bus A, R3 on Bus B, ALU adds, result on Bus C → R4",
  ];
  const rows = bus === "one" ? single : three;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Re-trace the same instruction — <code style={{ color: C.purple, fontFamily: "monospace" }}>Add R4, R2, R3</code> — on each
        datapath and count the beats. Toggle between them.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["one", "Single bus", C.orange], ["three", "Three buses", C.green]].map(([k, label, col]) => (
          <button key={k} onClick={() => setBus(k)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: bus === k ? col + "22" : C.card,
            border: `2px solid ${bus === k ? col : C.border}`, color: bus === k ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: bus === "one" ? C.orange : C.green, fontWeight: 800, minWidth: 22 }}>T{i + 1}</span>
            <span style={{ fontFamily: "monospace", fontSize: 12.5, color: C.text }}>{r}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 4, alignItems: "stretch" }}>
        <div style={{ flex: 1, textAlign: "center", background: bus === "one" ? C.orange + "1E" : C.card, border: `2px solid ${bus === "one" ? C.orange : C.border}`, borderRadius: 10, padding: "12px" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: bus === "one" ? C.orange : C.muted }}>3</div>
          <div style={{ fontSize: 11, color: C.muted }}>beats · single bus</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", color: C.muted, fontSize: 20 }}>→</div>
        <div style={{ flex: 1, textAlign: "center", background: bus === "three" ? C.green + "1E" : C.card, border: `2px solid ${bus === "three" ? C.green : C.border}`, borderRadius: 10, padding: "12px" }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: bus === "three" ? C.green : C.muted }}>1</div>
          <div style={{ fontSize: 11, color: C.muted }}>beat · three buses</div>
        </div>
      </div>

      <div style={{ marginTop: 12, background: C.teal + "12", border: `1px solid ${C.teal}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
        <strong style={{ color: C.teal }}>Who builds which?</strong> The one-step bus datapath lives in cost-sensitive chips —
        older CISC and today's tiny microcontrollers inside <strong style={{ color: C.text }}>IoT nodes</strong>, where chip area
        and power matter more than raw speed. The five-stage RISC pipeline (Module 3) wraps this same block for throughput.
      </div>

      <Key color={C.green}>
        More buses buy fewer clocks: a register-to-register op drops from ~3 beats to <strong style={{ color: C.text }}>1</strong>.
        The cost is more wiring and drivers. It's a classic <strong style={{ color: C.text }}>speed-vs-hardware</strong> trade — not
        old vs new.
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
      q: "Why does a register-to-register add take several beats on a single-bus datapath?",
      options: [
        "The ALU is slow",
        "Only one value can be on the bus per clock, so operands must be sent one at a time (via Y)",
        "Registers can't be read twice",
        "Memory is involved in every add",
      ],
      answer: 1,
      explain: "A single bus carries one value per clock. The two operands must queue — one is parked in Y, then the second travels the bus, then the result is sent back — spreading the add over multiple beats.",
    },
    {
      q: "In a three-bus datapath, what do Bus A and Bus B do?",
      options: [
        "Carry the address and data to memory",
        "Carry both ALU operands to the ALU at the same time",
        "Both carry the result back",
        "One carries the opcode, one the operand",
      ],
      answer: 1,
      explain: "Bus A and Bus B feed the two ALU inputs simultaneously, so the ALU sees both operands in one tick. Bus C then returns the result to the register file.",
    },
    {
      q: "Re-traced on a three-bus datapath, Add R4, R2, R3 takes how many beats?",
      options: ["Three", "Two", "One", "Five"],
      answer: 2,
      explain: "R2 on Bus A, R3 on Bus B, ALU adds, result on Bus C into R4 — all in a single step. The single-bus version needed three beats because of the one-value-per-clock limit.",
    },
    {
      q: "What is the trade-off of adding more buses?",
      options: [
        "Slower operations but simpler wiring",
        "Fewer clocks per instruction, but more wiring and drivers (hardware cost)",
        "Less memory but more registers",
        "No trade-off — three buses are always better",
      ],
      answer: 1,
      explain: "More buses cut the clocks per operation but cost more wires, drivers and chip area. That's why tiny IoT microcontrollers keep a single bus, while performance chips use more.",
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
          {score === 4 ? "Perfect! You can weigh one bus against three and count the beats each costs." :
            score >= 2 ? "Good work! Replay 'Cycles Saved' to lock in the 3-beats-to-1 contrast." :
              "Revisit 'The Bottleneck' and 'The Three-Bus Datapath' — the whole unit rests on those two."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.6 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now contrast single- vs multiple-bus organization and explain why more buses trade wiring for fewer clocks
            per instruction.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.7 — Microprogrammed Control.</strong>{" "}
            One bus or three, the datapath is just idle wires. Who raises the right control signals, in the right order, every
            single clock?
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
    { id: "bottleneck", label: "The Bottleneck" },
    { id: "single", label: "Single-Bus Recap" },
    { id: "three", label: "Three-Bus Datapath" },
    { id: "cycles", label: "Cycles Saved" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🚦 The Single-Bus Bottleneck</h3>
      <TheBottleneck />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛣️ Single-Bus Recap</h3>
      <SingleBusRecap />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛤️ The Three-Bus Datapath</h3>
      <ThreeBus />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⏳ Cycles Saved — Add R4, R2, R3</h3>
      <CyclesSaved />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.6.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛤️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.6</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Multiple-Bus Organization</div>
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
