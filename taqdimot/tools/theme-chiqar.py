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

from theme import MAVZULAR, SAHIFA, SHRIFTLAR  # noqa: E402

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


def main():
    malumot = {
        "sahifa": {"keng": SAHIFA[0], "baland": SAHIFA[1]},
        "shriftlar": SHRIFTLAR,
        "oilalar": OILA_NOMLARI,
        "mavzular": MAVZULAR,
    }
    os.makedirs(os.path.dirname(CHIQISH), exist_ok=True)
    with open(CHIQISH, "w", encoding="utf-8") as f:
        json.dump(malumot, f, ensure_ascii=False, indent=1)

    print(f"✅ {len(MAVZULAR)} mavzu -> {CHIQISH}")
    for kalit, m in MAVZULAR.items():
        print(f"   {kalit:6} {m['nom']:12} fon {m['fon'][0]} → {m['fon'][1]}, urg'u {m['urgu']}")


if __name__ == "__main__":
    main()
