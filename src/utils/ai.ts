export async function askAI(userMessage: string, siteKnowledge = '', model?: string): Promise<string> {
  const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  const openrouterModelDefault = (import.meta.env.VITE_OPENROUTER_MODEL as string) || 'gpt-4o-mini';
  const geminiModelDefault = (import.meta.env.VITE_GEMINI_MODEL as string) || 'models/gemini-2.5-flash';

  if (!openrouterKey && !geminiKey) {
    throw new Error('No AI API key set. Set VITE_OPENROUTER_API_KEY or VITE_GEMINI_API_KEY to enable DevForge AI general answers.');
  }

  const systemInstruction = `You are DevForge AI — a helpful assistant. Use the site knowledge below when answering DevForge-specific questions. Be factual, concise, and provide clear, general-purpose explanations for other topics as well.\n\nSite Knowledge:\n${siteKnowledge}`;

  // Prefer OpenRouter if configured (user-provided key), fallback to Google Gemini
  if (openrouterKey) {
    try {
      const chosenModel = model || openrouterModelDefault;
      const messages = [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userMessage },
      ];

      const body = {
        model: chosenModel,
        messages,
        temperature: 0.2,
        max_tokens: 800,
      };

      // If running in the browser, call a local proxy endpoint to avoid CORS and leaking secrets.
      // The proxy should forward the request to OpenRouter using a server-side secret `OPENROUTER_API_KEY`.
      let resp: Response;
      let data: any;
      if (typeof window !== 'undefined') {
        resp = await fetch('/api/openrouter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const txt = await resp.text();
        try { data = JSON.parse(txt); } catch (e) { data = { raw: txt }; }
        if (!resp.ok) {
          const err = data?.error?.message || data?.error || txt || JSON.stringify(data);
          throw new Error(err);
        }
      } else {
        resp = await fetch('https://api.openrouter.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openrouterKey}`,
          },
          body: JSON.stringify(body),
        });
        data = await resp.json();
        if (!resp.ok) {
          const err = data?.error?.message || JSON.stringify(data);
          throw new Error(err);
        }
      }

      // Flexible extraction to handle slight response shape differences
      let reply = '';
      const choice = data?.choices?.[0];
      if (choice) {
        if (choice.message) {
          if (typeof choice.message === 'string') reply = choice.message;
          else if (typeof choice.message.content === 'string') reply = choice.message.content;
          else if (Array.isArray(choice.message.content) && choice.message.content.length) {
            const first = choice.message.content[0];
            reply = typeof first === 'string' ? first : (first?.text || '');
          }
        } else if (choice.text) {
          reply = choice.text;
        } else if (choice.content) {
          reply = choice.content;
        }
      }

      return (reply || '').trim();
    } catch (err: any) {
      // If OpenRouter failed (network, DNS, etc), log and fall back to Gemini if available.
      // Allow execution to continue to the Gemini fallback below when a Gemini key exists.
      console.warn('OpenRouter request failed:', err && err.message ? err.message : err);
      if (!geminiKey) {
        throw err;
      }
    }
  }

  // Google Gemini fallback
  const chosenGeminiModel = model || geminiModelDefault;
  const payload = {
    system_instruction: { parts: { text: systemInstruction } },
    contents: [
      { role: 'user', parts: [{ text: userMessage }] }
    ]
  };

  // Try the chosen Gemini model, with fallbacks if the model isn't available for generateContent.
  const candidateModels = [chosenGeminiModel, 'models/gemini-flash-latest', 'models/gemini-2.5-flash', 'models/gemini-2.5-flash-lite'];
  let lastErr: any = null;
  for (const gm of candidateModels) {
    try {
      const respGem = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${gm}:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const dataGem: any = await respGem.json();
      if (!respGem.ok) {
        lastErr = dataGem?.error?.message || JSON.stringify(dataGem);
        continue;
      }

      return dataGem.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    } catch (e: any) {
      lastErr = e && e.message ? e.message : e;
      continue;
    }
  }

  throw new Error(lastErr || 'Gemini request failed for all fallback models.');
}
