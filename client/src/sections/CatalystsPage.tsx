import GlossaryTooltip from '../components/GlossaryTooltip';

const CATALYSTS = [
  {
    period: 'Q1 2026',
    timing: 'Complete',
    event: 'Debt Refinancing Close',
    type: 'financial',
    impact: 'High',
    desc: '$90M term loan + $30M revolver extended to 2029. Eliminates near-term refinancing overhang. Reduces annual interest by ~$7M immediately.',
    color: '#4CAF50',
  },
  {
    period: 'Q2 2026',
    timing: 'Imminent',
    event: 'FY2025 Full Year Earnings / 2026 Guidance Raise',
    type: 'financial',
    impact: 'High',
    desc: '$450–500M revenue guidance confirmed. First positive institutional catalyst — EBITDA trajectory becomes clear. Potential for consensus EPS upgrade cycle.',
    color: '#D4A017',
  },
  {
    period: 'Q2 2026',
    timing: 'Imminent',
    event: 'DoD SOFC Production Contract Award',
    type: 'defense',
    impact: 'Very High',
    desc: 'Edge Autonomy transitioning from SOFC development to volume production. First DoD production-scale contract will trigger substantial backlog addition and defense gross margin step-up.',
    color: '#C0392B',
  },
  {
    period: 'Q2–Q3 2026',
    timing: 'Near-term',
    event: 'PIL-BOX Commercial Licensing Deal (Pharma Partner)',
    type: 'pharma',
    impact: 'Transformative',
    desc: 'A commercial licensing agreement with Merck or similar partner for a PIL-BOX-derived formulation would demonstrate the revenue model and likely re-rate the entire pharma segment. 43 active trials → one success = proof of concept.',
    color: '#1ABCB4',
  },
  {
    period: 'H2 2026',
    timing: 'Near-term',
    event: 'Hammerhead QKD Satellite Integration Milestone',
    type: 'quantum',
    impact: 'High',
    desc: 'Technical integration completion and launch manifesting confirms EuroQCI delivery timeline. Major step toward EU sovereign quantum communication contract execution.',
    color: '#8B5CF6',
  },
  {
    period: 'H2 2026',
    timing: 'Near-term',
    event: 'Q3 2026 Earnings — EBITDA Trajectory Confirmation',
    type: 'financial',
    impact: 'High',
    desc: 'First quarter showing meaningful EBITDA margin improvement from the FY25 trough. Target: Adj. EBITDA loss narrows to sub-$10M. Signals FY2027 break-even on track.',
    color: '#D4A017',
  },
  {
    period: 'H2 2026 – H1 2027',
    timing: 'Medium-term',
    event: 'Commercial Space Station Contract Awards (Axiom/Vast)',
    type: 'space',
    impact: 'Very High',
    desc: 'As Axiom Station and Vast Haven enter construction phase, RDW is the primary candidate for solar arrays, deployable structures, and in-space manufacturing. Could add $200–400M to backlog.',
    color: '#D4A017',
  },
  {
    period: 'FY2027',
    timing: 'Medium-term',
    event: 'EBITDA Inflection (H2 2026 — Management Guidance)',
    type: 'financial',
    impact: 'Re-rating',
    desc: 'Crossing positive Adjusted EBITDA expands the institutional buyer universe from ~40 to 150+ funds. This is the single most powerful catalyst for multiple expansion and the core thesis.',
    color: '#4CAF50',
  },
];

const RISKS = [
  {
    risk: 'Revenue Execution Risk',
    severity: 'Medium',
    mitigant: '$411.2M contracted backlog + 1.32x book-to-bill provides substantial visibility. 80%+ of FY2026 revenue is already under contract. FY2026 guidance of $450–500M is well-supported by signed awards.',
    prob: '20%',
  },
  {
    risk: 'EBITDA Margin Delay',
    severity: 'Medium',
    mitigant: 'Even if margins lag by 2 quarters, FCF break-even 2027 still holds. Debt covenants extend to 2029 — no liquidity cliff. Bear case still implies 20%+ upside.',
    prob: '25%',
  },
  {
    risk: 'Defense Budget Cuts (CR / Sequester)',
    severity: 'Medium',
    mitigant: 'SOFC/Stalker programs are in the special operations and ISR budget — historically among the last cut. DoD maintains CJADC2 / UAS priorities. EuroQCI is not US defense-dependent.',
    prob: '15%',
  },
  {
    risk: 'PIL-BOX Commercial Failure',
    severity: 'Low-Medium',
    mitigant: 'PIL-BOX is upside optionality, not the base case. Our DCF assigns $0 pharma revenue — failure doesn\'t impair the core $16.00 target. Any success is pure additive upside.',
    prob: '35%',
  },
  {
    risk: 'Key Person / Management Risk',
    severity: 'Low',
    mitigant: 'CEO Peter Cannito has stabilized the business from the legacy merger overhang. Board oversight has been strengthened. Management compensation tied to FCF milestones.',
    prob: '10%',
  },
  {
    risk: 'Dilutive Equity Raise',
    severity: 'Medium',
    mitigant: 'Debt refinancing through 2029 removes near-term need for equity. At $450M+ revenue with improving FCF, incremental equity unlikely unless transformative M&A occurs.',
    prob: '20%',
  },
];

