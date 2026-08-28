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
import UsageModelsModal from "@/components/masala/UsageModelsModal";
import { masalaPdfYukla } from "@/lib/masala-pdf.js";
import { ovozPleyeri } from "@/lib/ovoz-pleyer.js";
import toast from "react-hot-toast";

const REJIMLAR = [
  {
    id: "tuzoq",
    nom: "1-Rejim: Tuzoq",
    ikon: "chaqmoq",
    qisqa: "⚡ Tuzoq",
    tavsif: "Masaladagi nozik ayyorlik va xatolar tahlili (Javobsiz)",
  },
  {
    id: "yonalish",
    nom: "2-Rejim: Yo'nalish",
    ikon: "kitob",
    qisqa: "🧭 Yo'nalish",
    tavsif: "Reaksiya tenglamalari va formulalar rejasi",
  },
  {
    id: "toliq",
    nom: "3-Rejim: Master",
    ikon: "tasdiq",
    qisqa: "🎯 Master",
    tavsif: "Berilgan, Reaksiya, KaTeX bosqichlari va yakuniy javob",
  },
];

const TEZKOR_BELGILAR = [
  "₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉",
  "⁺", "⁻", "²⁺", "³⁺", "→", "⇌", "↑", "↓", "Δ", "°C", "ω", "ν", "ρ", "pH"
];

