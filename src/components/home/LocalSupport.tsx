import { initiatePayment } from '@/utils/razorpay';
import { useUser } from '@clerk/clerk-react';

const localServices = [
  { name: 'PC Formatting & Windows Install', price: '₹500 / $6', icon: '🖥️' },
  { name: 'Virus & Malware Removal', price: '₹199 / $2.40', icon: '🛡️' },
  { name: 'Data Recovery', price: '₹299+ / $3.60+', icon: '💾' },
  { name: 'Hardware Diagnostics', price: '₹149 / $1.80', icon: '🔧' },
  { name: 'Software Installation Pack', price: '₹99 / $1.20', icon: '📦' },
  { name: 'Quick Driver Pack for Windows', price: '₹199 / $2.40', icon: '📡' },
];

export default function LocalSupport() {
  const { user } = useUser();

  const handlePayment = async (service: { name: string; price: string; icon: string }) => {
    if (!user) {
      alert('Please sign in to make a payment.');
      return;
    }

    // Extract amount from price string, e.g., "₹500 / $6" -> 500
    const amountMatch = service.price.match(/₹(\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[1]) : 500;

    initiatePayment({
      amount: amount,
      name: service.name,
      description: `Local Tech Support: ${service.name}`,
      prefill: {
        name: user.fullName || user.firstName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        contact: '', // No phone in Clerk user
      },
      onSuccess: async () => {
        // Redirect to WhatsApp community
        window.open('https://chat.whatsapp.com/J96chgHkA3VKdu8EQ0WQar', '_blank');
      },
      onFailure: (response) => {
        console.error('Payment failed:', response);
        alert('Payment failed. Please try again.');
      },
    });
  };

  return (
    <section
      id="support"
      style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(24px, 3vw, 36px)',
            marginBottom: '12px',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{'// '}</span>
          <span style={{ color: 'var(--text-primary)' }}>Local </span>
          <span className="brand-blue-text">Tech Support</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
          On-site technical support for the Biraul, Darbhanga community. Professional
          hardware and software services at your doorstep.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Address Card */}
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div className="macos-title-bar" style={{ margin: '-28px -28px 0', borderRadius: '12px 12px 0 0' }}>
            <span className="macos-dot red" />
            <span className="macos-dot yellow" />
            <span className="macos-dot green" />
            <span className="macos-title-text">location.conf</span>
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                color: 'var(--neon-green)',
                marginBottom: '16px',
              }}
            >
              📍 Service Area
            </h3>
            <address
              style={{
                fontStyle: 'normal',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: 2,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>street:</span> Vandevi Nagar, Collage Road
              <br />
              <span style={{ color: 'var(--text-muted)' }}>highway:</span> SH-56, Supaul Bazaar
              <br />
              <span style={{ color: 'var(--text-muted)' }}>city:</span> Biraul, Darbhanga
              <br />
              <span style={{ color: 'var(--text-muted)' }}>state:</span> Bihar, India
            </address>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'rgba(0, 122, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 122, 255, 0.1)',
            }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
              Available Mon-Sat, 10 AM - 7 PM IST
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--brand-blue)', marginTop: '4px' }}>
              Home visits available in 5km radius
            </p>
          </div>
        </div>

        {/* Services List Card */}
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="macos-title-bar" style={{ margin: '-28px -28px 20px', borderRadius: '12px 12px 0 0' }}>
            <span className="macos-dot red" />
            <span className="macos-dot yellow" />
            <span className="macos-dot green" />
            <span className="macos-title-text">services.json</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {localServices.map((service) => (
              <div
                key={service.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => handlePayment(service)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(57,255,20,0.2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.04)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px' }}>{service.icon}</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '13px' }}>
                    {service.name}
                  </span>
                </div>
                <span
                  className="neon-green-text"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '14px' }}
                >
                  {service.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
