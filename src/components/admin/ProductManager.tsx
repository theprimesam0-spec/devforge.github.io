import { useState } from 'react';
import type { Service } from '@/types';

interface ProductManagerProps {
  services: Service[];
  onAdd: (service: Omit<Service, 'id' | 'createdAt'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  outline: 'none',
};

export default function ProductManager({ services, onAdd, onDelete }: ProductManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    priceLabel: '',
    icon: '',
    category: 'digital' as Service['category'],
    features: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd({
      ...formData,
      features: formData.features.split('\n').filter(Boolean),
    });
    setFormData({
      title: '',
      description: '',
      price: 0,
      priceLabel: '',
      icon: '',
      category: 'digital',
      features: '',
      isActive: true,
    });
    setShowForm(false);
  };

  return (
    <div>
      {/* Add Product Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel"
          style={{
            padding: '28px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Title
            </label>
            <input
              style={inputStyle}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Price Label (e.g., "₹500")
            </label>
            <input
              style={inputStyle}
              value={formData.priceLabel}
              onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Price (numeric)
            </label>
            <input
              style={inputStyle}
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Icon (emoji)
            </label>
            <input
              style={inputStyle}
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g. ⚡"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Category
            </label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Service['category'] })}
            >
              <option value="digital">Digital</option>
              <option value="local">Local</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Description
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              Features (one per line)
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button className="btn-primary" type="submit">
              Save Product
            </button>
          </div>
        </form>
      )}

      {/* Product List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {services.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              No products found. Add your first product above.
            </p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '24px' }}>{service.icon}</span>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-primary)' }}>
                    {service.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    {service.priceLabel} — {service.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDelete(service.id)}
                style={{
                  background: 'rgba(255, 95, 87, 0.1)',
                  border: '1px solid rgba(255, 95, 87, 0.3)',
                  color: '#ff5f57',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
