import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { tezlikOshdimi } from "@/lib/tezlik-cheklov.js";

export const runtime = "nodejs";
export const maxDuration = 60;

const SO_ROV_BAYT_CHEGARASI = 900_000;
const PDF_QOIDASI = [
  { soni: 4, oynaMs: 60_000, xabar: "Bir daqiqada ko'pi bilan 4 ta PDF tayyorlash mumkin." },
  { soni: 30, oynaMs: 3_600_000, xabar: "Soatlik PDF chegarasiga yetdingiz." },
];

function xatoJavobi(xato, status = 500) {
  return Response.json({ xato }, { status });
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return xatoJavobi("PDF yuklash uchun tizimga kiring.", 401);

    const contentLength = Number(request.headers.get("content-length")) || 0;
    if (contentLength > SO_ROV_BAYT_CHEGARASI) {
      return xatoJavobi("PDF ma'lumoti ruxsat etilgan hajmdan katta.", 413);
    }

    const cheklov = tezlikOshdimi(`masala-pdf:${session.user.id}`, PDF_QOIDASI);
    if (cheklov) return xatoJavobi(cheklov, 429);

    const xomBody = await request.text();
    if (Buffer.byteLength(xomBody, "utf8") > SO_ROV_BAYT_CHEGARASI) {
      return xatoJavobi("PDF ma'lumoti ruxsat etilgan hajmdan katta.", 413);
    }
    let body = null;
    try {
      body = JSON.parse(xomBody);
    } catch {
      body = null;
    }
    if (!body || typeof body !== "object") return xatoJavobi("PDF ma'lumoti noto'g'ri.", 400);
    if (typeof body.masalaMatni !== "string" || body.masalaMatni.length > 12_000) {
      return xatoJavobi("Masala matni ruxsat etilgan chegaradan katta.", 400);
    }
    if (!body.natija || typeof body.natija !== "object" || Array.isArray(body.natija)) {
      return xatoJavobi("Yechim ma'lumoti topilmadi.", 400);
    }

    // Chromium og'ir serverless dependency bo'lgani uchun faqat haqiqiy PDF
    // so'rovida yuklanadi; aks holda route ochilishining o'zi yiqilishi mumkin.
    const { masalaPdfChromiumdaYarat } = await import("@/lib/masala-pdf-chromium.js");
    const foydalanuvchiNom = session.user.fullName || session.user.username || "Talaba";
    const pdf = await masalaPdfChromiumdaYarat({
      foydalanuvchiNom,
      masalaMatni: body.masalaMatni,
      natija: body.natija,
      sana: new Date(),
    });

    const sana = new Date().toISOString().slice(0, 10);
    return new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="JDA-Kimyo-Premium-${sana}.pdf"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (xato) {
    console.error("[Premium PDF xatosi]", xato);
    return xatoJavobi("Premium PDF tayyorlanmadi. Qayta urinib ko'ring.", 500);
  }
}
