# Rehearsal: sales dashboard

**Gold.** `img/sales-dashboard.jpg` and `img/kpi-cards.jpg`. The redraw keeps the layout, the lime and green palette, the card titles, the Dashboard, Insights and Records nav, the year select, the subscription filters, the metric dropdown, the download icon and the map of Saudi cities as the filter. Every number is a dummy value from `data.ts`. The map card keeps its hint and its best and worst lines, but the hint says "city" instead of the template's "state", and the lines name Saudi cities instead of the template's Wyoming and Alabama. The user menu and the bell are left out.

**Beats.** The pointer picks Jeddah on the map, and the cards answer nearest first: the map's count, the KPIs, the monthly chart, the subscriptions, then the pie. It picks Dammam. A second click on Dammam clears the filter, which is Tableau's own way to deselect a mark, and the pointer moves off to rest. That frame is also where the loop starts. The loop is about 12.3s, inferred from the film's marks: the first Jeddah change is at 1.60s and the next loop's is at 13.9s.

**Captured.** 1440 (wide design, 1120 by 655) and 390 (phone design, 358 by 322). The light and dark page themes. Every state of the loop at 1440, at 390 and in dark. Reduced motion, which shows the still: all of 2024 with no city picked. The final runs used the build of 21 November 2026.

**Gate.** All four runs (1440, 390, dark, reduced) end with these two lines:

```
film: inconclusive; watch the motion and inspect every image before approval
rehearsal passed (necessary, not sufficient: references/verify.md and the fresh eye in review.md still stand)
```

**Film.** Every warning names the kit's `Count` digit strips. They stand, because fixing them means changing the kit.

- "jump" (420 lines at 1440, 150 at 390, 330 in dark). Each is one digit span, "0" to "9", moving a whole strip in one frame. That is how `Count` rolls digits inside a clipped slot.
- "touching". The Orders, Revenue and Subscriptions titles overlap an `ss-count` box. The box is the digit strip, which reaches past its clipped slot. Zoomed captures of the cards show clear space between each title and its value.
- "settle snap", "handoff shift" and "appears with no entrance". All are on `ss-count` spans, where the kit swaps the rolling strips for the settled number.
- "manual: same-box content change" on the map, the sparklines and one chart. The cards redraw in place when a city is picked. Watched in motion.
- "inconclusive". The sampler missed frames (12 gaps over 48ms at 1440), so motion in those gaps went unjudged. One earlier run showed a jump on an `sd-bar` in its second loop. The final runs show no jump outside the digit strips.

Fixed during the work. The rank text in the map card ran into the map, so the map shrank from 250 to 226 wide. Filler bars vanished in dark mode, so the window body now sets light ink tokens with `.mo-light`.

**Review.** No separate reviewer ran. The owner didn't ask for subagents, so the author did the fresh-eye pass from the kit's `review.md`. It is not independent.

**Assumptions.** The original filters every card by the city picked on the map, as the handoff describes.

**Unresolved.** The `Count` warnings above.

**Not checked.** Real phones. Safari and Firefox, because every film ran in headless Chromium. Screen readers.

**Rerun.** Serve the site on port 8138, run `npm install` once in the stageshow skill folder, then run this from that folder. Add `--width 390`, `--dark` or `--reduced` for the other runs.

```bash
node scripts/film.mjs http://127.0.0.1:8138/ --select '[data-figure="sales"]' --states --states-for 14000 --gate --width 1440
```
