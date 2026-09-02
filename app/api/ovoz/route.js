import { randomUUID } from "node:crypto";
import { after, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { tezlikOshdimi, OVOZ_QOIDASI } from "@/lib/tezlik-cheklov.js";
import { aiSozlamaniOl } from "@/lib/ai-agents/ai-config.js";
import { aiHodisalarniYoz } from "@/lib/ai-agents/ai-telemetriya.js";

// GET /api/ovoz?matn=...
// Google Translate TTS (tl=uz) audio oqimini mobil brauzerlar va iOS Safari
// uchun CORS cheklovlarisiz to'g'ridan-to'g'ri proksi qilib beradi.
//
// Kirish talab qilinadi: aks holda sayt begonalar uchun bepul TTS
// xizmatiga aylanardi va har so'rov Vercel funksiya vaqtini yeydi.
// Hozircha faqat `/masala` sahifasi chaqiradi, u ham kirishni talab qiladi.
export async function GET(request) {
  const boshlandi = Date.now();
  const requestId = randomUUID();
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Kirish talab qilinadi", { status: 401 });
    }
    const { config } = await aiSozlamaniOl();
    if (!config.enabled || !config.channels.ovoz) {
      return new NextResponse("Ovozli xizmat vaqtincha o'chirilgan", { status: 503 });
    }

    const tezlik = tezlikOshdimi(`ovoz:${session.user.id}`, OVOZ_QOIDASI);
    if (tezlik) {
      return new NextResponse(tezlik, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const matn = searchParams.get("matn");

    if (!matn || !matn.trim()) {
      return new NextResponse("Matn kiritilmadi", { status: 400 });
    }

    const tozaMatn = matn.trim().slice(0, 200);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      tozaMatn
    )}&tl=uz&client=tw-ob`;

    const res = await fetch(googleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!res.ok) {
      return new NextResponse("Audio yuklab bo'lmadi", { status: res.status });
    }

    const audioBytes = await res.arrayBuffer();
    after(() => aiHodisalarniYoz([{
      requestId, channel: "ovoz", operation: "tts", status: "success", durationMs: Date.now() - boshlandi,
    }]).catch((error) => console.error("[Ovoz telemetriya xatosi]", error?.message)));

    return new NextResponse(audioBytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        // `private`: endi yo'l himoyalangan, umumiy CDN keshi javobni
        // boshqa foydalanuvchiga qaytarmasligi kerak
        "Cache-Control": "private, max-age=86400, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    after(() => aiHodisalarniYoz([{
      requestId, channel: "ovoz", operation: "tts", status: "error", errorCode: "TTS_XATO", durationMs: Date.now() - boshlandi,
    }]).catch((error) => console.error("[Ovoz telemetriya xatosi]", error?.message)));
    return new NextResponse("Server audio xatosi", { status: 500 });
  }
}
