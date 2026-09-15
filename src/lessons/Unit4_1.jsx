// Unit4_1.jsx — Module 4 › Unit 4.1 — "The Memory Hierarchy"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: why one memory technology can't do it all -> the pyramid of levels ->
// locality of reference (why the hierarchy actually works) -> where does MY
// data live -> quiz. Scaffolds on Unit1_4 (addresses) and Unit3_1 (cache
// already introduced as a stall source) without repeating either.
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

function Bar({ label, value, max, color, unit }) {
  const pct = Math.max(3, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 3 }}>
        <span>{label}</span><span style={{ color, fontWeight: 700 }}>{unit}</span>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: C.bg, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, transition: "width 0.35s ease" }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Why Not One Memory?
// ══════════════════════════════════════════════════════════════════
function NeedWidget() {
  const [mode, setMode] = useState(2); // 0 all-register, 1 all-disk, 2 hierarchy

  const scenarios = [
    {
      name: "All register-speed memory", tag: "❌ EXPENSIVE & TINY",
      speed: 99, cost: 99, capacity: 4,
      note: "Every byte behaves like a CPU register. Blazing fast — but a machine you could actually afford would barely hold one small photo.",
      col: C.red,
    },
    {
      name: "All disk-speed memory", tag: "❌ CHEAP & USELESS",
      speed: 4, cost: 4, capacity: 99,
      note: "Petabytes for pocket change — but the CPU (which runs in nanoseconds) sits idle for milliseconds on every single instruction fetch.",
      col: C.orange,
    },
    {
      name: "The real hierarchy", tag: "✅ THE ACTUAL ANSWER",
      speed: 78, cost: 30, capacity: 70,
      note: "A little bit of very fast memory close to the CPU, backed by progressively bigger, cheaper, slower memory further away.",
      col: C.green,
    },
  ];
  const s = scenarios[mode];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every memory technology forces the same choice: fast + small + expensive, or slow +
        huge + cheap. No single technology gives you all three at once. Try building a computer
        out of just one kind of memory and see what breaks.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {scenarios.map((sc, i) => (
          <button key={i} onClick={() => setMode(i)} style={{
            flex: 1, minWidth: 120, padding: "9px 6px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
            border: `1px solid ${mode === i ? C.accent : C.border}`,
            background: mode === i ? C.accentGlow : "transparent",
            color: mode === i ? "#fff" : C.muted,
          }}>{sc.name}</button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${s.col}55`, borderRadius: 10, padding: 16 }}>
        <div style={{ color: s.col, fontWeight: 700, fontSize: 12, marginBottom: 12 }}>{s.tag}</div>
        <Bar label="Speed" value={s.speed} max={100} color={C.accent} unit={s.speed >= 70 ? "instant" : s.speed >= 30 ? "noticeable lag" : "CPU starves"} />
        <Bar label="Cost per byte" value={s.cost} max={100} color={C.yellow} unit={s.cost >= 70 ? "ruinous" : s.cost >= 30 ? "moderate" : "pocket change"} />
        <Bar label="Total capacity you can afford" value={s.capacity} max={100} color={C.teal} unit={s.capacity >= 70 ? "huge" : s.capacity >= 30 ? "modest" : "tiny"} />
        <div style={{ marginTop: 10, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{s.note}</div>
      </div>

      <Key>
        The hierarchy isn't a compromise nobody wanted — it's the ONLY way to get something that
        <em> feels</em> both fast and huge, by keeping the fast part small and the huge part cheap.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Pyramid
// ══════════════════════════════════════════════════════════════════
const LEVELS = [
  { name: "CPU Registers", icon: "⚡", access: "< 1 ns", capacity: "a few hundred bytes", cost: "highest", role: "Values the ALU is working on RIGHT NOW — literally wires inside the CPU.", width: 30, col: C.purple },
  { name: "Cache Memory", icon: "🏎️", access: "≈ 2–10 ns", capacity: "KB – a few MB", cost: "very high", role: "A small, fast copy of the main memory locations the CPU has used recently (you'll meet this properly as its own unit).", width: 48, col: C.accent },
  { name: "Main Memory (RAM)", icon: "🗄️", access: "≈ 50–100 ns", capacity: "GBs", cost: "moderate", role: "Where your running programs and their data actually live while the machine is on.", width: 68, col: C.teal },
  { name: "Auxiliary / Secondary Storage", icon: "💽", access: "≈ 5–10 ms (10,000×+ slower)", capacity: "TBs", cost: "lowest", role: "Disks/SSDs — everything survives here even when the power is off.", width: 92, col: C.orange },
];

function Pyramid() {
  const [sel, setSel] = useState(1);
  const lv = LEVELS[sel];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The CPU checks the fastest, smallest level first. Only on a miss does it step down to the
        next, bigger, slower level. Click a level of the pyramid to see its numbers.
      </p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 16 }}>
        {LEVELS.map((l, i) => (
          <button key={i} onClick={() => setSel(i)} style={{
            width: `${l.width}%`, padding: "10px 8px", borderRadius: 8, cursor: "pointer",
            border: `1.5px solid ${sel === i ? l.col : C.border}`,
            background: sel === i ? l.col + "22" : C.card,
            color: sel === i ? l.col : C.text, fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.2s",
          }}>
            <span>{l.icon}</span>{l.name}
          </button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${lv.col}55`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ color: lv.col, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{lv.icon} {lv.name}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.muted }}>Access time</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{lv.access}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.muted }}>Typical capacity</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{lv.capacity}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.muted }}>Cost per byte</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{lv.cost}</div>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{lv.role}</div>
      </div>

      <Key color={C.teal}>
        Notice the shape: as you go DOWN the pyramid, access time gets worse by orders of
        magnitude, but capacity explodes and cost per byte collapses. Every level trades speed for size.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Locality of Reference (why the hierarchy actually works)
