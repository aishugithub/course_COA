// Unit5_1.jsx — Module 5 › Unit 5.1 — "Accessing I/O Devices"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: the CPU only knows "locker n" (Load/Store), so how does it reach a
// keyboard? -> memory-mapped I/O: some lockers open into a device (try Load /
// Store on a live address map) -> the interface's data / status / control
// registers (press keys, watch KIN) -> the polling loop line by line, and why
// it wastes the CPU (sets up Unit 5.2 interrupts) -> quiz.
// Scaffolds on Unit 1.4 (lockers, addresses, hex), Unit 2.2 (masking flags),
// Units 2.3/2.4 (Load/Store). Every abbreviation is spelled out before use.
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
  IO: { w: "I/O", full: "Input/Output", plain: "Anything that moves data between the computer and the outside world: keyboard, display, disk, network." },
  MMIO: { w: "memory-mapped I/O", full: "Memory-mapped Input/Output", plain: "A few memory addresses are handed to devices instead of RAM, so ordinary Load/Store reach the device." },
  HEX: { w: "0x4000", full: "Hexadecimal (base-16) number", plain: "The 0x prefix means base 16, as in Unit 1.4. 0x4000 = 16384 in decimal. Addresses are usually written this way." },
  ASCII: { w: "ASCII", full: "American Standard Code for Information Interchange", plain: "The number code for each character. 'A' = 65, 'B' = 66, 'a' = 97." },
  REG: { w: "register", full: "Device register", plain: "A small storage slot inside the device's interface. Each one has its own address." },
  KIN: { w: "KIN", full: "Keyboard INput-ready flag", plain: "A bit in KBD_STATUS. 1 = a key is waiting in KBD_DATA. Reading KBD_DATA sets it back to 0." },
  DOUT: { w: "DOUT", full: "Display OUTput-ready flag", plain: "A bit in DISP_STATUS. 1 = the display can accept the next character." },
  KIE: { w: "KIE", full: "Keyboard Interrupt-Enable bit", plain: "A bit in KBD_CONTROL that the CPU writes. 1 = the keyboard may ring the CPU's doorbell (Unit 5.2)." },
  POLL: { w: "polling", full: "Polling", plain: "The CPU repeatedly reads a status flag to ask “ready yet?”." },
  BUSY: { w: "busy-waiting", full: "Busy-waiting", plain: "Polling in a tight loop: the CPU does no useful work until the flag changes." },
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

// ── Section 1: Need — the CPU only knows "locker n" ──
function NeedWidget() {
  const [mapped, setMapped] = useState(true);
  return (
    <div>
      <NewWords keys={["IO", "MMIO"]} />
      <Frame>
        In Unit 1.4 memory was a wall of numbered <b>lockers</b>. The CPU knows only two moves:
        <code> Load</code> (take what is in locker n) and <code>Store</code> (put something in locker n).
        A keyboard is not a locker. So how can a program ever read a key or print a letter? Compare the two
        designs engineers use.
      </Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setMapped(false)} style={btn(!mapped, C.orange)}>🏢 A separate room for devices</button>
        <button onClick={() => setMapped(true)} style={btn(mapped, C.green)}>🚪 Some lockers open into a device</button>
      </div>
      {!mapped ? (
        <div style={{ ...box, borderColor: C.orange + "66" }}>
          <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>ISOLATED (PORT-MAPPED) I/O</div>
          <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.7, marginBottom: 8 }}>Devices get their own separate numbered "ports", in a different room from the lockers.
          The CPU needs <b>new instructions</b> and an <b>extra control wire</b> to say "I mean the device room, not memory".</div>
          <pre style={{ ...mono, fontSize: 13, color: C.text, margin: 0, lineHeight: 1.6 }}>{`In   R2, PORT_5     ; special instruction just for devices
Out  R2, PORT_6     ; and another one`}</pre>
          <div style={{ color: C.orange, fontSize: 12, marginTop: 8 }}>It works, and some processors do it, but it is more machinery.</div>
        </div>
      ) : (
        <div style={{ ...box, borderColor: C.green + "66" }}>
          <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>MEMORY-MAPPED I/O</div>
          <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.7, marginBottom: 8 }}>Take a few lockers and knock out their back wall, so they open straight into the
          keyboard or the display. Now the <b>same</b> Load and Store reach the device. No new instructions.</div>
          <pre style={{ ...mono, fontSize: 13, color: C.text, margin: 0, lineHeight: 1.6 }}>{`Load   R2, KBD_DATA    ; "locker" 0x4000 is really the keyboard
Store  R2, DISP_DATA   ; "locker" 0x4010 is really the screen`}</pre>
        </div>
      )}
      <Key color={C.green}>The whole module rests on one move: make a device <b>look like memory</b>. Reserve some
      addresses for the device instead of RAM, and the processor reaches hardware with the Load/Store it already knows.</Key>
    </div>
  );
}

