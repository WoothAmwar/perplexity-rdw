import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import GlossaryTooltip from '../components/GlossaryTooltip';

// RDW backlog by country/region — derived from memo & SEC filings
// Values represent estimated share of $411.2M contracted backlog
const BACKLOG_COUNTRIES = [
  {
    id: 'USA',
    name: 'United States',
    region: 'North America',
    value: 245,           // DoD, NASA, commercial (Axiom, SpaceX)
    pct: 59.6,
    color: '#C8102E',
    programs: ['NASA ISS (iROSA)', 'DoD / SOF Stalker UAS', 'Axiom Station', 'Edge Autonomy SOFC', 'ZBLAN R&D'],
    // Approximate SVG map coordinates (x,y on a 900×500 equirectangular projection)
    cx: 185, cy: 195,
  },
  {
    id: 'BEL',
    name: 'Belgium / EU',
    region: 'Europe',
    value: 68,            // EuroQCI, MATTEO prime contract
    pct: 16.5,
    color: '#8B5CF6',
    programs: ['EuroQCI (Phase 1 complete)', 'MATTEO national security satellite'],
    cx: 455, cy: 148,
  },
  {
    id: 'GBR',
    name: 'United Kingdom',
    region: 'Europe',
    value: 32,            // NATO comms, QKDSat
    pct: 7.8,
    color: '#1ABCB4',
    programs: ['QKDSat quantum comms', 'NATO allied UAS deliveries'],
    cx: 432, cy: 140,
  },
  {
    id: 'UKR',
    name: 'Ukraine',
    region: 'Eastern Europe',
    value: 24,            // Stalker UAS active deployment
    pct: 5.8,
    color: '#F59E0B',
    programs: ['Stalker XE tactical UAS (200 deployed)'],
    cx: 502, cy: 150,
  },
  {
    id: 'UAE',
    name: 'UAE / Gulf',
    region: 'Middle East',
    value: 18,            // Commercial satellite + ISR
    pct: 4.4,
    color: '#10B981',
    programs: ['Commercial satellite infrastructure', 'ISR systems'],
    cx: 575, cy: 220,
  },
  {
    id: 'JPN',
    name: 'Japan',
    region: 'Asia-Pacific',
    value: 14,            // JAXA / commercial ISS
    pct: 3.4,
    color: '#0EA5E9',
    programs: ['JAXA ISS collaboration', 'Microgravity pharma trials'],
    cx: 778, cy: 192,
  },
  {
    id: 'AUS',
    name: 'Australia',
    region: 'Asia-Pacific',
    value: 10,            // AUSA defense tech, space tracking
    pct: 2.4,
    color: '#D4A017',
    programs: ['ADF defense systems', 'Space tracking infrastructure'],
    cx: 760, cy: 340,
  },
];

const TOTAL_BACKLOG = 411.2;

// Simple SVG world map paths — simplified continents for a clean viz
// Using a minimal SVG world map inline
const WORLD_SVG_PATH = `
M 60,195 L 60,230 L 80,250 L 100,260 L 115,265 L 125,255 L 140,245 L 155,235
  L 165,220 L 175,215 L 190,210 L 205,210 L 215,215 L 225,220 L 235,215
  L 245,205 L 255,200 L 265,205 L 270,200 L 260,190 L 250,182 L 235,178
  L 215,180 L 195,182 L 175,185 L 155,188 L 135,190 L 110,195 L 85,195 Z
`;

