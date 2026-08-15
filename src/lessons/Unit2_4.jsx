// Unit2_4.jsx — Module 2 › Unit 2.4 — "Storing a Word in Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapter 3 (Execution of Complete Instructions,
// Hamacher §5.1–5.3) — the single-bus store micro-sequence.
// Arc: why store (the other direction) → read vs write on one MAR/MDR gateway →
// the store sequence step-by-step (MAR←addr, MDR←R, Write, wait MFC) → the
// order gotcha (Write too early corrupts memory) → quiz.
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
//  Section 1 — The Need: results must travel back OUT to memory
// ══════════════════════════════════════════════════════════════════
function TheNeed() {
  const [dir, setDir] = useState("out"); // "in" (load) | "out" (store)
  const isStore = dir === "out";
  const col = isStore ? C.green : C.orange;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Unit 2.3 pulled a word <strong style={{ color: C.orange }}>into</strong> the CPU. But a program that only reads is
        useless — the answer <code style={{ color: C.teal, fontFamily: "monospace" }}>C = A + B</code> is computed in a register,
        and it must be written back <strong style={{ color: C.text }}>out</strong> to memory so it survives. That is
        <strong style={{ color: C.green }}> Store</strong>. Watch the data flow through <strong style={{ color: C.yellow }}>MDR</strong>.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["out", "Store — R4 → memory", C.green], ["in", "Load — memory → R4", C.orange]].map(([k, label, c]) => (
          <button key={k} onClick={() => setDir(k)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: dir === k ? c + "22" : C.card,
            border: `2px solid ${dir === k ? c : C.border}`, color: dir === k ? c : C.muted,
          }}>{label}</button>
        ))}
      </div>

      {/* R4 — MDR — Memory, with FLOWING arrows showing the two hops */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 150" style={{ width: "100%", display: "block" }} key={dir}>
          {/* R4 */}
          <rect x={20} y={54} width={110} height={46} rx={8} fill={C.teal + "14"} stroke={C.teal} strokeWidth={1.8} />
          <text x={75} y={74} textAnchor="middle" fill={C.teal} fontSize={12} fontWeight="700">Register R4</text>
          <text x={75} y={91} textAnchor="middle" fill={C.text} fontSize={12} fontFamily="monospace">8</text>
          {/* MDR (the gateway) */}
          <rect x={205} y={54} width={110} height={46} rx={8} fill={C.yellow + "14"} stroke={C.yellow} strokeWidth={1.8} />
          <text x={260} y={74} textAnchor="middle" fill={C.yellow} fontSize={12} fontWeight="700">MDR</text>
          <text x={260} y={91} textAnchor="middle" fill={C.muted} fontSize={9}>the gateway</text>
          {/* Memory */}
          <rect x={390} y={54} width={110} height={46} rx={8} fill={C.red + "14"} stroke={C.red} strokeWidth={1.8} />
          <text x={445} y={74} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="700">Memory</text>
          <text x={445} y={91} textAnchor="middle" fill={C.muted} fontSize={9}>location C</text>

          {/* hop 1 + hop 2, direction depends on store/load, with flowing packets */}
          {isStore ? (
            <>
              <line x1={130} y1={77} x2={205} y2={77} stroke={C.green} strokeWidth={3} markerEnd="url(#u24flow)" />
              <line x1={315} y1={77} x2={390} y2={77} stroke={C.green} strokeWidth={3} markerEnd="url(#u24flow)" />
              <circle r={5} fill={C.green}><animate attributeName="cx" values="132;203" dur="1.6s" repeatCount="indefinite" /><animate attributeName="cy" values="77;77" dur="1.6s" repeatCount="indefinite" /></circle>
              <circle r={5} fill={C.green}><animate attributeName="cx" values="317;388" dur="1.6s" begin="0.8s" repeatCount="indefinite" /><animate attributeName="cy" values="77;77" dur="1.6s" begin="0.8s" repeatCount="indefinite" /></circle>
              <text x={167} y={44} textAnchor="middle" fill={C.green} fontSize={9} fontWeight="700">① R4 → MDR</text>
              <text x={352} y={44} textAnchor="middle" fill={C.green} fontSize={9} fontWeight="700">② MDR → memory</text>
            </>
          ) : (
            <>
              <line x1={390} y1={77} x2={315} y2={77} stroke={C.orange} strokeWidth={3} markerEnd="url(#u24flow2)" />
              <line x1={205} y1={77} x2={130} y2={77} stroke={C.orange} strokeWidth={3} markerEnd="url(#u24flow2)" />
              <circle r={5} fill={C.orange}><animate attributeName="cx" values="388;317" dur="1.6s" repeatCount="indefinite" /><animate attributeName="cy" values="77;77" dur="1.6s" repeatCount="indefinite" /></circle>
              <circle r={5} fill={C.orange}><animate attributeName="cx" values="203;132" dur="1.6s" begin="0.8s" repeatCount="indefinite" /><animate attributeName="cy" values="77;77" dur="1.6s" begin="0.8s" repeatCount="indefinite" /></circle>
              <text x={352} y={44} textAnchor="middle" fill={C.orange} fontSize={9} fontWeight="700">① memory → MDR</text>
              <text x={167} y={44} textAnchor="middle" fill={C.orange} fontSize={9} fontWeight="700">② MDR → R4</text>
            </>
          )}

          <text x={260} y={128} textAnchor="middle" fill={col} fontSize={11} fontWeight="700">
            {isStore ? "Store:  R4 → MDR → memory" : "Load:  memory → MDR → R4"}
          </text>
          <defs>
            <marker id="u24flow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.green} /></marker>
            <marker id="u24flow2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.orange} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>
        {isStore
          ? <span>Store flows <strong style={{ color: C.green }}>R4 → MDR → memory</strong>: the register's value hops into MDR first, then MDR drives it out to memory. R4 never reaches memory directly.</span>
          : <span>Load is the mirror: <strong style={{ color: C.orange }}>memory → MDR → R4</strong>. Same gateway, arrows reversed — this was Unit 2.3.</span>}
      </div>

      <Key color={C.green}>
        <strong style={{ color: C.green }}>Store</strong> sends a computed result back out to memory so it persists. Whether
        loading or storing, the data always passes <strong style={{ color: C.yellow }}>through MDR</strong> and the address
        through MAR — only the <strong style={{ color: C.text }}>direction of the arrows</strong> flips.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 (was §3) — The store, driven by the control unit (full animation)
//  Store R4, C on the single-bus datapath. Control fires address→MAR,
//  R4out/MDRin, then Write; the three external buses carry address + data out
//  and Write/MFC on control. RTL per step. Mirrors the Unit 2.3 fetch animation.
// ══════════════════════════════════════════════════════════════════
function StoreSequence() {
  const [step, setStep] = useState(0);

  // bus: "int-addr-mar" | "int-r4-mdr" | "out" (addr+data out) | null
  const steps = [
    { beat: "—", rtl: "—", sig: [], bus: null, waiting: false, write: false, mfc: false,
      r4: "8", mar: "—", mdr: "—", mem: "?",
      narr: "Ready. R4 holds the result 8. We must store it into memory location C (address 200)." },
    { beat: "T1", rtl: "MAR ← C", sig: ["MARin"], bus: "int-addr-mar", waiting: false, write: false, mfc: false,
      r4: "8", mar: "200", mdr: "—", mem: "?",
      narr: "Control loads MAR with the destination address C (200), taken from the instruction. Memory now knows WHERE we intend to write." },
    { beat: "T2", rtl: "MDR ← [R4]", sig: ["R4out", "MDRin"], bus: "int-r4-mdr", waiting: false, write: false, mfc: false,
      r4: "8", mar: "200", mdr: "8", mem: "?",
      narr: "Control fires R4out and MDRin: the data (8) rides the internal bus from R4 into MDR. Only MDR can drive memory, so the value must sit here first." },
    { beat: "T3", rtl: "Write;  M[MAR] ← [MDR]", sig: ["Write"], bus: "out", waiting: false, write: true, mfc: false,
      r4: "8", mar: "200", mdr: "8", mem: "?",
      narr: "With both MAR and MDR loaded, control raises Write. The address (200) goes out on the address bus, the data (8) goes out on the data bus, and Write goes high on the control bus." },
    { beat: "wait", rtl: "wait for MFC", sig: [], bus: "out", waiting: true, write: true, mfc: false,
      r4: "8", mar: "200", mdr: "8", mem: "?",
      narr: "The CPU waits — often several cycles — with address, data and Write held, while memory performs the write." },
    { beat: "—", rtl: "M[200] = 8 ✓", sig: ["MFC"], bus: "out", waiting: false, write: false, mfc: true,
      r4: "8", mar: "200", mdr: "8", mem: "8",
      narr: "Memory finishes and asserts MFC on the control bus. Location 200 now holds 8 — the result is saved." },
  ];
  const s = steps[step];
  const active = (name) => s.sig.includes(name);

  const Sig = ({ name, y, input }) => {
    const on = active(name);
    const col = input ? C.teal : (name === "Write" ? C.red : C.green);
    return (
      <g>
        <rect x={16} y={y} width={80} height={22} rx={5} fill={on ? col + "26" : C.card} stroke={on ? col : C.border} strokeWidth={on ? 2 : 1} style={{ transition: "all 0.2s" }} />
        <text x={56} y={y + 15} textAnchor="middle" fill={on ? col : C.muted} fontSize={10} fontWeight="700">{name}{on ? " ●" : ""}</text>
      </g>
    );
  };

  const Packet = ({ from, to, y, label, color }) => (
    <g>
      <rect x={-15} y={-9} width={30} height={18} rx={4} fill={color} />
      <text y={4} textAnchor="middle" fill="#0D1117" fontSize={9} fontWeight="800">{label}</text>
      <animateMotion dur="1s" repeatCount="indefinite" path={`M ${from} ${y} L ${to} ${y}`} />
    </g>
  );

  const Reg = ({ x, y, w, label, val, col }) => {
    const has = val !== "—" && val !== "?";
    return (
      <g>
        <rect x={x} y={y} width={w} height={30} rx={6} fill={has ? col + "1E" : C.card} stroke={has ? col : C.border} strokeWidth={1.7} style={{ transition: "all 0.25s" }} />
        <text x={x + w / 2} y={y + 13} textAnchor="middle" fill={col} fontSize={10} fontWeight="700">{label}</text>
        <text x={x + w / 2} y={y + 25} textAnchor="middle" fill={has ? C.text : C.muted} fontSize={9} fontFamily="monospace">{val}</text>
      </g>
    );
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Now the <strong style={{ color: C.text }}>control unit</strong> drives a full store, exactly like the fetch in Unit 2.3.
        It fires <code style={{ color: C.green, fontFamily: "monospace" }}>MARin</code>, then
        <code style={{ color: C.green, fontFamily: "monospace" }}> R4out·MDRin</code>, then
        <code style={{ color: C.red, fontFamily: "monospace" }}> Write</code> — and the three external buses carry it out.
        Instruction: <code style={{ color: C.purple, fontFamily: "monospace" }}>Store R4, C</code> (R4 = 8, C = 200).
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 10 }}>
        <svg viewBox="0 0 540 290" style={{ width: "100%", display: "block" }}>
          {/* control unit */}
          <rect x={8} y={20} width={98} height={250} rx={10} fill={C.surface} stroke={C.purple} strokeWidth={1.6} />
          <text x={57} y={38} textAnchor="middle" fill={C.purple} fontSize={10} fontWeight="700">CONTROL UNIT</text>
          <Sig name="MARin" y={48} />
          <Sig name="R4out" y={78} />
          <Sig name="MDRin" y={108} />
          <Sig name="Write" y={150} />
          <text x={57} y={210} textAnchor="middle" fill={C.muted} fontSize={8}>input from memory ↓</text>
          <Sig name="MFC" y={220} input />

          {/* processor boundary */}
          <rect x={118} y={20} width={296} height={250} rx={10} fill={C.bg} stroke={C.purple} strokeWidth={1.3} strokeDasharray="5 4" />
          <text x={130} y={36} fill={C.purple} fontSize={9} fontWeight="700">PROCESSOR</text>

          {/* internal bus */}
          <line x1={135} y1={95} x2={395} y2={95} stroke={s.bus && s.bus.startsWith("int") ? C.accent : C.border} strokeWidth={s.bus && s.bus.startsWith("int") ? 5 : 3} style={{ transition: "all 0.2s" }} />
          <text x={200} y={88} fill={C.accent} fontSize={8.5} fontWeight="700">internal bus</text>

          {/* R4 on the bus */}
          <line x1={165} y1={95} x2={165} y2={115} stroke={C.border} strokeWidth={1.4} />
          <Reg x={140} y={115} w={50} label="R4" val={s.r4} col={C.teal} />
          {/* MAR above bus, MDR below bus (right edge) */}
          <line x1={368} y1={78} x2={368} y2={95} stroke={C.border} strokeWidth={1.4} />
          <Reg x={343} y={48} w={54} label="MAR" val={s.mar} col={C.orange} />
          <line x1={368} y1={95} x2={368} y2={150} stroke={C.border} strokeWidth={1.4} />
          <Reg x={343} y={150} w={54} label="MDR" val={s.mdr} col={C.teal} />

          {/* main memory */}
          <rect x={452} y={45} width={80} height={200} rx={10} fill={C.surface} stroke={C.red} strokeWidth={1.6} />
          <text x={492} y={70} textAnchor="middle" fill={C.red} fontSize={10} fontWeight="700">MAIN</text>
          <text x={492} y={84} textAnchor="middle" fill={C.red} fontSize={10} fontWeight="700">MEMORY</text>
          <rect x={462} y={100} width={60} height={30} rx={4} fill={s.mem === "8" ? C.green + "26" : C.card} stroke={s.mem === "8" ? C.green : C.border} strokeWidth={s.mem === "8" ? 2 : 1} style={{ transition: "all 0.25s" }} />
          <text x={492} y={112} textAnchor="middle" fill={C.muted} fontSize={7}>M[200]</text>
          <text x={492} y={124} textAnchor="middle" fill={s.mem === "8" ? C.green : C.muted} fontSize={11} fontFamily="monospace" fontWeight="700">{s.mem}</text>

          {/* address bus: MAR → memory (out during Write/wait) */}
          <line x1={397} y1={63} x2={452} y2={63} stroke={s.write || s.waiting ? C.orange : C.border} strokeWidth={s.write || s.waiting ? 3 : 2} style={{ transition: "all 0.2s" }} markerEnd="url(#u24f_ab)" />
          <text x={424} y={56} textAnchor="middle" fill={C.orange} fontSize={7.5} fontWeight="700">address</text>
          {/* data bus: MDR → memory (out during Write/wait) */}
          <line x1={397} y1={165} x2={452} y2={165} stroke={s.write || s.waiting ? C.teal : C.border} strokeWidth={s.write || s.waiting ? 3 : 2} style={{ transition: "all 0.2s" }} markerEnd="url(#u24f_db)" />
          <text x={424} y={158} textAnchor="middle" fill={C.teal} fontSize={7.5} fontWeight="700">data</text>
          {/* control bus: Write out / MFC in */}
          <line x1={330} y1={258} x2={492} y2={258} stroke={s.write || s.mfc ? C.yellow : C.border} strokeWidth={s.write || s.mfc ? 3 : 2} style={{ transition: "all 0.2s" }} />
          <line x1={330} y1={258} x2={330} y2={95} stroke={s.write || s.mfc ? C.yellow : C.border} strokeWidth={1.4} opacity={0.5} strokeDasharray="3 3" />
          <line x1={492} y1={245} x2={492} y2={258} stroke={s.write || s.mfc ? C.yellow : C.border} strokeWidth={1.4} opacity={0.6} />
          <text x={405} y={272} textAnchor="middle" fill={C.yellow} fontSize={7.5} fontWeight="700">
            control bus {s.write ? "· Write HIGH →" : s.mfc ? "· ← MFC" : ""}
          </text>

          {/* moving packets — each bus animates its own traffic */}
          {s.bus === "int-addr-mar" && <Packet from={200} to={368} y={95} label="200" color={C.orange} />}
          {s.bus === "int-r4-mdr" && <Packet from={165} to={368} y={95} label="8" color={C.teal} />}
          {(s.write || s.waiting) && <Packet from={399} to={450} y={63} label="200" color={C.orange} />}
          {(s.write || s.waiting) && <Packet from={399} to={450} y={165} label="8" color={C.teal} />}
          {/* control-bus packets: Write travels OUT to memory; MFC comes BACK */}
          {(s.write || s.waiting) && <Packet from={340} to={486} y={258} label="Write" color={C.yellow} />}
          {s.mfc && <Packet from={486} to={340} y={258} label="MFC" color={C.yellow} />}

          {s.waiting && (
            <text x={424} y={110} textAnchor="middle" fill={C.red} fontSize={9} fontWeight="700">⏳ waiting…
              <animate attributeName="opacity" values="0.35;1;0.35" dur="1s" repeatCount="indefinite" />
            </text>
          )}

          <defs>
            <marker id="u24f_ab" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.orange} /></marker>
            <marker id="u24f_db" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.teal} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <div style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.waiting ? C.red + "22" : C.accentGlow, border: `1.5px solid ${s.waiting ? C.red : C.accent}`, color: s.waiting ? C.red : "#fff" }}>
          {s.beat === "—" ? (step === 0 ? "ready" : "MFC") : s.beat}
        </div>
        <div style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: step === 0 ? C.muted : C.accent, fontWeight: 700 }}>
          RTL: {s.rtl}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 44, lineHeight: 1.6, marginBottom: 10 }}>
        {s.narr}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setStep(v => Math.min(steps.length - 1, v + 1))} disabled={step === steps.length - 1} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: step === steps.length - 1 ? C.card : C.accentGlow, color: step === steps.length - 1 ? C.muted : "#fff",
          cursor: step === steps.length - 1 ? "default" : "pointer",
        }}>Next step ▶ ({step} / {steps.length - 1})</button>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <Key color={C.green}>
        Store on the single bus: <code style={{ fontFamily: "monospace" }}>MAR ← address</code> (where),
        <code style={{ fontFamily: "monospace" }}> MDR ← [R4]</code> (what), then <code style={{ fontFamily: "monospace" }}>Write</code>
        (address + data out, Write high) and wait for <strong style={{ color: C.teal }}>MFC</strong>. Address and data are both
        loaded <strong style={{ color: C.text }}>before</strong> Write is raised — the very next lesson shows why.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The order gotcha: Write before MDR corrupts memory
