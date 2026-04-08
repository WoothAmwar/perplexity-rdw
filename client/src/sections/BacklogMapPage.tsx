import { useEffect, useRef, useState } from 'react';
import { MapContainer, CircleMarker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import GlossaryTooltip from '../components/GlossaryTooltip';
import { useTheme } from '../App';

// RDW backlog by country — total contracted backlog $411.2M
const BACKLOG_COUNTRIES = [
  {
    id: 'USA',
    name: 'United States',
    lat: 38,
    lon: -100,
    value: 245,
    pct: 59.6,
    color: '#C8102E',
    programs: ['NASA ISS (iROSA/ELSA)', 'DoD / US SOF Stalker UAS', 'Axiom Station', 'Edge Autonomy SOFC production'],
  },
  {
    id: 'BEL',
    name: 'Belgium / EU',
    lat: 50.8,
    lon: 4.5,
    value: 68,
    pct: 16.5,
    color: '#8B5CF6',
    programs: ['EuroQCI Phase 1 complete', "MATTEO — Belgium's first national security satellite (prime contractor)"],
  },
  {
    id: 'GBR',
    name: 'United Kingdom',
    lat: 53.0,
    lon: -1.5,
    value: 32,
    pct: 7.8,
    color: '#1ABCB4',
    programs: ['QKDSat quantum comms backbone', 'NATO allied UAS deliveries'],
  },
  {
    id: 'UKR',
    name: 'Ukraine',
    lat: 49.0,
    lon: 32.0,
    value: 24,
    pct: 5.8,
    color: '#F59E0B',
    programs: ['Stalker XE tactical UAS — 200+ deployed in active theater'],
  },
  {
    id: 'UAE',
    name: 'UAE / Gulf',
    lat: 24.0,
    lon: 54.0,
    value: 18,
    pct: 4.4,
    color: '#10B981',
    programs: ['Commercial satellite infrastructure', 'ISR systems integration'],
  },
  {
    id: 'JPN',
    name: 'Japan',
    lat: 36.0,
    lon: 138.0,
    value: 14,
    pct: 3.4,
    color: '#0EA5E9',
    programs: ['JAXA ISS collaboration', 'Microgravity pharma trials (PIL-BOX)'],
  },
  {
    id: 'AUS',
    name: 'Australia',
    lat: -25.0,
    lon: 134.0,
    value: 10,
    pct: 2.4,
    color: '#D4A017',
    programs: ['ADF defense tech systems', 'Space tracking & ground segment'],
  },
];

// Scale radius: sqrt scale so area ∝ value, at 80% of previous sizes
const rScale = (value: number) => {
  const minR = 18 * 0.8, maxR = 70 * 0.8;
  const minV = 10, maxV = 245;
  return minR + (maxR - minR) * Math.sqrt((value - minV) / (maxV - minV));
};

// Tile URLs for light / dark
const TILE_LIGHT =
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
const TILE_DARK =
  'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

// Component to swap tile layer when theme changes
function ThemeAwareTile({ dark }: { dark: boolean }) {
  const map = useMap();
  const tileRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (tileRef.current) {
      map.removeLayer(tileRef.current);
    }
    const layer = L.tileLayer(dark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);
    tileRef.current = layer;

    return () => {
      map.removeLayer(layer);
    };
  }, [dark, map]);

  return null;
}

// Tracks mouse position relative to the map container for the DOM tooltip
function MouseTracker({ onMove }: { onMove: (pos: { x: number; y: number } | null) => void }) {
  const map = useMapEvents({
    mousemove(e) {
      const rect = map.getContainer().getBoundingClientRect();
      onMove({ x: e.originalEvent.clientX - rect.left, y: e.originalEvent.clientY - rect.top });
    },
    mouseout() {
      onMove(null);
    },
  });
  return null;
}

