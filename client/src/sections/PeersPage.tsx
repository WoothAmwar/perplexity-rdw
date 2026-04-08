import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import GlossaryTooltip from '../components/GlossaryTooltip';

interface Peer {
  ticker: string;
  name: string;
  evRevenue: number;
  evEbitda: number;
  revenueGrowth: number; // %
  ebitdaMargin: number;  // %
  color: string;
  isRdw: boolean;
}

const PEERS: Peer[] = [
  // Memo-verified (April 6 2026): RDW TEV $1,554M / FY2026E Rev $475M = 3.3x; AVAV ~$9B / $1,904M = 4.7x; KTOS ~$12.4B / $1,664M = 7.5x
  { ticker: 'RDW', name: 'Redwire', evRevenue: 3.3, evEbitda: 103.6, revenueGrowth: 41.6, ebitdaMargin: 3.2, color: '#C8102E', isRdw: true },
  { ticker: 'KTOS', name: 'Kratos Defense', evRevenue: 7.5, evEbitda: 74.8, revenueGrowth: 23.6, ebitdaMargin: 10.0, color: '#0EA5E9', isRdw: false },
  { ticker: 'AVAV', name: 'AeroVironment', evRevenue: 4.7, evEbitda: 33.0, revenueGrowth: 15, ebitdaMargin: 14.3, color: '#8B5CF6', isRdw: false },
  { ticker: 'RKLB', name: 'Rocket Lab', evRevenue: 6.8, evEbitda: -45, revenueGrowth: 32, ebitdaMargin: -22.0, color: '#C0392B', isRdw: false },
  { ticker: 'MNTS', name: 'Momentus', evRevenue: 2.1, evEbitda: -120, revenueGrowth: 60, ebitdaMargin: -180.0, color: '#5C6880', isRdw: false },
  { ticker: 'SPIR', name: 'Spire Global', evRevenue: 2.4, evEbitda: -18, revenueGrowth: 15, ebitdaMargin: -12.0, color: '#5C6880', isRdw: false },
  { ticker: 'RCAT', name: 'Red Cat Holdings', evRevenue: 3.1, evEbitda: 22, revenueGrowth: 25, ebitdaMargin: 6.5, color: '#4CAF50', isRdw: false },
];

