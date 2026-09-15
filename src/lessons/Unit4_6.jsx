// Unit4_6.jsx — Module 4 › Unit 4.6 — "Virtual Memory & the MMU"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: programs bigger than RAM (the need) -> pages/frames & the page table
// (concept) -> trace a reference through TLB-hit / TLB-miss / page-fault
// paths -> a resident page table with a simulated page fault + LRU eviction
// -> quiz. Scaffolds on Unit4_3 (associative search, LRU) and Unit4_4 (the
// associative-memory anatomy) directly — the TLB IS that hardware reused.
// The full segment+page+TLB numeric trace is the JOB of the Unit4_C capstone.
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
//  Section 1 — Programs Bigger Than RAM
// ══════════════════════════════════════════════════════════════════
function NeedWidget() {
  const [progSize, setProgSize] = useState(6); // in "RAM units", RAM = 4
  const RAM = 4;
  const fits = progSize <= RAM;
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Physical RAM is fixed and small compared to what programs (and how many of them at once)
        actually need. Slide the program's size past what RAM can hold.
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>Program size = <strong style={{ color: C.accent }}>{progSize}</strong> units (RAM holds {RAM})</label>
        <input type="range" min={1} max={10} value={progSize} onChange={(e) => setProgSize(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>

      <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>PHYSICAL RAM ({RAM} units)</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
          {Array.from({ length: RAM }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 30, borderRadius: 5, background: C.teal + "22", border: `1px solid ${C.teal}66` }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>THE PROGRAM ({progSize} units)</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {Array.from({ length: progSize }).map((_, i) => (
            <div key={i} style={{ width: 40, height: 30, borderRadius: 5, background: (i < RAM ? C.green : C.red) + "22", border: `1px solid ${(i < RAM ? C.green : C.red)}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: i < RAM ? C.green : C.red }}>{i < RAM ? "fits" : "!"}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, fontSize: 13, color: C.muted }}>
        {fits ? "The whole program fits in RAM at once — no problem." : `${progSize - RAM} unit(s) don't fit. Without virtual memory, this program simply couldn't run.`}
      </div>

      <Key>
        <strong style={{ color: C.text }}>Virtual memory</strong> gives every program the illusion
        of a large, private address space, while quietly keeping only the ACTIVELY-USED pieces in
        physical RAM — the rest waits on auxiliary storage (Unit 4.5) until needed.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Pages, Frames & the Page Table
// ══════════════════════════════════════════════════════════════════
function PagesAndTable() {
  const pageTable = [
    { page: 0, frame: 3, present: true },
    { page: 1, frame: null, present: false },
    { page: 2, frame: 0, present: true },
    { page: 3, frame: null, present: false },
    { page: 4, frame: 1, present: true },
    { page: 5, frame: null, present: false },
  ];
  const [sel, setSel] = useState(0);
  const row = pageTable.find((r) => r.page === sel);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Both address space and memory space are chopped into equal-size pieces: <strong style={{ color: C.accent }}>pages</strong> (in
        the program's virtual address space) and <strong style={{ color: C.teal }}>frames</strong> (a.k.a.
        blocks, in physical memory). The page table maps one to the other. Click a virtual page.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {pageTable.map((r) => (
          <button key={r.page} onClick={() => setSel(r.page)} style={{
            width: 46, height: 46, borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 12,
            border: `1.5px solid ${sel === r.page ? C.accent : r.present ? C.green + "66" : C.border}`,
            background: sel === r.page ? C.accent + "22" : r.present ? C.green + "0d" : C.card,
            color: sel === r.page ? C.accent : C.text,
          }}>P{r.page}</button>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${row.present ? C.green : C.red}55`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>Virtual page</span>
          <strong style={{ color: C.text }}>{row.page}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>Presence bit</span>
          <strong style={{ color: row.present ? C.green : C.red }}>{row.present ? "1 (resident)" : "0 (not in RAM)"}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: C.muted, fontSize: 12 }}>Physical frame</span>
          <strong style={{ color: C.text }}>{row.present ? `Frame ${row.frame}` : "— (must fetch from disk)"}</strong>
        </div>
      </div>

      <Key color={C.teal}>
        A virtual address splits into a PAGE NUMBER (indexes the page table) and an OFFSET
        (unchanged, reused as-is). The page table swaps only the page number for a frame number —
        the offset within the page never changes.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace It: TLB Hit, TLB Miss, Page Fault
// ══════════════════════════════════════════════════════════════════
function TraceLookup() {
  const scenarios = [
    { id: "hit", label: "TLB Hit", col: C.green,
      steps: ["CPU generates virtual page number", "TLB (associative memory) is searched — MATCH found", "Frame number returned immediately", "Physical address assembled — access proceeds"] },
    { id: "miss", label: "TLB Miss, Page Present", col: C.orange,
      steps: ["CPU generates virtual page number", "TLB searched — NO match", "Walk the full page table in RAM instead", "Presence bit = 1 → frame found, TLB updated with this pair", "Physical address assembled — access proceeds"] },
    { id: "fault", label: "Page Fault", col: C.red,
      steps: ["CPU generates virtual page number", "TLB searched — NO match", "Walk the full page table — presence bit = 0", "PAGE FAULT: OS suspends the program", "OS fetches the page from auxiliary storage (Unit 4.5) into a free frame", "Page table + TLB updated, program resumes"] },
  ];
  const [sel, setSel] = useState("miss");
  const sc = scenarios.find((s) => s.id === sel);
  const [step, setStep] = useState(0);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every memory reference takes one of three paths. Pick a scenario, then step through it.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {scenarios.map((s) => (
          <button key={s.id} onClick={() => { setSel(s.id); setStep(0); }} style={{
            flex: 1, padding: "8px 6px", borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
            border: `1.5px solid ${sel === s.id ? s.col : C.border}`,
            background: sel === s.id ? s.col + "22" : C.card, color: sel === s.id ? s.col : C.muted,
          }}>{s.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {sc.steps.map((t, i) => (
          <div key={i} style={{
            padding: "8px 12px", borderRadius: 7, fontSize: 12.5,
            border: `1px solid ${i === step ? sc.col : C.border}`,
            background: i === step ? sc.col + "18" : i < step ? C.card : "transparent",
            color: i <= step ? C.text : C.muted + "88",
          }}>{i + 1}. {t}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: step === 0 ? C.muted + "66" : C.muted, cursor: step === 0 ? "default" : "pointer", fontSize: 12 }}>↺ Back</button>
        <button onClick={() => setStep((s) => Math.min(sc.steps.length - 1, s + 1))} disabled={step === sc.steps.length - 1} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: step === sc.steps.length - 1 ? C.border : C.accentGlow, color: step === sc.steps.length - 1 ? C.muted : "#fff", cursor: step === sc.steps.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>Step ▶ ({step + 1}/{sc.steps.length})</button>
      </div>

      <Key color={sc.col}>
        {sel === "hit" && "TLB hit is the fast path: one associative-memory lookup, no page table walk needed."}
        {sel === "miss" && "A TLB miss doesn't mean the page is missing — just that the TLB's small cache didn't have that particular translation yet."}
        {sel === "fault" && "A page fault is far more expensive than either TLB outcome — it means an actual disk-speed fetch (Unit 4.5) before the reference can even complete."}
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Cause a Page Fault (interactive)
// ══════════════════════════════════════════════════════════════════
function CauseAFault() {
  const [frames, setFrames] = useState([{ page: 0, age: 0 }, { page: 2, age: 1 }, { page: 4, age: 2 }]); // 3 frames, LRU order oldest→newest by index? we'll track age
  const [log, setLog] = useState("Click a page below to reference it.");
  const allPages = [0, 1, 2, 3, 4, 5];

  const reference = (p) => {
    const idx = frames.findIndex((f) => f.page === p);
    if (idx !== -1) {
      // hit: bump age (move to most-recently-used)
      const rest = frames.filter((f) => f.page !== p);
      setFrames([...rest, { page: p, age: 0 }]);
      setLog(`Page ${p} is already resident — no fault, just marked most-recently-used.`);
    } else {
      // fault: evict LRU (index 0, since we always push MRU to the end)
      const evicted = frames[0];
      const rest = frames.slice(1);
      setFrames([...rest, { page: p, age: 0 }]);
      setLog(`PAGE FAULT on page ${p} — fetched from disk, evicted page ${evicted.page} (least recently used) to make room.`);
    }
  };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Only 3 physical frames are available. Click pages to reference them and watch LRU (Unit
        4.3's replacement policy, reused here for pages instead of cache lines) decide who gets evicted.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {allPages.map((p) => {
          const resident = frames.some((f) => f.page === p);
          return (
            <button key={p} onClick={() => reference(p)} style={{
              width: 44, height: 44, borderRadius: 8, cursor: "pointer", fontWeight: 700,
              border: `1.5px solid ${resident ? C.green : C.border}`,
              background: resident ? C.green + "18" : C.card, color: resident ? C.green : C.text,
            }}>P{p}</button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {frames.map((f, i) => (
          <div key={i} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, textAlign: "center", border: `1px solid ${C.border}`, background: C.card }}>
            <div style={{ fontSize: 10, color: C.muted }}>frame {i} {i === 0 ? "(LRU next)" : ""}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>P{f.page}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{log}</div>

      <Key>
        Exactly the same eviction logic as a cache set — only now "line" means "physical frame"
        and the miss penalty is a disk fetch instead of a main-memory fetch, which is why page
        faults are so much more expensive than cache misses.
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
      q: "What illusion does virtual memory create for a running program?",
      options: [
        "That the CPU is faster than it really is",
        "A large, private address space, even though physical RAM is much smaller",
        "That the disk has no capacity limit",
        "That multiple programs share one single address",
      ],
      answer: 1,
      explain: "Virtual memory lets each program address far more memory than physically exists, keeping only the actively-used parts resident in RAM.",
    },
    {
      q: "In a virtual address split into a page number and an offset, what does the page table actually translate?",
      options: [
        "It translates the offset into a page number",
        "It translates the page number into a physical frame number; the offset passes through unchanged",
        "It translates the entire virtual address into a completely unrelated random address",
        "It deletes the offset entirely",
      ],
      answer: 1,
      explain: "Only the page number needs translating (to a frame). The offset within the page is the same in both the virtual and physical address.",
    },
    {
      q: "What's the difference between a TLB miss and a page fault?",
      options: [
        "They are exactly the same event",
        "A TLB miss just means the fast associative cache didn't have the translation (a full page-table walk still finds it if present); a page fault means the page itself isn't in RAM at all and must be fetched from disk",
        "A page fault is faster than a TLB miss",
        "A TLB miss only happens for pages that don't exist",
      ],
      answer: 1,
      explain: "TLB miss → check the full page table (still in RAM, just slower). Page fault → the page isn't resident anywhere in RAM, requiring an actual disk fetch — a far bigger penalty.",
    },
    {
      q: "In the page-fault demo, why did referencing a new page evict the frame holding the LEAST recently used page?",
      options: [
        "Frames are evicted in random order",
        "The oldest frame by arrival time is always evicted (FIFO), regardless of use",
        "LRU replacement evicts whichever resident page has gone the longest without being referenced",
        "The largest page is always evicted first",
      ],
      answer: 2,
      explain: "LRU (Least Recently Used) — the same replacement idea from Unit 4.3's cache lines — evicts the page that hasn't been touched in the longest time.",
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
          {score === 4 ? "Perfect! Pages, page tables, TLB paths and faults are all locked in." :
            score >= 2 ? "Good work! Replay 'Trace It' and compare the TLB-hit vs page-fault step counts." :
              "Revisit 'Pages, Frames & the Page Table' and 'Trace It', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 4.6 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            Pages, frames, the page table, and the TLB/page-fault paths are all in place.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: the Module 4 Capstone — Trace an Address.</strong>{" "}
            Put every piece from this whole module together: translate one real logical address all the way to a physical one, using the TLB shortcut you just learned.
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
export default function Unit4_6({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Bigger Than RAM" },
    { id: "pages", label: "Pages & Table" },
    { id: "trace", label: "Trace It" },
    { id: "fault", label: "Cause a Fault" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>❓ Programs Bigger Than RAM</h3>
      <NeedWidget />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📑 Pages, Frames &amp; the Page Table</h3>
      <PagesAndTable />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔀 Trace It: TLB Hit / Miss / Page Fault</h3>
      <TraceLookup />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>💥 Cause a Page Fault</h3>
      <CauseAFault />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 4.6.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › UNIT 4.6</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Virtual Memory &amp; the MMU</div>
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