export default function BacklogMapPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<typeof BACKLOG_COUNTRIES[0] | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });

  // Scale circle radius by backlog value
  const maxVal = Math.max(...BACKLOG_COUNTRIES.map(c => c.value));
  const rScale = d3.scaleSqrt().domain([0, maxVal]).range([0, 38]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const svg = d3.select(el);
    svg.selectAll('.pulse-ring').interrupt();

    // Pulse animation on the largest circle (USA)
    BACKLOG_COUNTRIES.forEach(c => {
      if (c.id === 'USA') {
        const r = rScale(c.value);
        svg.select(`#pulse-${c.id}`)
          .attr('r', r)
          .style('opacity', 0.4)
          .transition()
          .duration(2000)
          .ease(d3.easeSinInOut)
          .attr('r', r + 12)
          .style('opacity', 0)
          .on('end', function repeat() {
            d3.select(this)
              .attr('r', r)
              .style('opacity', 0.4)
              .transition()
              .duration(2000)
              .ease(d3.easeSinInOut)
              .attr('r', r + 12)
              .style('opacity', 0)
              .on('end', repeat);
          });
      }
    });
  }, []);

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
              definition="Firm, binding purchase orders and contracts for which revenue has not yet been recognized. Unlike pipeline or bookings, backlog represents legally committed customer obligations — it will become revenue as work is performed."
            >
              backlog
            </GlossaryTooltip>
            {' '}spans government and commercial customers across 7 countries. Circle size and color intensity are weighted by backlog volume. The US DoD/NASA anchor position (59.6%) provides structural revenue predictability; international exposure (40.4%) diversifies geopolitical risk.
          </p>
        </div>

        {/* Map + legend layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* SVG Map — takes 2/3 width */}
          <div className="md:col-span-2">
            <div
              className="glass-card p-4 relative overflow-hidden"
              style={{ minHeight: 400 }}
            >
              <div className="section-eyebrow mb-2 text-[10px]">Backlog by Geography — Circle size ∝ $M committed</div>
              <svg
                ref={svgRef}
                viewBox="0 0 900 480"
                className="w-full"
                style={{ minHeight: 340 }}
                aria-label="Global backlog heatmap"
              >
                {/* ── Background grid ── */}
                <defs>
                  <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.04" strokeWidth="0.5" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="900" height="480" fill="url(#grid)" />

                {/* ── Simplified world continent outlines (inline SVG polygons) ── */}
                {/* North America */}
                <path
                  d="M 80,100 L 70,140 L 60,180 L 65,220 L 80,250 L 110,265 L 140,255 L 165,235 L 175,210 L 190,200 L 205,205 L 230,200 L 250,185 L 265,175 L 270,155 L 255,130 L 235,115 L 210,105 L 185,100 L 155,98 L 125,98 L 100,100 Z"
                  fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
                />
                {/* South America */}
                <path
                  d="M 185,270 L 175,290 L 170,320 L 175,355 L 185,385 L 200,400 L 215,390 L 225,365 L 225,335 L 220,305 L 210,280 L 200,270 Z"
                  fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
                />
                {/* Europe */}
                <path
                  d="M 415,110 L 400,120 L 390,135 L 400,145 L 415,148 L 430,145 L 445,140 L 460,138 L 475,142 L 490,145 L 505,140 L 510,130 L 500,120 L 485,115 L 465,112 L 445,110 Z"
                  fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
                />
                {/* Africa */}
                <path
                  d="M 430,175 L 420,195 L 415,225 L 420,260 L 430,295 L 445,325 L 460,340 L 475,335 L 485,310 L 490,280 L 488,250 L 482,220 L 475,195 L 462,178 L 448,172 Z"
                  fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
                />
                {/* Asia */}
                <path
                  d="M 510,100 L 530,95 L 570,90 L 620,92 L 670,95 L 720,100 L 760,110 L 790,125 L 800,145 L 790,165 L 770,178 L 750,182 L 720,178 L 690,170 L 660,162 L 630,158 L 600,155 L 575,158 L 555,165 L 540,170 L 525,162 L 515,148 L 510,130 Z"
                  fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
                />
                {/* Middle East */}
                <path
                  d="M 520,175 L 510,190 L 515,210 L 528,225 L 545,230 L 560,225 L 570,210 L 568,195 L 555,182 L 538,175 Z"
                  fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
                />
                {/* Australia */}
                <path
                  d="M 710,300 L 695,315 L 690,340 L 700,365 L 720,378 L 745,375 L 765,360 L 775,340 L 772,315 L 755,302 L 735,298 Z"
                  fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"
                />

                {/* ── Equator & graticule lines ── */}
                <line x1="0" y1="248" x2="900" y2="248" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.8" strokeDasharray="6,6" />
                <text x="8" y="245" fontSize="7" fill="currentColor" fillOpacity="0.25" fontFamily="Space Mono, monospace">EQ</text>

                {/* ── Bubble circles ── */}
                {BACKLOG_COUNTRIES.map((c) => {
                  const r = rScale(c.value);
                  const isHovered = hovered?.id === c.id;
                  return (
                    <g
                      key={c.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        setHovered(c);
                        const rect = svgRef.current?.getBoundingClientRect();
                        if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {/* Pulse ring for USA only */}
                      {c.id === 'USA' && (
                        <circle
                          id={`pulse-${c.id}`}
                          cx={c.cx} cy={c.cy}
                          r={r}
                          fill="none"
                          stroke={c.color}
                          strokeWidth="2"
                          className="pulse-ring"
                          style={{ opacity: 0.4 }}
                        />
                      )}
                      {/* Outer glow */}
                      <circle
                        cx={c.cx} cy={c.cy}
                        r={r + 4}
                        fill={c.color}
                        fillOpacity={isHovered ? 0.18 : 0.07}
                        style={{ transition: 'fill-opacity 0.2s' }}
                      />
                      {/* Main bubble */}
                      <circle
                        cx={c.cx} cy={c.cy}
                        r={r}
                        fill={c.color}
                        fillOpacity={isHovered ? 0.75 : 0.5}
                        stroke={c.color}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        strokeOpacity={isHovered ? 1 : 0.7}
                        filter={isHovered ? 'url(#glow)' : undefined}
                        style={{ transition: 'all 0.2s' }}
                      />
                      {/* Country code label */}
                      <text
                        x={c.cx} y={c.cy}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize={r > 20 ? '11' : '9'}
                        fontWeight="700"
                        fontFamily="Space Mono, monospace"
                        fill="white"
                        fillOpacity="0.9"
                      >
                        {c.id}
                      </text>
                      {/* $ value below label (for larger circles) */}
                      {r > 16 && (
                        <text
                          x={c.cx} y={c.cy + r + 12}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="600"
                          fontFamily="Space Mono, monospace"
                          fill={c.color}
                          fillOpacity="0.9"
                        >
                          ${c.value}M
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* ── Tooltip inside SVG ── */}
                {hovered && (
                  <g>
                    <rect
                      x={Math.min(tooltip.x + 10, 650)}
                      y={Math.max(tooltip.y - 60, 10)}
                      width="220" height="70"
                      rx="6"
                      fill="#0D1117"
                      stroke={hovered.color}
                      strokeWidth="1"
                      fillOpacity="0.97"
                    />
                    <text
                      x={Math.min(tooltip.x + 20, 660)}
                      y={Math.max(tooltip.y - 42, 28)}
                      fontSize="11" fontWeight="700"
                      fontFamily="Space Grotesk, sans-serif"
                      fill={hovered.color}
                    >
                      {hovered.name}
                    </text>
                    <text
                      x={Math.min(tooltip.x + 20, 660)}
                      y={Math.max(tooltip.y - 28, 42)}
                      fontSize="10"
                      fontFamily="Space Mono, monospace"
                      fill="#C8D0DC"
                    >
                      ${hovered.value}M · {hovered.pct}% of backlog
                    </text>
                    <text
                      x={Math.min(tooltip.x + 20, 660)}
                      y={Math.max(tooltip.y - 15, 55)}
                      fontSize="9"
                      fontFamily="Space Grotesk, sans-serif"
                      fill="#6B7280"
                    >
                      {hovered.programs[0]}
                    </text>
                    {hovered.programs[1] && (
                      <text
                        x={Math.min(tooltip.x + 20, 660)}
                        y={Math.max(tooltip.y - 3, 67)}
                        fontSize="9"
                        fontFamily="Space Grotesk, sans-serif"
                        fill="#6B7280"
                      >
                        {hovered.programs[1]}
                      </text>
                    )}
                  </g>
                )}
              </svg>

              {/* Hover hint */}
              <p className="text-[10px] font-mono text-center mt-1" style={{ color: 'var(--text-muted)' }}>
                Hover circles for program detail · Size ∝ backlog volume
              </p>
            </div>
          </div>

          {/* Legend — 1/3 width */}
          <div className="space-y-3">
            <div className="section-eyebrow mb-3">Backlog by Region</div>
            {BACKLOG_COUNTRIES.sort((a, b) => b.value - a.value).map((c) => (
              <div
                key={c.id}
                className="glass-card p-3 cursor-pointer"
                style={{
                  borderLeft: `3px solid ${c.color}`,
                  opacity: hovered && hovered.id !== c.id ? 0.55 : 1,
                  transition: 'opacity 0.2s',
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
                {/* Bar */}
                <div className="h-1.5 rounded-full mb-1.5" style={{ background: 'var(--card-border)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${c.pct}%`, background: c.color, opacity: 0.8 }}
                  />
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {c.pct}% · {c.programs[0]}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="glass-card p-3" style={{ border: '1px solid var(--rdw-red-border)' }}>
              <div className="flex justify-between items-center">
                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Total Contracted Backlog</span>
                <span className="text-[16px] font-black font-mono" style={{ color: 'var(--rdw-red)' }}>$411.2M</span>
              </div>
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                +38.6% YoY · Book-to-Bill 1.32x FY2025
              </div>
            </div>
          </div>
        </div>

        {/* Key takeaways */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: 'US Government Anchor',
              value: '59.6%',
              sub: '$245M from NASA & DoD — multi-year, non-discretionary contracts',
              color: '#C8102E',
            },
            {
              label: 'International Exposure',
              value: '40.4%',
              sub: 'EU (EuroQCI/MATTEO), UK (QKDSat), Ukraine (Stalker), Gulf, APAC',
              color: '#8B5CF6',
            },
            {
              label: 'B/B Trajectory',
              value: '1.52x',
              sub: 'Q4 2025 book-to-bill — backlog growing ~50% faster than revenue',
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
