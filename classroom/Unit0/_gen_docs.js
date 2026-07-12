// ── Generates the three Unit 0 documents: PresenterGuide, StudentNotes, AnswerKey ──
// Matches Unit0_Deck.html (45 slides, chapters 0.0–0.4).
// Run: cd /tmp && node <path>/_gen_docs.js <outdir>   (docx installed in /tmp)
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, Header, Footer } = require("docx");

const OUT = process.argv[2] || ".";

// ── tiny helpers ──
const T = (t, o = {}) => new TextRun({ text: t, ...o });
const P = (t, o = {}) => new Paragraph({ children: Array.isArray(t) ? t : [T(t)], spacing: { after: 120 }, ...o });
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [T(t)] });
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [T(t)] });
const H3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [T(t)] });
const BUL = (t) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: Array.isArray(t) ? t : [T(t)], spacing: { after: 80 } });
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (t, w, opts = {}) => new TableCell({
  borders, width: { size: w, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  shading: opts.head ? { fill: "D5E8F0", type: ShadingType.CLEAR } : undefined,
  children: (Array.isArray(t) ? t : [t]).map(x => typeof x === "string"
    ? new Paragraph({ children: [T(x, opts.head ? { bold: true } : {})] }) : x),
});
const row = (cells) => new TableRow({ children: cells });

const baseDoc = (children) => new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 34, bold: true, font: "Arial", color: "1F6FEB" },
        paragraph: { spacing: { before: 280, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 27, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 220, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
        run: { size: 23, bold: true, font: "Arial", color: "444444" },
        paragraph: { spacing: { before: 160, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
      alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 620, hanging: 320 } } } }] },
  ]},
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 },
      margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } } }, // A4
    headers: { default: new Header({ children: [P([T("CSE23CT201 · Computer Organization & Architecture · Unit 0 — Before the Machine", { size: 18, color: "888888" })]) ] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [T("Page ", { size: 18, color: "888888" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" })] })] }) },
    children,
  }],
});

// ════════════════════════════════════════════════════════════
// 1. PRESENTER'S GUIDE
// ════════════════════════════════════════════════════════════
const W = 9506;
const slideTable = rows => new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [900, 2800, 5806],
  rows: [row([cell("Slide", 900, { head: true }), cell("On screen", 2800, { head: true }), cell("Talking points & tips", 5806, { head: true })]),
    ...rows.map(r => row([cell(r[0], 900), cell(r[1], 2800), cell(r[2], 5806)]))],
});

const pg = [];
pg.push(H1("Presenter's Guide — Unit 0: Before the Machine"));
pg.push(P([T("Companion to "), T("Unit0_Deck.html", { bold: true }), T(" (45 slides, chapters 0.0–0.4). The deck carries the story; this guide carries the depth. Slides are sparse by design — everything you say lives here.")]));

pg.push(H2("Logistics"));
pg.push(BUL([T("Timing: ", { bold: true }), T("Unit 0 ≈ 4 lecture hours. L1 = Chapter 0.0 (~40 min). L2 = Chapter 0.1 (~40 min). L3 = Chapter 0.2 (~45 min, widget-heavy). L4 = Chapters 0.3 + 0.4 (~50 min).")]));
pg.push(BUL([T("Controls: ", { bold: true }), T("→ / Space / click = next reveal · ← = back · keys 0–4 jump to chapters 0.0–0.4 · F11 fullscreen. Every keypress reveals ONE element — narrate as you reveal.")]));
pg.push(BUL([T("🙋 slides (icon-only badge): ", { bold: true }), T("show the question, WAIT for answers (30–60 s), then press → to reveal. Never reveal early — the prediction is the learning moment.")]));
pg.push(BUL([T("Interactive widgets (Ch 0.2): ", { bold: true }), T("clicking INSIDE the widget operates it (switches, gates); clicking anywhere else advances the slide. Before every widget click, ask the class to PREDICT the outcome aloud.")]));
pg.push(BUL([T("Photos & video: ", { bold: true }), T("drop images into assets/ (difference_engine.jpg, eniac1.jpg, eniac2.jpg, core_memory.jpg; portraits babbage/ada/boole/turing/shannon/vonneumann.jpg). For the video slide, replace PASTE_URL_HERE in the HTML with a YouTube embed URL. Missing files hide themselves gracefully.")]));
pg.push(BUL([T("Syllabus position: ", { bold: true }), T("Unit 0 is the motivational bridge into syllabus Unit 1 (Basic Structure of Computers, CO1). Chapter 0.4 deliberately STOPS at the stored-program concept — execution is Unit 1's opening act.")]));

