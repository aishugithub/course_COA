// Unit4_3.jsx — Module 4 › Unit 4.3 — "Cache Memory & Mapping"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: one-slot-vs-any-slot trade-off -> the three mapping techniques (with
// the notes' exact 512-line/16-word/24-bit worked numbers) -> a direct-mapped
// cache trace showing conflicts in action -> replacement & write policies ->
// quiz. Scaffolds on Unit4_1 (locality, why cache works) and Unit3_1 (cache
// already met as a pipeline stall source) WITHOUT repeating either — this
// unit is scoped strictly to mapping/replacement/write policy.
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
//  Section 1 — One Slot or Any Slot?
// ══════════════════════════════════════════════════════════════════
function NeedWidget() {
  const [mode, setMode] = useState(0); // 0 = one-slot, 1 = any-slot

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Unit 4.1 showed WHY a small cache works (locality). Now the hardware question: when a
        main-memory block needs to go into the cache, WHERE does it go — and how do we check if
        it's already there?
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <button onClick={() => setMode(0)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          border: `1px solid ${mode === 0 ? C.accent : C.border}`, background: mode === 0 ? C.accentGlow : "transparent",
          color: mode === 0 ? "#fff" : C.muted,
        }}>Every block gets ONE fixed slot</button>
        <button onClick={() => setMode(1)} style={{
          flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          border: `1px solid ${mode === 1 ? C.orange : C.border}`, background: mode === 1 ? C.orange + "22" : "transparent",
          color: mode === 1 ? C.orange : C.muted,
        }}>A block can go ANYWHERE</button>
      </div>

      {mode === 0 ? (
        <div style={{ background: C.card, border: `1.5px solid ${C.accent}44`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>✅ CHEAP TO CHECK — ❌ CAN COLLIDE</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            Look at ONE specific line — one comparison, done. But two different blocks that both
            want that same line will keep evicting each other, even while other lines sit empty.
            This is exactly <strong style={{ color: C.text }}>direct mapping</strong>.
          </div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1.5px solid ${C.orange}44`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>✅ NO COLLISIONS — ❌ EXPENSIVE TO CHECK</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            A block can sit in ANY line, so two blocks never fight over one slot. But now every
            single line's tag must be compared in parallel to find it — much more comparison
            hardware. This is <strong style={{ color: C.text }}>fully associative mapping</strong>.
          </div>
        </div>
      )}

      <Key>
        Neither extreme is free — one trades flexibility for speed of checking, the other trades
        speed of checking for flexibility. <strong style={{ color: C.text }}>Set-associative mapping</strong>,
        coming up next, is the compromise nearly every real cache actually uses.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Three Mapping Techniques (notes' exact worked numbers:
//  512 lines × 16 words/line, 4M-word / 24-bit main memory)
// ══════════════════════════════════════════════════════════════════
const SCHEMES = [
  { id: "direct", name: "Direct", fields: [["Tag", 11], ["Line", 9], ["Word", 4]], col: C.accent,
    desc: "(block address) mod (512 lines) picks ONE specific line. Simple, fast — but two blocks 512 lines apart always collide." },
  { id: "assoc", name: "Fully Associative", fields: [["Tag", 20], ["Word", 4]], col: C.orange,
    desc: "No line field at all — a block can live in any of the 512 lines. Every line's 20-bit tag is compared in parallel to find a match." },
  { id: "set", name: "Set-Associative (4-way)", fields: [["Tag", 13], ["Set", 7], ["Word", 4]], col: C.purple,
    desc: "512 lines grouped into 128 sets of 4. The set is fixed by the address, but within that set, a block can sit in any of the 4 lines — only those 4 tags get compared." },
];

function MappingTechniques() {
  const [sel, setSel] = useState("direct");
  const s = SCHEMES.find((x) => x.id === sel);
  const total = s.fields.reduce((a, [, b]) => a + b, 0);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Worked example kept consistent throughout this unit: a 512-line cache, 16 words per line,
        backed by a 4M-word (24-bit address) main memory. Click each technique to see how the
        24-bit address gets split.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {SCHEMES.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} style={{
            flex: 1, minWidth: 100, padding: "8px 6px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
            border: `1.5px solid ${sel === x.id ? x.col : C.border}`,
            background: sel === x.id ? x.col + "22" : C.card,
            color: sel === x.id ? x.col : C.muted,
          }}>{x.name}</button>
        ))}
      </div>

      <div style={{ display: "flex", marginBottom: 4, borderRadius: 8, overflow: "hidden", border: `1px solid ${s.col}66` }}>
        {s.fields.map(([label, bits], i) => (
          <div key={i} style={{
            flex: bits, padding: "12px 4px", textAlign: "center",
            background: i === 0 ? s.col + "33" : i === s.fields.length - 1 ? C.bg : s.col + "18",
            borderRight: i < s.fields.length - 1 ? `1px solid ${s.col}66` : "none",
          }}>
            <div style={{ fontSize: 11, color: C.text, fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{bits} bits</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: C.muted, marginBottom: 14 }}>total = {total} bits (matches the 24-bit address)</div>

      <div style={{ background: C.surface, border: `1px solid ${s.col}55`, borderRadius: 10, padding: "12px 16px", color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
        {s.desc}
      </div>

      <Key color={s.col}>
        Only the LINE/SET field changes across the three schemes — direct has a big line field and
        no choice; associative has none and full choice; set-associative splits the difference
        with a smaller set field plus a few lines of choice within each set.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace It: Direct-Mapped Collisions in Action
// ══════════════════════════════════════════════════════════════════
function DirectTrace() {
  // 4-line direct-mapped cache. line = block mod 4. Reference stream chosen
  // to force a collision: blocks 0 and 4 both map to line 0.
  const refs = [0, 1, 2, 4, 0, 6, 4];
  const [step, setStep] = useState(0);

  // Recompute cache state up to & including `step`.
  const lines = [null, null, null, null];
  let hits = 0, misses = 0;
  let lastEvent = null;
  for (let i = 0; i <= step; i++) {
    const blk = refs[i];
    const line = blk % 4;
    const wasHit = lines[line] === blk;
    if (wasHit) hits++; else { misses++; lastEvent = { blk, line, evicted: lines[line] }; lines[line] = blk; }
    if (i === step) lastEvent = wasHit ? { hit: true, blk, line } : { ...lastEvent, hit: false };
  }

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A tiny 4-line direct-mapped cache (line = block number mod 4). Step through this reference
        stream and watch block 4 evict block 0 — then get evicted right back.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {refs.map((r, i) => (
          <div key={i} style={{
            width: 36, height: 36, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, fontFamily: "monospace",
            border: `1.5px solid ${i === step ? C.accent : i < step ? C.border : C.border}`,
            background: i === step ? C.accent + "22" : i < step ? C.card : "transparent",
            color: i === step ? C.accent : i < step ? C.muted : C.muted + "88",
          }}>{r}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
        {lines.map((v, i) => {
          const justChanged = lastEvent && lastEvent.line === i;
          return (
            <div key={i} style={{
              padding: "10px 6px", borderRadius: 8, textAlign: "center",
              border: `1.5px solid ${justChanged ? (lastEvent.hit ? C.green : C.red) : C.border}`,
              background: justChanged ? (lastEvent.hit ? C.green + "18" : C.red + "18") : C.card,
            }}>
              <div style={{ fontSize: 10, color: C.muted }}>line {i}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: v === null ? C.muted : C.text }}>{v === null ? "—" : `blk ${v}`}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "10px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
        {lastEvent?.hit
          ? <span><strong style={{ color: C.green }}>HIT</strong> — block {lastEvent.blk} was already in line {lastEvent.line}.</span>
          : lastEvent?.evicted != null
            ? <span><strong style={{ color: C.red }}>MISS + EVICTION</strong> — block {lastEvent.blk} needed line {lastEvent.line}, which was holding block {lastEvent.evicted}. Block {lastEvent.evicted} is gone now.</span>
            : <span><strong style={{ color: C.orange }}>MISS (cold)</strong> — line {lastEvent?.line} was empty, block {lastEvent?.blk} moves in.</span>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: C.muted }}>Hits: <strong style={{ color: C.green }}>{hits}</strong> · Misses: <strong style={{ color: C.red }}>{misses}</strong></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: step === 0 ? C.muted + "66" : C.muted, cursor: step === 0 ? "default" : "pointer", fontSize: 12 }}>↺ Back</button>
          <button onClick={() => setStep((s) => Math.min(refs.length - 1, s + 1))} disabled={step === refs.length - 1} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: step === refs.length - 1 ? C.border : C.accentGlow, color: step === refs.length - 1 ? C.muted : "#fff", cursor: step === refs.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>Step ▶ ({step + 1}/{refs.length})</button>
        </div>
      </div>

      <Key color={C.red}>
        Blocks 0 and 4 are 4 lines apart, so <code style={{ color: C.text }}>0 mod 4 = 4 mod 4 = 0</code> —
        they're FORCED to fight over line 0, no matter how little else is going on. This exact
        weakness is what fully-associative and set-associative mapping exist to reduce.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Replacement & Write Policies
// ══════════════════════════════════════════════════════════════════
function Policies() {
  const [policy, setPolicy] = useState("lru");
  const seq = ["A", "B", "C", "A", "D"]; // access sequence into a 3-line set
  const [step, setStep] = useState(0);

  // Simulate FIFO and LRU independently up to `step` for a 3-slot set.
  function simulate(kind) {
    let slots = []; // order matters: front = oldest (FIFO) / least-recent (LRU)
    let evicted = null;
    for (let i = 0; i <= step; i++) {
      const x = seq[i];
      const idx = slots.indexOf(x);
      if (idx !== -1) {
        if (kind === "lru") { slots.splice(idx, 1); slots.push(x); } // move to MRU end
        evicted = null;
      } else {
        if (slots.length >= 3) { evicted = slots.shift(); } else evicted = null;
        slots.push(x);
      }
    }
    return { slots, evicted };
  }
  const res = simulate(policy);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Two independent decisions every cache must make. First: when a set is full, WHICH line
        gets evicted? Compare FIFO and LRU on the same access sequence into a 3-line set.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setPolicy("fifo")} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, border: `1px solid ${policy === "fifo" ? C.accent : C.border}`, background: policy === "fifo" ? C.accentGlow : "transparent", color: policy === "fifo" ? "#fff" : C.muted }}>FIFO</button>
        <button onClick={() => setPolicy("lru")} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, border: `1px solid ${policy === "lru" ? C.purple : C.border}`, background: policy === "lru" ? C.purple + "22" : "transparent", color: policy === "lru" ? C.purple : C.muted }}>LRU</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {seq.map((x, i) => (
          <div key={i} style={{ width: 34, height: 34, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, border: `1.5px solid ${i === step ? C.accent : C.border}`, background: i === step ? C.accent + "22" : i < step ? C.card : "transparent", color: i <= step ? C.text : C.muted + "88" }}>{x}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, textAlign: "center", border: `1px solid ${C.border}`, background: C.card }}>
            <div style={{ fontSize: 10, color: C.muted }}>slot {i}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{res.slots[i] || "—"}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, marginBottom: 16 }}>
        {res.evicted ? <span>Evicted: <strong style={{ color: C.red }}>{res.evicted}</strong> ({policy === "fifo" ? "it arrived first" : "it was used longest ago"})</span> : "No eviction yet."}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: step === 0 ? C.muted + "66" : C.muted, cursor: step === 0 ? "default" : "pointer", fontSize: 12 }}>↺ Back</button>
        <button onClick={() => setStep((s) => Math.min(seq.length - 1, s + 1))} disabled={step === seq.length - 1} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: step === seq.length - 1 ? C.border : C.accentGlow, color: step === seq.length - 1 ? C.muted : "#fff", cursor: step === seq.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>Step ▶ ({step + 1}/{seq.length})</button>
      </div>

      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        Second decision: when the CPU WRITES to a cached word, does main memory get updated
        immediately, or later?
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.accent}44`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>WRITE-THROUGH</div>
          <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>Every write goes to cache AND main memory immediately. Always consistent, but more memory traffic.</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.orange}44`, borderRadius: 10, padding: 14 }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>WRITE-BACK</div>
          <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>Write updates ONLY the cache, flagged "dirty". Main memory is updated later — only when that line is evicted.</div>
        </div>
      </div>

      <Key color={C.purple}>
        FIFO tracks arrival order; LRU tracks usage order — they can (and here, do) evict
        different lines for the identical access sequence. Write-back trades a small risk (data
        only in cache until eviction) for far less memory traffic than write-through.
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
      q: "In direct mapping, what determines which single cache line a main-memory block can occupy?",
      options: [
        "The programmer chooses at compile time",
        "(block address) mod (number of cache lines) — a fixed, one-and-only slot",
        "Whichever line was used least recently",
        "Blocks are placed randomly by the hardware",
      ],
      answer: 1,
      explain: "Direct mapping fixes exactly one candidate line per block via a modulo of the number of lines — cheap to check, but it's also the cause of unavoidable collisions.",
    },
    {
      q: "A 512-line, 16-word-per-line cache backs a 4M-word (24-bit address) main memory. In 4-way set-associative mapping, how many SETS are there, and how many bits select a set?",
      options: [
        "512 sets, 9 bits",
        "128 sets, 7 bits",
        "4 sets, 2 bits",
        "2048 sets, 11 bits",
      ],
      answer: 1,
      explain: "512 lines ÷ 4 lines-per-set = 128 sets, needing 7 bits (2⁷ = 128) to select one. The remaining bits split into a 13-bit tag and 4-bit word offset.",
    },
    {
      q: "Blocks 3 and 11 both need cache line 3 in an 8-line direct-mapped cache. What happens if a program keeps alternating references between them?",
      options: [
        "Nothing — direct-mapped caches never have this problem",
        "They repeatedly evict each other from line 3, even though other lines may be empty (thrashing)",
        "The cache automatically switches to fully-associative mode",
        "Both blocks are stored simultaneously in line 3",
      ],
      answer: 1,
      explain: "This is the classic weakness of direct mapping: two blocks that alias to the same line will keep evicting each other no matter how much unused capacity exists elsewhere.",
    },
    {
      q: "What is the key difference between write-through and write-back cache policies?",
      options: [
        "Write-through is slower to read from; write-back is faster to read from",
        "Write-through updates main memory on every write immediately; write-back updates it only when the dirty line is evicted",
        "Write-back only works with fully-associative caches",
        "There is no real difference — both mean the same thing",
      ],
      answer: 1,
      explain: "Write-through keeps cache and memory always in sync at the cost of more memory traffic. Write-back delays the memory update until eviction, cutting traffic but requiring a dirty bit.",
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
          {score === 4 ? "Perfect! Mapping, collisions, replacement and write policy are all solid." :
            score >= 2 ? "Good work! Replay the Direct-Mapped Trace — watch exactly which block gets evicted." :
              "Revisit 'The Three Mapping Techniques' and 'Trace It', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 4.3 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can now explain HOW a cache decides where a block goes, WHY collisions happen, and
            how replacement/write policies work.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 4.4 — Associative Memory.</strong>{" "}
            The full-associative search you just met is actually a whole memory technology of its own — built from content, not addresses.
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
export default function Unit4_3({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "One Slot or Any?" },
    { id: "mapping", label: "Three Techniques" },
    { id: "trace", label: "Trace It" },
    { id: "policies", label: "Replace & Write" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>❓ One Slot or Any Slot?</h3>
      <NeedWidget />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗺️ The Three Mapping Techniques</h3>
      <MappingTechniques />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔁 Trace It: Direct-Mapped Collisions</h3>
      <DirectTrace />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>♻️ Replacement &amp; Write Policies</h3>
      <Policies />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 4.3.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › UNIT 4.3</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Cache Memory &amp; Mapping</div>
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
