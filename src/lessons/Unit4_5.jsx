// Unit4_5.jsx — Module 4 › Unit 4.5 — "Auxiliary Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: why the hierarchy needs a non-volatile bottom level -> anatomy of a
// disk access (seek + rotational latency + transfer) made interactive ->
// step through an actual disk read -> compare disk/tape/optical -> quiz.
// Scaffolds on Unit4_1 (auxiliary storage was the bottom of the pyramid —
// biggest, slowest, cheapest) without repeating the pyramid itself.
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
//  Section 1 — Why Non-Volatile Storage?
// ══════════════════════════════════════════════════════════════════
function NeedWidget() {
  const [power, setPower] = useState(true);
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Unit 4.1's pyramid ended at "auxiliary storage" without saying why it has to exist at all.
        Flip the power switch and see what a computer built ONLY from RAM would be like.
      </p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <button onClick={() => setPower((p) => !p)} style={{
          padding: "10px 22px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700,
          border: `1px solid ${power ? C.green : C.red}`, background: (power ? C.green : C.red) + "18",
          color: power ? C.green : C.red,
        }}>{power ? "🟢 Power ON" : "🔴 Power OFF"}</button>
      </div>

      {power ? (
        <div style={{ background: C.card, border: `1.5px solid ${C.green}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>📄 📁 🖼️</div>
          <div style={{ color: C.muted, fontSize: 13 }}>Your files, photos and documents are all sitting safely in RAM. Everything works fine — for now.</div>
        </div>
      ) : (
        <div style={{ background: C.card, border: `1.5px solid ${C.red}44`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>💨💨💨</div>
          <div style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>Everything is GONE.</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 6 }}>RAM is volatile — the instant power is lost, every stored charge/state disappears. A machine with no other storage has nothing left at all.</div>
        </div>
      )}

      <Key>
        <strong style={{ color: C.text }}>Auxiliary (secondary) memory</strong> exists to be the
        opposite of RAM on the ONE axis that matters most for permanence: non-volatile, so your
        data survives power loss — at the cost of being far slower to access.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Anatomy of a Disk Access
// ══════════════════════════════════════════════════════════════════
function DiskAccess() {
  const [seek, setSeek] = useState(8);      // ms
  const [rpm, setRpm] = useState(7200);
  const rotMs = 60000 / rpm;
  const latency = rotMs / 2; // average = half a revolution
  const transfer = 0.3; // ms, illustrative fixed sector transfer time
  const total = seek + latency + transfer;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Reading one sector from a magnetic disk takes three stages, back to back. Adjust the
        sliders and watch the total access time respond.
      </p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>Seek time (move head to the track) = <strong style={{ color: C.accent }}>{seek} ms</strong></label>
        <input type="range" min={1} max={20} value={seek} onChange={(e) => setSeek(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>Rotation speed = <strong style={{ color: C.orange }}>{rpm} RPM</strong></label>
        <input type="range" min={3600} max={15000} step={600} value={rpm} onChange={(e) => setRpm(Number(e.target.value))} style={{ width: "100%", accentColor: C.orange }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, padding: "10px 6px", borderRadius: 8, textAlign: "center", background: C.accent + "14", border: `1px solid ${C.accent}44` }}>
          <div style={{ fontSize: 10, color: C.muted }}>Seek</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.accent }}>{seek.toFixed(1)} ms</div>
        </div>
        <div style={{ flex: 1, padding: "10px 6px", borderRadius: 8, textAlign: "center", background: C.orange + "14", border: `1px solid ${C.orange}44` }}>
          <div style={{ fontSize: 10, color: C.muted }}>Rotational latency</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.orange }}>{latency.toFixed(2)} ms</div>
        </div>
        <div style={{ flex: 1, padding: "10px 6px", borderRadius: 8, textAlign: "center", background: C.teal + "14", border: `1px solid ${C.teal}44` }}>
          <div style={{ fontSize: 10, color: C.muted }}>Transfer</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.teal }}>{transfer.toFixed(1)} ms</div>
        </div>
      </div>

      <div style={{ padding: "12px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, textAlign: "center" }}>
        <span style={{ color: C.muted, fontSize: 12 }}>Total access time = </span>
        <strong style={{ color: C.text, fontSize: 18 }}>{total.toFixed(2)} ms</strong>
      </div>

      <Key color={C.orange}>
        T<sub>access</sub> = T<sub>seek</sub> + (½ rotation) + T<sub>transfer</sub>. Rotational
        latency is an AVERAGE — the sector you want could already be under the head (0 wait) or
        could need almost a full spin (worst case) — half a revolution is the expected wait.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Trace a Real Read
// ══════════════════════════════════════════════════════════════════
function TraceRead() {
  const steps = [
    { title: "Idle", note: "Head is parked. CPU requests: read sector 47 on track 12.", angle: 0, track: 3 },
    { title: "Seeking", note: "The access mechanism moves the read/write head radially to track 12.", angle: 0, track: 12 },
    { title: "Rotational wait", note: "Head is over track 12, but sector 47 hasn't rotated underneath it yet — waiting.", angle: 140, track: 12 },
    { title: "Sector arrives", note: "The disk has rotated far enough — sector 47 is now directly under the head.", angle: 260, track: 12 },
    { title: "Transferring", note: "Bits are read off the track as it continues spinning under the stationary head.", angle: 300, track: 12 },
    { title: "Done", note: "Sector 47's data has been transferred to the main-memory buffer.", angle: 300, track: 12 },
  ];
  const [step, setStep] = useState(0);
  const cur = steps[step];
  const r = 20 + cur.track * 6;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Step through a single sector read from idle to done.
      </p>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="80" fill="none" stroke={C.border} strokeWidth="1" />
          <circle cx="90" cy="90" r={r} fill="none" stroke={C.teal} strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="90" cy="90" r="4" fill={C.muted} />
          {/* sector marker, rotates with disk */}
          <g transform={`rotate(${cur.angle} 90 90)`}>
            <circle cx={90 + r} cy="90" r="5" fill={C.orange} />
          </g>
          {/* read/write head, fixed position, moves only radially between steps */}
          <line x1="90" y1="90" x2={90 + r} y2="10" stroke={C.accent} strokeWidth="2" />
          <circle cx={90 + r * 0.11} cy={90 - r * 0.9} r="4" fill={C.accent} />
        </svg>
      </div>

      <div style={{ padding: "10px 14px", borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, marginBottom: 12 }}>
        <div style={{ color: C.accent, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{cur.title}</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{cur.note}</div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: step === 0 ? C.muted + "66" : C.muted, cursor: step === 0 ? "default" : "pointer", fontSize: 12 }}>↺ Back</button>
        <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: step === steps.length - 1 ? C.border : C.accentGlow, color: step === steps.length - 1 ? C.muted : "#fff", cursor: step === steps.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>Step ▶ ({step + 1}/{steps.length})</button>
      </div>

      <Key color={C.teal}>
        Notice the head barely moves once it's on the right track — the disk spins UNDER it. Two
        completely different kinds of "waiting" (seek vs rotation) are hiding inside one access time.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Compare the Storage Types
// ══════════════════════════════════════════════════════════════════
const MEDIA = [
  { id: "hard", name: "Hard Disk", icon: "💽", access: "Random — any track in a few ms", capacity: "GB–TB", use: "Primary secondary storage — the OS, programs, and files.", col: C.accent },
  { id: "floppy", name: "Floppy Disk", icon: "💾", access: "Random, but slower & lower density than hard disks", capacity: "~1.4 MB", use: "Historic removable storage for distributing small programs.", col: C.muted },
  { id: "tape", name: "Magnetic Tape", icon: "📼", access: "SEQUENTIAL only — must wind past everything in between", capacity: "Very high, at very low cost per byte", use: "Backup / archival — slowest access, but cheapest storage by far.", col: C.orange },
  { id: "optical", name: "Optical Disk", icon: "💿", access: "A laser follows one long spiral track of pits & lands", capacity: "Hundreds of MB – tens of GB", use: "CDs/DVDs/Blu-ray — cheap distribution and archival media.", col: C.purple },
];

function CompareMedia() {
  const [sel, setSel] = useState("tape");
  const m = MEDIA.find((x) => x.id === sel);
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Not all auxiliary storage works the same way. Click each medium.
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {MEDIA.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} style={{
            flex: 1, minWidth: 90, padding: "8px 6px", borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 700,
            border: `1.5px solid ${sel === x.id ? x.col : C.border}`,
            background: sel === x.id ? x.col + "22" : C.card, color: sel === x.id ? x.col : C.muted,
          }}>{x.icon} {x.name}</button>
        ))}
      </div>
      <div style={{ background: C.surface, border: `1px solid ${m.col}55`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ color: m.col, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{m.icon} {m.name}</div>
        <div style={{ marginBottom: 8 }}><div style={{ fontSize: 10, color: C.muted }}>ACCESS PATTERN</div><div style={{ fontSize: 13, color: C.text }}>{m.access}</div></div>
        <div style={{ marginBottom: 8 }}><div style={{ fontSize: 10, color: C.muted }}>TYPICAL CAPACITY</div><div style={{ fontSize: 13, color: C.text }}>{m.capacity}</div></div>
        <div><div style={{ fontSize: 10, color: C.muted }}>TYPICAL USE</div><div style={{ fontSize: 13, color: C.text }}>{m.use}</div></div>
      </div>
      <Key color={C.orange}>
        Tape's sequential-only access is its defining trade: by giving up random access entirely,
        it reaches by far the lowest cost per byte of any common medium — perfect for backups you
        rarely read but must never lose.
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
      q: "Why is auxiliary (secondary) memory necessary at all, given that RAM is much faster?",
      options: [
        "It isn't necessary — modern computers could work with only RAM",
        "RAM is volatile: its contents disappear when power is lost, so something non-volatile is needed for permanent storage",
        "Auxiliary memory is actually faster than RAM",
        "It's required only for very old computers",
      ],
      answer: 1,
      explain: "RAM loses everything the instant power is cut. Auxiliary storage exists specifically to hold data permanently, trading speed for that non-volatility.",
    },
    {
      q: "What are the three components of total disk access time, in order?",
      options: [
        "Boot time, load time, save time",
        "Seek time (move to the track), rotational latency (wait for the sector), transfer time (read the data)",
        "Write time, read time, verify time",
        "Power-on time, spin-up time, shutdown time",
      ],
      answer: 1,
      explain: "The head must first reach the right track (seek), then wait for the disk to rotate the right sector underneath it (latency), then actually move the bits (transfer).",
    },
    {
      q: "Why is rotational latency usually estimated as HALF a revolution, on average?",
      options: [
        "Disks always rotate exactly half a turn per access",
        "The target sector could be anywhere relative to the head when the seek finishes — on average, that's half a full spin away",
        "It's a fixed manufacturer specification, unrelated to timing",
        "Half a revolution is the minimum guaranteed wait",
      ],
      answer: 1,
      explain: "Since the disk keeps spinning independently of when the head arrives at the track, the needed sector is equally likely to be anywhere — averaging to half a rotation's wait.",
    },
    {
      q: "Why does magnetic tape have the lowest cost per byte of the common storage media, despite being the slowest?",
      options: [
        "Tape drives are simpler to manufacture than disk drives",
        "By giving up random access entirely (strictly sequential), tape avoids the mechanical complexity that drives up cost in random-access media",
        "Tape stores less data than any other medium",
        "Tape requires no read/write head at all",
      ],
      answer: 1,
      explain: "Tape's defining trade-off is exactly this: sacrificing random access for sequential-only access is what allows it to reach such low cost per byte — ideal for backups.",
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
          {score === 4 ? "Perfect! Disk access timing and the storage media landscape are both solid." :
            score >= 2 ? "Good work! Replay 'Anatomy of a Disk Access' and watch the three timing components." :
              "Revisit 'Why Non-Volatile Storage?' and 'Anatomy of a Disk Access', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 4.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You now know why auxiliary storage exists, how disk access time is built from three
            stages, and how tape/optical media trade off differently.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 4.6 — Virtual Memory &amp; the MMU.</strong>{" "}
            Now see how the OS makes a program feel like it has more memory than physically exists — using disk as the overflow.
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
export default function Unit4_5({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Non-Volatile?" },
    { id: "anatomy", label: "Disk Access" },
    { id: "trace", label: "Trace a Read" },
    { id: "compare", label: "Compare Media" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>❓ Why Non-Volatile Storage?</h3>
      <NeedWidget />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>⏱️ Anatomy of a Disk Access</h3>
      <DiskAccess />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔁 Trace a Real Read</h3>
      <TraceRead />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📼 Compare the Storage Types</h3>
      <CompareMedia />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 4.5.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › UNIT 4.5</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Auxiliary Memory</div>
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
