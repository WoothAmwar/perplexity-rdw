import GlossaryTooltip from '../components/GlossaryTooltip';

const LIVE_PRICE = 9.56;

const keyMetrics = [
  { label: 'FY2025 Revenue', value: '$335.4M', change: '+10.3% YoY', up: true },
  { label: '2026E Revenue', value: '$475M', change: '$450–500M guided', up: true },
  { label: 'Contracted Backlog', value: '$411.2M', change: '+38.6% YoY', up: true },
  { label: 'Book-to-Bill (FY25)', value: '1.32x', change: 'Q4 2025: 1.52x', up: true },
  { label: 'SOTP Fair Value', value: '$18.01', change: `vs $${LIVE_PRICE} current`, up: true },
  { label: '12M Price Target', value: '$16.00', change: 'LONG Rating', up: true },
  { label: 'Net Debt', value: '$88M', change: 'Refinanced May 2029', up: null },
  { label: 'Total Liquidity', value: '$130.2M', change: 'Record level', up: true },
];

const segments = [
  {
    name: 'Space Infrastructure',
    pct: 49,
    color: '#C8102E',
    q4rev: '$54.5M',
    backlog: '$299.8M',
    bToB: '2.04x',
    desc: 'iROSA/ELSA solar arrays, deployable structures, in-space manufacturing, Hammerhead RF antennas for EuroQCI and MATTEO (Belgium\'s first national security satellite)',
  },
  {
    name: 'Defense Technology',
    pct: 50,
    color: '#0EA5E9',
    q4rev: '$54.3M',
    backlog: '$111.4M',
    bToB: '0.99x',
    desc: 'Edge Autonomy UAS systems (Stalker XE/FC — 433km range), SOFC power stacks, multi-domain ISR payloads. 85,000 sq ft Ann Arbor facility opened Nov 2025.',
  },
];

