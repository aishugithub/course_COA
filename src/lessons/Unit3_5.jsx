// Unit3_5.jsx — Module 3 › Unit 3.5 — "Instruction Sets, Datapath & Control" (pipelined)
// Rebuilt to match Unit 3.2's interactivity bar: every section is a DIFFERENT
// interaction — a RISC/CISC framing toggle, an AUTO-PLAYING structural-hazard
// space-time diagram, a predict-before-reveal on hidden side effects, and a
// live Δ-degradation explorer. The PipelineGrid / buildStraightRows / buildRows
// helpers are copied in verbatim (every lesson is self-contained).
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

// ── buildRows: general schedule → row map, so stalls/bubbles can be placed by hand ──
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

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Why the ISA Talks Back to the Pipe (RISC vs CISC toggle)
// ══════════════════════════════════════════════════════════════════
function WhyItMatters() {
  const [style, setStyle] = useState("risc");
  const isRisc = style === "risc";

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Think of the pipeline like a well-run assembly line: it only stays smooth if every product moving down it is roughly the
        same shape and needs roughly the same steps. If some products demand a detour to a special machine, the whole line hitches.
        The pipeline you've been building on top of <strong style={{ color: C.text }}>the datapath from Unit 2.5</strong> is exactly
        that line — and the <em>instruction set</em> (the ISA) decides what shapes come down it. Some ISA choices make a clean
        pipeline much harder. Toggle the two design philosophies and see which one the pipe likes.
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
            <li><strong>Load–Store architecture</strong>: only Load/Store touch memory; arithmetic is register-to-register → predictable timing per stage.</li>
            <li><strong>Simple, regular addressing</strong> → no hidden extra work in the operand stage.</li>
          </ul>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 13, lineHeight: 1.9 }}>
            <li><strong>Variable length</strong> instructions → several cycles just to fetch one shape.</li>
            <li><strong>Multiple memory operands</strong> per instruction → the same hardware gets asked for twice (a structural clash — next section).</li>
            <li><strong>Complex addressing</strong> → silent side effects and condition codes (the section after that).</li>
          </ul>
        )}
      </div>

      <Key color={C.accent}>
        The pipe doesn't care about elegance — it cares whether every instruction is the same predictable shape. That's why the
        ISA "talks back" to the pipeline: choices made for programmer convenience can force stalls the hardware then has to fight.
        Modern CPUs cheat both ways — they keep a CISC-looking outside for compatibility but internally
        <strong style={{ color: C.text }}> crack each instruction into simple, RISC-like micro-operations</strong> before the pipe ever sees them.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — FLAGSHIP: auto-playing structural hazard on one memory port
