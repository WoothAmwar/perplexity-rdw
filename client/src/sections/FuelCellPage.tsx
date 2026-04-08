import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import GlossaryTooltip from '../components/GlossaryTooltip';

interface FDNode {
  id: string;
  label: string;
  type: 'rdw' | 'capability' | 'competitor' | 'outcome';
  description: string;
  inhouse: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

const FD_NODES: FDNode[] = [
  { id: 'rdw', label: 'RDW', type: 'rdw', inhouse: true, description: 'Redwire / Edge Autonomy — vertically integrated defense & space.' },
  { id: 'sofc', label: 'SOFC Stack', type: 'capability', inhouse: true, description: 'Solid Oxide Fuel Cell power stack — built entirely in-house by Edge Autonomy. Converts hydrogen or JP-8 fuel to electricity at 60% efficiency. No battery pack. No dependency on external power suppliers.' },
  { id: 'stalker', label: 'Stalker XE', type: 'capability', inhouse: true, description: 'Long-endurance UAS. 8–10 hours flight time on SOFC vs 2–3 hours for battery-powered competitors. 300km+ range ISR platform. Used by US Army, Special Operations Forces.' },
  { id: 'ism_d', label: 'ISR Payload', type: 'capability', inhouse: true, description: 'Multi-domain Intelligence, Surveillance, Reconnaissance payloads. Thermal, EO/IR, SAR-capable. Integrates with DoD networks via Link 16.' },
  { id: 'irosa_d', label: 'Space Power', type: 'capability', inhouse: true, description: 'iROSA solar arrays power RDW\'s own satellites and structures. Eliminates dependence on third-party power suppliers for space platforms.' },
  { id: 'avav', label: 'AeroVironment', type: 'competitor', inhouse: false, description: 'AVAV\'s UAS (Puma, Raven, Switchblade) use third-party batteries from Ultralife/EaglePicher. No internal power stack. Dependent on supply chain for endurance improvements.' },
  { id: 'ktos', label: 'Kratos (KTOS)', type: 'competitor', inhouse: false, description: 'KTOS target drones and tactical UAS rely on external turbine/battery suppliers. Higher cost per sortie vs SOFC-powered platforms at similar range.' },
  { id: 'outcome1', label: '30% Cost Advantage', type: 'outcome', inhouse: true, description: 'Owning the SOFC stack eliminates a $120–180/hr cost that AVAV/KTOS pay third-party power providers. At 1,000 flight hours/yr per unit, that\'s $120–180K in margin per platform.' },
  { id: 'outcome2', label: 'Export Control', type: 'outcome', inhouse: true, description: 'In-house SOFC simplifies ITAR compliance. RDW controls all export-sensitive components — critical for allied nation sales (Australia, UK, NATO members).' },
];

const FD_LINKS = [
  { source: 'rdw', target: 'sofc', weight: 3 },
  { source: 'rdw', target: 'stalker', weight: 3 },
  { source: 'rdw', target: 'ism_d', weight: 2 },
  { source: 'rdw', target: 'irosa_d', weight: 2 },
  { source: 'sofc', target: 'stalker', weight: 4 },
  { source: 'sofc', target: 'outcome1', weight: 2 },
  { source: 'sofc', target: 'outcome2', weight: 2 },
  { source: 'stalker', target: 'ism_d', weight: 2 },
  { source: 'avav', target: 'outcome1', weight: 1, outsourced: true },
  { source: 'ktos', target: 'outcome1', weight: 1, outsourced: true },
];

const NODE_COLORS = {
  rdw: '#D4A017',
  capability: '#1ABCB4',
  competitor: '#C0392B',
  outcome: '#8B5CF6',
};

export default function FuelCellPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ node: FDNode | null; x: number; y: number; visible: boolean }>({
    node: null, x: 0, y: 0, visible: false,
  });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const el = svgRef.current;
    if (!el) return;
    const W = el.clientWidth || 700;
    const H = 460;
    svg.attr('width', W).attr('height', H);

    const nodes = FD_NODES.map((n) => ({ ...n }));
    const links = FD_LINKS.map((l) => ({ ...l }));

    // Custom distance — tightly bind SOFC ↔ Stalker (RDW moat), push competitors far
    const sim = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance((d: any) => d.outsourced ? 200 : d.weight * 22 + 40)
        .strength((d: any) => d.outsourced ? 0.1 : 0.7))
      .force('charge', d3.forceManyBody().strength(-320))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide().radius(40));

    const g = svg.append('g');

    // Arrow defs
    const defs = svg.append('defs');
    ['#1ABCB4', '#C0392B', '#1E2A3A'].forEach((color, i) => {
      defs.append('marker')
        .attr('id', `arrow-${i}`)
        .attr('markerWidth', 8).attr('markerHeight', 6)
        .attr('refX', 8).attr('refY', 3)
        .attr('orient', 'auto')
        .append('path').attr('d', 'M0,0 L0,6 L8,3 z')
        .attr('fill', color);
    });

    const link = g.selectAll('.fd-link')
      .data(links)
      .join('line')
      .attr('class', 'fd-link')
      .attr('stroke', (d: any) => d.outsourced ? '#C0392B' : '#1E2A3A')
      .attr('stroke-width', (d: any) => d.outsourced ? 1 : d.weight * 0.8 + 0.5)
      .attr('stroke-dasharray', (d: any) => d.outsourced ? '6,4' : null)
      .attr('stroke-opacity', (d: any) => d.outsourced ? 0.35 : 0.6);

    const node = g.selectAll('.fd-node')
      .data(nodes)
      .join('g')
      .attr('class', 'fd-node')
      .style('cursor', 'pointer')
      .call(
        d3.drag<SVGGElement, any>()
          .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }) as any
      );

    node.append('circle')
      .attr('r', (d: any) => d.type === 'rdw' ? 30 : d.type === 'competitor' ? 22 : 20)
      .attr('fill', (d: any) => NODE_COLORS[d.type as keyof typeof NODE_COLORS] + '22')
      .attr('stroke', (d: any) => NODE_COLORS[d.type as keyof typeof NODE_COLORS])
      .attr('stroke-width', (d: any) => d.type === 'rdw' ? 3 : d.type === 'competitor' ? 1 : 2);

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', (d: any) => d.type === 'rdw' ? '13px' : '10px')
      .attr('font-weight', (d: any) => d.type === 'rdw' ? '800' : '600')
      .attr('fill', (d: any) => NODE_COLORS[d.type as keyof typeof NODE_COLORS])
      .attr('font-family', "'Space Grotesk', sans-serif")
      .text((d: any) => d.label)
      .style('pointer-events', 'none');

    node
      .on('mouseover', (event: MouseEvent, d: any) => {
        setTooltip({ node: d as FDNode, x: event.clientX, y: event.clientY, visible: true });
      })
      .on('mousemove', (event: MouseEvent) => setTooltip((t) => ({ ...t, x: event.clientX, y: event.clientY })))
      .on('mouseout', () => setTooltip((t) => ({ ...t, visible: false })));

    sim.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { sim.stop(); };
  }, []);

  return (
    <section id="fuelcell" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <div className="section-eyebrow">Page 6 — Vertical Integration</div>
          <h2 className="section-title mb-4">
            The In-House Power Stack.<br />
            <span className="text-gradient-gold">Why AVAV & KTOS Can't Compete.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            <GlossaryTooltip term="SOFC (Solid Oxide Fuel Cell)" definition="An electrochemical device that converts the chemical energy of hydrogen or hydrocarbon fuels (like JP-8 jet fuel) directly into electricity with ~60% efficiency — roughly twice that of combustion engines. Produces no moving parts, zero sound signature, and heat as its only byproduct. Critical for long-endurance drones that must operate silently and for extended periods.">
              Redwire's SOFC power stack
            </GlossaryTooltip>{' '}
            is wholly owned via Edge Autonomy. Competitors outsource this component, creating supply chain dependency, lower margins, and inferior endurance specs. Node distance = synergy tightness. Dashed red lines = outsourced dependency.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'SOFC Efficiency', value: '60%', sub: 'vs 30–40% battery', color: '#D4A017' },
            { label: 'Stalker XE Endurance', value: '10hr', sub: 'vs 2–3hr competitors', color: '#1ABCB4' },
            { label: 'Estimated Cost Advantage', value: '~30%', sub: 'per flight hour vs AVAV/KTOS', color: '#D4A017' },
            { label: 'Supply Chain Dependencies', value: '0', sub: 'for power stack (in-house)', color: '#4CAF50' },
          ].map((s) => (
            <div key={s.label} className="metric-card text-center">
              <div className="metric-value" style={{ color: s.color }}>{s.value}</div>
              <div className="metric-label">{s.label}</div>
              <div className="text-[11px] text-[#3A4A5C] mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-3 text-[11px] font-mono">
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="text-[#5C6880] capitalize">{type === 'rdw' ? 'RDW Core' : type}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-8 border-t border-dashed border-[#C0392B]" />
            <span className="text-[#5C6880]">Outsourced dependency</span>
          </div>
        </div>

        <div className="glass-card p-4 relative">
          <svg ref={svgRef} className="w-full" style={{ height: 460 }} />
        </div>

        <p className="text-[11px] text-[#3A4A5C] mt-3 text-center font-mono">
          Drag nodes · Hover for detail · Tight = high synergy · Loose = low integration
        </p>

        {/* Comparison table */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-[#1E2A3A]">
          <table className="data-table w-full" data-testid="fuecell-comparison">
            <thead>
              <tr>
                <th className="text-left">Dimension</th>
                <th className="text-left" style={{ color: '#D4A017' }}>RDW / Edge Autonomy</th>
                <th className="text-left" style={{ color: '#C0392B' }}>AeroVironment (AVAV)</th>
                <th className="text-left" style={{ color: '#C0392B' }}>Kratos (KTOS)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Power Source', 'In-house SOFC (owned)', 'Third-party batteries', 'Third-party turbines'],
                ['UAS Endurance', '8–10 hours', '3–5 hours (Puma AE)', '2–4 hours'],
                ['Margin on Power', '~60–65% (internal)', '30–40% (outsourced)', '35–45% (outsourced)'],
                ['Supply Chain Risk', 'None (single supplier = self)', 'High — battery commodity', 'Medium — turbine sourcing'],
                ['EV/Revenue 2026E', '~1.3x (RDW)', '~4.2x (AVAV)', '~3.8x (KTOS)'],
              ].map(([cat, rdw, avav, ktos]) => (
                <tr key={cat}>
                  <td className="font-semibold text-[#E8EDF5] text-[12px]">{cat}</td>
                  <td className="text-[#D4A017] font-semibold">{rdw}</td>
                  <td className="text-[#8892A4]">{avav}</td>
                  <td className="text-[#8892A4]">{ktos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.node && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 14,
            top: tooltip.y - 8,
            zIndex: 9999,
            background: 'rgba(13,17,23,0.97)',
            border: `1px solid ${NODE_COLORS[tooltip.node.type as keyof typeof NODE_COLORS]}`,
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 13,
            maxWidth: 280,
            color: '#E8EDF5',
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          }}
        >
          <div className="font-bold mb-1" style={{ color: NODE_COLORS[tooltip.node.type as keyof typeof NODE_COLORS] }}>
            {tooltip.node.label}
          </div>
          <div className="text-[12px] text-[#8892A4] leading-relaxed">{tooltip.node.description}</div>
          {tooltip.node.inhouse && (
            <div className="mt-2 text-[11px] text-[#1ABCB4] font-semibold">✓ Fully In-House</div>
          )}
        </div>
      )}
    </section>
  );
}
