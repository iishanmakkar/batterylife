export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
      <h1 className="font-syne" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Privacy Policy</h1>
      <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 18 }}>
        BatteryIQ runs entirely in your browser. Your battery report files are never uploaded to our servers.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14, color: 'var(--tx2)' }}>
        <p><strong style={{ color: 'var(--tx1)' }}>Local processing:</strong> Reports are parsed on-device and stored in your browser storage only.</p>
        <p><strong style={{ color: 'var(--tx1)' }}>Analytics:</strong> We do not collect personally identifiable data from your report files.</p>
        <p><strong style={{ color: 'var(--tx1)' }}>Ads:</strong> Ads may be served by third-party networks which can set cookies or collect usage data.</p>
        <p><strong style={{ color: 'var(--tx1)' }}>Data removal:</strong> Clear your browser storage to remove all saved reports.</p>
      </div>
    </div>
  );
}
