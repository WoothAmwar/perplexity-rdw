import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import GlossaryTooltip from '../components/GlossaryTooltip';
import { useTheme } from '../App';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const EBITDA_DATA = [
  { year: 'FY23', revenue: 234, ebitda: -38, margin: -16.2, actual: true },
  { year: 'FY24', revenue: 304, ebitda: -44, margin: -14.5, actual: true },
  { year: 'FY25', revenue: 335, ebitda: -50, margin: -14.9, actual: true },
  { year: 'FY26E', revenue: 475, ebitda: -18, margin: -3.8, actual: false },
  { year: 'FY27E', revenue: 600, ebitda: 18, margin: 3.0, actual: false },
  { year: 'FY28E', revenue: 710, ebitda: 64, margin: 9.0, actual: false },
];

const chartData = {
  labels: EBITDA_DATA.map((d) => d.year),
  datasets: [
    {
      label: 'Adj. EBITDA Margin (%)',
      data: EBITDA_DATA.map((d) => d.margin),
      borderColor: '#D4A017',
      backgroundColor: (ctx: any) => {
        const canvas = ctx.chart.ctx;
        const gradient = canvas.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(212,160,23,0.25)');
        gradient.addColorStop(0.5, 'rgba(212,160,23,0.05)');
        gradient.addColorStop(1, 'rgba(212,160,23,0)');
        return gradient;
      },
      fill: true,
      borderWidth: 2.5,
      pointRadius: EBITDA_DATA.map((d) => d.actual ? 5 : 7),
      pointStyle: EBITDA_DATA.map((d) => d.actual ? 'circle' : 'triangle'),
      pointBackgroundColor: EBITDA_DATA.map((d) => d.actual ? '#D4A017' : '#1ABCB4'),
      pointBorderColor: '#070B14',
      pointBorderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Adj. EBITDA ($M)',
      data: EBITDA_DATA.map((d) => d.ebitda),
      borderColor: '#1ABCB4',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderDash: [5, 3],
      pointRadius: 3,
      pointBackgroundColor: '#1ABCB4',
      tension: 0.4,
      yAxisID: 'y2',
    },
  ],
};

// chartOptions built inside component — see EbitdaPage()
const buildChartOptions = (dark: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#8892A4', font: { family: "'Space Grotesk'", size: 12 } },
    },
    tooltip: {
      backgroundColor: dark ? '#111827' : '#FFFFFF',
      borderColor: '#D4A017',
      borderWidth: 1,
      titleColor: '#D4A017',
      bodyColor: dark ? '#9BA8BB' : '#1F2937',
      callbacks: {
        label: (item: any) => {
          if (item.datasetIndex === 0) return ` Margin: ${item.raw.toFixed(1)}%`;
          return ` EBITDA: $${item.raw}M`;
        },
      },
    },
    // Zero line annotation
    annotation: {
      annotations: {
        zeroline: {
          type: 'line',
          yMin: 0,
          yMax: 0,
          borderColor: '#4CAF5080',
          borderWidth: 1.5,
          borderDash: [6, 4],
          label: {
            display: true,
            content: 'Break-even',
            color: '#4CAF50',
            font: { size: 10 },
          },
        },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#5C6880', font: { family: "'Space Mono'", size: 11 } },
      grid: { color: '#1A2030' },
    },
    y: {
      ticks: { color: '#5C6880', font: { family: "'Space Mono'", size: 11 }, callback: (v: any) => `${v}%` },
      grid: { color: '#1A2030' },
    },
    y2: {
      position: 'right' as const,
      ticks: { color: '#1ABCB4', font: { family: "'Space Mono'", size: 11 }, callback: (v: any) => `$${v}M` },
      grid: { display: false },
    },
  },
});

const drivers = [
  { title: 'Revenue Ramp to $710M', impact: '+12–15pp margin', color: '#D4A017', detail: 'Fixed cost absorption — R&D, G&A, and facilities costs stay roughly flat while revenue more than doubles. This is classic operating leverage.' },
  { title: 'Defense Production Mix Shift', impact: '+3–4pp margin', color: '#C0392B', detail: 'Edge Autonomy transitions from development (negative margin) to production contracts (30%+ gross margin) by FY2026. SOFC units enter volume production.' },
  { title: 'PIL-BOX Licensing Revenue', impact: '+2pp margin', color: '#1ABCB4', detail: 'Once pharma partners commercialize PIL-BOX-derived formulations, RDW earns royalty streams — 80%+ gross margin revenue with zero incremental cost.' },
  { title: 'Debt Cost Reduction', impact: '+1–2pp margin', color: '#8B5CF6', detail: 'The Feb 2026 refinancing ($90M term loan to 2029) reduces interest expense from ~$25M to ~$8M/yr, directly improving net income and Adjusted EBITDA.' },
];

