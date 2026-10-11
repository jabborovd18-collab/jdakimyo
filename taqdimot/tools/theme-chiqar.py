"""Mavzu (tema) sozlamalarini JSON'ga chiqarish.

NEGA KERAK: PDF dvigateli Python'da (`render.py`), PPTX chiqaruvchi esa
Node'da (`pptx-yasa.mjs`). Ikkalasi bir xil rangni ishlatishi shart —
aks holda bitta taqdimotning ikki nusxasi har xil ko'rinadi va qaysi
biri "to'g'ri" ekanini keyin aniqlab bo'lmaydi. Shuning uchun rang
FAQAT `theme.py` da yoziladi, bu skript uni JSON ko'rinishida beradi.

ISHLATISH:
    python3 tools/theme-chiqar.py          # kontent/theme.json yasaydi
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "pylib"))

from theme import MAVZULAR, SAHIFA, SHRIFT_PROFILLARI, SHRIFT_SUKUT, SHRIFTLAR  # noqa: E402

ILDIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHIQISH = os.path.join(ILDIZ, "kontent", "theme.json")

# PPTX va PDF shriftlarni bir xil nom bilan chaqirishi kerak. Manba
# fayllardagi nomlar ("Inter-Regular.ttf") PowerPoint'ga tanish emas —
# u oila nomini biladi.
OILA_NOMLARI = {
    "matn": "Inter",
    "matn-o": "Inter",
    "matn-yarim": "Inter SemiBold",
    "matn-q": "Inter Bold",
    "matn-j": "Inter ExtraBold",
    "sarlavha": "Manrope SemiBold",
    "sarlavha-q": "Manrope",
    "sarlavha-j": "Manrope ExtraBold",
    "serif": "Playfair Display",
    "serif-q": "Playfair Display Bold",
    "belgi": "Noto Sans Math",
}


# Times profili uchun PowerPoint oila nomlari.
#
# NEGA "Times New Roman", "Tinos" emas: PDF da Tinos ishlatiladi, chunki
# u Times New Roman bilan metrik mos OCHIQ shrift (Monotype metrikasi) —
# ya'ni Times litsenziyasi kerak emas, natija esa bir xil. PowerPoint'da
# esa Times New Roman HAQIQIY o'rnatilgan bo'ladi (Windows, macOS, Office
# bilan keladi), shuning uchun PPTX'da foydalanuvchi so'ragan nomning
# o'zi yoziladi.
#
# "belgi" roli ham Times: ⇌ ∠ kabi belgilar Times'da yo'q, lekin
# PowerPoint yetishmagan glifni o'zi zaxira shriftdan oladi (PDF
# dvigatelida bunday imkon yo'q edi — shuning uchun u yerda Noto Sans
# Math kerak bo'ldi).
TIMES_OILALARI = {kalit: "Times New Roman" for kalit, qiymat in SHRIFTLAR.items()
                  if isinstance(qiymat, str) and qiymat.endswith(".ttf")}

PROFIL_OILALARI = {"zamonaviy": OILA_NOMLARI, "times": TIMES_OILALARI}


def main():
    malumot = {
        "sahifa": {"keng": SAHIFA[0], "baland": SAHIFA[1]},
        "shriftlar": SHRIFTLAR,
        "oilalar": OILA_NOMLARI,
        # Profillar: Node tomoni `--shrift times` bilan shu yerdan oila
        # nomini va o'lcham koeffitsiyentini oladi. Shu tufayli PDF va
        # PPTX bir xil shriftda chiqadi.
        "profillar": {
            kalit: {
                "nom": profil["nom"],
                "koeff": profil["olcham-koeff"],
                "oilalar": PROFIL_OILALARI.get(kalit, OILA_NOMLARI),
            }
            for kalit, profil in SHRIFT_PROFILLARI.items()
        },
        "shrift-sukut": SHRIFT_SUKUT,
        "mavzular": MAVZULAR,
    }
    os.makedirs(os.path.dirname(CHIQISH), exist_ok=True)
    with open(CHIQISH, "w", encoding="utf-8") as f:
        json.dump(malumot, f, ensure_ascii=False, indent=1)

    print(f"✅ {len(MAVZULAR)} mavzu, {len(SHRIFT_PROFILLARI)} shrift profili -> {CHIQISH}")
    for kalit, m in MAVZULAR.items():
        print(f"   {kalit:6} {m['nom']:12} fon {m['fon'][0]} → {m['fon'][1]}, urg'u {m['urgu']}")


if __name__ == "__main__":
    main()
