import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import GlossaryTooltip from '../components/GlossaryTooltip';

const BETA_SCENARIOS = [
  {
    beta: 2.49,
    wacc: 15.2,
    label: 'Current (Published) Beta',
    color: 'var(--rdw-red)',
    targetPrice: 4.20,
    desc: 'Market-implied beta reflects historical development-stage volatility, prior governance uncertainty, and thin float. This is the bear-case baseline — fundamentally detached from current business reality.',
  },
  {
    beta: 1.85,
    wacc: 12.8,
    label: 'Transition (1yr)',
    color: '#F59E0B',
    targetPrice: 9.50,
    desc: 'As defense production ramps and EBITDA approaches break-even, RDW beta converges toward sector median. Consistent with KTOS/AVAV historical beta migration during their own production pivots.',
  },
  {
    beta: 1.25,
    wacc: 11.0,
    label: 'Mature Defense/Space (Base Case)',
    color: '#10B981',
    targetPrice: 16.00,
    desc: 'Fully operational defense production + institutional coverage. Beta equivalent to mature peers (KTOS ~1.2, AVAV ~1.3). Our base case by FY2027. Six structural changes justify the compression.',
  },
];

// Memo-verified WACC table (page 12)
const WACC_TABLE = [
  { component: 'Risk-Free Rate (10yr UST)', current: '—', reRated: '4.3%', note: 'Held constant' },
  { component: 'Equity Risk Premium', current: '5.5%', reRated: '5.5%', note: 'Damodaran 2026' },
  { component: 'Beta', current: '2.49', reRated: '1.25', note: 'The key structural change ↓' },
  { component: 'Cost of Equity', current: '17.9%', reRated: '11.2%', note: '4.3% + Beta × 5.5%' },
  { component: 'Cost of Debt (after-tax)', current: '—', reRated: '6.1%', note: 'SOFR+375 ≈ 8.1%; 25% tax' },
  { component: 'D/V (Debt/Value)', current: '—', reRated: '5.2%', note: '$88M / ($1,607M + $88M)' },
  { component: 'E/V (Equity/Value)', current: '—', reRated: '94.8%', note: '' },
  { component: 'WACC', current: '~15%+', reRated: '11.0%', note: '0.948×11.2% + 0.052×6.1%' },
];

const WACC_JUSTIFICATION = [
  { factor: 'Production Pivot', detail: '2/3 of revenue in production status vs. 75% development in 2021' },
  { factor: 'Backlog Visibility', detail: '$411.2M backlog provides multi-year revenue certainty' },
  { factor: 'Deleveraging', detail: 'Total debt reduced from $213M to $88M; interest savings >$17M/year' },
  { factor: 'Record Liquidity', detail: '$130.2M total liquidity — operational buffer at scale' },
  { factor: 'Government Floor', detail: 'Defense customers provide recession-resistant revenue base' },
  { factor: 'Geographic Diversification', detail: '36% of backlog is international ($128.7M), reducing US concentration' },
];

