// Unit3_3.jsx — Module 3 › Unit 3.3 — "Data Hazards"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Hamacher §6.3-6.5, Figs 6.3-6.5, 6.6, 6.8, Example 6.1 (Fig 6.15) —
// class notes ch.3 (§3.1-3.6), including the two .explain call-outs Aishu
// specifically asked to be resolved and echoed: (1) RAW names the WRITE-then-
// READ dependency order, the hazard is the pipeline letting the read jump
// ahead of it; (2) Fig 6.3's "3-cycle stall" = the held Decode cycle (3) +
// the 2 bubble cycles drawn (4,5) — 2 bubbles is the extra delay, 3 cycles
// is the total time stalled. AVPS's own ex1_hamacherRAW example agrees
// exactly (stallBefore: 3); it only ever shows up to 2 bubble cards on
// screen at once because of how its animation ripples forward one stage
// per cycle — not a data disagreement.
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

function StageRow({ label, stages, current }) {
  // stages: array of {cyc, txt, kind} kind in F/D/C/M/W/bubble/idle
  const kindColor = { F: C.accent, D: C.teal, C: C.orange, M: C.purple, W: C.green, bubble: C.red, idle: C.border };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <div style={{ width: 118, fontSize: 12, color: C.muted, fontFamily: "monospace", flexShrink: 0 }}>{label}</div>
      {stages.map((s, i) => {
        const active = i === current;
        const past = i < current;
        return (
          <div key={i} style={{
            flex: 1, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10.5, fontWeight: 800, minWidth: 30,
            background: s.kind === "idle" ? "transparent" : (kindColor[s.kind] + (active ? "44" : past ? "22" : "18")),
            color: s.kind === "idle" ? "transparent" : kindColor[s.kind],
            border: s.kind === "idle" ? "1px dashed " + C.border : `1.5px solid ${kindColor[s.kind]}${active ? "" : "88"}`,
            opacity: s.kind === "idle" ? 0.3 : 1,
          }}>{s.txt}</div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Why? Independent vs dependent instructions
// ══════════════════════════════════════════════════════════════════
function WhyItMatters() {
  const [dependent, setDependent] = useState(true);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Unit 3.2's speedup assumed every instruction is independent. Real code isn't always so polite. Compare:
        <span style={{ fontFamily: "monospace", color: C.text }}> Add R2,R3,#100</span> then
        <span style={{ fontFamily: "monospace", color: C.text }}> Subtract R9,R2,#30</span> — toggle the dependency off and on.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setDependent(false)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: !dependent ? C.green + "22" : C.card, border: `2px solid ${!dependent ? C.green : C.border}`, color: !dependent ? C.green : C.muted,
        }}>✅ Independent (Subtract uses R2, R5)</button>
        <button onClick={() => setDependent(true)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
          background: dependent ? C.red + "22" : C.card, border: `2px solid ${dependent ? C.red : C.border}`, color: dependent ? C.red : C.muted,
        }}>❌ Dependent (Subtract uses R2, R9)</button>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
        <pre style={{ fontFamily: "monospace", fontSize: 13, color: C.text, margin: 0, lineHeight: 1.8 }}>
{`Add       R2, R3, #100      ; produces R2`}
{"\n"}{dependent
  ? <span style={{ color: C.red }}>{`Subtract  R9, R2, #30       ; consumes R2 !`}</span>
  : <span style={{ color: C.green }}>{`Subtract  R9, R5, #30       ; doesn't need R2`}</span>}
        </pre>
      </div>

      <div style={{ marginTop: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text }}>
        {dependent
          ? <span>R2 is <strong style={{ color: C.red }}>produced</strong> by the Add and <strong style={{ color: C.red }}>consumed</strong> by the Subtract — a <em>data dependency</em>. The pipeline must make sure the Subtract reads the correct, final value of R2.</span>
          : <span>Nothing the Subtract reads was written by the Add — they can flow through the pipeline fully overlapped, exactly like Unit 3.2's ideal case.</span>}
      </div>

      <Key color={dependent ? C.red : C.green}>
        Any condition that forces the pipeline to wait is a <strong style={{ color: C.text }}>hazard</strong>. A dependency like this
        one is a <strong style={{ color: C.text }}>data hazard</strong> — specifically, because a later instruction depends on an
        earlier instruction's result, it's called a <strong style={{ color: C.text }}>RAW (Read-After-Write) hazard</strong>.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy: why "RAW" when the bug is reading too early?
// ══════════════════════════════════════════════════════════════════
function RawNaming() {
  const [reveal, setReveal] = useState(null); // "name" | "hazard" | null

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        This confuses almost everyone the first time: the Add writes R2 in cycle 5 (Write), but the Subtract's Decode reads R2 in
        cycle 3 — a <em>read-before-write</em> in time. So why is it called <strong style={{ color: C.text }}>RAW — Read AFTER Write</strong>?
        Click each card.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <button onClick={() => setReveal(reveal === "name" ? null : "name")} style={{
          textAlign: "left", padding: 14, borderRadius: 10, cursor: "pointer",
          background: reveal === "name" ? C.accent + "18" : C.card, border: `1.5px solid ${reveal === "name" ? C.accent : C.border}`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 13 }}>What "RAW" names</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>tap to reveal</div>
        </button>
        <button onClick={() => setReveal(reveal === "hazard" ? null : "hazard")} style={{
          textAlign: "left", padding: 14, borderRadius: 10, cursor: "pointer",
          background: reveal === "hazard" ? C.red + "18" : C.card, border: `1.5px solid ${reveal === "hazard" ? C.red : C.border}`,
        }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 13 }}>What the hazard actually is</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>tap to reveal</div>
        </button>
      </div>

      {reveal === "name" && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.text, lineHeight: 1.7, marginBottom: 12 }}>
          RAW names the <strong>dependency</strong>, not the malfunction. In correct <em>program order</em>, the Write must happen,
          then the Read happens <em>after</em> it — that's simply what "R2 is produced by the Add and consumed by the Subtract"
          means. The name describes the order that <em>should</em> hold: Write, then Read.
        </div>
      )}
      {reveal === "hazard" && (
        <div style={{ background: C.card, border: `1px solid ${C.red}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.text, lineHeight: 1.7, marginBottom: 12 }}>
          The hazard is that <strong>pipelining breaks this order</strong> — the Subtract's Decode tries to read R2 <em>before</em>
          the Add's Write has actually happened. It's a premature read, violating the Write-then-Read order the name is built on.
        </div>
      )}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.muted, lineHeight: 1.6, fontFamily: "monospace" }}>
        program order:  Write R2  →  Read R2   (this is what "RAW" is named after)
        {"\n"}pipeline reality: Read R2  jumps ahead of  →  Write R2   (this is the hazard)
      </div>

      <Key color={C.purple}>
        The same logic gives <strong style={{ color: C.text }}>WAR (Write-After-Read)</strong> and
        <strong style={{ color: C.text }}> WAW (Write-After-Write)</strong> hazards elsewhere in the course — each is named for the
        program-order pair it protects, not for which event the pipeline lets slip out of order.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace: the 3-cycle stall vs the 2 bubbles (Fig 6.3)
// ══════════════════════════════════════════════════════════════════
function StallTrace() {
  const [i, setI] = useState(0);
  // Add: F D C M W  at cycles 1 2 3 4 5
  // Sub: F D(held,3) bubble(4) bubble(5) C(6) M(7) W(8)
  const addStages = ["F", "D", "C", "M", "W"];
  const subTimeline = [
    { cyc: 1, note: 'Cycle 1 — Add is fetched.' },
    { cyc: 2, note: 'Cycle 2 — Add decodes; Subtract is fetched right behind it.' },
    { cyc: 3, note: 'Cycle 3 — Add computes (produces R2 at the end of this cycle). Subtract enters Decode — its NORMAL decode cycle, not extra time yet.' },
    { cyc: 4, note: "Cycle 4 — R2 still isn't written. Subtract is HELD in Decode — bubble #1 injected downstream." },
    { cyc: 5, note: 'Cycle 5 — Add writes R2. Subtract is STILL held — bubble #2 injected.' },
    { cyc: 6, note: 'Cycle 6 — R2 is finally safely written. Subtract moves into Compute and reads R2 correctly.' },
  ];
  const s = subTimeline[i];

  const subKindAt = (cyc) => {
    if (cyc < 2) return "idle";
    if (cyc === 2) return "F";
    if (cyc === 3) return "D";       // held here, but this IS its real decode slot
    if (cyc === 4 || cyc === 5) return "bubble";
    if (cyc === 6) return "C";
    return "idle";
  };

  const cycles = [1, 2, 3, 4, 5, 6];
  const visibleUpTo = s.cyc;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        This is Figure 6.3, cycle by cycle. Watch closely at cycles 3, 4 and 5 — this is exactly the question Aishu flagged: the
        diagram shows only <strong style={{ color: C.text }}>two</strong> bubble cells, yet the text calls it a
        <strong style={{ color: C.text }}> 3-cycle stall</strong>.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 6, marginLeft: 124 }}>
          {cycles.map((c) => (
            <div key={c} style={{ flex: 1, textAlign: "center", fontSize: 10, color: c <= visibleUpTo ? C.text : C.border }}>{c}</div>
          ))}
        </div>
        <StageRow label="Add" stages={cycles.map((c) => c <= visibleUpTo ? { kind: addStages[c - 1] || "idle", txt: addStages[c - 1] || "" } : { kind: "idle", txt: "" })} current={visibleUpTo - 1} />
        <StageRow label="Subtract" stages={cycles.map((c) => c <= visibleUpTo ? { kind: subKindAt(c), txt: subKindAt(c) === "bubble" ? "bub" : subKindAt(c) } : { kind: "idle", txt: "" })} current={visibleUpTo - 1} />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 50, lineHeight: 1.6, marginBottom: 10 }}>
        {s.note}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} style={{
          flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, color: C.muted,
          cursor: i === 0 ? "default" : "pointer", fontWeight: 700, fontSize: 13, opacity: i === 0 ? 0.5 : 1,
        }}>↺ Back</button>
        <button onClick={() => setI((v) => Math.min(subTimeline.length - 1, v + 1))} disabled={i === subTimeline.length - 1} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", background: C.accentGlow, color: "#fff",
          cursor: i === subTimeline.length - 1 ? "default" : "pointer", fontWeight: 700, fontSize: 13, opacity: i === subTimeline.length - 1 ? 0.5 : 1,
        }}>Step ▶ ({i + 1} / {subTimeline.length})</button>
      </div>

      <div style={{ background: C.purple + "18", border: `1px solid ${C.purple}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
        <strong style={{ color: C.purple }}>Resolving the "2 bubbles vs 3 cycles" question:</strong> cycle 3 was already going to be
        Subtract's normal Decode cycle — it isn't "extra" time. Cycles 4 and 5 are the two <em>additional</em> idle cycles forced in
        because R2 isn't ready — those are the two bubbles you see drawn. Add cycle 3 (held) + cycle 4 (bubble) + cycle 5 (bubble)
        = Subtract is stuck in Decode for a <strong style={{ color: C.text }}>total of 3 cycles</strong> before moving to Compute in
        cycle 6. So: <strong>2 bubbles</strong> = the extra delay injected; <strong>3 cycles</strong> = the full time spent stalled.
        AVPS's own matching example agrees exactly — it stalls for 3 cycles too — but because its animation advances one stage per
        cycle, you'll only ever see up to two bubble cards on screen together at once. That's the animation, not a disagreement.
      </div>

      <Key color={C.red}>
        Each idle cycle inserted is called a <strong style={{ color: C.text }}>bubble</strong>; every instruction behind the stalled
        one is delayed too — the same domino effect you saw with a cache miss in Unit 3.1.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Broken Toggle: stall vs forward vs NOP, side by side
// ══════════════════════════════════════════════════════════════════
function CuresComparison() {
  const [cure, setCure] = useState("stall");

  const data = {
    stall: {
      title: "Stall (hardware holds the pipeline)",
      cycles: 8, extra: 3, color: C.red,
      desc: "The Decode stage simply refuses to move Subtract forward until R2 is safely written — 3 cycles lost, as you just traced.",
    },
    forward: {
      title: "Operand forwarding (hardware routes the value directly)",
      cycles: 6, extra: 0, color: C.green,
      desc: "The Add's ALU produces R2 at the end of cycle 3, captured in register RZ. A wire (via MuxA/MuxB, Fig 6.5) routes RZ straight to the ALU input where Subtract needs it in cycle 4 — no stall at all.",
    },
    nop: {
      title: "NOP insertion (software fix)",
      cycles: 8, extra: 3, color: C.orange,
      desc: "The compiler inserts 3 explicit NOP instructions between Add and Subtract. Same 3 cycles lost as stalling, but now visible in the code — and wasted, unless...",
    },
    reorder: {
      title: "Instruction scheduling (smarter software fix)",
      cycles: 8, extra: 3, color: C.teal,
      desc: "...the compiler reorders 3 independent, useful instructions into those same slots instead of NOPs. Same 3 cycles pass, but real work gets done during them — instruction scheduling.",
    },
  };
  const d = data[cure];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Four ways to deal with the same RAW hazard. Toggle between them and compare.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {Object.keys(data).map((k) => (
          <button key={k} onClick={() => setCure(k)} style={{
            flex: "1 1 45%", padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
            background: cure === k ? data[k].color + "22" : C.card, border: `1.5px solid ${cure === k ? data[k].color : C.border}`,
            color: cure === k ? data[k].color : C.muted,
          }}>{data[k].title.split(" (")[0]}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${d.color}44`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <div style={{ color: d.color, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{d.title}</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>{d.desc}</div>
        <div style={{ display: "flex", gap: 20 }}>
          <div><span style={{ fontSize: 11, color: C.muted }}>total cycles: </span><strong style={{ color: C.text }}>{d.cycles}</strong></div>
          <div><span style={{ fontSize: 11, color: C.muted }}>stall cycles: </span><strong style={{ color: d.extra === 0 ? C.green : C.red }}>{d.extra}</strong></div>
        </div>
      </div>

      {cure === "nop" && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
          <pre style={{ fontFamily: "monospace", fontSize: 12, color: C.text, margin: 0, lineHeight: 1.8 }}>
{`Add       R2, R3, #100
NOP
NOP
NOP
Subtract  R9, R2, #30`}
          </pre>
        </div>
      )}

      <Key color={C.accent}>
        In hardware, real processors prefer <strong style={{ color: C.text }}>forwarding</strong> — it's free once built. NOP/reorder
        matter for simpler pipelines without forwarding hardware, or when forwarding still can't fully close the gap (next: the
        load-use case).
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Gotcha: the load-use hazard (forwarding's one limit)
// ══════════════════════════════════════════════════════════════════
function LoadUseHazard() {
  const [showFix, setShowFix] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Forwarding solved the Add→Subtract case with zero stalls. Does it always? Try <span style={{ fontFamily: "monospace", color: C.text }}>Load R2,(R3)</span> then
        <span style={{ fontFamily: "monospace", color: C.text }}> Subtract R9,R2</span> immediately after.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
        <pre style={{ fontFamily: "monospace", fontSize: 13, color: C.text, margin: 0, lineHeight: 1.8 }}>
{`Load      R2, (R3)      ; R2 arrives during the MEMORY stage, not Compute`}
{"\n"}{`Subtract  R9, R2, #30   ; needs R2 immediately`}
        </pre>
      </div>

      <button onClick={() => setShowFix(!showFix)} style={{
        width: "100%", padding: "10px", borderRadius: 8, border: `1.5px solid ${C.orange}`, background: showFix ? C.orange + "18" : C.card,
        color: C.orange, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 12,
      }}>{showFix ? "◀ Hide explanation" : "▶ Why can't forwarding fully save this one?"}</button>

      {showFix && (
        <div style={{ background: C.card, border: `1px solid ${C.orange}44`, borderRadius: 8, padding: "14px 16px", fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          A Load reads its data in the <strong>Memory</strong> stage — one stage <em>later</em> than the ALU (Compute) where Add's
          result was ready. Subtract needs R2 in Compute, but Load doesn't have it until Memory — forwarding can't deliver a value
          that doesn't exist yet. So even with forwarding hardware, a directly-following dependent instruction needs
          <strong style={{ color: C.red }}> one unavoidable stall</strong>. After that single bubble, the value (now sitting in
          register RY) <em>is</em> forwarded normally.
        </div>
      )}

      <div style={{ marginTop: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px" }}>
        <StageRow label="Load R2,(R3)" stages={["F", "D", "C", "M", "W"].map((k) => ({ kind: k, txt: k }))} current={-1} />
        <StageRow label="Subtract R9,R2" stages={[
          { kind: "F", txt: "F" }, { kind: "D", txt: "D" }, { kind: "bubble", txt: "bub" }, { kind: "C", txt: "C" }, { kind: "M", txt: "M" },
        ]} current={-1} />
      </div>

      <Key color={C.orange}>
        A compiler can hide this one stall the same way it hid the 3-cycle case — by moving an independent instruction between the
        Load and its user, so the CPU does useful work during the unavoidable cycle instead of nothing.
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
      q: "Add R2,R3,#100 writes R2 in cycle 5. Subtract R9,R2,#30 tries to read R2 in cycle 3 (before it's written). Why is this called a RAW hazard, not a \"read-before-write\" hazard?",
      options: [
        "RAW is just a typo for \"read-before-write\"",
        "RAW names the correct PROGRAM ORDER (Write must happen, then Read happens after it) — the hazard is that the pipeline lets the Read jump ahead of that order",
        "RAW only applies to memory, not registers",
        "It should actually be called WAR",
      ],
      answer: 1,
      explain: "RAW names the dependency's correct order — Write, then Read after it. The hazard is that pipelining breaks this order by reading too early. The name describes what SHOULD happen, not the bug.",
    },
    {
      q: "Figure 6.3 shows only 2 bubble cells for the Add→Subtract example, but the text calls it a 3-cycle stall. Why aren't these numbers contradictory?",
      options: [
        "The diagram has an error",
        "Cycle 3 was already Subtract's normal Decode cycle (not extra); cycles 4 and 5 are the two EXTRA bubble cycles — held(3) + bubble(4) + bubble(5) = 3 total cycles stalled",
        "AVPS and the textbook disagree",
        "3-cycle stall means 3 bubbles were drawn but 2 were cut off",
      ],
      answer: 1,
      explain: "2 bubbles = the extra delay injected (cycles 4, 5). 3 cycles = the FULL time Subtract spends stuck in Decode, including its own normal decode cycle (3). Both numbers describe the same event from different counting angles — and AVPS's matching example agrees exactly, showing at most 2 bubble cards at once purely due to its cycle-by-cycle animation.",
    },
    {
      q: "Why does operand forwarding eliminate the stall for Add→Subtract but NOT fully eliminate it for Load→Subtract?",
      options: [
        "Forwarding never works for Loads",
        "A Load's data becomes available in the MEMORY stage, one stage later than an ALU result (available at Compute) — so a directly-following dependent instruction still needs one unavoidable stall before the value can be forwarded",
        "Loads don't use registers",
        "Add and Subtract can never be forwarded either",
      ],
      answer: 1,
      explain: "Add's result exists after Compute (in RZ), in time to forward to the very next instruction's Compute stage. A Load's result only exists after Memory — one stage too late for a directly-following instruction, forcing exactly one stall even with forwarding hardware present.",
    },
    {
      q: "What's the key difference between NOP insertion and instruction scheduling as software fixes for a data hazard?",
      options: [
        "They cost different numbers of cycles",
        "Both stall for the same number of cycles, but scheduling fills those cycles with independent, USEFUL instructions instead of doing nothing",
        "NOP insertion is a hardware technique",
        "Scheduling eliminates the hazard entirely with zero cycles lost",
      ],
      answer: 1,
      explain: "Both approaches use the same number of cycles as a hardware stall would. NOPs waste those cycles outright; instruction scheduling reorders genuinely independent instructions into the same slots so real work gets done — same cost, better use of the cost.",
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
          {score === 4 ? "Perfect! RAW naming, the 3-cycle/2-bubble distinction, forwarding, and load-use are all locked in." :
            score >= 2 ? "Good work! Replay 'Trace the Stall' and 'The Load-Use Gotcha' to lock in the tricky parts." :
              "Revisit the RAW Naming card-flip and the stall trace — those two ideas unlock everything else here."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 3.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now explain RAW naming precisely, resolve the "3-cycle stall vs 2 bubbles" question, and compare stalling,
            forwarding, and software scheduling as hazard cures.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 3.4 — Instruction Hazards.</strong> Data wasn't the only thing that
            could hold up the pipeline — branches can too, and for a very different reason.
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
export default function Unit3_3({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Why It Matters" },
    { id: "naming", label: "RAW Naming" },
    { id: "trace", label: "Trace the Stall" },
    { id: "cures", label: "Compare the Cures" },
    { id: "loaduse", label: "Load-Use Gotcha" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⏳ Why It Matters — independent vs dependent instructions</h3><WhyItMatters /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🏷️ RAW Naming — dependency vs hazard</h3><RawNaming /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>🔍 Trace the Stall — Figure 6.3, cycle by cycle</h3><StallTrace /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⚖️ Compare the Cures — stall, forward, NOP, reorder</h3><CuresComparison /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>⚠️ The Load-Use Gotcha — forwarding's one limit</h3><LoadUseHazard /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 3.3.</p>
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
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
