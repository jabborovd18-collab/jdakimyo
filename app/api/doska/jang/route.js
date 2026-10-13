// app/api/doska/jang/route.js
//
// Smart Doska — Jamoalar Jangi API endpointi.
// Barcha real-vaqtli harakatlar va sinxronizatsiya shu yerdan o'tadi.
//
// RUXSAT MODEL. O'quvchi harakatlari (qo'shilish, javob) PIN bilan ochiq —
// ro'yxatsiz sinfda shunday bo'lishi kerak. Ustoz harakatlari (yaratishdan
// keyingi boshqaruv: boshlash, yakunlash, chetlatish, nom) esa xona
// yaratilganda BIR marta berilgan `ustozKalit` siz bajarilmaydi. Kalitsiz
// PIN'ni bilgan har kim darsni buzishi mumkin edi (K3).

import { NextResponse } from "next/server";
import {
  yangiXonaYarat,
  doskaHolatiniOlish,
  qatnashchiQosh,
  oquvchiHolatiniOlish,
  jangniBoshla,
  javobniQabulQil,
  qatnashchiniChetlat,
  jangniTugat,
  tahlilniOlish,
  oquvchiTugatdi,
  jamoaNominiYangila,
} from "@/lib/doska-jang-boshqaruvchi";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const xonaId = searchParams.get("xonaId");
    const rol = searchParams.get("rol");
    const qatnashchiId = searchParams.get("qatnashchiId");
    const action = searchParams.get("action");

    if (!xonaId) {
      return NextResponse.json({ error: "Xona kodi ko'rsatilmadi" }, { status: 400 });
    }

    // 1) Test tahlili (har bir savolning to'g'ri javobi va izohi)
    // Anti-Cheat: Tahlil faqat musobaqa doskada yakunlangandagina beriladi!
    if (action === "tahlil" && qatnashchiId) {
      const holat = await doskaHolatiniOlish(xonaId);
      if (!holat) {
        return NextResponse.json({ error: "Xona topilmadi" }, { status: 404 });
      }
      if (holat.holat !== "yakunlandi") {
        return NextResponse.json(
          { error: "Musobaqa hali yakunlanmagan. To'g'ri javoblar test yakunlangach ochiladi." },
          { status: 403 }
        );
      }
      const tahlil = await tahlilniOlish(xonaId, qatnashchiId);
      return NextResponse.json({ ok: true, tahlil });
    }

    // 2) Katta doska ekrani uchun so'rov
    if (rol === "doska") {
      const holat = await doskaHolatiniOlish(xonaId);
      if (!holat) {
        return NextResponse.json({ error: "Xona topilmadi yoki muddati o'tgan" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, holat });
    }

    // 3) O'quvchi telefoni uchun so'rov
    if (qatnashchiId) {
      const holat = await oquvchiHolatiniOlish(xonaId, qatnashchiId);
      if (holat.xato) {
        return NextResponse.json({ error: holat.xato }, { status: 404 });
      }
      return NextResponse.json({ ok: true, holat });
    }

    // Odatiy qisqa tekshiruv (Xona holati va faol jamoalar ro'yxati)
    const holat = await doskaHolatiniOlish(xonaId);
    if (!holat) {
      return NextResponse.json({ error: "Xona topilmadi" }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      holat: {
        xonaId: holat.xonaId,
        holat: holat.holat,
        jamoalarSoni: holat.jamoalarSoni,
        jamoalar: holat.jamoalar.map((j) => ({
          id: j.id,
          nom: j.nom,
          rang: j.rang,
          hex: j.hex,
          suyuqlikRang: j.suyuqlikRang,
          azolariSoni: j.azolariSoni,
        })),
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Server xatosi" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, xonaId, mavzuId, jamoalarSoni, jamoaNomlari, jamoaId, yangiNom, ism, qatnashchiId, savolId, tanlanganIndex, sarflanganVaqtSoniya, qoidaBuzildi, ustozKalit } = body;

    // 1) Yangi xona yaratish (O'qituvchi doskada bosganda)
    if (action === "yaratish") {
      const xona = await yangiXonaYarat(mavzuId, jamoalarSoni, jamoaNomlari);
      const holat = await doskaHolatiniOlish(xona.xonaId);
      // ustozKalit FAQAT shu javobda qaytadi — boshqa endpoint uni bermaydi
      return NextResponse.json({ ok: true, xonaId: xona.xonaId, ustozKalit: xona.ustozKalit, holat });
    }

    if (!xonaId) {
      return NextResponse.json({ error: "Xona kodi ko'rsatilmadi" }, { status: 400 });
    }

    // 1.1) Jamoa nomini yangilash (faqat ustoz)
    if (action === "nomniYangila") {
      const holat = await jamoaNominiYangila(xonaId, jamoaId, yangiNom, ustozKalit);
      return NextResponse.json({ ok: true, holat });
    }

    // 2) O'quvchi xonaga qo'shilishi (QR kod orqali)
    if (action === "qoshilish") {
      const natija = await qatnashchiQosh(xonaId, ism, jamoaId);
      return NextResponse.json({ ok: true, ...natija });
    }

    // 3) Jangni boshlash (Lobby -> Jang). Faqat ustoz.
    if (action === "boshlash") {
      const holat = await jangniBoshla(xonaId, ustozKalit);
      return NextResponse.json({ ok: true, holat });
    }

    // 4) Savolga javob yuborish
    // sarflanganVaqtSoniya eski clientlar uchun qabul qilinadi, lekin vaqt
    // server soati bilan o'lchanadi — mijoz qiymati hisobga olinmaydi (K4).
    if (action === "javob") {
      const natija = await javobniQabulQil(xonaId, qatnashchiId, savolId, tanlanganIndex, sarflanganVaqtSoniya, qoidaBuzildi);
      return NextResponse.json(natija);
    }

    // 5) O'qituvchi moderatsiyasi (soxta hisobni chetlatish). Faqat ustoz.
    if (action === "chetlatish") {
      const holat = await qatnashchiniChetlat(xonaId, qatnashchiId, ustozKalit);
      return NextResponse.json({ ok: true, holat });
    }

    // 6) Jangni yakunlash. Faqat ustoz.
    if (action === "tugatish") {
      const holat = await jangniTugat(xonaId, ustozKalit);
      return NextResponse.json({ ok: true, holat });
    }

    // 7) O'quvchi barcha savollarni yakunlaganini bildirish
    if (action === "oquvchiTugatdi") {
      const natija = await oquvchiTugatdi(xonaId, qatnashchiId);
      return NextResponse.json(natija);
    }

    return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 });
  } catch (e) {
    // Ruxsat xatosi 403 — client "kalit yo'q" holatini shundan ajratadi
    const status = e.kod === "RUXSAT" ? 403 : 400;
    return NextResponse.json({ error: e.message || "Xatolik yuz berdi" }, { status });
  }
}