// ── Section 2: Try it — a live address map ──
const ROWS = [
  { a: "0x0100", name: "marks[0]", kind: "ram", d: "Ordinary RAM: the first student's mark." },
  { a: "0x0104", name: "marks[1]", kind: "ram", d: "Ordinary RAM: the second student's mark." },
  { a: "0x4000", name: "KBD_DATA", kind: "dev", d: "Keyboard data register: the ASCII code of the last key pressed." },
  { a: "0x4004", name: "KBD_STATUS", kind: "dev", d: "Keyboard status register: its KIN flag says a key is waiting." },
  { a: "0x4010", name: "DISP_DATA", kind: "dev", d: "Display data register: a Store here puts a character on screen." },
  { a: "0x4014", name: "DISP_STATUS", kind: "dev", d: "Display status register: its DOUT flag says the screen is ready." },
];
function MapWidget() {
  const [sel, setSel] = useState(2);
  const [op, setOp] = useState("Load");
  const [mem, setMem] = useState({ "0x0100": 87, "0x0104": 92 });
  const [screen, setScreen] = useState("");
  const [result, setResult] = useState(null);
  const r = ROWS[sel];
  const run = () => {
    if (op === "Load") {
      if (r.kind === "ram") setResult(`R2 ← ${mem[r.a]}   (a mark stored in RAM)`);
      else if (r.name === "KBD_DATA") setResult("R2 ← 65   (ASCII code of 'A', the key the student pressed)");
      else if (r.name === "KBD_STATUS") setResult("R2 ← 0000 0010   (bit 1 = KIN = 1: a key is waiting)");
      else if (r.name === "DISP_STATUS") setResult("R2 ← 0000 0100   (bit 2 = DOUT = 1: screen ready)");
      else setResult("Reading DISP_DATA gives nothing useful. It is a 'write' register.");
    } else {
      if (r.kind === "ram") { setMem((m) => ({ ...m, [r.a]: 72 })); setResult(`${r.name} ← 72   (the RAM locker now holds 72)`); }
      else if (r.name === "DISP_DATA") { setScreen((s) => (s + "H").slice(-20)); setResult("Screen shows 'H'   (72 is the ASCII code of 'H')"); }
      else setResult(`Storing into ${r.name} has no effect: status registers are read-only.`);
    }
  };
  return (
    <div>
      <NewWords keys={["HEX", "ASCII", "REG"]} />
      <Frame>This is one computer's <b>address map</b>. Most rows are RAM. A few rows are device
      <Term k="REG" label="registers" />. Pick a row, pick an instruction, and press Run. Notice the
      instruction never changes; only the <i>address</i> decides whether you reach memory or a device.
      R2 holds 72 for Stores.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
        <div style={{ ...box, padding: 8 }}>
          {ROWS.map((row, i) => {
            const col = row.kind === "ram" ? C.teal : C.accent;
            return (
              <button key={row.a} onClick={() => { setSel(i); setResult(null); }} style={{ width: "100%", textAlign: "left", display: "flex", gap: 10, alignItems: "center", padding: "7px 10px", marginBottom: 4, borderRadius: 7, cursor: "pointer", background: sel === i ? col + "22" : "transparent", border: `1px solid ${sel === i ? col : C.border}` }}>
                <span style={{ ...mono, color: col, fontSize: 12.5, minWidth: 58 }}>{row.a}</span>
                <span style={{ color: C.text, fontSize: 12.5, fontWeight: 600 }}>{row.name}</span>
                <span style={{ marginLeft: "auto", fontSize: 10.5, color: row.kind === "ram" ? C.muted : C.accent }}>{row.kind === "ram" ? `RAM = ${mem[row.a]}` : "device"}</span>
              </button>
            );
          })}
        </div>
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            {["Load", "Store"].map((o) => <button key={o} onClick={() => { setOp(o); setResult(null); }} style={btn(op === o, C.purple)}>{o}</button>)}
          </div>
          <div style={{ ...box, padding: 10, ...mono, fontSize: 13, color: C.text, marginBottom: 8 }}>
            {op === "Load" ? `Load  R2, ${r.name}` : `Store R2, ${r.name}`}
          </div>
          <button onClick={run} style={{ ...btn(true, C.accentGlow), width: "100%" }}>Run ▶</button>
          <div style={{ ...box, padding: 10, marginTop: 8, background: C.bg }}>
            <div style={{ fontSize: 10.5, color: C.muted }}>🖥️ Screen</div>
            <div style={{ ...mono, fontSize: 16, color: C.green, minHeight: 22 }}>{screen || " "}</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted }}>{r.d}</div>
      {result && <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: C.green + "14", border: `1px solid ${C.green}44`, ...mono, fontSize: 12.5, color: C.green }}>{result}</div>}
      <Key>To a program, a device is just a <b>small cluster of named addresses</b>. The device registers are
      4 bytes apart because each is one 32-bit word (Unit 1.4). Names like <code>KBD_DATA</code> are just
      labels for those addresses, so the code reads like English.</Key>
    </div>
  );
}