// ── Chapter 0.0 ──
pg.push(H2("Chapter 0.0 — Why This Course? (slides 3–12, ≈ 40 min)"));
pg.push(P([T("Objective: ", { bold: true }), T("kill the perception that COA is 'somebody else's subject'. Past-years feedback says disinterest comes from not seeing relevance — this chapter exists to fix exactly that. Every student should leave able to say why THEIR branch needs this course, and what the two words in its title mean.")]));
pg.push(slideTable([
  ["3", "Chapter divider", "Read the hook aloud, slowly: 'Whatever your branch — AI, Data Science, Cyber, IoT, ECE — every line of code you will ever write runs on THIS.' Then ask for a show of hands by specialization — you'll address each one on the next slide."],
  ["4", "Not somebody else's subject (4 reveals)", "One reveal per branch — speak TO those students by name of branch. AI/ML: a training run that takes 3 days instead of 3 hours is usually a memory-bandwidth/cache problem, not a Python problem; that's why NVIDIA became the world's most valuable company. Cyber: Spectre/Meltdown (2018) broke virtually every CPU on Earth through CACHE behaviour — patched in software, at a performance cost; you cannot even read that sentence without this course. IoT/ECE: an ESP32 has ~520 KB RAM — every byte counts; registers, memory maps, interrupts are daily vocabulary. Everyone: GATE weighs COA heavily; interviews love 'what happens when you run a program?'"],
  ["5", "CO1–CO5 (5 reveals)", "Read each CO in plain words and name the unit that delivers it. Tell them: 'These five sentences are the exam blueprint — internal and university papers are set against these outcomes.'"],
  ["6", "PO1–PO3 (3 reveals)", "Keep light (2 min). The degree promises engineering knowledge (PO1), problem analysis (PO2), design (PO3) — this course supplies the deepest computing layer of all three. Full CO–PO mapping table is in your records; students don't need it on screen."],
  ["7", "What is a digital computer (3 reveals)", "Mano Ch.1 p.1 definition, translated: digital = discrete steps, not continuous flow. The binary advantage: two states are the MOST RELIABLE distinction an electronic device can make. Tease: 'why exactly two? Chapter 0.2 shows you the physics.'"],
  ["8", "Architecture vs Organization (3 reveals + closing line)", "THE table of the chapter — students must be able to reproduce it. House analogy: blueprint (where rooms/sockets are) vs wiring-and-plumbing behind walls. Architecture = ISA, data formats, addressing (programmer's view). Organization = circuits, control signals, technology (implementer's view). Board work: write WHAT | HOW as two columns and let students sort examples you call out."],
  ["9", "🙋 The billion-times punchline (1 reveal)", "Let them argue first. Answer: organization changed (VLSI, caches, pipelines); architecture survived (same ISA). This single example is worth 5 marks in an exam — say so explicitly."],
  ["10", "Computer family tree (5 reveals)", "Hamacher §1.1. Embedded (they own dozens without knowing), personal, servers/enterprise (IRCTC!), supercomputers/grid, + cloud as 'renting server time as a utility'. Punch: same five functional units inside all of them — 'wait for Unit 1'."],
  ["11", "Hardware / Software / OS (3 reveals)", "The three-partner picture. They know software (programming courses) and use an OS daily; this course completes the triangle from below. OS = the manager that negotiates between the two."],
  ["12", "🔑 Key insight", "Architecture = WHAT, Organization = HOW, and this course teaches both. Have the class read it aloud together — it's the course's thesis statement."],
]));
pg.push(H3("Common misconceptions — Chapter 0.0"));
pg.push(BUL("'COA is only for core CS/hardware people' — the branch slide exists to destroy this; return to it whenever interest dips mid-semester."));
pg.push(BUL("'Architecture and organization are synonyms' — they are the WHAT and the HOW; the 1970s-program example is the cleanest test of understanding."));
pg.push(BUL("'The OS is part of the hardware' — it is software; a program that manages resources."));

// ── Chapter 0.1 ──
pg.push(H2("Chapter 0.1 — The Problem & The Dream (slides 13–22, ≈ 40 min)"));
pg.push(P([T("Objective: ", { bold: true }), T("students should feel WHY computers were invented before seeing any hardware — the century-long disease (human arithmetic + fatigue = errors) and the shared dream of one general programmable machine. Reference: Hamacher Ch.1 pp.19–21 (history).")]));
pg.push(slideTable([
  ["13", "Chapter divider", "Read the hook aloud: ships sank, banks lost millions, boilers burst — all from typos in books of numbers."],
  ["14", "Mechanical roots (3 reveals)", "300 years of gears and levers: Pascal's adder (1642), Leibniz's stepped reckoner. Punched cards controlled looms (Jacquard, 1804) before they controlled computers — sequencing as the first 'programming'. Machines could calculate; they couldn't yet be TRUSTED at scale."],
  ["15", "A world of printed tables (3 reveals)", "'Computer' was a JOB TITLE. Books of logarithms, sines, astronomical positions, interest tables — computed by hand, copied by hand, typeset by hand: three chances for error. Consequences: navigation typos ran ships aground; faulty actuarial tables cost the British government millions; Industrial-Revolution engineers designed on bad numbers."],
  ["16", "The steam epiphany, 1821 (3 reveals + photo)", "Tell the story: Babbage and John Herschel checking astronomical tables, error after error, until Babbage explodes: 'I wish to God these calculations had been executed by steam!' Difference Engine: never tires, never slips — AND prints results into metal plates, removing the typesetter too. Design lesson: automate the WHOLE pipeline. (Photo appears if assets/difference_engine.jpg exists.)"],
  ["17", "'Never gets tired, never slips'", "Pause slide. The engineering requirement for the whole course — stated 1821, fulfilled 1949 (the reveal adds this dateline)."],
  ["18", "Six dreamers (6 reveals, portraits)", "One story per card. Babbage: Difference → Analytical Engine; Store+Mill = memory+CPU. Ada: first algorithm AND the deeper insight — symbols, not just numbers (music, pictures — all symbols). Boole: logic as algebra, 90 years early. Turing: ONE universal machine, different instructions. Shannon: logic = switch circuits (bridge to 0.2). von Neumann: program lives IN memory (bridge to 0.4)."],
  ["19", "WWII: tables turn deadly (3 reveals)", "Same disease, a century later: every new gun needs a firing table; ~50 hand calculations per entry; the US Ballistic Research Lab's human computers (mostly women) cannot keep up. This crisis funds ENIAC. Board: '50 × 3000 = 150,000 calculations for ONE cannon.'"],
  ["20", "🙋 Be the computer (4 reveals)", "Three students, one step each, aloud: 10÷5=2 units; 2×0.7=1.4°; 24.7+1.4=26.1°. Punchline: one slip upstream → hundreds of metres off. Misconception to kill: 'people were careless' — no, fatigue is structural; Babbage diagnosed it in 1821."],
  ["21", "Timeline (9 reveals)", "Chronological; ask students to call out what they remember about each name first. Emphasise the 128-year gap: dream 1821 → stored program running 1949."],
  ["22", "🔑 Key insight", "The problem never changed (humans + arithmetic = errors); neither did the dream (change the instructions, not the machine). Returns in every later unit."],
]));
pg.push(H3("Common misconceptions — Chapter 0.1"));
pg.push(BUL("'Babbage built the first computer' — he DESIGNED it; never completed in his lifetime."));
pg.push(BUL("'Babbage was motivated by wartime artillery' — NO: he lived 1791–1871; his enemy was errors in printed mathematical/navigation/actuarial tables. Artillery firing tables drove ENIAC in World War II, a century later."));
pg.push(BUL("'ENIAC was a stored-program computer' — electronic, yes; but programmed by rewiring. That is exactly von Neumann's complaint (Chapter 0.4)."));

