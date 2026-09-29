// Unit5_5.jsx — Module 5 › Unit 5.5 — "Synchronous vs Asynchronous Buses"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: a shared bus needs rules (need: master/slave, bus protocol) ->
// synchronous timing t0/t1/t2 + Slave-ready multi-cycle (trace) -> the
// asynchronous full handshake (trace of Master-ready/Slave-ready) -> the
// sync-vs-async trade-off with a transfer-rate playground -> quiz.
import { useState } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};
function Key({ color = C.purple, children }) { return <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>🔑 {children}</div>; }
function Frame({ children }) { return <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>{children}</p>; }
const box = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 };
function btn(active, color) { return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? color : C.border}`, background: active ? color : "transparent", color: active ? "#fff" : C.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }; }

// ── Section 1: Need — master/slave + why a protocol ──
function NeedWidget() {
  const [rules, setRules] = useState(true);
  return (
    <div>
      <Frame>A bus is a bundle of wires <b>shared</b> by many devices. Without agreed rules, two devices
      could drive the same wire at once. Toggle the bus protocol on and off.</Frame>
      <button onClick={() => setRules((v) => !v)} style={{ ...btn(true, rules ? C.green : C.red), marginBottom: 12 }}>
        {rules ? "◀ With a bus protocol" : "▶ No rules — free-for-all"}
      </button>
      <div style={{ ...box, borderColor: (rules ? C.green : C.red) + "66" }}>
        {rules ? (
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            One device is the <b style={{ color: C.accent }}>master</b> (it issues Read/Write — usually the CPU
            or a DMA controller); the addressed device is the <b style={{ color: C.teal }}>slave</b>. Control
            signals (like <code>R/W̄</code>) say <i>who</i> may drive the bus and <i>when</i>. Orderly, correct
            transfers.
          </div>
        ) : (
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            Two devices drive the data lines at the same time → a bus <b style={{ color: C.red }}>conflict</b>
            (garbled data, possible hardware damage). Which device latches, and when? Undefined.
          </div>
        )}
      </div>
      <Key color={C.teal}>The <b>bus protocol</b> is the set of rules governing who drives the bus and when.
      Only one device drives a line at a time — enforced by <b>tri-state</b> bus drivers that go
      high-impedance when off. The two timing families are <b>synchronous</b> and <b>asynchronous</b>.</Key>
    </div>
  );
}

// ── Section 2: Synchronous bus timing ──
function SyncWidget() {
  const [multi, setMulti] = useState(false);
  const [t, setT] = useState(0);
  const single = [
    { at: "t0", note: "Master puts address + command on the bus." },
    { at: "t1", note: "Slave has decoded the address and places the data on the data lines." },
    { at: "t2", note: "End of the clock cycle — master latches the data into a register." },
  ];
  const multiSteps = [
    { at: "cycle 1", note: "Master sends address + command." },
    { at: "cycle 2", note: "Slave decodes and starts fetching — not ready yet." },
    { at: "cycle 3", note: "Slave places data AND asserts Slave-ready. Master latches at end of cycle." },
    { at: "cycle 4", note: "Slave-ready drops; the bus is free for the next transfer." },
  ];
  const steps = multi ? multiSteps : single;
  const st = steps[Math.min(t, steps.length - 1)];
  return (
    <div>
      <Frame>On a <b>synchronous</b> bus every device takes timing from a common <b>bus clock</b>. Step through
      a Read. Then switch on <b>Slave-ready</b> to let a slow device take extra cycles.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => { setMulti(false); setT(0); }} style={btn(!multi, C.accent)}>Single-cycle</button>
        <button onClick={() => { setMulti(true); setT(0); }} style={btn(multi, C.teal)}>Multi-cycle + Slave-ready</button>
      </div>
      <div style={{ ...box, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 26, borderRadius: 5, background: i <= t ? C.accentGlow : C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontFamily: "monospace", color: i <= t ? "#fff" : C.muted }}>{s.at}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: C.muted, minHeight: 20, textAlign: "center" }}>{st.at}: {st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => setT((x) => Math.min(steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Advance clock ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key>Single-cycle is simple but forces every device to the speed of the <b>slowest</b>, and the master
      never learns if the slave actually replied. <b>Slave-ready</b> fixes both — a transfer can span extra
      cycles, and a missing Slave-ready (after a timeout) flags a failed transfer.</Key>
    </div>
  );
}

// ── Section 3: Asynchronous handshake ──
function AsyncWidget() {
  const steps = [
    { at: "t0", mr: 0, sr: 0, note: "Master places address + command on the bus." },
    { at: "t1", mr: 1, sr: 0, note: "Master raises Master-ready (after a gap for bus skew)." },
    { at: "t2", mr: 1, sr: 1, note: "Slave decodes, places data, raises Slave-ready." },
    { at: "t3", mr: 0, sr: 1, note: "Master latches the data, then drops Master-ready." },
    { at: "t4", mr: 0, sr: 1, note: "Master removes the address from the bus." },
    { at: "t5", mr: 0, sr: 0, note: "Slave removes data and drops Slave-ready. Transfer done." },
  ];
  const [t, setT] = useState(0);
  const st = steps[Math.min(t, steps.length - 1)];
  return (
    <div>
      <Frame>An <b>asynchronous</b> bus uses <b>no clock</b>. Master and slave coordinate with a
      <b> full handshake</b> — each signal change answers the other. Step through the interlock.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <Sig label="Master-ready" on={st.mr} col={C.accent} />
        <Sig label="Slave-ready" on={st.sr} col={C.teal} />
      </div>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
        {steps.map((s, i) => <div key={i} style={{ width: 34, height: 22, borderRadius: 4, fontSize: 10, fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center", color: i <= t ? "#fff" : C.muted, background: i === t ? C.accentGlow : i < t ? C.accentGlow + "77" : C.card, border: `1px solid ${C.border}` }}>{s.at}</div>)}
      </div>
      <div style={{ fontSize: 12.5, color: C.muted, minHeight: 20, textAlign: "center" }}>{st.at}: {st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
        <button onClick={() => setT((x) => Math.min(steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Step ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.teal}>Every edge is a response to the other signal — a <b>fully interlocked</b> handshake. The
      gap t1−t0 allows for <b>bus skew</b> (lines propagating at slightly different speeds), so Master-ready
      never overtakes the address it announces.</Key>
    </div>
  );
}
function Sig({ label, on, col }) {
  return (
    <div style={{ ...box, padding: 12, textAlign: "center" }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{label}</div>
      <div style={{ height: 22, borderRadius: 5, background: on ? col : C.bg, border: `1px solid ${on ? col : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: on ? "#fff" : C.muted }}>{on ? "HIGH (1)" : "low (0)"}</div>
    </div>
  );
}

