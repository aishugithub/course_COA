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
// ============================================================

const COURSE_CONFIG = {

  courseId:    "course_COA",                                  // localStorage + backend key; keep stable
  courseTitle: "Computer Organization & Architecture",        // CSE23CT201
  subtitle:    "How a computer really works — from gates to running programs",
  batch:       "2025",

  modules: [
    // ── M0 — the "why" before the machinery: the stored-program dream ──
    {
      moduleId:    "M0",
      moduleTitle: "Before the Machine",
      icon:        "💡",
      units: [
        { unitId: "Unit0_1", title: "The Problem & The Dream" },
        { unitId: "Unit0_2", title: "Bits & Boolean Logic" },
        { unitId: "Unit0_3", title: "From Relays to Transistors" },
        { unitId: "Unit0_4", title: "The Von Neumann Model" },
      ],
    },

    // ── M1 — Syllabus Unit 1: Basic Structure of Computers ──
    {
      moduleId:    "M1",
      moduleTitle: "Basic Structure of Computers",
      icon:        "🖥️",
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

    // ── M2 — Syllabus Unit 2: Processing Units ──
    {
      moduleId:    "M2",
      moduleTitle: "Inside the Processor",
      icon:        "⚙️",
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

    // ── M3 — Syllabus Unit 3: Pipelining ──
    {
      moduleId:    "M3",
      moduleTitle: "Pipelining",
      icon:        "🏭",
      units: [
        { unitId: "Unit3_1", title: "The Role of Cache Memory" },
        { unitId: "Unit3_2", title: "The Pipeline Idea & Performance" },
        { unitId: "Unit3_3", title: "Data Hazards" },
        { unitId: "Unit3_4", title: "Instruction Hazards" },
        { unitId: "Unit3_5", title: "Instruction Sets, Datapath & Control" },
        { unitId: "Unit3_C", title: "Capstone: Schedule to Avoid Stalls" },
      ],
    },

    // ── M4 — Syllabus Unit 4: Memory Organization ──
    {
      moduleId:    "M4",
      moduleTitle: "Memory Organization",
      icon:        "🗄️",
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

    // ── M5 — Syllabus Unit 5: Input / Output Organization ──
    {
      moduleId:    "M5",
      moduleTitle: "Input / Output Organization",
      icon:        "🔌",
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
