// Unit5_2.jsx — Module 5 › Unit 5.2 — "Interrupts"
// Foothold formula: dark palette, free-nav tabs, one interactive widget per
// section, 🔑 callouts, 4-question quiz.
// Arc: Unit 5.1's polling loop wastes millions of checks per keystroke
// (doorbell analogy) -> trace one keystroke interrupting a marks-totalling
// program (bookmark analogy; PC, PS, ISR, stack) -> the IE bit and the
// infinite re-interrupt ("Do Not Disturb" sign) -> which device rang?
// (polling vs vectored; speed-dial table) -> two rang at once (daisy chain,
// priority, nesting) -> quiz.
// Every abbreviation is spelled out in a "New words" box before it is used.
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
  IRQ: { full: "Interrupt ReQuest", plain: "The doorbell wire. The device sets it to 1 to say “I need you”. Some textbooks label this line INTR." },
  ISR: { full: "Interrupt-Service Routine", plain: "A small program that answers the doorbell, e.g. read the key that was pressed. It sits at its own address in memory." },
  PC: { full: "Program Counter", plain: "From Unit 1.2: the register holding the address of the next instruction. Our bookmark." },
  PS: { full: "Processor Status register", plain: "A status register of flag bits, just like the one you masked in Unit 2.2. One of its bits is IE." },
  IE: { full: "Interrupt-Enable bit", plain: "One bit inside PS. IE = 1: the CPU answers the doorbell. IE = 0: it ignores it for now (the request waits; it is not lost)." },
  STACK: { full: "Stack", plain: "An area of memory used as a pile: the last thing put on is the first thing taken off. Saved PC and PS go here." },
  RFI: { full: "Return-from-interrupt", plain: "The last instruction of every ISR. It takes the saved PC and PS back off the stack so the main program continues." },
  INTA: { full: "INTerrupt Acknowledge", plain: "The CPU’s reply on a separate wire: “I heard the doorbell. Who are you?”" },
  VEC: { full: "Interrupt vector", plain: "A small number the device sends to name itself: 0, 1, 2, …" },
  TABLE: { full: "Interrupt-vector table", plain: "A list in memory, like speed-dial: entry n holds the start address of device n’s ISR." },
};

// Tap-to-expand chip for re-looking-up a word anywhere in the lesson
function Term({ k, label }) {
  const [open, setOpen] = useState(false);
  const g = G[k];
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((o) => !o)} title={g.full} style={{ ...mono, fontSize: 12, padding: "0 6px", margin: "0 1px", borderRadius: 5, border: `1px dashed ${C.teal}88`, background: C.teal + "14", color: C.teal, cursor: "pointer" }}>{label || k}</button>
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
          <span style={{ ...mono, color: C.teal, fontWeight: 700 }}>{k === "VEC" ? "vector" : k === "TABLE" ? "vector table" : k === "STACK" ? "stack" : k}</span>
          {" = "}<b style={{ color: C.text }}>{G[k].full}</b>. {G[k].plain}
        </div>
      ))}
    </div>
  );
}