export default function PeersPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ peer: Peer | null; x: number; y: number }>({ peer: null, x: 0, y: 0 });

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const svg = d3.select(el);
    svg.selectAll('*').remove();

    const W = el.clientWidth || 700;
    const H = 360;
    const margin = { top: 30, right: 60, bottom: 50, left: 60 };
    const iW = W - margin.left - margin.right;
    const iH = H - margin.top - margin.bottom;

    svg.attr('width', W).attr('height', H);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Show EV/Revenue vs Revenue Growth scatter
    const x = d3.scaleLinear().domain([0, 70]).range([0, iW]);
    const y = d3.scaleLinear().domain([-30, 20]).range([iH, 0]);

    // Grid
    g.append('g').call(d3.axisLeft(y).tickSize(-iW).tickFormat(() => ''))
      .selectAll('line').attr('stroke', '#1A2030');
    g.append('g').attr('transform', `translate(0,${iH})`)
      .call(d3.axisBottom(x).tickSize(-iH).tickFormat(() => ''))
      .selectAll('line').attr('stroke', '#1A2030');

    // Zero EBITDA line
    g.append('line')
      .attr('x1', 0).attr('x2', iW)
      .attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', '#4CAF5060')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '6,4');

    g.append('text')
      .attr('x', iW - 4).attr('y', y(0) - 6)
      .attr('text-anchor', 'end').attr('font-size', '10px').attr('fill', '#4CAF5080')
      .text('EBITDA Break-even');

    // Axis labels
    g.append('text').attr('x', iW / 2).attr('y', iH + 38)
      .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#5C6880')
      .attr('font-family', "'Space Mono'").text('Revenue Growth (%) ›');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -iH / 2).attr('y', -44)
      .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', '#5C6880')
      .attr('font-family', "'Space Mono'").text('EBITDA Margin (%) ›');

    // Dots
    const dots = g.selectAll('.dot').data(PEERS).join('g').attr('class', 'dot');

    dots.append('circle')
      .attr('cx', (d) => x(d.revenueGrowth))
      .attr('cy', (d) => y(d.ebitdaMargin))
      .attr('r', (d) => d.isRdw ? 14 : 10)
      .attr('fill', (d) => d.color + (d.isRdw ? 'CC' : '33'))
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => d.isRdw ? 2.5 : 1.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: MouseEvent, d) => {
        setTooltip({ peer: d, x: event.clientX, y: event.clientY });
      })
      .on('mousemove', (event: MouseEvent) => {
        setTooltip((t) => ({ ...t, x: event.clientX, y: event.clientY }));
      })
      .on('mouseout', () => setTooltip((t) => ({ ...t, peer: null })));

    dots.append('text')
      .attr('x', (d) => x(d.revenueGrowth))
      .attr('y', (d) => y(d.ebitdaMargin) - 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', (d) => d.isRdw ? '12px' : '10px')
      .attr('font-weight', (d) => d.isRdw ? '800' : '600')
      .attr('fill', (d) => d.color)
      .attr('font-family', "'Space Grotesk'")
      .text((d) => d.ticker);

    // EV/Revenue bubble size annotation for RDW
    const rdw = PEERS[0];
    g.append('text')
      .attr('x', x(rdw.revenueGrowth) + 18)
      .attr('y', y(rdw.ebitdaMargin))
      .attr('font-size', '10px')
      .attr('fill', '#D4A017')
      .attr('font-family', "'Space Mono'")
      .text(`EV/Rev: ${rdw.evRevenue}x`);

    // Axes tick styling
    g.selectAll('.tick text').attr('fill', '#5C6880').attr('font-size', '10px').attr('font-family', "'Space Mono'");
    g.selectAll('.domain').remove();
  }, []);

  // Peer valuation multiple gap analysis
  const peerAvgEvRev = PEERS.filter((p) => !p.isRdw && p.evRevenue > 0).reduce((s, p) => s + p.evRevenue, 0) / (PEERS.length - 1);

  return (
    <section id="peers" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 12 — Peer Gap Analysis</div>
          <h2 className="section-title mb-4">
            42% Revenue Growth.<br />
            <span className="text-gradient-gold">1.3x EV/Revenue. An Error.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            RDW has the highest revenue growth rate in the peer group and is the only company with four independent secular catalysts — yet it trades at a 65% discount to peer median{' '}
            <GlossaryTooltip term="EV/Revenue" definition="Enterprise Value divided by annual revenue. EV = Market Cap + Net Debt - Cash. This ratio is the standard valuation metric for pre-profit growth companies — it tells you how much you pay per dollar of sales. A low EV/Revenue relative to peers with similar growth implies undervaluation.">
              EV/Revenue
            </GlossaryTooltip>
            . The scatter plot shows the dislocation visually.
          </p>
        </div>

        {/* Gap highlight */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'RDW EV/Revenue', value: '1.3x', color: '#C0392B', note: 'Current market' },
            { label: 'Peer Average EV/Rev', value: `${peerAvgEvRev.toFixed(1)}x`, color: '#D4A017', note: 'KTOS, AVAV, RKLB, others' },
            { label: 'Implied PT at Peers', value: '$21.40', color: '#4CAF50', note: '+186% at peer multiple' },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5 text-center" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="text-3xl font-black font-mono mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[12px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{s.label}</div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Scatter plot */}
        <div className="section-eyebrow mb-2">Revenue Growth vs. EBITDA Margin — Peer Scatter</div>
        <div className="glass-card p-4 mb-8">
          <svg ref={svgRef} className="w-full" style={{ height: 360 }} />
          <p className="text-[11px] mt-2 font-mono text-center" style={{ color: "var(--text-muted)" }}>Hover for detail · Dot size = relative significance</p>
        </div>

        {/* Peer table */}
        <div className="overflow-x-auto rounded-xl border border-[#1E2A3A]">
          <table className="data-table w-full" data-testid="peer-table">
            <thead>
              <tr>
                <th className="text-left">Ticker</th>
                <th className="text-left">Company</th>
                <th className="text-right">EV/Revenue</th>
                <th className="text-right">EV/EBITDA</th>
                <th className="text-right">Rev Growth</th>
                <th className="text-right">EBITDA Margin</th>
              </tr>
            </thead>
            <tbody>
              {PEERS.map((p) => (
                <tr key={p.ticker} style={p.isRdw ? { background: 'rgba(212,160,23,0.06)' } : {}}>
                  <td className="font-bold font-mono" style={{ color: p.color }}>{p.ticker}</td>
                  <td className="" style={{ color: "var(--text-secondary)" }}>{p.name}</td>
                  <td className="text-right font-mono" style={{ color: p.isRdw ? '#D4A017' : '#8892A4' }}>{p.evRevenue}x</td>
                  <td className="text-right font-mono" style={{ color: p.evEbitda < 0 ? '#C0392B' : '#8892A4' }}>
                    {p.evEbitda < 0 ? 'NM' : `${p.evEbitda}x`}
                  </td>
                  <td className="text-right font-mono text-[#1ABCB4]">+{p.revenueGrowth}%</td>
                  <td className="text-right font-mono" style={{ color: p.ebitdaMargin >= 0 ? '#4CAF50' : '#C0392B' }}>
                    {p.ebitdaMargin.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.peer && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 14,
            top: tooltip.y - 10,
            zIndex: 9999,
            background: 'var(--card-bg)',
            border: `1px solid ${tooltip.peer.color}`,
            borderRadius: 8,
            padding: '12px 16px',
            fontSize: 12,
            maxWidth: 260,
            color: 'var(--text-primary)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }}
        >
          <div className="font-bold mb-1" style={{ color: tooltip.peer.color }}>
            {tooltip.peer.ticker} — {tooltip.peer.name}
          </div>
          <div className="space-y-0.5" style={{ color: "var(--text-secondary)" }}>
            <div>EV/Revenue: <span className="" style={{ color: "var(--text-secondary)" }}>{tooltip.peer.evRevenue}x</span></div>
            <div>Revenue Growth: <span className="text-[#1ABCB4]">+{tooltip.peer.revenueGrowth}%</span></div>
            <div>EBITDA Margin: <span style={{ color: tooltip.peer.ebitdaMargin >= 0 ? '#4CAF50' : '#C0392B' }}>{tooltip.peer.ebitdaMargin.toFixed(1)}%</span></div>
          </div>
        </div>
      )}
    </section>
  );
}
