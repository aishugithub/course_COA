// Unit3_4.jsx — Module 3 › Unit 3.4 — "Instruction Hazards"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Hamacher §6.6, Figs 6.9-6.12 — class notes ch.4 (branch problem,
// branch penalty + early-decode fix, delay slot, static + 2-bit dynamic
// prediction, branch target buffer).
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
//  Section 1 — Why? A branch means "what's next?" isn't known yet
// ══════════════════════════════════════════════════════════════════
function WhyItMatters() {
  const [resolved, setResolved] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        To stay full, Fetch grabs the <strong style={{ color: C.text }}>next instruction in sequence</strong>, every single cycle —
        it has no choice but to guess. A branch can redirect execution somewhere else entirely, but the pipeline can't know that
        until the branch is actually decoded/computed. Toggle to see what happens if it guesses wrong.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setResolved(false)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !resolved ? C.red + "22" : C.card, border: `2px solid ${!resolved ? C.red : C.border}`, color: !resolved ? C.red : C.muted,
        }}>❌ Branch not yet resolved</button>
        <button onClick={() => setResolved(true)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: resolved ? C.green + "22" : C.card, border: `2px solid ${resolved ? C.green : C.border}`, color: resolved ? C.green : C.muted,
        }}>✅ Branch resolved, target known</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
        {!resolved ? (
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
            Fetch keeps grabbing instructions <strong>right after</strong> the branch, in sequence, because it has to fetch
            <em> something</em> every cycle. If the branch is actually taken, all of those already-fetched instructions are the
            <strong style={{ color: C.red }}> wrong ones</strong> — they must be discarded.
          </div>
        ) : (
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
            Once the branch's outcome and target ARE known, Fetch can finally grab the <strong style={{ color: C.green }}>correct</strong> next
            instruction. Everything fetched wrongly in the meantime was wasted work — those lost cycles are the
            <strong> branch penalty</strong>.
          </div>
        )}
      </div>

      <Key color={C.orange}>
        This is called a <strong style={{ color: C.text }}>control hazard</strong> (or instruction hazard) — and it matters a lot:
        branches make up roughly <strong style={{ color: C.text }}>20%</strong> of instructions in typical code, so even a small
        penalty per branch adds up fast.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy: branch penalty, Compute-stage vs Decode-stage