// ── Section 1: Need — the doorbell vs opening the door every few seconds ──
function NeedWidget() {
  const [scene, setScene] = useState("door");
  const [keysPerSec, setKeysPerSec] = useState(5);
  const gapMs = 1000 / keysPerSec;
  const checks = Math.round((gapMs * 1e6) / 10); // one status check every 10 ns
  return (
    <div>
      <NewWords keys={["IRQ"]} />
      <Frame>
        In Unit 5.1 the CPU waited for a key by reading <code>KBD_STATUS</code> again and again until the
        KIN flag became 1. Picture yourself waiting for a courier. You can keep walking to the door to look,
        or you can fit a <b>doorbell</b> and get on with your homework.
      </Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setScene("door")} style={btn(scene === "door", C.orange)}>🚪 Keep checking the door</button>
        <button onClick={() => setScene("bell")} style={btn(scene === "bell", C.green)}>🔔 Fit a doorbell</button>
      </div>
      <div style={{ ...box, borderColor: (scene === "door" ? C.orange : C.green) + "55", fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>
        {scene === "door"
          ? <>You stop your homework every minute to open the door. The courier comes once, at 4:37 pm. Every other trip was wasted, and your homework kept getting interrupted <i>by you</i>. <b style={{ color: C.orange }}>This is polling.</b></>
          : <>You do homework without stopping. At 4:37 pm the bell rings, you take the parcel, and you go back to the exact line you were on. <b style={{ color: C.green }}>This is an interrupt.</b> The device rings; the CPU answers only when there is something to do.</>}
      </div>

      <div style={{ ...box }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Now with real-sized numbers. A student types <b style={{ color: C.accent }}>{keysPerSec} keys per second</b>.</div>
        <input type="range" min={1} max={10} value={keysPerSec} onChange={(e) => setKeysPerSec(Number(e.target.value))} style={{ width: "100%", accentColor: C.accent }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
          <div style={{ ...box, background: C.bg, borderColor: C.orange + "55" }}>
            <div style={{ color: C.orange, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>🚪 POLLING</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
              Gap between two keys: <b style={{ color: C.text }}>{gapMs.toFixed(0)} ms</b><br />
              One status check takes about 10 ns, so in that gap the CPU checks<br />
              <span style={{ fontSize: 20, fontWeight: 800, color: C.orange }}>{checks.toLocaleString("en-IN")}</span> times<br />
              and <b style={{ color: C.red }}>{(checks - 1).toLocaleString("en-IN")}</b> of those checks find nothing.
            </div>
          </div>
          <div style={{ ...box, background: C.bg, borderColor: C.green + "55" }}>
            <div style={{ color: C.green, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>🔔 INTERRUPT</div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
              Checks made: <span style={{ fontSize: 20, fontWeight: 800, color: C.green }}>0</span><br />
              The CPU runs other programs (totalling marks, playing music). When a key arrives, the keyboard
              sets its <Term k="IRQ" /> wire to 1 and the CPU spends a few dozen instructions handling it.
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>10 ns per check is a round, illustrative figure. The point is the scale: tens of millions of wasted checks per keystroke.</div>
      </div>
      <Key color={C.green}>The <b>IRQ (Interrupt ReQuest)</b> line is the doorbell wire from the device to the CPU. The
      device pulls it to 1 when it is ready, so the CPU never wastes time asking “ready yet?”.</Key>
    </div>
  );
}

// ── Section 2: Trace — one keystroke interrupts a real program ──
const MAIN = [
  { a: 1000, code: "Load  R3, (R4)", note: "R3 ← next student's mark" },
  { a: 1004, code: "Add   R2, R2, R3", note: "total ← total + mark" },
  { a: 1008, code: "Add   R4, R4, #4", note: "move to the next mark" },
  { a: 1012, code: "Branch>0 1000", note: "loop until done" },
];
const ISR_CODE = [
  { a: 2000, code: "LoadByte  R5, KBD_DATA", note: "read the key; this also clears KIN" },
  { a: 2004, code: "StoreByte R5, (R6)", note: "put it in the typed-text buffer" },
  { a: 2008, code: "Return-from-interrupt", note: "take PC and PS back off the stack" },
];
function TraceWidget() {
  const steps = [
    { where: "main", line: 0, pc: 1004, ie: 1, irq: 0, stack: [], note: "The main program is totalling marks. PC = 1004: the bookmark says the next instruction is at 1004." },
    { where: "main", line: 1, pc: 1008, ie: 1, irq: 1, stack: [], note: "⚡ While Add at 1004 is running, the student presses 'A'. The keyboard sets IRQ = 1. The CPU does NOT stop halfway; it finishes this Add first." },
    { where: "jump", line: -1, pc: 2000, ie: 0, irq: 1, stack: ["PC = 1008", "PS (IE was 1)"], note: "The CPU accepts the interrupt. It pushes the bookmark (PC = 1008) and the status register PS onto the stack, sets IE = 0, then loads PC = 2000, the ISR's address." },
    { where: "isr", line: 0, pc: 2004, ie: 0, irq: 0, stack: ["PC = 1008", "PS (IE was 1)"], note: "The ISR reads the key from KBD_DATA. Reading the data clears the keyboard's KIN flag, so the keyboard drops IRQ back to 0." },
    { where: "isr", line: 1, pc: 2008, ie: 0, irq: 0, stack: ["PC = 1008", "PS (IE was 1)"], note: "The ISR stores 'A' into the text buffer. The main program has no idea any of this is happening." },
    { where: "isr", line: 2, pc: 1008, ie: 1, irq: 0, stack: [], note: "Return-from-interrupt pops PS (so IE = 1 again) and PC = 1008 off the stack." },
    { where: "main", line: 2, pc: 1012, ie: 1, irq: 0, stack: [], note: "The main program carries on at 1008, exactly where it left off. Only a few nanoseconds were lost, and the total is still correct." },
  ];
  const [s, setS] = useState(0);
  const st = steps[s];
  const codeRow = (r, i, active, col) => (
    <div key={r.a} style={{ display: "flex", gap: 8, padding: "3px 6px", borderRadius: 5, background: active ? col + "22" : "transparent", border: `1px solid ${active ? col : "transparent"}`, fontSize: 12 }}>
      <span style={{ ...mono, color: C.muted, width: 36 }}>{r.a}</span>
      <span style={{ ...mono, color: active ? C.text : C.muted, flex: 1 }}>{r.code}</span>
    </div>
  );
  return (
    <div>
      <NewWords keys={["ISR", "PS", "STACK"]} />
      <Frame>Think of reading a textbook when your phone rings. You slip in a <b>bookmark</b> (the
      <Term k="PC" />), note anything you need to remember (the <Term k="PS" />), take the call (the
      <Term k="ISR" />), then go back to the bookmark. Step through one keystroke and watch every register.</Frame>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ ...box, padding: 10, borderColor: st.where === "main" ? C.green : C.border }}>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 6 }}>MAIN PROGRAM: total the marks</div>
          {MAIN.map((r, i) => codeRow(r, i, st.where === "main" && st.line === i, C.green))}
        </div>
        <div style={{ ...box, padding: 10, borderColor: st.where === "isr" ? C.orange : C.border }}>
          <div style={{ fontSize: 11, color: C.orange, fontWeight: 700, marginBottom: 6 }}>KEYBOARD ISR (at address 2000)</div>
          {ISR_CODE.map((r, i) => codeRow(r, i, st.where === "isr" && st.line === i, C.orange))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 10 }}>
        {[
          ["PC (next)", st.pc, C.accent],
          ["IRQ wire", st.irq, st.irq ? C.red : C.muted],
          ["IE bit in PS", st.ie, st.ie ? C.green : C.yellow],
        ].map(([lab, v, col]) => (
          <div key={lab} style={{ ...box, padding: 8, textAlign: "center" }}>
            <div style={{ fontSize: 10.5, color: C.muted }}>{lab}</div>
            <div style={{ ...mono, fontSize: 20, fontWeight: 800, color: col }}>{v}</div>
          </div>
        ))}
        <div style={{ ...box, padding: 8, borderColor: C.teal + "55" }}>
          <div style={{ fontSize: 10.5, color: C.teal, textAlign: "center" }}>Stack (saved)</div>
          {st.stack.length === 0 ? <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 4 }}>empty</div>
            : st.stack.map((x) => <div key={x} style={{ ...mono, fontSize: 10.5, color: C.teal, background: C.teal + "18", borderRadius: 4, padding: "2px 4px", marginTop: 3 }}>{x}</div>)}
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, color: C.text, minHeight: 40, lineHeight: 1.6 }}>{st.note}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setS((x) => Math.max(0, x - 1))} style={btn(false, C.border)}>◀ Back</button>
        <button onClick={() => setS((x) => Math.min(steps.length - 1, x + 1))} style={btn(true, C.accentGlow)}>Step ▶ ({s + 1}/{steps.length})</button>
        <button onClick={() => setS(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key>The hardware saves only the <b>PC</b> (where to come back to) and the <b>PS</b> (the status
      flags). If the ISR uses other registers, like R5 and R6 here, the ISR must save and restore them
      itself. The time from IRQ = 1 to the first ISR instruction is called the <b>interrupt latency</b>.</Key>
    </div>
  );
}

