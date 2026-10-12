"""PPTX uchun kichraytirilgan rasm nusxalarini yasash.

NEGA KERAK: illyustratsiyalar 1408×768 o'lchamda ~2 MB (PNG). PPTX ularni
to'liq hajmda ichiga oladi va fayl 16 MB ga chiqadi — yuborish, ochish va
tahrirlash sekinlashadi. Slaydda rasm ~5 dyuym (≈480 piksel) kenglikda
ko'rinadi, shuning uchun 1400 piksel yetarli va sifat ko'zga farq qilmaydi.

QOIDALAR:
  · faqat KATTA fayllar kichraytiriladi (kichik grafiklarga tegmaydi);
  · shaffofligi bor PNG JPEG qilinmaydi (fon oqarib ketardi);
  · nisbat saqlanadi, kenglik `KENG_PIKSEL` dan oshmaydi.

ISHLATISH:
    python3 tools/pptx-rasm.py          # kontent/rasmlar/ -> chiqish/rasm-kichik/
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from PIL import Image  # noqa: E402

ILDIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RASMLAR = os.path.join(ILDIZ, "kontent", "rasmlar")
CHIQISH = os.path.join(ILDIZ, "chiqish", "rasm-kichik")

KENG_PIKSEL = 1400   # slaydda ko'rinadigan o'lchamdan ancha katta
CHEGARA_BAYT = 300 * 1024   # bundan kichik fayl tegilmaydi
SIFAT = 88


def main():
    os.makedirs(CHIQISH, exist_ok=True)
    yasalgan = 0
    tejaldi = 0
    for nom in sorted(os.listdir(RASMLAR)):
        yol = os.path.join(RASMLAR, nom)
        if not os.path.isfile(yol) or not nom.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        if os.path.getsize(yol) < CHEGARA_BAYT:
            continue
        with Image.open(yol) as rasm:
            if rasm.mode in ("RGBA", "LA", "P") and "transparency" in rasm.info:
                continue  # shaffof rasm — JPEG qilinmaydi
            rasm = rasm.convert("RGB")
            # Uzun tomoni `KENG_PIKSEL` dan oshsa kichraytiriladi; tik
            # (portret) rasm ham shu qoidaga tushadi.
            uzun = max(rasm.width, rasm.height)
            if uzun > KENG_PIKSEL:
                koeff = KENG_PIKSEL / uzun
                yangi = rasm.resize((max(1, round(rasm.width * koeff)),
                                     max(1, round(rasm.height * koeff))), Image.LANCZOS)
            else:
                yangi = rasm  # o'lcham yetarli — faqat siqiladi
        chiqish = os.path.join(CHIQISH, os.path.splitext(nom)[0] + ".jpg")
        yangi.save(chiqish, "JPEG", quality=SIFAT, optimize=True)
        tejaldi += os.path.getsize(yol) - os.path.getsize(chiqish)
        yasalgan += 1

    print(f"✅ {yasalgan} rasm kichraytirildi -> {os.path.relpath(CHIQISH, ILDIZ)}"
          f"   (tejaldi {tejaldi // 1024 // 1024} MB)")


if __name__ == "__main__":
    main()
