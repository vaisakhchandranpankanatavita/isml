# Direction I

**Premise.** Children move up through Foundational, Preparatory, Middle and Senior. Behaves like floors of a building because each stage stands on the one below, so the four stages are strata that grow in weight and width, each carrying one fact about the school.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** Monaspace Argon (humanist mono) variable (wght 200-800, wdth 100-125), GitHub Next (US), SIL OFL 1.1 (fonts/Monaspace-LICENSE.txt). Fallback: ui-monospace.

**Type rules.** Stage names 28-104px, stepping wght 200/350/520/780 and wdth 100/108/116/125. Grades 14px +0.04em. Body 14px; principal 1.15em wght 300; admissions bold wdth 125.

**Colour.** Canvas #cfe5d8 pale mint. One text colour #0d2a1e (100%) 11.6:1.

**Space.** Header of three items spread across. Strata on a 7fr/3fr grid, 5vh apart; indents 4vw, 10vw, 16vw, then back to 4vw at Senior. Principal indented 30vw.

**Signature relationship.** Each stage physically heavier and wider than the last, with the school's facts placed one per stratum.

**Invariants if continued.** Stage weight/width ladder; one colour; mono throughout. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Pairing facts with stages is compositional, not semantic; must not imply the fact belongs to that stage. Related growth idea to B, applied to stages instead of numbers.

**Round 2 translation.** Stage pages inherit their stratum's weight/width. Navigation could be the ladder. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
