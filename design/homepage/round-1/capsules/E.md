# Direction E

**Premise.** Families choose a school by the person who greets them at the gate. Behaves like a welcome because the principal speaks before the institution introduces itself, so the principal's sentence is the opening display and the institutional facts follow at small size.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** Libertinus Serif 7.051 (Regular/Italic/Semibold), Libertinus project (fork of Linux Libertine, Germany), SIL OFL 1.1 (fonts/Libertinus-OFL.txt). Fallback: Georgia.

**Type rules.** Principal's words: italic 34-88px, line-height 1.08, four hand-set lines with staggered indents (0, 1.2em, 0.4em, 2em) following the breath of the sentence. Attribution name semibold all-small-caps. Facts 17px roman, oldstyle proportional figures.

**Colour.** Canvas #8f3a1c terracotta. Primary #fff4e6 (~55%: voice, names, stage names, admissions) 6.9:1; secondary #f2c9a8 (~45%: facts, grades, attribution title) 4.9:1.

**Space.** 7vw margins. Voice fills the first viewport. 22vh silence, then a three-column band of facts with 3em x 4vw gaps.

**Signature relationship.** A spoken sentence, broken by breath, leading the homepage before the school's own name appears.

**Invariants if continued.** Voice-first order; italic reserved for speech and the invitation; oldstyle figures. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). School name is secondary on first view; identity must come from the header in Round 2. Secondary colour at 4.9:1 fine for body; keep >=16px.

**Round 2 translation.** Each section opens with a human sentence (teacher, student, alumni) in the italic display, followed by facts. Nav stays small and roman. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
