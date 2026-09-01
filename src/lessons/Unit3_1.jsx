// Unit3_1.jsx — Module 3 › Unit 3.1 — "The Pipelining Idea"
// Rebuilt for interactivity: the repeated-slider version is gone. Each section is now a
// DIFFERENT interaction — a serial-vs-assembly-line toggle, a click-to-reveal of the five
// stages, an AUTO-PLAYING space-time pipeline, and a predict-before-reveal on why the
// inter-stage registers exist. The PipelineGrid / buildStraightRows helpers here are the
// shared animation the other Unit 3 lessons reuse (copied in, since every lesson is
// self-contained).
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
// A "bubble" entry {after: s, count: c} inserts c stall cycles before stage index s.
function buildStraightRows(instrs) {
  return instrs.map((ins, i) => {
    const cells = {};
    ["IF", "ID", "EX", "MEM", "WB"].forEach((st, s) => { cells[i + 1 + s] = st; });
    return { label: ins.label, color: ins.color, cells };
  });
}

// ══════════════════════════════════════════════════════════════════
//  Shared PipelineGrid — an auto-playing space-time (reservation) diagram.
//  rows: [{ label, color, cells: { <cycleNumber>: <stageLabel> } }], plus totalCycles.
//  Reveals every cell whose cycle ≤ the current clock; Play advances it on its own.
// ══════════════════════════════════════════════════════════════════
function PipelineGrid({ rows, totalCycles, caption, speed = 650, height, autoPlay = false }) {
  const [clock, setClock] = useState(0);      // 0 = pipeline empty, nothing issued yet
  const [playing, setPlaying] = useState(false);

  useEffect(() => { if (autoPlay) setPlaying(true); }, [autoPlay]);

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

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Why an Assembly Line? Toggle serial vs. overlapped (analogy first)
// ══════════════════════════════════════════════════════════════════
function WhyAssemblyLine() {
  const [mode, setMode] = useState("serial");            // the toggle
  const stations = ["Wash", "Dry", "Fold", "Put away"];  // 4 laundry "stages"
  const stationColor = [C.accent, C.teal, C.orange, C.green];
  const loads = ["Load 1", "Load 2", "Load 3", "Load 4"];
  const k = stations.length, n = loads.length;
  const serialTotal = k * n;        // 16
  const pipeTotal = k + n - 1;      // 7
  const total = mode === "serial" ? serialTotal : pipeTotal;
  const cycleNums = Array.from({ length: total }, (_, i) => i + 1);

  // station index (0..k-1) load i occupies at 1-indexed cycle c, or null
  const stationAt = (i, c) => {
    const start = mode === "serial" ? i * k : i;
    const s = c - start - 1;
    return s >= 0 && s < k ? s : null;
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Forget processors for a second. You have four loads of laundry, and four appliances that each do one job:
        <strong style={{ color: C.text }}> Wash → Dry → Fold → Put away</strong>. The lazy way: finish one load
        <em> completely</em> before you touch the next — so the dryer sits idle the whole time you're washing. The smart way is a
        real factory's <strong style={{ color: C.text }}>assembly line</strong>: the moment a load leaves the washer, the next load
        goes straight in. Flip the switch and compare.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setMode("serial")} style={{
          flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: mode === "serial" ? C.red + "22" : C.card, border: `1.5px solid ${mode === "serial" ? C.red : C.border}`,
          color: mode === "serial" ? C.red : C.muted,
        }}>❌ One load at a time</button>
        <button onClick={() => setMode("pipe")} style={{
          flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: mode === "pipe" ? C.green + "22" : C.card, border: `1.5px solid ${mode === "pipe" ? C.green : C.border}`,
          color: mode === "pipe" ? C.green : C.muted,
        }}>✅ Assembly line (overlapped)</button>
      </div>

      <div style={{ overflowX: "auto", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: `70px repeat(${total}, 34px)`, gap: 4, minWidth: "fit-content" }}>
          <div style={{ fontSize: 10, color: C.muted, alignSelf: "center" }}>load \ step</div>
          {cycleNums.map((cy) => (
            <div key={cy} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: C.muted }}>{cy}</div>
          ))}
          {loads.flatMap((lbl, i) => [
            <div key={`l-${i}`} style={{ fontSize: 11.5, color: C.text, alignSelf: "center", whiteSpace: "nowrap" }}>{lbl}</div>,
            ...cycleNums.map((cy) => {
              const s = stationAt(i, cy);
              return (
                <div key={`g-${i}-${cy}`} style={{
                  height: 26, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700,
                  background: s !== null ? stationColor[s] + "33" : "transparent",
                  border: s !== null ? `1px solid ${stationColor[s]}` : `1px dashed ${C.border}`,
                  color: s !== null ? stationColor[s] : "transparent",
                }}>{s !== null ? stations[s].slice(0, 3) : "·"}</div>
              );
            }),
          ])}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 14, textAlign: "center", opacity: mode === "serial" ? 1 : 0.55 }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>❌ ONE AT A TIME</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{serialTotal}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>steps = k × n = 4 × 4</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 14, textAlign: "center", opacity: mode === "pipe" ? 1 : 0.55 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✅ ASSEMBLY LINE</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{pipeTotal}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>steps = k + (n − 1) = 4 + 3</div>
        </div>
      </div>

      <Key color={C.accent}>
        No single load got washed any faster — each still takes all four steps. What changed is <strong style={{ color: C.text }}>throughput</strong>:
        every appliance is always busy on a <em>different</em> load, so all four finish in far fewer steps. Doing this same trick to
        instructions — overlapping successive instructions across dedicated hardware stages of the datapath you built in
        <strong style={{ color: C.text }}> Unit 2.5</strong> — is exactly what we call <strong style={{ color: C.text }}>pipelining</strong>.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Five Stages: click each to reveal it (ties back to Module 2)
