// Tashqi AI provayderlarining yagona shlyuzi. Runtime siyosati parametr orqali
// keladi: bu modul sof qoladi va himoya testlari bazasiz ham ishlaydi.

import { AI_YONALISH_SOZLAMALARI } from "./ai-yonalish.js";
import { aiJavobJsonSxemasiniOl, AI_SUHBAT_JSON_SXEMASI } from "./ai-javob-sxema.js";
import { aiRasmDataUrliniTekshir } from "./ai-rasm.js";

export const AI_MODEL_REYESTRI = Object.freeze({
  deepseek: Object.freeze({ murakkab: "deepseek-reasoner", zaxira: "deepseek-chat" }),
  groq: Object.freeze({ tezkor: "openai/gpt-oss-20b", asosiy: "openai/gpt-oss-120b" }),
  gemini: Object.freeze({ asosiy: "gemini-3.5-flash", zaxira: "gemini-3-flash-preview" }),
  openrouter: Object.freeze({
    matn: "nex-agi/nex-n2.5-mini:free",
    rasm: "nex-agi/nex-n2.5-pro:free",
  }),
});

class ProvayderXatosi extends Error {
  constructor(message, { status = 0, kod = "PROVAYDER_XATOSI", meta = null } = {}) {
    super(message);
    this.name = "ProvayderXatosi";
    this.status = status;
    this.kod = kod;
    this.meta = meta;
  }
}

