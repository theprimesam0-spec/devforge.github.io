import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import descriptionMd from '../../../description.md?raw';

export default function DescriptionSection() {
  return (
    <section
      id="description"
      style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div style={{ marginBottom: '18px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(22px, 2.6vw, 34px)',
            marginBottom: '10px',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{'// '}</span>
          <span className="neon-green-text">Description</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '760px' }}>
          Content is loaded from <span style={{ fontFamily: 'var(--font-mono)' }}>description.md</span> in the project root.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '26px' }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            h1: (p) => (
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', margin: '0 0 10px', color: 'var(--text-primary)' }} {...p} />
            ),
            h2: (p) => (
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', margin: '0 0 10px', color: 'var(--text-primary)' }} {...p} />
            ),
            h3: (p) => (
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', margin: '18px 0 8px', color: 'var(--text-primary)' }} {...p} />
            ),
            p: (p) => (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '14px', margin: '10px 0' }} {...p} />
            ),
            ul: (p) => (
              <ul style={{ margin: '10px 0 0', paddingLeft: '18px', color: 'var(--text-secondary)', lineHeight: 1.9 }} {...p} />
            ),
            li: (p) => <li style={{ margin: '6px 0' }} {...p} />,
            code: (p) => (
              <code
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  padding: '2px 6px',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                }}
                {...p}
              />
            ),
            a: (p) => (
              <a style={{ color: 'var(--neon-green)', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" {...p} />
            ),
          }}
        >
          {descriptionMd}
        </ReactMarkdown>
      </div>
    </section>
  );
}