// ══════════════════════════════════════════════════════════════════
function FiveStages() {
  const [active, setActive] = useState(null);
  const stages = [
    { k: "IF", name: "Instruction Fetch", body: "Read the next instruction word from memory and bump the PC. This is literally the fetch step you built in Unit 2.3 — now it's just stage one of five." },
    { k: "ID", name: "Instruction Decode", body: "Work out the opcode and read the source operands out of the register file. Same decode-and-read-registers logic from the datapath in Unit 2.5, carved off as its own stage." },
    { k: "EX", name: "Execute", body: "The ALU from Unit 2.2 does the arithmetic or logic — add, subtract, compare, or compute a memory address." },
    { k: "MEM", name: "Memory Access", body: "Read or write data memory. Only load/store instructions actually use this — exactly the load/store work from Unit 2.3–2.4; everyone else just passes through." },
    { k: "WB", name: "Write Back", body: "Write the result back into the register file, so a later instruction can read it. The register write that ends the datapath." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A single instruction runs in five steps, one per clock cycle — and, crucially, each step uses
        <strong style={{ color: C.text }}> different hardware</strong>. You already built every one of these back in Module 2; pipelining
        just lines them up as stages. Click each stage to see what it does and where you met it before.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {stages.map((s, i) => {
          const col = STAGE_COLOR[s.k];
          const on = active === i;
          return (
            <button key={s.k} onClick={() => setActive(on ? null : i)} style={{
              flex: 1, padding: "12px 4px", borderRadius: 8, cursor: "pointer", textAlign: "center",
              background: on ? col + "22" : C.card, border: `2px solid ${on ? col : C.border}`,
            }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: on ? col : C.muted }}>{s.k}</div>
              <div style={{ fontSize: 8.5, color: C.muted, marginTop: 3 }}>{s.name}</div>
            </button>
          );
        })}
      </div>

      <div style={{ background: C.card, border: `1px solid ${active !== null ? STAGE_COLOR[stages[active].k] + "66" : C.border}`, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: C.text, lineHeight: 1.6, minHeight: 60 }}>
        {active !== null ? (
          <span><strong style={{ color: STAGE_COLOR[stages[active].k] }}>{stages[active].k} — {stages[active].name}:</strong> {stages[active].body}</span>
        ) : (
          <span style={{ color: C.muted }}>Click a stage above. The colours (IF / ID / EX / MEM / WB) are the same ones you'll see moving through the space-time diagram in the next section.</span>
        )}
      </div>

      <Key color={C.teal}>
        The instant an instruction leaves <strong style={{ color: STAGE_COLOR.IF }}>IF</strong> and enters
        <strong style={{ color: STAGE_COLOR.ID }}> ID</strong>, the fetch hardware is <strong style={{ color: C.text }}>free</strong> — nothing
        stops it fetching the next instruction right away. Five separate stages means up to five instructions can be in flight at once.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Watch It Overlap: the flagship AUTO-PLAYING space-time diagram
// ══════════════════════════════════════════════════════════════════
function WatchItOverlap() {
  const instrs = [
    { label: "I1  lw", color: C.accent }, { label: "I2  add", color: C.teal },
    { label: "I3  sub", color: C.orange }, { label: "I4  and", color: C.purple }, { label: "I5  or", color: C.green },
  ];
  const rows = buildStraightRows(instrs);
  const total = 9; // 5 + (5 − 1)

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Now the payoff. Five instructions enter the five stages, one new instruction issued every cycle. This starts running on its
        own — watch the diagonal form as the pipe <strong style={{ color: C.text }}>fills</strong>, hits <strong style={{ color: C.text }}>steady state</strong>,
        then <strong style={{ color: C.text }}>drains</strong>. Each cell is one instruction in one stage (IF / ID / EX / MEM / WB) in one cycle.
      </p>

      <PipelineGrid rows={rows} totalCycles={total} autoPlay caption={(clk, done) =>
        clk === 0 ? "Cycle 0 — pipeline empty, nothing issued yet. Press ▶ if it hasn't started." :
        clk < 5 ? `Cycle ${clk} — FILLING. A new instruction enters IF each cycle, but the first result won't land until cycle 5. Read any column: only ${clk} stage(s) busy.` :
        clk === 5 ? "Cycle 5 — pipe is FULL. Read straight down the column: all five stages busy at once, each on a different instruction. I1 reaches WB — the first result retires." :
        clk < total ? `Cycle ${clk} — STEADY STATE: one instruction retires every single cycle. ${done} done so far. This is the throughput win from Section 1, made real.` :
        `Cycle ${total} — DRAINED. All 5 done in 5 + (5−1) = 9 cycles, versus 5 × 5 = 25 if we ran them one at a time.`
      } />

      <Key color={C.green}>
        Any ONE instruction still takes 5 cycles start to finish — pipelining never sped up a single instruction. But from cycle 5 on,
        a new one <strong style={{ color: C.text }}>completes every cycle</strong>. That steady-state "one per cycle" is the whole point,
        and Unit 3.2 will turn it into real numbers.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Why Pipeline Registers? Predict what breaks, then reveal
// ══════════════════════════════════════════════════════════════════
function WhyPipelineRegisters() {
  const [guess, setGuess] = useState(null);
  const options = [
    { id: "a", text: "Nothing — the stages just sort it out on their own." },
    { id: "b", text: "I2's freshly-decoded operands flow straight into EX and clobber the values I1 still needs there." },
    { id: "c", text: "The program counter stops incrementing." },
    { id: "d", text: "The ALU runs out of registers to store numbers in." },
  ];
  const correct = "b";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The five stages are separate hardware — but they all run off the <strong style={{ color: C.text }}>same clock</strong>, and each
        stage's logic is combinational: whatever's on its inputs flows straight through. Picture two instructions in flight with
        <strong style={{ color: C.text }}> nothing</strong> holding data between stages:
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 14, fontSize: 13, color: C.text, lineHeight: 1.7 }}>
        <div><strong style={{ color: STAGE_COLOR.EX }}>I1</strong> is in <strong style={{ color: STAGE_COLOR.EX }}>EX</strong>, its operands sitting on the ALU inputs.</div>
        <div><strong style={{ color: STAGE_COLOR.ID }}>I2</strong> is right behind it in <strong style={{ color: STAGE_COLOR.ID }}>ID</strong>, reading its own operands out of the register file.</div>
        <div style={{ marginTop: 8, color: C.muted }}>On the next clock edge, I2 advances toward EX. <strong style={{ color: C.yellow }}>Predict: what breaks?</strong></div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {options.map((o) => {
          let bg = C.card, bd = C.border, col = C.text;
          if (guess !== null) {
            if (o.id === correct) { bg = C.green + "22"; bd = C.green; col = C.green; }
            else if (o.id === guess) { bg = C.red + "22"; bd = C.red; col = C.red; }
          }
          return (
            <button key={o.id} onClick={() => guess === null && setGuess(o.id)} style={{
              textAlign: "left", padding: "10px 14px", borderRadius: 8, background: bg, border: `1.5px solid ${bd}`, color: col,
              fontSize: 13, cursor: guess === null ? "pointer" : "default",
            }}>
              {guess !== null && o.id === correct ? "✓ " : guess === o.id && o.id !== correct ? "✗ " : ""}{o.text}
            </button>
          );
        })}
      </div>

      {guess !== null && (
        <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>
          💡 With no storage between stages, I2's operands race through the combinational logic and overwrite the inputs
          I1's EX still needs — instructions trample each other and the answers come out garbage. The fix is a
          <strong style={{ color: C.text }}> register between every pair of stages</strong> (IF/ID, ID/EX, EX/MEM, MEM/WB). Also called
          <strong style={{ color: C.text }}> pipeline registers</strong> or interstage buffers, each one latches its instruction's data
          on the clock edge and holds it steady for the whole next cycle, so every stage works only on its own instruction's data.
        </div>
      )}

      {guess !== null && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
          <div style={{ background: C.card, border: `1.5px solid ${C.red}55`, borderRadius: 10, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.red, fontWeight: 700, fontSize: 11.5, marginBottom: 8 }}>NO REGISTERS</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: C.text }}>EX ⟶ EX ⟶ EX</div>
            <div style={{ color: C.muted, fontSize: 10.5, marginTop: 6 }}>data leaks between stages — values clobbered</div>
          </div>
          <div style={{ background: C.card, border: `1.5px solid ${C.green}55`, borderRadius: 10, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.green, fontWeight: 700, fontSize: 11.5, marginBottom: 8 }}>WITH REGISTERS</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, color: C.text }}>EX <span style={{ color: C.accent }}>|</span> EX <span style={{ color: C.accent }}>|</span> EX</div>
            <div style={{ color: C.muted, fontSize: 10.5, marginTop: 6 }}>each latch holds its instruction's data for one cycle</div>
          </div>
        </div>
      )}

      <Key color={C.purple}>
        The registers between stages are what make an overlapped pipeline actually correct, not just fast: they keep each in-flight
        instruction's data — and its control signals — separate. Every clock edge, all four latches capture at once and the whole
        pipe steps forward one stage.
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
      q: "In the laundry / assembly-line analogy, what actually improves when you overlap the loads?",
      options: [
        "Each individual load is washed faster",
        "Throughput — every appliance is always busy on a different load, so all loads finish in far fewer steps, even though one load still takes all four steps",
        "The washer and dryer merge into one machine",
        "You need fewer loads of laundry",
      ],
      answer: 1,
      explain: "Any one load still takes all four steps start to finish. Overlap raises throughput: finished loads roll out much more often because every stage is always working on a different load.",
    },
    {
      q: "The five pipeline stages IF / ID / EX / MEM / WB reuse hardware you built in Module 2. Which mapping is right?",
      options: [
        "EX is the fetch from Unit 2.3; IF is the ALU from Unit 2.2",
        "IF is the fetch (Unit 2.3), EX is the ALU (Unit 2.2), MEM is load/store (Unit 2.3–2.4), WB is the register write",
        "All five stages are brand-new hardware with no relation to Module 2",
        "MEM is the ALU and WB is the fetch",
      ],
      answer: 1,
      explain: "Pipelining doesn't invent new hardware — it lines up the datapath you already built: IF = fetch (2.3), EX = ALU (2.2), MEM = load/store memory access (2.3–2.4), WB = register write.",
    },
    {
      q: "In the auto-playing diagram, from which cycle onward is the 5-stage pipeline 'full' — all five stages busy at once?",
      options: [
        "Cycle 1",
        "Cycle 3",
        "Cycle 5 — the first cycle where all five stages are simultaneously busy, each on a different instruction",
        "It is never actually full",
      ],
      answer: 2,
      explain: "It takes 5 cycles for the first instruction to reach WB. Only from cycle 5 onward is every stage occupied; before that the pipe is still filling.",
    },
    {
      q: "Why does a real pipeline need a register between every pair of stages (IF/ID, ID/EX, EX/MEM, MEM/WB)?",
      options: [
        "To make the clock run faster",
        "To latch and hold each in-flight instruction's data (and control signals) for one cycle, so the next instruction's values don't clobber the ones a prior stage still needs",
        "To store the final program output",
        "Registers between stages are optional and only save power",
      ],
      answer: 1,
      explain: "Stage logic is combinational, so without a latch between stages the following instruction's data would race through and overwrite values still in use. The pipeline registers hold each instruction's data steady for its cycle.",
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
          {score === 4 ? "Perfect! The whole pipelining idea — overlap, the five stages, and the registers between them — is locked in." :
            score >= 2 ? "Good work! Replay 'Watch It Overlap' and 'Why Pipeline Registers?' to lock in the last pieces." :
              "Revisit 'Why an Assembly Line?' — throughput vs. individual speed is the idea everything else builds on."}
        </div>
        <div style={{ padding: "20px", borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can explain why pipelining raises throughput, name the five stages and tie each back to the Module 2 hardware, read a
            space-time diagram, and say why the inter-stage registers exist.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.2 — Pipeline Performance.</strong> You've seen the pipe hit "one instruction per
            cycle." Next you'll put real numbers on it: the k + (n − 1) cycle count, the speedup that approaches but never reaches k,
            and the T = N·S/R equation.
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
//  Main
// ══════════════════════════════════════════════════════════════════
export default function Unit3_1({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Why an Assembly Line?" },
    { id: "stages", label: "The Five Stages" },
    { id: "overlap", label: "Watch It Overlap" },
    { id: "registers", label: "Pipeline Registers" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🧺 Why an Assembly Line? — overlap the loads</h3><WhyAssemblyLine /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🪜 The Five Stages — IF · ID · EX · MEM · WB</h3><FiveStages /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📊 Watch It Overlap — fill, steady state, drain</h3><WatchItOverlap /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🗄️ Why Pipeline Registers? — predict what breaks</h3><WhyPipelineRegisters /></div>,
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
