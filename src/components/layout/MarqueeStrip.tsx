const marqueeItems = [
  'Secure Payments UPI',
  'Script → EXE ₹10 / $0.12',
  'Custom Utilities',
  'PC Formatting ₹500 / $6',
  'Data Recovery',
  'WhatsApp Orders',
  'Virus Removal ₹199 / $2.40',
  'Web Development',
  'Local Tech Support',
  'Biraul, Darbhanga',
];

export default function MarqueeStrip() {
  const content = marqueeItems.map((item) => (
    <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '24px' }}>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '15px',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          letterSpacing: '0.5px',
          fontWeight: 500,
        }}
      >
        {item}
      </span>
      <span
        style={{
          color: 'var(--brand-blue)',
          fontSize: '8px',
          opacity: 0.6,
        }}
      >
        ✦
      </span>
    </span>
  ));

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        padding: '16px 0',
        background: 'transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '24px',
          animation: 'marquee-scroll 30s linear infinite',
          width: 'max-content',
        }}
      >
        <div style={{ display: 'flex', gap: '24px' }}>{content}</div>
        <div style={{ display: 'flex', gap: '24px' }}>{content}</div>
        <div style={{ display: 'flex', gap: '24px' }}>{content}</div>
      </div>
    </div>
  );
}
