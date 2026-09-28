# Direction C

**Premise.** CBSE learning happens through textbooks: chapter number, heading, justified running text, a contents table. Behaves like a schoolbook because parents and children already know how to read one, so the homepage is set as lesson one of a primer.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** TeX Gyre Schola (regular/italic/bold/bold-italic), GUST e-foundry (Poland), GUST Font License (LPPL-based; free incl. commercial and web; renaming requested for modified derivatives) (fonts/TeXGyre-GUST-FONT-LICENSE.txt). Fallback: Century Schoolbook.

**Type rules.** 19px body, line-height 1.6, justified with auto hyphenation, first-line indents 1.6em after the first paragraph. Title 2.6em bold centred; tagline italic 1.25em; section heads bold small caps with chapter numerals 1 and 2. Stage table: bold names left, tabular grades right-aligned.

**Colour.** Canvas #f7efcf pale exercise-book yellow. Primary #2b1d14 ink-brown (~75%, 14.1:1); secondary #b3261e textbook red (~12%: tagline, chapter heads, admissions) 5.7:1; tertiary #3f5d7a slate blue (~13%: dates, grades, principal's title) 6.0:1.

**Space.** Single centred column 34em, 12vh top, sections separated by 5.5em, closing call 7em. Symmetric, book-like margins.

**Signature relationship.** Red chapter heading over a justified schoolbook paragraph: the homepage reads as lesson one.

**Invariants if continued.** Schoolbook face; red reserved for headings and the call; justified text with indents; centred title page. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Chapter numerals 1/2 added as structure. Closest to a conventional reading layout, so it may feel safe; justification on narrow screens needs hyphenation QA.

**Round 2 translation.** Every inner page becomes a chapter (Academics = 2, Admissions = 3...). Notices as numbered exercises. Photographs as captioned plates. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
