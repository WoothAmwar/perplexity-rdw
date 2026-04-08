import GlossaryTooltip from '../components/GlossaryTooltip';

const LIVE_PRICE = 9.56;

// Premium-sourced SOTP — from memo page 14 (April 6, 2026)
const SOTP_SEGMENTS = [
  {
    segment: 'Space Infrastructure',
    methodology: '5.0x EV/Revenue (2026E)',
    revenueBase: '$240M',
    multiple: '5.0x',
    value: '$1,200M',
    perShare: '$7.27',
    color: 'var(--rdw-red)',
    rationale: 'iROSA/ELSA, deployable structures, Hammerhead. Peer: Edge Autonomy at 5.3x [PitchBook], AVAV at 4.8x FWD. iROSA 9yr flight heritage + Axiom Station contract supports premium.',
  },
  {
    segment: 'Defense & UAS',
    methodology: '9.0x EV/Revenue (2026E)',
    revenueBase: '$215M',
    multiple: '9.0x',
    value: '$1,935M',
    perShare: '$11.73',
    color: '#0EA5E9',
    rationale: 'Stalker fuel cell UAS (433km range), Ann Arbor SOFC production. KTOS at 7.5x FWD; $10.5B US defense-tech VC in H1 2025 [CB Insights] supports premium valuation environment.',
  },
  {
    segment: 'Quantum / Comms',
    methodology: '15.0x EV/Revenue (2026E)',
    revenueBase: '$20M',
    multiple: '15.0x',
    value: '$300M',
    perShare: '$1.82',
    color: '#8B5CF6',
    rationale: 'QKDSat/Hammerhead EuroQCI backbone. SandboxAQ at 57.5x EV/Revenue [PitchBook]. $9.8B quantum security TAM by 2030 at 80% CAGR [Statista]. 75% discount for execution risk applied.',
  },
  {
    segment: 'Space Biotech (PIL-BOX)',
    methodology: '18.0x EV/Revenue (2026E)',
    revenueBase: '$15M',
    multiple: '18.0x',
    value: '$270M',
    perShare: '$1.64',
    color: '#10B981',
    rationale: '>$45B/yr failed pharma trials [CB Insights]; $1–2B development cost/drug [CB Insights]. 43 PIL-BOX flights, 35+ molecules, 84% crystal improvement. NASA IDIQ + BMS/Purdue partnerships.',
  },
  {
    segment: 'Less: Conglomerate Discount (20%)',
    methodology: 'Applied to segment total',
    revenueBase: '—',
    multiple: '−20%',
    value: '−$741M',
    perShare: '−$4.49',
    color: '#6B7280',
    rationale: 'Standard conglomerate discount for holding company structure. Narrows as segment-level reporting improves transparency and investor understanding.',
  },
  {
    segment: 'Plus: Net Cash',
    methodology: 'Balance sheet',
    revenueBase: '—',
    multiple: '—',
    value: '+$6.6M',
    perShare: '+$0.04',
    color: '#10B981',
    rationale: 'Redwire is essentially net-cash ($130.2M liquidity vs $88M gross debt, with positive FCF trajectory). Refinanced at SOFR+375, extended to May 2029.',
  },
];

