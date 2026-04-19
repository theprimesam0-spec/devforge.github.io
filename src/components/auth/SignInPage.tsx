import MarqueeStrip from '../layout/MarqueeStrip';
import { useEffect, useState } from 'react';
import { SignIn } from '@clerk/clerk-react';

const ALL_SNIPPETS = [
  `const socialLinks = {
  instagram: "@prime.dev0",
  youtube: "primedev-0",
  phone: "7549159228",
  location: "Darbhanga, Bihar"
}`,
  `import { forge } from "@devforge/core";
forge.build()
  .auth.config({
    providers: ["google", "phone"],
    secure: true
  })`,
  `const services = await DevForge.getServices();
console.log("Welcome to DevForge");
// Google • Phone Auth`,
  `$ devforge --convert app.py
const convert = async (file) => {
  const exe = await forge.compile(file);
  return exe; // ₹10 per conversion
}`,
  `// PC Formatting = Darbhanga, Bihar
import { forge } from "@devforge/core";
forge.build()
  .auth.forgeInit({
    mode: "production",
    region: "IN"
  });`,
  `const order = await auth.signIn();
export default DevForge;
// Web Development • Data Recovery`,
  `auth.google()
auth.phone()
// Secure Authentication by Clerk`,
  `DevForge.services = {
  converter: "₹10",
  formatting: "₹500",
  webdev: "₹20,000+",
  recovery: "₹299+"
}`,
  `// Local Tech Support
const support = {
  area: "Biraul, Darbhanga",
  hours: "Mon-Sat 10AM-7PM",
  radius: "5km home visits"
}`,
  `function initDevForge() {
  console.log("⚡ DevForge Ready");
  return {
    convert: true,
    secure: true,
    fast: true
  };
}`,
  `// Right Side Code
const forge = {
  name: "DevForge",
  version: "2.0.0",
  status: "online"
}`,
  `async function deploy() {
  await build();
  await test();
  return "🚀 Live!";
}`,
];

