import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
} from "node:crypto";
import { NextResponse } from "next/server";
import { get, put } from "@vercel/blob";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authMaxfiyKaliti } from "@/lib/auth-maxfiy-kalit";

export const runtime = "nodejs";

const xabarSxemasi = z.object({
  id: z.string().min(1).max(120),
  rol: z.enum(["user", "ai"]),
}).passthrough();

const chatSxemasi = z.object({
  id: z.string().min(1).max(120),
  sarlavha: z.string().max(160),
  xabarlar: z.array(xabarSxemasi).max(300),
  yaratilganAt: z.string().max(40),
  yangilanganAt: z.string().max(40),
});

const nusxaSxemasi = z.object({
  versiya: z.literal(1),
  yangilanganAt: z.string().max(40),
  chatlar: z.array(chatSxemasi).max(100),
  profil: z.object({
    id: z.literal("asosiy"),
    mavzular: z.record(z.number().nonnegative().finite()),
    oxirgiFaollik: z.string().max(40),
  }).nullable(),
});

function xotiraYoli(userId) {
  // Xom foydalanuvchi ID si Blob yo'lida ko'rinmasligi uchun qaytarib
  // bo'lmaydigan HMAC ishlatiladi; haqiqiy egani faqat sessiya belgilaydi.
  const kalit = authMaxfiyKaliti();
  const yashirinId = createHmac("sha256", kalit).update(userId).digest("hex");
  return `ai-xotira/${yashirinId}/snapshot.json`;
}

function blobRuxsati() {
  return process.env.AI_XOTIRA_BLOB_ACCESS === "private" ? "private" : "public";
}

function shifrlashKaliti() {
  return createHash("sha256")
    .update(`${authMaxfiyKaliti()}:jda-ai-xotira:v1`)
    .digest();
}

function nusxaniShifrlash(nusxa, userId) {
  const iv = randomBytes(12);
  const shifr = createCipheriv("aes-256-gcm", shifrlashKaliti(), iv);
  shifr.setAAD(Buffer.from(`jda-ai-xotira:${userId}`, "utf8"));
  const yopiq = Buffer.concat([
    shifr.update(JSON.stringify(nusxa), "utf8"),
    shifr.final(),
  ]);
  return JSON.stringify({
    versiya: 1,
    iv: iv.toString("base64"),
    teg: shifr.getAuthTag().toString("base64"),
    malumot: yopiq.toString("base64"),
  });
}

function nusxaniOchish(matn, userId) {
  const qobiq = JSON.parse(matn);
  if (qobiq?.versiya !== 1 || !qobiq.iv || !qobiq.teg || !qobiq.malumot) {
    throw new Error("Shifrlangan xotira shakli noto'g'ri");
  }
  const ochuvchi = createDecipheriv(
    "aes-256-gcm",
    shifrlashKaliti(),
    Buffer.from(qobiq.iv, "base64"),
  );
  ochuvchi.setAAD(Buffer.from(`jda-ai-xotira:${userId}`, "utf8"));
  ochuvchi.setAuthTag(Buffer.from(qobiq.teg, "base64"));
  const ochiq = Buffer.concat([
    ochuvchi.update(Buffer.from(qobiq.malumot, "base64")),
    ochuvchi.final(),
  ]);
  return JSON.parse(ochiq.toString("utf8"));
}

async function sessiyaniOl() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? session : null;
}

export async function GET() {
  const session = await sessiyaniOl();
  if (!session) {
    return NextResponse.json({ xato: "Akkauntga kirish talab qilinadi" }, { status: 401 });
  }

  try {
    const natija = await get(xotiraYoli(session.user.id), { access: blobRuxsati() });
    if (!natija) return NextResponse.json({ nusxa: null });
    if (natija.statusCode !== 200 || !natija.stream) {
      return NextResponse.json({ nusxa: null });
    }

    const matn = await new Response(natija.stream).text();
    const tekshiruv = nusxaSxemasi.safeParse(nusxaniOchish(matn, session.user.id));
    if (!tekshiruv.success) {
      console.error("[AI XOTIRA] Blob nusxasi sxemaga mos emas", tekshiruv.error.issues);
      return NextResponse.json({ xato: "Xotira nusxasi buzilgan" }, { status: 422 });
    }
    return NextResponse.json({ nusxa: tekshiruv.data });
  } catch (error) {
    console.error("[AI XOTIRA] O'qish xatosi:", error.message);
    return NextResponse.json({ xato: "Akkaunt xotirasini o'qib bo'lmadi" }, { status: 503 });
  }
}

export async function PUT(request) {
  const session = await sessiyaniOl();
  if (!session) {
    return NextResponse.json({ xato: "Akkauntga kirish talab qilinadi" }, { status: 401 });
  }

  try {
    const matn = await request.text();
    if (Buffer.byteLength(matn, "utf8") > 2 * 1024 * 1024) {
      return NextResponse.json({ xato: "Xotira nusxasi 2 MB dan oshmasligi kerak" }, { status: 413 });
    }

    const tekshiruv = nusxaSxemasi.safeParse(JSON.parse(matn));
    if (!tekshiruv.success) {
      return NextResponse.json({ xato: "Xotira nusxasi noto'g'ri" }, { status: 400 });
    }

    await put(xotiraYoli(session.user.id), nusxaniShifrlash(tekshiruv.data, session.user.id), {
      access: blobRuxsati(),
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/octet-stream",
      cacheControlMaxAge: 60,
    });
    return NextResponse.json({ saqlandi: true });
  } catch (error) {
    console.error("[AI XOTIRA] Saqlash xatosi:", error.message);
    return NextResponse.json({ xato: "Akkaunt xotirasini saqlab bo'lmadi" }, { status: 503 });
  }
}