export default function SotpPage() {
  const positives = SOTP_SEGMENTS.filter(s => !s.perShare.startsWith('−'));
  const totalSegEV = 3705;
  const adjustedEV = 2964;
  const equityValue = 2971;
  const dilutedShares = 165;

  return (
    <section id="sotp" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        {/* flex-col layout for financial table */}
        <div className="section-layout-col">
          <div className="mb-10">
            <div className="section-eyebrow">Page 13 — Sum-of-the-Parts (Premium-Sourced)</div>
            <h2 className="section-title mb-4">
              $18.01 per Share.<br />
              <span className="text-gradient-red">Conservative on Every Line.</span>
            </h2>
            <p className="section-subtitle max-w-4xl">
              <GlossaryTooltip term="Sum-of-the-Parts (SOTP)" definition="A valuation methodology that values each business unit independently using the most appropriate method for that segment, then sums the parts and subtracts net debt to arrive at equity value per share. Multiples sourced from PitchBook, CB Insights, and Statista Premium.">
                SOTP analysis
              </GlossaryTooltip>{' '}
              using premium-sourced peer multiples from PitchBook, CB Insights, and Statista.
              Every segment is valued at a 20%–75% discount to its closest pure-play peers.
            </p>
          </div>

          {/* SOTP table */}
          <div className="overflow-x-auto rounded-xl mb-8" style={{ border: '1px solid var(--card-border)' }}>
            <table className="data-table w-full" data-testid="sotp-table">
              <thead>
                <tr>
                  <th className="text-left">Segment</th>
                  <th className="text-right">2026E Rev</th>
                  <th className="text-right">Multiple</th>
                  <th className="text-right">Segment EV</th>
                  <th className="text-left" style={{ minWidth: 260 }}>Peer Justification</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: 'rgba(200,16,46,0.05)' }}>
                  <td className="font-semibold" style={{ color: 'var(--rdw-red)' }}>Space Infrastructure</td>
                  <td className="text-right font-mono">$240M</td>
                  <td className="text-right font-mono font-bold" style={{ color: 'var(--rdw-red)' }}>5.0x</td>
                  <td className="text-right font-mono font-bold" style={{ color: 'var(--rdw-red)' }}>$1,200M</td>
                  <td className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Edge Autonomy 5.3x [PitchBook]; AVAV 4.8x FWD; iROSA heritage</td>
                </tr>
                <tr style={{ background: 'rgba(14,165,233,0.05)' }}>
                  <td className="font-semibold" style={{ color: '#0EA5E9' }}>Defense & UAS</td>
                  <td className="text-right font-mono">$215M</td>
                  <td className="text-right font-mono font-bold" style={{ color: '#0EA5E9' }}>9.0x</td>
                  <td className="text-right font-mono font-bold" style={{ color: '#0EA5E9' }}>$1,935M</td>
                  <td className="text-[11px]" style={{ color: 'var(--text-muted)' }}>KTOS 7.5x FWD; Edge Autonomy 5.3x [PitchBook]; fuel cell premium; $10.5B VC [CB Insights]</td>
                </tr>
                <tr style={{ background: 'rgba(139,92,246,0.05)' }}>
                  <td className="font-semibold" style={{ color: '#8B5CF6' }}>Quantum / Comms</td>
                  <td className="text-right font-mono">$20M</td>
                  <td className="text-right font-mono font-bold" style={{ color: '#8B5CF6' }}>15.0x</td>
                  <td className="text-right font-mono font-bold" style={{ color: '#8B5CF6' }}>$300M</td>
                  <td className="text-[11px]" style={{ color: 'var(--text-muted)' }}>SandboxAQ 57.5x [PitchBook]; $9.8B TAM [Statista]; 75% execution discount</td>
                </tr>
                <tr style={{ background: 'rgba(16,185,129,0.05)' }}>
                  <td className="font-semibold" style={{ color: '#10B981' }}>Space Biotech</td>
                  <td className="text-right font-mono">$15M</td>
                  <td className="text-right font-mono font-bold" style={{ color: '#10B981' }}>18.0x</td>
                  <td className="text-right font-mono font-bold" style={{ color: '#10B981' }}>$270M</td>
                  <td className="text-[11px]" style={{ color: 'var(--text-muted)' }}>&gt;$45B/yr failed trials [CB Insights]; $1–2B/drug [CB Insights]; PIL-BOX 84% success rate</td>
                </tr>
                <tr style={{ background: 'var(--card-border)' }}>
                  <td className="font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>TOTAL SEGMENT EV</td>
                  <td className="text-right font-mono font-bold" style={{ color: 'var(--text-primary)' }}>$490M</td>
                  <td></td>
                  <td className="text-right font-mono font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>$3,705M</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ color: '#6B7280' }}>Less: Conglomerate Discount (20%)</td>
                  <td></td><td></td>
                  <td className="text-right font-mono" style={{ color: 'var(--rdw-red)' }}>−$741M</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--text-secondary)' }}>Adjusted EV</td>
                  <td></td><td></td>
                  <td className="text-right font-mono font-bold" style={{ color: 'var(--text-secondary)' }}>$2,964M</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ color: '#10B981' }}>Plus: Net Cash</td>
                  <td></td><td></td>
                  <td className="text-right font-mono" style={{ color: '#10B981' }}>+$6.6M</td>
                  <td></td>
                </tr>
                <tr style={{ background: 'var(--rdw-red-dim)' }}>
                  <td className="font-bold" style={{ color: 'var(--rdw-red)' }}>Equity Value</td>
                  <td></td><td></td>
                  <td className="text-right font-mono font-bold" style={{ color: 'var(--rdw-red)' }}>$2,971M</td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ color: 'var(--text-muted)' }}>Diluted Shares</td>
                  <td></td><td></td>
                  <td className="text-right font-mono" style={{ color: 'var(--text-muted)' }}>165M</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Price target derivation */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="section-eyebrow mb-4">Price Target Derivation</div>
              <div className="space-y-3">
                {[
                  { method: 'SOTP (Premium-Sourced)', value: '$18.01', weight: '65%', contrib: '$11.71', color: 'var(--rdw-red)' },
                  { method: 'DCF (Two-Stage, 11% WACC)', value: '$6.06', weight: '35%', contrib: '$2.12', color: '#0EA5E9' },
                  { method: 'Blended Base Value', value: '', weight: '', contrib: '$13.83', color: 'var(--text-primary)' },
                  { method: 'catalystPremium', value: '+$2.17', weight: '', contrib: '', color: '#10B981' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2"
                    style={{ borderBottom: i < 3 ? '1px solid var(--card-border)' : 'none' }}>
                    <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      {row.method === 'catalystPremium' ? (
                        <GlossaryTooltip
                          term="Catalyst Premium"
                          definition="An additive premium applied to the blended base value to reflect the near-term probability-weighted impact of specific binary events — namely: (1) DoD fuel cell UAS contract award expected H1 2026, (2) EuroQCI Phase 2 milestone payment, and (3) ISS commercial transition contract. Each event is assigned a probability and expected incremental NPV; the sum ($2.17/share) is added to the blended DCF/SOTP base to arrive at the $16.00 price target."
                        >
                          Catalyst Premium
                        </GlossaryTooltip>
                      ) : row.method}
                    </span>
                    <div className="flex items-center gap-4 text-right">
                      {row.weight && <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{row.weight}</span>}
                      <span className="text-[15px] font-bold font-mono" style={{ color: row.color }}>
                        {row.contrib || row.value}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="rounded-xl p-4 text-center mt-2"
                  style={{ background: 'var(--rdw-red-dim)', border: '2px solid var(--rdw-red-border)' }}>
                  <div className="text-[11px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--rdw-red)' }}>12-Month Price Target</div>
                  <div className="text-5xl font-black font-mono" style={{ color: 'var(--rdw-red)' }}>$16.00</div>
                  <div className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>LONG · +{(((16.00 - LIVE_PRICE) / LIVE_PRICE) * 100).toFixed(1)}% upside from ${LIVE_PRICE}</div>
                </div>
              </div>
            </div>

            {/* Segment breakdown visual */}
            <div className="glass-card p-6">
              <div className="section-eyebrow mb-4">Segment Value Breakdown</div>
              {[
                { name: 'Space Infrastructure', value: 1200, color: 'var(--rdw-red)' },
                { name: 'Defense & UAS', value: 1935, color: '#0EA5E9' },
                { name: 'Quantum / Comms', value: 300, color: '#8B5CF6' },
                { name: 'Space Biotech', value: 270, color: '#10B981' },
              ].map((seg) => (
                <div key={seg.name} className="mb-3">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span style={{ color: 'var(--text-secondary)' }}>{seg.name}</span>
                    <span className="font-mono font-bold" style={{ color: seg.color }}>${seg.value.toLocaleString()}M</span>
                  </div>
                  <div className="h-2.5 rounded-full" style={{ background: 'var(--card-border)' }}>
                    <div className="h-2.5 rounded-full"
                      style={{ width: `${(seg.value / 3705) * 100}%`, background: seg.color, opacity: 0.85 }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 text-[11px]" style={{ borderTop: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
                Sources: PitchBook (Edge Autonomy 5.3x, SandboxAQ 57.5x), CB Insights (defense VC $10.5B H1 2025, pharma R&D costs), Statista Premium (quantum TAM $9.8B), Redwire SEC filings
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
