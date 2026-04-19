/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from 'react';
import { WHATSAPP_NUMBER } from '@/config/constants';
import { askAI } from '@/utils/ai';

// ============================================================
// DevForge AI — Knowledge Base & Response Engine
// ============================================================

interface KBEntry {
  keywords: string[];
  response: string;
}

import KNOWLEDGE_BASE_RAW from '@/data/knowledge_base.json';
const KNOWLEDGE_BASE: KBEntry[] = KNOWLEDGE_BASE_RAW as KBEntry[];

// Fallback responses when no match is found
const FALLBACK_RESPONSES = [
  `I'm not sure about that specific question, but I can help with DevForge services, pricing, EXE conversion, local support, and more. Try asking something like "What services do you offer?" or "How much does EXE conversion cost?"`,
  `That's a great question! I don't have a specific answer for that yet. For detailed queries, please WhatsApp us at 7549159228 — Sam will help you personally! 💬`,
  `Hmm, I'm still learning! 🤖 For now, I can answer questions about DevForge services, pricing, location, and how to order. Try rephrasing your question, or reach out on WhatsApp at 7549159228.`,
];

// ---- Response Engine ----
function computeBestMatch(query: string): { score: number; response: string } {
  const q = query.toLowerCase().trim();
  let bestScore = 0;
  let bestResponse = '';

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestResponse = entry.response;
    }
  }

  return { score: bestScore, response: bestResponse };
}

