# Asset sources

## Geographic character field

The homepage field uses Natural Earth **1:110m land**, published in the public domain.

- Dataset: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson
- Usage terms: https://www.naturalearthdata.com/about/terms-of-use/
- Local geometry: `public/data/land-path.json`.
- Static no-script fallback: `public/assets/land-field.svg`.
- Transformation: longitude maps from -180..180 to 0..900; latitude maps from 85 southward at 3.5 units per degree. The composition crops Antarctica outside the view. No political boundaries are drawn.
- Original ring vertices are rounded to 0.1 screen units. Character density and a moving highlight are a visual treatment, not measurement, product telemetry or live activity.
- Both representations are served from the website itself. The page does not request a third-party map API at runtime.

## Design reference

Hallmark Cobalt: https://www.usehallmark.com/themes/cobalt/ . The implementation borrows the theme's visual system and motion principles, not Relay's business claims, copy or pricing.

## Existing demonstration

The city map remains the existing procedurally generated, explicitly labelled local concept demonstration. It is not advertised as a screenshot of a deployed Mapseek product.
