// Unit5_5.jsx — Module 5 › Unit 5.5 — "Synchronous vs Asynchronous Buses"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: a bus is shared wires, so two drivers can clash (one-microphone
// analogy, tri-state, master/slave) -> synchronous timing by a shared clock
// (school bell), and what goes wrong with a slow device until Slave-ready is
// added -> the asynchronous full handshake (handing a plate across a counter)
// -> the speed trade-off with the rate calculation shown -> quiz.
// Builds on Unit 5.4 (bus master, arbitration). Every abbreviation is spelled
// out before use.
import { useState } from "react";

const C = {
  bg: "#0D1117", surface: "#161B22", card: "#1C2333",
  accent: "#58A6FF", accentGlow: "#1F6FEB",
  green: "#3FB950", yellow: "#D29922", purple: "#BC8CFF",
  red: "#F85149", orange: "#F0883E", teal: "#39D0D8",
  text: "#E6EDF3", muted: "#8B949E", border: "#30363D",
};
function Key({ color = C.purple, children }) {
  return <div style={{ marginTop: 16, background: color + "18", border: `1px solid ${color}44`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>🔑 {children}</div>;
}
function Frame({ children }) { return <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>{children}</p>; }
const box = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 };
const mono = { fontFamily: "monospace" };
function btn(active, color) { return { padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? color : C.border}`, background: active ? color : "transparent", color: active ? "#fff" : C.muted, fontWeight: 600, fontSize: 12.5, cursor: "pointer" }; }

// ── Glossary: every short name used in this unit, spelled out ──
const G = {
  BUS: { w: "bus", full: "Bus", plain: "A bundle of shared wires (address, data, control) that connects the CPU, memory and devices." },
  MASTER: { w: "master", full: "Bus master (Unit 5.4)", plain: "The unit that starts a transfer by sending the address and the command (Read or Write)." },
  SLAVE: { w: "slave", full: "Bus slave", plain: "The unit that recognises its address and answers: memory or a device interface. Also called the target." },
  PROTO: { w: "bus protocol", full: "Bus protocol", plain: "The agreed rules for who drives which wire, and when." },
  TRI: { w: "tri-state", full: "Tri-state driver", plain: "A wire driver with three states: 1, 0, or “hands off” (disconnected), so it does not disturb others." },
  CLK: { w: "bus clock", full: "Bus clock", plain: "A wire that ticks at a steady rate. Every device times its actions from the same ticks." },
  SYNC: { w: "synchronous", full: "Synchronous bus", plain: "Timing comes from the shared clock: everything happens at agreed clock ticks." },
  SR: { w: "Slave-ready", full: "Slave-ready signal", plain: "A wire the slave raises to say “the data I put on the bus is valid now”." },
  ASYNC: { w: "asynchronous", full: "Asynchronous bus", plain: "No shared clock. Each step waits for the other side's signal." },
  MR: { w: "Master-ready", full: "Master-ready signal", plain: "A wire the master raises to say “the address and command on the bus are valid”." },
  HS: { w: "handshake", full: "Full handshake", plain: "Each signal change answers a change from the other side, so neither side can run ahead." },
  SKEW: { w: "bus skew", full: "Bus skew", plain: "Signals on different wires arrive at slightly different times, because no two wires are exactly alike." },
  NS: { w: "ns", full: "Nanosecond", plain: "One billionth of a second (10⁻⁹ s)." },
  MBPS: { w: "MB/s", full: "Megabytes per second", plain: "Millions of bytes moved per second: the transfer rate." },
  RTT: { w: "round trip", full: "Round-trip delay", plain: "The time for a signal to go from master to slave AND for the answer to come back." },
};

// Tap-to-expand chip for re-looking-up a word anywhere in the lesson
function Term({ k, label }) {
  const [open, setOpen] = useState(false);
  const g = G[k];
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((o) => !o)} title={g.full} style={{ ...mono, fontSize: 12, padding: "0 6px", margin: "0 1px", borderRadius: 5, border: `1px dashed ${C.teal}88`, background: C.teal + "14", color: C.teal, cursor: "pointer" }}>{label || g.w}</button>
      {open && (
        <span style={{ position: "absolute", left: 0, top: "120%", zIndex: 5, width: 240, padding: "8px 10px", borderRadius: 8, background: C.surface, border: `1px solid ${C.teal}66`, fontSize: 12, color: C.muted, lineHeight: 1.5, boxShadow: "0 6px 20px #0008" }}>
          <b style={{ color: C.text }}>{g.full}</b><br />{g.plain}
        </span>
      )}
    </span>
  );
}
function NewWords({ keys }) {
  return (
    <div style={{ ...box, background: C.teal + "0D", borderColor: C.teal + "44", padding: "10px 14px", marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: 0.5, marginBottom: 6 }}>📖 NEW WORDS IN THIS SECTION</div>
      {keys.map((k) => (
        <div key={k} style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, marginBottom: 3 }}>
          <span style={{ ...mono, color: C.teal, fontWeight: 700 }}>{G[k].w}</span>{" = "}<b style={{ color: C.text }}>{G[k].full}</b>. {G[k].plain}
        </div>
      ))}
    </div>
  );
}

// ── Section 1: Need — two drivers on one wire ──
function NeedWidget() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("off");
  const drivers = [a, b].filter((x) => x !== "off");
  let wire, col, msg;
  if (drivers.length === 0) { wire = "?"; col = C.muted; msg = "Nobody is driving the wire. Its value is undefined: no one may read it."; }
  else if (drivers.length === 1) { wire = drivers[0]; col = C.green; msg = `Exactly one driver. Everyone on the bus reads ${drivers[0]}. ✓ This is what the rules guarantee.`; }
  else if (a !== b) { wire = "⚡"; col = C.red; msg = "CONFLICT: one driver pushes 1 while the other pulls to 0. The value is garbage, and a strong short-circuit current can damage the drivers."; }
  else { wire = a; col = C.yellow; msg = "Both happen to send the same value, so it looks fine. It is still against the rules: next time they may disagree."; }
  const pick = (val, set, cur, color) => (
    <div style={{ display: "flex", gap: 4 }}>
      {["1", "0", "off"].map((v) => <button key={v} onClick={() => set(v)} style={{ ...btn(cur === v, color), padding: "5px 10px", ...mono }}>{v === "off" ? "hands off" : `drive ${v}`}</button>)}
    </div>
  );
  return (
    <div>
      <NewWords keys={["BUS", "PROTO", "TRI", "MASTER", "SLAVE"]} />
      <Frame>A bus is like the <b>one microphone</b> in a class debate: everyone shares it, so only one person may
      speak at a time. Here two devices share one data wire. Choose what each one does to the wire.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <div style={{ ...box, padding: 10 }}><div style={{ fontSize: 12, color: C.accent, marginBottom: 6 }}>💾 Memory</div>{pick(a, setA, a, C.accent)}</div>
        <div style={{ ...box, padding: 10 }}><div style={{ fontSize: 12, color: C.purple, marginBottom: 6 }}>⌨️ Keyboard interface</div>{pick(b, setB, b, C.purple)}</div>
      </div>
      <div style={{ ...box, textAlign: "center", borderColor: col }}>
        <div style={{ fontSize: 11, color: C.muted }}>The shared data wire reads</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: col, ...mono }}>{wire}</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>{msg}</div>
      </div>
      <Key color={C.teal}>The <b>bus protocol</b> makes sure only one device drives a wire at a time; the others use
      <b> tri-state</b> drivers set to “hands off”. In each transfer the <b>master</b> (CPU or DMA controller) sends the
      address and command, and the addressed <b>slave</b> answers. The protocol also fixes <i>when</i> things happen.
      There are two families: <b>synchronous</b> and <b>asynchronous</b>.</Key>
    </div>
  );
}

// ── Section 2: Synchronous bus — the school bell ──
const SYNC_MODES = {
  fast: {
    label: "⚡ Fast memory", col: C.accent, ok: true,
    steps: [
      { tick: "t0", sr: 0, data: "—", note: "Bell (clock tick) t0: the CPU puts address 0x8000 and the Read command on the bus." },
      { tick: "t1", sr: 0, data: "87", note: "t1: memory has decoded the address and puts the data (87) on the data wires." },
      { tick: "t2", sr: 0, data: "87 ✓", note: "t2: end of the cycle. The CPU latches (captures) 87 into a register. One clock cycle, done." },
    ],
  },
  slowBad: {
    label: "🐢 Slow device, no Slave-ready", col: C.red, ok: false,
    steps: [
      { tick: "t0", sr: 0, data: "—", note: "t0: the CPU puts the address of a slow device and Read on the bus." },
      { tick: "t1", sr: 0, data: "—", note: "t1: the slow device is still working. Nothing on the data wires yet." },
      { tick: "t2", sr: 0, data: "?? ✗", note: "t2: the CPU latches the data wires anyway, because the bell rang. It captures garbage, and it does not even know it failed." },
    ],
  },
  slowGood: {
    label: "🐢 Slow device + Slave-ready", col: C.green, ok: true,
    steps: [
      { tick: "cycle 1", sr: 0, data: "—", note: "Cycle 1: the CPU sends address and Read." },
      { tick: "cycle 2", sr: 0, data: "—", note: "Cycle 2: the device is still fetching. Slave-ready = 0, so the CPU waits another cycle instead of latching." },
      { tick: "cycle 3", sr: 1, data: "65", note: "Cycle 3: the device puts 65 on the data wires and raises Slave-ready. The CPU latches at the end of this cycle." },
      { tick: "cycle 4", sr: 0, data: "65 ✓", note: "Cycle 4: Slave-ready drops and the bus is free. A slow device simply took extra cycles." },
    ],
  },
};
function SyncWidget() {
  const [mode, setMode] = useState("fast");
  const [t, setT] = useState(0);
  const m = SYNC_MODES[mode];
  const st = m.steps[t];
  return (
    <div>
      <NewWords keys={["CLK", "SYNC", "SR"]} />
      <Frame>A <b>synchronous</b> bus works like a school timetable: everyone moves when the bell rings. The bell is
      the <Term k="CLK" />. Step through a Read from fast memory, then try a slow device with and without
      <Term k="SR" />.</Frame>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.entries(SYNC_MODES).map(([k, x]) => <button key={k} onClick={() => { setMode(k); setT(0); }} style={btn(mode === k, x.col)}>{x.label}</button>)}
      </div>
      <div style={{ ...box, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {m.steps.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ height: 26, borderRadius: 5, background: i <= t ? C.accentGlow : C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, ...mono, color: i <= t ? "#fff" : C.muted }}>🔔 {s.tick}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 10.5, color: C.muted }}>Data wires</div><div style={{ ...mono, fontSize: 20, fontWeight: 800, color: st.data.includes("✗") ? C.red : st.data.includes("✓") ? C.green : C.text }}>{st.data}</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 10.5, color: C.muted }}>Slave-ready</div><div style={{ ...mono, fontSize: 20, fontWeight: 800, color: st.sr ? C.green : C.muted }}>{mode === "slowGood" ? st.sr : "not used"}</div></div>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: st.data.includes("✗") ? C.red : C.text, minHeight: 36, lineHeight: 1.6 }}>{st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setT((x) => Math.min(m.steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Ring the bell ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key>A plain synchronous bus forces every device to answer within one clock cycle, so the clock must suit the
      <b> slowest</b> device, and the master never learns whether the slave really replied. <b>Slave-ready</b> fixes both:
      a slow device takes extra cycles, and if Slave-ready never comes, the master gives up after a time-out and reports
      an error.</Key>
    </div>
  );
}

// ── Section 3: Asynchronous handshake — handing a plate across a counter ──
function AsyncWidget() {
  const steps = [
    { addr: 1, mr: 0, sr: 0, data: 0, note: "t0: the master (CPU) puts the address and the Read command on the bus." },
    { addr: 1, mr: 1, sr: 0, data: 0, note: "t1: after a short gap, it raises Master-ready: “address is valid, go”. The gap allows for bus skew." },
    { addr: 1, mr: 1, sr: 1, data: 1, note: "t2: the slave sees Master-ready, puts the data on the bus, and raises Slave-ready: “here it is”." },
    { addr: 1, mr: 0, sr: 1, data: 1, note: "t3: the master sees Slave-ready, latches the data, and drops Master-ready: “got it”." },
    { addr: 0, mr: 0, sr: 1, data: 1, note: "t4: the master removes the address from the bus." },
    { addr: 0, mr: 0, sr: 0, data: 0, note: "t5: the slave sees Master-ready drop, removes the data, and drops Slave-ready. Transfer complete." },
  ];
  const [t, setT] = useState(0);
  const st = steps[t];
  const line = (label, on, col, text) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ width: 110, fontSize: 11.5, color: C.muted }}>{label}</span>
      <div style={{ flex: 1, height: 22, borderRadius: 5, background: on ? col : C.bg, border: `1px solid ${on ? col : C.border}`, display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 11, fontWeight: 700, color: on ? "#fff" : C.muted }}>{on ? text : "—"}</div>
    </div>
  );
  return (
    <div>
      <NewWords keys={["ASYNC", "MR", "HS", "SKEW"]} />
      <Frame>An <b>asynchronous</b> bus has <b>no clock</b>. Think of handing a plate across the canteen counter:
      “here, take it” → “got it” → “okay, letting go”. Each move waits for the other person's move. Step through it.</Frame>
      <div style={{ ...box, padding: 12, marginBottom: 10 }}>
        {line("Address + Read", st.addr, C.purple, "0x8000, Read")}
        {line("Master-ready", st.mr, C.accent, "1  (master: “go”)")}
        {line("Data", st.data, C.teal, "87")}
        {line("Slave-ready", st.sr, C.green, "1  (slave: “here it is”)")}
      </div>
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
        {steps.map((_, i) => <div key={i} style={{ width: 34, height: 22, borderRadius: 4, fontSize: 10, ...mono, display: "flex", alignItems: "center", justifyContent: "center", color: i <= t ? "#fff" : C.muted, background: i <= t ? C.accentGlow : C.card, border: `1px solid ${C.border}` }}>t{i}</div>)}
      </div>
      <div style={{ fontSize: 12.5, color: C.text, minHeight: 38, lineHeight: 1.6 }}>{st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setT((x) => Math.min(steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Step ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.teal}>Every change answers a change on the other side: a <b>fully interlocked handshake</b>. A slow
      slave simply takes longer to raise Slave-ready; nobody has to agree a speed in advance. The gap between t0 and
      t1 allows for <b>bus skew</b>, so Master-ready never arrives before the address it announces.</Key>
    </div>
  );
}

// ── Section 4: Trade-off — the speed calculation ──
function CompareWidget() {
  const [rtt, setRtt] = useState(20);
  const rate = (ns) => Math.round((4 / ns) * 1000);
  return (
    <div>
      <NewWords keys={["RTT", "NS", "MBPS"]} />
      <Frame>Which is faster? Each transfer moves one 4-byte word. A synchronous transfer needs about <b>one</b>
      round trip; the asynchronous handshake needs about <b>two</b> (master → slave → master, twice). Drag the
      round-trip delay.</Frame>
      <label style={{ color: C.muted, fontSize: 12 }}>one round trip = <strong style={{ color: C.accent }}>{rtt} ns</strong></label>
      <input type="range" min={5} max={60} value={rtt} onChange={(e) => setRtt(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
        <div style={{ ...box, borderColor: C.accent + "55", textAlign: "center" }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 12 }}>🔔 SYNCHRONOUS</div>
          <div style={{ ...mono, fontSize: 12, color: C.muted, margin: "6px 0" }}>4 bytes ÷ {rtt} ns</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.accent }}>{rate(rtt)} MB/s</div>
        </div>
        <div style={{ ...box, borderColor: C.teal + "55", textAlign: "center" }}>
          <div style={{ color: C.teal, fontWeight: 700, fontSize: 12 }}>🤝 ASYNCHRONOUS</div>
          <div style={{ ...mono, fontSize: 12, color: C.muted, margin: "6px 0" }}>4 bytes ÷ {2 * rtt} ns</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.teal }}>{rate(2 * rtt)} MB/s</div>
        </div>
      </div>
      <div style={{ ...box, marginTop: 12, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
        How the number is worked out: 4 bytes in {rtt} ns = {(4 / rtt).toFixed(2)} bytes per ns. One second has 10⁹ ns,
        so that is {(4 / rtt).toFixed(2)} × 10⁹ bytes/s = <b style={{ color: C.text }}>{rate(rtt)} MB/s</b>.
      </div>
      <div style={{ ...box, marginTop: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
        <b style={{ color: C.accent }}>Synchronous:</b> simpler and faster, but the clock must reach every device cleanly.
        <b style={{ color: C.teal }}> Asynchronous:</b> no shared clock and adapts to any device's speed, but pays for two round trips per transfer.
      </div>
      <Key color={C.yellow}>One round trip instead of two is why <b>most high-speed buses today are synchronous</b>.
      They handle slow devices by adding clock cycles with a Slave-ready style signal, exactly as in the Synchronous tab.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "Memory drives the data wire to 1 while the keyboard interface drives it to 0. What happens?",
      options: ["The wire reads 1, because memory is more important", "A bus conflict: the value is garbage and the drivers can be damaged", "The wire averages to 0.5", "The CPU picks the right one"],
      answer: 1, explain: "Two drivers fighting is exactly what the bus protocol prevents. Everyone except the current driver must be in the tri-state “hands off” state." },
    { q: "On a plain synchronous bus with no Slave-ready, a slow device needs 2 cycles. What goes wrong?",
      options: ["Nothing, the clock slows down by itself", "The master latches the data at the end of cycle 1 anyway and captures garbage without knowing", "The device catches fire", "The bus becomes asynchronous"],
      answer: 1, explain: "The master acts on the clock, not on the device. Slave-ready lets the slave say when the data is really valid, so the transfer can take extra cycles." },
    { q: "In the asynchronous handshake, what makes the master latch the data?",
      options: ["The next clock tick", "Seeing Slave-ready go to 1", "A fixed delay of 20 ns", "Master-ready going to 1"],
      answer: 1, explain: "There is no clock. The master waits for the slave's “here it is” signal, Slave-ready, then latches and drops Master-ready." },
    { q: "With a 25 ns round trip and 4-byte words, what are the peak rates?",
      options: ["Sync 160 MB/s, async 80 MB/s", "Sync 80 MB/s, async 160 MB/s", "Both 100 MB/s", "Sync 25 MB/s, async 50 MB/s"],
      answer: 0, explain: "Sync: 4 bytes ÷ 25 ns = 0.16 bytes/ns = 160 MB/s. Async needs two round trips (50 ns), so 4 ÷ 50 ns = 80 MB/s." },
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
          {score === 4 ? "Excellent. You can read a bus timing story like a pro." : score >= 2 ? "Good. Re-run the slow device in 'Synchronous' with and without Slave-ready." : "Go back to 'Synchronous' and 'Asynchronous' and step slowly. Tap any teal word for its meaning."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.5 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can explain why a bus needs rules, trace synchronous and asynchronous transfers, and calculate their
            speed.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.6 — Standard I/O Interfaces: PCI & SCSI.</strong>{" "}
            How can a graphics card from one company fit a motherboard from another? Agree on one standard bus.
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
    { id: "compare", label: "Which Is Faster?" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const quizIdx = sections.length - 1;
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>One microphone, many speakers: why a bus needs rules</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Synchronous: everyone moves on the bell</h3><SyncWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Asynchronous: the full handshake</h3><AsyncWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Which is faster? Work out the rate</h3><CompareWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.5.</p>
      <Quiz onComplete={() => { markComplete(quizIdx); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⏱️</div>
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
        {activeSection < quizIdx && (
          <button onClick={goNext} style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 8, background: C.accentGlow, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Mark Complete & Continue →</button>
        )}
      </div>
    </div>
  );
}
