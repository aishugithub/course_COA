// Unit3_5.jsx — Module 3 › Unit 3.5 — "Instruction Sets, Datapath & Control"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Hamacher §6.10 (RISC/CISC influence), §6.2/6.7/6.8.1 (per-stage
// hardware, structural hazards, S=1+delta formula, Example 6.2) — class
// notes ch.5 + ch.6. Superscalar (ch.7) is explicitly out of scope for this
// unit set per course.config.js — only teased as a forward hook in the quiz
// wrap-up, not built out here.
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
//  Section 1 — Why? RISC vs CISC: which one pipelines cleanly?
// ══════════════════════════════════════════════════════════════════
function WhyItMatters() {
  const [style, setStyle] = useState("risc");
  const isRisc = style === "risc";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Everything so far assumed instructions are easy for a pipeline to Fetch and Decode — uniform, predictable. That wasn't an
        accident. The wish to pipeline actually shaped how instruction sets were designed. Compare the two philosophies.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setStyle("risc")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: isRisc ? C.green + "22" : C.card, border: `2px solid ${isRisc ? C.green : C.border}`, color: isRisc ? C.green : C.muted,
        }}>✅ RISC — pipeline-friendly</button>
        <button onClick={() => setStyle("cisc")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !isRisc ? C.red + "22" : C.card, border: `2px solid ${!isRisc ? C.red : C.border}`, color: !isRisc ? C.red : C.muted,
        }}>❌ CISC — pipeline friction</button>
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${isRisc ? C.green : C.red}44`, borderRadius: 10, padding: 16 }}>
        {isRisc ? (
          <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 13, lineHeight: 1.9 }}>
            <li><strong>Uniform length</strong> (one word), few formats → simple, fast Fetch and Decode.</li>
            <li><strong>Load–Store architecture</strong>: only Load/Store touch memory; arithmetic is register-to-register → predictable timing.</li>
            <li><strong>Simple, regular addressing</strong> → simple operand-stage control.</li>
          </ul>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 13, lineHeight: 1.9 }}>
            <li><strong>Variable length</strong> instructions → several cycles just to fetch one.</li>
            <li><strong>Multiple memory operands</strong> per instruction → extra stalls.</li>
            <li><strong>Complex addressing</strong> → side effects and condition codes (next section).</li>
          </ul>
        )}
      </div>

      <Key color={C.accent}>
        Modern CPUs often keep a CISC-looking instruction set on the outside (for compatibility) but internally
        <strong style={{ color: C.text }}> crack each instruction into simple, RISC-like micro-operations</strong> before they ever
        reach the pipeline — getting pipeline-friendliness either way.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy: side effects (the hidden dependency)
// ══════════════════════════════════════════════════════════════════
function SideEffects() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A <strong style={{ color: C.text }}>side effect</strong> is when an instruction changes a location <em>other than</em> its
        named destination. It's the sneakiest kind of dependency, because it isn't written anywhere obvious in the instruction.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <div style={{ fontFamily: "monospace", fontSize: 15, color: C.text, textAlign: "center", marginBottom: 6 }}>
          Move R5, (R8)<span style={{ color: C.orange }}>+</span>
        </div>
        <div style={{ fontSize: 11, color: C.muted, textAlign: "center" }}>autoincrement addressing</div>
      </div>

      <button onClick={() => setShow(!show)} style={{
        width: "100%", padding: "10px", borderRadius: 8, border: `1.5px solid ${C.orange}`, background: show ? C.orange + "18" : C.card,
        color: C.orange, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 12,
      }}>{show ? "◀ Hide what actually happens" : "▶ What does this instruction really change?"}</button>

      {show && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.accent, fontWeight: 700, fontSize: 12 }}>Named destination</div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginTop: 6 }}>R5</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>gets the value loaded from memory</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.red}44`, borderRadius: 8, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.red, fontWeight: 700, fontSize: 12 }}>Hidden side effect</div>
            <div style={{ color: C.text, fontSize: 16, fontWeight: 800, marginTop: 6 }}>R8</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>ALSO changes — silently incremented</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        A following instruction that reads R8 has a dependency on this one — but you'd never guess that just from reading "Move R5,
        (R8)+" at a glance. The pipeline's hazard-detection hardware needs extra logic just to catch this.
      </div>

      <Key color={C.orange}>
        <strong style={{ color: C.text }}>Condition codes</strong> are another classic side effect: a <span style={{ fontFamily: "monospace" }}>Compare</span> instruction
        silently sets flags that a following <span style={{ fontFamily: "monospace" }}>Branch</span> depends on — the same hidden-dependency
        problem, one instruction-set feature away from the register hazards you already know.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace: structural hazard, one cache vs I-cache/D-cache
