import { NextResponse } from "next/server";

// GET /api/ovoz?matn=...
// Google Translate TTS (tl=uz) audio oqimini mobil brauzerlar va iOS Safari
// uchun CORS cheklovlarisiz to'g'ridan-to'g'ri proksi qilib beradi.
export async function GET(request) {
  try {
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

    return new NextResponse(audioBytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (err) {
    return new NextResponse("Server audio xatosi", { status: 500 });
  }
}
