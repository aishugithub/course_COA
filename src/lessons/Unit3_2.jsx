// Unit3_2.jsx — Module 3 › Unit 3.2 — "Pipeline Performance"
// REBUILT per Aishu's review: previously this unit ALSO carried the Fig 6.1
// overlap diagram, duplicating Unit 3.1 (which now owns that content). This
// version is pure Chapter 2 of the notes: counting the cycles (Sec 2.1),
// the performance equation T=N.S/R (Sec 2.2), and how many stages (Sec 2.3).
// The cycle-grid diagram here is built more defensively than the previous
// version (fixed-width colgroup + inline-block scroll wrapper) to fix the
// "diagram pushed into the far right corner" rendering bug Aishu reported.
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
//  Section 1 — Why? A serial pipeline STILL isn't free
// ══════════════════════════════════════════════════════════════════
function WhyItMatters() {
  const [n, setN] = useState(4);
  const k = 5;
  const serial = k * n;
  const pipelined = k + (n - 1);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Unit 3.1 showed you WHAT pipelining does — overlap instructions. This unit puts real numbers on exactly
        <strong style={{ color: C.text }}> how much</strong> that overlap buys you. For n instructions on a 5-stage pipeline:
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>n (instructions) = <strong style={{ color: C.accent }}>{n}</strong></label>
        <input type="range" min={1} max={10} value={n} onChange={(e) => setN(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>❌ NO OVERLAP</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>{serial}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>cycles = k × n = 5 × {n}</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>✅ PIPELINED</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>{pipelined}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>cycles = k + (n − 1) = 5 + {n - 1}</div>
        </div>
      </div>

      <Key color={C.green}>
        Even in the best case, the pipelined version still takes 5 cycles to get the FIRST instruction all the way through —
        that ramp-up never disappears. It just matters less and less as n grows.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Playground: k + (n-1) formula and speedup as n grows (Sec 2.1)
// ══════════════════════════════════════════════════════════════════
function CountTheCycles() {
  const [k, setK] = useState(5);
  const [n, setN] = useState(20);

  const serial = k * n;
  const pipelined = k + (n - 1);
  const speedup = (serial / pipelined).toFixed(2);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        For a <strong style={{ color: C.text }}>k</strong>-stage pipeline running <strong style={{ color: C.text }}>n</strong> independent
        instructions: total time = k + (n − 1) cycles, compared with k × n cycles with no overlap. Try the exact numbers from the
        notes' worked example — k = 5, n = 20.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <div>
          <label style={{ color: C.muted, fontSize: 12 }}>k (stages) = <strong style={{ color: C.orange }}>{k}</strong></label>
          <input type="range" min={2} max={8} value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: "100%", accentColor: C.orange }} />
        </div>
        <div>
          <label style={{ color: C.muted, fontSize: 12 }}>n (instructions) = <strong style={{ color: C.teal }}>{n}</strong></label>
          <input type="range" min={1} max={200} value={n} onChange={(e) => setN(Number(e.target.value))} style={{ width: "100%", accentColor: C.teal }} />
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted }}>no pipeline: k × n</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>{serial}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.muted }}>pipelined: k + (n − 1)</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.green }}>{pipelined}</div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 12, color: C.muted }}>speedup = </span>
          <span style={{ fontSize: 20, fontWeight: 800, color: C.accent }}>{speedup}×</span>
          <span style={{ fontSize: 12, color: C.muted }}> (ideal ceiling: {k}×)</span>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, fontFamily: "monospace" }}>
        k=5, n=20 → 5+19 = 24 cycles vs 5×20 = 100 cycles → 100/24 ≈ 4.17× — the notes' exact worked example. Drag n up toward 200
        and watch the speedup creep toward the ideal 5× — it never quite gets there, but gets close.
      </div>

      <Key color={C.yellow}>
        Speedup <strong style={{ color: C.text }}>approaches k</strong> as n grows large, but never equals it for finite n — the
        k − 1 cycles spent filling (and draining) the pipe are a fixed one-time cost that matters less as n grows, but never
        vanishes completely.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The performance equation T = N·S/R, and throughput (Sec 2.2)
