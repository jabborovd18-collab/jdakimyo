// app/masala/page.js
//
// JDA KIMYO AI — ZAMONAVIY CHATBOT FORMATIDAGI KIMYOVIY MASALALAR ASSISTENTI (v4.1.0)
// JDA Kimyo uslubidagi toza SVG stikerlar, 3 xil usul tanishtiruvi va Yangi Chat imkoniyati.

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";
import LatexMatn from "@/components/LatexMatn.jsx";
import { masalaPdfYukla } from "@/lib/masala-pdf.js";
import { ovozPleyeri } from "@/lib/ovoz-pleyer.js";
import toast from "react-hot-toast";

const REJIMLAR = [
  {
    id: "tuzoq",
    nom: "1-Rejim: Qopqon & Tuzoq",
    belgi: "⚡",
    ikon: "chaqmoq",
    qisqa: "Tuzoq Tahlili",
    tavsif: "Masaladagi nozik ayyorlik va xatolar tahlili (Javobsiz)",
  },
  {
    id: "yonalish",
    nom: "2-Rejim: Yo'l-yo'riq",
    belgi: "🧭",
    ikon: "kitob",
    qisqa: "Yo'nalish & Formula",
    tavsif: "Reaksiya tenglamalari va formulalar rejasi",
  },
  {
    id: "toliq",
    nom: "3-Rejim: To'liq Master",
    belgi: "🎯",
    ikon: "yulduz",
    qisqa: "To'liq Master",
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

  // Chat xabarlar oqimi
  const [xabarlar, setXabarlar] = useState([]);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [jonliHolatMatni, setJonliHolatMatni] = useState("");
  const [ovozYozilmoqda, setOvozYozilmoqda] = useState(false);
  const [speechRecog, setSpeechRecog] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [xabarlar, jonliHolatMatni]);

  // Speech Recognition
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
        toast("Ovoz yozilmoqda... Masalani gapiring.", { icon: "🎙️" });
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
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Rasm hajmi 4 MB dan oshmasligi kerak.");
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
  };

  // YANGI CHAT BOSHLASH (NEW CHAT)
  const yangiChatBoshlash = () => {
    setXabarlar([]);
    setKiritma("");
    setRasmBase64(null);
    setRasmNomi("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    ovozPleyeri.toxtat();
    toast.success("Yangi suhbat boshlandi!");
  };

  // Asosiy xabar jo'natish
  const handleXabarYuborish = async (e) => {
    if (e) e.preventDefault();
    if (!kiritma.trim() && !rasmBase64) return;
    if (yuklanmoqda) return;

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

    // Jonli animatsiyali xabarlar
    let step = 0;
    const bosqichlar = joriyRasm
      ? [
          "🖼️ Rasm ko'rilyapti va OCR orqali o'qilmoqda...",
          "🔍 1-Agent: Masala sharti va fizik kattaliklar ajratilmoqda...",
          "⚗️ 2-Agent: Kimyoviy jarayonlar va mollar hisoblanmoqda...",
          "✍️ 4-Agent: KaTeX formulalari bilan master-yechim yozilmoqda...",
        ]
      : [
          "🔍 1-Agent: Masala sharti va kattaliklar ajratilmoqda...",
          "⚗️ 2-Agent: Kimyoviy reaksiya va stexiometriya hisoblanmoqda...",
          "⚖️ 3-Agent: Matematik birliklar va hisoblar tekshirilmoqda...",
          "✍️ 4-Agent: KaTeX formulalari bilan master-yechim shakllantirilmoqda...",
        ];

    setJonliHolatMatni(bosqichlar[0]);
    const timer = setInterval(() => {
      step = (step + 1) % bosqichlar.length;
      setJonliHolatMatni(bosqichlar[step]);
    }, 1100);

    try {
      // Oxirgi yechim bo'lsa va bu follow-up savol bo'lsa
      const oxirgiAiYechim = [...xabarlar].reverse().find((m) => m.rol === "ai" && m.turi === "yechim");

      const isFollowUp = !joriyRasm && oxirgiAiYechim && joriyMatn.length < 80 && (
        joriyMatn.includes("?") ||
        joriyMatn.toLowerCase().includes("nega") ||
        joriyMatn.toLowerCase().includes("qanday") ||
        joriyMatn.toLowerCase().includes("boshqa") ||
        joriyMatn.toLowerCase().includes("tushunmadim")
      );

      if (isFollowUp) {
        setJonliHolatMatni("👨‍🏫 AI Repetitor tushuntirish yozmoqda...");
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

        setXabarlar((prev) => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            rol: "ai",
            turi: "chat_javob",
            matn: data.javob,
            vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
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

        setXabarlar((prev) => [
          ...prev,
          {
            id: "ai-" + Date.now(),
            rol: "ai",
            turi: "yechim",
            yechim: data,
            rejim: joriyRejim,
            vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      toast.error(err.message || "Xatolik yuz berdi");
      setXabarlar((prev) => [
        ...prev,
        {
          id: "ai-err-" + Date.now(),
          rol: "ai",
          turi: "xato",
          matn: `⚠️ Xatolik: ${err.message || "Masalani tahlil qilib bo'lmadi. Iltimos, qayta urinib ko'ring."}`,
          vaqt: new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      clearInterval(timer);
      setYuklanmoqda(false);
      setJonliHolatMatni("");
    }
  };

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen w-full flex flex-col justify-between transition-colors duration-200 bg-[var(--v3-fon)] text-[var(--v3-matn)] font-sans"
    >
      {/* ─── 1. HEADER ─── */}
      <header className="sticky top-0 z-40 bg-[var(--v3-yuza)] border-b border-[var(--v3-chiziq)] backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/oquv" className="v3-tugma text-xs py-1.5 px-3">
            <Ikon nom="chap" olcham={14} />
            <span>Ta{"'"}lim</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-md font-bold">
              <Ikon nom="kolba" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-[var(--v3-matn)] flex items-center gap-1.5 leading-none">
                <span>JDA Kimyo AI</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold font-mono">
                  v4.1
                </span>
              </h1>
              <span className="text-[11px] text-[var(--v3-xira)] hidden sm:inline">
                Intellektual Kimyoviy Masalalar Repetitori
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* YANGI CHAT TUGMASI (NEW CHAT) */}
          <button
            type="button"
            onClick={yangiChatBoshlash}
            className="px-3 py-1.5 rounded-xl bg-[var(--v3-urgu)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Yangi suhbat boshlash"
          >
            <Ikon nom="qalam" olcham={14} />
            <span>Yangi Chat</span>
          </button>

          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
          <Link href="/laboratoriya/3d" className="v3-tugma text-xs py-1.5 px-3">
            <Ikon nom="atom" olcham={14} />
            <span className="hidden sm:inline">3D Lab</span>
          </Link>
        </div>
      </header>

      {/* ─── 2. ASOSIY CHAT OQIMI (MESSAGES THREAD) ─── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 overflow-y-auto">
        {/* JDA KIMYO AI SALOMLASHISH VA 3 XIL USULIMIZ TANISHTIRUVI KARTASI */}
        {xabarlar.length === 0 && (
          <div className="my-6 p-6 sm:p-8 rounded-3xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg">
              <Ikon nom="yulduz" olcham={32} />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-black text-[var(--v3-matn)]">
                Assalomu alaykum! JDA Kimyo AI ga xush kelibsiz
              </h2>
              <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed">
                Men kimyoviy masalalarni chuqur tahlil qiluvchi va darslik formatida yechib beruvchi intellektual assistentman. Bizda masalalar 3 xil pedagogik yondashuvda tahlil qilinadi:
              </p>
            </div>

            {/* 3 XIL YONDASHUV KARTALARI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left pt-1">
              {/* 1-Rejim */}
              <div
                onClick={() => {
                  setRejim("tuzoq");
                  toast.success("1-Rejim tanlandi!");
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  rejim === "tuzoq"
                    ? "bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-400"
                    : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] hover:border-amber-400/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Ikon nom="chaqmoq" olcham={13} /> 1-Rejim
                  </span>
                  <span className="text-xs font-bold text-amber-400">⚡</span>
                </div>
                <strong className="text-xs sm:text-sm font-bold text-[var(--v3-matn)] block">
                  Yashirin Qopqon & Tuzoq
                </strong>
                <p className="text-[11px] text-[var(--v3-xira)] leading-relaxed">
                  Masaladagi nozik ayyorlik va 90% o&apos;quvchilar adashadigan qopqonlarni ochib beradi (Mustaqil yechish uchun).
                </p>
              </div>

              {/* 2-Rejim */}
              <div
                onClick={() => {
                  setRejim("yonalish");
                  toast.success("2-Rejim tanlandi!");
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  rejim === "yonalish"
                    ? "bg-blue-500/10 border-blue-500/60 ring-2 ring-blue-400"
                    : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] hover:border-blue-400/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                    <Ikon nom="kitob" olcham={13} /> 2-Rejim
                  </span>
                  <span className="text-xs font-bold text-blue-400">🧭</span>
                </div>
                <strong className="text-xs sm:text-sm font-bold text-[var(--v3-matn)] block">
                  Yo&apos;l-yo&apos;riq & Formulalar
                </strong>
                <p className="text-[11px] text-[var(--v3-xira)] leading-relaxed">
                  Reaksiya tenglamalari va bosqichma-bosqich formulalar rejasini beradi (Hisoblash talaba zimmasida).
                </p>
              </div>

              {/* 3-Rejim */}
              <div
                onClick={() => {
                  setRejim("toliq");
                  toast.success("3-Rejim tanlandi!");
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  rejim === "toliq"
                    ? "bg-emerald-500/10 border-emerald-500/60 ring-2 ring-emerald-400"
                    : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] hover:border-emerald-400/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Ikon nom="yulduz" olcham={13} /> 3-Rejim
                  </span>
                  <span className="text-xs font-bold text-emerald-400">🎯</span>
                </div>
                <strong className="text-xs sm:text-sm font-bold text-[var(--v3-matn)] block">
                  To&apos;liq Master Yechim
                </strong>
                <p className="text-[11px] text-[var(--v3-xira)] leading-relaxed">
                  Berilgan, Topish kerak, Reaksiyalar, KaTeX bosqichlari va yakuniy aniq javob bilan to&apos;liq tahlil.
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs text-[var(--v3-xira)] flex items-center justify-center gap-2">
              <Ikon nom="qalam" olcham={14} className="text-[var(--v3-urgu)]" />
              <span>Quyidagi maydonga istalgan kimyo masalasini yozing, ovozda ayting yoki kitobdagi rasmini tashlang.</span>
            </div>
          </div>
        )}

        {/* Xabarlar ro'yxati */}
        {xabarlar.map((xabar) => (
          <div key={xabar.id} className="space-y-2">
            {/* FOYDALANUVCHI XABARI */}
            {xabar.rol === "user" && (
              <div className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl rounded-tr-xs bg-[var(--v3-urgu)] text-white shadow-md space-y-2">
                  {xabar.rasm && (
                    <img
                      src={xabar.rasm}
                      alt="Yuklangan masala"
                      className="max-h-56 rounded-2xl object-cover border border-white/20"
                    />
                  )}
                  {xabar.matn && (
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {xabar.matn}
                    </p>
                  )}
                  <span className="text-[10px] opacity-70 block text-right">
                    {xabar.vaqt}
                  </span>
                </div>
              </div>
            )}

            {/* AI CHAT JAVOBI (Follow-up) */}
            {xabar.rol === "ai" && xabar.turi === "chat_javob" && (
              <div className="flex justify-start">
                <div className="max-w-[90%] sm:max-w-[80%] p-4 rounded-3xl rounded-tl-xs bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)] shadow-md space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--v3-urgu)]">
                    <Ikon nom="kolba" olcham={15} />
                    <span>👨‍🏫 AI Kimyo Repetitori:</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {xabar.matn}
                  </p>
                  <span className="text-[10px] text-[var(--v3-xira)] block text-right">
                    {xabar.vaqt}
                  </span>
                </div>
              </div>
            )}

            {/* AI XATOLIK XABARI */}
            {xabar.rol === "ai" && xabar.turi === "xato" && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                {xabar.matn}
              </div>
            )}

            {/* AI TO'LIQ KIMYOVIY YECHIM KARTASI (RICH CARD) */}
            {xabar.rol === "ai" && xabar.turi === "yechim" && (
              <div className="p-5 sm:p-7 rounded-3xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] shadow-xl space-y-5">
                {/* Yechim sarlavhasi va amallar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--v3-chiziq)]">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-xs font-bold text-[var(--v3-urgu)] flex items-center gap-1.5">
                      <Ikon nom="tasdiq" olcham={13} />
                      <span>{xabar.rejim === "tuzoq" ? "⚡ 1-Rejim: Tuzoq" : xabar.rejim === "yonalish" ? "🧭 2-Rejim: Yo'nalish" : "🎯 3-Rejim: Master Yechim"}</span>
                    </span>
                    <strong className="text-xs sm:text-sm text-[var(--v3-matn)]">
                      Kimyoviy Tahlil Natijasi
                    </strong>
                  </div>

                  {/* PDF, Audio, Nusxalash */}
                  <div className="flex items-center gap-2">
                    {xabar.yechim?.ovozMatni && (
                      <button
                        type="button"
                        onClick={() => {
                          ovozPleyeri.boshla(xabar.yechim.ovozMatni);
                          toast.success("Ovozli o'qish boshlandi");
                        }}
                        className="p-2 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)] text-xs font-bold"
                        title="Ovozda tinglash"
                      >
                        <Ikon nom="ovoz" olcham={15} />
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
                        toast.success("PDF konspekt yuklab olindi!");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-xs font-bold text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)] flex items-center gap-1"
                    >
                      <Ikon nom="sertifikat" olcham={14} className="text-[var(--v3-urgu)]" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Berilgan & Topish kerak */}
                {(xabar.yechim?.berilgan?.length > 0 || xabar.yechim?.topishKerak?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {xabar.yechim.berilgan?.length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-1.5">
                        <span className="text-[10px] font-bold text-[var(--v3-urgu)] uppercase tracking-wider block">
                          📌 Berilgan:
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
                      <div className="p-3.5 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-1.5">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          ❓ Topish kerak:
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
                  <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-800/40 text-center text-xs sm:text-sm font-mono font-bold text-purple-200">
                    <LatexMatn matn={xabar.yechim.tenglamalar?.[0] || xabar.yechim.tenglama} inline={false} />
                  </div>
                )}

                {/* Yashirin Tuzoq */}
                {xabar.yechim?.tuzoqTahlili?.kalitNuqta && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 space-y-1.5 text-xs">
                    <strong className="text-amber-400 block font-bold flex items-center gap-1.5">
                      <Ikon nom="chaqmoq" olcham={14} /> Masaladagi Yashirin Qopqon (Tuzoq):
                    </strong>
                    <p>{xabar.yechim.tuzoqTahlili.kalitNuqta}</p>
                  </div>
                )}

                {/* Yo'nalish formulalari */}
                {xabar.yechim?.yonalish?.formulalar?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/30 space-y-2 text-xs">
                    <strong className="text-blue-400 block font-bold flex items-center gap-1.5">
                      <Ikon nom="kitob" olcham={14} /> Kerakli Formulalar:
                    </strong>
                    <div className="flex flex-wrap gap-2">
                      {xabar.yechim.yonalish.formulalar.map((f, i) => (
                        <div key={i} className="p-1.5 px-3 rounded-xl bg-[var(--v3-fon)] border border-blue-400/40">
                          <LatexMatn matn={f} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bosqichlar */}
                {xabar.yechim?.bosqichlar?.length > 0 && (
                  <div className="space-y-2.5">
                    {xabar.yechim.bosqichlar.map((b, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] space-y-1.5 text-xs">
                        <strong className="text-[var(--v3-matn)] font-bold block">
                          {b.sarlavha || `${i + 1}-Bosqich:`}
                        </strong>
                        <p className="text-[var(--v3-matn)] leading-relaxed">
                          {b.tushuntirish || b.matn}
                        </p>
                        {b.formula && (
                          <div className="p-2 rounded-xl bg-[var(--v3-yuza)] text-center font-mono font-bold text-[var(--v3-urgu)]">
                            <LatexMatn matn={b.formula} inline={false} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pearson kresti */}
                {xabar.yechim?.krestSxemasi?.mavjud && (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/40 text-xs font-mono text-center space-y-1">
                    <span className="text-indigo-300 font-bold block">❎ Pearson Diagonal Kresti:</span>
                    <div className="text-amber-300 font-bold">
                      {xabar.yechim.krestSxemasi.w1}% va {xabar.yechim.krestSxemasi.w2}% ➔ {xabar.yechim.krestSxemasi.wTarget}% (Nisbat: {xabar.yechim.krestSxemasi.nisbat})
                    </div>
                  </div>
                )}

                {/* Yakuniy Javob */}
                {xabar.yechim?.yakuniyJavob && (
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 text-xs sm:text-sm">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                      🎯 Yakuniy Javob:
                    </span>
                    <strong className="text-white font-black text-sm sm:text-base">
                      {xabar.yechim.yakuniyJavob}
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* JONLI AI HOLAT KO'RSATKICHI (TYPING INDICATOR) */}
        {yuklanmoqda && (
          <div className="flex items-center gap-3 p-4 rounded-3xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs text-[var(--v3-matn)] shadow-md animate-pulse">
            <div className="w-6 h-6 rounded-full bg-[var(--v3-urgu)] text-white flex items-center justify-center text-xs animate-spin">
              <Ikon nom="kolba" olcham={14} />
            </div>
            <span className="font-semibold">{jonliHolatMatni || "Javob tayyorlanmoqda..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* ─── 3. PASTKI STICKY CHAT DOCK (INPUT VA BOSHQARUV) ─── */}
      <footer className="sticky bottom-0 z-40 bg-[var(--v3-yuza)] border-t border-[var(--v3-chiziq)] backdrop-blur-xl p-3 sm:p-5 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Rejim va yordamchi tugmalar paneli */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* 3 xil rejim tanlagich */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)]">
              {REJIMLAR.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRejim(r.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    rejim === r.id
                      ? "bg-[var(--v3-urgu)] text-white shadow-sm"
                      : "text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                  }`}
                  title={r.tavsif}
                >
                  <Ikon nom={r.ikon} olcham={12} />
                  <span>{r.qisqa}</span>
                </button>
              ))}
            </div>

            {/* Belgilar paneli tugmasi */}
            <button
              type="button"
              onClick={() => setKlaviaturaOchiq(!klaviaturaOchiq)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
                klaviaturaOchiq
                  ? "bg-[var(--v3-urgu)] text-white border-transparent"
                  : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              }`}
            >
              <Ikon nom="atom" olcham={14} />
              <span>Kimyoviy belgilar</span>
            </button>
          </div>

          {/* Ochiladigan Kimyoviy maxsus belgilar klaviaturasi */}
          {klaviaturaOchiq && (
            <div className="p-3 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] animate-in fade-in duration-150">
              <div className="flex flex-wrap gap-1.5">
                {TEZKOR_BELGILAR.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => belgiQosh(b)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--v3-yuza)] hover:bg-[var(--v3-urgu)] hover:text-white border border-[var(--v3-chiziq)] text-xs font-mono font-bold transition-colors"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Yuklangan rasm previewsi */}
          {rasmBase64 && (
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={rasmBase64}
                  alt="Biriktirilgan rasm"
                  className="w-10 h-10 rounded-xl object-cover border border-amber-400/50"
                />
                <span className="text-xs text-white font-semibold truncate max-w-[200px] sm:max-w-md">
                  {rasmNomi || "Rasm biriktirildi"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRasmOchirish}
                className="p-1.5 rounded-xl bg-black/40 text-red-400 hover:text-red-300"
              >
                <Ikon nom="yopish" olcham={14} />
              </button>
            </div>
          )}

          {/* Asosiy Input va Jo'natish formasi */}
          <form onSubmit={handleXabarYuborish} className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleRasmYuklash}
            />

            {/* Rasm qo'shish tugmasi */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-2xl border border-[var(--v3-chiziq)] bg-[var(--v3-fon)] hover:bg-[var(--v3-yuza-2)] text-[var(--v3-urgu)] transition-colors shrink-0"
              title="Rasm yuklash"
            >
              <Ikon nom="rasm" olcham={18} />
            </button>

            {/* Ovozli yozish tugmasi */}
            <button
              type="button"
              onClick={handleOvozYozish}
              className={`p-3 rounded-2xl border transition-colors shrink-0 ${
                ovozYozilmoqda
                  ? "bg-red-500/20 text-red-400 border-red-500 animate-pulse"
                  : "bg-[var(--v3-fon)] border-[var(--v3-chiziq)] text-[var(--v3-matn)] hover:bg-[var(--v3-yuza-2)]"
              }`}
              title="Ovozda aytish"
            >
              <Ikon nom="mikrofon" olcham={18} />
            </button>

            {/* Textarea */}
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
              placeholder="Masala matnini yozing yoki savolingizni bering (Enter bosing)..."
              className="flex-1 p-3.5 rounded-2xl bg-[var(--v3-fon)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] placeholder-[var(--v3-xira)] focus:outline-hidden focus:border-[var(--v3-urgu)] resize-none max-h-32 leading-relaxed font-sans"
            />

            {/* Jo'natish tugmasi */}
            <button
              type="submit"
              disabled={yuklanmoqda || (!kiritma.trim() && !rasmBase64)}
              className="p-3.5 rounded-2xl bg-[var(--v3-urgu)] hover:opacity-90 text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer"
              title="Yuborish"
            >
              <Ikon nom="yubor" olcham={18} />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
