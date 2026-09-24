// Unit4_7.jsx — Module 4 › Unit 4.7 — "Segmentation: The Library of Memory"
// Foothold formula: GitHub-dark palette, free-nav tab strip, one interactive
// widget per section, 🔑 key-insight callouts, 4-question quiz.
// Arc: why pure paging (Unit4_6) is not enough (the need) -> the LIBRARY
// analogy (room = segment, shelf = page, book = word) and the 4|8|8 logical
// address -> step-through logical→physical translation (segment table ->
// page table -> block ‖ word, with the librarian's sticky notes as the TLB)
// -> segment descriptors guarding each room (length + protection) -> quiz.
// Numbers are Mano's §12-7 example (Figs 12-22 to 12-24): segment 6 has
// five pages at page-table addresses 35–39 → blocks 012, 000, 019, 053, A61,
// so logical 6 02 7E → physical 0197E. The capstone (Unit4_C) then reuses
// this exact world, so this unit is its direct prerequisite.
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

// Hex helpers: hx(0x7E, 2) -> "7E", hx(0x19, 3) -> "019"
const hx = (n, w = 2) => n.toString(16).toUpperCase().padStart(w, "0");
const bin = (n, w) => n.toString(2).padStart(w, "0");

// ── Shared "world" — Mano Fig 12-24 ──
const SEG_TABLE = { 6: 0x35, 15: 0xA3 };                 // segment -> page-table base
const PAGE_TABLE = { 0x35: 0x012, 0x36: 0x000, 0x37: 0x019, 0x38: 0x053, 0x39: 0xA61, 0xA3: 0x012 }; // page-table addr -> block
const ROOM_NAME = { 6: "Physics Room", 15: "Reference Room" };

