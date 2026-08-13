// Unit2_4.jsx — Module 2 › Unit 2.4 — "Storing a Word in Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 3 (Execution of Complete Instructions,
// Hamacher §5.1–5.3) — the single-bus store micro-sequence.
// Arc: why store (the other direction) → read vs write on one MAR/MDR gateway →
// the store sequence step-by-step (MAR←addr, MDR←R, Write, wait MFC) → the
// order gotcha (Write too early corrupts memory) → quiz.
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
//  Section 1 — The Need: results must travel back OUT to memory
// ══════════════════════════════════════════════════════════════════
function TheNeed() {
  const [dir, setDir] = useState(null); // "in" | "out"

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Unit 2.3 pulled a word <strong style={{ color: C.orange }}>into</strong> the CPU. But a program that only reads is
        useless — the answer <code style={{ color: C.teal, fontFamily: "monospace" }}>C = A + B</code> is computed in a register,
        and it must be written back <strong style={{ color: C.text }}>out</strong> to memory so it survives. That is
        <strong style={{ color: C.green }}> Store</strong>. Toggle the direction of travel.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["in", "Load — memory → CPU", C.orange], ["out", "Store — CPU → memory", C.green]].map(([k, label, col]) => (
          <button key={k} onClick={() => setDir(k)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: dir === k ? col + "22" : C.card,
            border: `2px solid ${dir === k ? col : C.border}`, color: dir === k ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 120" style={{ width: "100%", display: "block" }}>
          <rect x={30} y={40} width={120} height={44} rx={8} fill={C.card} stroke={C.teal} strokeWidth={1.8} />
          <text x={90} y={66} textAnchor="middle" fill={C.teal} fontSize={13} fontWeight="700">Register R4</text>
          <rect x={370} y={40} width={120} height={44} rx={8} fill={C.card} stroke={C.red} strokeWidth={1.8} />
          <text x={430} y={66} textAnchor="middle" fill={C.red} fontSize={13} fontWeight="700">Memory</text>
          <rect x={210} y={44} width={100} height={36} rx={8} fill={C.yellow + "1E"} stroke={C.yellow} strokeWidth={1.5} />
          <text x={260} y={66} textAnchor="middle" fill={C.yellow} fontSize={12} fontWeight="700">MDR</text>
          {/* arrow */}
          {dir && (
            <g>
              <line x1={dir === "out" ? 150 : 370} y1={100} x2={dir === "out" ? 370 : 150} y2={100} stroke={dir === "out" ? C.green : C.orange} strokeWidth={3} markerEnd="url(#u24a)" />
              <text x={260} y={116} textAnchor="middle" fill={dir === "out" ? C.green : C.orange} fontSize={10} fontWeight="700">{dir === "out" ? "Store: R4 → MDR → memory" : "Load: memory → MDR → register"}</text>
            </g>
          )}
          <defs><marker id="u24a" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={dir === "out" ? C.green : C.orange} /></marker></defs>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>
        {dir === null
          ? "Pick a direction."
          : dir === "in"
            ? <span>Load reads memory into a register — the trip you traced in Unit 2.3. Notice the data still passes <strong style={{ color: C.yellow }}>through MDR</strong>.</span>
            : <span>Store is the mirror image: the register's value goes <strong style={{ color: C.green }}>R4 → MDR → memory</strong>. Same gateway, opposite direction. R4 never reaches memory directly — the MDR rule from Unit 2.1 holds both ways.</span>}
      </div>

      <Key color={C.green}>
        <strong style={{ color: C.green }}>Store</strong> sends a computed result from a register back out to memory so it
        persists. Just like Load, the data must pass <strong style={{ color: C.yellow }}>through MDR</strong> and the address
        through MAR — only the direction of flow flips.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Read vs Write over one MAR/MDR gateway
// ══════════════════════════════════════════════════════════════════
function ReadVsWrite() {
  const [op, setOp] = useState("write"); // "read" | "write"

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Memory has exactly one gateway — <strong style={{ color: C.orange }}>MAR</strong> for the address,
        <strong style={{ color: C.yellow }}> MDR</strong> for the data — and one control line that picks the direction:
        <strong style={{ color: C.green }}> Read</strong> or <strong style={{ color: C.red }}>Write</strong>. Flip it and watch
        which way MDR moves.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["read", "Read (Load)", C.orange], ["write", "Write (Store)", C.green]].map(([k, label, col]) => (
          <button key={k} onClick={() => setOp(k)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: op === k ? col + "22" : C.card,
            border: `2px solid ${op === k ? col : C.border}`, color: op === k ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 170" style={{ width: "100%", display: "block" }}>
          {/* internal bus */}
          <line x1={30} y1={40} x2={300} y2={40} stroke={C.accent} strokeWidth={4} />
          <text x={165} y={26} textAnchor="middle" fill={C.accent} fontSize={10} fontWeight="700">internal bus</text>
          {/* MAR / MDR */}
          <rect x={60} y={54} width={90} height={34} rx={6} fill={C.card} stroke={C.orange} strokeWidth={1.8} />
          <text x={105} y={76} textAnchor="middle" fill={C.orange} fontSize={12} fontWeight="700">MAR</text>
          <line x1={105} y1={54} x2={105} y2={40} stroke={C.border} strokeWidth={1.5} />
          <rect x={190} y={54} width={90} height={34} rx={6} fill={C.card} stroke={C.yellow} strokeWidth={1.8} />
          <text x={235} y={76} textAnchor="middle" fill={C.yellow} fontSize={12} fontWeight="700">MDR</text>
          <line x1={235} y1={54} x2={235} y2={40} stroke={C.border} strokeWidth={1.5} />
          {/* memory */}
          <rect x={370} y={50} width={120} height={90} rx={8} fill={C.surface} stroke={C.red} strokeWidth={1.8} />
          <text x={430} y={80} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="700">Main Memory</text>
          {/* address line */}
          <line x1={150} y1={71} x2={370} y2={71} stroke={C.orange} strokeWidth={2} markerEnd="url(#u24addr)" />
          <text x={260} y={64} textAnchor="middle" fill={C.orange} fontSize={9}>address</text>
          {/* data line — direction depends on op */}
          <line
            x1={op === "write" ? 280 : 370} y1={110}
            x2={op === "write" ? 370 : 280} y2={110}
            stroke={op === "write" ? C.green : C.orange} strokeWidth={2.5} markerEnd="url(#u24data)"
          />
          <text x={325} y={132} textAnchor="middle" fill={op === "write" ? C.green : C.orange} fontSize={9} fontWeight="700">
            {op === "write" ? "MDR → memory (Write)" : "memory → MDR (Read)"}
          </text>
          <defs>
            <marker id="u24addr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.orange} /></marker>
            <marker id="u24data" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={op === "write" ? C.green : C.orange} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ background: op === "write" ? C.green + "12" : C.orange + "12", border: `1px solid ${op === "write" ? C.green : C.orange}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {op === "write"
          ? <span><strong style={{ color: C.green }}>Write / Store:</strong> the CPU first fills MDR from a register, then MDR is copied out to <code style={{ fontFamily: "monospace" }}>M[MAR]</code>. Address flows out, data flows out.</span>
          : <span><strong style={{ color: C.orange }}>Read / Load:</strong> the address flows out, and the data flows the other way — <code style={{ fontFamily: "monospace" }}>MDR ← M[MAR]</code>. This was Unit 2.3.</span>}
      </div>

      <Key color={C.accent}>
        Same two registers, same address line — only the <strong style={{ color: C.text }}>data direction</strong> and the
        <strong style={{ color: C.green }}> Read/Write</strong> control line change. For a Store, MDR is a
        <em> source</em> (drives memory); for a Load, MDR is a <em>destination</em> (receives from memory).
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The store sequence, step by step (live register panels)
// ══════════════════════════════════════════════════════════════════
function StoreSequence() {
  const [step, setStep] = useState(0);

  // Canonical C = A + B result: Store R4, C. R4 holds 8; C is address 200.
  const steps = [
    { rtn: "—", narr: "Before store. R4 holds the result 8. We must write it to memory location C (address 200).",
      r4: "8", mar: "—", mdr: "—", mem: "?", write: false, mfc: false },
    { rtn: "MAR ← C", narr: "T1 — put the destination address into MAR. Memory now knows WHERE we intend to write.",
      r4: "8", mar: "200", mdr: "—", mem: "?", write: false, mfc: false },
    { rtn: "MDR ← [R4]", narr: "T2 — move the data from R4 into MDR. Only MDR can drive memory, so the value must sit here first.",
      r4: "8", mar: "200", mdr: "8", mem: "?", write: false, mfc: false },
    { rtn: "Write;  wait for MFC;  M[MAR] ← [MDR]", narr: "T3 — raise Write and wait for MFC. When memory finishes, M[200] now holds 8. The result is saved.",
      r4: "8", mar: "200", mdr: "8", mem: "8", write: true, mfc: true },
  ];
  const s = steps[step];

  const Panel = ({ label, val, col }) => (
    <div style={{ flex: 1, minWidth: 70, background: C.card, border: `1.5px solid ${val !== "—" && val !== "?" ? col : C.border}`, borderRadius: 8, padding: "8px 6px", textAlign: "center", transition: "all 0.25s" }}>
      <div style={{ color: C.muted, fontSize: 10, marginBottom: 3 }}>{label}</div>
      <div style={{ color: val !== "—" && val !== "?" ? col : C.muted, fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>{val}</div>
    </div>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Our old friend <code style={{ color: C.teal, fontFamily: "monospace" }}>C = A + B</code> ends with
        <code style={{ color: C.purple, fontFamily: "monospace" }}> Store R4, C</code>. R4 holds the result
        <strong style={{ color: C.text }}> 8</strong>; C is address 200. Step the three beats and watch the value cross out to
        memory — data always <strong style={{ color: C.yellow }}>through MDR</strong>.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <Panel label="R4" val={s.r4} col={C.teal} />
        <Panel label="MAR" val={s.mar} col={C.orange} />
        <Panel label="MDR" val={s.mdr} col={C.yellow} />
        <Panel label="M[200]" val={s.mem} col={C.green} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, textAlign: "center", padding: "6px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: s.write ? C.red + "22" : C.card, border: `1.5px solid ${s.write ? C.red : C.border}`, color: s.write ? C.red : C.muted }}>
          Write {s.write ? "● HIGH" : "○ low"}
        </div>
        <div style={{ flex: 1, textAlign: "center", padding: "6px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: s.mfc ? C.teal + "22" : C.card, border: `1.5px solid ${s.mfc ? C.teal : C.border}`, color: s.mfc ? C.teal : C.muted }}>
          MFC {s.mfc ? "● arrived" : "○ waiting"}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10 }}>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: step === 0 ? C.muted : C.accent, fontWeight: 700, marginBottom: 6 }}>
          {step === 0 ? "(idle)" : `T${step}:  ${s.rtn}`}
        </div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{s.narr}</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStep(v => Math.min(3, v + 1))} disabled={step === 3} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: step === 3 ? C.card : C.accentGlow, color: step === 3 ? C.muted : "#fff",
          cursor: step === 3 ? "default" : "pointer",
        }}>Next clock beat ▶ ({step} / 3)</button>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.green}>
        Store on the single bus is three beats: <code style={{ fontFamily: "monospace" }}>MAR ← address</code> (where),
        <code style={{ fontFamily: "monospace" }}> MDR ← [R4]</code> (what), then <code style={{ fontFamily: "monospace" }}>Write</code>
        + wait for MFC (<code style={{ fontFamily: "monospace" }}>M[MAR] ← [MDR]</code>). Address and data are both loaded
        <strong style={{ color: C.text }}> before</strong> Write is raised.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The order gotcha: Write before MDR corrupts memory
// ══════════════════════════════════════════════════════════════════
function OrderGotcha() {
  const [correct, setCorrect] = useState(true);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A Load that samples too early loads garbage into a register — annoying, but recoverable. A <strong style={{ color: C.text }}>Store
        in the wrong order writes garbage into memory</strong> — it destroys real data. Order matters more here. Toggle it.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[[true, "Load MDR, then Write ✓", C.green], [false, "Write before MDR is ready ✗", C.red]].map(([v, label, col]) => (
          <button key={String(v)} onClick={() => setCorrect(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12,
            background: correct === v ? col + "22" : C.card,
            border: `2px solid ${correct === v ? col : C.border}`, color: correct === v ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.9 }}>
        {correct ? (
          <div>
            <div style={{ color: C.muted }}>T1&nbsp; MAR ← C</div>
            <div style={{ color: C.green }}>T2&nbsp; MDR ← [R4]&nbsp;&nbsp;<span style={{ color: C.muted }}>// data ready = 8</span></div>
            <div style={{ color: C.green }}>T3&nbsp; Write, MFC&nbsp;&nbsp;<span style={{ color: C.muted }}>// M[200] ← 8 ✓</span></div>
          </div>
        ) : (
          <div>
            <div style={{ color: C.muted }}>T1&nbsp; MAR ← C</div>
            <div style={{ color: C.red }}>T2&nbsp; Write, MFC&nbsp;&nbsp;<span style={{ color: C.muted }}>// MDR still empty!</span></div>
            <div style={{ color: C.red }}>T3&nbsp; MDR ← [R4]&nbsp;&nbsp;<span style={{ color: C.muted }}>// too late</span></div>
          </div>
        )}
      </div>

      <div style={{ background: correct ? C.green + "12" : C.red + "12", border: `1px solid ${correct ? C.green : C.red}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {correct
          ? <span>✓ MDR holds 8 <strong style={{ color: C.green }}>before</strong> Write fires, so memory location C correctly becomes 8.</span>
          : <span>✗ Write fires while MDR is still empty/stale, so <strong style={{ color: C.red }}>whatever junk sits in MDR is burned into memory</strong> at address C — the previous value of C is gone forever. Corrupting memory is worse than a bad register read.</span>}
      </div>

      <Key color={C.red}>
        For a Store, <strong style={{ color: C.text }}>both MAR (address) and MDR (data) must be loaded before Write is
        raised</strong>. The control unit (Unit 2.7) is what guarantees this ordering every single time — the reason a processor
        needs a conductor, not just wires.
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
      q: "When the CPU stores register R4 to memory, what path does the data take?",
      options: [
        "R4 → memory directly",
        "R4 → MAR → memory",
        "R4 → MDR, then MDR → M[MAR]",
        "R4 → ALU → memory",
      ],
      answer: 2,
      explain: "Just like Load, all data to/from memory passes through MDR. For a Store: MDR ← [R4], then M[MAR] ← [MDR], with the address held in MAR. R4 never touches memory directly.",
    },
    {
      q: "How does a Store differ from a Load at the MAR/MDR gateway?",
      options: [
        "Store uses a different pair of registers",
        "The address direction reverses",
        "Only the data direction and the Read/Write line change — MDR drives memory instead of receiving from it",
        "Store skips MAR entirely",
      ],
      answer: 2,
      explain: "The gateway is identical: MAR out for the address either way. What flips is the data direction — for Store, MDR is the source driving memory (Write); for Load, MDR receives from memory (Read).",
    },
    {
      q: "What is the correct single-bus store micro-sequence?",
      options: [
        "Write; MAR ← address; MDR ← [R4]",
        "MAR ← address; MDR ← [R4]; Write, wait for MFC, M[MAR] ← [MDR]",
        "MDR ← [R4]; Write; MAR ← address",
        "MAR ← [R4]; MDR ← address; Write",
      ],
      answer: 1,
      explain: "Address into MAR (where), data into MDR (what), then raise Write and wait for MFC so M[MAR] receives MDR. Both registers are loaded before Write is asserted.",
    },
    {
      q: "Why is raising Write before MDR is loaded especially dangerous?",
      options: [
        "It slows the clock down",
        "It writes whatever junk is in MDR into memory, destroying the real data there",
        "It resets the program counter",
        "It has no effect — the CPU auto-corrects",
      ],
      answer: 1,
      explain: "A premature Write burns stale/garbage MDR contents into the addressed memory location, overwriting valid data irrecoverably. That's why the control unit must load MAR and MDR before asserting Write.",
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
          {score === 4 ? "Perfect! You can trace a store and explain why order and MFC both matter." :
            score >= 2 ? "Good work! Replay 'The Store Sequence' and 'The Order Gotcha' to lock it in." :
              "Revisit 'Read vs Write' and 'The Store Sequence' — the whole unit rests on those two."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now store a word: MAR ← address, MDR ← register, Write + wait for MFC — with both registers loaded before
            Write, or memory gets corrupted.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.5 — Executing a Complete Instruction.</strong>{" "}
            You have fetch and store as building blocks. Now assemble the full control sequence that runs one whole instruction
            from start to finish.
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
export default function Unit2_4({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Store?" },
    { id: "rw", label: "Read vs Write" },
    { id: "seq", label: "The Store Sequence" },
    { id: "order", label: "The Order Gotcha" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📤 Why Store at All?</h3>
      <TheNeed />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>↔️ Read vs Write — one gateway</h3>
      <ReadVsWrite />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⏱️ The Store Sequence — beat by beat</h3>
      <StoreSequence />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⚠️ The Order Gotcha</h3>
      <OrderGotcha />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.4.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📤</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Storing a Word in Memory</div>
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
