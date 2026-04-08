import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import GlossaryTooltip from '../components/GlossaryTooltip';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const REVENUE_DATA = [
  { year: 'FY23', space: 168, defense: 66, total: 234, actual: true },
  { year: 'FY24', space: 195, defense: 109, total: 304, actual: true },
  { year: 'FY25', space: 205, defense: 130, total: 335, actual: true },
  { year: 'FY26E', space: 265, defense: 210, total: 475, actual: false },
  { year: 'FY27E', space: 330, defense: 270, total: 600, actual: false },
  { year: 'FY28E', space: 390, defense: 320, total: 710, actual: false },
];

const SANKEY_DATA = {
  nodes: [
    { id: 0, name: 'NASA', color: '#1ABCB4' },
    { id: 1, name: 'ESA', color: '#8B5CF6' },
    { id: 2, name: 'DoD / Defense', color: '#C0392B' },
    { id: 3, name: 'Commercial Space', color: '#4CAF50' },
    { id: 4, name: '$411.2M Backlog', color: '#D4A017' },
    { id: 5, name: 'Space Infrastructure', color: '#1ABCB4' },
    { id: 6, name: 'Defense Tech', color: '#C0392B' },
    { id: 7, name: 'EBITDA Inflection', color: '#4CAF50' },
  ],
  links: [
    { source: 0, target: 4, value: 145 },
    { source: 1, target: 4, value: 82 },
    { source: 2, target: 4, value: 134 },
    { source: 3, target: 4, value: 50 },
    { source: 4, target: 5, value: 255 },
    { source: 4, target: 6, value: 156 },
    { source: 5, target: 7, value: 255 },
    { source: 6, target: 7, value: 156 },
  ],
};