export default function WaccPage() {
  const [selectedBeta, setSelectedBeta] = useState(2);
  const scenario = BETA_SCENARIOS[selectedBeta];

  const waccRange = [9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 15.2];
  const priceAtWacc = waccRange.map((w) => {
    const baseEbitda = 85;
    const growthAdj = 1 + (15.2 - w) * 0.055;
    return Math.max(2, Math.min(22, (baseEbitda * growthAdj * 9) / 60)).toFixed(2);
  });

  const chartData = {
    labels: waccRange.map((w) => `${w}%`),
    datasets: [
      {
        label: 'Implied Share Price',
        data: priceAtWacc,
        borderColor: '#C8102E',
        backgroundColor: 'rgba(200,16,46,0.08)',
        fill: true,
        borderWidth: 2.5,
        pointRadius: (ctx: any) => {
          const w = waccRange[ctx.dataIndex];
          return w === 15.2 || w === 11.0 ? 8 : 4;
        },
        pointBackgroundColor: (ctx: any) => {
          const w = waccRange[ctx.dataIndex];
          return w === 15.2 ? '#C8102E' : w === 11.0 ? '#10B981' : '#F59E0B';
        },
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'var(--card-bg)',
        borderColor: '#C8102E',
        borderWidth: 1,
        titleColor: '#C8102E',
        bodyColor: '#6B7280',
        callbacks: {
          title: (items: any[]) => `WACC: ${items[0].label}`,
          label: (item: any) => ` Target Price: $${parseFloat(item.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'var(--text-muted)', font: { size: 11, family: "'Space Mono'" } },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      y: {
        ticks: {
          color: 'var(--text-muted)',
          font: { size: 11, family: "'Space Mono'" },
          callback: (v: any) => `$${v}`,
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  };

  return (
    <section id="wacc" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        {/* flex-row-reverse: header on right */}
        <div className="section-layout-row-reverse mb-10">
          <div className="section-header-col">
            <div className="section-eyebrow">Page 11 — WACC Re-Rating</div>
            <h2 className="section-title mb-4">
              Beta: 2.49 → 1.25.<br />
              <span className="text-gradient-red">A Structural Re-Rating.</span>
            </h2>
            <p className="section-subtitle">
              <GlossaryTooltip term="Beta" definition="A measure of a stock's volatility relative to the market. Beta of 1.0 = moves in line with the market. Beta of 2.49 = moves 2.49x the market's swings. A high beta inflates the WACC (discount rate) used in DCF models, artificially depressing the fair value.">
                Beta
              </GlossaryTooltip>{' '}
              compression from 2.49 to 1.25 is the single most impactful variable in RDW's valuation.
              Six structural changes justify it — supported by the memo's hardened WACC build-up (11.0%).
            </p>
          </div>
          <div className="section-content-col">
            {/* WACC justification grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {WACC_JUSTIFICATION.map((j, i) => (
                <div key={i} className="glass-card p-3">
                  <div className="text-[11px] font-semibold mb-1" style={{ color: 'var(--rdw-red)' }}>{j.factor}</div>
                  <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{j.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beta selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {BETA_SCENARIOS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSelectedBeta(i)}
              data-testid={`beta-scenario-${i}`}
              className="px-4 py-3 rounded-xl text-left transition-all border flex-1 min-w-[180px]"
              style={{
                background: selectedBeta === i ? s.color + '12' : 'transparent',
                borderColor: selectedBeta === i ? s.color : 'var(--card-border)',
              }}
            >
              <div className="text-2xl font-black font-mono mb-1" style={{ color: s.color }}>β {s.beta}</div>
              <div className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>WACC: {s.wacc}% · PT: ${s.targetPrice}</div>
            </button>
          ))}
        </div>

        {/* Selected scenario detail */}
        <div
          className="glass-card p-5 mb-8 fade-in-up"
          style={{ borderLeft: `4px solid ${scenario.color}` }}
        >
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Beta</div>
              <div className="text-3xl font-black font-mono" style={{ color: scenario.color }}>β {scenario.beta}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>WACC</div>
              <div className="text-3xl font-black font-mono" style={{ color: scenario.color }}>{scenario.wacc}%</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Price Target</div>
              <div className="text-3xl font-black font-mono" style={{ color: scenario.color }}>${scenario.targetPrice}</div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Rationale</div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{scenario.desc}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* WACC sensitivity chart */}
          <div>
            <div className="section-eyebrow mb-3">WACC → Price Sensitivity</div>
            <div className="glass-card p-4" style={{ height: 280 }}>
              <Line data={chartData} options={chartOptions as any} />
            </div>
            <div className="flex justify-between mt-2 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--rdw-red)' }}>● ~$4 at β=2.49</span>
              <span style={{ color: '#10B981' }}>● $16.00 at β=1.25</span>
            </div>
          </div>

          {/* Hardened WACC table — memo page 12 */}
          <div>
            <div className="section-eyebrow mb-3">Hardened WACC Build-Up (Memo, April 6 2026)</div>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--card-border)' }}>
              <table className="data-table w-full" data-testid="wacc-table">
                <thead>
                  <tr>
                    <th className="text-left">Component</th>
                    <th className="text-right" style={{ color: 'var(--rdw-red)' }}>Current</th>
                    <th className="text-right" style={{ color: '#10B981' }}>Re-Rated</th>
                    <th className="text-left text-[10px]">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {WACC_TABLE.map((row) => (
                    <tr key={row.component} style={row.component === 'WACC' ? { background: 'var(--rdw-red-dim)' } : {}}>
                      <td className={`text-[12px] ${row.component === 'WACC' ? 'font-bold' : ''}`}
                        style={{ color: row.component === 'WACC' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {row.component}
                      </td>
                      <td className={`text-right font-mono ${row.component === 'WACC' ? 'font-bold' : ''}`}
                        style={{ color: row.component === 'WACC' ? 'var(--rdw-red)' : 'var(--text-muted)' }}>
                        {row.current}
                      </td>
                      <td className={`text-right font-mono ${row.component === 'WACC' ? 'font-bold text-[15px]' : ''}`}
                        style={{ color: row.component === 'WACC' ? '#10B981' : '#0EA5E9' }}>
                        {row.reRated}
                      </td>
                      <td className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
