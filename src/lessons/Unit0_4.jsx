// Unit0_4.jsx — Module 0 › Unit 0.4 — "The Von Neumann Model"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, key-insight callouts, 4-question quiz.
// Arc: the stored-program leap (von Neumann) → then what the transistor made of
// it — the physical shrink, the four generations, Moore's law, and memory.
// (Mirrors classroom deck slides on stored-program + slides 45–48.)
import { useState } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};

// ── shared key-insight callout ──
function Key({ color = C.purple, children }) {
  return (
    <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
      🔑 {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Stored-Program Idea (von Neumann)
// ══════════════════════════════════════════════════════════════════
function StoredProgramWidget() {
  const [op, setOp] = useState("ADD");
  const a = 5, b = 3;
  const ops = { ADD: { sym: "+", val: a + b }, SUB: { sym: "−", val: a - b }, MUL: { sym: "×", val: a * b } };
  const [rewiring, setRewiring] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        ENIAC could compute — but to change <em>what</em> it computed, engineers rewired it by hand for
        days. Von Neumann's fix: keep the instruction in memory as just another number. Compare the two
        machines.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Hard-wired machine */}
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>❌ HARD-WIRED (ENIAC)</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>
            The operation is built into the cables. To switch tasks you physically re-plug the machine.
          </div>
          <button onClick={() => { setRewiring(true); setTimeout(() => setRewiring(false), 1400); }} style={{
            width: "100%", padding: "9px", borderRadius: 8, border: `1px solid ${C.red}55`, cursor: "pointer",
            background: C.red + "18", color: C.red, fontWeight: 600, fontSize: 12,
          }}>{rewiring ? "Rewiring… unplugging 27 cables…" : "Change the task →"}</button>
          {rewiring && <div style={{ marginTop: 8, fontSize: 11, color: C.muted }}>…2–3 days of work per change.</div>}
        </div>

        {/* Stored-program machine */}
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ STORED-PROGRAM</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 10 }}>
            The instruction lives in memory. Change the task by changing one number — instantly.
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {Object.keys(ops).map((o) => (
              <button key={o} onClick={() => setOp(o)} style={{
                flex: 1, padding: "6px", borderRadius: 7, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12,
                background: op === o ? C.green : C.bg, color: op === o ? "#0D1117" : C.muted,
              }}>{o}</button>
            ))}
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", fontFamily: "monospace", fontSize: 13, color: C.text, textAlign: "center" }}>
            mem: [ {a} | {b} | <span style={{ color: C.green }}>{op}</span> ] → {a} {ops[op].sym} {b} = <strong style={{ color: C.green }}>{ops[op].val}</strong>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
        📜 <strong style={{ color: C.purple }}>Where this comes from:</strong> von Neumann set it down in the
        1945 <em>First Draft of a Report on the EDVAC</em>. <strong style={{ color: C.text }}>EDVAC</strong> (1949)
        was among the first machines to actually keep its program in memory — the "von Neumann architecture"
        that every computer since, including the one you're reading this on, still follows.
      </div>

      <Key color={C.green}>
        This is the whole idea of the machine you're about to study: instructions are just numbers in
        memory, sitting next to the data. One fixed piece of hardware can run any program — you only
        change the numbers.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Physical Shrink (deck slide 45)
// ══════════════════════════════════════════════════════════════════
function ShrinkWidget() {
  const B = "/course_COA/"; // matches vite.config base → serves public/shrink/* (avoids import.meta)
  const stages = [
    { name: "Half adder — breadboard", what: "~20 transistors, wired by hand", size: "a whole board (~15 cm)", img: "shrink/half-adder-breadboard.jpg", col: C.teal },
    { name: "Full adder — breadboard", what: "~40 transistors, even more wires", size: "an even bigger board", img: "shrink/full-adder-breadboard.jpg", col: C.teal },
    { name: "Full adder — one IC", what: "the same circuit grown on silicon", size: "a chip on your fingertip", img: "shrink/full-adder-ic.jpg", col: C.purple },
    { name: "A board of ICs", what: "many ICs, each one job → a processor", size: "a board of chips", img: "shrink/many-ics-processor.jpg", col: C.purple },
    { name: "VLSI microprocessor", what: "billions of transistors on one die", size: "held between two fingers", img: "shrink/microprocessor.jpg", col: C.green },
  ];
  const [i, setI] = useState(0);
  const s = stages[i];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Same logic, shrinking hardware. The exact full adder you built goes from a board you can touch to a
        speck between your fingers. Step through the real hardware and watch it collapse.
      </p>

      {/* main photo for the current stage */}
      <div style={{ background: C.card, border: `1.5px solid ${s.col}55`, borderRadius: 12, padding: 10, textAlign: "center" }}>
        <img src={B + s.img} alt={s.name} style={{ maxWidth: "100%", maxHeight: 260, borderRadius: 8, display: "block", margin: "0 auto", objectFit: "contain" }} />
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginTop: 8 }}>STAGE {i + 1} OF {stages.length}</div>
        <div style={{ color: s.col, fontWeight: 800, fontSize: 16 }}>{s.name}</div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{s.what} · <span style={{ color: C.text }}>{s.size}</span></div>
      </div>

      {/* clickable thumbnail filmstrip */}
      <div style={{ display: "flex", gap: 6, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {stages.map((st, j) => (
          <button key={j} onClick={() => setI(j)} title={st.name} style={{
            padding: 0, borderRadius: 8, cursor: "pointer", overflow: "hidden", lineHeight: 0,
            border: `2px solid ${j === i ? st.col : C.border}`, background: C.card,
            opacity: j === i ? 1 : 0.55, transition: "all 0.2s",
          }}>
            <img src={B + st.img} alt={st.name} style={{ width: 62, height: 46, objectFit: "cover", display: "block" }} />
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button onClick={() => setI(Math.min(stages.length - 1, i + 1))} disabled={i >= stages.length - 1}
          style={{ padding: "9px 20px", borderRadius: 8, background: i >= stages.length - 1 ? C.border : C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: i >= stages.length - 1 ? "default" : "pointer" }}>
          Shrink ▶ ({i + 1} / {stages.length})
        </button>
        <button onClick={() => setI(0)} style={{ padding: "9px 16px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>↺ Reset</button>
      </div>

      <Key color={C.green}>
        The circuit never changed — only its size. Breadboard → IC → VLSI. That shrink is exactly what the
        "four generations" of computers are made of.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The Four Generations (deck slide 46)
// ══════════════════════════════════════════════════════════════════
function GenerationsWidget() {
  const gens = [
    { g: "1st", years: "1945–1955", tech: "Vacuum tubes", brought: "The stored-program concept; assembly language.", col: C.red },
    { g: "2nd", years: "1955–1965", tech: "Transistors", brought: "Smaller, faster gates; high-level languages (Fortran).", col: C.orange },
    { g: "3rd", years: "1965–1975", tech: "Integrated Circuits", brought: "Many transistors per chip; pipelining & cache ideas — Modules 3 & 4!", col: C.yellow },
    { g: "4th", years: "1975–now", tech: "VLSI", brought: "Billions of transistors → the microprocessor in your pocket.", col: C.green },
  ];
  const [sel, setSel] = useState(0);
  const d = gens[sel];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Each generation swapped the switch for a smaller, faster one — and each unlocked a new idea. Click a
        generation to see its technology and what it brought.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {gens.map((x, i) => (
          <button key={i} onClick={() => setSel(i)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10, cursor: "pointer",
            border: `2px solid ${sel === i ? x.col : C.border}`, background: sel === i ? x.col + "22" : C.card,
            color: sel === i ? x.col : C.muted, fontWeight: 800,
          }}>
            <div style={{ fontSize: 16 }}>{x.g}</div>
            <div style={{ fontSize: 10, marginTop: 2 }}>{x.years.split("–")[0]}</div>
          </button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${d.col}55`, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ color: d.col, fontWeight: 800, fontSize: 15 }}>{d.g} generation · {d.years}</div>
        <div style={{ color: C.text, fontSize: 14, margin: "6px 0" }}>Switch technology: <strong>{d.tech}</strong></div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>What it brought: {d.brought}</div>
      </div>

      <Key color={C.purple}>
        Notice what evolved: the <strong>organization</strong> (the hardware). The <strong>architecture</strong>
        {" "}— the stored-program blueprint — is the same dream since 1945.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Moore's Law (deck slide 47)
// ══════════════════════════════════════════════════════════════════
function MooreWidget() {
  const pts = [
    { y: 1971, n: 2300, label: "Intel 4004" },
    { y: 1989, n: 1200000, label: "Intel 486" },
    { y: 2008, n: 1000000000, label: "Core i7" },
    { y: 2024, n: 100000000000, label: "Apple M-series" },
  ];
  const [i, setI] = useState(0);
  const p = pts[i];
  const fmt = (n) => (n >= 1e9 ? n / 1e9 + " B" : n >= 1e6 ? n / 1e6 + " M" : n.toLocaleString());
  const barH = (n) => 20 + (Math.log10(n) / Math.log10(1e11)) * 150;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Moore's law: the number of transistors on a chip roughly <strong style={{ color: C.text }}>doubles
        every two years</strong>. Slide through the decades and watch the count climb.
      </p>

      <svg viewBox="0 0 320 220" style={{ width: "100%", maxWidth: 420, display: "block", margin: "0 auto" }}>
        <line x1={38} y1={12} x2={38} y2={188} stroke={C.muted} strokeWidth={1} />
        <line x1={38} y1={188} x2={312} y2={188} stroke={C.muted} strokeWidth={1} />
        <text x={10} y={22} fill={C.muted} fontSize={9}>count</text>
        <text x={10} y={33} fill={C.muted} fontSize={8}>(log)</text>
        {pts.map((q, j) => {
          const bx = 56 + j * 64;
          const h = barH(q.n);
          return (
            <g key={j} opacity={j <= i ? 1 : 0.28}>
              <rect x={bx} y={188 - h} width={46} height={h} rx={4} fill={j === i ? C.accent + "66" : C.card} stroke={j === i ? C.accent : C.border} strokeWidth={1.5} />
              <text x={bx + 23} y={204} fill={C.muted} fontSize={10} textAnchor="middle">{q.y}</text>
              <text x={bx + 23} y={184 - h} fill={j === i ? C.accent : C.muted} fontSize={10} fontWeight="700" textAnchor="middle">{fmt(q.n)}</text>
            </g>
          );
        })}
      </svg>

      <input type="range" min={0} max={pts.length - 1} value={i} onChange={(e) => setI(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ textAlign: "center", color: C.accent, fontWeight: 700, fontSize: 14, marginTop: 4 }}>
        {p.y} · {p.label} · {fmt(p.n)} transistors
      </div>

      <Key color={C.yellow}>
        The axis is logarithmic — a straight climb means <strong>exponential</strong> growth. Moore's law
        isn't a law of physics but an economic target the industry hit for 60 years… and it's now slowing,
        which is why <strong>architecture</strong> matters more than ever.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Memory Needed a Switch Too (deck slide 48)
// ══════════════════════════════════════════════════════════════════
function MemoryWidget() {
  const [mode, setMode] = useState("core");
  const core = mode === "core";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Logic gates got a better switch — but <strong style={{ color: C.text }}>memory</strong> needed its own.
        Compare the two ways a single bit has been stored.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("core")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${core ? C.yellow : C.border}`, background: core ? C.yellow + "22" : C.card, color: core ? C.yellow : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Magnetic core (1950s)</button>
        <button onClick={() => setMode("dram")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `2px solid ${!core ? C.green : C.border}`, background: !core ? C.green + "22" : C.card, color: !core ? C.green : C.muted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Transistor DRAM / SRAM</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", minHeight: 110 }}>
        {core ? (
          <div>
            <div style={{ color: C.yellow, fontWeight: 800, marginBottom: 6 }}>🧲 Magnetic-core memory</div>
            <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
              Each bit = the magnetisation direction of a tiny iron ring, <strong style={{ color: C.text }}>hand-threaded</strong>
              {" "}one ring per bit. Workers literally wove Apollo's memory by hand.
            </div>
          </div>
        ) : (
          <div>
            <div style={{ color: C.green, fontWeight: 800, marginBottom: 6 }}>🔲 Transistor memory (DRAM / SRAM)</div>
            <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
              The same one bit, shrunk to one of <strong style={{ color: C.text }}>billions of cells</strong> etched on a
              chip — no hands, no wires. The full story is Module 4.
            </div>
          </div>
        )}
      </div>

      <Key color={C.green}>
        Same idea as logic: whatever switch technology wins, memory rides the same shrink. One hand-threaded
        ring became billions of microscopic cells.
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
      q: "What is von Neumann's stored-program idea?",
      options: [
        "Build the operation into the machine's cables",
        "Keep the instructions in memory as numbers, alongside the data",
        "Give every problem its own dedicated machine",
        "Use vacuum tubes instead of relays",
      ],
      answer: 1,
      explain: "Instructions are just numbers in memory. Changing the program means loading different numbers — no rewiring. One machine, infinite programs.",
    },
    {
      q: "A full adder goes from a breadboard to a VLSI chip. What actually changes?",
      options: [
        "The logic — it computes something different",
        "Nothing, they are identical in every way",
        "Only the size and packaging — the logic is exactly the same",
        "The number of inputs it accepts",
      ],
      answer: 2,
      explain: "Same gates, same truth table — only the physical size collapses. Breadboard → IC → VLSI is a shrink, not a redesign.",
    },
    {
      q: "Which switching technology defines the 3rd generation of computers?",
      options: ["Vacuum tubes", "Relays", "Integrated circuits", "VLSI microprocessors"],
      answer: 2,
      explain: "1st = vacuum tubes, 2nd = transistors, 3rd = integrated circuits (many transistors per chip), 4th = VLSI (the microprocessor).",
    },
    {
      q: "What does Moore's law describe?",
      options: [
        "Transistors get twice as fast every year",
        "The number of transistors per chip roughly doubles every two years",
        "Memory doubles in price every decade",
        "A physical limit that can never be crossed",
      ],
      answer: 1,
      explain: "Moore's law is the observation that transistor count per chip doubles about every two years — an economic target, not a law of physics, and now slowing.",
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
          {score === 4 ? "Perfect — the stored-program idea and the whole chip era, locked in."
            : score >= 2 ? "Solid. Replay the Generations or Moore's Law tab to sharpen the details."
              : "Worth another pass — revisit the Shrink and Generations tabs, then retry."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55`, textAlign: "left" }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Module 0 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've gone from "why build a computer at all" to the stored-program machine, and watched the
            switch shrink from a clicking relay to billions of transistors on a fingertip.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Module 1 — Basic Structure of Computers.</strong>{" "}
            Now we open the machine: the five functional units, the registers and buses inside, and the
            fetch–execute cycle that actually runs your stored program.
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
export default function Unit0_4({ student, onUnitComplete }) {
  const sections = [
    { id: "stored", label: "Stored Program" },
    { id: "shrink", label: "The Shrink" },
    { id: "gens", label: "Four Generations" },
    { id: "moore", label: "Moore's Law" },
    { id: "memory", label: "Memory" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Instructions become numbers in memory</h3><StoredProgramWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>From a breadboard to a fingertip</h3><ShrinkWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Four generations of computers</h3><GenerationsWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The doubling drumbeat</h3><MooreWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Memory needed a switch too</h3><MemoryWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 0.4.</p>
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💡</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 0 › UNIT 0.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>The Von Neumann Model</div>
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
