# Direction B

**Premise.** ISML's own story is a growth figure: 9 teachers, 90 students, now nearly 2200. Behaves like enrolment growth because each number is an order of magnitude on the last, so type size, weight and width all scale with the number and with the stages.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** Junicode 2 variable (wght 300-700, wdth 75-125, roman + italic), Peter S. Baker (US, independent), SIL OFL 1.1 (fonts/Junicode-OFL.txt). Fallback: Georgia (loses width axis; not proof).

**Type rules.** Body 16-19px, weight 300. The 9 at 2.2em wdth 75 wght 300; 90 at 6.5em wdth 88 wght 420; 2200 at up to 31vw wdth 125 wght 700, line-height 0.78. Stages grow left to right: 1.1em/300/78% to 2.7em/680/122%. Principal in italic 300 at 1.45em. Sentence case; lining proportional numerals.

**Colour.** Canvas #0e3b2c deep green (the '16 acres of lush green land'). Primary #f5efe0 cream (~40%: numbers, stage names, principal, school name) 10.9:1; secondary #a9d2b3 sage (~60%: running sentences, grades, attribution) 7.5:1.

**Space.** Left margin 9vw, right 4vw. Growth sentence breaks around its numbers; 2200 bleeds to the left edge. Explanatory copy pushed right at 34ch. Large vertical silences (14-16vh); quote indented 18vw.

**Signature relationship.** The same typeface physically grows (width, weight and size together) as the numbers and grades rise.

**Invariants if continued.** Size/weight/width tied to quantity or stage order; cream = named things, sage = the sentence around them. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Repeats the growth sentence once (supplied language). 2200 at 31vw must not become a stat-hero cliche; it works only because 9 and 90 precede it.

**Round 2 translation.** Use the growth axis for stage pages (Foundational narrowest/lightest to Senior widest/heaviest), results pages and anniversaries. Never scale arbitrary words. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
