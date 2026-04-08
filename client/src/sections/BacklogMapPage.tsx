import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import GlossaryTooltip from '../components/GlossaryTooltip';
import { useTheme } from '../App';

// RDW backlog by country/region — inferred from memo & SEC filings
// Total contracted backlog: $411.2M
const BACKLOG_COUNTRIES = [
  {
    id: 'USA',
    name: 'United States',
    lng: -100, lat: 38,
    value: 245,
    pct: 59.6,
    color: '#C8102E',
    programs: ['NASA ISS (iROSA/ELSA)', 'DoD / US SOF Stalker UAS', 'Axiom Station', 'Edge Autonomy SOFC production'],
  },
  {
    id: 'BEL',
    name: 'Belgium / EU',
    lng: 4.5, lat: 50.5,
    value: 68,
    pct: 16.5,
    color: '#8B5CF6',
    programs: ['EuroQCI Phase 1 complete', 'MATTEO — Belgium\'s first national security satellite (prime contractor)'],
  },
  {
    id: 'GBR',
    name: 'United Kingdom',
    lng: -1.5, lat: 53,
    value: 32,
    pct: 7.8,
    color: '#1ABCB4',
    programs: ['QKDSat quantum comms backbone', 'NATO allied UAS deliveries'],
  },
  {
    id: 'UKR',
    name: 'Ukraine',
    lng: 32, lat: 49,
    value: 24,
    pct: 5.8,
    color: '#F59E0B',
    programs: ['Stalker XE tactical UAS — 200+ deployed in active theater'],
  },
  {
    id: 'UAE',
    name: 'UAE / Gulf',
    lng: 54, lat: 24,
    value: 18,
    pct: 4.4,
    color: '#10B981',
    programs: ['Commercial satellite infrastructure', 'ISR systems integration'],
  },
  {
    id: 'JPN',
    name: 'Japan',
    lng: 138, lat: 36,
    value: 14,
    pct: 3.4,
    color: '#0EA5E9',
    programs: ['JAXA ISS collaboration', 'Microgravity pharma trials (PIL-BOX)'],
  },
  {
    id: 'AUS',
    name: 'Australia',
    lng: 134, lat: -25,
    value: 10,
    pct: 2.4,
    color: '#D4A017',
    programs: ['ADF defense tech systems', 'Space tracking & ground segment'],
  },
];

const rScale = d3.scaleSqrt().domain([0, 245]).range([6, 44]);

