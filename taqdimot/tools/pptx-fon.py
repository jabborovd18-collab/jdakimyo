"""PPTX uchun fon rasmini yasash.

NEGA RASM, RANG EMAS: pptxgenjs gradient fonni qo'llab-quvvatlamaydi
(faqat tekis rang). Agar PPTX ga oddiy to'q rang qo'yilsa, u PDF dagi
gradient fonga o'xshamay qolardi va bitta taqdimotning ikki nusxasi
har xil ko'rinardi.

Yechim: fon PDF dvigatelining O'ZIDAN yasaladi (mazmunsiz "fon" slaydi),
keyin rasmga aylantiriladi va PPTX'ga to'liq o'lchamda qo'yiladi. Ya'ni
PPTX foni — PDF fonining aynan o'zi, taxminiy nusxasi emas.

ISHLATISH:
    python3 tools/pptx-fon.py            # uchala mavzu uchun
    python3 tools/pptx-fon.py --mavzu siyoh
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from pypdfium2 import PdfDocument  # noqa: E402

ILDIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ILDIZ, "tools")
CHIQISH = os.path.join(ILDIZ, "chiqish", "fonlar")

# Fon rasmining o'lchami: 16:9 slayd to'liq ekranda ko'rsatilganda
# yetarli aniqlik. Kattaroq qilish PPTX hajmini bekorga oshiradi.
KENG_PIKSEL = 1920


def fonYasa(mavzu, chiqish_papka):
    os.makedirs(chiqish_papka, exist_ok=True)
    with tempfile.TemporaryDirectory() as vaqt:
        kontent = os.path.join(vaqt, "fon.json")
        pdf = os.path.join(vaqt, "fon.pdf")
        with open(kontent, "w", encoding="utf-8") as f:
            json.dump({"meta": {"mavzu": "fon"}, "slaydlar": [{"tur": "fon"}]}, f)

        subprocess.run(
            [sys.executable, os.path.join(TOOLS, "render.py"), kontent,
             "-o", pdf, "--mavzu", mavzu],
            check=True, capture_output=True, text=True,
        )

        doc = PdfDocument(pdf)
        page = doc[0]
        rasm = page.render(scale=KENG_PIKSEL / page.get_width()).to_pil().convert("RGB")
        yol = os.path.join(chiqish_papka, f"fon-{mavzu}.png")
        rasm.save(yol, optimize=True)
        return yol, rasm.size


def main():
    ap = argparse.ArgumentParser(description="PPTX uchun fon rasmlari")
    ap.add_argument("--mavzu", default=None, help="bitta mavzu (sukut: hammasi)")
    args = ap.parse_args()

    if args.mavzu:
        mavzular = [args.mavzu]
    else:
        import json as _json
        with open(os.path.join(ILDIZ, "kontent", "theme.json"), encoding="utf-8") as f:
            mavzular = list(_json.load(f)["mavzular"].keys())

    for mavzu in mavzular:
        yol, olcham = fonYasa(mavzu, CHIQISH)
        hajm = os.path.getsize(yol) // 1024
        print(f"✅ {mavzu:6} -> {os.path.relpath(yol, ILDIZ)}  {olcham[0]}×{olcham[1]}  {hajm} KB")


if __name__ == "__main__":
    main()
