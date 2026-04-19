import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '@/config/constants';
import { useState } from 'react';

export default function Hero() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [siteDescription] = useState('Premium script-to-EXE conversion, custom software development, and hands-on local hardware support. Your neighborhood software lab, engineered for the modern developer.');

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      'Hi DevForge! I want to place a quick order. Please share the details.',
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  return (
    <section
      style={{
        padding: '120px 20px 80px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <div className="animate-fade-in-up hero-content" style={{ maxWidth: '700px', position: 'relative', zIndex: 2 }}>
        {/* Terminal-style tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(57, 255, 20, 0.06)',
            border: '1px solid rgba(57, 255, 20, 0.15)',
            borderRadius: '20px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--neon-green)',
              boxShadow: '0 0 8px var(--neon-green)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--neon-green)',
            }}
          >
            System Online — Build. Convert. Deploy.
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '20px' }}>
          <span className="neon-green-text animate-pulse-glow">Dev</span>
          <span className="brand-blue-text">Forge</span>
          <br />
          <span style={{ color: 'var(--text-primary)', fontSize: '0.6em' }}>
            Developer Tools &amp; Tech Support
          </span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            lineHeight: 1.8,
            marginBottom: '36px',
            maxWidth: '550px',
          }}
        >
          {siteDescription || 'Premium script-to-EXE conversion, custom software development, and hands-on local hardware support. Your neighborhood software lab, engineered for the modern developer.'}
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%', maxWidth: '500px' }}>
          {isSignedIn ? (
            <>
              <a href="#services" className="btn-primary">
                Browse Solutions
              </a>
              <button className="btn-secondary" onClick={handleWhatsApp}>
                Quick WhatsApp Order
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={() => navigate('/sign-in')}>
                Sign In to Browse Solutions
              </button>
              <button className="btn-secondary" disabled>
                Quick WhatsApp Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* Website-only showcase images */}
      <div style={{ marginTop: '48px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '14px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>
            <span style={{ color: 'var(--text-muted)' }}>{'// '}</span>
            Showcase
          </h3>

        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '16px',
          }}
        >
          {[
            { src: `${import.meta.env.BASE_URL}showcase-2.png`, alt: 'DevForge fullstack development showcase' },
            { src: `${import.meta.env.BASE_URL}showcase-3.png`, alt: 'DevForge developer workspace showcase' },
          ].map((img) => (
            <div
              key={img.src}
              className="glass-panel"
              style={{
                padding: '10px',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                overflow: 'hidden',
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  aspectRatio: '2 / 3',
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