// ── Section 3: The interface — data / status / control registers ──
function InterfaceWidget() {
  const [data, setData] = useState(0);
  const [kin, setKin] = useState(0);
  const [kie, setKie] = useState(0);
  const [log, setLog] = useState("Press a key on the mini keyboard.");
  const press = (ch) => {
    setData(ch.charCodeAt(0)); setKin(1);
    setLog(`You pressed '${ch}'. The interface puts its ASCII code ${ch.charCodeAt(0)} in KBD_DATA and sets KIN = 1.`);
  };
  const cpuRead = () => {
    if (!kin) { setLog("KIN = 0: there is no new key. The CPU would read an old value."); return; }
    setKin(0); setLog(`CPU runs Load R5, KBD_DATA and gets ${data} = '${String.fromCharCode(data)}'. Reading the data clears KIN back to 0.`);
  };
  const regBox = (name, val, col, desc, who) => (
    <div style={{ ...box, padding: 10, borderColor: col + "66" }}>
      <div style={{ ...mono, fontSize: 12, color: col, fontWeight: 700 }}>{name}</div>
      <div style={{ ...mono, fontSize: 18, color: C.text, margin: "4px 0" }}>{val}</div>
      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{desc}</div>
      <div style={{ fontSize: 10.5, color: col, marginTop: 4 }}>{who}</div>
    </div>
  );
  return (
    <div>
      <NewWords keys={["KIN", "DOUT", "KIE"]} />
      <Frame>A device never talks to the bus directly. It sits behind an <b>interface</b>, like a canteen
      counter: a <b>tray</b> where the food is placed (DATA), a <b>"token ready" light</b> (STATUS), and an
      <b> order slip</b> you fill in (CONTROL). Play both sides: press keys as the student, then read as the CPU.</Frame>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {["A", "B", "7", "?"].map((ch) => <button key={ch} onClick={() => press(ch)} style={{ ...btn(false, C.border), ...mono, fontSize: 15, minWidth: 44 }}>⌨️ {ch}</button>)}
        <button onClick={cpuRead} style={{ ...btn(true, C.accentGlow), marginLeft: "auto" }}>CPU: Load R5, KBD_DATA</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {regBox("KBD_DATA", data ? `${data} ('${String.fromCharCode(data)}')` : "—", C.accent, "The tray: ASCII code of the key.", "device writes · CPU reads")}
        {regBox("KBD_STATUS", `KIN = ${kin}`, kin ? C.green : C.purple, kin ? "Light ON: a key is waiting." : "Light OFF: nothing new.", "device writes · CPU reads")}
        <div style={{ ...box, padding: 10, borderColor: C.orange + "66" }}>
          <div style={{ ...mono, fontSize: 12, color: C.orange, fontWeight: 700 }}>KBD_CONTROL</div>
          <button onClick={() => setKie((v) => 1 - v)} style={{ ...btn(kie === 1, C.orange), ...mono, margin: "6px 0", padding: "4px 10px" }}>KIE = {kie}</button>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{kie ? "Keyboard may interrupt the CPU (Unit 5.2)." : "No interrupts; the CPU must poll."}</div>
          <div style={{ fontSize: 10.5, color: C.orange, marginTop: 4 }}>CPU writes · device obeys</div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, color: C.text, minHeight: 36, lineHeight: 1.6 }}>{log}</div>
      <Key color={C.teal}><b>Data · Status · Control</b>: three registers are all an interface needs. The display
      has the same three: <code>DISP_DATA</code>, <code>DISP_STATUS</code> (with <Term k="DOUT" />) and a
      control register. Everything in this module is built on them.</Key>
    </div>
  );
}

