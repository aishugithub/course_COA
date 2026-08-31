// Unit3_C.jsx — Module 3 › Capstone — "Schedule to Avoid Stalls"
// Foothold formula, capstone arc: The Mission -> Build in Steps -> Play It ->
// Full Code -> Quiz. Draws together every idea from Units 3.1-3.5: RAW
// hazards, forwarding, load-use, NOP/reorder scheduling, and the S=1+delta
// formula, into one hands-on "reorder these instructions" playable widget
// (Playable Capstone pattern from widget-patterns.md #9, adapted as a
// drag-free click-to-swap reorder since a touch-friendly swap is more
// robust than HTML5 drag-and-drop across devices for a public course).
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
//  Section 1 — The Mission: what you'll need from every earlier unit
// ══════════════════════════════════════════════════════════════════
function Mission() {
  const checklist = [
    { unit: "3.1", need: "Cache misses stall every stage behind them, same domino effect as any other stall." },
    { unit: "3.2", need: "Every stall cycle you avoid directly lowers S in T = N·S/R — that's the whole point of scheduling." },
    { unit: "3.3", need: "A RAW hazard forces either a stall, a forward, or a software fix (NOP / reorder) — you're about to BE the compiler doing the reordering." },
    { unit: "3.4", need: "Branches aren't part of this mission's code, but the same 'don't waste a cycle' instinct is what fills a delay slot too." },
    { unit: "3.5", need: "S = 1 + δstall + ... — your job here is to make δstall as close to 0 as you can, for real." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        <strong style={{ color: C.text }}>The mission:</strong> you're handed a short sequence of instructions with real data
        dependencies. Some pairs will stall the pipeline if left in program order. Your job — the same job a real compiler's
        instruction scheduler does — is to reorder them so independent work fills the gaps instead of bubbles.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {checklist.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ flexShrink: 0, width: 44, height: 28, borderRadius: 6, background: C.accentGlow, color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.unit}</div>
            <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>{c.need}</div>
          </div>
        ))}
      </div>

      <Key color={C.accent}>
        Everything you need for this capstone, you've already built yourself, one unit at a time. This is where it all comes
        together into one skill: <strong style={{ color: C.text }}>reading code for hazards, and fixing them for free.</strong>
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Build in Steps: v1 naive -> v2 NOPs -> v3 scheduled
// ══════════════════════════════════════════════════════════════════
function BuildInSteps() {
  const [v, setV] = useState(1);

  const versions = {
    1: {
      title: "v1 — Program order, no thought given to hazards",
      code: `Add       R2, R3, #100
Subtract  R9, R2, #30      ; needs R2 -- RAW!
Or        R7, R6, R5
And       R4, R1, R0`,
      note: "The Subtract needs R2 the very next instruction. With NO forwarding assumed, Decode simply refuses to move forward — 3 stall cycles, exactly like Unit 3.3's traced example. A pipeline with no scheduling and no forwarding hardware pays this in full.",
      cycles: 11, stalls: 3, color: C.red,
    },
    2: {
      title: "v2 — Fix it with NOPs (the naive software fix)",
      code: `Add       R2, R3, #100
NOP
NOP
NOP
Subtract  R9, R2, #30
Or        R7, R6, R5
And       R4, R1, R0`,
      note: "Same 3 cycles are spent — but now it's visible in the code as three wasted instruction slots. No hazard anymore, but no useful work got done in that gap either. This is the wall Unit 3.3's 'Compare the Cures' widget already showed you.",
      cycles: 11, stalls: 3, color: C.orange,
    },
    3: {
      title: "v3 — Instruction scheduling (the real fix)",
      code: `Add       R2, R3, #100
Or        R7, R6, R5       ; independent -- moved up
And       R4, R1, R0       ; independent -- moved up
Subtract  R9, R2, #30      ; R2 is ready by now`,
      note: "Or and And don't touch R2 or R3 at all — they're completely independent of the Add. Moving them into the gap means the Subtract still waits exactly as long as it needs to (R2 is ready), but the CPU is doing useful work during that wait instead of nothing. Same total time as v1's stalled version was FORCED to spend anyway on R2 — but zero cycles are wasted.",
      cycles: 8, stalls: 0, color: C.green,
    },
  };
  const d = versions[v];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Watch the same four instructions evolve through three versions — this is exactly how a real compiler's scheduler thinks,
        one improvement at a time.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => setV(n)} style={{
            flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12,
            background: v === n ? versions[n].color + "22" : C.card, border: `2px solid ${v === n ? versions[n].color : C.border}`,
            color: v === n ? versions[n].color : C.muted,
          }}>v{n}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${d.color}44`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <div style={{ color: d.color, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{d.title}</div>
        <pre style={{ fontFamily: "monospace", fontSize: 12.5, color: C.text, margin: 0, lineHeight: 1.9, marginBottom: 12 }}>{d.code}</pre>
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>{d.note}</div>
      </div>

      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <div><span style={{ fontSize: 11, color: C.muted }}>total cycles: </span><strong style={{ color: C.text }}>{d.cycles}</strong></div>
        <div><span style={{ fontSize: 11, color: C.muted }}>wasted cycles: </span><strong style={{ color: d.stalls === 0 ? C.green : C.red }}>{d.stalls}</strong></div>
      </div>

      <Key color={C.green}>
        v1 and v2 spend the same time; v3 spends the least because it's the only version that overlaps the <em>necessary</em> wait
        with <em>useful</em> work. That's the entire idea of instruction scheduling in one comparison.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Play It: reorder these 5 instructions yourself
// ══════════════════════════════════════════════════════════════════
const PUZZLE_INSTRS = [
  { id: "a", text: "Add       R4, R3, R2", writes: ["R4"], reads: ["R3", "R2"] },
  { id: "b", text: "Load      R6, 0(R7)", writes: ["R6"], reads: ["R7"] },
  { id: "c", text: "Or        R8, R1, R0", writes: ["R8"], reads: ["R1", "R0"] },
  { id: "d", text: "Subtract  R9, R4, R6", writes: ["R9"], reads: ["R4", "R6"] },
  { id: "e", text: "And       R5, R8, R2", writes: ["R5"], reads: ["R8", "R2"] },
];

function evaluateOrder(order) {
  // order: array of instruction objects in chosen sequence.
  // For each instr at index i, check if any of its reads were written by
  // the instruction immediately preceding it (i-1) -> load-use / RAW-adjacent stall.
  // Simplified pipeline model matching the notes: adjacent RAW = 1 stall
  // (assume forwarding handles all non-adjacent and non-load cases);
  // adjacent hazard where producer is a Load = load-use, still 1 stall
  // (forwarding can't beat the Memory-stage timing); adjacent hazard where
  // producer is NOT a load = 0 stalls (ALU result forwards from RZ in time,
  // exactly like Unit 3.3's Add->Subtract forwarding case).
  let stalls = 0;
  const details = [];
  for (let i = 1; i < order.length; i++) {
    const prev = order[i - 1];
    const cur = order[i];
    const dependsOnPrev = cur.reads.some((r) => prev.writes.includes(r));
    if (dependsOnPrev) {
      const isLoad = prev.text.trim().startsWith("Load");
      if (isLoad) {
        stalls += 1;
        details.push({ i, kind: "load-use", msg: `${cur.text.trim().split(/\s+/)[0]} needs a value from the Load right before it — 1 unavoidable stall (load-use hazard, Unit 3.3).` });
      } else {
        details.push({ i, kind: "forwarded", msg: `${cur.text.trim().split(/\s+/)[0]} depends on the instruction right before it, but the ALU result forwards in time — 0 stalls.` });
      }
    }
  }
  return { stalls, details };
}

function PlayableCapstone() {
  const [order, setOrder] = useState(PUZZLE_INSTRS.map((x) => x.id));
  const [selected, setSelected] = useState(null);

  const orderedInstrs = order.map((id) => PUZZLE_INSTRS.find((x) => x.id === id));
  const result = evaluateOrder(orderedInstrs);

  const clickSlot = (idx) => {
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      const next = [...order];
      [next[selected], next[idx]] = [next[idx], next[selected]];
      setOrder(next);
      setSelected(null);
    }
  };

  const reset = () => { setOrder(PUZZLE_INSTRS.map((x) => x.id)); setSelected(null); };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Five instructions, several real dependencies among them. Click any two slots to <strong style={{ color: C.text }}>swap</strong> their
        order. Try to get <strong style={{ color: C.green }}>stall cycles down to the minimum possible</strong> — remember: a Load's
        result can't be forwarded to the very next instruction (load-use), but an ALU result CAN be forwarded to whatever comes
        right after it.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {orderedInstrs.map((instr, idx) => {
          const isSel = selected === idx;
          const hazardHere = result.details.find((d) => d.i === idx);
          return (
            <button key={instr.id} onClick={() => clickSlot(idx)} style={{
              textAlign: "left", padding: "10px 14px", borderRadius: 8, cursor: "pointer", position: "relative",
              background: isSel ? C.accent + "22" : C.card,
              border: `2px solid ${isSel ? C.accent : hazardHere?.kind === "load-use" ? C.red : C.border}`,
              fontFamily: "monospace", fontSize: 13, color: C.text, display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ color: C.muted, fontSize: 11, width: 16 }}>{idx + 1}</span>
              <span>{instr.text}</span>
              {hazardHere && (
                <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, color: hazardHere.kind === "load-use" ? C.red : C.green }}>
                  {hazardHere.kind === "load-use" ? "⚠ 1 stall" : "✓ forwarded"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted }}>stall cycles in this order</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: result.stalls === 0 ? C.green : C.red }}>{result.stalls}</div>
        </div>
        <button onClick={reset} style={{ padding: "10px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.muted, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>↺ Reset order</button>
      </div>

      {result.details.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
          {result.details.map((d, i) => <div key={i}>• {d.msg}</div>)}
        </div>
      )}

      {result.stalls === 0 && (
        <div style={{ marginTop: 12, background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.green, fontWeight: 700, textAlign: "center" }}>
          🎉 Zero stalls! You scheduled around every hazard — exactly what a real instruction scheduler does.
        </div>
      )}

      <Key color={C.teal}>
        Notice the Load (b) is the one instruction you can never fully "solve" by reordering alone — whatever follows it directly
        that needs R6 pays 1 stall no matter what, because that's a load-use hazard (Unit 3.3). The best you can do is make sure
        <em> nothing else</em> ends up needlessly stalled around it.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Full Code: the reference solution
// ══════════════════════════════════════════════════════════════════
function FullCode() {
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here's one valid minimum-stall ordering for the puzzle instructions, fully annotated the way a compiler-generated
        schedule might be commented for a human to review.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
        <pre style={{ fontFamily: "monospace", fontSize: 12.5, color: C.text, margin: 0, lineHeight: 2 }}>
{`Load      R6, 0(R7)          ; kick off the Load early -- its result
                              ; won't be needed for two instructions,
                              ; so the load-use penalty is fully hidden
