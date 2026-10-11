"""Slayd dvigateli: JSON tavsif -> vektor PDF.

NEGA JSON. Mazmun (matn) va ko'rinish (dizayn) ajratilgan. Har yangi
taqdimotda uslub noldan yasalmasligi uchun mazmun JSON da yoziladi,
dizayn esa shu faylda qoladi.

ISHLATISH:
    python3 tools/render.py kontent/taqdimot.json -o chiqish/taqdimot.pdf
    python3 tools/render.py kontent/taqdimot.json --mavzu neon

SLAYD TURLARI:
    muqova · reja · bolim · mavzu · kartochka · matn · raqam · ikki ·
    sitata · yakun
"""

import argparse
import json
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as pdfcanvas

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from theme import (  # noqa: E402
    BAND_OLCHAM,
    BAND_QATOR,
    CHEKKA,
    MAVZU_SUKUT,
    PAST,
    SAHIFA,
    YUQORI,
    ZAXIRA_SHRIFTLAR,
    mavzuOl,
    rang,
    sarlavhaOlchami as sarlavhaOlchamiXom,
    shriftProfili,
)

KENG, BALAND = SAHIFA
ILDIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHRIFT_PAPKA = os.path.join(ILDIZ, "shriftlar")

# Shriftda yo'q belgini almashtirish jadvali. Manrope'da o'zbek lotin
# apostrofi (U+02BB) yo'q — o'rniga tipografik apostrof qo'yiladi,
# farq ko'zga tashlanmaydi, "kvadrat" esa darhol tashlanadi.
ALMASHTIRISH = {0x02BB: "\u2019", 0x02BC: "\u2019", 0x2032: "\u2019", 0x2093: "x"}

_ogohlantirishlar = []
_shrift_korpus = {}
_KOEFF = 1.0          # joriy shrift profilining o'lcham koeffitsiyenti
PROFIL = "times"


def _o(olcham):
    """O'lchamga profil koeffitsiyentini qo'llaydi.

    QOIDA: barcha funksiyalar XOM o'lcham qabul qiladi, koeffitsiyent
    esa faqat matn ibtidoiy funksiyalarida (yoz, matnKengligi, ...)
    qo'llanadi. Joylashuv hisobida kerak bo'lsa shu yordamchi
    chaqiriladi — shunda o'lchash va chizish hech qachon ajralib
    qolmaydi (aks holda matn ustma-ust tushardi).
    """
    return olcham * _KOEFF


def sarlavhaOlchami(matn, muqova=False):
    """Sarlavha o'lchami (profil koeffitsiyenti bilan)."""
    return _o(sarlavhaOlchamiXom(matn, muqova=muqova))


def satrBalandligi(olcham, k):
    """Bir qator matn egallaydigan vertikal balandlik."""
    return _o(olcham) * k


# ─── Shriftlar ──────────────────────────────────────────────────────

def shriftlarniYukla(profil="times"):
    """Shrift profilini yuklaydi va o'lcham koeffitsiyentini o'rnatadi."""
    global _KOEFF, PROFIL
    PROFIL = (profil or "times").strip().lower()
    tanlangan = shriftProfili(PROFIL)
    _KOEFF = float(tanlangan.get("olcham-koeff", 1.0))
    for kalit, fayl in tanlangan.items():
        if kalit in ("nom", "olcham-koeff"):
            continue
        yol = os.path.join(SHRIFT_PAPKA, fayl)
        if not os.path.exists(yol):
            raise SystemExit(f"Shrift topilmadi: {yol}\nAvval `python3 tools/fontlar.py` ishlating.")
        pdfmetrics.registerFont(TTFont(kalit, yol))
        from fontTools.ttLib import TTFont as FT
        _shrift_korpus[kalit] = set(FT(yol).getBestCmap().keys())


def shriftTaqsimi(matn, asosiy):
    """Matnni (bo'lak, shrift) juftliklariga bo'ladi.

    NEGA KERAK: bitta shriftda hamma belgi bo'lmaydi. Inter'da ∠ va ⇌
    yo'q, Playfair'da indeks raqamlari yo'q. Ilgari bunday belgi jimgina
    yo'qolar edi — endi u zaxira shriftdan (Noto Sans Math) olinadi.
    """
    bolaklar = []
    for belgi in str(matn):
        kod = ord(belgi)
        tanlangan = asosiy
        if kod not in _shrift_korpus.get(asosiy, ()):
            tanlangan = None
            for zaxira in ZAXIRA_SHRIFTLAR:
                if kod in _shrift_korpus.get(zaxira, ()):
                    tanlangan = zaxira
                    break
            if tanlangan is None:
                almashtirilgan = ALMASHTIRISH.get(kod)
                if almashtirilgan and ord(almashtirilgan) in _shrift_korpus.get(asosiy, ()):
                    belgi, tanlangan = almashtirilgan, asosiy
                elif belgi.strip() and belgi != "\n":
                    _ogohlantirishlar.append(
                        f"«{belgi}» ({hex(kod)}) — hech bir shriftda yo'q, olib tashlandi"
                    )
                    continue
                else:
                    tanlangan = asosiy
        if bolaklar and bolaklar[-1][1] == tanlangan:
            bolaklar[-1][0] += belgi
        else:
            bolaklar.append([belgi, tanlangan])
    return [(b, sh) for b, sh in bolaklar]


def matnKengligi(matn, shrift, olcham, tracking=0):
    """Matn kengligi — zaxira shriftga o'tishni hisobga olgan holda."""
    olcham = _o(olcham)
    keng = 0
    for bolak, shr in shriftTaqsimi(matn, shrift):
        keng += pdfmetrics.stringWidth(bolak, shr, olcham) + tracking * len(bolak)
    return keng


def qatorlargaBol(matn, shrift, olcham, kenglik):
    natija = []
    for xom in str(matn).split("\n"):
        sozlar = xom.split()
        if not sozlar:
            natija.append("")
            continue
        qator = sozlar[0]
        for soz in sozlar[1:]:
            sinov = f"{qator} {soz}"
            if matnKengligi(sinov, shrift, olcham) <= kenglik:
                qator = sinov
            else:
                natija.append(qator)
                qator = soz
        natija.append(qator)
    return natija


def matnBalandligi(matn, shrift, olcham, kenglik, qatorOraliq=1.45):
    """Matn egallaydigan vertikal balandlik.

    NEGA KERAK: slaydlar "yuqoridan pastga" chizilsa, matn tepada
    to'planib pastda katta bo'shliq qoladi. Balandlikni oldin bilib
    olsak, blokni maydonga taqsimlab qo'yish mumkin.
    """
    return len(qatorlargaBol(matn, shrift, olcham, kenglik)) * _o(olcham) * qatorOraliq


def ogohlantirishlarniOl():
    return list(dict.fromkeys(_ogohlantirishlar))


# ─── Chizish yordamchilari ──────────────────────────────────────────

