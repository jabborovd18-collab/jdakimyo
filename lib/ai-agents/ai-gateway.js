// JDA Kimyo AI tashqi modellarini bitta nazoratli shlyuz orqali chaqiradi.
// Nega urinishlar cheklangan: uzun kaskad foydalanuvchini Vercel timeoutigacha
// kuttirar, bitta mantiqiy so'rov esa ko'p provayder xarajatiga aylanar edi.

import { AI_YONALISH_SOZLAMALARI } from "./ai-yonalish.js";

export const AI_MODEL_REYESTRI = Object.freeze({
  deepseek: Object.freeze({
    murakkab: "deepseek-reasoner",
    zaxira: "deepseek-chat",
  }),
  groq: Object.freeze({
    tezkor: "openai/gpt-oss-20b",
    asosiy: "openai/gpt-oss-120b",
  }),
  gemini: Object.freeze({
    asosiy: "gemini-3.6-flash",
    zaxira: "gemini-2.5-flash",
  }),
  openrouter: Object.freeze({
    matn: "deepseek/deepseek-r1:free",
    rasm: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  }),
});

class ProvayderXatosi extends Error {
  constructor(message, { status = 0, kod = "PROVAYDER_XATOSI" } = {}) {
    super(message);
    this.name = "ProvayderXatosi";
    this.status = status;
    this.kod = kod;
  }
}
export class AiGatewayXatosi extends Error {
  constructor(message, { statusCode = 502, kod = "AI_MAVJUD_EMAS" } = {}) {
    super(message);
    this.name = "AiGatewayXatosi";
    this.statusCode = statusCode;
    this.kod = kod;
  }
}

function takrorsizKalitlar(qiymatlar) {
  return [...new Set(
    qiymatlar
      .filter(Boolean)
      .map((kalit) => String(kalit).trim())
      .filter(Boolean),
  )];
}

function muhitSozlamalariOl() {
  return {
    deepseek: String(process.env.DEEPSEEK_API_KEY || "").trim(),
    groq: takrorsizKalitlar([
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
    ]),
    gemini: takrorsizKalitlar([
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
      process.env.GOOGLE_AI_KEY,
    ]),
    openrouter: String(process.env.OPENROUTER_API_KEY || "").trim(),
    modellar: {
      deepseekMurakkab: process.env.DEEPSEEK_REASONER_MODEL || AI_MODEL_REYESTRI.deepseek.murakkab,
      deepseekZaxira: process.env.DEEPSEEK_CHAT_MODEL || AI_MODEL_REYESTRI.deepseek.zaxira,
      groqTezkor: process.env.GROQ_FAST_MODEL || AI_MODEL_REYESTRI.groq.tezkor,
      groqAsosiy: process.env.GROQ_MAIN_MODEL || AI_MODEL_REYESTRI.groq.asosiy,
      geminiAsosiy: process.env.GEMINI_MODEL || AI_MODEL_REYESTRI.gemini.asosiy,
      geminiZaxira: process.env.GEMINI_FALLBACK_MODEL || AI_MODEL_REYESTRI.gemini.zaxira,
      openrouterMatn: process.env.OPENROUTER_TEXT_MODEL || AI_MODEL_REYESTRI.openrouter.matn,
      openrouterRasm: process.env.OPENROUTER_VISION_MODEL || AI_MODEL_REYESTRI.openrouter.rasm,
    },
  };
}

export function aiModelReyestriOl() {
  const muhit = muhitSozlamalariOl();
  return {
    modellar: { ...muhit.modellar },
    kalitlar: {
      deepseek: Boolean(muhit.deepseek),
      groq: muhit.groq.length,
      gemini: muhit.gemini.length,
      openrouter: Boolean(muhit.openrouter),
    },
  };
}

/** AI javobidan model va markdown bezagidan qat'i nazar JSON ajratadi. */
function tozaJsonOqi(matn) {
  if (!matn || typeof matn !== "string") return null;

  try {
    return JSON.parse(matn.trim());
  } catch {}

  try {
    const markdown = matn.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdown?.[1]) return JSON.parse(markdown[1].trim());
  } catch {}

  try {
    const bosh = matn.indexOf("{");
    const oxir = matn.lastIndexOf("}");
    if (bosh !== -1 && oxir > bosh) {
      return JSON.parse(matn.slice(bosh, oxir + 1));
    }
  } catch {}

  return null;
}

async function vaqtChegaraliFetch(url, sozlamalar, vaqtMs) {
  const controller = new AbortController();
  const taymer = setTimeout(() => controller.abort(), vaqtMs);

  try {
    return await fetch(url, {
      ...sozlamalar,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ProvayderXatosi("Provayder belgilangan vaqtda javob bermadi.", {
        kod: "VAQT_TUGADI",
      });
    }
    throw new ProvayderXatosi(error?.message || "Provayder bilan aloqa uzildi.", {
      kod: "TARMOQ_XATOSI",
    });
  } finally {
    clearTimeout(taymer);
  }
}

async function javobniTekshir(response, provayder) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const xabar = data?.error?.message || data?.error || `${provayder} HTTP ${response.status}`;
    throw new ProvayderXatosi(String(xabar).slice(0, 300), {
      status: response.status,
      kod: response.status === 429 ? "LIMIT" : "HTTP_XATO",
    });
  }
  return data;
}