// ── Section 3: IE — the "Do Not Disturb" sign, and what breaks without it ──
function EnableWidget() {
  const [safe, setSafe] = useState(true);
  const [t, setT] = useState(0);
  const safeSteps = [
    { irq: 1, ie: 1, depth: 0, msg: "Key pressed: IRQ = 1, IE = 1. The CPU will accept." },
    { irq: 1, ie: 0, depth: 1, msg: "Accepted: PC and PS saved and IE cleared to 0. The sign now says DO NOT DISTURB." },
    { irq: 1, ie: 0, depth: 1, msg: "The ISR starts. IRQ is STILL 1 because the key hasn't been read yet, but IE = 0, so the CPU ignores it." },
    { irq: 0, ie: 0, depth: 1, msg: "The ISR reads KBD_DATA, so the keyboard drops IRQ to 0." },
    { irq: 0, ie: 1, depth: 0, msg: "✓ Return-from-interrupt restores PS, so IE = 1 again. Handled exactly once." },
  ];
  const brokenDepth = Math.min(t + 1, 8);
  const overflow = !safe && t >= 7;
  const cur = safe ? safeSteps[Math.min(t, safeSteps.length - 1)] : { irq: 1, ie: 1, depth: brokenDepth };
  const maxT = safe ? safeSteps.length - 1 : 7;
  const flip = (v) => { setSafe(v); setT(0); };
  return (
    <div>
      <NewWords keys={["IE", "RFI"]} />
      <Frame>The keyboard keeps <Term k="IRQ" /> at 1 until somebody reads the key. But the first thing
      the ISR does is <i>start</i>, not read. So during those first instructions the doorbell is still ringing.
      The <Term k="IE" /> bit works like a <b>Do Not Disturb</b> sign. Compare what happens with and without it.</Frame>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => flip(true)} style={btn(safe, C.green)}>✅ IE cleared on entry (real CPUs)</button>
        <button onClick={() => flip(false)} style={btn(!safe, C.red)}>❌ What if IE stayed 1?</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 10 }}>
        <div style={{ ...box, textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 10.5, color: C.muted }}>IRQ wire</div>
          <div style={{ ...mono, fontSize: 22, fontWeight: 800, color: cur.irq ? C.red : C.muted }}>{cur.irq}</div>
        </div>
        <div style={{ ...box, textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 10.5, color: C.muted }}>IE (in PS)</div>
          <div style={{ ...mono, fontSize: 22, fontWeight: 800, color: cur.ie ? C.green : C.yellow }}>{cur.ie}</div>
          <div style={{ fontSize: 10.5, color: cur.ie ? C.muted : C.yellow }}>{cur.ie ? "doorbell heard" : "🚫 do not disturb"}</div>
        </div>
        <div style={{ ...box, padding: 10, borderColor: overflow ? C.red : C.teal + "55" }}>
          <div style={{ fontSize: 10.5, color: C.teal }}>Stack: saved PC + PS pairs ({cur.depth})</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 6 }}>
            {Array.from({ length: cur.depth }).map((_, i) => <div key={i} style={{ width: 22, height: 14, borderRadius: 3, background: overflow ? C.red : C.teal }} />)}
          </div>
          {overflow && <div style={{ fontSize: 11, color: C.red, marginTop: 6, fontWeight: 700 }}>STACK OVERFLOW: memory full, system crashes</div>}
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, color: safe ? C.text : C.red, minHeight: 38, lineHeight: 1.6 }}>
        {safe ? cur.msg
          : t === 0 ? "Accepted: PC and PS saved, but IE stays 1. The ISR starts…"
          : overflow ? "⚠️ The ISR never reaches its first real instruction. Each new 'accept' saves another PC + PS until memory runs out."
          : `IRQ is still 1 and IE is 1, so the CPU accepts the SAME keystroke again (${t + 1} times so far). The ISR never gets to read the key.`}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setT((x) => Math.min(maxT, x + 1))} style={btn(true, C.accentGlow)}>Step ▶</button>
        <button onClick={() => setT(0)} style={btn(false, C.border)}>↺ Reset</button>
      </div>
      <Key color={C.teal}>When the CPU accepts an interrupt it <b>automatically sets IE = 0</b>, and
      Return-from-interrupt brings IE = 1 back by restoring PS. A request that arrives while IE = 0 is
      <b> not lost</b>. It waits on the IRQ wire until IE becomes 1. The device has its own enable bit too, in
      its control register, so an interrupt needs <b>both</b> switches on.</Key>
    </div>
  );
}

