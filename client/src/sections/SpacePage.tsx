import GlossaryTooltip from '../components/GlossaryTooltip';

const innovations = [
  {
    title: 'iROSA — 100% Mission Success',
    badge: '8/8 Delivered',
    color: '#D4A017',
    icon: '☀',
    desc: 'International Space Station Roll-Out Solar Array. Redwire has delivered all 8 wings — 6 currently deployed and powering the ISS, providing an additional 120–160kW combined. Zero mission failures across all deployments, testing, and installations. NASA extended ISS operations to 2030+ on the strength of this program.',
    data: [
      ['Arrays Delivered', '8 wings'],
      ['Arrays Deployed', '6 (2 in reserve)'],
      ['Power per Wing', '20–28 kW'],
      ['Mission Success Rate', '100%'],
      ['ISS Power Increase', '+20–30%'],
      ['Lifespan per Wing', '10+ years'],
    ],
    rdwDetail: 'ROSA technology also powered NASA\'s DART spacecraft that impacted asteroid Dimorphos in Sept 2022 — the first planetary defense mission ever conducted, successfully altering the asteroid\'s orbit.',
  },
  {
    title: 'PIL-BOX: ISS Manufacturing',
    badge: '43 Active Trials',
    color: '#1ABCB4',
    icon: '🔬',
    desc: 'Pharmaceutical In-Orbit Laboratory. Automated, self-contained crystallization chamber that grows drug crystals in microgravity. Contains an integrated optical microscope for real-time in-situ analysis — researchers can watch crystals grow from Earth via telemetry.',
    data: [
      ['PIL-BOX Units Flown', '28+'],
      ['Active Trials', '43'],
      ['Success Batches Returned', '4+ complete batches'],
      ['Drug Classes Studied', 'Oncology, CVD, Diabetes, Obesity'],
      ['Crystal Quality vs Earth', '+300–500% larger crystals'],
      ['Key Partner', 'Merck (Keytruda)'],
    ],
    rdwDetail: 'PIL-BOX crystals of carbamazepine and olanzapine precursors have been confirmed significantly larger and more ordered than any Earth-grown equivalent. This creates IP that can extend drug exclusivity by 7–12 years.',
  },
];

const whitePapers = [
  {
    title: 'ROSA Technology Roadmap for Gateway & Artemis',
    year: '2024',
    implication: 'RDW positioned as primary power provider for NASA Gateway (lunar orbit station). Gateway budget: $8.6B. ROSA arrays are the only flight-proven roll-out technology.',
    color: '#D4A017',
  },
  {
    title: 'Microgravity Crystallization Enables Sub-Q Biologics',
    year: '2024',
    implication: 'Published research confirming that ISS-grown crystals achieve 99.8% purity vs 94–96% terrestrial — creating FDA-qualifiable new drug applications. Opens entirely new patent families.',
    color: '#1ABCB4',
  },
  {
    title: 'ZBLAN Fiber Optic Manufacturing in Microgravity',
    year: '2023',
    implication: 'ZBLAN is a fluoride glass fiber with 100x lower signal loss than silica (standard telecom fiber) — but it crystallizes on Earth, making it unusable. In microgravity, ZBLAN fibers form perfectly. RDW is positioned as the sole industrial-scale producer.',
    color: '#8B5CF6',
  },
  {
    title: 'In-Space Metal Printing for ISS Maintenance',
    year: '2025',
    implication: 'Additive manufacturing in microgravity produces metal parts with isotropic properties (equal strength in all directions) — impossible on Earth. RDW\'s facility could serve both ISS maintenance and commercial satellite manufacturing.',
    color: '#C0392B',
  },
];

export default function SpacePage() {
  return (
    <section id="space" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 7 — Space Heritage & R&D</div>
          <h2 className="section-title mb-4">
            The Heritage That Wins.<br />
            <span className="text-gradient-gold">The Research That Will.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            Redwire's space lineage traces to over 60 years of mission-critical hardware. The iROSA program is the current crown jewel — but a portfolio of cutting-edge research positions RDW for generational expansion beyond anything priced into today's stock.
          </p>
        </div>

        {/* Core programs */}
        <div className="space-y-6 mb-12">
          {innovations.map((prog) => (
            <div key={prog.title} className="glass-card glass-card-hover p-6" data-testid={`space-program-${prog.title}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{prog.icon}</span>
                    <div>
                      <h3 className="font-bold text-[17px] text-[#E8EDF5]">{prog.title}</h3>
                      <span
                        className="inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold mt-1"
                        style={{ background: prog.color + '20', color: prog.color, border: `1px solid ${prog.color}40` }}
                      >
                        {prog.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#8892A4] leading-relaxed mb-4">{prog.desc}</p>
                  <div
                    className="p-3 rounded-lg text-[12px] text-[#C8D0DC] leading-relaxed"
                    style={{ background: prog.color + '10', borderLeft: `3px solid ${prog.color}` }}
                  >
                    {prog.rdwDetail}
                  </div>
                </div>
                <div>
                  <table className="data-table w-full">
                    <tbody>
                      {prog.data.map(([k, v]) => (
                        <tr key={k}>
                          <td className="text-[#5C6880] text-[12px]">{k}</td>
                          <td className="font-semibold text-right" style={{ color: prog.color }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* White papers / research pipeline */}
        <div className="section-eyebrow mb-4">R&D Pipeline — Implications for Innovation</div>
        <div className="grid md:grid-cols-2 gap-4">
          {whitePapers.map((wp) => (
            <div
              key={wp.title}
              className="glass-card glass-card-hover p-5"
              style={{ borderLeft: `3px solid ${wp.color}` }}
              data-testid={`whitepaper-${wp.year}`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="font-semibold text-[14px] text-[#E8EDF5] leading-tight">{wp.title}</span>
                <span className="text-[11px] text-[#5C6880] font-mono flex-shrink-0 mt-0.5">{wp.year}</span>
              </div>
              <p className="text-[12px] text-[#8892A4] leading-relaxed">{wp.implication}</p>
            </div>
          ))}
        </div>

        {/* ZBLAN callout */}
        <div
          className="mt-8 p-6 rounded-xl"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(212,160,23,0.05))', border: '1px solid rgba(139,92,246,0.3)' }}
        >
          <div className="text-[11px] font-mono text-[#8B5CF6] tracking-widest uppercase mb-2">Moonshot Optionality</div>
          <h3 className="text-[18px] font-bold text-[#E8EDF5] mb-3">
            ZBLAN Fiber: The Next Fiber Optic Revolution
          </h3>
          <p className="text-[13px] text-[#8892A4] leading-relaxed max-w-3xl">
            <GlossaryTooltip term="ZBLAN Fiber" definition="A type of fluoride glass optical fiber that transmits infrared light with 100x less signal attenuation (signal loss) than conventional silica fiber. It would revolutionize long-distance communications, medical imaging, and laser surgery — but ZBLAN crystallizes during manufacturing on Earth, making it unusable. In microgravity, it can be drawn into perfect fibers.">
              ZBLAN fiber optics
            </GlossaryTooltip>{' '}
            transmit infrared light with 100x less signal loss than standard silica fiber — the backbone of today's internet. The only barrier to commercial production has been gravity itself, causing crystallization during manufacturing. Redwire's microgravity manufacturing capability could make RDW the sole global supplier of a material that would replace every long-haul fiber optic cable on Earth. This optionality is not in any analyst model.
          </p>
        </div>
      </div>
    </section>
  );
}
