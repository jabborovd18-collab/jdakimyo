// app/masala/page.js
//
// JDA KIMYO AI — ZAMONAVIY CHATBOT FORMATIDAGI KIMYOVIY MASALALAR ASSISTENTI (v5.0.0)
// ChatGPT Mobile formati, Hands-free Jonli Ovozli AI (TTS/STT), Aqlli Kesh va Klasterli Agentlar.

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";
import LatexMatn from "@/components/LatexMatn.jsx";
import BoyitilganMatn from "@/components/BoyitilganMatn.jsx";
import UsageModelsModal from "@/components/masala/UsageModelsModal";
import { masalaPdfYukla } from "@/lib/masala-pdf.js";
import { ovozPleyeri } from "@/lib/ovoz-pleyer.js";
import {
  aiChatlarRoyxatiniOl,
  aiChatniOl,
  aiChatniOchirish,
  aiChatniSaqlash,
  aiSozlamaniOl,
  aiSozlamaniSaqlash,
  aiXotiraNusxasiniOl,
  aiXotiraNusxasiniQosh,
  brauzerXotirasiniBarqarorQil,
  oquvProfiliniOl,
  oquvProfiliniYangila,
  yangiAiChatId,
} from "@/lib/ai-xotira-brauzer.js";
import toast from "react-hot-toast";

const REJIMLAR = [
  {
    id: "tuzoq",
    nom: "Tuzoq Tahlili",
    ikon: "chaqmoq",
    qisqa: "Tuzoq",
    tavsif: "Masaladagi nozik ayyorlik va xatolar tahlili (Javobsiz)",
  },
  {
    id: "yonalish",
    nom: "Yo'nalish & Reja",
    ikon: "kitob",
    qisqa: "Yo'nalish",
    tavsif: "Reaksiya tenglamalari va formulalar rejasi",
  },
  {
    id: "toliq",
    nom: "Master Yechim",
    ikon: "tasdiq",
    qisqa: "Master",
    tavsif: "Berilgan, Reaksiya, KaTeX bosqichlari va yakuniy javob",
  },
];

const ISHLASH_YONALISHLARI = [
  { id: "avtomatik", nom: "Avtomatik" },
  { id: "tezkor", nom: "Tez javob" },
  { id: "oddiy", nom: "Oddiy" },
  { id: "murakkab", nom: "Chuqur" },
];

const MIJOZ_VAQT_CHEGARASI = {
  avtomatik: 55_000,
  tezkor: 18_000,
  oddiy: 35_000,
  murakkab: 55_000,
};

const TEZKOR_BELGILAR = [
  "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉",
  "⁺", "⁻", "²⁺", "³⁺", "→", "⇌", "↑", "↓", "Δ", "°C", "ω", "ν", "ρ", "pH"
];

function chatKontekstiniYig(xabarlar, profil) {
  const oxirgiXabarlar = xabarlar
    .slice(-6)
    .map((xabar) => {
      const matn = xabar.matn
        || xabar.yechim?.yakuniyJavob
        || (xabar.rasm ? "Rasmli kimyo masalasi" : "");
      return matn ? { rol: xabar.rol, matn: String(matn).slice(0, 500) } : null;
    })
    .filter(Boolean);

  return {
    oxirgiXabarlar,
    profil: profil ? {
      mavzular: profil.mavzular || {},
      oxirgiFaollik: profil.oxirgiFaollik || null,
    } : null,
  };
}

