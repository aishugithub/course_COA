// ════════════════════════════════════════════════════════════════
//  Unit0_1.jsx  —  "The Problem & The Dream"
//  Unit 0, Lesson 1 of 3
//
//  CHANGES FROM FEEDBACK:
//  1. Firing table problem → animated visual with short text (no wall of text)
//  2. All Build concept cards → visual-first: icons, stat boxes, short bullets
//  3. Alan Turing added as a concept card in the Build stage
//  4. Build-stage countdown timer REMOVED — free navigation
//  5. Shannon's bridge moment called out clearly (expanded in Unit0_2)
//
//  STORY ARC:
//    Animated firing table crisis → Babbage → Ada Lovelace → Turing
//    → Shannon bridge → Von Neumann stored-program
// ════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

export default function Unit0_1({ student, onUnitComplete }) {

  // ── ALL HOOKS — unconditional, fixed order ──────────────────────
  const [stage, setStage] = useState(0);

  // Spark — animated firing table
  const [sparkPhase, setSparkPhase]     = useState("table"); // "table"|"highlight"|"chaos"|"done"
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [animStep, setAnimStep]         = useState(0);
  const animRef                         = useRef(null);

  // Build — card carousel, NO timer gate
  const [buildIdx, setBuildIdx]         = useState(0);
  const [buildMode, setBuildMode]       = useState("plain");

  // See It — timeline click-through
  const [seeStep, setSeeStep]           = useState(0);

  // Try It — student computes a trajectory step by step
  const [tryStep, setTryStep]           = useState(0);
  const [tryAnswer, setTryAnswer]       = useState("");
  const [tryFeedback, setTryFeedback]   = useState(null);
  const [tryDone, setTryDone]           = useState(false);

  // Challenge — tap-to-match
  const [matched, setMatched]           = useState({});
  const [selLeft, setSelLeft]           = useState(null);
  const [wrongFlash, setWrongFlash]     = useState(null);
  const [rightOrder] = useState(() => {
    const pairs = [
      { left: "Charles Babbage",   right: "Designed the Difference Engine" },
      { left: "Ada Lovelace",      right: "Wrote the first algorithm" },
      { left: "Alan Turing",       right: "Proved universal machines are possible" },
      { left: "Claude Shannon",    right: "Connected Boolean algebra to circuits" },
      { left: "John von Neumann",  right: "Proposed the stored-program concept" },
    ];
    const rights = [...pairs.map(p => p.right)];
    for (let i = rights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rights[i], rights[j]] = [rights[j], rights[i]];
    }
    return { pairs, rights };
  });

  // Quiz
  const [quizIdx, setQuizIdx]           = useState(0);
  const [quizSel, setQuizSel]           = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // ── SPARK ANIMATION — auto-walks through the table highlighting
  // a bad row, then shows the "error found" callout. Cleans up on stage change.
  useEffect(() => {
    if (stage !== 0 || sparkPhase !== "table") return;
    // After 1.2s auto-highlight the error row to draw attention
    const t = setTimeout(() => setSparkPhase("highlight"), 1200);
    return () => clearTimeout(t);
  }, [stage, sparkPhase]);

  // ── CONTENT ────────────────────────────────────────────────────

  // Firing table data — row index 3 has the fatal error
  const firingTable = [
    { dist: "500m",  wind: "0 km/h",  angle: "12.4°", error: false },
    { dist: "500m",  wind: "10 km/h", angle: "13.1°", error: false },
    { dist: "1000m", wind: "0 km/h",  angle: "24.7°", error: false },
    { dist: "1000m", wind: "10 km/h", angle: "31.2°", error: true  }, // correct: 26.1°
    { dist: "1500m", wind: "0 km/h",  angle: "38.5°", error: false },
    { dist: "1500m", wind: "10 km/h", angle: "40.0°", error: false },
  ];

  // Try It — walk through a real ballistic calc in 3 steps
  const calcSteps = [
    {
      instruction: "Base angle for 1000m with no wind = 24.7°. Wind speed = 10 km/h. Each 5 km/h adds 0.7°. How many 5 km/h units is 10 km/h?",
      answer: "2", hint: "10 ÷ 5 = ?",
      explanation: "10 ÷ 5 = 2 wind units. Simple division — but after 6 hours of this, errors creep in.",
    },
    {
      instruction: "Each wind unit adds 0.7°. You have 2 wind units. What is the total wind correction in degrees?",
      answer: "1.4", hint: "2 × 0.7 = ?",
      explanation: "2 × 0.7 = 1.4°. A tired mathematician might write 1.5° instead — that small error compounds.",
    },
    {
      instruction: "Base angle = 24.7°. Wind correction = 1.4°. What is the final firing angle?",
      answer: "26.1", hint: "24.7 + 1.4 = ?",
      explanation: "26.1° is correct. The real WWI table had 31.2° here — someone added wrong. The shell overshot by 500 metres.",
    },
  ];

  // Build concept cards — visual-first, short text, no long paragraphs
  // Each card has: title, icon, stats[], bullets[], plain (short), tech (short), hook
  const concepts = [
    {
      title: "WWI — The Firing Table Crisis",
      icon: "💥",
      color: "#7f1d1d",
      accent: "#ef4444",
      stats: [
        { label: "Entries per table", value: "3,000" },
        { label: "Steps per entry", value: "~50" },
        { label: "Human computers", value: "100+" },
        { label: "Time to produce", value: "3–6 months" },
        { label: "Error rate", value: "~1–2%" },
      ],
      plain: "Artillery tables told soldiers the exact angle to aim. Every row took 50+ arithmetic steps by hand. Teams of mathematicians worked for months — and the tables were still full of errors. Wrong angles meant shells missed targets. Lives were lost.",
      tech: "Each trajectory required ~750 arithmetic operations solving differential equations of motion (drag, gravity, wind, Coriolis). With ~3,000 trajectories per table and hand computation error rates of 0.5–2%, many entries were wrong. This bottleneck directly motivated mechanical and electronic computation funding.",
      hook: "Who first tried to fix this? →",
    },
    {
      title: "Charles Babbage — The Mechanical Dream",
      icon: "⚙️",
      color: "#78350f",
      accent: "#f59e0b",
      stats: [
        { label: "Born", value: "1791, London" },
        { label: "Key idea", value: "Difference Engine" },
        { label: "Funding received", value: "£17,000" },
        { label: "Parts needed", value: "~25,000 gears" },
        { label: "Problem", value: "Manufacturing precision" },
      ],
      plain: "Babbage designed a mechanical calculator to compute tables error-free using only addition. He got government funding — but 1820s tooling couldn't make gears precise enough. The idea was right; the technology wasn't ready. In 1991, the Science Museum built it from his drawings. It worked perfectly.",
      tech: "The Difference Engine used the method of finite differences: any polynomial can be evaluated using only repeated addition. The design required ~25,000 parts machined to ±0.001 inch — beyond 1820s capability. His later Analytical Engine (1837) had Store (memory), Mill (ALU), conditional branching, and loops — conceptually a modern Von Neumann machine, but mechanical.",
      hook: "Someone understood this better than Babbage did →",
    },
    {
      title: "Ada Lovelace — World's First Programmer",
      icon: "👩‍💻",
      color: "#5b21b6",
      accent: "#818cf8",
      stats: [
        { label: "Born", value: "1815, London" },
        { label: "Key contribution", value: "First algorithm" },
        { label: "Published", value: "1843" },
        { label: "Named after her", value: "Ada language" },
        { label: "Her insight", value: "Machines can manipulate any symbols" },
      ],
      plain: "Ada translated an article on the Analytical Engine and added notes 3× longer than the original — including the first ever computer algorithm. More importantly, she saw what Babbage missed: the Engine could manipulate any symbols, not just numbers. That insight is still true of every computer ever built.",
      tech: "Lovelace's Note G (1843) contained an algorithm to compute Bernoulli numbers using a recurrence relation with iteration — the first published algorithm with a loop. Her conceptual insight that the Engine could manipulate any symbols (not just numbers) prefigures Turing's universal computation thesis by 94 years.",
      hook: "Why did it take 100 more years? →",
    },
    {
      title: "Alan Turing — The Universal Machine",
      icon: "🧩",
      color: "#0f4c81",
      accent: "#38bdf8",
      stats: [
        { label: "Born", value: "1912, London" },
        { label: "Key paper", value: "1936" },
        { label: "His idea", value: "Turing Machine" },
        { label: "WWII role", value: "Broke Enigma cipher" },
        { label: "Legacy", value: "Turing Award = Nobel of CS" },
      ],
      plain: "In 1936, Turing proved mathematically that a single machine — following a simple set of rules — could compute anything that is computable. You don't need different machines for different problems. One universal machine, loaded with different instructions, can do them all. This is the theoretical foundation of all software.",
      tech: "Turing's 1936 paper 'On Computable Numbers' defined the Turing Machine: a finite-state control, an infinite tape, and read/write/move operations. He proved any effectively computable function could be computed by such a machine. The Universal Turing Machine (UTM) simulates any other Turing Machine — proving a single stored-program computer can run any program. The Church-Turing thesis states that this captures all of computation.",
      hook: "But how do you build this in hardware? →",
    },
    {
      title: "Claude Shannon — Boolean Meets Electricity",
      icon: "⚡",
      color: "#14532d",
      accent: "#4ade80",
      stats: [
        { label: "Born", value: "1916, Michigan" },
        { label: "Key paper", value: "1937 Master's thesis" },
        { label: "His bridge", value: "Boolean algebra → circuits" },
        { label: "Also invented", value: "Information theory (1948)" },
        { label: "Impact", value: "Made digital computers possible" },
      ],
      plain: "Boole invented logic algebra in 1847. Shannon proved in 1937 that electrical switches could implement any Boolean operation. AND becomes two switches in series. OR becomes two switches in parallel. This paper made it possible to design computers mathematically before building them.",
      tech: "Shannon's MIT master's thesis 'A Symbolic Analysis of Relay and Switching Circuits' (1937) proved any Boolean function can be implemented as a relay network. The mapping: AND = series connection, OR = parallel connection, NOT = normally-closed contact. This allowed digital circuit design to be treated as an algebraic problem. Shannon later founded information theory (1948), defining the bit as the fundamental unit of information.",
      hook: "Now — who built the first real computer? →",
    },
    {
      title: "Von Neumann — The Stored-Program Breakthrough",
      icon: "🏛️",
      color: "#4c1d95",
      accent: "#a78bfa",
      stats: [
        { label: "ENIAC completed", value: "1945" },
        { label: "Vacuum tubes", value: "18,000" },
        { label: "Weight", value: "27 tonnes" },
        { label: "ENIAC's problem", value: "Reprogramming = 2–3 days" },
        { label: "Von Neumann's fix", value: "Store instructions in memory" },
      ],
      plain: "ENIAC (1945) was the first electronic computer — but changing what it computed meant physically rewiring thousands of cables for days. Von Neumann's insight: store the instructions in memory just like data. Then changing the program means loading different numbers. One machine, infinite programs. This is what we study in this entire course.",
      tech: "Von Neumann's 'First Draft of a Report on the EDVAC' (1945) formalised the stored-program architecture: single shared memory holding both instructions and data; CPU with ALU + Control Unit + registers; sequential fetch via Program Counter. EDVAC (1949) was the first operational stored-program computer. The Von Neumann architecture remains the dominant computing paradigm today.",
      hook: "See the full story on a timeline →",
    },
  ];

  const timeline = [
    { year: "1820s", label: "Babbage's Difference Engine", detail: "Mechanical gears to compute error-free tables. Never finished — precision manufacturing didn't exist yet.", color: "#92400e" },
    { year: "1837",  label: "Analytical Engine Designed", detail: "Babbage designs a general-purpose mechanical computer: Store, Mill, conditional branching, loops.", color: "#78350f" },
    { year: "1843",  label: "Ada Lovelace — First Algorithm", detail: "Writes the first algorithm — Bernoulli numbers via the Analytical Engine. First to see machines could manipulate any symbols.", color: "#5b21b6" },
    { year: "1847",  label: "Boole's Logic Algebra", detail: "George Boole publishes Boolean algebra — AND, OR, NOT. Proves any logical operation can be expressed mathematically.", color: "#1e3a5f" },
    { year: "1914–18", label: "WWI — Firing Table Crisis", detail: "Hundreds of human computers employed. Tables still full of errors. The urgency to automate becomes military priority.", color: "#7f1d1d" },
    { year: "1936",  label: "Turing — The Universal Machine", detail: "Alan Turing proves one machine following simple rules can compute anything computable. The theoretical foundation of software.", color: "#0f4c81" },
    { year: "1937",  label: "Shannon's Thesis", detail: "Claude Shannon proves Boolean algebra maps directly to electrical switching circuits. Theory meets hardware.", color: "#14532d" },
    { year: "1943",  label: "ENIAC Funded", detail: "US Army contracts University of Pennsylvania to build ENIAC. $500,000. The first serious funding for an electronic computer.", color: "#1e3a5f" },
    { year: "1945",  label: "ENIAC Completed", detail: "18,000 vacuum tubes. 27 tonnes. Computes a trajectory in 30 seconds. Reprogramming takes days of rewiring.", color: "#7f1d1d" },
    { year: "1945",  label: "Von Neumann Architecture", detail: "Von Neumann's EDVAC report: store instructions in memory alongside data. Software and hardware separated.", color: "#4c1d95" },
    { year: "1949",  label: "EDVAC — First Stored-Program Computer", detail: "Von Neumann's architecture built. Instructions loaded from memory. The modern computer era begins.", color: "#064e3b" },
  ];

  const quiz = [
    {
      q: "What made WWI artillery firing tables dangerous to rely on?",
      options: ["A) They were written in German and mistranslated", "B) Human mathematicians made arithmetic errors, especially under fatigue", "C) The tables used outdated cannon designs", "D) Weather forecasting was inaccurate"],
      answer: 1,
      hints: ["Think about what happens to human concentration after hours of repetitive arithmetic.", "The problem was in the computation process itself — not the inputs.", "Fatigue causes errors. One wrong step corrupts every answer that follows it."],
      explanation: "Human computers made arithmetic mistakes during long shifts. A single error in step 4 of a 50-step computation would make the final answer wrong — and wrong angles meant shells missed targets.",
    },
    {
      q: "Babbage's Difference Engine was never completed. What was the reason?",
      options: ["A) Babbage ran out of mathematical ideas halfway through", "B) The British government withdrew funding before he started", "C) The precision manufacturing needed for thousands of gears didn't exist in the 1820s", "D) The machine worked but was too slow to be useful"],
      answer: 2,
      hints: ["The design itself was mathematically correct. The problem was physical.", "Think about what it takes to make 25,000 interlocking gears all mesh perfectly.", "1820s metalworking couldn't achieve the tolerances Babbage's design required."],
      explanation: "The Difference Engine needed ~25,000 precision gears machined to tolerances of ±0.001 inch — beyond 1820s manufacturing capability. When built in 1991 from Babbage's drawings, it worked perfectly.",
    },
    {
      q: "Ada Lovelace's most important insight was that the Analytical Engine could:",
      options: ["A) Calculate only numbers, but faster than humans", "B) Manipulate any symbols according to rules — not just numbers", "C) Replace all human labour in a factory", "D) Store programs on punch cards only"],
      answer: 1,
      hints: ["What did Ada add to Babbage's own understanding?", "Babbage saw a calculator. Ada saw something more general.", "If any symbol can be manipulated by rules, what becomes possible beyond arithmetic?"],
      explanation: "Ada saw that the Engine could manipulate any symbols according to rules — not just numbers. This means it could compose music, produce graphics, or do anything expressible as a sequence of operations. That insight defines what computers are.",
    },
    {
      q: "What did Alan Turing prove in his 1936 paper?",
      options: ["A) That Boolean algebra could be implemented in electrical circuits", "B) That a single universal machine following simple rules could compute anything computable", "C) That mechanical gears were superior to vacuum tubes for computation", "D) That human computers made more errors than mechanical ones"],
      answer: 1,
      hints: ["Turing's paper was theoretical — no hardware was built.", "He described a hypothetical machine with an infinite tape and simple rules.", "The key word is 'universal' — one machine for all problems."],
      explanation: "Turing's 1936 paper proved a Universal Turing Machine could simulate any other computing machine. This established that one machine, loaded with different instructions, can solve any computable problem — the theoretical foundation of all software.",
    },
    {
      q: "What did Claude Shannon's 1937 master's thesis prove?",
      options: ["A) That vacuum tubes could switch faster than relays", "B) That Boolean algebra operations could be implemented using electrical switching circuits", "C) That binary numbers are more efficient than decimal for computation", "D) That ENIAC could replace all human computers"],
      answer: 1,
      hints: ["Shannon connected two things that had existed separately for 90 years.", "Boole invented his algebra in 1847. Shannon's contribution was connecting it to something physical.", "AND becomes two switches in series. OR becomes two in parallel. What field did this connect Boole's work to?"],
      explanation: "Shannon proved that any Boolean algebra operation can be implemented as an electrical switching circuit. This connected Boole's mathematics (1847) to electrical engineering — making it possible to design digital computers mathematically before building them.",
    },
    {
      q: "ENIAC (1945) was a breakthrough but had one crippling problem. What was it?",
      options: ["A) It could only add, not subtract or multiply", "B) It ran out of vacuum tubes after a few hours of operation", "C) Changing what it computed required physically rewiring thousands of cables for 2–3 days", "D) It was too small to solve artillery problems"],
      answer: 2,
      hints: ["ENIAC could compute — the problem was about flexibility.", "Think about what 'programming' ENIAC meant physically.", "If the program is encoded in cables and patch panels, what does changing the program require?"],
      explanation: "ENIAC's 'program' was its physical wiring. Rewiring thousands of cables and patch panels to solve a new problem took engineers 2–3 days each time. This was the bottleneck that Von Neumann's stored-program concept solved.",
    },
    {
      q: "What was Von Neumann's stored-program insight?",
      options: ["A) Store data in vacuum tubes instead of punch cards", "B) Store instructions in memory alongside data, so changing the program means loading different numbers", "C) Use binary instead of decimal for all arithmetic", "D) Build one large computer instead of many small ones"],
      answer: 1,
      hints: ["ENIAC's program was in the wires. Von Neumann asked: what if it wasn't?", "Instructions and data are both just numbers. What if they lived in the same place?", "If instructions are in memory, changing the program means... what?"],
      explanation: "Von Neumann realised that instructions are just data — numbers that tell the CPU what to do. Store them in the same memory as data, and changing the program means loading different numbers, not rewiring hardware. One machine, any program. This is the foundation of all modern computers.",
    },
    {
      q: "Who is credited with writing the first computer algorithm?",
      options: ["A) Charles Babbage, in the designs for the Difference Engine", "B) John von Neumann, in the EDVAC report", "C) Ada Lovelace, in her 1843 notes on the Analytical Engine", "D) Alan Turing, in his 1936 paper"],
      answer: 2,
      hints: ["This person translated an article and added notes three times longer than the original.", "The algorithm was for computing Bernoulli numbers.", "This person worked closely with Babbage in the 1840s."],
      explanation: "Ada Lovelace's Note G (1843) contained the first published algorithm — a method to compute Bernoulli numbers using the Analytical Engine, including a loop (the first iteration in an algorithm). The programming language Ada is named in her honour.",
    },
    {
      q: "The firing table crisis, Babbage, Turing, Shannon, and Von Neumann all contributed to computing. What was the correct chronological order of their key contributions?",
      options: ["A) Babbage → Ada → Turing → Shannon → Von Neumann", "B) Shannon → Babbage → Turing → Ada → Von Neumann", "C) Ada → Von Neumann → Shannon → Turing → Babbage", "D) Turing → Shannon → Babbage → Ada → Von Neumann"],
      answer: 0,
      hints: ["Babbage and Ada were 19th century. Turing, Shannon, and Von Neumann were 20th century.", "Shannon (1937) came just before Von Neumann (1945). Turing (1936) was just before Shannon.", "Think: mechanical dreams first (1820s–1843), then theoretical foundations (1936–1937), then physical machines (1945)."],
      explanation: "Babbage (1820s–1837) → Ada (1843) → Turing (1936) → Shannon (1937) → Von Neumann (1945). Each built on what came before: hardware concepts → algorithmic thinking → theoretical limits → circuit design theory → stored-program architecture.",
    },
    {
      q: "What do Babbage's Analytical Engine, Turing's Universal Machine, and Von Neumann's architecture all share?",
      options: ["A) They all used vacuum tubes as their switching element", "B) They all required government funding to build", "C) They all embody the same idea: one general machine that can be instructed to do anything", "D) They were all built and tested successfully"],
      answer: 2,
      hints: ["Babbage's was mechanical. Turing's was theoretical. Von Neumann's was electronic. What idea did all three share?", "Think about what makes something a 'general-purpose' computer vs a special-purpose calculator.", "All three allowed different 'programs' or 'instructions' to make the same machine do different things."],
      explanation: "All three share the core insight of general-purpose programmable computation: one machine that can do anything by changing its instructions. Babbage called it a 'Store and Mill', Turing called it a 'Universal Machine', Von Neumann called it a 'stored-program computer'. The idea is the same.",
    },
  ];

  // ── STYLES ──────────────────────────────────────────────────────
  const s = {
    wrap: { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e1a2e 100%)", color: "#e2e8f0", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: "0 0 80px" },
    header: { background: "linear-gradient(90deg,#1a0a2e,#1e293b)", padding: "14px 16px 10px", borderBottom: "1px solid #818cf8" },
    unitLabel: { fontSize: "0.65rem", color: "#818cf8", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 },
    unitTitle: { fontSize: "clamp(1rem,3vw,1.2rem)", fontWeight: 800, color: "#f1f5f9" },
    stageBar: { display: "flex", gap: 4, padding: "8px 16px", overflowX: "auto", background: "#0f172a", borderBottom: "1px solid #1e293b" },
    stageDot: (active, done) => ({ fontSize: "0.6rem", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: active ? 700 : 400, background: done ? "#312e81aa" : active ? "#3730a3" : "#1e293b", color: done ? "#818cf8" : active ? "#c7d2fe" : "#475569", border: done ? "1px solid #6366f144" : active ? "1px solid #818cf8" : "1px solid #1e293b" }),
    card: { background: "#1e293b", borderRadius: 16, padding: "18px 16px", margin: "14px 12px", border: "1px solid #334155" },
    h2: { fontSize: "clamp(0.95rem,2.8vw,1.15rem)", fontWeight: 700, color: "#f1f5f9", marginBottom: 10 },
    p: { color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.75, marginBottom: 10 },
    pShort: { color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.65, marginBottom: 8 },
    btn: (c = "#818cf8") => ({ background: c, color: c === "#4ade80" ? "#0f172a" : "#0f172a", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", marginTop: 10, display: "inline-block" }),
    btnGhost: { background: "transparent", color: "#64748b", border: "1px solid #334155", borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", marginTop: 10 },
    toggleBtn: (active) => ({ flex: "1 1 100px", padding: "8px 12px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", background: active ? "#818cf8" : "#0f172a", color: active ? "#0f172a" : "#64748b" }),
    quizOption: (sel, correct, wrong) => ({ background: correct ? "#14532d" : wrong ? "#450a0a" : sel ? "#1e1b4b" : "#0f172a", border: correct ? "2px solid #4ade80" : wrong ? "2px solid #ef4444" : sel ? "2px solid #818cf8" : "1px solid #334155", borderRadius: 10, padding: "13px 16px", marginBottom: 8, cursor: "pointer", fontSize: "0.84rem", color: "#f1f5f9" }),
    infoBox: (color = "#818cf8") => ({ background: color + "18", border: `1px solid ${color}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 10 }),
    statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 8, marginBottom: 14 },
    statBox: (accent) => ({ background: "#0f172a", border: `1px solid ${accent}44`, borderRadius: 10, padding: "10px 12px" }),
    input: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", marginTop: 8 },
  };

  const stageLabels = ["✨ Spark", "📖 Build", "📽 See It", "🧪 Try It", "🎯 Challenge", "📝 Quiz"];

  // ── STAGE RENDERERS ─────────────────────────────────────────────

  function renderSpark() {
    // Animated firing table — the error row glows red, then explodes
    return (
      <div style={s.card}>
        <div style={{ fontSize: "0.65rem", color: "#ef4444", letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>WWI, 1917 — ARTILLERY FIRING TABLE</div>
        <div style={s.h2}>⚠️ Something in this table will cost lives.</div>
        <div style={{ ...s.pShort, marginBottom: 14 }}>Tap the row you think has an error.</div>

        {/* Firing table */}
        <div style={{ overflowX: "auto", marginBottom: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr>
                {["Distance", "Wind", "Fire Angle"].map(h => (
                  <th key={h} style={{ background: "#0f172a", color: "#64748b", padding: "8px 10px", textAlign: "left", fontSize: "0.7rem", letterSpacing: 1 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {firingTable.map((row, i) => {
                const isError = row.error;
                const isPulse = sparkPhase === "highlight" && isError;
                const isRevealed = sparkPhase === "chaos" || sparkPhase === "done";
                return (
                  <tr
                    key={i}
                    onClick={() => {
                      if (sparkPhase === "table" || sparkPhase === "highlight") {
                        if (isError) setSparkPhase("chaos");
                        else { setHighlightedRow(i); setTimeout(() => setHighlightedRow(null), 500); }
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      background: isRevealed && isError ? "#7f1d1d66"
                        : isPulse ? "#7f1d1d44"
                        : highlightedRow === i ? "#1e293b"
                        : i % 2 === 0 ? "#0f172a" : "#111827",
                      border: isRevealed && isError ? "2px solid #ef4444"
                        : isPulse ? "1px solid #ef444466" : "none",
                      transition: "all 0.3s",
                      animation: isPulse ? "pulse 1s infinite" : "none",
                    }}
                  >
                    <td style={{ padding: "10px", color: "#e2e8f0" }}>{row.dist}</td>
                    <td style={{ padding: "10px", color: "#e2e8f0" }}>{row.wind}</td>
                    <td style={{ padding: "10px", color: isRevealed && isError ? "#ef4444" : "#e2e8f0", fontWeight: isRevealed && isError ? 700 : 400 }}>
                      {row.angle}
                      {isRevealed && isError && <span style={{ color: "#ef4444", marginLeft: 8, fontSize: "0.7rem" }}>← WRONG (correct: 26.1°)</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sparkPhase === "highlight" && (
          <div style={{ ...s.infoBox("#f59e0b"), fontSize: "0.82rem", color: "#fbbf24" }}>
            ⚠️ One row glows. A mathematician added wrong after six hours of work. Can you find it?
          </div>
        )}

        {(sparkPhase === "chaos" || sparkPhase === "done") && (
          <div>
            <div style={{ ...s.infoBox("#ef4444") }}>
              <div style={{ color: "#ef4444", fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>💥 31.2° — That's Wrong</div>
              <div style={{ color: "#fca5a5", fontSize: "0.82rem", lineHeight: 1.6 }}>
                The correct angle was <strong>26.1°</strong>. The shell overshot by 500 metres — hitting a friendly position.
              </div>
              <div style={{ color: "#fca5a5", fontSize: "0.78rem", marginTop: 6 }}>This happened repeatedly. This is why someone wanted to build a machine that never gets tired.</div>
            </div>
            <button style={s.btn("#4ade80")} onClick={() => setStage(1)}>Meet the people who tried to fix this →</button>
          </div>
        )}

        {sparkPhase === "table" && (
          <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 4 }}>👆 Tap any angle to inspect it</div>
        )}

        <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
      </div>
    );
  }

  function renderBuild() {
    // No timer gate — free navigation between concept cards
    const c = concepts[buildIdx];
    const isLast = buildIdx === concepts.length - 1;
    return (
      <div style={s.card}>
        {/* Progress bar */}
        <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>CONCEPT {buildIdx + 1} OF {concepts.length}</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {concepts.map((_, i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 4, background: i < buildIdx ? "#818cf8" : i === buildIdx ? "#c7d2fe" : "#1e293b", transition: "background 0.3s" }} />)}
        </div>

        {/* Icon + title banner */}
        <div style={{ background: c.color + "33", border: `1px solid ${c.accent}44`, borderRadius: 14, padding: "14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: "2rem" }}>{c.icon}</div>
          <div style={{ fontWeight: 800, fontSize: "clamp(0.9rem,2.5vw,1.05rem)", color: "#f1f5f9" }}>{c.title}</div>
        </div>

        {/* Stat grid — visual at-a-glance facts */}
        <div style={s.statGrid}>
          {c.stats.map(({ label, value }) => (
            <div key={label} style={s.statBox(c.accent)}>
              <div style={{ fontSize: "0.62rem", color: "#64748b", marginBottom: 3, letterSpacing: 0.5 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: "0.82rem", color: c.accent, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Plain/Tech toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button style={s.toggleBtn(buildMode === "plain")} onClick={() => setBuildMode("plain")}>💬 Plain English</button>
          <button style={s.toggleBtn(buildMode === "tech")}  onClick={() => setBuildMode("tech")}>🔬 Technical</button>
        </div>
        <div style={s.pShort}>{buildMode === "plain" ? c.plain : c.tech}</div>

        {/* Free navigation — no timer */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          {buildIdx > 0 && (
            <button style={s.btnGhost} onClick={() => { setBuildIdx(i => i - 1); setBuildMode("plain"); }}>← Back</button>
          )}
          {!isLast
            ? <button style={s.btn()} onClick={() => { setBuildIdx(i => i + 1); setBuildMode("plain"); }}>{c.hook}</button>
            : <button style={s.btn("#4ade80")} onClick={() => setStage(2)}>{c.hook}</button>
          }
        </div>
      </div>
    );
  }

  function renderSeeIt() {
    const step = timeline[seeStep];
    return (
      <div style={s.card}>
        <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>TIMELINE — {seeStep + 1} OF {timeline.length}</div>
        <div style={s.h2}>📽️ From Firing Tables to Stored Programs</div>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 3, marginBottom: 16, flexWrap: "wrap" }}>
          {timeline.map((_, i) => <div key={i} style={{ height: 4, flex: 1, minWidth: 14, borderRadius: 4, background: i <= seeStep ? "#818cf8" : "#1e293b", transition: "background 0.3s" }} />)}
        </div>
        {/* Event card */}
        <div style={{ background: step.color + "33", border: `1px solid ${step.color}88`, borderRadius: 14, padding: "16px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 2 }}>{step.year}</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{step.label}</div>
          <div style={{ fontSize: "0.83rem", color: "#94a3b8", lineHeight: 1.65 }}>{step.detail}</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {seeStep > 0 && <button style={s.btnGhost} onClick={() => setSeeStep(i => i - 1)}>← Back</button>}
          {seeStep < timeline.length - 1
            ? <button style={s.btn()} onClick={() => setSeeStep(i => i + 1)}>Next →</button>
            : <button style={s.btn("#4ade80")} onClick={() => setStage(3)}>Now feel the problem yourself →</button>}
        </div>
      </div>
    );
  }

  function renderTryIt() {
    if (tryDone) {
      return (
        <div style={s.card}>
          <div style={s.h2}>🧪 You did it — but did you feel it?</div>
          <div style={{ ...s.infoBox("#818cf8") }}>
            <div style={{ color: "#c7d2fe", fontWeight: 700, marginBottom: 6 }}>That was ONE trajectory. Three steps.</div>
            <div style={s.pShort}>A real WWI firing table needed <strong style={{color:"#f1f5f9"}}>3,000 trajectories</strong>, each with <strong style={{color:"#f1f5f9"}}>~50 steps</strong> like those. That's 150,000 arithmetic operations — by hand — with a 1–2% error rate. Under wartime pressure. After 6 hours.</div>
            <div style={{ color: "#818cf8", fontWeight: 700 }}>This is the problem Babbage, Ada, Turing, Shannon, and Von Neumann dedicated their lives to solving.</div>
          </div>
          <button style={s.btn("#4ade80")} onClick={() => setStage(4)}>Take the Challenge →</button>
        </div>
      );
    }
    const step = calcSteps[tryStep];
    return (
      <div style={s.card}>
        <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>STEP {tryStep + 1} OF {calcSteps.length} — BE THE HUMAN COMPUTER</div>
        <div style={s.h2}>🧪 Compute a Firing Angle</div>
        <div style={{ ...s.infoBox("#334155") }}>
          <div style={{ color: "#e2e8f0", fontSize: "0.86rem", lineHeight: 1.7 }}>{step.instruction}</div>
        </div>
        <input style={s.input} type="number" placeholder="Your answer…" value={tryAnswer} onChange={e => { setTryAnswer(e.target.value); setTryFeedback(null); }} />
        {tryFeedback === "wrong" && (
          <div style={{ ...s.infoBox("#ef4444"), marginTop: 8 }}>
            <div style={{ color: "#fca5a5", fontSize: "0.82rem" }}>💡 Hint: {step.hint}</div>
          </div>
        )}
        {tryFeedback === "right" && (
          <div style={{ ...s.infoBox("#4ade80"), marginTop: 8 }}>
            <div style={{ color: "#86efac", fontSize: "0.82rem" }}>✅ {step.explanation}</div>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {tryFeedback !== "right" && (
            <button style={s.btn()} onClick={() => {
              const ans = parseFloat(tryAnswer);
              const correct = parseFloat(step.answer);
              if (Math.abs(ans - correct) < 0.05) setTryFeedback("right");
              else setTryFeedback("wrong");
            }}>Check →</button>
          )}
          {tryFeedback === "right" && (
            <button style={s.btn("#4ade80")} onClick={() => {
              if (tryStep < calcSteps.length - 1) { setTryStep(s => s + 1); setTryAnswer(""); setTryFeedback(null); }
              else setTryDone(true);
            }}>{tryStep < calcSteps.length - 1 ? "Next Step →" : "Done!"}</button>
          )}
          {tryStep > 0 && <button style={s.btnGhost} onClick={() => { setTryStep(s => s - 1); setTryAnswer(""); setTryFeedback(null); }}>← Back</button>}
        </div>
      </div>
    );
  }

  function renderChallenge() {
    const { pairs, rights } = rightOrder;
    const allMatched = Object.keys(matched).length === pairs.length;
    function tapLeft(left) { if (!matched[left]) setSelLeft(left); }
    function tapRight(right) {
      if (!selLeft) return;
      const correct = pairs.find(p => p.left === selLeft)?.right === right;
      if (correct) setMatched(m => ({ ...m, [selLeft]: right }));
      else { setWrongFlash(right); setTimeout(() => setWrongFlash(null), 600); }
      setSelLeft(null);
    }
    return (
      <div style={s.card}>
        <div style={s.h2}>🎯 Match the Person to their Contribution</div>
        <div style={s.p}>Tap a name on the left, then tap their contribution on the right.</div>
        <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: 12 }}>{Object.keys(matched).length} / {pairs.length} matched</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 140px" }}>
            {pairs.map(p => (
              <div key={p.left} onClick={() => tapLeft(p.left)} style={{ background: matched[p.left] ? "#14532d44" : selLeft === p.left ? "#1e1b4b" : "#0f172a", border: matched[p.left] ? "1px solid #4ade8055" : selLeft === p.left ? "2px solid #818cf8" : "1px solid #334155", borderRadius: 10, padding: "10px 12px", marginBottom: 8, cursor: matched[p.left] ? "default" : "pointer", fontSize: "0.8rem", color: matched[p.left] ? "#4ade80" : selLeft === p.left ? "#818cf8" : "#e2e8f0", transition: "all 0.15s" }}>
                {matched[p.left] ? "✅ " : selLeft === p.left ? "👉 " : ""}{p.left}
              </div>
            ))}
          </div>
          <div style={{ flex: "1 1 140px" }}>
            {rights.map(r => (
              <div key={r} onClick={() => tapRight(r)} style={{ background: Object.values(matched).includes(r) ? "#14532d44" : wrongFlash === r ? "#450a0a" : "#0f172a", border: Object.values(matched).includes(r) ? "1px solid #4ade8055" : wrongFlash === r ? "2px solid #ef4444" : "1px solid #334155", borderRadius: 10, padding: "10px 12px", marginBottom: 8, cursor: Object.values(matched).includes(r) ? "default" : "pointer", fontSize: "0.79rem", color: Object.values(matched).includes(r) ? "#4ade80" : "#94a3b8", transition: "all 0.15s" }}>
                {Object.values(matched).includes(r) ? "✅ " : ""}{r}
              </div>
            ))}
          </div>
        </div>
        {allMatched && <button style={s.btn("#4ade80")} onClick={() => setStage(5)}>All matched! Take the Quiz →</button>}
      </div>
    );
  }

  function renderQuiz() {
    if (quizFinished) {
      return (
        <div style={s.card}>
          <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: 10 }}>🏆</div>
          <div style={s.h2}>Lesson 1 Complete!</div>
          <div style={s.p}>
            {student?.name ? `Well done, ${student.name}!` : "Well done!"}{" "}
            You understand why computing needed to be automated — the human cost of manual arithmetic, Babbage's mechanical dream, Ada's algorithmic insight, Turing's universal machine, Shannon's circuit theory, and Von Neumann's stored-program breakthrough. Lesson 2 will show you HOW machines actually compute — using switches, binary, and logic gates.
          </div>
          <button style={s.btn("#4ade80")} onClick={() => onUnitComplete?.()}>Continue to Lesson 2 →</button>
        </div>
      );
    }
    const q = quiz[quizIdx];
    return (
      <div style={s.card}>
        <div style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: 1, marginBottom: 6 }}>QUIZ — QUESTION {quizIdx + 1} OF {quiz.length}</div>
        <div style={{ height: 4, background: "#1e293b", borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(quizIdx / quiz.length) * 100}%`, background: "#818cf8", transition: "width 0.4s" }} />
        </div>
        <div style={{ ...s.p, color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem", marginBottom: 14 }}>{q.q}</div>
        {q.options.map((opt, i) => {
          const isSel = quizSel === i;
          const isCorrect = quizFeedback === "right" && isSel;
          const isWrong = quizFeedback === "wrong" && isSel;
          return <div key={i} style={s.quizOption(isSel, isCorrect, isWrong)} onClick={() => { if (!quizFeedback || quizFeedback === "wrong") { setQuizSel(i); setQuizFeedback(null); } }}>{opt}</div>;
        })}
        {quizFeedback === "wrong" && <div style={{ background: "#1c1a0a", border: "1px solid #ca8a0444", borderRadius: 10, padding: 12, margin: "10px 0", color: "#fde68a", fontSize: "0.82rem" }}>💡 {q.hints[Math.min(quizAttempts - 1, q.hints.length - 1)]}</div>}
        {quizFeedback === "right" && <div style={{ background: "#0a1f14", border: "1px solid #4ade8044", borderRadius: 10, padding: 12, margin: "10px 0", color: "#86efac", fontSize: "0.82rem" }}>✅ {q.explanation}</div>}
        {quizFeedback !== "right"
          ? <button style={s.btn()} disabled={quizSel === null} onClick={() => { if (quizSel === q.answer) setQuizFeedback("right"); else { setQuizAttempts(a => a + 1); setQuizFeedback("wrong"); setQuizSel(null); } }}>Check Answer</button>
          : <button style={s.btn("#4ade80")} onClick={() => { if (quizIdx + 1 < quiz.length) { setQuizIdx(i => i + 1); setQuizSel(null); setQuizFeedback(null); setQuizAttempts(0); } else setQuizFinished(true); }}>{quizIdx + 1 < quiz.length ? "Next Question →" : "Finish Quiz 🎉"}</button>}
      </div>
    );
  }

  const stageRenderers = [renderSpark, renderBuild, renderSeeIt, renderTryIt, renderChallenge, renderQuiz];
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.unitLabel}>Unit 0 · Lesson 1 of 3 · Computer Organization & Architecture</div>
        <div style={s.unitTitle}>The Problem & The Dream</div>
      </div>
      <div style={s.stageBar}>{stageLabels.map((label, i) => <div key={i} style={s.stageDot(stage === i, stage > i)}>{label}</div>)}</div>
      {stageRenderers[stage]()}
    </div>
  );
}
