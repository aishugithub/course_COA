// ════════════════════════════════════════════════════════════════
//  Unit0_3.jsx  —  "From Relays to Chips"
//  Unit 0, Lesson 3 of 3
//
//  STORY ARC:
//    Relay → Vacuum tube → Transistor → IC → MOSFET → Modern SoC
//    Each transition: what was wrong with the previous switch,
//    what the new one fixed, and what it enabled.
//    Transistor as memory. Moore's Law. Von Neumann bottleneck.
//
//  This lesson answers: HOW did the physical switch evolve, and
//  WHY does the chip in your phone have 100 billion transistors?
//
//  All template rules honoured.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

export default function Unit0_3({ student, onUnitComplete }) {

  // ── ALL HOOKS — unconditional, fixed order ──────────────────────
  const [stage, setStage] = useState(0);

  // Spark — student drags a slider to see ENIAC → phone comparison
  const [sparkYear, setSparkYear] = useState(1945);

  // Build — no timer gate (free navigation per feedback)
  const [buildIdx, setBuildIdx]           = useState(0);
  const [buildMode, setBuildMode]         = useState("plain");

  // Build interactive states
  const [tubeOn, setTubeOn]               = useState(false);   // vacuum tube sim
  const [transOn, setTransOn]             = useState(false);   // transistor sim
  const [memBit, setMemBit]               = useState(null);    // transistor memory
  const [memRead, setMemRead]             = useState(false);
  const [mooreYear, setMooreYear]         = useState(1971);    // Moore's law slider

  // See It — side-by-side generation comparison + adder tech comparison
  const [compareIdx, setCompareIdx]       = useState(0);
  const [adderTech, setAdderTech]         = useState("relay");  // "relay"|"tube"|"transistor"
  const [adderA, setAdderA]               = useState(0);        // 1-bit input A for adder demo
  const [adderB, setAdderB]               = useState(0);        // 1-bit input B for adder demo

  // Try It — ENIAC wire-programming sim (feel the pain, then see the fix)
  const [wires, setWires]                 = useState([]);
  const [wireFrom, setWireFrom]           = useState(null);
  const [tryPhase, setTryPhase]           = useState(0); // 0=wire 1=success 2=reprogram 3=vonneumann

  // Challenge — arrange generations in order
  const [order, setOrder]                 = useState(null);
  const [selected, setSelected]           = useState(null);
  const [orderResult, setOrderResult]     = useState(null); // null|"right"|"wrong"
  const [shuffled] = useState(() => {
    const items = ["Mechanical Relay","Vacuum Tube","Transistor","Integrated Circuit","MOSFET / VLSI"];
    const s = [...items];
    for (let i = s.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [s[i], s[j]] = [s[j], s[i]];
    }
    return { correct: items, options: s };
  });

  // Quiz
  const [quizIdx, setQuizIdx]             = useState(0);
  const [quizSel, setQuizSel]             = useState(null);
  const [quizFeedback, setQuizFeedback]   = useState(null);
  const [quizAttempts, setQuizAttempts]   = useState(0);
  const [quizFinished, setQuizFinished]   = useState(false);

  // No build timer — free navigation (removed per feedback)

  // ── CONTENT ────────────────────────────────────────────────────

  // Moore's Law data points: year → approximate transistor count
  const moorePts = [
    { year: 1971, count: 2300,          chip: "Intel 4004" },
    { year: 1974, count: 6000,          chip: "Intel 8080" },
    { year: 1979, count: 29000,         chip: "Intel 8086" },
    { year: 1985, count: 275000,        chip: "Intel 386" },
    { year: 1993, count: 3100000,       chip: "Intel Pentium" },
    { year: 2000, count: 42000000,      chip: "Intel P4" },
    { year: 2006, count: 291000000,     chip: "Intel Core 2" },
    { year: 2012, count: 1400000000,    chip: "Intel Ivy Bridge" },
    { year: 2018, count: 8000000000,    chip: "Apple A12" },
    { year: 2024, count: 100000000000,  chip: "Apple M3 Ultra" },
  ];

  // Spark: what did computing look like in different years?
  function sparkData(year) {
    if (year <= 1945) return { label: "ENIAC (1945)", weight: "27 tonnes", transistors: "18,000 vacuum tubes", speed: "~100 kHz", size: "167 m²", power: "150 kW" };
    if (year <= 1960) return { label: "Transistor Computer (1956)", weight: "~500 kg", transistors: "10,000 transistors", speed: "~1 MHz", size: "2 m²", power: "~1 kW" };
    if (year <= 1975) return { label: "Intel 4004 Era (1971)", weight: "~50g (chip)", transistors: "2,300 transistors", speed: "740 kHz", size: "12 mm²", power: "1W" };
    if (year <= 1990) return { label: "Intel 386 (1985)", weight: "~5g (chip)", transistors: "275,000 transistors", speed: "16 MHz", size: "100 mm²", power: "5W" };
    if (year <= 2005) return { label: "Pentium 4 (2000)", weight: "~20g (package)", transistors: "42 million transistors", speed: "1.5 GHz", size: "217 mm²", power: "75W" };
    if (year <= 2015) return { label: "Apple A7 (2013)", weight: "~3g (die)", transistors: "1 billion transistors", speed: "1.3 GHz (dual-core)", size: "102 mm²", power: "~2W" };
    return { label: "Apple M3 Ultra (2024)", weight: "~6g (die)", transistors: "100+ billion transistors", speed: "4.0 GHz (24-core)", size: "519 mm²", power: "~22W" };
  }

  const concepts = [
    {
      title: "🔩 The Mechanical Relay — First Electrical Switch",
      plain: `A relay is an electrically controlled mechanical switch. Send a small current through a coil of wire, and the coil becomes an electromagnet. The magnet pulls a metal arm (the armature) down, closing a second, larger circuit.

When you stop the current, a spring pushes the arm back up — opening the circuit again.

Two computers used relays:
• Konrad Zuse's Z3 (Germany, 1941) — 2,000 relays, considered the first programmable digital computer
• Harvard Mark I (USA, 1944) — 3,500 relays, clunking away for the US Navy

You could literally hear these computers working — a constant clicking as the relays opened and closed. Each click was one switching operation.

Problems that killed the relay:
• Slow: mechanical movement takes ~1–10 milliseconds. That's only ~1,000 operations per second.
• Noisy: the clicking was constant and loud
• Wear out: a metal arm can only bend so many times before it breaks
• Sparking: metal contacts arc as they touch, causing electrical interference

But relays proved that electrical switching could compute — that Boolean logic could be built from physical components.`,
      tech: `Electromagnetic relay: a solenoid coil generates H = nI/l (ampere-turns/metre). The resulting magnetic flux attracts a ferromagnetic armature via F = B²A/2μ₀. Contact bounce (1–5ms) caused debouncing circuits. Z3 (Zuse, 1941): 2,000 relays, 22-bit floating point, ~5.3Hz clock. Harvard Mark I (Aiken/IBM, 1944): 3,500 relays, decimal arithmetic, 72 accumulators. Relay switching time: ~1–10ms → max ~1kHz operation. MTBF per relay: ~10⁶ operations (weeks of continuous use). Shannon (1937) analysed relay networks using Boolean algebra in his master's thesis — laying the theoretical foundation. Relays persist in power control (contactors), safety systems, and automotive applications today.`,
      hook: "Clicking was too slow — what switched faster? →",
      interactive: null,
    },
    {
      title: "💡 The Vacuum Tube — First Electronic Switch",
      plain: `A vacuum tube is a glass bulb with the air removed. Inside, a heated wire (the cathode) releases electrons — this is called thermionic emission. Those electrons flow toward a positively charged plate (the anode).

Between cathode and anode sits a wire mesh called the grid. A small voltage on the grid controls the electron flow:
• Positive grid voltage → electrons flow → tube is ON (1)
• Negative grid voltage → electrons blocked → tube is OFF (0)

No moving parts. The switching happens at the speed of electrons — microseconds instead of milliseconds. 1,000× faster than a relay.

ENIAC (1945): 18,000 vacuum tubes. Each tube was about the size of your thumb. Together they filled a room and consumed 150 kilowatts of power — enough to power a small street.

The problems:
• Heat: each tube got hot enough to burn your hand. 18,000 of them made the room an oven.
• Failure: a hot filament eventually burns out, like a light bulb. ENIAC failed roughly one tube per day.
• Size: a thumb-sized switch doesn't scale to billions.
• Power: 150 kW just for one computer.

👇 See how a tube switches:`,
      tech: `Thermionic triode (de Forest, 1906): cathode heated to ~800°C emits electrons via Richardson-Dushman equation J = A·T²·e^(-φ/kT). Grid voltage Vg controls plate current: ΔI_p = g_m·ΔV_g (transconductance). Operating regions: cutoff (Vg < V_cutoff, tube OFF), saturation (full conduction, tube ON). Switching time: ~1–10μs → ~100kHz–1MHz operation. ENIAC: 18,000 6SN7 dual triodes, 150kW power, ~1.9m² footprint, MTBF ~3 hours (system-wide). Tube failure modes: cathode depletion, grid emission, envelope leak. Legacy: vacuum tubes used in high-power RF amplifiers, guitar amplifiers (valued for harmonic distortion characteristics), and specialised scientific instruments.`,
      hook: "Still too big and hot — what replaced the tube? →",
      interactive: "tube",
    },
    {
      title: "🔬 The Transistor — Solid State Revolution",
      plain: `In December 1947, three physicists at Bell Labs — John Bardeen, Walter Brattain, and William Shockley — placed two tiny wire contacts on a germanium crystal and discovered that a tiny current at one contact controlled a large current at the other.

They had invented the transistor.

No glass. No vacuum. No heater. Just a solid piece of semiconductor material with three terminals:
• Emitter — where current enters
• Base — the control terminal (tiny current here controls…)
• Collector — …the large current that flows here

Apply a small voltage to the base → large current flows from emitter to collector → transistor ON (1)
Remove the voltage from the base → current stops → transistor OFF (0)

What changed:
• Size: from thumb-sized tubes to fingernail-sized, then pinhead, then microscopic
• Speed: microseconds → nanoseconds → picoseconds
• Power: watts per switch → milliwatts → microwatts
• Reliability: no burning filament — transistors last decades

Bardeen, Brattain, and Shockley won the Nobel Prize in Physics in 1956.
This moment is arguably the most consequential invention of the 20th century.

👇 Compare tube vs transistor:`,
      tech: `Bipolar Junction Transistor (BJT): NPN or PNP sandwich of doped semiconductors. Minority carrier injection across base-emitter junction (forward biased) controls collector current: I_C = β·I_B (current gain β = 20–500). Shockley diode equation: I = I_S(e^(V/nV_T)−1). First point-contact transistor (Bardeen & Brattain, 1947): germanium, ~1cm. First silicon BJT (Teal, TI, 1954). BJT switching time: ~1–100ns. The planar process (Hoerni, Fairchild, 1959) allowed mass-produced flat transistors — enabling ICs. MOSFET (Kahng & Atalla, Bell Labs, 1960) uses electric field (not current) to control channel — lower power, better scaling, now the dominant transistor type. 2024 TSMC 2nm: FinFET with ~2nm gate length, ~10¹⁰ transistors/cm².`,
      hook: "One transistor is good — millions on one chip is better →",
      interactive: "transistor",
    },
    {
      title: "🗄️ Transistor as Memory — The Stored-Program Made Physical",
      plain: `Here's something remarkable: the same transistor used as a switch can also STORE a bit of information.

Connect two transistors in a cross-coupled pair (each controlling the other's gate) and you get a bistable circuit — it naturally wants to sit in one of two stable states. It "remembers" which state it was last pushed into.

State 1: First transistor ON, second transistor OFF → stores a 1
State 0: First transistor OFF, second transistor ON → stores a 0

This is an SRAM (Static RAM) cell — 6 transistors holding one bit. As long as power is applied, it remembers its state indefinitely.

DRAM (Dynamic RAM) is even simpler: 1 transistor + 1 capacitor. The capacitor holds charge (1) or not (0). But charge leaks away in milliseconds, so DRAM must be "refreshed" thousands of times per second.

Why does this matter? Because the SAME technology that computes (transistors in gates) also stores (transistors in memory cells). This is what makes Von Neumann's stored-program architecture physically possible — instructions live in transistor memory alongside data, fetched over the same bus.

👇 Try setting and reading a memory bit:`,
      tech: `SRAM cell (6T): two cross-coupled CMOS inverters (4 transistors) + 2 access transistors. Bistable: stable in either state while powered. Access: wordline activates access transistors, bitlines read/write the latch. Read disturb: sense amplifier detects tiny voltage differential (~100mV). Write: force bitlines, access transistors override latch. DRAM cell (1T1C): MOSFET + storage capacitor (C ≈ 10–30fF). Charge represents 1; discharged = 0. Leakage current (ITOX, junction leakage) requires refresh every ~64ms. DRAM density advantage: 6× fewer transistors per bit vs SRAM. Flash memory (floating-gate or charge-trap MOSFET): non-volatile — stores charge on isolated gate even without power. NOR flash: byte-addressable (code storage). NAND flash: block-erasable (SSDs, SD cards).`,
      hook: "Now let's put millions of these on one chip →",
      interactive: "memory",
    },
    {
      title: "📦 Integrated Circuits & Moore's Law",
      plain: `In 1958, Jack Kilby at Texas Instruments and Robert Noyce at Fairchild Semiconductor independently solved the same problem: how do you connect many transistors without soldering individual wires?

Answer: don't solder them at all. Grow them all on the same piece of silicon and use deposited metal layers to connect them. That's an integrated circuit (IC) — also called a chip.

First IC (Kilby, 1958): one transistor, three resistors, one capacitor — all on one germanium chip the size of a pencil eraser. Kilby won the Nobel Prize in 2000.

Then in 1965, Gordon Moore (co-founder of Intel) made an observation: the number of transistors on an IC was roughly doubling every year (later revised to every two years). He predicted this trend would continue.

Moore's Law became a self-fulfilling prophecy — the entire semiconductor industry organised itself to meet Moore's prediction. For 50 years, it held.

The consequences:
• 1971: Intel 4004 — 2,300 transistors
• 2024: Apple M3 Ultra — 100+ billion transistors

Same Von Neumann architecture. Same Boolean logic. Just exponentially more transistors, exponentially smaller and faster.

👇 Drag the slider to watch Moore's Law in action:`,
      tech: `Kilby's IC (TI, 1958): germanium substrate, mesa transistors, gold wire bonds. Noyce's planar IC (Fairchild, 1959): silicon, oxide isolation, aluminium interconnect — manufacturable at scale. Moore's Law (1965 paper): "Cramming more components onto integrated circuits" — observed doubling per year, later ~2 years. Physical mechanism: lithographic feature size scaling (Dennard scaling: voltage, current scale with geometry → power density constant). Dennard scaling broke ~2005 (leakage current dominated at <90nm). Post-Dennard era: multi-core, heterogeneous integration (chiplets), 3D stacking (TSMC CoWoS). FinFET (Intel, 2011): 3D gate wraps channel on three sides — better gate control at sub-22nm. Gate-all-around (GAA) nanosheet transistors: Intel 20A (2024), TSMC N2 (2025).`,
      hook: "One final piece — how all this gives us the modern SoC →",
      interactive: "moore",
    },
    {
      title: "🚀 The Modern SoC — Everything on One Chip",
      plain: `A System-on-Chip (SoC) is what happens when you take Moore's Law to its logical conclusion: put the entire computer on one piece of silicon.

A modern SoC like Apple's M3 Ultra contains:
• CPU cores (the Von Neumann processor — Unit 1's topic)
• GPU cores (thousands of parallel processors for graphics and AI)
• Neural Processing Unit (NPU) for AI acceleration
• Memory controllers
• L1, L2, L3 cache (Unit 4's topic)
• I/O controllers (Unit 5's topic)
• Security processor

All connected by a high-speed internal bus — far faster than any external connection could be.

The Von Neumann bottleneck — the speed mismatch between the fast CPU and the slower memory — is fought with layers of cache (small, fast memory close to the CPU). This is why Units 3 and 4 of this course exist.

From 2,000 clicking relays in Zuse's Z3 to 100 billion silent transistors in M3 Ultra — the fundamental logic hasn't changed. AND, OR, NOT, XOR. Full adders. Memory cells. The stored-program concept.

Everything in this course — pipelining, cache, addressing modes, interrupts — is engineering built on top of this foundation you now understand.`,
      tech: `Modern SoC integration: CPU (OoO superscalar, branch prediction, speculative execution — Unit 3); Last-level cache (SRAM, 12–192MB — Unit 4); DRAM interface (LPDDR5X, HBM3 — Unit 4); GPU (SIMD/SIMT massively parallel, 60–76 shader cores); NPU (systolic array matrix multiply for DNN inference); PCIe/USB/Thunderbolt controllers (Unit 5). Apple M3 Ultra: 92-core GPU, 32-core CPU, 2nm process, 184GB unified LPDDR5 memory (192GB/s bandwidth). The Von Neumann bottleneck manifests as DRAM bandwidth saturation — addressed by: wider memory buses, HBM (High Bandwidth Memory, 3D-stacked DRAM), large on-die SRAM caches, and compute-near-memory architectures. Processing-in-Memory (PIM) and Compute-in-Memory (CiM) are active research areas attempting to eliminate the bottleneck entirely.`,
      hook: "See the full hardware evolution side by side →",
      interactive: null,
    },
  ];

  // See It — side-by-side generation comparisons
  const generations = [
    { name: "Mechanical Relay", era: "1940s", switch: "Electromagnet + metal arm", size: "~5cm", speed: "~1 kHz", power: "~1W/switch", reliability: "Wears out (mechanical)", example: "Z3, Harvard Mark I", color: "#78350f" },
    { name: "Vacuum Tube", era: "1945–55", switch: "Thermionic emission", size: "~5cm (thumb)", speed: "~1 MHz", power: "~5W/tube", reliability: "Burns out (~weeks)", example: "ENIAC, UNIVAC", color: "#1e3a5f" },
    { name: "Transistor (BJT)", era: "1956–65", switch: "Semiconductor junction", size: "~1cm → mm", speed: "~100 MHz", power: "~1mW", reliability: "Decades", example: "IBM 7090, CDC 1604", color: "#14532d" },
    { name: "Integrated Circuit", era: "1965–75", switch: "Multiple transistors on one chip", size: "mm → µm", speed: "~1 GHz", power: "µW per gate", reliability: "Decades", example: "Intel 4004, Motorola 6800", color: "#4c1d95" },
    { name: "MOSFET / VLSI", era: "1975–now", switch: "Field-effect, voltage-controlled", size: "µm → nm (2nm today)", speed: "~5 GHz per core", power: "fJ per switch", reliability: "Decades", example: "Every modern CPU/GPU/phone", color: "#052e16" },
  ];

  // Wire programming nodes for Try It
  const nodes = ["INPUT", "ALU", "OUTPUT", "MEMORY"];
  const validWires = [{ from: "INPUT", to: "ALU" }, { from: "ALU", to: "OUTPUT" }];
  function isValidProgram() {
    return validWires.every(vw => wires.some(w => (w.from === vw.from && w.to === vw.to) || (w.from === vw.to && w.to === vw.from)));
  }

  // Quiz
  const quiz = [
    {
      q: "What physical phenomenon does a vacuum tube rely on to switch current on and off?",
      options: ["A) Mechanical arm movement controlled by a spring", "B) Thermionic emission — a heated cathode releases electrons, controlled by a grid voltage", "C) Semiconductor junction — voltage at one terminal controls current at another", "D) Capacitor charge and discharge through a resistor"],
      answer: 1,
      hints: ["Think about what 'vacuum tube' implies — there's no air inside, and something is heated.", "A heated wire releases electrons. A grid voltage steers those electrons.", "The grid voltage either allows or blocks electron flow from cathode to anode — that's the switching action."],
      explanation: "A vacuum tube uses thermionic emission: a heated cathode releases electrons into the vacuum. The grid voltage controls whether these electrons reach the anode — positive grid = ON, negative grid = OFF.",
    },
    {
      q: "What were the two most critical problems with vacuum tubes that led to their replacement?",
      options: ["A) They were too small and required specialised handling", "B) They generated significant heat and had short lifespans due to burning out", "C) They were incompatible with binary arithmetic", "D) They could not switch faster than 1 Hz"],
      answer: 1,
      hints: ["Think about what a vacuum tube has in common with an incandescent light bulb.", "A heated filament is the key — what happens to heated filaments over time?", "Heat and burnout. ENIAC lost about one tube per day across its 18,000 tubes."],
      explanation: "Vacuum tubes contained a heated filament that eventually burned out (like a light bulb), and they generated enormous heat. ENIAC consumed 150kW and required air conditioning — and still lost ~1 tube per day.",
    },
    {
      q: "Who invented the transistor, and in which year?",
      options: ["A) Jack Kilby and Robert Noyce at Intel, 1958", "B) John von Neumann at the Institute for Advanced Study, 1945", "C) Bardeen, Brattain, and Shockley at Bell Labs, 1947", "D) Gordon Moore and Andy Grove at Fairchild, 1965"],
      answer: 2,
      hints: ["The transistor was invented at a famous research laboratory, not a university.", "Bell Labs (AT&T's research division) was the home of this invention.", "Three physicists shared the Nobel Prize in Physics in 1956 for this invention."],
      explanation: "John Bardeen, Walter Brattain, and William Shockley invented the transistor at Bell Labs in December 1947. They received the Nobel Prize in Physics in 1956.",
    },
    {
      q: "What is the key advantage of a transistor over a vacuum tube?",
      options: ["A) Transistors can perform floating-point arithmetic directly", "B) Transistors are solid-state — no vacuum, no heater — making them smaller, cooler, and far more reliable", "C) Transistors switch using light instead of electricity", "D) Transistors can only be turned on, not off, making them faster"],
      answer: 1,
      hints: ["Compare the physical construction: glass bulb with heated wire vs a solid piece of semiconductor.", "No vacuum = no fragile glass envelope. No heater = no burning filament. What does that mean for reliability?", "Solid-state means all switching happens through semiconductor physics, not mechanical or thermal processes."],
      explanation: "Transistors are solid-state — no vacuum, no heated filament. They are orders of magnitude smaller, generate far less heat, consume much less power, and last decades rather than weeks.",
    },
    {
      q: "What is an Integrated Circuit (IC)?",
      options: ["A) A circuit where all components are connected by hand-soldered wires on a board", "B) Multiple transistors, resistors, and capacitors grown on and connected within a single piece of silicon", "C) A circuit that can integrate analogue and digital signals simultaneously", "D) A standardised circuit board that plugs into a computer motherboard"],
      answer: 1,
      hints: ["'Integrated' means brought together into one. What is brought together?", "The breakthrough was eliminating the need to solder individual components together.", "All components — transistors, resistors, capacitors — are formed on one semiconductor substrate and connected by deposited metal layers."],
      explanation: "An IC (chip) grows all components — transistors, resistors, capacitors — on a single silicon substrate and connects them with deposited metal interconnects. No hand-soldering. This enabled mass production and exponential miniaturisation.",
    },
    {
      q: "Moore's Law states that transistor count on a chip doubles roughly every 2 years. What was the count on the Intel 4004 (1971) vs Apple M3 Ultra (2024)?",
      options: ["A) 2,300 (4004) vs ~100 billion (M3 Ultra)", "B) 29,000 (4004) vs ~1 billion (M3 Ultra)", "C) 2,300 (4004) vs ~1 million (M3 Ultra)", "D) 275,000 (4004) vs ~10 billion (M3 Ultra)"],
      answer: 0,
      hints: ["The Intel 4004 was the first microprocessor and was extremely simple by any modern standard.", "2024 chips have transistors numbering in the tens of billions.", "2,300 in 1971 → 100 billion in 2024. That's roughly 53 years of doubling every 2 years = ~26 doublings = 2²⁶ ≈ 67 million times more."],
      explanation: "Intel 4004 (1971): 2,300 transistors. Apple M3 Ultra (2024): ~100 billion transistors. That's roughly a 43-million-fold increase over 53 years — the consequence of Moore's Law compounding for over five decades.",
    },
    {
      q: "How does a transistor store a bit of information (as in SRAM)?",
      options: ["A) The transistor physically moves to two different positions representing 0 and 1", "B) Two cross-coupled transistors form a bistable latch — it holds its ON/OFF state indefinitely until changed", "C) Charge is stored on the transistor gate and slowly leaks away", "D) The transistor oscillates between states and the frequency represents the stored bit"],
      answer: 1,
      hints: ["Think about 'bistable' — a system with two stable states that stays put without active input.", "Two inverters connected back-to-back each hold the other in its current state.", "This cross-coupled pair can be set to 0 or 1 and will hold that value as long as power is applied."],
      explanation: "An SRAM cell uses two cross-coupled inverters (4 transistors + 2 access transistors = 6T). The cross-coupling creates two stable states. Once set to 0 or 1, the circuit holds that state indefinitely while powered.",
    },
    {
      q: "What is the Von Neumann bottleneck?",
      options: ["A) The CPU can only execute one instruction at a time", "B) The limited bandwidth between CPU and main memory means the CPU often waits for data", "C) Binary arithmetic is slower than decimal for the same computation", "D) Von Neumann's architecture doesn't support input/output devices"],
      answer: 1,
      hints: ["Von Neumann's architecture stores instructions and data in the same memory. What happens when the CPU needs data faster than memory can supply it?", "Think of a fast sports car stuck on a narrow country road — the road is the bottleneck.", "Modern CPUs run at GHz; DRAM access takes nanoseconds. The CPU waits. That waiting is the bottleneck."],
      explanation: "The Von Neumann bottleneck: CPUs became far faster than DRAM can supply data. Since instructions and data share the same memory bus, the CPU frequently stalls waiting for memory. Cache (Unit 4) is the primary solution.",
    },
    {
      q: "A System-on-Chip (SoC) places CPU, GPU, memory controllers, and other components on one die. What is the primary advantage of this integration?",
      options: ["A) It makes the chip easier to manufacture in smaller factories", "B) On-chip communication is far faster and more power-efficient than communication between separate chips", "C) It allows the chip to run without a power supply", "D) It reduces the need for an operating system"],
      answer: 1,
      hints: ["Think about what changes when components that used to be on separate chips are now on the same piece of silicon.", "Data travelling 1mm on a chip vs data travelling 10cm between chips on a board — what changes?", "Distance = latency and power. On-chip interconnects are shorter, faster, and consume less energy."],
      explanation: "On-chip integration means data between CPU, GPU, and memory travels millimetres at very high bandwidth, rather than centimetres over PCB traces with much lower bandwidth and higher latency. Apple's Unified Memory architecture is a prime example.",
    },
    {
      q: "Konrad Zuse's Z3 (1941) used 2,000 relays. ENIAC (1945) used 18,000 vacuum tubes. The Intel 4004 (1971) used 2,300 transistors on one chip. What is the common thread across all three?",
      options: ["A) They all used the Von Neumann stored-program architecture", "B) They all implemented the same Boolean switching logic — AND, OR, NOT — just using different physical switches", "C) They all ran at the same clock speed", "D) They were all built by the same team of engineers"],
      answer: 1,
      hints: ["They used very different physical technologies. What stayed the same?", "Each device — relay, tube, transistor — was being used as a binary switch. What do binary switches implement?", "Boolean logic doesn't care what the switch is made of. The logic is the same; only the physics changes."],
      explanation: "All three implement the same Boolean logic — AND, OR, NOT gates built from binary switches. The physics changed (mechanical → thermionic → semiconductor), but the underlying computation remained identical. Hardware evolves; the logic persists.",
    },
  ];

  // ── STYLES ──────────────────────────────────────────────────────
  const s = {
    wrap: { minHeight: "100vh", background: "linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#1a0a2e 100%)", color: "#e2e8f0", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: "0 0 80px" },
    header: { background: "linear-gradient(90deg,#1a0a2e,#1e293b)", padding: "14px 16px 10px", borderBottom: "1px solid #7c3aed" },
    unitLabel: { fontSize: "0.65rem", color: "#a78bfa", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 },
    unitTitle: { fontSize: "clamp(1rem,3vw,1.2rem)", fontWeight: 800, color: "#f1f5f9" },
    stageBar: { display: "flex", gap: 4, padding: "8px 16px", overflowX: "auto", background: "#0f172a", borderBottom: "1px solid #1e293b" },
    stageDot: (active, done) => ({ fontSize: "0.6rem", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: active ? 700 : 400, background: done ? "#3b0764aa" : active ? "#4c1d95" : "#1e293b", color: done ? "#a78bfa" : active ? "#c4b5fd" : "#475569", border: done ? "1px solid #7c3aed44" : active ? "1px solid #a78bfa" : "1px solid #1e293b" }),
    card: { background: "#1e293b", borderRadius: 16, padding: "18px 16px", margin: "14px 12px", border: "1px solid #334155" },
    h2: { fontSize: "clamp(0.95rem,2.8vw,1.15rem)", fontWeight: 700, color: "#f1f5f9", marginBottom: 10 },
    p: { color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.75, marginBottom: 10 },
    btn: (c = "#a78bfa") => ({ background: c, color: "#0f172a", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", marginTop: 10, display: "inline-block" }),
    btnGhost: { background: "transparent", color: "#64748b", border: "1px solid #334155", borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", marginTop: 10 },
    toggleBtn: (active) => ({ flex: "1 1 100px", padding: "8px 12px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", background: active ? "#a78bfa" : "#0f172a", color: active ? "#0f172a" : "#64748b" }),
    quizOption: (sel, correct, wrong) => ({ background: correct ? "#14532d" : wrong ? "#450a0a" : sel ? "#3b0764" : "#0f172a", border: correct ? "2px solid #4ade80" : wrong ? "2px solid #ef4444" : sel ? "2px solid #a78bfa" : "1px solid #334155", borderRadius: 10, padding: "13px 16px", marginBottom: 8, cursor: "pointer", fontSize: "0.84rem", color: "#f1f5f9" }),
    infoBox: (color = "#a78bfa") => ({ background: color + "18", border: `1px solid ${color}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }),
  };

  const stageLabels = ["✨ Spark", "📖 Build", "📽 See It", "🧪 Try It", "🎯 Challenge", "📝 Quiz"];

  // ── INTERACTIVE BUILD ELEMENTS ──────────────────────────────────

  function renderTubeInteractive() {
    return (
      <div style={{ margin: "14px 0" }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
          {/* Vacuum tube diagram */}
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 80, height: 120, margin: "0 auto" }}>
              {/* Glass envelope */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50% 50% 30% 30%", border: `2px solid ${tubeOn ? "#fbbf24" : "#334155"}`, background: tubeOn ? "#fbbf2411" : "#0f172a", transition: "all 0.3s" }} />
              {/* Cathode (heater) */}
              <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", width: 4, height: 40, background: tubeOn ? "#ef4444" : "#475569", borderRadius: 2, boxShadow: tubeOn ? "0 0 10px #ef4444" : "none", transition: "all 0.3s" }} />
              {/* Grid */}
              <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", width: 30, height: 2, background: "#94a3b8" }} />
              {/* Anode */}
              <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", width: 30, height: 4, background: tubeOn ? "#fbbf24" : "#475569", borderRadius: 2, transition: "all 0.3s" }} />
              {/* Electrons */}
              {tubeOn && [0,1,2].map(i => (
                <div key={i} style={{ position: "absolute", left: "50%", width: 4, height: 4, borderRadius: "50%", background: "#60a5fa", animation: `none`, bottom: 30 + i * 15, transform: "translateX(-50%)", opacity: tubeOn ? 1 : 0, transition: "opacity 0.3s" }} />
              ))}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: 4 }}>Vacuum Tube</div>
          </div>
          {/* Labels */}
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.8 }}>
            <div>🔴 Cathode (heated filament)</div>
            <div>⬜ Grid (control voltage)</div>
            <div>🟡 Anode (plate)</div>
            {tubeOn && <div style={{ color: "#60a5fa" }}>🔵 Electrons flowing → ON</div>}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: tubeOn ? "#fbbf24" : "#64748b", fontWeight: 700, marginBottom: 8, fontSize: "0.85rem" }}>
            {tubeOn ? "✅ Grid positive → electrons flow → tube ON (1)" : "⭕ Grid negative → electrons blocked → tube OFF (0)"}
          </div>
          <button style={s.btn(tubeOn ? "#ef4444" : "#fbbf24")} onClick={() => setTubeOn(v => !v)}>
            {tubeOn ? "Apply negative grid voltage (OFF)" : "Apply positive grid voltage (ON)"}
          </button>
        </div>
      </div>
    );
  }

  function renderTransistorInteractive() {
    return (
      <div style={{ margin: "14px 0" }}>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          {/* Tube card */}
          <div style={{ flex: "1 1 140px", ...s.infoBox("#fbbf24") }}>
            <div style={{ color: "#fbbf24", fontWeight: 700, marginBottom: 8, fontSize: "0.8rem" }}>💡 VACUUM TUBE</div>
            {[["Size","~5 cm"],["Power","~5W each"],["Speed","~1 MHz"],["Life","Weeks"],["Needs","Glass + vacuum + heater"]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 3 }}>
                <span style={{ color: "#64748b" }}>{k}</span><span style={{ color: "#f1f5f9" }}>{v}</span>
              </div>
            ))}
          </div>
          {/* Transistor card */}
          <div style={{ flex: "1 1 140px", ...s.infoBox("#4ade80") }}>
            <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: 8, fontSize: "0.8rem" }}>🔬 TRANSISTOR</div>
            {[["Size","~1 mm → 2 nm"],["Power","µW – fJ"],["Speed","~5 GHz"],["Life","Decades"],["Needs","Silicon only"]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 3 }}>
                <span style={{ color: "#64748b" }}>{k}</span><span style={{ color: "#f1f5f9" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div onClick={() => setTransOn(v => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#0f172a", border: `2px solid ${transOn ? "#4ade80" : "#334155"}`, borderRadius: 12, padding: "10px 20px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Base voltage:</div>
            <div style={{ width: 40, height: 20, borderRadius: 10, background: transOn ? "#4ade80" : "#334155", position: "relative", transition: "all 0.2s" }}>
              <div style={{ position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%", background: "#f1f5f9", left: transOn ? 22 : 2, transition: "left 0.2s" }} />
            </div>
            <div style={{ fontWeight: 700, color: transOn ? "#4ade80" : "#64748b", fontSize: "0.85rem" }}>{transOn ? "ON (1)" : "OFF (0)"}</div>
          </div>
          <div style={{ marginTop: 8, color: "#94a3b8", fontSize: "0.78rem" }}>
            {transOn ? "Small base current → large collector current flows → transistor ON" : "No base current → collector current blocked → transistor OFF"}
          </div>
        </div>
      </div>
    );
  }

  function renderMemoryInteractive() {
    return (
      <div style={{ margin: "14px 0", textAlign: "center" }}>
        {memBit === null ? (
          <div>
            <div style={{ color: "#94a3b8", fontSize: "0.82rem", marginBottom: 12 }}>Choose a bit to latch into the SRAM cell:</div>
            <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
              {[0, 1].map(v => (
                <div key={v} onClick={() => { setMemBit(v); setMemRead(false); }} style={{ width: 70, height: 70, borderRadius: 14, lineHeight: "70px", textAlign: "center", cursor: "pointer", fontWeight: 800, fontSize: "1.6rem", background: "#0f172a", color: "#a78bfa", border: "2px solid #334155" }}>{v}</div>
              ))}
            </div>
          </div>
        ) : !memRead ? (
          <div>
            <div style={s.infoBox("#a78bfa")}>
              <div style={{ color: "#c4b5fd", fontSize: "0.8rem", marginBottom: 4 }}>Bit latched into SRAM cell (6 transistors holding state):</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#f1f5f9" }}>{memBit}</div>
              <div style={{ color: "#a78bfa", fontSize: "0.75rem" }}>The cross-coupled inverter pair is holding this state…</div>
            </div>
            <button style={s.btn()} onClick={() => setMemRead(true)}>Read it back →</button>
            <button style={{ ...s.btnGhost, marginLeft: 8 }} onClick={() => setMemBit(null)}>Reset</button>
          </div>
        ) : (
          <div>
            <div style={s.infoBox("#4ade80")}>
              <div style={{ color: "#86efac", fontSize: "0.8rem", marginBottom: 4 }}>Memory cell read — stored value:</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#4ade80" }}>{memBit}</div>
              <div style={{ color: "#4ade80", fontSize: "0.75rem" }}>✅ Perfect recall — transistors held the state without change.</div>
            </div>
            <button style={s.btnGhost} onClick={() => { setMemBit(null); setMemRead(false); }}>Try the other bit</button>
          </div>
        )}
      </div>
    );
  }

  function renderMooreInteractive() {
    const pt = moorePts.reduce((prev, cur) => Math.abs(cur.year - mooreYear) < Math.abs(prev.year - mooreYear) ? cur : prev);
    const logMax = Math.log10(moorePts[moorePts.length - 1].count);
    return (
      <div style={{ margin: "14px 0" }}>
        <input type="range" min={1971} max={2024} value={mooreYear} onChange={e => setMooreYear(+e.target.value)} style={{ width: "100%", accentColor: "#a78bfa", marginBottom: 10 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748b", marginBottom: 14 }}><span>1971</span><span style={{ color: "#a78bfa", fontWeight: 700 }}>{mooreYear}</span><span>2024</span></div>
        <div style={s.infoBox("#a78bfa")}>
          <div style={{ color: "#c4b5fd", fontWeight: 700, marginBottom: 6 }}>{pt.chip} ({pt.year})</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", marginBottom: 4 }}>
            {pt.count >= 1e9 ? (pt.count / 1e9).toFixed(0) + " billion" : pt.count >= 1e6 ? (pt.count / 1e6).toFixed(1) + " million" : pt.count.toLocaleString()} transistors
          </div>
          {/* Log scale bar */}
          <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
            <div style={{ height: "100%", width: `${(Math.log10(pt.count) / logMax) * 100}%`, background: "#a78bfa", transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>vs Intel 4004: {(pt.count / 2300).toLocaleString()}× more transistors</div>
        </div>
      </div>
    );
  }

  function renderBuildInteractive(key) {
    if (key === "tube")       return renderTubeInteractive();
    if (key === "transistor") return renderTransistorInteractive();
    if (key === "memory")     return renderMemoryInteractive();
    if (key === "moore")      return renderMooreInteractive();
    return null;
  }

  // ── STAGE RENDERERS ─────────────────────────────────────────────

  function renderSpark() {
    const d = sparkData(sparkYear);
    return (
      <div style={s.card}>
        <div style={s.h2}>📉→📈 From 27 Tonnes to 0.5 Grams</div>
        <div style={s.p}>ENIAC (1945) weighed 27 tonnes and filled a room. A modern phone chip weighs less than a gram. Drag the slider to see what computing looked like in different eras.</div>
        <input type="range" min={1945} max={2024} step={1} value={sparkYear} onChange={e => setSparkYear(+e.target.value)} style={{ width: "100%", accentColor: "#a78bfa", marginBottom: 8 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748b", marginBottom: 14 }}><span>1945</span><span style={{ color: "#a78bfa", fontWeight: 700 }}>{sparkYear}</span><span>2024</span></div>
        <div style={s.infoBox("#a78bfa")}>
          <div style={{ color: "#c4b5fd", fontWeight: 700, marginBottom: 8 }}>{d.label}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[["⚖️ Weight", d.weight], ["🔢 Transistors", d.transistors], ["⚡ Speed", d.speed], ["📐 Size", d.size], ["🔋 Power", d.power]].map(([k,v]) => (
              <div key={k} style={{ background: "#0f172a", borderRadius: 8, padding: "8px 10px" }}>
                <div style={{ fontSize: "0.68rem", color: "#64748b" }}>{k}</div>
                <div style={{ fontSize: "0.82rem", color: "#f1f5f9", fontWeight: 600, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <button style={s.btn()} onClick={() => setStage(1)}>How did this happen? Let's trace it →</button>
      </div>
    );
  }

  function renderBuild() {
    const c = concepts[buildIdx];
    const isLast = buildIdx === concepts.length - 1;
    return (
      <div style={s.card}>
        <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>CONCEPT {buildIdx + 1} OF {concepts.length}</div>
        <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
          {concepts.map((_, i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 4, background: i < buildIdx ? "#a78bfa" : i === buildIdx ? "#c4b5fd" : "#1e293b" }} />)}
        </div>
        <div style={s.h2}>{c.title}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button style={s.toggleBtn(buildMode === "plain")} onClick={() => setBuildMode("plain")}>💬 Plain English</button>
          <button style={s.toggleBtn(buildMode === "tech")}  onClick={() => setBuildMode("tech")}>🔬 Technical</button>
        </div>
        <div style={{ ...s.p, whiteSpace: "pre-wrap" }}>{buildMode === "plain" ? c.plain : c.tech}</div>
        {c.interactive && renderBuildInteractive(c.interactive)}
        {/* No timer — free navigation */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {buildIdx > 0 && <button style={s.btnGhost} onClick={() => { setBuildIdx(i => i - 1); setBuildMode("plain"); }}>← Back</button>}
          {!isLast
            ? <button style={s.btn()} onClick={() => { setBuildIdx(i => i + 1); setBuildMode("plain"); }}>{c.hook}</button>
            : <button style={s.btn()} onClick={() => setStage(2)}>{c.hook}</button>}
        </div>
      </div>
    );
  }

  function renderSeeIt() {
    // Half adder logic (sum = A XOR B, carry = A AND B) — same logic, different physical switch
    const sum = adderA ^ adderB;
    const carry = adderA & adderB;

    // Adder tech flavour data — same 1-bit addition, different physical implementation
    const adderFlavours = {
      relay: {
        label: "🔩 Relay Adder",
        color: "#78350f",
        accent: "#f59e0b",
        era: "1941 — Z3 computer",
        switchDesc: "Electromagnet + metal arm",
        speed: "~1 ms per switch",
        size: "5 cm each",
        sound: "Click! Click!",
        xorDesc: "XOR gate = relay network (5 relays in series/parallel)",
        andDesc: "AND gate = 2 relays in series",
        flavourNote: "You can HEAR this adder working — every 1+1 = click-click-click.",
      },
      tube: {
        label: "💡 Vacuum Tube Adder",
        color: "#1e3a5f",
        accent: "#60a5fa",
        era: "1945 — ENIAC",
        switchDesc: "Heated cathode + grid voltage",
        speed: "~1 µs per switch (1000× faster)",
        size: "5 cm each (thumb-sized)",
        sound: "Silent — but HOT",
        xorDesc: "XOR gate = triode tube circuit (~6 tubes)",
        andDesc: "AND gate = 2 tubes in series",
        flavourNote: "Faster — but each tube burns 5W. A full adder used ~18 tubes, glowing red-hot.",
      },
      transistor: {
        label: "🔬 Transistor Adder",
        color: "#14532d",
        accent: "#4ade80",
        era: "1956 — IBM 7090",
        switchDesc: "Semiconductor junction (solid state)",
        speed: "~1 ns per switch (1,000,000× relay)",
        size: "mm → nm",
        sound: "Completely silent",
        xorDesc: "XOR gate = 6 transistors (CMOS)",
        andDesc: "AND gate = 4 transistors",
        flavourNote: "No moving parts. No glass. No heater. Billions of these on one chip — all doing the same 1-bit addition.",
      },
    };
    const f = adderFlavours[adderTech];
    const gen = generations[compareIdx];

    return (
      <div style={s.card}>
        <div style={s.h2}>📽️ See How Hardware Evolved</div>

        {/* ── Section 1: Generation-by-generation comparison ── */}
        <div style={{ ...s.infoBox("#a78bfa"), marginBottom: 0 }}>
          <div style={{ fontSize: "0.72rem", color: "#a78bfa", fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>GENERATION COMPARISON</div>
          <div style={{ display: "flex", gap: 3, marginBottom: 12, flexWrap: "wrap" }}>
            {generations.map((g, i) => <div key={i} onClick={() => setCompareIdx(i)} style={{ height: 4, flex: 1, minWidth: 20, borderRadius: 4, cursor: "pointer", background: i === compareIdx ? "#a78bfa" : i < compareIdx ? "#7c3aed44" : "#1e293b", transition: "background 0.3s" }} />)}
          </div>
          <div style={{ background: gen.color + "33", border: `1px solid ${gen.color}88`, borderRadius: 12, padding: "14px" }}>
            <div style={{ fontWeight: 800, color: "#f1f5f9", marginBottom: 2 }}>{gen.name}</div>
            <div style={{ fontSize: "0.72rem", color: "#a78bfa", marginBottom: 10 }}>{gen.era}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[["Switch", gen.switch], ["Size", gen.size], ["Speed", gen.speed], ["Power/switch", gen.power], ["Reliability", gen.reliability], ["Examples", gen.example]].map(([k, v]) => (
                <div key={k} style={{ background: "#0f172a55", borderRadius: 8, padding: "7px 10px" }}>
                  <div style={{ fontSize: "0.62rem", color: "#64748b", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: "0.76rem", color: "#e2e8f0" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {compareIdx > 0 && <button style={s.btnGhost} onClick={() => setCompareIdx(i => i - 1)}>← Previous</button>}
            {compareIdx < generations.length - 1 && <button style={s.btn()} onClick={() => setCompareIdx(i => i + 1)}>Next generation →</button>}
          </div>
        </div>

        <div style={{ height: 1, background: "#334155", margin: "20px 0" }} />

        {/* ── Section 2: Same addition, three physical implementations ── */}
        <div style={{ fontSize: "0.72rem", color: "#a78bfa", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>THE SAME 1+1 ADDITION — THREE DIFFERENT PHYSICAL SWITCHES</div>

        {/* Tech selector */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {[["relay","🔩 Relay","#f59e0b"], ["tube","💡 Vacuum Tube","#60a5fa"], ["transistor","🔬 Transistor","#4ade80"]].map(([key, label, color]) => (
            <button key={key} onClick={() => setAdderTech(key)} style={{ flex: "1 1 90px", padding: "8px", borderRadius: 8, border: `2px solid ${adderTech === key ? color : "#334155"}`, fontWeight: 700, fontSize: "0.76rem", cursor: "pointer", background: adderTech === key ? color + "22" : "#0f172a", color: adderTech === key ? color : "#64748b", transition: "all 0.2s" }}>{label}</button>
          ))}
        </div>

        {/* Adder animation panel */}
        <div style={{ background: f.color + "22", border: `1px solid ${f.accent}44`, borderRadius: 14, padding: "14px" }}>
          <div style={{ fontWeight: 800, color: f.accent, marginBottom: 4 }}>{f.label}</div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 12 }}>{f.era} · {f.switchDesc} · Speed: {f.speed}</div>

          {/* Input pickers */}
          <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
            {[["A", adderA, setAdderA], ["B", adderB, setAdderB]].map(([label, val, setter]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.68rem", color: "#64748b", marginBottom: 6 }}>Bit {label}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0, 1].map(v => (
                    <div key={v} onClick={() => setter(v)} style={{ width: 44, height: 44, borderRadius: 10, cursor: "pointer", border: `2px solid ${val === v ? f.accent : "#334155"}`, background: val === v ? f.accent + "33" : "#0f172a", color: val === v ? f.accent : "#64748b", fontWeight: 800, fontSize: "1.2rem", lineHeight: "40px", textAlign: "center", transition: "all 0.2s" }}>{v}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Visual circuit trace — XOR path (sum) and AND path (carry) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 12px", border: `1px solid ${sum === 1 ? f.accent : "#334155"}44`, transition: "border 0.3s" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 4 }}>SUM PATH (XOR)</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 6 }}>{f.xorDesc}</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: sum === 1 ? f.accent : "#334155", transition: "color 0.3s" }}>{adderA} ⊕ {adderB} = {sum}</div>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 12px", border: `1px solid ${carry === 1 ? "#fbbf24" : "#334155"}44`, transition: "border 0.3s" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 4 }}>CARRY PATH (AND)</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: 6 }}>{f.andDesc}</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: carry === 1 ? "#fbbf24" : "#334155", transition: "color 0.3s" }}>{adderA} · {adderB} = {carry}</div>
            </div>
          </div>

          {/* Result banner */}
          <div style={{ background: "#0f172a", borderRadius: 10, padding: "10px 14px", textAlign: "center", border: `1px solid ${f.accent}33` }}>
            <div style={{ fontSize: "0.68rem", color: "#64748b", marginBottom: 4 }}>1-BIT ADDER RESULT</div>
            <div style={{ fontWeight: 800, color: "#f1f5f9", fontSize: "1rem" }}>
              {adderA} + {adderB} → Sum: <span style={{ color: f.accent }}>{sum}</span>, Carry: <span style={{ color: "#fbbf24" }}>{carry}</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 6 }}>{f.size} · {f.sound}</div>
          </div>

          {/* Flavour note */}
          <div style={{ marginTop: 10, fontSize: "0.78rem", color: f.accent, fontStyle: "italic" }}>{f.flavourNote}</div>
        </div>

        <button style={{ ...s.btn(), marginTop: 16 }} onClick={() => setStage(3)}>Feel ENIAC's pain →</button>
      </div>
    );
  }

  function renderTryIt() {
    // Wire programming sim — same as Unit0 v1, but this time the
    // "reprogram" screen explicitly lands on Von Neumann as the fix
    function tapNode(node) {
      if (wireFrom === null) { setWireFrom(node); }
      else if (wireFrom === node) { setWireFrom(null); }
      else {
        const exists = wires.some(w => (w.from === wireFrom && w.to === node) || (w.from === node && w.to === wireFrom));
        if (!exists) setWires(ws => [...ws, { from: wireFrom, to: node }]);
        setWireFrom(null);
      }
    }
    function removeWire(idx) { setWires(ws => ws.filter((_, i) => i !== idx)); }
    const programValid = isValidProgram();

    if (tryPhase === 3) {
      return (
        <div style={s.card}>
          <div style={s.h2}>💡 Von Neumann's Fix</div>
          <div style={s.infoBox("#a78bfa")}>
            <div style={{ color: "#c4b5fd", fontWeight: 700, marginBottom: 8 }}>What if the program wasn't in the wires?</div>
            <div style={s.p}>
              Von Neumann's insight: store the instructions in memory — just like data. Then changing the program means loading different numbers into memory. No rewiring. No days of work.
              <br/><br/>
              <strong style={{color:"#f1f5f9"}}>The program becomes data. Data can be changed in milliseconds.</strong>
              <br/><br/>
              This is the stored-program concept. It is why software exists as a separate thing from hardware. And it's the foundation of everything we study in Units 1–5.
            </div>
          </div>
          <button style={s.btn()} onClick={() => setStage(4)}>Take the Challenge →</button>
        </div>
      );
    }

    if (tryPhase === 2) {
      return (
        <div style={s.card}>
          <div style={s.h2}>🔄 Reprogram It</div>
          <div style={s.p}>The general wants a different computation. You need to disconnect all your wires and reconnect them in a new configuration. On ENIAC this took 2–3 days.</div>
          <div style={s.infoBox("#ef4444")}>
            <div style={{ color: "#fca5a5", fontWeight: 700, marginBottom: 6 }}>⏱️ ENIAC reprogramming: 2–3 days</div>
            <div style={s.p}>Engineers, mostly women (called "ENIAC girls"), spent days each time on patch panels — reconnecting thousands of cables to change what the machine computed.</div>
          </div>
          <button style={s.btn()} onClick={() => setTryPhase(3)}>There has to be a better way →</button>
        </div>
      );
    }

    return (
      <div style={s.card}>
        <div style={s.h2}>🧪 Program ENIAC With Wires</div>
        <div style={s.p}>
          You are an ENIAC engineer. To make it add numbers, wire: <strong style={{color:"#e2e8f0"}}>INPUT → ALU → OUTPUT</strong>.
          Tap a node, then tap another to connect them. Tap a wire label to remove it.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", margin: "16px 0" }}>
          {nodes.map(node => (
            <div key={node} onClick={() => tapNode(node)} style={{ padding: "12px 18px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", textAlign: "center", background: wireFrom === node ? "#3b0764" : wires.some(w => w.from === node || w.to === node) ? "#14532d33" : "#0f172a", border: wireFrom === node ? "2px solid #a78bfa" : wires.some(w => w.from === node || w.to === node) ? "1px solid #4ade8044" : "1px solid #334155", color: wireFrom === node ? "#c4b5fd" : wires.some(w => w.from === node || w.to === node) ? "#4ade80" : "#94a3b8", transition: "all 0.15s" }}>{node}</div>
          ))}
        </div>
        {wires.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: 6 }}>WIRES (tap to remove):</div>
            {wires.map((w, i) => <div key={i} onClick={() => removeWire(i)} style={{ display: "inline-block", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "4px 10px", marginRight: 8, marginBottom: 6, fontSize: "0.75rem", color: "#94a3b8", cursor: "pointer" }}>{w.from} → {w.to} ✕</div>)}
          </div>
        )}
        {wireFrom && <div style={{ color: "#a78bfa", fontSize: "0.78rem", marginBottom: 8 }}>📌 {wireFrom} selected — tap another node to connect</div>}
        {programValid && tryPhase === 0 && (
          <div>
            <div style={s.infoBox("#4ade80")}>
              <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: 4 }}>✅ Program wired! ENIAC can now add.</div>
              <div style={s.p}>It took you about 30 seconds. On the real ENIAC, this simple setup took hours because of the sheer number of cables involved.</div>
            </div>
            <button style={s.btn()} onClick={() => setTryPhase(2)}>Now change the problem →</button>
          </div>
        )}
        {!programValid && wires.length >= 2 && <div style={{ color: "#f59e0b", fontSize: "0.78rem", marginTop: 6 }}>💡 Make sure INPUT connects to ALU, and ALU connects to OUTPUT.</div>}
      </div>
    );
  }

  function renderChallenge() {
    // Student arranges the 5 generations in chronological order
    const { correct, options } = shuffled;
    if (!order) setOrder([...options]);
    if (!order) return null;

    function moveUp(i) { if (i === 0) return; const o = [...order]; [o[i-1],o[i]] = [o[i],o[i-1]]; setOrder(o); setOrderResult(null); }
    function moveDown(i) { if (i === order.length-1) return; const o = [...order]; [o[i],o[i+1]] = [o[i+1],o[i]]; setOrder(o); setOrderResult(null); }

    function checkOrder() {
      const ok = order.every((item, i) => item === correct[i]);
      setOrderResult(ok ? "right" : "wrong");
    }

    return (
      <div style={s.card}>
        <div style={s.h2}>🎯 Arrange in Chronological Order</div>
        <div style={s.p}>Put the generations in order from earliest to most recent. Use ↑↓ to move items.</div>
        <div style={{ marginBottom: 14 }}>
          {order && order.map((item, i) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, background: orderResult === "right" ? "#14532d44" : orderResult === "wrong" && order[i] !== correct[i] ? "#450a0a" : "#0f172a", border: orderResult === "right" ? "1px solid #4ade8044" : orderResult === "wrong" && order[i] !== correct[i] ? "1px solid #ef444444" : "1px solid #334155", borderRadius: 10, padding: "10px 12px", marginBottom: 6, transition: "all 0.2s" }}>
              <div style={{ color: "#64748b", fontWeight: 700, fontSize: "0.75rem", minWidth: 20 }}>{i+1}.</div>
              <div style={{ flex: 1, fontSize: "0.82rem", color: "#e2e8f0" }}>{item}</div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => moveUp(i)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "4px 8px", color: "#94a3b8", cursor: "pointer", fontSize: "0.75rem" }}>↑</button>
                <button onClick={() => moveDown(i)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 6, padding: "4px 8px", color: "#94a3b8", cursor: "pointer", fontSize: "0.75rem" }}>↓</button>
              </div>
            </div>
          ))}
        </div>
        {orderResult === "wrong" && (
          <div style={{ ...s.infoBox("#ef4444"), fontSize: "0.8rem", color: "#fca5a5" }}>
            💡 Think about which came first historically: mechanical clicking → glass tubes → solid silicon → many on one chip → nano-scale field-effect.
          </div>
        )}
        {orderResult === "right" && (
          <div style={{ ...s.infoBox("#4ade80"), fontSize: "0.8rem", color: "#4ade80", fontWeight: 700 }}>
            ✅ Perfect! Each generation solved the previous one's problems.
          </div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {orderResult !== "right" && <button style={s.btn()} onClick={checkOrder}>Check Order</button>}
          {orderResult === "right" && <button style={s.btn()} onClick={() => setStage(5)}>On to the Final Quiz →</button>}
        </div>
      </div>
    );
  }

  function renderQuiz() {
    if (quizFinished) return (
      <div style={s.card}>
        <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: 10 }}>🏆</div>
        <div style={s.h2}>Unit 0 Complete — All Three Lessons!</div>
        <div style={s.p}>
          {student?.name ? `Outstanding, ${student.name}!` : "Outstanding!"}{" "}
          You've traced the full story: from WWI firing tables riddled with errors, through Babbage and Ada's mechanical dreams, to ENIAC's vacuum tubes and wire programming, through transistors and integrated circuits, all the way to 100 billion transistors on a 2nm chip. And you understand the binary and gate logic underneath it all.

          Unit 1 now begins the formal study of computer organization — and you will understand every concept because you know what problem it was built to solve.
        </div>
        <button style={s.btn()} onClick={() => onUnitComplete?.()}>Begin Unit 1 — Functional Units →</button>
      </div>
    );
    const q = quiz[quizIdx];
    return (
      <div style={s.card}>
        <div style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: 1, marginBottom: 6 }}>QUIZ — QUESTION {quizIdx + 1} OF {quiz.length}</div>
        <div style={{ height: 4, background: "#1e293b", borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(quizIdx / quiz.length) * 100}%`, background: "#a78bfa", transition: "width 0.4s" }} />
        </div>
        <div style={{ ...s.p, color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem", marginBottom: 14 }}>{q.q}</div>
        {q.options.map((opt, i) => { const isSel = quizSel === i; const isCorrect = quizFeedback === "right" && isSel; const isWrong = quizFeedback === "wrong" && isSel; return <div key={i} style={s.quizOption(isSel, isCorrect, isWrong)} onClick={() => { if (!quizFeedback || quizFeedback === "wrong") { setQuizSel(i); setQuizFeedback(null); } }}>{opt}</div>; })}
        {quizFeedback === "wrong" && <div style={{ background: "#1c1a0a", border: "1px solid #ca8a0444", borderRadius: 10, padding: 12, margin: "10px 0", color: "#fde68a", fontSize: "0.82rem" }}>💡 {q.hints[Math.min(quizAttempts - 1, q.hints.length - 1)]}</div>}
        {quizFeedback === "right" && <div style={{ background: "#0a1f14", border: "1px solid #4ade8044", borderRadius: 10, padding: 12, margin: "10px 0", color: "#86efac", fontSize: "0.82rem" }}>✅ {q.explanation}</div>}
        {quizFeedback !== "right"
          ? <button style={s.btn()} disabled={quizSel === null} onClick={() => { if (quizSel === q.answer) setQuizFeedback("right"); else { setQuizAttempts(a => a + 1); setQuizFeedback("wrong"); setQuizSel(null); } }}>Check Answer</button>
          : <button style={s.btn()} onClick={() => { if (quizIdx + 1 < quiz.length) { setQuizIdx(i => i + 1); setQuizSel(null); setQuizFeedback(null); setQuizAttempts(0); } else setQuizFinished(true); }}>{quizIdx + 1 < quiz.length ? "Next Question →" : "Finish Quiz 🎉"}</button>}
      </div>
    );
  }

  const stageRenderers = [renderSpark, renderBuild, renderSeeIt, renderTryIt, renderChallenge, renderQuiz];
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.unitLabel}>Unit 0 · Lesson 3 of 3 · Computer Organization & Architecture</div>
        <div style={s.unitTitle}>From Relays to Chips</div>
      </div>
      <div style={s.stageBar}>{stageLabels.map((label, i) => <div key={i} style={s.stageDot(stage === i, stage > i)}>{label}</div>)}</div>
      {stageRenderers[stage]()}
    </div>
  );
}