export default function MasalaChatSahifasi() {
  const [fonKaliti, fonniOzgartir] = useFon();
  const [rejim, setRejim] = useState("toliq");
  const [kiritma, setKiritma] = useState("");
  const [rasmBase64, setRasmBase64] = useState(null);
  const [rasmNomi, setRasmNomi] = useState("");
  const [klaviaturaOchiq, setKlaviaturaOchiq] = useState(false);
  const [usageModalOchiq, setUsageModalOchiq] = useState(false);

  // Chat xabarlar oqimi
  const [xabarlar, setXabarlar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [jonliHolat, setJonliHolat] = useState({ ikon: "kolba", matn: "" });

  // Ovozli AI (Hands-free & TTS/STT)
  const [ovozYozilmoqda, setOvozYozilmoqda] = useState(false);
  const [avtoOvozRejimi, setAvtoOvozRejimi] = useState(false);
  const [faolOvozId, setFaolOvozId] = useState(null);
  const [speechRecog, setSpeechRecog] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [xabarlar, jonliHolat]);

  // Speech Recognition (STT)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = "uz-UZ";

        recognizer.onresult = (event) => {
          let yangi = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            yangi += event.results[i][0].transcript;
          }
          if (yangi) setKiritma((prev) => (prev ? prev + " " + yangi : yangi));
        };
        recognizer.onerror = () => setOvozYozilmoqda(false);
        recognizer.onend = () => setOvozYozilmoqda(false);
        setSpeechRecog(recognizer);
      }
    }
  }, []);

  // Ovozda ijro etish funksiyasi
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
        // Agar Hands-free Ovoz rejimi yoqiq bo'lsa, AI gapirib bo'lgach avtomatik mikrofonni ochamiz!
        if (avtoOvozRejimi && speechRecog && !ovozYozilmoqda) {
          try {
            speechRecog.start();
            setOvozYozilmoqda(true);
            toast("Sizni tinglamoqdaman...", { icon: "🎙️" });
          } catch (e) {
            // e'tiborsiz qoldirish
          }
        }
      },
      onXato: () => setFaolOvozId(null),
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

  const handleOvozYozish = () => {
    if (!speechRecog) {
      toast.error("Brauzeringiz ovozli yozishni qo'llab-quvvatlamaydi.");
      return;
    }
    if (ovozYozilmoqda) {
      speechRecog.stop();
      setOvozYozilmoqda(false);
    } else {
      try {
        speechRecog.start();
        setOvozYozilmoqda(true);
        toast.success("Ovoz yozilmoqda... Masalani gapiring.");
      } catch (e) {
        setOvozYozilmoqda(false);
      }
    }
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

  // YANGI CHAT BOSHLASH (NEW CHAT)
  const yangiChatBoshlash = () => {
    setXabarlar([]);
    setKiritma("");
    setRasmBase64(null);
    setRasmNomi("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    ovozPleyeri.toxtat();
    setFaolOvozId(null);
    toast.success("Yangi suhbat boshlandi!");
  };

  // Asosiy xabar jo'natish
  const handleXabarYuborish = async (e) => {
    if (e) e.preventDefault();
    if (!kiritma.trim() && !rasmBase64) return;
    if (yuklanmoqda) return;

    if (ovozYozilmoqda && speechRecog) {
      speechRecog.stop();
      setOvozYozilmoqda(false);
    }

    const joriyMatn = kiritma.trim();
    const joriyRasm = rasmBase64;
    const joriyRejim = rejim;

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

    // Jonli animatsiyali SVG qadamlari
    let step = 0;
    const bosqichlar = joriyRasm
      ? [
          { ikon: "rasm", matn: "Rasm OCR tahlilidan o'tkazilmoqda..." },
          { ikon: "qidiruv", matn: "1-Agent: Masala sharti va kattaliklar ajratilmoqda..." },
          { ikon: "kolba", matn: "2-Agent: Kimyoviy jarayonlar va mollar hisoblanmoqda..." },
          { ikon: "qalam", matn: "4-Agent: KaTeX formulalari bilan master-yechim yozilmoqda..." },
        ]
      : [
          { ikon: "qidiruv", matn: "1-Agent: Masala sharti va kattaliklar ajratilmoqda..." },
          { ikon: "kolba", matn: "2-Agent: Kimyoviy reaksiya va stexiometriya hisoblanmoqda..." },
          { ikon: "atom", matn: "3-Agent: Matematik hisob-kitoblar tekshirilmoqda..." },
          { ikon: "qalam", matn: "4-Agent: KaTeX formulalari bilan master-yechim yozilmoqda..." },
        ];

    setJonliHolat(bosqichlar[0]);
    const timer = setInterval(() => {
      step = (step + 1) % bosqichlar.length;
      setJonliHolat(bosqichlar[step]);
    }, 900);

    try {
      const oxirgiAiYechim = [...xabarlar].reverse().find((m) => m.rol === "ai" && m.turi === "yechim");

      const isFollowUp = !joriyRasm && oxirgiAiYechim && joriyMatn.length < 80 && (
        joriyMatn.includes("?") ||
        joriyMatn.toLowerCase().includes("nega") ||
        joriyMatn.toLowerCase().includes("qanday") ||
        joriyMatn.toLowerCase().includes("boshqa") ||
        joriyMatn.toLowerCase().includes("tushunmadim")
      );

      if (isFollowUp) {
        setJonliHolat({ ikon: "ustoz", matn: "AI Repetitor tushuntirish yozmoqda..." });
        const res = await fetch("/api/masala/yech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "chat",
            masalaMatni: oxirgiAiYechim.yechim?.masalaMatni || "",
            yechim: oxirgiAiYechim.yechim,
            savol: joriyMatn,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.xato || "Xatolik yuz berdi");

        const aiId = "ai-" + Date.now();
        setXabarlar((prev) => [
          ...prev,
          {
            id: aiId,
            rol: "ai",
            turi: "chat_javob",
            matn: data.javob,
            vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        if (avtoOvozRejimi) {
          matnniOvozdaIjroEt(data.javob, aiId);
        }
      } else {
        const res = await fetch("/api/masala/yech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "yech",
            masalaMatni: joriyMatn,
            rejim: joriyRejim,
            rasm: joriyRasm,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.xato || "Masalani yechishda xatolik yuz berdi");

        const aiId = "ai-" + Date.now();
        if (data.turi === "suhbat") {
          setXabarlar((prev) => [
            ...prev,
            {
              id: aiId,
              rol: "ai",
              turi: "chat_javob",
              matn: data.matn,
              vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          if (avtoOvozRejimi) {
            matnniOvozdaIjroEt(data.matn, aiId);
          }
        } else {
          setXabarlar((prev) => [
            ...prev,
            {
              id: aiId,
              rol: "ai",
              turi: "yechim",
              yechim: data,
              rejim: joriyRejim,
              vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          if (avtoOvozRejimi && data.ovozMatni) {
            matnniOvozdaIjroEt(data.ovozMatni, aiId);
          }
        }
      }
    } catch (err) {
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
      clearInterval(timer);
      setYuklanmoqda(false);
      setJonliHolat({ ikon: "kolba", matn: "" });
    }
  };

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
              v5.0
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
                Kimyo masalasini yozing, ovozda gapiring yoki erkin suhbat quring. AI 4 ta ixtisoslashgan klasterda tahlil qiladi:
              </p>
            </div>

            {/* 3 XIL REJIM TANLAGICH */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-lg mx-auto text-left">
              {REJIMLAR.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRejim(r.id);
                    toast.success(`${r.qisqa} tanlandi!`);
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
                      {r.qisqa}
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

                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {xabar.matn}
                  </p>
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
                      onClick={() => {
                        masalaPdfYukla({
                          foydalanuvchiNom: "Talaba",
                          masalaMatni: xabar.yechim?.masalaMatni || "Kimyoviy Masala",
                          natija: xabar.yechim,
                        });
                        toast.success("PDF yuklab olindi!");
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
          <div className="flex items-center justify-between gap-1.5 px-0.5">
            {/* 3 ta ixcham rejim chipi */}
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
                  <span>{r.qisqa.split(" ")[1] || r.qisqa}</span>
                </button>
              ))}
            </div>

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
