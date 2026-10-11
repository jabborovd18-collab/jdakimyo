// app/api/doska/jang/route.js
//
// Smart Doska — Jamoalar Jangi API endpointi.
// Barcha real-vaqtli harakatlar va sinxronizatsiya shu yerdan o'tadi.

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
    if (action === "tahlil" && qatnashchiId) {
      const tahlil = tahlilniOlish(xonaId, qatnashchiId);
      return NextResponse.json({ ok: true, tahlil });
    }

    // 2) Katta doska ekrani uchun so'rov
    if (rol === "doska") {
      const holat = doskaHolatiniOlish(xonaId);
      if (!holat) {
        return NextResponse.json({ error: "Xona topilmadi yoki muddati o'tgan" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, holat });
    }

    // 3) O'quvchi telefoni uchun so'rov
    if (qatnashchiId) {
      const holat = oquvchiHolatiniOlish(xonaId, qatnashchiId);
      if (holat.xato) {
        return NextResponse.json({ error: holat.xato }, { status: 404 });
      }
      return NextResponse.json({ ok: true, holat });
    }

    // Odatiy qisqa tekshiruv
    const holat = doskaHolatiniOlish(xonaId);
    if (!holat) {
      return NextResponse.json({ error: "Xona topilmadi" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, holat: { xonaId: holat.xonaId, holat: holat.holat, jamoalarSoni: holat.jamoalarSoni } });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Server xatosi" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, xonaId, mavzuId, jamoalarSoni, jamoaNomlari, jamoaId, yangiNom, ism, qatnashchiId, savolId, tanlanganIndex, sarflanganVaqtSoniya, qoidaBuzildi } = body;

    // 1) Yangi xona yaratish (O'qituvchi doskada bosganda)
    if (action === "yaratish") {
      const xona = yangiXonaYarat(mavzuId, jamoalarSoni, jamoaNomlari);
      const holat = doskaHolatiniOlish(xona.xonaId);
      return NextResponse.json({ ok: true, xonaId: xona.xonaId, holat });
    }

    if (!xonaId) {
      return NextResponse.json({ error: "Xona kodi ko'rsatilmadi" }, { status: 400 });
    }

    // 1.1) Jamoa nomini yangilash
    if (action === "nomniYangila") {
      const holat = jamoaNominiYangila(xonaId, jamoaId, yangiNom);
      return NextResponse.json({ ok: true, holat });
    }

    // 2) O'quvchi xonaga qo'shilishi (QR kod orqali)
    if (action === "qoshilish") {
      const natija = qatnashchiQosh(xonaId, ism, jamoaId);
      return NextResponse.json({ ok: true, ...natija });
    }

    // 3) Jangni boshlash (Lobby -> Jang)
    if (action === "boshlash") {
      const holat = jangniBoshla(xonaId);
      return NextResponse.json({ ok: true, holat });
    }

    // 4) Savolga javob yuborish
    if (action === "javob") {
      const natija = javobniQabulQil(xonaId, qatnashchiId, savolId, tanlanganIndex, sarflanganVaqtSoniya, qoidaBuzildi);
      return NextResponse.json(natija);
    }

    // 5) O'qituvchi moderatsiyasi (soxta hisobni chetlatish)
    if (action === "chetlatish") {
      const holat = qatnashchiniChetlat(xonaId, qatnashchiId);
      return NextResponse.json({ ok: true, holat });
    }

    // 6) Jangni yakunlash
    if (action === "tugatish") {
      const holat = jangniTugat(xonaId);
      return NextResponse.json({ ok: true, holat });
    }

    // 7) O'quvchi barcha savollarni yakunlaganini bildirish
    if (action === "oquvchiTugatdi") {
      const natija = oquvchiTugatdi(xonaId, qatnashchiId, sarflanganVaqtSoniya);
      return NextResponse.json(natija);
    }

    return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Xatolik yuz berdi" }, { status: 400 });
  }
}