// ── Chapter 0.2 ──
pg.push(H2("Chapter 0.2 — Bits & Boolean Logic (slides 23–31, ≈ 45 min)"));
pg.push(P([T("Objective: ", { bold: true }), T("the chain numbers → bits → voltages → gates → arithmetic, ending with metal that ADDS. References: Mano Ch.1 p.1; Hamacher App.A pp.481–484. This is the widget chapter — drive every widget with class predictions.")]));
pg.push(slideTable([
  ["23", "Chapter divider", "Hook: 'metal doing mathematics' should sound impossible. Promise: in 40 minutes they will watch metal add 1 + 1."],
  ["24", "WIDGET: binary builder", "Click switches to build numbers. Routine: call a target ('give me 13!'), invite a student up (or take shouted instructions), let the readout confirm. Do 5, 13, 15, then ask what the biggest 4-switch number is (15) and why (2⁴−1). The reveal adds: n bits → 2ⁿ patterns."],
  ["25", "🙋 1011 = ? (1 reveal)", "Expected: 11 (8+2+1). Quick follow-ups: 1111? 1000? How many patterns with 4 bits?"],
  ["26", "Voltage is the bit (6 reveals)", "Why binary is RELIABLE — the physics answer promised in 0.0. Logic 0 ≈ 0 V (ground); logic 1 ≈ +5 V or +3 V. The FORBIDDEN band between thresholds: noise can wiggle a voltage but can't push it across the whole gap. Ten voltage levels would leave tiny gaps — noise would flip digits constantly. Two states = maximum noise immunity. (Mano p.1; Hamacher A.1.)"],
  ["27", "WIDGET: Shannon's circuits", "Series and parallel circuits with clickable switches; current paths light. Ask before EVERY click: 'will the bulb light?' Series: close A only (no), then B too (yes) → AND. Parallel: either one → OR. Mention normally-closed = NOT. Shannon was a 21-year-old master's student; often called the most important master's thesis of the century."],
  ["28", "WIDGET: gate explorer", "Toggle A and B; four gates answer live. Build each gate's truth table ON THE BOARD from what the class observes — they generate the data, you record it. XOR is the star: '1 when they DIFFER'. Leave hanging: 'remember XOR — it is about to do something amazing.'"],
  ["29", "🙋 XOR both 1? (1 reveal)", "Expected: 0. The reveal hints: that is exactly the sum bit of 1+1 — binary 1+1 = 10: sum 0, carry 1."],
  ["30", "WIDGET: the half adder", "THE PAYOFF — budget 8 min. Click through all four A/B combinations; wires light teal, outputs green; readout shows 'A + B = carry sum'. Then the board: write the truth table beside binary addition columns — the sum column IS XOR, the carry column IS AND. Metal adds. Mention: chain these (full adders) and you add any number — that adder sits inside every ALU (Unit 1 preview)."],
  ["31", "🔑 Key insight", "Numbers → bits → voltages → gates → arithmetic. Everything else in this course is this idea, scaled up."],
]));
pg.push(H3("Common misconceptions — Chapter 0.2"));
pg.push(BUL("'Binary is used because computers are modern/digital' — binary is used because two states give maximum noise immunity. Reliability, not fashion. The forbidden-range diagram is the proof."));
pg.push(BUL("'XOR = OR' — stress DIFFER vs AT-LEAST-ONE using the (1,1) row on the gate-explorer widget."));
pg.push(BUL("'Gates are abstract symbols' — they are physical circuits; 0.3 shows them built from transistors."));

