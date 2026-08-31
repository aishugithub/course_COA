// Unit3_1.jsx — Module 3 › Unit 3.1 — "The Pipelining Idea"
// REBUILT per Aishu's review: this unit previously covered cache memory,
// which is NOT a chapter in the class notes at all (cache only appears
// briefly inside Unit 3.3's Data Hazards, Sec 3.5 "Memory delays"). The
// notes' actual Chapter 1 — "The Pipelining Idea" — was never built as its
// own lesson until now. This unit covers it in full: why pipelining exists
// (Sec 1.1, assembly-line analogy), the five-step instruction (Sec 1.2),
// the ideal overlapped case (Sec 1.3, Fig 6.1), and pipeline organization +
// interstage buffers B1-B4 (Sec 1.4, Fig 6.2).
import { useState, useEffect, useRef } from "react";

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
//  Section 1 — Why? Animated assembly line: without vs. with pipelining
//  (Sec 1.1). Four cars, four stations, one shared cycle clock driving
//  both lanes at once so the throughput difference is directly visible.
// ══════════════════════════════════════════════════════════════════
const STATIONS = ["Chassis", "Engine", "Paint", "Interior"];
const CAR_COLORS = [C.accent, C.teal, C.orange, C.purple];
const NUM_CARS = 4;
const NUM_STATIONS = 4;
const SERIAL_MAX = NUM_STATIONS * NUM_CARS - 1;       // last occupied cycle, 0-indexed
const PIPE_MAX = NUM_STATIONS + NUM_CARS - 1 - 1;     // last occupied cycle, 0-indexed
const LOOP_AT = SERIAL_MAX + 4;                        // pause a beat, then loop

// carIdx, cycle -> station index (0..3) if the car occupies a station this
// cycle, or null if it hasn't started yet / has already finished.
function serialStation(carIdx, cycle) {
  const start = carIdx * NUM_STATIONS;
  const s = cycle - start;
  return s >= 0 && s < NUM_STATIONS ? s : null;
}
function pipelinedStation(carIdx, cycle) {
  const start = carIdx;
  const s = cycle - start;
  return s >= 0 && s < NUM_STATIONS ? s : null;
}

