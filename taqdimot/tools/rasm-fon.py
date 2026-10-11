"""Rasmlarning fon to'qligini aniqlash — PPTX chiqaruvi uchun.

NEGA KERAK: PDF dvigateli (`render.py`) rasm fonini O'ZI o'lchaydi
(Pillow bor): to'q fonli illyustratsiya oq karta ichiga solinmaydi,
chunki oq kartochka uning atrofida sun'iy "deraza" bo'lib ko'rinadi.
Node tomoni esa PNG'ni ochib ko'ra olmaydi — shuning uchun o'lchov bir
marta shu yerda bajariladi va `kontent/rasm-fon.json` ga yoziladi.

ISHLATISH:
    python3 tools/rasm-fon.py           # kontent/rasmlar/ dagi hamma rasm
"""

import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from PIL import Image  # noqa: E402

ILDIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RASMLAR = os.path.join(ILDIZ, "kontent", "rasmlar")
CHIQISH = os.path.join(ILDIZ, "kontent", "rasm-fon.json")

# To'qlik chegarasi: render.py dagi bilan bir xil bo'lishi shart.
CHEGARA = 128


def ortacha(fayl):
    """Rasmning o'rtacha yorqinligi (0–255), 24×16 ga kichraytirib."""
    with Image.open(fayl) as r:
        kichik = r.convert("L").resize((24, 16))
        # getdata() Pillow 14 da olib tashlandi — tobytes() ishlatiladi.
        baytlar = kichik.tobytes()
    return sum(baytlar) / len(baytlar)


def main():
    if not os.path.isdir(RASMLAR):
        print(f"❌ {RASMLAR} topilmadi")
        return 1
    natija = {}
    for nom in sorted(os.listdir(RASMLAR)):
        if not nom.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        yol = os.path.join(RASMLAR, nom)
        try:
            yorqinlik = ortacha(yol)
        except Exception as xato:  # buzilgan rasm — oq deb hisoblanadi
            print(f"  ⚠ {nom}: o'qilmadi ({xato.__class__.__name__})")
            continue
        natija[nom] = {"ortacha": round(yorqinlik), "toq": yorqinlik < CHEGARA}

    with open(CHIQISH, "w", encoding="utf-8") as f:
        json.dump(natija, f, ensure_ascii=False, indent=1, sort_keys=True)

    toqlar = [k for k, v in natija.items() if v["toq"]]
    print(f"✅ {len(natija)} rasm -> {os.path.relpath(CHIQISH, ILDIZ)}")
    print(f"   to'q fonli: {len(toqlar)} ta {toqlar if toqlar else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