// ── Section 4: Which device rang? Polling vs vectored ──
const DEVICES = [
  { name: "Timer", icon: "⏱️", isr: 2000 },
  { name: "Disk", icon: "💽", isr: 2400 },
  { name: "Keyboard", icon: "⌨️", isr: 2800 },
  { name: "Printer", icon: "🖨️", isr: 3200 },
];
function WhoRangWidget() {
  const [mode, setMode] = useState("polling");
  const [req, setReq] = useState(3);
  return (
    <div>
      <NewWords keys={["VEC", "TABLE", "INTA"]} />
      <Frame>Four devices share <b>one</b> IRQ wire into the CPU, like four flats sharing one doorbell. The
      bell rings: <b>who</b> rang, and where is <b>their</b> ISR? Pick the device that rings, then compare the
      two ways of finding out.</Frame>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {DEVICES.map((d, i) => <button key={d.name} onClick={() => setReq(i)} style={btn(req === i, C.purple)}>{d.icon} {d.name} rings</button>)}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode("polling")} style={btn(mode === "polling", C.orange)}>🚪 Polling: knock on every door</button>
        <button onClick={() => setMode("vectored")} style={btn(mode === "vectored", C.green)}>📞 Vectored: caller says who they are</button>
      </div>
      <div style={{ ...box }}>
        {mode === "polling" ? (
          <div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>One shared ISR reads each device's status register in turn:</div>
            {DEVICES.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 6, marginBottom: 3, border: `1px solid ${i === req ? C.green : C.border}`, opacity: i > req ? 0.4 : 1 }}>
                <span style={{ ...mono, fontSize: 11, color: C.muted }}>check {i + 1}:</span>
                <span style={{ color: C.text, fontSize: 12.5 }}>{d.icon} {d.name} asking?</span>
                <span style={{ marginLeft: "auto", fontSize: 11.5, color: i < req ? C.red : i === req ? C.green : C.muted }}>
                  {i < req ? "no, wasted check" : i === req ? `yes ✓ jump to ${d.isr}` : "not reached"}
                </span>
              </div>
            ))}
            <div style={{ color: C.orange, fontSize: 12.5, marginTop: 8 }}>{req + 1} check{req ? "s" : ""} before the right ISR starts. The last device in the list always waits longest.</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.9 }}>
              <div>1. CPU sends <Term k="INTA" /> on its acknowledge wire: “who's there?”</div>
              <div>2. {DEVICES[req].icon} {DEVICES[req].name} puts its vector number <b style={{ color: C.purple, ...mono }}>{req}</b> on the data bus.</div>
              <div>3. CPU looks up row {req} of the vector table and loads that address into PC:</div>
            </div>
            <div style={{ ...box, background: C.bg, padding: 8, marginTop: 6 }}>
              {DEVICES.map((d, i) => (
                <div key={d.name} style={{ display: "flex", gap: 10, padding: "3px 8px", borderRadius: 5, ...mono, fontSize: 12, background: i === req ? C.green + "22" : "transparent", color: i === req ? C.green : C.muted }}>
                  <span style={{ width: 70 }}>row {i}</span><span style={{ width: 120 }}>{d.icon} {d.name}</span><span>ISR at {d.isr}{i === req ? "  → PC" : ""}</span>
                </div>
              ))}
            </div>
            <div style={{ color: C.green, fontSize: 12.5, marginTop: 8 }}>One lookup, whichever device rang. No knocking on doors.</div>
          </div>
        )}
      </div>
      <Key color={C.green}>An <b>interrupt vector</b> is the device's ID number. The <b>vector table</b> is a
      speed-dial list in memory: row n holds the start address of device n's ISR. Polling costs more checks the
      further down the list the device is. Vectoring costs one table lookup for every device.</Key>
    </div>
  );
}

