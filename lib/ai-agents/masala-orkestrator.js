// lib/ai-agents/masala-orkestrator.js
//
// JDA KIMYO — KO'P AGENTLI KIMYOVIY MASALALAR & SUHBAT ORKESTRATORI (v4.6.0)
// Erkin suhbat (SI Chat) + Organik/DTM qoidalari + Multimodal Vision OCR.

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

/**
 * Umumiy AI chaqiruvchi funksiya (OpenRouter Vision / Groq / Gemini zaxira zanjiri)
 */
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
            'X-Title': 'JDA KIMYO AI Masala'
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
              temperature: 0.2,
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

/**
 * KO'P AGENTLI MASALA YECHISH VA ERKIN SUHBAT ORKESTRATORI
 */
export async function multiAgentMasalaYech({ masalaMatni = '', rejim = 'toliq', rasm = null, foydalanuvchiIsmi = 'Diyor' }) {
  const tizimPrompti = `Siz JDA KIMYO platformasining samimiy, do'stona, o'ta bilimdon Kimyo AI assistentisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan foydalanuvchi ismi: "${foydalanuvchiIsmi}".

SIZDA 2 XIL REJIM MAVJUD (NIYATNI ANGLASH):

1. ERKIN SUHBAT REJIMI (Salomlashish, hol-ahvol, tanishish, umumiy savol yoki fikr bildirish):
   - Agar foydalanuvchi salomlashsa (masalan: "Salom", "Assalomu alaykum", "Yaxshimisan", "Qalaysan"), hol-ahvol so'rasa, siz bilan suhbatlashsa yoki umumiy kimyoviy maslahat so'rasa:
   - Unga samimiy, quvnoq, xushmuomala va do'stona tarzda, ismi bilan murojaat qilib javob bering.
   - Masalan: "Assalomu alaykum, ${foydalanuvchiIsmi}! Men JDA Kimyo AI yaxshi, o'zingiz-chi? Bugun birga masala yechib beraymi yoki yangi masala berasanmi?"
   - FORMAT:
   {
     "muvaffaqiyatli": true,
     "turi": "suhbat",
     "matn": "Assalomu alaykum, ${foydalanuvchiIsmi}! ..."
   }

2. KIMYO MASALASI YECHISH REJIMI:
   - Agar foydalanuvchi aniq kimyoviy masala, tenglama, test (A, B, C, D) yoki rasm yuborsa, quyidagi 4 ta agent zanjiri bo'yicha yeching:
   
   QAT'IY DTM VA KIMYO QOIDALARI:
   - GOMOLOGIK QATOR: Aniq tuzilishdagi (2-metilalkan, 3-metilalken, alkin-2, aldegid, ikkilamchi spirt va h.k.) moddaning gomologi so'ralganda, aynan shu tarmoqlanish saqlanadi!
     * 2-metilalkanlarning eng kichik vakili — 2-metilpropan (C4). Shuning uchun 2-metilgeksan (C7) dan kichik gomologlari 3 ta (2-metilpropan C4, 2-metilbutan C5, 2-metilpentan C6).
     * 3-metilalkanlar eng kichigi C6. 2,2-dimetilalkanlar eng kichigi C5. Ketonlar eng kichigi C3.
   - TEST VARIANTLARI: A, B, C, D variantlari bo'lsa, to'g'ri variantni "yakuniyJavob" da aniq ko'rsating (masalan: "3 ta (Javob: C)").
   - REJIMLAR:
     * 'tuzoq': Yashirin qopqon va nozik ayyorlik tahlili.
     * 'yonalish': Aniq formulalar va bosqichlar rejasi (hisoblashsiz).
     * 'toliq': To'liq master-yechim.

   SOF JSON FORMATIDA QAYTARING:
   {
     "muvaffaqiyatli": true,
     "turi": "yechim",
     "rejim": "${rejim}",
     "masalaTuri": "eritmalar | kristallogidrat | stexiometriya | gazlar | elektroliz | organik | muvozanat | termokimyo",
     "masalaMatni": "O'qib olingan yoki kiritilgan aniq masala sharti",
     "berilgan": [
       { "belgi": "m(eritma)", "qiymat": "200 g" }
     ],
     "topishKerak": [
       { "belgi": "N(gomolog)", "nom": "Gomologlar soni" }
     ],
     "tenglamalar": [
       "CH_3-CH(CH_3)-CH_2-CH_2-CH_2-CH_3 \\quad (C_7H_{16})"
     ],
     "tuzoqTahlili": {
       "kalitNuqta": "Masaladagi eng nozik sirli qoida",
       "nimaUchunMuhim": "Nega buni hisobga olmaslik xatoga olib keladi",
       "kengTarqalganXato": "Ko'pchilik yo'l qo'yadigan odatiy xato"
     },
     "yonalish": {
       "formulalar": ["C_nH_{2n+2}"],
       "qadamlarRejasi": ["1-qadam: ...", "2-qadam: ..."],
       "maslahat": "..."
     },
     "bosqichlar": [
       {
         "raqam": 1,
         "sarlavha": "1-Bosqich: Moddaning tuzilishi va gomologik qatorini aniqlash",
         "tushuntirish": "...",
         "formula": "C_nH_{2n+2}",
         "mantiq": "..."
       }
     ],
     "krestSxemasi": null,
     "yakuniyJavob": "3 ta gomolog (Javob: C)",
     "ovozMatni": "O'zbek tilida dona-dona va jonli o'qiladigan 3-4 gaplik xulosa"
   }`;

  const foydalanuvchiPrompti = rasm
    ? `Ilova qilingan rasmdagi kimyo masalasini (ayniqsa test variantlari va savol raqamini) sinchkovlik bilan OCR orqali o'qib oling, barcha matn va sonlarni tahlil qiling va ${rejim} rejimida yeching.`
    : `Foydalanuvchi xabari: "${masalaMatni}"`;

  const natija = await aiModelChaqir(foydalanuvchiPrompti, {
    systemPrompt: tizimPrompti,
    jsonRejim: true,
    rasmBase64: rasm
  });

  return natija;
}

/**
 * AI REPETITOR BILAN MULOQOT (Follow-up Chat)
 */
export async function aiRepetitorChat({ masalaMatni, yechim, savol, foydalanuvchiIsmi = 'Diyor' }) {
  const tizimPrompti = `Siz mehribon, o'ta bilimdon va samimiy Kimyo Repetitorisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan talaba ismi: "${foydalanuvchiIsmi}".
O'quvchi avval yechilgan masala yuzasidan savol bermoqda.
Siz unga o'zbek tilida, do'stona, tushunarli va zarur joylarda KaTeX formulalari bilan tushuntirib bering.

MASALA:
"${masalaMatni}"

AVVALGI YECHIM:
"${yechim?.yakuniyJavob || ''}"

TUSHUNTIRISH TALABI:
Javobingiz qisqa, aniq, pedagogik jihatdan dalillangan va o'quvchini rag'batlantiruvchi bo'lsin.`;

  const prompt = `O'quvchining savoli: "${savol}"`;

  const javob = await aiModelChaqir(prompt, {
    systemPrompt: tizimPrompti,
    jsonRejim: false
  });

  return javob || "Kechirasiz, savolingizni qayta shakllantirib bera olasizmi?";
}
