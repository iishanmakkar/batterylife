'use client';

export default function ArticleSection() {
  return (
    <section style={{ width: '100%', padding: '0 24px 80px' }}>
      <div style={{
        width: '100%', maxWidth: 900, margin: '0 auto',
        background: 'var(--bg2)', borderRadius: 24, padding: 'clamp(32px, 5vw, 64px)',
        border: '1px solid var(--bdr)', color: 'var(--tx2)', lineHeight: 1.8,
        fontSize: 16
      }}>
        <h2 className="font-syne" style={{ fontWeight: 700, marginBottom: 24, fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--tx1)' }}>
          Understanding Laptop Battery Health
        </h2>
        
        <p style={{ marginBottom: 20 }}>
          Your laptop's battery is one of its most critical components, yet it's often the most misunderstood. Unlike processors or RAM, lithium-ion batteries are consumable items that naturally degrade over time and with use. Understanding how to monitor and maintain your battery's health can significantly extend your laptop's usable lifespan and ensure you aren't caught with a dead device during crucial moments.
        </p>

        <h3 className="font-syne" style={{ fontWeight: 600, marginTop: 32, marginBottom: 16, fontSize: 24, color: 'var(--tx1)' }}>
          What is Battery Wear Level?
        </h3>
        <p style={{ marginBottom: 20 }}>
          Battery wear level is a percentage that represents how much of the battery's original capacity has been permanently lost. When you buy a new laptop, its battery has a "Design Capacity" – the amount of energy it was manufactured to hold. Over time, as the battery goes through charge and discharge cycles, its chemical composition changes, and it can no longer hold that much energy. The maximum energy it can currently hold is called its "Full Charge Capacity."
        </p>
        <p style={{ marginBottom: 20 }}>
          The wear level is calculated simply: if your Design Capacity was 50,000 mWh and your Full Charge Capacity is now 40,000 mWh, your battery has lost 20% of its original capacity, meaning it has a 20% wear level. A healthy battery typically has a wear level below 15%. Once it crosses 30%, you will likely notice a significant reduction in battery life, and the battery may occasionally shut down unexpectedly.
        </p>

        <h3 className="font-syne" style={{ fontWeight: 600, marginTop: 32, marginBottom: 16, fontSize: 24, color: 'var(--tx1)' }}>
          The Importance of Cycle Counts
        </h3>
        <p style={{ marginBottom: 20 }}>
          A cycle count does not mean plugging and unplugging your laptop once. It represents one full 100% discharge. For example, if you use 50% of your battery today, recharge it to 100%, and use 50% tomorrow, that counts as one cycle, not two. 
        </p>
        <p style={{ marginBottom: 20 }}>
          Most modern lithium-ion and lithium-polymer laptop batteries are designed to retain around 80% of their original capacity after 300 to 500 full charge cycles, depending on the manufacturer and the quality of the cells. By monitoring your cycle count, you can anticipate when your battery will need replacement long before it fails completely.
        </p>

        <h3 className="font-syne" style={{ fontWeight: 600, marginTop: 32, marginBottom: 16, fontSize: 24, color: 'var(--tx1)' }}>
          How to Prolong Your Battery's Lifespan
        </h3>
        <ul style={{ paddingLeft: 24, marginBottom: 20 }}>
          <li style={{ marginBottom: 12 }}><strong>Avoid Extreme Temperatures:</strong> Heat is the biggest enemy of lithium-ion batteries. Avoid leaving your laptop in a hot car or blocking its cooling vents. Running intensive applications while resting the laptop on a soft surface like a bed can cause heat buildup that permanently damages the battery cells.</li>
          <li style={{ marginBottom: 12 }}><strong>Don't Leave It at 0%:</strong> Allowing your battery to completely drain and leaving it empty for an extended period can cause it to fall into a deep discharge state, rendering it incapable of holding a charge ever again.</li>
          <li style={{ marginBottom: 12 }}><strong>Use Smart Charging:</strong> Many modern laptops come with bios-level or software-level battery limiters (often capping the charge at 80%). If your laptop spends most of its time plugged into a desk, keeping the battery at 100% constant voltage creates stress. Limiting the charge to 80% can double the lifespan of the battery.</li>
        </ul>

        <h3 className="font-syne" style={{ fontWeight: 600, marginTop: 32, marginBottom: 16, fontSize: 24, color: 'var(--tx1)' }}>
          Analyzing the Windows Powercfg Battery Report
        </h3>
        <p style={{ marginBottom: 20 }}>
          Windows includes a built-in diagnostic tool that generates incredibly detailed battery reports. By opening a command prompt as an administrator and running <code>powercfg /batteryreport</code>, Windows compiles historical data about your battery's usage, capacity history, and estimated battery life based on your actual usage patterns over the last few days and weeks.
        </p>
        <p style={{ marginBottom: 20 }}>
          However, this HTML report is dense, filled with tables of raw numbers and milliwatt-hour readings that can be difficult for the average user to interpret. That is why BatteryIQ was created. By parsing this raw data, we can instantly calculate your wear level, graph your capacity degradation over time, and provide a simple, letter-grade health score.
        </p>
        <p style={{ marginBottom: 0 }}>
          Regularly generating and analyzing your battery report can help you detect sudden drops in capacity — a potential sign of a defective battery cell — and allow you to make a warranty claim before your coverage expires.
        </p>
      </div>
    </section>
  );
}
