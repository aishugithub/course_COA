// Unit3_1.jsx — Module 3 › Unit 3.1 — "The Role of Cache Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Hamacher Ch.6 (Pipelining) §6.3, Fig 6.7 — class notes §3.5.
// SCOPE NOTE: cache appears here ONLY in its role as a source of pipeline
// stalls. General cache hierarchy / mapping / replacement lives in Module 4 —
// do not pull that material in here.
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
//  Section 1 — Why? Every stage assumes its neighbour is always ready
// ══════════════════════════════════════════════════════════════════
function WhyItMatters() {
  const [misses, setMisses] = useState(0); // 0..4, how many of 5 fetches miss

  const cells = Array.from({ length: 5 }, (_, i) => i < misses);
  const cyclesNoMiss = 5;
  const cyclesWithMiss = 5 + misses * 9; // each miss costs ~9 extra cycles

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every single cycle, the pipeline's <strong style={{ color: C.text }}>Fetch</strong> stage assumes the next instruction word
        is sitting right there, one cycle away. That assumption is what "one instruction completes every cycle" is built on. Drag
        the slider — how many of 5 fetches miss the cache and have to go all the way to main memory?
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>cache misses out of 5 fetches = <strong style={{ color: C.red }}>{misses}</strong></label>
        <input type="range" min={0} max={4} value={misses} onChange={(e) => setMisses(Number(e.target.value))} style={{ width: "100%", accentColor: C.red }} />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {cells.map((miss, i) => (
          <div key={i} style={{
            flex: 1, height: 46, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: miss ? C.red : C.green,
            background: miss ? C.red + "18" : C.green + "18", border: `2px solid ${miss ? C.red : C.green}`,
          }}>{miss ? "MISS" : "hit"}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>✅ ALL HITS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>{cyclesNoMiss}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>cycles for 5 fetches</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>❌ WITH MISSES</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>{cyclesWithMiss}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>cycles for the same 5 fetches</div>
        </div>
      </div>

      <Key color={C.red}>
        A cache miss doesn't just slow the instruction that missed — it stalls <strong style={{ color: C.text }}>every stage behind
        it</strong> too, because they have nothing to work on. One miss can cost as much as <strong style={{ color: C.red }}>10 or
        more cycles</strong> — far worse than any data or branch hazard you've seen so far.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy: hit path vs miss path
// ══════════════════════════════════════════════════════════════════
function HitOrMiss() {
  const [path, setPath] = useState("hit");
  const isHit = path === "hit";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every Fetch (and every Load/Store in the Memory stage) asks the cache for a word. Two things can happen. Toggle between
        them.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setPath("hit")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: isHit ? C.green + "22" : C.card, border: `2px solid ${isHit ? C.green : C.border}`, color: isHit ? C.green : C.muted,
        }}>✅ Cache HIT</button>
        <button onClick={() => setPath("miss")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !isHit ? C.red + "22" : C.card, border: `2px solid ${!isHit ? C.red : C.border}`, color: !isHit ? C.red : C.muted,
        }}>❌ Cache MISS</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 16px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 90" style={{ width: "100%", display: "block" }}>
          <rect x={10} y={20} width={120} height={50} rx={8} fill={C.card} stroke={C.accent} strokeWidth={1.8} />
          <text x={70} y={50} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.accent}>Fetch / Memory</text>
          <rect x={200} y={20} width={110} height={50} rx={8} fill={isHit ? C.green + "18" : C.card} stroke={isHit ? C.green : C.border} strokeWidth={1.8} />
          <text x={255} y={50} textAnchor="middle" fontSize={11} fontWeight="700" fill={isHit ? C.green : C.muted}>Cache</text>
          <line x1={130} y1={45} x2={198} y2={45} stroke={C.border} strokeWidth={1.8} markerEnd="url(#a1)" />
          {isHit
            ? <>
                <line x1={310} y1={45} x2={400} y2={45} stroke={C.green} strokeWidth={2.2} markerEnd="url(#a2)" />
                <text x={355} y={30} textAnchor="middle" fontSize={9.5} fill={C.green} fontWeight="700">1 cycle</text>
                <rect x={400} y={20} width={110} height={50} rx={8} fill={C.green + "18"} stroke={C.green} strokeWidth={1.8} />
                <text x={455} y={50} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.green}>Pipeline moves on</text>
              </>
            : <>
                <line x1={310} y1={45} x2={400} y2={45} stroke={C.red} strokeWidth={2.2} strokeDasharray="4 3" markerEnd="url(#a3)" />
                <text x={355} y={30} textAnchor="middle" fontSize={9.5} fill={C.red} fontWeight="700">10+ cycles</text>
                <rect x={400} y={20} width={110} height={50} rx={8} fill={C.red + "18"} stroke={C.red} strokeWidth={1.8} />
                <text x={455} y={44} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.red}>Main</text>
                <text x={455} y={58} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.red}>memory</text>
              </>}
          <defs>
            <marker id="a1" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.border} /></marker>
            <marker id="a2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.green} /></marker>
            <marker id="a3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.red} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {isHit
          ? <span>The word is already in the small, fast cache. It comes back in about <strong style={{ color: C.green }}>one cycle</strong> — the pipeline never even notices.</span>
          : <span>The word isn't in the cache. The request has to go all the way to main memory, which is far slower — the whole pipeline sits idle waiting for it to come back.</span>}
      </div>

      <Key color={C.accent}>
        This lesson never asks <em>why</em> a word is or isn't in the cache — that's a whole module of its own (mapping, hit/miss
        rate, replacement policy — Module 4). Here, all that matters is: a miss is a stall, and it can hit at Fetch <em>or</em> at
        Memory.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace: a Load misses, everything behind it waits (Fig 6.7)
