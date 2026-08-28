// lib/ai-agents/masala-orkestrator.js
//
// JDA KIMYO — KO'P AGENTLI KIMYOVIY MASALALAR ORKESTRATORI (v4.5.0)
// Organik kimyo gomologiya & izomeriya qoidalari, DTM test variantlari tahlili va Multimodal Vision OCR.

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
            temperature: 0.1,
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
            temperature: 0.1,
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
              temperature: 0.1,
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
  const tizimPrompti = `Siz O'zbekiston Milliy Kimyo Terma Jamoasi Murabbiyi, DTM Bosh Eksperti va Fan Doktori sifatida 4 ta ixtisoslashgan AI agent zanjirini boshqarasiz:

QAT'IY DTM VA KIMYO QOIDALARI:
1. GOMOLOGIK QATOR QOIDASI (ORGANIK KIMYO):
   - Gomologlar — tuzilishi (tarmoqlanish turi, funksional guruhi joylashuvi) bir xil bo'lgan va bir-biridan -CH2- (metilen) guruhiga farq qiluvchi moddalardir.
   - Aniq tuzilishdagi moddaning (masalan, 2-metilalkan, 3-metilalken, alkin-2, aldegid, keton, ikkilamchi spirt) gomologi so'ralganda, AYNAN SHU TUZILISH saqlanishi shart!
   - 2-metilalkanlar (izostruktura): Eng kichik vakili — 2-metilpropan (C4H10). Metan (C1), etan (C2), propan (C3) larda 2-metil tarmog'i bo'la olmaydi!
     Demak, 2-metilgeksan (C7H16) dan kichik 2-metilalkan gomologlari aniq 3 ta: 2-metilpropan (C4), 2-metilbutan (C5), 2-metilpentan (C6).
   - 3-metilalkanlar: Eng kichik vakili — 3-metilpentan (C6H14).
   - 2,2-dimetilalkanlar: Eng kichik vakili — 2,2-dimetilpropan (neopentan, C5H12).
   - Alkin-2 lar: Eng kichik vakili — butin-2 (C4H6).
   - Ketonlar: Eng kichik vakili — propanon (atseton, C3H6O).

2. TEST VARIANTLARINI TEKSHIRISH (A, B, C, D):
   - Agar masala shartida test variantlari (A, B, C, D) bo'lsa, hisob-kitob natijasini variantlar bilan solishtiring va "yakuniyJavob" da to'g'ri variant harfini aniq yozing (masalan: "3 ta (Javob: C)").

3. 4 TA AGENT VAZIFALARI:
   - 1-AGENT (Tahlilchi): Masala sharti, kattaliklar va berilgan test variantlarini ajratadi.
   - 2-AGENT (Kimyogar): Reaksiya tenglamalari, molyar massalar va kimyoviy tuzilishlarni aniqlaydi.
   - 3-AGENT (Matematik & Nazoratchi): Proporsiyalar, birliklar va sonlarni 100% qayta hisoblab tekshiradi.
   - 4-AGENT (Pedagog & KaTeX): KaTeX formulalari va o'zbek tilidagi darslik tili bilan yechimni shakllantiradi.

REJIM TALABLARI:
- 'tuzoq' rejimi: Masaladagi nozik ayyorlik, 90% abituriyentlar chalg'iydigan qopqon va keng tarqalgan xatolarni ochib beradi.
- 'yonalish' rejimi: Aniq formulalar va bosqichma-bosqich qadamlar rejasini beradi, lekin yakuniy hisoblashni talabaga qoldiradi.
- 'toliq' rejimi: Berilgan, Topish kerak, Reaksiyalar/Tuzilish, KaTeX bosqichlari va Aniq yakuniy javob bilan mukammal master-yechim.

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
    { "belgi": "m(eritma)", "qiymat": "200 g" }
  ],
  "topishKerak": [
    { "belgi": "N(gomolog)", "nom": "Kichik gomologlar soni" }
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
