// Unit3_3.jsx — Module 3 › Unit 3.3 — "Data Hazards"
// Rebuilt for interactivity to match the just-rebuilt Unit 3.2: each section is a
// DIFFERENT interaction — a click-to-reveal collision, a predict-before-reveal hazard
// classifier, an AUTO-PLAYING space-time stall animation (shared PipelineGrid), and a
// toggle compare of the cures with a load-use prediction. Shared palette / PipelineGrid /
// buildStraightRows are copied verbatim from Unit3_2 (every lesson is self-contained).
import { useState, useEffect } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};

// Stage → colour (shared across all Unit 3 pipeline diagrams)
const STAGE_COLOR = { IF: C.accent, ID: C.purple, EX: C.orange, MEM: C.teal, WB: C.green, "○": C.muted };

function Key({ color = C.purple, children }) {
  return (
    <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
      🔑 {children}
    </div>
  );
}

// ── buildStraightRows: instruction i occupies cycles (i+1 .. i+5) with stages IF..WB ──
function buildStraightRows(instrs) {
  return instrs.map((ins, i) => {
    const cells = {};
    ["IF", "ID", "EX", "MEM", "WB"].forEach((st, s) => { cells[i + 1 + s] = st; });
    return { label: ins.label, color: ins.color, cells };
  });
}

// ── buildRows: place stages at EXPLICIT cycles, so a stall can slip WB later ──
function buildRows(schedule) {
  // schedule: [{ label, color, stages: [{ name, cycle }] }]  — name is IF/ID/EX/MEM/WB, or "○" for a bubble
  return schedule.map((s) => {
    const cells = {};
    s.stages.forEach((st) => { cells[st.cycle] = st.name; });
    return { label: s.label, color: s.color, cells };
  });
}