export default function SummaryPage() {
  return (
    <section id="summary" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        {/* flex-col layout: header top */}
        <div className="section-layout-col mb-10">
          <div className="mb-6">
            <div className="section-eyebrow">Executive Summary</div>
            <h2 className="section-title mb-4">
              From Researcher<br />
              <span className="text-gradient-red">to Producer.</span>
            </h2>
            {/* Transformation narrative + valuation discount */}
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
              <div>
                <p className="section-subtitle">
                  Redwire was founded as an aggregator of NASA-heritage technology. That era is ending.
                  Q4 2025 marked the company's first segment-level production reporting — Defense Technology
                  at $54.3M, Space Infrastructure at $54.5M — signaling the shift from{' '}
                  <span style={{ color: 'var(--rdw-red)', fontWeight: 600 }}>contract researcher to volume producer</span>.
                  The Ann Arbor manufacturing facility (85,000 sq ft, opened Nov 2025) and the DoD SOFC
                  production pipeline are proof points that this transition is structural, not cyclical.
                </p>
              </div>
              <div className="glass-card p-4" style={{ borderLeft: '4px solid #D4A017' }}>
                <div className="text-[10px] font-mono tracking-[3px] uppercase mb-2" style={{ color: '#D4A017' }}>Discount to Intrinsic Value</div>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Despite this transition, RDW trades at <strong style={{ color: 'var(--rdw-red)' }}>3.3x FWD EV/Sales</strong> — 
                  a 56% discount to KTOS and 30% discount to AVAV.
                  Our SOTP analysis implies <strong style={{ color: '#D4A017' }}>$18.01 intrinsic value</strong> vs 
                  the $9.56 current price. The market is pricing in the researcher.
                  We are valuing the producer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Now framing */}
        <div
          className="glass-card mb-10 p-6"
          style={{ borderLeft: '4px solid #C8102E' }}
        >
          <div className="text-[10px] font-mono tracking-[4px] uppercase mb-3" style={{ color: 'var(--rdw-red)' }}>
            The Catalyst for &ldquo;Why Now&rdquo;
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-[11px] font-mono tracking-wider uppercase" style={{ color: '#4B5563' }}>A Year Ago — Too Early</div>
              <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                Unresolved debt overhang, Edge Autonomy integration unproven, no segment-level transparency. Entry here meant absorbing full execution risk with no visibility on the inflection.
              </p>
            </div>
            <div className="space-y-1" style={{ borderLeft: '1px solid var(--card-border)', paddingLeft: '24px' }}>
              <div className="text-[11px] font-mono tracking-wider uppercase" style={{ color: 'var(--rdw-red)' }}>Today — The Entry Window</div>
              <p className="text-[13px] leading-relaxed font-semibold" style={{ color: 'var(--text-primary)' }}>
                Debt refinanced to 2029. Q4 2025 segment reporting launched. Backlog at $411.2M (+38.6% YoY). EBITDA inflection on the horizon in H2 2026. The risk/reward is now asymmetric.
              </p>
            </div>
            <div className="space-y-1" style={{ borderLeft: '1px solid var(--card-border)', paddingLeft: '24px' }}>
              <div className="text-[11px] font-mono tracking-wider uppercase" style={{ color: '#4B5563' }}>A Year Later — Too Late</div>
              <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                Once positive EBITDA is confirmed in H2 2026, 150+ institutional funds re-enter. The multiple re-rates before the annual report prints. Waiting means chasing, not owning.
              </p>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {keyMetrics.map((m) => (
            <div key={m.label} className="metric-card" data-testid={`metric-${m.label}`}>
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
              <div
                className="mt-2 text-[11px] font-mono"
                style={{ color: m.up === true ? '#10B981' : m.up === false ? 'var(--rdw-red)' : 'var(--text-muted)' }}
              >
                {m.up === true && '▲ '}{m.up === false && '▼ '}{m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Business segments — Q4 2025 first-ever segment reporting */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <div className="section-eyebrow mb-1">Q4 2025 — First Segment Reporting</div>
            <p className="text-[11px] mb-4 font-mono" style={{ color: 'var(--text-muted)' }}>
              Bar = % of total Q4 2025 revenue · Hover “B/B” for Book-to-Bill definition
            </p>
            <div className="space-y-4">
              {segments.map((s) => (
                <div key={s.name} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                      <span className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                    </div>
                    <span className="font-mono text-lg font-bold" style={{ color: s.color }}>{s.q4rev}</span>
                  </div>
                  <div className="h-2 rounded-full mb-3" style={{ background: 'var(--card-border)' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}80)` }}
                    />
                  </div>
                  <div className="flex gap-4 mb-3 text-[11px]">
                    <span style={{ color: 'var(--text-muted)' }}>Backlog: <span className="font-mono font-bold" style={{ color: 'var(--text-secondary)' }}>{s.backlog}</span></span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      <GlossaryTooltip
                        term="Book-to-Bill Ratio (B/B)"
                        definition="New orders received ÷ revenue billed in the same period. A ratio above 1.0x means the order backlog is growing faster than revenue — a leading indicator of future sales. B/B of 2.04x means Space Infrastructure is booking $2.04 of new contracts for every $1 of revenue shipped."
                      >
                        B/B
                      </GlossaryTooltip>: <span className="font-mono font-bold" style={{ color: s.color }}>{s.bToB}</span>
                    </span>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Company snapshot */}
          <div className="space-y-4">
            <div className="section-eyebrow mb-4">Company Snapshot</div>
            <div className="glass-card p-5 space-y-3 text-sm">
              {[
                ['Ticker', 'NYSE: RDW'],
                ['Headquarters', 'Jacksonville, FL'],
                ['Founded', '2020 (heritage space primes)'],
                ['Employees', '~900 (+ 600 Edge Autonomy)'],
                ['Market Cap', `$1.83B (at $${LIVE_PRICE} current)`],
                ['Enterprise Value', '$1.55B'],
                ['FWD EV/Sales', '3.3x (peers: 4.7–7.5x)'],
                ['52-Week Range', '$4.87 – $22.25'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between pb-2 last:pb-0"
                  style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span className="font-mono text-right" style={{ color: 'var(--text-secondary)' }}>{v}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-5" style={{ borderLeft: '4px solid #0EA5E9' }}>
              <div className="text-[11px] font-mono tracking-wider uppercase mb-2" style={{ color: '#0EA5E9' }}>Key Valuation Observation</div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                At 3.3x FWD EV/Sales, RDW trades at a{' '}
                <strong style={{ color: 'var(--rdw-red)' }}>30% discount to AVAV</strong> and a{' '}
                <strong style={{ color: 'var(--rdw-red)' }}>56% discount to KTOS</strong> — despite RDW's{' '}
                <GlossaryTooltip term="Book-to-Bill Ratio" definition="The ratio of new orders received to revenue billed. A ratio above 1.0x means the backlog is growing faster than revenue — a leading indicator of future sales growth.">
                  41.6% organic growth rate
                </GlossaryTooltip>{' '}
                exceeding both peers. Fuel cell vertical integration, sovereign quantum positioning, and biotech regulatory moat have no direct peer analogues.
              </p>
            </div>
          </div>
        </div>

        {/* Risk/reward snapshot */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Bull Case', value: '$22', note: 'Analyst high PT — Truist', color: '#10B981' },
            { label: 'Base Case', value: '$16', note: 'SOTP 65% + DCF 35%', color: 'var(--rdw-red)' },
            { label: 'Bear Case', value: '$9', note: 'Near current price', color: '#6B7280' },
          ].map((c) => (
            <div
              key={c.label}
              className="glass-card p-4 text-center"
              style={{ borderTop: `3px solid ${c.color}` }}
            >
              <div className="text-2xl font-bold font-mono mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{c.label}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
