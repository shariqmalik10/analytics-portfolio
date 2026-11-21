# Rehearsal: lifetime dashboard on Tableau Cloud

**Gold.** `img/tableau-online.jpg`. The redraw keeps Tableau Cloud's slate toolbar with its icons, Edit, View: Original and Share, the dashboard title, the KPI strip, the Country Name filter with Saudi Arabia and Yemen, the SubscriptionType legend, the Month filter, and the Subscription Distribution pie under Business Analysis. Every number is a dummy value. The pie's two counts match the Professional and Trial KPIs. The rest of the KPI strip and the other two Business Analysis charts lie past the frame's edge. The screenshot's breadcrumb, its duplicated SubscriptionType legend and the red circle drawn around a toolbar icon are left out. The copy in `img/` was later cropped below the toolbar to remove that circle, so the redraw's toolbar follows the uncropped screenshot.

**Beats.** None. This is a still.

**Captured.** 1440 (wide design, 476 by 476) and 390 (phone design, 358 by 322: the toolbar's Edit, View and Share, the title, and four KPIs two to a row). The light and dark page themes. Reduced motion, which shows the same still.

**Gate.** All four runs (1440, 390, dark, reduced) end with these two lines:

```
film: no-issues-detected; still capture only, motion was not judged
rehearsal passed (necessary, not sufficient: references/verify.md and the fresh eye in review.md still stand)
```

**Film.** The final runs report nothing. They ran after Yemen was added to the country filter on 21 November 2026. A measurement in the browser puts the Month slider 39px above the frame's bottom edge. Fixed during the work:

- The visible part of the window was narrower than tall. The stage is now square, so the visible window is square too.
- Each KPI label sat 9px above its value, a loose stack. The gap is now 2px.
- On the phone design, the toolbar's insets were uneven. Share now sits at the right end, and the icon groups are dropped there.
- The Edit control didn't line up with the title below it. The label padding is gone, and the phone toolbar's padding is 16px, the same as the canvas.

**Review.** No separate reviewer ran. The owner didn't ask for subagents, so the author did the fresh-eye pass from the kit's `review.md`. It is not independent.

**Assumptions.** None.

**Unresolved.** Nothing.

**Not checked.** Real phones. Safari and Firefox, because every film ran in headless Chromium. Screen readers.

**Rerun.** Serve the site on port 8138, run `npm install` once in the stageshow skill folder, then run this from that folder. Add `--width 390`, `--dark` or `--reduced` for the other runs.

```bash
node scripts/film.mjs http://127.0.0.1:8138/ --select '[data-figure="cloud"]' --still --gate --width 1440
```