// ── Chapter 0.3 ──
pg.push(H2("Chapter 0.3 — From Relays to Transistors (slides 32–41, ≈ 35 min)"));
pg.push(P([T("Objective: ", { bold: true }), T("the logic never changed; the SWITCH changed — relay → tube → transistor → IC → VLSI, formalised as the four generations, with Moore's law as the engine. References: Hamacher Ch.1 pp.19–21, App.A pp.482–484.")]));
pg.push(slideTable([
  ["32", "Chapter divider", "Recap 30 s: logic on paper (Boole), logic in wiring (Shannon). Question: what physically IS the switch — and how far can it shrink?"],
  ["33", "Three generations of switch (3 reveals)", "Relay: electromagnet swings an arm — ~1 kHz, audible clicks, wears out (first 'bug' was a real moth). Tube: grid voltage steers electrons — ~1 MHz, no moving parts, but glows hot like a bulb. Transistor, Bell Labs 1947 (Bardeen, Brattain, Shockley — Nobel 1956): solid state, cool, tiny, reliable."],
  ["34", "PHOTO: ENIAC (4 stat reveals)", "Let the photo speak first (add assets/eniac1.jpg / eniac2.jpg). Then the stats, one per keypress: 18,000 tubes · 27 tonnes · 150 kW (a small neighbourhood) · ~1 tube dies per day. Ask: 'would YOU volunteer to find the dead tube?'"],
  ["35", "🙋 Why one tube a day? (1 reveal)", "Expected: heated filament burns out like a light bulb. 18,000 tubes = daily failures. Reliability, power, heat — the three tube-killers."],
  ["36", "VIDEO", "Play your chosen clip (2–4 min works best — ENIAC footage or a transistor-count visualisation). While it plays, walk the room; afterwards ask for ONE thing that surprised them."],
  ["37", "Gates from transistors (4 reveals)", "Hamacher A.2: NOT = one transistor + resistor (input low → open switch → output pulled high; input high → closed → output to ground). NAND = transistors in SERIES (output low only when both close). NOR = PARALLEL. Nice symmetry with 0.2: relays naturally gave AND/OR; transistors naturally give the inverted twins NAND/NOR. CMOS: complementary NMOS+PMOS pairs — near-zero power at rest, energy only when switching; that is why billions of gates don't melt your phone."],
  ["38", "Four generations table (4 reveals + note)", "The examinable table (Hamacher Ch.1): 1st 1945–55 tubes + stored program + assembly; 2nd 1955–65 transistors + Fortran; 3rd 1965–75 ICs + pipelining & cache EMERGE (hook: Units 3 and 4 study exactly these!); 4th 1975–now VLSI + microprocessor. Closing note: what evolved was the ORGANIZATION — the stored-program architecture is unchanged since 1945. Ties back to 0.0."],
  ["39", "Moore's law animated (9 reveals)", "One bar per keypress: 1947: 1 · 1971: 2,300 (4004, first CPU-on-a-chip) · 1989: 1.2 M (486) · 2008: ~1 B (Core i7) · 2024: 100 B+ (M-series, ~2 nm). Stress the LOG scale — each gridline is ×1000; a straight climb here is exponential growth. Then the caveat card: an economic target, not physics — and it is slowing, which is why ARCHITECTURE (better design, not just smaller switches) is the future. Gordon Moore made the observation in 1965 with just four data points."],
  ["40", "Memory needed a switch too (2 reveals + photo)", "Core memory: one hand-threaded ring per bit — literally woven by workers for Apollo. DRAM/SRAM: the same bit, billions per chip. Seeds Unit 4."],
  ["41", "🔑 Key insight", "Same Boolean logic since 1854; a better switch, a billion times over. Ask: what would computing look like if the transistor had never been found?"],
]));
pg.push(H3("Common misconceptions — Chapter 0.3"));
pg.push(BUL("'Transistors compute differently from relays' — identical logic, different physics: a billion times faster and smaller."));
pg.push(BUL("'Moore's law is a law of physics' — it is an economic/engineering observation, and it is slowing."));
pg.push(BUL("'Each generation changed how computers think' — generations changed the ORGANIZATION; the stored-program architecture has been constant since 1945."));

// ── Chapter 0.4 ──
pg.push(H2("Chapter 0.4 — The Von Neumann Shift (slides 42–45, ≈ 15 min)"));
pg.push(P([T("Objective: ", { bold: true }), T("one idea, delivered clean: the program moves INSIDE the memory, as numbers. Deliberately short — do not drift into execution details (registers, buses, fetch cycles); all of that is Unit 1. End the unit on the cliffhanger.")]));
pg.push(slideTable([
  ["42", "Chapter divider", "Hook: ENIAC computed in milliseconds — why did a NEW program take days? Let them guess before advancing."],
  ["43", "The rewiring problem (3 reveals)", "ENIAC's program WAS its cables — days of replugging while the machine sat idle. von Neumann's 1945 'First Draft' report: instructions are just information, and we already have a place that stores information. Third reveal is the thesis: put the program IN memory, beside the data, as numbers. (Historical note for questions: the ideas grew from work with Eckert & Mauchly; the report carried only von Neumann's name — a controversy to this day.)"],
  ["44", "The program lives in memory (6 reveals)", "The most important slide of Unit 0. Memory shows plain numbers ('20 05', '31 06'…). First reveal asks: which are program, which are data? Let the class stare — they CANNOT tell, and neither can the machine. Then the labels appear: top three cells = PROGRAM, bottom two = DATA. Punchline reveals: a new program is just new numbers — no rewiring; one machine, infinite programs — Babbage's dream, Turing's proof, von Neumann's engineering."],
  ["45", "🔑 + cliffhanger", "Read it slowly: the stored program turned a calculator into a computer. Then the cliffhanger: HOW the machine fetches and executes those numbers is Unit 1's story. End the lecture there — genuinely leave them wanting the next class."],
]));
pg.push(H3("Common misconceptions — Chapter 0.4"));
pg.push(BUL("'Programs and data are stored differently' — same memory, same format: numbers. That IS the revolution."));
pg.push(BUL("'von Neumann built ENIAC' — ENIAC was Eckert & Mauchly's machine; von Neumann's report described the stored-program successor (EDVAC)."));

