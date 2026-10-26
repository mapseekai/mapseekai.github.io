/** Decorative junction ticks at the two frame/divider intersections; never interactive. */
export function SectionBoundary() {
  return <span className="section-boundary" data-section-boundary="true" aria-hidden="true">
    <i className="section-boundary-tick edge-left" />
    <i className="section-boundary-tick edge-right" />
  </span>;
}
