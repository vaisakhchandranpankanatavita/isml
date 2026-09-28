# Direction D

**Premise.** Every ISML child carries a school diary: printed register facts plus handwritten notes between teacher, parent and child. Behaves like the diary because two voices share a page, so a typed register column sits beside a handwritten response column.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** Monaspace Neon (register) + Monaspace Radon (handwriting) variable (wght 200-800, wdth 100-125), GitHub Next (US), SIL OFL 1.1 (fonts/Monaspace-LICENSE.txt). Fallback: ui-monospace.

**Type rules.** Register: Neon 14px; name bold 700 wdth 125 uppercase. Handwriting: Radon at two sizes, 34-76px for tagline and 'Register today', 20-30px weight 300 for the story sentence and principal. Ligatures off in the register.

**Colour.** Canvas #dfe8f2 pale diary blue. Primary #1c2733 register ink (~35%) 12.2:1; secondary #0b54a6 pen blue (~40%: handwritten voice) 6.0:1; tertiary #4a5b6d graphite (~15%: dates, grades, counts) 5.6:1; accent #a8360a correction red (~10%: admissions only) 5.3:1.

**Space.** Two columns: 30ch register | 7vw gutter | flexible notes. Rows aligned pairwise with 9-14vh gaps. Mobile stacks each pair.

**Signature relationship.** The typed fact on the left answered by a handwritten line on the right, always pairwise.

**Invariants if continued.** Two-voice pairing; handwriting only for human voice and invitation; red only for the call to action. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Four colours need discipline in Round 2. Monospace handwriting is legible but informal; check with senior-school parents.

**Round 2 translation.** Nav and footers typed; greetings, principal and student voices handwritten. Forms can use the register/answer pairing for label/response. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