// ════════════════════════════════════════════════════════════
// Question bank (shared by StudentNotes & AnswerKey)
// ════════════════════════════════════════════════════════════
const partA = [ // 1 mark — Remember/Understand
  ["Define a bit.", "Remember",
   "A bit (binary digit) is the smallest unit of information, taking exactly one of two values, 0 or 1 — physically represented by two distinct voltage levels."],
  ["Define computer architecture.", "Remember",
   "Computer architecture is the structure and behaviour of a computer as seen by the user/programmer — the instruction set, data formats and addressing techniques (the 'what')."],
  ["Define computer organization.", "Remember",
   "Computer organization is the set of operational units and their interconnections that implement the architectural specification — circuits, control signals and technology (the 'how')."],
  ["What voltage levels typically represent logic 0 and logic 1?", "Remember",
   "Logic 0 = low voltage, approximately 0 V (ground); logic 1 = high voltage, typically +5 V or +3 V."],
  ["State the stored-program (von Neumann) concept.", "Remember",
   "Instructions are stored in main memory alongside data, encoded as numbers; the machine runs a new program by loading new numbers — no rewiring."],
  ["List the four generations of computer technology.", "Remember",
   "1st: vacuum tubes (1945–55); 2nd: transistors (1955–65); 3rd: integrated circuits (1965–75); 4th: VLSI (1975–present)."],
  ["What is the role of the operating system?", "Remember",
   "The OS is a program that manages the computer's resources and handles the interaction between application software and the hardware."],
  ["What motivated Charles Babbage to design the Difference Engine?", "Remember",
   "The many errors in hand-computed, hand-typeset printed tables (logarithmic, astronomical/navigation, actuarial) used in the 1800s — he wanted a machine to compute AND print them without human error."],
  ["What does an XOR gate output when both inputs are equal?", "Understand",
   "0. XOR outputs 1 only when its inputs DIFFER; equal inputs (0,0 or 1,1) give 0."],
];
const partB = [ // 2 marks — Understand/Apply
  ["Differentiate between computer architecture and computer organization, giving one example of each.", "Understand",
   "Architecture: programmer's view — e.g. the instruction set (ISA), data formats, addressing modes. Organization: implementer's view — e.g. the electronic circuits, control signals, CMOS technology realising those instructions. [1 mark per side with a valid example.]"],
  ["Convert the binary number 1011 to decimal, showing the positional weights used.", "Apply",
   "Weights: 8 4 2 1. 1011 = (1×8) + (0×4) + (1×2) + (1×1) = 8 + 0 + 2 + 1 = 11. [1 mark working, 1 mark answer.]"],
  ["What is the forbidden voltage range, and why is it necessary?", "Understand",
   "The band of voltages between the maximum recognised as logic 0 and the minimum recognised as logic 1. Signals must not settle there: it guarantees that random electrical noise, which can wiggle a voltage slightly, cannot push a 0 across the gap to be misread as a 1 (or vice versa) — the source of binary's reliability. [1 mark definition, 1 mark noise reasoning.]"],
  ["How is a NAND gate built from transistors, and why does the series connection produce NAND?", "Understand",
   "Two transistors are connected in SERIES between the output and ground, with a resistor to the supply. Only when BOTH inputs are high do both transistors conduct, pulling the output low; any other combination leaves the output high — exactly NAND. [1 mark construction, 1 mark reasoning.]"],
  ["State the power advantage of CMOS technology and its cause.", "Understand",
   "CMOS pairs complementary NMOS and PMOS transistors so that in either steady state one of the pair is off — almost no current flows at rest; power is consumed mainly during switching. This is why chips with billions of gates remain thermally manageable. [1 mark advantage, 1 mark cause.]"],
  ["The need for automatic computation arose twice in history for similar reasons. Compare Babbage's motivation (1821) with the motivation that funded ENIAC (1940s).", "Understand",
   "Both stemmed from error-prone human computation of printed tables. Babbage (1821): errors in mathematical/navigation/actuarial tables caused shipwrecks and financial losses — he designed the Difference Engine to compute and print tables mechanically. ENIAC (WWII): artillery firing tables (~50 hand calculations per entry) were produced too slowly and with errors by human computers — the US Army funded an electronic machine. Same disease, a century apart. [1 mark per motivation.]"],
];
const partC = [ // 5 marks — Apply/Analyze/Evaluate
  ["Distinguish between computer architecture and computer organization. Support your answer with the house analogy, a table of at least three differences, and the example of a 1970s program running on a modern processor.", "Analyze",
   "Definitions: architecture = structure and behaviour as seen by the programmer (ISA, data formats, addressing); organization = operational units and interconnections implementing it (circuits, control signals, technology). Analogy: architecture is the house blueprint (rooms, socket positions); organization is the wiring and plumbing behind the walls. Table: view (programmer vs implementer); concerns (what instructions exist vs how they are executed); components (ISA/formats/addressing vs circuits/control signals/CMOS); stability (changes rarely vs changes with every technology generation). Example: a program written against a 1970s ISA can run unchanged, a billion times faster, on a modern VLSI implementation — the architecture survived while the organization was rebuilt many times. [Definitions 1; analogy 1; table 2; example 1.]"],
  ["Design a half adder: give its truth table, Boolean expressions, and gate-level diagram. Explain why XOR produces the sum and AND produces the carry.", "Apply / Analyze",
   "Truth table (A B → Carry Sum): 00→00, 01→01, 10→01, 11→10. Expressions: Sum = A ⊕ B; Carry = A · B. Diagram: inputs A and B fan out to one XOR gate (output Sum) and one AND gate (output Carry). Why: in binary addition the sum bit is 1 exactly when the inputs differ (0+1, 1+0) — the XOR function; the carry is 1 only when both inputs are 1 (1+1 = 10) — the AND function. [Truth table 2; expressions 1; diagram 1; explanation 1.]"],
  ["Compare the relay, the vacuum tube and the transistor as switching devices, and justify why the transistor made modern computing possible.", "Evaluate",
   "Relay: electromagnet physically moves a contact arm; ~1 kHz; noisy, mechanical wear. Vacuum tube: grid voltage steers electrons from a heated cathode; ~1 MHz; no moving parts but hot, power-hungry, burns out (ENIAC: 18,000 tubes, ~1 failure/day). Transistor (Bell Labs, 1947): solid-state switching in silicon; no filament, no moving parts; small, cool, reliable. Justification: only the transistor can be miniaturised and mass-fabricated — integrated circuits grow billions of switches together on silicon (2,300 in the 4004 → 100 B+ today), delivering the speed, density, reliability and cost that relays and tubes fundamentally cannot reach. [Comparison 3 — one per device; justification 2.]"],
  ["Describe the four generations of computer technology and explain Moore's law, including why it held for decades and why it is now slowing.", "Understand / Analyze",
   "Generations: 1st (1945–55) vacuum tubes — stored-program concept, assembly language; 2nd (1955–65) transistors — smaller/faster gates, high-level languages (Fortran); 3rd (1965–75) integrated circuits — many transistors per chip, pipelining and cache concepts emerge; 4th (1975–present) VLSI — billions of transistors, the microprocessor. Moore's law: the observation (Gordon Moore, 1965) that transistor count per chip doubles roughly every two years — exponential growth, a straight line on a log scale (1 → 2,300 → 1.2 M → ~1 B → 100 B+). It held because IC fabrication photographs circuits onto silicon — shrinking the feature size multiplies the count at little extra cost, and industry investment chased that target. It slows as features approach atomic scale (~2 nm): quantum leakage, heat density and fabrication cost rise sharply — shifting progress toward better ARCHITECTURE rather than smaller switches. [Generations 2; Moore statement 1; why it held 1; why slowing 1.]"],
];

