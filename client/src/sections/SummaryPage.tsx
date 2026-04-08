import GlossaryTooltip from '../components/GlossaryTooltip';

const keyMetrics = [
  { label: 'FY2025 Revenue', value: '$335.4M', change: '+10.3% YoY', up: true },
  { label: '2026E Revenue', value: '$475M', change: '$450–500M guided', up: true },
  { label: 'Contracted Backlog', value: '$411.2M', change: '+38.6% YoY', up: true },
  { label: 'Book-to-Bill', value: '1.32x', change: 'Orders > Revenue', up: true },
  { label: 'SOTP Fair Value', value: '$18.01', change: 'vs ~$7.47 current', up: true },
  { label: 'DCF Fair Value', value: '$16.00', change: 'Base Case', up: true },
  { label: 'Net Debt', value: '$213M', change: 'Refinanced to 2029', up: null },
  { label: 'PIL-BOX Trials', value: '43', change: 'Active ISS programs', up: true },
];

const segments = [
  {
    name: 'Space Infrastructure',
    pct: 62,
    color: '#D4A017',
    desc: 'iROSA solar arrays, deployable structures, in-space manufacturing, RF antennas for civil/commercial/DoD satellites',
  },
  {
    name: 'Defense Technology',
    pct: 38,
    color: '#C0392B',
    desc: 'Edge Autonomy UAS systems (Stalker XE), SOFC power stacks, multi-domain ISR payloads',
  },
];

export default function SummaryPage() {
  return (
    <section id="summary" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <div className="section-eyebrow">Executive Summary</div>
          <h2 className="section-title mb-4">
            The Numbers,<br />
            <span className="text-gradient-gold">Before the Story.</span>
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {keyMetrics.map((m) => (
            <div key={m.label} className="metric-card" data-testid={`metric-${m.label}`}>
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
              <div
                className="mt-2 text-[11px] font-mono"
                style={{ color: m.up === true ? '#1ABCB4' : m.up === false ? '#C0392B' : '#5C6880' }}
              >
                {m.up === true && '▲ '}{m.up === false && '▼ '}{m.change}
              </div>
            </div>
          ))}
        </div>

        {/* Business segments */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <div className="section-eyebrow mb-4">Business Segments</div>
            <div className="space-y-4">
              {segments.map((s) => (
                <div key={s.name} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                      <span className="font-semibold text-[15px] text-[#E8EDF5]">{s.name}</span>
                    </div>
                    <span className="font-mono text-lg font-bold" style={{ color: s.color }}>{s.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#1E2A3A] mb-3">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}80)` }}
                    />
                  </div>
                  <p className="text-[12px] text-[#5C6880] leading-relaxed">{s.desc}</p>
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
                ['Founded', '2020 (via merger of heritage space primes)'],
                ['Employees', '~900'],
                ['Market Cap', '~$400M (at $7.47)'],
                ['Enterprise Value', '~$613M'],
                ['EV/Rev 2026E', '~1.3x (peer avg: 3.2x)'],
                ['Fiscal Year', 'December 31'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#1A2030] pb-2 last:border-0 last:pb-0">
                  <span className="text-[#5C6880]">{k}</span>
                  <span className="text-[#C8D0DC] font-mono text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="glass-card p-5 border-l-4 border-[#1ABCB4]">
              <div className="text-[11px] text-[#1ABCB4] font-mono tracking-wider uppercase mb-2">Key Observation</div>
              <p className="text-[13px] text-[#8892A4] leading-relaxed">
                At 1.3x EV/Revenue against a{' '}
                <GlossaryTooltip term="Book-to-Bill Ratio" definition="The ratio of new orders received to revenue billed. A ratio above 1.0x means the backlog is growing faster than revenue — a leading indicator of future sales growth.">
                  1.32x book-to-bill
                </GlossaryTooltip>{' '}
                and record $411.2M backlog, RDW trades like a company in decline. The gap between contract momentum and valuation is the opportunity.
              </p>
            </div>
          </div>
        </div>

        {/* Risk/reward snapshot */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Bull Case', value: '$22', note: 'SOTP + pharma upside', color: '#4CAF50' },
            { label: 'Base Case', value: '$16', note: 'DCF at WACC 11.5%', color: '#D4A017' },
            { label: 'Bear Case', value: '$9', note: 'Growth disappoint', color: '#C0392B' },
          ].map((c) => (
            <div
              key={c.label}
              className="glass-card p-4 text-center"
              style={{ borderTop: `3px solid ${c.color}` }}
            >
              <div className="text-2xl font-bold font-mono mb-1" style={{ color: c.color }}>{c.value}</div>
              <div className="text-[11px] font-semibold text-[#E8EDF5] mb-1">{c.label}</div>
              <div className="text-[11px] text-[#5C6880]">{c.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