// ══════════════════════════════════════════════════════════════════
function MissTrace() {
  const steps = [
    { cyc: 1, note: "Cycle 1 — Iⱼ (a Load) is fetched normally.", ij: "F", ij1: "" },
    { cyc: 2, note: "Cycle 2 — Iⱼ decodes; Iⱼ₊₁ is fetched right behind it.", ij: "D", ij1: "F" },
    { cyc: 3, note: "Cycle 3 — Iⱼ computes its address; Iⱼ₊₁ decodes.", ij: "C", ij1: "D" },
    { cyc: 4, note: "Cycle 4 — Iⱼ enters Memory and… misses the cache. Iⱼ₊₁ has nowhere to go — it stalls.", ij: "M-miss", ij1: "stall" },
    { cyc: 5, note: "Cycle 5 — still waiting on main memory. Iⱼ₊₁ is still stalled.", ij: "M-miss", ij1: "stall" },
    { cyc: 6, note: "Cycle 6 — the word finally arrives. Iⱼ's Memory stage completes.", ij: "M-miss", ij1: "stall" },
    { cyc: 7, note: "Cycle 7 — Iⱼ writes back; Iⱼ₊₁ can finally move into Compute.", ij: "W", ij1: "C" },
  ];
  const [i, setI] = useState(0);
  const s = steps[i];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Step through a Load that misses the cache (a 3-cycle miss, shown compressed — real misses often cost more). Watch every
        instruction behind it freeze, exactly like a data hazard's bubbles, except the stall here comes from <strong style={{ color: C.text }}>memory</strong>, not a register dependency.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 90, fontSize: 12, color: C.muted, fontFamily: "monospace" }}>Iⱼ: Load</div>
          <div style={{
            flex: 1, padding: "8px", borderRadius: 6, textAlign: "center", fontWeight: 700, fontSize: 12,
            background: s.ij.includes("miss") ? C.red + "22" : C.accent + "22",
            color: s.ij.includes("miss") ? C.red : C.accent, border: `1.5px solid ${s.ij.includes("miss") ? C.red : C.accent}`,
          }}>{s.ij}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 90, fontSize: 12, color: C.muted, fontFamily: "monospace" }}>Iⱼ₊₁</div>
          <div style={{
            flex: 1, padding: "8px", borderRadius: 6, textAlign: "center", fontWeight: 700, fontSize: 12,
            background: s.ij1 === "stall" ? "transparent" : C.teal + "22",
            color: s.ij1 === "stall" ? C.red : C.teal,
            border: `1.5px dashed ${s.ij1 === "stall" ? C.red : C.teal}`,
          }}>{s.ij1 === "stall" ? "waiting…" : s.ij1 || "not fetched yet"}</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 44, lineHeight: 1.6, marginBottom: 10 }}>
        {s.note}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.muted,
          cursor: i === 0 ? "default" : "pointer", fontWeight: 700, fontSize: 13, opacity: i === 0 ? 0.5 : 1,
        }}>↺ Back</button>
        <button onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))} disabled={i === steps.length - 1} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", background: C.accentGlow, color: "#fff",
          cursor: i === steps.length - 1 ? "default" : "pointer", fontWeight: 700, fontSize: 13, opacity: i === steps.length - 1 ? 0.5 : 1,
        }}>Step ▶ ({i + 1} / {steps.length})</button>
      </div>

      <Key color={C.red}>
        A cache miss on <strong>Fetch</strong> stalls every stage behind it, exactly like this — the whole pipeline is only ever as
        fast as the slowest thing it's waiting on.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Numbers: how much does the miss term really cost?
