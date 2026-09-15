// Unit4_2.jsx — Module 4 › Unit 4.2 — "RAM & ROM Chips"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: open the "Main Memory" black box from Unit4_1's pyramid -> chip
// anatomy (decoder + cell array + control lines) -> SRAM vs DRAM (the two
// RAM technologies) -> the ROM family (five non-volatile variants) ->
// build a bigger module out of small chips -> quiz. Scaffolds on Unit1_4
// (byte-addressable memory, word length) and Unit4_1 (main memory's place
// in the hierarchy) without repeating either.
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
//  Section 2 — Anatomy of a Chip (click to reveal)
// ══════════════════════════════════════════════════════════════════
const PARTS = {
  addr: { name: "Address lines", col: C.teal, text: "10 address lines (A0–A9) can select 2¹⁰ = 1024 distinct locations. This is a 1K × 1 chip — 1024 locations, 1 bit each." },
  dec: { name: "Decoder", col: C.purple, text: "Converts the 10-bit binary address into exactly ONE active output line out of 1024 — that line \"wakes up\" one row of the cell array and no other." },
  cell: { name: "Cell array", col: C.accent, text: "A grid of 1024 tiny storage cells, one per address. The decoder's output line selects a single cell to be read from or written to." },
  cs: { name: "CS (Chip Select)", col: C.orange, text: "Chip Select — must be active or the chip ignores everything on its pins. Lets many chips share the same address/data wires without colliding." },
  rw: { name: "R/W̄ (Read/Write)", col: C.orange, text: "One control line decides direction: R/W̄ = 1 → read (chip drives data out); R/W̄ = 0 → write (chip accepts data in)." },
  data: { name: "Data line", col: C.green, text: "The single line carrying the 1 bit this chip is responsible for. A real memory word needs several of these chips side by side." },
};

function ChipAnatomy() {
  const [sel, setSel] = useState("addr");
  const p = PARTS[sel];

  const Chip = ({ id, label, x, y, w = 110 }) => (
    <button onClick={() => setSel(id)} style={{
      position: "absolute", left: x, top: y, width: w, padding: "8px 6px", borderRadius: 7, cursor: "pointer",
      border: `1.5px solid ${sel === id ? PARTS[id].col : C.border}`,
      background: sel === id ? PARTS[id].col + "22" : C.card,
      color: sel === id ? PARTS[id].col : C.text, fontSize: 11, fontWeight: 600, textAlign: "center",
    }}>{label}</button>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        This is the classic worked example: a 1K × 1 memory chip (1024 one-bit locations). Click
        each part to see what it does.
      </p>

      <div style={{ position: "relative", height: 230, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 14 }}>
        <Chip id="addr" label="A0..A9 (address)" x={10} y={95} />
        <Chip id="dec" label="Decoder" x={150} y={95} w={90} />
        <Chip id="cell" label="1024 × 1 cell array" x={265} y={70} w={130} />
        <Chip id="data" label="Data" x={420} y={95} w={70} />
        <Chip id="cs" label="CS" x={150} y={10} w={90} />
        <Chip id="rw" label="R/W̄" x={150} y={180} w={90} />
        <svg width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <line x1="120" y1="110" x2="150" y2="110" stroke={C.border} strokeWidth="2" />
          <line x1="240" y1="110" x2="265" y2="105" stroke={C.border} strokeWidth="2" />
          <line x1="395" y1="105" x2="420" y2="110" stroke={C.border} strokeWidth="2" />
        </svg>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${p.col}55`, borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ color: p.col, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{p.name}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{p.text}</div>
      </div>

      <Key color={C.teal}>
        The pattern generalizes: n address lines always select exactly one of 2ⁿ locations. Add
        more DATA lines (not address lines) side by side to widen each location beyond 1 bit.
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