// ── Section 5: Two ring at once — daisy chain, priority, nesting ──
function PriorityWidget() {
  const [asking, setAsking] = useState([false, true, true, false]);
  const [running, setRunning] = useState(-1); // index of ISR now running; -1 = main program
  const winner = asking.findIndex((a) => a);
  const accepted = winner !== -1 && (running === -1 || winner < running);
  const toggle = (i) => setAsking((a) => a.map((v, j) => (j === i ? !v : v)));
  return (
    <div>
      <Frame>Now two devices ring at the same moment. A common fix is the <b>daisy chain</b>: the CPU's
      <Term k="INTA" /> reply is passed from device to device like a note passed along a row of desks. The
      first device that is asking keeps the note, so the one nearest the CPU wins. Tick who is asking.</Frame>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <div style={{ ...box, padding: "8px 12px", borderColor: C.accent }}><b style={{ color: C.accent }}>CPU</b></div>
        {DEVICES.map((d, i) => {
          const reached = winner === -1 || i <= winner;
          return (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: reached ? C.yellow : C.border, fontSize: 12, ...mono }}>INTA→</span>
              <button onClick={() => toggle(i)} style={{ ...box, padding: "6px 10px", cursor: "pointer", borderColor: i === winner ? C.green : asking[i] ? C.purple : C.border, background: i === winner ? C.green + "22" : C.card, color: C.text, fontSize: 12 }}>
                {d.icon} {d.name}<br />
                <span style={{ fontSize: 10.5, color: asking[i] ? C.purple : C.muted }}>{asking[i] ? "☑ asking" : "☐ quiet"}</span>
                <span style={{ display: "block", fontSize: 10, color: C.muted }}>priority {i + 1}</span>
              </button>
            </div>
          );
        })}
      </div>
      <div style={{ ...box, marginBottom: 12, fontSize: 12.5, color: C.muted }}>
        {winner === -1 ? "Nobody is asking. INTA would pass along the whole chain unused."
          : <>INTA stops at <b style={{ color: C.green }}>{DEVICES[winner].icon} {DEVICES[winner].name}</b>: it is the first device that is asking.
            {asking.some((a, j) => a && j > winner) && <> Devices further down keep their IRQ = 1 and are served next.</>}</>}
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>Nesting: what is the CPU running when this request arrives?</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => setRunning(-1)} style={btn(running === -1, C.accentGlow)}>Main program</button>
        {DEVICES.map((d, i) => <button key={d.name} onClick={() => setRunning(i)} style={btn(running === i, C.orange)}>{d.name}'s ISR</button>)}
      </div>
      {winner !== -1 && (
        <div style={{ ...box, borderColor: accepted ? C.green + "66" : C.yellow + "66", fontSize: 12.5, color: accepted ? C.green : C.yellow }}>
          {running === -1 ? `✓ Accepted. The main program is paused and ${DEVICES[winner].name}'s ISR runs.`
            : accepted ? `✓ Accepted inside ${DEVICES[running].name}'s ISR. ${DEVICES[winner].name} is more urgent (priority ${winner + 1} beats ${running + 1}), so its ISR runs and then ${DEVICES[running].name}'s ISR continues. This is a nested interrupt.`
            : `⏸ Not accepted yet. ${DEVICES[winner].name} (priority ${winner + 1}) is not more urgent than the ${DEVICES[running].name} ISR now running (priority ${running + 1}), so it waits until that ISR returns.`}
        </div>
      )}
      <Key color={C.purple}>The <b>daisy chain</b> settles ties by position: nearest the CPU = highest
      priority. <b>Nesting</b> lets an urgent device (a disk that will lose data) interrupt the ISR of a less
      urgent one (a printer). The CPU only accepts a request whose priority is <b>higher</b> than the ISR it is
      running now.</Key>
    </div>
  );
}