def yoz(c, x, y, matn, shrift, olcham, rangQiymat, tracking=0, alpha=1):
    """Bitta qator matn. `tracking` — harflar orasi."""
    olcham = _o(olcham)
    c.saveState()
    if alpha != 1:
        c.setFillAlpha(alpha)
    c.setFillColor(rang(rangQiymat))
    joriy = x
    for bolak, shr in shriftTaqsimi(matn, shrift):
        c.setFont(shr, olcham)
        if tracking:
            for belgi in bolak:
                c.drawString(joriy, y, belgi)
                joriy += pdfmetrics.stringWidth(belgi, shr, olcham) + tracking
        else:
            c.drawString(joriy, y, bolak)
            joriy += pdfmetrics.stringWidth(bolak, shr, olcham)
    c.restoreState()
    return str(matn)


def matnBloki(c, x, y, matn, shrift, olcham, rangQiymat, kenglik, qatorOraliq=1.45,
              alpha=1, tracking=0, markazdan=False):
    """Ko'p qatorli matn. YANGI y qiymatini qaytaradi."""
    for qator in qatorlargaBol(matn, shrift, olcham, kenglik):
        if markazdan:
            keng = matnKengligi(qator, shrift, olcham, tracking)
            yoz(c, x - keng / 2, y, qator, shrift, olcham, rangQiymat, tracking, alpha)
        else:
            yoz(c, x, y, qator, shrift, olcham, rangQiymat, tracking, alpha)
        y -= olcham * qatorOraliq
    return y


def boyitmaBloki(c, x, y, runs, olcham, kenglik, qatorOraliq=1.5, alpha=1):
    """Aralash uslubdagi abzats: boshida qalin "lead", keyin oddiy matn.

    NEGA SO'Z BO'YICHA: abzatsning birinchi iborasi boshqa rang va
    shriftda. Butun abzatsni bitta shriftda o'lchash mumkin emas —
    aks holda qatorlar kenglikdan chiqib ketadi yoki juda erta
    bo'linadi. Shuning uchun so'zlar o'z uslubi bilan saqlanadi.
    """
    olcham = _o(olcham)
    sozlar = []
    for matn, shrift, rangQiymat in runs:
        for i, soz in enumerate(str(matn).split(" ")):
            if soz:
                sozlar.append((soz, shrift, rangQiymat))

    qatorlar, joriy, keng = [], [], 0.0
    for soz, shrift, rangQiymat in sozlar:
        w = matnKengligi(soz, shrift, olcham)
        bosh = matnKengligi(" ", shrift, olcham) if joriy else 0
        if joriy and keng + bosh + w > kenglik:
            qatorlar.append(joriy)
            joriy, keng = [], 0.0
            bosh = 0
        joriy.append((soz, shrift, rangQiymat))
        keng += bosh + w
    if joriy:
        qatorlar.append(joriy)

    c.saveState()
    if alpha != 1:
        c.setFillAlpha(alpha)
    for qator in qatorlar:
        kurs = x
        for i, (soz, shrift, rangQiymat) in enumerate(qator):
            if i:
                kurs += pdfmetrics.stringWidth(" ", shrift, olcham)
            yoz(c, kurs, y, soz, shrift, olcham, rangQiymat)
            kurs += matnKengligi(soz, shrift, olcham)
        y -= olcham * qatorOraliq
    c.restoreState()
    return y


def boyitmaBalandligi(runs, olcham, kenglik, qatorOraliq=1.5):
    """Aralash abzats balandligi — matnBloki bilan bir xil qoidalar."""
    olcham = _o(olcham)
    sozlar = []
    for matn, shrift, _ in runs:
        for soz in str(matn).split(" "):
            if soz:
                sozlar.append((soz, shrift))
    qatorlar, joriy, keng = 0, 0, 0.0
    for soz, shrift in sozlar:
        w = matnKengligi(soz, shrift, olcham)
        bosh = matnKengligi(" ", shrift, olcham) if joriy else 0
        if joriy and keng + bosh + w > kenglik:
            qatorlar += 1
            joriy, keng, bosh = 0, 0.0, 0
        joriy += 1
        keng += bosh + w
    if joriy:
        qatorlar += 1
    return max(1, qatorlar) * olcham * qatorOraliq


def yorliqOraligi(olcham):
    """Kichik yorliqdan keyin sarlavha uchun kerakli vertikal oraliq.

    NEGA HISOBLANADI, QAT'IY EMAS: yorliq 12pt, sarlavha esa 74pt
    bo'lishi mumkin. Qat'iy 46pt siljishda sarlavha harflarining
    yuqori qismi (ascender ≈ 0,73 em) yorliqning ustiga chiqib,
    matnlar ustma-ust tushadi — bu PDF'da xato bermaydi, faqat
    proyektorda ko'rinadi. Oraliq shuning uchun sarlavha o'lchamidan
    hisoblanadi.
    """
    return olcham * 0.78 + 8


def rangAralash(hex1, hex2, t):
    a, b = hex1.lstrip("#"), hex2.lstrip("#")
    qismlar = []
    for i in range(0, 6, 2):
        v1, v2 = int(a[i:i + 2], 16), int(b[i:i + 2], 16)
        qismlar.append(f"{round(v1 + (v2 - v1) * t):02X}")
    return "#" + "".join(qismlar)


def gradient(c, x, y, keng, baland, ranglar, burchak=45, radius=0):
    c.saveState()
    yol = c.beginPath()
    if radius:
        yol.roundRect(x, y, keng, baland, radius)
    else:
        yol.rect(x, y, keng, baland)
    c.clipPath(yol, stroke=0, fill=0)
    rad = math.radians(burchak)
    ox, oy = x + keng / 2, y + baland / 2
    yarim = max(keng, baland) / 2
    c.linearGradient(
        ox - math.cos(rad) * yarim, oy - math.sin(rad) * yarim,
        ox + math.cos(rad) * yarim, oy + math.sin(rad) * yarim,
        [rang(r) for r in ranglar],
    )
    c.restoreState()


def nur(c, x, y, radius, rangQiymat, alpha=0.08, qatlam=44):
    """Yumshoq nur dog'i.

    NEGA 44 QATLAM: reportlab'da blur yo'q; radial gradient esa
    chekkasini fon rangiga qotirib qo'yadi va fon boshqa rang bo'lsa
    chegara ko'rinadi. Bir xil rangdagi ko'p qatlamli shaffof doiralar
    esa chekkada nolga tushadi — chegara butunlay yo'qoladi.
    """
    c.saveState()
    c.setFillColor(rang(rangQiymat))
    for i in range(qatlam, 0, -1):
        nisbat = i / qatlam
        c.setFillAlpha(min(0.9, alpha * 3.2 * (1 - nisbat) ** 2.4 / qatlam))
        c.circle(x, y, radius * nisbat, stroke=0, fill=1)
    c.restoreState()


def ingichka(c, x1, y1, x2, y2, rangQiymat, qalinlik=0.7, alpha=1):
    c.saveState()
    c.setStrokeColor(rang(rangQiymat))
    c.setLineWidth(qalinlik)
    if alpha != 1:
        c.setStrokeAlpha(alpha)
    c.line(x1, y1, x2, y2)
    c.restoreState()


