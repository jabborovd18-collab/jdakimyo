"""Variable shriftlardan statik nusxalar yasash.

NEGA KERAK. Manba sifatida olib kelinadigan shriftlar — variable
(o'zgaruvchan): bitta faylda butun og'irlik o'qi yotadi. reportlab
bunday faylni tushunmaydi va uni doim 400 og'irlikda chizadi — ya'ni
"qalin" sarlavha jimgina yupqa bo'lib chiqadi (xato ham bermaydi).

Shriftlar tasodifan tanlanmagan:
  Inter        — asosiy matn; kichik o'lchamda ham toza
  Manrope      — muqova va sarlavha; geometrikroq, "premium" ohang
  Playfair     — serif urg'u (iqtibos, katta raqam)
  Noto Sans Math — zaxira: ∠ ⇌ ≡ → ≈ kabi belgilar

O'zgartirish kerak bo'lsa FAQAT `MANBALAR` va `NUSXALANADIGAN` shu
faylda tahrirlanadi — qolgan modullar shu yerdan oladi.
"""

import os
import shutil
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "pylib"))

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ILDIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XOM = os.path.join(ILDIZ, "fonts")
CHIQISH = os.path.join(ILDIZ, "shriftlar")

MANBALAR = {
    "Inter-VF.ttf": {
        "Inter-Regular.ttf": 400,
        "Inter-Medium.ttf": 500,
        "Inter-SemiBold.ttf": 600,
        "Inter-Bold.ttf": 700,
        "Inter-ExtraBold.ttf": 800,
    },
    "Manrope-VF.ttf": {
        "Manrope-SemiBold.ttf": 600,
        "Manrope-Bold.ttf": 700,
        "Manrope-ExtraBold.ttf": 800,
    },
    "Playfair-VF.ttf": {
        "Playfair-Regular.ttf": 400,
        "Playfair-Bold.ttf": 700,
    },
}

# Variable bo'lmagan shriftlar — shunchaki nusxalanadi.
NUSXALANADIGAN = ["NotoSansMath-Regular.ttf"]

# O'zbek matnida uchraydigan, shriftda bo'lmasa jimgina "kvadrat" bo'lib
# chiqadigan belgilar. Har bir yangi shrift qo'shilganda shu ro'yxat
# tekshiriladi — aks holda xato faqat foydalanuvchi ko'ziga tashlanadi.
MEZON_BELGILAR = {
    "ʻ": 0x02BB, "’": 0x2019, "‘": 0x2018,
    "×": 0x00D7, "≈": 0x2248, "→": 0x2192, "⇌": 0x21CC, "∠": 0x2220,
    "₂": 0x2082, "₃": 0x2083, "₄": 0x2084, "°": 0x00B0,
    "•": 0x2022, "–": 0x2013, "—": 0x2014, "σ": 0x03C3, "Δ": 0x0394,
}


def kesibOl(manba, ogirlik):
    font = TTFont(os.path.join(XOM, manba))
    # `opsz` kabi boshqa o'qlar default qiymatda qotiriladi — qolib
    # ketgan o'q faylni buzadi, reportlab uni baribir ko'rmaydi.
    return instancer.instantiateVariableFont(font, {"wght": ogirlik})


def yasa(ozGina=True):
    os.makedirs(CHIQISH, exist_ok=True)
    hisobot = []
    for nom in NUSXALANADIGAN:
        yol = os.path.join(CHIQISH, nom)
        if not (os.path.exists(yol) and ozGina):
            shutil.copy2(os.path.join(XOM, nom), yol)
        hisobot.append((nom, "nusxa", f"{os.path.getsize(yol) // 1024} KB"))

    for manba, chiqishlar in MANBALAR.items():
        for chiqish, ogirlik in chiqishlar.items():
            yol = os.path.join(CHIQISH, chiqish)
            if os.path.exists(yol) and ozGina:
                hisobot.append((chiqish, ogirlik, "bor edi"))
                continue
            kesibOl(manba, ogirlik).save(yol)
            hisobot.append((chiqish, ogirlik, f"{os.path.getsize(yol) // 1024} KB"))
    return hisobot


def belgilarniTekshir(chiqishlar=None):
    """Qaysi statik faylda qaysi mezon belgisi yo'q — ro'yxat qaytaradi."""
    chiqishlar = chiqishlar or ([n for g in MANBALAR.values() for n in g] + NUSXALANADIGAN)
    natija = []
    for nom in chiqishlar:
        yol = os.path.join(CHIQISH, nom)
        if not os.path.exists(yol):
            continue
        cmap = TTFont(yol).getBestCmap()
        natija.append((nom, [b for b, kod in MEZON_BELGILAR.items() if kod not in cmap]))
    return natija


if __name__ == "__main__":
    for nom, ogirlik, izoh in yasa():
        print(f"{nom:26} {str(ogirlik):<6} {izoh}")

    print("\nBelgilar tekshiruvi (asosiy shriftlar):")
    for nom, yetmayapti in belgilarniTekshir():
        if nom.startswith("NotoSansMath"):
            continue
        if yetmayapti:
            print(f"  ⚠ {nom}: {' '.join(yetmayapti)}  → zaxira shriftdan olinadi")
