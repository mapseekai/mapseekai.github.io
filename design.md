# MapseekAI design system

## Reference and direction

Hallmark **Cobalt** is the primary reference: https://www.usehallmark.com/themes/cobalt/ .
This revision replaces the previous dark hero by explicit user request. Use Cobalt's light field, hairlines, opposite-corner cuts and keycap controls; adapt its blue signal to Mapseek green. Do not combine unrelated catalog themes.

## Brand and typography

- Brand accent: `--color-accent: #166447`; paper: `#f8fbf9`; ink: `#18352b`.
- Graphite is a deep green `#103e31`, paired with its light ink. Reserve it for the interactive workflow band.
- Chinese-first local typography: Avenir Next with PingFang SC / Microsoft YaHei fallback. This intentionally replaces Cobalt's Latin-only font recommendation without a third-party font request.
- Body 16px, secondary text 14px, application labels 12px. Headings share one weight and colour.
- All palette, spacing, motion and map tokens live in `src/tokens.css`.

## Composition

- Hero: a concise two-line headline beside an animated character field derived from actual Natural Earth land geometry. No invented metrics or product dashboard.
- Three products: a ruled text index, followed by **one** working map demonstration with product tabs. Never repeat the same map in three product cards.
- Workflow: three selectable stages, connected input/output rows, and a route to the selected product. This is a relationship diagram, not a running backend workflow.
- Ecosystem: the actual project registry. Journal: editorial rows, not a wall of thumbnails.
- Existing product and article routes share the same type, borders and controls.
- Container capped at 1440px; desktop gutter 64px, mobile 16px. Every image-bearing column can shrink.
- Keycaps have a 3px bottom edge. Cut corners progressively enhance with `corner-shape`; regular corners remain the fallback.

## Motion

- Three primitives: feedback on controls, an on-entry reveal, and a pausable geographic field.
- Keycaps travel 1px on hover and depress on press. Navigation underlines use scaleX.
- Map product/theme changes crossfade with a 5px translation over 240ms.
- Section entry uses the Web Animations API once, 480ms; the default document is always visible.
- Workflow connectors draw once on stage selection; never an infinite moving data pipe.
- Geographic field is capped at 24fps and device pixel ratio 2. Cancel animation frames offscreen, in hidden tabs, when paused, and during cleanup.
- `prefers-reduced-motion` disables continuous motion, CSS animation and entry effects. A local SVG remains available without JavaScript or on data-fetch failure.
- No parallax, automatic carousels, cursor followers, artificial counters or mandatory animations before navigation.

## Interaction and access

- Quick access uses native `<dialog>`, product/page filtering, Cmd/Ctrl+K, arrow-key navigation and Escape.
- Both map and workflow tabs implement Left/Right, Home and End, with aria-selected and labelled panels.
- Preserve original product actions, map layer controls, zoom limits, article search, category filters and 404 behavior.
- Focus rings appear instantly. Mobile hit targets are at least 44px where the layout permits.
- Map demonstrations remain identified as local concept demonstrations. Publish no fictional registrations, customer numbers or releases.

## Implementation

- `src/styles.css`: shared shell and homepage.
- `src/workspace.css`: map workbench; `src/pages.css`: product and editorial routes.
- `SpatialField.tsx`, `Workflow.tsx`, `CommandMenu.tsx`, `SiteMotion.tsx`: bounded interactions.
- Data provenance: `docs/asset-sources.md`; validation: `docs/cobalt-validation.md`.
