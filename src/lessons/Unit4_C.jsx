// Unit4_C.jsx — Module 4 Capstone — "Trace an Address"
// Foothold capstone arc: The Mission -> Build in Steps -> Play It -> Full
// Procedure -> Quiz. Ties together every unit of Module 4 into one real,
// numeric worked translation (the notes' segment 6 / page 2 / word 7E hex
// example): segment table + page table give the two-access walk (Unit4_6),
// the TLB shortcut is the associative memory of Unit4_4 doing real work,
// the memory being addressed is the chip/module world of Unit4_2, and a
// TLB miss on a truly absent page would bottom out in the auxiliary fetch
// of Unit4_5. Ends with "Module 4 Complete!" — this IS the module's final unit.
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

// Shared "world" data for this capstone — matches the notes' worked example.
const SEGMENT_TABLE = { 6: 35, 15: 163 }; // segment -> page-table base address (F=15 -> 163/0xA3)
const PAGE_TABLE = { 35: 0x12, 36: 0x00, 37: 0x19, 38: 0x53, 39: 0xA61 & 0xfff }; // page-table addr -> block (hex, illustrative)
const TLB = [{ seg: 6, page: 2, block: 0x19 }]; // pre-loaded from a prior access

function hex(n, w = 3) { return n.toString(16).toUpperCase().padStart(w, "0"); }

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Mission
// ══════════════════════════════════════════════════════════════════
function Mission() {
  const checklist = [
    { unit: "4.1", tool: "The memory hierarchy", role: "Physical memory sits below cache — this is what we're ultimately addressing." },
    { unit: "4.2", tool: "Chip/module addressing", role: "The physical block+word we compute is a real address into RAM chips." },
    { unit: "4.3", tool: "Mapping & replacement (LRU)", role: "The TLB is itself a tiny associative cache with its own replacement policy." },
    { unit: "4.4", tool: "Associative memory (A, K, M)", role: "The TLB IS an associative memory — search by (segment,page) content, not address." },
    { unit: "4.5", tool: "Auxiliary memory", role: "A true page-table miss (presence bit 0) means fetching from disk." },
    { unit: "4.6", tool: "Pages, page table, MMU", role: "The two-level segment-table → page-table walk is exactly this unit's mechanism." },
  ];
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        <strong style={{ color: C.accent }}>The mission:</strong> translate the logical address
        <code style={{ color: C.text }}> segment 6, page 2, word 7E</code> (hex) into a physical
        address — the exact worked example from the notes — using every tool this module built.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {checklist.map((c) => (
          <div key={c.unit} style={{ display: "flex", gap: 10, padding: "8px 12px", borderRadius: 8, background: C.card, border: `1px solid ${C.border}` }}>
            <div style={{ minWidth: 34, fontSize: 11, color: C.accent, fontWeight: 800 }}>{c.unit}</div>
            <div>
              <div style={{ fontSize: 12.5, color: C.text, fontWeight: 600 }}>{c.tool}</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>{c.role}</div>
            </div>
          </div>
        ))}
      </div>
      <Key>
        Nothing new is being taught here — this unit is entirely about COMBINING six units' worth
        of ideas into one working translation.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Build in Steps (v1: table walk only, v2: + TLB)
// ══════════════════════════════════════════════════════════════════
function BuildInSteps() {
  const [v, setV] = useState(1);
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Grow the translator in two versions — each adds exactly one idea.
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button onClick={() => setV(1)} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, border: `1px solid ${v === 1 ? C.accent : C.border}`, background: v === 1 ? C.accentGlow : "transparent", color: v === 1 ? "#fff" : C.muted }}>v1 — Table walk only</button>
        <button onClick={() => setV(2)} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700, border: `1px solid ${v === 2 ? C.green : C.border}`, background: v === 2 ? C.green + "22" : "transparent", color: v === 2 ? C.green : C.muted }}>v2 — + TLB shortcut</button>
      </div>

      {v === 1 ? (
        <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>v1: ALWAYS WALK BOTH TABLES</div>
          <ol style={{ color: C.muted, fontSize: 13, lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
            <li>Look up segment 6 in the segment table → get page-table base address</li>
            <li>Look up page 2 in that page table → get the block number</li>
            <li>Combine block + word offset → physical address</li>
          </ol>
          <div style={{ marginTop: 10, fontSize: 12, color: C.orange }}>Works, but costs TWO extra memory accesses on every single reference — even repeats of the same page.</div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1px solid ${C.green}44`, borderRadius: 10, padding: 16 }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>v2: CHECK THE TLB FIRST</div>
          <ol style={{ color: C.muted, fontSize: 13, lineHeight: 1.9, paddingLeft: 18, margin: 0 }}>
            <li>Search the TLB (associative memory) for (segment, page) — in PARALLEL, one step</li>
            <li>Hit? → block number comes back immediately, skip both table accesses entirely</li>
            <li>Miss? → fall back to v1's two-step walk, then CACHE the result in the TLB for next time</li>
          </ol>
          <div style={{ marginTop: 10, fontSize: 12, color: C.green }}>Why v1 wasn't enough: repeated references to the same page are extremely common (locality, Unit 4.1) — paying the full two-access cost every time wastes exactly the pattern the TLB is built to exploit.</div>
        </div>
      )}
      <Key color={v === 1 ? C.accent : C.green}>
        v2 doesn't replace v1 — it's v1 PLUS a fast path in front of it. The slow path never goes away; it's just taken far less often.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Play It: the full translator
// ══════════════════════════════════════════════════════════════════
const REQUESTS = [
  { seg: 6, page: 2, word: "7E", label: "Segment 6 / Page 2 / Word 7E (in TLB)" },
  { seg: 6, page: 0, word: "10", label: "Segment 6 / Page 0 / Word 10 (not in TLB)" },
  { seg: 6, page: 4, word: "05", label: "Segment 6 / Page 4 / Word 05 (not in TLB)" },
];

function PlayIt() {
  const [reqIdx, setReqIdx] = useState(0);
  const [step, setStep] = useState(0);
  const req = REQUESTS[reqIdx];

  const tlbHit = TLB.find((t) => t.seg === req.seg && t.page === req.page);
  const segBase = SEGMENT_TABLE[req.seg];
  const pageAddr = segBase !== undefined ? segBase + req.page : null;
  const block = tlbHit ? tlbHit.block : (pageAddr !== undefined ? PAGE_TABLE[pageAddr] : undefined);

  const steps = tlbHit
    ? [
        `Logical address: segment ${req.seg}, page ${req.page}, word ${req.word}`,
        `Search TLB for (segment ${req.seg}, page ${req.page}) — MATCH found instantly`,
        `Block = ${hex(block)} (from TLB, no table walk needed)`,
        `Physical address = block ${hex(block)}, word ${req.word} → ${hex(block)}${req.word}`,
      ]
    : [
        `Logical address: segment ${req.seg}, page ${req.page}, word ${req.word}`,
        `Search TLB for (segment ${req.seg}, page ${req.page}) — no match (miss)`,
        `Segment table: segment ${req.seg} → page-table base ${segBase}`,
        `Page table: address ${pageAddr} (base ${segBase} + page ${req.page}) → block ${hex(block)}`,
        `Physical address = block ${hex(block)}, word ${req.word} → ${hex(block)}${req.word}`,
        `TLB updated: (segment ${req.seg}, page ${req.page}) → block ${hex(block)}, ready for next time`,
      ];
  const cur = Math.min(step, steps.length - 1);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Pick a logical address and step through its full translation.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {REQUESTS.map((r, i) => (
          <button key={i} onClick={() => { setReqIdx(i); setStep(0); }} style={{
            textAlign: "left", padding: "9px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12.5,
            border: `1px solid ${reqIdx === i ? C.accent : C.border}`, background: reqIdx === i ? C.accent + "18" : C.card,
            color: reqIdx === i ? C.accent : C.text,
          }}>{r.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
        {steps.map((t, i) => (
          <div key={i} style={{
            padding: "9px 12px", borderRadius: 7, fontSize: 12.5, fontFamily: i > 0 ? "monospace" : "inherit",
            border: `1px solid ${i === cur ? C.accent : C.border}`,
            background: i === cur ? C.accent + "18" : i < cur ? C.card : "transparent",
            color: i <= cur ? C.text : C.muted + "88",
          }}>{i + 1}. {t}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={cur === 0} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: cur === 0 ? C.muted + "66" : C.muted, cursor: cur === 0 ? "default" : "pointer", fontSize: 12 }}>↺ Back</button>
        <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={cur === steps.length - 1} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: cur === steps.length - 1 ? C.border : C.accentGlow, color: cur === steps.length - 1 ? C.muted : "#fff", cursor: cur === steps.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>Step ▶ ({cur + 1}/{steps.length})</button>
      </div>

      {cur === steps.length - 1 && (
        <div style={{ padding: "12px 14px", borderRadius: 8, background: C.green + "14", border: `1px solid ${C.green}55`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted }}>PHYSICAL ADDRESS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.green, fontFamily: "monospace" }}>{hex(block)}{req.word}</div>
        </div>
      )}

      <Key>
        Compare the step counts: the TLB-hit request finishes in 4 steps; a TLB-miss request needs
        6 — two of them (segment table + page table) are the exact cost the TLB exists to avoid.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Full Procedure (reference listing) + Challenge
// ══════════════════════════════════════════════════════════════════
function FullProcedure() {
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        The complete algorithm, as it would be written up for reference — every hardware
        component from this module appears exactly once.
      </p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", fontFamily: "monospace", fontSize: 12.5, color: C.text, lineHeight: 2 }}>
        <div style={{ color: C.muted }}>// Translate logical address (segment, page, word) → physical address</div>
        <div>1. (seg, page) → search <span style={{ color: C.green }}>TLB</span> (associative memory, Unit 4.4)</div>
        <div>2. &nbsp;&nbsp;IF hit: block ← TLB's stored block number. GOTO 6.</div>
        <div>3. &nbsp;&nbsp;IF miss: base ← <span style={{ color: C.accent }}>segment table</span>[seg]</div>
        <div>4. &nbsp;&nbsp;&nbsp;&nbsp;entry ← <span style={{ color: C.purple }}>page table</span>[base + page]</div>
        <div>5. &nbsp;&nbsp;&nbsp;&nbsp;IF presence bit = 0: <span style={{ color: C.red }}>PAGE FAULT</span> → fetch from <span style={{ color: C.orange }}>auxiliary memory</span> (Unit 4.5), retry</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ELSE: block ← entry's block number; update TLB (evict via LRU if full, Unit 4.3)</div>
        <div>6. physical address ← block, word &nbsp;<span style={{ color: C.muted }}>// word offset unchanged throughout</span></div>
      </div>

      <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 8, background: C.purple + "14", border: `1px solid ${C.purple}44` }}>
        <div style={{ color: C.purple, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>🧩 CHALLENGE UPGRADE</div>
        <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.7 }}>
          What if the TLB has room for only ONE entry, and the program alternates between page 2
          and page 4 of segment 6 on every single reference? Trace it by hand — you'll find the
          TLB is useless here (every access is a fresh miss). This is exactly why real TLBs hold
          dozens to hundreds of entries, not just one.
        </div>
      </div>

      <Key color={C.green}>
        This single procedure is the payoff of the whole module: hierarchy told you WHY a fast
        path matters, associative memory gave you the TLB's hardware, cache gave you the
        replacement policy, and auxiliary memory is what a real page fault falls back to.
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
      q: "In the full translation procedure, what is checked FIRST, before any table is walked?",
      options: ["The presence bit", "The TLB (associative memory)", "The auxiliary storage device", "The word offset"],
      answer: 1,
      explain: "The TLB is always checked first — it's the fast path that, on a hit, skips both the segment-table and page-table accesses entirely.",
    },
    {
      q: "On a TLB miss, in what order are the segment table and page table consulted?",
      options: [
        "Page table first, then segment table",
        "Segment table first (to find the page-table base), then the page table (to find the block)",
        "Both are searched simultaneously and the faster answer wins",
        "Neither is needed if the TLB misses",
      ],
      answer: 1,
      explain: "The segment number indexes the segment table to find WHERE that segment's page table starts; only then can the page number index into it to find the block.",
    },
    {
      q: "What happens if the page table entry's presence bit is 0?",
      options: [
        "The physical address is simply set to 0",
        "A page fault occurs — the OS fetches the page from auxiliary storage before the reference can complete",
        "The TLB is cleared entirely",
        "The segment table is re-searched",
      ],
      answer: 1,
      explain: "Presence bit 0 means the page isn't currently in physical memory — this is exactly a page fault, requiring the auxiliary-memory fetch from Unit 4.5.",
    },
    {
      q: "Why does updating the TLB after a miss (adding the newly-found segment/page → block pair) make sense?",
      options: [
        "It doesn't help — the TLB update is pointless",
        "Locality of reference (Unit 4.1) means that page is likely to be referenced again soon, so caching its translation avoids repeating the expensive two-table walk",
        "It's required by law for all MMUs",
        "It permanently deletes the segment table entry",
      ],
      answer: 1,
      explain: "Just like a data cache, the TLB pays off because of locality — the same page tends to be referenced repeatedly in a short window, so caching its translation saves the two-access walk on every subsequent hit.",
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
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🏆" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Perfect! You can trace a full address translation end to end." :
            score >= 2 ? "Good work! Replay 'Play It' and compare a TLB-hit trace against a TLB-miss trace." :
              "Revisit 'The Mission' and 'Play It', then try again."}
        </div>
        <div style={{
          padding: "22px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>🎉 Module 4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            From the hierarchy pyramid to a full segment/page/TLB address translation — you've
            built the entire memory system, one layer at a time, and just traced a real address
            through every layer of it.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Module 5 — Input / Output Organization.</strong>{" "}
            Memory was about storing data. Now: how does the CPU talk to everything OUTSIDE memory — keyboards, disks, networks — without wasting a single cycle waiting on them?
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
export default function Unit4_C({ student, onUnitComplete }) {
  const sections = [
    { id: "mission", label: "The Mission" },
    { id: "build", label: "Build in Steps" },
    { id: "play", label: "Play It" },
    { id: "full", label: "Full Procedure" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🎯 The Mission</h3>
      <Mission />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛠️ Build in Steps</h3>
      <BuildInSteps />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>▶️ Play It — the full translator</h3>
      <PlayIt />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📋 Full Procedure</h3>
      <FullProcedure />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of the Module 4 capstone.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏆</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › CAPSTONE</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Trace an Address</div>
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
