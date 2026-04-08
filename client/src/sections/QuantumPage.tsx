import GlossaryTooltip from '../components/GlossaryTooltip';

const comparison = [
  {
    category: 'Approach',
    rdw: 'Hardware QKD — physical photon-based keys distributed via satellite',
    sandbox: 'Post-quantum algorithms — software-only encryption upgrade',
  },
  {
    category: 'Q-Day Resilience',
    rdw: 'Immune by physics — quantum keys cannot be intercepted without detection',
    sandbox: 'Dependent on algorithm hardness assumptions — may require re-keying if new attacks emerge',
  },
  {
    category: 'Contract Base',
    rdw: 'EuroQCI (EU government), Hammerhead DoD satellite, NATO-adjacent customers',
    sandbox: 'Enterprise software licenses, Google partnerships — no sovereign infra lock-in',
  },
  {
    category: 'Lock-in Depth',
    rdw: 'Physical satellite infrastructure — multi-decade replacement cycle',
    sandbox: 'Software — can be replaced by next-gen algorithm in 12-18 months',
  },
  {
    category: 'Revenue Model',
    rdw: 'Hardware + long-term operations contracts (10–20 yr lifespan)',
    sandbox: 'SaaS subscription — churn risk higher',
  },
  {
    category: 'Readiness',
    rdw: 'Hammerhead in development for 2026-2027 launch; EuroQCI infra building now',
    sandbox: 'Products generally available — but pre-Q-Day urgency muted',
  },
];

const timeline = [
  { year: '2022', event: 'NIST selects CRYSTALS-Kyber as post-quantum standard', type: 'global' },
  { year: '2023', event: 'IBM unveils 1,000+ qubit processor; consensus Q-Day window narrows', type: 'global' },
  { year: '2024', event: 'NIST finalizes PQC standards. Redwire wins EuroQCI satellite contract', type: 'rdw' },
  { year: '2025', event: 'NSA mandates quantum-resistant algorithms for classified systems by 2030', type: 'global' },
  { year: '2026E', event: 'Hammerhead QKD satellite integration completes. RDW DoD deployment begins', type: 'rdw' },
  { year: '2027E', event: 'EuroQCI ground segments operational. First sovereign quantum keys transmitted', type: 'rdw' },
  { year: '2029E', event: 'Q-Day consensus estimate — cryptographically relevant quantum computer achieved', type: 'risk' },
  { year: '2030', event: 'NIST deadline: all federal systems must use post-quantum cryptography', type: 'risk' },
];

export default function QuantumPage() {
  return (
    <section id="quantum" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 4 — Quantum Security</div>
          <h2 className="section-title mb-4">
            The Quantum Race.<br />
            <span className="text-gradient-gold">RDW vs. The Software Approach.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            <GlossaryTooltip term="Q-Day" definition="The theoretical date when quantum computers become powerful enough to break RSA and ECC encryption — the cryptographic backbone of the global internet, banking, and military communications. Consensus estimate: 2029.">
              Q-Day
            </GlossaryTooltip>{' '}
            is consensus-estimated at 2029. NIST's 2030 migration deadline is locked. The question is who owns the physical infrastructure when the switch flips — and Redwire is building it now.
          </p>
        </div>

        {/* Urgency banner */}
        <div
          className="rounded-xl p-4 mb-8 flex flex-wrap gap-6 items-center justify-between"
          style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.35)' }}
        >
          <div>
            <div className="text-[11px] font-mono text-[#C0392B] tracking-widest uppercase mb-1">⚠ Urgency Signal</div>
            <div className="text-[17px] font-bold" style={{ color: "var(--text-primary)" }}>
              "Harvest Now, Decrypt Later" attacks are already happening
            </div>
            <p className="text-[13px] mt-1" style={{ color: "var(--text-secondary)" }}>
              Nation-state actors are capturing encrypted data today to decrypt it post-Q-Day. Every month without quantum-secure infrastructure is a solvable problem building in the background.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black font-mono text-[#C0392B]">2029</div>
            <div className="text-[11px] tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Q-Day Estimate</div>
          </div>
        </div>

        {/* RDW vs SandboxAQ comparison */}
        <div className="mb-10">
          <div className="section-eyebrow mb-4">Competitive Landscape: RDW vs. SandboxAQ</div>
          <div className="overflow-x-auto rounded-xl border border-[#1E2A3A]">
            <table className="data-table w-full" data-testid="quantum-comparison">
              <thead>
                <tr>
                  <th className="text-left">Category</th>
                  <th className="text-left" style={{ color: '#D4A017' }}>Redwire (RDW) — Hardware QKD</th>
                  <th className="text-left" style={{ color: 'var(--text-muted)' }}>SandboxAQ — Software PQC</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.category}>
                    <td className="font-semibold text-[12px] uppercase tracking-wide" style={{ color: "var(--text-primary)" }}>{row.category}</td>
                    <td className="" style={{ color: "var(--text-secondary)" }}>{row.rdw}</td>
                    <td className="" style={{ color: "var(--text-muted)" }}>{row.sandbox}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline */}
        <div className="section-eyebrow mb-4">Quantum Threat Timeline</div>
        <div className="catalyst-line pl-12 space-y-0">
          {timeline.map((t, i) => (
            <div key={i} className="relative flex gap-4 pb-5">
              <div
                className="absolute left-[-32px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                style={{
                  borderColor: t.type === 'rdw' ? '#D4A017' : t.type === 'risk' ? '#C0392B' : '#1ABCB4',
                  background: t.type === 'rdw' ? '#D4A01720' : t.type === 'risk' ? '#C0392B20' : '#1ABCB420',
                  color: t.type === 'rdw' ? '#D4A017' : t.type === 'risk' ? '#C0392B' : '#1ABCB4',
                }}
              >
                {t.type === 'rdw' ? '▲' : t.type === 'risk' ? '!' : '●'}
              </div>
              <div className="flex-1">
                <div className="flex gap-3 items-baseline">
                  <span
                    className="text-[11px] font-mono font-bold"
                    style={{ color: t.type === 'rdw' ? '#D4A017' : t.type === 'risk' ? '#C0392B' : '#1ABCB4' }}
                  >
                    {t.year}
                  </span>
                  <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{t.event}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why it matters */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Hammerhead Satellite',
              desc: 'QKD-enabled satellite platform. Distributes encryption keys as individual photons — physically impossible to intercept without destroying them. Currently under contract for DoD deployment.',
              color: '#8B5CF6',
            },
            {
              title: 'EuroQCI Network',
              desc: 'European Quantum Communication Infrastructure. RDW building the satellite backbone. Multi-decade government contract with EU sovereign states. First nodes operational 2027.',
              color: '#D4A017',
            },
            {
              title: 'Why Hardware Wins',
              desc: 'Post-quantum software (SandboxAQ\'s approach) protects against known attacks but can be deprecated if new quantum algorithms emerge. Physical QKD is provably secure by the laws of quantum mechanics.',
              color: '#1ABCB4',
            },
          ].map((c) => (
            <div key={c.title} className="glass-card p-5 border-t-2" style={{ borderTopColor: c.color }}>
              <div className="font-semibold text-[14px] mb-2" style={{ color: "var(--text-primary)" }}>{c.title}</div>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