const qbank = (withAnswers) => {
  const out = [];
  const section = (title, qs, marks) => {
    out.push(H2(title));
    qs.forEach(([q, bloom, ans], i) => {
      out.push(P([T("Q" + (i + 1) + ". ", { bold: true }), T(q), T("   [" + marks + " mark" + (marks > 1 ? "s" : "") + " · Bloom's: " + bloom + "]", { italics: true, color: "888888", size: 19 })]));
      if (withAnswers) out.push(P([T("Answer: ", { bold: true, color: "3FB950" }), T(ans)], { indent: { left: 400 } }));
    });
  };
  section("Part A — 1-mark questions", partA, 1);
  section("Part B — 2-mark questions", partB, 2);
  section("Part C — 5-mark questions", partC, 5);
  return out;
};

// ════════════════════════════════════════════════════════════
// 2. STUDENT NOTES
// ════════════════════════════════════════════════════════════
const sn = [];
sn.push(H1("Unit 0 — Before the Machine · Student Notes"));
sn.push(P([T("CSE23CT201 Computer Organization & Architecture · Reading material for the Unit 0 lectures. Textbooks: "),
  T("Hamacher, Vranesic & Zaky, Computer Organization and Embedded Systems (5th ed.), Ch. 1 and Appendix A", { italics: true }),
  T("; "), T("M. Morris Mano, Computer System Architecture, Ch. 1.", { italics: true })]));

