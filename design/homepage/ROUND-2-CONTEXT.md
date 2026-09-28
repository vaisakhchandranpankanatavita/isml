# Round 2 context: ISML homepage

**Locked direction:** G. Locked by the human on 2026-09-28 ("lock g"). Directions A–F and H–J are terminated; their files remain in round-1/ for the record only.

**Artifact scope (from the original request):** redesign the homepage of the ISML React app (src/pages/Home.tsx), using the site's real CMS copy.

**Human decisions so far:** Innovative workflow chosen; no git checkpoint before the redesign.

---

## Locked capsule: Direction G (unchanged from Round 1)

**Premise.** The principal names three outcomes: curiosity, character and confidence. Behaves like a school's stated promise because those three words are what a parent should remember, so they are set as the opening display, larger than the school's name.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** TeX Gyre Bonum regular/bold, GUST e-foundry (Poland), GUST Font License. Fallback: Bookman Old Style.

**Type rules.** Triad 44-200px bold ('and' regular), line-height 0.86, tracking -0.03em, lowercase as spoken; alignment alternates left/right/centre/indented. Full sentence 1.2em centred; attribution uppercase +0.14em. Identity 1.9em bold; stages 1.7em.

**Colour.** Canvas #5b1a1a maroon. One text colour #f6cfc4 blush (100%) 9.1:1.

**Space.** 3vw margins; triad fills the first viewport; 12-column grid below with identity cols 1-4 and facts cols 6-12; 16-18vh silences.

**Signature relationship.** Three nouns lifted from the principal's sentence as the homepage headline.

**Invariants if continued.** Triad lowercase and dominant; single colour; Bookman-lineage weight. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Triad is aria-hidden (it repeats the sentence that follows). Relies on repetition of supplied words; school should confirm these three values are the message.

**Round 2 translation.** Each of the three words can head a section (curiosity: academics, character: activities, confidence: results). Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
