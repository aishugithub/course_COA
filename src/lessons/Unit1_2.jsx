// Unit1_2.jsx — Module 1 › Unit 1.2 — "Basic Operational Concepts"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: dead numbers in memory → the PC wakes them → meet the registers →
// watch one instruction run (flagship trace) → say it in RTN → quiz.
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
//  Section 1 — Dead Numbers (the stored program + the PC appears)
// ══════════════════════════════════════════════════════════════════
function DeadNumbers() {
  const [awake, setAwake] = useState(false);

  const rows = [
    { addr: "100", val: "Load  R2, N" },
    { addr: "104", val: "Add   R2, R3" },
    { addr: "108", val: "Store R2, SUM" },
    { addr: "112", val: "…" },
    { addr: "200", val: "data …" },
  ];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In Unit 1.1 you met the five units. Here is the strangest fact in computing: a program is just
        <strong style={{ color: C.text }}> numbers sitting in memory</strong>, each instruction parked at its own
        address — 100, 104, 108… And then it just <em>sits</em> there. Lifeless.
        So <strong style={{ color: C.text }}>who decides which instruction runs first?</strong>
      </p>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* the memory column — dim until awakened */}
        <div style={{ flex: 1, background: C.surface, border: `1.5px solid ${C.teal}${awake ? "" : "44"}`, borderRadius: 12, padding: "12px", transition: "all 0.5s" }}>
          <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, marginBottom: 8, textAlign: "center", opacity: awake ? 1 : 0.5 }}>MEMORY</div>
          {rows.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
              opacity: awake ? (i === 0 ? 1 : 0.85) : 0.4, transition: "opacity 0.5s",
            }}>
              {/* the PC's pointing hand materialises at address 100 */}
              <span style={{ width: 26, textAlign: "right", color: awake && i === 0 ? C.purple : "transparent", fontSize: 14, transition: "color 0.5s" }}>
                {i === 0 ? "👉" : ""}
              </span>
              <span style={{ width: 30, color: C.muted, fontSize: 12, fontFamily: "monospace" }}>{r.addr}</span>
              <span style={{
                flex: 1, padding: "6px 10px", borderRadius: 6, fontFamily: "monospace", fontSize: 12,
                background: awake && i === 0 ? C.purple + "1E" : C.card,
                border: `1.5px solid ${awake && i === 0 ? C.purple : C.border}`,
                color: C.teal, transition: "all 0.5s",
              }}>{r.val}</span>
            </div>
          ))}
        </div>

        {/* the "?" → PC reveal */}
        <div style={{ flex: 1 }}>
          {!awake ? (
            <button onClick={() => setAwake(true)} style={{
              width: "100%", padding: "26px 16px", borderRadius: 12, cursor: "pointer",
              background: C.purple + "14", border: `2px dashed ${C.purple}66`, color: C.purple,
            }}>
              <div style={{ fontSize: 40, fontWeight: 800 }}>?</div>
              <div style={{ fontSize: 12, marginTop: 6 }}>Something must point at the first instruction.<br />Click to reveal WHO.</div>
            </button>
          ) : (
            <div style={{ background: C.purple + "14", border: `2px solid ${C.purple}`, borderRadius: 12, padding: "16px", animation: "pcIn 0.5s ease" }}>
              <style>{`@keyframes pcIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
              <div style={{ color: C.purple, fontWeight: 800, fontSize: 18 }}>PC</div>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>the Program Counter</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.65 }}>
                A special register inside the processor that holds the <strong style={{ color: C.text }}>address of the
                NEXT instruction</strong> to fetch. Right now it holds <span style={{ color: C.purple, fontFamily: "monospace", fontWeight: 700 }}>100</span> —
                so instruction 100 runs first. After each fetch it moves to the next address.
              </div>
              <div style={{ marginTop: 10, background: C.card, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                📖 <strong style={{ color: C.text }}>Bookmark analogy:</strong> a novel doesn't read itself — a bookmark
                remembers where you are. The PC is the machine's bookmark, always parked at the line to read next.
              </div>
            </div>
          )}
        </div>
      </div>

      <Key color={C.purple}>
        The <strong style={{ color: C.purple }}>stored-program idea</strong>: the whole program lives in memory as
        numbers, and the <strong style={{ color: C.purple }}>PC</strong> gives it life by pointing at the next
        instruction to fetch. No PC → no order → no program.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Meet the Registers (flip-cards + match game)
// ══════════════════════════════════════════════════════════════════
function RegisterCards() {
  const regs = [
    { name: "PC", full: "Program Counter", color: C.purple, job: "Holds the memory address of the NEXT instruction to be fetched." },
    { name: "IR", full: "Instruction Register", color: C.purple, job: "Holds the instruction that is CURRENTLY being executed." },
    { name: "MAR", full: "Memory Address Register", color: C.accent, job: "Holds the ADDRESS of the memory location to be accessed." },
    { name: "MDR", full: "Memory Data Register", color: C.accent, job: "Holds the DATA being written to, or just read from, memory." },
    { name: "R0…Rn-1", full: "General-Purpose Registers", color: C.teal, job: "Fast store for operands taken from memory — the ALU's workbench." },
  ];

  const [flipped, setFlipped] = useState([]);
  const toggle = (i) => setFlipped((f) => f.includes(i) ? f.filter((x) => x !== i) : [...f, i]);

  // ── match game state ──
  // jobs shown in a fixed shuffled order; click a register, then its job
  const jobOrder = [2, 4, 0, 3, 1]; // indices into regs, pre-shuffled
  const [pickedReg, setPickedReg] = useState(null);
  const [matched, setMatched] = useState([]);   // reg indices already matched
  const [wrongJob, setWrongJob] = useState(null); // job index flashing red

  const pickJob = (regIdx) => {
    if (pickedReg === null || matched.includes(regIdx)) return;
    if (regIdx === pickedReg) {
      setMatched((m) => [...m, regIdx]); setPickedReg(null); setWrongJob(null);
    } else {
      setWrongJob(regIdx);
      setTimeout(() => setWrongJob(null), 700);
    }
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        The PC isn't alone — the processor keeps a small crew of special registers that run the show.
        <strong style={{ color: C.text }}> Flip all five cards</strong>: each back is an exam-ready one-liner
        (write these four PC/IR/MAR/MDR lines in the exam — 4 marks, guaranteed).
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {regs.map((r, i) => {
          const isF = flipped.includes(i);
          return (
            <div key={i} onClick={() => toggle(i)} style={{
              flex: "1 1 30%", minWidth: 150, minHeight: 108, cursor: "pointer", borderRadius: 10,
              background: isF ? r.color + "16" : C.card, border: `2px solid ${isF ? r.color : C.border}`,
              padding: "12px", transition: "all 0.3s", textAlign: "center",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              {!isF ? (
                <>
                  <div style={{ color: r.color, fontWeight: 800, fontSize: 17 }}>{r.name}</div>
                  <div style={{ color: C.text, fontSize: 11, marginTop: 4 }}>{r.full}</div>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 8 }}>tap for the one-liner</div>
                </>
              ) : (
                <div style={{ color: C.text, fontSize: 12, lineHeight: 1.55 }}>{r.job}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* the match game */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px" }}>
        <div style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
          🎯 Match game: click a register, then click its job. {matched.length} / 5 matched
        </div>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 12 }}>Wrong picks flash red — instant feedback, no penalty.</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {regs.map((r, i) => (
              <button key={i} onClick={() => !matched.includes(i) && setPickedReg(i)} disabled={matched.includes(i)} style={{
                padding: "9px 10px", borderRadius: 8, fontWeight: 800, fontSize: 13,
                background: matched.includes(i) ? C.green + "18" : pickedReg === i ? r.color + "28" : C.surface,
                border: `2px solid ${matched.includes(i) ? C.green : pickedReg === i ? r.color : C.border}`,
                color: matched.includes(i) ? C.green : r.color,
                cursor: matched.includes(i) ? "default" : "pointer", transition: "all 0.2s",
              }}>{matched.includes(i) ? "✓ " : ""}{r.name}</button>
            ))}
          </div>
          <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 6 }}>
            {jobOrder.map((ri) => (
              <button key={ri} onClick={() => pickJob(ri)} disabled={matched.includes(ri)} style={{
                padding: "9px 10px", borderRadius: 8, fontSize: 11, textAlign: "left", lineHeight: 1.5,
                background: matched.includes(ri) ? C.green + "12" : wrongJob === ri ? C.red + "22" : C.surface,
                border: `1.5px solid ${matched.includes(ri) ? C.green : wrongJob === ri ? C.red : C.border}`,
                color: matched.includes(ri) ? C.green : C.text,
                cursor: matched.includes(ri) ? "default" : "pointer", transition: "all 0.2s",
              }}>{regs[ri].job}</button>
            ))}
          </div>
        </div>
        {matched.length === 5 && (
          <div style={{ marginTop: 10, color: C.green, fontSize: 13, fontWeight: 700 }}>
            🏆 All five matched! Notice the pair: MAR + MDR are the processor's <em>gateway to memory</em> —
            every single memory access goes through them.
          </div>
        )}
      </div>

      <Key color={C.accent}>
        <strong style={{ color: C.purple }}>PC</strong> points at the next instruction,
        <strong style={{ color: C.purple }}> IR</strong> holds the current one, and
        <strong style={{ color: C.accent }}> MAR + MDR</strong> are the two-door gateway every
        address and every piece of data must pass through to reach memory.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Watch One Instruction Run (FLAGSHIP 7-step trace)
// ══════════════════════════════════════════════════════════════════
function InstructionTrace() {
  const [step, setStep] = useState(0); // 0..7

  // precomputed trace of Load R2, LOC — the Step button just moves the index
  const steps = [
    { pc: "100", ir: "", mar: "", mdr: "", r2: "", memRow: null, pkt: null, narr: "Ready. PC holds 100 — the address of our instruction 'Load R2, LOC'. Memory location LOC holds the value 25. Press Step." },
    { pc: "100", ir: "", mar: "100", mdr: "", r2: "", memRow: null, pkt: { x: 415, y: 72, v: "100" }, narr: "① PC → MAR. The instruction's address (100) is copied to the Memory Address Register — the gateway." },
    { pc: "100", ir: "", mar: "100", mdr: "", r2: "", memRow: 0, pkt: { x: 130, y: 72, v: "addr" }, narr: "② MAR → memory over the ADDRESS BUS, and Control issues a Read signal. Memory looks up address 100." },
    { pc: "100", ir: "", mar: "100", mdr: "Load R2,LOC", r2: "", memRow: 0, pkt: { x: 415, y: 152, v: "instr" }, narr: "③ Memory returns the instruction on the DATA BUS into the Memory Data Register (MDR)." },
    { pc: "104", ir: "Load R2,LOC", mar: "100", mdr: "Load R2,LOC", r2: "", memRow: null, pkt: { x: 240, y: 152, v: "instr" }, narr: "④ MDR → IR. The processor now HOLDS the instruction — and PC bumps to 104, ready for the next fetch." },
    { pc: "104", ir: "Load R2,LOC", mar: "LOC", mdr: "Load R2,LOC", r2: "", memRow: 2, pkt: { x: 415, y: 72, v: "LOC" }, narr: "⑤ DECODE: Control reads the IR — 'go read LOC'. LOC's address goes into MAR, and memory is read again." },
    { pc: "104", ir: "Load R2,LOC", mar: "LOC", mdr: "25", r2: "", memRow: 2, pkt: { x: 415, y: 152, v: "25" }, narr: "⑥ Memory returns the VALUE 25 into MDR…" },
    { pc: "104", ir: "Load R2,LOC", mar: "LOC", mdr: "25", r2: "25", memRow: null, pkt: { x: 520, y: 238, v: "25" }, narr: "⑦ …and MDR → R2. Done! R2 now holds 25. Two trips to memory: one for the INSTRUCTION, one for the DATA." },
  ];
  const s = steps[step];

  const memRows = [
    { addr: "100", val: "Load R2,LOC" },
    { addr: "104", val: "…next…" },
    { addr: "LOC", val: "25" },
  ];

  const Reg = ({ x, y, name, val, color = C.teal, wide = false }) => (
    <g>
      <rect x={x} y={y} width={wide ? 150 : 110} height={44} rx={8} fill={C.card} stroke={val ? color : C.border} strokeWidth={val ? 2.5 : 1.5} style={{ transition: "all 0.3s" }} />
      <text x={x + 10} y={y + 16} fill={C.muted} fontSize={10} fontWeight="700">{name}</text>
      <text x={x + (wide ? 75 : 55)} y={y + 34} textAnchor="middle" fill={color} fontSize={val && val.length > 6 ? 10 : 14} fontWeight="700" fontFamily="monospace">{val}</text>
    </g>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        Time to run ONE real instruction — <span style={{ fontFamily: "monospace", color: C.accent, fontWeight: 700 }}>Load R2, LOC</span> —
        "copy whatever is at memory location LOC into register R2". Step through all seven moves and
        watch the register panel: <strong style={{ color: C.text }}>every value that changes, changes for a reason</strong>.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 660 300" style={{ width: "100%", display: "block" }}>
          {/* MEMORY column */}
          <rect x={15} y={20} width={155} height={250} rx={10} fill={C.surface} stroke={C.teal} strokeWidth={1.5} />
          <text x={92} y={40} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">MEMORY</text>
          {memRows.map((r, i) => (
            <g key={i}>
              <rect x={28} y={52 + i * 44} width={130} height={36} rx={6}
                fill={s.memRow === i ? C.green + "22" : C.card}
                stroke={s.memRow === i ? C.green : C.border} strokeWidth={s.memRow === i ? 2.5 : 1}
                style={{ transition: "all 0.3s" }} />
              <text x={38} y={74 + i * 44} fill={s.memRow === i ? C.green : C.muted} fontSize={11} fontWeight="700" fontFamily="monospace">{r.addr}</text>
              <text x={150} y={74 + i * 44} textAnchor="end" fill={C.teal} fontSize={10} fontFamily="monospace">{r.val}</text>
            </g>
          ))}
          <text x={92} y={260} textAnchor="middle" fill={C.muted} fontSize={9}>…LOC is far away in memory…</text>

          {/* PROCESSOR box */}
          <rect x={200} y={20} width={445} height={250} rx={12} fill="none" stroke={C.purple} strokeWidth={1.5} />
          <text x={422} y={40} textAnchor="middle" fill={C.purple} fontSize={12} fontWeight="700">PROCESSOR</text>
          <Reg x={230} y={55} name="PC" val={s.pc} color={C.purple} />
          <Reg x={230} y={135} name="IR" val={s.ir} color={C.purple} wide />
          <Reg x={470} y={55} name="MAR" val={s.mar} color={C.accent} />
          <Reg x={470} y={135} name="MDR" val={s.mdr} color={C.accent} wide={false} />
          <Reg x={470} y={215} name="R2" val={s.r2} color={C.green} />
          <text x={422} y={210} textAnchor="middle" fill={C.muted} fontSize={10}>address bus ↔ data bus</text>

          {/* the travelling packet — glides to its target each step */}
          {s.pkt && (
            <g style={{ transition: "all 0.6s ease" }} transform={`translate(${s.pkt.x}, ${s.pkt.y})`}>
              <rect x={-26} y={-14} width={52} height={26} rx={6} fill={C.yellow} />
              <text x={0} y={5} textAnchor="middle" fill={C.bg} fontSize={11} fontWeight="800" fontFamily="monospace">{s.pkt.v}</text>
            </g>
          )}
        </svg>
      </div>

      {/* live register panel */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {[["PC", s.pc, C.purple], ["IR", s.ir, C.purple], ["MAR", s.mar, C.accent], ["MDR", s.mdr, C.accent], ["R2", s.r2, C.green]].map(([n, v, col]) => (
          <div key={n} style={{ flex: 1, minWidth: 80, background: C.card, border: `1.5px solid ${v ? col : C.border}`, borderRadius: 8, padding: "6px 8px", textAlign: "center", transition: "all 0.3s" }}>
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 700 }}>{n}</div>
            <div style={{ color: col, fontFamily: "monospace", fontSize: v && v.length > 6 ? 10 : 15, fontWeight: 700, minHeight: 20, lineHeight: "20px" }}>{v || "—"}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 46, lineHeight: 1.6, marginBottom: 12 }}>
        {s.narr}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStep(v => Math.min(7, v + 1))} disabled={step === 7} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: step === 7 ? C.card : C.accentGlow, color: step === 7 ? C.muted : "#fff",
          cursor: step === 7 ? "default" : "pointer",
        }}>Step ▶ ({step} / 7)</button>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.accent}>
        Every instruction runs in two phases: <strong style={{ color: C.text }}>Fetch &amp; Decode</strong> (steps ①–⑤:
        PC → MAR → memory → MDR → IR, PC bumps, Control decodes) then <strong style={{ color: C.text }}>Execute</strong> (steps
        ⑥–⑦: fetch the operand, deliver it). And every single memory trip went through the
        <strong style={{ color: C.accent }}> MAR/MDR gateway</strong>.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Say It in RTN (click-to-reveal + practice reads)
// ══════════════════════════════════════════════════════════════════
function RtnWidget() {
  const [revealed, setRevealed] = useState([]);
  const reveal = (i) => setRevealed((r) => r.includes(i) ? r : [...r, i]);

  const tokens = [
    { sym: "R2", color: C.green, title: "the DESTINATION", body: "The register that receives the value. The destination is always OVERWRITTEN." },
    { sym: "←", color: C.purple, title: '"is copied into"', body: "The transfer arrow. Whatever is on the right gets copied into whatever is on the left." },
    { sym: "[LOC]", color: C.teal, title: "the CONTENTS of LOC", body: "Square brackets mean 'the contents of'. [LOC] is not the address LOC — it's the value STORED there (25 in our trace). The source is left unchanged." },
  ];

  const practice = [
    {
      rtn: "R7 ← [X]",
      options: ["Copy the address X into R7", "Copy the contents of memory location X into R7", "Copy R7 into memory location X"],
      answer: 1,
      explain: "[X] = the contents of X; the arrow copies it into the destination R7. X itself is unchanged.",
    },
    {
      rtn: "MAR ← [PC]",
      options: ["The PC is erased and reset to 0", "The contents of the PC (an address) are copied into MAR", "MAR's value is copied into the PC"],
      answer: 1,
      explain: "This is fetch step ① from the trace! The address sitting in PC is copied into MAR. Destination on the LEFT, source on the RIGHT.",
    },
    {
      rtn: "R2 ← [R2] + 1",
      options: ["R2 is doubled", "R2 is compared with 1", "R2's current value plus 1 is written back into R2 — an increment"],
      answer: 2,
      explain: "Read the right side first: take R2's current contents, add 1, then copy the result back into R2. This is exactly how the PC bumps from 100 to 104: PC ← [PC] + 4.",
    },
  ];
  const [picks, setPicks] = useState([null, null, null]);
  const pick = (qi, oi) => setPicks((p) => p[qi] !== null ? p : p.map((v, i) => i === qi ? oi : v));

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        That whole seven-step animation collapses into ONE honest line of
        <strong style={{ color: C.text }}> Register Transfer Notation (RTN)</strong> — the shorthand this course
        (and the exam) uses for everything that moves. <strong style={{ color: C.text }}>Click each symbol</strong> to decode it.
      </p>

      {/* the clickable RTN line */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 16px", textAlign: "center", marginBottom: 10 }}>
        <div style={{ display: "inline-flex", gap: 14, alignItems: "center" }}>
          {tokens.map((t, i) => (
            <button key={i} onClick={() => reveal(i)} style={{
              fontFamily: "monospace", fontSize: 30, fontWeight: 800, padding: "8px 14px", borderRadius: 10,
              background: revealed.includes(i) ? t.color + "1E" : C.surface,
              border: `2px ${revealed.includes(i) ? "solid" : "dashed"} ${revealed.includes(i) ? t.color : C.border}`,
              color: revealed.includes(i) ? t.color : C.text, cursor: "pointer", transition: "all 0.25s",
            }}>{t.sym}</button>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {tokens.map((t, i) => revealed.includes(i) && (
            <div key={i} style={{ background: t.color + "12", border: `1px solid ${t.color}44`, borderRadius: 8, padding: "8px 14px", textAlign: "left", fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
              <strong style={{ color: t.color, fontFamily: "monospace" }}>{t.sym}</strong>
              <strong style={{ color: C.text }}> — {t.title}. </strong>{t.body}
            </div>
          ))}
        </div>
        {revealed.length === 3 && (
          <div style={{ marginTop: 10, fontSize: 13, color: C.yellow }}>
            So the whole line reads: <em>"copy what's in LOC into R2"</em>. Source unchanged, destination overwritten.
          </div>
        )}
      </div>

      {/* three inline practice reads */}
      <div style={{ color: C.text, fontWeight: 700, fontSize: 13, margin: "16px 0 8px" }}>📝 Now YOU read three RTN lines:</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {practice.map((p, qi) => (
          <div key={qi} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 17, fontWeight: 800, color: C.accent, marginBottom: 8 }}>{p.rtn}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {p.options.map((opt, oi) => {
                let border = C.border, col = C.text, bg = C.surface;
                if (picks[qi] !== null) {
                  if (oi === p.answer) { border = C.green; col = C.green; bg = C.green + "14"; }
                  else if (oi === picks[qi]) { border = C.red; col = C.red; bg = C.red + "14"; }
                }
                return (
                  <button key={oi} onClick={() => pick(qi, oi)} style={{
                    textAlign: "left", padding: "8px 12px", borderRadius: 7, fontSize: 12,
                    background: bg, border: `1.5px solid ${border}`, color: col,
                    cursor: picks[qi] !== null ? "default" : "pointer", transition: "all 0.2s",
                  }}>{opt}</button>
                );
              })}
            </div>
            {picks[qi] !== null && (
              <div style={{ marginTop: 8, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>💡 {p.explain}</div>
            )}
          </div>
        ))}
      </div>

      <Key color={C.teal}>
        <strong style={{ color: C.teal, fontFamily: "monospace" }}>[ ]</strong> = "contents of",
        <strong style={{ color: C.purple, fontFamily: "monospace" }}> ←</strong> = "is copied into".
        Rule: the <strong style={{ color: C.text }}>source is unchanged</strong>, the
        <strong style={{ color: C.text }}> destination is overwritten</strong>. One line of RTN = a whole datapath dance.
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
      q: "What is the difference between the PC and the IR?",
      options: [
        "PC holds the current instruction; IR holds the next one's address",
        "PC holds the address of the NEXT instruction; IR holds the instruction CURRENTLY executing",
        "They are two names for the same register",
        "PC holds data; IR holds addresses",
      ],
      answer: 1,
      explain: "PC = Program Counter = the ADDRESS of the next instruction to fetch. IR = Instruction Register = the instruction currently being executed. Next vs current — that's the whole difference.",
    },
    {
      q: "Why are MAR and MDR called the processor's 'gateway to memory'?",
      options: [
        "They are the only registers big enough to hold a word",
        "Every memory access must pass through them: MAR carries the address, MDR carries the data",
        "They physically sit inside the memory unit",
        "They store the whole program while it runs",
      ],
      answer: 1,
      explain: "Every single memory access — instruction fetch or data read/write — sends its ADDRESS out via MAR and its DATA in/out via MDR. No other path exists.",
    },
    {
      q: "Put the FETCH phase in the correct order:",
      options: [
        "PC → MAR → memory Read → MDR → IR, then PC increments",
        "IR → MDR → memory Read → MAR → PC, then PC increments",
        "PC → MDR → memory Read → MAR → IR, then PC increments",
        "MAR → PC → memory Read → IR → MDR, then PC increments",
      ],
      answer: 0,
      explain: "The address flows PC → MAR → memory; the instruction flows back memory → MDR → IR; then the PC bumps to the next address. Address out one door, data in the other.",
    },
    {
      q: "What does the RTN line  R2 ← [LOC]  mean?",
      options: [
        "The address LOC is stored into R2",
        "R2's value is copied into memory location LOC",
        "The CONTENTS of memory location LOC are copied into R2; LOC is unchanged",
        "R2 and LOC swap their values",
      ],
      answer: 2,
      explain: "[LOC] means 'the contents of LOC', and ← copies right into left. The source (LOC) keeps its value; the destination (R2) is overwritten.",
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
          {score === 4 ? "Perfect! The fetch–decode–execute cycle is yours now." :
            score >= 2 ? "Good work! Re-run 'Watch One Instruction Run' — step slowly and watch WHICH register changes at each step." :
              "Revisit 'Meet the Registers' and the 7-step trace — match each register to its job first, then step the trace again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 1.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            The PC points, the IR holds, the ALU acts — you watched a lifeless list of numbers become a
            living process, one fetch–decode–execute at a time, and you can write it all in RTN.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 1.3 — Bus Structures.</strong>{" "}
            Five units must swap data constantly. Do we run a private wire between every pair —
            or one shared highway they take turns on?
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
export default function Unit1_2({ student, onUnitComplete }) {
  const sections = [
    { id: "dead", label: "Dead Numbers" },
    { id: "regs", label: "Meet the Registers" },
    { id: "trace", label: "Watch It Run" },
    { id: "rtn", label: "Say It in RTN" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>💀 Dead Numbers — how does a program come alive?</h3>
      <DeadNumbers />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗂️ Meet the Registers — the crew that runs the show</h3>
      <RegisterCards />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎬 Watch One Instruction Run — Load R2, LOC</h3>
      <InstructionTrace />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>✍️ Say It in RTN — one line for the whole dance</h3>
      <RtnWidget />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 1.2.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🫀</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Basic Operational Concepts</div>
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