// ── Section 4: Trade-off + transfer-rate playground ──
function CompareWidget() {
  const [rtt, setRtt] = useState(20); // one round-trip delay, ns
  const syncNs = rtt;        // sync: one round trip per transfer
  const asyncNs = 2 * rtt;   // async: two round trips (full handshake)
  const rate = (ns) => (4 / ns * 1000).toFixed(0); // 4 bytes per transfer → MB/s
  return (
    <div>
      <Frame>Both work — but they trade differently. Drag the bus round-trip delay and compare peak rates
      (moving one 32-bit word per transfer).</Frame>
      <label style={{ color: C.muted, fontSize: 12 }}>one round-trip delay = <strong style={{ color: C.accent }}>{rtt} ns</strong></label>
      <input type="range" min={5} max={60} value={rtt} onChange={(e) => setRtt(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
        <div style={{ ...box, borderColor: C.accent + "55", textAlign: "center" }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 12 }}>SYNCHRONOUS</div>
          <div style={{ fontSize: 12, color: C.muted, margin: "4px 0" }}>1 round trip / transfer</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>{rate(syncNs)} MB/s</div>
        </div>
        <div style={{ ...box, borderColor: C.teal + "55", textAlign: "center" }}>
          <div style={{ color: C.teal, fontWeight: 700, fontSize: 12 }}>ASYNCHRONOUS</div>
          <div style={{ fontSize: 12, color: C.muted, margin: "4px 0" }}>2 round trips (handshake)</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.teal }}>{rate(asyncNs)} MB/s</div>
        </div>
      </div>
      <div style={{ ...box, marginTop: 12, fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
        <b style={{ color: C.accent }}>Synchronous:</b> simple, fast (one round trip), but the clock must be
        distributed carefully. <b style={{ color: C.teal }}>Asynchronous:</b> no shared clock, absorbs any
        device's delay automatically, but each transfer needs two round trips of handshaking.
      </div>
      <Key color={C.yellow}>Because it needs only one round trip per transfer, the synchronous scheme is faster —
      which is why <b>most modern high-speed buses are synchronous</b>, handling slow devices by simply adding
      clock cycles.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "On a synchronous bus, what provides the timing for all devices?",
      options: ["A handshake", "A common bus clock", "The DMA controller", "The interrupt line"],
      answer: 1, explain: "Every device on a synchronous bus derives its timing from one shared bus clock; transfers happen in fixed cycles." },
    { q: "What problem does the Slave-ready signal solve on a synchronous bus?",
      options: ["It encrypts data", "It lets slow devices take extra cycles and lets the master detect a non-responding device", "It removes the clock", "It doubles the address space"],
      answer: 1, explain: "Slave-ready acknowledges the transfer, allowing multiple-cycle transfers for slow devices and flagging a device that never responds." },
    { q: "How does an asynchronous bus coordinate a transfer without a clock?",
      options: ["It guesses timing", "With a fully-interlocked Master-ready / Slave-ready handshake", "By using DMA", "By polling"],
      answer: 1, explain: "Each signal edge answers the other — a full handshake — so the transfer is self-timed with no shared clock." },
    { q: "Why are most high-speed buses synchronous rather than asynchronous?",
      options: ["They are simpler to wire", "Each transfer needs only one round-trip delay, not two, so they are faster", "They need no address lines", "They avoid tri-state gates"],
      answer: 1, explain: "The asynchronous full handshake costs two round trips per transfer; the synchronous clock needs only one, giving higher transfer rates." },
  ];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const choose = (i) => { if (selected !== null) return; setSelected(i); if (i === questions[current].answer) setScore((s) => s + 1); };
  const next = () => { if (current < questions.length - 1) { setCurrent((c) => c + 1); setSelected(null); } else { setDone(true); onComplete && onComplete(); } };
  if (done) {
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 52 }}>{score >= 3 ? "🎉" : "👍"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.text, marginTop: 10 }}>You scored {score} / {questions.length}</div>
        <div style={{ color: C.muted, marginTop: 8, marginBottom: 20 }}>
          {score === 4 ? "Nailed it — you can read a bus timing diagram." : score >= 2 ? "Good. Re-step the 'Asynchronous' handshake to lock in the interlock." : "Revisit 'Synchronous' and 'Asynchronous' — trace both step by step."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can trace both a clocked transfer and a full handshake, and weigh their trade-offs.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.6 — Standard I/O Interfaces.</strong> See these
            ideas made real in the PCI and SCSI buses inside every PC.
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
          if (selected !== null) { if (i === q.answer) { bg = C.green + "22"; border = C.green; col = C.green; } else if (i === selected) { bg = C.red + "22"; border = C.red; col = C.red; } }
          return <button key={i} onClick={() => choose(i)} style={{ textAlign: "left", padding: "10px 14px", borderRadius: 8, background: bg, border: `1.5px solid ${border}`, color: col, cursor: selected !== null ? "default" : "pointer", fontSize: 13, transition: "all 0.25s" }}>{i === q.answer && selected !== null ? "✓ " : i === selected && selected !== q.answer ? "✗ " : ""}{opt}</button>;
        })}
      </div>
      {selected !== null && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.purple + "18", border: `1px solid ${C.purple}44`, color: C.muted, fontSize: 13 }}>💡 {q.explain}</div>}
      {selected !== null && <button onClick={next} style={{ marginTop: 14, padding: "10px 24px", borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>}
    </div>
  );
}