function Quiz({ onComplete }) {
  const questions = [
    { q: "A student types 5 keys per second. With polling, roughly how many of the CPU's status checks between two keys find a key waiting?",
      options: ["About half of them", "Exactly one; the rest are wasted", "None, polling never finds keys", "All of them"],
      answer: 1, explain: "Only the last check in each 200 ms gap finds KIN = 1. Every earlier check, millions of them, is wasted. An IRQ removes them all." },
    { q: "The keystroke arrives while 'Add R2, R2, R3' at address 1004 is running. What does the CPU push onto the stack?",
      options: ["PC = 1004 and R2", "PC = 1008 and PS", "All registers R0–R31", "Only the key code"],
      answer: 1, explain: "The CPU finishes the Add, so the next instruction is at 1008. It saves that PC and the PS (Processor Status register). Other registers are the ISR's job." },
    { q: "Why does the CPU set IE (Interrupt-Enable) to 0 when it accepts an interrupt?",
      options: ["To make the ISR run faster", "Because IRQ is still 1 until the ISR reads the device, so the same request would be accepted again and again", "To throw away other devices' requests", "To erase the vector table"],
      answer: 1, explain: "The device keeps IRQ at 1 until it is serviced. With IE = 1 the CPU would re-accept the same keystroke endlessly and overflow the stack. Requests that arrive while IE = 0 wait; they are not lost." },
    { q: "Disk (priority 2) and Printer (priority 4) ask at the same moment on a daisy chain, while the CPU is running the Keyboard ISR (priority 3). What happens?",
      options: ["Printer wins because it asked first", "Disk gets INTA and is accepted, nesting inside the Keyboard ISR", "Nothing is accepted until the Keyboard ISR returns", "Both ISRs run at once"],
      answer: 1, explain: "INTA reaches Disk first, so Disk wins the chain. Priority 2 is higher than the running Keyboard ISR (3), so it nests. Printer waits." },
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
          {score === 4 ? "Excellent. You can follow a keystroke from doorbell to return." : score >= 2 ? "Good. Step through 'Control' and 'Do Not Disturb' once more." : "Go back to 'Control' and step through the keystroke slowly. Tap any teal word to see what it stands for."}
        </div>
        <div style={{ padding: 20, borderRadius: 12, background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`, border: `1px solid ${C.accent}55` }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 5.2 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            You can trace an interrupt from IRQ to Return-from-interrupt, explain why IE is cleared, and route
            many devices to the right ISR.<br /><br />
            <strong style={{ color: C.accent }}>Next up: Unit 5.3 — Exceptions & Interrupts in the OS.</strong>{" "}
            What if the “doorbell” is not a device at all, but your own program dividing by zero?
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

export default function Unit5_2({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why?" },
    { id: "trace", label: "Control" },
    { id: "enable", label: "Do Not Disturb" },
    { id: "who", label: "Who Rang?" },
    { id: "priority", label: "Two at Once" },
    { id: "quiz", label: "Quiz" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);
  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };
  const quizIdx = sections.length - 1;
  const content = [
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Stop checking the door: fit a doorbell</h3><NeedWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>One keystroke, step by step: IRQ → ISR → return</h3><TraceWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>The IE bit: a “Do Not Disturb” sign</h3><EnableWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Which device rang?</h3><WhoRangWidget /></div>,
    <div><h3 style={{ color: C.text, marginBottom: 6 }}>Two devices ring at once</h3><PriorityWidget /></div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 5.2.</p>
      <Quiz onComplete={() => { markComplete(quizIdx); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🔌</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 5 › UNIT 5.2</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Interrupts</div>
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
