// Unit2_1.jsx — Module 2 › Unit 2.1 — "Register Transfers (RTL)"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 1 (Register Transfers & Microoperations).
// Arc: instruction → microoperations → RTL notation → the control function
// (transfer only on a signal) → the common bus (MUX / tri-state) → memory
// transfers through MDR → quiz.
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

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Instruction vs Microoperation (the "why" of this unit)
//  One ISA instruction decomposes into a sequence of tiny per-clock steps.
// ══════════════════════════════════════════════════════════════════
function InstructionZoom() {
  const [step, setStep] = useState(0); // 0..4 — how many microoperations revealed

  // The classic fetch-execute of "ADD R1, R2" broken into microoperations,
  // one per clock pulse. This is the deck's t1..t4 · execute table.
  const micro = [
    { t: "t1", op: "MAR ← PC", note: "Copy the program counter into the memory address register — 'which word do I fetch?'" },
    { t: "t2", op: "MDR ← M[MAR],  PC ← PC + 1", note: "Memory hands the instruction word to MDR; PC already steps to the next instruction." },
    { t: "t3", op: "IR ← MDR", note: "The fetched word lands in the instruction register, ready to be decoded." },
    { t: "exec", op: "R1 ← R1 + R2", note: "Only NOW does the actual add happen — the work the programmer asked for." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In Unit 1, <code style={{ color: C.accent, fontFamily: "monospace" }}>Add R1, R2</code> looked like a single move.
        It isn't. The CPU can only do <strong style={{ color: C.text }}>one elementary step per clock pulse</strong> — a
        <strong style={{ color: C.accent }}> microoperation</strong>. Reveal them one clock at a time and watch a single
        instruction unfold into a sequence.
      </p>

      {/* Two levels side by side */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 180, background: C.card, border: `2px solid ${C.purple}`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ color: C.purple, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>INSTRUCTION — what the programmer writes</div>
          <div style={{ fontFamily: "monospace", fontSize: 16, color: C.text }}>ADD R1, R2</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>one opcode + operands in the ISA</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: C.card, border: `2px solid ${C.accent}`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>MICROOPERATION — how the CPU runs it</div>
          <div style={{ fontFamily: "monospace", fontSize: 14, color: C.text }}>load · clear · count · shift · add</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>one elementary step, one clock pulse</div>
        </div>
      </div>

      {/* Timeline reveal */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ color: C.text, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
          One instruction, unfolding clock by clock:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {micro.map((m, i) => {
            const shown = i < step;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8,
                background: shown ? (i === 3 ? C.green + "1E" : C.accent + "14") : C.surface,
                border: `1.5px solid ${shown ? (i === 3 ? C.green : C.accent) : C.border}`,
                opacity: shown ? 1 : 0.35, transition: "all 0.3s",
              }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, color: i === 3 ? C.green : C.yellow, width: 34 }}>{m.t}</span>
                <span style={{ fontFamily: "monospace", fontSize: 13, color: C.text, minWidth: 150 }}>{shown ? m.op : "· · ·"}</span>
                {shown && <span style={{ color: C.muted, fontSize: 11, lineHeight: 1.4 }}>{m.note}</span>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={() => setStep(v => Math.min(4, v + 1))} disabled={step === 4} style={{
            flex: 2, padding: "9px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
            background: step === 4 ? C.card : C.accentGlow, color: step === 4 ? C.muted : "#fff",
            cursor: step === 4 ? "default" : "pointer",
          }}>Next clock pulse ▶ ({step} / 4)</button>
          <button onClick={() => setStep(0)} style={{
            flex: 1, padding: "9px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
            color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>↺ Reset</button>
        </div>
        {step === 4 && (
          <div style={{ marginTop: 10, fontSize: 12, color: C.green, lineHeight: 1.6 }}>
            One instruction became <strong>four microoperations</strong>. The words trick you — "add" names an action at
            <em> both</em> levels: ADD is the ISA instruction, and the final <code style={{ fontFamily: "monospace" }}>R1 ← R1 + R2</code> is the elementary step inside.
          </div>
        )}
      </div>

      <Key color={C.accent}>
        A <strong style={{ color: C.accent }}>microoperation</strong> is an operation on register data carried out in
        <strong style={{ color: C.text }}> one clock pulse</strong> (load, clear, count, shift, add). One ISA instruction =
        a <em>sequence</em> of microoperations. The rest of this unit is just: how does one such step actually move bits?
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Register Transfer Notation (anatomy click-to-reveal)
// ══════════════════════════════════════════════════════════════════
function RTLNotation() {
  const [pick, setPick] = useState(null);

  // Each symbol of RTL, revealed by clicking. Mirrors the deck's 4-symbol table.
  const parts = [
    { key: "reg", label: "R2", color: C.teal, title: "Letters = a register",
      body: "Capital letters name a register — MAR, R2, PC, IR. The whole notation is about moving words between these named boxes." },
    { key: "arrow", label: "←", color: C.accent, title: "← = transfer",
      body: "Copy the source into the destination. The SOURCE is unchanged; the DESTINATION is overwritten. It is a copy, not a move — R1 still holds its value after R2 ← R1." },
    { key: "src", label: "R1", color: C.teal, title: "The source register",
      body: "Whatever is on the right of ← is read out onto the wires. Its bits are duplicated, never erased." },
    { key: "sub", label: "(0–7)", color: C.purple, title: "( ) = part of a register",
      body: "Parentheses pick out a slice of a register — R2(0–7) is the low byte, R2(L) the low half. Useful when only some bits move." },
    { key: "comma", label: ",", color: C.yellow, title: ", = two transfers, same clock",
      body: "A comma separates transfers that happen together on the SAME clock pulse: R2 ← R1, R4 ← R3 — both moves finish in one tick." },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        We used arrows loosely in Unit 1 (<code style={{ color: C.teal, fontFamily: "monospace" }}>R2 ← [A]</code>). Now pin it
        down. The <strong style={{ color: C.text }}>whole notation is just four symbols</strong>. Click each coloured piece.
      </p>

      {/* the expression, clickable */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 16px", marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", fontSize: 26, letterSpacing: 2 }}>
          {parts.map((p) => (
            <span key={p.key} onClick={() => setPick(p.key)} style={{
              cursor: "pointer", padding: "2px 6px", margin: "0 2px", borderRadius: 6,
              background: pick === p.key ? p.color + "2A" : "transparent",
              border: `2px solid ${pick === p.key ? p.color : "transparent"}`,
              color: p.color, transition: "all 0.2s",
            }}>{p.label}</span>
          ))}
        </div>
        <div style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>
          reads: "copy the low byte of R1 into R2, and R3 into R4, on the same pulse" — tap a symbol
        </div>
      </div>

      {pick && (
        <div style={{ background: parts.find(p => p.key === pick).color + "12", border: `1px solid ${parts.find(p => p.key === pick).color}55`, borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ color: parts.find(p => p.key === pick).color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            {parts.find(p => p.key === pick).title}
          </div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{parts.find(p => p.key === pick).body}</div>
        </div>
      )}

      <Key color={C.teal}>
        Four symbols: <strong style={{ color: C.teal }}>letters</strong> = a register,
        <strong style={{ color: C.accent }}> ←</strong> = transfer (source unchanged, destination overwritten),
        <strong style={{ color: C.purple }}> ( )</strong> = part of a register,
        <strong style={{ color: C.yellow }}> ,</strong> = two transfers in one clock. That's the entire language.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The Control Function (transfer only on a signal)
//  P : R2 ← R1  — the toggle IS the lesson.
// ══════════════════════════════════════════════════════════════════
function ControlFunction() {
  const [p, setP] = useState(0);           // control signal P: 0 or 1
  const [r2, setR2] = useState("0110");    // R2's STORED state — it always holds SOMETHING
  const [flash, setFlash] = useState(false); // brief highlight when a latch happens
  const [blocked, setBlocked] = useState(false); // brief "nothing happened" hint on P=0

  const R1 = "1011";
  const latched = r2 === R1;

  // A clock edge only changes R2 when P = 1. Once latched, R2 KEEPS the value —
  // even if P later goes back to 0. The wires are always live regardless of P.
  const pulse = () => {
    if (p === 1) {
      setR2(R1);
      setFlash(true); setTimeout(() => setFlash(false), 700);
    } else {
      setBlocked(true); setTimeout(() => setBlocked(false), 600);
    }
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The notation says <em>what</em> moves — it never says <em>when</em>. The wires from R1 are
        <strong style={{ color: C.teal }}> always live</strong> (electricity is flowing the whole time). What the control
        signal decides is whether <strong style={{ color: C.text }}>R2 changes state to accept it</strong>. Written
        <code style={{ color: C.yellow, fontFamily: "monospace" }}> P : R2 ← R1</code> — R2 latches
        <strong style={{ color: C.text }}> only if P = 1</strong>. Set P, then fire the clock.
      </p>

      {/* P switch */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[0, 1].map((v) => (
          <button key={v} onClick={() => setP(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
            background: p === v ? (v === 1 ? C.green + "22" : C.red + "22") : C.card,
            border: `2px solid ${p === v ? (v === 1 ? C.green : C.red) : C.border}`,
            color: p === v ? (v === 1 ? C.green : C.red) : C.muted,
          }}>Control signal P = {v}{p === v ? (v === 1 ? " · load line OPEN" : " · load line SHUT") : ""}</button>
        ))}
      </div>

      {/* the two registers + n parallel lines (always carrying R1, always live) */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 200" style={{ width: "100%", display: "block" }}>
          {/* R1 source */}
          <rect x={20} y={70} width={110} height={50} rx={8} fill={C.card} stroke={C.teal} strokeWidth={2} />
          <text x={75} y={90} textAnchor="middle" fill={C.muted} fontSize={11}>R1 (source)</text>
          <text x={75} y={110} textAnchor="middle" fill={C.teal} fontSize={16} fontWeight="700" fontFamily="monospace">{R1}</text>
          {/* n parallel wires — ALWAYS live, with flowing charge, independent of P */}
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={130} y1={80 + i * 10} x2={390} y2={80 + i * 10} stroke={C.teal} strokeWidth={2} opacity={0.9} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <circle key={"d" + i} r={2.6} fill={C.teal}>
              <animate attributeName="cx" values="132;388" dur="1.1s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${80 + i * 10};${80 + i * 10}`} dur="1.1s" repeatCount="indefinite" />
            </circle>
          ))}
          <text x={255} y={62} textAnchor="middle" fill={C.teal} fontSize={10}>n parallel lines — always live, always carrying R1</text>
          {/* the load gate driven by P — the ONLY thing P controls */}
          <rect x={250} y={140} width={90} height={38} rx={7} fill={p === 1 ? C.green + "18" : C.red + "14"} stroke={p === 1 ? C.green : C.red} strokeWidth={2} />
          <text x={295} y={164} textAnchor="middle" fill={p === 1 ? C.green : C.red} fontSize={12} fontWeight="700">load = P = {p}</text>
          <line x1={295} y1={140} x2={295} y2={120} stroke={p === 1 ? C.green : C.red} strokeWidth={2} strokeDasharray={p === 1 ? "none" : "3 3"} />
          {/* R2 destination — holds its own state at ALL times, glows briefly on latch */}
          <rect x={390} y={70} width={110} height={50} rx={8} fill={flash ? C.green + "26" : C.card} stroke={flash ? C.green : (latched ? C.teal : C.border)} strokeWidth={flash ? 3 : 1.8} style={{ transition: "all 0.3s" }} />
          <text x={445} y={90} textAnchor="middle" fill={C.muted} fontSize={11}>R2 (dest)</text>
          <text x={445} y={110} textAnchor="middle" fill={latched ? C.teal : C.text} fontSize={16} fontWeight="700" fontFamily="monospace">{r2}</text>
          {blocked && <text x={445} y={140} textAnchor="middle" fill={C.red} fontSize={10} fontWeight="700">✕ no change (P = 0)</text>}
        </svg>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={pulse} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: C.accentGlow, color: "#fff", cursor: "pointer",
        }}>⚡ Fire clock edge</button>
        <button onClick={() => { setR2("0110"); setP(0); }} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset R2</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>
        {p === 0
          ? <span>The wires are <strong style={{ color: C.teal }}>live and carrying R1's value right now</strong> — but with P = 0 the load line is shut, so R2 <strong style={{ color: C.red }}>ignores the clock edge and keeps its current state</strong> (<code style={{ fontFamily: "monospace" }}>{r2}</code>). Fire it and nothing changes.</span>
          : latched
            ? <span>✓ The clock edge latched R1 into R2 — R2 changed state to <code style={{ fontFamily: "monospace", color: C.teal }}>{r2}</code> and now <strong style={{ color: C.green }}>maintains it</strong>. Set P = 0 and fire again: it stays put. <strong style={{ color: C.green }}>Control turned an always-live connection into a timed transfer.</strong></span>
            : <span>P = 1 — the load line is open. Fire the clock edge and watch R2 change its state to accept R1.</span>}
      </div>

      <Key color={C.yellow}>
        <code style={{ color: C.yellow, fontFamily: "monospace" }}>P : R2 ← R1</code> is a <strong style={{ color: C.text }}>control function</strong>.
        The wired connection is <strong style={{ color: C.text }}>always physically there and live</strong>; the signal
        <strong style={{ color: C.yellow }}> P</strong> decides only whether the clock edge makes R2 <em>latch and hold</em> the
        new value. Once latched, a register keeps its state until the next load.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The Common Bus (MUX select + tri-state contention gotcha)
// ══════════════════════════════════════════════════════════════════
function CommonBus() {
  const [mode, setMode] = useState("mux");   // "mux" | "tri"
  const [sel, setSel] = useState(1);          // MUX select 0..3 → which register
  const [enables, setEnables] = useState([false, true, false, false]); // tri-state enables

  const regs = [
    { name: "R1", val: "1111", color: C.teal },
    { name: "R2", val: "0101", color: C.purple },
    { name: "R3", val: "1010", color: C.orange },
    { name: "R4", val: "0011", color: C.green },
  ];

  const enabledCount = enables.filter(Boolean).length;
  const contention = mode === "tri" && enabledCount > 1;
  const busVal = mode === "mux"
    ? regs[sel].val
    : (enabledCount === 1 ? regs[enables.findIndex(Boolean)].val : (enabledCount === 0 ? "float" : "XXXX"));

  const toggleEnable = (i) => setEnables((e) => e.map((v, k) => (k === i ? !v : v)));

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        We just learned register transfers as <em>notation</em>. But how does the transfer actually happen in
        <strong style={{ color: C.text }}> hardware</strong>? We want <strong style={{ color: C.text }}>one shared path</strong>
        any register can drive — not a private wire between every pair. That's a <strong style={{ color: C.accent }}>common
        bus</strong>. On a single bus there are two ways to build it — a <strong style={{ color: C.accent }}>multiplexer</strong>
        (works, but costlier) and a <strong style={{ color: C.orange }}>tri-state buffer</strong> (cheaper). Switch between them:
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["mux", "Multiplexer bus"], ["tri", "Tri-state buffer bus"]].map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, padding: "9px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: mode === m ? C.accentGlow : C.card,
            border: `2px solid ${mode === m ? C.accent : C.border}`, color: mode === m ? "#fff" : C.muted,
          }}>{label}</button>
        ))}
      </div>

      {/* register column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {regs.map((r, i) => {
          const onBus = mode === "mux" ? sel === i : enables[i];
          return (
            <div key={r.name} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8,
              background: onBus ? r.color + "1E" : C.card,
              border: `2px solid ${onBus ? r.color : C.border}`, transition: "all 0.25s",
            }}>
              <span style={{ color: r.color, fontWeight: 700, fontFamily: "monospace", fontSize: 14, width: 30 }}>{r.name}</span>
              <span style={{ color: C.text, fontFamily: "monospace", fontSize: 14 }}>{r.val}</span>
              {mode === "mux" ? (
                <button onClick={() => setSel(i)} style={{
                  marginLeft: "auto", padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  background: sel === i ? r.color + "33" : C.surface, border: `1.5px solid ${sel === i ? r.color : C.border}`,
                  color: sel === i ? r.color : C.muted,
                }}>{sel === i ? "→ on bus" : "select"}</button>
              ) : (
                <button onClick={() => toggleEnable(i)} style={{
                  marginLeft: "auto", padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  background: enables[i] ? r.color + "33" : C.surface, border: `1.5px solid ${enables[i] ? r.color : C.border}`,
                  color: enables[i] ? r.color : C.muted,
                }}>E{i + 1} = {enables[i] ? "1 (drive)" : "0 (Hi-Z)"}</button>
              )}
            </div>
          );
        })}
      </div>

      {mode === "mux" && (
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 8, textAlign: "center" }}>
          Select lines <strong style={{ color: C.accent, fontFamily: "monospace" }}>S1S0 = {sel.toString(2).padStart(2, "0")}</strong> alone
          decide which register reaches the bus. For k registers of n bits: n multiplexers, each k×1.
        </div>
      )}

      {/* the bus readout */}
      <div style={{
        background: contention ? C.red + "14" : C.card,
        border: `2px solid ${contention ? C.red : C.accent}`, borderRadius: 10, padding: "12px 16px",
      }}>
        <div style={{ color: contention ? C.red : C.accent, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>COMMON BUS</div>
        <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 800, color: contention ? C.red : C.text }}>
          {busVal}
        </div>
        <div style={{ color: contention ? C.red : C.muted, fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
          {mode === "mux"
            ? "Exactly one source rides across — flip the select and a different value appears. No conflict is even possible."
            : contention
              ? "⚠️ BUS CONTENTION — two buffers drive the same wire at once, fighting for it → an invalid value. A decoder guarantees exactly ONE enable is ever high."
              : enabledCount === 0
                ? "No buffer enabled → the line floats (high-impedance). A buffer's third state lets many outputs share one wire while all but one stay electrically absent."
                : "One buffer drives, the rest sit in high-impedance (Hi-Z) — electrically absent. Cheaper than a MUX: no gates per source."}
        </div>
      </div>

      <Key color={C.accent}>
        A single common bus is built from <strong style={{ color: C.accent }}>multiplexers</strong> (select lines pick the
        source — flexible but more gates, so costlier) or <strong style={{ color: C.orange }}>tri-state buffers + a
        decoder</strong> (a third "Hi-Z" state lets many outputs share one wire — cheaper). Either way:
        <strong style={{ color: C.text }}> exactly one source at a time</strong>.
        <br /><br />
        <span style={{ color: C.purple }}>🧭 Coming later this unit:</span> one bus means one transfer per clock. In
        <strong style={{ color: C.text }}> Unit 2.6 — Multiple-Bus Organization</strong> we add more buses so several transfers
        happen at once.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Meet MAR & MDR: the gateway to memory (INTRODUCTION only)
//  First appearance in Module 2 — so both are spelled out in full. The
//  step-by-step fetch/store timing is deliberately left for Units 2.3/2.4.
// ══════════════════════════════════════════════════════════════════
function MemoryTransfers() {
  const [op, setOp] = useState("read");  // "read" | "write" — just to show MDR direction

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Over the bus, registers can reach each other. But programs and data live in <strong style={{ color: C.text }}>main
        memory</strong>, which sits <em>outside</em> the processor. Every access to it goes through two special registers that
        sit at the processor's edge — the <strong style={{ color: C.text }}>gateway</strong> to memory. Meet them:
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 190, background: C.orange + "12", border: `1px solid ${C.orange}44`, borderRadius: 9, padding: "10px 12px" }}>
          <div style={{ color: C.orange, fontWeight: 800, fontSize: 14 }}>MAR</div>
          <div style={{ color: C.text, fontSize: 12.5, fontWeight: 600 }}>Memory Address Register</div>
          <div style={{ color: C.muted, fontSize: 11.5, marginTop: 3, lineHeight: 1.5 }}>Holds the <strong style={{ color: C.text }}>address</strong> — <em>which</em> memory location we want.</div>
        </div>
        <div style={{ flex: 1, minWidth: 190, background: C.teal + "12", border: `1px solid ${C.teal}44`, borderRadius: 9, padding: "10px 12px" }}>
          <div style={{ color: C.teal, fontWeight: 800, fontSize: 14 }}>MDR</div>
          <div style={{ color: C.text, fontSize: 12.5, fontWeight: 600 }}>Memory Data Register</div>
          <div style={{ color: C.muted, fontSize: 11.5, marginTop: 3, lineHeight: 1.5 }}>Holds the <strong style={{ color: C.text }}>data</strong> — the word going to or coming from memory.</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[["read", "Processor reads memory"], ["write", "Processor writes memory"]].map(([m, label]) => (
          <button key={m} onClick={() => setOp(m)} style={{
            flex: 1, padding: "9px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 12,
            background: op === m ? C.accentGlow : C.card,
            border: `2px solid ${op === m ? C.accent : C.border}`, color: op === m ? "#fff" : C.muted,
          }}>{label}</button>
        ))}
      </div>

      {/* processor with MAR/MDR at its EDGE = the gateway to external memory */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 200" style={{ width: "100%", display: "block" }}>
          {/* processor body */}
          <rect x={20} y={30} width={230} height={150} rx={10} fill={C.surface} stroke={C.purple} strokeWidth={1.6} />
          <text x={95} y={50} textAnchor="middle" fill={C.purple} fontSize={11} fontWeight="700">PROCESSOR</text>
          <rect x={40} y={64} width={70} height={30} rx={6} fill={C.card} stroke={C.border} />
          <text x={75} y={83} textAnchor="middle" fill={C.muted} fontSize={10}>registers</text>
          <rect x={40} y={104} width={70} height={30} rx={6} fill={C.card} stroke={C.border} />
          <text x={75} y={123} textAnchor="middle" fill={C.muted} fontSize={10}>ALU</text>
          {/* the gateway strip at the right edge: MAR + MDR */}
          <rect x={168} y={40} width={74} height={130} rx={8} fill={C.bg} stroke={C.yellow} strokeWidth={1.4} strokeDasharray="4 3" />
          <text x={205} y={56} textAnchor="middle" fill={C.yellow} fontSize={9} fontWeight="700">gateway</text>
          <rect x={178} y={66} width={54} height={34} rx={6} fill={C.orange + "22"} stroke={C.orange} strokeWidth={1.8} />
          <text x={205} y={87} textAnchor="middle" fill={C.orange} fontSize={12} fontWeight="700">MAR</text>
          <rect x={178} y={116} width={54} height={34} rx={6} fill={C.teal + "22"} stroke={C.teal} strokeWidth={1.8} />
          <text x={205} y={137} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">MDR</text>

          {/* main memory outside */}
          <rect x={360} y={30} width={140} height={150} rx={10} fill={C.surface} stroke={C.accent} strokeWidth={1.6} />
          <text x={430} y={50} textAnchor="middle" fill={C.accent} fontSize={11} fontWeight="700">MAIN MEMORY</text>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={375} y={66 + i * 26} width={110} height={20} rx={4} fill={C.card} stroke={C.border} />
          ))}

          {/* address line: MAR → memory, always one-way */}
          <line x1={232} y1={83} x2={360} y2={83} stroke={C.orange} strokeWidth={2.5} markerEnd="url(#u21addr)" />
          <text x={296} y={75} textAnchor="middle" fill={C.orange} fontSize={9}>address (which cell)</text>
          <circle r={3} fill={C.orange}><animate attributeName="cx" values="234;358" dur="1.4s" repeatCount="indefinite" /><animate attributeName="cy" values="83;83" dur="1.4s" repeatCount="indefinite" /></circle>

          {/* data line: MDR ↔ memory, direction depends on read/write */}
          <line x1={op === "write" ? 232 : 360} y1={133} x2={op === "write" ? 360 : 232} y2={133} stroke={C.teal} strokeWidth={2.5} markerEnd="url(#u21data)" />
          <text x={296} y={155} textAnchor="middle" fill={C.teal} fontSize={9}>{op === "write" ? "data out → memory" : "data in ← memory"}</text>
          <circle r={3} fill={C.teal}>
            <animate attributeName="cx" values={op === "write" ? "234;358" : "358;234"} dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="cy" values="133;133" dur="1.4s" repeatCount="indefinite" />
          </circle>

          <defs>
            <marker id="u21addr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.orange} /></marker>
            <marker id="u21data" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.teal} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: 10 }}>
        {op === "read"
          ? <span>To <strong style={{ color: C.text }}>read</strong>, the processor puts the address in <strong style={{ color: C.orange }}>MAR</strong> and the word comes back into <strong style={{ color: C.teal }}>MDR</strong>. No register talks to memory directly — everything passes through this gateway.</span>
          : <span>To <strong style={{ color: C.text }}>write</strong>, the address goes in <strong style={{ color: C.orange }}>MAR</strong> and the data goes out from <strong style={{ color: C.teal }}>MDR</strong>. Same gateway, data flowing the other way.</span>}
      </div>

      <Key color={C.teal}>
        <strong style={{ color: C.orange }}>MAR (Memory Address Register)</strong> and <strong style={{ color: C.teal }}>MDR
        (Memory Data Register)</strong> are part of the processor, sitting at its edge as the <strong style={{ color: C.text }}>only
        gateway</strong> to main memory: address through MAR, data through MDR.
        <br /><br />
        <span style={{ color: C.purple }}>🧭 Coming later this unit:</span> exactly how a word is
        <strong style={{ color: C.text }}> fetched (Unit 2.3)</strong> and <strong style={{ color: C.text }}>stored (Unit
        2.4)</strong> — the step-by-step timing — is next. For now, just remember: every memory access goes through MAR and MDR.
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
      q: "What exactly is a microoperation?",
      options: [
        "A whole ISA instruction like ADD R1, R2",
        "An elementary operation on register data, carried out in one clock pulse",
        "A high-level program statement written by the programmer",
        "A single logic gate inside the ALU",
      ],
      answer: 1,
      explain: "A microoperation is the smallest step: load, clear, count, shift or add on register contents, done in exactly one clock pulse. One ISA instruction decomposes into a sequence of them.",
    },
    {
      q: "In the control function P : R2 ← R1, what does P do?",
      options: [
        "It is the data being copied into R2",
        "It selects which bits of R1 move",
        "It is a control signal — the transfer happens only when P = 1",
        "It is the clock frequency in Hz",
      ],
      answer: 2,
      explain: "The wires always carry R1's value, but the load line is gated by P. When P = 1 the clock edge latches R1 into R2; when P = 0 nothing moves. Control turns a permanent connection into a timed transfer.",
    },
    {
      q: "On a common bus built from tri-state buffers, what happens if TWO buffers are enabled at once?",
      options: [
        "The bus averages the two values",
        "Bus contention — two sources fight for one wire, giving an invalid value",
        "Nothing; the buffers take turns automatically",
        "The faster register wins",
      ],
      answer: 1,
      explain: "Two drivers on one wire is bus contention — an invalid result. The third (high-impedance) state lets many outputs share a wire only if exactly one is enabled, which a decoder guarantees.",
    },
    {
      q: "When the CPU writes register R1 to memory, what is the correct data path?",
      options: [
        "R1 → memory directly",
        "R1 → MAR → memory",
        "R1 → MDR, then MDR → M[MAR]",
        "R1 → bus → M[MAR] with no register in between",
      ],
      answer: 2,
      explain: "All data to and from memory passes through MDR. Write is MDR ← R1, then M[MAR] ← MDR, with the address held in MAR. R1 never reaches memory directly.",
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
          {score === 4 ? "Perfect! Every arrow in RTL is now real hardware to you — wires plus a load signal." :
            score >= 2 ? "Good work! Replay 'The Control Function' and 'Memory Transfers' to lock in the details." :
              "Revisit 'Instruction vs Microoperation' and 'The Control Function' — the whole unit builds on those two ideas."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now decompose an instruction into microoperations, read RTL symbol by symbol, explain how a control
            signal times a transfer, build a common bus two ways, and route every memory access through MAR and MDR.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.2 — Arithmetic & Logic Operations.</strong>{" "}
            So far the CPU can only <em>move</em> bits — and moving isn't computing. How do the same wires add, subtract,
            AND and shift their way into becoming an ALU?
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
export default function Unit2_1({ student, onUnitComplete }) {
  const sections = [
    { id: "micro", label: "Instruction → Micro-op" },
    { id: "rtl", label: "RTL Notation" },
    { id: "control", label: "The Control Function" },
    { id: "bus", label: "The Common Bus" },
    { id: "mem", label: "MAR & MDR Gateway" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔬 One Instruction, Many Microoperations</h3>
      <InstructionZoom />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>✍️ Register Transfer Notation</h3>
      <RTLNotation />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎛️ The Control Function — transfer only on a signal</h3>
      <ControlFunction />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🚌 The Common Bus — one shared path</h3>
      <CommonBus />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🧠 Meet MAR &amp; MDR — the gateway to memory</h3>
      <MemoryTransfers />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.1.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚙️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.1</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Register Transfers (RTL)</div>
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