function openAiXabarlari(prompt, systemPrompt) {
  const xabarlar = [];
  if (systemPrompt) xabarlar.push({ role: "system", content: systemPrompt });
  xabarlar.push({ role: "user", content: prompt });
  return xabarlar;
}

async function deepseekChaqir(nomzod, vazifa) {
  const response = await vaqtChegaraliFetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${nomzod.kalit}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: nomzod.model,
      messages: openAiXabarlari(vazifa.prompt, vazifa.systemPrompt),
      temperature: nomzod.model === AI_MODEL_REYESTRI.deepseek.murakkab ? undefined : 0.15,
      max_tokens: vazifa.tokenChegarasi,
      response_format: vazifa.jsonRejim ? { type: "json_object" } : undefined,
    }),
  }, vazifa.vaqtMs);
  const data = await javobniTekshir(response, "DeepSeek");
  return data?.choices?.[0]?.message?.content || "";
}

async function groqChaqir(nomzod, vazifa) {
  const response = await vaqtChegaraliFetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${nomzod.kalit}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: nomzod.model,
      messages: openAiXabarlari(vazifa.prompt, vazifa.systemPrompt),
      temperature: 0.2,
      max_tokens: vazifa.tokenChegarasi,
      response_format: vazifa.jsonRejim ? { type: "json_object" } : undefined,
    }),
  }, vazifa.vaqtMs);
  const data = await javobniTekshir(response, "Groq");
  return data?.choices?.[0]?.message?.content || "";
}

async function openrouterChaqir(nomzod, vazifa) {
  const userContent = vazifa.rasmBase64
    ? [
        { type: "text", text: vazifa.prompt },
        { type: "image_url", image_url: { url: vazifa.rasmBase64 } },
      ]
    : vazifa.prompt;

  const xabarlar = [];
  if (vazifa.systemPrompt) xabarlar.push({ role: "system", content: vazifa.systemPrompt });
  xabarlar.push({ role: "user", content: userContent });

  const response = await vaqtChegaraliFetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${nomzod.kalit}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://jdakimyo.uz",
      "X-Title": "JDA KIMYO AI",
    },
    body: JSON.stringify({
      model: nomzod.model,
      messages: xabarlar,
      temperature: 0.2,
      max_tokens: vazifa.tokenChegarasi,
    }),
  }, vazifa.vaqtMs);
  const data = await javobniTekshir(response, "OpenRouter");
  return data?.choices?.[0]?.message?.content || "";
}

async function geminiChaqir(nomzod, vazifa) {
  const qismlar = [];
  if (vazifa.rasmBase64) {
    const vergul = vazifa.rasmBase64.indexOf(",");
    const mime = vazifa.rasmBase64.match(/^data:([^;]+);base64,/i)?.[1] || "image/jpeg";
    qismlar.push({
      inlineData: {
        mimeType: mime,
        data: vergul >= 0 ? vazifa.rasmBase64.slice(vergul + 1) : vazifa.rasmBase64,
      },
    });
  }
  qismlar.push({ text: vazifa.prompt });

  const response = await vaqtChegaraliFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(nomzod.model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": nomzod.kalit,
      },
      body: JSON.stringify({
        system_instruction: vazifa.systemPrompt
          ? { parts: [{ text: vazifa.systemPrompt }] }
          : undefined,
        contents: [{ role: "user", parts: qismlar }],
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: vazifa.tokenChegarasi,
          responseMimeType: vazifa.jsonRejim ? "application/json" : "text/plain",
        },
      }),
    },
    vazifa.vaqtMs,
  );
  const data = await javobniTekshir(response, "Gemini");
  return (data?.candidates?.[0]?.content?.parts || [])
    .map((qism) => qism?.text || "")
    .join("");
}

