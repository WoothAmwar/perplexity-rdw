import { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as HighchartsMapModule from 'highcharts/modules/map';
import GlossaryTooltip from '../components/GlossaryTooltip';
import { useTheme } from '../App';

// Initialise Highcharts Maps module once — handle both ESM default and CommonJS
const initMap = (HighchartsMapModule as any).default ?? HighchartsMapModule;
if (typeof initMap === 'function') {
  initMap(Highcharts);
}

// RDW backlog by country — total contracted backlog $411.2M
const BACKLOG_COUNTRIES = [
  {
    hcKey: 'us',
    id: 'USA',
    name: 'United States',
    lat: 38,
    lon: -100,
    value: 245,
    pct: 59.6,
    color: '#C8102E',
    programs: ['NASA ISS (iROSA/ELSA)', 'DoD / US SOF Stalker UAS', 'Axiom Station', 'Edge Autonomy SOFC production'],
  },
  {
    hcKey: 'be',
    id: 'BEL',
    name: 'Belgium / EU',
    lat: 50.8,
    lon: 4.5,
    value: 68,
    pct: 16.5,
    color: '#8B5CF6',
    programs: ['EuroQCI Phase 1 complete', "MATTEO — Belgium's first national security satellite (prime contractor)"],
  },
  {
    hcKey: 'gb',
    id: 'GBR',
    name: 'United Kingdom',
    lat: 53.0,
    lon: -1.5,
    value: 32,
    pct: 7.8,
    color: '#1ABCB4',
    programs: ['QKDSat quantum comms backbone', 'NATO allied UAS deliveries'],
  },
  {
    hcKey: 'ua',
    id: 'UKR',
    name: 'Ukraine',
    lat: 49.0,
    lon: 32.0,
    value: 24,
    pct: 5.8,
    color: '#F59E0B',
    programs: ['Stalker XE tactical UAS — 200+ deployed in active theater'],
  },
  {
    hcKey: 'ae',
    id: 'UAE',
    name: 'UAE / Gulf',
    lat: 24.0,
    lon: 54.0,
    value: 18,
    pct: 4.4,
    color: '#10B981',
    programs: ['Commercial satellite infrastructure', 'ISR systems integration'],
  },
  {
    hcKey: 'jp',
    id: 'JPN',
    name: 'Japan',
    lat: 36.0,
    lon: 138.0,
    value: 14,
    pct: 3.4,
    color: '#0EA5E9',
    programs: ['JAXA ISS collaboration', 'Microgravity pharma trials (PIL-BOX)'],
  },
  {
    hcKey: 'au',
    id: 'AUS',
    name: 'Australia',
    lat: -25.0,
    lon: 134.0,
    value: 10,
    pct: 2.4,
    color: '#D4A017',
    programs: ['ADF defense tech systems', 'Space tracking & ground segment'],
  },
];

// Lookup by hcKey for tooltip
const COUNTRY_MAP: Record<string, typeof BACKLOG_COUNTRIES[0]> = {};
BACKLOG_COUNTRIES.forEach((c) => { COUNTRY_MAP[c.hcKey] = c; });

export default function BacklogMapPage() {
  const { dark } = useTheme();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [hovered, setHovered] = useState<typeof BACKLOG_COUNTRIES[0] | null>(null);
  const [mapData, setMapData] = useState<any>(null);

  useEffect(() => {
    fetch('/world.geo.json')
      .then((r) => r.json())
      .then(setMapData);
  }, []);

  // Rebuild options whenever theme or mapData changes
  const options: Highcharts.Options | null = (() => {
    if (!mapData) return null;

    const landFill  = dark ? '#1a2332' : '#dde4ed';
    const border    = dark ? '#2d3a4d' : '#b8c2ce';
    const bg        = dark ? '#0d1117' : '#f8fafc';
    const ttBg      = dark ? '#111827' : '#ffffff';
    const ttText    = dark ? '#9BA8BB' : '#1F2937';
    const ttMuted   = dark ? '#6B7280' : '#6B7280';

    // Build series: (a) choropleth base, (b) mapbubble overlay
    // For mapbubble, per-point color is set via `marker.fillColor`
    const bubbleSeries: Highcharts.SeriesMapbubbleOptions = {
      type: 'mapbubble',
      name: 'Backlog',
      joinBy: ['hc-key', 'hcKey'],
      minSize: '5%',
      maxSize: '18%',
      zMin: 0,
      zMax: 245,
      enableMouseTracking: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '{point.id}',
        style: {
          fontSize: '9px',
          fontWeight: '700',
          color: '#ffffff',
          textOutline: 'none',
        },
        allowOverlap: true,
      },
      states: {
        hover: {
          enabled: true,
          brightness: 0.12,
        },
      },
      data: BACKLOG_COUNTRIES.map((c) => ({
        hcKey: c.hcKey,
        id: c.id,
        z: c.value,
        lat: c.lat,
        lon: c.lon,
        color: c.color,
        name: c.name,
        // Custom fields for tooltip
        customPct: c.pct,
        customValue: c.value,
        customPrograms: c.programs,
        marker: {
          fillColor: c.color + 'AA', // 67% opacity
          lineColor: c.color,
          lineWidth: 1.5,
        },
      })) as any,
      tooltip: {
        pointFormatter(this: Highcharts.Point): string {
          const pt = this as any;
          const c = COUNTRY_MAP[pt.hcKey];
          if (!c) return '';
          const lines = c.programs.map((p) =>
            `<span style="color:${ttMuted}">· ${p}</span>`
          ).join('<br/>');
          return `<span style="color:${c.color};font-weight:700;font-size:12px;">${c.name}</span><br/>
<span style="font-family:'Space Mono',monospace;font-weight:600;color:${ttText}">$${c.value}M · ${c.pct}% of backlog</span><br/><br/>
${lines}`;
        },
      },
    };

    const mapSeries: Highcharts.SeriesMapOptions = {
      type: 'map',
      name: 'World',
      mapData: mapData,
      joinBy: 'hc-key',
      data: BACKLOG_COUNTRIES.map((c) => ({
        'hc-key': c.hcKey,
        value: c.value,
        // Highlight country fill subtly
        color: c.color + '20', // 12% opacity tint
      })),
      nullColor: landFill,
      borderColor: border,
      borderWidth: 0.4,
      enableMouseTracking: false,
      states: {
        hover: { enabled: false },
      },
      dataLabels: { enabled: false },
    };

    return {
      chart: {
        map: mapData,
        backgroundColor: bg,
        margin: [0, 0, 0, 0],
        spacing: [4, 4, 4, 4],
        animation: { duration: 400 },
        style: { fontFamily: "'Inter', 'Space Mono', sans-serif" },
      },
      title: { text: '' },
      subtitle: { text: '' },
      credits: { enabled: false },
      legend: { enabled: false },
      colorAxis: { visible: false },

      mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: false,
        buttonOptions: {
          theme: {
            fill: dark ? '#1a2332' : '#f0f2f5',
            stroke: dark ? '#2d3a4d' : '#c5cdd9',
            style: { color: dark ? '#9BA8BB' : '#374151' },
          },
        },
      },

      tooltip: {
        useHTML: true,
        backgroundColor: ttBg,
        borderWidth: 0,
        borderRadius: 8,
        shadow: true,
        padding: 12,
        style: { color: ttText, fontSize: '11px', pointerEvents: 'none' },
        headerFormat: '',
      },

      plotOptions: {
        series: {
          point: {
            events: {
              mouseOver(this: Highcharts.Point) {
                const pt = this as any;
                if (pt.hcKey) setHovered(COUNTRY_MAP[pt.hcKey] || null);
              },
              mouseOut() {
                setHovered(null);
              },
            },
          },
        },
      },

      series: [mapSeries as any, bubbleSeries as any],
    };
  })();

  return (
    <section id="backlog-map" className="page-section">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="section-eyebrow">Page 9 — Global Backlog Distribution</div>
          <h2 className="section-title mb-4">
            7 Countries.<br />
            <span className="text-gradient-red">$411M in Committed Revenue.</span>
          </h2>
          <p className="section-subtitle max-w-3xl">
            Redwire's $411.2M contracted{' '}
            <GlossaryTooltip
              term="Contracted Backlog"
              definition="Firm, binding purchase orders and contracts for which revenue has not yet been recognized. Unlike pipeline or bookings, backlog represents legally committed customer obligations — it becomes revenue as work is performed."
            >
              backlog
            </GlossaryTooltip>
            {' '}spans government and commercial customers across 7 countries. Circle size is weighted by backlog volume. The US DoD/NASA anchor (59.6%) provides structural predictability; international exposure (40.4%) diversifies geopolitical risk.
          </p>
        </div>

        {/* Map + legend layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Map — 2/3 width */}
          <div className="md:col-span-2">
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="section-eyebrow mb-2 text-[10px]">
                Backlog by Geography · Circle area ∝ $M committed · Hover for program detail
              </div>
              <div style={{ minHeight: 280 }}>
                {options ? (
                  <HighchartsReact
                    ref={chartRef}
                    highcharts={Highcharts}
                    constructorType="mapChart"
                    options={options}
                    containerProps={{
                      style: { width: '100%', height: 320, borderRadius: 8, overflow: 'hidden' },
                    }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center text-[12px]"
                    style={{ height: 320, color: 'var(--text-muted)' }}
                  >
                    Loading map…
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Legend — 1/3 width */}
          <div className="space-y-2">
            <div className="section-eyebrow mb-3">Backlog by Region</div>
            {[...BACKLOG_COUNTRIES].sort((a, b) => b.value - a.value).map((c) => (
              <div
                key={c.id}
                className="glass-card p-3 cursor-pointer transition-opacity duration-200"
                style={{
                  borderLeft: `3px solid ${c.color}`,
                  opacity: hovered && hovered.id !== c.id ? 0.45 : 1,
                }}
                onMouseEnter={() => setHovered(c)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {c.name}
                  </span>
                  <span className="text-[13px] font-bold font-mono" style={{ color: c.color }}>
                    ${c.value}M
                  </span>
                </div>
                <div className="h-1.5 rounded-full mb-1" style={{ background: 'var(--card-border)' }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${c.pct}%`, background: c.color, opacity: 0.8 }}
                  />
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {c.pct}% · {c.programs[0].split('(')[0].trim()}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="glass-card p-3 mt-1" style={{ border: '1px solid var(--rdw-red-border)' }}>
              <div className="flex justify-between items-center">
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Total Backlog</span>
                <span className="text-[15px] font-black font-mono" style={{ color: 'var(--rdw-red)' }}>$411.2M</span>
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                +38.6% YoY · Book-to-Bill 1.32x FY2025
              </div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: 'US Government Anchor',
              value: '59.6%',
              sub: '$245M — NASA & DoD multi-year, non-discretionary contracts',
              color: '#C8102E',
            },
            {
              label: 'International Exposure',
              value: '40.4%',
              sub: 'EU (EuroQCI/MATTEO), UK (QKDSat), Ukraine (Stalker), Gulf, APAC',
              color: '#8B5CF6',
            },
            {
              label: 'Q4 2025 B/B',
              value: '1.52x',
              sub: 'Backlog growing ~52% faster than revenue — leading growth indicator',
              color: '#D4A017',
            },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-5">
              <div className="text-[11px] font-mono tracking-widest uppercase mb-2" style={{ color: kpi.color }}>
                {kpi.label}
              </div>
              <div className="text-[32px] font-black font-mono mb-1" style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