Or        R8, R1, R0          ; independent of everything so far
Add       R4, R3, R2          ; independent -- also gives R4 time to
                              ; be ready before Subtract needs it
Subtract  R9, R4, R6          ; R4 and R6 both forward in cleanly --
                              ; R6 arrived 2 instructions ago, R4 the
                              ; instruction just before -- both safe
And       R5, R8, R2          ; R8 forwards from 2 instructions back`}
        </pre>
      </div>

      <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
        <strong style={{ color: C.purple }}>Why the Load goes first:</strong> a Load's result isn't ready until the Memory stage —
        one stage later than an ALU result. Putting it first gives it the most possible instructions to hide behind before anything
        needs R6. This is exactly the "move an independent instruction between the Load and its user" trick from Unit 3.3's
        load-use section, taken to its logical extreme.
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.7 }}>
        <strong style={{ color: C.accent }}>Try it yourself:</strong> real instruction schedulers do exactly this analysis
        automatically at compile time — building a dependency graph of every instruction in a block, then choosing an order that
        respects every dependency while minimizing total stalls. You just did, by hand, what -O2 does for you in a fraction of a
        millisecond.
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, instant feedback, completion card (module-final)
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "In the reorder puzzle, why does putting the Load instruction FIRST help, even though nothing needs its result yet?",
      options: [
        "Loads must always execute first by rule",
        "It gives the Load's result the maximum possible number of instructions to hide the load-use penalty behind, before anything actually needs the loaded value",
        "It has no effect on stalls",
        "Loads are faster when executed first",
      ],
      answer: 1,
      explain: "A Load's value isn't ready until the Memory stage. The earlier you issue the Load relative to when its result is needed, the more independent work can fill that gap — potentially hiding the load-use stall completely.",
    },
    {
      q: "Two adjacent instructions have a RAW dependency, but the producer is an ADD (not a Load). What's the correct scheduling implication?",
      options: [
        "It always needs a stall regardless of instruction type",
        "It's fine to leave them adjacent — an ALU result (unlike a Load's) is ready in time to forward to the very next instruction, so no reordering is needed for this pair",
        "The Add must be moved to the very end",
        "Only Loads can ever have RAW hazards",
      ],
      answer: 1,
      explain: "This is the Unit 3.3 Add→Subtract forwarding case exactly: an ALU result is ready after Compute, in time to forward into the very next instruction's Compute stage. No stall, no reordering needed — only Load-produced values need the extra gap.",
    },
    {
      q: "Comparing v1 (program order, no forwarding) and v3 (scheduled) in 'Build in Steps' — why do they NOT take the same total time, even though v1's Subtract also eventually gets a correct R2?",
      options: [
        "They do take the same time",
        "v1 spends its 3 stall cycles doing NOTHING useful, while v3 spends the same required waiting time running genuinely independent instructions — same wait, but only one version wastes it",
        "v3 skips the Subtract entirely",
        "v1 is always faster",
      ],
      answer: 1,
      explain: "Both versions respect the same underlying dependency — Subtract can't safely read R2 until it's ready. v1 (and v2's NOPs) simply waits idle for those cycles. v3 fills the identical wait with independent work, so nothing is wasted — same correctness, less wasted time.",
    },
    {
      q: "What is instruction scheduling, in one sentence?",
      options: [
        "Randomly shuffling instructions to see what happens",
        "Reordering independent instructions (without changing what any instruction computes) so that necessary waiting time for dependent instructions gets filled with useful work instead of bubbles",
        "A hardware technique, not a compiler technique",
        "Removing instructions entirely to save time",
      ],
      answer: 1,
      explain: "Scheduling never changes what gets computed or violates any real dependency — it only changes the ORDER of independent instructions, so that unavoidable dependency-driven waits get filled with genuinely useful work instead of stalls or NOPs.",
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
          {score === 4 ? "Perfect! You think like an instruction scheduler now." :
            score >= 2 ? "Good work! Replay 'Play It' a couple more times to fully internalize the load-first trick." :
              "Revisit 'Build in Steps' — the v1/v2/v3 comparison is the whole idea of this capstone in miniature."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🏆 Module 3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've gone from "why does pipelining help at all" (3.1, 3.2) through every kind of hazard that can slow it down (3.3,
            3.4, 3.5), to actually removing stalls yourself by hand. That's the full arc of how a real 5-stage pipeline behaves —
            and why every modern CPU is built this way.
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
export default function Unit3_C({ student, onUnitComplete }) {
  const sections = [
    { id: "mission", label: "The Mission" },
    { id: "steps", label: "Build in Steps" },
    { id: "play", label: "Play It" },
    { id: "code", label: "Full Code" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🎯 The Mission — everything Module 3 taught you, in one task</h3><Mission /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🏗️ Build in Steps — v1 naive, v2 NOPs, v3 scheduled</h3><BuildInSteps /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🕹️ Play It — reorder these instructions yourself</h3><PlayableCapstone /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📜 Full Code — one valid minimum-stall schedule</h3><FullCode /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Capstone Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of the whole Pipelining module.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏆</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › CAPSTONE</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Schedule to Avoid Stalls</div>
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
