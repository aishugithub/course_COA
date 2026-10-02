# Foothold COA: revision audit (2026-10-01)

## 1. Abbreviations used before they are explained

| Unit | Short names used without (or long before) their full form |
|---|---|
| 0.1 | ISA, GPU |
| 0.2 | MSB / LSB |
| 0.3 | IC, MOSFET, VLSI, SRAM / DRAM |
| 1.1 | HDD, SSD, L1 |
| 1.3 | USB, I/O |
| 1.5 | CLA, CMA, LDA, STA, BUN, ION, SKI, SKO (instruction mnemonics shown before they are decoded) |
| 1.6 | RTL (RTN in 1.2; check that the two names match) |
| 2.1 | MUX |
| 2.3 | **MFC**: used about 30 times; its full form first appears near line 444 |
| 2.6 | RF (register file) |
| 3.2 | CPI: only defined in a code comment |
| 3.4 | FSM; the predictor states SNT / WNT / WT / ST |
| 4.1 | OS |
| 4.2 | BIOS, CS / OE / WE chip pins, UV |
| 4.3 | MRU |
| 4.6 | **MMU**: the unit title, never spelled out (Memory Management Unit) |
| 5.1 | KIN, DOUT, DATAIN, ASCII |
| 5.2 | **IRQ, ISR, PS, IE**: fixed in the pilot |
| 5.4 | BR / BG (bus request / grant), plus IRQ/IE again |
| 5.5 | PCI, SCSI (named before 5.6 explains them) |
| 5.6 | AD, BE, FRAME#, IRDY#, TRDY#, DEVSEL#, SAS, SATA |

The list comes from an automated scan and spot checks, so a few entries may already be explained in words nearby.

## 2. Module 5 is much thinner than the rest

Module 5 units have about 270–325 lines each. Modules 0–4 have about 450–900. In Module 5:
- There are no analogies and no worked example with real numbers or addresses.
- Several ideas appear only as text in a 🔑 box (priority, nesting, daisy chain, interrupt latency).
- Some links back to earlier units are wrong. For example, 5.2 said an interrupt is "like a subroutine call", but subroutines are never taught.

## 3. Module 5: all seven units rebuilt (2026-10-01, in the working tree, not committed)

Units 5.1, 5.2, 5.3, 5.4, 5.5, 5.6 and 5.C all follow the pattern below. Unit 5.2 was the pilot.

- A 📖 **New words** box opens every section. It gives each abbreviation's full form and a plain meaning.
- Teal **tap-to-expand** chips let students look a word up again anywhere in the unit.
- Analogies:
  - doorbell = IRQ
  - bookmark = PC
  - "Do Not Disturb" sign = IE
  - speed-dial list = vector table
  - note passed along a row of desks = daisy chain
- Worked example: a marks-totalling program at address 1000 is interrupted by the key 'A'. The keyboard ISR is at address 2000. A live panel shows PC, IRQ, IE and the stack at each step.
- New interactive widgets: polling cost per keystroke (about 2 crore wasted checks), a stack that overflows when IE stays 1, a vectored-lookup table, and a daisy-chain/nesting picker.
- The quiz now uses the same scenarios.

## 4. Proposed order

1. ~~Module 5~~: done.
2. ~~Modules 0–4~~: done (2026-10-01).
   - Every lesson has a 📖 word bank at the top, listing each short name used in that unit with its full form, a plain meaning, and the unit where it was first taught.
   - The full form is now written in the text where each term first appears, including ALU, MFC, MUX, Hi-Z, MMU, TLB, BTB, CS/OE/WE, PROM/EPROM/EEPROM, FIFO/LRU and Mano's LDA/STA/BUN and the rest.
3. Still open: the earlier units could also get richer worked examples, as Module 5 did. This pass only fixed the abbreviations.
