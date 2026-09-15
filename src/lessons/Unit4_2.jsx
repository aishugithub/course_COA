// Unit4_2.jsx — Module 4 › Unit 4.2 — "RAM & ROM Chips"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: open the "Main Memory" black box from Unit4_1's pyramid -> chip
// anatomy (decoder + cell array + control lines) -> SRAM vs DRAM (the two
// RAM technologies) -> the ROM family (five non-volatile variants) ->
// build a bigger module out of small chips -> quiz. Scaffolds on Unit1_4
// (byte-addressable memory, word length) and Unit4_1 (main memory's place
// in the hierarchy) without repeating either.
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
//  Section 1 — Why? Open the black box
// ══════════════════════════════════════════════════════════════════
function OpenTheBox() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Back in Unit 1.4, memory was a wall of numbered lockers — you give an address, you get a
        byte. That's true from the outside. But a real memory chip has to actually DO that with
        wires and transistors. Click to open the box.
      </p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <button onClick={() => setOpen((o) => !o)} style={{
          padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          border: `1px solid ${open ? C.orange : C.accent}`,
          background: (open ? C.orange : C.accent) + "18", color: open ? C.orange : C.accent,
        }}>{open ? "◀ Close the box" : "▶ Open the box"}</button>
      </div>

      {!open ? (
        <div style={{ background: C.card, border: `1.5px solid ${C.accent}44`, borderRadius: 10, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>OUTSIDE VIEW</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ color: C.text, fontFamily: "monospace", fontSize: 13 }}>address →</div>
            <div style={{ width: 90, height: 60, borderRadius: 8, background: C.accent + "22", border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: C.accent }}>MEMORY</div>
            <div style={{ color: C.text, fontFamily: "monospace", fontSize: 13 }}>→ data</div>
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1.5px solid ${C.orange}44`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 10, textAlign: "center" }}>INSIDE VIEW</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", fontSize: 12 }}>
            <span style={{ padding: "8px 10px", borderRadius: 6, background: C.teal + "22", border: `1px solid ${C.teal}`, color: C.teal }}>address lines</span>
            <span style={{ color: C.muted }}>→</span>
            <span style={{ padding: "8px 10px", borderRadius: 6, background: C.purple + "22", border: `1px solid ${C.purple}`, color: C.purple }}>decoder</span>
            <span style={{ color: C.muted }}>→</span>
            <span style={{ padding: "8px 10px", borderRadius: 6, background: C.accent + "22", border: `1px solid ${C.accent}`, color: C.accent }}>cell array</span>
            <span style={{ color: C.muted }}>→</span>
            <span style={{ padding: "8px 10px", borderRadius: 6, background: C.green + "22", border: `1px solid ${C.green}`, color: C.green }}>data lines</span>
          </div>
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: C.muted }}>+ control lines (CS, OE, WE) telling the chip whether to even respond, and whether to read or write</div>
        </div>
      )}

      <Key>
        The "black box" abstraction from Unit 1.4 was never a lie — it's just hiding a decoder and
        a grid of storage cells doing real, physical work every time you touch an address.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy of a Chip  (interactive animation)
// ──────────────────────────────────────────────────────────────────
//  This widget replaces the old static "click a label" diagram with a
//  living one that has TWO modes, chosen by a toggle at the top:
//
//    • "Explore parts" — click any part of the chip (address lines,
//      decoder, cell array, CS, R/W̄, data lines) to read what it does.
//      This preserves the glossary the section had before.
//
//    • "Run a cycle"   — pick an address (0–7) and Read or Write, then
//      Step (or Play) an animation that lights the signal path IN ORDER:
//         ① CS wakes the chip  →  ② the 3-to-8 decoder raises exactly
//         ONE word-line  →  ③ that word-line activates one row of cells
//         →  ④ the R/W̄ line sends the 4 bits OUT (read) or IN (write).
//      A WRITE is committed into the on-screen cell array, so a student
//      can write a value and then read it back — the payoff of the whole
//      section.
//
//  We deliberately shrink the chip to a tiny 8-word × 4-bit array
//  (3 address lines, a 3→8 decoder, 4 data lines) so every wire is
//  visible.  A real chip is the identical idea with thousands of rows —
//  the "n address lines select 2ⁿ locations" rule (used again in the
//  Build-a-Module section below) is exactly what scales this up.
//
//  How it fits the lesson: this is stage 2 of Unit4_2's six-section
//  tab strip ("Chip Anatomy"). It opens the black box that Section 1
//  ("Open the Box") teased, and its 8×4 cell array is the concrete
//  object the later "Build a Module" section stacks and lines up.
// ══════════════════════════════════════════════════════════════════

// Glossary text for each clickable part, shown in the info box in
// Explore mode. `col` is the highlight colour that part uses everywhere.
const PARTS = {
  addr: { name: "Address lines (A2 A1 A0)", col: C.teal,
    text: "The 3 address lines carry the binary number of the location you want. 3 lines select 2³ = 8 rows (0–7). The rule generalises: n address lines select exactly one of 2ⁿ locations." },
  dec: { name: "Decoder (3 → 8)", col: C.purple,
    text: "The decoder turns the 3-bit binary address into ONE active output. Binary 101 → decimal 5 → only word-line 5 goes high; the other seven stay low. That is how a plain number picks a single row." },
  cell: { name: "Cell array (8 × 4)", col: C.accent,
    text: "64 storage cells arranged as 8 words of 4 bits. The decoder's active word-line connects exactly one row of 4 cells to the data lines; every other row stays electrically disconnected." },
  cs: { name: "CS — Chip Select", col: C.orange,
    text: "The chip ignores its address and data pins entirely until CS is asserted. This is what lets many chips share the same address/data wires — only the selected chip answers." },
  rw: { name: "R/W̄ — Read / Write", col: C.orange,
    text: "One control line sets the direction. R/W̄ = 1 → READ: the selected cells drive their stored bits onto the data lines. R/W̄ = 0 → WRITE: the value on the data lines is forced into the selected cells." },
  data: { name: "Data lines (D3–D0)", col: C.green,
    text: "The 4 bit-lines carry one whole word in or out at the same time. The number of data lines is the word width — here 4 bits. To widen a word you add data lines, not address lines." },
};

function ChipAnatomy() {
  // ── Interaction state. React rule (see project workflow notes): every
  //    hook is declared here at the top level, never inside a branch,
  //    loop or nested function. ────────────────────────────────────────
  const [mode, setMode] = useState("explore");        // "explore" | "run"
  const [sel, setSel] = useState("addr");             // selected part (Explore mode)
  const [addr, setAddr] = useState(5);                // 0..7 : address to operate on
  const [op, setOp] = useState("read");               // "read" | "write"
  const [wbits, setWbits] = useState([1, 0, 1, 1]);   // [D3,D2,D1,D0] value to WRITE
  const [stage, setStage] = useState(0);              // 0..5 : animation progress
  const [playing, setPlaying] = useState(false);      // auto-advance flag

  // Live contents of the 8×4 memory; each word is [D3,D2,D1,D0].
  // Seeded with a readable pattern so the very first READ shows real bits.
  const [mem, setMem] = useState([
    [0, 0, 1, 1], [0, 1, 0, 1], [1, 1, 1, 0], [0, 1, 1, 0],
    [1, 0, 0, 1], [1, 0, 1, 1], [0, 0, 0, 1], [1, 1, 0, 0],
  ]);

  const bin = addr.toString(2).padStart(3, "0");      // address as a 3-bit string
  const readVal = mem[addr].join("");                 // what a READ would return
  const writeVal = wbits.join("");                    // what a WRITE would store

  // Advance to a stage. When the animation reaches the final stage of a
  // WRITE, commit the new bits into the addressed word so they persist
  // (a student can WRITE 1011 to row 5, then switch to READ and get 1011).
  const goToStage = (ns) => {
    if (ns >= 5 && op === "write") {
      setMem((m) => m.map((row, i) => (i === addr ? [...wbits] : row)));
    }
    setStage(ns);
  };

  // Auto-play: while `playing`, step forward every 1.1 s until the last
  // stage, then stop. The cleanup clears the pending timer whenever the
  // effect re-runs, so we never stack timers or advance after unmount.
  useEffect(() => {
    if (!playing) return;
    if (stage >= 5) { setPlaying(false); return; }
    const t = setTimeout(() => goToStage(stage + 1), 1100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, stage]);

  // Any change to the inputs rewinds the animation to idle so it always
  // replays cleanly from stage 0.
  const resetAnim = () => { setPlaying(false); setStage(0); };
  const pickAddr = (a) => { resetAnim(); setAddr(a); };
  const pickOp = (o) => { resetAnim(); setOp(o); };
  const flipBit = (i) => { resetAnim(); setWbits((b) => b.map((v, j) => (j === i ? (v ? 0 : 1) : v))); };
  const play = () => { if (stage >= 5) setStage(0); setPlaying(true); };
  const step = () => { setPlaying(false); goToStage(Math.min(5, stage + 1)); };

  // ── SVG layout constants. Coordinates are in "user units"; the viewBox
  //    scales the whole picture to whatever width the card gives it. ────
  const VB_W = 580, VB_H = 400;
  const DEC_X = 120, DEC_W = 54, DEC_TOP = 40, DEC_BOT = 344;   // decoder box
  const CELLS_X = 250, COL_W = 72, CELL_W = 62, CELL_H = 30;    // cell grid geometry
  const ROW_TOP = 44, ROW_H = 37;
  const rowY = (i) => ROW_TOP + i * ROW_H;          // top-left y of row i
  const rowC = (i) => rowY(i) + CELL_H / 2;         // vertical centre of row i
  const colX = (j) => CELLS_X + j * COL_W;          // left x of column j
  const colC = (j) => colX(j) + CELL_W / 2;         // horizontal centre of column j
  const DATA_Y = 352;                               // top y of the data-pin boxes

  // Is a part "asserted" (coloured)?  Explore mode → it's the selected
  // part; Run mode → the animation has reached the stage that turns it on.
  const isOn = (part) => {
    if (mode === "explore") return sel === part;
    switch (part) {
      case "cs": return stage >= 1;
      case "addr":
      case "dec": return stage >= 2;
      case "cell": return stage >= 3;
      case "rw":
      case "data": return stage >= 4;
      default: return false;
    }
  };
  // Is a part the one animating THIS exact step?  (adds the flowing-dash
  // or glow effect to just the active signal, for a sense of motion).
  const isPulse = (part) => {
    if (mode !== "run") return false;
    switch (part) {
      case "cs": return stage === 1;
      case "addr":
      case "dec": return stage === 2;
      case "cell": return stage === 3;
      case "rw":
      case "data": return stage === 4;
      default: return false;
    }
  };
  const partCol = (part, base = C.border) => (isOn(part) ? PARTS[part].col : base);

  // A word-line is drawn active only for the addressed row, once the
  // decoder has fired (stage ≥ 2). All other word-lines stay low.
  const wlOn = (i) => mode === "run" && i === addr && stage >= 2;
  const wlPulse = (i) => mode === "run" && i === addr && (stage === 2 || stage === 3);

  // Which rows are highlighted?  Run mode → the addressed row after the
  // word-line fires; Explore mode → the whole array when "cell" is picked.
  const rowActive = (i) =>
    mode === "run" ? (stage >= 3 && i === addr) : (sel === "cell");

  // Displayed value of one cell. During a WRITE's data step (stage 4) we
  // show the incoming bits already landing on the addressed row, for effect.
  const cellVal = (i, j) =>
    (op === "write" && mode === "run" && stage === 4 && i === addr) ? wbits[j] : mem[i][j];

  // Value shown at each data pin (bottom of the diagram). For a WRITE the
  // pins are YOUR input (always shown); for a READ they stay blank until
  // the cells drive them at stage 4.
  const pinVal = (j) => {
    if (op === "write") return wbits[j];
    if (mode === "run" && stage >= 4) return mem[addr][j];
    return "·";
  };

  // Narration under the diagram — the pedagogical spine of the animation.
  const narration = () => {
    const dir = op === "read" ? "1 → READ" : "0 → WRITE";
    switch (stage) {
      case 0: return `Address ${addr} (binary ${bin}) is on the address lines, but nothing happens yet — the chip stays idle until Chip Select is asserted. Pick Read or Write, then press Step (or Play).`;
      case 1: return `① Chip Select (CS) asserted — the chip wakes up and begins responding to its pins. Until now it ignored everything, which is how many chips share one bus.`;
      case 2: return `② The 3→8 decoder reads the address ${bin} and converts it to decimal ${addr}. It raises exactly ONE of its eight word-lines — line ${addr} — and holds the other seven low.`;
      case 3: return `③ Word-line ${addr} activates row ${addr}. Those 4 cells are now the only ones connected to the data lines; every other row is disconnected.`;
      case 4: return op === "read"
        ? `④ R/W̄ = ${dir}. The 4 selected cells drive their stored bits outward onto the data lines D3–D0.`
        : `④ R/W̄ = ${dir}. The 4 bits you placed on the data lines are forced inward, overwriting the selected cells.`;
      default: return op === "read"
        ? `✓ READ complete — the CPU reads ${readVal} from address ${addr}.`
        : `✓ WRITE complete — address ${addr} now holds ${writeVal}. Switch to Read and run it again to confirm.`;
    }
  };

  // Injected keyframes (self-contained, class names prefixed "ca-" so
  // they can't collide with anything else). One animates "current flow"
  // along a wire (moving dashes); the other softly pulses a box.
  const styleTag =
    "@keyframes ca-dash{to{stroke-dashoffset:-20}}" +
    ".ca-flow{stroke-dasharray:7 5;animation:ca-dash .55s linear infinite}" +
    "@keyframes ca-glow{0%,100%{opacity:.55}50%{opacity:1}}" +
    ".ca-pulse{animation:ca-glow .9s ease-in-out infinite}";

  // Small reusable button style for the control row.
  const ctrlBtn = (active, color) => ({
    padding: "7px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700,
    border: `1.5px solid ${active ? color : C.border}`,
    background: active ? color + "22" : C.card, color: active ? color : C.muted,
  });

  return (
    <div>
      <style>{styleTag}</style>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        Here is the chip with its lid off — shrunk to a tiny <strong style={{ color: C.text }}>8-word × 4-bit</strong> array
        so every wire is visible. <strong style={{ color: C.text }}>Explore</strong> the parts, or switch to <strong style={{ color: C.text }}>Run a cycle</strong> to
        watch a read or a write actually happen, step by step.
      </p>

      {/* Mode toggle: Explore parts  ↔  Run a cycle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setMode("explore")} style={{ ...ctrlBtn(mode === "explore", C.accent), flex: 1 }}>🔍 Explore parts</button>
        <button onClick={() => { setMode("run"); setStage(0); }} style={{ ...ctrlBtn(mode === "run", C.green), flex: 1 }}>▶ Run a read / write</button>
      </div>

      {/* The chip diagram. Wrapped so narrow phones can scroll it
          sideways instead of squashing the text to nothing. */}
      <div style={{ overflowX: "auto", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 14 }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" style={{ minWidth: 520, display: "block" }}>

          {/* ── CS (Chip Select) pin + wire down into the decoder top ── */}
          <g onClick={() => mode === "explore" && setSel("cs")} style={{ cursor: mode === "explore" ? "pointer" : "default" }}>
            <text x={DEC_X + DEC_W / 2} y={10} textAnchor="middle" fontSize="10" fontWeight="700" fill={partCol("cs", C.muted)}>CS</text>
            <line x1={DEC_X + DEC_W / 2} y1={14} x2={DEC_X + DEC_W / 2} y2={DEC_TOP}
              stroke={partCol("cs")} strokeWidth={isOn("cs") ? 2.5 : 1.5} className={isPulse("cs") ? "ca-flow" : ""} />
          </g>

          {/* ── Address lines A2 A1 A0 entering the decoder from the left ── */}
          <g onClick={() => mode === "explore" && setSel("addr")} style={{ cursor: mode === "explore" ? "pointer" : "default" }}>
            {[0, 1, 2].map((k) => {
              const y = 150 + k * 45;
              return (
                <g key={k}>
                  <text x={12} y={y - 6} fontSize="11" fontWeight="700" fill={partCol("addr", C.muted)}>A{2 - k} = {bin[k]}</text>
                  <line x1={70} y1={y} x2={DEC_X} y2={y}
                    stroke={partCol("addr")} strokeWidth={isOn("addr") ? 2.5 : 1.5} className={isPulse("addr") ? "ca-flow" : ""} />
                </g>
              );
            })}
          </g>

          {/* ── The decoder box (3 → 8) ── */}
          <g onClick={() => mode === "explore" && setSel("dec")} style={{ cursor: mode === "explore" ? "pointer" : "default" }}>
            <rect x={DEC_X} y={DEC_TOP} width={DEC_W} height={DEC_BOT - DEC_TOP} rx="6"
              fill={isOn("dec") ? C.purple + "22" : C.card} stroke={partCol("dec")} strokeWidth={isOn("dec") ? 2 : 1.5}
              className={isPulse("dec") ? "ca-pulse" : ""} />
            <text x={DEC_X + DEC_W / 2} y={188} textAnchor="middle" fontSize="12" fontWeight="800" fill={partCol("dec", C.muted)}>3→8</text>
            <text x={DEC_X + DEC_W / 2} y={204} textAnchor="middle" fontSize="9" fill={partCol("dec", C.muted)}>DECODER</text>
          </g>

          {/* ── The 4 data (bit) lines run vertically THROUGH the columns.
                 Drawn before the cells so the cells sit on top of them. ── */}
          {[0, 1, 2, 3].map((j) => (
            <line key={"bl" + j} x1={colC(j)} y1={rowY(0) - 10} x2={colC(j)} y2={DATA_Y - 4}
              stroke={isOn("data") ? C.green : C.border} strokeWidth={isOn("data") ? 2.5 : 1.2}
              className={isPulse("data") ? "ca-flow" : ""} />
          ))}

          {/* ── Word-lines: one per row, from the decoder's right edge to
                 the left of each row. Only the addressed line lights up. ── */}
          {mem.map((_, i) => (
            <line key={"wl" + i} x1={DEC_X + DEC_W} y1={rowC(i)} x2={CELLS_X} y2={rowC(i)}
              stroke={wlOn(i) ? C.purple : C.border} strokeWidth={wlOn(i) ? 2.5 : 1.2}
              className={wlPulse(i) ? "ca-flow" : ""} />
          ))}

          {/* ── The 8 × 4 cell array. Each row is a group; clicking any
                 cell selects the "cell array" glossary entry in Explore. ── */}
          {mem.map((row, i) => (
            <g key={"row" + i} onClick={() => mode === "explore" && setSel("cell")} style={{ cursor: mode === "explore" ? "pointer" : "default" }}>
              {rowActive(i) && (
                <rect x={CELLS_X - 4} y={rowY(i) - 3} width={COL_W * 3 + CELL_W + 8} height={CELL_H + 6} rx="6"
                  fill={C.accent + "18"} stroke={C.accent + "88"} strokeWidth="1" />
              )}
              {row.map((_, j) => (
                <g key={j}>
                  <rect x={colX(j)} y={rowY(i)} width={CELL_W} height={CELL_H} rx="4"
                    fill={rowActive(i) ? C.accent + "26" : C.card}
                    stroke={rowActive(i) ? C.accent : C.border} strokeWidth="1" />
                  <text x={colC(j)} y={rowC(i) + 4} textAnchor="middle" fontSize="13" fontWeight="700"
                    fill={rowActive(i) ? C.text : C.muted}>{cellVal(i, j)}</text>
                </g>
              ))}
              {/* Row index on the far right, brightened for the active row. */}
              <text x={colX(3) + CELL_W + 12} y={rowC(i) + 4} fontSize="10" fontWeight="700"
                fill={mode === "run" && i === addr ? C.accent : C.muted}>{i}</text>
            </g>
          ))}

          {/* ── Direction chevrons on each data line (only once data moves).
                 READ points DOWN toward the CPU pins; WRITE points UP into
                 the cells. ── */}
          {mode === "run" && stage >= 4 && [0, 1, 2, 3].map((j) => {
            const x = colC(j), y = 336;
            const pts = op === "read"
              ? `${x - 5},${y} ${x + 5},${y} ${x},${y + 7}`    // ▼ out to pins
              : `${x - 5},${y + 7} ${x + 5},${y + 7} ${x},${y}`; // ▲ into cells
            return <polygon key={"ch" + j} points={pts} fill={C.green} />;
          })}

          {/* ── Data pins D3..D0 at the bottom (the wires to the CPU). ── */}
          <g onClick={() => mode === "explore" && setSel("data")} style={{ cursor: mode === "explore" ? "pointer" : "default" }}>
            {[0, 1, 2, 3].map((j) => {
              const live = op === "write" || (mode === "run" && stage >= 4);
              return (
                <g key={"pin" + j}>
                  <rect x={colC(j) - 22} y={DATA_Y} width={44} height={26} rx="5"
                    fill={live ? C.green + "18" : C.card} stroke={live ? C.green : C.border} strokeWidth="1" />
                  <text x={colC(j)} y={DATA_Y + 10} textAnchor="middle" fontSize="8" fill={C.muted}>D{3 - j}</text>
                  <text x={colC(j)} y={DATA_Y + 22} textAnchor="middle" fontSize="13" fontWeight="700" fill={C.text}>{pinVal(j)}</text>
                </g>
              );
            })}
          </g>

          {/* ── R/W̄ control pill (top-right). Reflects the current op and
                 glows when it takes effect at the data step. ── */}
          <g onClick={() => mode === "explore" && setSel("rw")} style={{ cursor: mode === "explore" ? "pointer" : "default" }}>
            <rect x={368} y={8} width={196} height={22} rx="11"
              fill={isOn("rw") ? C.orange + "22" : C.card} stroke={partCol("rw")} strokeWidth={isOn("rw") ? 2 : 1.5}
              className={isPulse("rw") ? "ca-pulse" : ""} />
            <text x={466} y={23} textAnchor="middle" fontSize="10" fontWeight="700" fill={partCol("rw", C.muted)}>
              R/W̄ = {op === "read" ? "1 (READ)" : "0 (WRITE)"}
            </text>
          </g>
        </svg>
      </div>

      {/* ── Run-mode controls: address, operation, write bits, transport ── */}
      {mode === "run" && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
          {/* Address 0–7 */}
          <div style={{ marginBottom: 10 }}>
            <span style={{ color: C.muted, fontSize: 12, marginRight: 8 }}>Address:</span>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((a) => (
              <button key={a} onClick={() => pickAddr(a)} style={{
                width: 30, height: 28, marginRight: 4, borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700,
                border: `1.5px solid ${a === addr ? C.teal : C.border}`,
                background: a === addr ? C.teal + "22" : "transparent", color: a === addr ? C.teal : C.muted,
              }}>{a}</button>
            ))}
            <span style={{ color: C.teal, fontFamily: "monospace", fontSize: 12, marginLeft: 6 }}>= {bin}b</span>
          </div>

          {/* Operation Read / Write */}
          <div style={{ display: "flex", gap: 8, marginBottom: op === "write" ? 10 : 4 }}>
            <button onClick={() => pickOp("read")} style={{ ...ctrlBtn(op === "read", C.accent), flex: 1 }}>R/W̄ = 1 · READ</button>
            <button onClick={() => pickOp("write")} style={{ ...ctrlBtn(op === "write", C.orange), flex: 1 }}>R/W̄ = 0 · WRITE</button>
          </div>

          {/* Write payload: 4 toggleable bits (only when writing) */}
          {op === "write" && (
            <div style={{ marginBottom: 4 }}>
              <span style={{ color: C.muted, fontSize: 12, marginRight: 8 }}>Data to write:</span>
              {[0, 1, 2, 3].map((j) => (
                <button key={j} onClick={() => flipBit(j)} style={{
                  width: 40, marginRight: 4, padding: "5px 0", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${C.green}`, background: wbits[j] ? C.green + "22" : "transparent", color: wbits[j] ? C.green : C.muted,
                }}>
                  <span style={{ fontSize: 8, display: "block", color: C.muted }}>D{3 - j}</span>{wbits[j]}
                </button>
              ))}
              <span style={{ color: C.green, fontFamily: "monospace", fontSize: 12, marginLeft: 6 }}>= {writeVal}</span>
            </div>
          )}

          {/* Transport: Step / Play / Reset */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={step} disabled={stage >= 5} style={{
              ...ctrlBtn(false, C.accent), flex: 1, opacity: stage >= 5 ? 0.4 : 1, color: C.accent, borderColor: C.accent,
            }}>⏭ Step ({stage}/5)</button>
            <button onClick={play} disabled={playing} style={{
              ...ctrlBtn(playing, C.green), flex: 1, background: C.accentGlow, color: "#fff", borderColor: C.accentGlow, opacity: playing ? 0.6 : 1,
            }}>{playing ? "▶ Playing…" : "▶ Play"}</button>
            <button onClick={resetAnim} style={{ ...ctrlBtn(false, C.muted), color: C.muted }}>↺ Reset</button>
          </div>
        </div>
      )}

      {/* ── Info box: glossary text (Explore) or live narration (Run) ── */}
      {mode === "explore" ? (
        <div style={{ background: C.surface, border: `1px solid ${PARTS[sel].col}55`, borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ color: PARTS[sel].col, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{PARTS[sel].name}</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{PARTS[sel].text}</div>
        </div>
      ) : (
        <div style={{ background: C.surface, border: `1px solid ${(stage >= 5 ? C.green : C.accent)}55`, borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <span key={s} style={{
                width: 20, height: 5, borderRadius: 3,
                background: s <= stage ? (stage >= 5 ? C.green : C.accent) : C.border,
              }} />
            ))}
          </div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.65 }}>{narration()}</div>
        </div>
      )}

      <Key color={C.teal}>
        The pattern generalises: n address lines always select exactly one of 2ⁿ locations, and the
        R/W̄ line alone decides whether that location's bits flow OUT (read) or IN (write). Add more
        DATA lines — not address lines — to make each location wider than 4 bits.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — SRAM vs DRAM