export default function SignInPage() {
  const [codeSnippets, setCodeSnippets] = useState([
    { text: '', x: 40, y: 80, delay: 0, side: 'left', right: 0 },
    { text: '', x: 40, y: 280, delay: 2000, side: 'left', right: 0 },
    { text: '', x: 40, y: 480, delay: 4000, side: 'left', right: 0 },
    { text: '', x: 0, right: 40, y: 120, delay: 1000, side: 'right' },
    { text: '', x: 0, right: 40, y: 360, delay: 3000, side: 'right' },
  ]);

  useEffect(() => {
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const snippetState = codeSnippets.map((_, index) => ({
      snippetIndex: index % ALL_SNIPPETS.length,
      currentChar: 0,
      isDeleting: false,
      pauseUntil: 0,
    }));

    const startTypingFor = (i: number) => {
      const tick = () => {
        const now = Date.now();
        const st = snippetState[i];
        const currentSnippet = ALL_SNIPPETS[st.snippetIndex] ?? '';

        if (st.pauseUntil && now < st.pauseUntil) {
          timers.push(setTimeout(tick, 60));
          return;
        }

        if (!st.isDeleting) {
          st.currentChar = Math.min(st.currentChar + 1, currentSnippet.length);
          if (st.currentChar === currentSnippet.length) {
            st.pauseUntil = now + 1600;
            st.isDeleting = true;
          }
        } else {
          st.currentChar = Math.max(st.currentChar - 1, 0);
          if (st.currentChar === 0) {
            st.isDeleting = false;
            st.pauseUntil = now + 400;
            st.snippetIndex = (st.snippetIndex + 1) % ALL_SNIPPETS.length;
          }
        }

        const nextText = currentSnippet.substring(0, st.currentChar);
        setCodeSnippets((prev) => {
          const next = [...prev];
          next[i] = { ...next[i], text: nextText };
          return next;
        });

        const base = st.isDeleting ? 18 : 34;
        const jitter = Math.floor(Math.random() * 18);
        timers.push(setTimeout(tick, base + jitter));
      };

      timers.push(setTimeout(tick, codeSnippets[i]?.delay ?? 0));
    };

    for (let i = 0; i < codeSnippets.length; i++) startTypingFor(i);
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-dark)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {codeSnippets.map((snippet, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: snippet.side === 'left' ? `${snippet.x}px` : 'auto',
            right: snippet.side === 'right' ? `${snippet.right}px` : 'auto',
            top: `${snippet.y}px`,
            maxWidth: snippet.side === 'left' ? '450px' : '380px',
            opacity: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: snippet.side === 'left' ? '13px' : '14px',
            lineHeight: 1.9,
            fontWeight: 600,
            color: snippet.side === 'left' ? 'var(--neon-green)' : 'var(--brand-blue)',
            pointerEvents: 'none',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            textShadow: snippet.side === 'left'
              ? '0 0 5px rgba(57, 255, 20, 1), 0 0 10px rgba(57, 255, 20, 1), 0 0 15px rgba(57, 255, 20, 0.9), 0 0 20px rgba(57, 255, 20, 0.8), 0 0 30px rgba(57, 255, 20, 0.7), 0 0 40px rgba(57, 255, 20, 0.6), 0 0 50px rgba(57, 255, 20, 0.5), 0 0 60px rgba(57, 255, 20, 0.4)'
              : '0 0 5px rgba(0, 122, 255, 1), 0 0 10px rgba(0, 122, 255, 1), 0 0 15px rgba(0, 122, 255, 0.9), 0 0 20px rgba(0, 122, 255, 0.8), 0 0 30px rgba(0, 122, 255, 0.7), 0 0 40px rgba(0, 122, 255, 0.6), 0 0 50px rgba(0, 122, 255, 0.5), 0 0 60px rgba(0, 122, 255, 0.4)',
            filter: snippet.side === 'left'
              ? 'drop-shadow(0 0 15px rgba(57, 255, 20, 1)) drop-shadow(0 0 30px rgba(57, 255, 20, 0.8)) brightness(1.5)'
              : 'drop-shadow(0 0 15px rgba(0, 122, 255, 1)) drop-shadow(0 0 30px rgba(0, 122, 255, 0.8)) brightness(1.5)',
            background: 'transparent',
            padding: '0',
            borderRadius: '0',
            border: 'none',
            animation: snippet.side === 'left'
              ? `zoomInCode 1.5s ease-out ${snippet.delay}ms forwards`
              : `suddenSpawn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${snippet.delay}ms forwards`,
          }}
        >
          {snippet.text}
          <span style={{ opacity: 1, animation: 'blink 1s infinite', color: snippet.side === 'left' ? 'var(--neon-green)' : 'var(--brand-blue)', textShadow: snippet.side === 'left' ? '0 0 10px rgba(57, 255, 20, 1)' : '0 0 10px rgba(0, 122, 255, 1)' }}>█</span>
        </div>
      ))}

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '40px 20px',
          gap: '32px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(57,255,20,0.2), rgba(0,122,255,0.2))',
                border: '1px solid rgba(57,255,20,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800,
                fontSize: '14px',
              }}
            >
              <span style={{ color: 'var(--neon-green)', textShadow: '0 0 10px rgba(57, 255, 20, 0.8), 0 0 20px rgba(57, 255, 20, 0.5)' }}>D</span>
              <span style={{ color: 'var(--brand-blue)', textShadow: '0 0 10px rgba(0, 122, 255, 0.8), 0 0 20px rgba(0, 122, 255, 0.5)' }}>F</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '22px' }}>
              <span style={{
                color: 'var(--neon-green)',
                textShadow: '0 0 10px rgba(57, 255, 20, 1), 0 0 20px rgba(57, 255, 20, 0.8), 0 0 30px rgba(57, 255, 20, 0.6), 0 0 40px rgba(57, 255, 20, 0.4)',
                animation: 'pulse-glow 2s ease-in-out infinite',
                display: 'inline-block',
              }}>Dev</span>
              <span style={{
                color: 'var(--brand-blue)',
                textShadow: '0 0 10px rgba(0, 122, 255, 1), 0 0 20px rgba(0, 122, 255, 0.8), 0 0 30px rgba(0, 122, 255, 0.6), 0 0 40px rgba(0, 122, 255, 0.4)',
                animation: 'pulse-glow 2s ease-in-out infinite',
                display: 'inline-block',
              }}>Forge</span>
            </span>
          </div>
          <p
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            Sign in to place orders &amp; manage purchases
          </p>
        </div>

        {/* Clerk Sign-In Component */}
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/"
          appearance={{
            elements: {
              rootBox: {
                width: 'min(480px, 100%)',
              },
              card: {
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                borderRadius: '14px',
              },
              headerTitle: {
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
              },
              headerSubtitle: {
                color: 'var(--text-secondary)',
              },
              socialButtonsBlockButton: {
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--text-primary)',
              },
              formFieldInput: {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-primary)',
                borderRadius: '10px',
              },
              formButtonPrimary: {
                background: 'linear-gradient(135deg, #39FF14, #00d4aa)',
                color: '#000',
                fontWeight: 700,
                borderRadius: '10px',
              },
              footerActionLink: {
                color: 'var(--neon-green)',
              },
              dividerLine: {
                background: 'rgba(255,255,255,0.08)',
              },
              dividerText: {
                color: 'var(--text-muted)',
              },
            },
          }}
        />
      </div>

      <MarqueeStrip />

      <div
        style={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '16px' }}>
            <span className="neon-green-text">Dev</span>
            <span className="brand-blue-text">Forge</span>
          </span>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', marginTop: '2px' }}>
            by sam · Darbhanga, Bihar
          </p>
        </div>
      </div>
    </div>
  );
}