// ── Section 4: Polling trace — the busy-wait loop, line by line ──
function PollWidget() {
  const code = [
    { c: "READWAIT: LoadByte R4, KBD_STATUS", n: "Copy the status register into R4." },
    { c: "          And      R4, R4, #2", n: "Mask: keep only bit 1 (KIN), clear the rest. #2 = 0000 0010. Same trick as Unit 2.2." },
    { c: "          Branch_if_[R4]=0  READWAIT", n: "If KIN was 0, jump back and ask again." },
    { c: "          LoadByte R5, KBD_DATA", n: "KIN was 1: read the character into R5." },
  ];
  const [step, setStep] = useState(0);
  const [kin, setKin] = useState(0);
  const [loops, setLoops] = useState(0);
  const seq = kin === 0 ? [0, 1, 2] : [0, 1, 2, 3];
  const line = seq[step % seq.length];
  const atEnd = kin === 1 && step >= 3;
  const advance = () => {
    if (atEnd) return;
    if (kin === 0 && line === 2) setLoops((x) => x + 1);
    setStep((s) => s + 1);
  };
  return (
    <div>
      <NewWords keys={["POLL", "BUSY"]} />
      <Frame>Without any help from the device, the CPU has to keep reading the KIN flag. Press <b>Step</b>
      and watch it go round lines 0–2. Then press the key and step again to see it escape.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12 }}>
        <div style={{ ...box, padding: 12 }}>
          {code.map((l, i) => (
            <div key={i}>
              <pre style={{ margin: 0, ...mono, fontSize: 12, padding: "4px 8px", borderRadius: 5, color: line === i ? "#fff" : C.muted, background: line === i ? C.accentGlow : "transparent" }}>{line === i ? "▶ " : "  "}{i}  {l.c}</pre>
              {line === i && <div style={{ fontSize: 11.5, color: C.teal, padding: "2px 8px 6px 30px" }}>{l.n}</div>}
            </div>
          ))}
        </div>
        <div>
          <div style={{ ...box, padding: 10, marginBottom: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted }}>KIN flag</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: kin ? C.green : C.red }}>{kin}</div>
          </div>
          <div style={{ ...box, padding: 10, marginBottom: 8, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.muted }}>Times round the loop</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.orange }}>{loops}</div>
          </div>
          <div style={{ ...box, padding: 10, textAlign: "center", background: C.bg }}>
            <div style={{ fontSize: 11, color: C.muted }}>R5 (character read)</div>
            <div style={{ fontSize: 20, fontWeight: 800, ...mono, color: atEnd ? C.teal : C.muted }}>{atEnd ? "65 'A'" : "—"}</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, color: atEnd ? C.green : kin ? C.text : C.orange, minHeight: 20 }}>
        {atEnd ? `✓ KIN was 1, so the branch fell through and 'A' was read. The CPU went round the loop ${loops} time${loops === 1 ? "" : "s"} for nothing.`
          : kin ? "A key is waiting now. Keep stepping." : "KIN is still 0. The CPU is doing no useful work at all."}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button onClick={advance} style={btn(true, C.accentGlow)}>Step ▶</button>
        <button onClick={() => { setKin(1); setStep(0); }} disabled={kin === 1} style={btn(kin === 0, C.green)}>⌨️ Press 'A' (KIN = 1)</button>
        <button onClick={() => { setKin(0); setStep(0); setLoops(0); }} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.red}>This is <b>busy-waiting</b>. Even a fast typist presses about 10 keys a second, which is an
      eternity for a CPU: it can go round this loop <b>millions</b> of times between two keys. Unit 5.2 fixes this
      by letting the <i>device</i> call the CPU instead.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "With memory-mapped I/O, how does a program read the key from KBD_DATA (address 0x4000)?",
      options: ["With a special In instruction", "With an ordinary Load, the same one used for RAM", "By raising an interrupt", "It cannot; only the OS can see keys"],
      answer: 1, explain: "Memory-mapped I/O gives the device a normal address, so the ordinary Load reaches it. Only the address is special." },
    { q: "The student presses 'B'. What does KBD_DATA hold, and what happens to KIN?",
      options: ["The letter B as a picture; KIN = 0", "66 (the ASCII code of 'B'); KIN = 1", "0x4000; KIN unchanged", "Nothing until the CPU asks"],
      answer: 1, explain: "The interface stores the ASCII code (66 for 'B') in the data register and sets KIN = 1 to say a key is waiting." },
    { q: "In the polling loop, why does the program do 'And R4, R4, #2'?",
      options: ["To add 2 to the key code", "To keep only bit 1 (the KIN flag) and clear every other bit", "To clear the keyboard", "To jump back to READWAIT"],
      answer: 1, explain: "#2 is 0000 0010. ANDing with it masks out every bit except bit 1, KIN. This is the masking trick from Unit 2.2." },
    { q: "Which register does the CPU WRITE to switch on the keyboard's interrupts?",
      options: ["KBD_DATA", "KBD_STATUS", "KBD_CONTROL (the KIE bit)", "The program counter"],
      answer: 2, explain: "Control registers are written by the CPU to steer the device. Setting KIE = 1 lets the keyboard interrupt, which is Unit 5.2." },
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
          {score === 4 ? "Perfect. A device is just a few addresses to you now." : score >= 2 ? "Good. Play with 'The Interface' again to lock in data vs status vs control." : "Go back to 'Try It' and run a few Loads and Stores. Tap any teal word to see what it stands for."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.1 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can reach any device through memory-mapped data, status and control registers, and you have
            felt why polling wastes the CPU.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.2 — Interrupts.</strong>{" "}
            Instead of the CPU walking to the door every few nanoseconds, we fit a doorbell.
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

export default function Unit5_1({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "map", label: "Try It" },
    { id: "iface", label: "The Interface" },
    { id: "poll", label: "Polling" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const quizIdx = sections.length - 1;
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The CPU only knows lockers</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Try it: Load and Store on a live address map</h3><MapWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Inside the interface: data, status, control</h3><InterfaceWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The polling loop, line by line</h3><PollWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.1.</p>
      <Quiz onComplete={() => { markComplete(quizIdx); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⌨️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.1</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Accessing I/O Devices</div>
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
