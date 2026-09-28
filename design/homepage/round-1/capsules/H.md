# Direction H

**Premise.** The principal's sentence ends at 'our gates'. Behaves like a gate because the public sees one face outside and the child meets another inside, so the page is split into outside (left, uppercase signage), the opening (centre, admissions) and inside (right, stages and story).
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** TeX Gyre Heros regular/bold, GUST e-foundry (Poland), GUST Font License. Fallback: Arial (metric-close).

**Type rules.** Outside: uppercase bold +0.035em, name 34-72px. Opening: admissions bold 22-38px centred. Inside: stage names bold 24-42px, right-aligned sentence case. Closing sentence 22-46px centred across all columns.

**Colour.** Canvas #e0a526 ochre. Primary #141414 (~45%: outside) 8.4:1; secondary #16307a blue (~40%: inside) 5.5:1; tertiary #5c1f00 brown (~15%: the threshold, admissions and 'walks through our gates.') 5.8:1.

**Space.** Three columns 1 : 0.9 : 1 with 2vw margins; the central column is vertically centred and mostly empty; outer columns hug their edges.

**Signature relationship.** An empty central gate with admissions standing in the opening; the only full-width line is the one that crosses it.

**Invariants if continued.** Outside/inside split; brown only for the threshold; uppercase only outside. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Mid-width layouts need care; the ochre canvas is strong across a whole site.

**Round 2 translation.** Header = outside, content = inside; key actions (apply, visit) always in the opening. Inner pages may drop the split but keep colour roles. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
