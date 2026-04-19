import { useState } from 'react';
import type { ServiceCardData } from '@/types';
import { WHATSAPP_NUMBER } from '@/config/constants';
import { initiatePayment, sendPaymentNotification } from '@/utils/razorpay';
import { useUser } from '@/hooks/useUser';

interface ServiceCardProps {
  data: ServiceCardData;
  isAuthenticated: boolean;
}

export default function ServiceCard({ data, isAuthenticated }: ServiceCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { user } = useUser();

  const userId = user?.id || 'anonymous';
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'unknown';
  const userName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Unknown User';
  const userPhone = user?.primaryPhoneNumber?.phoneNumber || undefined;

  const recordOrder = async (status: 'completed' | 'failed' | 'cancelled', paymentId?: string) => {
    try {
      const order = {
        serviceId: data.id,
        serviceTitle: data.title,
        userId,
        userEmail,
        userName,
        userPhone,
        paymentId,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      console.log('Record order (stub):', order);
    } catch (err) {
      console.error('Failed to record order (stub):', err);
    }
  };

  const handleCTA = () => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      window.location.href = '/sign-in';
      return;
    }
    if (data.ctaAction === 'whatsapp') {
      const msg = encodeURIComponent(
        `Hi DevForge! I'm interested in: ${data.title} (${data.price}). Please share more details.`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    } else if (data.ctaAction === 'upload') {
      document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (data.ctaAction === 'payment') {
      // Extract price number from string (e.g., "₹10 / $0.12" -> 10)
      const priceMatch = data.price.match(/₹([\d,]+)/);
      const priceNumber = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
      
      if (priceNumber > 0) {
        initiatePayment({
          amount: priceNumber,
          name: data.title,
          description: data.description,
          prefill: {
            name: userName,
            email: userEmail,
            contact: userPhone,
          },
          onSuccess: (response) => {
            // Send WhatsApp notification to admin
            const paymentId = String((response as Record<string, unknown>)['razorpay_payment_id'] || '');
            if (paymentId) {
              sendPaymentNotification(priceNumber, data.title, paymentId);
            }

            void recordOrder('completed', paymentId || undefined);
            
            alert('Payment successful! We will contact you shortly.');
            const msg = encodeURIComponent(
              `Hi DevForge! I just paid for: ${data.title} (${data.price}). Payment ID: ${paymentId || 'N/A'}`,
            );
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');

            // Special case: for converter.exe, take the user directly to upload after payment
            if (data.id === 'exe-converter') {
              setTimeout(() => {
                document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 250);
            }
          },
          onFailure: (error) => {
            console.error('Payment failed:', error);
            void recordOrder('failed');
            alert('Payment failed. Please try again or contact us on WhatsApp.');
          },
        });
      } else {
        alert('Invalid price. Please contact support.');
      }
    } else {
      const msg = encodeURIComponent(
        `Hi DevForge! I'd like to inquire about: ${data.title}. Please reach out.`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    }
  };

  return (
    <div className="card-flip-container" style={{ width: '100%' }}>
      <div
        className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face */}
        <div className="card-front glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="macos-title-bar">
            <span className="macos-dot red" />
            <span className="macos-dot yellow" />
            <span className="macos-dot green" />
            <span className="macos-title-text">{data.subtitle}</span>
          </div>
          <div className="df-card-body">
            <div className="df-card-content">
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{data.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '18px',
                  color: 'var(--text-primary)',
                  marginBottom: '8px',
                }}
              >
                {data.title}
              </h3>
              <p className="df-card-desc">
                {data.description}
              </p>
            </div>
            <div className="df-card-footer">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  className="neon-green-text"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                >
                  {data.price}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                  }}
                >
                  Click to flip →
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCTA();
                }}
                className="df-card-cta"
                style={{
                  width: '100%',
                  background: isAuthenticated
                    ? 'linear-gradient(135deg, var(--neon-green), #2dd40f)'
                    : 'rgba(57, 255, 20, 0.1)',
                  border: isAuthenticated ? 'none' : '1px solid rgba(57, 255, 20, 0.3)',
                  color: isAuthenticated ? '#000' : 'var(--neon-green)',
                }}
              >
                {isAuthenticated ? '⚡ Pay Now' : '🔒 Pay Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div className="card-back glass-panel-strong" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="macos-title-bar">
            <span className="macos-dot red" />
            <span className="macos-dot yellow" />
            <span className="macos-dot green" />
            <span className="macos-title-text">{data.title} — Details</span>
          </div>
          <div className="df-card-body">
            <div className="df-card-content">
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--neon-green)',
                  marginBottom: '16px',
                }}
              >
                // Features
              </h4>
              <ul
                className="df-card-feature-list"
              >
                {data.features.map((feature, i) => (
                  <li
                    key={i}
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ color: 'var(--neon-green)', fontSize: '10px' }}>▸</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="df-card-footer">
              <button
                className="df-card-cta"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCTA();
                }}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background:
                    data.ctaAction === 'payment' && isAuthenticated
                      ? 'linear-gradient(135deg, var(--neon-green), #2dd40f)'
                      : !isAuthenticated
                        ? 'rgba(57, 255, 20, 0.1)'
                        : undefined,
                  border: !isAuthenticated ? '1px solid rgba(57, 255, 20, 0.3)' : undefined,
                  color: !isAuthenticated ? 'var(--neon-green)' : undefined,
                }}
              >
                {isAuthenticated
                  ? data.ctaAction === 'payment'
                    ? '💳 Pay Now'
                    : data.ctaText
                  : '🔒 Sign In to Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