// ══════════════════════════════════════════════════════════════════
function DoTheMath() {
  const [memPct, setMemPct] = useState(30);   // % of instructions that touch memory
  const [missPct, setMissPct] = useState(10); // miss rate
  const [penalty, setPenalty] = useState(10); // cycles per miss

  const delta = ((memPct / 100) * (missPct / 100) * penalty).toFixed(2);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The average cycles-per-instruction, S, is 1 (ideal) plus a penalty term for every kind of stall. The cache term —
        <span className="mono"> δ_miss</span> — is usually the <strong style={{ color: C.text }}>biggest</strong> of the three (stall,
        branch, miss). Try the sliders.
      </p>

      {[
        { label: "% instructions that touch memory", val: memPct, set: setMemPct, min: 0, max: 100, color: C.teal },
        { label: "cache miss rate (%)", val: missPct, set: setMissPct, min: 0, max: 50, color: C.red },
        { label: "cycles lost per miss", val: penalty, set: setPenalty, min: 1, max: 30, color: C.orange },
      ].map((s, idx) => (
        <div key={idx} style={{ marginBottom: 14 }}>
          <label style={{ color: C.muted, fontSize: 12 }}>{s.label} = <strong style={{ color: s.color }}>{s.val}{s.label.includes("%") ? "%" : ""}</strong></label>
          <input type="range" min={s.min} max={s.max} value={s.val} onChange={(e) => s.set(Number(e.target.value))} style={{ width: "100%", accentColor: s.color }} />
        </div>
      ))}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, marginBottom: 6 }}>δ_miss = (mem% × miss% ) × penalty</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.red }}>+{delta} cycles / instruction</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>added on top of the ideal S = 1</div>
      </div>

      <Key color={C.yellow}>
        Even a modest 10% miss rate on 30% of instructions, at a 10-cycle penalty, adds <strong style={{ color: C.red }}>0.30</strong> to
        S — often more than the data-hazard and branch-hazard terms combined. This is why real processors invest so heavily in
        cache design (again — Module 4's job, not this lesson's).
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
      q: "Why does a cache miss stall the pipeline?",
      options: [
        "It doesn't — caches never affect pipeline timing",
        "Main memory is far slower than the cache, so the stage that missed — and every stage behind it — has nothing to do until the word arrives",
        "The ALU has to recompute the address",
        "It only affects the Decode stage",
      ],
      answer: 1,
      explain: "A hit returns a word in about a cycle from the fast cache. A miss must go to slow main memory — 10+ cycles — during which the stage that missed, and everything behind it in the pipeline, is stalled.",
    },
    {
      q: "In the five-stage pipeline, which stages can suffer a cache miss?",
      options: [
        "Only Fetch",
        "Only Memory",
        "Both Fetch (fetching instructions) and Memory (loads/stores)",
        "Only Decode",
      ],
      answer: 2,
      explain: "Fetch reads every instruction word from the cache every cycle; Memory reads/writes operands for Load/Store instructions. A miss in either stage stalls the pipeline.",
    },
    {
      q: "In this unit, what is explicitly OUT of scope?",
      options: [
        "That a cache miss causes a stall",
        "Cache mapping, hit/miss-rate mechanics, and replacement policy — that belongs to a later module on memory organization",
        "That the Memory stage can also miss",
        "That the stall behaves like a hazard bubble",
      ],
      answer: 1,
      explain: "This unit only covers cache's role in causing pipeline stalls. How the cache decides what to keep, how it's organized, and its hit-rate mechanics are a separate module.",
    },
    {
      q: "A program has 40% memory-touching instructions, a 5% miss rate, and a 20-cycle miss penalty. What is δ_miss?",
      options: ["0.40 cycles", "0.04 cycles", "2.0 cycles", "8.0 cycles"],
      answer: 0,
      explain: "δ_miss = 0.40 × 0.05 × 20 = 0.40 cycles added to S per instruction, on average.",
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
          {score === 4 ? "Perfect! You know exactly when and why a cache miss stalls a pipeline." :
            score >= 2 ? "Good work! Replay 'Hit or Miss' and 'Do the Math' to lock in the mechanism." :
              "Revisit 'Why It Matters' and the trace — a miss is just a very long stall."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now explain why a cache miss stalls the pipeline, where it can happen, and roughly how much it costs.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.2 — The Pipeline Idea &amp; Performance.</strong> Time to formalize
            exactly how many cycles pipelining saves — and put real numbers on the speedup.
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
export default function Unit3_1({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Why It Matters" },
    { id: "hitmiss", label: "Hit or Miss" },
    { id: "trace", label: "Trace a Miss" },
    { id: "math", label: "Do the Math" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⏳ Why It Matters — the pipeline's silent assumption</h3><WhyItMatters /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🎯 Hit or Miss — two very different outcomes</h3><HitOrMiss /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🔍 Trace a Miss — everyone behind it waits</h3><MissTrace /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🧮 Do the Math — the δ_miss term</h3><DoTheMath /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.1.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › UNIT 3.1</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>The Role of Cache Memory</div>
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
