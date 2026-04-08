import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../App';
import * as d3 from 'd3';

interface Node {
  id: string;
  label: string;
  stage: 'heritage' | 'active' | 'frontier';
  backlogWeight: number;
  description: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

const NODES: Node[] = [
  { id: 'irosa', label: 'iROSA', stage: 'active', backlogWeight: 9, description: 'ISS Roll-Out Solar Array — 8 wings delivered, 6 deployed. 100% mission success. 20–30kW per wing.' },
  { id: 'rosa', label: 'ROSA Heritage', stage: 'heritage', backlogWeight: 4, description: 'Roll-Out Solar Array technology originated at NASA, commercialized by Redwire. Powered DART asteroid mission.' },
  { id: 'pilbox', label: 'PIL-BOX', stage: 'active', backlogWeight: 7, description: 'Pharmaceutical In-orbit Laboratory. Microgravity crystallization system. 43 active trials with major pharma partners.' },
  { id: 'hammerhead', label: 'Hammerhead', stage: 'active', backlogWeight: 8, description: 'Quantum-secure satellite platform. Uses Quantum Key Distribution (QKD) to make communications physically unhackable.' },
  { id: 'stalker', label: 'Stalker XE', stage: 'active', backlogWeight: 8, description: 'Long-endurance UAS (Unmanned Aerial System). Runs on Redwire\'s own SOFC — lasts 8–10 hours vs 2–3 for battery competitors.' },
  { id: 'sofc', label: 'SOFC Stack', stage: 'active', backlogWeight: 7, description: 'Solid Oxide Fuel Cell power stack. Converts hydrogen/JP8 fuel to electricity with 60% efficiency. Built in-house — not outsourced.' },
  { id: 'eurqci', label: 'EuroQCI', stage: 'frontier', backlogWeight: 6, description: 'European Quantum Communication Infrastructure. Redwire is building the physical satellite backbone for EU quantum internet.' },
  { id: 'deploy', label: 'Deployable Structures', stage: 'heritage', backlogWeight: 5, description: 'Boom/mast systems, reflectors, antennas. Heritage technology from NASA missions now on commercial satellites.' },
  { id: 'rf', label: 'RF Antennas', stage: 'heritage', backlogWeight: 4, description: 'Precision RF (radio frequency) antennas for satellite communications. Serves both civil and defense customers.' },
  { id: 'cis', label: 'Commercial Space Station', stage: 'frontier', backlogWeight: 9, description: 'Next-gen commercial LEO stations. RDW building solar, structures, and in-space manufacturing for Axiom, Vast, and others.' },
  { id: 'lunarpwr', label: 'Lunar Power', stage: 'frontier', backlogWeight: 8, description: 'ROSA-derived solar arrays for NASA Artemis and commercial lunar surface operations. Gateway program opportunity.' },
  { id: 'ism', label: 'In-Space Manufacturing', stage: 'frontier', backlogWeight: 7, description: 'ZBLAN fiber optics, bioprinting, and metal parts produced in microgravity. Products physically impossible to make on Earth.' },
];

const LINKS = [
  { source: 'rosa', target: 'irosa' },
  { source: 'irosa', target: 'cis' },
  { source: 'irosa', target: 'lunarpwr' },
  { source: 'deploy', target: 'irosa' },
  { source: 'deploy', target: 'rf' },
  { source: 'pilbox', target: 'ism' },
  { source: 'sofc', target: 'stalker' },
  { source: 'stalker', target: 'hammerhead' },
  { source: 'hammerhead', target: 'eurqci' },
  { source: 'pilbox', target: 'cis' },
  { source: 'rf', target: 'hammerhead' },
];

const STAGE_COLORS = {
  heritage: '#8892A4',
  active: '#D4A017',
  frontier: '#C0392B',
};

const STAGE_LABELS = {
  heritage: 'Pre-2026 Heritage',
  active: 'Active Production',
  frontier: 'Growth Frontier',
};

// Revenue mix data: reconstructed from public earnings disclosures, program delivery cadence,
// and CFO commentary on development-vs-production program transitions (SEC filings 2021–2025).
// "Development" = programs in design/test/EAC-at-risk phase.
// "Production" = programs in volume/repeat-delivery phase (iROSA, PIL-BOX, SDA, UAS).
// "Frontier" = early-stage contracted but pre-revenue programs (EuroQCI, Lunar Power, commercial stations).
const REVENUE_MIX = [
  { year: '2021', total: 138, dev: 83, prod: 52, frontier: 3 },
  { year: '2022', total: 161, dev: 90, prod: 65, frontier: 6 },
  { year: '2023', total: 244, dev: 115, prod: 120, frontier: 9 },
  { year: '2024', total: 304, dev: 104, prod: 185, frontier: 15 },
  { year: '2025', total: 335, dev: 90, prod: 225, frontier: 20 },
];

function RevenueMixChart() {
  const { dark } = useTheme();
  const [hovered, setHovered] = useState<{ year: string; type: string; value: number; pct: number; x: number; y: number } | null>(null);

  const BAR_W = 56;
  const GAP = 28;
  const CHART_H = 220;
  const PAD_L = 52;
  const PAD_R = 24;
  const PAD_T = 32;
  const PAD_B = 36;
  const N = REVENUE_MIX.length;
  const TOTAL_W = PAD_L + N * BAR_W + (N - 1) * GAP + PAD_R;

  const maxTotal = Math.max(...REVENUE_MIX.map((d) => d.total));
  const yScale = (v: number) => CHART_H * (1 - v / (maxTotal * 1.1));
  const barHeight = (v: number) => CHART_H * (v / (maxTotal * 1.1));

  const DEV_COLOR = '#8892A4';
  const PROD_COLOR = '#D4A017';
  const FRONTIER_COLOR = '#C8102E';

  // Crossover: 2022→2023 is where prod overtakes dev
  const CROSSOVER_X = PAD_L + 1 * (BAR_W + GAP) + BAR_W / 2 + (PAD_L + 2 * (BAR_W + GAP) + BAR_W / 2 - PAD_L - 1 * (BAR_W + GAP) - BAR_W / 2) / 2;

  const gridLines = [0, 100, 200, 300];

  const textPrimary = dark ? '#F0F2F5' : '#0D1117';
  const textMuted = dark ? '#6B7280' : '#8892A4';
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const cardBg = dark ? '#111827' : '#FFFFFF';

  return (
    <div className="mt-10">
      <div className="mb-5">
        <div className="text-[10px] font-mono tracking-[3px] uppercase mb-1" style={{ color: 'var(--rdw-red)' }}>
          Revenue Composition
        </div>
        <h3 className="text-lg font-bold" style={{ color: textPrimary, fontFamily: "'Space Grotesk', sans-serif" }}>
          From Researcher to Producer
        </h3>
        <p className="text-[13px] mt-1 max-w-2xl" style={{ color: textMuted }}>
          Revenue mix shift by program maturity stage, 2021–2025. Production-stage programs
          (repeat deliveries, volume contracts) crossed above development-stage (design, test,
          EAC-at-risk) in 2023 — the inflection Redwire’s CFO flagged as the path to margin recovery.
        </p>
      </div>

      <div className="glass-card p-6 relative overflow-visible">
        {/* Legend */}
        <div className="flex flex-wrap gap-5 mb-5">
          {[
            { label: 'Development', color: DEV_COLOR },
            { label: 'Production', color: PROD_COLOR },
            { label: 'Frontier', color: FRONTIER_COLOR },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
              <span className="text-[11px] font-mono" style={{ color: textMuted }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${TOTAL_W} ${CHART_H + PAD_T + PAD_B}`}
            style={{ width: '100%', maxWidth: TOTAL_W, display: 'block', margin: '0 auto' }}
          >
            {/* Y-axis grid lines */}
            {gridLines.map((v) => (
              <g key={v}>
                <line
                  x1={PAD_L} y1={PAD_T + yScale(v)}
                  x2={TOTAL_W - PAD_R} y2={PAD_T + yScale(v)}
                  stroke={gridColor} strokeWidth={1}
                />
                <text
                  x={PAD_L - 6} y={PAD_T + yScale(v) + 4}
                  textAnchor="end" fontSize={9}
                  fontFamily="'Space Mono', monospace"
                  fill={textMuted}
                >
                  ${v}M
                </text>
              </g>
            ))}

            {/* Crossover annotation */}
            <g>
              <line
                x1={CROSSOVER_X} y1={PAD_T - 8}
                x2={CROSSOVER_X} y2={PAD_T + CHART_H + 4}
                stroke="#C8102E" strokeWidth={1} strokeDasharray="4 3" opacity={0.6}
              />
              <rect
                x={CROSSOVER_X - 54} y={PAD_T - 26}
                width={108} height={18} rx={3}
                fill="#C8102E" opacity={0.15}
              />
              <text
                x={CROSSOVER_X} y={PAD_T - 13}
                textAnchor="middle" fontSize={9}
                fontFamily="'Space Mono', monospace"
                fill="#C8102E" fontWeight={700}
              >
                PRODUCTION CROSSOVER
              </text>
            </g>

            {/* Bars */}
            {REVENUE_MIX.map((d, i) => {
              const x = PAD_L + i * (BAR_W + GAP);
              const devH = barHeight(d.dev);
              const prodH = barHeight(d.prod);
              const frontH = barHeight(d.frontier);
              const devY = PAD_T + yScale(d.dev + d.prod + d.frontier);
              const prodY = devY + devH;
              const frontY = prodY + prodH;

              const segments: { type: string; color: string; y: number; h: number; value: number }[] = [
                { type: 'Development', color: DEV_COLOR, y: devY, h: devH, value: d.dev },
                { type: 'Production', color: PROD_COLOR, y: prodY, h: prodH, value: d.prod },
                { type: 'Frontier', color: FRONTIER_COLOR, y: frontY, h: frontH, value: d.frontier },
              ];

              return (
                <g key={d.year}>
                  {segments.map((seg) => (
                    <rect
                      key={seg.type}
                      x={x} y={seg.y} width={BAR_W} height={Math.max(seg.h, 0)}
                      fill={seg.color}
                      opacity={hovered && hovered.year === d.year && hovered.type === seg.type ? 1 : 0.82}
                      rx={seg.type === 'Development' ? 3 : 0}
                      style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                      onMouseEnter={(e) => {
                        const pct = Math.round((seg.value / d.total) * 100);
                        setHovered({ year: d.year, type: seg.type, value: seg.value, pct, x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        if (hovered) setHovered((h) => h ? { ...h, x: e.clientX, y: e.clientY } : h);
                      }}
                      onMouseLeave={() => setHovered(null)}
                    />
                  ))}
                  {/* Total label above bar */}
                  <text
                    x={x + BAR_W / 2}
                    y={devY - 5}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="'Space Mono', monospace"
                    fill={textMuted}
                  >
                    ${d.total}M
                  </text>
                  {/* Year label */}
                  <text
                    x={x + BAR_W / 2}
                    y={PAD_T + CHART_H + 18}
                    textAnchor="middle"
                    fontSize={11}
                    fontFamily="'Space Grotesk', sans-serif"
                    fontWeight={600}
                    fill={textPrimary}
                  >
                    {d.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Source note */}
        <p className="text-[10px] font-mono mt-3" style={{ color: textMuted }}>
          Sources: Redwire 10-K / 8-K filings 2021–2025 (SEC EDGAR) · Mix estimated from earnings commentary,
          EAC disclosures, and program delivery cadence · Development = design/test/EAC-at-risk programs;
          Production = repeat-delivery / volume contracts; Frontier = early-stage contracted programs
        </p>
      </div>

      {/* Hover tooltip */}
      {hovered && (
        <div
          style={{
            position: 'fixed',
            left: hovered.x + 14,
            top: hovered.y - 10,
            zIndex: 9999,
            background: cardBg,
            border: `1px solid ${hovered.type === 'Production' ? PROD_COLOR : hovered.type === 'Frontier' ? FRONTIER_COLOR : DEV_COLOR}`,
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 12,
            color: textPrimary,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            pointerEvents: 'none',
            minWidth: 160,
          }}
        >
          <div className="font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {hovered.year} · {hovered.type}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace" }}>
            ${hovered.value}M &nbsp;—&nbsp; <span style={{ color: textMuted }}>{hovered.pct}% of total</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PipelinePage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scaleByBacklog, setScaleByBacklog] = useState(true);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; visible: boolean }>({
    text: '', x: 0, y: 0, visible: false,
  });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = svgRef.current?.clientWidth || 800;
    const H = 500;

    const nodes = NODES.map((n) => ({ ...n }));
    const links = LINKS.map((l) => ({ ...l }));

    const sim = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(90).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-280))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius((d: any) => (scaleByBacklog ? d.backlogWeight * 5 + 14 : 28)));

    const g = svg.attr('width', W).attr('height', H).append('g');

    // Links
    const link = g.selectAll('.link')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#1E2A3A')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // Nodes
    const node = g.selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, any>()
          .on('start', (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null; d.fy = null;
          }) as any
      );

    node.append('circle')
      .attr('r', (d: any) => scaleByBacklog ? d.backlogWeight * 4 + 10 : 22)
      .attr('fill', (d: any) => STAGE_COLORS[d.stage as keyof typeof STAGE_COLORS] + '22')
      .attr('stroke', (d: any) => STAGE_COLORS[d.stage as keyof typeof STAGE_COLORS])
      .attr('stroke-width', (d: any) => d.stage === 'active' ? 2 : 1)
      .attr('opacity', (d: any) => d.stage === 'heritage' ? 0.5 : 1);

    // Pulse ring for active nodes
    node.filter((d: any) => d.stage === 'active')
      .append('circle')
      .attr('r', (d: any) => scaleByBacklog ? d.backlogWeight * 4 + 18 : 30)
      .attr('fill', 'none')
      .attr('stroke', '#D4A017')
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .each(function () {
        const self = d3.select(this);
        const pulse = () => {
          self.attr('opacity', 0.5).attr('r', scaleByBacklog ? 30 : 30)
            .transition().duration(1500).attr('opacity', 0).attr('r', 45)
            .on('end', pulse);
        };
        pulse();
      });

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => (scaleByBacklog ? d.backlogWeight * 4 + 22 : 36))
      .attr('font-size', '10px')
      .attr('fill', (d: any) => STAGE_COLORS[d.stage as keyof typeof STAGE_COLORS])
      .attr('font-family', "'Space Mono', monospace")
      .attr('opacity', (d: any) => d.stage === 'heritage' ? 0.5 : 1)
      .text((d: any) => d.label);

    node.on('mouseover', (event: MouseEvent, d: any) => {
      setTooltip({ text: `${d.label}: ${d.description}`, x: event.clientX, y: event.clientY, visible: true });
    }).on('mousemove', (event: MouseEvent) => {
      setTooltip((t) => ({ ...t, x: event.clientX, y: event.clientY }));
    }).on('mouseout', () => {
      setTooltip((t) => ({ ...t, visible: false }));
    });

    sim.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { sim.stop(); };
  }, [scaleByBacklog]);

  return (
    <section id="pipeline" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="section-eyebrow">Page 3.5 — Capability Stream</div>
            <h2 className="section-title mb-2">
              The Maturity Pipeline
            </h2>
            <p className="section-subtitle max-w-2xl">
              Every node is a product line or platform. Drag to explore relationships.
              Icons for pre-2026 heritage products appear faded to indicate visual maturity — not that Redwire’s institutional knowledge or engineering depth has faded.
              Active programs pulse gold. Growth-stage frontier burns red.
            </p>
          </div>
          <button
            onClick={() => setScaleByBacklog((b) => !b)}
            data-testid="toggle-backlog-weight"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all border"
            style={{
              background: scaleByBacklog ? '#D4A01720' : 'transparent',
              borderColor: scaleByBacklog ? '#D4A017' : '#1E2A3A',
              color: scaleByBacklog ? '#D4A017' : '#5C6880',
            }}
          >
            {scaleByBacklog ? '● Scale by Backlog Weight' : '○ Scale by Backlog Weight'}
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          {(Object.entries(STAGE_LABELS) as [keyof typeof STAGE_COLORS, string][]).map(([stage, label]) => (
            <div key={stage} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: STAGE_COLORS[stage], opacity: stage === 'heritage' ? 0.5 : 1 }}
              />
              <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 relative overflow-hidden">
          <svg ref={svgRef} className="w-full" style={{ height: 500 }} />
        </div>

        <p className="text-[11px] mt-3 text-center font-mono" style={{ color: "var(--text-muted)" }}>
          Drag nodes freely · Hover for descriptions · Toggle backlog weight scale
        </p>

        {/* Revenue Mix Chart */}
        <RevenueMixChart />
      </div>

      {/* D3 tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y - 8,
            zIndex: 9999,
            background: 'var(--card-bg)',
            border: '1px solid #D4A017',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            maxWidth: 260,
            color: 'var(--text-primary)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
}
