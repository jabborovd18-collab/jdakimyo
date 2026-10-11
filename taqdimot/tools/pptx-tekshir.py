"""PPTX geometriyasini tekshirish.

NEGA KERAK: bu muhitda PowerPoint yo'q, ya'ni slaydni ko'z bilan
ko'rib bo'lmaydi. "Kod xato bermadi" dalil emas — matn qutisi
sahifadan chiqib ketishi, ikki matn ustma-ust tushishi yoki rasm
matnni bosishi mumkin va fayl baribir ochiladi.

Shuning uchun tekshiruv FAQAT faylning o'zidan o'qiydi (XML):
  · har bir shakl slayd chegarasi ichidami
  · matn qutilari bir-birining ustiga tushib qolmaganmi
  · rasm matnni bosib qolmaganmi
  · kontentdagi barcha rasm slaydga tushganmi

ISHLATISH:
    python3 tools/pptx-tekshir.py chiqish/sirt-hodisalari-siyoh.pptx
"""

import argparse
import importlib.util
import json
import os
import sys

# `pptx-oqi.py` nomida chiziqcha bor — oddiy `import` ishlamaydi,
# shuning uchun modul yo'l bo'yicha yuklanadi.
_yoL = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pptx-oqi.py")
_spec = importlib.util.spec_from_file_location("pptx_oqi", _yoL)
_pptx_oqi = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_pptx_oqi)


def pptx_oqi(yoli):
    return _pptx_oqi.main(yoli)

# 16:9 slayd o'lchami (pptxgenjs defineLayout 13.333 x 7.5 dyuym)
SAHIFA_KENG_SM = 33.87
SAHIFA_BALAND_SM = 19.05
CHEKKA_TOLERANS = 0.15   # o'lchov xatosi uchun (sm)

# Ustma-ust tushish maydoni shu chegaradan kichik bo'lsa — e'tiborsiz
# (masalan, bir qatorning matni ikkinchi qatorning yonida turadi).
USTMA_UST_CHEGARA = 0.25  # sm²


def togridan(t):
    return {"x": t["x"], "y": t["y"], "w": t["w"], "h": t["h"]}


def kesishma(a, b):
    """Ikki to'rtburchak kesishgan maydoni (sm²)."""
    x1 = max(a["x"], b["x"])
    y1 = max(a["y"], b["y"])
    x2 = min(a["x"] + a["w"], b["x"] + b["w"])
    y2 = min(a["y"] + a["h"], b["y"] + b["h"])
    if x2 <= x1 or y2 <= y1:
        return 0.0
    return (x2 - x1) * (y2 - y1)


def matnli(shakl):
    if shakl["tur"] == "picture":
        return False
    return any("".join(r["matn"] for r in blok).strip() for blok in shakl["matn"])


def matniniOl(shakl):
    return " ".join(
        "".join(r["matn"] for r in blok).strip()
        for blok in shakl["matn"]
        if "".join(r["matn"] for r in blok).strip()
    )


