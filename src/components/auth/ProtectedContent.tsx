import { useUser } from '@/hooks/useUser';
import LockedOverlay from './LockedOverlay';
import type { ReactNode } from 'react';

interface ProtectedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedContent({ children, fallback }: ProtectedContentProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid var(--glass-border)',
            borderTopColor: 'var(--neon-green)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }}
        />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="locked-content" style={{ position: 'relative' }}>
        <div style={{ filter: 'blur(6px)', pointerEvents: 'none' }}>
          {fallback || children}
        </div>
        <LockedOverlay />
      </div>
    );
  }

  return <>{children}</>;
}
