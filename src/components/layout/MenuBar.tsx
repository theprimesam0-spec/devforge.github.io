import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function MenuBar() {
  const [time, setTime] = useState(new Date());
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header
      className="menu-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 'var(--menu-bar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0',
        zIndex: 1000,
        borderRadius: 0,
        background: 'rgba(17, 17, 24, 0.85)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <div className="menu-bar-logo" style={{ display: 'flex', alignItems: 'center', gap: '2px', paddingLeft: '20px' }}>
        <span
          className="animate-pulse-glow"
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '14px',
            color: 'var(--neon-green)',
          }}
        >
          Dev
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 800,
            fontSize: '14px',
            color: 'var(--brand-blue)',
            textShadow: '0 0 10px rgba(0,122,255,0.5)',
          }}
        >
          Forge
        </span>
      </div>

      {/* Center - Navigation */}
      <nav
        className="menu-bar-nav"
        style={{
          display: 'flex',
          gap: '24px',
          fontSize: '13px',
          fontWeight: 500,
        }}
      >
        <a href="#services" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Services
        </a>
        <a href="#converter" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Converter
        </a>
        <a href="#support" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Support
        </a>
      </nav>

      {/* Right - Clock & Auth */}
      <div className="menu-bar-right" style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingRight: '20px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}
        >
          {formattedDate} {formattedTime}
        </span>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button
            onClick={() => navigate('/sign-in')}
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              border: '1px solid rgba(57, 255, 20, 0.3)',
              color: 'var(--neon-green)',
              padding: '4px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
