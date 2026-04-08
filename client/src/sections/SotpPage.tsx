import GlossaryTooltip from '../components/GlossaryTooltip';

const SOTP_SEGMENTS = [
  {
    segment: 'Space Infrastructure (Core)',
    methodology: '3.0x EV/Revenue (FY28E)',
    revenueBase: '$390M',
    multiple: '3.0x',
    value: '$1,170M',
    perShare: '$8.52',
    color: '#D4A017',
    rationale: 'iROSA, deployable structures, antennas. Blended at a 20% discount to pure-play space peers (RKLB 6.8x) given profitability timeline. 3x is conservative.',
  },
  {
    segment: 'Defense Technology (Edge Autonomy)',
    methodology: '3.2x EV/Revenue (FY28E)',
    revenueBase: '$320M',
    multiple: '3.2x',
    value: '$1,024M',
    perShare: '$7.46',
    color: '#C0392B',
    rationale: 'SOFC + Stalker UAS + ISR payloads. In-line with KTOS and AVAV current trading multiples. Reflects production-stage defense programs.',
  },
  {
    segment: 'PIL-BOX / Pharma Platform',
    methodology: 'DCF on royalty optionality',
    revenueBase: 'Pipeline value',
    multiple: '—',
    value: '$220M',
    perShare: '$1.60',
    color: '#1ABCB4',
    rationale: '43 active trials × $5M NPV/trial average, discounted 50% for execution risk. This is highly conservative — one successful Keytruda reformulation alone could be worth $500M+ to RDW in licensing.',
  },
  {
    segment: 'Quantum Security (Hammerhead + EuroQCI)',
    methodology: 'Strategic asset value',
    revenueBase: 'Contract optionality',
    multiple: '—',
    value: '$120M',
    perShare: '$0.87',
    color: '#8B5CF6',
    rationale: 'Conservative holding value for EuroQCI satellite contract and Hammerhead platform. Hardware QKD infrastructure incumbency premium.',
  },
  {
    segment: 'Less: Net Debt (FY28E)',
    methodology: 'Balance sheet',
    revenueBase: '—',
    multiple: '—',
    value: '–$88M',
    perShare: '–$0.64',
    color: '#5C6880',
    rationale: 'After FY26–28 paydown from positive FCF. Assumes no equity issuance.',
  },
];

const TOTAL = {
  value: '$2,446M',
  perShare: '$18.01',
  shares: '137.1M',
};

export default function SotpPage() {
  const perShareValues = SOTP_SEGMENTS.map((s) => parseFloat(s.perShare.replace('–', '-').replace('$', '')));
  const maxPositive = Math.max(...perShareValues.filter((v) => v > 0));

  return (
    <section id="sotp" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 13 — Sum-of-the-Parts</div>
          <h2 className="section-title mb-4">
            $18.01 per Share.<br />
            <span className="text-gradient-gold">Conservative on Every Line.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            <GlossaryTooltip term="Sum-of-the-Parts (SOTP)" definition="A valuation methodology that values each business unit independently using the most appropriate method for that segment (revenue multiple, DCF, asset value), then sums the parts and subtracts net debt to arrive at equity value per share. Particularly useful for diversified businesses where one multiple doesn't fit all segments.">
              SOTP analysis
            </GlossaryTooltip>{' '}
            allows us to value each of RDW's four distinct businesses using the most appropriate methodology. Every segment is valued at a discount to its most comparable pure-play peer — the aggregate conservatism results in a $18.01 fair value, still 141% above the current price.
          </p>
        </div>

        {/* SOTP breakdown bars */}
        <div className="space-y-3 mb-10">
          {SOTP_SEGMENTS.map((seg) => {
            const val = parseFloat(seg.perShare.replace('–', '-').replace('$', ''));
            const isNeg = val < 0;
            const barWidth = isNeg ? Math.abs(val / maxPositive) * 100 : (val / maxPositive) * 100;

            return (
              <div
                key={seg.segment}
                className="glass-card glass-card-hover p-4"
                data-testid={`sotp-${seg.segment}`}
              >
                <div className="flex flex-wrap gap-4 items-start mb-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-semibold text-[14px] text-[#E8EDF5]">{seg.segment}</div>
                    <div className="text-[11px] text-[#5C6880] mt-0.5">{seg.methodology}</div>
                  </div>
                  <div className="flex gap-6 flex-wrap items-center">
                    <div className="text-center">
                      <div className="text-[11px] text-[#5C6880]">Revenue Base</div>
                      <div className="text-sm font-mono text-[#C8D0DC]">{seg.revenueBase}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] text-[#5C6880]">Multiple</div>
                      <div className="text-sm font-mono text-[#C8D0DC]">{seg.multiple}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] text-[#5C6880]">Segment Value</div>
                      <div className="text-sm font-mono" style={{ color: seg.color }}>{seg.value}</div>
                    </div>
                    <div className="text-center min-w-[70px]">
                      <div className="text-[11px] text-[#5C6880]">Per Share</div>
                      <div className="text-xl font-black font-mono" style={{ color: isNeg ? '#C0392B' : seg.color }}>{seg.perShare}</div>
                    </div>
                  </div>
                </div>

                {/* Bar */}
                <div className="h-2 rounded-full bg-[#1E2A3A] mb-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${barWidth}%`,
                      background: isNeg ? '#C0392B' : `linear-gradient(90deg, ${seg.color}, ${seg.color}80)`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#5C6880] leading-relaxed">{seg.rationale}</p>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div
          className="rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.12), rgba(26,188,180,0.06))', border: '1px solid rgba(212,160,23,0.4)' }}
          data-testid="sotp-total"
        >
          <div className="text-[11px] font-mono text-[#D4A017] tracking-widest uppercase mb-2">SOTP Fair Value</div>
          <div className="text-6xl font-black font-mono text-gradient-gold mb-2">{TOTAL.perShare}</div>
          <div className="text-[14px] text-[#8892A4] mb-4">per share · {TOTAL.shares} diluted shares outstanding</div>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-[#4CAF50]">+141%</div>
              <div className="text-[11px] text-[#5C6880]">vs current ~$7.47</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-[#1ABCB4]">{TOTAL.value}</div>
              <div className="text-[11px] text-[#5C6880]">Total equity value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-[#8B5CF6]">$16.00</div>
              <div className="text-[11px] text-[#5C6880]">DCF base case target</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
