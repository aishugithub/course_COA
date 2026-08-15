// Unit2_C.jsx — Module 2 › Capstone — "Build the Control Sequence"
// Foothold formula: GitHub-dark palette, free-nav tab strip, interactive widgets,
// 🔑 key-insight callouts, 4-question quiz. Capstone arc: The Mission → Build in
// Steps → Play It → Full Code → Quiz. This is the Module 2 capstone (_C).
// Source: synthesis of Unit-2 deck Chapters 3–5 (Hamacher §5; Mano §7) — the full
// single-bus control sequence for Add (R3), R1.
import { useState, useEffect } from "react";

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

// The finished 7-beat control sequence — shared by "Build in Steps", "Play It"
// and "Full Code". Story: PC=100; M[100]=Add(R3),R1; R3=200; M[200]=5; R1=3 → R1=8.
const SEQ = [
  { n: 1, phase: "Fetch",   sig: "PCout, MARin, Read, Select4, Add, Zin", note: "PC → MAR, start Read; ALU makes PC+4 in Z.",
    st: { PC: "100", MAR: "100", MDR: "—", IR: "—", R1: "3", R3: "200", Y: "—", Z: "104" }, mfc: false },
  { n: 2, phase: "Fetch",   sig: "Zout, PCin, Yin, WMFC", note: "Z → PC (now 104); wait for MFC; word arrives in MDR.",
    st: { PC: "104", MAR: "100", MDR: "Add(R3),R1", IR: "—", R1: "3", R3: "200", Y: "104", Z: "104" }, mfc: true },
  { n: 3, phase: "Fetch",   sig: "MDRout, IRin", note: "MDR → IR; control decodes 'Add (R3), R1'.",
    st: { PC: "104", MAR: "100", MDR: "Add(R3),R1", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "104", Z: "104" }, mfc: false },
  { n: 4, phase: "Execute", sig: "R3out, MARin, Read", note: "R3 (200) → MAR, start Read for the memory operand.",
    st: { PC: "104", MAR: "200", MDR: "Add(R3),R1", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "104", Z: "104" }, mfc: false },
  { n: 5, phase: "Execute", sig: "R1out, Yin, WMFC", note: "R1 (3) → Y; wait for MFC; operand 5 lands in MDR.",
    st: { PC: "104", MAR: "200", MDR: "5", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "3", Z: "104" }, mfc: true },
  { n: 6, phase: "Execute", sig: "MDRout, SelectY, Add, Zin", note: "ALU adds MDR (5) to Y (3): Z ← 8.",
    st: { PC: "104", MAR: "200", MDR: "5", IR: "Add(R3),R1", R1: "3", R3: "200", Y: "3", Z: "8" }, mfc: false },
  { n: 7, phase: "Execute", sig: "Zout, R1in, End", note: "Z (8) → R1. End restarts fetch. R1 = 8.",
    st: { PC: "104", MAR: "200", MDR: "5", IR: "Add(R3),R1", R1: "8", R3: "200", Y: "3", Z: "8" }, mfc: false },
];
const START_ST = { PC: "100", MAR: "—", MDR: "—", IR: "—", R1: "3", R3: "200", Y: "—", Z: "—" };

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Mission (spec + tool checklist)
// ══════════════════════════════════════════════════════════════════
function TheMission() {
  const [checked, setChecked] = useState([]);

  const tools = [
    { tool: "RTL & control signals (Xout / Xin)", unit: "Unit 2.1" },
    { tool: "The ALU (Add, Select) + Y, Z latches", unit: "Unit 2.2 / 2.6" },
    { tool: "Fetch: MAR←PC, Read, WMFC, MDR→IR", unit: "Unit 2.3" },
    { tool: "A memory read for the (R3) operand", unit: "Unit 2.3" },
    { tool: "Single-bus datapath (one value/beat)", unit: "Unit 2.5" },
    { tool: "The control unit that sequences it", unit: "Unit 2.7" },
  ];
  const toggle = (i) => setChecked((c) => c.includes(i) ? c.filter((x) => x !== i) : [...c, i]);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Your mission: write the <strong style={{ color: C.text }}>complete control sequence</strong> that runs one machine
        instruction on the single-bus processor — start to finish, beat by beat. The instruction:
      </p>

      <div style={{ background: C.card, border: `2px solid ${C.purple}`, borderRadius: 10, padding: "14px 16px", marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: 22, color: C.purple, fontWeight: 800 }}>Add (R3), R1</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>"add the value at the address in R3 to R1" · R1 ← [R1] + M[[R3]]</div>
      </div>

      <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 10, lineHeight: 1.6 }}>
        Every tool you need was forged in an earlier unit. Tick them off as you recall each — the whole module is on this list.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4 }}>
        {tools.map((t, i) => {
          const on = checked.includes(i);
          return (
            <button key={i} onClick={() => toggle(i)} style={{
              display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "9px 12px", borderRadius: 8,
              cursor: "pointer", background: on ? C.green + "14" : C.card,
              border: `1.5px solid ${on ? C.green : C.border}`, transition: "all 0.2s",
            }}>
              <span style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, background: on ? C.green : "transparent", border: `1.5px solid ${on ? C.green : C.muted}`, color: "#fff", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</span>
              <span style={{ flex: 1, fontSize: 12.5, color: on ? C.text : C.muted }}>{t.tool}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: "monospace" }}>{t.unit}</span>
            </button>
          );
        })}
      </div>

      {checked.length === tools.length && (
        <div style={{ marginTop: 10, background: C.green + "14", border: `1px solid ${C.green}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.green, lineHeight: 1.6 }}>
          ✓ Every tool accounted for. You're ready to build the sequence — one idea at a time.
        </div>
      )}

      <Key color={C.purple}>
        A complete instruction is a <strong style={{ color: C.text }}>script of control-signal sets</strong>, one per clock beat.
        Building it is just combining pieces you already have: fetch, a memory read, the ALU with Y/Z, and a write-back — in the
        right order, sequenced by the control unit.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Build in Steps (v1 fetch → v2 operand → v3 complete)
// ══════════════════════════════════════════════════════════════════
function BuildInSteps() {
  const [v, setV] = useState(1);

  const versions = {
    1: { rows: [1, 2, 3], color: C.green, title: "v1 · Fetch only",
      why: "Start where every instruction starts: the three fetch beats from Unit 2.3 (MAR←PC, WMFC, MDR→IR). But fetch alone doesn't DO anything — it only brings the instruction in. We need execute." },
    2: { rows: [1, 2, 3, 4, 5], color: C.yellow, title: "v2 · + fetch the memory operand",
      why: "(R3) is a memory operand, so its value isn't in a register yet. Add beats 4–5: put R3's address in MAR, Read, and latch R1 into Y while the operand arrives in MDR. Still no add — the operands are just lined up." },
    3: { rows: [1, 2, 3, 4, 5, 6, 7], color: C.purple, title: "v3 · + ALU add & write-back",
      why: "The finish: beat 6 adds MDR to Y into Z; beat 7 writes Z back to R1 and raises End. Now the instruction is complete — R1 becomes 8." },
  };
  const cur = versions[v];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Real engineers grow a sequence, they don't write it in one shot. Build it in three versions — each adds
        <strong style={{ color: C.text }}> exactly one idea</strong>. Flip between them.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[1, 2, 3].map((n) => (
          <button key={n} onClick={() => setV(n)} style={{
            flex: 1, padding: "9px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: v === n ? versions[n].color + "22" : C.card,
            border: `2px solid ${v === n ? versions[n].color : C.border}`, color: v === n ? versions[n].color : C.muted,
          }}>v{n}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
        {SEQ.map((r) => {
          const shown = cur.rows.includes(r.n);
          const isNew = shown && !(v > 1 ? versions[v - 1].rows : []).includes(r.n);
          return (
            <div key={r.n} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              borderTop: r.n > 1 ? `1px solid ${C.border}` : "none",
              background: isNew ? cur.color + "18" : "transparent",
              opacity: shown ? 1 : 0.25, transition: "all 0.25s",
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: r.phase === "Fetch" ? C.green : C.orange, fontWeight: 800, width: 20 }}>{r.n}</span>
              <span style={{ fontFamily: "monospace", fontSize: 11.5, color: shown ? C.text : C.muted, flex: 1 }}>{shown ? r.sig : "· · ·"}</span>
              {isNew && <span style={{ fontSize: 9, fontWeight: 700, color: cur.color }}>NEW</span>}
            </div>
          );
        })}
      </div>

      <div style={{ background: cur.color + "12", border: `1px solid ${cur.color}55`, borderRadius: 8, padding: "10px 14px" }}>
        <div style={{ color: cur.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{cur.title}</div>
        <div style={{ color: C.text, fontSize: 12.5, lineHeight: 1.6 }}>{cur.why}</div>
      </div>

      <Key color={C.accent}>
        Fetch (v1) is the shared opening; the operand read (v2) lines the inputs up; the ALU add + write-back (v3) finishes the
        job. Each version is <strong style={{ color: C.text }}>runnable</strong> — it just does less. That's how you debug a
        control sequence: grow it one verified beat at a time.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Play It (the finished sequence as a working runner)
// ══════════════════════════════════════════════════════════════════
function PlayIt() {
  const [beat, setBeat] = useState(0); // 0 = start, 1..7 = after that beat
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (beat >= 7) { setPlaying(false); return; }
    const id = setTimeout(() => setBeat((b) => b + 1), 1100);
    return () => clearTimeout(id);
  }, [playing, beat]);

  const st = beat === 0 ? START_ST : SEQ[beat - 1].st;
  const row = beat === 0 ? null : SEQ[beat - 1];
  const order = ["PC", "IR", "R1", "R3", "MAR", "MDR", "Y", "Z"];
  const colorFor = { PC: C.teal, IR: C.purple, R1: C.green, R3: C.teal, MAR: C.orange, MDR: C.yellow, Y: C.teal, Z: C.purple };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here is the sequence you built, running on the datapath. Hit <strong style={{ color: C.green }}>Run</strong> to auto-play,
        or step it yourself. Watch <code style={{ color: C.green, fontFamily: "monospace" }}>R1</code> go from 3 to 8.
      </p>

      {/* register grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 10 }}>
        {order.map((k) => {
          const v = st[k];
          const on = v !== "—";
          const justChanged = row && beat > 0 && (beat === 1 ? START_ST[k] !== v : SEQ[beat - 2].st[k] !== v);
          return (
            <div key={k} style={{
              background: justChanged ? colorFor[k] + "22" : C.card,
              border: `1.5px solid ${justChanged ? colorFor[k] : (on ? colorFor[k] + "88" : C.border)}`,
              borderRadius: 8, padding: "7px 4px", textAlign: "center", transition: "all 0.25s",
            }}>
              <div style={{ color: C.muted, fontSize: 10 }}>{k}</div>
              <div style={{ color: on ? colorFor[k] : C.muted, fontFamily: "monospace", fontSize: 11, fontWeight: 700, wordBreak: "break-all" }}>{v}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 10, minHeight: 54 }}>
        {row ? (
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 5 }}>Beat {row.n} · {row.phase}: {row.sig}</div>
            <div style={{ color: C.text, fontSize: 12.5, lineHeight: 1.5 }}>{row.note}</div>
          </div>
        ) : (
          <div style={{ color: C.muted, fontSize: 13 }}>Ready. R1 = 3, R3 points at address 200 (which holds 5). Press Run.</div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { if (beat >= 7) { setBeat(0); setPlaying(true); } else setPlaying((p) => !p); }} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: C.green, color: "#0D1117", cursor: "pointer",
        }}>{playing ? "⏸ Pause" : beat >= 7 ? "↻ Run again" : "▶ Run"}</button>
        <button onClick={() => { setPlaying(false); setBeat((b) => Math.min(7, b + 1)); }} disabled={beat >= 7} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`, fontWeight: 700, fontSize: 13,
          background: beat >= 7 ? C.card : C.accentGlow, color: beat >= 7 ? C.muted : "#fff", cursor: beat >= 7 ? "default" : "pointer",
        }}>Step ▶</button>
        <button onClick={() => { setPlaying(false); setBeat(0); }} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺</button>
      </div>

      {beat >= 7 && (
        <div style={{ marginTop: 10, background: C.green + "14", border: `1px solid ${C.green}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.green, lineHeight: 1.6 }}>
          🎉 Instruction complete in <strong>7 beats</strong> — R1 = 8. Your control sequence works. On a three-bus datapath
          (Unit 2.5), the execute half would collapse into fewer beats.
        </div>
      )}

      <Key color={C.green}>
        You just ran a full instruction from the raw control signals up — the same job a real control unit does billions of times
        a second. Everything since Unit 2.1 lives inside these seven beats.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Full Code (annotated listing + challenge upgrades)
// ══════════════════════════════════════════════════════════════════
function FullCode() {
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The complete control sequence, annotated — the answer to the mission. This is exactly what a control unit stores
        (microprogrammed) or wires up (hardwired).
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontFamily: "monospace", fontSize: 11.5, lineHeight: 1.75 }}>
        <div style={{ color: C.green, marginBottom: 4 }}>// ── Fetch (identical for every instruction) ──</div>
        <div style={{ color: C.text }}>1  PCout, MARin, Read, Select4, Add, Zin</div>
        <div style={{ color: C.text }}>2  Zout, PCin, Yin, WMFC</div>
        <div style={{ color: C.text }}>3  MDRout, IRin</div>
        <div style={{ color: C.orange, margin: "6px 0 4px" }}>// ── Execute Add (R3), R1 ──</div>
        <div style={{ color: C.text }}>4  R3out, MARin, Read</div>
        <div style={{ color: C.text }}>5  R1out, Yin, WMFC</div>
        <div style={{ color: C.text }}>6  MDRout, SelectY, Add, Zin</div>
        <div style={{ color: C.text }}>7  Zout, R1in, End</div>
      </div>

      <div style={{ background: C.teal + "12", border: `1px solid ${C.teal}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.7, marginBottom: 4 }}>
        <div style={{ color: C.teal, fontWeight: 700, marginBottom: 6 }}>🚀 Challenge upgrades</div>
        <div>• Write the sequence for <span style={{ color: C.text, fontFamily: "monospace" }}>Store R1, (R3)</span> — the mirror: load MAR from R3, MDR from R1, then Write + WMFC (Unit 2.4).</div>
        <div>• Re-draw beats 4–7 for a <strong style={{ color: C.text }}>three-bus</strong> datapath — how many beats vanish? (Unit 2.5)</div>
        <div>• Turn this listing into a <strong style={{ color: C.text }}>microroutine</strong>: one control word per beat, End on beat 7 (Unit 2.7).</div>
      </div>

      <Key color={C.orange}>
        Seven lines <em>are</em> the instruction, at the hardware level. Change the opcode and only the execute half changes;
        the fetch half is shared by all. That reuse is why processors are built from a handful of micro-steps, not thousands of
        special cases.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, instant feedback, MODULE completion card
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "Which beats of the sequence are the SAME for every instruction?",
      options: [
        "The execute beats (4–7)",
        "The fetch beats (1–3): MAR←PC, WMFC, MDR→IR",
        "None — every instruction is fully unique",
        "Only the final End beat",
      ],
      answer: 1,
      explain: "Fetch is shared by all instructions — bring the word into IR the same way every time. Only the execute half depends on the opcode. That shared prefix is why control units are compact.",
    },
    {
      q: "In Add (R3), R1, why is there a Read on beat 4 in addition to the fetch Read?",
      options: [
        "To re-read the instruction",
        "(R3) is a memory operand — R3 holds its address, so the value must be fetched from memory before the add",
        "To store the result",
        "To reset the program counter",
      ],
      answer: 1,
      explain: "Beat 4 puts R3's contents (the operand address) in MAR and reads memory; the operand arrives in MDR by beat 5. Then the ALU adds it to R1 (staged in Y) and writes back.",
    },
    {
      q: "Why must R1 be latched into Y (beat 5) before the add?",
      options: [
        "To save power",
        "The single bus carries one value per beat, so one operand waits in Y while the other travels the bus into the ALU",
        "Because R1 is read-only",
        "To convert R1 to two's complement",
      ],
      answer: 1,
      explain: "On a single bus only one value moves per beat, but the ALU needs two inputs. Y holds R1 steady while MDR's operand travels the bus on beat 6; Z then catches the sum.",
    },
    {
      q: "What does the End signal on beat 7 do?",
      options: [
        "Halts the processor",
        "Restarts the control counter at the fetch sequence for the next instruction",
        "Clears every register",
        "Writes the result to memory",
      ],
      answer: 1,
      explain: "End marks the last beat and loops the control unit back to fetch, so the next instruction begins. It's the same End bit you saw in the microprogrammed control store (Unit 2.7).",
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
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🏆" : "💪"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Flawless. You can author a full control sequence and defend every beat." :
            score >= 2 ? "Strong finish! Replay 'Build in Steps' and 'Play It' to seal it." :
              "Revisit 'The Mission' and 'Build in Steps' — then run 'Play It' once more."}
        </div>
        <div style={{
          padding: "22px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.green}22, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.green}66`,
        }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>🏆 Module 2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            From a single register transfer to a complete instruction: you built the ALU, fetched and stored words, executed a
            whole instruction on the single bus, compared bus organizations, and wired up the control unit that conducts it all.
            <strong style={{ color: C.text }}> A processor is a datapath plus a plan for driving it — and now you can write that plan.</strong>
            <br /><br />
            <strong style={{ color: C.accent }}>Next module: M3 — Pipelining.</strong>{" "}
            Seven beats per instruction, one at a time, is a lot of idle hardware. What if the next instruction's fetch began
            before this one finished? Turn the CPU into an assembly line.
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
export default function Unit2_C({ student, onUnitComplete }) {
  const sections = [
    { id: "mission", label: "The Mission" },
    { id: "build", label: "Build in Steps" },
    { id: "play", label: "Play It" },
    { id: "code", label: "Full Code" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎯 The Mission</h3>
      <TheMission />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🧱 Build in Steps</h3>
      <BuildInSteps />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎮 Play It — run your sequence</h3>
      <PlayIt />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📜 Full Code</h3>
      <FullCode />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Capstone Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to close out Module 2.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏗️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › CAPSTONE</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Build the Control Sequence</div>
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