// ══════════════════════════════════════════════════════════════════
function PerformanceEquation() {
  const [N, setN] = useState(1000);
  const [S, setS] = useState(1.4);
  const [R, setR] = useState(2);

  const T = (N * S / (R * 1e9) * 1e6).toFixed(1);
  const throughput = (R * 1e9 / S / 1e6).toFixed(1);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The idea above ("cycles saved by overlap") gets formalized into one equation used for <em>any</em> processor, pipelined
        or not: <strong style={{ color: C.text }}>T = (N × S) / R</strong>, where N is instructions executed, S is average
        cycles per instruction, and R is the clock rate.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", textAlign: "center", marginBottom: 16, fontFamily: "monospace", fontSize: 15, color: C.text }}>
        T = (N × S) / R
        <div style={{ fontSize: 11, color: C.muted, marginTop: 6, fontFamily: "'Segoe UI', sans-serif" }}>N = instruction count · S = avg cycles/instruction · R = clock rate</div>
      </div>

      {[
        { label: "N — instructions executed", val: N, set: setN, min: 100, max: 5000, step: 100, color: C.teal },
        { label: "S — average cycles per instruction", val: S, set: setS, min: 1, max: 5, step: 0.1, color: C.orange },
        { label: "R — clock rate (GHz)", val: R, set: setR, min: 0.5, max: 4, step: 0.1, color: C.purple },
      ].map((s, idx) => (
        <div key={idx} style={{ marginBottom: 14 }}>
          <label style={{ color: C.muted, fontSize: 12 }}>{s.label} = <strong style={{ color: s.color }}>{s.val}{s.label.startsWith("R") ? " GHz" : ""}</strong></label>
          <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={(e) => s.set(Number(e.target.value))} style={{ width: "100%", accentColor: s.color }} />
        </div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted }}>execution time T</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{T} µs</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted }}>throughput = R / S</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{throughput} M/s</div>
        </div>
      </div>

      <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
        Set S = 5 (no pipeline — every instruction takes all 5 stages back-to-back) vs S = 1 (ideal pipeline, one instruction
        finishing every cycle) with the same N and R — that's the up-to-5× throughput gain the notes describe. Real pipelines
        land somewhere between 1 and 5, because of the hazards you'll meet starting next unit.
      </div>

      <Key color={C.accent}>
        Non-pipelined: S = 5. Ideal pipelined (no stalls): S = 1 — an up-to <strong style={{ color: C.text }}>5× throughput
        gain</strong>. Notice the ideal pipeline's throughput equals R exactly (P<sub>p</sub> = R) once S = 1.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Trace: how many stages should you build? (Sec 2.3)
