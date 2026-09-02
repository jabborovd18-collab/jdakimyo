// Tashqi AI provayderlarining yagona shlyuzi. Runtime siyosati parametr orqali
// keladi: bu modul sof qoladi va himoya testlari bazasiz ham ishlaydi.

import { AI_YONALISH_SOZLAMALARI } from "./ai-yonalish.js";

export const AI_MODEL_REYESTRI = Object.freeze({
  deepseek: Object.freeze({ murakkab: "deepseek-reasoner", zaxira: "deepseek-chat" }),
  groq: Object.freeze({ tezkor: "openai/gpt-oss-20b", asosiy: "openai/gpt-oss-120b" }),
  gemini: Object.freeze({ asosiy: "gemini-3.6-flash", zaxira: "gemini-2.5-flash" }),
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
  return [...new Set(qiymatlar.filter(Boolean).map((kalit) => String(kalit).trim()).filter(Boolean))];
}

function muhitSozlamalariOl() {
  return {
    deepseek: String(process.env.DEEPSEEK_API_KEY || "").trim(),
    groq: takrorsizKalitlar([process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2]),
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
      deepseek: Number(Boolean(muhit.deepseek)),
      groq: muhit.groq.length,
      gemini: muhit.gemini.length,
      openrouter: Number(Boolean(muhit.openrouter)),
    },
  };
}

/** Model bezagidan qat'i nazar faqat to'liq JSON obyektni ajratadi. */
function tozaJsonOqi(matn) {
  if (!matn || typeof matn !== "string") return null;
  try { return JSON.parse(matn.trim()); } catch {}
  try {
    const markdown = matn.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdown?.[1]) return JSON.parse(markdown[1].trim());
  } catch {}
  try {
    const bosh = matn.indexOf("{");
    const oxir = matn.lastIndexOf("}");
    if (bosh !== -1 && oxir > bosh) return JSON.parse(matn.slice(bosh, oxir + 1));
  } catch {}
  return null;
}

async function vaqtChegaraliFetch(url, sozlamalar, vaqtMs) {
  const controller = new AbortController();
  const taymer = setTimeout(() => controller.abort(), vaqtMs);
  try {
    return await fetch(url, { ...sozlamalar, signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new ProvayderXatosi("Provayder belgilangan vaqtda javob bermadi.", { kod: "VAQT_TUGADI" });
    }
    throw new ProvayderXatosi(error?.message || "Provayder bilan aloqa uzildi.", { kod: "TARMOQ_XATOSI" });
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

function openAiNatijasi(data) {
  return {
    matn: data?.choices?.[0]?.message?.content || "",
    usage: {
      inputTokens: data?.usage?.prompt_tokens || 0,
      outputTokens: data?.usage?.completion_tokens || 0,
      totalTokens: data?.usage?.total_tokens || 0,
    },
  };
}

async function deepseekChaqir(nomzod, vazifa) {
  const response = await vaqtChegaraliFetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${nomzod.kalit}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: nomzod.model,
      messages: openAiXabarlari(vazifa.prompt, vazifa.systemPrompt),
      temperature: nomzod.model === AI_MODEL_REYESTRI.deepseek.murakkab ? undefined : 0.15,
      max_tokens: vazifa.tokenChegarasi,
      response_format: vazifa.jsonRejim ? { type: "json_object" } : undefined,
    }),
  }, vazifa.vaqtMs);
  return openAiNatijasi(await javobniTekshir(response, "DeepSeek"));
}

async function groqChaqir(nomzod, vazifa) {
  const response = await vaqtChegaraliFetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${nomzod.kalit}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: nomzod.model,
      messages: openAiXabarlari(vazifa.prompt, vazifa.systemPrompt),
      temperature: 0.2,
      max_tokens: vazifa.tokenChegarasi,
      response_format: vazifa.jsonRejim ? { type: "json_object" } : undefined,
    }),
  }, vazifa.vaqtMs);
  return openAiNatijasi(await javobniTekshir(response, "Groq"));
}

async function openrouterChaqir(nomzod, vazifa) {
  const userContent = vazifa.rasmBase64
    ? [{ type: "text", text: vazifa.prompt }, { type: "image_url", image_url: { url: vazifa.rasmBase64 } }]
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
    body: JSON.stringify({ model: nomzod.model, messages: xabarlar, temperature: 0.2, max_tokens: vazifa.tokenChegarasi }),
  }, vazifa.vaqtMs);
  return openAiNatijasi(await javobniTekshir(response, "OpenRouter"));
}

