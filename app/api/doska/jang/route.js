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
  hostHuquqiniTekshir,
} from "@/lib/doska-jang-boshqaruvchi";
import { soravchiIp, chekloqniTekshir, urinishniQayd, kutishMatni } from "@/lib/ip-cheklov";

function hostTokenniOl(req, body = null) {
  return req.headers.get("x-doska-host-token") || body?.hostToken || null;
}

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
      const holat = doskaHolatiniOlish(xonaId);
      if (!holat) {
        return NextResponse.json({ error: "Xona topilmadi" }, { status: 404 });
      }
      if (holat.holat !== "yakunlandi") {
        return NextResponse.json(
          { error: "Musobaqa hali yakunlanmagan. To'g'ri javoblar test yakunlangach ochiladi." },
          { status: 403 }
        );
      }
      const tahlil = tahlilniOlish(xonaId, qatnashchiId);
      return NextResponse.json({ ok: true, tahlil });
    }

    // 2) Katta doska ekrani uchun so'rov (faqat xona yaratgan doska ekrani)
    if (rol === "doska") {
      const tek = hostHuquqiniTekshir(
        xonaId,
        req.headers.get("x-doska-host-token") || searchParams.get("hostToken")
      );
      if (!tek.ok) {
        return NextResponse.json({ error: tek.error }, { status: tek.status });
      }
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

    // Odatiy qisqa tekshiruv (Xona holati va faol jamoalar ro'yxati)
    const holat = doskaHolatiniOlish(xonaId);
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
    const { action, xonaId, mavzuId, jamoalarSoni, jamoaNomlari, jamoaId, yangiNom, ism, qatnashchiId, savolId, tanlanganIndex, sarflanganVaqtSoniya, qoidaBuzildi } = body;

    // 1) Yangi xona yaratish (O'qituvchi doskada bosganda)
    if (action === "yaratish") {
      const ip = soravchiIp(req);
      const cheklov = await chekloqniTekshir("doskaqr", ip);
      if (!cheklov.ok) {
        return NextResponse.json(
          { error: `Juda ko'p xona yaratildi. ${kutishMatni(cheklov.kutish)} dan keyin urinib ko'ring.` },
          { status: 429 }
        );
      }
      await urinishniQayd("doskaqr", ip);

      const xona = yangiXonaYarat(mavzuId, jamoalarSoni, jamoaNomlari);
      const holat = doskaHolatiniOlish(xona.xonaId);
      return NextResponse.json({
        ok: true,
        xonaId: xona.xonaId,
        hostToken: xona._hostToken,
        holat,
      });
    }

    if (!xonaId) {
      return NextResponse.json({ error: "Xona kodi ko'rsatilmadi" }, { status: 400 });
    }

    const hostToken = hostTokenniOl(req, body);

    // 1.1) Jamoa nomini yangilash
    if (action === "nomniYangila") {
      const tek = hostHuquqiniTekshir(xonaId, hostToken);
      if (!tek.ok) return NextResponse.json({ error: tek.error }, { status: tek.status });
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
      const tek = hostHuquqiniTekshir(xonaId, hostToken);
      if (!tek.ok) return NextResponse.json({ error: tek.error }, { status: tek.status });
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
      const tek = hostHuquqiniTekshir(xonaId, hostToken);
      if (!tek.ok) return NextResponse.json({ error: tek.error }, { status: tek.status });
      const holat = qatnashchiniChetlat(xonaId, qatnashchiId);
      return NextResponse.json({ ok: true, holat });
    }

    // 6) Jangni yakunlash
    if (action === "tugatish") {
      const tek = hostHuquqiniTekshir(xonaId, hostToken);
      if (!tek.ok) return NextResponse.json({ error: tek.error }, { status: tek.status });
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
