// Unit1_6.jsx — Module 1 › Unit 1.6 — "Addressing Modes"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: four honest answers (immediate/register/absolute/indirect) → index for
// arrays → autoincrement/decrement (walk data) → relative (PC-based, the bridge
// into Instruction Sequencing) → quiz.
// Scaffolds on Unit 1.5 (instructions & RISC/CISC); previews Unit 1.7 (sequencing).
// Hamacher §2.4–2.5. Textbook load/store machine: in RISC these memory modes ride
// on Load/Store only; arithmetic stays register-to-register.
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
//  Section 1 — Four Honest Answers (immediate / register / absolute / indirect)
// ══════════════════════════════════════════════════════════════════
function FourAnswers() {
  const modes = [
    { key: "imm", quote: "“Here — take it”", name: "Immediate", asm: "Move #5, R2", rtn: "R2 ← 5",
      body: "The value sits inside the instruction (marked with #). Perfect for loading a constant.", acc: 0, color: C.green },
    { key: "reg", quote: "“It’s in your pocket”", name: "Register", asm: "Add R4, R2, R3", rtn: "R4 ← [R2] + [R3]",
      body: "The operand is in a register — the effective address IS the register. The everyday RISC mode.", acc: 0, color: C.teal },
    { key: "abs", quote: "“In locker 1000”", name: "Absolute / Direct", asm: "Load R2, A", rtn: "R2 ← [A]",
      body: "The instruction gives the memory address outright. Exactly how C = A + B reached A, B and C.", acc: 1, color: C.accent },
    { key: "ind", quote: "“Read the note in locker 1000”", name: "Indirect", asm: "Load R2, (R5)", rtn: "R2 ← [[R5]]",
      body: "The given address points to ANOTHER address — a pointer. Follow it: two memory accesses.", acc: 2, color: C.purple },
  ];
  const [sel, setSel] = useState(0);
  const m = modes[sel];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Ask a friend to fetch something — there are four honest answers. Each is one <strong style={{ color: C.accent }}>addressing
        mode</strong>: how an instruction names <em>where its operand lives</em>. Click through them.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {modes.map((mode, i) => (
          <button key={mode.key} onClick={() => setSel(i)} style={{
            padding: "11px 10px", borderRadius: 9, cursor: "pointer", textAlign: "left",
            border: `1px solid ${sel === i ? mode.color : C.border}`,
            background: sel === i ? mode.color + "1e" : C.card,
          }}>
            <div style={{ color: mode.color, fontSize: 12.5, fontWeight: 700 }}>{mode.quote}</div>
            <div style={{ color: sel === i ? C.text : C.muted, fontSize: 11, marginTop: 2 }}>{mode.name}</div>
          </button>
        ))}
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${m.color}55`, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
          <div style={{ color: m.color, fontWeight: 700, fontSize: 15 }}>{m.name} <span style={{ color: C.muted, fontWeight: 400, fontSize: 12 }}>{m.quote}</span></div>
          <div style={{ fontSize: 11, color: m.acc === 0 ? C.green : m.acc === 1 ? C.yellow : C.red }}>
            {m.acc} memory access{m.acc === 1 ? "" : "es"}{m.acc === 0 ? " — fastest" : ""}
          </div>
        </div>
        {/* Assembly and its RTL meaning, each clearly LABELLED — never joined by
            a bare "→", which would read like an RTL transfer arrow it is not. */}
        <div style={{ margin: "10px 0", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ color: C.muted, fontSize: 9.5, width: 74, letterSpacing: 0.5, textTransform: "uppercase" }}>Assembly</span>
            <code style={{ fontFamily: "monospace", fontSize: 15, color: C.text }}>{m.asm}</code>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ color: C.muted, fontSize: 9.5, width: 74, letterSpacing: 0.5, textTransform: "uppercase" }}>Means (RTL)</span>
            <code style={{ fontFamily: "monospace", fontSize: 15, color: m.color }}>{m.rtn}</code>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{m.body}</div>
      </div>

      {/* live memory-access meter: 0, 0, 1, 2 across the four modes */}
      <div style={{ display: "flex", gap: 6, marginTop: 12, alignItems: "center" }}>
        <span style={{ color: C.muted, fontSize: 12 }}>Memory accesses:</span>
        {[0, 1, 2].map((slot) => (
          <div key={slot} style={{
            width: 26, height: 14, borderRadius: 4,
            background: slot < m.acc ? m.color : C.card, border: `1px solid ${slot < m.acc ? m.color : C.border}`,
          }} />
        ))}
        <span style={{ color: C.muted, fontSize: 12 }}>{m.acc === 0 ? "none — operand is right here" : m.acc === 1 ? "one lookup" : "two lookups (follow the pointer)"}</span>
      </div>

      <Key>
        The addressing mode is <strong style={{ color: C.text }}>how an instruction names where its operand lives</strong>.
        In our RISC machine these memory modes ride on <strong style={{ color: C.text }}>Load / Store</strong> only —
        arithmetic uses register &amp; immediate operands. In CISC they can ride on almost any instruction.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Index Mode (base + offset — made for arrays)
// ══════════════════════════════════════════════════════════════════
function IndexMode() {
  const base = 1000;                 // R5 fixed at the array's start
  const [offset, setOffset] = useState(20);
  const ea = base + offset;
  const elem = offset / 4;           // 4-byte elements

  const arr = [11, 22, 33, 44, 55, 66]; // values living at 1000,1004,...

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        <strong style={{ color: C.orange }}>Index mode</strong> computes the operand's address as
        <code style={{ color: C.teal }}> EA = offset + [base register]</code>. Fix the base at an array's start, then
        change the offset to step to any element. Written <code style={{ color: C.teal }}>Load R2, {offset}(R5)</code>.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ color: C.muted, fontSize: 12 }}>Base <strong style={{ color: C.text }}>R5 = {base}</strong></span>
        <span style={{ color: C.muted, fontSize: 12 }}>Offset:</span>
        <input type="range" min={0} max={20} step={4} value={offset} onChange={(e) => setOffset(+e.target.value)} style={{ flex: 1, minWidth: 130, accentColor: C.orange }} />
        <span style={{ fontFamily: "monospace", color: C.orange, fontWeight: 700 }}>{offset}</span>
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "12px 10px", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
          {arr.map((v, i) => {
            const addr = base + i * 4;
            const on = addr === ea;
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: on ? C.orange : C.muted }}>{addr}</div>
                <div style={{
                  width: 42, height: 42, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "monospace", fontWeight: 700, fontSize: 15,
                  background: on ? C.orange + "26" : C.card, border: `2px solid ${on ? C.orange : C.border}`,
                  color: on ? C.text : C.muted, transition: "all 0.2s",
                }}>{v}</div>
                <div style={{ fontSize: 8, color: on ? C.orange : "transparent" }}>▲ EA</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
        <code style={{ color: C.text }}>EA = {offset} + [R5] = {offset} + {base} = {ea}</code> → reaches
        <strong style={{ color: C.orange }}> element {elem}</strong> (value {arr[elem]}). Change the offset, hit any element —
        the loop counter becomes the offset.
      </div>

      <Key color={C.orange}>
        Index mode is <em>made for arrays</em>: one base register at the start, a varying offset for the element. Richer
        cousins add a second register — base-with-index <code style={{ color: C.text }}>(Ri, Rj)</code> and
        base+index+offset <code style={{ color: C.text }}>X(Ri, Rj)</code> — for records and 2-D data.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Autoincrement / Autodecrement (walk through data)
// ══════════════════════════════════════════════════════════════════
function AutoStep() {
  const base = 2000;
  const arr = [11, 22, 33, 44];
  const [mode, setMode] = useState("inc"); // inc = (R5)+  |  dec = -(R5)
  const [step, setStep] = useState(0);

  // (R5)+  : use [R5] as address, THEN R5 += 4  → visits 2000,2004,...
  // -(R5)  : FIRST R5 -= 4, then use [R5]       → visits from the top down
  const inc = mode === "inc";
  const idx = inc ? step : (arr.length - 1 - step);
  const done = step >= arr.length;
  const r5 = inc ? base + step * 4 : base + (arr.length - step) * 4;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Two modes update the pointer for you so a loop can march through data. <code style={{ color: C.teal }}>(R5)+</code>
        uses <code style={{ color: C.teal }}>[R5]</code> then does <code style={{ color: C.teal }}>R5 ← R5 + 4</code>;
        <code style={{ color: C.teal }}> −(R5)</code> decrements first, then uses it. Step through and watch R5 move.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["inc", "Autoincrement  (R5)+"], ["dec", "Autodecrement  −(R5)"]].map(([k, lbl]) => (
          <button key={k} onClick={() => { setMode(k); setStep(0); }} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 600, fontFamily: "monospace",
            border: `1px solid ${mode === k ? C.teal : C.border}`,
            background: mode === k ? C.teal + "22" : "transparent", color: mode === k ? C.teal : C.muted,
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px 10px", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {arr.map((v, i) => {
            const on = !done && i === idx;
            const addr = base + i * 4;
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: on ? C.teal : C.muted }}>{addr}</div>
                <div style={{
                  width: 46, height: 46, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "monospace", fontWeight: 700, fontSize: 16,
                  background: on ? C.teal + "26" : C.card, border: `2px solid ${on ? C.teal : C.border}`,
                  color: on ? C.text : C.muted,
                }}>{v}</div>
                <div style={{ fontSize: 9, color: on ? C.teal : "transparent" }}>R5 ▲</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 110, padding: "10px 12px", borderRadius: 8, background: C.teal + "12", border: `1px solid ${C.teal}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Pointer R5</div>
          <div style={{ color: C.text, fontFamily: "monospace", fontSize: 20, fontWeight: 800 }}>{done ? "—" : (inc ? base + step * 4 : r5)}</div>
        </div>
        <div style={{ flex: 2, minWidth: 170, padding: "10px 12px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12.5, display: "flex", alignItems: "center", lineHeight: 1.5 }}>
          {done ? "Walked the whole array — the pointer moved itself each step." :
            inc ? `Read element at ${base + step * 4}, then R5 += 4.` : `R5 −= 4 first, then read element at ${r5}.`}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setStep((s) => Math.min(arr.length, s + 1))} disabled={done} style={{
          flex: 1, padding: "10px", borderRadius: 8, cursor: done ? "default" : "pointer", fontSize: 13, fontWeight: 600,
          background: done ? C.card : C.accentGlow, border: "none", color: done ? C.muted : "#fff",
        }}>{done ? "Array walked ✓" : "Step →"}</button>
        <button onClick={() => setStep(0)} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 12 }}>↺</button>
      </div>

      <Key color={C.teal}>
        The pointer auto-updates, so one instruction inside a loop steps to the next element every pass — exactly what you
        need to sum an array. Hold onto this: it pairs with the loops you'll build in Unit 1.7.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Relative Mode (the PC is the base — bridge to sequencing)