// ══════════════════════════════════════════════════════════════════
function StructuralHazard() {
  const [split, setSplit] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A <strong style={{ color: C.text }}>structural hazard</strong> happens when two stages need the <em>same hardware</em> in
        the same cycle — not a data problem at all, just a resource collision. The classic case: Fetch needs the cache every single
        cycle, and Memory (for Loads/Stores) needs it too.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setSplit(false)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !split ? C.red + "22" : C.card, border: `2px solid ${!split ? C.red : C.border}`, color: !split ? C.red : C.muted,
        }}>❌ One shared cache</button>
        <button onClick={() => setSplit(true)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: split ? C.green + "22" : C.card, border: `2px solid ${split ? C.green : C.border}`, color: split ? C.green : C.muted,
        }}>✅ Split I-cache / D-cache</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 16px" }}>
        <svg viewBox="0 0 400 140" style={{ width: "100%", display: "block" }}>
          <rect x={10} y={10} width={100} height={40} rx={7} fill="transparent" stroke={C.accent} strokeWidth={1.8} />
          <text x={60} y={35} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.accent}>Fetch</text>
          <rect x={10} y={90} width={100} height={40} rx={7} fill="transparent" stroke={C.teal} strokeWidth={1.8} />
          <text x={60} y={115} textAnchor="middle" fontSize={12} fontWeight="700" fill={C.teal}>Memory</text>
          {!split ? (
            <>
              <rect x={160} y={45} width={100} height={50} rx={8} fill={C.red + "18"} stroke={C.red} strokeWidth={2} />
              <text x={210} y={68} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.red}>One cache</text>
              <text x={210} y={82} textAnchor="middle" fontSize={9} fill={C.red}>💥 collision</text>
              <line x1={110} y1={30} x2={160} y2={58} stroke={C.red} strokeWidth={1.6} />
              <line x1={110} y1={110} x2={160} y2={82} stroke={C.red} strokeWidth={1.6} />
              <text x={300} y={72} textAnchor="middle" fontSize={11} fontWeight="800" fill={C.red}>stall!</text>
            </>
          ) : (
            <>
              <rect x={160} y={10} width={90} height={40} rx={8} fill={C.green + "18"} stroke={C.green} strokeWidth={2} />
              <text x={205} y={35} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.green}>I-cache</text>
              <rect x={160} y={90} width={90} height={40} rx={8} fill={C.green + "18"} stroke={C.green} strokeWidth={2} />
              <text x={205} y={115} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.green}>D-cache</text>
              <line x1={110} y1={30} x2={160} y2={30} stroke={C.green} strokeWidth={1.6} />
              <line x1={110} y1={110} x2={160} y2={110} stroke={C.green} strokeWidth={1.6} />
              <text x={330} y={72} textAnchor="middle" fontSize={11} fontWeight="800" fill={C.green}>no clash ✓</text>
            </>
          )}
        </svg>
      </div>

      <Key color={C.green}>
        More generally: give every stage its <strong style={{ color: C.text }}>own hardware</strong>. If two stages shared a unit,
        they couldn't both work in the same cycle and the whole overlap idea would break — this is also why each stage owns its own
        buffer register (B1–B4) rather than sharing one.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Playground: S = 1 + δstall + δbranch + δmiss (Example 6.2)