export class AiGatewayXatosi extends Error {
  constructor(message, { statusCode = 502, kod = "AI_MAVJUD_EMAS", tafsilotlar = [] } = {}) {
    super(message);
    this.name = "AiGatewayXatosi";
    this.statusCode = statusCode;
    this.kod = kod;
    this.tafsilotlar = tafsilotlar;
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

/**
 * Model JSON qaytargani uning UI va PDF uchun yaroqli ekanini anglatmaydi.
 * Shu chegara barcha provayderlarga umumiy bo'lgani uchun yaroqsiz javob ham
 * oddiy provayder xatosidek keyingi fallback urinishiga o'tadi.
 */
export function aiMasalaNatijasiniTekshir(natija, kutilganTuri = null) {
  if (!natija || typeof natija !== "object" || Array.isArray(natija)) {
    return { yaroqli: false, sabab: "Javob obyekt emas." };
  }
  if (natija.muvaffaqiyatli !== true) {
    return { yaroqli: false, sabab: '"muvaffaqiyatli" true emas.' };
  }
  if (kutilganTuri && natija.turi !== kutilganTuri) {
    return { yaroqli: false, sabab: `"turi" ${kutilganTuri} bo'lishi kerak.` };
  }
  if (natija.turi === "suhbat") {
    return typeof natija.matn === "string" && natija.matn.trim()
      ? { yaroqli: true }
      : { yaroqli: false, sabab: "Suhbat javobi bo'sh." };
  }
  if (natija.turi !== "yechim") {
    return { yaroqli: false, sabab: '"turi" faqat "suhbat" yoki "yechim" bo\'lishi mumkin.' };
  }
  if (!Array.isArray(natija.bosqichlar)) {
    return { yaroqli: false, sabab: '"bosqichlar" massiv emas.' };
  }
  if (!natija.bosqichlar.every((bosqich) => bosqich && typeof bosqich === "object" && !Array.isArray(bosqich))) {
    return { yaroqli: false, sabab: '"bosqichlar" ichida yaroqsiz qator bor.' };
  }
  if (typeof natija.yakuniyJavob !== "string" || !natija.yakuniyJavob.trim()) {
    return { yaroqli: false, sabab: '"yakuniyJavob" mavjud emas.' };
  }
  return { yaroqli: true };
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
      kod: response.status === 429 ? "LIMIT" : `HTTP_${response.status}`,
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
  const xabar = data?.choices?.[0]?.message || {};
  const finishReason = data?.choices?.[0]?.finish_reason || null;
  return {
    matn: typeof xabar.content === "string" ? xabar.content : "",
    vositaChaqiruvlari: Array.isArray(xabar.tool_calls) ? xabar.tool_calls : [],
    model: data?.model || null,
    finishReason,
    safetyBlocked: finishReason === "content_filter",
    responseChars: typeof xabar.content === "string" ? xabar.content.length : 0,
    usage: {
      inputTokens: data?.usage?.prompt_tokens || 0,
      outputTokens: data?.usage?.completion_tokens || 0,
      totalTokens: data?.usage?.total_tokens || 0,
    },
  };
}

function tokenChegarasidaKesildimi(finishReason) {
  return ["max_tokens", "length"].includes(String(finishReason || "").toLowerCase());
}

function openRouterJavobFormati(vazifa) {
  if (!vazifa.jsonRejim) return undefined;
  return {
    type: "json_schema",
    json_schema: {
      name: vazifa.kutilganJavobTuri === "suhbat" ? "jda_kimyo_suhbat" : "jda_kimyo_yechim",
      strict: false,
      schema: vazifa.jsonSxema || aiJavobJsonSxemasiniOl(vazifa.kutilganJavobTuri),
    },
  };
}

function groqJavobFormati(vazifa, model) {
  if (!vazifa.jsonRejim || vazifa.vositalar?.length) return undefined;
  if (vazifa.kutilganJavobTuri === "suhbat" && /^openai\/gpt-oss-(?:20b|120b)$/.test(model)) {
    // GPT-OSS JSON object rejimi ba'zan tayyor matnni tasdiqlay olmay, 400
    // qaytaradi. Yopiq, to'liq suhbat sxemasi Groqning qat'iy dekoderiga mos.
    return {
      type: "json_schema",
      json_schema: {
        name: "jda_kimyo_suhbat",
        strict: true,
        schema: { ...AI_SUHBAT_JSON_SXEMASI, additionalProperties: false },
      },
    };
  }
  return { type: "json_object" };
}

async function deepseekChaqir(nomzod, vazifa) {
  const response = await vaqtChegaraliFetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${nomzod.kalit}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: nomzod.model,
      messages: vazifa.xabarlar || openAiXabarlari(vazifa.prompt, vazifa.systemPrompt),
      temperature: nomzod.model === AI_MODEL_REYESTRI.deepseek.murakkab ? undefined : 0.15,
      max_tokens: vazifa.tokenChegarasi,
      response_format: vazifa.jsonRejim && !vazifa.vositalar?.length ? { type: "json_object" } : undefined,
      tools: vazifa.vositalar?.length ? vazifa.vositalar : undefined,
      tool_choice: vazifa.vositalar?.length ? vazifa.vositaTanlovi : undefined,
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
      messages: vazifa.xabarlar || openAiXabarlari(vazifa.prompt, vazifa.systemPrompt),
      temperature: 0.2,
      max_tokens: vazifa.tokenChegarasi,
      response_format: groqJavobFormati(vazifa, nomzod.model),
      tools: vazifa.vositalar?.length ? vazifa.vositalar : undefined,
      tool_choice: vazifa.vositalar?.length ? vazifa.vositaTanlovi : undefined,
    }),
  }, vazifa.vaqtMs);
  return openAiNatijasi(await javobniTekshir(response, "Groq"));
}

async function openrouterChaqir(nomzod, vazifa) {
  const userContent = vazifa.rasmBase64
    ? [{ type: "text", text: vazifa.prompt }, { type: "image_url", image_url: { url: vazifa.rasmBase64 } }]
    : vazifa.prompt;
  const xabarlar = vazifa.xabarlar || [];
  if (!vazifa.xabarlar) {
    if (vazifa.systemPrompt) xabarlar.push({ role: "system", content: vazifa.systemPrompt });
    xabarlar.push({ role: "user", content: userContent });
  }
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
      response_format: openRouterJavobFormati(vazifa),
      tools: vazifa.vositalar?.length ? vazifa.vositalar : undefined,
      tool_choice: vazifa.vositalar?.length ? vazifa.vositaTanlovi : undefined,
      provider: vazifa.jsonRejim ? { require_parameters: true } : undefined,
    }),
  }, vazifa.vaqtMs);
  return openAiNatijasi(await javobniTekshir(response, "OpenRouter"));
}

const geminiModelKesh = new Map();

function geminiKeshKaliti(kalit, talabQilinganModel) {
  return `${kalit}:${talabQilinganModel}`;
}