// ══════════════════════════════════════════════════════════════════
function Locality() {
  const code = ["sum = 0", "for i in range(4):", "    sum = sum + arr[i]", "print(sum)"];
  // Each step: which code line, which addresses touched this step, running trail.
  const steps = [
    { line: 0, touch: ["sum"], note: "sum is created once — we'll come back to this SAME address over and over." },
    { line: 2, touch: ["sum", "arr0"], note: "i=0: reads sum (again!) and arr[0]. Two addresses, right next to each other in the array." },
    { line: 2, touch: ["sum", "arr1"], note: "i=1: sum again — that's TEMPORAL locality (reused very recently). arr[1] is right after arr[0] — SPATIAL locality." },
    { line: 2, touch: ["sum", "arr2"], note: "i=2: same pattern — sum keeps getting reused, the array address keeps creeping forward by one." },
    { line: 2, touch: ["sum", "arr3"], note: "i=3: last iteration. sum has now been touched 5 times without ever leaving the loop." },
    { line: 3, touch: ["sum"], note: "One final read of sum to print it — the 6th touch of the SAME address." },
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const addrs = ["sum", "arr0", "arr1", "arr2", "arr3"];
  const labels = { sum: "sum", arr0: "arr[0]", arr1: "arr[1]", arr2: "arr[2]", arr3: "arr[3]" };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The hierarchy only pays off because real programs don't scatter their memory accesses
        randomly. Step through this loop and watch WHICH addresses keep coming back.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
          {code.map((l, i) => (
            <div key={i} style={{
              fontFamily: "monospace", fontSize: 12.5, padding: "3px 6px", borderRadius: 4,
              background: cur.line === i ? C.accent + "22" : "transparent",
              color: cur.line === i ? C.accent : C.text, whiteSpace: "pre",
            }}>{cur.line === i ? "▶ " : "  "}{l}</div>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 8 }}>ADDRESSES TOUCHED SO FAR</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {addrs.map((a) => {
              const hot = cur.touch.includes(a);
              const everTouched = steps.slice(0, step + 1).some((s) => s.touch.includes(a));
              return (
                <div key={a} style={{
                  width: 52, height: 34, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontFamily: "monospace", fontWeight: 700,
                  border: `1.5px solid ${hot ? C.green : everTouched ? C.teal + "88" : C.border}`,
                  background: hot ? C.green + "22" : everTouched ? C.teal + "14" : "transparent",
                  color: hot ? C.green : everTouched ? C.teal : C.muted,
                }}>{labels[a]}</div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: "10px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>
        {cur.note}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{
          padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent",
          color: step === 0 ? C.muted + "66" : C.muted, cursor: step === 0 ? "default" : "pointer", fontSize: 13,
        }}>↺ Back</button>
        <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} style={{
          padding: "8px 16px", borderRadius: 8, border: "none",
          background: step === steps.length - 1 ? C.border : C.accentGlow,
          color: step === steps.length - 1 ? C.muted : "#fff", cursor: step === steps.length - 1 ? "default" : "pointer", fontSize: 13, fontWeight: 600,
        }}>Step ▶ ({step + 1} / {steps.length})</button>
      </div>

      <Key color={C.green}>
        <strong style={{ color: C.text }}>Temporal locality</strong>: a recently-used address (like <code style={{ color: C.text }}>sum</code>) is likely
        to be used again soon. <strong style={{ color: C.text }}>Spatial locality</strong>: an address near a recently-used one
        (like <code style={{ color: C.text }}>arr[1]</code> after <code style={{ color: C.text }}>arr[0]</code>) is likely to be used soon too.
        The hierarchy exploits both — that's WHY keeping a small, fast copy of "recently touched" data actually works.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Where Does My Data Live?
// ══════════════════════════════════════════════════════════════════
function DataExplorer() {
  const items = [
    { name: "The loop counter i, right now", freq: "Used every few nanoseconds", level: 0 },
    { name: "A variable your program is actively computing with", freq: "Used every few instructions", level: 1 },
    { name: "The document you're editing this second", freq: "Read/written constantly while the app runs", level: 2 },
    { name: "Last year's holiday photos", freq: "Opened maybe once a year", level: 3 },
  ];
  const [pick, setPick] = useState(1);
  const it = items[pick];
  const lv = LEVELS[it.level];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The hierarchy isn't something you control directly — the hardware and OS decide, based
        on how "hot" (frequently used) a piece of data is. Pick a piece of data and see roughly
        where it naturally ends up.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {items.map((it2, i) => (
          <button key={i} onClick={() => setPick(i)} style={{
            textAlign: "left", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13,
            border: `1px solid ${pick === i ? C.accent : C.border}`,
            background: pick === i ? C.accent + "18" : C.card,
            color: pick === i ? C.accent : C.text,
          }}>{it2.name}<div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{it2.freq}</div></button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${lv.col}55`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>MOST LIKELY LIVES IN</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: lv.col }}>{lv.icon} {lv.name}</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>typical access time: {lv.access}</div>
      </div>

      <Key color={C.purple}>
        The hotter (more frequently reused) the data, the higher up the pyramid it gets pulled —
        automatically, without any program ever saying "put this in cache."
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
      q: "Why don't computers just build all of memory out of the fastest available technology?",
      options: [
        "The fastest technology is illegal to sell in bulk",
        "The fastest, smallest-latency memory is also the most expensive per byte, so an all-fast machine could only afford a tiny amount",
        "Fast memory cannot store more than a few bytes, ever, by definition",
        "Manufacturers deliberately slow memory down to sell more of it",
      ],
      answer: 1,
      explain: "Cost per byte rises sharply as access time drops. An all-register-speed machine would be unaffordably tiny — the hierarchy exists to buy speed only where it matters most.",
    },
    {
      q: "Going DOWN the memory hierarchy (registers → cache → main memory → disk), what happens to access time and capacity?",
      options: [
        "Both increase",
        "Both decrease",
        "Access time increases (gets slower); capacity increases (gets bigger)",
        "Access time decreases; capacity decreases",
      ],
      answer: 2,
      explain: "Every step down trades speed for size: slower access time, but far more capacity for far less cost per byte.",
    },
    {
      q: "A program just used variable `total` and is about to use it again on the very next line. This is an example of which kind of locality?",
      options: ["Spatial locality", "Temporal locality", "Random locality", "Structural locality"],
      answer: 1,
      explain: "Reusing the SAME address again soon is temporal locality (\"temporal\" = time). Spatial locality is about NEARBY addresses, not the same one.",
    },
    {
      q: "Why does locality of reference matter for the memory hierarchy?",
      options: [
        "It doesn't — the hierarchy works no matter how memory is accessed",
        "It's only relevant to auxiliary storage, not cache or RAM",
        "It's the reason keeping a small, fast copy of recently-used data actually pays off — without it, a small cache would rarely contain what's needed next",
        "It only applies to programs written in Python",
      ],
      answer: 2,
      explain: "If accesses were completely random, a small fast level would almost never have what's needed next. Because real programs cluster their accesses (temporally and spatially), a small cache captures most of the traffic.",
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
          {score === 4 ? "Perfect! The whole hierarchy — and WHY it works — is locked in." :
            score >= 2 ? "Good work! Replay the locality trace — watch which addresses keep repeating." :
              "Revisit 'The Pyramid' and 'Locality of Reference', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 4.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You now know WHY memory comes in layers, and WHY the hierarchy actually works (locality).
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 4.2 — RAM &amp; ROM Chips.</strong>{" "}
            Time to open the "Main Memory" box from the pyramid and see what's actually inside it.
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
export default function Unit4_1({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Not One?" },
    { id: "pyramid", label: "The Pyramid" },
    { id: "locality", label: "Locality" },
    { id: "explorer", label: "Where's My Data?" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>❓ Why Not Just One Memory?</h3>
      <NeedWidget />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🏔️ The Pyramid — four levels, one job each</h3>
      <Pyramid />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📍 Locality of Reference — why the hierarchy works</h3>
      <Locality />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔍 Where Does My Data Live?</h3>
      <DataExplorer />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 4.1.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › UNIT 4.1</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>The Memory Hierarchy</div>
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
