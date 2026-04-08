import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import GlossaryTooltip from '../components/GlossaryTooltip';

const DEBT_STEPS = [
  { label: 'FY25 Net Debt', value: 213, type: 'start', color: '#C0392B', detail: 'Peak leverage — reflects Edge Autonomy acquisition financing and development-stage capex.' },
  { label: 'Debt Refinancing Gain', value: -25, type: 'decrease', color: '#4CAF50', detail: 'Feb 2026 $90M term loan replaces higher-rate debt. Improved covenant flexibility to 2029.' },
  { label: 'FY26E FCF Paydown', value: -20, type: 'decrease', color: '#1ABCB4', detail: 'Free cash flow improving as defense contracts enter production phase.' },
  { label: 'FY26E Net Debt', value: 168, type: 'mid', color: '#D4A017', detail: '' },
  { label: 'FY27E FCF Paydown', value: -40, type: 'decrease', color: '#1ABCB4', detail: 'Positive EBITDA + capex normalization generates ~$40M in debt paydown capacity.' },
  { label: 'FY27E Net Debt', value: 128, type: 'mid', color: '#D4A017', detail: '' },
  { label: 'FY28E FCF Paydown', value: -40, type: 'decrease', color: '#1ABCB4', detail: 'Continued paydown. PIL-BOX licensing + Space segment margins improve FCF quality.' },
  { label: 'FY28E Net Debt', value: 88, type: 'end', color: '#4CAF50', detail: 'Below 1.5x Net Debt/EBITDA. Investment-grade equivalent leverage.' },
];

const INTEREST_DATA = [
  { year: 'FY25', interest: 25, rate: 'Legacy ~11.5% avg' },
  { year: 'FY26E', interest: 18, rate: 'Refinanced ~9.0%' },
  { year: 'FY27E', interest: 12, rate: 'Paydown benefit' },
  { year: 'FY28E', interest: 8, rate: '$17M total savings vs FY25' },
];