export default function EbitdaPage() {
  const { dark } = useTheme();
  const chartOptions = buildChartOptions(dark);
  return (
    <section id="ebitda" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <div className="section-eyebrow">Page 9 — EBITDA Inflection</div>
          <h2 className="section-title mb-4">
            The Trough Is Behind Us.<br />
            <span className="text-gradient-gold">9% Margins by FY2028E.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            <GlossaryTooltip term="EBITDA (Earnings Before Interest, Taxes, Depreciation & Amortization)" definition="A measure of operating profitability that strips out financing costs, tax treatment, and non-cash accounting charges — giving the clearest view of a company's cash-generating power from operations. For growth companies in capital build-out phase, this is the primary metric for institutional investors.">
              Adjusted EBITDA
            </GlossaryTooltip>{' '}
            has been negative through the development/ramp phase. Four structural drivers converge in FY2026–2028 to produce the EBITDA inflection institutional investors are waiting for — the re-rating catalyst.
          </p>
        </div>

        {/* Key milestones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'FY25 EBITDA', value: '–$50M', sub: 'Trough year', color: '#C0392B' },
            { label: 'FY26E EBITDA', value: '–$18M', sub: '+$32M improvement', color: '#D4A017' },
            { label: 'FY27E EBITDA', value: '+$18M', sub: 'Break-even crossed', color: '#4CAF50' },
            { label: 'FY28E Margin', value: '9.0%', sub: 'Institutional threshold', color: '#1ABCB4' },
          ].map((m) => (
            <div key={m.label} className="metric-card text-center">
              <div className="metric-value" style={{ color: m.color, fontSize: 28 }}>{m.value}</div>
              <div className="metric-label">{m.label}</div>
              <div className="text-[11px] mt-1" style={{ color: m.color + 'AA' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-card p-6 mb-8" style={{ height: 340 }}>
          <Line data={chartData} options={chartOptions as any} />
        </div>

        {/* Drivers */}
        <div className="section-eyebrow mb-4">Margin Expansion Drivers</div>
        <div className="grid md:grid-cols-2 gap-4">
          {drivers.map((d) => (
            <div
              key={d.title}
              className="glass-card glass-card-hover p-5"
              style={{ borderLeft: `3px solid ${d.color}` }}
              data-testid={`ebitda-driver-${d.title}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-[14px]" style={{ color: "var(--text-primary)" }}>{d.title}</span>
                <span className="text-sm font-bold font-mono" style={{ color: d.color }}>{d.impact}</span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{d.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-5 glass-card border-l-4 border-[#4CAF50]">
          <div className="text-[11px] text-[#4CAF50] font-mono tracking-wider uppercase mb-2">Re-Rating Trigger</div>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            The institutional ownership threshold for most growth-stage defense/space companies is <strong className="text-[#4CAF50]">positive Adjusted EBITDA</strong>. Crossing zero in FY2027E is not just a milestone — it's when the buyer universe expands from ~40 institutional holders to 150+, compressing the multiple from 1.3x EV/Revenue to the peer average of 3.2x.
          </p>
        </div>

        {/* EBITDA margin bridge: -14.9% → +9.0% */}
        <div className="mt-10">
          <div className="section-eyebrow mb-4">Margin Bridge: FY2025 (−14.9%) → FY2028E (+9.0%)</div>
          <div className="glass-card p-6">
            <div className="flex items-end gap-0 overflow-x-auto">
              {[
                { label: 'FY25 EBITDA Margin', value: -14.9, color: '#C0392B', isBase: true },
                { label: 'Revenue Ramp', delta: '+12–15pp', value: 13, color: '#D4A017', isBase: false },
                { label: 'Defense Mix Shift', delta: '+3–4pp', value: 3.5, color: '#C0392B', isBase: false },
                { label: 'PIL-BOX Royalties', delta: '+2pp', value: 2, color: '#1ABCB4', isBase: false },
                { label: 'Debt Cost Reduction', delta: '+1–2pp', value: 1.5, color: '#8B5CF6', isBase: false },
                { label: 'FY28E EBITDA Margin', value: 9.0, color: '#10B981', isBase: true },
              ].map((item, i) => {
                const isStart = item.isBase && i === 0;
                const isEnd = item.isBase && i !== 0;
                const barH = Math.abs(item.value) * 8; // px per point
                const isNeg = item.value < 0;
                return (
                  <div key={item.label} className="flex flex-col items-center flex-1 min-w-[90px]">
                    {!item.isBase && (
                      <div className="text-[10px] font-mono font-bold mb-1" style={{ color: item.color }}>{item.delta}</div>
                    )}
                    {item.isBase && (
                      <div className="text-[10px] font-mono font-bold mb-1" style={{ color: item.color }}>
                        {item.value > 0 ? `+${item.value}%` : `${item.value}%`}
                      </div>
                    )}
                    <div
                      className="w-full rounded-sm mx-1"
                      style={{
                        height: barH + 'px',
                        background: item.color,
                        opacity: item.isBase ? 0.9 : 0.65,
                        minHeight: 12,
                      }}
                    />
                    <div className="text-[9px] text-center mt-2 font-mono leading-tight px-1" style={{ color: 'var(--text-muted)' }}>
                      {item.label}
                    </div>
                    {i < 5 && (
                      <div className="text-[12px] font-bold mt-1" style={{ color: 'var(--text-muted)' }}>+</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-[10px] font-mono" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--card-border)', paddingTop: 12 }}>
              −$50M EBITDA ÷ $335M revenue = −14.9% margin. Path to +9%: fixed cost absorption on $710M revenue (+13pp), defense mix shift (+3.5pp), PIL-BOX royalties (+2pp), debt cost reduction (+1.5pp). Sum = +20.0pp net improvement. Sources: RDW FY2025 10-K, management guidance, analyst estimates.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