sn.push(H2("0.0 Why This Course? — Architecture vs Organization"));
sn.push(P("A digital computer performs its tasks using variables that take a limited number of discrete values — distinct, separate steps rather than a continuous flow. Reliability is highest when only two values are used, 0 and 1, physically represented by two voltage levels. Every kind of information — text, images, sound, formulas — is encoded as strings of binary digits (bits). Why two states and not ten is answered precisely in section 0.2."));
sn.push(P("The course title contains two distinct ideas. COMPUTER ARCHITECTURE is the structure and behaviour of the computer as seen by the programmer: the instruction set architecture (ISA), data formats, and memory-addressing techniques. It is the blueprint of the house — where the rooms and sockets are. COMPUTER ORGANIZATION is how the hardware actually implements that blueprint: the operational units, their interconnections, electronic circuits, control signals, and fabrication technology such as CMOS. It is the wiring and plumbing behind the walls. In short: architecture defines WHAT the computer can do; organization defines HOW it is built to do it. The cleanest illustration: a program written for a 1970s instruction set can run unchanged on a modern chip a billion times faster — the architecture survived; the organization was rebuilt many times over."));
sn.push(P("Computers are matched to purpose: embedded computers hide inside cars and appliances to control physical processes; personal computers (desktops, workstations, notebooks) serve individuals; servers and enterprise systems are shared by many users over networks and host large databases; supercomputers handle the most demanding scientific work, with grid computing coordinating many machines as one cost-effective resource; cloud computing rents such resources as a pay-as-you-use utility. Inside all of them: the same functional structure, formally studied in Unit 1."));
sn.push(P("Finally, a working computer is three partners: hardware (the physical circuits, storage and processing units — this course's subject), software (programs written against the architecture), and the operating system (the manager: a program that allocates resources and handles the interaction between application software and hardware)."));
sn.push(P([T("Why this course matters for every specialisation: ", { bold: true }), T("machine-learning performance is governed by memory bandwidth and cache behaviour on GPUs; security exploits such as buffer overflows and the Spectre/Meltdown attacks operate at the architecture level; IoT and embedded work programs microcontrollers where every byte and milliwatt counts; and GATE and placement interviews test exactly this material.")]));

sn.push(H2("0.1 The Problem & The Dream"));
sn.push(P("Computing has mechanical roots: for three centuries before electronics, devices of gears and levers performed arithmetic (Pascal 1642, Leibniz 1673), and punched cards — first used to control looms — provided an early form of programmed sequencing. But machines were not yet trusted with the world's numbers. In the nineteenth century the world ran on printed books of pre-computed tables — logarithms, sines, astronomical positions, compound interest — calculated by teams of human computers ('computer' was a job title), then copied and typeset by hand. Errors entered at every stage, and they were costly: a navigation typo could put a ship miles off position; faulty actuarial tables caused heavy financial losses; Industrial-Revolution engineers designed structures on bad numbers."));
sn.push(P("In 1821, checking a book of astronomical tables with the astronomer John Herschel and finding error after error, Charles Babbage exclaimed: 'I wish to God these calculations had been executed by steam!' His Difference Engine was designed to compute tables mechanically and to print the results directly into metal printing plates — removing human error from calculation and typesetting alike. He then went further: the Analytical Engine (1837), a general mechanical computer with a Store (memory) and a Mill (calculator) driven by punched cards — never completed, but shaped like every computer since. Ada Lovelace (1843) wrote the first algorithm for it and saw deeper: a rule-following machine can manipulate ANY symbols, not just numbers. George Boole (1854) turned logic into algebra (AND, OR, NOT), ninety years before it could be built. Alan Turing (1936) proved that one universal machine, given different instructions, can compute anything computable. Claude Shannon (1937) showed that Boolean logic maps exactly onto electrical switching circuits."));
sn.push(P("Then the table crisis returned, deadlier. In World War II every new gun needed a firing table; each entry took roughly fifty hand calculations, and rooms of human computers could not keep up. That crisis funded ENIAC (1945) — electronic, thousands of times faster than any predecessor, yet reprogrammable only by days of manual rewiring. John von Neumann's 1945 report proposed the resolution described in section 0.4, and by 1949 EDVAC-class machines ran stored programs: Babbage's 1821 dream, finally real — 128 years later."));
sn.push(P([T("Key insight: ", { bold: true }), T("for over a century the problem never changed — humans + arithmetic = errors — and neither did the dream: one general machine; change the instructions, not the machine.")]));

sn.push(H2("0.2 Bits & Boolean Logic"));
sn.push(P("A switch has two reliable states, ON and OFF, labelled 1 and 0 — a bit. A row of switches becomes a number by positional weighting, exactly like decimal place value but in powers of two: with weights 8-4-2-1, the pattern 1011 means 8 + 0 + 2 + 1 = 11. Four bits give 2⁴ = 16 patterns; n bits give 2ⁿ."));
sn.push(P("Inside a circuit a bit is a voltage: logic 0 is a low level near 0 V (ground), logic 1 a high level, typically +5 V or +3 V (Mano Ch.1; Hamacher A.1). Between the maximum voltage accepted as 0 and the minimum accepted as 1 lies a FORBIDDEN RANGE in which signals must not settle. This gap is binary's insurance policy against electrical noise: random disturbances can wiggle a voltage slightly but cannot push it across the whole forbidden band, so a 0 is never misread as a 1. This is why two states beat ten — maximum reliability, minimum error."));
sn.push(P("Claude Shannon's 1937 insight is that wiring topology IS logic: two switches in SERIES implement AND (current flows only if both are closed); two switches in PARALLEL implement OR (either path suffices); a normally-closed contact implements NOT. From these come the standard gates — AND (1 only when both inputs are 1), OR (1 when at least one is 1), NOT (inverts), XOR (1 only when the inputs DIFFER)."));
sn.push(P("The payoff is the half adder, the first proof that logic can do arithmetic. Adding two bits: 0+0=00, 0+1=01, 1+0=01, 1+1=10 (carry 1, sum 0). The sum column is exactly XOR — 1 when the inputs differ — and the carry column is exactly AND — 1 only when both are 1. So Sum = A ⊕ B and Carry = A · B: two gates that add. Chaining such adders adds whole numbers; the arithmetic unit of every processor is this idea, scaled up. (Boolean algebra offers a full toolkit for designing and simplifying such circuits — Hamacher Appendix A — which later subjects develop; for Unit 0, the half adder is the point.)"));
sn.push(P([T("Key insight: ", { bold: true }), T("numbers → bits → voltages → gates → arithmetic. Metal and electricity can add; everything else is scale.")]));