def tekshir(pptx_yoli, kontent_yoli=None):
    slaydlar = pptx_oqi(pptx_yoli)
    muammolar = []
    statistika = {"slaydlar": len(slaydlar), "matn": 0, "rasm": 0, "karta": 0}

    for i, slayd in enumerate(slaydlar, 1):
        matnlar, rasmlar, boshqa = [], [], []
        for sh in slayd["shakllar"]:
            if sh["joy"] is None:
                continue
            joy = togridan(sh["joy"])
            if matnli(sh):
                matnlar.append((joy, matniniOl(sh)))
            else:
                # Matnsiz shakl: karta, chiziq, romb, doira
                boshqa.append(joy)

        for r in slayd["rasmlar"]:
            if r["x"] is None:
                continue
            rasmlar.append(togridan(r))

        statistika["matn"] += len(matnlar)
        statistika["rasm"] += len(rasmlar)
        statistika["karta"] += len(boshqa)

        # 1. Chegara ichidami
        for joy, matn in matnlar + [(r, "<rasm>") for r in rasmlar]:
            if (joy["x"] < -CHEKKA_TOLERANS or joy["y"] < -CHEKKA_TOLERANS
                    or joy["x"] + joy["w"] > SAHIFA_KENG_SM + CHEKKA_TOLERANS
                    or joy["y"] + joy["h"] > SAHIFA_BALAND_SM + CHEKKA_TOLERANS):
                muammolar.append(
                    f"{i}-slayd: chegara tashqarisida — «{matn[:46]}» "
                    f"({joy['x']:.1f},{joy['y']:.1f} {joy['w']:.1f}×{joy['h']:.1f})")

        # 2. Matn-matn ustma-ust
        for a in range(len(matnlar)):
            for b in range(a + 1, len(matnlar)):
                kes = kesishma(matnlar[a][0], matnlar[b][0])
                if kes > USTMA_UST_CHEGARA:
                    muammolar.append(
                        f"{i}-slayd: matnlar ustma-ust ({kes:.2f} sm²) — "
                        f"«{matnlar[a][1][:32]}» × «{matnlar[b][1][:32]}»")

        # 3. To'ldirilgan shakl matnga TEGIB qolishi.
        # NEGA "TEGIB": karta ustidagi matn ataylab karta ichida turadi —
        # katta kesishma normal holat. Xato esa INGICHKA kesishma:
        # yorliqning pasti keyingi kartaning ustiga tushganda shunday
        # bo'ladi (aynan shu holat birinchi sinovda ko'zdan qochgan edi).
        toldirilgan = [
            (joy, sh) for joy, sh in zip(boshqa, [x for x in slayd["shakllar"]
             if not matnli(x) and x["joy"] is not None])
            if (sh.get("korinish") or {}).get("to")
            and (sh.get("korinish") or {}).get("geom") in ("roundRect", "rect", "ellipse")
            and joy["w"] * joy["h"] > 1.0
        ]
        for joy, sh in toldirilgan:
            for matnJoy, matn in matnlar:
                kes = kesishma(joy, matnJoy)
                if 0.02 < kes < 0.9:
                    muammolar.append(
                        f"{i}-slayd: matn shaklga tegib qolgan ({kes:.2f} sm²) — "
                        f"«{matn[:40]}»")

        # 4. Rasm matnni bosishi (fon rasmi — butun slayd — hisobga olinmaydi)
        for r in rasmlar:
            if r["w"] > SAHIFA_KENG_SM * 0.9:
                continue
            for joy, matn in matnlar:
                kes = kesishma(r, joy)
                if kes > USTMA_UST_CHEGARA:
                    muammolar.append(
                        f"{i}-slayd: rasm matnni bosgan ({kes:.2f} sm²) — «{matn[:40]}»")

    return statistika, muammolar


def main():
    ap = argparse.ArgumentParser(description="PPTX geometriyasini tekshirish")
    ap.add_argument("pptx")
    ap.add_argument("--kontent", default=None, help="kontent JSON (rasm sonini solishtirish)")
    args = ap.parse_args()

    statistika, muammolar = tekshir(args.pptx, args.kontent)
    print(f"📊 {os.path.basename(args.pptx)}")
    print(f"   slayd: {statistika['slaydlar']} · matn qutisi: {statistika['matn']} · "
          f"rasm: {statistika['rasm']} · boshqa shakl: {statistika['karta']}")

    if args.kontent and os.path.exists(args.kontent):
        with open(args.kontent, encoding="utf-8") as f:
            kontent = json.load(f)
        kutilgan = sum(len(s.get("rasmlar") or []) for s in kontent["slaydlar"])
        izohli = sum(1 for s in kontent["slaydlar"] for r in (s.get("rasmlar") or []) if r.get("izoh"))
        print(f"   kontentda: {kutilgan} rasm ({izohli} ta izohli)")
        # Slayd foni alohida `p:bg` elementi bo'lib yoziladi, `p:pic`
        # shakli emas — shuning uchun bu yerda faqat kontent rasmlari.
        if kutilgan != statistika["rasm"]:
            print(f"   ⚠ rasm soni mos emas: kutilgan {kutilgan}, topilgan {statistika['rasm']}")
        else:
            print("   ✓ barcha rasm slaydlarga tushgan")

    if muammolar:
        print(f"\n❌ {len(muammolar)} nuqson:")
        for m in muammolar[:40]:
            print("   ·", m)
        return 1

    print("\n✅ Geometriya toza: chegara, ustma-ust tushish va bosish yo'q.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