export default function DeleverPage() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const svg = d3.select(el);
    svg.selectAll('*').remove();

    const W = el.clientWidth || 700;
    const H = 300;
    svg.attr('width', W).attr('height', H);

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const iW = W - margin.left - margin.right;
    const iH = H - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter to just the year snapshots
    const yearPoints = DEBT_STEPS.filter((d) => ['start', 'mid', 'end'].includes(d.type));
    const labels = ['FY25', 'FY26E', 'FY27E', 'FY28E'];

    const x = d3.scaleBand().domain(labels).range([0, iW]).padding(0.3);
    const y = d3.scaleLinear().domain([0, 250]).range([iH, 0]);

    // Grid lines
    g.append('g').attr('class', 'grid')
      .call(d3.axisLeft(y).tickSize(-iW).tickFormat(() => ''))
      .select('.domain').remove();
    g.selectAll('.grid line').attr('stroke', '#1A2030').attr('stroke-opacity', 0.5);

    // Bars (waterfall style)
    const fullData = [
      { label: 'FY25', value: 213, color: '#C0392B' },
      { label: 'FY26E', value: 168, color: '#D4A017' },
      { label: 'FY27E', value: 128, color: '#D4A017' },
      { label: 'FY28E', value: 88, color: '#4CAF50' },
    ];

    fullData.forEach((d) => {
      const bx = x(d.label) || 0;
      const bw = x.bandwidth();
      const bh = iH - y(d.value);
      const by = y(d.value);

      g.append('rect')
        .attr('x', bx)
        .attr('y', by)
        .attr('width', bw)
        .attr('height', bh)
        .attr('fill', d.color + '30')
        .attr('stroke', d.color)
        .attr('stroke-width', 1.5)
        .attr('rx', 4);

      // Value label
      g.append('text')
        .attr('x', bx + bw / 2)
        .attr('y', by - 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '700')
        .attr('fill', d.color)
        .attr('font-family', "'Space Mono', monospace")
        .text(`$${d.value}M`);
    });

    // Decline arrows
    for (let i = 1; i < fullData.length; i++) {
      const prev = fullData[i - 1];
      const curr = fullData[i];
      const px = (x(prev.label) || 0) + x.bandwidth() + 4;
      const cx = (x(curr.label) || 0) - 4;
      const midX = (px + cx) / 2;
      const py = y(prev.value);
      const cy = y(curr.value);

      g.append('path')
        .attr('d', `M${px},${py} Q${midX},${Math.min(py, cy) - 15} ${cx},${cy}`)
        .attr('fill', 'none')
        .attr('stroke', '#1ABCB4')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,3')
        .attr('marker-end', 'url(#arrow-teal)');

      const savings = prev.value - curr.value;
      g.append('text')
        .attr('x', midX)
        .attr('y', Math.min(py, cy) - 18)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#1ABCB4')
        .attr('font-family', "'Space Mono', monospace")
        .text(`–$${savings}M`);
    }

    // Arrow def
    svg.append('defs').append('marker')
      .attr('id', 'arrow-teal').attr('markerWidth', 6).attr('markerHeight', 5)
      .attr('refX', 6).attr('refY', 2.5).attr('orient', 'auto')
      .append('path').attr('d', 'M0,0 L0,5 L6,2.5 z').attr('fill', '#1ABCB4');

    // Axes
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(x))
      .selectAll('text').attr('fill', '#5C6880').attr('font-size', '11px').attr('font-family', "'Space Mono'");
    g.select('.domain').remove();

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat((v) => `$${v}M`))
      .selectAll('text').attr('fill', '#5C6880').attr('font-size', '10px').attr('font-family', "'Space Mono'");
    g.selectAll('.domain').remove();
  }, []);

  return (
    <section id="delever" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 10 — De-leveraging</div>
          <h2 className="section-title mb-4">
            $213M → $88M Net Debt.<br />
            <span className="text-gradient-gold">$17M/yr in Interest Savings.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            Redwire's February 2026 debt refinancing replaced high-cost legacy facilities with a $90M term loan to 2029 and a $30M revolver — meaningfully reducing the{' '}
            <GlossaryTooltip term="Net Debt" definition="Total financial debt (loans, bonds) minus cash held on the balance sheet. Falling net debt = de-leveraging — a positive signal that improves credit quality, reduces interest expense, and expands investor access.">
              annual interest burden
            </GlossaryTooltip>{' '}
            from ~$25M to an estimated $8M by FY2028E as the debt is paid down.
          </p>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'FY25 Net Debt', value: '$213M', color: '#C0392B' },
            { label: 'FY28E Net Debt', value: '$88M', color: '#4CAF50' },
            { label: 'Interest Reduction', value: '$17M/yr', color: '#1ABCB4' },
            { label: 'Maturity Extended', value: '2029', color: '#D4A017' },
          ].map((s) => (
            <div key={s.label} className="metric-card text-center">
              <div className="metric-value" style={{ color: s.color }}>{s.value}</div>
              <div className="metric-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Waterfall chart */}
        <div className="glass-card p-6 mb-8">
          <svg ref={svgRef} className="w-full" style={{ height: 300 }} />
        </div>

        {/* Interest savings table */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="section-eyebrow mb-3">Interest Expense Path</div>
            <div className="overflow-x-auto rounded-xl border border-[#1E2A3A]">
              <table className="data-table w-full" data-testid="interest-table">
                <thead>
                  <tr>
                    <th className="text-left">Year</th>
                    <th className="text-right">Interest ($M)</th>
                    <th className="text-left">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {INTEREST_DATA.map((row) => (
                    <tr key={row.year}>
                      <td className="font-semibold">{row.year}</td>
                      <td className="text-right font-mono" style={{ color: row.year === 'FY28E' ? '#4CAF50' : '#D4A017' }}>
                        ${row.interest}M
                      </td>
                      <td className="text-[#5C6880] text-[12px]">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <div className="section-eyebrow mb-3">Why This Matters for Valuation</div>
            {[
              { pt: '$17M/yr lower interest expense = $17M directly to pre-tax income', color: '#4CAF50' },
              { pt: 'Lower leverage → better credit rating → potential lower WACC over time', color: '#D4A017' },
              { pt: 'Covenants extended to 2029 eliminates near-term refinancing risk — a key bear-case overhang removed', color: '#1ABCB4' },
              { pt: 'At 2028E sub-1.5x Net Debt/EBITDA, RDW becomes acquirable or IPO-candidate for subsidiaries', color: '#8B5CF6' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                <p className="text-[13px] text-[#8892A4] leading-relaxed">{item.pt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
