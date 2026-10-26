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

## Product edition: alpine satellite imagery

- Source article: [How Glaciers Turn Lakes Turquoise](https://science.nasa.gov/earth/earth-observatory/how-glaciers-turn-lakes-turquoise-145055/), NASA Earth Observatory, May 20, 2019.
- Image: Landsat 8 OLI, May 12, 2019; NASA Earth Observatory image by Lauren Dauphin, using Landsat data from the U.S. Geological Survey.
- Download: `https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/145000/145055/newzealand_oli_2019132_lrg.jpg?fit=clip&w=2400`.
- Local derivatives: `public/assets/atelier/alpine-lakes.webp` (2200×1600) and `alpine-lakes-small.webp` (960×720). The source was cropped to exclude the black no-data edge, resized and WebP-encoded. The hero adds a CSS contrast scrim; the Cloud preview overlays explicitly fictitious research boundaries and observation points.
- Attribution appears in the product footer. NASA/USGS imagery is shown as an example of spatial information, not as a customer, partnership, or endorsement.
- Usage reference: [NASA Images and Media Usage Guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/).

## Vector district

The Riverside district is a deterministic, synthetic illustration authored for this website. It is not a map of a real surveyed location. Nodes use local SVG coordinates, not projected metres or latitude/longitude. The exported SVG contains the selected sample geometry and palette only; it contains no private product data.
