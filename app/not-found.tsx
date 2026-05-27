import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🔋</div>
        <h1 className="font-syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--tx1)' }}>
          Page not found
        </h1>
        <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 24 }}>
          The page you are looking for doesn’t exist or has moved.
        </p>
        <Link href="/" style={{
          background: 'var(--acc)',
          color: '#081017',
          borderRadius: 12,
          padding: '10px 20px',
          fontSize: 13,
          fontWeight: 600,
          display: 'inline-block',
        }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
