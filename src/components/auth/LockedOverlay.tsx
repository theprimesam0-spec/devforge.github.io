import { useNavigate } from 'react-router-dom';

export default function LockedOverlay() {
  const navigate = useNavigate();

  return (
    <div className="locked-overlay">
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          🔒
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '16px',
            color: 'var(--text-primary)',
          }}
        >
          Members Only
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            maxWidth: '280px',
          }}
        >
          Sign in to unlock premium developer tools and services
        </p>
        <button
          className="btn-primary"
          style={{ marginTop: '8px' }}
          onClick={() => navigate('/sign-in')}
        >
          Sign In to Unlock
        </button>
      </div>
    </div>
  );
}
