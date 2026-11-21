# Rehearsal: Insights tab

**Gold.** `img/insights.jpg`. The redraw keeps the nav with Insights active, the year select, the header card, and the first two charts of the first two rows with their titles. Those are Top 5 Cities by Revenue (bars with a line), Top 5 Cities with Most Active Business (bars shaded by value), Orders by Business Type (bars with a line) and Average revenue per business type (bars with an average line). Every number and the city list are dummy values. Jeddah's and Dammam's figures match the sales figure, and the orders by type add up to the sales figure's 96.84K. The header's subtitle is the template's leftover line about states, segments and ship modes, so the redraw shows it as a grey bar instead of repeating it. The third chart of each row lies past the frame's edge, as it does in the screenshot.

**Beats.** None. This is a still.

**Captured.** 1440 (wide design, 620 by 476, two rows of two charts) and 390 (phone design, 358 by 322: the header and the active-business chart). The light and dark page themes. Reduced motion, which shows the same still.

**Gate.** All four runs (1440, 390, dark, reduced) end with these two lines:

```
film: no-issues-detected; still capture only, motion was not judged
rehearsal passed (necessary, not sufficient: references/verify.md and the fresh eye in review.md still stand)
```

**Film.** The final runs report nothing. Fixed during the work:

- The top gutter was 28px against 24px on the left. Both are now 24px.
- At a 548px stage the city tick labels touched. The figure moved into a 620 to 476 pair with the Cloud figure, which gives it more width.
- The frame's bottom edge cut the "Polishing" label at a 470px stage. The gate missed this, and a measurement in the browser caught it. The fix was row padding of 14px, a 126px plot in the second row, and a 476px stage.

**Review.** No separate reviewer ran. The owner didn't ask for subagents, so the author did the fresh-eye pass from the kit's `review.md`. It is not independent.

**Assumptions.** The line in both combo charts is drawn as the average order. The screenshot doesn't say what the original's line measures, so the redraw doesn't label it.

**Unresolved.** Nothing beyond the assumption.

**Not checked.** Real phones. Safari and Firefox, because every film ran in headless Chromium. Screen readers.

**Rerun.** Serve the site on port 8138, run `npm install` once in the stageshow skill folder, then run this from that folder. Add `--width 390`, `--dark` or `--reduced` for the other runs.

```bash
node scripts/film.mjs http://127.0.0.1:8138/ --select '[data-figure="insights"]' --still --gate --width 1440
```