// ══════════════════════════════════════════════════════════════════
function HowManyStages() {
  const [k, setK] = useState(5);

  const clockGhz = (0.5 + k * 0.35).toFixed(2);
  const stallRisk = k <= 4 ? "low" : k <= 8 ? "moderate" : k <= 14 ? "high" : "very high";
  const stallColor = k <= 4 ? C.green : k <= 8 ? C.yellow : k <= 14 ? C.orange : C.red;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        More stages means less work per stage, which means a shorter clock period — a higher clock rate. But it isn't free: more
        instructions in flight at once means more chances for one to depend on another still in the pipe. Drag k and watch both
        sides move.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>k (pipeline stages) = <strong style={{ color: C.accent }}>{k}</strong></label>
        <input type="range" min={2} max={20} value={k} onChange={(e) => setK(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ CLOCK RATE ↑</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>~{clockGhz} GHz</div>
          <div style={{ color: C.muted, fontSize: 10.5, marginTop: 4 }}>less work per stage → shorter period</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${stallColor}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ color: stallColor, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⚠️ HAZARD RISK</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.text, textTransform: "capitalize" }}>{stallRisk}</div>
          <div style={{ color: C.muted, fontSize: 10.5, marginTop: 4 }}>more in flight → more dependencies, bigger branch penalty</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>
        The clock is ultimately limited by the <strong>slowest basic operation</strong> (usually the ALU) — you can't shrink a
        stage's work below that floor. Gains diminish beyond a point; real designs use roughly 10–20 stages at several GHz,
        balancing both sides of this trade-off rather than maximizing either one.
      </div>

      <Key color={C.purple}>
        Ideal speedup approaches the number of stages, but every stall pulls the real gain below the ideal — which is exactly
        what the next unit, Data Hazards, is about.
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
      q: "A 5-stage pipeline runs 20 independent instructions. How many cycles does it take?",
      options: ["100 cycles", "24 cycles", "25 cycles", "5 cycles"],
      answer: 1,
      explain: "k + (n − 1) = 5 + 19 = 24 cycles. (Without pipelining it would be k × n = 100 cycles — over 4× slower.)",
    },
    {
      q: "Why doesn't the speedup ever exactly equal k, no matter how large n gets?",
      options: [
        "Because clock rate limits it",
        "Because the first instruction still needs k cycles to fill the pipe, and that one-time fixed cost never fully disappears",
        "Because caches always miss",
        "It does exactly equal k for large n",
      ],
      answer: 1,
      explain: "The k − 1 extra cycles to fill (and drain) the pipe are a fixed overhead. As n grows this overhead is spread over more instructions and matters less — but it's never exactly zero, so speedup approaches k without reaching it.",
    },
    {
      q: "In T = (N × S) / R, what does S represent for an IDEAL pipeline with no stalls?",
      options: ["S = k (number of stages)", "S = N (instruction count)", "S = 1", "S = R (clock rate)"],
      answer: 2,
      explain: "An ideal pipeline completes one instruction every cycle once full, so the average cycles-per-instruction S = 1 — versus S = 5 (the number of stages) for a non-pipelined design that finishes each instruction fully before starting the next.",
    },
    {
      q: "Why do real processors NOT just keep adding more and more pipeline stages forever?",
      options: [
        "More stages have no effect on clock rate",
        "More stages shorten the clock period (higher R) but increase in-flight dependencies and branch penalty, so gains diminish beyond a point",
        "Pipelining only works up to exactly 5 stages",
        "Adding stages always slows the clock down",
      ],
      answer: 1,
      explain: "More stages → less work per stage → shorter clock period → higher clock rate, which helps. But more instructions in flight at once means more chances for dependencies (stalls) and a bigger branch penalty if the decision moves later — so the net gain flattens out. Real designs land around 10–20 stages.",
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
          {score === 4 ? "Perfect! You can derive the cycle counts and read the performance equation cold." :
            score >= 2 ? "Good work! Replay 'Count the Cycles' and 'The Performance Equation' to lock in the formulas." :
              "Revisit 'Why It Matters' — the pipeline's fixed fill/drain cost is the idea everything else builds on."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now compute pipeline cycle counts, explain why speedup approaches but never reaches k, use T = N·S/R, and
            reason about the stage-count trade-off.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.3 — Data Hazards.</strong> The ideal S = 1 you just met only holds
            when instructions are independent — next you'll see exactly what happens when they aren't.
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
export default function Unit3_2({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Why It Matters" },
    { id: "count", label: "Count the Cycles" },
    { id: "equation", label: "The Performance Equation" },
    { id: "stages", label: "How Many Stages?" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⏳ Why It Matters — putting numbers on the overlap</h3><WhyItMatters /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🧮 Count the Cycles — k + (n − 1)</h3><CountTheCycles /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📐 The Performance Equation — T = N·S/R</h3><PerformanceEquation /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⚖️ How Many Stages? — the trade-off</h3><HowManyStages /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.2.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › UNIT 3.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Pipeline Performance</div>
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
