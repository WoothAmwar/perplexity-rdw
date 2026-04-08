const SOURCES = [
  {
    category: 'Premium Market Data',
    color: '#8B5CF6',
    sources: [
      {
        name: 'Statista Premium',
        url: 'https://www.statista.com',
        data: [
          'Quantum security market: ~$500M (2022) → $9.8B (2030) at 80% CAGR',
          'Global space economy: $630B (2023) → $1.8T (2035) at ~9% CAGR [McKinsey via Statista]',
          'Global drone market: $26.3B (2021) → $54.6B (2030) at ~8% CAGR',
          'SOFC market (APAC): $412M (2023) → $739M (2028) at 12% CAGR',
          'Space biopharmaceuticals: $5.82B (2025) → $9.41B (2029) at 12.8% CAGR',
          'Japan APAC SOFC market growth context',
        ],
      },
      {
        name: 'PitchBook',
        url: 'https://pitchbook.com',
        data: [
          'Edge Autonomy acquisition: ~$1.03B at 5.3x TTM revenue (prime SOTP multiple)',
          'SandboxAQ valuation: $5.75B at $450M Series E (April 2025) — 57.5x EV/Revenue',
          'VC investment in defense tech: $49.1B in 2025 (nearly 2x from $27.2B in 2024)',
          'Defense tech equity funding: $17.9B (up from $7.3B in 2024)',
          'VC exits in defense: $54.4B record in 2025',
        ],
      },
      {
        name: 'CB Insights',
        url: 'https://www.cbinsights.com',
        data: [
          'US defense tech VC investment: $10.5B in H1 2025 = 81% of global total',
          'Pharma R&D cost: $1–2B per drug asset development',
          'Failed clinical trials: >$45B/year in wasted R&D spending',
          'Defense technology market sizing and deal flow analysis',
        ],
      },
    ],
  },
  {
    category: 'Live Market Data',
    color: '#10B981',
    sources: [
      {
        name: 'Yahoo Finance',
        url: 'https://finance.yahoo.com/quote/RDW/',
        data: [
          'Live RDW price: $9.56 (April 8, 2026 intraday)',
          '52-Week Range: $4.87 – $22.25',
          'Market Cap: $1.83B (intraday)',
          'Analyst consensus: 5 Buy / 0 Hold / 1 Sell · $12.67 avg PT · $22.00 high PT',
          'Truist ↑ Buy, $15 PT (March 9, 2026)',
        ],
      },
    ],
  },
  {
    category: 'Company Filings & Management Commentary',
    color: 'var(--rdw-red)',
    sources: [
      {
        name: 'Redwire Corporation SEC Filings',
        url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=RDW',
        data: [
          'FY2025 Annual Report: Revenue $335.4M, Backlog $411.2M, Book-to-Bill 1.32x',
          'Q4 2025: First segment reporting — Space $54.5M, Defense Tech $54.3M',
          'Q4 2025 Book-to-Bill: 1.52x total (Space: 2.04x, Defense: 0.99x)',
          'Debt reduction: $213M → $88M; interest savings >$17M/year',
          'Total liquidity: $130.2M; credit facility refinanced SOFR+375, maturity May 2029',
          'Diluted shares outstanding: 165M',
          'EBITDA inflection expected: H2 2026 per management',
          'Gross margin ex-EAC: mid-20s% range (Q4 2025)',
          'iROSA: 7 of 8 deployed; station power 160 kW → 215 kW (+30%)',
          'MATTEO: Belgium\'s FIRST national security satellite, Redwire as prime contractor',
          'Ann Arbor facility: 85,000 sq ft, opened November 2025',
          'Edge Autonomy acquisition: 265,000+ sq ft manufacturing capacity',
        ],
      },
      {
        name: 'Redwire Investor Relations',
        url: 'https://ir.redwirespace.com',
        data: [
          'Guidance: FY2026E revenue $450–500M (midpoint $475M)',
          'PIL-BOX: 43 units flown, 35+ molecules studied, 84% crystal improvement rate',
          'Stalker XE fuel cell: 433 km (269 mi) range; 38.5 lb weight',
          'ELSA: Launched March 2026, first contract with Moog for national security application',
          'Revenue breakdown: ~2/3 production-stage contracts vs. 75% development in 2021',
        ],
      },
    ],
  },
  {
    category: 'Industry Research',
    color: '#0EA5E9',
    sources: [
      {
        name: 'Global Market Insights',
        url: 'https://www.gminsights.com',
        data: [
          'In-Space Manufacturing (ISM) TAM: $4.4B (2023) → $21.8B (2032) at 20% CAGR',
          'Space robotics market: $3B (2021) → $7B (2030) at ~10% CAGR',
          'Counter-UAS market: $1.6B (2021) → $6.4B (2031) at ~15% CAGR',
        ],
      },
      {
        name: 'The Quantum Insider',
        url: 'https://thequantuminsider.com',
        data: [
          'Q-Day timeline context: 2029–2030 projected horizon',
          'NIST post-quantum cryptography standards deadline context',
          'EuroQCI (European Quantum Communication Infrastructure) deployment timeline',
        ],
      },
      {
        name: 'DRONEII',
        url: 'https://droneii.com',
        data: [
          'Defense UAS market: $26.3B (2021) → $54.6B (2030)',
          'SOFC-powered UAS endurance advantage analysis',
          'NATO procurement trends for long-endurance UAS platforms',
        ],
      },
      {
        name: 'DrugPatentWatch',
        url: 'https://www.drugpatentwatch.com',
        data: [
          'Keytruda (pembrolizumab) patent cliff: 2028–2030 expiry range, $29.5B peak revenue',
          'Eliquis (apixaban) patent expiry: 2028, ~$12B peak revenue',
          'Stelara (ustekinumab) J&J: $10.8B peak revenue, LOE ongoing',
          'Trulicity (dulaglutide) Lilly: $7.1B, 2027 expiry',
          'Total patent cliff estimated at $200B+ through 2030 — driving urgency for novel formulations',
        ],
      },
      {
        name: 'Damodaran Online (NYU)',
        url: 'https://pages.stern.nyu.edu/~adamodar/',
        data: [
          'Equity Risk Premium used: 5.5% (Damodaran 2026 update)',
          'WACC build-up methodology and beta comparables for defense/space sector',
        ],
      },
    ],
  },
];