// ══════════════════════════════════════════════════════════════════
//  Shared PipelineGrid — an auto-playing space-time (reservation) diagram.
//  rows: [{ label, color, cells: { <cycleNumber>: <stageLabel> } }], plus totalCycles.
//  Reveals every cell whose cycle ≤ the current clock; Play advances it on its own.
// ══════════════════════════════════════════════════════════════════
function PipelineGrid({ rows, totalCycles, caption, speed = 650, height }) {
  const [clock, setClock] = useState(0);      // 0 = pipeline empty, nothing issued yet
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (clock >= totalCycles) { setPlaying(false); return; }
    const t = setTimeout(() => setClock((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [playing, clock, totalCycles, speed]);

  // How many instructions have fully retired (their WB cycle ≤ current clock)?
  const wbCycleOf = (r) => Math.max(...Object.keys(r.cells).filter((cy) => r.cells[cy] === "WB").map(Number));
  const done = rows.filter((r) => wbCycleOf(r) <= clock).length;

  const cycleNums = Array.from({ length: totalCycles }, (_, i) => i + 1);

  return (
    <div>
      {/* controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => { if (clock >= totalCycles) setClock(0); setPlaying((p) => !p); }}
          style={btn(playing ? C.orange : C.green)}>
          {playing ? "⏸ Pause" : clock >= totalCycles ? "↺ Replay" : "▶ Run cycles"}
        </button>
        <button onClick={() => { setPlaying(false); setClock((c) => Math.min(totalCycles, c + 1)); }} style={btn(C.accentGlow)}>Step ▶</button>
        <button onClick={() => { setPlaying(false); setClock(0); }} style={btn(C.card, C.muted)}>↺ Reset</button>
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>
          clock = <strong style={{ color: C.accent }}>{clock}</strong> / {totalCycles} · done = <strong style={{ color: C.green }}>{done}</strong> / {rows.length}
        </div>
      </div>

      {/* grid (horizontal scroll so it never gets shoved off-screen) */}
      <div style={{ overflowX: "auto", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: `88px repeat(${totalCycles}, 40px)`, gap: 4, minWidth: "fit-content" }}>
          {/* header row: cycle numbers */}
          <div style={{ fontSize: 10, color: C.muted, alignSelf: "center" }}>instr \ cycle</div>
          {cycleNums.map((cy) => (
            <div key={cy} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: cy === clock ? C.accent : C.muted }}>{cy}</div>
          ))}
          {/* one row per instruction — flat map so no React.Fragment import is needed */}
          {rows.flatMap((r, ri) => [
            <div key={`lbl-${ri}`} style={{ fontSize: 12, fontFamily: "monospace", color: r.color, alignSelf: "center", whiteSpace: "nowrap" }}>{r.label}</div>,
            ...cycleNums.map((cy) => {
              const st = r.cells[cy];
              const shown = st && cy <= clock;
              return (
                <div key={`c-${ri}-${cy}`} style={{
                  height: 30, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10.5, fontWeight: 700,
                  background: shown ? STAGE_COLOR[st] + (st === "○" ? "22" : "33") : "transparent",
                  border: shown ? `1px solid ${STAGE_COLOR[st]}` : `1px dashed ${C.border}`,
                  color: shown ? STAGE_COLOR[st] : "transparent",
                }}>{shown ? st : "·"}</div>
              );
            }),
          ])}
        </div>
      </div>

      {caption && <div style={{ marginTop: 10, fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>{caption(clock, done)}</div>}
    </div>
  );
}

function btn(bg, col = "#fff") {
  return { padding: "7px 14px", borderRadius: 7, background: bg, border: "none", color: col, fontWeight: 600, fontSize: 12.5, cursor: "pointer" };
}

// Small static stage-strip used by the collision + cure compares (not the animated grid)
function MiniRow({ label, stages }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
      <div style={{ width: 132, fontSize: 11.5, color: C.text, fontFamily: "monospace", flexShrink: 0, whiteSpace: "nowrap" }}>{label}</div>
      {stages.map((st, i) => (
        <div key={i} style={{
          flex: 1, height: 28, minWidth: 26, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800,
          background: st ? STAGE_COLOR[st] + (st === "○" ? "22" : "33") : "transparent",
          color: st ? STAGE_COLOR[st] : "transparent",
          border: st ? `1px solid ${STAGE_COLOR[st]}` : `1px dashed ${C.border}`,
        }}>{st || "·"}</div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Collision: analogy first, then the term RAW
// ══════════════════════════════════════════════════════════════════
function TheCollision() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The <strong style={{ color: C.text }}>S = 1 ideal you met in Unit 3.2</strong> quietly assumed every instruction was
        independent. Real code isn't. Start with an everyday version of the problem — no jargon yet.
      </p>

      {/* analogy card — before any term */}
      <div style={{ background: C.teal + "12", border: `1.5px solid ${C.teal}44`, borderRadius: 10, padding: "14px 16px", marginBottom: 16, fontSize: 13, color: C.text, lineHeight: 1.7 }}>
        📝 You're jotting a phone number on a sticky note for a friend. Before you've written the last digit, they snatch the
        note and dial. They get a <strong style={{ color: C.red }}>wrong number</strong> — because they <em>read</em> it before
        you'd finished <em>writing</em> it. That mismatch, in a pipeline, is the whole story of this unit.
      </div>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 10, lineHeight: 1.7 }}>
        Now the CPU version. I1 <em>writes</em> R1; the very next instruction, I2, <em>reads</em> R1:
      </p>

      {/* the two instructions + dependency arrow */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
        <div style={{ fontFamily: "monospace", fontSize: 13.5, color: C.text }}>
          I1&nbsp;&nbsp;add&nbsp;&nbsp;<strong style={{ color: C.green }}>R1</strong>, R2, R3&nbsp;&nbsp;
          <span style={{ color: C.muted, fontSize: 11 }}>; produces R1</span>
        </div>
        <div style={{ textAlign: "center", color: C.orange, fontSize: 12, fontWeight: 700, margin: "4px 0" }}>
          └──── R1 must flow from here ────┐
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13.5, color: C.text }}>
          I2&nbsp;&nbsp;sub&nbsp;&nbsp;R4, <strong style={{ color: C.red }}>R1</strong>, R5&nbsp;&nbsp;
          <span style={{ color: C.muted, fontSize: 11 }}>; consumes R1</span>
        </div>
      </div>

      {!revealed && (
        <button onClick={() => setRevealed(true)} style={{ ...btn(C.accentGlow), width: "100%", padding: "11px", fontSize: 13.5 }}>
          ▶ Reveal what breaks
        </button>
      )}

      {revealed && (
        <div style={{ background: C.red + "12", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "14px 16px", fontSize: 13, color: C.text, lineHeight: 1.7 }}>
          Fetched right behind I1, I2 reaches its own read step while I1's result is still being computed — it hasn't been
          written back to the register file yet. I2 grabs the <strong style={{ color: C.red }}>old, stale R1</strong>: the
          snatched sticky-note, exactly. Any condition that forces the pipeline to wait like this is a
          <strong style={{ color: C.text }}> hazard</strong>; this specific one — a later instruction needing an earlier
          instruction's result — is a <strong style={{ color: C.text }}>data hazard</strong>, and because the danger is a read
          racing ahead of a write, its full name is a <strong style={{ color: C.text }}>RAW (Read-After-Write) hazard</strong>.
        </div>
      )}

      <Key color={C.red}>
        A <strong style={{ color: C.text }}>RAW hazard</strong> is named for the order that <em>should</em> hold in program
        order — Write, then Read after it. The hazard is that pipelining lets the Read slip ahead of the Write.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Spot the Hazard: predict-before-reveal classifier
// ══════════════════════════════════════════════════════════════════
function SpotTheHazard() {
  const pairs = [
    {
      i1: "add  R1, R2, R3", i2: "sub  R4, R1, R5", hazard: true,
      why: "I2 reads R1, which I1 just wrote. Dependent → RAW hazard.",
    },
    {
      i1: "add  R1, R2, R3", i2: "or   R7, R8, R9", hazard: false,
      why: "I2 touches R7/R8/R9 — none is R1. Fully independent → no hazard, no stall.",
    },
    {
      i1: "mul  R6, R2, R2", i2: "add  R9, R7, R6", hazard: true,
      why: "R6 is written by I1 and read by I2. A source register match is all it takes → RAW hazard.",
    },
  ];
  const [answers, setAnswers] = useState({});   // { index: bool guessed }

  const answer = (idx, guess) => {
    if (answers[idx] !== undefined) return;
    setAnswers((a) => ({ ...a, [idx]: guess }));
  };
  const solved = Object.keys(answers).length;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        Detecting a RAW hazard is one question: does I2 <em>read</em> a register I1 just <em>wrote</em>? <strong style={{ color: C.text }}>Predict
        first</strong> for each pair — hazard or not — then reveal.
      </p>

      {pairs.map((p, idx) => {
        const guessed = answers[idx];
        const done = guessed !== undefined;
        const correct = done && guessed === p.hazard;
        return (
          <div key={idx} style={{ background: C.card, border: `1px solid ${done ? (correct ? C.green : C.red) + "66" : C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontFamily: "monospace", fontSize: 12.5, color: C.text, lineHeight: 1.9, marginBottom: 10 }}>
              I1&nbsp;&nbsp;{p.i1}<br />I2&nbsp;&nbsp;{p.i2}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: true, txt: "⚠️ Hazard" }, { v: false, txt: "✅ No hazard" }].map((opt) => {
                let bg = C.surface, bd = C.border, col = C.muted;
                if (done) {
                  if (opt.v === p.hazard) { bg = C.green + "22"; bd = C.green; col = C.green; }
                  else if (opt.v === guessed) { bg = C.red + "22"; bd = C.red; col = C.red; }
                }
                return (
                  <button key={String(opt.v)} onClick={() => answer(idx, opt.v)} style={{
                    flex: 1, padding: "8px 10px", borderRadius: 8, background: bg, border: `1.5px solid ${bd}`, color: col,
                    fontWeight: 700, fontSize: 12.5, cursor: done ? "default" : "pointer",
                  }}>{opt.txt}</button>
                );
              })}
            </div>
            {done && (
              <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
                {correct ? "✓ Correct — " : "✗ Not quite — "}{p.why}
              </div>
            )}
          </div>
        );
      })}

      <div style={{ fontSize: 12, color: C.muted, textAlign: "right", marginBottom: 4 }}>{solved} / {pairs.length} classified</div>

      <Key color={C.accent}>
        The compiler and the hardware both scan for exactly this: a source register of a later instruction matching a
        destination register of one still in flight. Match = RAW hazard = potential stall.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace the Stall: AUTO-PLAYING PipelineGrid of the stall
// ══════════════════════════════════════════════════════════════════
function TraceTheStall() {
  // I1 produces R1 in EX (cycle 3) but it isn't safely written until WB (cycle 5).
  // I2 reaches ID at cycle 3, then is HELD — two ○ bubbles (cycles 4,5) — before EX at cycle 6.
  const schedule = [
    { label: "I1  add R1", color: C.green, stages: [
      { name: "IF", cycle: 1 }, { name: "ID", cycle: 2 }, { name: "EX", cycle: 3 }, { name: "MEM", cycle: 4 }, { name: "WB", cycle: 5 },
    ] },
    { label: "I2  sub R1", color: C.orange, stages: [
      { name: "IF", cycle: 2 }, { name: "ID", cycle: 3 }, { name: "○", cycle: 4 }, { name: "○", cycle: 5 },
      { name: "EX", cycle: 6 }, { name: "MEM", cycle: 7 }, { name: "WB", cycle: 8 },
    ] },
  ];
  const rows = buildRows(schedule);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Watch it happen. The <strong style={{ color: C.text }}>EX stage from Unit 3.1</strong> is where the ALU actually
        produces R1 (cycle 3), but the value isn't safely in the register file until WB (cycle 5). Hit
        <strong style={{ color: C.green }}> ▶ Run cycles</strong> — I2 (orange) sits on <strong>○ bubbles</strong> until R1 is ready.
      </p>

      <PipelineGrid rows={rows} totalCycles={8} caption={(clk) =>
        clk === 0 ? "Cycle 0 — nothing issued. I2 (sub) needs R1, which I1 (add) hasn't produced yet." :
        clk < 3 ? `Cycle ${clk} — the pipe is filling; I1 and I2 march in one behind the other, no trouble yet.` :
        clk === 3 ? "Cycle 3 — I1 computes R1 in EX (produced right now), and I2 reaches ID wanting to read R1. Too early — R1 isn't written back yet." :
        clk === 4 ? "Cycle 4 — R1 still isn't written. I2 is HELD: bubble ○ #1. Everything behind it waits too." :
        clk === 5 ? "Cycle 5 — I1 writes R1 in WB, but the write only lands safely at the end of the cycle. I2 still stalls: bubble ○ #2." :
        clk === 6 ? "Cycle 6 — R1 is safely written. I2 finally enters EX and reads the CORRECT R1." :
        clk < 8 ? `Cycle ${clk} — I2 drains normally now (MEM/WB).` :
        "Cycle 8 — I2 retires. Two ○ bubbles were injected; I2 sat in Decode a total of 3 cycles (its own cycle 3 + bubbles 4 and 5) before moving to EX."
      } />

      <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "12px 16px", fontSize: 12.5, color: C.muted, lineHeight: 1.7, marginTop: 14 }}>
        <strong style={{ color: C.purple }}>2 bubbles vs a 3-cycle stall — not a contradiction.</strong> Cycle 3 was always going
        to be I2's normal Decode; it isn't extra. Cycles 4 and 5 are the two <em>additional</em> idle cycles forced in because R1
        isn't ready — those are the two <strong>○</strong> cells you see. Held(3) + bubble(4) + bubble(5) = a
        <strong style={{ color: C.text }}> 3-cycle stall</strong> in total. That's why I2's WB slips from cycle 6 to cycle 8.
      </div>

      <Key color={C.red}>
        Each idle cycle inserted is a <strong style={{ color: C.text }}>bubble</strong>. A bubble delays not just the stalled
        instruction but everything queued behind it — the pipeline's S drifts back above the ideal 1.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Cure It: stall vs forwarding toggle + load-use prediction
// ══════════════════════════════════════════════════════════════════
function CureIt() {
  const [side, setSide] = useState("stall");
  const [predict, setPredict] = useState(null);   // "yes" | "no" for the load-use question

  const stall = {
    i1: ["IF", "ID", "EX", "MEM", "WB"],
    i2: ["", "IF", "ID", "○", "○", "EX", "MEM", "WB"],
    cycles: 8, lost: 2, color: C.red,
    label: "Stall / NOP — insert bubbles",
    desc: "Hardware holds I2 in Decode (or the compiler drops explicit NOPs in) until R1 is written. Correct, but 2 bubbles wasted.",
  };
  const fwd = {
    i1: ["IF", "ID", "EX", "MEM", "WB"],
    i2: ["", "IF", "ID", "EX", "MEM", "WB"],
    cycles: 6, lost: 0, color: C.green,
    label: "Forwarding — route the result",
    desc: "Forwarding routes the ALU output from Unit 2.2 straight from I1's EX into I2's EX input — the value is used the cycle after it's produced, so zero bubbles.",
  };
  const d = side === "stall" ? stall : fwd;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Two ways to fix the Add→Sub stall. Toggle and compare — same instructions, very different cost.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[{ k: "stall", t: "Stall / NOP", c: C.red }, { k: "forward", t: "Forwarding", c: C.green }].map((o) => (
          <button key={o.k} onClick={() => setSide(o.k)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: side === o.k ? o.c + "22" : C.card, border: `2px solid ${side === o.k ? o.c : C.border}`,
            color: side === o.k ? o.c : C.muted,
          }}>{o.t}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${d.color}44`, borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ color: d.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{d.label}</div>
        <div style={{ color: C.text, fontSize: 12.5, lineHeight: 1.7, marginBottom: 12 }}>{d.desc}</div>
        <MiniRow label="I1  add R1" stages={d.i1} />
        <MiniRow label="I2  sub R1" stages={d.i2} />
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          <div><span style={{ fontSize: 11, color: C.muted }}>total cycles: </span><strong style={{ color: C.text }}>{d.cycles}</strong></div>
          <div><span style={{ fontSize: 11, color: C.muted }}>bubbles lost: </span><strong style={{ color: d.lost === 0 ? C.green : C.red }}>{d.lost}</strong></div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginBottom: 20 }}>
        Explicit <strong style={{ color: C.orange }}>NOPs</strong> cost the same cycles as a hardware stall, but they're wasted
        slots. The smarter software cure is <strong style={{ color: C.teal }}>instruction scheduling</strong>: the compiler moves
        independent, <em>useful</em> instructions into those slots so real work happens during the gap. (A slow
        <strong style={{ color: C.text }}> memory delay</strong> — a cache miss at Fetch or Memory — stalls the pipe the very
        same domino way; the cause differs, the bubble is identical.)
      </div>

      {/* predict-before-reveal: the load-use limit */}
      <div style={{ background: C.orange + "10", border: `1.5px solid ${C.orange}44`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ color: C.orange, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>⚠️ The load-use case — predict first</div>
        <pre style={{ fontFamily: "monospace", fontSize: 12.5, color: C.text, margin: "0 0 12px", lineHeight: 1.8 }}>
{`Load  R1, (R2)     ; R1 arrives during MEM, not EX
sub   R4, R1, R5   ; needs R1 immediately`}
        </pre>
        <div style={{ color: C.text, fontSize: 13, marginBottom: 10 }}>Forwarding erased the bubble for Add→Sub. Can it do the same here?</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ v: "yes", t: "Yes — zero bubbles" }, { v: "no", t: "No — one bubble stays" }].map((o) => {
            let bg = C.card, bd = C.border, col = C.muted;
            if (predict !== null) {
              if (o.v === "no") { bg = C.green + "22"; bd = C.green; col = C.green; }
              else if (o.v === predict) { bg = C.red + "22"; bd = C.red; col = C.red; }
            }
            return (
              <button key={o.v} onClick={() => predict === null && setPredict(o.v)} style={{
                flex: 1, padding: "9px", borderRadius: 8, background: bg, border: `1.5px solid ${bd}`, color: col,
                fontWeight: 700, fontSize: 12.5, cursor: predict === null ? "pointer" : "default",
              }}>{o.t}</button>
            );
          })}
        </div>

        {predict !== null && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.7, marginBottom: 10 }}>
              {predict === "no" ? "✓ Right — " : "✗ Actually, no — "}a Load doesn't <em>have</em> R1 until the
              <strong> MEM</strong> stage, one stage <em>later</em> than an ALU result (ready at EX). Forwarding can't send a value
              that doesn't exist yet, so a directly-following user needs <strong style={{ color: C.red }}>one unavoidable
              bubble</strong>. After that single stall, R1 forwards normally.
            </div>
            <MiniRow label="Load R1,(R2)" stages={["IF", "ID", "EX", "MEM", "WB"]} />
            <MiniRow label="sub  R4,R1" stages={["", "IF", "ID", "○", "EX", "MEM", "WB"]} />
          </div>
        )}
      </div>

      <Key color={C.green}>
        Real CPUs prefer <strong style={{ color: C.text }}>forwarding</strong> — free once the wires exist. It kills the ALU→ALU
        stall entirely, but the <strong style={{ color: C.text }}>load-use</strong> case still leaves exactly one bubble, which
        instruction scheduling can then hide with a useful instruction.
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
      q: "I1 writes R1 in cycle 5; I2 tries to read R1 in cycle 3 (before it's written). Why is this called a RAW (Read-After-Write) hazard, not a \"read-before-write\" hazard?",
      options: [
        "RAW is just a typo for read-before-write",
        "RAW names the correct PROGRAM ORDER (Write, then Read after it) — the hazard is that the pipeline lets the Read jump ahead of that order",
        "RAW only applies to memory, not registers",
        "It should actually be called WAR",
      ],
      answer: 1,
      explain: "RAW names the dependency's intended order — Write, then Read after it. The hazard is that pipelining breaks that order by reading too early. The name describes what SHOULD happen, not the bug.",
    },
    {
      q: "The stall animation shows only 2 bubble (○) cells for Add→Sub, yet it's called a 3-cycle stall. Why aren't those numbers contradictory?",
      options: [
        "The diagram has an error",
        "Cycle 3 was already I2's normal Decode (not extra); cycles 4 and 5 are the two EXTRA bubbles — held(3) + bubble(4) + bubble(5) = 3 cycles stuck in Decode",
        "The two counts describe different programs",
        "3-cycle means 3 bubbles were drawn but one was cut off",
      ],
      answer: 1,
      explain: "2 bubbles = the extra idle cycles injected (4, 5). 3 cycles = the FULL time I2 sits in Decode, including its own normal decode cycle (3). Both numbers describe the same event, which is why I2's WB slips from cycle 6 to cycle 8.",
    },
    {
      q: "Operand forwarding eliminates the Add→Sub stall but NOT the Load→Sub stall. Why the difference?",
      options: [
        "Forwarding never works for Loads",
        "A Load's data is ready only in MEM, one stage later than an ALU result (ready in EX) — so a directly-following dependent instruction still needs one unavoidable bubble before the value can be forwarded",
        "Loads don't use registers",
        "Add and Sub can't be forwarded either",
      ],
      answer: 1,
      explain: "An ALU result exists after EX, in time to forward into the next instruction's EX. A Load's result only exists after MEM — one stage too late for a directly-following instruction, forcing exactly one stall even with forwarding hardware present.",
    },
    {
      q: "A compiler replaces the NOPs after a hazard with independent, useful instructions. What is this, and why is it better than leaving NOPs?",
      options: [
        "Forwarding — it adds hardware wires",
        "Instruction scheduling — the same cycles pass, but real work runs in the slots instead of nothing",
        "It's identical to inserting NOPs, just renamed",
        "It removes the hazard so no cycles are needed at all",
      ],
      answer: 1,
      explain: "Instruction scheduling reorders independent instructions into the gap. The stall cycles still occur, but the CPU does useful work during them instead of idling on NOPs — a pure software win requiring no extra hardware.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const choose = (i) => { if (selected !== null) return; setSelected(i); if (i === questions[current].answer) setScore((s) => s + 1); };
  const next = () => { if (current < questions.length - 1) { setCurrent((c) => c + 1); setSelected(null); } else { setDone(true); onComplete && onComplete(); } };

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🎉" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Perfect! RAW naming, the 3-cycle/2-bubble distinction, forwarding, and the load-use limit are all locked in." :
            score >= 2 ? "Good work! Replay 'Trace the Stall' and 'Cure It' to lock in the tricky parts." :
              "Revisit 'The Collision' and the stall trace — those two ideas unlock everything else here."}
        </div>
        <div style={{ padding: "20px", borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can spot a RAW hazard, trace the 3-cycle / 2-bubble stall, and compare stalling, forwarding, and instruction
            scheduling as cures — including why load-use leaves one stubborn bubble.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.4 — Instruction Hazards.</strong> Data dependencies weren't the
            only thing that stalls a pipeline. A <em>branch</em> can too — and for a completely different reason: the CPU doesn't
            even know which instruction to fetch next until the branch resolves. You'll see the branch penalty and how prediction fights it.
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
            <button key={i} onClick={() => choose(i)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: 8, background: bg, border: `1.5px solid ${border}`, color: col, cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s" }}>
              {i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.purple + "18", border: `1px solid ${C.purple}44`, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>💡 {q.explain}</div>
      )}
      {selected !== null && (
        <button onClick={next} style={{ marginTop: 14, padding: "10px 24px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Main — header, progress bar, tab strip, content card, continue btn
// ══════════════════════════════════════════════════════════════════
export default function Unit3_3({ student, onUnitComplete }) {
  const sections = [
    { id: "collision", label: "The Collision" },
    { id: "spot", label: "Spot the Hazard" },
    { id: "trace", label: "Trace the Stall" },
    { id: "cure", label: "Cure It" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>💥 The Collision — a read racing a write</h3><TheCollision /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🔎 Spot the Hazard — predict, then reveal</h3><SpotTheHazard /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🎬 Trace the Stall — watch the bubbles form</h3><TraceTheStall /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⚕️ Cure It — stall vs forwarding (and load-use)</h3><CureIt /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.3.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏭</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 3 › UNIT 3.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Data Hazards</div>
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
              background: activeSection === i ? C.accentGlow : "transparent", border: "none",
              color: activeSection === i ? "#fff" : C.muted, cursor: "pointer", fontSize: 11,
              fontWeight: activeSection === i ? 600 : 400, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 4, transition: "all 0.2s",
            }}>
              {completed.includes(i) && <span style={{ color: C.green }}>✓</span>}{s.label}
            </button>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 12, padding: "24px 20px", border: `1px solid ${C.border}`, minHeight: 300 }}>
          {content[activeSection]}
        </div>

        {activeSection < sections.length - 1 && (
          <button onClick={goNext} style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mark Complete &amp; Continue →</button>
        )}
      </div>
    </div>
  );
}