export default function Unit5_5({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "sync", label: "Synchronous" },
    { id: "async", label: "Asynchronous" },
    { id: "cmp", label: "Trade-off" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>A shared bus needs rules</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The synchronous bus (a common clock)</h3><SyncWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The asynchronous bus (a full handshake)</h3><AsyncWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Synchronous vs asynchronous — the trade-off</h3><CompareWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.5.</p>
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔌</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.5</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Synchronous vs Asynchronous Buses</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>{completed.length} / {sections.length} done</div>
      </div>
      <div style={{ height: 3, background: C.border }}>
        <div style={{ height: "100%", width: `${(completed.length / sections.length) * 100}%`, background: C.green, transition: "width 0.4s ease" }} />
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: C.surface, borderRadius: 10, padding: 4, border: `1px solid ${C.border}`, flexWrap: "wrap" }}>
          {sections.map((s, i) => (
            <button key={i} onClick={() => setActiveSection(i)} style={{ flex: 1, minWidth: 72, padding: "8px 6px", borderRadius: 7, background: activeSection === i ? C.accentGlow : "transparent", border: "none", color: activeSection === i ? "#fff" : C.muted, cursor: "pointer", fontSize: 11, fontWeight: activeSection === i ? 600 : 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, transition: "all 0.2s" }}>
              {completed.includes(i) && <span style={{ color: C.green }}>✓</span>}{s.label}
            </button>
          ))}
        </div>
        <div style={{ background: C.surface, borderRadius: 12, padding: "24px 20px", border: `1px solid ${C.border}`, minHeight: 300 }}>{content[activeSection]}</div>
        {activeSection < sections.length - 1 && (
          <button onClick={goNext} style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mark Complete & Continue →</button>
        )}
      </div>
    </div>
  );
}
