// Unit1_4.jsx — Module 1 › Unit 1.4 — "Memory Locations & Addresses"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: bit→byte→word (three quantities) → what IS a word (word length) →
// byte-addressable lockers → big-endian vs little-endian → quiz.
// Scaffolds on Unit 1.3 (the data bus moves "a word" — now we define it).
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
//  Section 1 — Three Quantities: bit → byte → word
// ══════════════════════════════════════════════════════════════════
function BitByteWord() {
  const [level, setLevel] = useState(0); // 0 bit, 1 byte, 2 word

  const bits = [1, 0, 1, 1, 0, 0, 1, 0]; // one byte's worth
  const levels = [
    { name: "Bit", desc: "The atom of information — a single 0 or 1. One wire, one switch, one answer.", show: 1 },
    { name: "Byte", desc: "8 bits grouped together. The standard chunk memory is measured in — enough for one character.", show: 8 },
    { name: "Word", desc: "Several bytes the CPU naturally handles at once. On a 32-bit machine, 1 word = 4 bytes.", show: 32 },
  ];
  const cur = levels[level];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Memory measures information in three nested quantities. Step up the ladder and watch the pieces group together.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {levels.map((l, i) => (
          <button key={i} onClick={() => setLevel(i)} style={{
            flex: 1, padding: "9px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            border: `1px solid ${level === i ? C.accent : C.border}`,
            background: level === i ? C.accentGlow : "transparent",
            color: level === i ? "#fff" : C.muted,
          }}>{l.name}</button>
        ))}
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "18px 14px", minHeight: 120 }}>
        {level === 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
            <div style={{ width: 46, height: 46, borderRadius: 8, background: C.teal + "22", border: `2px solid ${C.teal}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: C.teal }}>1</div>
            <span style={{ color: C.muted, fontSize: 13 }}>…or a 0. That's the whole vocabulary.</span>
          </div>
        )}
        {level === 1 && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
              {bits.map((b, i) => (
                <div key={i} style={{ width: 34, height: 40, borderRadius: 6, background: C.teal + "18", border: `1px solid ${C.teal}66`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.teal }}>{b}</div>
              ))}
            </div>
            <div style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 8 }}>8 bits = 1 byte = <code style={{ color: C.text }}>0xB2</code> = the letter '²' or number 178</div>
          </div>
        )}
        {level === 2 && (
          <div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              {[0, 1, 2, 3].map((k) => (
                <div key={k} style={{ display: "flex", gap: 2, padding: 5, borderRadius: 7, border: `1px solid ${C.purple}66`, background: C.purple + "12" }}>
                  {bits.map((b, i) => (
                    <div key={i} style={{ width: 14, height: 26, borderRadius: 3, background: C.purple + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.purple }}>{b}</div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 8 }}>4 bytes = 32 bits = 1 word (on a 32-bit machine)</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
        <strong style={{ color: C.text }}>{cur.name}</strong> — {cur.desc}
      </div>

      <Key>
        <strong style={{ color: C.text }}>Bit</strong> ⊂ <strong style={{ color: C.text }}>Byte</strong> (8 bits) ⊂
        <strong style={{ color: C.text }}> Word</strong> (a few bytes). Bytes are the fixed unit; a "word" is
        machine-specific — it's however many bytes that CPU chews at once.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — What is a Word (word length)
// ══════════════════════════════════════════════════════════════════
function WordLength() {
  const sizes = [8, 16, 32, 64];
  const [idx, setIdx] = useState(2);
  const bitsN = sizes[idx];
  const bytesN = bitsN / 8;
  const range = "2" + ["⁸", "¹⁶", "³²", "⁶⁴"][idx];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A <strong style={{ color: C.accent }}>word</strong> is the natural bundle of bits a processor works with in one
        go — and (from Unit 1.3) it's usually the width of the data bus. Slide through common word lengths.
      </p>

      <input type="range" min={0} max={3} value={idx} onChange={(e) => setIdx(+e.target.value)} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ display: "flex", justifyContent: "space-between", color: C.muted, fontSize: 11, marginBottom: 14 }}>
        {sizes.map((s) => <span key={s} style={{ color: sizes[idx] === s ? C.accent : C.muted, fontWeight: sizes[idx] === s ? 700 : 400 }}>{s}-bit</span>)}
      </div>

      <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, padding: "14px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
          {Array.from({ length: bytesN }).map((_, i) => (
            <div key={i} style={{ width: 40, height: 34, borderRadius: 6, background: C.teal + "18", border: `1px solid ${C.teal}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: C.teal, fontWeight: 700 }}>byte</div>
          ))}
        </div>
        <div style={{ textAlign: "center", color: C.muted, fontSize: 12, marginTop: 8 }}>{bitsN}-bit word = {bytesN} byte{bytesN > 1 ? "s" : ""} moved together</div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 140, padding: "12px 14px", borderRadius: 8, background: C.accent + "12", border: `1px solid ${C.accent}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Bytes per word</div>
          <div style={{ color: C.text, fontSize: 26, fontWeight: 800 }}>{bytesN}</div>
        </div>
        <div style={{ flex: 1, minWidth: 140, padding: "12px 14px", borderRadius: 8, background: C.purple + "12", border: `1px solid ${C.purple}44`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 11 }}>Distinct values it can hold</div>
          <div style={{ color: C.text, fontSize: 26, fontWeight: 800 }}>{range}</div>
        </div>
      </div>

      <Key color={C.accent}>
        Word length is a <em>design choice</em>: bigger words move more data per transfer and can name more memory, but
        cost more wires. "32-bit" and "64-bit" machines are literally named after their word length.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Byte-Addressable Memory (the locker wall)
// ══════════════════════════════════════════════════════════════════
function LockerWall() {
  const [sel, setSel] = useState(null);      // a single clicked byte address
  const [wordAt, setWordAt] = useState(null); // start address of a highlighted word

  const contents = ["48", "65", "6C", "6C", "6F", "21", "00", "1A", "2B", "3C", "4D", "5E", "6F", "70", "81", "92"];

  const inWord = (a) => wordAt !== null && a >= wordAt && a < wordAt + 4;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Memory is a wall of numbered lockers. In a <strong style={{ color: C.accent }}>byte-addressable</strong> machine
        every single byte has its own address: 0, 1, 2, 3… Click a locker to read <em>one</em> byte.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 5, marginBottom: 12 }}>
        {contents.map((v, a) => {
          const isSel = sel === a, hl = inWord(a);
          return (
            <button key={a} onClick={() => { setSel(a); setWordAt(null); }} style={{
              padding: "8px 2px", borderRadius: 7, cursor: "pointer",
              border: `1px solid ${isSel ? C.green : hl ? C.orange : C.border}`,
              background: isSel ? C.green + "22" : hl ? C.orange + "18" : C.card,
              color: C.text,
            }}>
              <div style={{ fontSize: 9, color: isSel ? C.green : hl ? C.orange : C.muted }}>addr {a}</div>
              <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>{v}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {[0, 4, 8, 12].map((a) => (
          <button key={a} onClick={() => { setWordAt(a); setSel(null); }} style={{
            padding: "7px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12,
            border: `1px solid ${wordAt === a ? C.orange : C.border}`,
            background: wordAt === a ? C.orange + "22" : "transparent", color: wordAt === a ? C.orange : C.muted,
          }}>Read word at addr {a}</button>
        ))}
      </div>

      <div style={{ padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, minHeight: 46, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
        {sel !== null ? (
          <span>Byte at <strong style={{ color: C.green }}>address {sel}</strong> = <code style={{ color: C.text }}>0x{contents[sel]}</code>. One address → exactly one byte.</span>
        ) : wordAt !== null ? (
          <span>A 4-byte word starts at <strong style={{ color: C.orange }}>address {wordAt}</strong> and spans {wordAt}–{wordAt + 3}. The word's address is the address of its <strong>first</strong> byte.</span>
        ) : (
          <span>Click a locker for one byte, or grab a whole 4-byte word.</span>
        )}
      </div>

      <Key color={C.orange}>
        Byte-addressable = every byte owns a unique address. A multi-byte word simply occupies several consecutive
        addresses, and we name the word by its lowest (first) address.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Big-Endian vs Little-Endian
// ══════════════════════════════════════════════════════════════════
function Endianness() {
  const [hex, setHex] = useState("12345678");
  const [little, setLittle] = useState(false);

  const clean = hex.replace(/[^0-9a-fA-F]/g, "").padStart(8, "0").slice(-8).toUpperCase();
  const bytes = [clean.slice(0, 2), clean.slice(2, 4), clean.slice(4, 6), clean.slice(6, 8)]; // MSB..LSB
  const labels = ["MSB", "", "", "LSB"];
  // big-endian: addr0 gets MSB (bytes[0]).  little-endian: addr0 gets LSB (bytes[3]).
  const layout = little ? [...bytes].reverse() : bytes;
  const layoutLabels = little ? [...labels].reverse() : labels;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        A word needs several bytes — but in <em>which order</em> do they sit across the addresses? Two conventions
        exist. Type a 32-bit value and flip the switch to see the same number laid out two ways.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <span style={{ color: C.muted, fontSize: 13 }}>0x</span>
        <input value={hex} onChange={(e) => setHex(e.target.value)} maxLength={8} style={{
          fontFamily: "monospace", fontSize: 16, letterSpacing: 2, padding: "8px 12px", borderRadius: 8,
          background: C.bg, border: `1px solid ${C.border}`, color: C.text, width: 150,
        }} />
        <button onClick={() => setLittle((v) => !v)} style={{
          padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          border: `1px solid ${little ? C.orange : C.accent}`,
          background: (little ? C.orange : C.accent) + "22", color: little ? C.orange : C.accent,
        }}>{little ? "Little-endian" : "Big-endian"}</button>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
        {layout.map((b, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>addr {i}</div>
            <div style={{
              width: 56, height: 56, borderRadius: 10, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: (little ? C.orange : C.accent) + "18", border: `2px solid ${little ? C.orange : C.accent}`,
              transition: "all 0.3s",
            }}>
              <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 18, color: C.text }}>{b}</span>
              <span style={{ fontSize: 8, color: little ? C.orange : C.accent }}>{layoutLabels[i]}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", color: C.muted, fontSize: 12, marginBottom: 12 }}>lower address ⟶ higher address</div>

      <div style={{ padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
        {little
          ? <span><strong style={{ color: C.orange }}>Little-endian:</strong> the <em>least</em>-significant byte (<code style={{ color: C.text }}>0x{bytes[3]}</code>) goes to the lowest address. Used by x86.</span>
          : <span><strong style={{ color: C.accent }}>Big-endian:</strong> the <em>most</em>-significant byte (<code style={{ color: C.text }}>0x{bytes[0]}</code>) goes to the lowest address — the way we write numbers. Used by many network protocols.</span>}
      </div>

      <Key color={C.orange}>
        Same 32-bit value, same bytes — only the <strong style={{ color: C.text }}>address order</strong> differs.
        Big-endian: MSB at the lowest address. Little-endian: LSB at the lowest address. Both are correct; machines
        just have to agree.
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
      q: "How many bits are in one byte, and how does a word relate to bytes?",
      options: [
        "A byte is 4 bits; a word is always 2 bytes",
        "A byte is 8 bits; a word is a machine-specific group of several bytes",
        "A byte is 16 bits; a word is always 1 byte",
        "A byte and a word are the same size on every machine",
      ],
      answer: 1,
      explain: "A byte is fixed at 8 bits. A word is however many bytes that particular CPU handles at once — 4 bytes on a 32-bit machine, 8 on a 64-bit machine.",
    },
    {
      q: "In a byte-addressable memory, what does a single address identify?",
      options: [
        "One bit",
        "One byte (8 bits)",
        "One full word",
        "One whole row of memory",
      ],
      answer: 1,
      explain: "Byte-addressable means every byte has its own address. A word just occupies several consecutive byte-addresses and is named by its first (lowest) one.",
    },
    {
      q: "The value 0x12345678 is stored big-endian. Which byte sits at the LOWEST address?",
      options: ["0x78 (the LSB)", "0x12 (the MSB)", "0x34", "It is split across all four equally"],
      answer: 1,
      explain: "Big-endian puts the MOST-significant byte (0x12) at the lowest address — the 'big end' first, just like we write numbers left-to-right.",
    },
    {
      q: "What is the ONLY difference between big-endian and little-endian storage of the same word?",
      options: [
        "The number of bytes used",
        "The value of the number itself",
        "The order in which the bytes are placed across the addresses",
        "Whether the machine is 32-bit or 64-bit",
      ],
      answer: 2,
      explain: "Same value, same bytes — only the ordering across addresses changes. Big-endian = MSB first; little-endian = LSB first.",
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
          {score === 4 ? "Perfect! Bits, bytes, words and addresses are all straight now." :
            score >= 2 ? "Good work! Replay the endianness switch — watch WHICH byte lands at address 0." :
              "Revisit 'Byte-Addressable Memory' and the endianness widget, then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 1.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can name any byte in memory and lay a word out two ways. Addresses are now real places you can point at.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 1.5 — Memory Operations &amp; Instructions.</strong>{" "}
            Now that we can name a location, how do we <em>tell the machine</em> to read it, write it, or add it — in RTN and in assembly?
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
export default function Unit1_4({ student, onUnitComplete }) {
  const sections = [
    { id: "bbw", label: "Bit·Byte·Word" },
    { id: "word", label: "What's a Word" },
    { id: "lockers", label: "Byte-Addressable" },
    { id: "endian", label: "Endianness" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🧱 Three Quantities — bit, byte, word</h3>
      <BitByteWord />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📏 What Is a Word — the CPU's natural bundle</h3>
      <WordLength />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🗄️ Byte-Addressable Memory — a wall of lockers</h3>
      <LockerWall />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔀 Big-Endian vs Little-Endian — which byte goes first?</h3>
      <Endianness />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 1.4.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 1 › UNIT 1.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Memory Locations &amp; Addresses</div>
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
