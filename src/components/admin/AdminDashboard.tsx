import { useState, useEffect } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import type { Service, Order } from '@/types';
import ProductManager from './ProductManager';
import OrderList from './OrderList';

const statusColors: Record<Order['status'], string> = {
  pending: '#febc2e',
  processing: '#007AFF',
  completed: '#28c840',
  cancelled: '#ff5f57',
  failed: '#ff5f57',
};

const ADMIN_PASSWORD = '@devforge0';
const ADMIN_SESSION_KEY = 'devforge_admin_unlocked_v1';

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useAdmin();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats' | 'content'>('stats');
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteDescription, setSiteDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const v = sessionStorage.getItem(ADMIN_SESSION_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (v === '1') setIsUnlocked(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;

    // Firestore removed — stub admin data
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setServices([]);
    setOrders([]);
    setSiteDescription('Firestore disabled — admin data not available');
    setLoading(false);
  }, [isUnlocked]);

  const handleAddService = async (service: Omit<Service, 'id' | 'createdAt'>) => {
    const newService = { ...service, id: 'local-' + Date.now(), createdAt: new Date() } as Service;
    setServices((prev) => [newService, ...prev]);
    console.warn('Firestore removed: add service stubbed', service);
  };

  const handleDeleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    console.warn('Firestore removed: delete service stubbed', id);
  };

  const handleUpdateOrder = async (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date() } : o)),
    );
    console.warn('Firestore removed: update order stubbed', id, status);
  };

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Blurred authentication overlay (appears before access) */}
      {!isUnlocked && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background:
              'radial-gradient(900px 500px at 20% 20%, rgba(57,255,20,0.12), transparent 55%), radial-gradient(900px 500px at 80% 30%, rgba(0,122,255,0.12), transparent 55%), rgba(5,6,10,0.72)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            className="glass-panel-strong"
            style={{
              width: 'min(560px, 100%)',
              padding: '28px',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 18px 60px rgba(0,0,0,0.55)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Secure Admin Access
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  Enter the admin password to unlock the dashboard.
                </p>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  background: 'rgba(255,255,255,0.03)',
                  whiteSpace: 'nowrap',
                }}
              >
                Ctrl + Win + Alt
              </div>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', gap: '10px' }}>
              <input
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setAuthError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  const ok = passwordInput === ADMIN_PASSWORD;
                  if (!ok) {
                    setAuthError('Incorrect password.');
                    return;
                  }
                  try {
                    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
                  } catch {
                    // ignore
                  }
                  setIsUnlocked(true);
                }}
                type="password"
                placeholder="Admin password"
                autoFocus
                spellCheck={false}
                style={{
                  flex: 1,
                  padding: '12px 12px',
                  borderRadius: '10px',
                  border: authError ? '1px solid rgba(255,95,87,0.55)' : '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(0,0,0,0.25)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                }}
              />
              <button
                onClick={() => {
                  const ok = passwordInput === ADMIN_PASSWORD;
                  if (!ok) {
                    setAuthError('Incorrect password.');
                    return;
                  }
                  try {
                    sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
                  } catch {
                    // ignore
                  }
                  setIsUnlocked(true);
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(57,255,20,0.35)',
                  background: 'linear-gradient(135deg, rgba(57,255,20,0.20), rgba(0,122,255,0.12))',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Unlock
              </button>
            </div>

            {authError && (
              <div style={{ marginTop: '10px', color: '#ff5f57', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {authError}
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.6 }}>
                {isSignedIn && user?.primaryEmailAddress?.emailAddress ? (
                  <span>
                    Signed in as <span style={{ color: 'var(--text-secondary)' }}>{user.primaryEmailAddress.emailAddress}</span>
                  </span>
                ) : (
                  <span>Not signed in (password unlock still required)</span>
                )}
              </div>
              <button
                onClick={() => {
                  setPasswordInput('');
                  setAuthError(null);
                  try {
                    sessionStorage.removeItem(ADMIN_SESSION_KEY);
                  } catch {
                    // ignore
                  }
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  textDecoration: 'underline',
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          padding: '80px 40px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
      {/* Admin Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', marginBottom: '8px' }}>
          <span className="neon-green-text">Admin</span>
          <span style={{ color: 'var(--text-primary)' }}> Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          Manage products, orders, and services
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          background: 'rgba(255,255,255,0.03)',
          padding: '4px',
          borderRadius: '8px',
          width: 'fit-content',
        }}
      >
        {(['stats', 'products', 'orders', 'content'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === tab ? 'rgba(57,255,20,0.1)' : 'transparent',
              color: activeTab === tab ? 'var(--neon-green)' : 'var(--text-muted)',
              textTransform: 'capitalize',
            }}
          >
            {tab} ({tab === 'products' ? services.length : orders.length})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Loading data from Firestore...
          </p>
        </div>
      ) : activeTab === 'stats' ? (
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', marginBottom: '24px' }}>
            Payment Statistics
          </h3>
          {(() => {
            const completedPayments = orders.filter((o) => o.status === 'completed');
            const failedPayments = orders.filter((o) => o.status === 'failed' || o.status === 'cancelled');
            const successfulUsers = new Set(completedPayments.map((o) => o.userEmail)).size;

            return (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                  }}
                >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', color: '#28c840' }}>✅</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 'bold', color: '#28c840' }}>
                {successfulUsers}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Users with Successful Payments</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', color: '#28c840' }}>💳</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 'bold', color: '#28c840' }}>
                {completedPayments.length}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Completed Payments</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', color: '#ff5f57' }}>❌</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 'bold', color: '#ff5f57' }}>
                {failedPayments.length}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Failed Payments</div>
            </div>
          </div>
          <div style={{ marginTop: '34px' }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', marginBottom: '14px' }}>
              Payment Management (All Users)
            </h4>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Name', 'Email ID', 'Phone (Priority)', 'Service', 'Status', 'Payment ID'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{order.userName}</span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{order.userEmail}</span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 10px',
                            borderRadius: '10px',
                            border: '1px solid rgba(57,255,20,0.38)',
                            background: 'rgba(57,255,20,0.08)',
                            boxShadow: '0 0 18px rgba(57,255,20,0.12)',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span style={{ color: 'var(--neon-green)' }}>☎</span>
                          {order.userPhone || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{order.serviceTitle}</span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: statusColors[order.status], fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          {order.paymentId || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
              </>
            );
          })()}
        </div>
      ) : activeTab === 'products' ? (
        <ProductManager
          services={services}
          onAdd={handleAddService}
          onDelete={handleDeleteService}
        />
      ) : activeTab === 'content' ? (
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', marginBottom: '24px' }}>
            Site Content Editor
          </h3>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
              Site Description (shown on homepage)
            </label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                resize: 'vertical',
                outline: 'none',
              }}
              placeholder="Enter site description..."
            />
            <button
              onClick={async () => {
                try {
                  console.log('Stub: Update description:', siteDescription);
                  alert('Description saved successfully!');
                } catch (err) {
                  console.error('Failed to save description:', err);
                  alert('Failed to save description.');
                }
              }}
              style={{
                marginTop: '16px',
                padding: '10px 20px',
                background: 'var(--neon-green)',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Save Description
            </button>
          </div>
        </div>
      ) : (
        <OrderList orders={orders} onUpdateStatus={handleUpdateOrder} />
      )}
      </div>
    </div>
  );
}
