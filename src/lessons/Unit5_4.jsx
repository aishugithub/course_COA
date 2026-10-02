// Unit5_4.jsx — Module 5 › Unit 5.4 — "Direct Memory Access & Bus Arbitration"
// Foothold formula: dark palette, free-nav tabs, interactive widgets, 🔑
// callouts, 4-question quiz.
// Arc: interrupts still cost one doorbell per word, so a 4 KB photo means
// 1024 interruptions (need; porter analogy) -> fill in the DMA controller's
// "job slip" yourself (start address, word count, direction) -> trace a
// block transfer while the CPU keeps working, with one interrupt at the end
// -> sharing the one bus: BR/BG arbitration (single-lane bridge), cycle
// stealing vs burst -> quiz. Builds on Units 5.1 (registers), 5.2 (IRQ, IE).
// Every abbreviation is spelled out before use.
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
  DMA: { w: "DMA", full: "Direct Memory Access", plain: "Data moves between a device and memory directly, without passing through the CPU word by word." },
  DMAC: { w: "DMA controller", full: "DMA controller", plain: "A small helper circuit that does the copying. The CPU gives it a job, and it reports back once when done." },
  KB: { w: "KB", full: "Kilobyte", plain: "1024 bytes. With 4-byte words (Unit 1.4), 1 KB = 256 words, so 4 KB = 1024 words." },
  ADDR: { w: "starting address", full: "Starting-address register", plain: "Where in memory the block begins. The controller adds 4 after each word." },
  COUNT: { w: "word count", full: "Word-count register", plain: "How many words are left to move. The controller subtracts 1 after each word and stops at 0." },
  RW: { w: "R/W", full: "Read/Write direction bit", plain: "1 = read: memory → device. 0 = write: device → memory." },
  DONE: { w: "Done", full: "Done flag", plain: "Set to 1 by the controller when the count reaches 0." },
  IRQ: { w: "IRQ", full: "Interrupt ReQuest (Unit 5.2)", plain: "The doorbell wire. With IE = 1 the controller rings it once, when Done becomes 1." },
  MASTER: { w: "bus master", full: "Bus master", plain: "Whichever unit is currently in charge of the bus, putting addresses on it. Usually the CPU; during DMA, the controller." },
  ARB: { w: "arbiter", full: "Bus arbiter", plain: "The referee circuit that decides who may be bus master next." },
  BR: { w: "BR", full: "Bus Request", plain: "Wire from a would-be master to the arbiter: “may I use the bus?”" },
  BG: { w: "BG", full: "Bus Grant", plain: "Wire from the arbiter back: “yes, the bus is yours”." },
  STEAL: { w: "cycle stealing", full: "Cycle stealing", plain: "The DMA controller borrows the bus for one word at a time, between the CPU's own uses." },
  BURST: { w: "burst mode", full: "Burst (block) mode", plain: "The DMA controller keeps the bus for the whole block, moving words back to back." },
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

// ── Section 1: Need — one doorbell per word is too many ──
function NeedWidget() {
  const [kb, setKb] = useState(4);
  const words = kb * 256;
  const perIrq = 50; // illustrative: save PC/PS, ISR body, return
  const fmt = (n) => n.toLocaleString("en-IN");
  return (
    <div>
      <NewWords keys={["DMA", "DMAC", "KB"]} />
      <Frame>Interrupts fixed the keyboard: a few keys a second, one doorbell each. Now copy a <b>photo</b> from
      the disk into memory. Imagine the principal carrying 1024 library books from a van to the shelf <i>one book
      at a time</i>, with a bell ringing before each book. Better: hire a <b>porter</b> who carries them all and
      reports once. Drag the photo size.</Frame>
      <label style={{ color: C.muted, fontSize: 12 }}>photo size = <strong style={{ color: C.accent }}>{kb} KB</strong> = {fmt(words)} words of 4 bytes</label>
      <input type="range" min={4} max={1024} step={4} value={kb} onChange={(e) => setKb(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 12 }}>
        <div style={{ ...box, borderColor: C.orange + "55" }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>🔔 ONE INTERRUPT PER WORD (Unit 5.2)</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.orange }}>{fmt(words)}</div>
          <div style={{ fontSize: 11.5, color: C.muted }}>interruptions of the CPU</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>≈ <b style={{ color: C.red }}>{fmt(words * perIrq)}</b> CPU instructions spent just entering and leaving the ISR</div>
        </div>
        <div style={{ ...box, borderColor: C.green + "55" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>🧑‍🔧 DMA CONTROLLER (the porter)</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.green }}>1</div>
          <div style={{ fontSize: 11.5, color: C.muted }}>interruption, when the whole photo is in memory</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>≈ <b style={{ color: C.green }}>{fmt(perIrq + 20)}</b> CPU instructions: a few to set up the job, one ISR at the end</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>“About 50 instructions per interrupt” is an illustrative round figure. The point is that the left side grows with the photo and the right side does not.</div>
      <Key color={C.green}><b>DMA (Direct Memory Access)</b>: a dedicated <b>DMA controller</b> moves the block straight
      between the device and memory. The CPU only writes the job, then gets <b>one</b> interrupt when it is finished.</Key>
    </div>
  );
}

