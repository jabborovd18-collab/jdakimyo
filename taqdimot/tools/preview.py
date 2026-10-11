"""PDF sahifalarini rasmga aylantirish va tekshirish varaqlari.

NEGA KERAK. Slaydni "kod xato bermadi" deb topshirib bo'lmaydi: matn
kartadan chiqib ketishi, sarlavha ikkinchi qatorga tushib kolontitulni
bosishi mumkin — bularning hech biri xato bermaydi.

ISHLATISH:
    python3 tools/preview.py chiqish/taqdimot.pdf
    python3 tools/preview.py chiqish/taqdimot.pdf --umumiy chiqish/umumiy.png
    python3 tools/preview.py a.pdf b.pdf --taqqosla chiqish/taqqos.png
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from PIL import Image, ImageDraw, ImageFont  # noqa: E402
from pypdfium2 import PdfDocument  # noqa: E402

SHRIFT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                      "shriftlar", "Inter-SemiBold.ttf")


def sahifalarniRasmga(pdf, papka=None, olcham=1600):
    papka = papka or os.path.dirname(os.path.abspath(pdf))
    os.makedirs(papka, exist_ok=True)
    asos = os.path.splitext(os.path.basename(pdf))[0]
    doc = PdfDocument(pdf)
    fayllar = []
    for i in range(len(doc)):
        page = doc[i]
        rasm = page.render(scale=olcham / page.get_width()).to_pil().convert("RGB")
        yol = os.path.join(papka, f"{asos}-{i + 1:02d}.png")
        rasm.save(yol)
        fayllar.append(yol)
    return fayllar


def yorliqQatori(rasm, matn):
    keng, baland = rasm.size
    yuza = Image.new("RGB", (keng, baland + 46), (14, 16, 22))
    yuza.paste(rasm, (0, 46))
    d = ImageDraw.Draw(yuza)
    shrift = ImageFont.truetype(SHRIFT, 24) if os.path.exists(SHRIFT) else None
    d.text((22, 12), matn, fill=(238, 240, 246), font=shrift)
    return yuza


def varaqYasa(rasmlar, chiqish, ustunlar=2, oraliq=20):
    keng = max(r.size[0] for r in rasmlar)
    baland = max(r.size[1] for r in rasmlar)
    qatorlar = (len(rasmlar) + ustunlar - 1) // ustunlar
    varaq = Image.new("RGB",
                      (ustunlar * keng + oraliq * (ustunlar + 1),
                       qatorlar * baland + oraliq * (qatorlar + 1)),
                      (7, 8, 11))
    for i, rasm in enumerate(rasmlar):
        q, u = divmod(i, ustunlar)
        varaq.paste(rasm, (oraliq + u * (keng + oraliq), oraliq + q * (baland + oraliq)))
    varaq.save(chiqish)
    return chiqish


def umumiyVarak(pdf, chiqish, ustunlar=4, olcham=660):
    """Butun taqdimotni bitta varaqda ko'rsatadi.

    NEGA KERAK: slaydlar ketma-ketligidagi ritm (muqova → reja → bo'lim
    → mazmun → xulosa) faqat shu varaqda ko'rinadi. Alohida slaydlar
    chiroyli bo'lib, ketma-ketlik "nafas olmay" qolishi mumkin.
    """
    doc = PdfDocument(pdf)
    rasmlar = []
    for i in range(len(doc)):
        page = doc[i]
        rasm = page.render(scale=olcham / page.get_width()).to_pil().convert("RGB")
        rasmlar.append(yorliqQatori(rasm, f"{i + 1:02d}"))
    return varaqYasa(rasmlar, chiqish, ustunlar=ustunlar)


def taqqoslashVaragi(pdf_royxati, chiqish, ustunlar=2):
    rasmlar = []
    for pdf in pdf_royxati:
        nom = os.path.splitext(os.path.basename(pdf))[0]
        doc = PdfDocument(pdf)
        page = doc[0]
        rasm = page.render(scale=1100 / page.get_width()).to_pil().convert("RGB")
        rasmlar.append(yorliqQatori(rasm, nom))
    return varaqYasa(rasmlar, chiqish, ustunlar=ustunlar)


def main():
    ap = argparse.ArgumentParser(description="PDF -> PNG ko'rish")
    ap.add_argument("pdf", nargs="+")
    ap.add_argument("--olcham", type=int, default=1600)
    ap.add_argument("--taqqosla", default=None)
    ap.add_argument("--umumiy", default=None)
    args = ap.parse_args()

    for pdf in args.pdf:
        fayllar = sahifalarniRasmga(pdf, olcham=args.olcham)
        print(f"{os.path.basename(pdf)}: {len(fayllar)} sahifa -> {os.path.dirname(fayllar[0])}/")

    if args.taqqosla:
        print("Taqqoslash varag'i:", taqqoslashVaragi(args.pdf, args.taqqosla))
    if args.umumiy:
        print("Umumiy varaq:", umumiyVarak(args.pdf[0], args.umumiy))


if __name__ == "__main__":
    main()
