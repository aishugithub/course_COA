// Unit1_5.jsx — Module 1 › Unit 1.5 — "Memory Operations & Instructions"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: the two memory operations (Read/Write) in RTN → two languages (RTN vs
// assembly) → three ways to classify instructions → RISC vs CISC → quiz.
// Reuses the canonical C = A + B program from Unit 1.2 (textbook load/store).
import React, { useState } from "react";

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
//  Section 1 — The Two Memory Operations: Read & Write
// ══════════════════════════════════════════════════════════════════
function ReadWrite() {
  const [op, setOp] = useState("read");
  const isRead = op === "read";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        No matter how fancy a program looks, memory only ever does <strong>two</strong> things:
        <strong style={{ color: C.green }}> Read</strong> (copy a word <em>out</em> of memory) and
        <strong style={{ color: C.orange }}> Write</strong> (copy a word <em>into</em> memory). Both go through
        MAR (address) and MDR (data), just as you saw in Unit 1.2.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["read", "Read (Load)"], ["write", "Write (Store)"]].map(([k, lbl]) => (
          <button key={k} onClick={() => setOp(k)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: `1px solid ${op === k ? (k === "read" ? C.green : C.orange) : C.border}`,
            background: op === k ? (k === "read" ? C.green : C.orange) + "22" : "transparent",
            color: op === k ? (k === "read" ? C.green : C.orange) : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      <svg viewBox="0 0 380 150" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
        {/* CPU register on the left, Memory on the right */}
        <rect x={20} y={50} width={90} height={50} rx={8} fill={C.card} stroke={C.purple} />
        <text x={65} y={72} fontSize={11} fill={C.text} textAnchor="middle">Register</text>
        <text x={65} y={88} fontSize={11} fill={C.teal} textAnchor="middle">R2</text>

        <rect x={270} y={40} width={95} height={70} rx={8} fill={C.card} stroke={C.accent} />
        <text x={317} y={34} fontSize={10} fill={C.accent} textAnchor="middle">Memory</text>
        <text x={317} y={72} fontSize={10} fill={C.muted} textAnchor="middle">location A</text>
        <text x={317} y={90} fontSize={13} fill={C.text} textAnchor="middle" fontFamily="monospace">5</text>

        {/* the transfer arrow */}
        <line x1={110} y1={75} x2={270} y2={75} stroke={isRead ? C.green : C.orange} strokeWidth={4} strokeLinecap="round" />
        <circle r={5} fill={isRead ? C.green : C.orange}>
          <animate attributeName="cx" values={isRead ? "270;110" : "110;270"} dur="1.1s" repeatCount="indefinite" />
          <animate attributeName="cy" values="75;75" dur="1.1s" repeatCount="indefinite" />
        </circle>
        <text x={190} y={65} fontSize={10} fill={isRead ? C.green : C.orange} textAnchor="middle">{isRead ? "◀ data in" : "data out ▶"}</text>
      </svg>

      <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 10, background: (isRead ? C.green : C.orange) + "12", border: `1px solid ${(isRead ? C.green : C.orange)}44` }}>
        <div style={{ color: isRead ? C.green : C.orange, fontWeight: 700, fontSize: 14 }}>{isRead ? "Read — copy FROM memory" : "Write — copy TO memory"}</div>
        <div style={{ fontFamily: "monospace", fontSize: 16, color: C.text, margin: "8px 0" }}>
          {isRead ? "R2 ← [A]" : "M[C] ← [R4]"}
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
          {isRead
            ? "The contents of location A are copied into R2. A keeps its value — a read is non-destructive."
            : "The contents of R4 are copied into location C, overwriting whatever was there."}
        </div>
      </div>

      <Key>
        Every data movement in this course is built from these two primitives. In our textbook machine only
        <strong style={{ color: C.text }}> Load</strong> (a Read) and <strong style={{ color: C.text }}>Store</strong>
        (a Write) touch memory — arithmetic happens only between registers.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Two Languages for One Action (RTN vs Assembly)
// ══════════════════════════════════════════════════════════════════
function TwoLanguages() {
  // The canonical C = A + B program (A=5, B=3 → C=8), from Unit 1.2.
  const prog = [
    { addr: 100, asm: "Load  R2, A", rtn: "R2 ← [A]", note: "copy A (5) into R2" },
    { addr: 104, asm: "Load  R3, B", rtn: "R3 ← [B]", note: "copy B (3) into R3" },
    { addr: 108, asm: "Add   R4, R2, R3", rtn: "R4 ← [R2] + [R3]", note: "register-to-register add → 8" },
    { addr: 112, asm: "Store R4, C", rtn: "M[C] ← [R4]", note: "write 8 back to C" },
  ];
  const [sel, setSel] = useState(2);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The same instruction can be written two ways: <strong style={{ color: C.teal }}>RTN</strong> to <em>describe</em>
        precisely what moves where, and <strong style={{ color: C.accent }}>Assembly</strong> to actually <em>program</em>
        it with mnemonics. Click a line to line them up.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 1fr", gap: 6, alignItems: "stretch" }}>
        <div style={{ color: C.muted, fontSize: 10, textAlign: "center", alignSelf: "end" }}>ADDR</div>
        <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, textAlign: "center" }}>Assembly — to program</div>
        <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, textAlign: "center" }}>RTN — to describe</div>

        {prog.map((p, i) => {
          const on = sel === i;
          return (
            <React.Fragment key={i}>
              <button onClick={() => setSel(i)} style={{ ...cell(on), color: C.muted, fontFamily: "monospace", fontSize: 12 }}>{p.addr}</button>
              <button onClick={() => setSel(i)} style={{ ...cell(on, C.accent), fontFamily: "monospace", fontSize: 13, color: C.text, textAlign: "left" }}>{p.asm}</button>
              <button onClick={() => setSel(i)} style={{ ...cell(on, C.teal), fontFamily: "monospace", fontSize: 13, color: C.text, textAlign: "left" }}>{p.rtn}</button>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
        <strong style={{ color: C.text }}>Line {prog[sel].addr}:</strong> <code style={{ color: C.accent }}>{prog[sel].asm}</code>
        {"  "}means{"  "}<code style={{ color: C.teal }}>{prog[sel].rtn}</code> — {prog[sel].note}.
      </div>

      <Key color={C.teal}>
        RTN is math-like and unambiguous (great for reasoning); assembly is what you hand the assembler. Same action,
        two notations — and only Load/Store mention memory, exactly as the load/store rule promises.
      </Key>
    </div>
  );
}
function cell(on, accent = C.border) {
  return {
    padding: "9px 10px", borderRadius: 7, cursor: "pointer",
    border: `1px solid ${on ? accent : C.border}`,
    background: on ? accent + "18" : C.card,
    transition: "all 0.15s",
  };
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Classify Instructions (three lenses)
// ══════════════════════════════════════════════════════════════════
function Classify() {
  const [lens, setLens] = useState("func");

  const funcGroups = [
    { g: "Data transfer", color: C.teal, ex: "Load, Store, Move", body: "Copy data between memory and registers without changing it." },
    { g: "Arithmetic / Logic", color: C.orange, ex: "Add, Sub, And, Or", body: "The ALU work — the actual computing." },
    { g: "Control flow", color: C.purple, ex: "Branch, Jump, Call", body: "Change which instruction runs next (Unit 1.6)." },
    { g: "I/O", color: C.green, ex: "In, Out", body: "Move data to/from the outside world." },
  ];

  const operandForms = [
    { n: "3-address", code: ["Add C, A, B"], body: "Name all three: two sources + destination. C ← A + B in one line." },
    { n: "2-address", code: ["Move C, A", "Add  C, B"], body: "Destination doubles as a source: C ← C + B." },
    { n: "1-address", code: ["Load A", "Add  B", "Store C"], body: "A single accumulator is the implied operand." },
    { n: "0-address", code: ["Push A", "Push B", "Add", "Pop  C"], body: "A stack machine — operands are implied on top of the stack." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        There are thousands of instructions — we tame them by classifying. Three useful lenses:
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {[["func", "By functionality"], ["operands", "By # of operands"], ["format", "By format"]].map(([k, lbl]) => (
          <button key={k} onClick={() => setLens(k)} style={{
            flex: 1, minWidth: 110, padding: "8px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600,
            border: `1px solid ${lens === k ? C.accent : C.border}`,
            background: lens === k ? C.accentGlow : "transparent", color: lens === k ? "#fff" : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      {lens === "func" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {funcGroups.map((f) => (
            <div key={f.g} style={{ padding: "11px 13px", borderRadius: 9, background: f.color + "12", border: `1px solid ${f.color}44` }}>
              <div style={{ color: f.color, fontWeight: 700, fontSize: 13 }}>{f.g}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: C.text, margin: "3px 0" }}>{f.ex}</div>
              <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.5 }}>{f.body}</div>
            </div>
          ))}
        </div>
      )}

      {lens === "operands" && (
        <div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>Same job — compute <code style={{ color: C.teal }}>C = A + B</code> — expressed with fewer and fewer explicit operands:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {operandForms.map((o) => (
              <div key={o.n} style={{ padding: "11px 13px", borderRadius: 9, background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{o.n}</div>
                <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>{o.code.join("\n")}</pre>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 5, lineHeight: 1.5 }}>{o.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lens === "format" && (
        <div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>By how the bits are laid out — three basic instruction formats:</div>
          {[
            { n: "Register format", color: C.teal, fields: ["opcode", "R_dst", "R_src1", "R_src2"], body: "All operands are registers — e.g. Add R4, R2, R3." },
            { n: "Immediate format", color: C.orange, fields: ["opcode", "R_dst", "constant"], body: "One operand is a constant baked into the instruction." },
            { n: "Memory / jump format", color: C.purple, fields: ["opcode", "address"], body: "Carries a memory address — Load, Store, or a branch target." },
          ].map((f) => (
            <div key={f.n} style={{ marginBottom: 8 }}>
              <div style={{ color: f.color, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{f.n}</div>
              <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                {f.fields.map((fl, i) => (
                  <div key={i} style={{ flex: i === 0 ? 0.8 : 1, padding: "7px 4px", textAlign: "center", borderRadius: 5, background: f.color + "18", border: `1px solid ${f.color}55`, fontSize: 10.5, color: C.text, fontFamily: "monospace" }}>{fl}</div>
                ))}
              </div>
              <div style={{ color: C.muted, fontSize: 11.5 }}>{f.body}</div>
            </div>
          ))}
        </div>
      )}

      <Key>
        By <strong style={{ color: C.text }}>functionality</strong> = what it does; by <strong style={{ color: C.text }}>number
        of operands</strong> = how many it names (3 → 0); by <strong style={{ color: C.text }}>format</strong> = how the
        bits are packed. Three lenses on the same instruction set.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — RISC vs CISC
// ══════════════════════════════════════════════════════════════════
function RiscCisc() {
  const [side, setSide] = useState("risc");
  const isRisc = side === "risc";

  const risc = ["Load  R2, A", "Load  R3, B", "Add   R4, R2, R3", "Store R4, C"];
  const cisc = ["Add C, A, B"];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Two design philosophies answer one question: how much should a <em>single</em> instruction do? Watch the same
        <code style={{ color: C.teal }}> C = A + B</code> under each.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["risc", "RISC — Reduced"], ["cisc", "CISC — Complex"]].map(([k, lbl]) => (
          <button key={k} onClick={() => setSide(k)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: `1px solid ${side === k ? (k === "risc" ? C.green : C.orange) : C.border}`,
            background: side === k ? (k === "risc" ? C.green : C.orange) + "22" : "transparent",
            color: side === k ? (k === "risc" ? C.green : C.orange) : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ color: isRisc ? C.green : C.orange, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
          {isRisc ? "4 simple, one-word instructions · load/store · register-to-register" : "1 multi-word instruction · operates directly on memory operands"}
        </div>
        <pre style={{ margin: 0, fontFamily: "monospace", fontSize: 14, color: C.text, lineHeight: 1.7 }}>{(isRisc ? risc : cisc).join("\n")}</pre>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 150, padding: "11px 13px", borderRadius: 8, background: C.green + "10", border: `1px solid ${C.green}33` }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>RISC</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Few, simple, fixed-length instructions. Only Load/Store touch memory. More lines, but each is fast and easy to pipeline (Module 3).</div>
        </div>
        <div style={{ flex: 1, minWidth: 150, padding: "11px 13px", borderRadius: 8, background: C.orange + "10", border: `1px solid ${C.orange}33` }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>CISC</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Rich, variable-length instructions that can compute on memory operands directly. Fewer lines, but each is slower and more complex.</div>
        </div>
      </div>

      <Key color={C.green}>
        Neither is "better" everywhere. Our textbook machine is <strong style={{ color: C.text }}>RISC-style
        load/store</strong> — simple instructions, arithmetic only between registers — which is why the C = A + B
        program is always four lines.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "Memory fundamentally supports only which two operations?",
      options: [
        "Add and Subtract",
        "Read (copy out) and Write (copy in)",
        "Fetch and Decode",
        "Push and Pop",
      ],
      answer: 1,
      explain: "Everything reduces to Read (Load) — copy a word out of memory — and Write (Store) — copy a word in. Both pass through MAR and MDR.",
    },
    {
      q: "What does the assembly line  Add R4, R2, R3  mean in RTN?",
      options: [
        "M[R4] ← [R2] + [R3]",
        "R4 ← [R2] + [R3]",
        "R4 ← R2 + R3 + memory",
        "[A] ← [R2] + [R3]",
      ],
      answer: 1,
      explain: "R4 ← [R2] + [R3]: add the CONTENTS of R2 and R3, put the result in R4. It's register-to-register — no memory touched, per the load/store rule.",
    },
    {
      q: "Expressed with the FEWEST explicit operands, C = A + B on a stack machine uses which style?",
      options: [
        "3-address (Add C, A, B)",
        "2-address (Add C, B)",
        "1-address (accumulator)",
        "0-address (Push A, Push B, Add, Pop C)",
      ],
      answer: 3,
      explain: "A 0-address (stack) machine names no operands in the Add itself — they're implied on top of the stack. That's the extreme of the operand-count classification.",
    },
    {
      q: "Which statement best captures the RISC philosophy used by our textbook machine?",
      options: [
        "One powerful instruction does the whole job on memory operands",
        "Many simple, fixed-length instructions; only Load/Store touch memory",
        "Instructions may be any length and compute directly in memory",
        "There are no registers — everything is done in memory",
      ],
      answer: 1,
      explain: "RISC = Reduced Instruction Set: simple, uniform, load/store, register-to-register arithmetic. That's why C = A + B is always Load, Load, Add, Store.",
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
          {score === 4 ? "Perfect! You can read an instruction in both languages and place it in every classification." :
            score >= 2 ? "Good work! Replay 'Two Languages' — match each assembly line to its RTN." :
              "Revisit the Read/Write widget and 'Two Languages', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 1.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now write an instruction, describe it in RTN, classify it, and tell RISC from CISC.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 1.6 — Addressing Modes.</strong>{" "}
            Every instruction must say WHERE its operand is — a constant, a register, an address, or a pointer. How many ways can one instruction reach its data?
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
          const isAns = i === q.answer;
          const isPick = i === selected;
          let bg = "transparent", bd = C.border, col = C.text;
          if (selected !== null) {
            if (isAns) { bg = C.green + "22"; bd = C.green; col = C.green; }
            else if (isPick) { bg = C.red + "22"; bd = C.red; col = C.red; }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={selected !== null} style={{
              textAlign: "left", padding: "11px 14px", borderRadius: 8,
              background: bg, border: `1px solid ${bd}`, color: col,
              cursor: selected === null ? "pointer" : "default", fontSize: 13.5, lineHeight: 1.5,
            }}>{opt}{selected !== null && isAns ? "  ✓" : ""}</button>
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
//  Main
// ══════════════════════════════════════════════════════════════════
export default function Unit1_5({ student, onUnitComplete }) {
  const sections = [
    { id: "rw", label: "Read & Write" },
    { id: "lang", label: "Two Languages" },
    { id: "classify", label: "Classify" },
    { id: "risccisc", label: "RISC vs CISC" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📥 Read &amp; Write — the only two memory operations</h3>
      <ReadWrite />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗣️ Two Languages for One Action — RTN &amp; Assembly</h3>
      <TwoLanguages />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗂️ Classify Instructions — three useful lenses</h3>
      <Classify />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⚖️ RISC vs CISC — how much per instruction?</h3>
      <RiscCisc />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 1.5.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📝</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.5</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Memory Operations &amp; Instructions</div>
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
