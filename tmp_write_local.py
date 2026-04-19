from pathlib import Path
content = """import { initiatePayment } from '@/utils/razorpay';
import { useUser } from '@/hooks/useUser';

const localServices = [
  { name: 'PC Formatting & Windows Install', price: '?500 / $6', icon: '???' },
  { name: 'Virus & Malware Removal', price: '?199 / $2.40', icon: '???' },
  { name: 'Data Recovery', price: '?299+ / $3.60+', icon: '??' },
  { name: 'Hardware Diagnostics', price: '?149 / $1.80', icon: '??' },
  { name: 'Software Installation Pack', price: '?99 / $1.20', icon: '??' },
  { name: 'Quick Driver Pack for Windows', price: '?199 / $2.40', icon: '??' },
];

export default function LocalSupport() {
  const { user } = useUser();

  const handlePayment = async (service: { name: string; price: string; icon: string }) => {
    if (!user) {
      alert('Please sign in to make a payment.');
      return;
    }

    const amountMatch = service.price.match(/?(\\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[1], 10) : 500;

    initiatePayment({
      amount,
      name: service.name,
      description: `Local Tech Support: ${service.name}`,
      prefill: {
        name: user?.fullName || user?.firstName || user?.displayName || '',
        email: user?.email || '',
        contact: user?.phoneNumber || '',
      },
      onSuccess: async () => {
        try {
          const order = {
            serviceId: 'local-' + service.name.replace(/\\s+/g, '-').toLowerCase(),
            serviceTitle: service.name,
            userId: user?.id,
            userEmail: user?.email || '',
            userName: user?.fullName || user?.firstName || user?.displayName || '',
            status: 'completed',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          console.log('Order (stub save):', order);
        } catch (err) {
          console.error('Failed to record order (stub):', err);
        }

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
        <div
          style={{
            padding: '24px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 70px rgba(0,0,0,0.12)',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>Why Local Support?</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            Same-day service, trusted local tech support, and secure setup for your devices.
            Book support and get instant help through our community WhatsApp group.
          </p>
        </div>

        {localServices.map((service) => (
          <div
            key={service.name}
            style={{
              padding: '22px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 70px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '34px', marginBottom: '14px' }}>{service.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>{service.name}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{service.price}</p>
            </div>
            <button
              type="button"
              onClick={() => handlePayment(service)}
              style={{
                marginTop: '24px',
                padding: '14px 18px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg,#39FF14,#00d4aa)',
                color: '#000',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Book service
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
"""
Path('src/components/home/LocalSupport.tsx').write_text(content, encoding='utf-8')
print('written LocalSupport')