function findBestResponse(query: string): string {
  const q = query.toLowerCase().trim();
  const { score, response } = computeBestMatch(query);
  if (score > 0) return response;

  if (q.length < 3) {
    return `Try asking me something! For example:\n• "What is DevForge?"\n• "How to convert script to EXE?"\n• "What are your prices?"\n• "Where are you located?"`;
  }

  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

// ============================================================
// React Component
// ============================================================

interface Message {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

function getTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function DevForgeAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: `Hey! 👋 I'm **DevForge AI** — your instant guide to everything DevForge.\n\nAsk me about our services, pricing, how to order, location, or anything else!`,
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { role: 'user', text: trimmed, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const { score, response } = computeBestMatch(trimmed);

    // If we have a KB match, prefer that (fast, exact site answers)
    if (score > 0) {
      const delay = 200 + Math.random() * 400;
      setTimeout(() => {
        const aiMsg: Message = { role: 'ai', text: response, time: getTime() };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, delay);
      return;
    }

    // Otherwise, attempt to use an external AI provider for general-purpose answers
    const hasAI = Boolean(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY);
    if (!hasAI) {
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      setTimeout(() => {
        const aiMsg: Message = { role: 'ai', text: fallback, time: getTime() };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 300);
      return;
    }

    try {
      // Provide site knowledge to the model so it answers DevForge questions accurately
      const siteKnowledge = KNOWLEDGE_BASE.map((e) => `Keywords: ${e.keywords.join(', ')}\nResponse: ${e.response}`).join('\n\n');
      const reply = await askAI(trimmed, siteKnowledge);
      const aiMsg: Message = { role: 'ai', text: reply, time: getTime() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errMsg = `Sorry, I couldn't reach the AI service. ${err?.message || ''}`;
      setMessages((prev) => [...prev, { role: 'ai', text: errMsg, time: getTime() }]);
    } finally {
      setIsTyping(false);
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: 'What is DevForge?', query: 'What is DevForge?' },
    { label: 'Pricing', query: 'What are your prices?' },
    { label: 'EXE Conversion', query: 'How does script to EXE conversion work?' },
    { label: 'Contact Us', query: 'How can I contact DevForge?' },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-fab"
          aria-label="Open DevForge AI"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            background: 'linear-gradient(135deg, rgba(57,255,20,0.15), rgba(0,122,255,0.15))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 9999,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(57,255,20,0.1)',
            transition: 'all 0.3s ease',
            animation: 'ai-fab-pulse 3s ease-in-out infinite',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 30px rgba(0,0,0,0.5), 0 0 30px rgba(57,255,20,0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.4), 0 0 20px rgba(57,255,20,0.1)';
          }}
        >
          🤖
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="ai-chat-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '400px',
            maxWidth: 'calc(100vw - 48px)',
            height: '560px',
            maxHeight: 'calc(100vh - 48px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(10, 10, 15, 0.97)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(57,255,20,0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            animation: 'ai-slide-up 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(57,255,20,0.2), rgba(0,122,255,0.2))',
                  border: '1px solid rgba(57,255,20,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px', color: 'var(--neon-green)' }}>
                    Dev
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '14px', color: 'var(--brand-blue)' }}>
                    Forge AI
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--neon-green)',
                      boxShadow: '0 0 6px var(--neon-green)',
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    online
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,95,87,0.1)',
                border: '1px solid rgba(255,95,87,0.15)',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ff5f57',
                fontSize: '14px',
                fontWeight: 700,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,95,87,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,95,87,0.1)';
              }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'ai-msg-in 0.3s ease-out',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(57,255,20,0.12), rgba(0,122,255,0.12))'
                        : 'rgba(255,255,255,0.04)',
                    border:
                      msg.role === 'user'
                        ? '1px solid rgba(57,255,20,0.15)'
                        : '1px solid rgba(255,255,255,0.06)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: msg.role === 'user' ? 'var(--text-primary)' : 'var(--text-secondary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text.split('\n').map((line, j) => {
                    // Simple markdown: bold with **text**
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                      <span key={j}>
                        {j > 0 && <br />}
                        {parts.map((part, k) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={k} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          // Handle links in responses
                          const urlMatch = part.match(/(https?:\/\/[^\s]+)/g);
                          if (urlMatch) {
                            const splitByUrls = part.split(/(https?:\/\/[^\s]+)/g);
                            return splitByUrls.map((seg, si) =>
                              seg.match(/^https?:\/\//) ? (
                                <a
                                  key={`${k}-${si}`}
                                  href={seg}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: 'var(--brand-blue)', textDecoration: 'underline' }}
                                >
                                  {seg}
                                </a>
                              ) : (
                                <span key={`${k}-${si}`}>{seg}</span>
                              ),
                            );
                          }
                          return <span key={k}>{part}</span>;
                        })}
                      </span>
                    );
                  })}
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginTop: '4px',
                    padding: '0 4px',
                  }}
                >
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px 12px 12px 4px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                  }}
                >
                  <span className="ai-typing-dot" style={{ animationDelay: '0ms' }}>●</span>
                  <span className="ai-typing-dot" style={{ animationDelay: '200ms' }}>●</span>
                  <span className="ai-typing-dot" style={{ animationDelay: '400ms' }}>●</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions (show only at start) */}
          {messages.length <= 1 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '0 16px 8px',
              }}
            >
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setInput(action.query);
                    // Auto-send
                    const userMsg: Message = { role: 'user', text: action.query, time: getTime() };
                    setMessages((prev) => [...prev, userMsg]);
                    setIsTyping(true);
                    setTimeout(() => {
                      const response = findBestResponse(action.query);
                      const aiMsg: Message = { role: 'ai', text: response, time: getTime() };
                      setMessages((prev) => [...prev, aiMsg]);
                      setIsTyping(false);
                    }, 400 + Math.random() * 400);
                    setInput('');
                  }}
                  style={{
                    background: 'rgba(57,255,20,0.06)',
                    border: '1px solid rgba(57,255,20,0.15)',
                    borderRadius: '16px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--neon-green)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(57,255,20,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(57,255,20,0.06)';
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp CTA */}
          <div
            style={{
              padding: '6px 16px',
              borderTop: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi DevForge! I have a question that the AI couldn\'t answer. Can you help?')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: '#25d366',
                textDecoration: 'none',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7'; }}
            >
              💬 Can't find your answer? Chat with us on WhatsApp
            </a>
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask DevForge AI anything..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(57,255,20,0.3)';
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              style={{
                background: input.trim()
                  ? 'linear-gradient(135deg, rgba(57,255,20,0.2), rgba(0,122,255,0.2))'
                  : 'rgba(255,255,255,0.04)',
                border: input.trim()
                  ? '1px solid rgba(57,255,20,0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: input.trim() ? 'var(--neon-green)' : 'var(--text-muted)',
                fontSize: '14px',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
