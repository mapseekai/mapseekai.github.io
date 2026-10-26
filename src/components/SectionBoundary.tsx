/** Full-width section rule with small, non-interactive junction ticks at the content frame. */
export function SectionBoundary() {
  return <>
    <span className="section-divider" aria-hidden="true" />
    <span className="section-boundary" data-section-boundary="true" aria-hidden="true">
      <i className="section-boundary-tick edge-left" />
      <i className="section-boundary-tick edge-right" />
    </span>
  </>;
}