const IMPACT_COLORS: Record<string, string> = {
  High: '#D4A017',
  'Very High': '#1ABCB4',
  Transformative: '#4CAF50',
  'Re-rating': '#D4A017',
};

const TYPE_COLORS: Record<string, string> = {
  financial: '#D4A017',
  defense: '#C0392B',
  pharma: '#1ABCB4',
  quantum: '#8B5CF6',
  space: '#D4A017',
};

const SEV_COLORS: Record<string, string> = {
  'Low': '#4CAF50',
  'Low-Medium': '#1ABCB4',
  'Medium': '#D4A017',
  'High': '#C0392B',
};

export default function CatalystsPage() {
  return (
    <section id="catalysts" className="page-section" style={{ paddingBottom: 120 }}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 15 — Catalysts & Risk Matrix</div>
          <h2 className="section-title mb-4">
            Eight Catalysts. FY2026–2027.<br />
            <span className="text-gradient-gold">Each One a Re-Rating Event.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            Unlike most undervalued situations that depend on market sentiment shifting, RDW has eight discrete, independently verifiable catalysts over the next 18 months — any one of which could close a meaningful portion of the 67% gap to our $16 price target.
          </p>
        </div>

        {/* Catalysts timeline */}
        <div className="section-eyebrow mb-4">H1/H2 2026 Catalyst Timeline</div>
        <div className="catalyst-line pl-12 space-y-0 mb-12">
          {CATALYSTS.map((cat, i) => (
            <div key={i} className="relative flex gap-4 pb-6" data-testid={`catalyst-${i}`}>
              <div
                className="absolute left-[-32px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{ borderColor: cat.color, background: cat.color + '20', color: cat.color }}
              >
                {i + 1}
              </div>
              <div className="flex-1 glass-card glass-card-hover p-4">
                <div className="flex flex-wrap gap-3 items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-[14px] text-[#E8EDF5]">{cat.event}</div>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: cat.color + '20', color: cat.color, border: `1px solid ${cat.color}40` }}
                      >
                        {cat.period}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: TYPE_COLORS[cat.type] + '15', color: TYPE_COLORS[cat.type], border: `1px solid ${TYPE_COLORS[cat.type]}30` }}
                      >
                        {cat.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#5C6880]">Impact:</span>
                    <span
                      className="font-bold text-[12px]"
                      style={{ color: IMPACT_COLORS[cat.impact] || '#D4A017' }}
                    >
                      {cat.impact}
                    </span>
                  </div>
                </div>
                <p className="text-[12px] text-[#8892A4] leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Risk matrix */}
        <div className="section-eyebrow mb-4">Risk / Mitigant Matrix</div>
        <div className="overflow-x-auto rounded-xl border border-[#1E2A3A] mb-10">
          <table className="data-table w-full" data-testid="risk-matrix">
            <thead>
              <tr>
                <th className="text-left">Risk</th>
                <th className="text-center">Severity</th>
                <th className="text-center">Probability</th>
                <th className="text-left">Mitigant</th>
              </tr>
            </thead>
            <tbody>
              {RISKS.map((r) => (
                <tr key={r.risk}>
                  <td className="font-semibold text-[#E8EDF5] max-w-[160px]">{r.risk}</td>
                  <td className="text-center">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: SEV_COLORS[r.severity] + '20', color: SEV_COLORS[r.severity] }}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="text-center font-mono text-[#5C6880] text-[12px]">{r.prob}</td>
                  <td className="text-[12px] text-[#8892A4] leading-relaxed max-w-[400px]">{r.mitigant}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Final recommendation card */}
        <div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.1), rgba(26,188,180,0.05), rgba(192,57,43,0.05))', border: '1px solid rgba(212,160,23,0.5)' }}
        >
          {/* BG orbit */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] border border-[#D4A017]/5 rounded-full" style={{ animation: 'spin 50s linear infinite' }} />
          </div>

          <div className="relative z-10">
            <div className="text-[11px] font-mono text-[#D4A017] tracking-widest uppercase mb-4">Final Recommendation</div>
            <div className="flex justify-center gap-4 flex-wrap mb-6">
              <span className="badge-buy text-sm">Strong Buy</span>
              <span className="badge-target text-sm">$16.00 PT</span>
              <span className="px-4 py-1 rounded-full text-[12px] font-semibold border border-[#1E2A3A] text-[#5C6880]">
                SOTP: $18.01
              </span>
            </div>
            <div className="text-5xl font-black font-mono text-gradient-gold mb-2">+67% Upside</div>
            <p className="text-[14px] text-[#8892A4] max-w-2xl mx-auto leading-relaxed mt-4">
              Redwire Corporation is a rare convergence play: a{' '}
              <GlossaryTooltip term="Space Infrastructure Monopoly" definition="Redwire is one of only two global manufacturers of roll-out solar arrays proven for crewed space stations, while also being the sole operational provider of pharmaceutical crystallization services from the ISS.">
                space infrastructure monopoly
              </GlossaryTooltip>{' '}
              with pharmaceutical patent-cliff optionality, quantum-security first-mover positioning, and a vertically integrated defense platform — all at a 65% discount to peer multiples. The eight catalysts above provide a roadmap for value recognition. We initiate with a Strong Buy and $16.00 price target.
            </p>
            <div className="mt-6 text-[10px] text-[#3A4A5C] font-mono">
              This research is for institutional investor informational purposes only. Not investment advice. All estimates are our own. April 2026.
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