// ── Section 2: Fill in the job slip (the controller's registers) ──
function JobSlipWidget() {
  const fields = [
    { k: "addr", label: "Starting address", opts: ["0x4000", "0x8000", "0x0000"], ok: "0x8000", why: { "0x4000": "0x4000 is KBD_DATA, the keyboard (Unit 5.1)! The photo would be poured into a device register.", "0x0000": "That is not the buffer the OS chose. The photo goes to the buffer at 0x8000." } },
    { k: "count", label: "Word count", opts: ["4096", "1024", "4"], ok: "1024", why: { "4096": "4096 is the number of BYTES. The controller counts 4-byte words: 4096 ÷ 4 = 1024.", "4": "Only 4 words = 16 bytes. Most of the photo would be left behind." } },
    { k: "rw", label: "Direction R/W", opts: ["1 (read: memory → device)", "0 (write: device → memory)"], ok: "0 (write: device → memory)", why: { "1 (read: memory → device)": "That copies memory OUT to the disk. We want the photo to come IN from the disk, so the controller WRITES into memory." } },
    { k: "ie", label: "IE (interrupt when done)", opts: ["1", "0"], ok: "1", why: { "0": "With IE = 0 the controller never rings, so the OS would have to poll the Done flag (Unit 5.1's problem again)." } },
  ];
  const [val, setVal] = useState({});
  const [checked, setChecked] = useState(false);
  const allOk = fields.every((f) => val[f.k] === f.ok);
  return (
    <div>
      <NewWords keys={["ADDR", "COUNT", "RW", "DONE"]} />
      <Frame>To start the porter, the OS fills in a <b>job slip</b>: a few registers inside the DMA controller,
      reached with ordinary Stores (memory-mapped, Unit 5.1). <b>Your job:</b> copy a <b>4 KB photo</b> from the
      disk into the memory buffer at <code>0x8000</code>. Fill in the slip, then check it.</Frame>
      <div style={{ ...box, padding: 12 }}>
        {fields.map((f) => (
          <div key={f.k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ width: 150, fontSize: 12.5, color: C.text }}>{f.label}</span>
            {f.opts.map((o) => {
              const picked = val[f.k] === o;
              const col = checked && picked ? (o === f.ok ? C.green : C.red) : C.purple;
              return <button key={o} onClick={() => { setVal((v) => ({ ...v, [f.k]: o })); setChecked(false); }} style={{ ...btn(picked, col), ...mono, padding: "5px 10px", fontSize: 12 }}>{o}</button>;
            })}
          </div>
        ))}
        <button onClick={() => setChecked(true)} style={{ ...btn(true, C.accentGlow), marginTop: 4 }}>Check my job slip ✓</button>
      </div>
      {checked && (
        <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: (allOk ? C.green : C.yellow) + "14", border: `1px solid ${(allOk ? C.green : C.yellow)}44`, fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
          {allOk ? <span style={{ color: C.green }}>✓ Perfect slip. The controller will write 1024 words into 0x8000, 0x8004, … 0x8FFC, set Done = 1, and ring IRQ once.</span>
            : fields.filter((f) => val[f.k] !== f.ok).map((f) => <div key={f.k}>• <b style={{ color: C.text }}>{f.label}:</b> {val[f.k] ? f.why[val[f.k]] : "not filled in yet."}</div>)}
        </div>
      )}
      <Key>Three numbers (where, how many, which way) plus an enable bit are all the CPU writes to launch a transfer
      of thousands of words. After that, the CPU walks away.</Key>
    </div>
  );
}

