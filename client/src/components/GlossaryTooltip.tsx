import { useState, useRef } from 'react';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
}

export default function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left, y: rect.bottom + 8 });
    setVisible(true);
  };

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
        className="border-b border-dashed border-[#D4A017]/60 cursor-help text-[#F5C842] hover:text-[#D4A017] transition-colors"
        data-testid={`glossary-${term.replace(/\s/g, '-')}`}
      >
        {children || term}
      </span>
      {visible && (
        <div
          className="tooltip-rdw"
          style={{ left: pos.x, top: pos.y, position: 'fixed', zIndex: 9999 }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#D4A017' }}>{term}</div>
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{definition}</div>
        </div>
      )}
    </>
  );
}
