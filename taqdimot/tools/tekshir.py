"""To'qnashuv tekshiruvi: slayddagi yozuvlar ustma-ust tushganini topadi.

NEGA KERAK. "Yozuvlar ustma-ust tushgan" shikoyatini ko'z bilan
tekshirib bo'lmaydi: 25 slaydning bittasida bir juft satr ustma-ust
tushsa, uni faqat o'sha sahifani kattalashtirib qaraganda ko'rasiz —
va baribir bir marta o'tkazib yuborasiz. Bu asbob esa chizish
jarayonida har bir matnning chegarasini yozib olib, ularni
matematik solishtiradi.

ISHLATISH:
    python3 tools/tekshir.py kontent/taqdimot.json --mavzu neon
    python3 tools/tekshir.py kontent/taqdimot.json --mavzu siyoh --batafsil
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import render  # noqa: E402


def kesishma(a, b):
    """Ikki to'rtburchak kesishmasining yuzasi va o'lchamlari."""
    x1 = max(a["x"], b["x"])
    y1 = max(a["y"], b["y"])
    x2 = min(a["x"] + a["w"], b["x"] + b["w"])
    y2 = min(a["y"] + a["h"], b["y"] + b["h"])
    if x2 <= x1 or y2 <= y1:
        return 0, 0, 0
    return (x2 - x1) * (y2 - y1), x2 - x1, y2 - y1


def tekshir(manba, mavzu=None, batafsil=False, ogirlik=0.10, shrift=None):
    """Har bir sahifadagi to'qnashuvlarni topadi.

    `ogirlik` — qancha yuzadan kichik kesishma e'tiborsiz qoldiriladi
    (kichikroq kesishmalar odatda shrift metrikasining tabiiy
     qo'shniligi: qatorlar bir-biriga tegib turadi).
    """
    with open(manba, encoding="utf-8") as f:
        kontent = json.load(f)

    with open(manba, encoding="utf-8") as f2:
        oila = shrift or json.load(f2).get("meta", {}).get("shrift")
    render.shriftlarniYukla(oila)
    papka = os.path.dirname(os.path.abspath(manba))
    taqdimot = render.Taqdimot(kontent.get("meta"), mavzu, papka)
    vaqtinchalik = os.path.join("/tmp", "tekshir.pdf")
    taqdimot.yasa(kontent.get("slaydlar") or [], vaqtinchalik)

    qutilar = [q for q in render.qutilarniOl() if q["tur"] in ("matn", "rasm")]
    sahifalar = {}
    for q in qutilar:
        sahifalar.setdefault(q["sahifa"], []).append(q)

    muammolar = []
    for sahifa, royxat in sorted(sahifalar.items()):
        royxat.sort(key=lambda q: -q["y"])
        for i in range(len(royxat)):
            for j in range(i + 1, len(royxat)):
                a, b = royxat[i], royxat[j]
                yuza, kx, ky = kesishma(a, b)
                if yuza <= 0:
                    continue
                kichik = min(a["w"] * a["h"], b["w"] * b["h"])
                if kichik <= 0:
                    continue
                ulush = yuza / kichik
                if ulush < ogirlik:
                    continue
                # Ustma-ust tushish faqat gorizontal kesishuvda muhim:
                # vertikal "kesishuv" odatda qatorlar zichligi.
                if kx < 3:
                    continue
                muammolar.append({
                    "sahifa": sahifa, "a": a, "b": b, "ulush": ulush,
                    "kx": kx, "ky": ky, "yuza": yuza,
                })

    return muammolar, len(sahifalar)


def asosiy():
    ap = argparse.ArgumentParser(description="Slaydlardagi to'qnashuvlarni topish")
    ap.add_argument("manba")
    ap.add_argument("--mavzu", default=None)
    ap.add_argument("--ogirlik", type=float, default=0.10)
    ap.add_argument("--batafsil", action="store_true")
    ap.add_argument("--shrift", default=None, help="zamonaviy | times")
    args = ap.parse_args()

    muammolar, jami = tekshir(args.manba, args.mavzu, args.batafsil, args.ogirlik, args.shrift)

    print(f"Sahifalar: {jami} | to'qnashuvlar: {len(muammolar)}")
    if not muammolar:
        print("✅ Ustma-ust tushgan yozuv yo'q.")
        return 0

    for m in muammolar:
        print(f"\n  ⚠ {m['sahifa']}-slayd — kesishma {m['kx']:.0f}×{m['ky']:.0f} pt "
              f"({m['ulush'] * 100:.0f}% kichigining yuzasi)")
        for kalit, q in (("A", m["a"]), ("B", m["b"])):
            print(f"     {kalit} [{q['tur']}] «{q['matn']}»")
            print(f"        x={q['x']:.0f}..{q['x'] + q['w']:.0f} "
                  f"y={q['y']:.0f}..{q['y'] + q['h']:.0f} shrift={q['shrift']}")
    return 1


if __name__ == "__main__":
    sys.exit(asosiy())