// ══════════════════════════════════════════════════════════════════
function SramDram() {
  const [mode, setMode] = useState("sram");
  const [charge, setCharge] = useState(100);
  const isSram = mode === "sram";

  const tick = () => { if (!isSram) setCharge((c) => Math.max(0, c - 22)); };
  const refresh = () => setCharge(100);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        RAM (Random Access Memory — any address in equal time) comes in two flavours built from
        very different cells. Toggle between them, and for DRAM, watch what happens as time passes.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => { setMode("sram"); setCharge(100); }} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          border: `1px solid ${isSram ? C.accent : C.border}`, background: isSram ? C.accentGlow : "transparent",
          color: isSram ? "#fff" : C.muted,
        }}>SRAM (Static)</button>
        <button onClick={() => { setMode("dram"); setCharge(100); }} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          border: `1px solid ${!isSram ? C.orange : C.border}`, background: !isSram ? C.orange + "22" : "transparent",
          color: !isSram ? C.orange : C.muted,
        }}>DRAM (Dynamic)</button>
      </div>

      {isSram ? (
        <div style={{ background: C.card, border: `1.5px solid ${C.accent}44`, borderRadius: 10, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>🔁</div>
          <div style={{ color: C.accent, fontWeight: 700, marginBottom: 6 }}>A flip-flop cell (≈6 transistors)</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
            Two cross-coupled inverters HOLD their state as long as power is on — no decay, no
            refresh needed. Fast, but each cell costs several transistors, so SRAM is used in
            small quantities: cache, registers.
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1.5px solid ${C.orange}44`, borderRadius: 10, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 34 }}>🔋</div>
            <div>
              <div style={{ color: C.orange, fontWeight: 700 }}>A capacitor cell (1 transistor + 1 capacitor)</div>
              <div style={{ color: C.muted, fontSize: 12 }}>Stores a bit as CHARGE — which leaks away over time.</div>
            </div>
          </div>
          <div style={{ height: 14, borderRadius: 7, background: C.bg, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${charge}%`, background: charge > 40 ? C.green : charge > 15 ? C.yellow : C.red, transition: "width 0.3s" }} />
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginBottom: 12 }}>
            Charge remaining: <strong style={{ color: C.text }}>{charge}%</strong>{charge === 0 && " — bit LOST!"}
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button onClick={tick} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 13 }}>⏱ Let time pass</button>
            <button onClick={refresh} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: C.accentGlow, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>⚡ Refresh</button>
          </div>
        </div>
      )}

      <Key color={isSram ? C.accent : C.orange}>
        {isSram
          ? "SRAM: no refresh needed, faster, but bulkier and pricier per bit — this is what cache is built from."
          : "DRAM: needs its charge periodically REFRESHED (read and rewritten every few milliseconds) or bits decay to 0 — but 1 transistor per cell packs far more bits per chip for far less cost, which is why main memory is built from DRAM."}
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The ROM Family
// ══════════════════════════════════════════════════════════════════
const ROMS = [
  { id: "mask", name: "Mask ROM", write: "Programmed at the factory using a photographic mask", erase: "Never — fixed forever", use: "Ultra-high-volume fixed programs (old game cartridges, simple embedded logic)", col: C.muted },
  { id: "prom", name: "PROM", write: "Burned ONCE by the user with a special programmer (fuses blown)", erase: "Never — one-time programmable", use: "Small-batch custom firmware where mask ROM's setup cost isn't worth it", col: C.teal },
  { id: "eprom", name: "EPROM", write: "Electrically programmed by the user", erase: "Erased by shining UV light through a quartz window for several minutes", use: "Development/prototyping before locking in a final mask ROM", col: C.purple },
  { id: "eeprom", name: "EEPROM", write: "Electrically programmed, byte by byte", erase: "Erased electrically, byte by byte — no UV light, no removal from the circuit", use: "Small configuration/calibration data that occasionally needs updating", col: C.accent },
  { id: "flash", name: "Flash Memory", write: "Electrically programmed, block at a time", erase: "Erased electrically, in large blocks — much faster than byte-at-a-time EEPROM", use: "BIOS/firmware, SSDs, USB drives, phone/camera storage", col: C.green },
];