def yumaloqKarta(c, x, y, keng, baland, mavzu, alpha=1, radius=18, chegara=True, toRang=None):
    c.saveState()
    if alpha != 1:
        c.setFillAlpha(alpha)
    c.setFillColor(rang(toRang or mavzu["yuza"]))
    c.roundRect(x, y, keng, baland, radius, stroke=0, fill=1)
    c.restoreState()
    if chegara:
        c.saveState()
        c.setStrokeColor(rang(mavzu["yuza-chiziq"]))
        c.setLineWidth(0.9)
        c.roundRect(x, y, keng, baland, radius, stroke=1, fill=0)
        c.restoreState()


_rasm_kesh = {}
_kesilgan_papka = None


def rasmMalumoti(yol):
    """Rasmning o'lchami va foni yorqinligi (0-255)."""
    if yol in _rasm_kesh:
        return _rasm_kesh[yol]
    try:
        from PIL import Image
        with Image.open(yol) as im:
            olcham = im.size
            kichik = im.convert("L").resize((24, 16))
            baytlar = kichik.tobytes()
            yorqinlik = sum(baytlar) / len(baytlar)
    except Exception:
        olcham, yorqinlik = None, 255
    _rasm_kesh[yol] = (olcham, yorqinlik)
    return _rasm_kesh[yol]


def rasmOlchami(yol):
    """Rasmning haqiqiy o'lchami (nuqtada) — nisbatni saqlash uchun."""
    return rasmMalumoti(yol)[0]


def kesilganNusxa(yol, nisbat):
    """Rasmni kerakli nisbatga o'rtasidan kesib, vaqtinchalik fayl qaytaradi.

    NEGA KERAK. Karta to'lishi uchun rasmni "kattaroq qilib, chetini
    qirqish" mumkin — lekin bunda PDF obyektining qutisi kartadan
    katta qoladi. Hamma ko'rish dasturlari buni qirqib ko'rsatadi,
    ammo to'qnashuvni tekshiruvchi asbob ham, ba'zi eksport vositalari
    ham kartadan tashqaridagi qismni "bor" deb hisoblaydi. Shuning
    uchun rasm oldindan haqiqiy (pikselda) kesiladi: quti = karta.
    """
    if nisbat <= 0:
        return yol
    global _kesilgan_papka
    if _kesilgan_papka is None:
        _kesilgan_papka = os.path.join(ILDIZ, "chiqish", ".rasm-kesh")
    os.makedirs(_kesilgan_papka, exist_ok=True)
    nom = f"{hash((yol, round(nisbat, 3))) & 0xFFFFFFFF:08x}.jpg"
    chiqish = os.path.join(_kesilgan_papka, nom)
    if os.path.exists(chiqish):
        return chiqish
    try:
        from PIL import Image
        with Image.open(yol) as im:
            im = im.convert("RGB")
            w, h = im.size
            joriy = w / h
            if joriy > nisbat:          # juda keng -> yon tomonini kesamiz
                yangiW = int(round(h * nisbat))
                chap = (w - yangiW) // 2
                im = im.crop((chap, 0, chap + yangiW, h))
            else:                        # juda baland -> yuqori/pastini kesamiz
                yangiH = int(round(w / nisbat))
                tepa = (h - yangiH) // 2
                im = im.crop((0, tepa, w, tepa + yangiH))
            im.save(chiqish, "JPEG", quality=92)
        return chiqish
    except Exception:
        return yol


def rasmToqmi(yol):
    """Rasm foni to'qmi?

    NEGA KERAK: taqdimotda ikki xil rasm bor — oq fonda tayyorlangan
    formula/grafiklar (LaTeX, matplotlib) va to'q fonda yasalgan
    illyustratsiyalar. Formulaga oq karta kerak (to'q fonda ular
    "teshik" bo'lib ko'rinadi), illyustratsiya esa oq kartaga solinsa
    xunuk chiqadi — atrofida oq hoshiya paydo bo'ladi. Fon yorqinligi
    bo'yicha o'zi aniqlanadi.
    """
    return rasmMalumoti(yol)[1] < 128


# ─── Taqdimot ───────────────────────────────────────────────────────

