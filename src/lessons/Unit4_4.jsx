// Unit4_4.jsx — Module 4 › Unit 4.4 — "Associative Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: search-by-content vs search-by-address (the need) -> anatomy (A / K /
// array / M registers) -> the notes' exact masked-comparison worked example,
// made interactive -> tag register for write/delete -> quiz. Scaffolds on
// Unit4_3 (fully-associative cache already showed "compare every line's tag
// in parallel" — this unit reveals that associative memory IS that idea,
// built as its own standalone technology).
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
//  Section 1 — Search by Content, Not Address
// ══════════════════════════════════════════════════════════════════
function NeedWidget() {
  const [n, setN] = useState(6);
  const table = Array.from({ length: n }, (_, i) => i);
  const target = n - 1; // worst case: the item you want is last

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        You're searching a table for one specific item, but you don't know its address — only
        what it CONTAINS. Drag the slider and compare a normal address-by-address search against
        looking it up by content.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>table size = <strong style={{ color: C.accent }}>{n}</strong> entries</label>
        <input type="range" min={2} max={12} value={n} onChange={(e) => setN(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>❌ SEQUENTIAL, BY ADDRESS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
            {table.map((i) => <div key={i} style={{ width: 18, height: 18, borderRadius: 3, background: i === target ? C.red + "44" : C.card, border: `1px solid ${C.red}66`, fontSize: 8, color: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>{i}</div>)}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>Worst case: check address 0, 1, 2… up to <strong style={{ color: C.red }}>{n}</strong> comparisons, one at a time.</div>
        </div>
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>✅ ASSOCIATIVE, BY CONTENT</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
            {table.map((i) => <div key={i} style={{ width: 18, height: 18, borderRadius: 3, background: C.green + "22", border: `1px solid ${C.green}66`, fontSize: 8, color: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>{i}</div>)}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>Every entry is compared SIMULTANEOUSLY, in parallel — always <strong style={{ color: C.green }}>1</strong> step, no matter how big <code style={{ color: C.text }}>n</code> gets.</div>
        </div>
      </div>

      <Key>
        A memory unit that's accessed by the CONTENT of the data, rather than its address, is
        called <strong style={{ color: C.text }}>associative memory</strong> or <strong style={{ color: C.text }}>content-addressable memory (CAM)</strong>.
        The parallel comparison hardware costs more per bit — which is exactly why it's reserved
        for cases (like a fully-associative cache tag check) where search time is critical.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy: A, K, Array, M
// ══════════════════════════════════════════════════════════════════
const PARTS = {
  a: { name: "Argument Register (A)", col: C.accent, text: "Holds the word you're searching FOR. This is what gets compared against every stored word." },
  k: { name: "Key Register (K)", col: C.orange, text: "A mask: a 1 in position j means \"compare this bit\"; a 0 means \"ignore this bit, treat it as an automatic match.\" All-1s = compare the whole word." },
  arr: { name: "Memory Array (m words × n bits)", col: C.purple, text: "The actual storage — m words, n bits each. No address is ever given to read it; every word is compared to A at once, in parallel." },
  m: { name: "Match Register (M)", col: C.green, text: "One bit per stored word. After comparison, Mᵢ = 1 for every word i whose UNMASKED bits all matched A — those words are then read out." },
};

function Anatomy() {
  const [sel, setSel] = useState("a");
  const p = PARTS[sel];
  const Box = ({ id, x, y, w, h = 50 }) => (
    <button onClick={() => setSel(id)} style={{
      position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 8, cursor: "pointer",
      border: `1.5px solid ${sel === id ? PARTS[id].col : C.border}`,
      background: sel === id ? PARTS[id].col + "22" : C.card,
      color: sel === id ? PARTS[id].col : C.text, fontSize: 11, fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 4,
    }}>{PARTS[id].name.split(" (")[0]}</button>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Four pieces make up associative memory. Click each to see its job.
      </p>

      <div style={{ position: "relative", height: 190, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 14 }}>
        <Box id="a" x={10} y={15} w={130} />
        <Box id="k" x={10} y={125} w={130} />
        <Box id="arr" x={175} y={15} w={150} h={125} />
        <Box id="m" x={355} y={70} w={110} />
      </div>

      <div style={{ background: C.surface, border: `1px solid ${p.col}55`, borderRadius: 10, padding: "12px 16px" }}>
        <div style={{ color: p.col, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{p.name}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{p.text}</div>
      </div>

      <Key color={C.teal}>
        Notice there's no address input anywhere in this picture. To READ, you supply CONTENT (A
        and K) and get back a set of matching words via M — a completely different access model
        from ordinary RAM.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Masked Comparison (the notes' exact worked example, interactive)
// ══════════════════════════════════════════════════════════════════
const WORDS = [
  { label: "Word 1", bits: "100111100" },
  { label: "Word 2", bits: "101000001" },
];

function MaskedCompare() {
  // A = 101111100, K = 111000000 in the notes. Let the learner toggle K's
  // first 3 bits to see the match logic respond live.
  const A = "101111100";
  const [k, setK] = useState([1, 1, 1, 0, 0, 0, 0, 0, 0]);

  const toggleK = (i) => setK((prev) => prev.map((b, j) => (j === i ? 1 - b : b)));

  function matches(word) {
    for (let i = 0; i < A.length; i++) {
      if (k[i] === 1 && A[i] !== word[i]) return false;
    }
    return true;
  }

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The classic worked example. A = <code style={{ color: C.text }}>101111100</code> is fixed.
        Click bits of the KEY register to turn comparison ON (1, teal) or OFF (0, dim) for that
        position, and watch which stored words match.
      </p>

      <div style={{ marginBottom: 6, fontSize: 11, color: C.muted }}>ARGUMENT REGISTER (A) — fixed</div>
      <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
        {A.split("").map((b, i) => (
          <div key={i} style={{ width: 30, height: 30, borderRadius: 5, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, color: C.text }}>{b}</div>
        ))}
      </div>

      <div style={{ marginBottom: 6, fontSize: 11, color: C.muted }}>KEY REGISTER (K) — click a bit to toggle</div>
      <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
        {k.map((b, i) => (
          <button key={i} onClick={() => toggleK(i)} style={{
            width: 30, height: 30, borderRadius: 5, cursor: "pointer",
            border: `1.5px solid ${b === 1 ? C.teal : C.border}`,
            background: b === 1 ? C.teal + "33" : "transparent",
            fontFamily: "monospace", fontWeight: 700, color: b === 1 ? C.teal : C.muted,
          }}>{b}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WORDS.map((w) => {
          const hit = matches(w.bits);
          return (
            <div key={w.label} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8,
              border: `1.5px solid ${hit ? C.green : C.border}`, background: hit ? C.green + "14" : C.card,
            }}>
              <div style={{ width: 54, fontSize: 11, color: C.muted }}>{w.label}</div>
              <div style={{ display: "flex", gap: 3 }}>
                {w.bits.split("").map((b, i) => (
                  <div key={i} style={{
                    width: 22, height: 22, borderRadius: 4, fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: k[i] === 1 ? (b === A[i] ? C.green + "33" : C.red + "33") : C.bg,
                    color: k[i] === 1 ? (b === A[i] ? C.green : C.red) : C.muted,
                  }}>{b}</div>
                ))}
              </div>
              <div style={{ marginLeft: "auto", fontWeight: 700, fontSize: 12, color: hit ? C.green : C.muted }}>{hit ? "MATCH — Mᵢ=1" : "no match"}</div>
            </div>
          );
        })}
      </div>

      <Key color={C.green}>
        With K = <code style={{ color: C.text }}>111000000</code> (only the first 3 bits compared),
        Word 2 matches even though its last 6 bits look nothing like A — because K=0 there means
        those positions are never even checked. This is exactly the notes' worked example.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The Tag Register (write & delete)
// ══════════════════════════════════════════════════════════════════
function TagRegister() {
  const [words, setWords] = useState([
    { val: "10110010", active: true },
    { val: "01101101", active: true },
    { val: "11100011", active: false },
    { val: "00011010", active: false },
  ]);
  const [newWord, setNewWord] = useState("11110000");

  const toggle = (i) => setWords((prev) => prev.map((w, j) => (j === i ? { ...w, active: !w.active } : w)));
  const firstFree = words.findIndex((w) => !w.active);

  const write = () => {
    if (firstFree === -1) return;
    setWords((prev) => prev.map((w, j) => (j === firstFree ? { val: newWord, active: true } : w)));
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Words get added and deleted at different times. A <strong style={{ color: C.accent }}>tag bit</strong> per
        word marks it active/inactive — deleting a word just clears its tag; writing picks the
        FIRST inactive slot. Click a word's tag to delete/restore it, then try writing a new one.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {words.map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, border: `1px solid ${w.active ? C.green + "66" : C.border}`, background: w.active ? C.green + "0d" : C.card }}>
            <button onClick={() => toggle(i)} style={{
              width: 30, height: 30, borderRadius: 6, cursor: "pointer", fontWeight: 800, fontSize: 12,
              border: `1.5px solid ${w.active ? C.green : C.red}`, background: (w.active ? C.green : C.red) + "22",
              color: w.active ? C.green : C.red,
            }}>{w.active ? 1 : 0}</button>
            <div style={{ fontFamily: "monospace", color: w.active ? C.text : C.muted, fontSize: 13 }}>{w.val}</div>
            <div style={{ marginLeft: "auto", fontSize: 11, color: C.muted }}>{w.active ? "active" : "free slot"}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={newWord} onChange={(e) => setNewWord(e.target.value.replace(/[^01]/g, "").slice(0, 8))} style={{
          fontFamily: "monospace", padding: "8px 10px", borderRadius: 8, background: C.bg, border: `1px solid ${C.border}`, color: C.text, width: 110,
        }} />
        <button onClick={write} disabled={firstFree === -1} style={{
          padding: "8px 16px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13,
          background: firstFree === -1 ? C.border : C.accentGlow, color: firstFree === -1 ? C.muted : "#fff",
          cursor: firstFree === -1 ? "default" : "pointer",
        }}>Write new word →</button>
      </div>
      {firstFree === -1 && <div style={{ marginTop: 8, fontSize: 12, color: C.orange }}>No free (inactive) slot — delete one first.</div>}

      <Key color={C.orange}>
        The write always lands in the FIRST location whose tag bit is 0. A word is "deleted" by
        simply clearing its tag — the bits are still physically there, just marked unused.
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
      q: "What makes associative memory different from ordinary RAM?",
      options: [
        "It is accessed by content — you supply data and get back matching words, instead of supplying an address",
        "It is simply a faster version of RAM with no other differences",
        "It can only store one word at a time",
        "It requires periodic refresh like DRAM",
      ],
      answer: 0,
      explain: "Associative (content-addressable) memory compares your search argument against every stored word in parallel — no address is involved in a read.",
    },
    {
      q: "In the Key Register (K), what does a 0 in bit position j mean?",
      options: [
        "Bit j of the argument must be 0 to match",
        "Bit j is ignored during comparison — it always counts as a match regardless of its value",
        "Bit j will be deleted",
        "The whole word is excluded from the search",
      ],
      answer: 1,
      explain: "K masks the comparison: 1 = compare this bit, 0 = skip it (automatic match). This is why a word can match A even where their bits visibly differ, wherever K=0.",
    },
    {
      q: "A = 101111100 and K = 111000000. Does the word 101000001 match?",
      options: [
        "No — most of the bits are different",
        "Yes — only the first 3 bits are compared (K=1 there), and they agree (101 = 101)",
        "No — K must be all 1s for any match to occur",
        "Yes, but only because the word is all zeros after position 3",
      ],
      answer: 1,
      explain: "K=111000000 means only positions 1-3 are compared. Both A and the word start with 101, so it's a match — the remaining, unmasked bits are irrelevant.",
    },
    {
      q: "How does associative memory decide where to WRITE a new word, and where does a DELETE happen?",
      options: [
        "Write always goes to address 0; delete clears all memory",
        "The tag register marks each word active/inactive — write picks the first inactive (tag=0) slot, and delete just clears that word's tag bit",
        "Both operations require specifying an address, exactly like RAM",
        "New words overwrite whichever word matched most recently",
      ],
      answer: 1,
      explain: "A per-word tag bit distinguishes active from free slots. Deleting is just clearing the tag (no need to erase the data); writing finds the first tag=0 location.",
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
          {score === 4 ? "Perfect! A, K, the array, M, and the tag register are all locked in." :
            score >= 2 ? "Good work! Replay the Masked Comparison widget and watch the key bits carefully." :
              "Revisit 'Search by Content' and 'Masked Comparison', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 4.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You've built the exact parallel-search hardware that made fully-associative cache
            lookup possible back in Unit 4.3.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 4.5 — Auxiliary Memory.</strong>{" "}
            Zoom all the way out to the bottom of the pyramid — disks, tapes, and everything that survives when the power goes off.
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
export default function Unit4_4({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Content?" },
    { id: "anatomy", label: "Anatomy" },
    { id: "masked", label: "Masked Compare" },
    { id: "tag", label: "Tag Register" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>❓ Search by Content, Not Address</h3>
      <NeedWidget />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔬 Anatomy: A, K, Array, M</h3>
      <Anatomy />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎭 Masked Comparison — the worked example</h3>
      <MaskedCompare />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🏷️ The Tag Register — write &amp; delete</h3>
      <TagRegister />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 4.4.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › UNIT 4.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Associative Memory</div>
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