async function geminiHaqiqiyModelOl(kalit, talabQilinganModel, xatoXabari = "") {
  const tozaKalit = String(kalit || "").trim();
  const keshKaliti = geminiKeshKaliti(tozaKalit, talabQilinganModel);
  const kesh = geminiModelKesh.get(keshKaliti);
  if (kesh && Date.now() - kesh.vaqt < 3600_000) return kesh.model;

  try {
    const res = await vaqtChegaraliFetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(tozaKalit)}`,
      { method: "GET" },
      5000,
    );
    if (!res.ok) return talabQilinganModel;
    const data = await res.json().catch(() => null);
    const modellar = (data?.models || [])
      .filter((model) => Array.isArray(model.supportedGenerationMethods) && model.supportedGenerationMethods.includes("generateContent"))
      .map((model) => String(model.name || "").replace(/^models\//, ""))
      .filter(Boolean);
    const tavsiya = String(xatoXabari || "").match(/(?:update your code to use|use)\s+(?:models\/)?([a-zA-Z0-9_.-]+)/i)?.[1];
    const afzallik = [
      tavsiya,
      "gemini-3.5-flash",
      "gemini-3-flash-preview",
      "gemini-3.7-flash",
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      ...modellar.filter((model) => model.includes("flash") && !model.includes("exp")),
    ].filter((model) => model && model !== talabQilinganModel);
    const topildi = afzallik.find((model) => modellar.includes(model));
    if (topildi) {
      geminiModelKesh.set(keshKaliti, { model: topildi, vaqt: Date.now() });
      return topildi;
    }
  } catch (err) {
    console.warn("[Gemini model ro'yxati] Aniqlanmadi:", err?.message);
  }
  return talabQilinganModel;
}

function geminiBoshlangichKontenti(vazifa) {
  const qismlar = [];
  if (vazifa.rasmBase64) {
    const vergul = vazifa.rasmBase64.indexOf(",");
    const xom = vergul >= 0 ? vazifa.rasmBase64.slice(vergul + 1) : vazifa.rasmBase64;
    const tozaData = xom.replace(/[\r\n\s]/g, "");
    const mime = vazifa.rasmBase64.match(/^data:([^;]+);base64,/i)?.[1] || "image/jpeg";
    qismlar.push({ inlineData: { mimeType: mime, data: tozaData } });
  }
  qismlar.push({ text: vazifa.prompt });
  return [{ role: "user", parts: qismlar }];
}

function geminiVositalariniTuz(vositalar = []) {
  const functionDeclarations = vositalar
    .filter((vosita) => vosita?.type === "function" && vosita.function?.name)
    .map((vosita) => ({
      name: vosita.function.name,
      description: vosita.function.description || "",
      parametersJsonSchema: vosita.function.parameters || { type: "object", properties: {} },
    }));
  return functionDeclarations.length ? [{ functionDeclarations }] : undefined;
}

async function geminiChaqir(nomzod, vazifa) {
  const tozaKalit = String(nomzod.kalit || "").trim();
  const kesh = geminiModelKesh.get(geminiKeshKaliti(tozaKalit, nomzod.model));
  let modelNomi = kesh && Date.now() - kesh.vaqt < 3600_000 ? kesh.model : nomzod.model;
  const yuborilganXabarlar = Array.isArray(vazifa.xabarlar) && vazifa.xabarlar.length
    ? vazifa.xabarlar
    : geminiBoshlangichKontenti(vazifa);
  const geminiVositalari = geminiVositalariniTuz(vazifa.vositalar);

  const sovuqChaqir = async (ishlatiladiganModel) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(ishlatiladiganModel)}:generateContent?key=${encodeURIComponent(tozaKalit)}`;
    const jsonSxema = vazifa.jsonSxema || aiJavobJsonSxemasiniOl(vazifa.kutilganJavobTuri);
    // Gemini majburiy function calling (ANY) va JSON MIME rejimini bitta
    // chaqiruvda qabul qilmaydi. Dastlab vosita tanlanadi, server natijasi
    // qo'shilgan keyingi AUTO chaqiruvdagina yakuniy JSON majburlanadi.
    const jsonJavobniMajburla = vazifa.jsonRejim
      && !(geminiVositalari && vazifa.vositaTanlovi === "required");
    return vaqtChegaraliFetch(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": tozaKalit },
        body: JSON.stringify({
          system_instruction: vazifa.systemPrompt ? { parts: [{ text: vazifa.systemPrompt }] } : undefined,
          contents: yuborilganXabarlar,
          tools: geminiVositalari,
          toolConfig: geminiVositalari ? {
            functionCallingConfig: {
              mode: vazifa.vositaTanlovi === "required" ? "ANY" : "AUTO",
            },
          } : undefined,
          generationConfig: {
            maxOutputTokens: vazifa.tokenChegarasi,
            thinkingConfig: /^gemini-3(?:\.|-)/i.test(ishlatiladiganModel)
              ? { thinkingLevel: vazifa.fikrlashDarajasi || "low" }
              : undefined,
            // Gemini REST v1beta `responseFormat.text.mimeType` uchun oddiy
            // MIME satrini qabul qilmaydi. Barqaror v1beta maydonlari 3.x
            // modellarida ham native JSON sxemani qat'iy majburlaydi.
            responseMimeType: jsonJavobniMajburla ? "application/json" : undefined,
            responseJsonSchema: jsonJavobniMajburla ? jsonSxema : undefined,
          },
        }),
      },
      vazifa.vaqtMs,
    );
  };

  let response = await sovuqChaqir(modelNomi);
  if (!response.ok && (response.status === 404 || response.status === 400)) {
    const status = response.status;
    const xatoData = await response.json().catch(() => null);
    const xatoXabari = xatoData?.error?.message || "";
    const modelXatosi = status === 404
      || /(?:model|models\/).*(?:no longer|not found|unavailable|not available|does not exist|unsupported)/i.test(xatoXabari);
    if (!modelXatosi) {
      throw new ProvayderXatosi(String(xatoXabari || `Gemini HTTP ${status}`).slice(0, 300), {
        status,
        kod: `HTTP_${status}`,
        meta: { model: modelNomi, errorStage: "request" },
      });
    }
    const yangiModel = await geminiHaqiqiyModelOl(tozaKalit, nomzod.model, xatoXabari);
    if (yangiModel && yangiModel !== modelNomi) {
      modelNomi = yangiModel;
      response = await sovuqChaqir(modelNomi);
    } else {
      throw new ProvayderXatosi(String(xatoXabari || `Gemini HTTP ${status}`).slice(0, 300), {
        status,
        kod: `HTTP_${status}`,
        meta: { model: modelNomi, errorStage: "model" },
      });
    }
  }

  const data = await javobniTekshir(response, `Gemini (${modelNomi})`);
  const kandidat = data?.candidates?.[0] || null;
  const kontent = kandidat?.content || null;
  const qismlar = Array.isArray(kontent?.parts) ? kontent.parts : [];
  const matn = qismlar.filter((qism) => !qism?.thought).map((qism) => qism?.text || "").join("");
  const vositaChaqiruvlari = qismlar
    .filter((qism) => qism?.functionCall?.name)
    .map((qism, indeks) => ({
      id: qism.functionCall.id || `gemini-${indeks + 1}`,
      type: "function",
      function: {
        name: qism.functionCall.name,
        arguments: JSON.stringify(qism.functionCall.args || {}),
      },
    }));
  return {
    matn,
    vositaChaqiruvlari,
    yuborilganXabarlar,
    provayderXabari: kontent,
    model: data?.modelVersion || modelNomi,
    finishReason: kandidat?.finishReason || data?.promptFeedback?.blockReason || null,
    safetyBlocked: Boolean(data?.promptFeedback?.blockReason)
      || ["SAFETY", "BLOCKLIST", "PROHIBITED_CONTENT", "IMAGE_SAFETY"].includes(kandidat?.finishReason),
    responseChars: matn.length,
    usage: {
      inputTokens: data?.usageMetadata?.promptTokenCount || 0,
      outputTokens: data?.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: data?.usageMetadata?.totalTokenCount || 0,
      thoughtTokens: data?.usageMetadata?.thoughtsTokenCount || 0,
    },
  };
}

