# Direction F

**Premise.** ISML's existence is a span of years: started in 1981, admissions for 2026-27. Behaves like a school calendar because everything a child does happens between those two years, so 1981 and 2026-27 stand as vertical edges framing the page while content scrolls between them.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** Monaspace Xenon (slab mono) variable (wght 200-800, wdth 100-125), GitHub Next (US), SIL OFL 1.1 (fonts/Monaspace-LICENSE.txt). Fallback: ui-monospace.

**Type rules.** Edges: vertical writing mode, wght 800 wdth 125, figures ~8.5vh, sticky at full height; left edge reads bottom-to-top. Body 15px wght 300; h1 2.2em wght 700 wdth 112; tagline wght 200 wdth 125; stage names wght 600 wdth 118 at 1.5em.

**Colour.** Canvas #1d1a2e night ink. Primary #efe6d2 (~65%) 13.7:1; secondary #f0b429 amber (~20%: years and counts through time) 9.1:1; tertiary #b7a8e0 lilac (~15%: grades, position in sequence) 7.8:1.

**Space.** Three-column frame: left edge | 62ch column with 4vw padding | right edge. 12-16vh vertical silences between groups.

**Signature relationship.** Two sticky vertical years bracket every scroll position.

**Invariants if continued.** Year edges always present; amber only for time; lilac only for grade/sequence. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Left edge uses a 180-degree rotation for bottom-to-top reading (not distortion). Sticky edges take width on mobile. Dark canvas may feel heavy for a school.

**Round 2 translation.** Edges carry the current academic year and page-specific dates (event date, result year). News becomes a chronological list. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
