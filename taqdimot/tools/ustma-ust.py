"""PDF sahifalarida ustma-ust tushgan matnlarni topish.

NEGA KERAK. Slaydda matn ustma-ust tushishi hech qanday xato bermaydi:
dvigatel ishlaydi, PDF yasaladi, hatto 200 ham qaytaradi. Faqat
proyektorda ko'zga tashlanadi. Ko'z bilan har 25 sahifani tekshirish
esa ishonchsiz — shuning uchun bu ish o'lchovga aylantirildi.

USUL. PDF ichidagi har bir harf o'z qutisiga (bounding box) ega.
Qutilar qatorlarga guruhlanadi, keyin BOSHQA qatorlarga tegib
ketganlari qidiriladi. Ya'ni qoida: ikki matn qatori kesishsa —
joylashuv xato.

ISHLATISH:
    python3 tools/ustma-ust.py chiqish/sirt-hodisalari-neon.pdf
    python3 tools/ustma-ust.py chiqish/*.pdf --jimgina
"""

import argparse
import ctypes
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from pypdfium2 import PdfDocument, raw  # noqa: E402


def belgilarniOl(sahifa):
    """Sahifadagi har bir ko'rinadigan belgini qutisi bilan qaytaradi."""
    tp = sahifa.get_textpage()
    natija = []
    for i in range(tp.count_chars()):
        try:
            quti = tp.get_charbox(i)
            belgi = tp.get_text_range(i, 1)
        except Exception:
            continue
        if not belgi.strip():
            continue
        natija.append({"belgi": belgi, "quti": quti})
    return natija


def rasmQutilari(sahifa):
    """Sahifadagi rasm obyektlarining qutilari.

    NEGA PDFIUM'ning PASTKI API'si: yuqori darajadagi `get_objects()`
    bu versiyada joylashuvni bermaydi. pdfium C funksiyalari orqali
    esa har bir obyektning chegarasini olish mumkin.
    """
    pr = sahifa.raw
    natija = []
    l, b, r, t = (ctypes.c_float() for _ in range(4))
    for i in range(raw.FPDFPage_CountObjects(pr)):
        obyekt = raw.FPDFPage_GetObject(pr, i)
        if raw.FPDFPageObj_GetType(obyekt) != 3:  # 3 = rasm
            continue
        if raw.FPDFPageObj_GetBounds(obyekt, ctypes.byref(l), ctypes.byref(b),
                                     ctypes.byref(r), ctypes.byref(t)):
            natija.append((l.value, b.value, r.value, t.value))
    return natija


def kesishish(a, b):
    """Ikki to'rtburchak kesishish yuzasi (nuqtada)."""
    l, r = max(a[0], b[0]), min(a[2], b[2])
    bo, t = max(a[1], b[1]), min(a[3], b[3])
    if r <= l or t <= bo:
        return 0.0
    return (r - l) * (t - bo)


def yuzasi(quti):
    return max(0.0, quti[2] - quti[0]) * max(0.0, quti[3] - quti[1])


