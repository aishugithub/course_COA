// Unit0_1.jsx — Module 0 › Unit 0.1 — "The Problem & The Dream"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Story arc: the firing-table crisis → feel the hand-computation cost →
// the five dreamers who imagined a machine → the timeline staircase.
import { useState } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};

// ── shared little key-insight callout ──
function Key({ color = C.purple, children }) {
  return (
    <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
      🔑 {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 0 — Why This Course? (the framing the classroom deck opens
//  with): architecture (WHAT) vs organization (HOW), seen through one
//  addition at three levels, and the "billion times faster, unchanged"
//  reveal. Motivation first: why the machine matters to any branch.
// ══════════════════════════════════════════════════════════════════
function WhyThisCourseWidget() {
  // (a) why it matters — one concrete stake per field the learner might be in
  const fields = [
    { k: "ai", icon: "🤖", label: "AI / ML", color: C.accent, line: "Training a model is really feeding a GPU. Batch size, memory bandwidth and cache misses decide whether it takes 3 hours or 3 days. The best ML engineers think in hardware." },
    { k: "cyber", icon: "🔐", label: "Security", color: C.red, line: "Attacks live in architecture: buffer overflows abuse how memory is laid out; Spectre & Meltdown broke the world's CPUs through cache tricks. You can't defend what you don't understand." },
    { k: "iot", icon: "📡", label: "IoT / ECE", color: C.orange, line: "On a microcontroller every byte and every milliwatt counts. Registers, memory maps and interrupts are your daily tools — all of it starts here." },
    { k: "all", icon: "🎓", label: "Everyone", color: C.green, line: "Every slow program and every performance bug you'll ever chase. Engineers who understand the machine beneath their code are rare — and valued like it." },
  ];
  const [field, setField] = useState("all");
  const f = fields.find((x) => x.k === field);

  // (b) same addition, three levels — architecture is the top two (what the
  //     programmer sees); organization is how the bottom becomes voltages.
  const levels = [
    { k: "c",   tag: "C — a language you write",     code: "total = a + b;",           col: C.green,  note: "High-level. Comfortable for humans, but the CPU has never heard of it — a compiler must translate it down." },
    { k: "asm", tag: "Assembly — the machine's ISA",  code: "Add  R4, R2, R3",          col: C.accent, note: "One line = one machine instruction, nothing hidden. This is the ARCHITECTURE: the computer as the programmer sees it." },
    { k: "mc",  tag: "Machine code — bits",           code: "0011 0100 0010 0011",      col: C.orange, note: "The same instruction as raw bits the hardware decodes. Below this there are only voltages — that's ORGANIZATION." },
  ];
  const [lvl, setLvl] = useState(1);
  const L = levels[lvl];

  // (c) the punchline reveal
  const [guess, setGuess] = useState(null);

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Whatever you go on to build, it runs on <strong style={{ color: C.text }}>this machine</strong>.
        Tap where you see yourself — see why the hardware underneath is your problem too.
      </p>

      {/* (a) branch relevance */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {fields.map((x) => (
          <button key={x.k} onClick={() => setField(x.k)} style={{
            flex: "1 1 90px", minWidth: 90, padding: "10px 6px", borderRadius: 10, cursor: "pointer",
            background: field === x.k ? x.color + "22" : C.card,
            border: `1.5px solid ${field === x.k ? x.color : C.border}`,
            color: field === x.k ? x.color : C.muted, transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 20 }}>{x.icon}</div>
            <div style={{ fontSize: 11, marginTop: 3, fontWeight: 600 }}>{x.label}</div>
          </button>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${f.color}55`, borderRadius: 10, padding: "12px 15px", color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
        {f.line}
      </div>

      {/* (b) same instruction, three levels */}
      <div style={{ marginTop: 20, color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>ONE ADDITION, THREE LEVELS</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {levels.map((x, i) => (
          <button key={x.k} onClick={() => setLvl(i)} style={{
            flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer", fontSize: 11.5, fontWeight: 600,
            background: lvl === i ? x.col + "22" : C.card,
            border: `1.5px solid ${lvl === i ? x.col : C.border}`, color: lvl === i ? x.col : C.muted, transition: "all 0.2s",
          }}>{x.tag.split(" — ")[0]}</button>
        ))}
      </div>
      <div style={{ background: C.bg, border: `1px solid ${L.col}55`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ color: L.col, fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>{L.tag}</div>
        <div style={{ fontFamily: "'Space Mono', Consolas, monospace", fontSize: 18, color: C.text, letterSpacing: 1 }}>{L.code}</div>
        <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.6, marginTop: 10 }}>{L.note}</div>
      </div>

      {/* (c) the billion-times reveal */}
      <div style={{ marginTop: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ color: C.text, fontSize: 13.5, fontWeight: 600, lineHeight: 1.6, marginBottom: 10 }}>
          A program written for a 1970s processor runs on a modern chip <strong style={{ color: C.purple }}>a billion times faster — unchanged</strong>. What changed?
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["arch", "The architecture"], ["org", "The organization"], ["both", "Both"]].map(([k, lbl]) => {
            const on = guess === k, correct = k === "org";
            return (
              <button key={k} onClick={() => setGuess(k)} style={{
                flex: "1 1 100px", padding: "9px 8px", borderRadius: 8, cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                background: on ? (correct ? C.green : C.red) + "22" : C.card,
                border: `1.5px solid ${on ? (correct ? C.green : C.red) : C.border}`,
                color: on ? (correct ? C.green : C.red) : C.text, transition: "all 0.2s",
              }}>{on ? (correct ? "✓ " : "✗ ") : ""}{lbl}</button>
            );
          })}
        </div>
        {guess && (
          <div style={{ marginTop: 10, color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>
            The <strong style={{ color: C.orange }}>organization</strong> changed — billions of transistors, caches, pipelines (VLSI).
            The <strong style={{ color: C.accent }}>architecture</strong> — the instruction set, the blueprint — survived untouched.
            Same <em>what</em>, radically better <em>how</em>.
          </div>
        )}
      </div>

      <Key color={C.accent}>
        <strong style={{ color: C.text }}>Architecture = what</strong> the machine can do (the instruction set the programmer sees).{" "}
        <strong style={{ color: C.text }}>Organization = how</strong> it does it (the circuits underneath). This course teaches
        both — the floor every other subject in computing stands on.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Before Electronics: what the pre-electronic world had,
//  and where it hit a wall (gears + punched cards + printed tables)
// ══════════════════════════════════════════════════════════════════
function BeforeElectronicsWidget() {
  // Capability probe: which tasks could an 1800s machine do directly,
  // and which forced you to look the answer up in a hand-computed table?
  const tasks = [
    { t: "Add  47 + 89", gears: true,  note: "Pascal's Pascaline (1642) adds directly with toothed gears — turn the dials, read the sum." },
    { t: "Multiply  12 × 15", gears: true,  note: "Leibniz's stepped drum turns multiplication into repeated addition. Still just gears." },
    { t: "log(4713) for a ship's position", gears: false, note: "No gear machine does this. You open a printed table of logarithms and read the value off the page." },
    { t: "Firing angle: 1000 m, 10 km/h wind", gears: false, note: "~50 hand steps per shot, thousands of shots → a whole printed firing table, computed by people." },
  ];
  const [picked, setPicked] = useState(null);
  const [seen, setSeen] = useState([]);
  const pick = (i) => { setPicked(i); setSeen((s) => (s.includes(i) ? s : [...s, i])); };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Three hundred years before electronics, a "machine" meant <strong style={{ color: C.text }}>gears</strong>,
        and the first "program" was a <strong style={{ color: C.text }}>punched card</strong>. But gears could
        only do arithmetic. Tap each task — can a machine of the day do it, or must you{" "}
        <strong style={{ color: C.text }}>look the answer up in a hand-computed table</strong>?
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {tasks.map((task, i) => {
          const on = picked === i;
          const col = task.gears ? C.green : C.orange;
          return (
            <button key={i} onClick={() => pick(i)} style={{
              textAlign: "left", padding: "11px 13px", borderRadius: 9, cursor: "pointer",
              background: on ? col + "22" : C.card,
              border: `1.5px solid ${on ? col : C.border}`,
              color: on ? col : C.text, fontSize: 13, transition: "all 0.2s",
            }}>
              {seen.includes(i) && <span>{task.gears ? "⚙️ " : "📖 "}</span>}{task.t}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div style={{ background: C.card, border: `1px solid ${(tasks[picked].gears ? C.green : C.orange)}55`, borderRadius: 10, padding: "12px 15px" }}>
          <div style={{ color: tasks[picked].gears ? C.green : C.orange, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            {tasks[picked].gears ? "⚙️ A gear machine can do this directly" : "📖 No machine — look it up in a printed table"}
          </div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{tasks[picked].note}</div>
        </div>
      )}

      <div style={{ marginTop: 14, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 15px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 22 }}>🧵</span>
        <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.6 }}>
          <strong style={{ color: C.teal }}>The first "programming":</strong> the Jacquard loom (1804) read
          <strong style={{ color: C.text }}> punched cards</strong> to weave any pattern — the very idea
          Babbage borrowed to feed instructions to his Analytical Engine.
        </div>
      </div>

      <Key color={C.orange}>
        Gears hit a wall at arithmetic. Everything harder — navigation, logarithms, artillery — ran on{" "}
        <strong style={{ color: C.text }}>printed tables computed by hand</strong>, slow and only as correct
        as a tired person's worst sum. That gap is exactly what a real machine had to close.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 1 — The Crisis (Need): find the wrong firing angle by hand
// ══════════════════════════════════════════════════════════════════
function FiringTableWidget() {
  // Row index 2 (1000m / 10 km/h) is the fatal error: 31.2° should be 26.1°.
  const rows = [
    { dist: "500m",  wind: "0 km/h",  angle: "12.4°", bad: false },
    { dist: "500m",  wind: "10 km/h", angle: "13.1°", bad: false },
    { dist: "1000m", wind: "10 km/h", angle: "31.2°", bad: true  },
    { dist: "1000m", wind: "0 km/h",  angle: "24.7°", bad: false },
    { dist: "1500m", wind: "0 km/h",  angle: "38.5°", bad: false },
    { dist: "1500m", wind: "10 km/h", angle: "40.0°", bad: false },
  ];
  const [found, setFound] = useState(false);
  const [flash, setFlash] = useState(null); // index of a wrong guess to flash

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        France, 1917. Every artillery angle in this table was worked out by hand — about
        fifty arithmetic steps each. One row is wrong, and a wrong angle means the shell
        misses. <strong style={{ color: C.text }}>Tap the row you think has the error.</strong>
      </p>

      <div style={{ overflowX: "auto", border: `1px solid ${C.border}`, borderRadius: 10 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Distance", "Wind", "Fire angle"].map((h) => (
                <th key={h} style={{ background: C.card, color: C.muted, padding: "9px 12px", textAlign: "left", fontSize: 11, letterSpacing: 1 }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const revealed = found && r.bad;
              return (
                <tr key={i}
                  onClick={() => { if (found) return; if (r.bad) setFound(true); else { setFlash(i); setTimeout(() => setFlash(null), 500); } }}
                  style={{
                    cursor: found ? "default" : "pointer",
                    background: revealed ? C.red + "22" : flash === i ? C.surface : i % 2 ? "#0f1420" : C.bg,
                    borderTop: `1px solid ${C.border}`,
                    transition: "background 0.25s",
                  }}>
                  <td style={{ padding: "10px 12px", color: C.text }}>{r.dist}</td>
                  <td style={{ padding: "10px 12px", color: C.text }}>{r.wind}</td>
                  <td style={{ padding: "10px 12px", color: revealed ? C.red : C.text, fontWeight: revealed ? 700 : 400 }}>
                    {r.angle}
                    {revealed && <span style={{ color: C.red, marginLeft: 8, fontSize: 11 }}>← wrong (should be 26.1°)</span>}
                    {flash === i && <span style={{ color: C.muted, marginLeft: 8, fontSize: 11 }}>this one's fine</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {found && (
        <div style={{ marginTop: 14, background: C.red + "14", border: `1px solid ${C.red}44`, borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>💥 31.2° — a tired mistake</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
            The correct angle was <strong style={{ color: C.text }}>26.1°</strong>. Someone added wrong
            after six hours at a desk. The shell overshot by 500 metres — onto a friendly position.
          </div>
        </div>
      )}

      <Key color={C.red}>
        A human computer following a fifty-step recipe is only as reliable as their most tired
        moment. One slip in step 4 corrupts every number after it — and here, lives depended on it.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — Be the Human Computer (feel the need): a 3-step calc
// ══════════════════════════════════════════════════════════════════
function HumanComputerWidget() {
  const steps = [
    { ask: "Wind is 10 km/h, and the table corrects in 5 km/h units. How many wind units is that?", answer: 2, hint: "10 ÷ 5 = ?", why: "10 ÷ 5 = 2 units. Easy now — but this is step 1 of 50, hour 6 of the shift." },
    { ask: "Each wind unit adds 0.7° to the angle. With 2 units, what is the total wind correction?", answer: 1.4, hint: "2 × 0.7 = ?", why: "2 × 0.7 = 1.4°. Write 1.5° by mistake and every later step inherits the error." },
    { ask: "The base angle for 1000 m is 24.7°. Add your 1.4° wind correction. Final firing angle?", answer: 26.1, hint: "24.7 + 1.4 = ?", why: "26.1° — correct. The real table printed 31.2°. One wrong sum, 500 metres off target." },
  ];
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [fb, setFb] = useState(null); // "right" | "wrong" | null
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div>
        <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
          That was <strong style={{ color: C.text }}>one</strong> trajectory in three steps.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 4 }}>
          {[["3,000", "trajectories per table"], ["~50", "steps per trajectory"], ["150,000", "hand calculations"]].map(([n, l]) => (
            <div key={l} style={{ background: C.card, border: `1px solid ${C.orange}44`, borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ color: C.orange, fontWeight: 800, fontSize: 20 }}>{n}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <Key color={C.orange}>
          150,000 hand calculations per table, at a 1–2% error rate, under wartime deadlines. This
          bottleneck is exactly why people would spend fortunes on a machine that never gets tired.
        </Key>
      </div>
    );
  }

  const step = steps[i];
  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Be the human computer. Work one firing angle, one step at a time — and notice how ordinary
        each step is, and how a single slip would ruin the answer.
      </p>
      <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>STEP {i + 1} OF {steps.length}</div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", color: C.text, fontSize: 14, lineHeight: 1.6 }}>
        {step.ask}
      </div>

      <input type="number" value={val} placeholder="Your answer…"
        onChange={(e) => { setVal(e.target.value); setFb(null); }}
        style={{ width: "100%", boxSizing: "border-box", marginTop: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 14px", color: C.text, fontSize: 14, outline: "none" }} />

      {fb === "wrong" && (
        <div style={{ marginTop: 10, background: C.yellow + "18", border: `1px solid ${C.yellow}44`, borderRadius: 8, padding: "10px 14px", color: C.yellow, fontSize: 13 }}>💡 Hint: {step.hint}</div>
      )}
      {fb === "right" && (
        <div style={{ marginTop: 10, background: C.green + "18", border: `1px solid ${C.green}44`, borderRadius: 8, padding: "10px 14px", color: C.green, fontSize: 13, lineHeight: 1.6 }}>✅ {step.why}</div>
      )}

      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        {fb !== "right" ? (
          <button onClick={() => setFb(Math.abs(parseFloat(val) - step.answer) < 0.05 ? "right" : "wrong")}
            style={{ padding: "10px 22px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Check →</button>
        ) : (
          <button onClick={() => { if (i < steps.length - 1) { setI(i + 1); setVal(""); setFb(null); } else setDone(true); }}
            style={{ padding: "10px 22px", borderRadius: 8, background: C.green, border: "none", color: "#0D1117", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            {i < steps.length - 1 ? "Next step →" : "See the real scale →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — The Five Dreamers (the idea): click a person, one big idea
// ══════════════════════════════════════════════════════════════════
function DreamersWidget() {
  const people = [
    { icon: "⚙️", name: "Charles Babbage", year: "1837", idea: "Designs the Analytical Engine — a general machine with a Store (memory) and a Mill (calculator), driven by punched cards. Mechanical, never finished, but the shape of every computer since.", color: C.orange },
    { icon: "👩‍💻", name: "Ada Lovelace", year: "1843", idea: "Writes the first algorithm for that engine — and sees further than Babbage: a machine that follows rules can manipulate ANY symbols, not just numbers. That is what 'computer' really means.", color: C.purple },
    { icon: "🔣", name: "George Boole", year: "1847", idea: "Turns reasoning itself into algebra: AND, OR and NOT operating on just true and false. Ninety years before any circuit exists, he writes down the exact mathematics that logic gates will one day run on.", color: C.yellow },
    { icon: "🧩", name: "Alan Turing", year: "1936", idea: "Proves that a single 'universal' machine, following simple rules, can compute anything that is computable. You don't need a new machine per problem — one machine, different instructions.", color: C.teal },
    { icon: "⚡", name: "Claude Shannon", year: "1937", idea: "Shows Boolean logic (AND, OR, NOT) maps exactly onto electrical switches. Now the abstract logic can be built from real circuits — theory meets hardware.", color: C.green },
    { icon: "🏛️", name: "John von Neumann", year: "1945", idea: "The stored-program idea: keep the instructions in memory, right alongside the data. Change the program by loading different numbers — no rewiring. One machine, infinite programs.", color: C.accent },
  ];
  const [sel, setSel] = useState(0);
  const p = people[sel];

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        Six people turned "we need a tireless machine" into a real idea. Tap each to hear their
        one big contribution.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {people.map((person, i) => (
          <button key={i} onClick={() => setSel(i)}
            style={{
              flex: "1 1 90px", minWidth: 90, padding: "12px 6px", borderRadius: 10, cursor: "pointer",
              background: sel === i ? person.color + "22" : C.card,
              border: `1.5px solid ${sel === i ? person.color : C.border}`,
              color: sel === i ? person.color : C.muted, transition: "all 0.2s",
            }}>
            <div style={{ fontSize: 22 }}>{person.icon}</div>
            <div style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>{person.year}</div>
          </button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1.5px solid ${p.color}55`, borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{p.icon}</span>
          <div>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 15 }}>{p.name}</div>
            <div style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>{p.year}</div>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{p.idea}</div>
      </div>

      <Key color={C.accent}>
        One thread runs through all six: a single general machine, instructed by symbols that live
        in memory as data, built out of logic circuits. That sentence describes the device in your
        pocket — and everything we study in this course.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — The Timeline (trace the staircase): step through history
// ══════════════════════════════════════════════════════════════════
function TimelineWidget() {
  const events = [
    { year: "1837", label: "Analytical Engine designed", note: "Babbage's Store + Mill: a general machine, but mechanical and never completed." },
    { year: "1843", label: "Ada writes the first algorithm", note: "And realises a machine can manipulate any symbols, not just numbers." },
    { year: "1847", label: "Boole's algebra of logic", note: "AND, OR, NOT become mathematics — 90 years before anyone builds them." },
    { year: "1914–18", label: "The firing-table crisis", note: "Hundreds of human computers, tables still full of errors. Automating becomes urgent." },
    { year: "1936", label: "Turing's universal machine", note: "One machine, given different rules, can compute anything computable." },
    { year: "1937", label: "Shannon wires logic to circuits", note: "Boolean algebra = switching circuits. Now logic can be built." },
    { year: "1945", label: "ENIAC + von Neumann's report", note: "First electronic computer — but reprogramming means days of rewiring. Von Neumann: store the program in memory." },
    { year: "1949", label: "EDVAC runs a stored program", note: "Instructions loaded from memory like data. The modern computer era begins." },
  ];
  const [n, setN] = useState(0); // how many revealed (index of current)

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
        Each idea needed the one before it. Step through the staircase from Babbage's gears to the
        first stored-program computer.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {events.map((e, i) => {
          const state = i < n ? "past" : i === n ? "current" : "future";
          const col = state === "current" ? C.accent : state === "past" ? C.green : C.border;
          return (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              opacity: state === "future" ? 0.4 : 1, transition: "opacity 0.3s",
            }}>
              <div style={{ minWidth: 62, textAlign: "right", color: col, fontWeight: 700, fontSize: 12, paddingTop: 2 }}>{e.year}</div>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: state === "future" ? C.border : col, marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: state === "future" ? C.muted : C.text, fontSize: 13, fontWeight: 600 }}>{e.label}</div>
                {i === n && <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginTop: 3 }}>{e.note}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button onClick={() => setN(Math.min(events.length - 1, n + 1))} disabled={n >= events.length - 1}
          style={{ padding: "9px 20px", borderRadius: 8, background: n >= events.length - 1 ? C.border : C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: n >= events.length - 1 ? "default" : "pointer" }}>
          Step ▶ ({n + 1} / {events.length})
        </button>
        <button onClick={() => setN(0)}
          style={{ padding: "9px 16px", borderRadius: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>↺ Reset</button>
      </div>

      <Key color={C.green}>
        Mechanical dream → the first algorithm → an algebra of logic → a wartime need → a theory of
        computation → logic in circuits → the stored program. Remove any step and the staircase
        breaks.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Quiz — 4 MCQs, instant feedback, explanation, completion card
// ══════════════════════════════════════════════════════════════════
function Quiz({ onComplete }) {
  const questions = [
    {
      q: "In this course's terms, what is the difference between architecture and organization?",
      options: [
        "Architecture is the hardware; organization is the software",
        "Architecture is WHAT the machine can do (the instruction set the programmer sees); organization is HOW it does it (the circuits)",
        "Architecture is old computers; organization is modern ones",
        "They mean the same thing",
      ],
      answer: 1,
      explain: "Architecture = the blueprint the programmer sees (ISA, data formats). Organization = how the hardware implements it. That's why a 1970s program runs unchanged on a modern chip: same architecture, new organization.",
    },
    {
      q: "Why were WWI artillery firing tables dangerous to rely on?",
      options: [
        "The cannons were poorly built",
        "Human computers made arithmetic errors, especially when tired",
        "The paper faded in the field",
        "Wind could not be measured at all",
      ],
      answer: 1,
      explain: "Each entry took ~50 hand calculations; one slip under fatigue corrupted the final angle, and a wrong angle missed the target.",
    },
    {
      q: "What was Ada Lovelace's insight that went beyond Babbage's?",
      options: [
        "The engine could run on electricity",
        "The engine could be made smaller",
        "A rule-following machine can manipulate ANY symbols, not just numbers",
        "The engine could store its own results",
      ],
      answer: 2,
      explain: "Babbage saw a calculator; Ada saw that anything expressible as symbols and rules could be computed — the essence of what a computer is.",
    },
    {
      q: "What is von Neumann's stored-program idea?",
      options: [
        "Use binary instead of decimal",
        "Store the instructions in memory alongside the data, so a new program is just new numbers",
        "Replace vacuum tubes with transistors",
        "Give every problem its own machine",
      ],
      answer: 1,
      explain: "Instructions are just data. Keeping them in memory means changing the program means loading different numbers — no rewiring. One machine, infinite programs.",
    },
    {
      q: "What do Babbage's engine, Turing's machine, and von Neumann's design all share?",
      options: [
        "They all used vacuum tubes",
        "They were all completed and sold",
        "They all needed government money",
        "One general machine that does anything by changing its instructions",
      ],
      answer: 3,
      explain: "Mechanical, theoretical, or electronic — all three embody general-purpose programmable computation: change the instructions, not the machine.",
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
        <div style={{ fontSize: 52 }}>{score >= 4 ? "🎉" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 5 ? "Perfect — from architecture-vs-organization all the way to the stored program."
            : score >= 3 ? "Solid. Replay the Dreamers or Timeline tab to lock in the names and order."
              : "Worth another pass — revisit the Why-This-Course and Dreamers tabs, then retry."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55`, textAlign: "left" }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 0.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You now know <em>why</em> the computer was invented: to escape slow, error-prone hand
            computation — and the idea five thinkers converged on, the stored-program machine.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 0.2 — Bits &amp; Boolean Logic.</strong>{" "}
            We follow Shannon's bridge down to the switch: how AND, OR and NOT become real circuits,
            and why everything is 1s and 0s.
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
          let bg = C.card, border = C.border, col = C.text;
          if (selected !== null) {
            if (i === q.answer) { bg = C.green + "22"; border = C.green; col = C.green; }
            else if (i === selected) { bg = C.red + "22"; border = C.red; col = C.red; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              textAlign: "left", padding: "10px 14px", borderRadius: 8,
              background: bg, border: `1.5px solid ${border}`, color: col,
              cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s",
            }}>
              {i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}
            </button>
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
//  Main — header, progress bar, tab strip, content card, continue btn
// ══════════════════════════════════════════════════════════════════
export default function Unit0_1({ student, onUnitComplete }) {
  const sections = [
    { id: "why", label: "Why This Course?" },
    { id: "roots", label: "Before Electronics" },
    { id: "crisis", label: "The Crisis" },
    { id: "human", label: "Be the Computer" },
    { id: "dreamers", label: "The Dreamers" },
    { id: "timeline", label: "The Timeline" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Why this course — and what its name means</h3><WhyThisCourseWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Before the machine: gears, cards and tables</h3><BeforeElectronicsWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>A table that could cost lives</h3><FiringTableWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Feel the cost of computing by hand</h3><HumanComputerWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The dream of a tireless machine</h3><DreamersWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>One idea built on the last</h3><TimelineWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>5 questions to check your understanding of Unit 0.1.</p>
      <Quiz onComplete={() => { markComplete(6); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💡</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 0 › UNIT 0.1</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>The Problem &amp; The Dream</div>
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
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s",
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
            background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>Mark Complete &amp; Continue →</button>
        )}
      </div>
    </div>
  );
}
// end of Unit0_1