// ══════════════════════════════════════════════════════════════════
function StructuralHazard() {
  // I1 is a Load, so it truly USES the single memory port in its MEM stage (cycle 4).
  // In that same cycle I4 wants to Fetch — but IF also reads that one port. Collision →
  // I4 stalls one cycle (○) and only fetches in cycle 5. Arithmetic I2/I3 pass through
  // MEM without touching the port, so they never clash.
  const schedule = [
    { label: "I1  lw   (MEM!)", color: C.teal, stages: [
      { name: "IF", cycle: 1 }, { name: "ID", cycle: 2 }, { name: "EX", cycle: 3 }, { name: "MEM", cycle: 4 }, { name: "WB", cycle: 5 },
    ] },
    { label: "I2  add", color: C.text, stages: [
      { name: "IF", cycle: 2 }, { name: "ID", cycle: 3 }, { name: "EX", cycle: 4 }, { name: "MEM", cycle: 5 }, { name: "WB", cycle: 6 },
    ] },
    { label: "I3  sub", color: C.text, stages: [
      { name: "IF", cycle: 3 }, { name: "ID", cycle: 4 }, { name: "EX", cycle: 5 }, { name: "MEM", cycle: 6 }, { name: "WB", cycle: 7 },
    ] },
    { label: "I4  or", color: C.text, stages: [
      { name: "○", cycle: 4 }, { name: "IF", cycle: 5 }, { name: "ID", cycle: 6 }, { name: "EX", cycle: 7 }, { name: "MEM", cycle: 8 }, { name: "WB", cycle: 9 },
    ] },
  ];
  const rows = buildRows(schedule);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Picture one doorway that both the delivery crew and the outgoing shipping crew have to use — if they arrive at the same
        moment, one waits. That's a <strong style={{ color: C.text }}>structural hazard</strong>: two stages need the
        <em> same piece of hardware</em> in the same cycle. It has nothing to do with data — it's a pure resource collision, and it
        sits on top of the data hazards from Unit 3.3 and branch hazards from Unit 3.4 as a third, separate reason to stall.
      </p>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Here the shared doorway is a <strong style={{ color: C.teal }}>single memory port</strong>. Fetch (IF) reads it every
        cycle; a Load's Memory stage (MEM) reads it too. Hit <strong style={{ color: C.green }}>▶ Run cycles</strong> and watch
        <strong style={{ color: C.teal }}> cycle 4</strong>.
      </p>

      <PipelineGrid rows={rows} totalCycles={9} caption={(clk, done) =>
        clk === 0 ? "Cycle 0 — pipeline empty. I1 is a Load, so it will need the memory port twice: once to fetch, once in MEM." :
        clk < 4 ? `Cycle ${clk} — filling normally. No collision yet; only I1 will actually touch the memory port in MEM.` :
        clk === 4 ? "💥 Cycle 4 — COLLISION. I1 is in MEM (reading data through the one memory port) at the exact instant I4 wants IF (reading an instruction through that SAME port). Only one can win — I4 loses and gets a bubble (○)." :
        clk === 5 ? "Cycle 5 — the port is free again, so I4 finally fetches. That one-cycle bubble is the price of sharing the port." :
        clk < 9 ? `Cycle ${clk} — I4 is now one cycle behind where it should be; everything after it is pushed back too.` :
        "Cycle 9 — done, but it took one extra cycle. The fix: give Fetch and Memory SEPARATE ports — a split instruction cache (I-cache) and data cache (D-cache) — so IF and MEM never fight, and the ○ disappears."
      } />

      <Key color={C.green}>
        The general rule: give every stage its <strong style={{ color: C.text }}>own hardware</strong>. If two stages share a unit
        they can't both work in the same cycle, and the whole overlap that made the pipeline worthwhile breaks. Splitting the one
        memory port into a separate I-cache and D-cache removes this collision entirely — and it's the same reason each stage owns
        its own buffer register rather than sharing one.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Side Effects: predict-before-reveal + click-to-reveal
// ══════════════════════════════════════════════════════════════════
function SideEffects() {
  const [show, setShow] = useState(false);
  const [predict, setPredict] = useState(null); // "yes" | "no"

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Imagine a coworker who, every time they grab a file, also quietly moves your stapler — without telling you. A
        <strong style={{ color: C.text }}> side effect</strong> is exactly that: an instruction that changes a location <em>other
        than</em> its named destination. It's the sneakiest kind of dependency, because it isn't written anywhere obvious in the
        instruction — and the pipeline's hazard hardware can't stall for a dependency it can't see.
      </p>

      {/* click-to-reveal: autoincrement anatomy */}
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
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

      {/* predict-before-reveal: condition-code hazard */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
        <div style={{ color: C.purple, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>PREDICT FIRST</div>
        <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 10, lineHeight: 1.6 }}>
          Recall the <strong style={{ color: C.text }}>condition codes from Unit 2.6</strong> — the flags an instruction leaves
          behind. Now read these two instructions, where the compiler put no register in common between them:
        </p>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontFamily: "monospace", fontSize: 13.5, color: C.text, lineHeight: 1.9, marginBottom: 12 }}>
          Compare R1, R2<span style={{ color: C.muted }}> &nbsp;; sets the flags</span><br />
          Branch&gt;0 target<span style={{ color: C.muted }}> &nbsp;; jumps if greater</span>
        </div>
        <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 10 }}>
          They share no named register. <strong style={{ color: C.text }}>Is there still a hidden dependency between them?</strong>
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {[{ k: "yes", t: "Yes — there's a hidden hazard" }, { k: "no", t: "No — they're independent" }].map((o) => {
            let bg = C.card, bd = C.border, col = C.text;
            if (predict !== null) {
              if (o.k === "yes") { bg = C.green + "22"; bd = C.green; col = C.green; }
              else if (o.k === predict) { bg = C.red + "22"; bd = C.red; col = C.red; }
            }
            return (
              <button key={o.k} onClick={() => predict === null && setPredict(o.k)} style={{
                flex: 1, padding: "10px 12px", borderRadius: 8, background: bg, border: `1.5px solid ${bd}`, color: col,
                fontWeight: 700, fontSize: 12.5, cursor: predict === null ? "pointer" : "default",
              }}>{predict !== null && o.k === "yes" ? "✓ " : predict === o.k && o.k !== "yes" ? "✗ " : ""}{o.t}</button>
            );
          })}
        </div>

        {predict !== null && (
          <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
            💡 <strong style={{ color: C.green }}>Yes — there's a hidden hazard.</strong> <span style={{ fontFamily: "monospace" }}>Compare</span> silently
            WRITES the condition-code flags; <span style={{ fontFamily: "monospace" }}>Branch&gt;0</span> READS them. That's a real read-after-write
            dependency the pipeline must respect — but it's invisible in the named operands, so the hazard hardware needs extra logic just to notice it.
            {predict === "no" && " The lack of a shared register is exactly the trap."}
          </div>
        )}
      </div>

      <Key color={C.orange}>
        Side effects — autoincrement addressing and condition codes alike — create dependencies the compiler and the hazard
        hardware can't read off the operands. They're the same read-after-write problem you already know from the data hazards of
        Unit 3.3, but one instruction-set feature away and much harder to spot: an ISA choice that quietly hands the pipeline more work.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The Δ Formula: how stalls degrade the ideal S = 1 (sliders)
