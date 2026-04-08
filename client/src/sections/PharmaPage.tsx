import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import GlossaryTooltip from '../components/GlossaryTooltip';

interface Drug {
  id: string;
  name: string;
  company: string;
  revenue: number; // $B annual
  expiry: number; // year
  indication: string;
  rdwSolution: string;
  ivToSubQ: boolean;
}

const DRUGS: Drug[] = [
  // Corrected per memo (April 6 2026): Keytruda $29.5B, Stelara $10.8B, Trulicity added
  { id: 'keytruda', name: 'Keytruda', company: 'Merck', revenue: 29.5, expiry: 2028, indication: 'Cancer immunotherapy (PD-1 inhibitor)', rdwSolution: 'PIL-BOX growing purer pembrolizumab crystals — enables sub-Q formulation, cutting infusion center visits. Merck partnership active.', ivToSubQ: true },
  { id: 'eliquis', name: 'Eliquis', company: 'BMS/Pfizer', revenue: 11.8, expiry: 2028, indication: 'Blood thinner — prevents stroke/clots', rdwSolution: 'Crystal optimization enables once-weekly oral dosing vs current twice-daily.', ivToSubQ: false },
  { id: 'opdivo', name: 'Opdivo', company: 'BMS', revenue: 8.2, expiry: 2027, indication: 'Cancer immunotherapy (PD-1 inhibitor)', rdwSolution: 'Sub-Q formulation via microgravity crystallization — replaces 30-min IV infusion.', ivToSubQ: true },
  { id: 'stelara', name: 'Stelara', company: 'J&J', revenue: 10.8, expiry: 2025, indication: 'Autoimmune (Crohn\'s, psoriasis)', rdwSolution: 'LOE underway — biosimilar pressure drives urgent demand for new patentable crystal forms.', ivToSubQ: false },
  { id: 'trulicity', name: 'Trulicity', company: 'Eli Lilly', revenue: 7.1, expiry: 2027, indication: 'GLP-1 diabetes/obesity treatment', rdwSolution: 'Microgravity crystal improvement for subcutaneous GLP-1 biologics — pre-cliff positioning.', ivToSubQ: true },
  { id: 'eylea', name: 'Eylea', company: 'Regeneron', revenue: 6.3, expiry: 2027, indication: 'Macular degeneration eye injection', rdwSolution: 'Higher purity crystals extend dosing interval from monthly to quarterly.', ivToSubQ: false },
  { id: 'skyrizi', name: 'Skyrizi', company: 'AbbVie', revenue: 7.0, expiry: 2030, indication: 'Psoriasis (IL-23 inhibitor)', rdwSolution: 'Pre-patent cliff positioning — sub-Q self-injection vs IV infusion center.', ivToSubQ: true },
  { id: 'dupixent', name: 'Dupixent', company: 'Sanofi/Regeneron', revenue: 9.7, expiry: 2031, indication: 'Atopic dermatitis / asthma', rdwSolution: 'Growth frontier — pre-cliff positioning for biologic reformulation.', ivToSubQ: true },
];

const COLOR_BY_EXPIRY = (year: number) => {
  if (year <= 2026) return '#C0392B';
  if (year <= 2028) return '#D4A017';
  return '#1ABCB4';
};

