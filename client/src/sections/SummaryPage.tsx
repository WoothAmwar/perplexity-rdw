import GlossaryTooltip from '../components/GlossaryTooltip';

const LIVE_PRICE = 9.56;

const keyMetrics = [
  { label: 'FY2025 Revenue', value: '$335.4M', change: '+10.3% YoY', up: true },
  { label: '2026E Revenue', value: '$475M', change: '$450–500M guided', up: true },
  { label: 'Contracted Backlog', value: '$411.2M', change: '+38.6% YoY', up: true },
  { label: 'Book-to-Bill (FY25)', value: '1.32x', change: 'Q4 2025: 1.52x', up: true },
  { label: 'SOTP Fair Value', value: '$18.01', change: `vs $${LIVE_PRICE} live`, up: true },
  { label: '12M Price Target', value: '$16.00', change: 'BUY Rating', up: true },
  { label: 'Net Debt', value: '$88M', change: 'Refinanced May 2029', up: null },
  { label: 'Total Liquidity', value: '$130.2M', change: 'Record level', up: true },
];

const segments = [
  {
    name: 'Space Infrastructure',
    pct: 49,
    color: 'var(--rdw-red)',
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
        <div className="section-layout-col mb-12">
          <div className="mb-8">
            <div className="section-eyebrow">Executive Summary</div>
            <h2 className="section-title mb-4">
              The Numbers,<br />
              <span className="text-gradient-red">Before the Story.</span>
            </h2>
            <p className="section-subtitle max-w-3xl">
              Verified against the April 6, 2026 memo and live market data.
              All figures sourced from Redwire SEC filings and premium data providers.
            </p>
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
            <div className="section-eyebrow mb-4">Q4 2025 — First Segment Reporting</div>
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
                    <span style={{ color: 'var(--text-muted)' }}>B/B: <span className="font-mono font-bold" style={{ color: s.color }}>{s.bToB}</span></span>
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
                ['Market Cap', `$1.83B (at $${LIVE_PRICE})`],
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