// ══════════════════════════════════════════════════════════════════
//  Section 1 — Why Rooms? (the need)
// ══════════════════════════════════════════════════════════════════
function WhyRooms() {
  const [view, setView] = useState("paging");
  const [arr, setArr] = useState(2); // pages occupied by Array A

  const parts = [
    { name: "Main program", kind: "code", n: 3, col: C.accent, prot: "Read / Write" },
    { name: "sqrt() routine", kind: "shared code", n: 1, col: C.purple, prot: "Read-only, shared" },
    { name: "Array A", kind: "data", n: arr, col: C.teal, prot: "Read / Write" },
    { name: "Stack", kind: "data", n: 1, col: C.orange, prot: "Read / Write" },
  ];
  // Flatten into one long run of pages, the way pure paging sees it
  const flat = [];
  parts.forEach((p) => { for (let i = 0; i < p.n; i++) flat.push({ ...p, local: i }); });
  const stackPage = 3 + 1 + arr;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        In Unit 4.6 a program was just one long run of equal-size pages: P0, P1, P2 … But a real
        program is made of <em>meaningful parts</em> — main code, a library routine, an array, a
        stack — of <strong style={{ color: C.text }}>different sizes</strong>. Toggle the two views,
        then press <strong style={{ color: C.teal }}>Grow the array</strong> and watch what happens to the Stack.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[["paging", "Paging only (Unit 4.6)", C.orange], ["seg", "Segments + pages", C.green]].map(([id, lab, col]) => (
          <button key={id} onClick={() => setView(id)} style={{
            flex: 1, padding: "8px 6px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
            border: `1.5px solid ${view === id ? col : C.border}`,
            background: view === id ? col + "22" : C.card, color: view === id ? col : C.muted,
          }}>{lab}</button>
        ))}
      </div>

      <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16, minHeight: 150 }}>
        {view === "paging" ? (
          <>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>WHAT THE HARDWARE SEES — one numbered run of pages</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {flat.map((p, i) => (
                <div key={i} style={{ width: 52, height: 40, borderRadius: 6, background: C.surface, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>P{i}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>???</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
              ❌ Which pages hold code (make them read-only)? The hardware can't tell.<br />
              ❌ Share only <code>sqrt()</code> with another user? It's just "P3" — no name, no boundary.<br />
              ❌ The Stack currently starts at <strong style={{ color: C.orange }}>P{stackPage}</strong> — grow the array and it <em>moves</em>.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>EACH LOGICAL PART GETS ITS OWN SEGMENT — with its own page numbers from 0</div>
            {parts.map((p, s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 150, fontSize: 11.5, color: p.col, fontWeight: 700 }}>Segment {s} · {p.name}</div>
                <div style={{ display: "flex", gap: 3, flex: 1 }}>
                  {Array.from({ length: p.n }).map((_, i) => (
                    <div key={i} style={{ width: 34, height: 26, borderRadius: 5, background: p.col + "22", border: `1px solid ${p.col}66`, fontSize: 10, color: p.col, display: "flex", alignItems: "center", justifyContent: "center" }}>pg {i}</div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: C.muted, width: 105, textAlign: "right" }}>{p.prot}</div>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.7 }}>
              ✅ Code and data are separate, each with its own protection.<br />
              ✅ <code>sqrt()</code> is a whole named segment — easy to share one copy.<br />
              ✅ The Stack is <strong style={{ color: C.green }}>always Segment 3, page 0</strong>, however big the array grows.
            </div>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => setArr((a) => Math.min(5, a + 1))} disabled={arr >= 5} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: arr >= 5 ? C.border : C.teal + "33", color: arr >= 5 ? C.muted : C.teal, fontWeight: 700, fontSize: 12, cursor: arr >= 5 ? "default" : "pointer" }}>＋ Grow the array ({arr} pages)</button>
        <button onClick={() => setArr(2)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer" }}>↺ Reset</button>
      </div>

      <Key>
        A <strong style={{ color: C.text }}>segment</strong> is a set of logically related
        instructions or data given a name — a subroutine, an array, a table, a whole program.
        Segments are <em>variable-length</em>; pages are <em>fixed-length</em>. Real MMUs use
        both: <strong style={{ color: C.text }}>segmented-page mapping</strong> — a program is split
        into segments, and each segment is split into pages.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 2 — The Library (analogy + logical address format)
// ══════════════════════════════════════════════════════════════════
function Library() {
  const rooms = [
    { id: 2, name: "Maths Room", shelves: 3, col: C.teal },
    { id: 6, name: "Physics Room", shelves: 5, col: C.accent },
    { id: 15, name: "Reference Room", shelves: 1, col: C.purple },
  ];
  const [roomId, setRoomId] = useState(6);
  const [shelf, setShelf] = useState(2);
  const [book, setBook] = useState(0x7E);
  const room = rooms.find((r) => r.id === roomId);

  const pickRoom = (r) => { setRoomId(r.id); setShelf((s) => Math.min(s, r.shelves - 1)); };
  const logical = (roomId << 16) | (shelf << 8) | book;

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Think of memory as a <strong style={{ color: C.text }}>library</strong>. The library has
        <strong style={{ color: C.accent }}> rooms</strong> of different sizes, every room has
        <strong style={{ color: C.teal }}> shelves</strong> (all shelves are the same size — 256 books
        each), and on a shelf you pick one <strong style={{ color: C.yellow }}>book</strong>.
        Pick a room, a shelf, then slide to a book.
      </p>

      {/* Rooms — width shows they are different sizes */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {rooms.map((r) => (
          <button key={r.id} onClick={() => pickRoom(r)} style={{
            flex: r.shelves + 1, padding: "10px 6px", borderRadius: 8, cursor: "pointer", textAlign: "center",
            border: `1.5px solid ${roomId === r.id ? r.col : C.border}`,
            background: roomId === r.id ? r.col + "22" : C.card, color: roomId === r.id ? r.col : C.text,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>🚪 Room {hx(r.id, 1)}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{r.name} · {r.shelves} shelf{r.shelves > 1 ? "s" : ""}</div>
          </button>
        ))}
      </div>

      {/* Shelves inside the chosen room */}
      <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${room.col}55`, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>INSIDE ROOM {hx(roomId, 1)} — click a shelf</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {Array.from({ length: room.shelves }).map((_, i) => (
            <button key={i} onClick={() => setShelf(i)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", borderRadius: 6, cursor: "pointer",
              border: `1px solid ${shelf === i ? C.teal : C.border}`, background: shelf === i ? C.teal + "18" : C.surface,
            }}>
              <span style={{ fontSize: 11, color: shelf === i ? C.teal : C.muted, width: 62, textAlign: "left" }}>Shelf {hx(i)}</span>
              <span style={{ display: "flex", gap: 2, flex: 1 }}>
                {Array.from({ length: 16 }).map((_, b) => {
                  const on = shelf === i && Math.floor(book / 16) === b;
                  return <span key={b} style={{ flex: 1, height: 16, borderRadius: 2, background: on ? C.yellow : C.muted + "33" }} />;
                })}
              </span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={{ color: C.muted, fontSize: 12 }}>Book position on Shelf {hx(shelf)} = <strong style={{ color: C.yellow }}>{hx(book)}</strong> (hex, 00–FF)</label>
          <input type="range" min={0} max={255} value={book} onChange={(e) => setBook(Number(e.target.value))} style={{ width: "100%", accentColor: C.yellow }} />
        </div>
      </div>

      {/* Call number = logical address */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>CALL NUMBER  =  LOGICAL ADDRESS (20 bits)</div>
        <div style={{ display: "flex", gap: 6, fontFamily: "monospace", fontSize: 13, flexWrap: "wrap" }}>
          {[["Room / Segment", hx(roomId, 1), bin(roomId, 4), "4 bits", C.accent],
            ["Shelf / Page", hx(shelf), bin(shelf, 8), "8 bits", C.teal],
            ["Book / Word", hx(book), bin(book, 8), "8 bits", C.yellow]].map(([lab, h, b, w, col]) => (
            <div key={lab} style={{ flex: 1, minWidth: 140, border: `1px solid ${col}66`, background: col + "12", borderRadius: 8, padding: "8px 10px" }}>
              <div style={{ fontSize: 10, color: col, fontFamily: "system-ui" }}>{lab} · {w}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: col }}>{h}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: C.text }}>
          Logical address = <strong style={{ color: C.green, fontFamily: "monospace" }}>{hx(logical, 5)}</strong> (hex)
        </div>
      </div>

      {/* Mapping table */}
      <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse", fontSize: 12.5 }}>
        <tbody>
          {[["📚 The library", "Logical address space of the program"],
            ["🚪 Room (different sizes)", "Segment — variable length, up to 16 of them (4 bits)"],
            ["🗄️ Shelf (all identical)", "Page — fixed length, up to 256 per segment (8 bits)"],
            ["📕 Book position on the shelf", "Word (offset) — 256 words per page (8 bits)"],
            ["🏷️ Call number", "Logical address = segment | page | word"]].map(([a, b]) => (
            <tr key={a} style={{ borderBottom: `1px solid ${C.border}` }}>
              <td style={{ padding: "6px 8px", color: C.text }}>{a}</td>
              <td style={{ padding: "6px 8px", color: C.muted }}>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Key color={C.teal}>
        The call number tells you <em>where the book belongs logically</em> — not where it is
        physically kept. Smallest room = 1 shelf (256 words); biggest room = 256 shelves
        (256 × 256 = 64K words). Next: how the librarian finds where the shelf really is.
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 3 — Translate It: logical -> physical (step-through)
// ══════════════════════════════════════════════════════════════════
const REQUESTS = [
  { s: 6, p: 2, w: 0x7E },
  { s: 6, p: 0, w: 0x10 },
  { s: 6, p: 4, w: 0x05 },
  { s: 15, p: 0, w: 0x3C },
];

function buildSteps(req, hit) {
  const base = SEG_TABLE[req.s];
  const addr = base + req.p;
  const blk = PAGE_TABLE[addr];
  const call = `Room ${hx(req.s, 1)} · Shelf ${hx(req.p)} · Book ${hx(req.w)}`;
  const la = `${hx(req.s, 1)} ${hx(req.p)} ${hx(req.w)}`;
  const pa = `${hx(blk, 3)}${hx(req.w)}`;
  const first = { lib: `A reader hands in the call number ${call}.`, hw: `CPU issues logical address ${la} → segment ${hx(req.s, 1)} | page ${hx(req.p)} | word ${hx(req.w)}.`, hl: "none" };
  if (hit) return [
    first,
    { lib: `The librarian glances at her sticky notes: "${hx(req.s, 1)}/${hx(req.p)} → bay ${hx(blk, 3)}" — found!`, hw: `TLB (associative search on segment + page) — HIT → block ${hx(blk, 3)}.`, hl: "tlb" },
    { lib: `Straight to bay ${hx(blk, 3)}, book position ${hx(req.w)}. Both registers skipped.`, hw: `Physical address = block ‖ word = ${hx(blk, 3)} ‖ ${hx(req.w)} = ${pa}. Only ONE memory access.`, hl: "phys" },
  ];
  return [
    first,
    { lib: `She checks her sticky notes for "${hx(req.s, 1)}/${hx(req.p)}" — not there.`, hw: "TLB (associative search on segment + page) — MISS. Fall back to the tables.", hl: "tlb" },
    { lib: `Room Directory, row ${hx(req.s, 1)}: "this room's shelf list starts at line ${hx(base)} of the Shelf Register."`, hw: `Segment table[${hx(req.s, 1)}] = ${hx(base)} → base of this segment's page table. (memory access #1)`, hl: "seg" },
    { lib: `Count down ${hx(req.p)} lines from line ${hx(base)} → line ${hx(addr)}.`, hw: `Page-table base + page number = ${hx(base)} + ${hx(req.p)} = ${hx(addr)} (hex).`, hl: "sum" },
    { lib: `Shelf Register line ${hx(addr)}: "this shelf is standing in warehouse bay ${hx(blk, 3)}."`, hw: `Page table[${hx(addr)}] = block ${hx(blk, 3)}. (memory access #2)`, hl: "page" },
    { lib: `Walk to bay ${hx(blk, 3)} and take book ${hx(req.w)} — the position on the shelf never changes.`, hw: `Physical address = block ‖ word = ${hx(blk, 3)} ‖ ${hx(req.w)} = ${pa}. (memory access #3 — the real read)`, hl: "phys" },
    { lib: `She writes a sticky note "${hx(req.s, 1)}/${hx(req.p)} → bay ${hx(blk, 3)}" for the next reader.`, hw: `TLB updated with (${hx(req.s, 1)}, ${hx(req.p)}) → ${hx(blk, 3)}.`, hl: "tlbAdd" },
  ];
}

function TranslateIt() {
  const [reqIdx, setReqIdx] = useState(0);
  const [tlb, setTlb] = useState([]);           // the librarian's sticky notes
  const [hit, setHit] = useState(false);        // decided when a trace starts
  const [step, setStep] = useState(0);

  const req = REQUESTS[reqIdx];
  const steps = buildSteps(req, hit);
  const cur = steps[step];
  const base = SEG_TABLE[req.s];
  const blk = PAGE_TABLE[base + req.p];
  const inTlb = (r, list) => list.some((t) => t.s === r.s && t.p === r.p);

  const start = (i) => { setReqIdx(i); setHit(inTlb(REQUESTS[i], tlb)); setStep(0); };
  const next = () => {
    const ns = Math.min(steps.length - 1, step + 1);
    setStep(ns);
    if (!hit && ns === steps.length - 1 && !inTlb(req, tlb)) setTlb((t) => [...t, { s: req.s, p: req.p, b: blk }]);
  };
  const on = (tag) => cur.hl === tag;
  const reached = (tag) => steps.findIndex((x) => x.hl === tag) !== -1 && steps.findIndex((x) => x.hl === tag) <= step;

  const box = (title, active, children, col = C.accent) => (
    <div style={{ flex: 1, minWidth: 150, background: C.card, border: `1.5px solid ${active ? col : C.border}`, borderRadius: 8, padding: 10, transition: "all .2s" }}>
      <div style={{ fontSize: 10, color: active ? col : C.muted, fontWeight: 700, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
  const row = (a, b, active, col) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 12, padding: "2px 6px", borderRadius: 4, background: active ? col + "33" : "transparent", color: active ? col : C.text }}>
      <span>{a}</span><span>{b}</span>
    </div>
  );

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 12, lineHeight: 1.7 }}>
        The twist: the shelves are <strong style={{ color: C.text }}>not actually standing in the rooms</strong>.
        To save space, the library keeps every shelf in a big numbered <strong style={{ color: C.green }}>warehouse</strong>
        (physical memory, 4096 bays = blocks) — wherever a bay was free. Rooms exist only on paper.
        So the librarian needs two registers to find a book. Pick a request and step through.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {REQUESTS.map((r, i) => (
          <button key={i} onClick={() => start(i)} style={{
            flex: 1, minWidth: 110, padding: "7px 6px", borderRadius: 8, cursor: "pointer", fontFamily: "monospace", fontSize: 12, fontWeight: 700,
            border: `1.5px solid ${reqIdx === i ? C.accent : C.border}`,
            background: reqIdx === i ? C.accent + "22" : C.card, color: reqIdx === i ? C.accent : C.muted,
          }}>{hx(r.s, 1)} {hx(r.p)} {hx(r.w)}{inTlb(r, tlb) ? " 📌" : ""}</button>
        ))}
      </div>

      {/* The four "places" the librarian / MMU looks */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {box("📌 STICKY NOTES = TLB", on("tlb") || on("tlbAdd"), (
          tlb.length === 0 ? <div style={{ fontSize: 11, color: C.muted }}>(empty)</div> :
            tlb.map((t, i) => row(`${hx(t.s, 1)}/${hx(t.p)}`, hx(t.b, 3), (on("tlb") || on("tlbAdd")) && t.s === req.s && t.p === req.p, C.purple))
        ), C.purple)}
        {box("🚪 ROOM DIRECTORY = SEGMENT TABLE", on("seg"), (
          Object.entries(SEG_TABLE).map(([s, b]) => row(`seg ${hx(+s, 1)}`, `→ ${hx(b)}`, (on("seg")) && +s === req.s, C.accent))
        ))}
        {box("🗒️ SHELF REGISTER = PAGE TABLE", on("sum") || on("page"), (
          Object.entries(PAGE_TABLE).map(([a, b]) => row(`${hx(+a)}`, hx(b, 3), (on("sum") || on("page")) && +a === base + req.p, C.teal))
        ), C.teal)}
      </div>

      {/* Physical address result */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, padding: "10px 14px", borderRadius: 8, background: on("phys") ? C.green + "18" : C.surface, border: `1px solid ${on("phys") ? C.green : C.border}`, fontFamily: "monospace", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: C.muted, fontFamily: "system-ui" }}>Logical</span>
        <span style={{ color: C.accent, fontWeight: 700 }}>{hx(req.s, 1)}</span>
        <span style={{ color: C.teal, fontWeight: 700 }}>{hx(req.p)}</span>
        <span style={{ color: C.yellow, fontWeight: 700 }}>{hx(req.w)}</span>
        <span style={{ color: C.muted }}>⟶</span>
        <span style={{ fontSize: 12, color: C.muted, fontFamily: "system-ui" }}>Physical</span>
        <span style={{ color: C.green, fontWeight: 800, fontSize: 16 }}>{reached("phys") ? hx(blk, 3) : "???"}</span>
        <span style={{ color: C.yellow, fontWeight: 800, fontSize: 16 }}>{hx(req.w)}</span>
        <span style={{ fontSize: 11, color: C.muted, fontFamily: "system-ui" }}>(block ‖ word — the word part is copied unchanged)</span>
      </div>

      {/* Two-column narration: library vs hardware */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220, padding: "10px 12px", borderRadius: 8, background: C.orange + "12", border: `1px solid ${C.orange}44` }}>
          <div style={{ fontSize: 10, color: C.orange, fontWeight: 700, marginBottom: 4 }}>📚 IN THE LIBRARY</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{cur.lib}</div>
        </div>
        <div style={{ flex: 1, minWidth: 220, padding: "10px 12px", borderRadius: 8, background: C.accent + "12", border: `1px solid ${C.accent}44` }}>
          <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, marginBottom: 4 }}>⚙️ IN THE MMU</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{cur.hw}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: step === 0 ? C.muted + "66" : C.muted, cursor: step === 0 ? "default" : "pointer", fontSize: 12 }}>↺ Back</button>
        <button onClick={next} disabled={step === steps.length - 1} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: step === steps.length - 1 ? C.border : C.accentGlow, color: step === steps.length - 1 ? C.muted : "#fff", cursor: step === steps.length - 1 ? "default" : "pointer", fontSize: 12, fontWeight: 600 }}>Step ▶ ({step + 1}/{steps.length})</button>
        <button onClick={() => start(reqIdx)} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.purple}66`, background: "transparent", color: C.purple, cursor: "pointer", fontSize: 12 }}>Ask for it again</button>
        <button onClick={() => { setTlb([]); setHit(false); setStep(0); }} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontSize: 12 }}>Clear sticky notes</button>
      </div>

      <Key color={hit ? C.green : C.orange}>
        {hit
          ? "TLB hit: the sticky note gave the bay directly — 1 memory access instead of 3. That's why the TLB (the associative memory of Unit 4.4) is worth its cost."
          : "Without the TLB every reference costs THREE memory accesses: segment table, page table, then the data itself. Finish a trace, then press 'Ask for it again' to see the shortcut. Try F 00 3C too — it lands in block 012, the SAME bay as 6 00: two rooms sharing one shelf is exactly how a shared routine is stored once."}
      </Key>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
//  Section 4 — Guard the Rooms: segment descriptor (length + protection)
// ══════════════════════════════════════════════════════════════════
function GuardRooms() {
  const rooms = [
    { s: 6, name: "Your own program", len: 5, prot: "Read / Write", allow: ["Read", "Write", "Execute"], col: C.green },
    { s: 15, name: "Shared library routine", len: 1, prot: "Read-only", allow: ["Read", "Execute"], col: C.teal },
    { s: 8, name: "Licensed compiled code", len: 2, prot: "Execute-only", allow: ["Execute"], col: C.purple },
    { s: 0, name: "Operating system", len: 3, prot: "System-only", allow: [], col: C.red },
  ];
  const [ri, setRi] = useState(0);
  const [shelf, setShelf] = useState(2);
  const [action, setAction] = useState("Read");
  const r = rooms[ri];

  let verdict;
  if (shelf >= r.len) verdict = { ok: false, t: `SIZE VIOLATION — Room ${hx(r.s, 1)} has only ${r.len} shelf/shelves (00–${hx(r.len - 1)}). Shelf ${hx(shelf)} doesn't exist; the length field catches it.` };
  else if (!r.allow.includes(action)) verdict = { ok: false, t: `PROTECTION VIOLATION — Room ${hx(r.s, 1)} is "${r.prot}". A user program may not ${action.toLowerCase()} here.` };
  else verdict = { ok: true, t: `Allowed — shelf ${hx(shelf)} is inside the room and "${r.prot}" permits ${action.toLowerCase()}. Translation continues as in Section 3.` };

  return (
    <div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.7 }}>
        Every row of the Room Directory is really a <strong style={{ color: C.text }}>segment descriptor</strong>:
        it records <em>where</em> the room's shelf list is (base), <em>how many</em> shelves it has (length),
        and <em>who may do what</em> (protection). The librarian checks it before every fetch. Try to break the rules.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 6, marginBottom: 12 }}>
        {rooms.map((x, i) => (
          <button key={x.s} onClick={() => setRi(i)} style={{
            padding: "8px", borderRadius: 8, cursor: "pointer", textAlign: "left",
            border: `1.5px solid ${ri === i ? x.col : C.border}`, background: ri === i ? x.col + "18" : C.card,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: ri === i ? x.col : C.text }}>Room {hx(x.s, 1)} · {x.prot}</div>
            <div style={{ fontSize: 10.5, color: C.muted }}>{x.name}</div>
          </button>
        ))}
      </div>

      {/* The descriptor, Mano Fig 12-25 style */}
      <div style={{ display: "flex", fontFamily: "monospace", fontSize: 12, marginBottom: 12, borderRadius: 8, overflow: "hidden", border: `1px solid ${r.col}66` }}>
        {[["Base address", r.s === 6 ? "35" : r.s === 15 ? "A3" : "…"], ["Length", `${r.len} pages`], ["Protection", r.prot]].map(([a, b], i) => (
          <div key={a} style={{ flex: i === 0 ? 2 : 1, padding: "8px 10px", background: r.col + "10", borderLeft: i ? `1px solid ${r.col}44` : "none" }}>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: "system-ui" }}>{a}</div>
            <div style={{ color: C.text, fontWeight: 700 }}>{b}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ color: C.muted, fontSize: 12 }}>Requested shelf (page) = <strong style={{ color: C.teal }}>{hx(shelf)}</strong></label>
        <input type="range" min={0} max={7} value={shelf} onChange={(e) => setShelf(Number(e.target.value))} style={{ width: "100%", accentColor: C.teal }} />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["Read", "Write", "Execute"].map((a) => (
          <button key={a} onClick={() => setAction(a)} style={{
            flex: 1, padding: "7px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 700,
            border: `1.5px solid ${action === a ? C.accent : C.border}`, background: action === a ? C.accent + "22" : C.card, color: action === a ? C.accent : C.muted,
          }}>{a === "Read" ? "📖 Read" : a === "Write" ? "✏️ Write" : "▶️ Execute"}</button>
        ))}
      </div>

      <div style={{ padding: "10px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6, background: (verdict.ok ? C.green : C.red) + "15", border: `1px solid ${(verdict.ok ? C.green : C.red)}66`, color: verdict.ok ? C.green : C.red }}>
        {verdict.ok ? "✅ " : "⛔ "}{verdict.t}
      </div>

      <Key>
        Protection is attached to the <em>logical</em> side (the descriptor), not to physical
        blocks — because blocks move around as pages come and go, but a program's segments stay
        the same. One descriptor check guards the whole room, wherever its shelves happen to be.
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
      q: "In the library analogy, which part must be the SAME size everywhere, and what is it called in hardware?",
      options: [
        "The room — it's a page",
        "The shelf — it's a page (fixed length); rooms are segments and may differ in size",
        "The book — it's a segment",
        "The call number — it's a block",
      ],
      answer: 1,
      explain: "Shelves = pages, all identical (256 words). Rooms = segments, variable-length because each holds one logical part of a program.",
    },
    {
      q: "Using the tables from 'Translate It' (segment 6 → page-table base 35; page table 35–39 → blocks 012, 000, 019, 053, A61), what is the physical address of logical address 6 03 A5?",
      options: ["0603A5", "053A5", "038A5", "019A5"],
      answer: 1,
      explain: "Segment table[6] = 35. 35 + 03 = 38. Page table[38] = block 053. Physical = block ‖ word = 053 ‖ A5 = 053A5 — the word A5 passes through unchanged.",
    },
    {
      q: "With NO TLB, how many memory accesses does one segmented-page reference need, and why?",
      options: [
        "One — the address goes straight to memory",
        "Two — segment table, then data",
        "Three — segment table, then page table, then the actual data word",
        "Four — TLB, segment table, page table, data",
      ],
      answer: 2,
      explain: "Segment table (find page-table base) → page table (find block) → main memory (the real read). The TLB exists to cut this back to one access on a hit.",
    },
    {
      q: "A program in segment 6 (length = 5 pages) asks for page 07. What stops it?",
      options: [
        "Nothing — the page table just returns block 000",
        "The length field of the segment descriptor — page 07 ≥ 5 is a size violation",
        "The TLB refuses the request",
        "The word field overflows",
      ],
      answer: 1,
      explain: "The descriptor's length field is compared with the page number on every access; anything outside 00–04 is trapped before any memory is touched.",
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
          {score === 4 ? "Perfect! Rooms, shelves, books — and the two-table walk behind them — are locked in." :
            score >= 2 ? "Good work! Replay 'Translate It' with 6 03 xx and check each table lookup by hand." :
              "Revisit 'The Library' and 'Translate It', then try again."}
        </div>
        <div style={{
          padding: "20px", borderRadius: 12,
          background: `linear-gradient(135deg, ${C.accentGlow}22, ${C.purple}22)`,
          border: `1px solid ${C.accent}55`,
        }}>
          <div style={{ color: C.accent, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎓 Unit 4.7 Complete!</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
            Segments, pages, the segment table → page table walk, the TLB shortcut and segment protection are all in place.
            <br /><br />
            <strong style={{ color: C.accent }}>Next up: the Module 4 Capstone — Trace an Address.</strong>{" "}
            Same library, same tables — now you drive the whole translation yourself, from the hierarchy down to the block.
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
export default function Unit4_7({ student, onUnitComplete }) {
  const sections = [
    { id: "need", label: "Why Rooms?" },
    { id: "library", label: "The Library" },
    { id: "translate", label: "Translate It" },
    { id: "guard", label: "Guard the Rooms" },
    { id: "quiz", label: "Quiz & Wrap-up" },
  ];

  const [activeSection, setActiveSection] = useState(0);
  const [completed, setCompleted] = useState([]);

  const markComplete = (idx) => { if (!completed.includes(idx)) setCompleted((p) => [...p, idx]); };
  const goNext = () => { markComplete(activeSection); setActiveSection((s) => Math.min(sections.length - 1, s + 1)); };

  const content = [
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>❓ Why Rooms? Paging Alone Isn't Enough</h3>
      <WhyRooms />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>📚 The Library: Room → Shelf → Book</h3>
      <Library />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🔀 Translate It: Logical → Physical Address</h3>
      <TranslateIt />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>🛡️ Guard the Rooms: Segment Descriptors</h3>
      <GuardRooms />
    </div>,
    <div>
      <h3 style={{ color: C.text, marginBottom: 6 }}>Quick Quiz</h3>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>4 questions to check your understanding of Unit 4.7.</p>
      {/* The quiz's onComplete is the ONLY caller of onUnitComplete. */}
      <Quiz onComplete={() => { markComplete(4); onUnitComplete && onUnitComplete(); }} />
    </div>,
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.text, paddingBottom: 40 }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accentGlow, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗄️</div>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1 }}>MODULE 4 › UNIT 4.7</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Segmentation: The Library of Memory</div>
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
            fontWeight: 600, cursor: "pointer", fontSize: 14,
          }}>Mark Complete &amp; Continue →</button>
        )}
      </div>
    </div>
  );
}