// ══════════════════════════════════════════════════════════════════
function DeltaFormula() {
  const [branchPct, setBranchPct] = useState(20);
  const [takenPct, setTakenPct] = useState(30);

  const deltaBranch = ((branchPct / 100) * (takenPct / 100)).toFixed(3);
  const S = (1 + Number(deltaBranch)).toFixed(3);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every stall type you've studied — data stalls, branch mispredicts, cache misses — adds its own penalty term onto the ideal
        S = 1, and the terms are simply <strong style={{ color: C.text }}>additive</strong>:
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", textAlign: "center", marginBottom: 16, fontFamily: "monospace", fontSize: 15, color: C.text }}>
        S = 1 + δ<sub>stall</sub> + δ<sub>branch</sub> + δ<sub>miss</sub>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted }}>δ_stall (load-use)</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.teal }}>0.25×0.40×1 = 0.10</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted }}>δ_branch (mispredict)</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.orange }}>0.20×0.10×1 = 0.02</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: C.muted }}>δ_miss (cache — usually biggest)</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.red }}>≈0.8</div>
        </div>
      </div>

      <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <div style={{ color: C.purple, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>EXAMPLE 6.2 — try the sliders</div>
        <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 12 }}>
          20% branches, static not-taken prediction (1-cycle penalty), no other stalls. Vary how often branches are actually taken.
        </p>
        {[
          { label: "% instructions that are branches", val: branchPct, set: setBranchPct, min: 0, max: 50, color: C.teal },
          { label: "% of branches actually taken", val: takenPct, set: setTakenPct, min: 0, max: 100, color: C.orange },
        ].map((s, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <label style={{ color: C.muted, fontSize: 12 }}>{s.label} = <strong style={{ color: s.color }}>{s.val}%</strong></label>
            <input type="range" min={s.min} max={s.max} value={s.val} onChange={(e) => s.set(Number(e.target.value))} style={{ width: "100%", accentColor: s.color }} />
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 10, fontFamily: "monospace", fontSize: 14, color: C.text }}>
          δ_branch = {branchPct / 100} × {takenPct / 100} = <strong style={{ color: C.red }}>{deltaBranch}</strong> &nbsp;→&nbsp; S = <strong style={{ color: C.accent }}>{S}</strong>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
        The notes' worked comparison: 30% taken → S = 1.06; 70% taken → S = 1.14. Speedup of the faster (30%-taken) case over the
        slower one = (1.14 / 1.06 − 1) × 100 ≈ <strong style={{ color: C.text }}>7.5%</strong> — set the slider to 30% then 70% and
        check S against those two numbers.
      </div>

      <Key color={C.red}>
        Notice δ_miss (≈0.8 in the typical numbers above) usually dwarfs δ_stall (0.10) and δ_branch (0.02) — exactly matching what
        you found in Unit 3.1: <strong style={{ color: C.text }}>cache misses are usually the biggest single drag on real
        pipeline performance</strong>, bigger than data hazards or mispredicted branches combined.
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
      q: "Which of these is a genuine RISC feature that makes pipelining easier (not a CISC feature)?",
      options: [
        "Variable-length instructions",
        "Load-Store architecture — only Load/Store instructions touch memory, arithmetic is register-to-register",
        "Multiple memory operands per instruction",
        "Complex, irregular addressing modes",
      ],
      answer: 1,
      explain: "Load-Store architecture keeps memory access confined to two predictable instruction types, so Fetch/Decode timing stays uniform and simple — exactly what a pipeline wants. The other three options are CISC features that create pipeline friction.",
    },
    {
      q: "Why is 'Move R5, (R8)+' (autoincrement) a side effect, and why does that matter for hazard detection?",
      options: [
        "It's not a side effect — R8 was never touched",
        "It silently changes R8 in addition to its named destination R5, so a following instruction that reads R8 has a hidden dependency the hazard-detection hardware must catch even though it isn't visible from the instruction's named operands",
        "Side effects only happen with Branch instructions",
        "It changes R5 twice",
      ],
      answer: 1,
      explain: "R5 is the visible, named destination. R8 also changes — that's the side effect. A later instruction using R8 depends on this one, but you can't see that dependency just by looking at 'R5' — extra hardware logic is needed to catch it.",
    },
    {
      q: "Why does a single shared cache create a structural hazard between Fetch and Memory?",
      options: [
        "The cache is too small to hold both instructions and data",
        "Fetch needs the cache every cycle to get the next instruction, and Memory (for Loads/Stores) also needs it in the same cycle — both stages want the SAME hardware resource at once, forcing a stall",
        "Fetch and Memory never run in the same cycle anyway",
        "It's actually a data hazard, not structural",
      ],
      answer: 1,
      explain: "A structural hazard is a resource collision, not a data dependency. Fetch and Memory both need cache access every cycle; sharing one cache means they collide. Splitting into an I-cache and a D-cache removes the collision entirely.",
    },
    {
      q: "In S = 1 + δstall + δbranch + δmiss, which term is USUALLY the largest in practice, and why?",
      options: [
        "δstall, because load-use hazards are the most common instruction pattern",
        "δbranch, because branches are 20% of all instructions",
        "δmiss, because a single cache miss can cost 10+ cycles — far more than a 1-cycle load-use stall or a 1-cycle branch misprediction penalty, even though misses aren't as frequent",
        "They are always exactly equal",
      ],
      answer: 2,
      explain: "Even though cache misses happen less often than data or branch hazards, each one costs so many more cycles (10+) that δ_miss typically dominates the sum — matching what Unit 3.1's 'Do the Math' widget showed directly.",
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
          {score === 4 ? "Perfect! RISC/CISC influence, side effects, structural hazards, and the delta formula are all locked in." :
            score >= 2 ? "Good work! Replay 'Structural Hazard' and 'The Delta Formula' to lock in the remaining pieces." :
              "Revisit 'Why It Matters' — RISC vs CISC is the thread that ties this whole unit together."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've now seen every kind of hazard this module covers, and how to add their costs into one real performance number.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: The Capstone — Schedule to Avoid Stalls.</strong> Time to put it all
            together: given real code, can you reorder it yourself to minimize stalls?
            <br /><br />
            <span style={{ fontSize: 11, opacity: 0.85 }}>(Beyond this module: real high-end processors go further still with
            <em> superscalar</em> execution — issuing more than one instruction per cycle. That's a story for another day.)</span>
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
export default function Unit3_5({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Why It Matters" },
    { id: "side", label: "Side Effects" },
    { id: "structural", label: "Structural Hazards" },
    { id: "delta", label: "The Delta Formula" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⏳ Why It Matters — RISC vs CISC and the pipeline</h3><WhyItMatters /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🫥 Side Effects — the hidden dependency</h3><SideEffects /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🏗️ Structural Hazards — one cache, two stages</h3><StructuralHazard /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📐 The Delta Formula — Example 6.2</h3><DeltaFormula /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.5.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › UNIT 3.5</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Instruction Sets, Datapath &amp; Control</div>
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
