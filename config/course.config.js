// ============================================================
//  COURSE CONFIG — the ONLY file you edit per course
//  Change courseId, courseTitle, subtitle, batch
//  Then update modules and units to match your course
//
//  How it wires up (unchanged from the Foothold engine):
//    - Each `unitId` must EXACTLY match a file in src/lessons/
//      without the .jsx extension  (e.g. "Unit0_1" ↔ Unit0_1.jsx).
//    - Adding a lesson = drop the file in src/lessons/ + add one
//      line here. App.jsx auto-discovers lesson files via glob;
//      Dashboard.jsx renders module/unit cards straight from this list.
//    - `icon` is an optional emoji shown on the module card.
//    - Units ending in "_C" are the module capstones.
//    - `hook`  — the two attention lines at the top of the Dashboard.
//    - `blurb` — one catchy line per module (always shown on the module
//      row) and, optionally, per unit (shown under the unit title). Edit
//      all learner-facing copy HERE; the shell never hardcodes it.
// ============================================================

const COURSE_CONFIG = {

  courseId:    "course_COA",
  courseTitle: "Computer Organization & Architecture",
  subtitle:    "How a computer really works — from gates to running programs",
  batch:       "2025",

  hook: {
    line1: "You don't read Foothold. You click it, run it, and watch the machine think.",
    line2: "Every lesson is something you do — open any module below and see for yourself.",
  },

  modules: [
    {
      moduleId:    "M0",
      moduleTitle: "Before the Machine",
      icon:        "💡",
      blurb:       "Before you can build a computer, meet the problem it was born to solve. Where the whole idea came from.",
      units: [
        { unitId: "Unit0_1", title: "The Problem & The Dream",
          blurb: "For centuries, 'computer' was a job, not a machine. Meet the dream of making calculation automatic." },
        { unitId: "Unit0_2", title: "Bits & Boolean Logic",
          blurb: "Two symbols — 0 and 1 — and three tiny rules. That's the entire alphabet a computer thinks in." },
        { unitId: "Unit0_3", title: "From Relays to Transistors",
          blurb: "How a switch you can hear click became a switch too small to see — and the stored-program leap that made it a computer." },
      ],
    },
    {
      moduleId:    "M1",
      moduleTitle: "Basic Structure of Computers",
      icon:        "🖥️",
      blurb:       "Five parts, one bus, and a handful of operations. The whole skeleton of every computer, laid bare.",
      units: [
        { unitId: "Unit1_1", title: "The Five Functional Units" },
        { unitId: "Unit1_2", title: "Basic Operational Concepts" },
        { unitId: "Unit1_3", title: "Bus Structures" },
        { unitId: "Unit1_4", title: "Memory Locations & Addresses" },
        { unitId: "Unit1_5", title: "Memory Operations & Instructions" },
        { unitId: "Unit1_6", title: "Instruction Sequencing" },
        { unitId: "Unit1_C", title: "Capstone: Run a Program by Hand" },
      ],
    },
    {
      moduleId:    "M2",
      moduleTitle: "Inside the Processor",
      icon:        "⚙️",
      blurb:       "Open the CPU and watch a single instruction travel through it, one clock tick at a time.",
      units: [
        { unitId: "Unit2_1", title: "Register Transfers (RTL)" },
        { unitId: "Unit2_2", title: "Arithmetic & Logic Operations" },
        { unitId: "Unit2_3", title: "Fetching a Word from Memory" },
        { unitId: "Unit2_4", title: "Storing a Word in Memory" },
        { unitId: "Unit2_5", title: "Executing a Complete Instruction" },
        { unitId: "Unit2_6", title: "Multiple-Bus Organization" },
        { unitId: "Unit2_7", title: "Microprogrammed Control" },
        { unitId: "Unit2_C", title: "Capstone: Build the Control Sequence" },
      ],
    },
    {
      moduleId:    "M3",
      moduleTitle: "Pipelining",
      icon:        "🏭",
      blurb:       "Why wait for one instruction to finish before starting the next? Turn the CPU into an assembly line.",
      units: [
        { unitId: "Unit3_1", title: "The Role of Cache Memory" },
        { unitId: "Unit3_2", title: "The Pipeline Idea & Performance" },
        { unitId: "Unit3_3", title: "Data Hazards" },
        { unitId: "Unit3_4", title: "Instruction Hazards" },
        { unitId: "Unit3_5", title: "Instruction Sets, Datapath & Control" },
        { unitId: "Unit3_C", title: "Capstone: Schedule to Avoid Stalls" },
      ],
    },
    {
      moduleId:    "M4",
      moduleTitle: "Memory Organization",
      icon:        "🗄️",
      blurb:       "Fast, big, cheap — pick two. How computers fake having all three with a clever hierarchy of memory.",
      units: [
        { unitId: "Unit4_1", title: "The Memory Hierarchy" },
        { unitId: "Unit4_2", title: "RAM & ROM Chips" },
        { unitId: "Unit4_3", title: "Cache Memory & Mapping" },
        { unitId: "Unit4_4", title: "Associative Memory" },
        { unitId: "Unit4_5", title: "Auxiliary Memory" },
        { unitId: "Unit4_6", title: "Virtual Memory & the MMU" },
        { unitId: "Unit4_C", title: "Capstone: Trace an Address" },
      ],
    },
    {
      moduleId:    "M5",
      moduleTitle: "Input / Output Organization",
      icon:        "🔌",
      blurb:       "A keyboard, a disk, a network card — all far slower than the CPU. How they talk without wasting it.",
      units: [
        { unitId: "Unit5_1", title: "Accessing I/O Devices" },
        { unitId: "Unit5_2", title: "Interrupts" },
        { unitId: "Unit5_3", title: "Exceptions & Interrupts in the OS" },
        { unitId: "Unit5_4", title: "Direct Memory Access & Bus Arbitration" },
        { unitId: "Unit5_5", title: "Synchronous vs Asynchronous Buses" },
        { unitId: "Unit5_6", title: "Standard I/O Interfaces: PCI & SCSI" },
        { unitId: "Unit5_C", title: "Capstone: Design an I/O Flow" },
      ],
    },
  ],
};

export default COURSE_CONFIG;