export default function BacklogMapPage() {
  const { dark } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<typeof BACKLOG_COUNTRIES[0] | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    fetch('/world-110m.json')
      .then(r => r.json())
      .then((world: any) => {
        const svg = d3.select(el);
        svg.selectAll('*').remove();

        const W = el.clientWidth || 800;
        const H = Math.round(W * 0.52);
        svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);

        // Natural Earth projection — well-suited for a world overview
        const projection = d3.geoNaturalEarth1()
          .scale(W / 6.4)
          .translate([W / 2, H / 2]);

        const path = d3.geoPath().projection(projection);

        // Country fills
        const countries = topojson.feature(world, world.objects.countries) as any;

        svg.append('g')
          .selectAll('path')
          .data(countries.features)
          .join('path')
          .attr('d', path as any)
          .attr('fill', dark ? '#1a2332' : '#e8edf4')
          .attr('stroke', dark ? '#2d3a4d' : '#c5cdd9')
          .attr('stroke-width', 0.4);

        // Country borders
        const borders = topojson.mesh(world, world.objects.countries, (a: any, b: any) => a !== b);
        svg.append('path')
          .datum(borders)
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', dark ? '#2d3a4d' : '#b8c2ce')
          .attr('stroke-width', 0.25);

        // Graticule (lat/lon grid lines)
        svg.append('path')
          .datum(d3.geoGraticule()())
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', dark ? '#1e2a3a' : '#dce3ea')
          .attr('stroke-width', 0.3)
          .attr('stroke-opacity', 0.7);

        // Sphere outline
        svg.append('path')
          .datum({ type: 'Sphere' } as any)
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', dark ? '#2d3a4d' : '#c0c9d4')
          .attr('stroke-width', 0.6);

        // Equator line
        svg.append('path')
          .datum(d3.geoGraticule().step([360, 0])() as any)
          .attr('d', path as any)
          .attr('fill', 'none')
          .attr('stroke', dark ? '#2d3a4d' : '#c5cdd9')
          .attr('stroke-width', 0.5)
          .attr('stroke-dasharray', '4,4')
          .attr('stroke-opacity', 0.5);

        // ── Bubble circles ──────────────────────────────────────────────────────
        const bubbleGroup = svg.append('g').attr('class', 'bubbles');

        BACKLOG_COUNTRIES.forEach((c) => {
          const coords = projection([c.lng, c.lat]);
          if (!coords) return;
          const [cx, cy] = coords;
          const r = rScale(c.value);

          const g = bubbleGroup.append('g')
            .style('cursor', 'pointer')
            .on('mouseenter', (event: MouseEvent) => {
              const rect = el.getBoundingClientRect();
              setHovered(c);
              setTooltipPos({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            })
            .on('mousemove', (event: MouseEvent) => {
              const rect = el.getBoundingClientRect();
              setTooltipPos({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            })
            .on('mouseleave', () => setHovered(null));

          // Outer glow ring
          g.append('circle')
            .attr('cx', cx).attr('cy', cy)
            .attr('r', r + 5)
            .attr('fill', c.color)
            .attr('fill-opacity', 0.08)
            .attr('stroke', 'none');

          // Main bubble
          g.append('circle')
            .attr('cx', cx).attr('cy', cy)
            .attr('r', r)
            .attr('fill', c.color)
            .attr('fill-opacity', 0.55)
            .attr('stroke', c.color)
            .attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.85)
            .attr('class', 'bubble-main')
            .style('transition', 'fill-opacity 0.2s, r 0.2s');

          // Country ID label (only for circles large enough)
          if (r >= 12) {
            g.append('text')
              .attr('x', cx).attr('y', cy)
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'middle')
              .attr('font-size', r >= 20 ? '11px' : '9px')
              .attr('font-weight', '700')
              .attr('font-family', "'Space Mono', monospace")
              .attr('fill', 'white')
              .attr('fill-opacity', 0.95)
              .attr('pointer-events', 'none')
              .text(c.id);
          }

          // $M value below
          if (r >= 10) {
            g.append('text')
              .attr('x', cx).attr('y', cy + r + 11)
              .attr('text-anchor', 'middle')
              .attr('font-size', '9px')
              .attr('font-weight', '600')
              .attr('font-family', "'Space Mono', monospace")
              .attr('fill', c.color)
              .attr('fill-opacity', 0.9)
              .attr('pointer-events', 'none')
              .text(`$${c.value}M`);
          }
        });

        // Pulse animation on USA (dominant position)
        const usaCoords = projection([-100, 38]);
        if (usaCoords) {
          const [ux, uy] = usaCoords;
          const ur = rScale(245);
          const pulseCircle = svg.append('circle')
            .attr('cx', ux).attr('cy', uy)
            .attr('r', ur)
            .attr('fill', 'none')
            .attr('stroke', '#C8102E')
            .attr('stroke-width', 1.5)
            .attr('pointer-events', 'none');

          const doPulse = () => {
            pulseCircle
              .attr('r', ur)
              .attr('opacity', 0.5)
              .transition()
              .duration(2200)
              .ease(d3.easeSinOut)
              .attr('r', ur + 14)
              .attr('opacity', 0)
              .on('end', doPulse);
          };
          doPulse();
        }
      });

    return () => {};
  }, [dark]);

  // Tooltip position: keep inside SVG bounds
  const tt = hovered;
  const svgW = svgRef.current?.clientWidth ?? 800;
  const svgH = svgRef.current?.clientHeight ?? 416;
  const ttW = 240, ttH = 88;
  const ttX = Math.min(Math.max(tooltipPos.x + 14, 4), svgW - ttW - 4);
  const ttY = tooltipPos.y > svgH * 0.65
    ? tooltipPos.y - ttH - 14
    : tooltipPos.y + 14;

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
              <div className="relative">
                <svg
                  ref={svgRef}
                  className="w-full rounded-lg"
                  style={{ minHeight: 260 }}
                  aria-label="Global backlog heatmap"
                />
                {/* DOM tooltip — theme-aware */}
                {tt && (
                  <div
                    style={{
                      position: 'absolute',
                      left: ttX,
                      top: ttY,
                      zIndex: 50,
                      background: 'var(--card-bg)',
                      border: `1px solid ${tt.color}`,
                      borderRadius: 8,
                      padding: '10px 14px',
                      maxWidth: ttW,
                      pointerEvents: 'none',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}
                  >
                    <div className="text-[12px] font-bold mb-0.5" style={{ color: tt.color }}>
                      {tt.name}
                    </div>
                    <div className="text-[11px] font-mono font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      ${tt.value}M · {tt.pct}% of backlog
                    </div>
                    {tt.programs.map((p, i) => (
                      <div key={i} className="text-[10px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                        · {p}
                      </div>
                    ))}
                  </div>
                )}
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