export default function PharmaPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<Drug | null>(null);
  const [tooltip, setTooltip] = useState<{ drug: Drug | null; x: number; y: number; visible: boolean }>({
    drug: null, x: 0, y: 0, visible: false,
  });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const el = svgRef.current;
    if (!el) return;
    const W = el.clientWidth || 700;
    const H = 420;
    svg.attr('width', W).attr('height', H);

    // Voronoi treemap using d3 hierarchy + treemap layout
    const root = d3.hierarchy({ children: DRUGS })
      .sum((d: any) => d.revenue || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemap = d3.treemap<any>()
      .size([W, H])
      .paddingInner(3)
      .paddingOuter(4)
      .round(true);

    treemap(root);

    const cell = svg.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    cell.append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => COLOR_BY_EXPIRY(d.data.expiry) + '25')
      .attr('stroke', (d: any) => COLOR_BY_EXPIRY(d.data.expiry))
      .attr('stroke-width', 1.5)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d: any) => {
        d3.select(event.currentTarget).attr('fill', COLOR_BY_EXPIRY(d.data.expiry) + '50');
        setTooltip({ drug: d.data, x: event.clientX, y: event.clientY, visible: true });
      })
      .on('mousemove', (event) => {
        setTooltip((t) => ({ ...t, x: event.clientX, y: event.clientY }));
      })
      .on('mouseout', (event, d: any) => {
        d3.select(event.currentTarget).attr('fill', COLOR_BY_EXPIRY(d.data.expiry) + '25');
        setTooltip((t) => ({ ...t, visible: false }));
      })
      .on('click', (event, d: any) => {
        setSelected(d.data);
      });

    // Drug name
    cell.append('text')
      .attr('x', (d: any) => (d.x1 - d.x0) / 2)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2 - 6)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', (d: any) => Math.min(14, Math.max(9, (d.x1 - d.x0) / 8)))
      .attr('font-weight', '700')
      .attr('fill', (d: any) => COLOR_BY_EXPIRY(d.data.expiry))
      .attr('font-family', "'Space Grotesk', sans-serif")
      .text((d: any) => d.x1 - d.x0 > 60 ? d.data.name : '')
      .style('pointer-events', 'none');

    // Revenue label
    cell.append('text')
      .attr('x', (d: any) => (d.x1 - d.x0) / 2)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2 + 12)
      .attr('text-anchor', 'middle')
      .attr('font-size', (d: any) => Math.min(11, Math.max(8, (d.x1 - d.x0) / 10)))
      .attr('fill', '#8892A4')
      .attr('font-family', "'Space Mono', monospace")
      .text((d: any) => d.x1 - d.x0 > 80 ? `$${d.data.revenue}B` : '')
      .style('pointer-events', 'none');

    // Expiry badge
    cell.append('text')
      .attr('x', (d: any) => (d.x1 - d.x0) / 2)
      .attr('y', (d: any) => (d.y1 - d.y0) / 2 + 26)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('fill', (d: any) => COLOR_BY_EXPIRY(d.data.expiry))
      .attr('font-family', "'Space Mono', monospace")
      .text((d: any) => d.x1 - d.x0 > 90 ? `Exp ${d.data.expiry}` : '')
      .style('pointer-events', 'none');

    // IV→SubQ indicator
    cell.filter((d: any) => d.data.ivToSubQ && d.x1 - d.x0 > 100)
      .append('text')
      .attr('x', (d: any) => d.x1 - d.x0 - 8)
      .attr('y', 14)
      .attr('text-anchor', 'end')
      .attr('font-size', '10px')
      .attr('fill', '#1ABCB4')
      .text('IV→SubQ')
      .style('pointer-events', 'none');

  }, []);

  return (
    <section id="pharma" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8">
          <div className="section-eyebrow">Page 5 — Pharma Monopoly</div>
          <h2 className="section-title mb-4">
            The $400B Patent Cliff.<br />
            <span className="text-gradient-gold">RDW Is the Lifeboat.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            <GlossaryTooltip term="Patent Cliff" definition="When a blockbuster drug's patent expires, generic or biosimilar competitors flood the market and the drug's revenue drops 70–90% within 18 months. Pharma companies need new patentable formulations to protect revenue streams.">
              The patent cliff
            </GlossaryTooltip>{' '}
            is a $200–400B problem for Big Pharma between 2025–2030. Redwire's{' '}
            <GlossaryTooltip term="PIL-BOX (Pharmaceutical In-orbit Laboratory Box)" definition="A compact, automated laboratory the size of a microwave oven that sits inside the ISS. It grows drug crystals in microgravity — the absence of gravity allows crystals to form without sedimentation or convection, producing larger, more ordered structures impossible to grow on Earth.">
              PIL-BOX
            </GlossaryTooltip>{' '}
            system enables pharma companies to grow next-generation crystal formulations — creating new patents, new IP, and saving their revenue streams.
          </p>
        </div>

        {/* PIL-BOX explainer */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            {
              title: 'What is Microgravity Crystallization?',
              color: '#1ABCB4',
              body: 'On Earth, gravity causes crystals to settle and convection currents disrupt their growth. In the microgravity environment of the ISS, drug molecules self-assemble into near-perfect lattice structures — producing crystals that are larger, purer, and more uniform than any Earth-grown counterpart.',
            },
            {
              title: 'IV → Sub-Q: Why It Matters',
              color: '#D4A017',
              body: 'Drugs like Keytruda currently require hour-long IV infusions in a hospital (cost: $3,000–$5,000/visit). By reformulating them as subcutaneous (sub-Q) injections using purer crystals, patients self-inject at home in 5 minutes. This is worth $50,000/patient/year in cost savings and opens entirely new patents.',
            },
            {
              title: '43 Active PIL-BOX Trials',
              color: '#C0392B',
              body: 'As of Q1 2026, Redwire has completed 28 PIL-BOX units on orbit and is actively running 43 pharmaceutical crystallization trials across cardiovascular, diabetes, obesity, oncology, and autoimmune indications. Partnership with Merck (Keytruda) is the headline anchor.',
            },
          ].map((c) => (
            <div key={c.title} className="glass-card p-5 border-t-2" style={{ borderTopColor: c.color }}>
              <div className="font-semibold text-[14px] text-[#E8EDF5] mb-2">{c.title}</div>
              <p className="text-[12px] text-[#8892A4] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Voronoi Treemap */}
        <div className="section-eyebrow mb-3">Patent Cliff Treemap — Hover for RDW PIL-BOX Solution · Click for detail</div>
        <div className="flex gap-4 mb-3 text-[11px] font-mono flex-wrap">
          {[
            { label: '2025–2026 (Imminent)', color: '#C0392B' },
            { label: '2027–2028 (Near-term)', color: '#D4A017' },
            { label: '2029+ (Frontier)', color: '#1ABCB4' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
              <span className="text-[#5C6880]">{l.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="text-[#1ABCB4] text-[10px]">IV→SubQ</span>
            <span className="text-[#5C6880]">= RDW IV-to-SubQ opportunity</span>
          </div>
        </div>
        <div className="glass-card p-3 relative overflow-hidden">
          <svg ref={svgRef} className="w-full" style={{ height: 420 }} />
        </div>

        {/* Selected drug panel */}
        {selected && (
          <div
            className="mt-4 glass-card p-5 border-l-4 fade-in-up"
            style={{ borderLeftColor: COLOR_BY_EXPIRY(selected.expiry) }}
            data-testid="pharma-drug-detail"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-xl text-[#E8EDF5]">{selected.name}</span>
                <span className="ml-2 text-[#5C6880] text-sm">({selected.company})</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-[#5C6880] hover:text-[#E8EDF5] text-lg">×</button>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <div><span className="text-[#5C6880]">Revenue:</span> <span className="text-[#D4A017] font-mono font-bold">${selected.revenue}B/yr</span></div>
              <div><span className="text-[#5C6880]">Patent expiry:</span> <span style={{ color: COLOR_BY_EXPIRY(selected.expiry) }} className="font-mono font-bold">{selected.expiry}</span></div>
              <div><span className="text-[#5C6880]">Indication:</span> <span className="text-[#C8D0DC]">{selected.indication}</span></div>
              {selected.ivToSubQ && (
                <div className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#1ABCB420] border border-[#1ABCB4] text-[#1ABCB4]">
                  IV → Sub-Q Opportunity
                </div>
              )}
            </div>
            <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(212,160,23,0.08)' }}>
              <div className="text-[11px] text-[#D4A017] font-mono tracking-wider uppercase mb-1">RDW PIL-BOX Solution</div>
              <p className="text-[13px] text-[#C8D0DC] leading-relaxed">{selected.rdwSolution}</p>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {tooltip.visible && tooltip.drug && (
          <div
            style={{
              position: 'fixed',
              left: tooltip.x + 14,
              top: tooltip.y - 10,
              zIndex: 9999,
              background: 'rgba(13,17,23,0.97)',
              border: `1px solid ${COLOR_BY_EXPIRY(tooltip.drug.expiry)}`,
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 12,
              maxWidth: 280,
              color: '#E8EDF5',
              pointerEvents: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
            }}
          >
            <div className="font-bold text-sm mb-1" style={{ color: COLOR_BY_EXPIRY(tooltip.drug.expiry) }}>
              {tooltip.drug.name} — {tooltip.drug.company}
            </div>
            <div className="text-[#8892A4] mb-2">{tooltip.drug.indication}</div>
            <div className="font-semibold text-[#D4A017] text-[11px] uppercase tracking-wide mb-1">PIL-BOX Solution:</div>
            <div className="text-[#C8D0DC] text-[12px] leading-relaxed">{tooltip.drug.rdwSolution}</div>
          </div>
        )}
      </div>
    </section>
  );
}
