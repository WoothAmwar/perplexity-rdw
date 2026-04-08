import { useEffect, useRef } from 'react';

export default function CoverPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const stars: { x: number; y: number; r: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.02 + s.x);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`;
        ctx.fill();
      });
      frame++;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <section id="cover" className="page-section relative overflow-hidden flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
      
      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] border border-[#D4A017]/8 rounded-full" style={{ animation: 'spin 60s linear infinite' }} />
        <div className="absolute w-[450px] h-[450px] border border-[#1ABCB4]/8 rounded-full" style={{ animation: 'spin 40s linear infinite reverse' }} />
        <div className="absolute w-[280px] h-[280px] border border-[#D4A017]/12 rounded-full" style={{ animation: 'spin 25s linear infinite' }} />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-8">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-label="RDW Logo">
            <circle cx="26" cy="26" r="25" stroke="#D4A017" strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M14 16 H24 C30 16 34 20 34 25 C34 30 30 34 24 34 H14 Z" stroke="#D4A017" strokeWidth="2" fill="none" />
            <path d="M24 34 L34 42" stroke="#D4A017" strokeWidth="2" />
            <circle cx="26" cy="26" r="3" fill="#D4A017" />
          </svg>
          <div>
            <div className="text-[11px] font-mono tracking-[4px] text-[#D4A017] uppercase">Equity Research</div>
            <div className="text-[11px] font-mono tracking-[3px] text-[#5C6880] uppercase">Institutional Grade</div>
          </div>
        </div>

        {/* Ticker badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#1ABCB4]/40 rounded-full text-[#1ABCB4] text-xs font-mono tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-[#1ABCB4] pulse-gold" />
          NYSE: RDW · Redwire Corporation
        </div>

        <h1 className="text-gradient-gold font-bold mb-4" style={{ fontSize: 'clamp(42px, 6vw, 84px)', lineHeight: 1.05, fontFamily: "'Space Grotesk', sans-serif" }}>
          The Space<br />Infrastructure Monopoly
        </h1>

        <p className="section-subtitle max-w-3xl mx-auto mb-8 text-lg">
          Where microgravity drug factories, quantum-proof satellites, and autonomous fuel cells converge at a single inflection point — trading at 40% of intrinsic value.
        </p>

        {/* Key metrics row */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { label: 'Price Target', value: '$16.00', color: '#D4A017' },
            { label: 'Upside', value: '+114%', color: '#1ABCB4' },
            { label: 'Rating', value: 'BUY', color: '#4CAF50' },
            { label: 'Current Price', value: '~$7.47', color: '#8892A4' },
          ].map((m) => (
            <div key={m.label} className="glass-card px-6 py-3 text-center min-w-[120px]">
              <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
              <div className="text-[11px] text-[#8892A4] tracking-widest uppercase mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Investment rating */}
        <div className="flex justify-center gap-3">
          <span className="badge-buy">Strong Buy</span>
          <span className="badge-target">PT: $16.00</span>
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-[#1E2A3A] text-[#5C6880]">
            April 2026
          </span>
        </div>

        {/* Scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-2 text-[#3A4A5C]">
          <div className="text-[10px] font-mono tracking-widest uppercase">Scroll to explore</div>
          <div className="w-px h-12 bg-gradient-to-b from-[#D4A017]/40 to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
