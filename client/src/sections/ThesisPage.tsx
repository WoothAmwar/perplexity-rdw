import GlossaryTooltip from '../components/GlossaryTooltip';

const pillars = [
  {
    number: '01',
    title: 'Space Infrastructure Monopoly',
    color: '#D4A017',
    icon: '🛰',
    headline: '$411.2M Contracted Backlog',
    body: 'Redwire is one of only two companies in the world capable of manufacturing Roll-Out Solar Arrays (ROSA) at scale for crewed space stations. 7 of 8 iROSA arrays have been installed on the ISS, boosting station power from 160 kW to 215 kW (+30%). ELSA launched March 2026 — Moog contract validates commercial pivot. MATTEO is Belgium\'s first national security satellite, with Redwire as prime contractor.',
    stat: '1.52x Q4 2025',
    statLabel: 'FY2025',
  },
  {
    number: '02',
    title: 'Pharma Manufacturing in Microgravity',
    color: '#1ABCB4',
    icon: '🧬',
    headline: '43 PIL-BOX Trials',
    body: 'Redwire\'s PIL-BOX system exploits microgravity to grow pharmaceutical crystals with an 84% improvement rate. This transforms drugs like Keytruda ($29.5B peak revenue) from IV infusions into sub-Q injections. 43 units flown, 35+ molecules studied, BMS/Purdue/Butler partnerships active. With >$45B/year in failed trials [CB Insights] and $1–2B/drug development costs, the demand for novel formulations is structural.',
    stat: '$29.5B',
    statLabel: 'Keytruda Peak Rev',
  },
  {
    number: '03',
    title: 'Vertical Defense Integration',
    color: '#C0392B',
    icon: '⚡',
    headline: 'Edge Autonomy Acquisition',
    body: 'Via Edge Autonomy, RDW owns the full stack: its own SOFC power stack, the Stalker XE (433 km range, 38.5 lb), and ISR software. 85,000 sq ft Ann Arbor facility opened November 2025. 200 aircraft deployed in 2025 to US SOF, NATO allies, and Ukraine. Competitors AVAV and KTOS outsource power — RDW controls margins end-to-end. $10.5B US defense-tech VC in H1 2025 [CB Insights] validates the macro.',
    stat: '433 km',
    statLabel: 'Stalker Range (fuel cell)',
  },
  {
    number: '04',
    title: 'Quantum Security First-Mover',
    color: '#8B5CF6',
    icon: '🔐',
    headline: 'Hammerhead + EuroQCI',
    body: 'NIST finalized post-quantum cryptography standards in 2024. Q-Day — when quantum computers crack RSA encryption — is consensus-estimated at 2029. Redwire\'s Hammerhead satellite and EuroQCI contract lock in the physical quantum-key distribution infrastructure before the deadline. This is a winner-take-all positioning moment.',
    stat: '$9.8B',
    statLabel: 'Quantum TAM by 2030 [Statista]',
  },
];

export default function ThesisPage() {
  return (
    <section id="thesis" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <div className="section-eyebrow">Investment Thesis</div>
          <h2 className="section-title mb-4">
            Four Structural Moats.<br />
            <span className="text-gradient-red">One Radical Mismatch.</span>
          </h2>
          <p className="section-subtitle max-w-2xl">
            RDW sits at the intersection of four secular tailwinds — each independently worth a premium multiple. The market has priced none of them. Current price implies terminal decline; our work implies a $16 target.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div
              key={p.number}
              className="glass-card glass-card-hover p-6 relative overflow-hidden"
              data-testid={`thesis-pillar-${p.number}`}
            >
              {/* Background number */}
              <div
                className="absolute right-4 top-2 text-[80px] font-black opacity-5 font-mono leading-none select-none"
                style={{ color: p.color }}
              >
                {p.number}
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${p.color}20`, border: `1px solid ${p.color}40` }}
                >
                  {p.icon}
                </div>
                <div>
                  <div
                    className="text-[11px] font-mono tracking-widest uppercase mb-1"
                    style={{ color: p.color }}
                  >
                    Pillar {p.number}
                  </div>
                  <h3 className="text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                </div>
              </div>

              <div
                className="text-sm font-semibold mb-3 px-3 py-1.5 rounded-md inline-block"
                style={{ background: `${p.color}15`, color: p.color }}
              >
                {p.headline}
              </div>

              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{p.body}</p>

              <div className="flex items-end gap-2 pt-3 border-t border-[var(--card-border)]">
                <span className="text-2xl font-bold font-mono" style={{ color: p.color }}>
                  {p.stat}
                </span>
                <span className="text-[11px] mb-1" style={{ color: "var(--text-muted)" }}>{p.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom thesis statement */}
        <div className="mt-10 glass-card p-6 border-l-4 border-[#D4A017]">
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <span className="text-[#D4A017] font-semibold">Bear thesis rebuttal:</span> Critics cite FY2025 Adjusted EBITDA of –$50.3M and net loss of –$226.6M. We model this as a{' '}
            <GlossaryTooltip term="EBITDA Inflection" definition="The point where a company's earnings before interest, taxes, depreciation, and amortization cross from negative to positive — a binary re-rating event for growth companies.">
              classic pre-revenue-ramp trough
            </GlossaryTooltip>
            {' '}— the losses are driven by non-cash items and development-stage contract costs, not structural impairment. With $450–500M revenue guided for FY2026 and defense production revenues ramping, we project EBITDA margin reaching +9% by FY2028E, implying $40M+ run-rate EBITDA — the exact threshold where institutional ownership typically re-enters.
          </p>
        </div>
      </div>
    </section>
  );
}
