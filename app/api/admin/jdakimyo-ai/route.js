// app/api/admin/jdakimyo-ai/route.js
//
// JDA KIMYO AI — SUPER ADMIN TEXNIK KO'RIK VA DIAGNOSTIKA API (v4.0.0)
//
// Ushbu API faqat superadminga ochiq bo'lib, barcha ulangan AI provayderlarni
// (Groq, OpenRouter, Gemini) sinovdan o'tkazadi va aniq xatolik sabablarini qaytaradi.

import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';

export async function GET() {
  const { isSuperAdmin } = await checkAdminAuth();
  if (!isSuperAdmin) {
    return NextResponse.json({ xato: 'Faqat super admin uchun ruxsat berilgan.' }, { status: 403 });
  }

  const groqKey = (process.env.GROQ_API_KEY || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || '').trim();
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || '').trim();

  const natijalar = {
    sana: new Date().toISOString(),
    provayderlar: {
      groq: {
        nom: 'Groq Cloud (120B / Qwen-3.8)',
        kalitBormi: Boolean(groqKey),
        kalitQisqa: groqKey ? `${groqKey.slice(0, 7)}...${groqKey.slice(-4)}` : 'Yo\'q',
        holat: 'tekshirilmagan',
        javobVaqtiMs: 0,
        xatoXabar: null,
        sinovJavobi: null
      },
      openrouter: {
        nom: 'OpenRouter (Minimax / Nemotron)',
        kalitBormi: Boolean(openrouterKey),
        kalitQisqa: openrouterKey ? `${openrouterKey.slice(0, 9)}...${openrouterKey.slice(-4)}` : 'Yo\'q',
        holat: 'tekshirilmagan',
        javobVaqtiMs: 0,
        xatoXabar: null,
        sinovJavobi: null
      },
      gemini: {
        nom: 'Google Gemini (2.0 Flash / 1.5 Flash)',
        kalitBormi: Boolean(geminiKey),
        kalitQisqa: geminiKey ? `${geminiKey.slice(0, 7)}...${geminiKey.slice(-4)}` : 'Yo\'q',
        holat: 'tekshirilmagan',
        javobVaqtiMs: 0,
        xatoXabar: null,
        sinovJavobi: null
      }
    }
  };

  return NextResponse.json(natijalar);
}

export async function POST(request) {
  const { isSuperAdmin } = await checkAdminAuth();
  if (!isSuperAdmin) {
    return NextResponse.json({ xato: 'Faqat super admin uchun ruxsat berilgan.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { action = 'korik', testPrompt = '200 g 10% li NaCl eritmasida necha gramm tuz bor? Qisqa javob ber.' } = body;

  const groqKey = (process.env.GROQ_API_KEY || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || '').trim();
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || '').trim();

  const hisobot = {
    sana: new Date().toISOString(),
    groq: null,
    openrouter: null,
    gemini: null
  };

  // 1. GROQ DIAGNOSTIKASI
  if (groqKey) {
    const boshlandi = Date.now();
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + groqKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 300
        })
      });
      const sarfMs = Date.now() - boshlandi;
      const data = await res.json();

      if (res.ok) {
        hisobot.groq = {
          status: 'ok',
          statusCode: res.status,
          sarfMs,
          model: 'openai/gpt-oss-120b',
          javob: data.choices?.[0]?.message?.content || '',
          xato: null
        };
      } else {
        hisobot.groq = {
          status: 'error',
          statusCode: res.status,
          sarfMs,
          model: 'openai/gpt-oss-120b',
          javob: null,
          xato: data.error?.message || data.error || 'Noma\'lum xatolik'
        };
      }
    } catch (err) {
      hisobot.groq = {
        status: 'error',
        statusCode: 0,
        sarfMs: Date.now() - boshlandi,
        model: 'openai/gpt-oss-120b',
        javob: null,
        xato: err.message
      };
    }
  } else {
    hisobot.groq = {
      status: 'missing_key',
      statusCode: 0,
      sarfMs: 0,
      xato: 'GROQ_API_KEY sozlanmagan (.env yoki Vercel Environment Variables ga qo\'shilmagan)'
    };
  }

  // 2. OPENROUTER DIAGNOSTIKASI
  if (openrouterKey) {
    const boshlandi = Date.now();
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + openrouterKey,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://jdakimyo.uz',
          'X-Title': 'JDA KIMYO Diagnostics'
        },
        body: JSON.stringify({
          model: 'minimax/minimax-m3:free',
          messages: [{ role: 'user', content: testPrompt }],
          max_tokens: 300
        })
      });
      const sarfMs = Date.now() - boshlandi;
      const data = await res.json();

      if (res.ok && data.choices?.[0]?.message?.content) {
        hisobot.openrouter = {
          status: 'ok',
          statusCode: res.status,
          sarfMs,
          model: 'minimax/minimax-m3:free',
          javob: data.choices[0].message.content,
          xato: null
        };
      } else {
        hisobot.openrouter = {
          status: 'error',
          statusCode: res.status,
          sarfMs,
          model: 'minimax/minimax-m3:free',
          javob: null,
          xato: data.error?.message || data.error || 'Noma\'lum xatolik'
        };
      }
    } catch (err) {
      hisobot.openrouter = {
        status: 'error',
        statusCode: 0,
        sarfMs: Date.now() - boshlandi,
        model: 'minimax/minimax-m3:free',
        javob: null,
        xato: err.message
      };
    }
  } else {
    hisobot.openrouter = {
      status: 'missing_key',
      statusCode: 0,
      sarfMs: 0,
      xato: 'OPENROUTER_API_KEY sozlanmagan'
    };
  }

  // 3. GEMINI DIAGNOSTIKASI
  if (geminiKey) {
    const boshlandi = Date.now();
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: testPrompt }] }]
        })
      });
      const sarfMs = Date.now() - boshlandi;
      const data = await res.json();

      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        hisobot.gemini = {
          status: 'ok',
          statusCode: res.status,
          sarfMs,
          model: 'gemini-2.0-flash',
          javob: data.candidates[0].content.parts[0].text,
          xato: null
        };
      } else {
        hisobot.gemini = {
          status: 'error',
          statusCode: res.status,
          sarfMs,
          model: 'gemini-2.0-flash',
          javob: null,
          xato: data.error?.message || 'Gemini xatoligi'
        };
      }
    } catch (err) {
      hisobot.gemini = {
        status: 'error',
        statusCode: 0,
        sarfMs: Date.now() - boshlandi,
        model: 'gemini-2.0-flash',
        javob: null,
        xato: err.message
      };
    }
  } else {
    hisobot.gemini = {
      status: 'missing_key',
      statusCode: 0,
      sarfMs: 0,
      xato: 'GEMINI_API_KEY sozlanmagan'
    };
  }

  return NextResponse.json({
    muvaffaqiyatli: true,
    action,
    hisobot
  });
}
