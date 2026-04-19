import { useState, useRef, useCallback } from 'react';
import { useUser } from '@/hooks/useUser';
import { WHATSAPP_NUMBER } from '@/config/constants';
import ProtectedContent from '../auth/ProtectedContent';

const ALLOWED_EXTENSIONS = ['.cmd', '.bat', '.ps1', '.py'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ScriptConverter() {
  const { isSignedIn } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    setError('');
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size: 10MB');
      return false;
    }
    return true;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    },
    [validateFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleWhatsAppOrder = () => {
    if (!selectedFile) return;
    const msg = encodeURIComponent(
      `Hi DevForge! I want to convert my script to EXE.\n\nFile: ${selectedFile.name}\nSize: ${(selectedFile.size / 1024).toFixed(1)}KB\nType: ${selectedFile.name.split('.').pop()?.toUpperCase()}\n\nPlease process my order (₹10 / $0.12).`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  const converterContent = (
    <div className="glass-panel" style={{ padding: '32px', marginTop: '24px' }}>
      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".cmd,.bat,.ps1,.py"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>
          {selectedFile ? '✅' : '📁'}
        </div>
        <div style={{ minHeight: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {selectedFile ? (
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--neon-green)',
                  fontSize: '14px',
                  marginBottom: '4px',
                }}
              >
                {selectedFile.name}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB — Click to change
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '8px' }}>
                Drag & drop your script here
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                or click to browse — Supports .cmd, .bat, .ps1, .py (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p
          style={{
            color: '#ff5f57',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            marginTop: '12px',
          }}
        >
          ⚠ {error}
        </p>
      )}

      {/* Order Button */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-primary"
          disabled={!selectedFile || !isSignedIn}
          onClick={handleWhatsAppOrder}
        >
          Order via WhatsApp — ₹10 / $0.12
        </button>
        {selectedFile && (
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
            onClick={() => {
              setSelectedFile(null);
              setError('');
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section
      id="converter"
      style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(24px, 3vw, 36px)',
            marginBottom: '12px',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{'// '}</span>
          <span style={{ color: 'var(--text-primary)' }}>Script-to-</span>
          <span className="neon-green-text">EXE</span>
          <span style={{ color: 'var(--text-primary)' }}> Converter</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
          Upload your .cmd, .bat, .ps1, or .py script and get a standalone Windows executable.
          Professional-grade conversion for just ₹10 / $0.12.
        </p>
      </div>

      <ProtectedContent>{converterContent}</ProtectedContent>
    </section>
  );
}
