# Direction J

**Premise.** ISML is felicitated for academic excellence and its tagline is 'In Pursuit of Excellence'. Behaves like a certificate of merit because the school's name and each stage are conferred rather than listed, so the page is a centred citation: calligraphic names, small uppercase facts.
Evidence: ISML site copy in src/services/storage.ts, OurStory.tsx, Hero.tsx (founded 1981; 9 teachers/90 students to ~2200 students/98 staff; 16 acres; CBSE KG-12 in four stages; principal's welcome; Admissions 2026-27).

**Font.** TeX Gyre Chorus medium italic, GUST e-foundry (Poland), GUST Font License; with Monaspace Krypton variable (GitHub Next, OFL). Fallback: none credible for Chorus; must stay self-hosted.

**Type rules.** Names/stages/admissions in chancery italic: name 52-150px, stages 30-52px, admissions 40-88px, principal's sentence 26-46px. Facts in Krypton 13px uppercase wght 300 +0.08em.

**Colour.** Canvas #ffffff. Primary #1a1a1a (~70%: facts, tagline, principal) 17.4:1; secondary #c8321e vermilion (~30%: conferred names: school, stages, admissions) 5.3:1.

**Space.** Centred 64em, long vertical silences (20-22vh) between five citations; stage row of 4 columns.

**Signature relationship.** Calligraphic conferred names above tiny uppercase citations.

**Invariants if continued.** Symmetric centring; calligraphy only for names; uppercase mono for facts. Working copy preserved exactly; the only visible ingredients are type, one flat canvas, text colour and whitespace.

**Provisional assumptions / risks.** Shared working copy was assembled from existing site copy ("Started in 1981" and "Nearly 2200 students..." capitalised from the About text; typographic apostrophe in Muscat's). Chancery italic at small sizes is hard to read; keep >=26px. Can drift towards a formality some families find distant.

**Round 2 translation.** Results, toppers and awards pages extend naturally; everyday notices stay in the mono. Photography, motion and UI components enter only after lock and must obey these rules rather than replace them.
