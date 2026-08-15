// Unit2_5.jsx — Module 2 › Unit 2.5 — "Bus Organization & the Datapath"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Source: Unit-2 classroom deck, Chapters 3–4 (the datapath + Bus Organization,
// Hamacher §5.2–5.4). This lesson comes BEFORE "Executing a Complete Instruction"
// (Unit 2.6): first we build the road (buses + interstage registers), then we
// drive a whole instruction across it.
// Arc: single-bus bottleneck → three-bus datapath (Bus A + Bus B + Bus C flow in
// ONE clock; why RA & RB) → cycles saved, but we chop it off (CISC vs RISC) →
// the interstage/pipeline registers RZ, RY, RM + the write-back MUX → quiz.
// Convention: FIRST operand is the destination (Add R4, R2, R3 → R4 ← [R2]+[R3]).
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
//  Section 1 — The single-bus bottleneck (one value per clock)
// ══════════════════════════════════════════════════════════════════
function SingleBusBottleneck() {
  const [lit, setLit] = useState(0);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        We have moved bits (2.1), built an ALU (2.2), and reached memory (2.3–2.4). Now we build the <strong style={{ color: C.text }}>road
        the operands travel on</strong> — the datapath. Start with the single bus. Its one rule:
        <strong style={{ color: C.text }}> only one value can be on the bus per clock</strong>. Try to send two operands at once.
      </p>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 150" style={{ width: "100%", display: "block" }}>
          <line x1={40} y1={75} x2={480} y2={75} stroke={lit > 1 ? C.red : C.accent} strokeWidth={6} />
          <text x={260} y={60} textAnchor="middle" fill={lit > 1 ? C.red : C.accent} fontSize={11} fontWeight="700">
            {lit > 1 ? "two values collide — impossible!" : "single shared bus"}
          </text>
          <rect x={60} y={95} width={90} height={34} rx={6} fill={lit >= 1 ? C.teal + "1E" : C.card} stroke={lit >= 1 ? C.teal : C.border} strokeWidth={1.8} />
          <text x={105} y={117} textAnchor="middle" fill={lit >= 1 ? C.teal : C.muted} fontSize={12} fontWeight="700">R2 = 5</text>
          {lit >= 1 && <line x1={105} y1={95} x2={105} y2={75} stroke={C.teal} strokeWidth={2} />}
          <rect x={370} y={95} width={90} height={34} rx={6} fill={lit >= 2 ? C.purple + "1E" : C.card} stroke={lit >= 2 ? C.purple : C.border} strokeWidth={1.8} />
          <text x={415} y={117} textAnchor="middle" fill={lit >= 2 ? C.purple : C.muted} fontSize={12} fontWeight="700">R3 = 3</text>
          {lit >= 2 && <line x1={415} y1={95} x2={415} y2={75} stroke={C.purple} strokeWidth={2} />}
        </svg>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={() => setLit(v => Math.min(2, v + 1))} disabled={lit === 2} style={{
          flex: 2, padding: "10px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13,
          background: lit === 2 ? C.card : C.accentGlow, color: lit === 2 ? C.muted : "#fff",
          cursor: lit === 2 ? "default" : "pointer",
        }}>Put an operand on the bus ▶ ({lit} / 2)</button>
        <button onClick={() => setLit(0)} style={{
          flex: 1, padding: "10px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}`,
          color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>↺ Reset</button>
      </div>

      <div style={{ background: lit > 1 ? C.red + "12" : C.card, border: `1px solid ${lit > 1 ? C.red : C.border}55`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, minHeight: 40, lineHeight: 1.6 }}>
        {lit === 0 ? "An add needs BOTH R2 and R3 at the ALU. Start sending them onto the bus."
          : lit === 1 ? "One operand rides the bus. The second must wait its turn — so the add is spread over several clocks."
            : <span>✗ Two values at once collide — a single bus physically can't carry both. That queueing is the <strong style={{ color: C.red }}>bottleneck</strong>. The fix: more buses.</span>}
      </div>

      <Key color={C.accent}>
        <strong style={{ color: C.text }}>Single bus = one transfer per clock.</strong> Cheap and simple, but a register-to-register
        add must queue its operands over several beats. What if the datapath had <strong style={{ color: C.text }}>three</strong>
        buses, so both operands and the result could move at once?
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The three-bus datapath (A + B + C flow in ONE clock)
//  Introduces RA and RB, and WHY they exist.
// ══════════════════════════════════════════════════════════════════
function ThreeBusDatapath() {
  const [why, setWhy] = useState(false);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Give the datapath <strong style={{ color: C.green }}>three buses</strong>. The register file reads both operands onto
        <strong style={{ color: C.green }}> Bus A</strong> and <strong style={{ color: C.yellow }}>Bus B</strong> into the
        registers <strong style={{ color: C.teal }}>RA</strong> and <strong style={{ color: C.teal }}>RB</strong>; the ALU
        computes; the result returns on <strong style={{ color: C.purple }}>Bus C</strong> — and all three flow
        <strong style={{ color: C.text }}> at the same time</strong>. Example: <code style={{ color: C.purple, fontFamily: "monospace" }}>Add R4, R2, R3</code>.
      </p>

      {/* the datapath — all three buses animate simultaneously */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 520 235" style={{ width: "100%", display: "block" }}>
          {/* register file */}
          <rect x={18} y={72} width={92} height={86} rx={10} fill={C.card} stroke={C.teal} strokeWidth={1.8} />
          <text x={64} y={100} textAnchor="middle" fill={C.teal} fontSize={11} fontWeight="700">Register</text>
          <text x={64} y={114} textAnchor="middle" fill={C.teal} fontSize={11} fontWeight="700">file</text>
          <text x={64} y={132} textAnchor="middle" fill={C.muted} fontSize={8}>R2=5 · R3=3</text>
          <text x={64} y={144} textAnchor="middle" fill={C.muted} fontSize={8}>→ R4</text>

          {/* Bus A → RA → ALU */}
          <line x1={110} y1={92} x2={300} y2={92} stroke={C.green} strokeWidth={3.5} />
          <text x={150} y={84} fill={C.green} fontSize={9} fontWeight="700">Bus A</text>
          <rect x={175} y={78} width={46} height={26} rx={5} fill={C.teal + "1E"} stroke={C.teal} strokeWidth={1.6} />
          <text x={198} y={95} textAnchor="middle" fill={C.teal} fontSize={11} fontWeight="700">RA</text>

          {/* Bus B → RB → ALU */}
          <line x1={110} y1={150} x2={300} y2={150} stroke={C.yellow} strokeWidth={3.5} />
          <text x={150} y={168} fill={C.yellow} fontSize={9} fontWeight="700">Bus B</text>
          <rect x={175} y={137} width={46} height={26} rx={5} fill={C.teal + "1E"} stroke={C.teal} strokeWidth={1.6} />
          <text x={198} y={154} textAnchor="middle" fill={C.teal} fontSize={11} fontWeight="700">RB</text>

          {/* ALU */}
          <polygon points="300,80 356,108 356,142 300,170" fill={C.accent + "1E"} stroke={C.accent} strokeWidth={1.8} />
          <text x={324} y={128} textAnchor="middle" fill={C.accent} fontSize={11} fontWeight="700">ALU</text>

          {/* Bus C — result back to register file */}
          <path d="M 356 125 L 392 125 L 392 210 L 50 210 L 50 158" stroke={C.purple} strokeWidth={3.5} fill="none" markerEnd="url(#u25c)" />
          <text x={230} y={204} textAnchor="middle" fill={C.purple} fontSize={9} fontWeight="700">Bus C — result back to the register file</text>

          {/* three packets, SAME timing → simultaneous flow */}
          <g>
            <rect x={-13} y={-8} width={26} height={16} rx={3} fill={C.green} />
            <text y={4} textAnchor="middle" fill="#0D1117" fontSize={8} fontWeight="800">5</text>
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 115 92 L 296 92" />
          </g>
          <g>
            <rect x={-13} y={-8} width={26} height={16} rx={3} fill={C.yellow} />
            <text y={4} textAnchor="middle" fill="#0D1117" fontSize={8} fontWeight="800">3</text>
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 115 150 L 296 150" />
          </g>
          <g>
            <rect x={-13} y={-8} width={26} height={16} rx={3} fill={C.purple} />
            <text y={4} textAnchor="middle" fill="#0D1117" fontSize={8} fontWeight="800">8</text>
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 356 125 L 392 125 L 392 210 L 50 210 L 50 158" />
          </g>

          <text x={430} y={40} textAnchor="middle" fill={C.green} fontSize={10} fontWeight="700">all in ONE clock cycle</text>
          <defs><marker id="u25c" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill={C.purple} /></marker></defs>
        </svg>
      </div>

      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <button onClick={() => setWhy(w => !w)} style={{
          padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.teal}`, background: C.teal + "18",
          color: C.teal, fontWeight: 700, fontSize: 12.5, cursor: "pointer",
        }}>{why ? "↺ Hide" : "But why RA and RB? ▶"}</button>
      </div>

      {why && (
        <div style={{ background: C.teal + "12", border: `1px solid ${C.teal}55`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.7, marginBottom: 4 }}>
          Why not feed the ALU straight from R2 and R3? Because the register file is <strong style={{ color: C.text }}>read in one
          step and the ALU works in the next</strong>. <strong style={{ color: C.teal }}>RA</strong> and
          <strong style={{ color: C.teal }}> RB</strong> latch the two operands at the clock edge so they stay
          <strong style={{ color: C.text }}> stable</strong> for the ALU — even while the register file moves on to the next
          instruction (reading new operands, or being written by a previous result). They <em>decouple</em> "read the operands"
          from "compute", which is exactly what lets us split the work into separate one-clock stages next.
        </div>
      )}

      <Key color={C.green}>
        Three buses: <strong style={{ color: C.green }}>Bus A</strong> + <strong style={{ color: C.yellow }}>Bus B</strong> carry
        both operands (into <strong style={{ color: C.teal }}>RA</strong>, <strong style={{ color: C.teal }}>RB</strong>), the ALU
        computes, and <strong style={{ color: C.purple }}>Bus C</strong> returns the result — read, compute, write-back all in
        <strong style={{ color: C.text }}> one clock cycle</strong>. RA/RB latch the operands so the ALU sees stable inputs.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Cycles saved... but we chop it off (CISC vs RISC)
// ══════════════════════════════════════════════════════════════════
function ChopItOff() {
  const [mode, setMode] = useState("whole"); // "whole" | "chopped"

  const stages = ["Fetch", "Decode", "Compute", "Memory", "Write-back"];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The three-bus datapath can finish a register-to-register op in <strong style={{ color: C.text }}>one clock</strong>. So
        why don't we just let every instruction run in one big clock? Toggle the two philosophies.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        {[["whole", "CISC — one big step", C.orange], ["chopped", "RISC — chop into stages", C.green]].map(([k, label, col]) => (
          <button key={k} onClick={() => setMode(k)} style={{
            flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 12.5,
            background: mode === k ? col + "22" : C.card,
            border: `2px solid ${mode === k ? col : C.border}`, color: mode === k ? col : C.muted,
          }}>{label}</button>
        ))}
      </div>

      {mode === "whole" ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ padding: "12px 24px", borderRadius: 10, background: C.orange + "1E", border: `2px solid ${C.orange}`, textAlign: "center" }}>
              <div style={{ color: C.orange, fontWeight: 800, fontSize: 14 }}>ONE variable-length step</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>read → compute → (memory?) → write, however long it takes</div>
            </div>
          </div>
          <div style={{ color: C.muted, fontSize: 12, textAlign: "center", lineHeight: 1.6 }}>
            A simple add finishes fast; a load that touches memory takes far longer. Each instruction runs for a
            <strong style={{ color: C.text }}> different, unpredictable number of clocks</strong> — and you can't overlap them.
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 10px", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
            {stages.map((st, i) => (
              <div key={st} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ padding: "9px 8px", borderRadius: 8, background: C.green + "18", border: `1.5px solid ${C.green}`, textAlign: "center", minWidth: 58 }}>
                  <div style={{ color: C.green, fontSize: 10.5, fontWeight: 700 }}>{st}</div>
                  <div style={{ color: C.muted, fontSize: 8 }}>1 clock</div>
                </div>
                {i < stages.length - 1 && <span style={{ color: C.muted, fontSize: 12 }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ color: C.muted, fontSize: 12, textAlign: "center", lineHeight: 1.6, marginTop: 10 }}>
            Chop the work into <strong style={{ color: C.text }}>fixed one-clock stages</strong>, separated by interstage
            registers. Now every instruction takes the same predictable rhythm — and the stages can
            <strong style={{ color: C.text }}> overlap</strong> (pipelining, Module 3).
          </div>
        </div>
      )}

      <div style={{ background: (mode === "whole" ? C.orange : C.green) + "12", border: `1px solid ${(mode === "whole" ? C.orange : C.green)}55`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>
        {mode === "whole"
          ? <span><strong style={{ color: C.orange }}>CISC</strong> lets an instruction run as one variable-length flow across the datapath. Flexible, but timing is unpredictable and instructions can't overlap.</span>
          : <span><strong style={{ color: C.green }}>RISC</strong> chops the datapath into fixed one-clock stages held apart by <strong style={{ color: C.text }}>interstage registers</strong> — so every instruction has a known length and the pipeline can overlap them.</span>}
      </div>

      <Key color={C.green}>
        We <em>could</em> do it all in one clock — and CISC machines do, with variable timing. But RISC deliberately
        <strong style={{ color: C.text }}> chops the datapath into fixed one-clock stages</strong>. Without that, you can't say
        how many clocks an instruction will take, and you can't pipeline. The chop needs registers between the stages — meet
        them next.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The interstage (pipeline) registers: RZ, RY, RM + MuxY
// ══════════════════════════════════════════════════════════════════
function StagedRegisters() {
  const [op, setOp] = useState("add"); // "add" | "load" | "store"

  // which parts light up for each op
  const on = {
    raRb: op === "add",
    alu: op === "add" || op === "load", // load uses ALU to form the address (simplified: still lit)
    rz: op === "add",
    mdr: op === "load",
    rm: op === "store",
    muxRZ: op === "add",
    muxMDR: op === "load",
    ry: op === "add" || op === "load",
    mem: op === "load" || op === "store",
  };
  const litCol = op === "add" ? C.accent : op === "load" ? C.orange : C.red;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Chopping needs a register between each pair of stages. These <strong style={{ color: C.text }}>interstage (pipeline)
        registers</strong> each hold a value so the <em>next</em> clock can use it: <strong style={{ color: C.teal }}>RA/RB</strong>
        (operands), <strong style={{ color: C.purple }}>RZ</strong> (ALU result), <strong style={{ color: C.purple }}>RY</strong>
        (value to write back), and <strong style={{ color: C.orange }}>RM</strong> (data out to memory, store only). Pick an
        operation and watch the path light up.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["add", "Add R4,R2,R3"], ["load", "Load R1,A"], ["store", "Store R4,C"]].map(([k, label]) => (
          <button key={k} onClick={() => setOp(k)} style={{
            flex: 1, padding: "9px 6px", borderRadius: 9, cursor: "pointer", fontWeight: 700, fontSize: 11.5, fontFamily: "monospace",
            background: op === k ? litCol + "22" : C.card,
            border: `2px solid ${op === k ? litCol : C.border}`, color: op === k ? litCol : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px 2px", marginBottom: 12 }}>
        <svg viewBox="0 0 540 250" style={{ width: "100%", display: "block" }}>
          {/* register file */}
          <rect x={16} y={95} width={80} height={70} rx={9} fill={C.card} stroke={C.teal} strokeWidth={1.7} />
          <text x={56} y={126} textAnchor="middle" fill={C.teal} fontSize={10} fontWeight="700">Register</text>
          <text x={56} y={140} textAnchor="middle" fill={C.teal} fontSize={10} fontWeight="700">file</text>

          {/* RA, RB */}
          <rect x={120} y={78} width={42} height={24} rx={5} fill={on.raRb ? C.teal + "26" : C.card} stroke={on.raRb ? C.teal : C.border} strokeWidth={1.6} />
          <text x={141} y={94} textAnchor="middle" fill={on.raRb ? C.teal : C.muted} fontSize={10} fontWeight="700">RA</text>
          <rect x={120} y={120} width={42} height={24} rx={5} fill={on.raRb ? C.teal + "26" : C.card} stroke={on.raRb ? C.teal : C.border} strokeWidth={1.6} />
          <text x={141} y={136} textAnchor="middle" fill={on.raRb ? C.teal : C.muted} fontSize={10} fontWeight="700">RB</text>
          <line x1={96} y1={110} x2={120} y2={90} stroke={on.raRb ? C.teal : C.border} strokeWidth={1.6} />
          <line x1={96} y1={135} x2={120} y2={132} stroke={on.raRb ? C.teal : C.border} strokeWidth={1.6} />

          {/* ALU */}
          <polygon points="185,80 235,104 235,140 185,164" fill={on.alu ? C.accent + "22" : C.card} stroke={on.alu ? C.accent : C.border} strokeWidth={1.7} />
          <text x={205} y={126} textAnchor="middle" fill={on.alu ? C.accent : C.muted} fontSize={10} fontWeight="700">ALU</text>
          <line x1={162} y1={90} x2={185} y2={100} stroke={on.raRb ? C.teal : C.border} strokeWidth={1.5} />
          <line x1={162} y1={132} x2={185} y2={140} stroke={on.raRb ? C.teal : C.border} strokeWidth={1.5} />

          {/* RZ (ALU result) */}
          <rect x={258} y={110} width={44} height={26} rx={5} fill={on.rz ? C.purple + "26" : C.card} stroke={on.rz ? C.purple : C.border} strokeWidth={1.6} />
          <text x={280} y={127} textAnchor="middle" fill={on.rz ? C.purple : C.muted} fontSize={10} fontWeight="700">RZ</text>
          <line x1={235} y1={122} x2={258} y2={123} stroke={on.rz ? C.purple : C.border} strokeWidth={1.5} />

          {/* MDR (memory data in, for a load) */}
          <rect x={258} y={185} width={44} height={26} rx={5} fill={on.mdr ? C.orange + "26" : C.card} stroke={on.mdr ? C.orange : C.border} strokeWidth={1.6} />
          <text x={280} y={202} textAnchor="middle" fill={on.mdr ? C.orange : C.muted} fontSize={10} fontWeight="700">MDR</text>

          {/* MuxY: chooses RZ or MDR */}
          <polygon points="330,104 356,120 356,150 330,166" fill={C.card} stroke={C.accent} strokeWidth={1.6} />
          <text x={340} y={138} textAnchor="middle" fill={C.accent} fontSize={8.5} fontWeight="700">Mux</text>
          <line x1={302} y1={123} x2={330} y2={118} stroke={on.muxRZ ? C.purple : C.border} strokeWidth={on.muxRZ ? 2.4 : 1.3} />
          <line x1={302} y1={198} x2={330} y2={152} stroke={on.muxMDR ? C.orange : C.border} strokeWidth={on.muxMDR ? 2.4 : 1.3} />
          <text x={366} y={100} fill={C.muted} fontSize={7.5}>picks RZ or MDR</text>

          {/* RY (write-back) */}
          <rect x={378} y={122} width={44} height={26} rx={5} fill={on.ry ? litCol + "26" : C.card} stroke={on.ry ? litCol : C.border} strokeWidth={1.6} />
          <text x={400} y={139} textAnchor="middle" fill={on.ry ? litCol : C.muted} fontSize={10} fontWeight="700">RY</text>
          <line x1={356} y1={135} x2={378} y2={135} stroke={on.ry ? litCol : C.border} strokeWidth={1.5} />
          {/* RY → register file write port (curve back) */}
          <path d="M 422 135 L 445 135 L 445 60 L 56 60 L 56 93" stroke={on.ry ? litCol : C.border} strokeWidth={1.6} fill="none" markerEnd="url(#u25ry)" />
          <text x={250} y={54} textAnchor="middle" fill={on.ry ? litCol : C.muted} fontSize={8}>write-back: RY → register file</text>

          {/* RM (store data out) + memory */}
          <rect x={120} y={205} width={44} height={26} rx={5} fill={on.rm ? C.red + "26" : C.card} stroke={on.rm ? C.red : C.border} strokeWidth={1.6} />
          <text x={142} y={222} textAnchor="middle" fill={on.rm ? C.red : C.muted} fontSize={10} fontWeight="700">RM</text>
          <line x1={56} y1={165} x2={56} y2={218} stroke={on.rm ? C.red : C.border} strokeWidth={1.4} />
          <line x1={56} y1={218} x2={120} y2={218} stroke={on.rm ? C.red : C.border} strokeWidth={1.4} />
          <text x={90} y={200} fill={on.rm ? C.red : C.muted} fontSize={7.5}>store only</text>

          {/* memory block */}
          <rect x={460} y={175} width={70} height={60} rx={8} fill={C.surface} stroke={on.mem ? litCol : C.border} strokeWidth={1.6} />
          <text x={495} y={200} textAnchor="middle" fill={on.mem ? litCol : C.muted} fontSize={9} fontWeight="700">MEMORY</text>
          {/* RM → memory (store) */}
          <line x1={164} y1={218} x2={460} y2={218} stroke={on.rm ? C.red : C.border} strokeWidth={on.rm ? 2.2 : 1.2} markerEnd={on.rm ? "url(#u25mem)" : undefined} />
          {/* memory → MDR (load) */}
          <line x1={460} y1={198} x2={302} y2={198} stroke={on.mdr ? C.orange : C.border} strokeWidth={on.mdr ? 2.2 : 1.2} markerEnd={on.mdr ? "url(#u25mdr)" : undefined} />

          <defs>
            <marker id="u25ry" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={on.ry ? litCol : C.border} /></marker>
            <marker id="u25mem" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.red} /></marker>
            <marker id="u25mdr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.orange} /></marker>
          </defs>
        </svg>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: C.text, lineHeight: 1.6 }}>
        {op === "add" && <span><strong style={{ color: C.accent }}>Add:</strong> RA, RB → ALU → <strong style={{ color: C.purple }}>RZ</strong>. The <strong style={{ color: C.accent }}>MuxY</strong> picks RZ → <strong style={{ color: C.purple }}>RY</strong> → register file. RM and MDR are idle.</span>}
        {op === "load" && <span><strong style={{ color: C.orange }}>Load:</strong> the word comes from memory into <strong style={{ color: C.orange }}>MDR</strong>; the <strong style={{ color: C.accent }}>MuxY</strong> picks MDR → <strong style={{ color: C.purple }}>RY</strong> → register file. The MUX is why one write-back path serves both arithmetic and loads.</span>}
        {op === "store" && <span><strong style={{ color: C.red }}>Store:</strong> this is the only operation that uses <strong style={{ color: C.red }}>RM</strong> — the register's value goes into RM, then out to memory. No write-back, so MuxY and RY are idle.</span>}
      </div>

      <Key color={C.purple}>
        <strong style={{ color: C.teal }}>RA, RB</strong> (operands), <strong style={{ color: C.purple }}>RZ</strong> (ALU result),
        <strong style={{ color: C.purple }}> RY</strong> (write-back) and <strong style={{ color: C.orange }}>RM</strong> (store
        data) are <strong style={{ color: C.text }}>interstage registers</strong> — each holds its value for the next clock. The
        <strong style={{ color: C.accent }}> MuxY</strong> in front of RY chooses between the ALU result (RZ) and the memory data
        (MDR), so one write-back path serves both. <strong style={{ color: C.text }}>RM is used only by Store.</strong>
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
      q: "Why does a register-to-register add take several beats on a single-bus datapath?",
      options: [
        "The ALU is slow",
        "Only one value can be on the bus per clock, so the two operands must queue",
        "Registers can't be read twice",
        "Memory is involved in every add",
      ],
      answer: 1,
      explain: "A single bus carries one value per clock. The two operands can't ride it together, so the add is spread across multiple beats. Three buses fix this.",
    },
    {
      q: "On the three-bus datapath, what happens in one clock cycle?",
      options: [
        "Only one operand moves",
        "Bus A and Bus B carry both operands in, the ALU computes, and Bus C returns the result — all at once",
        "The result is written to memory",
        "The instruction is fetched",
      ],
      answer: 1,
      explain: "Both operands travel simultaneously on Bus A and Bus B into RA/RB, the ALU computes, and Bus C carries the result back to the register file — read, compute, write-back in a single clock.",
    },
    {
      q: "Why does the datapath include the operand registers RA and RB instead of feeding the ALU straight from R2 and R3?",
      options: [
        "To store the result",
        "To latch the operands so they stay stable for the ALU, decoupling 'read the register file' from 'compute' — which lets the work split into fixed one-clock stages",
        "Because the register file has no read ports",
        "To convert the operands to two's complement",
      ],
      answer: 1,
      explain: "RA and RB hold the operands at the clock edge so the ALU sees stable inputs even while the register file moves on. That decoupling is what makes fixed one-clock stages (and pipelining) possible.",
    },
    {
      q: "The MuxY in front of RY chooses between which two sources — and which register is used only for a Store?",
      options: [
        "Between RA and RB; RM is used only for Store",
        "Between the ALU result (RZ) and the memory data (MDR); RM is used only for Store",
        "Between RY and RZ; MDR is used only for Store",
        "Between Bus A and Bus B; RZ is used only for Store",
      ],
      answer: 1,
      explain: "MuxY selects the ALU result (RZ, for arithmetic) or the loaded memory data (MDR, for a load) into RY for write-back. RM is the store-only register that sends a register's value out to memory.",
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
          {score === 4 ? "Perfect! You know the road an instruction drives on — buses and interstage registers." :
            score >= 2 ? "Good work! Replay 'The Three-Bus Datapath' and 'RZ, RY & RM' to lock it in." :
              "Revisit 'The Three-Bus Datapath' and the interstage registers — the whole unit rests on those."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 2.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You built the datapath: one bus vs three, why RA/RB latch the operands, why we chop the flow into fixed stages, and
            the interstage registers RZ, RY, RM with the write-back MUX.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 2.6 — Executing a Complete Instruction.</strong>{" "}
            Now that the road is built, let's drive one whole instruction across it, beat by beat.
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
export default function Unit2_5({ student, onUnitComplete }) {
  const sections = [
    { id: "single", label: "Single-Bus Bottleneck" },
    { id: "three", label: "Three-Bus Datapath" },
    { id: "chop", label: "Chop It Off" },
    { id: "regs", label: "RZ, RY & RM" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🚦 The Single-Bus Bottleneck</h3>
      <SingleBusBottleneck />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛤️ The Three-Bus Datapath — all in one clock</h3>
      <ThreeBusDatapath />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>✂️ Cycles Saved… but We Chop It Off</h3>
      <ChopItOff />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🧩 RZ, RY &amp; RM — the interstage registers</h3>
      <StagedRegisters />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 2.5.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛤️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 2 › UNIT 2.5</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Bus Organization &amp; the Datapath</div>
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