// ══════════════════════════════════════════════════════════════════
function DeltaFormula() {
  const [branchPct, setBranchPct] = useState(20);   // % of instructions that are branches
  const [penalty, setPenalty] = useState(2);        // cycles lost per taken/mispredicted branch
  const [stallPct, setStallPct] = useState(10);     // % of instructions that cause a data stall

  const dBranch = (branchPct / 100) * penalty;
  const dStall = (stallPct / 100) * 1;
  const S = 1 + dBranch + dStall;

  // T = N·S/R from Unit 3.2, with fixed illustrative N and R so only S moves.
  const N = 1_000_000;      // instructions
  const Rghz = 2;           // 2 GHz → 2e9 cycles/s
  const Tms = (N * S) / (Rghz * 1e9) * 1000; // milliseconds
  const TidealMs = (N * 1) / (Rghz * 1e9) * 1000;
  const degradePct = ((S - 1) * 100).toFixed(1);
  const barPct = Math.min(100, ((S - 1) / 1.5) * 100); // 0..1.5 extra CPI mapped to a bar

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Back in <strong style={{ color: C.text }}>Unit 3.2's T = N·S/R</strong>, an ideal pipeline hit <strong>S = 1</strong> — one
        instruction finished every cycle. Reality never quite gets there: every hazard type adds a small penalty term (a
        <strong style={{ color: C.text }}> Δ, delta</strong>) onto that 1, and the terms simply stack up:
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", textAlign: "center", marginBottom: 16, fontFamily: "monospace", fontSize: 15, color: C.text }}>
        S = 1 + Δ<sub>branch</sub> + Δ<sub>stall</sub> + Δ<sub>miss</sub>
      </div>

      <p style={{ color: C.muted, fontSize: 12.5, marginBottom: 12, lineHeight: 1.6 }}>
        Each Δ is just <em>how often</em> that stall happens × <em>how many cycles</em> it costs. Drag the sliders and watch the
        ideal S = 1 degrade — and watch T = N·S/R climb with it (Δ<sub>miss</sub> for cache misses is held at 0 here to isolate the
        branch and data effects).
      </p>

      <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        {[
          { label: "% of instructions that are branches", val: branchPct, set: setBranchPct, min: 0, max: 50, unit: "%", color: C.teal },
          { label: "penalty per taken branch (cycles)", val: penalty, set: setPenalty, min: 0, max: 4, unit: " cyc", color: C.orange },
          { label: "% of instructions that cause a data stall", val: stallPct, set: setStallPct, min: 0, max: 40, unit: "%", color: C.yellow },
        ].map((s, idx) => (
          <div key={idx} style={{ marginBottom: 12 }}>
            <label style={{ color: C.muted, fontSize: 12 }}>{s.label} = <strong style={{ color: s.color }}>{s.val}{s.unit}</strong></label>
            <input type="range" min={s.min} max={s.max} value={s.val} onChange={(e) => s.set(Number(e.target.value))} style={{ width: "100%", accentColor: s.color }} />
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: 6, fontFamily: "monospace", fontSize: 13.5, color: C.text, lineHeight: 1.9 }}>
          Δ<sub>branch</sub> = {(branchPct / 100).toFixed(2)} × {penalty} = <strong style={{ color: C.orange }}>{dBranch.toFixed(3)}</strong><br />
          Δ<sub>stall</sub> = {(stallPct / 100).toFixed(2)} × 1 = <strong style={{ color: C.yellow }}>{dStall.toFixed(3)}</strong><br />
          S = 1 + {dBranch.toFixed(3)} + {dStall.toFixed(3)} = <strong style={{ color: C.accent }}>{S.toFixed(3)}</strong>
        </div>
      </div>

      {/* degradation bar + T readout */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
          degradation vs the ideal S = 1 &nbsp;→&nbsp; <strong style={{ color: C.red }}>+{degradePct}%</strong> more cycles per instruction
        </div>
        <div style={{ height: 14, background: C.bg, borderRadius: 7, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 14 }}>
          <div style={{ height: "100%", width: `${barPct}%`, background: `linear-gradient(90deg, ${C.green}, ${C.red})`, transition: "width 0.3s" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
          <div><div style={{ fontSize: 11, color: C.muted }}>ideal T (S = 1)</div><div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{TidealMs.toFixed(2)} ms</div></div>
          <div><div style={{ fontSize: 11, color: C.muted }}>actual T = N·S/R</div><div style={{ fontSize: 20, fontWeight: 800, color: C.red }}>{Tms.toFixed(2)} ms</div></div>
        </div>
        <div style={{ fontSize: 10.5, color: C.muted, textAlign: "center", marginTop: 6 }}>N = 1,000,000 instr · R = 2 GHz (held fixed, so only S moves T)</div>
      </div>

      <Key color={C.red}>
        The ISA choices from this whole unit — structural collisions, hidden side effects, expensive addressing — all cash out as
        extra Δ terms on top of S = 1. Because T = N·S/R and N and R are fixed by the program and the clock, <strong style={{ color: C.text }}>S
        is the only knob left</strong>, and every stall you can't hide pushes it — and your runtime — up. In real machines
        Δ<sub>miss</sub> (cache misses) usually dwarfs the others; that's why so much design effort goes into caches.
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
      q: "Why does the instruction set 'talk back' to the pipeline — how can an ISA choice make a clean pipeline harder?",
      options: [
        "It can't — the ISA and the pipeline are completely independent",
        "Choices like variable-length instructions, multiple memory operands, and complex addressing break the uniform, predictable shape the pipeline's Fetch/Decode stages depend on, forcing stalls",
        "A larger ISA always runs faster in a pipeline",
        "The ISA only affects the clock rate R, never the number of stalls",
      ],
      answer: 1,
      explain: "The pipeline stays smooth only when every instruction is a predictable shape. RISC-style uniformity (fixed length, load-store, simple addressing) keeps Fetch/Decode simple; CISC-style irregularity forces extra cycles and stalls. That's the ISA 'talking back'.",
    },
    {
      q: "Two instructions collide on a single memory port: an older Load is in its MEM stage the same cycle a newer instruction wants IF. What kind of hazard is this, and what's the fix?",
      options: [
        "A data hazard; fix it with forwarding",
        "A control hazard; fix it with branch prediction",
        "A structural hazard (both stages want the SAME hardware at once); fix it by giving them separate resources — a split I-cache and D-cache",
        "It's not a hazard at all; the pipeline handles it for free",
      ],
      answer: 2,
      explain: "A structural hazard is a resource collision, not a data dependency. IF reads the memory port every cycle and a Load's MEM reads it too; sharing one port forces one to stall (a ○ bubble). Splitting into an I-cache and a D-cache removes the collision entirely.",
    },
    {
      q: "'Compare R1,R2' followed by 'Branch>0 target' share no named register. Why is there still a hidden dependency the pipeline must respect?",
      options: [
        "There isn't — with no shared register they're independent",
        "Compare silently WRITES the condition-code flags and Branch READS them, so it's a real read-after-write dependency that's invisible in the operands (a side effect) and needs extra hazard logic to catch",
        "Branch instructions never depend on anything",
        "They collide on the same memory port",
      ],
      answer: 1,
      explain: "Condition codes are a side effect: Compare changes the flags (not a named destination), and Branch depends on those flags. The dependency is real but hidden from the operands — exactly why side effects are so troublesome for hazard detection.",
    },
    {
      q: "In S = 1 + Δbranch + Δstall + Δmiss (with T = N·S/R from Unit 3.2), why does adding stalls raise the program's runtime T?",
      options: [
        "Because stalls increase N, the instruction count",
        "Because stalls lower the clock rate R",
        "Because N and R are fixed by the program and the clock, so each Δ raises S — the only free knob — and T = N·S/R rises directly with S",
        "Stalls don't affect T at all; they only affect power",
      ],
      answer: 2,
      explain: "N is set by the program and R by the clock, so neither moves. Every hazard adds a Δ onto the ideal S = 1, and since T = N·S/R, a bigger S means a bigger T. S is the only term the pipeline (and the ISA) actually pushes on.",
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
          {score === 4 ? "Perfect! ISA influence, structural hazards, hidden side effects, and the Δ formula are all locked in." :
            score >= 2 ? "Good work! Replay the 'Structural Hazard' animation and 'The Δ Formula' to lock in the remaining pieces." :
              "Revisit 'Why the ISA Talks Back' — that framing ties this whole unit together."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've now seen how the instruction set itself shapes pipelining — structural hazards on shared hardware, hidden side
            effects from condition codes and autoincrement addressing, and how every stall adds a Δ onto S = 1 in T = N·S/R.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.C — Capstone: Schedule to Avoid Stalls.</strong> Time to put it all
            together. You'll be handed real code carrying data hazards from Unit 3.3, branch hazards from Unit 3.4, and the structural
            and side-effect hazards from this unit — and challenged to reorder the instructions yourself so the pipeline runs with the
            fewest possible ○ bubbles, driving S back down toward 1.
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
    { id: "why", label: "ISA Talks Back" },
    { id: "structural", label: "Structural Hazard" },
    { id: "side", label: "Side Effects" },
    { id: "delta", label: "The Δ Formula" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🗣️ Why the ISA Talks Back to the Pipe</h3><WhyItMatters /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🚪 Structural Hazard — one port, two claimants</h3><StructuralHazard /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🫥 Side Effects — the hidden dependency</h3><SideEffects /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>📐 The Δ Formula — how stalls degrade S = 1</h3><DeltaFormula /></div>,
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
