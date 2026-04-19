import type { Order } from '@/types';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => Promise<void>;
}

const statusColors: Record<Order['status'], string> = {
  pending: '#febc2e',
  processing: '#007AFF',
  completed: '#28c840',
  cancelled: '#ff5f57',
  failed: '#ff5f57',
};

export default function OrderList({ orders, onUpdateStatus }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          No orders yet. Orders will appear here when customers place them.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {orders.map((order) => (
        <div
          key={order.id}
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {order.serviceTitle}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              {order.userName} ({order.userEmail})
              {order.userPhone && ` - ${order.userPhone}`}
              {order.fileName && <> — File: {order.fileName}</>}
            </p>
          </div>

          <span
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: statusColors[order.status],
              background: `${statusColors[order.status]}15`,
              border: `1px solid ${statusColors[order.status]}30`,
              textTransform: 'uppercase',
            }}
          >
            {order.status}
          </span>

          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
            style={{
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