// ══════════════════════════════════════════════════════════════════
function OrderGotcha() {
  const [correct, setCorrect] = useState(true);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A Load that samples too early loads garbage into a register — annoying, but recoverable. A <strong style={{ color: C.text }}>Store
        in the wrong order writes garbage into memory</strong> — it destroys real data. Order matters more here. Toggle it.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[[true, "Load MDR, then Write ✓", C.green], [false, "Write before MDR is ready ✗", C.red]].map(([v, label, col]) => (
          <button key={String(v)} onClick={() => setCorrect(v)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12,
            background: correct === v ? col + "22" : C.card,
            border: `2px solid ${correct === v ? col : C.border}`, color: correct === v ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.9 }}>
        {correct ? (
          <div>
            <div style={{ color: C.muted }}>T1&nbsp; MAR ← C</div>
            <div style={{ color: C.green }}>T2&nbsp; MDR ← [R4]&nbsp;&nbsp;<span style={{ color: C.muted }}>// data ready = 8</span></div>
            <div style={{ color: C.green }}>T3&nbsp; Write, MFC&nbsp;&nbsp;<span style={{ color: C.muted }}>// M[200] ← 8 ✓</span></div>
          </div>
        ) : (
          <div>
            <div style={{ color: C.muted }}>T1&nbsp; MAR ← C</div>
            <div style={{ color: C.red }}>T2&nbsp; Write, MFC&nbsp;&nbsp;<span style={{ color: C.muted }}>// MDR still empty!</span></div>
            <div style={{ color: C.red }}>T3&nbsp; MDR ← [R4]&nbsp;&nbsp;<span style={{ color: C.muted }}>// too late</span></div>
          </div>
        )}
      </div>

      {/* little animation: MDR (loaded or empty) → Write → memory cell */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 130" style={{ width: "100%", display: "block" }} key={String(correct)}>
          {/* MDR */}
          <rect x={30} y={45} width={110} height={46} rx={8} fill={correct ? C.teal + "1E" : C.card} stroke={correct ? C.teal : C.red} strokeWidth={1.8} />
          <text x={85} y={65} textAnchor="middle" fill={correct ? C.teal : C.red} fontSize={12} fontWeight="700">MDR</text>
          <text x={85} y={82} textAnchor="middle" fill={correct ? C.text : C.red} fontSize={13} fontFamily="monospace" fontWeight="700">{correct ? "8" : "empty"}</text>
          {/* Write signal */}
          <rect x={210} y={48} width={90} height={40} rx={7} fill={C.red + "18"} stroke={C.red} strokeWidth={1.8} />
          <text x={255} y={66} textAnchor="middle" fill={C.red} fontSize={11} fontWeight="700">Write high</text>
          <text x={255} y={80} textAnchor="middle" fill={C.muted} fontSize={8}>fires the store</text>
          {/* memory cell */}
          <rect x={380} y={45} width={110} height={46} rx={8} fill={correct ? C.green + "1E" : C.red + "1E"} stroke={correct ? C.green : C.red} strokeWidth={1.8} />
          <text x={435} y={65} textAnchor="middle" fill={correct ? C.green : C.red} fontSize={12} fontWeight="700">M[C]</text>
          <text x={435} y={82} textAnchor="middle" fill={correct ? C.green : C.red} fontSize={13} fontFamily="monospace" fontWeight="700">{correct ? "8 ✓" : "garbage ✗"}</text>
          {/* flow MDR → memory (what actually gets written) */}
          <line x1={140} y1={68} x2={210} y2={68} stroke={correct ? C.teal : C.red} strokeWidth={2.5} markerEnd="url(#u24o)" />
          <line x1={300} y1={68} x2={380} y2={68} stroke={correct ? C.green : C.red} strokeWidth={2.5} markerEnd="url(#u24o2)" />
          <circle r={5} fill={correct ? C.teal : C.red}>
            <animate attributeName="cx" values="142;378" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="cy" values="68;68" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <text x={255} y={112} textAnchor="middle" fill={correct ? C.green : C.red} fontSize={10} fontWeight="700">
            {correct ? "MDR (8) is written → M[C] = 8" : "empty MDR is written → M[C] is corrupted"}
          </text>
          <defs>
            <marker id="u24o" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={correct ? C.teal : C.red} /></marker>
            <marker id="u24o2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={correct ? C.green : C.red} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ background: correct ? C.green + "12" : C.red + "12", border: `1px solid ${correct ? C.green : C.red}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
        {correct
          ? <span>✓ MDR holds 8 <strong style={{ color: C.green }}>before</strong> Write fires, so memory location C correctly becomes 8.</span>
          : <span>✗ Write fires while MDR is still empty/stale, so <strong style={{ color: C.red }}>whatever junk sits in MDR is burned into memory</strong> at address C — the previous value of C is gone forever. Corrupting memory is worse than a bad register read.</span>}
      </div>

      <Key color={C.red}>
        For a Store, <strong style={{ color: C.text }}>both MAR (address) and MDR (data) must be loaded before Write is
        raised</strong>. The control unit (Unit 2.7) is what guarantees this ordering every single time — the reason a processor
        needs a conductor, not just wires.
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
      q: "When the CPU stores register R4 to memory, what path does the data take?",
      options: [
        "R4 → memory directly",
        "R4 → MAR → memory",
        "R4 → MDR, then MDR → M[MAR]",
        "R4 → ALU → memory",
      ],
      answer: 2,
      explain: "Just like Load, all data to/from memory passes through MDR. For a Store: MDR ← [R4], then M[MAR] ← [MDR], with the address held in MAR. R4 never touches memory directly.",
    },
    {
      q: "How does a Store differ from a Load at the MAR/MDR gateway?",
      options: [
        "Store uses a different pair of registers",
        "The address direction reverses",
        "Only the data direction and the Read/Write line change — MDR drives memory instead of receiving from it",
        "Store skips MAR entirely",
      ],
      answer: 2,
      explain: "The gateway is identical: MAR out for the address either way. What flips is the data direction — for Store, MDR is the source driving memory (Write); for Load, MDR receives from memory (Read).",
    },
    {
      q: "What is the correct single-bus store micro-sequence?",
      options: [
        "Write; MAR ← address; MDR ← [R4]",
        "MAR ← address; MDR ← [R4]; Write, wait for MFC, M[MAR] ← [MDR]",
        "MDR ← [R4]; Write; MAR ← address",
        "MAR ← [R4]; MDR ← address; Write",
      ],
      answer: 1,
      explain: "Address into MAR (where), data into MDR (what), then raise Write and wait for MFC so M[MAR] receives MDR. Both registers are loaded before Write is asserted.",
    },
    {
      q: "Why is raising Write before MDR is loaded especially dangerous?",
      options: [
        "It slows the clock down",
        "It writes whatever junk is in MDR into memory, destroying the real data there",
        "It resets the program counter",
        "It has no effect — the CPU auto-corrects",
      ],
      answer: 1,
      explain: "A premature Write burns stale/garbage MDR contents into the addressed memory location, overwriting valid data irrecoverably. That's why the control unit must load MAR and MDR before asserting Write.",
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
          {score === 4 ? "Perfect! You can trace a store and explain why order and MFC both matter." :
            score >= 2 ? "Good work! Replay 'The Store Sequence' and 'The Order Gotcha' to lock it in." :
              "Revisit 'Read vs Write' and 'The Store Sequence' — the whole unit rests on those two."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now store a word: MAR ← address, MDR ← register, Write + wait for MFC — with both registers loaded before
            Write, or memory gets corrupted.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.5 — Bus Organization &amp; the Datapath.</strong>{" "}
            You can move words to and from memory. Now build the road they travel on — one bus vs three, and the interstage
            registers RA/RB/RZ/RY/RM — before we drive a whole instruction across it.
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
export default function Unit2_4({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Store?" },
    { id: "seq", label: "The Store Datapath" },
    { id: "order", label: "The Order Gotcha" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📤 Why Store at All?</h3>
      <TheNeed />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⏱️ The Store — driven by the control unit</h3>
      <StoreSequence />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⚠️ The Order Gotcha — load MDR before Write</h3>
      <OrderGotcha />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.4.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(3); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📤</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Storing a Word in Memory</div>
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