export default function MasalaChatSahifasi() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [rejim, setRejim] = useState("toliq");
  const [ishlashYonalishi, setIshlashYonalishi] = useState("avtomatik");
  const [kiritma, setKiritma] = useState("");
  const [rasmBase64, setRasmBase64] = useState(null);
  const [rasmNomi, setRasmNomi] = useState("");
  const [klaviaturaOchiq, setKlaviaturaOchiq] = useState(false);
  const [usageModalOchiq, setUsageModalOchiq] = useState(false);

  // Chat xabarlar oqimi
  const [xabarlar, setXabarlar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [jonliHolat, setJonliHolat] = useState({ ikon: "kolba", matn: "" });
  const [chatId, setChatId] = useState(null);
  const [saqlanganChatlar, setSaqlanganChatlar] = useState([]);
  const [tarixOchiq, setTarixOchiq] = useState(false);
  const [xotiraTayyor, setXotiraTayyor] = useState(false);
  const [akkauntSinxroni, setAkkauntSinxroni] = useState(false);
  const [sinxronHolat, setSinxronHolat] = useState("mahalliy");

  // Ovozli AI (Hands-free & TTS/STT)
  const [ovozYozilmoqda, setOvozYozilmoqda] = useState(false);
  const [avtoOvozRejimi, setAvtoOvozRejimi] = useState(false);
  const [faolOvozId, setFaolOvozId] = useState(null);
  const [oraliqOvozMatni, setOraliqOvozMatni] = useState("");
  const [ovozHolati, setOvozHolati] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const sorovControllerRef = useRef(null);
  const chatAvlodiRef = useRef(0);
  const sinxronTaymerRef = useRef(null);
  const avtoOvozRef = useRef(false);
  const yuklanmoqdaRef = useRef(false);
  const ovozQoldaToxtadiRef = useRef(false);
  const sttYakuniyRef = useRef("");
  const sttBoshlangichRef = useRef("");
  const sttTilRef = useRef("uz-UZ");
  const avtoYuborTaymerRef = useRef(null);
  const xabarYuborishRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [xabarlar, jonliHolat]);

  useEffect(() => {
    avtoOvozRef.current = avtoOvozRejimi;
  }, [avtoOvozRejimi]);

  useEffect(() => {
    yuklanmoqdaRef.current = yuklanmoqda;
  }, [yuklanmoqda]);

  useEffect(() => {
    let faol = true;

    async function xotiraniTiklash() {
      try {
        void brauzerXotirasiniBarqarorQil();
        const [faolChatId, sinxronYoqilgan] = await Promise.all([
          aiSozlamaniOl("faolChatId"),
          aiSozlamaniOl("akkauntSinxroni", false),
        ]);

        if (sinxronYoqilgan) {
          setAkkauntSinxroni(true);
          setSinxronHolat("yuklanmoqda");
          const javob = await fetch("/api/masala/xotira", { cache: "no-store" });
          if (javob.ok) {
            const data = await javob.json();
            if (data.nusxa) await aiXotiraNusxasiniQosh(data.nusxa);
            setSinxronHolat("sinxron");
          } else {
            setSinxronHolat("xato");
          }
        }

        const chatlar = await aiChatlarRoyxatiniOl();
        const tiklanadiganId = chatlar.some((chat) => chat.id === faolChatId)
          ? faolChatId
          : chatlar[0]?.id;
        const chat = tiklanadiganId ? await aiChatniOl(tiklanadiganId) : null;

        if (!faol) return;
        const yangiId = tiklanadiganId || yangiAiChatId();
        setChatId(yangiId);
        setXabarlar(chat?.xabarlar || []);
        setSaqlanganChatlar(chatlar);
        await aiSozlamaniSaqlash("faolChatId", yangiId);
      } catch (error) {
        console.warn("[AI XOTIRA] Brauzer tarixini tiklab bo'lmadi:", error);
        if (faol) {
          setChatId(yangiAiChatId());
          toast.error("Chat tarixini ochib bo'lmadi. Joriy chat vaqtincha ishlaydi.");
        }
      } finally {
        if (faol) setXotiraTayyor(true);
      }
    }

    void xotiraniTiklash();
    return () => {
      faol = false;
      sorovControllerRef.current?.abort();
      clearTimeout(sinxronTaymerRef.current);
      clearTimeout(avtoYuborTaymerRef.current);
      ovozQoldaToxtadiRef.current = true;
      try { recognitionRef.current?.abort(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (!xotiraTayyor || !chatId) return;
    void aiSozlamaniSaqlash("faolChatId", chatId);
    if (xabarlar.length === 0) return;

    let bekor = false;
    aiChatniSaqlash({ id: chatId, xabarlar })
      .then(() => aiChatlarRoyxatiniOl())
      .then((chatlar) => {
        if (!bekor) setSaqlanganChatlar(chatlar);
      })
      .catch((error) => console.warn("[AI XOTIRA] Chat saqlanmadi:", error));

    clearTimeout(sinxronTaymerRef.current);
    if (akkauntSinxroni) {
      sinxronTaymerRef.current = setTimeout(async () => {
        try {
          setSinxronHolat("yuklanmoqda");
          const nusxa = await aiXotiraNusxasiniOl();
          const javob = await fetch("/api/masala/xotira", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nusxa),
          });
          if (!javob.ok) throw new Error("Akkaunt xotirasi saqlanmadi");
          setSinxronHolat("sinxron");
        } catch (error) {
          console.warn("[AI XOTIRA] Sinxronlash xatosi:", error);
          setSinxronHolat("xato");
        }
      }, 2500);
    }

    return () => {
      bekor = true;
    };
  }, [xabarlar, chatId, xotiraTayyor, akkauntSinxroni]);

  const aiSorovYubor = async (body, tanlanganYonalish) => {
    const controller = new AbortController();
    sorovControllerRef.current = controller;
    const vaqtMs = MIJOZ_VAQT_CHEGARASI[tanlanganYonalish]
      || MIJOZ_VAQT_CHEGARASI.avtomatik;
    const taymer = setTimeout(() => controller.abort(), vaqtMs);

    try {
      const response = await fetch("/api/masala/yech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.xato || "AI so'rovini bajarib bo'lmadi");
      }
      return data;
    } catch (error) {
      if (controller.signal.aborted) {
        const vaqtXatosi = new Error("So'rov belgilangan vaqtda tugamadi. Qayta urinib ko'ring.");
        vaqtXatosi.kod = "BEKOR_QILINDI";
        throw vaqtXatosi;
      }
      throw error;
    } finally {
      clearTimeout(taymer);
      if (sorovControllerRef.current === controller) {
        sorovControllerRef.current = null;
      }
    }
  };

  // STT final va oraliq natijani alohida ushlaydi. Aks holda brauzer har
  // oraliq natijada oldingi matnni yo'qotib, gapni "sakratib" yuboradi.
  const startOvozYozish = (qaytaBoshlash = false) => {
    if (typeof window === "undefined" || yuklanmoqdaRef.current) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Brauzeringiz ovozli yozishni qo'llab-quvvatlamaydi (Chrome yoki Edge ishlating).");
      return;
    }

    try {
      if (recognitionRef.current) {
        ovozQoldaToxtadiRef.current = true;
        try { recognitionRef.current.abort(); } catch {}
      }

      clearTimeout(avtoYuborTaymerRef.current);
      ovozPleyeri.toxtat();
      setFaolOvozId(null);
      ovozQoldaToxtadiRef.current = false;
      if (!qaytaBoshlash) {
        sttBoshlangichRef.current = kiritma.trim();
        sttYakuniyRef.current = "";
        setOraliqOvozMatni("");
      }

      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.maxAlternatives = 1;
      recognizer.lang = sttTilRef.current;

      recognizer.onstart = () => {
        setOvozYozilmoqda(true);
        setOvozHolati(qaytaBoshlash ? "Tinglash davom etmoqda..." : "Tinglamoqdaman...");
        if (!qaytaBoshlash) {
          toast.success("Tinglamoqdaman... Masalani gapiring.", { icon: "🎙️" });
        }
      };

      recognizer.onresult = (event) => {
        let yangiYakuniy = "";
        let oraliq = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const bolak = event.results[i][0]?.transcript?.trim();
          if (!bolak) continue;
          if (event.results[i].isFinal) yangiYakuniy += ` ${bolak}`;
          else oraliq += ` ${bolak}`;
        }

        if (yangiYakuniy.trim()) {
          sttYakuniyRef.current = `${sttYakuniyRef.current} ${yangiYakuniy}`.replace(/\s+/g, " ").trim();
        }
        const toliqMatn = [sttBoshlangichRef.current, sttYakuniyRef.current, oraliq.trim()]
          .filter(Boolean)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        setKiritma(toliqMatn);
        setOraliqOvozMatni(oraliq.trim());
        setOvozHolati(oraliq.trim() ? "Gap aniqlanmoqda..." : "Jimlik kutilmoqda...");

        if (avtoOvozRef.current && yangiYakuniy.trim()) {
          clearTimeout(avtoYuborTaymerRef.current);
          avtoYuborTaymerRef.current = setTimeout(() => {
            const yuboriladigan = [sttBoshlangichRef.current, sttYakuniyRef.current]
              .filter(Boolean)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
            if (!yuboriladigan || yuklanmoqdaRef.current) return;
            ovozQoldaToxtadiRef.current = true;
            try { recognizer.stop(); } catch {}
            setOraliqOvozMatni("");
            setOvozHolati("Yuborilmoqda...");
            xabarYuborishRef.current?.(null, yuboriladigan);
          }, 1100);
        }
      };

      recognizer.onerror = (event) => {
        console.warn("[STT Xatolik]:", event.error);
        setOvozYozilmoqda(false);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          ovozQoldaToxtadiRef.current = true;
          setOvozHolati("Mikrofon ruxsati berilmagan");
          toast.error("Mikrofonga ruxsat berilmagan. Brauzer sozlamalaridan ruxsat bering.");
        } else if (event.error === "language-not-supported" && sttTilRef.current !== "ru-RU") {
          sttTilRef.current = "ru-RU";
          ovozQoldaToxtadiRef.current = true;
          setOvozHolati("Muqobil til bilan qayta ulanmoqda...");
          setTimeout(() => startOvozYozish(true), 450);
        } else if (event.error !== "no-speech" && event.error !== "aborted") {
          setOvozHolati("Ovozni tanib bo'lmadi");
          toast.error("Ovozni tanishda uzilish bo'ldi. Qayta urinib ko'ring.");
        }
      };

      recognizer.onend = () => {
        setOvozYozilmoqda(false);
        recognitionRef.current = null;
        const davomEtishKerak = avtoOvozRef.current
          && !ovozQoldaToxtadiRef.current
          && !yuklanmoqdaRef.current
          && !sttYakuniyRef.current;
        if (davomEtishKerak) {
          setTimeout(() => startOvozYozish(true), 350);
        } else if (!yuklanmoqdaRef.current) {
          setOvozHolati("");
        }
      };

      recognitionRef.current = recognizer;
      recognizer.start();
    } catch (err) {
      console.error("[STT Boshlash xatosi]:", err);
      setOvozYozilmoqda(false);
      setOvozHolati("");
      toast.error("Mikrofonni ishga tushirib bo'lmadi.");
    }
  };

  const toxtatOvozYozish = () => {
    ovozQoldaToxtadiRef.current = true;
    clearTimeout(avtoYuborTaymerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    recognitionRef.current = null;
    setOvozYozilmoqda(false);
    setOraliqOvozMatni("");
    setOvozHolati("");
  };

  const handleOvozYozish = () => {
    if (ovozYozilmoqda) {
      toxtatOvozYozish();
      toast("Ovoz yozish to'xtatildi", { icon: "⏹️" });
    } else {
      startOvozYozish();
    }
  };

  // Ovozda ijro etish funksiyasi (TTS)
  const matnniOvozdaIjroEt = (matn, xabarId) => {
    if (!matn) return;

    if (faolOvozId === xabarId) {
      ovozPleyeri.toxtat();
      setFaolOvozId(null);
      return;
    }

    setFaolOvozId(xabarId);
    ovozPleyeri.boshla(matn, {
      onBoshlandi: () => setFaolOvozId(xabarId),
      onTugadi: () => {
        setFaolOvozId(null);
        // Hands-free rejimda AI javob berib bo'lgach foydalanuvchini tinglaydi
        if (avtoOvozRef.current) {
          setTimeout(() => {
            startOvozYozish();
          }, 400);
        }
      },
      onXato: (xatoXabar) => {
        setFaolOvozId(null);
        toast.error(xatoXabar || "Ovozda o'qishda xatolik yuz berdi");
      },
    });
  };

  const belgiQosh = (belgi) => {
    if (!textareaRef.current) {
      setKiritma((prev) => prev + belgi);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const yangi = kiritma.substring(0, start) + belgi + kiritma.substring(end);
    setKiritma(yangi);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + belgi.length, start + belgi.length);
    }, 0);
  };

  const handleRasmYuklash = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm fayllarini yuklash mumkin (.jpg, .png, .webp)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm hajmi 5 MB dan oshmasligi kerak.");
      return;
    }
    setRasmNomi(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRasmBase64(ev.target.result);
      toast.success("Rasm biriktirildi!");
    };
    reader.readAsDataURL(file);
  };

  const handleRasmOchirish = () => {
    setRasmBase64(null);
    setRasmNomi("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Rasm olib tashlandi");
  };

  const chatniOch = async (tanlanganId) => {
    if (tanlanganId === chatId || yuklanmoqda) return;
    try {
      chatAvlodiRef.current += 1;
      sorovControllerRef.current?.abort();
      ovozPleyeri.toxtat();
      toxtatOvozYozish();
      const chat = await aiChatniOl(tanlanganId);
      if (!chat) throw new Error("Chat topilmadi");
      setChatId(tanlanganId);
      setXabarlar(chat.xabarlar || []);
      setTarixOchiq(false);
      setYuklanmoqda(false);
      setJonliHolat({ ikon: "kolba", matn: "" });
      await aiSozlamaniSaqlash("faolChatId", tanlanganId);
    } catch (error) {
      toast.error(error.message || "Chatni ochib bo'lmadi");
    }
  };

  const saqlanganChatniOchirish = async (ochiriladiganId) => {
    if (!window.confirm("Bu chat tarixdan butunlay o'chirilsinmi?")) return;
    try {
      await aiChatniOchirish(ochiriladiganId);
      const chatlar = await aiChatlarRoyxatiniOl();
      setSaqlanganChatlar(chatlar);
      if (ochiriladiganId === chatId) {
        yangiChatBoshlash();
      }
      toast.success("Chat tarixdan o'chirildi");
    } catch {
      toast.error("Chatni o'chirib bo'lmadi");
    }
  };

  const akkauntSinxroniniAlmashtir = async () => {
    if (sinxronHolat === "yuklanmoqda") return;
    if (akkauntSinxroni) {
      setAkkauntSinxroni(false);
      setSinxronHolat("mahalliy");
      await aiSozlamaniSaqlash("akkauntSinxroni", false);
      toast("Akkaunt sinxroni o'chdi. Chatlar brauzerda saqlanadi.");
      return;
    }

    try {
      setSinxronHolat("yuklanmoqda");
      const olishJavobi = await fetch("/api/masala/xotira", { cache: "no-store" });
      if (olishJavobi.status === 401) {
        throw new Error("Sinxronlash uchun akkauntga kiring");
      }
      if (!olishJavobi.ok) throw new Error("Akkaunt xotirasini ochib bo'lmadi");
      const data = await olishJavobi.json();
      if (data.nusxa) await aiXotiraNusxasiniQosh(data.nusxa);

      const nusxa = await aiXotiraNusxasiniOl();
      const saqlashJavobi = await fetch("/api/masala/xotira", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nusxa),
      });
      if (!saqlashJavobi.ok) throw new Error("Akkaunt xotirasini saqlab bo'lmadi");

      setAkkauntSinxroni(true);
      setSinxronHolat("sinxron");
      await aiSozlamaniSaqlash("akkauntSinxroni", true);
      setSaqlanganChatlar(await aiChatlarRoyxatiniOl());
      toast.success("Chatlar akkaunt bilan sinxronlandi");
    } catch (error) {
      setSinxronHolat("xato");
      toast.error(error.message || "Sinxronlashda xatolik yuz berdi");
    }
  };

  // YANGI CHAT BOSHLASH (NEW CHAT)
  const yangiChatBoshlash = () => {
    chatAvlodiRef.current += 1;
    sorovControllerRef.current?.abort();
    setXabarlar([]);
    setKiritma("");
    setRasmBase64(null);
    setRasmNomi("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    ovozPleyeri.toxtat();
    toxtatOvozYozish();
    setFaolOvozId(null);
    setYuklanmoqda(false);
    setJonliHolat({ ikon: "kolba", matn: "" });
    const yangiId = yangiAiChatId();
    setChatId(yangiId);
    void aiSozlamaniSaqlash("faolChatId", yangiId);
    setTarixOchiq(false);
    toast.success("Yangi suhbat boshlandi!");
  };

  // Rasmdagi boshqa masalani tezkor yechish
  const handleBoshqaMasalaniYech = (masalaNomi, rasmData) => {
    setKiritma(`${masalaNomi}ni to'liq yechib ber`);
    if (rasmData) {
      setRasmBase64(rasmData);
      setRasmNomi("Avvalgi rasm");
    }
  };

  // Asosiy xabar jo'natish
  const handleXabarYuborish = async (e, majburiyMatn = null) => {
    if (e) e.preventDefault();
    const yuboriladiganMatn = majburiyMatn ?? kiritma;
    if (!yuboriladiganMatn.trim() && !rasmBase64) return;
    if (yuklanmoqda) return;

    if (ovozYozilmoqda) {
      toxtatOvozYozish();
    }

    const joriyMatn = yuboriladiganMatn.trim();
    const joriyRasm = rasmBase64;
    const joriyRejim = rejim;
    const joriyIshlashYonalishi = ishlashYonalishi;
    const joriyChatAvlodi = chatAvlodiRef.current;
    const xotiraKontekstiPromise = oquvProfiliniOl()
      .catch(() => null)
      .then((profil) => chatKontekstiniYig(xabarlar, profil));

    // Kiritma maydonlarini tozalash
    setKiritma("");
    setRasmBase64(null);
    setRasmNomi("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Chatga foydalanuvchi xabarini qo'shish
    const userMsg = {
      id: "user-" + Date.now(),
      rol: "user",
      matn: joriyMatn,
      rasm: joriyRasm,
      vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
    };

    setXabarlar((prev) => [...prev, userMsg]);
    setYuklanmoqda(true);

    const kutishHolati = {
      avtomatik: "So'rov turi serverda aniqlanmoqda...",
      tezkor: "Tezkor javob tayyorlanmoqda...",
      oddiy: "Kimyoviy masala yechilmoqda...",
      murakkab: "Chuqur tahlil va tekshiruv bajarilmoqda...",
    };
    setJonliHolat({
      ikon: joriyRasm ? "rasm" : "kolba",
      matn: kutishHolati[joriyIshlashYonalishi],
    });

    try {
      const xotiraKonteksti = await xotiraKontekstiPromise;
      const oxirgiAiYechim = [...xabarlar].reverse().find((m) => m.rol === "ai" && m.turi === "yechim");

      const isFollowUp = !joriyRasm && oxirgiAiYechim && joriyMatn.length < 80 && (
        joriyMatn.includes("?") ||
        joriyMatn.toLowerCase().includes("nega") ||
        joriyMatn.toLowerCase().includes("qanday") ||
        joriyMatn.toLowerCase().includes("boshqa") ||
        joriyMatn.toLowerCase().includes("tushunmadim")
      );

      if (isFollowUp) {
        setJonliHolat({ ikon: "ustoz", matn: "AI repetitor tushuntirish yozmoqda..." });
        const data = await aiSorovYubor({
            action: "chat",
            masalaMatni: oxirgiAiYechim.yechim?.masalaMatni || "",
            yechim: oxirgiAiYechim.yechim,
            savol: joriyMatn,
            ishlashYonalishi: joriyIshlashYonalishi,
            xotiraKonteksti,
          }, joriyIshlashYonalishi);
        if (chatAvlodiRef.current !== joriyChatAvlodi) return;

        const aiId = "ai-" + Date.now();
        setXabarlar((prev) => [
          ...prev,
          {
            id: aiId,
            rol: "ai",
            turi: "chat_javob",
            matn: data.javob,
            aiYonalish: data.aiYonalish,
            vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        if (avtoOvozRejimi) {
          matnniOvozdaIjroEt(data.javob, aiId);
        }
      } else {
        const data = await aiSorovYubor({
            action: "yech",
            masalaMatni: joriyMatn,
            rejim: joriyRejim,
            rasm: joriyRasm,
            ishlashYonalishi: joriyIshlashYonalishi,
            xotiraKonteksti,
          }, joriyIshlashYonalishi);
        if (chatAvlodiRef.current !== joriyChatAvlodi) return;

        const aiId = "ai-" + Date.now();
        if (data.turi === "suhbat") {
          setXabarlar((prev) => [
            ...prev,
            {
              id: aiId,
              rol: "ai",
              turi: "chat_javob",
              matn: data.matn,
              aiYonalish: data.aiYonalish,
              vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          if (avtoOvozRejimi) {
            matnniOvozdaIjroEt(data.matn, aiId);
          }
        } else {
          void oquvProfiliniYangila(data.masalaTuri);
          setXabarlar((prev) => [
            ...prev,
            {
              id: aiId,
              rol: "ai",
              turi: "yechim",
              yechim: data,
              rejim: joriyRejim,
              aiYonalish: data.aiYonalish,
              vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          if (avtoOvozRejimi && data.ovozMatni) {
            matnniOvozdaIjroEt(data.ovozMatni, aiId);
          }
        }
      }
    } catch (err) {
      if (chatAvlodiRef.current !== joriyChatAvlodi) return;
      toast.error(err.message || "Xatolik yuz berdi");
      setXabarlar((prev) => [
        ...prev,
        {
          id: "ai-err-" + Date.now(),
          rol: "ai",
          turi: "xato",
          matn: `Xatolik: ${err.message || "Masalani tahlil qilib bo'lmadi. Qayta urinib ko'ring."}`,
          vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      if (chatAvlodiRef.current === joriyChatAvlodi) {
        setYuklanmoqda(false);
        setJonliHolat({ ikon: "kolba", matn: "" });
      }
    }
  };

  xabarYuborishRef.current = handleXabarYuborish;

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen w-full flex flex-col justify-between transition-colors duration-200 bg-[var(--v3-fon)] text-[var(--v3-matn)] font-sans"
    >
      {/* ─── 1. CHATGPT USLUBIDAGI IXCHAM HEADER ─── */}
      <header className="sticky top-0 z-40 bg-[var(--v3-yuza)]/95 border-b border-[var(--v3-chiziq)] backdrop-blur-xl px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        {/* Chap: Bosh menyu */}
        <Link
          href="/"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] hover:bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
          title="Bosh menyuga qaytish"
        >
          <Ikon nom="chap" olcham={16} />
          <span className="hidden sm:inline">Bosh menyu</span>
        </Link>

        {/* Markaz: Model va Hands-free Ovoz Switcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUsageModalOchiq(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)] transition-all cursor-pointer shadow-2xs group"
            title="Usage & Modellar ma'lumotini ko'rish"
          >
            <div className="w-4 h-4 text-[var(--v3-urgu)] flex items-center justify-center">
              <Ikon nom="kolba" olcham={14} />
            </div>
            <span className="text-xs sm:text-sm font-black text-[var(--v3-matn)] tracking-tight">
              JDA Kimyo AI
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[var(--v3-urgu)]/20 text-[var(--v3-urgu)] group-hover:bg-[var(--v3-urgu)] group-hover:text-white transition-colors">
              v6.0
            </span>
          </button>

          {/* Hands-Free Jonli Ovoz Rejimi Switcheri */}
          <button
            type="button"
            onClick={() => {
              const yangi = !avtoOvozRejimi;
              setAvtoOvozRejimi(yangi);
              if (yangi) {
                toast.success("Ovozli muloqot (Hands-free) yoqildi!");
              } else {
                ovozPleyeri.toxtat();
                toxtatOvozYozish();
                setFaolOvozId(null);
                toast("Ovozli muloqot o'chirildi");
              }
            }}
            className={`p-1.5 px-2.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all cursor-pointer ${
              avtoOvozRejimi
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500 ring-2 ring-emerald-400/40 animate-pulse"
                : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
            }`}
            title="Hands-free: AI javoblarni avtomatik o'qiydi va sizni tinglaydi"
          >
            <Ikon nom="ovoz" olcham={12} className={avtoOvozRejimi ? "text-emerald-400" : ""} />
            <span className="hidden md:inline">{avtoOvozRejimi ? "Jonli Ovoz Yoniq" : "Ovozli Rejim"}</span>
          </button>
        </div>

        {/* O'ng: Yangi Chat va Fon */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTarixOchiq(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] hover:bg-[var(--v3-yuza-2)] text-[var(--v3-matn)] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Saqlangan chatlar"
          >
            <Ikon nom="vaqt" olcham={14} />
            <span className="hidden lg:inline">Tarix</span>
          </button>
          <button
            type="button"
            onClick={yangiChatBoshlash}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--v3-urgu)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Yangi chat boshlash"
          >
            <Ikon nom="qalam" olcham={14} />
            <span className="hidden sm:inline">Yangi Chat</span>
          </button>
          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
        </div>
      </header>

      {tarixOchiq && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[var(--v3-fon)]/80" role="dialog" aria-modal="true" aria-label="Chat tarixi">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setTarixOchiq(false)}
            aria-label="Chat tarixini yopish"
          />
          <aside className="relative z-10 h-full w-[min(92vw,390px)] bg-[var(--v3-yuza)] border-l border-[var(--v3-chiziq)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[var(--v3-chiziq)] flex items-center justify-between">
              <div>
                <h2 className="font-black text-sm text-[var(--v3-matn)]">Chat tarixi</h2>
                <p className="text-[10px] text-[var(--v3-xira)]">Brauzeringizning shaxsiy xotirasida</p>
              </div>
              <button
                type="button"
                onClick={() => setTarixOchiq(false)}
                className="p-2 rounded-xl hover:bg-[var(--v3-fon)] text-[var(--v3-matn)] cursor-pointer"
                aria-label="Yopish"
              >
                <Ikon nom="yopish" olcham={17} />
              </button>
            </div>

            <div className="p-3 border-b border-[var(--v3-chiziq)]">
              <button
                type="button"
                onClick={akkauntSinxroniniAlmashtir}
                disabled={sinxronHolat === "yuklanmoqda"}
                className="w-full p-3 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] flex items-center justify-between gap-3 text-left cursor-pointer disabled:opacity-60"
              >
                <span>
                  <span className="block text-xs font-bold text-[var(--v3-matn)]">Akkaunt bilan sinxronlash</span>
                  <span className="block text-[10px] text-[var(--v3-xira)] mt-0.5">
                    {sinxronHolat === "yuklanmoqda"
                      ? "Sinxronlanmoqda..."
                      : akkauntSinxroni
                        ? "Yoniq · shifrlangan akkaunt nusxasi"
                        : "O'chiq · faqat shu brauzerda"}
                  </span>
                </span>
                <span className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  akkauntSinxroni ? "bg-[var(--v3-urgu)]" : "bg-[var(--v3-chiziq)]"
                }`}>
                  <span className={`block w-5 h-5 rounded-full bg-[var(--v3-urgu-matn)] shadow-sm transition-transform ${
                    akkauntSinxroni ? "translate-x-4" : "translate-x-0"
                  }`} />
                </span>
              </button>
              {sinxronHolat === "xato" && (
                <p className="mt-2 text-[10px] text-red-400">Sinxronlash ishlamadi; lokal tarix saqlanishda davom etadi.</p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {saqlanganChatlar.length === 0 ? (
                <div className="py-10 text-center text-xs text-[var(--v3-xira)]">
                  Hali saqlangan chat yo'q.
                </div>
              ) : saqlanganChatlar.map((chat) => (
                <div
                  key={chat.id}
                  className={`group rounded-2xl border flex items-center gap-1 ${
                    chat.id === chatId
                      ? "bg-[var(--v3-urgu)]/10 border-[var(--v3-urgu)]"
                      : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => chatniOch(chat.id)}
                    className="min-w-0 flex-1 p-3 text-left cursor-pointer"
                  >
                    <span className="block truncate text-xs font-bold text-[var(--v3-matn)]">{chat.sarlavha}</span>
                    <span className="block mt-1 text-[9px] text-[var(--v3-xira)]">
                      {new Date(chat.yangilanganAt).toLocaleDateString("uz-UZ")} · {chat.xabarSoni} xabar
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => saqlanganChatniOchirish(chat.id)}
                    className="p-2 mr-1 rounded-xl text-[var(--v3-xira)] hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                    aria-label={`${chat.sarlavha} chatini o'chirish`}
                  >
                    <Ikon nom="ochir" olcham={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[var(--v3-chiziq)] text-[9px] leading-relaxed text-[var(--v3-xira)]">
              Rasmning o'zi faqat shu qurilmada qoladi. Akkaunt nusxasiga matn, yechim va o'quv mavzulari tushadi.
            </div>
          </aside>
        </div>
      )}

      {/* ─── 2. ASOSIY CHAT OQIMI (MESSAGES THREAD) ─── */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
        {/* BOSHLANG'ICH SALOMLASHISH */}
        {xabarlar.length === 0 && (
          <div className="my-auto py-8 sm:py-12 px-3 sm:px-6 rounded-3xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-[var(--v3-yuza)] border-2 border-[var(--v3-urgu)] text-[var(--v3-urgu)] flex items-center justify-center shadow-lg">
              <Ikon nom="kolba" olcham={32} />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-black text-[var(--v3-matn)]">
                Assalomu alaykum!
              </h2>
              <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                Kimyo masalasini yozing, ovozda gapiring yoki erkin suhbat quring. AI so'rovni tezkor, oddiy yoki chuqur yo'nalishga ajratadi:
              </p>
            </div>

            {/* 3 XIL REJIM TANLAGICH (TOZA SVG IKONKALAR BILAN) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto text-left">
              {REJIMLAR.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRejim(r.id);
                    toast.success(`${r.nom} tanlandi!`);
                  }}
                  className={`p-3 rounded-2xl border transition-all text-left cursor-pointer space-y-1 ${
                    rejim === r.id
                      ? "bg-[var(--v3-yuza)] border-[var(--v3-urgu)] ring-2 ring-[var(--v3-urgu)] shadow-md"
                      : "bg-[var(--v3-yuza)]/60 border-[var(--v3-chiziq)] hover:border-[var(--v3-urgu)]/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--v3-matn)] flex items-center gap-1.5">
                      <Ikon nom={r.ikon} olcham={13} className="text-[var(--v3-urgu)]" />
                      <span>{r.nom}</span>
                    </span>
                    {rejim === r.id && (
                      <Ikon nom="tasdiq" olcham={12} className="text-[var(--v3-urgu)]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--v3-xira)] line-clamp-2 leading-tight">
                    {r.tavsif}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Xabarlar ro'yxati */}
        {xabarlar.map((xabar) => (
          <div key={xabar.id} className="space-y-2 animate-in fade-in duration-200">
            {/* FOYDALANUVCHI XABARI */}
            {xabar.rol === "user" && (
              <div className="flex justify-end">
                <div className="max-w-[88%] sm:max-w-[78%] p-3.5 sm:p-4 rounded-2xl rounded-tr-xs bg-[var(--v3-urgu)] text-white shadow-md space-y-2">
                  {xabar.rasm && (
                    <img
                      src={xabar.rasm}
                      alt="Yuklangan masala"
                      className="max-h-52 rounded-xl object-cover border border-white/20"
                    />
                  )}
                  {xabar.matn && (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {xabar.matn}
                    </p>
                  )}
                  <span className="text-[9px] opacity-70 block text-right">
                    {xabar.vaqt}
                  </span>
                </div>
              </div>
            )}

            {/* AI CHAT JAVOBI (Erkin suhbat / Follow-up) */}
            {xabar.rol === "ai" && xabar.turi === "chat_javob" && (
              <div className="flex justify-start">
                <div className="max-w-[92%] sm:max-w-[82%] p-3.5 sm:p-4 rounded-2xl rounded-tl-xs bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)] shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[var(--v3-chiziq)]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--v3-urgu)]">
                      <Ikon nom="ustoz" olcham={14} />
                      <span>JDA Kimyo AI:</span>
                      {xabar.aiYonalish?.nom && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[9px] text-[var(--v3-xira)]">
                          {xabar.aiYonalish.nom}{xabar.aiYonalish.avtomatik ? " · avtomatik" : ""}
                        </span>
                      )}
                    </div>

                    {/* Ovozda tinglash tugmasi */}
                    <button
                      type="button"
                      onClick={() => matnniOvozdaIjroEt(xabar.matn, xabar.id)}
                      className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        faolOvozId === xabar.id
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500 animate-pulse"
                          : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]"
                      }`}
                      title={faolOvozId === xabar.id ? "Ovozni to'xtatish" : "Ovozda eshitish"}
                    >
                      <Ikon nom="ovoz" olcham={13} className={faolOvozId === xabar.id ? "text-emerald-400" : ""} />
                      <span className="text-[10px]">{faolOvozId === xabar.id ? "To'xtatish" : "Tinglash"}</span>
                    </button>
                  </div>

                  <BoyitilganMatn matn={xabar.matn} className="text-xs sm:text-sm text-[var(--v3-matn)]" />
                  <span className="text-[9px] text-[var(--v3-xira)] block text-right">
                    {xabar.vaqt}
                  </span>
                </div>
              </div>
            )}

            {/* AI XATOLIK XABARI */}
            {xabar.rol === "ai" && xabar.turi === "xato" && (
              <div className="p-3.5 rounded-2xl bg-[var(--v3-yuza)] border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2">
                <Ikon nom="ogohlantirish" olcham={16} className="text-red-400 shrink-0" />
                <span>{xabar.matn}</span>
              </div>
            )}

            {/* AI TO'LIQ KIMYOVIY YECHIM KARTASI (RICH SOLUTION CARD) */}
            {xabar.rol === "ai" && xabar.turi === "yechim" && (
              <div className="p-4 sm:p-6 rounded-3xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] shadow-lg space-y-4">
                {/* Yechim sarlavhasi va amallar */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--v3-chiziq)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[11px] font-bold text-[var(--v3-urgu)] flex items-center gap-1">
                      <Ikon nom="tasdiq" olcham={12} />
                      <span>{xabar.rejim === "tuzoq" ? "Tuzoq" : xabar.rejim === "yonalish" ? "Yo'nalish" : "Master"}</span>
                    </span>
                    {xabar.aiYonalish?.nom && (
                      <span className="px-2 py-0.5 rounded-lg bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[10px] font-bold text-[var(--v3-xira)]">
                        {xabar.aiYonalish.nom}{xabar.aiYonalish.avtomatik ? " · avtomatik" : ""}
                      </span>
                    )}
                    <strong className="text-xs sm:text-sm text-[var(--v3-matn)]">
                      Kimyoviy Tahlil Natijasi
                    </strong>
                  </div>

                  {/* PDF va Audio */}
                  <div className="flex items-center gap-1.5">
                    {xabar.yechim?.ovozMatni && (
                      <button
                        type="button"
                        onClick={() => matnniOvozdaIjroEt(xabar.yechim.ovozMatni, xabar.id)}
                        className={`p-1.5 px-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          faolOvozId === xabar.id
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500 animate-pulse"
                            : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]"
                        }`}
                        title={faolOvozId === xabar.id ? "Ovozni to'xtatish" : "Ovozda tinglash"}
                      >
                        <Ikon nom="ovoz" olcham={13} className={faolOvozId === xabar.id ? "text-emerald-400" : ""} />
                        <span className="text-[10px] hidden sm:inline">{faolOvozId === xabar.id ? "To'xtatish" : "Ovozda"}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        const toastId = toast.loading("PDF tayyorlanmoqda...");
                        try {
                          await masalaPdfYukla({
                            foydalanuvchiNom: "Talaba",
                            masalaMatni: xabar.yechim?.masalaMatni || "Kimyoviy Masala",
                            natija: xabar.yechim,
                          });
                          toast.success("PDF yuklab olindi!", { id: toastId });
                        } catch (error) {
                          console.error("[PDF yaratish xatosi]", error);
                          toast.error("PDF tayyorlab bo'lmadi.", { id: toastId });
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[11px] font-bold text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Ikon nom="sertifikat" olcham={13} className="text-[var(--v3-urgu)]" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Berilgan & Topish kerak */}
                {(xabar.yechim?.berilgan?.length > 0 || xabar.yechim?.topishKerak?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {xabar.yechim.berilgan?.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-1">
                        <span className="text-[9px] font-bold text-[var(--v3-urgu)] uppercase tracking-wider flex items-center gap-1">
                          <Ikon nom="qalam" olcham={11} /> Berilgan:
                        </span>
                        {xabar.yechim.berilgan.map((b, i) => (
                          <div key={i} className="flex justify-between text-xs py-0.5">
                            <LatexMatn matn={b.belgi} className="font-semibold" />
                            <strong className="font-mono">{b.qiymat}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                    {xabar.yechim.topishKerak?.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-1">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Ikon nom="qidiruv" olcham={11} /> Topish kerak:
                        </span>
                        {xabar.yechim.topishKerak.map((t, i) => (
                          <div key={i} className="flex justify-between text-xs py-0.5">
                            <LatexMatn matn={t.belgi} className="font-bold text-amber-300" />
                            <span className="text-[var(--v3-xira)]">{t.nom}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Reaksiya tenglamalari */}
                {(xabar.yechim?.tenglamalar?.length > 0 || xabar.yechim?.tenglama) && (
                  <div className="p-2.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-center text-xs font-mono font-bold text-[var(--v3-matn)] overflow-x-auto">
                    <LatexMatn matn={xabar.yechim.tenglamalar?.[0] || xabar.yechim.tenglama} inline={false} />
                  </div>
                )}

                {/* Yashirin Tuzoq */}
                {xabar.yechim?.tuzoqTahlili?.kalitNuqta && (
                  <div className="p-3 rounded-xl bg-[var(--v3-fon)] border border-amber-400/40 space-y-1 text-xs">
                    <strong className="text-amber-400 block font-bold flex items-center gap-1.5 text-[11px]">
                      <Ikon nom="ogohlantirish" olcham={13} /> Masaladagi Yashirin Qopqon (Tuzoq):
                    </strong>
                    <p className="text-[var(--v3-matn)] leading-relaxed">{xabar.yechim.tuzoqTahlili.kalitNuqta}</p>
                  </div>
                )}

                {/* Yo'nalish formulalari */}
                {xabar.yechim?.yonalish?.formulalar?.length > 0 && (
                  <div className="p-3 rounded-xl bg-[var(--v3-fon)] border border-blue-400/30 space-y-1.5 text-xs">
                    <strong className="text-blue-400 block font-bold flex items-center gap-1.5 text-[11px]">
                      <Ikon nom="kitob" olcham={13} /> Kerakli Formulalar:
                    </strong>
                    <div className="flex flex-wrap gap-1.5">
                      {xabar.yechim.yonalish.formulalar.map((f, i) => (
                        <div key={i} className="p-1 px-2.5 rounded-lg bg-[var(--v3-yuza)] border border-blue-400/40">
                          <LatexMatn matn={f} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bosqichlar */}
                {xabar.yechim?.bosqichlar?.length > 0 && (
                  <div className="space-y-2">
                    {xabar.yechim.bosqichlar.map((b, i) => (
                      <div key={i} className="p-3 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-1 text-xs">
                        <strong className="text-[var(--v3-matn)] font-bold block flex items-center gap-1 text-[11px]">
                          <Ikon nom="tasdiq" olcham={12} className="text-[var(--v3-urgu)]" />
                          <span>{b.sarlavha || `${i + 1}-Bosqich:`}</span>
                        </strong>
                        <p className="text-[var(--v3-matn)] leading-relaxed">
                          {b.tushuntirish || b.matn}
                        </p>
                        {b.formula && (
                          <div className="p-2 rounded-lg bg-[var(--v3-yuza)] text-center font-mono font-bold text-[var(--v3-urgu)] overflow-x-auto">
                            <LatexMatn matn={b.formula} inline={false} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pearson kresti */}
                {xabar.yechim?.krestSxemasi?.mavjud && (
                  <div className="p-2.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-xs font-mono text-center space-y-0.5">
                    <span className="text-indigo-400 font-bold flex items-center justify-center gap-1 text-[11px]">
                      <Ikon nom="atom" olcham={13} /> Pearson Diagonal Kresti:
                    </span>
                    <div className="text-[var(--v3-matn)] font-bold">
                      {xabar.yechim.krestSxemasi.w1}% va {xabar.yechim.krestSxemasi.w2}% ➔ {xabar.yechim.krestSxemasi.wTarget}% (Nisbat: {xabar.yechim.krestSxemasi.nisbat})
                    </div>
                  </div>
                )}

                {/* Rasmdagi Boshqa Masalalar Tanlash Chiplari */}
                {xabar.yechim?.boshqaMasalalar?.length > 0 && (
                  <div className="p-3 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-urgu)]/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--v3-matn)]">
                      <Ikon nom="rasm" olcham={14} className="text-[var(--v3-urgu)]" />
                      <span>Rasmdagi boshqa aniqlangan masalalar:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {xabar.yechim.boshqaMasalalar.map((bm, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleBoshqaMasalaniYech(bm, xabar.rasm)}
                          className="px-2.5 py-1 rounded-xl bg-[var(--v3-yuza)] hover:bg-[var(--v3-urgu)] hover:text-white border border-[var(--v3-chiziq)] text-[11px] font-bold text-[var(--v3-matn)] transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <span>{bm}</span>
                          <span className="opacity-60">➔</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Yakuniy Javob */}
                {xabar.yechim?.yakuniyJavob && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/40 text-xs sm:text-sm">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Ikon nom="tasdiq" olcham={13} /> Yakuniy Javob:
                    </span>
                    <strong className="text-[var(--v3-matn)] font-black text-sm sm:text-base">
                      {xabar.yechim.yakuniyJavob}
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* JONLI AI HOLAT KO'RSATKICHI */}
        {yuklanmoqda && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)] shadow-xs animate-pulse">
            <div className="w-6 h-6 rounded-lg bg-[var(--v3-fon)] border border-[var(--v3-urgu)] text-[var(--v3-urgu)] flex items-center justify-center text-xs animate-spin shrink-0">
              <Ikon nom={jonliHolat.ikon || "kolba"} olcham={14} />
            </div>
            <span className="font-semibold text-xs">{jonliHolat.matn || "Javob tayyorlanmoqda..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ─── 3. PASTKI STICKY CHAT DOCK (CHATGPT MOBILE FORMATI) ─── */}
      <footer className="sticky bottom-0 z-40 bg-[var(--v3-yuza)]/95 border-t border-[var(--v3-chiziq)] backdrop-blur-xl p-2.5 sm:p-4 shadow-2xl">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* YUQORI REJIM VA BELGILAR CHIPLARI */}
          <div className="flex items-center justify-between gap-1.5 px-0.5 flex-wrap">
            {/* 3 ta ixcham rejim chipi (TOZA SVG VA MATN) */}
            <div className="flex items-center gap-1">
              {REJIMLAR.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRejim(r.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    rejim === r.id
                      ? "bg-[var(--v3-urgu)] text-white shadow-xs"
                      : "bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                  }`}
                >
                  <Ikon nom={r.ikon} olcham={11} />
                  <span>{r.qisqa}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <label className="sr-only" htmlFor="ai-ishlash-yonalishi">AI ishlash yo'nalishi</label>
              <select
                id="ai-ishlash-yonalishi"
                value={ishlashYonalishi}
                onChange={(event) => setIshlashYonalishi(event.target.value)}
                className="px-2 py-1 rounded-full text-[11px] font-bold bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)] focus:outline-hidden focus:border-[var(--v3-urgu)] cursor-pointer"
                title="AI yo'nalishini avtomatik aniqlash yoki qo'lda tanlash"
              >
                {ISHLASH_YONALISHLARI.map((yonalish) => (
                  <option key={yonalish.id} value={yonalish.id}>{yonalish.nom}</option>
                ))}
              </select>

              {/* Belgilar paneli ochgich */}
              <button
                type="button"
                onClick={() => setKlaviaturaOchiq(!klaviaturaOchiq)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  klaviaturaOchiq
                    ? "bg-[var(--v3-urgu)] text-white"
                    : "bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                }`}
              >
                <Ikon nom="atom" olcham={12} />
                <span>Belgilar</span>
              </button>
            </div>
          </div>

          {/* Ochiladigan Kimyoviy maxsus belgilar klaviaturasi */}
          {klaviaturaOchiq && (
            <div className="p-2.5 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] animate-in fade-in duration-150">
              <div className="flex flex-wrap gap-1">
                {TEZKOR_BELGILAR.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => belgiQosh(b)}
                    className="px-2 py-0.5 rounded-lg bg-[var(--v3-yuza)] hover:bg-[var(--v3-urgu)] hover:text-white border border-[var(--v3-chiziq)] text-[11px] font-mono font-bold transition-colors cursor-pointer"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(ovozYozilmoqda || ovozHolati) && (
            <div className="px-3 py-2 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] flex items-center gap-2 text-[11px]">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                ovozYozilmoqda ? "bg-red-500 animate-pulse" : "bg-[var(--v3-urgu)]"
              }`} />
              <span className="font-bold text-[var(--v3-matn)] shrink-0">{ovozHolati || "Tinglamoqdaman..."}</span>
              {oraliqOvozMatni && (
                <span className="truncate text-[var(--v3-xira)]">“{oraliqOvozMatni}”</span>
              )}
            </div>
          )}

          {/* YUKLANGAN RASM PREVIEW CHIP */}
          {rasmBase64 && (
            <div className="p-2 rounded-2xl bg-[var(--v3-fon)] border border-emerald-500/40 flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <img
                  src={rasmBase64}
                  alt="Yuklangan masala"
                  className="w-9 h-9 rounded-lg object-cover border border-emerald-400 shadow-2xs"
                />
                <div className="text-[11px]">
                  <span className="font-bold text-emerald-400 block">Rasm biriktirildi</span>
                  <p className="text-[10px] text-[var(--v3-xira)] truncate max-w-[180px] sm:max-w-xs">
                    {rasmNomi || "Surat"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRasmOchirish}
                className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-bold transition-colors cursor-pointer"
                title="O'chirish"
              >
                <Ikon nom="ochir" olcham={14} />
              </button>
            </div>
          )}

          {/* YAGONA CHATGPT KAPSULA INPUTI */}
          <form onSubmit={handleXabarYuborish} className="relative flex items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleRasmYuklash}
            />

            {/* CHATGPT KAPSULASI (Yaxlit yumaloq qobiq) */}
            <div className="w-full flex items-center gap-1.5 p-1.5 pl-2.5 rounded-full bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] shadow-md focus-within:border-[var(--v3-urgu)] transition-all">
              {/* Chap: Rasm / Kamera qo'shish */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full hover:bg-[var(--v3-yuza)] text-[var(--v3-matn)] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Rasm yuklash / Suratga olish"
              >
                <Ikon nom="rasm" olcham={18} />
              </button>

              {/* Markaz: Textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={kiritma}
                onChange={(e) => setKiritma(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleXabarYuborish();
                  }
                }}
                placeholder={avtoOvozRejimi ? "Gapiring yoki yozing (Ovozli rejim)..." : "Masala yozing yoki rasm/ovoz tashlang..."}
                className="flex-1 bg-transparent text-xs sm:text-sm text-[var(--v3-matn)] placeholder-[var(--v3-xira)] focus:outline-hidden resize-none max-h-28 py-1.5 leading-relaxed font-sans"
              />

              {/* O'ng: Agar matn bo'sh bo'lsa OVOZ, matn yozilgan bo'lsa YUBORISH */}
              {!kiritma.trim() && !rasmBase64 ? (
                <button
                  type="button"
                  onClick={handleOvozYozish}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                    ovozYozilmoqda
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[var(--v3-yuza)] hover:bg-[var(--v3-yuza-2)] text-[var(--v3-matn)]"
                  }`}
                  title={ovozYozilmoqda ? "Ovozni to'xtatish" : "Ovozda aytish"}
                >
                  <Ikon nom="mikrofon" olcham={17} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={yuklanmoqda}
                  className="w-9 h-9 rounded-full bg-[var(--v3-urgu)] hover:opacity-90 text-white flex items-center justify-center shadow-xs transition-all shrink-0 cursor-pointer"
                  title="Yuborish"
                >
                  <Ikon nom="jonat" olcham={17} />
                </button>
              )}
            </div>
          </form>
        </div>
      </footer>

      {/* CLAUDE & GEMINI USLUBIDAGI USAGE & MODELS MODALI */}
      <UsageModelsModal
        ochiq={usageModalOchiq}
        yopish={() => setUsageModalOchiq(false)}
      />
    </div>
  );
}