// ══════════════════════════════════════════════════════════════════
function RelativeMode() {
  const pc = 208;                 // address of the branch instruction
  const [x, setX] = useState(-4); // signed offset stored in the branch
  const target = pc + x;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        <strong style={{ color: C.purple }}>Relative mode</strong> is just index mode where the base register is the
        <strong> PC</strong>: <code style={{ color: C.teal }}>EA = X + [PC]</code>. A branch doesn't store its target's full
        address — it stores the <em>offset</em> X from the current PC.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ color: C.muted, fontSize: 12 }}>Branch at <strong style={{ color: C.text }}>PC = {pc}</strong></span>
        <span style={{ color: C.muted, fontSize: 12 }}>Offset X:</span>
        <input type="range" min={-8} max={8} step={4} value={x} onChange={(e) => setX(+e.target.value)} style={{ flex: 1, minWidth: 130, accentColor: C.purple }} />
        <span style={{ fontFamily: "monospace", color: C.purple, fontWeight: 700 }}>{x >= 0 ? "+" + x : x}</span>
      </div>

      <svg viewBox="0 0 380 140" style={{ width: "100%", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
        {[200, 204, 208, 212, 216].map((addr, i) => {
          const y = 20 + i * 24;
          const isPc = addr === pc;
          const isTarget = addr === target;
          return (
            <g key={addr}>
              <text x={30} y={y + 4} fontSize={11} fontFamily="monospace" fill={isPc ? C.accent : isTarget ? C.purple : C.muted} textAnchor="end">{addr}</text>
              <rect x={40} y={y - 9} width={120} height={18} rx={4} fill={isTarget ? C.purple + "26" : isPc ? C.accent + "22" : C.card} stroke={isTarget ? C.purple : isPc ? C.accent : C.border} />
              <text x={48} y={y + 4} fontSize={10} fontFamily="monospace" fill={C.text}>
                {addr === pc ? "Branch>0 X" : addr === target ? "← target" : "…"}
              </text>
            </g>
          );
        })}
        {/* arrow from PC to target */}
        <path d={`M 170 ${20 + 2 * 24} Q 230 ${20 + 2 * 24 + (x / 4) * 24} 170 ${20 + (2 + x / 4) * 24}`} fill="none" stroke={C.purple} strokeWidth={2} markerEnd="url(#ah)" />
        <defs>
          <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={C.purple} /></marker>
        </defs>
        <text x={250} y={70} fontSize={11} fill={C.purple}>EA = X + [PC]</text>
        <text x={250} y={88} fontSize={13} fontFamily="monospace" fill={C.text}>= {x} + {pc} = {target}</text>
      </svg>

      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
        The branch stores just <code style={{ color: C.purple }}>{x >= 0 ? "+" + x : x}</code>, so the target is
        <code style={{ color: C.text }}> PC + X = {target}</code>. Because it's an offset, the whole block can be moved
        anywhere in memory and the branch still works — code becomes <strong style={{ color: C.text }}>relocatable</strong>.
      </div>

      <Key color={C.purple}>
        Relative addressing is exactly how a program jumps to another instruction — which is the whole question of the
        next unit. <strong style={{ color: C.text }}>That's the bridge: Unit 1.7 — Instruction Sequencing.</strong>
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Match the following (mode ↔ example) — the pre-quiz drill
// ══════════════════════════════════════════════════════════════════
function MatchGame() {
  // Left = addressing modes; right = one example each. rightId ties an example
  // back to its mode. The right column is shown in a deliberately jumbled order.
  const pairs = [
    { id: "imm", mode: "Immediate",       ex: "Move #5, R2" },
    { id: "reg", mode: "Register",        ex: "Add R4, R2, R3" },
    { id: "abs", mode: "Absolute / Direct", ex: "Load R2, A" },
    { id: "ind", mode: "Indirect",        ex: "Load R2, (R5)" },
    { id: "idx", mode: "Index",           ex: "Load R2, 20(R5)" },
    { id: "rel", mode: "Relative",        ex: "Branch>0 X(PC)" },
  ];
  const rightOrder = ["idx", "abs", "rel", "imm", "ind", "reg"]; // jumbled
  const rights = rightOrder.map((id) => pairs.find((p) => p.id === id));

  const [picked, setPicked] = useState(null);   // a left mode id awaiting a match
  const [matched, setMatched] = useState([]);   // ids correctly matched
  const [wrong, setWrong] = useState(null);     // {left, right} flashing red

  const clickLeft = (id) => {
    if (matched.includes(id)) return;
    setPicked(id); setWrong(null);
  };
  const clickRight = (id) => {
    if (matched.includes(id) || picked === null) return;
    if (picked === id) {
      setMatched((m) => [...m, id]); setPicked(null);
    } else {
      setWrong({ left: picked, right: id });
      setTimeout(() => setWrong(null), 600);
      setPicked(null);
    }
  };
  const reset = () => { setPicked(null); setMatched([]); setWrong(null); };
  const allDone = matched.length === pairs.length;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Before the quiz, a quick drill. Click an <strong style={{ color: C.accent }}>addressing mode</strong> on the left, then
        the <strong style={{ color: C.teal }}>example</strong> on the right that fits it. Correct pairs lock in green.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {/* left: modes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ color: C.muted, fontSize: 10, textAlign: "center", letterSpacing: 0.5 }}>ADDRESSING MODE</div>
          {pairs.map((p) => {
            const isMatched = matched.includes(p.id);
            const isPicked = picked === p.id;
            const isWrong = wrong && wrong.left === p.id;
            const col = isMatched ? C.green : isWrong ? C.red : isPicked ? C.accent : C.border;
            return (
              <button key={p.id} onClick={() => clickLeft(p.id)} disabled={isMatched} style={{
                padding: "10px 8px", borderRadius: 8, textAlign: "center", fontSize: 12.5, fontWeight: 600,
                cursor: isMatched ? "default" : "pointer",
                border: `1.5px solid ${col}`, background: isMatched ? C.green + "1e" : isPicked ? C.accent + "1e" : C.card,
                color: isMatched ? C.green : C.text, transition: "all 0.15s",
              }}>{isMatched ? "✓ " : ""}{p.mode}</button>
            );
          })}
        </div>
        {/* right: examples (jumbled) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ color: C.muted, fontSize: 10, textAlign: "center", letterSpacing: 0.5 }}>EXAMPLE</div>
          {rights.map((p) => {
            const isMatched = matched.includes(p.id);
            const isWrong = wrong && wrong.right === p.id;
            const col = isMatched ? C.green : isWrong ? C.red : C.border;
            return (
              <button key={p.id} onClick={() => clickRight(p.id)} disabled={isMatched} style={{
                padding: "10px 8px", borderRadius: 8, textAlign: "center", fontSize: 12.5, fontFamily: "monospace",
                cursor: isMatched ? "default" : "pointer",
                border: `1.5px solid ${col}`, background: isMatched ? C.green + "1e" : isWrong ? C.red + "1e" : C.card,
                color: isMatched ? C.green : C.text, transition: "all 0.15s",
              }}>{p.ex}</button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, height: 6, background: C.card, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(matched.length / pairs.length) * 100}%`, background: C.green, transition: "width 0.3s" }} />
        </div>
        <span style={{ color: C.muted, fontSize: 12 }}>{matched.length} / {pairs.length}</span>
        <button onClick={reset} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 12 }}>↺ Reset</button>
      </div>

      {allDone && (
        <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: C.green + "14", border: `1px solid ${C.green}55`, color: C.green, fontSize: 13, lineHeight: 1.6 }}>
          🎉 All six matched! Notice: <code style={{ fontFamily: "monospace" }}>#</code> = immediate,
          <code style={{ fontFamily: "monospace" }}> (Rn)</code> = indirect, <code style={{ fontFamily: "monospace" }}>X(Rn)</code> = index,
          and <code style={{ fontFamily: "monospace" }}>X(PC)</code> = relative. The notation gives the mode away.
        </div>
      )}

      <Key>
        Read the syntax and you can name the mode: a bare label is <strong style={{ color: C.text }}>absolute</strong>, a
        register is <strong style={{ color: C.text }}>register</strong>, <code style={{ fontFamily: "monospace" }}>#k</code> is
        <strong style={{ color: C.text }}> immediate</strong>, <code style={{ fontFamily: "monospace" }}>(Rn)</code> is
        <strong style={{ color: C.text }}> indirect</strong>, and <code style={{ fontFamily: "monospace" }}>X(Rn)</code> is
        <strong style={{ color: C.text }}> index</strong> (or <strong style={{ color: C.text }}>relative</strong> when the register is the PC).
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "What does an instruction's ADDRESSING MODE specify?",
      options: [
        "Which ALU operation to perform",
        "How the instruction names WHERE its operand is (constant, register, address, or pointer)",
        "The order instructions execute in",
        "How many bits are in a word",
      ],
      answer: 1,
      explain: "The addressing mode is how an instruction reaches its operand — immediate, register, absolute, indirect, index, and so on. It's about locating data, not choosing the operation.",
    },
    {
      q: "In which mode does the operand travel INSIDE the instruction, needing zero memory accesses?",
      options: ["Indirect", "Absolute / Direct", "Immediate (e.g. Move #5, R2)", "Index"],
      answer: 2,
      explain: "Immediate mode (marked with #) carries the value in the instruction itself — no memory lookup, which makes it the fastest way to supply a constant.",
    },
    {
      q: "Load R2, (R5) means R2 ← [[R5]]. How many memory accesses does this indirect mode take?",
      options: ["Zero", "One", "Two — follow the pointer, then read the operand", "Four"],
      answer: 2,
      explain: "Indirect follows a pointer: one access to read the address held via R5, a second to read the actual operand at that address. Two accesses total.",
    },
    {
      q: "With index mode Load R2, 20(R5) and R5 = 1000, what is the effective address?",
      options: ["20", "1000", "1020  (EA = offset + [base] = 20 + 1000)", "2000"],
      answer: 2,
      explain: "Index mode computes EA = offset + [base] = 20 + 1000 = 1020. Fix the base at the array start and vary the offset to reach any element.",
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
          {score === 4 ? "Perfect! You can pick the right mode to reach any operand." :
            score >= 2 ? "Good work! Replay 'Four Honest Answers' — watch the memory-access meter for each mode." :
              "Revisit the four core modes and the index widget, then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 1.6 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            Immediate, register, absolute, indirect, index, autoincrement/decrement, relative — you can now tell an
            instruction exactly where to find its data.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 1.7 — Instruction Sequencing.</strong>{" "}
            Relative mode already hinted at it — now we make the PC jump, loop, and branch to run a whole program.
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
          const isAns = i === q.answer;
          const isPick = i === selected;
          let bg = "transparent", bd = C.border, col = C.text;
          if (selected !== null) {
            if (isAns) { bg = C.green + "22"; bd = C.green; col = C.green; }
            else if (isPick) { bg = C.red + "22"; bd = C.red; col = C.red; }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={selected !== null} style={{
              textAlign: "left", padding: "11px 14px", borderRadius: 8,
              background: bg, border: `1px solid ${bd}`, color: col,
              cursor: selected === null ? "pointer" : "default", fontSize: 13.5, lineHeight: 1.5,
            }}>{opt}{selected !== null && isAns ? "  ✓" : ""}</button>
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
//  Main
// ══════════════════════════════════════════════════════════════════
export default function Unit1_6({ student, onUnitComplete }) {
  const sections = [
    { id: "four", label: "Four Answers" },
    { id: "index", label: "Index (Arrays)" },
    { id: "auto", label: "Auto ± Walk" },
    { id: "rel", label: "Relative" },
    { id: "match", label: "Match the Mode" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🙋 Four Honest Answers — where is the operand?</h3>
      <FourAnswers />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📚 Index Mode — base + offset, made for arrays</h3>
      <IndexMode />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🚶 Autoincrement / Autodecrement — walk the data</h3>
      <AutoStep />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🧭 Relative Mode — the PC is the base</h3>
      <RelativeMode />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔗 Match the Mode — spot it from the syntax</h3>
      <MatchGame />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 1.6.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎯</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.6</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Addressing Modes</div>
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
