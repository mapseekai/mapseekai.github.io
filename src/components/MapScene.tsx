import { memo, useId } from 'react';
import type { ProductId } from '../content/site';

export type MapTheme = 'forest' | 'ink' | 'sand';
export type LayerId = 'buildings' | 'green' | 'roads';

function mapPalette(theme: MapTheme) {
  const token = (role: string) => `var(--map-${theme}-${role})`;
  return { ground: token('ground'), water: token('water'), park: token('park'),
    block: [1, 2, 3, 4].map((index) => token(`block-${index}`)),
    line: token('line'), selected: token('selected') };
}

const buildings = Array.from({ length: 19 * 14 }, (_, index) => {
  const row = Math.floor(index / 19);
  const col = index % 19;
  const x = col * 64 + 10;
  const y = row * 54 + 10;
  const seed = (row * 17 + col * 7) % 11;
  return { x, y, width: 40 + seed % 5, height: 31 + seed % 4, seed, park: seed === 0 || (col === 5 && row > 4 && row < 9) };
});

export const MapScene = memo(function MapScene({
  mode = 'cloud', theme = 'forest', zoom = 1, layers = { buildings: true, green: true, roads: true }, selected = false,
}: {
  mode?: ProductId;
  theme?: MapTheme;
  zoom?: number;
  layers?: Record<LayerId, boolean>;
  selected?: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const palette = mapPalette(theme);
  return (
    <svg className="map-scene" viewBox="0 0 900 610" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`城市街区概念地图，${mode === 'loom' ? '展示几何节点' : mode === 'design' ? '展示地图配色' : '展示建筑、道路和绿地'}`}>
      <defs>
        <pattern id={`${uid}-grid`} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="var(--map-grid)" strokeOpacity=".055" strokeWidth="1" /></pattern>
        <clipPath id={`${uid}-land`}><path d="M-600-500H615C520-190 690-60 659 90S626 291 720 360S1060 450 1350 1040H-600Z" /></clipPath>
      </defs>
      <rect width="900" height="610" fill={palette.ground} />
      <g transform={`translate(450 305) scale(${zoom}) translate(-450 -305)`}>
        <g transform="translate(-138 -80) rotate(-22 470 310)">
          <rect x="-500" y="-500" width="2500" height="2000" fill={palette.water} />
          <path d="M-600-500H615C520-190 690-60 659 90S626 291 720 360S1060 450 1350 1040H-600Z" fill={palette.ground} />
          <g clipPath={`url(#${uid}-land)`}>
            {layers.green && <>
              <path d="M310 245H459V438H310Z" fill={palette.park} />
              <path d="M604-140C563 5 653 28 631 160S640 318 721 384L691 415C593 339 573 254 594 137S565-15 574-140Z" fill={palette.park} />
            </>}
            {layers.roads && <g fill="none" stroke="var(--map-road)" strokeWidth="9">
              {Array.from({ length: 22 }, (_, i) => <path key={`v${i}`} d={`M${i * 64} -200V1200`} />)}
              {Array.from({ length: 18 }, (_, i) => <path key={`h${i}`} d={`M-400 ${i * 54}H1500`} />)}
            </g>}
            {buildings.map(({ x, y, width, height, seed, park }, index) => park ? layers.green && <rect key={index} x={x} y={y} width={width} height={height} fill={palette.park} /> : layers.buildings && (
              <g key={index} fill={palette.block[seed % 4]} stroke={palette.line} strokeWidth=".55">
                <rect x={x} y={y} width={seed % 3 === 0 ? width : width * .56} height={height} />
                {seed % 3 !== 0 && <rect x={x + width * .66} y={y} width={width * .34} height={height} />}
                {seed % 2 === 0 && <rect x={x + 5} y={y + 5} width="10" height="9" fill={palette.ground} />}
              </g>
            ))}
            {layers.roads && <>
              <path d="M-120 550L345 223L440 183L690 3M-10 152L437 466L856 649" fill="none" stroke={palette.line} strokeWidth="17" />
              <path d="M-120 550L345 223L440 183L690 3M-10 152L437 466L856 649" fill="none" stroke="var(--map-road)" strokeWidth="13" />
              <path d="M-120 550L345 223L440 183L690 3" fill="none" stroke="var(--map-road-core)" strokeWidth="2" />
            </>}
            {layers.green && <g fill="var(--map-tree)" opacity=".72">
              {Array.from({ length: 27 }, (_, i) => <circle key={i} cx={326 + (i % 5) * 25} cy={268 + Math.floor(i / 5) * 28} r={5 + i % 3} />)}
            </g>}
          </g>
          <path d="M948-200C761 69 843 235 1040 295S1360 595 1510 850H1850V-200Z" fill={palette.ground} />
          {layers.roads && <path d="M609 97L908 97M691 383L1065 383" stroke="var(--map-road)" strokeWidth="13" />}
          <path d="M602-100C642 14 750 66 726 212S841 371 1036 523" fill="none" stroke="var(--map-waterline)" strokeWidth="1.3" strokeDasharray="6 7" />
          {(mode === 'loom' || selected) && <g>
            <path d="M460 279L562 279L562 357L499 383L460 355Z" fill={palette.selected} fillOpacity=".2" stroke={palette.selected} strokeWidth="2.3" />
            {[[460,279],[562,279],[562,357],[499,383],[460,355]].map(([x,y]) => <rect key={`${x}-${y}`} x={x-4} y={y-4} width="8" height="8" fill="var(--map-selection-ink)" stroke={palette.selected} strokeWidth="2" />)}
          </g>}
        </g>
        <g fontFamily="var(--font-body)" fill="var(--map-label)" fontSize="10" letterSpacing="0">
          <text x="269" y="299" transform="rotate(-22 269 299)">Central garden</text>
          <text x="450" y="146" transform="rotate(-22 450 146)">Riverside</text>
          <text x="752" y="370" transform="rotate(22 752 370)" fill="var(--map-label)" fontSize="12" letterSpacing="0">River</text>
          <text x="142" y="492" transform="rotate(-22 142 492)">West quarter</text>
        </g>
        {mode === 'cloud' && layers.buildings && <g>
          {[[490,269],[256,405],[584,426]].map(([x,y], i) => <g key={i}><circle cx={x} cy={y} r="11" fill="var(--color-accent)" fillOpacity=".12"/><circle cx={x} cy={y} r="4" fill="var(--color-accent)" stroke="var(--map-selection-ink)" strokeWidth="2"/></g>)}
        </g>}
      </g>
      <rect width="900" height="610" fill={`url(#${uid}-grid)`} pointerEvents="none" />
    </svg>
  );
});