class Taqdimot:
    def __init__(self, meta, mavzu_kalit=None, kontent_papka="."):
        self.meta = meta or {}
        self.mavzu = mavzuOl(mavzu_kalit or self.meta.get("mavzu_kalit"))
        self.kontent_papka = kontent_papka
        self.c = None
        self.raqam = 0
        self.jami = 0

    # — umumiy —
    def yoq(self, yol):
        """Rasm yo'lini kontent papkasiga nisbatan yechadi."""
        if os.path.isabs(yol):
            return yol
        return os.path.join(self.kontent_papka, yol)

    def fonniYoz(self):
        c, m = self.c, self.mavzu
        # Uch nuqtali diagonal gradient: ikki nuqtalisi "plastik"
        # ko'rinadi, uchtasi hajm beradi.
        gradient(c, 0, 0, KENG, BALAND, [m["fon"][0], m["fon-burchak"][0], m["fon"][1]], burchak=32)
        kuch = m["lak-kuch"]
        nur(c, KENG * 0.10, BALAND * 1.04, 520, m["yorug-lak"][0], alpha=kuch * 0.95)
        nur(c, KENG * 0.94, BALAND * 0.02, 460, m["yorug-lak"][1], alpha=kuch * 0.75)

    def ramka(self, korsat=True):
        """Ingichka ramka: yuqoridagi urg'u chizig'i va pastdagi kolontitul."""
        c, m = self.c, self.mavzu
        ingichka(c, CHEKKA, BALAND - 46, CHEKKA + 96, BALAND - 46, m["urgu"], 2.4)
        ingichka(c, CHEKKA + 96, BALAND - 46, KENG - CHEKKA, BALAND - 46, m["chiziq"], 0.8, 0.85)

        kolontitul = str(self.meta.get("kolontitul") or self.meta.get("mavzu") or "").upper()
        if kolontitul:
            yoz(c, CHEKKA, PAST - 20, kolontitul, "matn-o", 11.5, m["xira-2"], tracking=1.6, alpha=0.9)
        yoz(c, KENG - CHEKKA - 6, PAST - 20, f"{self.raqam:02d}", "matn-yarim", 12, m["xira-2"],
            tracking=1.2, alpha=0.9)

        # Pastdagi chiziq — taqdimotning qancha qismi o'tganini ko'rsatadi.
        yol = KENG - CHEKKA * 2
        ingichka(c, CHEKKA, PAST - 4, KENG - CHEKKA, PAST - 4, m["chiziq"], 1.1, 0.55)
        if self.jami:
            nisbat = min(1.0, self.raqam / self.jami)
            uch = CHEKKA + yol * nisbat
            ingichka(c, CHEKKA, PAST - 4, uch, PAST - 4, m["urgu"], 1.6, 0.95)
            c.saveState()
            c.setFillColor(rang(m["urgu"]))
            c.circle(uch, PAST - 4, 2.4, stroke=0, fill=1)
            c.restoreState()

    def kichikYorliq(self, x, y, matn, rangQiymat=None, alpha=1):
        m = self.mavzu
        yoz(self.c, x, y, str(matn).upper(), "matn-yarim", 12.5,
            rangQiymat or m.get("yorliq-rang") or m["urgu"], tracking=2.6, alpha=alpha)

    def sarlavhaBloki(self, sarlavha, kichik=None, kenglik=None, y=None, muqova=False):
        c, m = self.c, self.mavzu
        kenglik = kenglik or (KENG - CHEKKA * 2)
        y = y if y is not None else BALAND - YUQORI - 96
        olcham = sarlavhaOlchami(sarlavha, muqova=muqova)
        if kichik:
            self.kichikYorliq(CHEKKA, y, kichik)
            y -= yorliqOraligi(olcham)
        for qator in qatorlargaBol(sarlavha, "sarlavha-j", olcham, kenglik):
            yoz(c, CHEKKA, y, qator, "sarlavha-j", olcham, m["matn"])
            y -= satrBalandligi(olcham, 1.18)
        return y - 12

    # ── Rasm kartasi va ustuni ──
    def rasmKartasi(self, x, y, keng, baland, yol, izoh=None):
        """Rasmni oq yumaloq karta ichida chizadi.

        NEGA OQ KARTA: taqdimotdagi diagramma va formulalar oq fonda
        tayyorlangan (LaTeX va matplotlib). To'q mavzuda ular ramkasiz
        "teshik" bo'lib ko'rinadi; oq karta esa ularni ataylab
        joylashtirilgan "formula taxtasi"ga aylantiradi.
        """
        c, m = self.c, self.mavzu
        toqRasm = rasmToqmi(yol)
        # To'q rasm — oq karta chizilmaydi (atrofida oq hoshiya
        # qolmasligi uchun). Oq rasm — karta chiziladi.
        if toqRasm:
            c.saveState()
            for i, kuch in enumerate((0.10, 0.08, 0.06)):
                c.setFillColor(rang("#000000"))
                c.setFillAlpha(kuch)
                c.roundRect(x - i, y - 3 - i, keng + 2 * i, baland + 2 * i, 12 + i, stroke=0, fill=1)
            c.restoreState()

        # Soya: oq mavzuda oq karta oq fonda ko'rinmay qolardi. Yumshoq
        # soya kartani ko'tarib, ikkala mavzuda ham "sahifa ustidagi
        # qog'oz" taassurotini beradi.
        for i, kuch in enumerate((0.06, 0.05, 0.04)):
            c.saveState()
            c.setFillColor(rang("#000000"))
            c.setFillAlpha(kuch if m["toqmi"] else kuch * 1.6)
            c.roundRect(x - i, y - 3 - i, keng + 2 * i, baland + 2 * i, 12 + i, stroke=0, fill=1)
            c.restoreState()
        if not toqRasm:
            c.saveState()
            c.setFillColor(rang(m["karta-oq"]))
            c.roundRect(x, y, keng, baland, 12, stroke=0, fill=1)
            c.restoreState()

        # Ramka: oq rasmda — karta chegarasi, to'q rasmda — urg'u
        # rangidagi ingichka kontur (rasmni fondan ajratib turadi).
        c.saveState()
        if toqRasm:
            c.setStrokeColor(rang(m["urgu"]))
            c.setStrokeAlpha(0.45)
            c.setLineWidth(1.1)
        else:
            c.setStrokeColor(rang(m["yuza-chiziq"]))
            c.setLineWidth(0.8 if m["toqmi"] else 1.2)
        c.roundRect(x, y, keng, baland, 12, stroke=1, fill=0)
        c.restoreState()

        from reportlab.lib.utils import ImageReader
        if os.path.exists(yol):
            self.c.saveState()
            yolu = self.c.beginPath()
            yolu.roundRect(x, y, keng, baland, 12)
            self.c.clipPath(yolu, stroke=0, fill=0)
            if toqRasm:
                # Illyustratsiya kartani to'liq qoplaydi: rasm piksel
                # darajasida kesiladi, shuning uchun qutisi kartaga teng.
                kesilgan = kesilganNusxa(yol, keng / baland)
                self.c.drawImage(ImageReader(kesilgan), x, y, keng, baland, mask="auto")
            else:
                img = ImageReader(yol)
                iw, ih = img.getSize()
                nisbat = min((keng - 16) / iw, (baland - 12) / ih)
                w, h = iw * nisbat, ih * nisbat
                self.c.drawImage(img, x + (keng - w) / 2, y + (baland - h) / 2, w, h, mask="auto")
            self.c.restoreState()

    def rasmUstuni(self, rasmlar, x, y, kenglik, balandlik):
        """Rasmlar ustuni: balandliklar mazmunga qarab taqsimlanadi.

        NEGA DINAMIK: formulalar (keng va past) bilan grafiklar (kvadrat)
        bir ustunda aralash keladi. Qat'iy balandlik berilsa biri
        cho'zilib, ikkinchisi siqilib qolardi.

        NEGA IZOH JOYI ALOHIDA HISOBLANADI: izoh yorlig'i kartaning
        USTIDA turadi. U band qilinmasa, yuqoridagi karta yorliqning
        ustiga chiqib, matn yarim ko'rinmay qoladi (birinchi sinovda
        aynan shunday bo'ldi).
        """
        c, m = self.c, self.mavzu
        IZOH_JOY = 24  # izoh yorlig'i uchun ajratilgan balandlik
        ora = 14

        olchovlar = []
        for r in rasmlar:
            yol = self.yoq(r["fayl"])
            olcham = rasmOlchami(yol) or (1000, 500)
            h = kenglik * olcham[1] / olcham[0]
            olchovlar.append((yol, h, r.get("izoh")))

        jamiKerak = sum(h + (IZOH_JOY if izoh else 0) for _, h, izoh in olchovlar)
        jamiKerak += ora * max(0, len(olchovlar) - 1)

        koeffitsiyent = 1.0
        if jamiKerak > balandlik:
            # Grafiklar kichraytiriladi; izoh joyi esa kichraytirilmaydi
            izohlar = sum(IZOH_JOY for _, _, izoh in olchovlar if izoh)
            mavjudRasm = balandlik - izohlar - ora * max(0, len(olchovlar) - 1)
            koeffitsiyent = max(0.42, mavjudRasm / max(1, sum(h for _, h, _ in olchovlar)))
        elif jamiKerak > 0:
            izohlar = sum(IZOH_JOY for _, _, izoh in olchovlar if izoh)
            mavjudRasm = balandlik - izohlar - ora * max(0, len(olchovlar) - 1)
            koeffitsiyent = min(1.5, mavjudRasm / max(1, sum(h for _, h, _ in olchovlar)))

        kurs = y + balandlik
        for yol, h, izoh in olchovlar:
            if izoh:
                # Yorliq aniq o'qilishi kerak: u "bu rasm nima haqida"
                # degan savolga javob beradi. Xira kichik matn esa
                # proyektorda butunlay yo'qoladi.
                yoz(c, x + 2, kurs - 15, izoh, "matn-yarim", 13.5, m["matn"], tracking=0.2, alpha=0.88)
                ingichka(c, x, kurs - 7.5, x + 20, kurs - 7.5, m["urgu"], 2.2)
                kurs -= IZOH_JOY
            hh = h * koeffitsiyent
            kurs -= hh
            self.rasmKartasi(x, kurs, kenglik, hh, yol)
            kurs -= ora

    # ── Slayd turlari ──
    def muqova(self, s):
        c, m = self.c, self.mavzu
        gradient(c, 0, 0, KENG, BALAND, [m["fon"][0], m["fon-burchak"][0], m["fon"][1]], burchak=38)
        nur(c, KENG * 0.82, BALAND * 0.72, 520, m["urgu"], alpha=m["lak-kuch"] * 3.4)
        nur(c, KENG * 0.14, BALAND * 0.16, 560, m["urgu-2"], alpha=m["lak-kuch"] * 2.2)

        # Rasm bo'lmasa — dekorativ halqalar; rasm bo'lsa — o'ngda
        # katta illyustratsiya (muqova "jurnal muqovasi" ko'rinishini
        # oladi va mavzuni bir qarashda ko'rsatadi).
        rasmBormi = bool(s.get("illustratsiya"))
        if not rasmBormi:
            c.saveState()
            c.setStrokeColor(rang(m["urgu"]))
            c.setStrokeAlpha(0.35)
            c.setLineWidth(1.1)
            c.circle(KENG - 132, BALAND - 128, 62, stroke=1, fill=0)
            c.setStrokeAlpha(0.16)
            c.circle(KENG - 132, BALAND - 128, 92, stroke=1, fill=0)
            c.restoreState()

        if rasmBormi:
            yol = self.yoq(s["illustratsiya"]["fayl"])
            kengR = KENG * 0.38
            balandR = kengR * 0.585
            xR = KENG - CHEKKA - kengR
            yR = PAST + 132
            c.saveState()
            c.setFillColor(rang("#000000"))
            c.setFillAlpha(0.22)
            c.roundRect(xR - 4, yR - 6, kengR + 8, balandR + 8, 20, stroke=0, fill=1)
            c.restoreState()
            c.saveState()
            yolu = c.beginPath()
            yolu.roundRect(xR, yR, kengR, balandR, 16)
            c.clipPath(yolu, stroke=0, fill=0)
            from reportlab.lib.utils import ImageReader
            if os.path.exists(yol):
                img = ImageReader(yol)
                iw, ih = img.getSize()
                nisbat = max(kengR / iw, balandR / ih)
                w, h = iw * nisbat, ih * nisbat
                c.drawImage(img, xR + (kengR - w) / 2, yR + (balandR - h) / 2, w, h, mask="auto")
            c.restoreState()
            if s["illustratsiya"].get("izoh"):
                yoz(c, xR, yR - 20, s["illustratsiya"]["izoh"], "matn", 13, m["xira"], alpha=0.9)

        y = BALAND - YUQORI - 40
        olcham = sarlavhaOlchami(s["sarlavha"], True)
        if s.get("yorliq"):
            self.kichikYorliq(CHEKKA, y, s["yorliq"])
            y -= yorliqOraligi(olcham)
        else:
            y -= 20

        # Matn kengligi rasmning chap chegarasidan hisoblanadi: foizda
        # olingan kenglik rasm ustuniga kirib ketardi (sinovda aynan
        # shunday bo'ldi — muqova ostidagi izoh rasmni bosgan).
        sarlavhaKeng = ((KENG - CHEKKA - KENG * 0.38 - 26 - CHEKKA)
                        if rasmBormi else (KENG - CHEKKA * 2))
        for qator in qatorlargaBol(s["sarlavha"], "sarlavha-j", olcham, sarlavhaKeng):
            yoz(c, CHEKKA, y, qator, "sarlavha-j", olcham, m["matn"])
            y -= satrBalandligi(olcham, 1.12)

        y -= 6
        ingichka(c, CHEKKA, y, CHEKKA + 132, y, m["urgu"], 3)
        y -= 40
        if s.get("kichik"):
            y = matnBloki(c, CHEKKA, y, s["kichik"], "matn", 20, m["xira"],
                          sarlavhaKeng if rasmBormi else KENG - CHEKKA * 2 - 120, 1.4)

        past = PAST + 40
        ingichka(c, CHEKKA, past + 46, KENG - CHEKKA, past + 46, m["chiziq"], 0.8, 0.6)
        chap = " · ".join(x for x in (str(self.meta.get("muallif") or ""),
                                      str(self.meta.get("tashkilot") or "")) if x)
        if chap:
            yoz(c, CHEKKA, past, chap, "matn-yarim", 15.5, m["matn"], alpha=0.95)
        sana = str(self.meta.get("sana") or "")
        if sana:
            yoz(c, KENG - CHEKKA - matnKengligi(sana, "matn", 15.5), past, sana, "matn", 15.5, m["xira"])

    def reja(self, s):
        """Mavzu rejasi — agenda.

        NEGA IKKI USTUN: uzun reja bir ustunda sahifaning yarmini
        bo'sh qoldirardi. Ikki ustun matnni teng taqsimlaydi va
        tomoshabin rejani bir qarashda qamrab oladi.
        """
        c, m = self.c, self.mavzu
        self.fonniYoz()
        y = self.sarlavhaBloki(s["sarlavha"], s.get("kichik"))
        bandlar = s.get("bandlar") or []
        oraliq = 46
        keng = (KENG - CHEKKA * 2 - oraliq) / 2
        yarim = (len(bandlar) + 1) // 2
        ustunlar = [bandlar[:yarim], bandlar[yarim:]]
        pastki = PAST + 44
        mavjud = y - pastki

        for u, ustun in enumerate(ustunlar):
            if not ustun:
                continue
            x = CHEKKA + u * (keng + oraliq)
            olchamlar = [matnBalandligi(b, "matn", 19, keng - 46, 1.45) for b in ustun]
            jami = sum(olchamlar)
            bosh = max(0, mavjud - jami)
            qadam = bosh / max(1, len(ustun)) if len(ustun) > 1 else 0
            kurs = y - 8
            for i, band in enumerate(ustun):
                raqam = u * yarim + i + 1
                yoz(c, x, kurs, f"{raqam:02d}", "serif-q", 19, m["urgu"], alpha=0.95)
                kurs = matnBloki(c, x + 40, kurs, band, "matn", 19, m["matn"], keng - 46, 1.45)
                kurs -= min(20, qadam)
        self.ramka()

    def bolim(self, s):
        """Bo'lim ajratgichi — o'ngda katta raqam, chapda sarlavha."""
        c, m = self.c, self.mavzu
        self.fonniYoz()

        raqam = str(s.get("raqam") or f"{self.raqam:02d}")
        olcham = 300 if len(raqam) <= 2 else 220
        keng_ = matnKengligi(raqam, "serif-q", olcham)
        x_ = KENG - CHEKKA - keng_ + 46
        yoz(c, x_, BALAND * 0.5 - olcham * 0.34, raqam, "serif-q", olcham, m["urgu"], alpha=0.14)
        ingichka(c, KENG - CHEKKA - keng_ * 0.94, BALAND * 0.5 - olcham * 0.42,
                 KENG - CHEKKA + 20, BALAND * 0.5 - olcham * 0.42, m["urgu"], 1.2, 0.35)

        kenglik = KENG * 0.52
        y = BALAND * 0.5 + 96
        if s.get("yorliq"):
            self.kichikYorliq(CHEKKA, y, s["yorliq"])
            y -= yorliqOraligi(62)
        for qator in qatorlargaBol(s["sarlavha"], "sarlavha-j", 62, kenglik):
            yoz(c, CHEKKA, y, qator, "sarlavha-j", 62, m["matn"])
            y -= satrBalandligi(62, 1.19)
        ingichka(c, CHEKKA, y - 4, CHEKKA + 108, y - 4, m["urgu"], 3)
        if s.get("izoh"):
            matnBloki(c, CHEKKA, y - 50, s["izoh"], "matn", 24, m["xira"], kenglik, 1.45)
        self.ramka()

    def mavzu(self, s):
        """Mazmun slaydi: chapda matn bloklari, o'ngda formula/grafiklar.

        NEGA SHU TARTIB: mavzu slaydida har doim 3-4 ta ilmiy fikr va
        ularga tegishli formula yoki grafik bo'ladi. Matn chapda
        (o'qish yo'nalishi), tasdiq o'ngda — ko'z "fikr → dalil"
        ketma-ketligida harakatlanadi.
        """
        c, m = self.c, self.mavzu
        self.fonniYoz()

        # Illustratsiya — mavzuni ko'rsatib beruvchi katta rasm. U
        # ustunning BOSHIDA turadi, formulalar esa ostida: ko'z avval
        # "nima haqida" ekanini ko'radi, keyin "qanday hisoblanadi".
        rasmlar = list(s.get("rasmlar") or [])
        if s.get("illustratsiya"):
            rasmlar = [s["illustratsiya"]] + rasmlar
        kengMatn = (KENG - CHEKKA * 2) * (0.52 if rasmlar else 1.0)
        kengRasm = (KENG - CHEKKA * 2) * 0.44
        xRasm = KENG - CHEKKA - kengRasm

        # — sarlavha —
        y = BALAND - YUQORI - 84
        if s.get("bolim"):
            self.kichikYorliq(CHEKKA, y, s["bolim"])
            y -= yorliqOraligi(sarlavhaOlchami(s["sarlavha"]))
        raqam = s.get("raqam")
        sarlavha = s["sarlavha"]
        if raqam is not None:
            raqamMatn = f"{raqam:02d}" if isinstance(raqam, int) else str(raqam)
            kengRaqam = matnKengligi(raqamMatn, "serif-q", 40) + 16
            yoz(c, CHEKKA, y - 2, raqamMatn, "serif-q", 40, m["urgu"])
            sarlavhaKeng = kengMatn - kengRaqam
            olcham = sarlavhaOlchami(sarlavha)
            kurs = y
            for qator in qatorlargaBol(sarlavha, "sarlavha-j", olcham, sarlavhaKeng):
                yoz(c, CHEKKA + kengRaqam, kurs, qator, "sarlavha-j", olcham, m["matn"])
                kurs -= satrBalandligi(olcham, 1.16)
            y = kurs - 6
        else:
            olcham = sarlavhaOlchami(sarlavha)
            for qator in qatorlargaBol(sarlavha, "sarlavha-j", olcham, kengMatn):
                yoz(c, CHEKKA, y, qator, "sarlavha-j", olcham, m["matn"])
                y -= satrBalandligi(olcham, 1.16)
            y -= 6
        ingichka(c, CHEKKA, y - 6, CHEKKA + 96, y - 6, m["urgu"], 2.6)
        y -= 34

        # — matn bloklari —
        # Matn maydoni kolontitul chizig'idan (PAST - 4) 18pt yuqorida
        # tugaydi: matn hech qachon kolontitulga tegmaydi.
        pastki = PAST + 14
        bloklar = s.get("bandlar") or []
        runs = []
        for b in bloklar:
            if isinstance(b, str):
                runs.append([(b, "matn", m["matn"])])
            else:
                runs.append([
                    (b.get("bosh", ""), "matn-yarim", m["urgu"]),
                    (": " if b.get("bosh") and b.get("matn") else "", "matn-yarim", m["urgu"]),
                    (b.get("matn", ""), "matn", m["matn"]),
                ])

        # Joy yetmasa matn kichraytiriladi: aks holda oxirgi blok
        # pastdagi kolontitul ustiga tushib qolardi (sinovda shunday
        # bo'ldi — matn "ko'ndalang" so'zidan keyin kesilgan edi).
        mavjud = y - pastki
        # Zanjir oxirigacha boradi: 4 ta uzun blokli slaydlarda 14pt
        # yetmasligi mumkin edi (Times profilida aynan shunday bo'ldi —
        # matn kolontitul ustiga tushdi).
        for olchamMatn in (19, 18, 17, 16, 15, 14, 13, 12.5, 12, 11.5):
            olchamlangan = [boyitmaBalandligi(r, olchamMatn, kengMatn - 22, 1.5) for r in runs]
            jami = sum(olchamlangan)
            if jami + 5 * max(0, len(runs) - 1) <= mavjud or olchamMatn <= 11.5:
                break
        qadam = max(5, min(24, (mavjud - jami) / max(1, len(runs) - 1))) if len(runs) > 1 else 0
        kurs = y - max(0, min(16, (mavjud - jami - qadam * max(0, len(runs) - 1)) * 0.35))
        for r in runs:
            c.saveState()
            c.setFillColor(rang(m["urgu-2"]))
            c.saveState()
            c.translate(CHEKKA + 4, kurs + olchamMatn * 0.36)
            c.rotate(45)
            c.rect(-3.2, -3.2, 6.4, 6.4, stroke=0, fill=1)
            c.restoreState()
            c.restoreState()
            kurs = boyitmaBloki(c, CHEKKA + 22, kurs, r, olchamMatn, kengMatn - 22, 1.5)
            kurs -= qadam

        # — o'ngdagi formula va grafiklar —
        if rasmlar:
            # Ustun sarlavha zonasidan boshlanadi: yorliq qatori ham
            # hisobga olinadi, aks holda birinchi karta sarlavhaga tegadi.
            tepa = BALAND - YUQORI - 96 - (34 if s.get("bolim") else 0)
            self.rasmUstuni(rasmlar, xRasm, PAST + 38, kengRasm, tepa - (PAST + 38))

        self.ramka()

    def matn(self, s):
        c, m = self.c, self.mavzu
        self.fonniYoz()
        y = self.sarlavhaBloki(s["sarlavha"], s.get("kichik"))
        bandlar = s.get("bandlar") or []
        kenglik = KENG - CHEKKA * 2 - (420 if s.get("rasm") else 0)

        pastki = PAST + (56 if s.get("izoh") else 40)
        maydon = y - pastki
        olchamlangan = [matnBalandligi(b, "matn", BAND_OLCHAM, kenglik, BAND_QATOR) for b in bandlar]
        izohBaland = matnBalandligi(s["izoh"], "matn", 19, kenglik, 1.45) + 18 if s.get("izoh") else 0
        bosh = max(0, maydon - (sum(olchamlangan) + izohBaland))
        y -= min(26, bosh * 0.25)
        oraliq = min(30, (bosh - min(26, bosh * 0.25)) / max(1, len(bandlar) - 1)) if len(bandlar) > 1 else 0

        for band in bandlar:
            c.saveState()
            c.setFillColor(rang(m["urgu"]))
            c.setFillAlpha(0.95)
            c.saveState()
            c.translate(CHEKKA + 5, y + 8)
            c.rotate(45)
            c.rect(-4, -4, 8, 8, stroke=0, fill=1)
            c.restoreState()
            c.restoreState()
            yangi = matnBloki(c, CHEKKA + 34, y, band, "matn", BAND_OLCHAM, m["matn"], kenglik, BAND_QATOR)
            y = yangi - _o(BAND_OLCHAM) * 0.55 - oraliq
        if s.get("izoh"):
            matnBloki(c, CHEKKA, max(y - 12, PAST + 34), s["izoh"], "matn", 19, m["xira"], kenglik, 1.45)
        if s.get("rasm"):
            self.rasmKartasi(KENG - CHEKKA - 380, PAST + 60, 380, 340, self.yoq(s["rasm"]))
        self.ramka()

    def kartochka(self, s):
        """2–4 ta kartochka.

        NEGA MATN O'LCHAMI PASAYADI. Uzun matnli 4 ta karta qat'iy
        balandlikda sarlavhani bosib ketardi (birinchi sinovda shunday
        bo'ldi). Endi avval eng yirik shrift bilan kerakli balandlik
        o'lchanadi; joy yetmasa shrift bir pog'ona kichraytiriladi va
        qayta o'lchanadi. Shunda karta hech qachon sarlavhaga tegmaydi.
        """
        c, m = self.c, self.mavzu
        self.fonniYoz()
        y = self.sarlavhaBloki(s["sarlavha"], s.get("kichik"))
        kartalar = s.get("kartalar") or []
        soni = max(1, len(kartalar))
        oraliq = 22
        keng = (KENG - CHEKKA * 2 - oraliq * (soni - 1)) / soni
        past = PAST + 42
        mavjud = y - past - 14

        def kerakli(olchamSarlavha, olchamMatn, olchamBelgi):
            h = 46 + (olchamBelgi + 8 if any(k.get("belgi") for k in kartalar) else 0)
            for k in kartalar:
                h2 = matnBalandligi(k.get("sarlavha", ""), "sarlavha-q", olchamSarlavha, keng - 48, 1.25) + 10
                h2 += matnBalandligi(k.get("matn", ""), "matn", olchamMatn, keng - 48, 1.5)
                h = max(h, h2 + 46 + (olchamBelgi + 8 if k.get("belgi") else 0))
            return h

        # Pog'onali kichraytirish: matn sig'adigan eng yirik o'lcham tanlanadi
        for olchamSarlavha, olchamMatn, olchamBelgi in ((23, 17.5, 30), (21, 16.5, 27), (19.5, 15.5, 25), (18, 14.5, 23)):
            baland = kerakli(olchamSarlavha, olchamMatn, olchamBelgi)
            if baland <= mavjud or olchamMatn <= 14.5:
                break
        baland = min(baland, mavjud)
        past = past + max(0, (mavjud - baland) * 0.30)

        for i, karta in enumerate(kartalar):
            x = CHEKKA + i * (keng + oraliq)
            yumaloqKarta(c, x, past, keng, baland, m)
            c.saveState()
            c.setStrokeColor(rang(m["urgu"] if i % 2 == 0 else m["urgu-2"]))
            c.setLineWidth(3)
            c.setStrokeAlpha(0.95)
            c.line(x + 24, past + baland - 26, x + 24 + 42, past + baland - 26)
            c.restoreState()

            yy = past + baland - 66
            if karta.get("belgi"):
                yoz(c, x + 24, yy, str(karta["belgi"]), "sarlavha-j", olchamBelgi, m["urgu"], alpha=0.9)
                yy -= _o(olchamBelgi) + 8
            yy = matnBloki(c, x + 24, yy, karta.get("sarlavha", ""), "sarlavha-q", olchamSarlavha,
                           m["matn"], keng - 48, 1.25)
            yy -= 9
            matnBloki(c, x + 24, yy, karta.get("matn", ""), "matn", olchamMatn, m["xira"], keng - 48, 1.5)
        self.ramka()

    def raqam(self, s):
        c, m = self.c, self.mavzu
        self.fonniYoz()
        y = self.sarlavhaBloki(s["sarlavha"], s.get("kichik"))
        raqamlar = s.get("raqamlar") or []
        soni = max(1, len(raqamlar))
        oraliq = 30
        keng = (KENG - CHEKKA * 2 - oraliq * (soni - 1)) / soni

        def kerakli(r):
            return 46 + 76 * 0.78 + 40 + matnBalandligi(r.get("izoh", ""), "matn", 19, keng - 52, 1.45)

        kartaBaland = max(BALAND * 0.3, min(BALAND * 0.56, max(kerakli(r) for r in raqamlar) + 58))
        asos = PAST + (58 if s.get("izoh") else 44) + max(0, (y - PAST - kartaBaland - 44) * 0.3)
        for i, r in enumerate(raqamlar):
            x = CHEKKA + i * (keng + oraliq)
            yumaloqKarta(c, x, asos, keng, kartaBaland, m, alpha=0.75)
            c.saveState()
            c.setStrokeColor(rang(m["urgu"] if i % 2 == 0 else m["urgu-2"]))
            c.setLineWidth(3)
            c.setStrokeAlpha(0.95)
            c.line(x + 26, asos + kartaBaland - 30, x + 26 + 46, asos + kartaBaland - 30)
            c.restoreState()
            olcham = 76 if len(str(r.get("qiymat", ""))) <= 5 else 56
            tepa = asos + kartaBaland - 46
            asosiy = tepa - _o(olcham) * 0.78
            yoz(c, x + 26, asosiy, str(r.get("qiymat", "")), "serif-q", olcham, m["urgu"])
            if r.get("birlik"):
                yoz(c, x + 26 + matnKengligi(str(r["qiymat"]), "serif-q", olcham) + 8,
                    asosiy, str(r["birlik"]), "matn-o", 22, m["urgu"], alpha=0.85)
            matnBloki(c, x + 26, asosiy - 40, r.get("izoh", ""), "matn", 19, m["xira"], keng - 52, 1.45)
        if s.get("izoh"):
            matnBloki(c, CHEKKA, PAST + 12, s["izoh"], "matn", 18.5, m["xira-2"], KENG - CHEKKA * 2, 1.45)
        self.ramka()

    def ikki(self, s):
        c, m = self.c, self.mavzu
        self.fonniYoz()
        y = self.sarlavhaBloki(s["sarlavha"], s.get("kichik"))
        oraliq = 34
        keng = (KENG - CHEKKA * 2 - oraliq) / 2

        def ustunBalandligi(tomon):
            h = 0
            if tomon.get("sarlavha"):
                h += matnBalandligi(tomon["sarlavha"], "sarlavha-q", 24, keng, 1.25) + 12
            for band in tomon.get("bandlar") or []:
                h += matnBalandligi(band, "matn", 19.5, keng - 24, 1.5) + 8
            if tomon.get("matn"):
                h += matnBalandligi(tomon["matn"], "matn", 18, keng, 1.5) + 6
            return h

        chap, ong = s.get("chap") or {}, s.get("ong") or {}
        surish = max(0, (y + 10 - (PAST + 40) - max(ustunBalandligi(chap), ustunBalandligi(ong))) * 0.35)
        for i, tomon in enumerate((chap, ong)):
            x = CHEKKA + i * (keng + oraliq)
            if i == 1:
                ingichka(c, x - oraliq / 2, PAST + 40, x - oraliq / 2, y + 30, m["chiziq"], 0.8, 0.7)
            yy = y + 10 - surish
            if tomon.get("sarlavha"):
                yy = matnBloki(c, x, yy, tomon["sarlavha"], "sarlavha-q", 24,
                               m["urgu"] if i == 0 else m["urgu-2"], keng, 1.25)
                yy -= 12
            for band in tomon.get("bandlar") or []:
                c.saveState()
                c.setFillColor(rang(m["urgu-2"]))
                c.circle(x + 5, yy + 8, 3.4, stroke=0, fill=1)
                c.restoreState()
                yy = matnBloki(c, x + 24, yy, band, "matn", 19.5, m["matn"], keng - 24, 1.5)
                yy -= 8
            if tomon.get("matn"):
                matnBloki(c, x, yy - 6, tomon["matn"], "matn", 18, m["xira-2"], keng, 1.5)
        self.ramka()

    def sitata(self, s):
        c, m = self.c, self.mavzu
        self.fonniYoz()
        yoz(c, CHEKKA, BALAND * 0.72, "\u201C", "serif-q", 190, m["urgu"], alpha=0.28)
        y = matnBloki(c, CHEKKA + 16, BALAND * 0.6, s["matn"], "serif", 38, m["matn"],
                      KENG - CHEKKA * 2 - 120, 1.35)
        if s.get("muallif"):
            ingichka(c, CHEKKA + 16, y - 22, CHEKKA + 96, y - 22, m["urgu"], 3)
            yoz(c, CHEKKA + 16, y - 56, s["muallif"], "matn-yarim", 19, m["xira"])
        if s.get("izoh"):
            matnBloki(c, CHEKKA + 16, y - (108 if s.get("muallif") else 40), s["izoh"], "matn", 18,
                      m["xira-2"], KENG * 0.7, 1.45)
        self.ramka()

    def yakun(self, s):
        c, m = self.c, self.mavzu
        gradient(c, 0, 0, KENG, BALAND, [m["fon-burchak"][0], m["fon"][0], m["fon"][1]], burchak=30)
        nur(c, KENG * 0.5, BALAND * 0.55, 640, m["urgu"], alpha=m["lak-kuch"] * 3.2)
        markaz = KENG / 2
        y = BALAND * 0.60 + 24
        if s.get("yorliq"):
            keng = matnKengligi(str(s["yorliq"]).upper(), "matn-yarim", 12.5, 2.6)
            self.kichikYorliq(markaz - keng / 2, y + yorliqOraligi(62), s["yorliq"])
        for qator in qatorlargaBol(s["sarlavha"], "sarlavha-j", 62, KENG - CHEKKA * 2):
            keng = matnKengligi(qator, "sarlavha-j", 62)
            yoz(c, markaz - keng / 2, y, qator, "sarlavha-j", 62, m["matn"])
            y -= satrBalandligi(62, 1.19)
        ingichka(c, markaz - 66, y + 22, markaz + 66, y + 22, m["urgu"], 3)
        y -= 26
        for qator in s.get("bandlar") or []:
            keng = matnKengligi(qator, "matn", 20)
            yoz(c, markaz - keng / 2, y, qator, "matn", 20, m["xira"])
            y -= 32
        if s.get("izoh"):
            keng = matnKengligi(s["izoh"], "matn-o", 16)
            yoz(c, markaz - keng / 2, PAST + 26, s["izoh"], "matn-o", 16, m["xira-2"])

    CHIZUVCHILAR = {
        "muqova": muqova, "reja": reja, "bolim": bolim, "mavzu": mavzu,
        "kartochka": kartochka, "matn": matn, "raqam": raqam, "ikki": ikki,
        "sitata": sitata, "yakun": yakun,
    }

    def yasa(self, slaydlar, chiqish):
        self.c = pdfcanvas.Canvas(chiqish, pagesize=(KENG, BALAND))
        self.c.setTitle(str(self.meta.get("mavzu") or "Taqdimot"))
        self.c.setAuthor(str(self.meta.get("muallif") or ""))
        self.c.setSubject(str(self.meta.get("kolontitul") or ""))
        self.jami = len(slaydlar)
        for s in slaydlar:
            tur = str(s.get("tur") or "matn")
            chizuvchi = self.CHIZUVCHILAR.get(tur)
            if chizuvchi is None:
                raise SystemExit(f"Noma'lum slayd turi: «{tur}». Ruxsat etilgan: "
                                 + ", ".join(self.CHIZUVCHILAR))
            self.raqam += 1
            chizuvchi(self, s)
            self.c.showPage()
        self.c.save()