def tekshir(pdf, chegara=0.35):
    """Belgilar darajasida to'qnashuvlarni topadi.

    NEGA QATORLAR EMAS, BELGILAR. Avval qatorlarni guruhlab tekshirish
    yozilgan edi — u ishlamadi: 300pt katta raqam ("01") atrofidagi
    barcha matnni "yutib yuborardi" (guruhlash bag'rikengligi eng katta
    belgi balandligidan olinadi). Belgilar darajasida esa hech narsa
    yo'qolmaydi va to'qnashuv aniq ko'rinadi.
    """
    doc = PdfDocument(pdf)
    muammolar = []
    for sahifaRaqami in range(len(doc)):
        sahifa = doc[sahifaRaqami]
        belgilar = belgilarniOl(sahifa)

        # Rasm ustiga tushgan matn: bu ham xato — formula kartasi matnni
        # bosib qolsa, matn ko'rinmay qoladi.
        for quti in rasmQutilari(sahifa):
            # Kartaning ichidagi formula o'z nomi bilan yozilgan
            # yorliqni o'z ichiga oladi — chegara ataylab kichraytirilgan
            ichki = (quti[0] + 2, quti[1] + 2, quti[2] - 2, quti[3] - 2)
            for belgi in belgilar:
                if kesishish(ichki, belgi["quti"]) / max(0.01, yuzasi(belgi["quti"])) > 0.55:
                    muammolar.append({
                        "sahifa": sahifaRaqami + 1, "ulush": 1.0,
                        "a": f"rasm", "aq": tuple(round(v, 0) for v in quti),
                        "b": belgi["belgi"], "bq": tuple(round(v, 1) for v in belgi["quti"]),
                        "izoh": "rasm matn ustida",
                    })

        # Faqat kesishishi mumkin bo'lganlarni solishtiramiz
        for i in range(len(belgilar)):
            qi = belgilar[i]["quti"]
            for j in range(i + 1, len(belgilar)):
                qj = belgilar[j]["quti"]
                if qj[0] >= qi[2] or qj[2] <= qi[0] or qj[1] >= qi[3] or qj[3] <= qi[1]:
                    continue
                # Bir qatordagi belgilar (bir asos chizig'ida) tabiiy
                # yonma-yon turadi: qiyshiq "/" ning qutisi qo'shnisining
                # qutisiga kirib ketadi, lekin siyoh tegmaydi. Haqiqiy
                # to'qnashuv esa HAR XIL qatorlar orasida bo'ladi.
                if abs(qi[1] - qj[1]) < 3:
                    continue
                yuza = kesishish(qi, qj)
                if yuza <= 0:
                    continue
                kichik = min(yuzasi(qi), yuzasi(qj))
                if kichik <= 0:
                    continue
                ulush = yuza / kichik
                if ulush >= chegara:
                    muammolar.append({
                        "sahifa": sahifaRaqami + 1,
                        "ulush": round(ulush, 2),
                        "a": belgilar[i]["belgi"], "aq": tuple(round(v, 1) for v in qi),
                        "b": belgilar[j]["belgi"], "bq": tuple(round(v, 1) for v in qj),
                    })
    return muammolar


def guruhla(muammolar):
    """Bir joydagi qo'shni to'qnashuvlarni bitta xabarga yig'adi."""
    natija = []
    ishlatilgan = [False] * len(muammolar)
    tartib = sorted(range(len(muammolar)), key=lambda i: (muammolar[i]["sahifa"], -muammolar[i]["aq"][1]))
    for i in tartib:
        if ishlatilgan[i]:
            continue
        m = muammolar[i]
        guruh = [m]
        ishlatilgan[i] = True
        for j in tartib:
            if ishlatilgan[j] or muammolar[j]["sahifa"] != m["sahifa"]:
                continue
            n = muammolar[j]
            if abs(n["aq"][0] - m["aq"][0]) < 60 and abs(n["aq"][1] - m["aq"][1]) < 14:
                guruh.append(n)
                ishlatilgan[j] = True
        eng = max(guruh, key=lambda g: g["ulush"])
        natija.append({
            "sahifa": m["sahifa"], "soni": len(guruh), "ulush": eng["ulush"],
            "a": f"{eng['a']} @{eng['aq'][0]:.0f},{eng['aq'][1]:.0f}",
            "b": f"{eng['b']} @{eng['bq'][0]:.0f},{eng['bq'][1]:.0f}",
        })
    return sorted(natija, key=lambda x: x["sahifa"])


def main():
    ap = argparse.ArgumentParser(description="Ustma-ust tushgan matnni topish")
    ap.add_argument("pdf", nargs="+")
    ap.add_argument("--chegara", type=float, default=0.35,
                    help="kesishish ulushi (0-1), shundan yuqorisi xabar qilinadi")
    ap.add_argument("--jimgina", action="store_true", help="faqat xulosa")
    args = ap.parse_args()

    jami = 0
    for pdf in args.pdf:
        topilgan = tekshir(pdf, args.chegara)
        jami += len(topilgan)
        nom = os.path.basename(pdf)
        if not topilgan:
            print(f"✅ {nom}: ustma-ust tushish yo'q")
            continue
        topilgan = guruhla(topilgan)
        sahifalar = sorted({m["sahifa"] for m in topilgan})
        print(f"❌ {nom}: {len(topilgan)} ta to'qnashuv, {len(sahifalar)} sahifada")
        if args.jimgina:
            print(f"   sahifalar: {', '.join(map(str, sahifalar))}")
            continue
        for m in topilgan:
            print(f"   {m['sahifa']:2d}-sahifa ({m['soni']} ta belgi, {m['ulush']:.0%}): "
                  f"«{m['a']}» ↔ «{m['b']}»")
    return 1 if jami else 0


if __name__ == "__main__":
    sys.exit(main())
