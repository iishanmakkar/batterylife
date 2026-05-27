export default function TermsPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
      <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Terms of Service</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, color: 'var(--tx2)' }}>
        <p><strong style={{ color: 'var(--tx1)' }}>Use at your own risk:</strong> BatteryIQ provides informational analysis only. We do not guarantee accuracy.</p>
        <p><strong style={{ color: 'var(--tx1)' }}>No warranties:</strong> This service is provided “as-is” without warranties of any kind.</p>
        <p><strong style={{ color: 'var(--tx1)' }}>User responsibility:</strong> You are responsible for decisions made based on the analysis results.</p>
        <p><strong style={{ color: 'var(--tx1)' }}>Availability:</strong> We may update, change, or discontinue the service at any time.</p>
      </div>
    </div>
  );
}
