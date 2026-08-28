// lib/ai-agents/masala-orkestrator.js
//
// JDA KIMYO — KO'P AGENTLI KIMYOVIY MASALALAR ORKESTRATORI (v4.2.0)
// Matn va Rasm (Multimodal Vision OCR) to'liq qo'llab-quvvatlanadi.

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

  // 1. OPENROUTER ORQALI CHAQIRISH (Matn va Rasm Vision ikkalasini ham a'lo darajada qo'llaydi)
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

  // 2. GROQ ORQALI CHAQIRISH (Ultra-tezkor 120B matnli model)
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
 * KO'P AGENTLI MASALA YECHISH ASOSIY METODI
 */
export async function multiAgentMasalaYech({ masalaMatni = '', rejim = 'toliq', rasm = null }) {
  const tizimPrompti = `Siz O'zbekiston Milliy Olimpiada terma jamoasi murabbiyi, DTM bosh eksperti va oliy toifali Kimyo Professori sifatida 4 ta ichki AI agent zanjirini boshqarasiz:

1-AGENT (Tahlilchi):
- Masala matnidan yoki ilova qilingan rasmdagi shartdan barcha sonli qiymatlar va fizik kattaliklarni "berilgan" va "topishKerak" bo'limlariga ajratadi.
- Masala turini aniqlaydi ("eritmalar", "kristallogidrat", "stexiometriya", "gazlar", "elektroliz", "organik", "muvozanat", "termokimyo").

2-AGENT (Kimyogar):
- Barcha kimyoviy reaksiya tenglamalarini tenglashtirilgan holda yozadi (masalan: 2NaOH + H2SO4 -> Na2SO4 + 2H2O).
- Reagentlarning molyar massalari (M), modda miqdori (n, mol), cheklovchi reagent va massalarini hisoblaydi.

3-AGENT (Matematik & Nazoratchi):
- Proporsiyalarni qat'iy matematik hisoblaydi, o'lchov birliklarini (g, ml, mol, litr, %) tekshiradi. Xatolik ehtimolini 0% ga tushiradi.

4-AGENT (Pedagog & KaTeX Formatter):
- Natijani o'zbek tilida dona-dona, o'ta tushunarli, pedagogik darslik shakliga keltiradi.
- Formulalarni KaTeX/LaTeX formatida yozadi (masalan: \\omega = \\frac{m_{modda}}{m_{eritma}} \\times 100\\%).

REJIM TALABLARI:
- 'tuzoq' rejimi: Masaladagi nozik ayyorlik, 90% abituriyentlar chalg'iydigan qopqon va keng tarqalgan xatolarni ochib beradi.
- 'yonalish' rejimi: Aniq formulalar va bosqichma-bosqich qadamlar rejasini beradi, lekin yakuniy hisoblashni talabaga qoldiradi.
- 'toliq' rejimi: Berilgan, Topish kerak, Reaksiya, Bosqichlar va Aniq yakuniy javob bilan mukammal master-yechim.

PEARSON KRESTI TALABI:
Agar masala eritmalar aralashmasi bo'lsa, "krestSxemasi" obyektini to'ldiring:
{
  "mavjud": true,
  "w1": 40,
  "w2": 10,
  "wTarget": 20,
  "qism1": 10,
  "qism2": 20,
  "nisbat": "1 : 2"
}

SOF JSON FORMATIDA QAYTARING (hech qanday markdown \`\`\`json tegisiz):
{
  "muvaffaqiyatli": true,
  "rejim": "${rejim}",
  "masalaTuri": "eritmalar | kristallogidrat | stexiometriya | gazlar | elektroliz | organik | muvozanat | termokimyo",
  "masalaMatni": "O'qib olingan yoki kiritilgan aniq masala sharti",
  "berilgan": [
    { "belgi": "m(eritma)", "qiymat": "200 g" },
    { "belgi": "\\omega_1", "qiymat": "10%" }
  ],
  "topishKerak": [
    { "belgi": "m(tuz)", "nom": "Eritilgan tuz massasi" }
  ],
  "tenglamalar": [
    "2NaOH + H_2SO_4 \\rightarrow Na_2SO_4 + 2H_2O"
  ],
  "tuzoqTahlili": {
    "kalitNuqta": "Masaladagi eng nozik sirli qoida",
    "nimaUchunMuhim": "Nega buni hisobga olmaslik xatoga olib keladi",
    "kengTarqalganXato": "Ko'pchilik yo'l qo'yadigan odatiy xato"
  },
  "yonalish": {
    "formulalar": ["\\omega = \\frac{m_{erigan}}{m_{eritma}} \\times 100\\%"],
    "qadamlarRejasi": ["1-qadam: ...", "2-qadam: ..."],
    "maslahat": "..."
  },
  "bosqichlar": [
    {
      "raqam": 1,
      "sarlavha": "1-Bosqich: Boshlang'ich tuz massasini topish",
      "tushuntirish": "...",
      "formula": "m = \\frac{200 \\times 10}{100} = 20\\text{ g}",
      "mantiq": "..."
    }
  ],
  "krestSxemasi": null,
  "yakuniyJavob": "24.5 g NaCl (yoki rejimga mos xulosa)",
  "ovozMatni": "O'zbek tilida dona-dona va jonli o'qiladigan 3-4 gaplik xulosa"
}`;

  const foydalanuvchiPrompti = rasm
    ? `Ilova qilingan rasmdagi kimyo masalasini sinchkovlik bilan OCR orqali o'qib oling, barcha matn va sonlarni tahlil qiling va ${rejim} rejimida yeching.`
    : `Quyidagi kimyo masalasini sinchkovlik bilan tahlil qiling va ${rejim} rejimida yeching:\n\n"${masalaMatni}"`;

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
export async function aiRepetitorChat({ masalaMatni, yechim, savol }) {
  const tizimPrompti = `Siz mehribon, o'ta bilimdon va samimiy Kimyo Repetitorisiz.
O'quvchi quyidagi kimyoviy masala va uning yechimi yuzasidan savol bermoqda.
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
