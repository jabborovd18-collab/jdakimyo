// lib/ai-agents/ai-gateway.js
//
// JDA KIMYO AI — UNIVERSAL AI GATEWAY & RESILIENT CALLER (v2.0.0)
// Groq (120B / Qwen) -> OpenRouter (MiniMax / Nemotron) -> Gemini (3.6 Flash / 2.5 Flash).

const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'groq/compound'
];

const OPENROUTER_MODELS = [
  'minimax/minimax-m3:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'inclusionai/ling-3.0-flash-fin:free'
];

function getEnvKeys() {
  return {
    groq: (process.env.GROQ_API_KEY || '').trim(),
    openrouter: (process.env.OPENROUTER_API_KEY || '').trim(),
    gemini: (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || '').trim()
  };
}

export async function aiModelChaqir(prompt, { systemPrompt = '', jsonRejim = true, rasmBase64 = null } = {}) {
  const keys = getEnvKeys();

  // 1. GROQ ORQALI CHAQIRISH (Matn bo'lganda ultra-tezkor 120B model)
  if (keys.groq && !rasmBase64) {
    for (const model of GROQ_MODELS) {
      try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + keys.groq,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.15,
            max_tokens: 3500,
            response_format: jsonRejim ? { type: 'json_object' } : undefined
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || '';
          if (content) {
            if (jsonRejim) {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) return JSON.parse(jsonMatch[0]);
            }
            return content;
          }
        }
      } catch (err) {
        console.warn(`[Groq ${model} xatosi]:`, err.message);
      }
    }
  }

  // 2. OPENROUTER ORQALI CHAQIRISH (Matn va Rasm Vision ikkalasini ham a'lo darajada qo'llaydi)
  if (keys.openrouter) {
    for (const model of OPENROUTER_MODELS) {
      try {
        const userContent = rasmBase64
          ? [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: rasmBase64 } }
            ]
          : prompt;

        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: userContent });

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + keys.openrouter,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://jdakimyo.uz',
            'X-Title': 'JDA KIMYO AI'
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.15,
            max_tokens: 3500
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || '';
          if (content) {
            if (jsonRejim) {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) return JSON.parse(jsonMatch[0]);
            }
            return content;
          }
        }
      } catch (err) {
        console.warn(`[OpenRouter ${model} xatosi]:`, err.message);
      }
    }
  }

  // 3. GEMINI ORQALI CHAQIRISH (Multimodal va matn)
  if (keys.gemini) {
    const geminiModellar = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    for (const m of geminiModellar) {
      try {
        const parts = [{ text: (systemPrompt ? `${systemPrompt}\n\n` : '') + prompt }];

        if (rasmBase64 && typeof rasmBase64 === 'string') {
          let mimeType = 'image/jpeg';
          let base64Data = rasmBase64;
          if (rasmBase64.includes(';base64,')) {
            const split = rasmBase64.split(';base64,');
            mimeType = split[0].replace('data:', '');
            base64Data = split[1];
          }
          parts.unshift({
            inlineData: {
              mimeType,
              data: base64Data.trim()
            }
          });
        }

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${keys.gemini}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.15,
              responseMimeType: jsonRejim ? 'application/json' : undefined
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (candidateText) {
            if (jsonRejim) {
              const jsonMatch = candidateText.match(/\{[\s\S]*\}/);
              if (jsonMatch) return JSON.parse(jsonMatch[0]);
            }
            return candidateText;
          }
        }
      } catch (err) {
        console.warn(`[Gemini ${m} xatosi]:`, err.message);
      }
    }
  }

  return null;
}
