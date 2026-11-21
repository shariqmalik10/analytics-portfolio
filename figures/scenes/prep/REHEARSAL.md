# Rehearsal: orders by location in Tableau Prep Builder

**Gold.** `img/prep-orders.jpg`. The redraw keeps the flow's steps and links in order: Locations and Users into Join 1, then Clean 1, Orders into Join 3, Clean 2, the custom SQL input "Fetching Order…" into Join 5, Aggregate 1, and Clean 3, which is selected. It also keeps the change icons on the steps, the toolbar with Publish and Alerts, and the profile pane with Clean 3's eight fields. The field counts and bins are dummy values. Two field names are cut short to fit their cards, as Prep does: "Standardi…" and "OrderChe…".

**Beats.** None. This is a still.

**Captured.** 1440 (wide design, 1120 by 600: the whole flow and the profile pane) and 390 (phone design, 358 by 310: the start of the flow, with the window running off the right and bottom). The light and dark page themes. Reduced motion, which shows the same still.

**Gate.** All four runs (1440, 390, dark, reduced) end with these two lines:

```
film: no-issues-detected; still capture only, motion was not judged
rehearsal passed (necessary, not sufficient: references/verify.md and the fresh eye in review.md still stand)
```

**Film.** The final runs report nothing. Fixed during the work:

- Field names ran past their cards. They are cut shorter now, and the counts are dummy values that fit.
- The bin bars were squeezed. Each bar now sits in a track that takes the free width.
- The gate reported an uneven inset on the window's title bar. That was a false positive. The kit centres the title in a box with a 36px right margin, and the gate measured that box. The window has no title now.

**Review.** No separate reviewer ran. The owner didn't ask for subagents, so the author did the fresh-eye pass from the kit's `review.md`. It is not independent.

**Assumptions.** The screenshot doesn't show the join types or what each Clean step does, and neither the redraw nor the page claims them.

**Unresolved.** Nothing.

**Not checked.** Real phones. Safari and Firefox, because every film ran in headless Chromium. Screen readers.

**Rerun.** Serve the site on port 8138, run `npm install` once in the stageshow skill folder, then run this from that folder. Add `--width 390`, `--dark` or `--reduced` for the other runs.

```bash
node scripts/film.mjs http://127.0.0.1:8138/ --select '[data-figure="prep"]' --still --gate --width 1440
```