// ══════════════════════════════════════════════════════════════════
function BranchPenalty() {
  const [stage, setStage] = useState("compute"); // compute | decode

  const isCompute = stage === "compute";
  const penalty = isCompute ? 2 : 1;
  const cols = isCompute ? 8 : 7;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The penalty size depends on <strong style={{ color: C.text }}>how late</strong> the branch's outcome is known. Toggle
        between the two designs.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setStage("compute")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: isCompute ? C.red + "22" : C.card, border: `2px solid ${isCompute ? C.red : C.border}`, color: isCompute ? C.red : C.muted,
        }}>Resolved in Compute (Fig 6.9)</button>
        <button onClick={() => setStage("decode")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !isCompute ? C.green + "22" : C.card, border: `2px solid ${!isCompute ? C.green : C.border}`, color: !isCompute ? C.green : C.muted,
        }}>Resolved in Decode (Fig 6.10)</button>
      </div>

      <div style={{ overflowX: "auto", marginBottom: 12 }}>
        <table style={{ borderCollapse: "collapse", minWidth: 460 }}>
          <thead>
            <tr>
              <th style={{ padding: "4px 8px", fontSize: 10, color: C.muted, textAlign: "left" }}></th>
              {Array.from({ length: cols }, (_, c) => <th key={c} style={{ padding: "4px", fontSize: 10, color: C.muted, width: 38 }}>{c + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", paddingRight: 6 }}>Branch</td>
              {["F", "D", isCompute ? "C" : null].filter((x) => x !== null || true).map((v, i) => (
                <td key={i} style={{ padding: 2 }}>
                  {v && <div style={{ height: 26, borderRadius: 4, background: C.accent + "22", border: `1.5px solid ${C.accent}`, color: C.accent, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{v}</div>}
                </td>
              ))}
              {Array.from({ length: cols - (isCompute ? 3 : 2) }, (_, i) => <td key={"e" + i} />)}
            </tr>
            <tr>
              <td style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", paddingRight: 6 }}>discarded</td>
              <td />
              {isCompute
                ? <>
                    <td style={{ padding: 2 }}><div style={{ height: 26, borderRadius: 4, background: C.red + "22", border: `1.5px dashed ${C.red}`, color: C.red, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>F ✗</div></td>
                    <td style={{ padding: 2 }}><div style={{ height: 26, borderRadius: 4, background: C.red + "22", border: `1.5px dashed ${C.red}`, color: C.red, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>F ✗</div></td>
                  </>
                : <td style={{ padding: 2 }}><div style={{ height: 26, borderRadius: 4, background: C.red + "22", border: `1.5px dashed ${C.red}`, color: C.red, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>F ✗</div></td>}
            </tr>
            <tr>
              <td style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", paddingRight: 6 }}>Target</td>
              {Array.from({ length: cols }, (_, c) => {
                const startCol = isCompute ? 3 : 2; // 0-indexed offset where target starts
                const seq = ["F", "D", "C", "M", "W"];
                const idx = c - startCol;
                const v = idx >= 0 && idx < 5 ? seq[idx] : null;
                return (
                  <td key={c} style={{ padding: 2 }}>
                    {v && <div style={{ height: 26, borderRadius: 4, background: C.green + "22", border: `1.5px solid ${C.green}`, color: C.green, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{v}</div>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: C.muted }}>penalty for this design: </span>
        <span style={{ fontSize: 20, fontWeight: 800, color: penalty === 1 ? C.green : C.red }}>{penalty}-cycle</span>
      </div>

      <Key color={C.accent}>
        Deciding earlier costs extra hardware — an adder (and, for a conditional branch, a comparator) placed right in
        <strong style={{ color: C.text }}> Decode</strong> — but only <strong style={{ color: C.text }}>one</strong> wrong instruction
        gets fetched instead of two. At ~20% of instructions being branches, cutting the penalty from 2 to 1 cycle is a real win.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Build It: the branch delay slot
// ══════════════════════════════════════════════════════════════════
function DelaySlot() {
  const [filled, setFilled] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here's a clever trick: the instruction slot right after a branch gets fetched <strong style={{ color: C.text }}>anyway</strong> —
        so why not always execute it, and let the compiler put something useful there? This is the
        <strong style={{ color: C.text }}> branch delay slot</strong>.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setFilled(false)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !filled ? C.red + "22" : C.card, border: `2px solid ${!filled ? C.red : C.border}`, color: !filled ? C.red : C.muted,
        }}>❌ Slot wasted (NOP)</button>
        <button onClick={() => setFilled(true)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: filled ? C.green + "22" : C.card, border: `2px solid ${filled ? C.green : C.border}`, color: filled ? C.green : C.muted,
        }}>✅ Slot filled (Add moved up)</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
        <pre style={{ fontFamily: "monospace", fontSize: 13, color: C.text, margin: 0, lineHeight: 1.9 }}>
{!filled ? (
`Add       R7, R8, R9
Branch_if<R3=0>  TARGET
` ) : (
`Branch_if<R3=0>  TARGET
Add       R7, R8, R9    ← delay slot, always executed
`)}
        </pre>
        {!filled && <div style={{ color: C.red, fontFamily: "monospace", fontSize: 13 }}>NOP                       ← wasted slot</div>}
      </div>

      <div style={{ marginTop: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {!filled
          ? "Before: the instruction right after the branch does nothing useful — a NOP fills the wasted slot."
          : "After: the compiler moves an independent instruction (the Add) INTO the delay slot. It gets executed no matter which way the branch goes, and the branch itself takes effect one instruction later — this is delayed branching."}
      </div>

      <Key color={C.green}>
        This only works when the compiler can find a genuinely independent instruction to move — which happens about
        <strong style={{ color: C.text }}> 70% of the time</strong>. The rest of the time, a NOP has to go there anyway.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Playground: the 2-bit branch predictor FSM
// ══════════════════════════════════════════════════════════════════
function BranchPredictor() {
  const states = ["SNT", "LNT", "LT", "ST"];
  const stateNames = ["Strongly Not-Taken", "Likely Not-Taken", "Likely Taken", "Strongly Taken"];
  const predictTaken = [false, false, true, true];
  const [state, setState] = useState(0);
  const [log, setLog] = useState([]);

  const step = (actualTaken) => {
    const predicted = predictTaken[state];
    const correct = predicted === actualTaken;
    let next = state;
    if (actualTaken) next = Math.min(3, state + 1);
    else next = Math.max(0, state - 1);
    setLog((l) => [...l.slice(-6), { actualTaken, predicted, correct }]);
    setState(next);
  };
  const reset = () => { setState(0); setLog([]); };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A 2-bit saturating counter "remembers" recent behaviour so it can guess better than a coin flip. Click "Taken" or "Not Taken"
        to feed it real outcomes and watch it adapt — notice it takes <strong style={{ color: C.text }}>two wrong guesses in a
        row</strong> to actually flip its prediction.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 4 }}>
        {states.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: "center", padding: "12px 4px", borderRadius: 10,
            background: i === state ? (predictTaken[i] ? C.green + "22" : C.red + "22") : C.card,
            border: `2px solid ${i === state ? (predictTaken[i] ? C.green : C.red) : C.border}`,
          }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: i === state ? (predictTaken[i] ? C.green : C.red) : C.muted }}>{s}</div>
            <div style={{ fontSize: 9.5, color: C.muted, marginTop: 3 }}>{predictTaken[i] ? "predict ✓ taken" : "predict ✗ not-taken"}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => step(true)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: C.green, color: "#0D1117", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Branch was TAKEN</button>
        <button onClick={() => step(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: C.red, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Branch was NOT taken</button>
        <button onClick={reset} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.muted, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>↺</button>
      </div>

      {log.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {log.map((l, i) => (
            <div key={i} style={{
              flex: 1, height: 26, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, color: l.correct ? C.green : C.red,
              background: (l.correct ? C.green : C.red) + "18", border: `1.5px solid ${l.correct ? C.green : C.red}`,
            }}>{l.correct ? "✓" : "✗"}</div>
          ))}
        </div>
      )}

      <Key color={C.purple}>
        For a loop that runs many times and exits once, this means only the <strong style={{ color: C.text }}>final,
        exit</strong> iteration gets mispredicted — every earlier "loop back" guess stays correct, unlike a naive 1-bit predictor
        that would flip (and mispredict again) on the very next iteration too.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Concept: static prediction + the branch target buffer
// ══════════════════════════════════════════════════════════════════
function StaticAndBTB() {
  const [tab, setTab] = useState("static");

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The 2-bit predictor is <em>dynamic</em> — it learns. Two more pieces complete the picture: simpler static guesses, and how a
        prediction gets used fast enough to matter.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setTab("static")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: tab === "static" ? C.accent + "22" : C.card, border: `2px solid ${tab === "static" ? C.accent : C.border}`, color: tab === "static" ? C.accent : C.muted,
        }}>Static prediction</button>
        <button onClick={() => setTab("btb")} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: tab === "btb" ? C.teal + "22" : C.card, border: `2px solid ${tab === "btb" ? C.teal : C.border}`, color: tab === "btb" ? C.teal : C.muted,
        }}>Branch target buffer</button>
      </div>

      {tab === "static" ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          Static prediction makes the <strong>same guess every time</strong> — no learning, no history:
          <ul style={{ marginTop: 8, paddingLeft: 18 }}>
            <li><strong style={{ color: C.orange }}>Assume not-taken</strong> — just keep fetching in sequence (~50% right for a random branch).</li>
            <li><strong style={{ color: C.orange }}>Use direction</strong> — a backward branch (a loop's end, jumping back up) is usually taken; predict from the sign of the offset.</li>
            <li><strong style={{ color: C.orange }}>Hint bit</strong> — the compiler can set a bit on the instruction itself saying "expect taken" or "expect not-taken," based on what it knows about the code.</li>
          </ul>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          A 2-bit predictor's state has to be looked up <strong>before</strong> the branch is even decoded — otherwise the
          prediction arrives too late to help. The <strong style={{ color: C.teal }}>Branch Target Buffer (BTB)</strong> is a small,
          fast table (~1024 entries) keyed by the branch's own address. A hit in cycle 1 (while the branch is still being fetched)
          immediately gives two things: the prediction state bits, <em>and</em> the target address — so the very next cycle can
          fetch the predicted-correct instruction instead of just the next one in sequence.
        </div>
      )}

      <Key color={C.teal}>
        Control hazards shrink three independent ways, and real processors use all three together: decide the branch
        <strong style={{ color: C.text }}> early</strong> (Decode, not Compute), fill the <strong style={{ color: C.text }}>delay
        slot</strong> with useful work, and <strong style={{ color: C.text }}>predict</strong> — static, dynamic 2-bit, and a BTB so
        the prediction is ready in cycle 1.
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
      q: "Why is a branch instruction a special problem for the pipeline, even though it's just one more instruction?",
      options: [
        "Branches take more ALU cycles than other instructions",
        "The pipeline must fetch something every cycle, but a branch's target/outcome isn't known until it's decoded or computed — so the pipeline may fetch the wrong instructions and have to discard them",
        "Branches can't be stored in the instruction cache",
        "Branches always cause a data hazard too",
      ],
      answer: 1,
      explain: "Fetch has no choice but to guess the next instruction every cycle. A branch may redirect execution, but that's only known once it's resolved — anything fetched in the meantime that turns out wrong must be discarded, costing the branch penalty.",
    },
    {
      q: "Resolving a branch in the Decode stage instead of Compute cuts the penalty from 2 cycles to 1. Why?",
      options: [
        "Decode is a faster stage",
        "Adding an adder (and comparator, for conditional branches) into Decode means the target/outcome is known one stage earlier, so only ONE wrongly-fetched instruction needs discarding instead of two",
        "It removes the need for prediction entirely",
        "It only works for unconditional branches",
      ],
      answer: 1,
      explain: "Every stage earlier the decision is made means one fewer wrongly-fetched instruction downstream. Extra hardware (adder + comparator) in Decode buys exactly one stage of earliness, cutting the penalty from 2 cycles to 1.",
    },
    {
      q: "A 2-bit branch predictor is in the Strongly-Taken state. The branch is NOT taken once (an unusual iteration), then taken again as normal. What does the predictor do?",
      options: [
        "It immediately predicts not-taken on the very next branch",
        "It drops to Likely-Taken but STILL predicts taken next time — a single miss doesn't flip the prediction, so the normal pattern keeps being predicted correctly",
        "It resets to Strongly-Not-Taken",
        "It stops predicting until manually reset",
      ],
      answer: 1,
      explain: "The 2-bit counter needs two wrong guesses in a row to actually flip its prediction. One odd iteration only nudges it from Strongly-Taken to Likely-Taken — both states still predict 'taken' — so the very next (normal) branch is still predicted correctly.",
    },
    {
      q: "Why does the Branch Target Buffer (BTB) need to be looked up in cycle 1, using just the branch's address?",
      options: [
        "To save memory",
        "Because a prediction is only useful if it's ready BEFORE the branch would otherwise stall Fetch — waiting until Decode/Compute to predict defeats the purpose of predicting at all",
        "The BTB replaces the need for Decode entirely",
        "It has nothing to do with timing",
      ],
      answer: 1,
      explain: "The whole point of prediction is to keep Fetch supplied with (hopefully) correct instructions without waiting. A BTB hit in cycle 1 — keyed just by address, before the instruction is even decoded — hands back both the prediction and the target address in time for the very next fetch.",
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
          {score === 4 ? "Perfect! Branch penalty, delay slots, and 2-bit prediction are all locked in." :
            score >= 2 ? "Good work! Replay the Branch Predictor playground and the penalty comparison." :
              "Revisit 'Why It Matters' and 'Branch Penalty' — everything else builds on those two ideas."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now explain the branch penalty, delay slots, static vs 2-bit dynamic prediction, and the BTB's role.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.5 — Instruction Sets, Datapath &amp; Control.</strong> Time to see
            how the instruction set itself was shaped by the pipeline you've now fully explored.
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
export default function Unit3_4({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Why It Matters" },
    { id: "penalty", label: "Branch Penalty" },
    { id: "delay", label: "Delay Slot" },
    { id: "predictor", label: "2-Bit Predictor" },
    { id: "static", label: "Static & BTB" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⏳ Why It Matters — the pipeline has to guess</h3><WhyItMatters /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📊 Branch Penalty — Compute vs Decode resolution</h3><BranchPenalty /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🎯 The Delay Slot — never waste the fetch</h3><DelaySlot /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🔮 The 2-Bit Predictor — learning from history</h3><BranchPredictor /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🗂️ Static Prediction &amp; the BTB</h3><StaticAndBTB /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.4.</p>
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › UNIT 3.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Instruction Hazards</div>
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
              flex: 1, minWidth: 70, padding: "8px 6px", borderRadius: 7,
              background: activeSection === i ? C.accentGlow : "transparent",
              border: "none", color: activeSection === i ? "#fff" : C.muted,
              cursor: "pointer", fontSize: 10.5, fontWeight: activeSection === i ? 600 : 400,
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
