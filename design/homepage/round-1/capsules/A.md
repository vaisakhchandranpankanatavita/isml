# Direction A

**Premise.** The school runs on registers: roll numbers, admission numbers, affiliation no. 6130007, school code 90170. Everything a parent learns about ISML arrives as an entry in an ordered list. Behaves like a register because every line is counted and equal, so the page is one numbered list of 19 lines where nothing is promoted by size.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** Commit Mono v1.43, Eigil Nikolajsen (Denmark), SIL OFL 1.1 (fonts/CommitMono-LICENSE.txt). Self-hosted OTF 400/700. Fallback: ui-monospace.

**Type rules.** One size (15px desktop / 13.5px mobile), line-height 1.75. Hierarchy by weight only: 700 for the school name and admissions; 400 for everything else. Sentence case as supplied. Tabular, slashed-zero numerals. Line numbers 01-19 in a 5ch hanging column; grade ranges indented 4ch under their stage. The principal's sentence has no extra emphasis beyond its position.

**Colour.** Canvas #f1ede4 (warm paper). One text colour: #1b2a55 navy, 100% of text (11.9:1).

**Space.** Left-anchored, max 78ch, left margin 4ch, right side left empty. Group gaps of 3.5em between clusters (identity, facts, stages, voice, admissions). No columns beyond the number gutter.

**Signature relationship.** Continuous counted numbering running through identity, stages, principal and call to action alike: the child's journey and the institution share one ledger.

**Invariants if continued.** Single size; numbered gutter; one ink colour; weight is the only emphasis. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Line numbers are added structure, not school copy. May read as dry for families; density at 15px on large screens.

**Round 2 translation.** Carry the numbered gutter into nav, news and notices (each item gets its ordinal). Photography, when added, sits as numbered entries, not heroes. No display sizes. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
