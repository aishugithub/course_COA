// Unit2_3.jsx — Module 2 › Unit 2.3 — "Fetching a Word from Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 3 (Execution of Complete Instructions,
// Hamacher §5.1–5.3) — the single-bus fetch micro-sequence.
// Arc: why fetch (register vs memory) → the single-bus datapath → the fetch
// sequence step-by-step (MAR←PC, Read, MDR←M[MAR], IR←MDR) → waiting for MFC
// (memory is slow) → quiz.
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
//  Section 1 — The Need: a register is next door, memory is across town
// ══════════════════════════════════════════════════════════════════
function TheNeed() {
  const [where, setWhere] = useState(null); // "reg" | "mem"

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In Unit 2.1 a value crossed from <strong style={{ color: C.teal }}>register to register</strong> in a single clock —
        they sit side by side inside the CPU. But the <strong style={{ color: C.text }}>instructions themselves live in main
        memory</strong>, outside the processor. Before the CPU can run an instruction, it must first <em>go and get it</em>.
        Click each place and compare the trip.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["reg", "Read a register", C.teal], ["mem", "Read from memory", C.orange]].map(([k, label, col]) => (
          <button key={k} onClick={() => setWhere(k)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: where === k ? col + "22" : C.card,
            border: `2px solid ${where === k ? col : C.border}`, color: where === k ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: where === "reg" ? C.teal + "1E" : C.card, border: `2px solid ${where === "reg" ? C.teal : C.border}`, borderRadius: 10, padding: "12px 14px", transition: "all 0.25s" }}>
          <div style={{ color: C.teal, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>NEXT DOOR — a register</div>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: C.text }}>R2 ← [R1]</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>1 clock · the wires already touch</div>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: where === "mem" ? C.orange + "1E" : C.card, border: `2px solid ${where === "mem" ? C.orange : C.border}`, borderRadius: 10, padding: "12px 14px", transition: "all 0.25s" }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>ACROSS TOWN — main memory</div>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: C.text }}>IR ← M[PC]</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>several clocks · send an address, wait for a reply</div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>
        {where === null
          ? "Pick a place to read from."
          : where === "reg"
            ? <span>A register read is instant — no address to send, no waiting. This is what Unit 2.1 handled.</span>
            : <span>Memory can't be read like a register. The CPU must <strong style={{ color: C.orange }}>put an address on the address lines</strong>, raise a <strong style={{ color: C.orange }}>Read</strong> signal, and then <strong style={{ color: C.red }}>wait</strong> until memory answers. That whole ritual is <strong style={{ color: C.text }}>fetching a word</strong> — this unit.</span>}
      </div>

      <Key color={C.accent}>
        A program can't run until its instructions are pulled out of memory and into the CPU. Reaching memory is not one wire —
        it is <strong style={{ color: C.text }}>send address → raise Read → wait for the reply</strong>. Getting that ritual
        exactly right is what "fetch" means.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The single-bus datapath (reveal MAR/MDR as the gateway)
// ══════════════════════════════════════════════════════════════════
function SingleBusDatapath() {
  const [reveal, setReveal] = useState(0); // 0..3 pieces shown

  const pieces = [
    "Inside the CPU, the registers (PC, IR, R0…Rn) and the ALU all hang off ONE shared internal bus.",
    "Main memory is OUTSIDE. The CPU reaches it through just two special registers: MAR holds the address, MDR holds the data.",
    "So every memory access is a bridge: address goes out via MAR, the word comes back via MDR. Nothing on the internal bus touches memory directly.",
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Before we trace the fetch, meet the road it drives on. This is the <strong style={{ color: C.accent }}>single-bus
        organization</strong>: one shared highway inside the processor, and a two-register bridge to the memory outside.
        Reveal it piece by piece.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 250" style={{ width: "100%", display: "block" }}>
          {/* internal bus spine */}
          <line x1={40} y1={70} x2={480} y2={70} stroke={C.accent} strokeWidth={5} opacity={reveal >= 1 ? 1 : 0.25} style={{ transition: "opacity 0.3s" }} />
          <text x={260} y={30} textAnchor="middle" fill={C.accent} fontSize={11} fontWeight="700" opacity={reveal >= 1 ? 1 : 0.25}>single internal processor bus</text>

          {/* registers + ALU on the bus */}
          {[["PC", 60, C.teal], ["IR", 150, C.teal], ["ALU", 240, C.purple], ["MDR", 340, C.yellow], ["MAR", 430, C.yellow]].map(([lbl, x, col], i) => {
            const on = reveal >= 1 && (i < 3 ? true : reveal >= 2);
            return (
              <g key={lbl} opacity={on ? 1 : 0.22} style={{ transition: "opacity 0.3s" }}>
                <rect x={x - 34} y={42} width={68} height={28} rx={6} fill={C.card} stroke={col} strokeWidth={1.8} />
                <text x={x} y={60} textAnchor="middle" fill={col} fontSize={12} fontWeight="700">{lbl}</text>
                <line x1={x} y1={70} x2={x} y2={42} stroke={C.border} strokeWidth={1.5} />
              </g>
            );
          })}

          {/* the bridge to external memory */}
          <g opacity={reveal >= 2 ? 1 : 0.2} style={{ transition: "opacity 0.3s" }}>
            <line x1={340} y1={70} x2={340} y2={175} stroke={C.yellow} strokeWidth={2.5} />
            <text x={330} y={130} textAnchor="end" fill={C.yellow} fontSize={10} fontWeight="700">data</text>
            <line x1={430} y1={70} x2={430} y2={175} stroke={C.teal} strokeWidth={2.5} />
            <text x={440} y={130} fill={C.teal} fontSize={10} fontWeight="700">address</text>
            <rect x={300} y={178} width={170} height={46} rx={8} fill={C.surface} stroke={C.red} strokeWidth={1.8} />
            <text x={385} y={200} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="700">Main Memory</text>
            <text x={385} y={216} textAnchor="middle" fill={C.muted} fontSize={9}>external — reached only via MAR / MDR</text>
          </g>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 44, lineHeight: 1.6, marginBottom: 10 }}>
        {reveal === 0 ? "Press Reveal to build up the datapath." : pieces[reveal - 1]}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setReveal(v => Math.min(3, v + 1))} disabled={reveal === 3} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: reveal === 3 ? C.card : C.accentGlow, color: reveal === 3 ? C.muted : "#fff",
          cursor: reveal === 3 ? "default" : "pointer",
        }}>Reveal ▶ ({reveal} / 3)</button>
        <button onClick={() => setReveal(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.yellow}>
        On a single-bus machine, <strong style={{ color: C.yellow }}>MAR</strong> (address) and
        <strong style={{ color: C.yellow }}> MDR</strong> (data) are the ONLY gateway between the CPU and memory — exactly the
        MAR/MDR rule you met in Unit 2.1. One shared bus means <strong style={{ color: C.text }}>one transfer per clock</strong>,
        which is why fetching takes several steps.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The fetch sequence, step by step (live register panels)
// ══════════════════════════════════════════════════════════════════
function FetchSequence() {
  const [step, setStep] = useState(0);

  // Concrete story: PC = 100, the instruction word at M[100] is "Load R2,A".
  // Single-bus Hamacher fetch, one bus transfer per clock.
  const steps = [
    { rtn: "—", narr: "Before fetch. PC points at address 100, where the next instruction word waits in memory.",
      pc: "100", mar: "—", mdr: "—", ir: "—", read: false, mfc: false },
    { rtn: "MAR ← [PC],  Read", narr: "T1 — copy the PC into MAR and raise the Read signal. The address 100 is now on its way to memory.",
      pc: "100", mar: "100", mdr: "—", ir: "—", read: true, mfc: false },
    { rtn: "wait for MFC;  MDR ← M[MAR],  PC ← PC + 4", narr: "T2 — memory takes its time. When it finishes it asserts MFC; the word 'Load R2,A' lands in MDR, and the PC steps to the next instruction (104).",
      pc: "104", mar: "100", mdr: "Load R2,A", ir: "—", read: false, mfc: true },
    { rtn: "IR ← [MDR]", narr: "T3 — copy the fetched word from MDR into the Instruction Register. The control unit can now decode it. Fetch is done.",
      pc: "104", mar: "100", mdr: "Load R2,A", ir: "Load R2,A", read: false, mfc: false },
  ];
  const s = steps[step];

  const Panel = ({ label, val, col }) => (
    <div style={{ flex: 1, minWidth: 74, background: C.card, border: `1.5px solid ${val !== "—" ? col : C.border}`, borderRadius: 8, padding: "8px 6px", textAlign: "center", transition: "all 0.25s" }}>
      <div style={{ color: C.muted, fontSize: 10, marginBottom: 3 }}>{label}</div>
      <div style={{ color: val !== "—" ? col : C.muted, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{val}</div>
    </div>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here is the whole fetch, written in the <strong style={{ color: C.accent }}>RTN from Unit 2.1</strong> — three clock
        beats on the single bus. Step through and watch the four registers fill. Story: the word
        <code style={{ color: C.teal, fontFamily: "monospace" }}> Load R2,A</code> lives at address 100.
      </p>

      {/* live register panels */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <Panel label="PC" val={s.pc} col={C.teal} />
        <Panel label="MAR" val={s.mar} col={C.orange} />
        <Panel label="MDR" val={s.mdr} col={C.yellow} />
        <Panel label="IR" val={s.ir} col={C.purple} />
      </div>

      {/* signal lamps */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, textAlign: "center", padding: "6px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: s.read ? C.green + "22" : C.card, border: `1.5px solid ${s.read ? C.green : C.border}`, color: s.read ? C.green : C.muted }}>
          Read {s.read ? "● HIGH" : "○ low"}
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

      <Key color={C.accent}>
        Fetch is always the same three beats: <code style={{ fontFamily: "monospace" }}>MAR ← [PC]</code> + Read,
        then <code style={{ fontFamily: "monospace" }}>MDR ← M[MAR]</code> (and PC += 4) once memory answers, then
        <code style={{ fontFamily: "monospace" }}> IR ← [MDR]</code>. <strong style={{ color: C.text }}>Every instruction —
        Load, Add, Store — begins with this identical fetch.</strong>
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Waiting for MFC (memory is slower than the CPU)
// ══════════════════════════════════════════════════════════════════
function WaitForMFC() {
  const [wait, setWait] = useState(true); // does the CPU wait for MFC?

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Why the extra "wait for MFC" beat? Because <strong style={{ color: C.text }}>memory is far slower than the
        processor</strong>. After Read is raised, the word is <em>not</em> in MDR yet. Memory signals it has finished by raising
        <strong style={{ color: C.teal }}> MFC</strong> (Memory-Function-Completed). Toggle whether the CPU waits, and see what
        lands in IR.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[[true, "CPU waits for MFC ✓", C.green], [false, "CPU rushes ahead ✗", C.red]].map(([v, label, col]) => (
          <button key={String(v)} onClick={() => setWait(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: wait === v ? col + "22" : C.card,
            border: `2px solid ${wait === v ? col : C.border}`, color: wait === v ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 150" style={{ width: "100%", display: "block" }}>
          {/* CPU clock ticks vs memory readiness bar */}
          <text x={40} y={30} fill={C.muted} fontSize={10}>CPU clock</text>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={120 + i * 70} y1={18} x2={120 + i * 70} y2={40} stroke={C.accent} strokeWidth={2} />
          ))}
          <line x1={120} y1={40} x2={400} y2={40} stroke={C.accent} strokeWidth={1.5} />

          <text x={40} y={80} fill={C.muted} fontSize={10}>memory busy</text>
          <rect x={120} y={64} width={210} height={20} rx={4} fill={C.orange + "44"} stroke={C.orange} strokeWidth={1.5} />
          <text x={225} y={78} textAnchor="middle" fill={C.orange} fontSize={10} fontWeight="700">reading… (3 CPU clocks)</text>
          <rect x={330} y={64} width={20} height={20} rx={4} fill={C.teal + "44"} stroke={C.teal} strokeWidth={1.5} />
          <text x={340} y={100} textAnchor="middle" fill={C.teal} fontSize={9} fontWeight="700">MFC</text>

          {/* sample point */}
          <line x1={wait ? 340 : 190} y1={110} x2={wait ? 340 : 190} y2={135} stroke={wait ? C.green : C.red} strokeWidth={2.5} />
          <text x={wait ? 340 : 190} y={148} textAnchor="middle" fill={wait ? C.green : C.red} fontSize={10} fontWeight="700">
            {wait ? "MDR sampled here ✓" : "MDR sampled here ✗"}
          </text>
        </svg>
      </div>

      <div style={{ background: wait ? C.green + "12" : C.red + "12", border: `1px solid ${wait ? C.green : C.red}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {wait
          ? <span>✓ The CPU freezes the fetch until MFC arrives, then samples MDR. IR gets the <strong style={{ color: C.green }}>correct instruction word</strong>. Correct, but those idle wait-clocks are exactly why memory is the bottleneck.</span>
          : <span>✗ The CPU samples MDR before memory has finished. IR loads <strong style={{ color: C.red }}>garbage</strong> — a half-formed or stale word — and the whole program derails. This is why the MFC handshake exists.</span>}
      </div>

      <Key color={C.teal}>
        <strong style={{ color: C.teal }}>MFC</strong> is memory's "I'm done" handshake. The CPU raises Read, then
        <strong style={{ color: C.text }}> waits</strong> for MFC before trusting MDR. Slow memory means more wait-clocks — the
        motivation for caches (Module 3) and for multiple buses (next units), which shave beats off exactly this path.
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
      q: "Why can't the CPU read an instruction from memory the way it reads a register?",
      options: [
        "Memory stores instructions in a different language",
        "Memory is external — the CPU must send an address, raise Read, and wait for a reply",
        "Registers are read-only, memory is read/write",
        "Instructions must be decrypted first",
      ],
      answer: 1,
      explain: "A register sits inside the CPU with wires already touching the bus. Memory is outside and reached only through MAR/MDR — send an address, raise Read, and wait. That multi-step ritual is 'fetching a word.'",
    },
    {
      q: "On the single-bus datapath, how does the processor reach main memory?",
      options: [
        "Any register can drive the address and data straight onto memory",
        "Through MAR (address) and MDR (data) only — the two-register bridge",
        "Through the ALU",
        "Through the program counter directly",
      ],
      answer: 1,
      explain: "Main memory is external. MAR holds the address going out, MDR holds the data coming back. Nothing on the internal bus touches memory directly — the MAR/MDR rule from Unit 2.1.",
    },
    {
      q: "What is the correct order of the fetch micro-sequence?",
      options: [
        "IR ← [MDR]; then MAR ← [PC]; then MDR ← M[MAR]",
        "MAR ← [PC], Read; wait for MFC, MDR ← M[MAR], PC ← PC + 4; IR ← [MDR]",
        "PC ← PC + 4; IR ← M[PC]; MAR ← [MDR]",
        "MDR ← [PC]; MAR ← [MDR]; IR ← [MAR]",
      ],
      answer: 1,
      explain: "Address out first (MAR ← [PC] + Read), then once memory answers the word arrives in MDR and PC advances, then the word is copied MDR → IR ready for decoding.",
    },
    {
      q: "What does the MFC signal do during a fetch?",
      options: [
        "It multiplies the fetched value",
        "It tells the CPU that memory has finished, so MDR now holds valid data",
        "It clears the instruction register",
        "It selects which register to load",
      ],
      answer: 1,
      explain: "Memory is slower than the CPU. MFC (Memory-Function-Completed) is memory's 'I'm done' handshake. If the CPU sampled MDR before MFC, it would latch garbage into IR.",
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
          {score === 4 ? "Perfect! You can trace a fetch beat by beat, MFC and all." :
            score >= 2 ? "Good work! Replay 'The Fetch Sequence' and 'Waiting for MFC' to lock it in." :
              "Revisit 'The Single-Bus Datapath' and 'The Fetch Sequence' — the whole unit rests on those two."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now walk the single-bus fetch: MAR ← [PC] + Read, wait for MFC, MDR ← M[MAR], IR ← [MDR] — and explain why
            the MFC handshake is unavoidable.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.4 — Storing a Word in Memory.</strong>{" "}
            Reading pulled a word IN. Now send a result the other way — and watch which register feeds MDR this time.
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
export default function Unit2_3({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Fetch?" },
    { id: "datapath", label: "Single-Bus Datapath" },
    { id: "seq", label: "The Fetch Sequence" },
    { id: "mfc", label: "Waiting for MFC" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📥 Why Fetch at All?</h3>
      <TheNeed />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛣️ The Single-Bus Datapath</h3>
      <SingleBusDatapath />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⏱️ The Fetch Sequence — beat by beat</h3>
      <FetchSequence />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🤝 Waiting for MFC</h3>
      <WaitForMFC />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.3.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📥</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Fetching a Word from Memory</div>
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