function AssemblyLane({ title, color, cycle, stationFn, maxCycle, icon }) {
  const finishedCount = Array.from({ length: NUM_CARS }).filter((_, i) => {
    // a car has finished once cycle has passed the last cycle it could occupy a station
    const lastOccupied = stationFn === serialStation ? i * NUM_STATIONS + NUM_STATIONS - 1 : i + NUM_STATIONS - 1;
    return cycle > lastOccupied;
  }).length;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{icon} {title}</span>
        <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.muted }}>
          <strong style={{ color: finishedCount === NUM_CARS ? C.green : C.text }}>{finishedCount} / {NUM_CARS}</strong> cars finished
        </span>
      </div>

      <div style={{ position: "relative", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 0 26px", overflow: "hidden" }}>
        {/* station zone backgrounds + labels */}
        <div style={{ display: "flex" }}>
          {STATIONS.map((s, i) => (
            <div key={i} style={{
              flex: 1, height: 44, borderRight: i < 3 ? `1px dashed ${C.border}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 9.5, color: C.border, fontWeight: 700 }} />
            </div>
          ))}
        </div>
        {/* station labels row */}
        <div style={{ display: "flex", position: "absolute", bottom: 4, left: 0, right: 0 }}>
          {STATIONS.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: C.muted }}>{s}</div>
          ))}
        </div>
        {/* car tokens, absolutely positioned, sliding via CSS transition */}
        {Array.from({ length: NUM_CARS }, (_, carIdx) => {
          const station = stationFn(carIdx, cycle);
          const startCycle = stationFn === serialStation ? carIdx * NUM_STATIONS : carIdx;
          let leftPct;
          if (cycle < startCycle) leftPct = -14; // waiting, parked off the left edge
          else if (station !== null) leftPct = station * 25 + 6.5; // riding through a station
          else leftPct = 108; // finished, slid off the right edge
          return (
            <div key={carIdx} title={`Car ${carIdx + 1}`} style={{
              position: "absolute", top: 7, left: `${leftPct}%`, width: "13%", height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "left 0.6s ease",
              background: CAR_COLORS[carIdx] + "26", border: `1.5px solid ${CAR_COLORS[carIdx]}`,
              borderRadius: 7, color: CAR_COLORS[carIdx], fontWeight: 800, fontSize: 15,
            }}>🚗</div>
          );
        })}
      </div>
    </div>
  );
}

function WhyPipelining() {
  const [cycle, setCycle] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!playing) return undefined;
    timerRef.current = setInterval(() => {
      setCycle((c) => (c >= LOOP_AT ? 0 : c + 1));
    }, 650);
    return () => clearInterval(timerRef.current);
  }, [playing]);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A program can be made faster in <strong style={{ color: C.text }}>two</strong> broad ways: use faster circuitry, or
        arrange the hardware so more than one operation happens at the same time. Pipelining takes the second route. Watch four
        cars move through the same four stations — one lane with no overlap, one lane pipelined — on the <strong style={{ color: C.text }}>same
        clock</strong>, so you can see the throughput difference happen live.
      </p>

      <AssemblyLane title="No pipelining — one car at a time" icon="❌" color={C.red} cycle={cycle} stationFn={serialStation} maxCycle={SERIAL_MAX} />
      <AssemblyLane title="Pipelined — every station always busy" icon="✅" color={C.green} cycle={cycle} stationFn={pipelinedStation} maxCycle={PIPE_MAX} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button onClick={() => setPlaying((p) => !p)} style={{
          padding: "8px 16px", borderRadius: 8, border: "none", background: C.accentGlow, color: "#fff",
          fontWeight: 700, cursor: "pointer", fontSize: 12.5,
        }}>{playing ? "⏸ Pause" : "▶ Play"}</button>
        <button onClick={() => setCycle(0)} style={{
          padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.muted,
          fontWeight: 700, cursor: "pointer", fontSize: 12.5,
        }}>↺ Restart</button>
        <span style={{ marginLeft: "auto", fontSize: 11.5, color: C.muted }}>time step {cycle}</span>
      </div>

      <Key color={C.accent}>
        Nothing about building any ONE car got faster — each car still passes through all four stations taking the same time
        per station. What changed is <strong style={{ color: C.text }}>throughput</strong>: the pipelined lane finishes all 4
        cars in far fewer time steps, because every station is always working on a <em>different</em> car instead of sitting
        idle. This is exactly what pipelining does for instructions: it <strong style={{ color: C.text }}>overlaps</strong> the
        execution of successive instructions across dedicated hardware stages.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy: one instruction = five steps (Sec 1.2)
// ══════════════════════════════════════════════════════════════════
function FiveSteps() {
  const stages = [
    { k: "F", name: "Fetch", desc: "Get the instruction word from memory.", color: C.accent },
    { k: "D", name: "Decode", desc: "Figure out the operation and read the register operands.", color: C.teal },
    { k: "C", name: "Compute", desc: "The ALU does the arithmetic/logic.", color: C.orange },
    { k: "M", name: "Memory", desc: "Access data memory — only Load/Store instructions actually need this.", color: C.purple },
    { k: "W", name: "Write", desc: "Write the result back into the register file.", color: C.green },
  ];
  const [active, setActive] = useState(null);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Recall from Unit 2: a single instruction executes in five steps, one per clock cycle, and — critically — each step uses
        <strong style={{ color: C.text }}> different hardware</strong>. Click each stage.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {stages.map((s, i) => (
          <button key={i} onClick={() => setActive(active === i ? null : i)} style={{
            flex: 1, padding: "12px 4px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            background: active === i ? s.color + "22" : C.card, border: `2px solid ${active === i ? s.color : C.border}`,
          }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: active === i ? s.color : C.muted }}>{s.k}</div>
            <div style={{ fontSize: 9.5, color: C.muted, marginTop: 2 }}>{s.name}</div>
          </button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.text, minHeight: 40 }}>
        {active !== null ? <span><strong style={{ color: stages[active].color }}>{stages[active].name}:</strong> {stages[active].desc}</span> : "Click a stage above to see what it does."}
      </div>

      <Key color={C.teal}>
        The moment instruction I<sub>j</sub> leaves Fetch and enters Decode, the <strong style={{ color: C.text }}>Fetch unit
        is free</strong> — nothing is stopping it from fetching I<sub>j+1</sub> right away. Overlapping the steps of successive
        instructions across dedicated hardware stages is exactly what <strong style={{ color: C.text }}>pipelining</strong>{" "}
        means.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace: the ideal overlapped case (Sec 1.3, Fig 6.1)
// ══════════════════════════════════════════════════════════════════
function IdealCase() {
  const stageNames = ["Fetch", "Decode", "Compute", "Memory", "Write"];
  const stageAbbr = ["F", "D", "C", "M", "W"];
  const stageColors = [C.accent, C.teal, C.orange, C.purple, C.green];
  const [cyc, setCyc] = useState(1);
  const numInstr = 3;
  const totalCycles = 5 + numInstr - 1; // 7

  // instruction i (0-indexed) occupies stage s during cycle (i + s + 1)
  const cellFor = (instr, cycle) => {
    const s = cycle - instr - 1;
    if (s < 0 || s > 4) return null;
    return s;
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Three instructions, fully overlapped — this is Figure 6.1. Step through the cycles and watch: any ONE instruction still
        takes 5 cycles start-to-finish, but once the pipeline fills, a new instruction completes <strong style={{ color: C.text }}>every
        single cycle</strong>.
      </p>

      <div style={{ overflowX: "auto", marginBottom: 12 }}>
        <div style={{ display: "inline-block", minWidth: "100%" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: 60 }} />
              {Array.from({ length: totalCycles }, (_, c) => <col key={c} />)}
            </colgroup>
            <thead>
              <tr>
                <th style={{ padding: "6px 4px", fontSize: 11, color: C.muted, textAlign: "left" }}>Instr</th>
                {Array.from({ length: totalCycles }, (_, c) => (
                  <th key={c} style={{ padding: "6px 2px", fontSize: 11, color: c + 1 <= cyc ? C.text : C.border, textAlign: "center" }}>{c + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numInstr }, (_, instr) => (
                <tr key={instr}>
                  <td style={{ padding: "4px", fontSize: 12, color: C.text, fontFamily: "monospace", fontWeight: 700 }}>I<sub>{instr === 0 ? "j" : instr === 1 ? "j+1" : "j+2"}</sub></td>
                  {Array.from({ length: totalCycles }, (_, c) => {
                    const visible = c + 1 <= cyc;
                    const s = visible ? cellFor(instr, c + 1) : null;
                    return (
                      <td key={c} style={{ padding: 2 }}>
                        {s !== null ? (
                          <div style={{
                            height: 30, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10.5, fontWeight: 800, color: "#0D1117", background: stageColors[s],
                          }}>{stageAbbr[s]}</div>
                        ) : <div style={{ height: 30 }} />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setCyc((v) => Math.max(1, v - 1))} disabled={cyc === 1} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.muted,
          cursor: cyc === 1 ? "default" : "pointer", fontWeight: 700, fontSize: 13, opacity: cyc === 1 ? 0.5 : 1,
        }}>↺ Back</button>
        <button onClick={() => setCyc((v) => Math.min(totalCycles, v + 1))} disabled={cyc === totalCycles} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", background: C.accentGlow, color: "#fff",
          cursor: cyc === totalCycles ? "default" : "pointer", fontWeight: 700, fontSize: 13, opacity: cyc === totalCycles ? 0.5 : 1,
        }}>Step ▶ (cycle {cyc} / {totalCycles})</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 4 }}>
        {stageNames.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.muted }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: stageColors[i] }} />{n}
          </div>
        ))}
      </div>

      <Key color={C.accent}>
        Cycle 5 is the first cycle where <strong style={{ color: C.text }}>all five stages are busy at once</strong> — the
        pipeline is "full." Read down any column from cycle 5 onward: every stage is working on a different instruction, every
        single cycle.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Anatomy: pipeline organization & interstage buffers B1-B4
//  (Sec 1.4, Fig 6.2) — never built as a lesson before this rewrite
// ══════════════════════════════════════════════════════════════════
function PipelineOrganization() {
  const buffers = [
    { id: "B1", after: "Fetch", carries: "The newly fetched instruction, ready to decode.", color: C.accent },
    { id: "B2", after: "Decode", carries: "The two operands read from registers, the immediate value, and the control signals for later stages.", color: C.teal },
    { id: "B3", after: "Compute", carries: "The ALU result (data to write, or an address/data for memory).", color: C.orange },
    { id: "B4", after: "Memory", carries: "The value to be written back into the register file.", color: C.purple },
  ];
  const [sel, setSel] = useState(null);
  const stageNames = ["Fetch", "Decode", "Compute", "Memory", "Write"];
  const stageColors = [C.accent, C.teal, C.orange, C.purple, C.green];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Each of the five stages is <strong style={{ color: C.text }}>separate hardware</strong>. Between consecutive stages sit
        registers called <strong style={{ color: C.text }}>interstage buffers</strong> (B1–B4) — at the end of every clock cycle,
        each buffer latches its stage's result so the next stage can use it the following cycle. Click a buffer.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 14px", marginBottom: 12 }}>
        {stageNames.map((name, i) => (
          <div key={i}>
            <div style={{
              padding: "9px 12px", borderRadius: 6, textAlign: "center", fontSize: 12.5, fontWeight: 700,
              background: stageColors[i] + "18", border: `1.5px solid ${stageColors[i]}`, color: stageColors[i],
            }}>{name}</div>
            {i < 4 && (
              <button onClick={() => setSel(sel === i ? null : i)} style={{
                width: "100%", margin: "4px 0", padding: "6px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontWeight: 700,
                background: sel === i ? buffers[i].color + "22" : "transparent",
                border: `1.5px dashed ${sel === i ? buffers[i].color : C.border}`,
                color: sel === i ? buffers[i].color : C.muted,
              }}>{buffers[i].id} — click to see what it carries</button>
            )}
          </div>
        ))}
      </div>

      {sel !== null && (
        <div style={{ background: buffers[sel].color + "18", border: `1px solid ${buffers[sel].color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 12 }}>
          <strong style={{ color: buffers[sel].color }}>{buffers[sel].id}</strong> (right after {buffers[sel].after}): {buffers[sel].carries}
        </div>
      )}

      <Key color={C.purple}>
        Control signals travel <strong style={{ color: C.text }}>with</strong> the instruction down the pipe, riding in each
        buffer alongside the data — this is called <strong style={{ color: C.text }}>pipelined control</strong>. It's why later
        stages always know what to do with the data they receive, even though the instruction itself was decoded several cycles
        earlier.
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
      q: "In the assembly-line analogy, what actually gets faster when you switch from 'one car at a time' to an assembly line?",
      options: [
        "Each individual car is built faster",
        "Nothing about building any ONE car gets faster — throughput (cars finished per unit time) increases because every station is always working on a different car",
        "The factory becomes smaller",
        "Cars need fewer parts",
      ],
      answer: 1,
      explain: "Any one car still takes the same total time start-to-finish. What changes is throughput — a new finished car rolls out much more often, because every station is always busy on a different car.",
    },
    {
      q: "Why can Fetch start working on Ij+1 the very cycle after Ij leaves Fetch, without waiting for Ij to finish entirely?",
      options: [
        "It can't — Fetch must wait for Ij to complete",
        "Each of the five stages is separate, dedicated hardware — the moment Ij moves into Decode, the Fetch unit's hardware is free and idle, so it can fetch Ij+1 immediately",
        "Only every other instruction gets fetched early",
        "Fetch and Decode share the same circuit",
      ],
      answer: 1,
      explain: "Because Fetch and Decode are physically separate hardware, Fetch isn't 'busy' with Ij once Ij moves on — it's free to start on the next instruction right away. This is the entire mechanism behind pipelining.",
    },
    {
      q: "In the ideal overlapped case (Figure 6.1), from which cycle onward is the pipeline considered 'full'?",
      options: [
        "Cycle 1",
        "Cycle 3",
        "Cycle 5 — the first cycle where all five stages are simultaneously busy, each on a different instruction",
        "It's never actually full",
      ],
      answer: 2,
      explain: "It takes 5 cycles for the very first instruction to reach every stage. Only from cycle 5 onward are all five stages occupied at once — before that, the pipeline is still 'filling up.'",
    },
    {
      q: "What does interstage buffer B2 (between Decode and Compute) actually carry?",
      options: [
        "Just the fetched instruction word",
        "The two operands read from registers, the immediate value, and the control signals the later stages will need",
        "The final ALU result",
        "Nothing — B2 doesn't exist",
      ],
      answer: 1,
      explain: "B2 sits right after Decode, so it carries what Decode just produced: the register operands, any immediate value, and the control signals — all of which ride together down the pipe as pipelined control.",
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
          {score === 4 ? "Perfect! The whole pipelining idea — overlap, stages, buffers — is locked in." :
            score >= 2 ? "Good work! Replay 'The Ideal Case' and 'Pipeline Organization' to lock in the last pieces." :
              "Revisit 'Why Pipelining?' — throughput vs individual speed is the idea everything else builds on."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now explain why pipelining helps, walk through the five stages, and describe how instructions flow through
            the pipeline via interstage buffers.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.2 — Pipeline Performance.</strong> Time to put real numbers on
            exactly how much this overlap buys you.
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
    { id: "why", label: "Why Pipelining?" },
    { id: "steps", label: "Five Steps" },
    { id: "ideal", label: "The Ideal Case" },
    { id: "organization", label: "Organization & Buffers" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🏎️ Why Pipelining? — the assembly-line idea</h3><WhyPipelining /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🪜 One Instruction = Five Steps</h3><FiveSteps /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📊 The Ideal Case — Figure 6.1</h3><IdealCase /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🗄️ Pipeline Organization & Interstage Buffers — Figure 6.2</h3><PipelineOrganization /></div>,
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
          <div style={{ fontSize: 15, fontWeight: 600 }}>The Pipelining Idea</div>
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