sn.push(H2("0.3 From Relays to Transistors — Generations and Moore's Law"));
sn.push(P("With the logic fixed, the engineering question is what to build the switch from. The RELAY uses an electromagnet to move a metal contact arm: logic works, but at ~1 kHz, with audible clicks and mechanical wear. The VACUUM TUBE removes motion — a heated cathode emits electrons and the control grid's voltage lets them pass (1) or blocks them (0) — switching around 1 MHz; but the heated filament makes tubes hot, power-hungry and short-lived. ENIAC carried 18,000 of them, weighed 27 tonnes, drew 150 kW, and lost roughly one tube per day. The TRANSISTOR (Bardeen, Brattain and Shockley, Bell Labs, 1947) switches electrons within solid silicon: no filament, no moving parts — small, cool, reliable."));
sn.push(P("Modern gates are built directly from transistors (Hamacher A.2): a NOT gate is one transistor and a resistor — input low leaves the transistor open and the output pulled high; input high closes it, dragging the output to ground. Transistors in SERIES yield NAND (output low only when both conduct); in PARALLEL, NOR. Modern processors use CMOS, pairing complementary NMOS and PMOS transistors so that a gate consumes almost no power in a steady state, only while switching — the reason billions of gates can share one chip without melting it."));
sn.push(P("The history is formalised as four generations (Hamacher Ch.1): 1st (1945–1955) vacuum tubes, the stored-program concept, assembly language; 2nd (1955–1965) transistors, smaller and faster logic, high-level languages such as Fortran; 3rd (1965–1975) integrated circuits placing many transistors on one silicon chip, with pipelining and cache memory concepts emerging; 4th (1975–present) Very Large Scale Integration (VLSI) with billions of transistors, giving rise to the microprocessor. Note carefully what evolved: the ORGANIZATION. The stored-program architecture has remained the same dream since 1945."));
sn.push(P("MOORE'S LAW (Gordon Moore, 1965) is the observation that transistor count per chip doubles roughly every two years: 1 (1947) → 2,300 (Intel 4004, 1971 — the first microprocessor) → 1.2 million (Intel 486, 1989) → about a billion (Core i7, 2008) → beyond 100 billion today at ~2 nm feature sizes. On a logarithmic scale this is a straight line — exponential growth. It held because integrated circuits photograph their transistors onto silicon, so shrinking the features multiplies the count at little extra cost — and because the industry treated the doubling as a target. It is not a law of physics, and it is slowing as features approach atomic scale — which is why future performance depends increasingly on better architecture rather than smaller switches. Memory followed the same path: early main memory stored each bit as the magnetisation of a tiny hand-threaded iron ring (core memory); transistor-based DRAM and SRAM shrank that bit to one of billions of cells on a chip."));
sn.push(P([T("Key insight: ", { bold: true }), T("the Boolean logic never changed after 1854 — we found a better switch, and Moore's law made it a billion times smaller, faster and cheaper.")]));

sn.push(H2("0.4 The Von Neumann Shift"));
sn.push(P("ENIAC exposed the final missing idea. It computed electronically in milliseconds, yet changing its program meant days of replugging cables — because the program WAS the wiring. John von Neumann's 1945 report resolved it with one move: instructions are information, and the machine already has a store for information — so keep the program IN memory, beside the data, encoded as numbers. Looking at such a memory, you cannot tell which numbers are instructions and which are data — and neither can the machine, until it interprets them. That is the whole revolution: a new program is just new numbers loaded into memory. No rewiring. One machine, infinite programs — Babbage's dream, Turing's proof, von Neumann's engineering. Machines built on this principle (EDVAC, 1949) began the modern era, and every computer you own is a von Neumann machine."));
sn.push(P([T("Looking ahead: ", { bold: true }), T("HOW the machine actually fetches, decodes and executes those stored numbers — the functional units, registers, buses and the instruction cycle — is precisely where Unit 1 (Basic Structure of Computers, CO1) begins. Read Hamacher Ch. 1 alongside these notes.")]));

sn.push(H1("Question Bank (answers provided separately in class)"));
sn.push(...qbank(false));

// ════════════════════════════════════════════════════════════
// 3. ANSWER KEY
// ════════════════════════════════════════════════════════════
const ak = [];
ak.push(H1("Unit 0 — Before the Machine · Answer Key (Instructor Copy)"));
ak.push(P([T("Model answers with mark allocation and Bloom's taxonomy levels. Pattern: Part A = Remember/Understand (1 mark); Part B = Understand/Apply (2 marks); Part C = Apply/Analyze/Evaluate (5 marks).", { italics: true })]));
ak.push(...qbank(true));

// ── write all three ──
Promise.all([
  Packer.toBuffer(baseDoc(pg)).then(b => fs.writeFileSync(path.join(OUT, "Unit0_PresenterGuide.docx"), b)),
  Packer.toBuffer(baseDoc(sn)).then(b => fs.writeFileSync(path.join(OUT, "Unit0_StudentNotes.docx"), b)),
  Packer.toBuffer(baseDoc(ak)).then(b => fs.writeFileSync(path.join(OUT, "Unit0_AnswerKey.docx"), b)),
]).then(() => console.log("all three docs written to " + OUT));
