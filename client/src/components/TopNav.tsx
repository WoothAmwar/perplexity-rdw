import { useTheme } from '../App';

const NAV_LINKS = [
  { label: 'Investment Thesis', id: 'thesis' },
  { label: 'Pipeline', id: 'pipeline' },
  { label: 'Backlog Map', id: 'backlog-map' },
  { label: 'Revenue / Financials', id: 'revenue' },
  { label: 'Catalysts', id: 'catalysts' },
  { label: 'Research Edge', id: 'research-edge' },
];

export default function TopNav() {
  const { dark } = useTheme();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        background: dark ? 'rgba(11,15,24,0.92)' : 'rgba(250,250,250,0.92)',
        borderBottom: `1px solid ${dark ? '#1E2A3A' : '#E5E7EB'}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        gap: 0,
        padding: '0 16px',
      }}
    >
      {/* RDW pill */}
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: 13,
          color: '#C8102E',
          letterSpacing: '0.5px',
          marginRight: 20,
          flexShrink: 0,
        }}
      >
        RDW
      </span>

      {/* Jump links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {NAV_LINKS.map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px 12px',
              borderRadius: 6,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: dark ? '#9BA8BB' : '#374151',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#C8102E';
              (e.currentTarget as HTMLButtonElement).style.background = dark
                ? 'rgba(200,16,46,0.08)'
                : 'rgba(200,16,46,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = dark ? '#9BA8BB' : '#374151';
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
