import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import GlossaryTooltip from '../components/GlossaryTooltip';
import { useTheme } from '../App';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const REVENUE_DATA = [
  { year: 'FY23', space: 168, defense: 66, total: 234, actual: true },
  { year: 'FY24', space: 195, defense: 109, total: 304, actual: true },
  { year: 'FY25', space: 205, defense: 130, total: 335, actual: true },
  { year: 'FY26E', space: 265, defense: 210, total: 475, actual: false },
  { year: 'FY27E', space: 330, defense: 270, total: 600, actual: false },
  { year: 'FY28E', space: 390, defense: 320, total: 710, actual: false },
];

// Sankey data — 4 columns strictly L→R, T→B
// Col 0: Customer sources | Col 1: Backlog pool | Col 2: Business segments | Col 3: Value outcome
const SANKEY_NODES = [
  // Col 0 — Customer sources (top → bottom by value)
  { id: 0, col: 0, name: 'NASA / Civil Space', value: 145, color: '#1ABCB4' },
  { id: 1, col: 0, name: 'DoD / Defense', value: 134, color: '#C0392B' },
  { id: 2, col: 0, name: 'ESA / International', value: 82, color: '#8B5CF6' },
  { id: 3, col: 0, name: 'Commercial Space', value: 50, color: '#4CAF50' },
  // Col 1 — Aggregated backlog
  { id: 4, col: 1, name: '$411.2M Contracted Backlog', value: 411, color: '#D4A017' },
  // Col 2 — Business segments
  { id: 5, col: 2, name: 'Space Infrastructure', value: 255, color: '#D4A017' },
  { id: 6, col: 2, name: 'Defense Technology', value: 156, color: '#C0392B' },
  // Col 3 — Value outcome
  { id: 7, col: 3, name: 'H2 2026 EBITDA Inflection', value: 411, color: '#10B981' },
];
const SANKEY_LINKS = [
  { source: 0, target: 4, value: 145 },
  { source: 1, target: 4, value: 134 },
  { source: 2, target: 4, value: 82 },
  { source: 3, target: 4, value: 50 },
  { source: 4, target: 5, value: 255 },
  { source: 4, target: 6, value: 156 },
  { source: 5, target: 7, value: 255 },
  { source: 6, target: 7, value: 156 },
];
const SANKEY_COL_HEADERS = [
  { col: 0, label: 'CONTRACT SOURCE', sub: 'Who funds it' },
  { col: 1, label: 'BACKLOG POOL', sub: 'Contracted & binding' },
  { col: 2, label: 'BUSINESS SEGMENT', sub: 'Where it executes' },
  { col: 3, label: 'VALUE CATALYST', sub: 'Investor thesis event' },
];