def main():
    ap = argparse.ArgumentParser(description="JSON -> premium slayd PDF")
    ap.add_argument("manba", help="kontent JSON fayli")
    ap.add_argument("-o", "--chiqish", default=None)
    ap.add_argument("--mavzu", default=None, help="siyoh | oq | neon")
    ap.add_argument("--shrift", default=None, help="times | zamonaviy (sukut: times)")
    args = ap.parse_args()

    with open(args.manba, encoding="utf-8") as f:
        kontent = json.load(f)

    chiqish = args.chiqish or os.path.join(
        "chiqish", os.path.splitext(os.path.basename(args.manba))[0] + ".pdf")
    os.makedirs(os.path.dirname(os.path.abspath(chiqish)), exist_ok=True)

    profil = args.shrift or kontent.get("meta", {}).get("shrift") or "times"
    shriftlarniYukla(profil)
    kontent_papka = os.path.dirname(os.path.abspath(args.manba))
    taqdimot = Taqdimot(kontent.get("meta"), args.mavzu or kontent.get("meta", {}).get("mavzu_kalit"),
                        kontent_papka)
    slaydlar = kontent.get("slaydlar") or []
    taqdimot.yasa(slaydlar, chiqish)

    print(f"✅ {len(slaydlar)} slayd -> {chiqish}  "
          f"(mavzu: {taqdimot.mavzu['nom']}, shrift: {shriftProfili(PROFIL)['nom']})")
    for ogoh in ogohlantirishlarniOl():
        print(f"  ⚠ {ogoh}")


if __name__ == "__main__":
    main()
