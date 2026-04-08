import { useEffect, useRef } from 'react';

const LIVE_PRICE = 9.56;
const PRICE_TARGET = 16.00;
const UPSIDE = (((PRICE_TARGET - LIVE_PRICE) / LIVE_PRICE) * 100).toFixed(1);

export default function CoverPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const isDark = document.documentElement.classList.contains('dark');
    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? `rgba(200,16,46,0.35)` : `rgba(200,16,46,0.15)`;
        ctx.fill();

        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(200,16,46,${0.08 * (1 - dist / 120)})`
              : `rgba(200,16,46,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="cover" className="page-section cover-hero relative overflow-hidden flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Decorative rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full" style={{ border: '1px solid rgba(200,16,46,0.08)', animation: 'spin 90s linear infinite' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ border: '1px solid rgba(200,16,46,0.06)', animation: 'spin 60s linear infinite reverse' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full" style={{ border: '1px solid rgba(200,16,46,0.1)', animation: 'spin 35s linear infinite' }} />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-8">

        {/* Main headline */}
        <h1 className="font-bold mb-4" style={{ fontSize: 'clamp(32px, 5vw, 68px)', lineHeight: 1.08, fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
          <span style={{ fontSize: '0.55em', fontWeight: 500, letterSpacing: '0.04em', opacity: 0.7, display: 'block', marginBottom: '0.15em' }}>Redwire</span>
          The Space<br />
          <span className="text-gradient-red">Infrastructure Monopoly</span>
        </h1>

        {/* Price Target — equally prominent to headline, gold to stand out */}
        <div className="mb-6">
          <div
            className="font-black font-mono inline-block"
            style={{
              fontSize: 'clamp(44px, 6.5vw, 88px)',
              lineHeight: 1.05,
              color: '#D4A017',
              letterSpacing: '-1px',
              textShadow: '0 0 40px rgba(212,160,23,0.35)',
            }}
          >
            $16.00
          </div>
          <div
            className="text-[12px] font-mono tracking-[4px] uppercase mt-1"
            style={{ color: 'var(--text-muted)' }}
          >
            12-Month Price Target
          </div>
        </div>

        <p className="section-subtitle max-w-3xl mx-auto mb-10 text-lg">
          Where microgravity drug factories, quantum-proof satellites, and autonomous fuel cells
          converge at a single inflection point — trading at a{' '}
          <span style={{ color: 'var(--rdw-red)', fontWeight: 600 }}>64% discount to intrinsic value</span>.
        </p>

        {/* Key metrics — only non-redundant data points */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { label: 'Current Price', value: `$${LIVE_PRICE.toFixed(2)}`, color: 'var(--text-secondary)' },
            { label: 'Mkt Cap', value: '$1.83B', color: 'var(--text-secondary)' },
            { label: '52W Range', value: '$4.87 – $22.25', color: 'var(--text-secondary)' },
          ].map((m) => (
            <div key={m.label} className="glass-card glass-card-hover px-6 py-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
              <div className="text-[11px] tracking-widest uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Why Now urgency strip */}
        <div
          className="glass-card max-w-3xl mx-auto px-6 py-5 mb-8 text-left"
          style={{ borderLeft: '4px solid #C8102E' }}
        >
          <div className="text-[10px] font-mono tracking-[4px] uppercase mb-3" style={{ color: 'var(--rdw-red)' }}>
            The Catalyst for "Why Now"
          </div>
          <p className="text-[14px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
            Investing a year ago meant taking on unjustified development risk — the debt overhang was unresolved, 
            the Edge Autonomy integration was unproven, and segment-level profitability was opaque. 
            Waiting a year from today means{' '}
            <span style={{ color: 'var(--rdw-red)', fontWeight: 700 }}>missing the H2 2026 EBITDA inflection</span>
            {' '}— the single event that expands the institutional buyer universe from ~40 funds to 150+, 
            triggers a multiple re-rating, and closes the 64% gap to intrinsic value. The entry window is now.
          </p>
        </div>

        {/* Analyst consensus strip */}
        <div className="glass-card max-w-2xl mx-auto px-6 py-4 mb-10">
          <div className="text-[10px] font-mono tracking-[3px] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Analyst Consensus</div>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-xl font-black font-mono" style={{ color: '#10B981' }}>5</div>
              <div className="text-[11px] font-semibold" style={{ color: '#10B981' }}>Long</div>
            </div>
            <div>
              <div className="text-xl font-black font-mono" style={{ color: 'var(--text-muted)' }}>0</div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Hold</div>
            </div>
            <div>
              <div className="text-xl font-black font-mono" style={{ color: 'var(--rdw-red)' }}>1</div>
              <div className="text-[11px]" style={{ color: 'var(--rdw-red)' }}>Short</div>
            </div>
            <div className="border-l pl-6" style={{ borderColor: 'var(--card-border)' }}>
              <div className="text-xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>$12.67</div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Consensus PT</div>
            </div>
            <div>
              <div className="text-xl font-black font-mono" style={{ color: '#10B981' }}>$22.00</div>
              <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>High PT</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
            Truist ↑ Long $15 (Mar 9, 2026) · 6 analysts covering
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-2" style={{ color: 'var(--text-muted)' }}>
          <div className="text-[10px] font-mono tracking-widest uppercase">Scroll to explore</div>
          <div className="w-px h-12" style={{ background: `linear-gradient(to bottom, var(--rdw-red), transparent)` }} />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