export default function BacklogMapPage() {
  const { dark } = useTheme();
  const [hovered, setHovered] = useState<typeof BACKLOG_COUNTRIES[0] | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="backlog-map" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="section-eyebrow">Page 9 — Global Backlog Distribution</div>
          <h2 className="section-title mb-4">
            7 Countries.<br />
            <span className="text-gradient-red">$411M in Committed Revenue.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            Redwire's $411.2M contracted{' '}
            <GlossaryTooltip
              term="Contracted Backlog"
              definition="Firm, binding purchase orders and contracts for which revenue has not yet been recognized. Unlike pipeline or bookings, backlog represents legally committed customer obligations — it becomes revenue as work is performed."
            >
              backlog
            </GlossaryTooltip>
            {' '}spans government and commercial customers across 7 countries. Circle size is weighted by backlog volume. The US DoD/NASA anchor (59.6%) provides structural predictability; international exposure (40.4%) diversifies geopolitical risk.
          </p>
        </div>

        {/* Map + legend layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Map — 2/3 width */}
          <div className="md:col-span-2">
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="section-eyebrow mb-2 text-[10px]">
                Backlog by Geography · Circle area ∝ $M committed · Hover for program detail
              </div>

              {/* Leaflet map */}
              <div ref={mapContainerRef} style={{ height: 380, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                <MapContainer
                  center={[30, 15]}
                  zoom={2}
                  minZoom={2}
                  maxZoom={5}
                  scrollWheelZoom={false}
                  zoomControl={true}
                  style={{ height: '100%', width: '100%', background: dark ? '#0d1b2a' : '#dce8f5' }}
                  worldCopyJump={false}
                  maxBounds={[[-85, -180], [85, 180]]}
                  maxBoundsViscosity={1.0}
                  attributionControl={false}
                >
                  <ThemeAwareTile dark={dark} />
                  <MouseTracker onMove={(pos) => { if (!pos) setMousePos(null); else setMousePos(pos); }} />

                  {BACKLOG_COUNTRIES.map((c) => (
                    <CircleMarker
                      key={c.id}
                      center={[c.lat, c.lon]}
                      radius={rScale(c.value)}
                      pathOptions={{
                        color: c.color,
                        fillColor: c.color,
                        fillOpacity: hovered && hovered.id !== c.id ? 0.18 : 0.55,
                        weight: hovered?.id === c.id ? 2.5 : 1.8,
                        opacity: hovered && hovered.id !== c.id ? 0.35 : 0.95,
                      }}
                      eventHandlers={{
                        mouseover: (e) => {
                          setHovered(c);
                          const rect = (e.target as any)._map.getContainer().getBoundingClientRect();
                          setMousePos({ x: e.originalEvent.clientX - rect.left, y: e.originalEvent.clientY - rect.top });
                        },
                        mousemove: (e) => {
                          const rect = (e.target as any)._map.getContainer().getBoundingClientRect();
                          setMousePos({ x: e.originalEvent.clientX - rect.left, y: e.originalEvent.clientY - rect.top });
                        },
                        mouseout: () => { setHovered(null); setMousePos(null); },
                      }}
                    >
                      {/* Permanent ID label inside bubble */}
                      <Tooltip
                        permanent
                        interactive={false}
                        direction="center"
                        className="leaflet-bubble-label"
                        offset={[0, 0]}
                      >
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: 700,
                            fontSize: c.value >= 100 ? '11px' : '9px',
                            color: 'white',
                            textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                            pointerEvents: 'none',
                          }}
                        >
                          {c.id}
                        </span>
                      </Tooltip>
                    </CircleMarker>
                  ))}
                </MapContainer>

                {/* DOM tooltip — rendered outside Leaflet, positioned by mouse coords */}
                {hovered && mousePos && (() => {
                  const containerW = mapContainerRef.current?.clientWidth ?? 600;
                  const containerH = mapContainerRef.current?.clientHeight ?? 380;
                  const ttW = 230;
                  const ttH = 120;
                  const gap = 14;
                  let left = mousePos.x + gap;
                  let top = mousePos.y - ttH - gap;
                  if (left + ttW > containerW - 4) left = mousePos.x - ttW - gap;
                  if (top < 4) top = mousePos.y + gap;
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        left,
                        top,
                        zIndex: 1000,
                        width: ttW,
                        background: dark ? 'rgba(13,27,42,0.97)' : 'rgba(255,255,255,0.97)',
                        border: `1.5px solid ${hovered.color}`,
                        borderRadius: 8,
                        padding: '10px 14px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
                        pointerEvents: 'none',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div style={{ color: hovered.color, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                        {hovered.name}
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 600, fontSize: 11, marginBottom: 6, color: dark ? '#e2e8f0' : '#1a202c' }}>
                        ${hovered.value}M · {hovered.pct}% of backlog
                      </div>
                      {hovered.programs.map((p, i) => (
                        <div key={i} style={{ fontSize: 10, opacity: 0.7, lineHeight: 1.45, color: dark ? '#94a3b8' : '#4a5568' }}>
                          · {p}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Attribution */}
              <div style={{ fontSize: 9, opacity: 0.35, marginTop: 4, textAlign: 'right' }}>
                © OpenStreetMap · © CARTO
              </div>
            </div>
          </div>

          {/* Legend — 1/3 width */}
          <div className="space-y-2">
            <div className="section-eyebrow mb-3">Backlog by Region</div>
            {[...BACKLOG_COUNTRIES].sort((a, b) => b.value - a.value).map((c) => (
              <div
                key={c.id}
                className="glass-card p-3 cursor-pointer transition-opacity duration-200"
                style={{
                  borderLeft: `3px solid ${c.color}`,
                  opacity: hovered && hovered.id !== c.id ? 0.45 : 1,
                }}
                onMouseEnter={() => setHovered(c)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {c.name}
                  </span>
                  <span className="text-[13px] font-bold font-mono" style={{ color: c.color }}>
                    ${c.value}M
                  </span>
                </div>
                <div className="h-1.5 rounded-full mb-1" style={{ background: 'var(--card-border)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${c.pct}%`, background: c.color, opacity: 0.8 }}
                  />
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {c.pct}% · {c.programs[0].split('(')[0].trim()}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="glass-card p-3 mt-1" style={{ border: '1px solid var(--rdw-red-border)' }}>
              <div className="flex justify-between items-center">
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Total Backlog</span>
                <span className="text-[15px] font-black font-mono" style={{ color: 'var(--rdw-red)' }}>$411.2M</span>
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                +38.6% YoY · Book-to-Bill 1.32x FY2025
              </div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: 'US Government Anchor',
              value: '59.6%',
              sub: '$245M — NASA & DoD multi-year, non-discretionary contracts',
              color: '#C8102E',
            },
            {
              label: 'International Exposure',
              value: '40.4%',
              sub: 'EU (EuroQCI/MATTEO), UK (QKDSat), Ukraine (Stalker), Gulf, APAC',
              color: '#8B5CF6',
            },
            {
              label: 'Q4 2025 B/B',
              value: '1.52x',
              sub: 'Backlog growing ~52% faster than revenue — leading growth indicator',
              color: '#D4A017',
            },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-5">
              <div className="text-[11px] font-mono tracking-widest uppercase mb-2" style={{ color: kpi.color }}>
                {kpi.label}
              </div>
              <div className="text-[32px] font-black font-mono mb-1" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