// ── Section 3: Trace a block transfer ──
function TraceWidget() {
  const total = 4;
  const [i, setI] = useState(0);
  const [ie, setIe] = useState(1);
  const done = i >= total;
  const addr = 0x8000 + Math.min(i, total) * 4;
  const hex = (n) => "0x" + n.toString(16).toUpperCase();
  return (
    <div>
      <NewWords keys={["IRQ"]} />
      <Frame>A tiny 4-word job, so you can watch every step. Each step the controller puts the address on the bus,
      moves one word from the disk into memory, adds 4 to the address and subtracts 1 from the count. Watch the CPU
      lane: it keeps totalling marks the whole time.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={() => { setIe(1); setI(0); }} style={btn(ie === 1, C.green)}>IE = 1</button>
        <button onClick={() => { setIe(0); setI(0); }} style={btn(ie === 0, C.yellow)}>IE = 0</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 10 }}>
        <Stat label="Address register" val={hex(addr)} col={C.accent} mono />
        <Stat label="Word count" val={total - Math.min(i, total)} col={done ? C.green : C.teal} />
        <Stat label="Done" val={done ? 1 : 0} col={done ? C.green : C.muted} />
        <Stat label="IRQ" val={done && ie ? 1 : 0} col={done && ie ? C.red : C.muted} />
      </div>
      <div style={{ ...box, padding: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Memory buffer</div>
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: total }).map((_, k) => (
            <div key={k} style={{ flex: 1, padding: "6px 2px", borderRadius: 6, textAlign: "center", fontSize: 10.5, ...mono, color: k < i ? "#fff" : C.muted, background: k < i ? C.green + "99" : C.bg, border: `1px solid ${k < i ? C.green : C.border}` }}>
              {hex(0x8000 + k * 4)}<br />{k < i ? `W${k} ✓` : "empty"}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...box, padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: C.muted, width: 60 }}>CPU lane</span>
        <span style={{ fontSize: 12.5, color: done && ie ? C.orange : C.green }}>
          {done ? (ie ? "🔔 IRQ! CPU runs the DMA ISR once: “photo ready”, then goes back to the marks." : "Done = 1 but no IRQ. The CPU won't know unless it polls the Done flag.") : `🧮 Still running the marks program (${["Load", "Add", "Add", "Branch"][i]} …)`}
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setI((x) => Math.min(total, x + 1))} style={btn(true, C.accentGlow)}>Move one word ▶</button>
        <button onClick={() => setI(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.teal}>The controller does the CPU's old bookkeeping (supply the address, add 4, count down) in
      hardware, without running any program. The CPU is interrupted <b>once</b>, not once per word.</Key>
    </div>
  );
}
function Stat({ label, val, col, mono: m }) {
  return (
    <div style={{ ...box, textAlign: "center", padding: 10 }}>
      <div style={{ fontSize: 10.5, color: C.muted }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: col, fontFamily: m ? "monospace" : "inherit", marginTop: 4 }}>{val}</div>
    </div>
  );
}

