// ════════════════════════════════════════════════════════════════
//  Unit0_2.jsx  —  "Switches, Binary & How Machines Add"
//  Unit 0, Lesson 2 of 3
//
//  STORY ARC:
//    ON/OFF switch → binary numbers → binary addition rules →
//    mechanical relays as switches → logic gates (AND/OR/NOT/XOR) →
//    half adder → full adder → 4-bit ripple-carry adder
//
//  This lesson answers: HOW does a machine actually add numbers?
//  Students build from a single switch all the way to a working
//  4-bit adder, understanding every layer.
//
//  All template rules honoured.
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

export default function Unit0_2({ student, onUnitComplete }) {

  // ── ALL HOOKS — unconditional, fixed order ──────────────────────
  const [stage, setStage] = useState(0);

  // Spark — student toggles switches to "discover" binary
  const [switches, setSwitches] = useState([false, false, false, false]);

  // Build — card carousel, no timer gate (free navigation per feedback)
  const [buildIdx, setBuildIdx]           = useState(0);
  const [buildMode, setBuildMode]         = useState("plain");

  // Build interactive states — one per card that needs interactivity
  const [relayOn, setRelayOn]             = useState(false);   // card: relay sim
  const [shannonOp, setShannonOp]         = useState("AND");   // card: shannon sim
  const [shannonSwA, setShannonSwA]       = useState(false);   // card: shannon switch A
  const [shannonSwB, setShannonSwB]       = useState(false);   // card: shannon switch B
  const [gateInputs, setGateInputs]       = useState({ a: 0, b: 0 }); // card: gate explorer
  const [selectedGate, setSelectedGate]   = useState("AND");   // card: gate explorer
  const [haInputs, setHaInputs]           = useState({ a: 0, b: 0 }); // card: half adder
  const [faInputs, setFaInputs]           = useState({ a: 0, b: 0, cin: 0 }); // card: full adder

  // See It — 4-bit addition walkthrough
  const [seeStep, setSeeStep]             = useState(0);
  const [seeNumA, setSeeNumA]             = useState(5);  // 0101
  const [seeNumB, setSeeNumB]             = useState(3);  // 0011

  // Try It — student wires a half adder by connecting gates
  const [wiredGates, setWiredGates]       = useState([]); // ["XOR","AND"]
  const [tryInputs, setTryInputs]         = useState({ a: 1, b: 1 });
  const [tryDone, setTryDone]             = useState(false);

  // Challenge — match gate to truth table output
  const [matched, setMatched]             = useState({});
  const [selLeft, setSelLeft]             = useState(null);
  const [wrongFlash, setWrongFlash]       = useState(null);
  const [rightOrder] = useState(() => {
    const pairs = [
      { left: "AND gate",  right: "Output 1 only when BOTH inputs are 1" },
      { left: "OR gate",   right: "Output 1 when AT LEAST ONE input is 1" },
      { left: "NOT gate",  right: "Output is always the OPPOSITE of input" },
      { left: "XOR gate",  right: "Output 1 when inputs are DIFFERENT" },
      { left: "Half Adder",right: "XOR gives sum bit, AND gives carry bit" },
    ];
    const rights = [...pairs.map(p => p.right)];
    for (let i = rights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rights[i], rights[j]] = [rights[j], rights[i]];
    }
    return { pairs, rights };
  });

  // Quiz
  const [quizIdx, setQuizIdx]             = useState(0);
  const [quizSel, setQuizSel]             = useState(null);
  const [quizFeedback, setQuizFeedback]   = useState(null);
  const [quizAttempts, setQuizAttempts]   = useState(0);
  const [quizFinished, setQuizFinished]   = useState(false);

  // No build timer — students navigate freely (removed per feedback)

  // ── HELPER FUNCTIONS ────────────────────────────────────────────

  // Convert a number to a 4-bit binary string
  function toBin4(n) { return (n & 0xF).toString(2).padStart(4, "0"); }

  // Compute gate output
  function gateOut(gate, a, b) {
    if (gate === "AND") return a & b;
    if (gate === "OR")  return a | b;
    if (gate === "XOR") return a ^ b;
    if (gate === "NOT") return a === 1 ? 0 : 1;
    return 0;
  }

  // Half adder: sum = A XOR B, carry = A AND B
  function halfAdder(a, b) { return { sum: a ^ b, carry: a & b }; }

  // Full adder: sum = A XOR B XOR Cin, carry = (A AND B) OR (Cin AND (A XOR B))
  function fullAdder(a, b, cin) {
    const s = a ^ b ^ cin;
    const c = (a & b) | (cin & (a ^ b));
    return { sum: s, carry: c };
  }

  // 4-bit ripple carry addition steps for See It
  function get4BitSteps(numA, numB) {
    const bitsA = toBin4(numA).split("").map(Number).reverse(); // LSB first
    const bitsB = toBin4(numB).split("").map(Number).reverse();
    const steps = [];
    let carry = 0;
    for (let i = 0; i < 4; i++) {
      const fa = fullAdder(bitsA[i], bitsB[i], carry);
      steps.push({ bit: i, a: bitsA[i], b: bitsB[i], cin: carry, sum: fa.sum, cout: fa.carry });
      carry = fa.carry;
    }
    return steps;
  }

  // ── CONTENT ────────────────────────────────────────────────────

  const concepts = [
    {
      title: "🔘 The Switch — Where It All Begins",
      plain: `Every computer ever built is, at its heart, a collection of switches.

A switch has exactly two states:
  • OFF — no current flows — we call this 0
  • ON  — current flows   — we call this 1

That's all. Nothing more. Two states: 0 and 1.

The genius of computing is that you can represent ANY information — numbers, letters, images, music, instructions — as a sequence of 0s and 1s. And you can perform ANY computation by combining millions of these simple switches in clever patterns.

Everything you have ever done on a computer — every photo, every message, every video game — was ultimately millions of switches clicking on and off, billions of times per second.

The question is: what physical thing works best as that switch?`,
      tech: `Boolean algebra (Boole, 1847) defines computation over a two-element set {0,1} with operations AND, OR, NOT. Shannon (1937) proved any Boolean function can be implemented as an electrical switching network. A switching element requires: two stable states (bistable), ability to be set externally, and ability to drive other switches (fan-out). The evolution of switching elements — relay → vacuum tube → BJT → MOSFET — is the hardware story of computing. A modern CMOS MOSFET operates at ~5GHz, consumes ~femtojoules per switch, and occupies ~2nm gate length.`,
      hook: "The first electrical switch was mechanical — let's see how →",
      interactive: null,
    },
    {
      title: "🔩 The Relay — First Electrical Switch",
      plain: `Before vacuum tubes and transistors, the first electrical switches were mechanical relays.

A relay works like this: you send a small electrical current through an electromagnet. The magnet pulls a metal arm down, which closes a second circuit — turning it ON. When you stop the current, a spring pushes the arm back up — turning it OFF.

So a small current controls a large current. That's a switch.

Early computers like the Z3 (Germany, 1941) used relays — 2,000 of them. You could actually HEAR them clicking when the computer ran. Each click was one switch operation.

Problems with relays:
  • Slow — mechanical movement takes milliseconds
  • Noisy — they literally click
  • Wear out — the metal arm physically bends and breaks over time

But for their era, they worked. And they proved that electrical switching could compute.

👇 See the relay in action:`,
      tech: `An electromagnetic relay uses a solenoid coil: current through the coil generates a magnetic field (F = nIl × B) that attracts a ferromagnetic armature, mechanically closing (SPST-NO) or opening (SPST-NC) a separate circuit. Konrad Zuse's Z3 (1941) used 2,000 relays at ~5.3Hz clock speed. Relay switching time: ~1–10ms. MTBF: ~10⁶ operations. Harvard Mark I (1944) used 3,500 relays. Shannon's 1937 thesis analysed relay switching circuits using Boolean algebra — proving any logic function could be built from relay networks. Relays were superseded by vacuum tubes for speed, though they persist in power control and safety systems today.`,
      hook: "Relays were too slow — what came next? →",
      interactive: "relay",
    },
    {
      title: "⚡ Shannon's Bridge — Boolean Algebra Meets Wires",
      plain: `George Boole invented his logic algebra in 1847. Switches existed for decades. But no one connected them — until 1937.

Claude Shannon's MIT master's thesis proved something remarkable: every Boolean algebra operation can be physically built from electrical switches.

AND = two switches in SERIES (both must close for current to flow)
OR  = two switches in PARALLEL (either one closing lets current flow)
NOT = a normally-closed switch (current flows until you activate it)

This was the missing bridge. Suddenly, logic wasn't just mathematics. It was a wiring diagram. You could design a computing circuit the same way you solve an algebra problem — then build it.

👇 See Boolean logic become physical circuits:`,
      tech: `Shannon's 1937 thesis 'A Symbolic Analysis of Relay and Switching Circuits' (supervisor: Vannevar Bush, MIT) established the equivalence between Boolean algebra and relay switching networks. Key mappings: AND → series connection (conductance = min of inputs), OR → parallel connection (conductance = max of inputs), NOT → complement contact. Shannon showed any Boolean function of n variables could be realised as a relay network with ≤2ⁿ relays. This allowed circuit design to be treated as algebraic simplification — minimise the number of relays by simplifying the Boolean expression first. His later information theory paper (1948) introduced the bit as the fundamental unit of information.`,
      hook: "Now — what are binary numbers? →",
      interactive: "shannon",
    },
    {
      title: "🔢 Binary Numbers — Counting with 0 and 1",
      plain: `Our normal number system has 10 digits: 0–9. When we run out, we carry into the next column. That's base 10 — decimal.

Binary has only 2 digits: 0 and 1. When we run out, we carry into the next column. That's base 2 — binary.

Let's count:
  Decimal → Binary
  0       → 0
  1       → 1
  2       → 10   (ran out of digits, carry into next column)
  3       → 11
  4       → 100  (carry again)
  5       → 101
  6       → 110
  7       → 111
  8       → 1000

Each binary digit is called a BIT (Binary digIT).
8 bits = 1 Byte.
1024 bytes = 1 Kilobyte.

Each bit position has a value: the rightmost is 1, then 2, then 4, then 8, then 16…

So 1011 in binary = 8 + 0 + 2 + 1 = 11 in decimal.

Why binary? Because switches have exactly two states. One switch = one bit. Simple, reliable, universal.`,
      tech: `Positional binary (base-2) notation: a number with bits bₙbₙ₋₁…b₁b₀ has value Σbᵢ·2ⁱ. A k-bit unsigned integer represents values 0 to 2ᵏ−1. Signed integers use two's complement: the MSB has weight −2ᵏ⁻¹. Binary maps directly to switching elements: each bit position requires one storage/switching element. Information theory (Shannon, 1948) proves binary is optimal for minimising expected transmission length given a binary channel — the bit is the fundamental unit of information. Modern CPUs operate on 64-bit words (2⁶⁴ ≈ 1.8×10¹⁹ distinct values per word).`,
      hook: "Now let's add binary numbers →",
      interactive: null,
    },
    {
      title: "➕ Binary Addition — Four Rules",
      plain: `Adding binary numbers follows exactly four rules:

  0 + 0 = 0         (no carry)
  0 + 1 = 1         (no carry)
  1 + 0 = 1         (no carry)
  1 + 1 = 10        → sum = 0, carry = 1

That last rule is the key one. Just like 9 + 1 = 10 in decimal (we carry), 1 + 1 in binary gives us 0 with a carry of 1 into the next column.

Let's add 5 + 3 in binary:
  5 = 0101
  3 = 0011
  ─────────
  Starting from the right (LSB):
  Column 0: 1 + 1 = 0, carry 1
  Column 1: 0 + 1 + carry(1) = 0, carry 1
  Column 2: 1 + 0 + carry(1) = 0, carry 1
  Column 3: 0 + 0 + carry(1) = 1, no carry
  Result: 1000 = 8 ✓ (5 + 3 = 8)

The carry "ripples" from column to column — just like decimal addition.

Now the question is: can we build a circuit from switches that follows these four rules automatically?`,
      tech: `Binary addition is defined by: Sum = A ⊕ B ⊕ Cᵢₙ, Carry_out = (A·B) + (Cᵢₙ·(A⊕B)) where ⊕ is XOR, · is AND, + is OR. For n-bit addition, a ripple-carry adder chains n full adders; worst-case carry propagation time is O(n). Carry-lookahead adders (CLA) compute all carries in parallel: Gᵢ = AᵢBᵢ (generate), Pᵢ = Aᵢ⊕Bᵢ (propagate), reducing critical path to O(log n). Booth's algorithm handles signed multiplication. Modern ALUs use carry-select or carry-save architectures for O(1) effective carry propagation in common cases.`,
      hook: "Let's build the circuit that does this →",
      interactive: null,
    },
    {
      title: "🔷 Logic Gates — The Building Blocks",
      plain: `A logic gate is a circuit built from switches that implements one Boolean operation. Gates take input bits (0 or 1) and produce an output bit.

The four essential gates:

AND gate — output is 1 ONLY when BOTH inputs are 1
  0 AND 0 = 0
  0 AND 1 = 0
  1 AND 0 = 0
  1 AND 1 = 1   ← only this one

OR gate — output is 1 when AT LEAST ONE input is 1
  0 OR 0 = 0
  0 OR 1 = 1
  1 OR 0 = 1
  1 OR 1 = 1

NOT gate — output is the OPPOSITE of input
  NOT 0 = 1
  NOT 1 = 0

XOR gate (eXclusive OR) — output is 1 when inputs are DIFFERENT
  0 XOR 0 = 0
  0 XOR 1 = 1
  1 XOR 0 = 1
  1 XOR 1 = 0   ← same inputs = 0

Gates are built from transistors. An AND gate needs 4 transistors. A modern CPU has billions of gates — all ultimately doing these simple operations.

👇 Try the gate explorer:`,
      tech: `CMOS logic gates: an AND gate requires a NAND gate (2 series PMOS + 2 parallel NMOS) followed by a NOT gate — 6 transistors total. NAND is the universal gate: any Boolean function can be implemented using only NAND gates (NAND completeness). Truth tables define gate behaviour completely: for n inputs, 2ⁿ rows. XOR truth table: output = A⊕B = (A·B̄) + (Ā·B) = (A+B)·(Ā+B̄). Gate propagation delay (t_pd) is a key timing parameter: combinational logic depth = number of gates on critical path × t_pd. Standard cell libraries (e.g., TSMC 3nm) provide optimised gate implementations in 2–8 transistors each.`,
      hook: "Now combine two gates to build an adder →",
      interactive: "gates",
    },
    {
      title: "⚡ Half Adder — Your First Circuit",
      plain: `We need a circuit that adds two single bits (A and B) and produces two outputs:
  • Sum bit — the result of A + B (just this column)
  • Carry bit — the overflow into the next column

Look at the binary addition rules:
  0+0: Sum=0, Carry=0
  0+1: Sum=1, Carry=0
  1+0: Sum=1, Carry=0
  1+1: Sum=0, Carry=1

Now look at the XOR truth table:
  XOR gives exactly the Sum column above!

And the AND truth table:
  AND gives exactly the Carry column above!

So a half adder is just:
  Sum   = A XOR B
  Carry = A AND B

Two gates. That's it. A circuit that adds two bits.

It's called a "half" adder because it can't handle a carry coming IN from a previous column — we need a full adder for that.

👇 Try it — pick A and B and watch the gates:`,
      tech: `Half adder implementation: Sum = A ⊕ B (XOR), Carry = A · B (AND). Gate count: 1 XOR + 1 AND = 6 transistors (CMOS). Truth table verification: (0,0)→(0,0); (0,1)→(1,0); (1,0)→(1,0); (1,1)→(0,1). The half adder handles bit position 0 (LSB) where there is no incoming carry. It is the fundamental building block of all arithmetic circuits. A 1-bit half adder can also be used as a controlled toggle (XOR with a control line) or as a comparator (XNOR gives A=B). Hardware description: module half_adder(input a, b, output sum, carry); assign sum = a^b; assign carry = a&b; endmodule`,
      hook: "But what about carries coming in? →",
      interactive: "halfadder",
    },
    {
      title: "🔗 Full Adder — Handling the Carry In",
      plain: `A half adder adds two bits but ignores any carry arriving from the column to its right. For multi-bit addition we need a full adder — which handles three inputs:
  • A — bit from first number
  • B — bit from second number
  • Cin — carry arriving from the previous column

And produces two outputs:
  • Sum — result for this column
  • Cout — carry to pass to the next column

A full adder is built from TWO half adders:

Step 1: Half adder on A and B → gives us Sum1 and Carry1
Step 2: Half adder on Sum1 and Cin → gives us final Sum and Carry2
Final Cout = Carry1 OR Carry2

So:
  Sum  = A XOR B XOR Cin
  Cout = (A AND B) OR (Cin AND (A XOR B))

Four gates total. And now we can chain these: connect the Cout of one full adder to the Cin of the next — and we get multi-bit addition.

👇 Try it — pick A, B, and Cin:`,
      tech: `Full adder: Sum = A⊕B⊕Cᵢₙ, Cₒᵤₜ = (A·B)+(Cᵢₙ·(A⊕B)). Implementation: 2 half adders + 1 OR gate = 2×(1 XOR + 1 AND) + 1 OR = 9 gates = ~18 transistors (CMOS). Truth table: 8 rows (3 inputs). Chaining n full adders with Cᵢₙ of LSB = 0 gives an n-bit ripple-carry adder. Critical path: n × (2 gate delays) for carry propagation through the chain. Carry-lookahead: Generate (G=AB), Propagate (P=A⊕B), group carry equations computed in 2 gate levels regardless of n. Modern Verilog: assign {cout, sum} = a + b + cin — synthesiser maps this to optimal adder topology automatically.`,
      hook: "Now chain 4 full adders for 4-bit addition →",
      interactive: "fulladder",
    },
    {
      title: "🔢 4-Bit Ripple-Carry Adder",
      plain: `Chain four full adders together, connecting each Cout to the next Cin, and you get a 4-bit ripple-carry adder — a circuit that adds any two 4-bit numbers.

  Bit 0 (LSB): Full Adder — Cin = 0 (no previous carry)
  Bit 1:       Full Adder — Cin = Cout from bit 0
  Bit 2:       Full Adder — Cin = Cout from bit 1
  Bit 3 (MSB): Full Adder — Cin = Cout from bit 2

The carry "ripples" through from right to left. That's why it's called a ripple-carry adder.

This is the actual circuit inside the ALU of every CPU. Real CPUs use wider adders (32-bit or 64-bit) with faster carry logic (carry-lookahead) — but the principle is exactly the same.

From two states (0 and 1) → to a relay → to a gate → to a half adder → to a full adder → to a 4-bit adder. Every layer built from the layer below it.

This is hardware design. This is what computer engineers actually build.

In the See It stage, you will watch a live 4-bit addition happen bit by bit, carry rippling through.`,
      tech: `A k-bit ripple-carry adder has critical path delay = k × (t_FA) where t_FA is full adder delay (~2 gate delays). For 64-bit: 128 gate delays on critical path. Carry-lookahead (CLA) reduces this to O(log k): group generate G₀₋₃ = G₃ + P₃·G₂ + P₃·P₂·G₁ + P₃·P₂·P₁·G₀. Carry-select adder: compute both sum(Cᵢₙ=0) and sum(Cᵢₙ=1) in parallel, MUX-select when actual carry arrives — O(√k) delay. The ALU in a modern superscalar CPU may have dozens of adder units operating in parallel, with results forwarded directly to subsequent instructions (bypassing) to avoid pipeline stalls.`,
      hook: "Watch it work on a real example →",
      interactive: null,
    },
  ];

  // See It — step-through 4-bit addition with carry ripple visualised
  const addSteps = get4BitSteps(seeNumA, seeNumB);
  const totalResult = seeNumA + seeNumB;

  // Quiz
  const quiz = [
    {
      q: "A switch used in computing has exactly two states. What are they and what do we call them?",
      options: ["A) Fast and slow — called MHz and GHz", "B) OFF and ON — called 0 and 1", "C) Open and closed — called LOW and HIGH voltage only in analogue circuits", "D) Positive and negative — called + and −"],
      answer: 1,
      hints: ["Think about a light switch — what are its two positions?", "In computing, one state means 'no signal' and the other means 'signal present'.", "The two states map to the two binary digits: zero and one."],
      explanation: "A switch has two stable states: OFF (no current) = 0, and ON (current flows) = 1. All binary computation is built on this single two-state property.",
    },
    {
      q: "How did a relay act as an electrical switch?",
      options: ["A) It used heat to expand a metal strip, breaking a circuit", "B) A small current through an electromagnet pulled a metal arm to close a second, separate circuit", "C) It converted AC to DC, enabling switching", "D) It stored charge in a capacitor and released it as a pulse"],
      answer: 1,
      hints: ["The key word is 'electromagnet' — what does a magnet do to metal?", "A relay uses one circuit to CONTROL another, larger circuit.", "Small current → electromagnet → pulls arm → closes second circuit. That's the switching action."],
      explanation: "A relay's electromagnet pulls a metal armature down when energised, closing a second circuit. When de-energised, a spring returns it. Small current controls large current — that's the switching action.",
    },
    {
      q: "What is 6 written in binary?",
      options: ["A) 110", "B) 101", "C) 111", "D) 100"],
      answer: 0,
      hints: ["Count up in binary: 0,1,10,11,100,101,110... which one is 6?", "6 = 4 + 2. In binary, 4 = 100 and 2 = 010. Add them.", "The bit positions from right: 1 (2⁰), 2 (2¹), 4 (2²). Which positions sum to 6?"],
      explanation: "6 = 4 + 2 = 2² + 2¹, so in binary it is 110. Bit 2 = 1, Bit 1 = 1, Bit 0 = 0.",
    },
    {
      q: "What is 1 + 1 in binary?",
      options: ["A) 2", "B) 11", "C) 10", "D) 0 with no carry"],
      answer: 2,
      hints: ["In binary there is no digit '2'. What happens when you run out of digits, like 9+1 in decimal?", "The sum digit is 0 and you carry 1 into the next column.", "Write it as a column: 1 + 1 = 0, write down 0, carry 1. Result: 10 (one-zero in binary)."],
      explanation: "1 + 1 in binary = 10 (read 'one-zero'). Sum = 0, Carry = 1 into the next column — exactly like 9 + 1 = 10 in decimal.",
    },
    {
      q: "What does an AND gate do?",
      options: ["A) Output is 1 when at least one input is 1", "B) Output is 1 only when BOTH inputs are 1", "C) Output is always the opposite of the input", "D) Output is 1 when inputs are different"],
      answer: 1,
      hints: ["Think about the word 'AND' in English: you get dessert if you finish dinner AND vegetables.", "The AND gate is strict — it needs agreement from all inputs.", "Only 1 AND 1 gives 1. Any 0 input gives 0 output."],
      explanation: "An AND gate outputs 1 only when ALL inputs are 1. It is a logical multiplication — 0 in any input gives 0 out.",
    },
    {
      q: "What does an XOR gate output when both inputs are 1?",
      options: ["A) 1", "B) 0", "C) 2", "D) Undefined — XOR needs different inputs"],
      answer: 1,
      hints: ["XOR means eXclusive OR — exclusive of what?", "XOR is 1 when inputs DIFFER. What happens when they're the same?", "1 XOR 1: the inputs are the same, not different. So the output is..."],
      explanation: "XOR outputs 1 when inputs are DIFFERENT, 0 when they are the SAME. So 1 XOR 1 = 0. This is exactly the sum bit behaviour in binary addition: 1 + 1 gives sum = 0.",
    },
    {
      q: "A half adder adds bits A and B. What two gates does it use and what do they produce?",
      options: ["A) AND for sum, OR for carry", "B) XOR for sum, AND for carry", "C) OR for sum, NOT for carry", "D) NOT for sum, XOR for carry"],
      answer: 1,
      hints: ["Look at the XOR truth table and compare it to the binary addition Sum column.", "XOR gives 0+0=0, 0+1=1, 1+0=1, 1+1=0. Which addition output does that match?", "And the AND gate gives 1 only when both are 1 — exactly when there's a carry in binary addition."],
      explanation: "Half adder: Sum = A XOR B (XOR gate), Carry = A AND B (AND gate). XOR's truth table matches the sum column of binary addition exactly, and AND matches the carry column.",
    },
    {
      q: "What does a full adder have that a half adder doesn't?",
      options: ["A) A larger output — it produces a 2-bit sum instead of 1 bit", "B) A third input: Carry-In (Cin) from the previous bit position", "C) The ability to subtract as well as add", "D) Built-in memory to store the result"],
      answer: 1,
      hints: ["'Half' adder hints that it's incomplete. What is it missing for multi-bit addition?", "When you add column by column, each column might receive a carry from the column to its right.", "The full adder adds A, B, AND whatever carry arrived from the previous column."],
      explanation: "A full adder has three inputs: A, B, and Carry-In. The Carry-In handles the carry rippling in from the column to the right — essential for multi-bit addition.",
    },
    {
      q: "In a 4-bit ripple-carry adder, why is it called 'ripple'?",
      options: ["A) The voltage ripples between positive and negative", "B) The carry bit propagates (ripples) through each full adder from LSB to MSB", "C) The output bits appear one at a time from MSB to LSB", "D) It uses AC current which ripples at 50Hz"],
      answer: 1,
      hints: ["Think about what happens to the carry after each bit position is computed.", "The carry from bit 0 goes to bit 1, then bit 1's carry goes to bit 2... like a chain.", "The carry has to wait for each previous adder to finish — it propagates (ripples) through the chain."],
      explanation: "The carry 'ripples' from LSB to MSB: bit 0's carry feeds bit 1's Cin, bit 1's carry feeds bit 2's Cin, and so on. Each stage must wait for the previous carry — which creates a delay proportional to the number of bits.",
    },
    {
      q: "What is 0101 + 0011 in binary? (These are 5 and 3 in decimal.)",
      options: ["A) 1000", "B) 0111", "C) 1001", "D) 0110"],
      answer: 0,
      hints: ["Add column by column from right to left, tracking carries.", "Column 0: 1+1=10, write 0 carry 1. Column 1: 0+1+1=10, write 0 carry 1. Keep going.", "5+3=8. What is 8 in binary? Think: 8 = 2³, so it's 1 followed by three 0s."],
      explanation: "0101 + 0011: Col0: 1+1=0c1; Col1: 0+1+1=0c1; Col2: 1+0+1=0c1; Col3: 0+0+1=1c0. Result: 1000 = 8. ✓",
    },
  ];

  // ── STYLES ──────────────────────────────────────────────────────
  const s = {
    wrap: { minHeight: "100vh", background: "linear-gradient(160deg,#0a0f1e 0%,#0f172a 60%,#0a1f0a 100%)", color: "#e2e8f0", fontFamily: "'Segoe UI',system-ui,sans-serif", padding: "0 0 80px" },
    header: { background: "linear-gradient(90deg,#052e16,#1e293b)", padding: "14px 16px 10px", borderBottom: "1px solid #166534" },
    unitLabel: { fontSize: "0.65rem", color: "#4ade80", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 2 },
    unitTitle: { fontSize: "clamp(1rem,3vw,1.2rem)", fontWeight: 800, color: "#f1f5f9" },
    stageBar: { display: "flex", gap: 4, padding: "8px 16px", overflowX: "auto", background: "#0f172a", borderBottom: "1px solid #1e293b" },
    stageDot: (active, done) => ({ fontSize: "0.6rem", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: active ? 700 : 400, background: done ? "#14532d44" : active ? "#052e16" : "#1e293b", color: done ? "#4ade80" : active ? "#4ade80" : "#475569", border: done ? "1px solid #4ade8044" : active ? "1px solid #4ade80" : "1px solid #1e293b" }),
    card: { background: "#1e293b", borderRadius: 16, padding: "18px 16px", margin: "14px 12px", border: "1px solid #334155" },
    h2: { fontSize: "clamp(0.95rem,2.8vw,1.15rem)", fontWeight: 700, color: "#f1f5f9", marginBottom: 10 },
    p: { color: "#94a3b8", fontSize: "0.84rem", lineHeight: 1.75, marginBottom: 10 },
    pre: { background: "#0f172a", borderRadius: 10, padding: 14, color: "#4ade80", fontSize: "0.8rem", lineHeight: 1.7, overflowX: "auto", marginBottom: 10, whiteSpace: "pre-wrap" },
    btn: (c = "#4ade80") => ({ background: c, color: "#0f172a", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 700, fontSize: "0.86rem", cursor: "pointer", marginTop: 10, display: "inline-block" }),
    btnGhost: { background: "transparent", color: "#64748b", border: "1px solid #334155", borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", marginTop: 10 },
    toggleBtn: (active) => ({ flex: "1 1 100px", padding: "8px 12px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer", background: active ? "#4ade80" : "#0f172a", color: active ? "#0f172a" : "#64748b" }),
    quizOption: (sel, correct, wrong) => ({ background: correct ? "#14532d" : wrong ? "#450a0a" : sel ? "#052e16" : "#0f172a", border: correct ? "2px solid #4ade80" : wrong ? "2px solid #ef4444" : sel ? "2px solid #4ade80" : "1px solid #334155", borderRadius: 10, padding: "13px 16px", marginBottom: 8, cursor: "pointer", fontSize: "0.84rem", color: "#f1f5f9" }),
    infoBox: (color = "#4ade80") => ({ background: color + "18", border: `1px solid ${color}44`, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }),
    bitBtn: (active, color = "#4ade80") => ({ width: 48, height: 48, borderRadius: 10, border: active ? `2px solid ${color}` : "1px solid #334155", background: active ? color + "33" : "#0f172a", color: active ? color : "#64748b", fontWeight: 800, fontSize: "1.2rem", cursor: "pointer", transition: "all 0.15s" }),
  };

  const stageLabels = ["✨ Spark", "📖 Build", "📽 See It", "🧪 Try It", "🎯 Challenge", "📝 Quiz"];

  // ── INTERACTIVE ELEMENTS FOR BUILD CARDS ────────────────────────

  function renderRelay() {
    return (
      <div style={{ margin: "16px 0", textAlign: "center" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          {/* Control circuit */}
          <div style={{ ...s.infoBox("#94a3b8"), width: "100%", maxWidth: 280, textAlign: "left" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 4 }}>CONTROL CIRCUIT (small current)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 2, background: relayOn ? "#4ade80" : "#334155", transition: "background 0.3s" }} />
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: relayOn ? "#4ade80" : "#1e293b", border: "2px solid #334155", fontSize: "0.6rem", lineHeight: "20px", color: "#0f172a", fontWeight: 800, transition: "all 0.3s" }}>⚡</div>
              <div style={{ flex: 1, height: 2, background: relayOn ? "#4ade80" : "#334155", transition: "background 0.3s" }} />
            </div>
          </div>
          {/* Electromagnet */}
          <div style={{ width: 48, height: 32, borderRadius: 8, background: relayOn ? "#4ade8044" : "#1e293b", border: `2px solid ${relayOn ? "#4ade80" : "#334155"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: relayOn ? "#4ade80" : "#64748b", transition: "all 0.3s" }}>🧲</div>
          {/* Arm */}
          <div style={{ width: 80, height: 8, borderRadius: 4, background: "#94a3b8", transformOrigin: "left center", transform: `rotate(${relayOn ? "15deg" : "-5deg"})`, transition: "transform 0.3s", position: "relative" }}>
            <div style={{ position: "absolute", right: 0, top: -6, width: 16, height: 20, background: "#64748b", borderRadius: 3 }} />
          </div>
          {/* Output circuit */}
          <div style={{ ...s.infoBox(relayOn ? "#fbbf24" : "#334155"), width: "100%", maxWidth: 280, textAlign: "left", transition: "all 0.3s" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 4 }}>OUTPUT CIRCUIT (large current)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 2, background: relayOn ? "#fbbf24" : "#334155", transition: "background 0.3s" }} />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: relayOn ? "#fbbf2444" : "#1e293b", border: `2px solid ${relayOn ? "#fbbf24" : "#334155"}`, fontSize: "1rem", lineHeight: "28px", transition: "all 0.3s", textAlign: "center" }}>💡</div>
              <div style={{ flex: 1, height: 2, background: relayOn ? "#fbbf24" : "#334155", transition: "background 0.3s" }} />
            </div>
          </div>
          <div style={{ color: relayOn ? "#4ade80" : "#64748b", fontWeight: 700, fontSize: "0.85rem", marginTop: 4 }}>
            {relayOn ? "✅ Circuit CLOSED — Relay ON — Output = 1" : "⭕ Circuit OPEN — Relay OFF — Output = 0"}
          </div>
        </div>
        <br/>
        <button style={s.btn(relayOn ? "#ef4444" : "#4ade80")} onClick={() => setRelayOn(v => !v)}>
          {relayOn ? "Open the relay (turn OFF)" : "Energise the relay (turn ON)"}
        </button>
      </div>
    );
  }

  function renderGates() {
    const gates = ["AND", "OR", "XOR", "NOT"];
    const result = gateOut(selectedGate, gateInputs.a, gateInputs.b);
    return (
      <div style={{ margin: "14px 0" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {gates.map(g => (
            <button key={g} onClick={() => setSelectedGate(g)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", background: selectedGate === g ? "#4ade80" : "#0f172a", color: selectedGate === g ? "#0f172a" : "#64748b" }}>{g}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center", margin: "14px 0" }}>
          {/* Input A */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 4 }}>Input A</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[0,1].map(v => <button key={v} style={s.bitBtn(gateInputs.a === v)} onClick={() => setGateInputs(g => ({...g, a: v}))}>{v}</button>)}
            </div>
          </div>
          {/* Gate box */}
          <div style={{ background: "#0f172a", border: "2px solid #4ade80", borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 70 }}>
            <div style={{ color: "#4ade80", fontWeight: 800, fontSize: "1rem" }}>{selectedGate}</div>
            <div style={{ color: "#64748b", fontSize: "0.65rem" }}>gate</div>
          </div>
          {/* Input B (hidden for NOT) */}
          {selectedGate !== "NOT" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 4 }}>Input B</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[0,1].map(v => <button key={v} style={s.bitBtn(gateInputs.b === v)} onClick={() => setGateInputs(g => ({...g, b: v}))}>{v}</button>)}
              </div>
            </div>
          )}
          {/* Arrow */}
          <div style={{ color: "#4ade80", fontSize: "1.2rem" }}>→</div>
          {/* Output */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 4 }}>Output</div>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: result === 1 ? "#4ade8033" : "#0f172a", border: `2px solid ${result === 1 ? "#4ade80" : "#334155"}`, lineHeight: "44px", textAlign: "center", fontWeight: 800, fontSize: "1.3rem", color: result === 1 ? "#4ade80" : "#64748b" }}>{result}</div>
          </div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center" }}>
          {selectedGate === "NOT" ? `NOT ${gateInputs.a} = ${result}` : `${gateInputs.a} ${selectedGate} ${gateInputs.b} = ${result}`}
        </div>
      </div>
    );
  }

  function renderHalfAdder() {
    const ha = halfAdder(haInputs.a, haInputs.b);
    return (
      <div style={{ margin: "14px 0" }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
          {[{ label: "A", key: "a" }, { label: "B", key: "b" }].map(({ label, key }) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 6 }}>Bit {label}</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[0,1].map(v => <button key={v} style={s.bitBtn(haInputs[key] === v)} onClick={() => setHaInputs(h => ({...h, [key]: v}))}>{v}</button>)}
              </div>
            </div>
          ))}
        </div>
        {/* Circuit diagram */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={s.infoBox("#818cf8")}>
            <div style={{ fontSize: "0.7rem", color: "#818cf8", marginBottom: 4 }}>XOR GATE → SUM</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", textAlign: "center" }}>{haInputs.a} ⊕ {haInputs.b} = {ha.sum}</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", textAlign: "center" }}>Sum bit</div>
          </div>
          <div style={s.infoBox("#fbbf24")}>
            <div style={{ fontSize: "0.7rem", color: "#fbbf24", marginBottom: 4 }}>AND GATE → CARRY</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", textAlign: "center" }}>{haInputs.a} · {haInputs.b} = {ha.carry}</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", textAlign: "center" }}>Carry out</div>
          </div>
        </div>
        <div style={{ ...s.infoBox("#4ade80"), textAlign: "center", marginTop: 8 }}>
          <div style={{ color: "#4ade80", fontWeight: 700 }}>{haInputs.a} + {haInputs.b} = Sum: {ha.sum}, Carry: {ha.carry}</div>
          {haInputs.a === 1 && haInputs.b === 1 && <div style={{ color: "#86efac", fontSize: "0.78rem", marginTop: 4 }}>Carry = 1! This means 1+1=2 but we write '10' in binary — the carry goes to the next column.</div>}
        </div>
      </div>
    );
  }

  function renderFullAdder() {
    const fa = fullAdder(faInputs.a, faInputs.b, faInputs.cin);
    return (
      <div style={{ margin: "14px 0" }}>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
          {[{ label: "A", key: "a" }, { label: "B", key: "b" }, { label: "Cin", key: "cin" }].map(({ label, key }) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 6 }}>{label}</div>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1].map(v => <button key={v} style={s.bitBtn(faInputs[key] === v, key === "cin" ? "#fbbf24" : "#4ade80")} onClick={() => setFaInputs(f => ({...f, [key]: v}))}>{v}</button>)}
              </div>
            </div>
          ))}
        </div>
        {/* Step-by-step breakdown */}
        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: 10, lineHeight: 1.8 }}>
          <div>Step 1 — Half adder on A, B: &nbsp; Sum₁ = {faInputs.a} ⊕ {faInputs.b} = <strong style={{color:"#f1f5f9"}}>{faInputs.a ^ faInputs.b}</strong>, &nbsp; Carry₁ = {faInputs.a} · {faInputs.b} = <strong style={{color:"#f1f5f9"}}>{faInputs.a & faInputs.b}</strong></div>
          <div>Step 2 — Half adder on Sum₁, Cin: &nbsp; Sum = {faInputs.a ^ faInputs.b} ⊕ {faInputs.cin} = <strong style={{color:"#4ade80"}}>{fa.sum}</strong>, &nbsp; Carry₂ = {faInputs.a ^ faInputs.b} · {faInputs.cin} = <strong style={{color:"#f1f5f9"}}>{(faInputs.a ^ faInputs.b) & faInputs.cin}</strong></div>
          <div>Cout = Carry₁ OR Carry₂ = {faInputs.a & faInputs.b} | {(faInputs.a ^ faInputs.b) & faInputs.cin} = <strong style={{color:"#fbbf24"}}>{fa.carry}</strong></div>
        </div>
        <div style={{ ...s.infoBox("#4ade80"), textAlign: "center" }}>
          <div style={{ color: "#4ade80", fontWeight: 700, fontSize: "1rem" }}>
            {faInputs.a} + {faInputs.b} + Cin({faInputs.cin}) → Sum: <strong>{fa.sum}</strong>, Cout: <strong>{fa.carry}</strong>
          </div>
        </div>
      </div>
    );
  }

  // Shannon interactive — shows AND/OR/NOT as switch wiring diagrams
  // so students SEE Boolean algebra become physical circuits
  function renderShannon() {
    const result = shannonOp === "AND" ? (shannonSwA && shannonSwB) : shannonOp === "OR" ? (shannonSwA || shannonSwB) : !shannonSwA;
    return (
      <div style={{ margin: "14px 0" }}>
        {/* Operation selector */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {["AND", "OR", "NOT"].map(op => (
            <button key={op} onClick={() => { setShannonOp(op); setShannonSwA(false); setShannonSwB(false); }} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", background: shannonOp === op ? "#4ade80" : "#0f172a", color: shannonOp === op ? "#0f172a" : "#64748b" }}>{op}</button>
          ))}
        </div>
        {/* Circuit diagram */}
        <div style={{ background: "#0f172a", borderRadius: 12, padding: "16px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 8 }}>
            {shannonOp === "AND" ? "AND = switches IN SERIES (both must close)" : shannonOp === "OR" ? "OR = switches IN PARALLEL (either can close)" : "NOT = normally-closed switch (inverts the signal)"}
          </div>
          {/* Visual wiring */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap", margin: "12px 0" }}>
            <div style={{ background: "#1e293b", border: "2px solid #4ade8044", borderRadius: 8, padding: "6px 10px", fontSize: "0.72rem", color: "#4ade80", fontWeight: 700 }}>⚡ V+</div>
            <div style={{ height: 2, width: 20, background: "#4ade80" }} />
            {shannonOp === "AND" && (
              <>
                <div onClick={() => setShannonSwA(v => !v)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", background: shannonSwA ? "#4ade8033" : "#1e293b", border: `2px solid ${shannonSwA ? "#4ade80" : "#334155"}`, fontSize: "0.78rem", fontWeight: 700, color: shannonSwA ? "#4ade80" : "#94a3b8", transition: "all 0.2s" }}>{shannonSwA ? "A ●" : "A ○"}</div>
                <div style={{ height: 2, width: 12, background: shannonSwA ? "#4ade80" : "#334155", transition: "all 0.2s" }} />
                <div onClick={() => setShannonSwB(v => !v)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", background: shannonSwB ? "#4ade8033" : "#1e293b", border: `2px solid ${shannonSwB ? "#4ade80" : "#334155"}`, fontSize: "0.78rem", fontWeight: 700, color: shannonSwB ? "#4ade80" : "#94a3b8", transition: "all 0.2s" }}>{shannonSwB ? "B ●" : "B ○"}</div>
              </>
            )}
            {shannonOp === "OR" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div onClick={() => setShannonSwA(v => !v)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", background: shannonSwA ? "#4ade8033" : "#1e293b", border: `2px solid ${shannonSwA ? "#4ade80" : "#334155"}`, fontSize: "0.78rem", fontWeight: 700, color: shannonSwA ? "#4ade80" : "#94a3b8", transition: "all 0.2s" }}>{shannonSwA ? "A ●" : "A ○"}</div>
                <div onClick={() => setShannonSwB(v => !v)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", background: shannonSwB ? "#4ade8033" : "#1e293b", border: `2px solid ${shannonSwB ? "#4ade80" : "#334155"}`, fontSize: "0.78rem", fontWeight: 700, color: shannonSwB ? "#4ade80" : "#94a3b8", transition: "all 0.2s" }}>{shannonSwB ? "B ●" : "B ○"}</div>
              </div>
            )}
            {shannonOp === "NOT" && (
              <div onClick={() => setShannonSwA(v => !v)} style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", background: !shannonSwA ? "#4ade8033" : "#ef444433", border: `2px solid ${!shannonSwA ? "#4ade80" : "#ef4444"}`, fontSize: "0.78rem", fontWeight: 700, color: !shannonSwA ? "#4ade80" : "#fca5a5", transition: "all 0.2s" }}>{shannonSwA ? "A ● (blocking)" : "A ○ (open = passes!)"}</div>
            )}
            <div style={{ height: 2, width: 20, background: result ? "#4ade80" : "#334155", transition: "all 0.3s" }} />
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: result ? "#4ade8044" : "#0f172a", border: `3px solid ${result ? "#4ade80" : "#334155"}`, lineHeight: "34px", textAlign: "center", fontSize: "1.2rem", transition: "all 0.3s", boxShadow: result ? "0 0 16px #4ade8066" : "none" }}>💡</div>
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: result ? "#4ade80" : "#64748b", marginTop: 8, transition: "color 0.2s" }}>
            {shannonOp === "AND" ? `A(${shannonSwA?1:0}) AND B(${shannonSwB?1:0}) = ${result?1:0}` : shannonOp === "OR" ? `A(${shannonSwA?1:0}) OR B(${shannonSwB?1:0}) = ${result?1:0}` : `NOT A(${shannonSwA?1:0}) = ${result?1:0}`}
          </div>
        </div>
        <div style={{ ...s.infoBox("#4ade80"), fontSize: "0.78rem", color: "#86efac" }}>
          💡 This is Shannon's breakthrough: Boolean algebra = switch wiring. Design logic with maths. Build it with wires.
        </div>
      </div>
    );
  }
  function renderBuildInteractive(key) {
    if (key === "relay")     return renderRelay();
    if (key === "shannon")   return renderShannon();
    if (key === "gates")     return renderGates();
    if (key === "halfadder") return renderHalfAdder();
    if (key === "fulladder") return renderFullAdder();
    return null;
  }

  // ── STAGE RENDERERS ─────────────────────────────────────────────

  function renderSpark() {
    const decVal = switches.reduce((acc, v, i) => acc + (v ? Math.pow(2, 3 - i) : 0), 0);
    return (
      <div style={s.card}>
        <div style={s.h2}>🔘 Can ON/OFF really do maths?</div>
        <div style={s.p}>
          You have four switches below. Each switch is either OFF (0) or ON (1).
          Tap them to flip them and watch the binary number and decimal value change.
          Try to make the number 5, then 11, then 15.
        </div>
        {/* Four switches */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "20px 0", flexWrap: "wrap" }}>
          {switches.map((on, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 6 }}>2{["³","²","¹","⁰"][i]} = {[8,4,2,1][i]}</div>
              <div onClick={() => setSwitches(sw => sw.map((v, j) => j === i ? !v : v))} style={{ width: 56, height: 56, borderRadius: 12, background: on ? "#4ade8033" : "#0f172a", border: `3px solid ${on ? "#4ade80" : "#334155"}`, cursor: "pointer", lineHeight: "50px", textAlign: "center", fontWeight: 800, fontSize: "1.3rem", color: on ? "#4ade80" : "#64748b", boxShadow: on ? "0 0 20px #4ade8044" : "none", transition: "all 0.2s" }}>{on ? 1 : 0}</div>
              <div style={{ fontSize: "0.65rem", color: on ? "#4ade80" : "#475569", marginTop: 6, fontWeight: 700 }}>{on ? "ON" : "OFF"}</div>
            </div>
          ))}
        </div>
        {/* Result display */}
        <div style={{ ...s.infoBox("#4ade80"), textAlign: "center" }}>
          <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 4 }}>BINARY</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#4ade80", fontFamily: "monospace", letterSpacing: 8 }}>
            {switches.map(v => v ? 1 : 0).join("")}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", margin: "6px 0 4px" }}>DECIMAL VALUE</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f1f5f9" }}>{decVal}</div>
        </div>
        <button style={s.btn()} onClick={() => setStage(1)}>
          Yes — now let's see HOW →
        </button>
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
          {concepts.map((_, i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 4, background: i < buildIdx ? "#4ade80" : i === buildIdx ? "#86efac" : "#1e293b" }} />)}
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
            : <button style={s.btn()} onClick={() => { setStage(2); }}>{c.hook}</button>}
        </div>
      </div>
    );
  }

  function renderSeeIt() {
    // 4-bit ripple-carry addition, step by step
    const steps = get4BitSteps(seeNumA, seeNumB);
    const bitsA = toBin4(seeNumA);
    const bitsB = toBin4(seeNumB);
    const bitsR = toBin4(totalResult);

    return (
      <div style={s.card}>
        <div style={s.h2}>📽️ 4-Bit Addition — Watch the Carry Ripple</div>
        {/* Number pickers */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          {[{ label: "Number A", val: seeNumA, set: setSeeNumA }, { label: "Number B", val: seeNumB, set: setSeeNumB }].map(({ label, val, set }) => (
            <div key={label} style={{ flex: "1 1 120px" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 4 }}>{label} (0–15)</div>
              <input type="range" min={0} max={15} value={val} onChange={e => { set(+e.target.value); setSeeStep(0); }}
                style={{ width: "100%", accentColor: "#4ade80" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{val}</span>
                <span style={{ color: "#4ade80", fontFamily: "monospace" }}>{toBin4(val)}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Binary layout */}
        <div style={s.pre}>
  A = {bitsA}  ({seeNumA})
  B = {bitsB}  ({seeNumB})
  ──────────
  R = {bitsR}  ({totalResult % 16}){totalResult > 15 ? " + overflow!" : ""}
        </div>
        {/* Step-by-step bit adder */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: 8 }}>
            TAP STEP {seeStep + 1} OF {steps.length} — Full Adder at bit position {steps[seeStep]?.bit}
          </div>
          {steps.map((step, i) => (
            <div key={i} onClick={() => setSeeStep(i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, marginBottom: 6, cursor: "pointer", background: i === seeStep ? "#052e1699" : "#0f172a", border: i === seeStep ? "1px solid #4ade8044" : "1px solid #1e293b", transition: "all 0.2s" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748b", minWidth: 40 }}>Bit {step.bit}</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontFamily: "monospace" }}>
                A={step.a} + B={step.b} + Cin={step.cin} → <strong style={{color: i <= seeStep ? "#4ade80" : "#475569"}}>Sum={step.sum}</strong>, Cout={step.cout}
              </div>
              {i < seeStep && <div style={{ marginLeft: "auto", color: "#4ade80", fontSize: "0.75rem" }}>✓</div>}
              {i === seeStep && <div style={{ marginLeft: "auto", color: "#4ade80", fontSize: "0.75rem" }}>←</div>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {seeStep > 0 && <button style={s.btnGhost} onClick={() => setSeeStep(i => i - 1)}>← Prev bit</button>}
          {seeStep < steps.length - 1
            ? <button style={s.btn()} onClick={() => setSeeStep(i => i + 1)}>Next bit →</button>
            : <button style={s.btn()} onClick={() => setStage(3)}>Now wire it yourself →</button>}
        </div>
      </div>
    );
  }

  function renderTryIt() {
    // Student builds a half adder by selecting which gates to wire
    const ha = halfAdder(tryInputs.a, tryInputs.b);
    const xorWired = wiredGates.includes("XOR");
    const andWired = wiredGates.includes("AND");
    const complete = xorWired && andWired;

    if (tryDone) {
      return (
        <div style={s.card}>
          <div style={s.h2}>✅ You built a half adder!</div>
          <div style={s.p}>
            XOR gave you the sum bit. AND gave you the carry bit. Together they make a circuit that adds two binary digits correctly — from nothing but switches.
            Chain two of these and an OR gate and you have a full adder. Chain four full adders and you have a 4-bit ALU.
            <strong style={{color:"#f1f5f9"}}> Every processor ever built grows from exactly this.</strong>
          </div>
          <button style={s.btn()} onClick={() => setStage(4)}>Take the Challenge →</button>
        </div>
      );
    }

    return (
      <div style={s.card}>
        <div style={s.h2}>🧪 Wire Your Own Half Adder</div>
        <div style={s.p}>
          Select the two gates that make a half adder. Tap each gate to wire it in.
          Then test your circuit with different inputs.
        </div>
        {/* Gate selection */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {["XOR", "AND", "OR", "NOT"].map(g => {
            const wired = wiredGates.includes(g);
            const wrong = wired && !["XOR","AND"].includes(g);
            return (
              <div key={g} onClick={() => {
                if (wired) setWiredGates(ws => ws.filter(w => w !== g));
                else if (wiredGates.length < 2) setWiredGates(ws => [...ws, g]);
              }} style={{ padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: "0.84rem", background: wired ? (wrong ? "#450a0a" : "#14532d") : "#0f172a", border: wired ? (wrong ? "2px solid #ef4444" : "2px solid #4ade80") : "1px solid #334155", color: wired ? (wrong ? "#fca5a5" : "#4ade80") : "#94a3b8", transition: "all 0.2s" }}>
                {wired ? (wrong ? "✗ " : "✓ ") : ""}{g}
              </div>
            );
          })}
        </div>
        {/* Wrong gate feedback */}
        {wiredGates.some(g => !["XOR","AND"].includes(g)) && (
          <div style={{ ...s.infoBox("#ef4444"), fontSize: "0.8rem", color: "#fca5a5" }}>
            💡 Think about which gate matches the Sum column and which matches the Carry column of binary addition.
          </div>
        )}
        {/* Test inputs */}
        {complete && !wiredGates.some(g => !["XOR","AND"].includes(g)) && (
          <div>
            <div style={{ ...s.infoBox("#4ade80") }}>
              <div style={{ color: "#4ade80", fontWeight: 700, marginBottom: 8 }}>✅ Correct! Now test it:</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                {[{ label:"A", key:"a" }, { label:"B", key:"b" }].map(({ label, key }) => (
                  <div key={key} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 4 }}>{label}</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[0,1].map(v => <button key={v} style={s.bitBtn(tryInputs[key] === v)} onClick={() => setTryInputs(t => ({...t, [key]: v}))}>{v}</button>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#f1f5f9" }}>
                {tryInputs.a} + {tryInputs.b} → Sum: <strong style={{color:"#4ade80"}}>{ha.sum}</strong>, Carry: <strong style={{color:"#fbbf24"}}>{ha.carry}</strong>
              </div>
            </div>
            <button style={s.btn()} onClick={() => setTryDone(true)}>That's working! →</button>
          </div>
        )}
      </div>
    );
  }

  function renderChallenge() {
    const { pairs, rights } = rightOrder;
    const allMatched = Object.keys(matched).length === pairs.length;
    function tapLeft(l) { if (!matched[l]) setSelLeft(l); }
    function tapRight(r) {
      if (!selLeft) return;
      const ok = pairs.find(p => p.left === selLeft)?.right === r;
      if (ok) setMatched(m => ({ ...m, [selLeft]: r }));
      else { setWrongFlash(r); setTimeout(() => setWrongFlash(null), 600); }
      setSelLeft(null);
    }
    return (
      <div style={s.card}>
        <div style={s.h2}>🎯 Match Gate to Function</div>
        <div style={s.p}>Tap a gate on the left, then tap its description on the right.</div>
        <div style={{ color: "#64748b", fontSize: "0.72rem", marginBottom: 12 }}>{Object.keys(matched).length} / {pairs.length} matched</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 120px" }}>
            {pairs.map(p => <div key={p.left} onClick={() => tapLeft(p.left)} style={{ background: matched[p.left] ? "#14532d44" : selLeft === p.left ? "#052e16" : "#0f172a", border: matched[p.left] ? "1px solid #4ade8055" : selLeft === p.left ? "2px solid #4ade80" : "1px solid #334155", borderRadius: 10, padding: "10px 12px", marginBottom: 8, cursor: matched[p.left] ? "default" : "pointer", fontSize: "0.8rem", color: matched[p.left] ? "#4ade80" : selLeft === p.left ? "#4ade80" : "#e2e8f0", transition: "all 0.15s" }}>{matched[p.left] ? "✅ " : selLeft === p.left ? "👉 " : ""}{p.left}</div>)}
          </div>
          <div style={{ flex: "1 1 160px" }}>
            {rights.map(r => <div key={r} onClick={() => tapRight(r)} style={{ background: Object.values(matched).includes(r) ? "#14532d44" : wrongFlash === r ? "#450a0a" : "#0f172a", border: Object.values(matched).includes(r) ? "1px solid #4ade8055" : wrongFlash === r ? "2px solid #ef4444" : "1px solid #334155", borderRadius: 10, padding: "10px 12px", marginBottom: 8, cursor: Object.values(matched).includes(r) ? "default" : "pointer", fontSize: "0.78rem", color: Object.values(matched).includes(r) ? "#4ade80" : "#94a3b8", transition: "all 0.15s" }}>{Object.values(matched).includes(r) ? "✅ " : ""}{r}</div>)}
          </div>
        </div>
        {allMatched && <button style={s.btn()} onClick={() => setStage(5)}>All matched — Quiz time →</button>}
      </div>
    );
  }

  function renderQuiz() {
    if (quizFinished) return (
      <div style={s.card}>
        <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: 10 }}>🏆</div>
        <div style={s.h2}>Lesson 2 Complete!</div>
        <div style={s.p}>{student?.name ? `Excellent, ${student.name}!` : "Excellent!"} You understand how switches become binary, binary becomes gates, gates become adders. Lesson 3 will show how the physical switch evolved from clicking relay to nanometre transistor.</div>
        <button style={s.btn()} onClick={() => onUnitComplete?.()}>Continue to Lesson 3 →</button>
      </div>
    );
    const q = quiz[quizIdx];
    return (
      <div style={s.card}>
        <div style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: 1, marginBottom: 6 }}>QUIZ — QUESTION {quizIdx + 1} OF {quiz.length}</div>
        <div style={{ height: 4, background: "#1e293b", borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(quizIdx / quiz.length) * 100}%`, background: "#4ade80", transition: "width 0.4s" }} />
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
        <div style={s.unitLabel}>Unit 0 · Lesson 2 of 3 · Computer Organization & Architecture</div>
        <div style={s.unitTitle}>Switches, Binary & How Machines Add</div>
      </div>
      <div style={s.stageBar}>{stageLabels.map((label, i) => <div key={i} style={s.stageDot(stage === i, stage > i)}>{label}</div>)}</div>
      {stageRenderers[stage]()}
    </div>
  );
}