function RomFamily() {
  const [sel, setSel] = useState("flash");
  const r = ROMS.find((x) => x.id === sel);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        ROM (Read-Only Memory) is non-volatile — it survives power loss — but "read-only" turned
        out to mean different things over the decades. Click each variant.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {ROMS.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} style={{
            flex: 1, minWidth: 90, padding: "8px 6px", borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
            border: `1.5px solid ${sel === x.id ? x.col : C.border}`,
            background: sel === x.id ? x.col + "22" : C.card,
            color: sel === x.id ? x.col : C.muted,
          }}>{x.name}</button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${r.col}55`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ color: r.col, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{r.name}</div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: C.muted }}>HOW IT'S WRITTEN</div>
          <div style={{ fontSize: 13, color: C.text }}>{r.write}</div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: C.muted }}>HOW IT'S ERASED</div>
          <div style={{ fontSize: 13, color: C.text }}>{r.erase}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: C.muted }}>TYPICAL USE</div>
          <div style={{ fontSize: 13, color: C.text }}>{r.use}</div>
        </div>
      </div>

      <Key color={C.green}>
        The five variants are really one story: each generation made ROM easier to REWRITE — from
        "never" (mask ROM) to "once" (PROM) to "with UV light" (EPROM) to "electrically, byte by
        byte" (EEPROM) to "electrically, in fast blocks" (Flash) — the version now inside every SSD.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 5 — Build a Module
// ══════════════════════════════════════════════════════════════════
function BuildModule() {
  const [width, setWidth] = useState(1);   // chips stacked -> bits per word
  const [depth, setDepth] = useState(1);   // chip groups side by side -> address multiplier
  const baseK = 1; // each chip is 1K locations
  const totalWords = baseK * depth * 1024;
  const totalBits = totalWords * width;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        No single chip is big enough for a real machine. You build a bigger module by combining
        many 1K × 1 chips two ways: STACK them to widen each word, or LINE THEM UP to extend the
        address range. Try both sliders.
      </p>

      <div style={{ marginBottom: 14 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>Chips stacked (bits per word) = <strong style={{ color: C.accent }}>{width}</strong></label>
        <input type="range" min={1} max={8} value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>Chip groups side by side (× 1K words) = <strong style={{ color: C.orange }}>{depth}</strong></label>
        <input type="range" min={1} max={8} value={depth} onChange={(e) => setDepth(Number(e.target.value))} style={{ width: "100%", accentColor: C.orange }} />
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: 14, marginBottom: 14 }}>
        {Array.from({ length: depth }).map((_, d) => (
          <div key={d} style={{ display: "flex", gap: 4, marginBottom: 4, justifyContent: "center" }}>
            {Array.from({ length: width }).map((_, w) => (
              <div key={w} style={{
                width: 34, height: 26, borderRadius: 4, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center",
                background: C.teal + "18", border: `1px solid ${C.teal}66`, color: C.teal, fontWeight: 700,
              }}>1K×1</div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: 8, background: C.accent + "12", border: `1px solid ${C.accent}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Module size</div>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 800 }}>{depth}K × {width}</div>
        </div>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: 8, background: C.purple + "12", border: `1px solid ${C.purple}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Total bits</div>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 800 }}>{totalBits.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: 8, background: C.green + "12", border: `1px solid ${C.green}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Chips used</div>
          <div style={{ color: C.text, fontSize: 20, fontWeight: 800 }}>{width * depth}</div>
        </div>
      </div>

      <Key>
        Stacking chips (width) widens every word without touching the address decoder. Lining up
        chip groups (depth) extends the address range by adding a FEW more address bits to pick
        which group answers — a real memory module is just this idea scaled up to millions of chips.
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
      q: "A memory chip has 10 address lines. How many distinct locations can it select?",
      options: ["10", "100", "1024 (2¹⁰)", "20"],
      answer: 2,
      explain: "n address lines always select exactly one of 2ⁿ locations. 2¹⁰ = 1024 — this is exactly the 1K × 1 chip example.",
    },
    {
      q: "Why does DRAM need to be periodically refreshed, but SRAM does not?",
      options: [
        "DRAM is slower, so it needs extra time",
        "DRAM stores each bit as charge on a capacitor, which leaks away over time; SRAM's flip-flop cell holds its state as long as power is on",
        "SRAM is non-volatile; DRAM is volatile",
        "Refreshing is only needed for ROM, not RAM",
      ],
      answer: 1,
      explain: "A capacitor's charge decays, so DRAM must be read and rewritten every few milliseconds. SRAM's cross-coupled flip-flop needs no such refresh — it just needs power.",
    },
    {
      q: "Which ROM variant can be erased and rewritten electrically, byte by byte, without removing it from the circuit or using UV light?",
      options: ["Mask ROM", "PROM", "EPROM", "EEPROM"],
      answer: 3,
      explain: "EEPROM (Electrically Erasable PROM) erases and rewrites electrically at the byte level in-circuit. EPROM needs UV light removed from the circuit; PROM and Mask ROM can't be rewritten at all.",
    },
    {
      q: "You combine eight 1K × 1 chips by STACKING them (not lining them up). What do you get?",
      options: [
        "An 8K × 1 module (bigger address range, same word width)",
        "A 1K × 8 module (same address range, 8-bit-wide words)",
        "A 1K × 1 module (no change)",
        "An 8K × 8 module",
      ],
      answer: 1,
      explain: "Stacking chips widens each word (adds data lines) without changing the address range. Lining chips up side by side is what extends the address range instead.",
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
          {score === 4 ? "Perfect! Chip anatomy, SRAM/DRAM, ROM types, and modules are all solid." :
            score >= 2 ? "Good work! Replay the SRAM vs DRAM and ROM family sections." :
              "Revisit 'Chip Anatomy' and 'SRAM vs DRAM', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 4.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've opened up main memory itself — decoder, cell array, SRAM vs DRAM, the ROM family, and how modules scale.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 4.3 — Cache Memory &amp; Mapping.</strong>{" "}
            You already met cache as a stall-source in Module 3 — now see exactly HOW it decides what to hold.
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
export default function Unit4_2({ student, onUnitComplete }) {
  const sections = [
    { id: "open", label: "Open the Box" },
    { id: "anatomy", label: "Chip Anatomy" },
    { id: "sramdram", label: "SRAM vs DRAM" },
    { id: "rom", label: "ROM Family" },
    { id: "module", label: "Build a Module" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📦 What's Actually Inside "Main Memory"?</h3>
      <OpenTheBox />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔬 Anatomy of a Memory Chip</h3>
      <ChipAnatomy />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⚡ SRAM vs DRAM — two ways to hold a bit</h3>
      <SramDram />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>💾 The ROM Family</h3>
      <RomFamily />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🧩 Build a Bigger Module</h3>
      <BuildModule />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 4.2.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(5); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › UNIT 4.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>RAM &amp; ROM Chips</div>
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