// ── Section 4: Sharing the bus — BR/BG, cycle stealing vs burst ──
function ArbWidget() {
  const hs = [
    { br: 0, bg: 0, master: "CPU", t: "The CPU is bus master, fetching its instructions." },
    { br: 1, bg: 0, master: "CPU", t: "The DMA controller has a word ready. It raises BR (Bus Request): “may I?”" },
    { br: 1, bg: 1, master: "DMA", t: "The arbiter lets the CPU finish its current bus use, then raises BG (Bus Grant). The DMA controller is now bus master." },
    { br: 0, bg: 1, master: "DMA", t: "The controller moves its word(s), then drops BR: “I'm done”." },
    { br: 0, bg: 0, master: "CPU", t: "The arbiter drops BG and the CPU is bus master again." },
  ];
  const [s, setS] = useState(0);
  const [mode, setMode] = useState("steal");
  const st = hs[s];
  const steal = ["P", "D", "P", "P", "D", "P", "P", "D", "P", "P", "D", "P"];
  const burst = ["P", "P", "D", "D", "D", "D", "P", "P", "P", "P", "P", "P"];
  const tl = mode === "steal" ? steal : burst;
  const sig = (name, on, col) => (
    <div style={{ ...box, padding: 8, textAlign: "center" }}>
      <div style={{ fontSize: 10.5, color: C.muted }}>{name}</div>
      <div style={{ ...mono, fontSize: 20, fontWeight: 800, color: on ? col : C.muted }}>{on}</div>
    </div>
  );
  return (
    <div>
      <NewWords keys={["MASTER", "ARB", "BR", "BG", "STEAL", "BURST"]} />
      <Frame>The CPU and the DMA controller both need the <b>one</b> memory bus. Think of a single-lane bridge with a
      traffic police officer (the <Term k="ARB" />): a vehicle signals “may I cross?” (BR), the officer waves it on
      (BG). Step through the handshake.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 8 }}>
        {sig("BR (DMA → arbiter)", st.br, C.orange)}
        {sig("BG (arbiter → DMA)", st.bg, C.green)}
        <div style={{ ...box, padding: 8, textAlign: "center", borderColor: st.master === "CPU" ? C.accent : C.orange }}>
          <div style={{ fontSize: 10.5, color: C.muted }}>Bus master now</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: st.master === "CPU" ? C.accent : C.orange }}>{st.master === "CPU" ? "🧠 CPU" : "🧑‍🔧 DMA"}</div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12.5, color: C.text, minHeight: 36, lineHeight: 1.6 }}>{st.t}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button onClick={() => setS((x) => Math.min(hs.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Step ▶ ({s + 1}/{hs.length})</button>
        <button onClick={() => setS(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <div style={{ ...box, marginTop: 14 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => setMode("steal")} style={btn(mode === "steal", C.teal)}>Cycle stealing</button>
          <button onClick={() => setMode("burst")} style={btn(mode === "burst", C.orange)}>Burst mode</button>
        </div>
        <div style={{ fontSize: 10.5, color: C.muted, marginBottom: 6 }}>Who uses the bus, cycle by cycle (moving 4 words) →</div>
        <div style={{ display: "flex", gap: 3 }}>
          {tl.map((who, i) => <div key={i} style={{ flex: 1, height: 28, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", background: who === "P" ? C.accentGlow : C.orange }}>{who === "P" ? "CPU" : "DMA"}</div>)}
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
          {mode === "steal" ? "Cycle stealing: the controller borrows one cycle now and then. The CPU barely slows down; the transfer is spread out."
            : "Burst mode: the controller holds the bus for the whole block. The transfer finishes fastest, but the CPU waits if it needs the bus meanwhile."}
        </div>
      </div>
      <Key color={C.orange}>Any unit that can drive the bus is a possible <b>bus master</b>. With one central
      <b> arbiter</b> and BR/BG wires (centralized arbitration) the arbiter decides; in <b>distributed</b>
      arbitration the masters decide among themselves. Either way, no master should be kept waiting forever.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "A 4 KB photo is copied with 4-byte words. How many CPU interruptions with one-interrupt-per-word, and with DMA?",
      options: ["4096 and 4096", "1024 and 1", "1 and 1024", "4 and 1"],
      answer: 1, explain: "4 KB = 4096 bytes = 1024 words, so one interrupt per word gives 1024. DMA interrupts once, when the whole block is done." },
    { q: "The photo goes FROM the disk INTO memory. What do you put in the R/W bit?",
      options: ["1, read: memory → device", "0, write: device → memory", "It doesn't matter", "The word count"],
      answer: 1, explain: "Data is being written into memory, so R/W = 0. R/W = 1 would read memory out to the device." },
    { q: "What is the CPU doing while the DMA controller moves the block?",
      options: ["Waiting in a polling loop", "Running other programs, losing only the odd bus cycle to the controller", "Copying the words itself", "Switched off"],
      answer: 1, explain: "That is the whole point of DMA. In cycle-stealing mode the CPU just loses an occasional bus cycle." },
    { q: "In what order do the arbitration signals happen?",
      options: ["BG, then BR", "DMA raises BR → arbiter raises BG → DMA uses the bus → DMA drops BR → arbiter drops BG", "The CPU raises BG", "Both raise BR and share the bus at once"],
      answer: 1, explain: "Request, grant, use, release: like signalling the traffic officer, being waved on, crossing, and clearing the bridge." },
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
          {score === 4 ? "Excellent. You can program a DMA controller and explain who owns the bus." : score >= 2 ? "Good. Fill in the 'Job Slip' once more, especially the word count and direction." : "Revisit 'Job Slip' and 'Transfer'. Tap any teal word to see what it stands for."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.4 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can explain why DMA exists, program its job slip, trace a block transfer, and describe how the bus
            is shared.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.5 — Synchronous vs Asynchronous Buses.</strong>{" "}
            Once a master owns the bus, how do sender and receiver agree on <i>when</i> the data is valid?
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

export default function Unit5_4({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "slip", label: "Job Slip" },
    { id: "trace", label: "Transfer" },
    { id: "arb", label: "Sharing the Bus" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const quizIdx = sections.length - 1;
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>1024 doorbells for one photo? Hire a porter</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Fill in the DMA controller's job slip</h3><JobSlipWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Watch a block transfer</h3><TraceWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Sharing the bus: arbitration</h3><ArbWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.4.</p>
      <Quiz onComplete={() => { markComplete(quizIdx); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🚚</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.4</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Direct Memory Access & Bus Arbitration</div>
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
