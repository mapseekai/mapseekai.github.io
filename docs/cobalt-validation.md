# Cobalt redesign validation

Validated on 2026-10-26 against the production build, before publication.

## Executed checks

| Check | Result |
| --- | --- |
| TypeScript and client/SSR production build | Passed |
| Static regression tests | 9 passed; original tests unchanged, 4 added |
| Browser functional checks through Ego | 16 passed |
| Responsive matrix | 40 passed: 8 widths × 5 routes |
| Automated accessibility | 7 page/states, no confirmed A/AA violations |
| JavaScript-disabled homepage | Text, six sections and static map remain visible |
| Hallmark static rules | 0 FAIL, 0 REFLEX, 1 nonblocking Finish warning |
| Original links and handlers | Hallmark recorded 26/26 links and 16/16 handlers retained |

Responsive widths: 320, 375, 414, 768, 1024, 1280, 1440 and 1920px. Checked homepage, Design product page, blog index, ecosystem and a long article. The 1280×800 hero keeps headline and actions in the first viewport. Desktop and mobile screenshots were visually inspected.

Functional checks include character/point rendering, pause/resume, offscreen suspension, reduced motion, shortcut search, search empty state, Escape and focus return, tab keyboard controls, layers, feature selection, three map palettes, zoom bounds/reset, mobile navigation, blog search and ecosystem filtering.

## Findings fixed

- Native search input consumed Escape before the dialog. Escape is now handled in the dialog capture phase; closing returns focus to its trigger.
- Dialog entry faded readable controls below their normal contrast. Its entry now moves without fading text.
- Named groups now have explicit group roles.
- Map transitions cancel when the reduced-motion preference changes.
- Geographic fallback uses the existing `/assets/` convention, preserving the original internal-link test rather than weakening it.

## Limits

The accessibility scanner still marks some colour-contrast cases as incomplete over SVG/map imagery or overlapping surfaces. No confirmed violation is not a complete WCAG certification. The Hallmark Finish warning concerns selection-state/button recipes; it is retained rather than suppressed.

Hallmark's own Puppeteer render pass and the pre-existing Playwright suite were not run in this revision. Browser execution used Ego, with the matrix and interactions described above. No fresh-context second-agent review was performed.

No customer counts, pricing, product endpoints, testimonials or live telemetry were invented. The working city map remains explicitly labelled as a local concept demonstration. The hero's geographical field is based on the documented public-domain asset, not real-time system activity.

## Reproduction

```sh
VITE_SITE_URL=https://mapseekai.github.io pnpm build
pnpm test
```

Design: [design.md](../design.md). Assets: [asset-sources.md](asset-sources.md). The local raw test results and screenshots are intentionally excluded from the public source repository.