function aliasdanNomzod(alias, muhit) {
  const model = muhit.modellar[alias];
  if (alias.startsWith("deepseek")) return { alias, provayder: "deepseek", model, kalit: muhit.deepseek };
  if (alias.startsWith("groq")) return { alias, provayder: "groq", model, kalit: alias === "groqTezkor" ? (muhit.groq[1] || muhit.groq[0]) : muhit.groq[0] };
  if (alias.startsWith("gemini")) return { alias, provayder: "gemini", model, kalit: alias === "geminiZaxira" ? (muhit.gemini[1] || muhit.gemini[0]) : muhit.gemini[0] };
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
    qosh("gemini", muhit.modellar.geminiZaxira, muhit.gemini[1] || muhit.gemini[0], "geminiZaxira");
    qosh("openrouter", muhit.modellar.openrouterRasm, muhit.openrouter, "openrouterRasm");
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

export function aiGatewayChegaralariniOl({ yonalish = "oddiy", rasmBase64 = null, sozlama = null } = {}) {
  const asos = { ...(AI_YONALISH_SOZLAMALARI[yonalish] || AI_YONALISH_SOZLAMALARI.oddiy), ...(sozlama || {}) };
  const rasm = Boolean(rasmBase64);
  const tezkorMatn = yonalish === "tezkor" && !rasm;
  // Bazada saqlangan eski 8/14 soniyali tezkor sozlama Gemini javobiga
  // yetmaydi. Eski yozuv ham yangi kodda ishlashi uchun xavfsiz minimum.
  return {
    urinishVaqtiMs: rasm ? Math.max(asos.urinishVaqtiMs, 24_000)
      : tezkorMatn ? Math.max(asos.urinishVaqtiMs, 14_000) : asos.urinishVaqtiMs,
    umumiyVaqtMs: rasm ? Math.max(asos.umumiyVaqtMs, 75_000)
      : tezkorMatn ? Math.max(asos.umumiyVaqtMs, 30_000) : asos.umumiyVaqtMs,
    tokenChegarasi: rasm ? Math.max(asos.tokenChegarasi, 8_000) : asos.tokenChegarasi,
    urinishChegarasi: rasm ? Math.max(asos.urinishChegarasi, 3) : asos.urinishChegarasi,
  };
}

export async function aiModelChaqir(prompt, {
  systemPrompt = "",
  jsonRejim = true,
  jsonSxema = null,
  kutilganJavobTuri = null,
  rasmBase64 = null,
  preferDeepSeek = false,
  yonalish = "oddiy",
  runtimeSozlama = null,
  telemetriya = null,
  vositalar = [],
  vositaBajaruvchi = null,
  vositaTanlovi = "auto",
} = {}) {
  if (runtimeSozlama?.enabled === false) {
    throw new AiGatewayXatosi("JDA Kimyo AI admin tomonidan vaqtincha to'xtatilgan.", { statusCode: 503, kod: "AI_OCHIQ_EMAS" });
  }
  if (rasmBase64) {
    const rasmTekshiruvi = aiRasmDataUrliniTekshir(rasmBase64);
    if (!rasmTekshiruvi.yaroqli) {
      throw new AiGatewayXatosi(rasmTekshiruvi.sabab, { statusCode: 400, kod: "RASM_FORMATI" });
    }
  }

  const asosiySozlama = AI_YONALISH_SOZLAMALARI[yonalish] || AI_YONALISH_SOZLAMALARI.oddiy;
  const sozlama = { ...asosiySozlama, ...(runtimeSozlama?.directions?.[yonalish] || {}) };
  const chegaralar = aiGatewayChegaralariniOl({ yonalish, rasmBase64, sozlama });
  const { urinishVaqtiMs, umumiyVaqtMs, tokenChegarasi, urinishChegarasi } = chegaralar;
  const muhit = muhitSozlamalariOl();
  const nomzodlar = nomzodlarTuz({ muhit, rasmBase64, yonalish, preferDeepSeek, runtimeSozlama })
    .slice(0, urinishChegarasi);
  if (nomzodlar.length === 0) {
    throw new AiGatewayXatosi("AI provayder kalitlari sozlanmagan.", { statusCode: 503, kod: "KALIT_YOQ" });
  }

  const boshlanganVaqt = Date.now();
  // Kimyo vositalari bittadan atomar hisob beradi; 12 lik chegara promptni
  // shishirmaydi va kengaytirilgan 10 vositalik reyestrni to'liq uzatadi.
  const faolVositalar = Array.isArray(vositalar) ? vositalar.slice(0, 12) : [];
  let oxirgiXato = null;
  const urinishXatolari = [];
  for (let indeks = 0; indeks < nomzodlar.length; indeks++) {
    const nomzod = nomzodlar[indeks];
    const qolganVaqt = umumiyVaqtMs - (Date.now() - boshlanganVaqt);
    if (qolganVaqt < 500) break;
    const urinishBoshlanishi = Date.now();
    let javob = null;
    const yigilganSarf = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    try {
      let xabarlar = faolVositalar.length && nomzod.provayder !== "gemini"
        ? openAiXabarlari(prompt, systemPrompt)
        : null;
      let vositaIshlatildi = false;
      let kesilishQaytaUrinildi = false;
      let joriyTokenChegarasi = tokenChegarasi;
      for (let aylana = 0; aylana < 4; aylana++) {
        const ichkiQolganVaqt = umumiyVaqtMs - (Date.now() - boshlanganVaqt);
        if (ichkiQolganVaqt < 500) {
          throw new ProvayderXatosi("AI umumiy vaqt chegarasiga yetdi.", { kod: "VAQT_TUGADI" });
        }
        javob = await nomzodniChaqir(nomzod, {
          prompt,
          systemPrompt,
          jsonRejim,
          jsonSxema: jsonSxema || aiJavobJsonSxemasiniOl(kutilganJavobTuri),
          kutilganJavobTuri,
          rasmBase64,
          tokenChegarasi: joriyTokenChegarasi,
          vaqtMs: Math.min(urinishVaqtiMs, ichkiQolganVaqt),
          fikrlashDarajasi: rasmBase64 ? "low" : (yonalish === "murakkab" ? "high" : "low"),
          xabarlar,
          vositalar: faolVositalar,
          vositaTanlovi: vositaIshlatildi ? "auto" : vositaTanlovi,
        });
        for (const maydon of Object.keys(yigilganSarf)) {
          yigilganSarf[maydon] += Number(javob.usage?.[maydon]) || 0;
        }
        if (tokenChegarasidaKesildimi(javob.finishReason)) {
          const qaytaUrinishUchunVaqt = umumiyVaqtMs - (Date.now() - boshlanganVaqt);
          if (rasmBase64 && !kesilishQaytaUrinildi && joriyTokenChegarasi < 12_000 && qaytaUrinishUchunVaqt >= 2_000) {
            kesilishQaytaUrinildi = true;
            joriyTokenChegarasi = 12_000;
            continue;
          }
          throw new ProvayderXatosi("Provayder javobi token chegarasida kesildi.", {
            kod: "JAVOB_KESILDI",
            meta: {
              ...yigilganSarf,
              model: javob.model || nomzod.model,
              finishReason: javob.finishReason,
              responseChars: javob.responseChars,
              errorStage: "generation",
            },
          });
        }
        if (javob.safetyBlocked) {
          throw new ProvayderXatosi("Provayder xavfsizlik filtri javobni to'xtatdi.", {
            kod: "PROVAYDER_XAVFSIZLIK_BLOKI",
            meta: {
              ...yigilganSarf,
              model: javob.model || nomzod.model,
              finishReason: javob.finishReason,
              responseChars: javob.responseChars,
              safetyBlocked: true,
              errorStage: "safety",
            },
          });
        }
        const chaqiruvlar = javob.vositaChaqiruvlari || [];
        if (chaqiruvlar.length === 0) break;
        if (typeof vositaBajaruvchi !== "function") {
          throw new ProvayderXatosi("Model vosita so'radi, lekin server bajaruvchisi yo'q.", { kod: "VOSITA_BAJARUVCHISI_YOQ" });
        }
        if (nomzod.provayder === "gemini") {
          xabarlar = [...(javob.yuborilganXabarlar || []), javob.provayderXabari].filter(Boolean);
        } else {
          xabarlar.push({ role: "assistant", content: javob.matn || null, tool_calls: chaqiruvlar });
        }
        const geminiJavobQismlari = [];
        for (const chaqiruv of chaqiruvlar.slice(0, 4)) {
          const nom = chaqiruv?.function?.name;
          let argumentlar;
          try { argumentlar = JSON.parse(chaqiruv?.function?.arguments || "{}"); } catch { argumentlar = null; }
          const natija = argumentlar && typeof argumentlar === "object"
            ? await vositaBajaruvchi({ nom, argumentlar })
            : { muvaffaqiyatli: false, xato: "Vosita argumentlari JSON emas." };
          if (nomzod.provayder === "gemini") {
            geminiJavobQismlari.push({
              functionResponse: {
                id: chaqiruv.id,
                name: nom,
                response: { result: natija },
              },
            });
          } else {
            xabarlar.push({
              role: "tool",
              tool_call_id: chaqiruv.id,
              content: JSON.stringify(natija).slice(0, 6000),
            });
          }
        }
        if (nomzod.provayder === "gemini") {
          xabarlar.push({ role: "user", parts: geminiJavobQismlari });
        }
        vositaIshlatildi = true;
      }
      if (faolVositalar.length && vositaTanlovi === "required" && !vositaIshlatildi) {
        throw new ProvayderXatosi("Murakkab hisob uchun model deterministik vositani chaqirmadi.", { kod: "VOSITA_CHAQIRILMADI" });
      }
      if (!javob.matn) {
        throw new ProvayderXatosi("Provayder bo'sh javob qaytardi.", {
          kod: "BOSH_JAVOB",
          meta: {
            ...yigilganSarf,
            model: javob.model || nomzod.model,
            finishReason: javob.finishReason,
            responseChars: javob.responseChars,
            errorStage: "generation",
          },
        });
      }
      const natija = jsonRejim ? tozaJsonOqi(javob.matn) : javob.matn;
      if (!natija) {
        throw new ProvayderXatosi("Provayder javobi kerakli JSON shaklida emas.", {
          kod: "FORMAT_XATOSI",
          meta: {
            ...yigilganSarf,
            model: javob.model || nomzod.model,
            finishReason: javob.finishReason,
            responseChars: javob.responseChars,
            errorStage: "json_parse",
          },
        });
      }
      if (jsonRejim) {
        const tekshiruv = aiMasalaNatijasiniTekshir(natija, kutilganJavobTuri);
        if (!tekshiruv.yaroqli) {
          throw new ProvayderXatosi(`Provayder javobi yaroqsiz: ${tekshiruv.sabab}`, {
            kod: "FORMAT_XATOSI",
            meta: {
              ...yigilganSarf,
              model: javob.model || nomzod.model,
              finishReason: javob.finishReason,
              responseChars: javob.responseChars,
              errorStage: "schema_validation",
            },
          });
        }
      }
      await telemetriyaniYubor(telemetriya, {
        provider: nomzod.provayder,
        model: javob.model || nomzod.model,
        status: "success",
        durationMs: Date.now() - urinishBoshlanishi,
        fallbackIndex: nomzod.routingIndex ?? indeks,
        ...yigilganSarf,
      });
      return natija;
    } catch (error) {
      oxirgiXato = error;
      const meta = error?.meta || {};
      const xatoKodi = error?.status
        ? [error?.kod || "HTTP_XATOSI", error.status, meta.errorStage].filter(Boolean).join(":").slice(0, 80)
        : [
          error?.kod || "NOMALUM",
          meta.finishReason,
          meta.errorStage,
          Number.isFinite(meta.responseChars) ? `belgi_${meta.responseChars}` : null,
        ].filter(Boolean).join(":").slice(0, 80);
      urinishXatolari.push({
        provayder: nomzod.provayder,
        model: meta.model || javob?.model || nomzod.model,
        kod: error?.kod || "NOMALUM",
        httpStatus: Number(error?.status) || 0,
      });
      const hodisa = {
        provider: nomzod.provayder,
        model: meta.model || javob?.model || nomzod.model,
        status: "error",
        errorCode: xatoKodi,
        durationMs: Date.now() - urinishBoshlanishi,
        fallbackIndex: nomzod.routingIndex ?? indeks,
        inputTokens: meta.inputTokens || yigilganSarf.inputTokens,
        outputTokens: meta.outputTokens || yigilganSarf.outputTokens,
        totalTokens: meta.totalTokens || yigilganSarf.totalTokens,
      };
      await telemetriyaniYubor(telemetriya, hodisa);
      console.warn("[AI Gateway urinish xatosi]", { ...hodisa, urinish: indeks + 1 });
    }
  }

  const vaqtTugadimi = Date.now() - boshlanganVaqt >= umumiyVaqtMs || oxirgiXato?.kod === "VAQT_TUGADI";
  throw new AiGatewayXatosi(
    vaqtTugadimi
      ? "AI provayderlari belgilangan vaqtda javob bermadi. Birozdan keyin qayta urinib ko'ring."
      : "AI xizmatida vaqtinchalik uzilish yuz berdi. Bir ozdan keyin qayta urinib ko'ring.",
    {
      statusCode: vaqtTugadimi ? 504 : 502,
      kod: vaqtTugadimi ? "UMUMIY_VAQT_TUGADI" : "BARCHA_URINISH_XATO",
      tafsilotlar: urinishXatolari,
    },
  );
}

/** Admin tekshiruvi haqiqiy gateway chaqiruvchilaridan foydalanadi va kalitni qaytarmaydi. */
export async function aiProvayderKorigi({ runtimeSozlama = null, prompt = "H2O formulasi nimani anglatadi? Bir jumlada javob bering." } = {}) {
  const muhit = muhitSozlamalariOl();
  const sozlanganAliaslar = runtimeSozlama?.routing
    ? Object.values(runtimeSozlama.routing).flat()
    : ["deepseekZaxira", "groqTezkor", "geminiAsosiy", "geminiZaxira", "openrouterRasm"];
  const aliaslar = [...new Set(sozlanganAliaslar)];
  const nomzodlar = aliaslar.map((alias) => aliasdanNomzod(alias, muhit));
  const sozlama = { ...AI_YONALISH_SOZLAMALARI.tezkor, ...(runtimeSozlama?.directions?.tezkor || {}) };
  // Bir piksel PNG foydalanuvchi ma'lumotini tashqariga chiqarmasdan vision
  // endpointi va structured-output shartnomasini birga tekshiradi.
  const canaryRasm = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  return Promise.all(nomzodlar.map(async (nomzod) => {
    if (!nomzod?.kalit) {
      return { alias: nomzod?.alias || "noma'lum", provayder: nomzod?.provayder || "noma'lum", model: nomzod?.model || "", sozlangan: false, holat: "kalit_yoq", sarfMs: 0 };
    }
    const boshlandi = Date.now();
    try {
      const rasmSinovi = nomzod.provayder === "gemini" || nomzod.provayder === "openrouter";
      const javob = await nomzodniChaqir(nomzod, {
        prompt: `Sinov savoli: ${String(prompt || "").slice(0, 500)}`,
        systemPrompt: "Kimyo savoliga qisqa javob bering va belgilangan JSON shartnomasiga qat'iy rioya qiling.",
        jsonRejim: true,
        jsonSxema: AI_SUHBAT_JSON_SXEMASI,
        kutilganJavobTuri: "suhbat",
        rasmBase64: rasmSinovi ? canaryRasm : null,
        tokenChegarasi: Math.min(2_000, Math.max(1_500, sozlama.tokenChegarasi)),
        vaqtMs: Math.min(20_000, Math.max(12_000, sozlama.urinishVaqtiMs)),
        fikrlashDarajasi: "low",
      });
      const natija = tozaJsonOqi(javob.matn);
      const tekshiruv = aiMasalaNatijasiniTekshir(natija, "suhbat");
      return {
        alias: nomzod.alias,
        provayder: nomzod.provayder,
        model: javob.model || nomzod.model,
        sozlangan: true,
        holat: !tekshiruv.yaroqli
          ? "format_xatosi"
          : tokenChegarasidaKesildimi(javob.finishReason)
            ? "javob_kesildi"
            : "ishlayapti",
        rasmSinovi,
        sarfMs: Date.now() - boshlandi,
        tokenlar: javob.usage?.totalTokens || 0,
      };
    } catch (error) {
      return {
        alias: nomzod.alias,
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
