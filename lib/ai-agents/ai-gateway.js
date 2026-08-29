// lib/ai-agents/ai-gateway.js
//
// JDA KIMYO AI — UNIVERSAL HYBRID AI GATEWAY (v3.2.0 Enterprise)
// DeepSeek-R1 (Reasoner) + Multi-Key Groq LPU + Multi-Key Gemini Vision + OpenRouter Kaskadi.

const GROQ_MODELS = [
  'qwen/qwen3.6-27b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b'
];

const OPENROUTER_MODELS = [
  'deepseek/deepseek-r1:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'minimax/minimax-m3:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'
];

function getEnvKeys() {
  const geminiList = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GOOGLE_AI_KEY
  ].filter(Boolean).map((k) => k.trim()).filter(Boolean);

  const groqList = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2
  ].filter(Boolean).map((k) => k.trim()).filter(Boolean);

  return {
    deepseek: (process.env.DEEPSEEK_API_KEY || '').trim(),
    groqList,
    openrouter: (process.env.OPENROUTER_API_KEY || '').trim(),
    geminiList
  };
}

/**
 * AI javoblaridan JSON strukturasini xavfsiz va xatosiz ajratib olish
 */
function tozaJsonOqi(matn) {
  if (!matn || typeof matn !== 'string') return null;
  
  // 1. To'g'ridan-to'g'ri parse qilish
  try {
    return JSON.parse(matn.trim());
  } catch (e) {}

  // 2. Markdown bloklarini tozalash ```json ... ```
  try {
    const markdownMatch = matn.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      return JSON.parse(markdownMatch[1].trim());
    }
  } catch (e) {}

  // 3. Birinchi { va oxirgi } oralig'ini qidirish
  try {
    const startIdx = matn.indexOf('{');
    const endIdx = matn.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonStr = matn.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonStr);
    }
  } catch (e) {}

  return null;
}

/**
 * Universal ko'p provayderli va ko'p kalitli AI chaqiruvchi funksiya
 */
export async function aiModelChaqir(prompt, { systemPrompt = '', jsonRejim = true, rasmBase64 = null, preferDeepSeek = false } = {}) {
  const keys = getEnvKeys();

  // 1. DEEPSEEK REASONER (Faqat O'ta Murakkab / Olimpiada masalalari uchun 0% xatosiz dvigatel)
  if (keys.deepseek && !rasmBase64 && preferDeepSeek) {
    const deepseekModels = ['deepseek-reasoner', 'deepseek-chat'];
    for (const model of deepseekModels) {
      try {
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const res = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + keys.deepseek,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: model === 'deepseek-reasoner' ? undefined : 0.15,
            max_tokens: 4000,
            response_format: jsonRejim ? { type: 'json_object' } : undefined
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || '';
          if (content) {
            if (jsonRejim) {
              const parsed = tozaJsonOqi(content);
              if (parsed) return parsed;
            }
            return content;
          }
        } else {
          console.warn(`[DeepSeek ${model} xatosi]:`, res.status, await res.text());
        }
      } catch (err) {
        console.warn(`[DeepSeek ${model} ulanish xatosi]:`, err.message);
      }
    }
  }

  // 2. GROQ TEZKOR SHLYUZI (Multi-Key Load Balancing va Failover)
  if (keys.groqList.length > 0 && !rasmBase64) {
    for (const groqKey of keys.groqList) {
      for (const model of GROQ_MODELS) {
        try {
          const messages = [];
          if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
          messages.push({ role: 'user', content: prompt });

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + groqKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.2,
              max_tokens: 3500,
              response_format: jsonRejim ? { type: 'json_object' } : undefined
            })
          });

          if (res.ok) {
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content || '';
            if (content) {
              if (jsonRejim) {
                const parsed = tozaJsonOqi(content);
                if (parsed) return parsed;
              }
              return content;
            }
          }
        } catch (err) {
          console.warn(`[Groq ${model} xatosi]:`, err.message);
        }
      }
    }
  }

  // 3. OPENROUTER MULTIMODAL SHLYUZI (DeepSeek-R1 Free + Vision OCR)
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
            temperature: 0.2,
            max_tokens: 3500
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || '';
          if (content) {
            if (jsonRejim) {
              const parsed = tozaJsonOqi(content);
              if (parsed) return parsed;
            }
            return content;
          }
        }
      } catch (err) {
        console.warn(`[OpenRouter ${model} xatosi]:`, err.message);
      }
    }
  }

  // 4. GOOGLE GEMINI MULTI-KEY SHLYUZI (Multi-Account Rotation & Vision OCR)
  if (keys.geminiList.length > 0) {
    for (const geminiKey of keys.geminiList) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
        
        const contents = [];
        const parts = [];
        
        if (systemPrompt) {
          parts.push({ text: `[TIZIM KO'RSATMASI]:\n${systemPrompt}\n\n[FOYDALANUVCHI VAZIFASI]:\n` });
        }
        
        if (rasmBase64) {
          const base64Data = rasmBase64.includes(',') ? rasmBase64.split(',')[1] : rasmBase64;
          const mimeType = rasmBase64.includes(';') ? rasmBase64.split(';')[0].replace('data:', '') : 'image/jpeg';
          parts.push({
            inlineData: {
              mimeType,
              data: base64Data
            }
          });
        }
        
        parts.push({ text: prompt });
        contents.push({ role: 'user', parts });

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.15,
              maxOutputTokens: 3500,
              responseMimeType: jsonRejim ? 'application/json' : 'text/plain'
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (content) {
            if (jsonRejim) {
              const parsed = tozaJsonOqi(content);
              if (parsed) return parsed;
            }
            return content;
          }
        } else {
          console.warn(`[Gemini Key xatosi]:`, res.status);
        }
      } catch (err) {
        console.error('[Gemini ulanish xatosi]:', err.message);
      }
    }
  }

  return null;
}