export default function RevenuePage() {
  const { dark } = useTheme();
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
        backgroundColor: dark ? '#111827' : '#FFFFFF',
        borderColor: '#D4A017',
        borderWidth: 1,
        titleColor: '#D4A017',
        bodyColor: dark ? '#9BA8BB' : '#1F2937',
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

  // Build Sankey with D3 — strict L→R, T→B with column headers
  useEffect(() => {
    const el = sankeyRef.current;
    if (!el) return;
    const svg = d3.select(el);
    svg.selectAll('*').remove();

    const W = el.clientWidth || 600;
    const HEADER_H = 44;          // space at top for column header labels
    const H = 340;                // total SVG height
    const chartH = H - HEADER_H; // drawable area height
    const nodeW = 14;
    const nodePad = 6;
    const COL_COUNT = 4;
    const colW = W / COL_COUNT;
    const TOTAL = 411;

    svg.attr('width', W).attr('height', H);
    const g = svg.append('g').attr('transform', `translate(0,${HEADER_H})`);

    // ── Column header labels ────────────────────────────────────────────────
    SANKEY_COL_HEADERS.forEach(({ col, label, sub }) => {
      const cx = col * colW + colW / 2;
      svg.append('text')
        .attr('x', cx).attr('y', 14)
        .attr('text-anchor', 'middle').attr('font-size', '9px').attr('font-weight', '700')
        .attr('letter-spacing', '1.5px').attr('font-family', "'Space Mono', monospace")
        .attr('fill', '#9CA3AF').text(label);
      svg.append('text')
        .attr('x', cx).attr('y', 28)
        .attr('text-anchor', 'middle').attr('font-size', '8px')
        .attr('font-family', "'Space Mono', monospace")
        .attr('fill', '#6B7280').text(sub);
      // Vertical divider (except after last col)
      if (col < COL_COUNT - 1) {
        svg.append('line')
          .attr('x1', (col + 1) * colW).attr('y1', 0)
          .attr('x2', (col + 1) * colW).attr('y2', H)
          .attr('stroke', '#E5E7EB').attr('stroke-dasharray', '3,3').attr('stroke-opacity', 0.5);
      }
    });

    // ── Position nodes T→B within each column ──────────────────────────────
    type PosMap = Record<number, { x: number; y: number; h: number; usedY: number }>;
    const positions: PosMap = {};

    // Col 0 — sources, sorted top→bottom by descending value
    const col0Ids = [0, 1, 2, 3]; // already sorted: 145, 134, 82, 50
    let curY = 0;
    col0Ids.forEach((id) => {
      const node = SANKEY_NODES.find(n => n.id === id)!;
      const h = Math.max((node.value / TOTAL) * (chartH - nodePad * 3), 8);
      positions[id] = { x: 0, y: curY, h, usedY: curY };
      curY += h + nodePad;
    });

    // Col 1 — single backlog node, full height
    positions[4] = { x: colW, y: 0, h: chartH, usedY: 0 };

    // Col 2 — segments T→B
    positions[5] = { x: colW * 2, y: 0, h: Math.max((255 / TOTAL) * chartH - nodePad, 8), usedY: 0 };
    positions[6] = { x: colW * 2, y: (255 / TOTAL) * chartH + nodePad, h: Math.max((156 / TOTAL) * chartH - nodePad, 8), usedY: 0 };

    // Col 3 — outcome node, full height
    positions[7] = { x: colW * 3, y: 0, h: chartH, usedY: 0 };

    // ── Track outgoing y-offset within each source node ───────────────────
    const outY: Record<number, number> = {};
    const inY: Record<number, number> = {};
    SANKEY_NODES.forEach(n => { outY[n.id] = positions[n.id].y; inY[n.id] = positions[n.id].y; });

    // ── Draw flows (L→R bezier) ────────────────────────────────────────────
    SANKEY_LINKS.forEach((link) => {
      const s = positions[link.source];
      const t = positions[link.target];
      if (!s || !t) return;
      const srcNode = SANKEY_NODES.find(n => n.id === link.source)!;
      const thickness = Math.max((link.value / TOTAL) * chartH - 2, 4);

      const sx0 = s.x + nodeW;
      const tx0 = t.x;
      const sy0 = outY[link.source];
      const ty0 = inY[link.target];

      // Advance trackers
      outY[link.source] += thickness + 1;
      inY[link.target] += thickness + 1;

      const mx = (sx0 + tx0) / 2;
      const pathD = [
        `M${sx0},${sy0}`,
        `C${mx},${sy0} ${mx},${ty0} ${tx0},${ty0}`,
        `L${tx0},${ty0 + thickness}`,
        `C${mx},${ty0 + thickness} ${mx},${sy0 + thickness} ${sx0},${sy0 + thickness}`,
        'Z',
      ].join(' ');

      g.append('path')
        .attr('d', pathD)
        .attr('fill', srcNode.color)
        .attr('fill-opacity', 0.15)
        .attr('stroke', srcNode.color)
        .attr('stroke-width', 0.5)
        .attr('stroke-opacity', 0.4)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).attr('fill-opacity', 0.35).attr('stroke-opacity', 0.8);
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill-opacity', 0.15).attr('stroke-opacity', 0.4);
        })
        .append('title')
        .text(`$${link.value}M`);
    });

    // ── Draw nodes ─────────────────────────────────────────────────────────
    SANKEY_NODES.forEach((node) => {
      const pos = positions[node.id];
      if (!pos) return;

      g.append('rect')
        .attr('x', pos.x).attr('y', pos.y)
        .attr('width', nodeW).attr('height', Math.max(pos.h, 4))
        .attr('fill', node.color).attr('rx', 3);

      // Label: left-aligned nodes show label to right, right-aligned to left
      const isCol0 = pos.x < 10;
      const isCol3 = pos.x > colW * 2.5;
      const labelX = isCol0 ? pos.x + nodeW + 5 : pos.x - 5;
      const anchor = isCol0 ? 'start' : 'end';
      const midY = pos.y + pos.h / 2;
      const isCentral = node.id === 4; // backlog node

      // Value label ($M) — always show inside or beside node
      g.append('text')
        .attr('x', labelX).attr('y', midY - (node.name.length > 20 ? 8 : 0))
        .attr('dominant-baseline', 'middle').attr('text-anchor', anchor)
        .attr('font-size', isCentral ? '11px' : '10px')
        .attr('font-weight', isCentral ? '700' : '600')
        .attr('fill', node.color).attr('font-family', "'Space Grotesk', sans-serif")
        .text(node.name);

      if (node.value < TOTAL) {
        // Show $M beside name
        g.append('text')
          .attr('x', labelX).attr('y', midY + 10)
          .attr('dominant-baseline', 'middle').attr('text-anchor', anchor)
          .attr('font-size', '9px').attr('fill', node.color + 'AA')
          .attr('font-family', "'Space Mono', monospace")
          .text(`$${node.value}M`);
      }
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
            <p className="text-[11px] mt-2 font-mono text-center" style={{ color: "var(--text-muted)" }}>
              Solid fill = Actual · Transparent = Estimate
            </p>
          </div>

          {/* Sankey */}
          <div>
            <div className="section-eyebrow mb-3">Revenue Visibility — Backlog Sankey</div>
            <div className="glass-card p-4 relative">
              <svg ref={sankeyRef} className="w-full" style={{ height: 340 }} />
              <p className="text-[11px] mt-2 font-mono text-center" style={{ color: "var(--text-muted)" }}>
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
                      {!row.actual && <span className="ml-1 text-[10px]" style={{ color: "var(--text-muted)" }}>E</span>}
                    </td>
                    <td className="text-right text-[#D4A017] font-mono">${row.space}M</td>
                    <td className="text-right text-[#C0392B] font-mono">${row.defense}M</td>
                    <td className="text-right font-bold font-mono" style={{ color: "var(--text-primary)" }}>${row.total}M</td>
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
