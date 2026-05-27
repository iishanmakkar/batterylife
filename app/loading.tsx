export default function Loading() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px' }}>
      <div style={{ width: '100%', maxWidth: 900 }}>
        <div style={{ height: 26, width: 220, background: 'var(--bg2)', borderRadius: 10, marginBottom: 12 }} />
        <div style={{ height: 14, width: 360, background: 'var(--bg2)', borderRadius: 10, marginBottom: 32 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 120, background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--bdr)' }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: 220, background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--bdr)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