export default function RevenuePage() {
  const sankeyRef = useRef<SVGSVGElement>(null);

  const barData = {
    labels: REVENUE_DATA.map((d) => d.year),
    datasets: [
      {
        label: 'Space Infrastructure',
        data: REVENUE_DATA.map((d) => d.space),
        backgroundColor: REVENUE_DATA.map((d) => d.actual ? '#D4A017CC' : '#D4A01744'),
        borderColor: '#D4A017',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Defense Technology',
        data: REVENUE_DATA.map((d) => d.defense),
        backgroundColor: REVENUE_DATA.map((d) => d.actual ? '#C0392BCC' : '#C0392B44'),
        borderColor: '#C0392B',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#8892A4', font: { family: "'Space Grotesk', sans-serif", size: 12 } },
      },
      tooltip: {
        backgroundColor: '#0D1117',
        borderColor: '#D4A017',
        borderWidth: 1,
        titleColor: '#D4A017',
        bodyColor: '#C8D0DC',
        callbacks: {
          title: (items: any[]) => `${items[0].label}${items[0].datasetIndex === 0 && !REVENUE_DATA[items[0].dataIndex].actual ? ' (Est)' : ''}`,
          afterBody: (items: any[]) => {
            const idx = items[0].dataIndex;
            const total = REVENUE_DATA[idx].total;
            return [`Total: $${total}M`];
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: '#5C6880', font: { family: "'Space Mono', monospace", size: 11 } },
        grid: { color: '#1A2030' },
      },
      y: {
        stacked: true,
        ticks: {
          color: '#5C6880',
          font: { family: "'Space Mono', monospace", size: 11 },
          callback: (v: any) => `$${v}M`,
        },
        grid: { color: '#1A2030' },
      },
    },
  };

  // Build Sankey with D3
  useEffect(() => {
    const el = sankeyRef.current;
    if (!el) return;
    const svg = d3.select(el);
    svg.selectAll('*').remove();

    const W = el.clientWidth || 600;
    const H = 280;
    svg.attr('width', W).attr('height', H);

    const nodeW = 16;
    const pad = 8;

    // Position nodes manually (4 columns)
    const positions: Record<number, { x: number; y: number; h: number }> = {};
    const colW = W / 4;

    // Col 0: sources
    const sources = [0, 1, 2, 3];
    const sourceVals = [145, 82, 134, 50];
    let sy = 20;
    sources.forEach((id, i) => {
      const h = (sourceVals[i] / 411) * (H - 40);
      positions[id] = { x: 0, y: sy, h };
      sy += h + pad;
    });

    // Col 1: backlog node
    positions[4] = { x: colW, y: 20, h: H - 40 };

    // Col 2: segments
    positions[5] = { x: colW * 2, y: 20, h: (255 / 411) * (H - 40) };
    positions[6] = { x: colW * 2, y: 20 + (255 / 411) * (H - 40) + pad, h: (156 / 411) * (H - 40) };

    // Col 3: EBITDA
    positions[7] = { x: colW * 3, y: 20, h: H - 40 };

    // Draw links (simplified bezier)
    const g = svg.append('g');

    SANKEY_DATA.links.forEach((link) => {
      const s = positions[link.source];
      const t = positions[link.target];
      if (!s || !t) return;
      const thickness = (link.value / 411) * (H - 40);
      const sx = s.x + nodeW;
      const tx = t.x;

      // Find y offsets (simplified)
      const sy_offset = s.y + (s.h - thickness) / 2;
      const ty_offset = t.y + (t.h / 2) - thickness / 2;

      const pathD = `M${sx},${sy_offset} C${(sx + tx) / 2},${sy_offset} ${(sx + tx) / 2},${ty_offset} ${tx},${ty_offset} L${tx},${ty_offset + thickness} C${(sx + tx) / 2},${ty_offset + thickness} ${(sx + tx) / 2},${sy_offset + thickness} ${sx},${sy_offset + thickness} Z`;

      g.append('path')
        .attr('d', pathD)
        .attr('fill', SANKEY_DATA.nodes[link.source].color)
        .attr('fill-opacity', 0.18)
        .attr('stroke', SANKEY_DATA.nodes[link.source].color)
        .attr('stroke-width', 0.5)
        .attr('stroke-opacity', 0.3)
        .on('mouseover', function () { d3.select(this).attr('fill-opacity', 0.35); })
        .on('mouseout', function () { d3.select(this).attr('fill-opacity', 0.18); });
    });

    // Draw nodes
    SANKEY_DATA.nodes.forEach((node) => {
      const pos = positions[node.id];
      if (!pos) return;

      g.append('rect')
        .attr('x', pos.x)
        .attr('y', pos.y)
        .attr('width', nodeW)
        .attr('height', Math.max(pos.h, 4))
        .attr('fill', node.color)
        .attr('rx', 3);

      // Label
      const isLeft = pos.x < nodeW + 10;
      const isRight = pos.x > colW * 2.5;
      g.append('text')
        .attr('x', isLeft ? pos.x + nodeW + 6 : pos.x - 6)
        .attr('y', pos.y + pos.h / 2)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', isLeft ? 'start' : 'end')
        .attr('font-size', node.id === 4 ? '12px' : '10px')
        .attr('font-weight', node.id === 4 ? '700' : '500')
        .attr('fill', node.color)
        .attr('font-family', "'Space Grotesk', sans-serif")
        .text(node.name);
    });
  }, []);

  return (
    <section id="revenue" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 8 — Revenue Ramp</div>
          <h2 className="section-title mb-4">
            From $335M to $710M.<br />
            <span className="text-gradient-gold">Backlog Proves It's Real.</span>
          </h2>
          <p className="section-subtitle max-w-2xl">
            Revenue guidance of $450–500M for FY2026 is supported by a{' '}
            <GlossaryTooltip term="Book-to-Bill Ratio" definition="New contract awards ÷ Revenue recognized. At 1.32x, RDW is accumulating orders 32% faster than it delivers — a leading indicator that future revenue growth is underwritten by real contracts, not speculation.">
              1.32x book-to-bill
            </GlossaryTooltip>{' '}
            and a record $411.2M contracted backlog. The Sankey diagram below maps exactly where that backlog came from and where it's going.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Bar chart */}
          <div>
            <div className="section-eyebrow mb-3">Revenue by Segment FY23–FY28E</div>
            <div className="glass-card p-4" style={{ height: 320 }}>
              <Bar data={barData} options={barOptions as any} />
            </div>
            <p className="text-[11px] text-[#3A4A5C] mt-2 font-mono text-center">
              Solid fill = Actual · Transparent = Estimate
            </p>
          </div>

          {/* Sankey */}
          <div>
            <div className="section-eyebrow mb-3">Revenue Visibility — Backlog Sankey</div>
            <div className="glass-card p-4 relative">
              <svg ref={sankeyRef} className="w-full" style={{ height: 280 }} />
              <p className="text-[11px] text-[#3A4A5C] mt-2 font-mono text-center">
                Hover flows · Width ∝ $M of backlog
              </p>
            </div>
          </div>
        </div>

        {/* Revenue table */}
        <div className="overflow-x-auto rounded-xl border border-[#1E2A3A]">
          <table className="data-table w-full" data-testid="revenue-table">
            <thead>
              <tr>
                <th className="text-left">Year</th>
                <th className="text-right">Space ($M)</th>
                <th className="text-right">Defense ($M)</th>
                <th className="text-right">Total ($M)</th>
                <th className="text-right">YoY Growth</th>
              </tr>
            </thead>
            <tbody>
              {REVENUE_DATA.map((row, i) => {
                const prev = REVENUE_DATA[i - 1];
                const growth = prev ? ((row.total - prev.total) / prev.total * 100).toFixed(1) + '%' : '—';
                return (
                  <tr key={row.year}>
                    <td className="font-semibold">
                      {row.year}
                      {!row.actual && <span className="ml-1 text-[10px] text-[#5C6880]">E</span>}
                    </td>
                    <td className="text-right text-[#D4A017] font-mono">${row.space}M</td>
                    <td className="text-right text-[#C0392B] font-mono">${row.defense}M</td>
                    <td className="text-right font-bold font-mono text-[#E8EDF5]">${row.total}M</td>
                    <td className="text-right font-mono" style={{ color: i > 0 ? '#1ABCB4' : '#5C6880' }}>
                      {i > 0 ? `+${growth}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