function nomzodlarTuz({ muhit, rasmBase64, yonalish, preferDeepSeek }) {
  const nomzodlar = [];
  const korilgan = new Set();
  const qosh = (provayder, model, kalit) => {
    if (!model || !kalit) return;
    const belgi = `${provayder}:${model}:${kalit}`;
    if (korilgan.has(belgi)) return;
    korilgan.add(belgi);
    nomzodlar.push({ provayder, model, kalit });
  };

  if (rasmBase64) {
    qosh("gemini", muhit.modellar.geminiAsosiy, muhit.gemini[0]);
    qosh("openrouter", muhit.modellar.openrouterRasm, muhit.openrouter);
    qosh("gemini", muhit.modellar.geminiZaxira, muhit.gemini[0]);
    for (const kalit of muhit.gemini.slice(1)) {
      qosh("gemini", muhit.modellar.geminiAsosiy, kalit);
    }
    return nomzodlar;
  }

  if (preferDeepSeek) {
    qosh("deepseek", muhit.modellar.deepseekMurakkab, muhit.deepseek);
  }

  const groqAsosiy = yonalish === "tezkor"
    ? muhit.modellar.groqTezkor
    : muhit.modellar.groqAsosiy;
  const groqZaxira = yonalish === "tezkor"
    ? muhit.modellar.groqAsosiy
    : muhit.modellar.groqTezkor;

  qosh("groq", groqAsosiy, muhit.groq[0]);
  qosh("gemini", muhit.modellar.geminiAsosiy, muhit.gemini[0]);
  qosh("openrouter", muhit.modellar.openrouterMatn, muhit.openrouter);
  qosh("deepseek", muhit.modellar.deepseekZaxira, muhit.deepseek);
  qosh("groq", groqZaxira, muhit.groq[0]);
  qosh("gemini", muhit.modellar.geminiZaxira, muhit.gemini[0]);

  for (const kalit of muhit.groq.slice(1)) qosh("groq", groqAsosiy, kalit);
  for (const kalit of muhit.gemini.slice(1)) qosh("gemini", muhit.modellar.geminiAsosiy, kalit);
  return nomzodlar;
}

async function nomzodniChaqir(nomzod, vazifa) {
  if (nomzod.provayder === "deepseek") return deepseekChaqir(nomzod, vazifa);
  if (nomzod.provayder === "groq") return groqChaqir(nomzod, vazifa);
  if (nomzod.provayder === "openrouter") return openrouterChaqir(nomzod, vazifa);
  if (nomzod.provayder === "gemini") return geminiChaqir(nomzod, vazifa);
  throw new ProvayderXatosi("Noma'lum AI provayderi.");
}

export async function aiModelChaqir(prompt, {
  systemPrompt = "",
  jsonRejim = true,
  rasmBase64 = null,
  preferDeepSeek = false,
  yonalish = "oddiy",
} = {}) {
  const sozlama = AI_YONALISH_SOZLAMALARI[yonalish] || AI_YONALISH_SOZLAMALARI.oddiy;
  const muhit = muhitSozlamalariOl();
  const nomzodlar = nomzodlarTuz({
    muhit,
    rasmBase64,
    yonalish: sozlama.id,
    preferDeepSeek,
  }).slice(0, sozlama.urinishChegarasi);

  if (nomzodlar.length === 0) {
    throw new AiGatewayXatosi("AI provayder kalitlari sozlanmagan.", {
      statusCode: 503,
      kod: "KALIT_YOQ",
    });
  }

  const boshlanganVaqt = Date.now();
  let oxirgiXato = null;

  for (let indeks = 0; indeks < nomzodlar.length; indeks++) {
    const nomzod = nomzodlar[indeks];
    const qolganVaqt = sozlama.umumiyVaqtMs - (Date.now() - boshlanganVaqt);
    if (qolganVaqt < 500) break;

    const urinishVaqti = Math.min(sozlama.urinishVaqtiMs, qolganVaqt);
    const urinishBoshlanishi = Date.now();

    try {
      const matn = await nomzodniChaqir(nomzod, {
        prompt,
        systemPrompt,
        jsonRejim,
        rasmBase64,
        tokenChegarasi: sozlama.tokenChegarasi,
        vaqtMs: urinishVaqti,
      });

      if (!matn) {
        throw new ProvayderXatosi("Provayder bo'sh javob qaytardi.", { kod: "BOSH_JAVOB" });
      }

      if (!jsonRejim) return matn;
      const natija = tozaJsonOqi(matn);
      if (natija) return natija;
      throw new ProvayderXatosi("Provayder javobi kerakli JSON shaklida emas.", {
        kod: "FORMAT_XATOSI",
      });
    } catch (error) {
      oxirgiXato = error;
      console.warn("[AI Gateway urinish xatosi]", {
        provayder: nomzod.provayder,
        model: nomzod.model,
        status: error?.status || 0,
        kod: error?.kod || "NOMALUM",
        sarfMs: Date.now() - urinishBoshlanishi,
        urinish: indeks + 1,
      });
    }
  }

  const vaqtTugadimi = Date.now() - boshlanganVaqt >= sozlama.umumiyVaqtMs
    || oxirgiXato?.kod === "VAQT_TUGADI";
  throw new AiGatewayXatosi(
    vaqtTugadimi
      ? "AI belgilangan vaqtda javob bermadi. So'rovni qisqartirib yoki qayta yuborib ko'ring."
      : "AI provayderlari hozir javob bera olmadi. Birozdan keyin qayta urinib ko'ring.",
    {
      statusCode: vaqtTugadimi ? 504 : 502,
      kod: vaqtTugadimi ? "UMUMIY_VAQT_TUGADI" : "BARCHA_URINISH_XATO",
    },
  );
}
