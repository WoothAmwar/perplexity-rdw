import { useEffect, useState } from 'react';

const PAGES = [
  { id: 'cover', label: 'Cover' },
  { id: 'thesis', label: 'Thesis' },
  { id: 'summary', label: 'Summary' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'quantum', label: 'Quantum' },
  { id: 'pharma', label: 'Pharma' },
  { id: 'fuelcell', label: 'Fuel Cell' },
  { id: 'space', label: 'Space R&D' },
  { id: 'backlog-map', label: 'Backlog Map' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'ebitda', label: 'EBITDA' },
  { id: 'delever', label: 'Debt' },
  { id: 'wacc', label: 'WACC' },
  { id: 'peers', label: 'Peers' },
  { id: 'sotp', label: 'SOTP' },
  { id: 'valuation3d', label: '3D Val' },
  { id: 'catalysts', label: 'Catalysts' },
  { id: 'sources', label: 'Sources' },
];

export default function NavSidebar() {
  const [active, setActive] = useState('cover');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    PAGES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 items-center"
      aria-label="Page navigation"
    >
      {PAGES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          title={label}
          aria-label={`Navigate to ${label}`}
          className="group flex items-center gap-2"
          data-testid={`nav-${id}`}
        >
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-right whitespace-nowrap px-2 py-0.5 rounded font-mono"
            style={{
              color: 'var(--rdw-red)',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
            }}
          >
            {label}
          </span>
          <div
            className={`nav-dot transition-all duration-200 ${active === id ? 'active scale-125' : ''}`}
          />
        </button>
      ))}
    </nav>
  );
}