export default function SourcesPage() {
  return (
    <section id="sources" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        {/* flex-col layout */}
        <div className="section-layout-col">
          <div className="mb-10">
            <div className="section-eyebrow">Page 16 — Research Sources</div>
            <h2 className="section-title mb-4">
              Every Number.<br />
              <span className="text-gradient-red">Every Source.</span>
            </h2>
            <p className="section-subtitle max-w-3xl">
              All financial figures, market data, and valuation multiples in this pitch deck are sourced
              from premium data providers, company SEC filings, and institutional research.
              Numbers marked with [Statista], [PitchBook], or [CB Insights] throughout the deck refer to
              the citations listed below.
            </p>
          </div>

          {SOURCES.map((category) => (
            <div key={category.category} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ background: category.color }} />
                <h3 className="font-semibold text-[16px]" style={{ color: 'var(--text-primary)' }}>
                  {category.category}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {category.sources.map((source) => (
                  <div key={source.name} className="glass-card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                          {source.name}
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono hover:underline"
                          style={{ color: category.color }}
                        >
                          {source.url}
                        </a>
                      </div>
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0"
                        style={{ background: category.color }}
                      />
                    </div>
                    <ul className="space-y-1.5">
                      {source.data.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                          <span className="mt-0.5 flex-shrink-0" style={{ color: category.color }}>·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Disclaimer */}
          <div className="glass-card p-6 mt-4" style={{ borderLeft: '4px solid var(--rdw-red)' }}>
            <div className="text-[11px] font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--rdw-red)' }}>
              Important Disclosures
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              This equity research document is for <strong style={{ color: 'var(--text-secondary)' }}>institutional and informational use only</strong>.
              It does not constitute an offer to buy or sell securities. All opinions and estimates reflect conditions as of
              <strong style={{ color: 'var(--text-secondary)' }}> April 2026</strong> and are subject to change without notice.
              Live price data is fetched from Yahoo Finance and may be delayed. Past performance is not indicative of future results.
              All valuation models contain inherent assumptions and uncertainties. Investors should conduct their own due diligence
              before making investment decisions. Premium data from Statista, PitchBook, and CB Insights is used under
              institutional licensing agreements and is cited with appropriate attribution throughout this document.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