async function geminiChaqir(nomzod, vazifa) {
  const qismlar = [];
  if (vazifa.rasmBase64) {
    const vergul = vazifa.rasmBase64.indexOf(",");
    const mime = vazifa.rasmBase64.match(/^data:([^;]+);base64,/i)?.[1] || "image/jpeg";
    qismlar.push({ inlineData: { mimeType: mime, data: vergul >= 0 ? vazifa.rasmBase64.slice(vergul + 1) : vazifa.rasmBase64 } });
  }
  qismlar.push({ text: vazifa.prompt });
  const response = await vaqtChegaraliFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(nomzod.model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": nomzod.kalit },
      body: JSON.stringify({
        system_instruction: vazifa.systemPrompt ? { parts: [{ text: vazifa.systemPrompt }] } : undefined,
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
  return {
    matn: (data?.candidates?.[0]?.content?.parts || []).map((qism) => qism?.text || "").join(""),
    usage: {
      inputTokens: data?.usageMetadata?.promptTokenCount || 0,
      outputTokens: data?.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: data?.usageMetadata?.totalTokenCount || 0,
    },
  };
}

function aliasdanNomzod(alias, muhit) {
  const model = muhit.modellar[alias];
  if (alias.startsWith("deepseek")) return { alias, provayder: "deepseek", model, kalit: muhit.deepseek };
  if (alias.startsWith("groq")) return { alias, provayder: "groq", model, kalit: muhit.groq[0] };
  if (alias.startsWith("gemini")) return { alias, provayder: "gemini", model, kalit: muhit.gemini[0] };
  if (alias.startsWith("openrouter")) return { alias, provayder: "openrouter", model, kalit: muhit.openrouter };
  return null;
}

function nomzodlarTuz({ muhit, rasmBase64, yonalish, preferDeepSeek, runtimeSozlama }) {
  if (runtimeSozlama?.routing) {
    const routingKaliti = rasmBase64 ? "rasm" : yonalish;
    return (runtimeSozlama.routing[routingKaliti] || [])
      .map((alias, routingIndex) => {
        const nomzod = aliasdanNomzod(alias, muhit);
        return nomzod ? { ...nomzod, routingIndex } : null;
      })
      .filter((nomzod) => nomzod?.model && nomzod?.kalit);
  }

  const nomzodlar = [];
  const korilgan = new Set();
  const qosh = (provayder, model, kalit, alias = null) => {
    if (!model || !kalit) return;
    const belgi = `${provayder}:${model}:${kalit}`;
    if (korilgan.has(belgi)) return;
    korilgan.add(belgi);
    nomzodlar.push({ provayder, model, kalit, alias });
  };
  if (rasmBase64) {
    qosh("gemini", muhit.modellar.geminiAsosiy, muhit.gemini[0], "geminiAsosiy");
    qosh("openrouter", muhit.modellar.openrouterRasm, muhit.openrouter, "openrouterRasm");
    qosh("gemini", muhit.modellar.geminiZaxira, muhit.gemini[0], "geminiZaxira");
    for (const kalit of muhit.gemini.slice(1)) qosh("gemini", muhit.modellar.geminiAsosiy, kalit, "geminiAsosiy");
    return nomzodlar;
  }
  if (preferDeepSeek) qosh("deepseek", muhit.modellar.deepseekMurakkab, muhit.deepseek, "deepseekMurakkab");
  const groqAsosiy = yonalish === "tezkor" ? muhit.modellar.groqTezkor : muhit.modellar.groqAsosiy;
  const groqZaxira = yonalish === "tezkor" ? muhit.modellar.groqAsosiy : muhit.modellar.groqTezkor;
  qosh("groq", groqAsosiy, muhit.groq[0], yonalish === "tezkor" ? "groqTezkor" : "groqAsosiy");
  qosh("gemini", muhit.modellar.geminiAsosiy, muhit.gemini[0], "geminiAsosiy");
  qosh("openrouter", muhit.modellar.openrouterMatn, muhit.openrouter, "openrouterMatn");
  qosh("deepseek", muhit.modellar.deepseekZaxira, muhit.deepseek, "deepseekZaxira");
  qosh("groq", groqZaxira, muhit.groq[0]);
  qosh("gemini", muhit.modellar.geminiZaxira, muhit.gemini[0], "geminiZaxira");
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

async function telemetriyaniYubor(telemetriya, hodisa) {
  if (typeof telemetriya !== "function") return;
  try { await telemetriya(hodisa); } catch (error) {
    console.error("[AI telemetriya] Hodisani qabul qilib bo'lmadi:", error?.message);
  }
}

export async function aiModelChaqir(prompt, {
  systemPrompt = "",
  jsonRejim = true,
  rasmBase64 = null,
  preferDeepSeek = false,
  yonalish = "oddiy",
  runtimeSozlama = null,
  telemetriya = null,
} = {}) {
  if (runtimeSozlama?.enabled === false) {
    throw new AiGatewayXatosi("JDA Kimyo AI admin tomonidan vaqtincha to'xtatilgan.", { statusCode: 503, kod: "AI_OCHIQ_EMAS" });
  }

  const asosiySozlama = AI_YONALISH_SOZLAMALARI[yonalish] || AI_YONALISH_SOZLAMALARI.oddiy;
  const sozlama = { ...asosiySozlama, ...(runtimeSozlama?.directions?.[yonalish] || {}) };
  const muhit = muhitSozlamalariOl();
  const nomzodlar = nomzodlarTuz({ muhit, rasmBase64, yonalish, preferDeepSeek, runtimeSozlama })
    .slice(0, sozlama.urinishChegarasi);
  if (nomzodlar.length === 0) {
    throw new AiGatewayXatosi("AI provayder kalitlari sozlanmagan.", { statusCode: 503, kod: "KALIT_YOQ" });
  }

  const boshlanganVaqt = Date.now();
  let oxirgiXato = null;
  for (let indeks = 0; indeks < nomzodlar.length; indeks++) {
    const nomzod = nomzodlar[indeks];
    const qolganVaqt = sozlama.umumiyVaqtMs - (Date.now() - boshlanganVaqt);
    if (qolganVaqt < 500) break;
    const urinishBoshlanishi = Date.now();
    try {
      const javob = await nomzodniChaqir(nomzod, {
        prompt,
        systemPrompt,
        jsonRejim,
        rasmBase64,
        tokenChegarasi: sozlama.tokenChegarasi,
        vaqtMs: Math.min(sozlama.urinishVaqtiMs, qolganVaqt),
      });
      if (!javob.matn) throw new ProvayderXatosi("Provayder bo'sh javob qaytardi.", { kod: "BOSH_JAVOB" });
      const natija = jsonRejim ? tozaJsonOqi(javob.matn) : javob.matn;
      if (!natija) throw new ProvayderXatosi("Provayder javobi kerakli JSON shaklida emas.", { kod: "FORMAT_XATOSI" });
      await telemetriyaniYubor(telemetriya, {
        provider: nomzod.provayder,
        model: nomzod.model,
        status: "success",
        durationMs: Date.now() - urinishBoshlanishi,
        fallbackIndex: nomzod.routingIndex ?? indeks,
        ...javob.usage,
      });
      return natija;
    } catch (error) {
      oxirgiXato = error;
      const hodisa = {
        provider: nomzod.provayder,
        model: nomzod.model,
        status: "error",
        errorCode: error?.kod || "NOMALUM",
        durationMs: Date.now() - urinishBoshlanishi,
        fallbackIndex: nomzod.routingIndex ?? indeks,
      };
      await telemetriyaniYubor(telemetriya, hodisa);
      console.warn("[AI Gateway urinish xatosi]", { ...hodisa, urinish: indeks + 1 });
    }
  }

  const vaqtTugadimi = Date.now() - boshlanganVaqt >= sozlama.umumiyVaqtMs || oxirgiXato?.kod === "VAQT_TUGADI";
  throw new AiGatewayXatosi(
    vaqtTugadimi
      ? "AI belgilangan vaqtda javob bermadi. So'rovni qisqartirib yoki qayta yuborib ko'ring."
      : "AI provayderlari hozir javob bera olmadi. Birozdan keyin qayta urinib ko'ring.",
    { statusCode: vaqtTugadimi ? 504 : 502, kod: vaqtTugadimi ? "UMUMIY_VAQT_TUGADI" : "BARCHA_URINISH_XATO" },
  );
}

/** Admin tekshiruvi haqiqiy gateway chaqiruvchilaridan foydalanadi va kalitni qaytarmaydi. */
export async function aiProvayderKorigi({ runtimeSozlama = null, prompt = "H2O formulasi nimani anglatadi? Bir jumlada javob bering." } = {}) {
  const muhit = muhitSozlamalariOl();
  const aliaslar = ["deepseekZaxira", "groqTezkor", "geminiAsosiy", "openrouterMatn"];
  const nomzodlar = aliaslar.map((alias) => aliasdanNomzod(alias, muhit));
  const sozlama = { ...AI_YONALISH_SOZLAMALARI.tezkor, ...(runtimeSozlama?.directions?.tezkor || {}) };
  return Promise.all(nomzodlar.map(async (nomzod) => {
    if (!nomzod?.kalit) {
      return { provayder: nomzod?.provayder || "noma'lum", model: nomzod?.model || "", sozlangan: false, holat: "kalit_yoq", sarfMs: 0 };
    }
    const boshlandi = Date.now();
    try {
      const javob = await nomzodniChaqir(nomzod, {
        prompt: String(prompt || "").slice(0, 500),
        systemPrompt: "Faqat kimyo bo'yicha qisqa va aniq javob bering.",
        jsonRejim: false,
        rasmBase64: null,
        tokenChegarasi: Math.min(200, sozlama.tokenChegarasi),
        vaqtMs: Math.min(10_000, sozlama.urinishVaqtiMs),
      });
      return {
        provayder: nomzod.provayder,
        model: nomzod.model,
        sozlangan: true,
        holat: javob.matn ? "ishlayapti" : "bosh_javob",
        sarfMs: Date.now() - boshlandi,
        tokenlar: javob.usage?.totalTokens || 0,
      };
    } catch (error) {
      return {
        provayder: nomzod.provayder,
        model: nomzod.model,
        sozlangan: true,
        holat: "xato",
        xatoKodi: error?.kod || "NOMALUM",
        httpStatus: Number(error?.status) || 0,
        sarfMs: Date.now() - boshlandi,
      };
    }
  }));
}
