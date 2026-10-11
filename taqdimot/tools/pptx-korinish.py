"""PPTX geometriyasini rasmga chizish (sxematik ko'rinish).

NEGA KERAK: bu muhitda PowerPoint yo'q, ya'ni tayyor PPTX ni ochib
ko'rish imkoni yo'q. Faqat raqamlar (chegara, ustma-ust tushish) yetarli
emas — karta ichidagi matn qanday joylashgani, rasm bilan matn
nisbati, sarlavha og'irligi ko'z bilan ko'riladi.

NIMA QILADI: PPTX XML'idagi har bir shakl (to'rtburchak, chiziq,
rasm, matn) o'z koordinatasida chiziladi; matn haqiqiy shrift bilan
o'raladi. Bu — PowerPoint emas, GEOMETRIYA ko'rinishi:

    ✓ ni ko'rsatadi: joylashuv, o'lcham, nisbat, ustma-ust tushish
    ✗ ko'rsatmaydi: PowerPoint'ning aniq shrift metrikasi, soyalar,
      gradientlar, animatsiyalar

ISHLATISH:
    python3 tools/pptx-korinish.py chiqish/sirt-hodisalari-siyoh.pptx
    python3 tools/pptx-korinish.py ... --varaq chiqish/pptx-umumiy.png
"""

import argparse
import importlib.util
import os
import sys
import zipfile

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pylib"))

from PIL import Image, ImageDraw, ImageFont  # noqa: E402

TOOLS = os.path.dirname(os.path.abspath(__file__))
ILDIZ = os.path.dirname(TOOLS)
SHRIFT_PAPKA = os.path.join(ILDIZ, "shriftlar")

_spec = importlib.util.spec_from_file_location("pptx_oqi", os.path.join(TOOLS, "pptx-oqi.py"))
_pptx = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_pptx)

# PowerPoint oila nomi -> shu yerdagi shrift fayli
OILA_FAYL = {
    "Inter": "Inter-Regular.ttf",
    "Inter Medium": "Inter-Medium.ttf",
    "Inter SemiBold": "Inter-SemiBold.ttf",
    "Inter Bold": "Inter-Bold.ttf",
    "Inter ExtraBold": "Inter-ExtraBold.ttf",
    "Manrope": "Manrope-Bold.ttf",
    "Manrope SemiBold": "Manrope-SemiBold.ttf",
    "Manrope ExtraBold": "Manrope-ExtraBold.ttf",
    "Playfair Display": "Playfair-Regular.ttf",
    "Playfair Display Bold": "Playfair-Bold.ttf",
    "Noto Sans Math": "NotoSansMath-Regular.ttf",
}

KENG_PIKSEL = 1600


def rang(hexqiymat, shaffoflik=0):
    """Hex + shaffoflik -> PIL uchun RGBA."""
    if not hexqiymat:
        return None
    h = hexqiymat.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    alfa = round(255 * (1 - (shaffoflik or 0) / 100))
    return (r, g, b, alfa)


def shriftOl(oila, olchamPt, masshtab):
    """Shriftni nuqtadan pikselga o'girib yuklaydi.

    NEGA ALOHIDA KOEFFITSIYENT: slayd o'lchami santimetrda, shrift esa
    NUQTADA. 1 dyuym = 72 nuqta = 2,54 sm, ya'ni px/nuqta koeffitsiyenti
    sm uchun ishlatiladigan masshtabdan 28,35 baravar kichik. Avval shu
    yerda xato qilingan edi va matn 13 baravar katta chiqardi.
    """
    fayl = OILA_FAYL.get(oila, "Inter-Regular.ttf")
    yol = os.path.join(SHRIFT_PAPKA, fayl)
    px = max(6, round(olchamPt * masshtab * 2.54 / 72))
    if not os.path.exists(yol):
        yol = os.path.join(SHRIFT_PAPKA, "Inter-Regular.ttf")
    return ImageFont.truetype(yol, px)


def matnChiz(qatlam, matn, x, y, kengPx, olchamPt, oila, rangQiymat, masshtab,
             markaz=False, qatorPt=None):
    """Bitta uslubdagi matn — so'z bo'yicha o'raladi.

    Qaytaradi: (qatorlar soni, qator balandligi pikselda).
    """
    d = ImageDraw.Draw(qatlam)
    shrift = shriftOl(oila, olchamPt, masshtab)
    nuqtaPx = masshtab * 2.54 / 72
    qatorBaland = (qatorPt or olchamPt * 1.5) * nuqtaPx

    qatorlar, joriy = [], ""
    for soz in str(matn).split():
        sinov = f"{joriy} {soz}".strip()
        if joriy and shrift.getlength(sinov) > kengPx:
            qatorlar.append(joriy)
            joriy = soz
        else:
            joriy = sinov
    if joriy:
        qatorlar.append(joriy)

    yy = y
    for qator in qatorlar:
        wq = shrift.getlength(qator)
        xx = x + (kengPx - wq) / 2 if markaz else x
        d.text((xx, yy), qator, font=shrift, fill=rangQiymat)
        yy += qatorBaland
    return len(qatorlar), qatorBaland


def abzatsChiz(qatlam, runs, x, y, kengPx, masshtab, markaz=False, qatorPt=None):
    """Aralash uslubdagi abzats: so'zlar o'z shrifti va rangi bilan.

    NEGA SO'Z BO'YICHA: abzatsning birinchi iborasi qalin va urg'u
    rangida, qolgani oddiy. Har bo'lakni alohida chizsak, ular ustma-ust
    tushadi (har biri matn boshidan boshlanadi) — birinchi sinovda
    ko'rinish aynan shunday buzilgan edi.
    """
    d = ImageDraw.Draw(qatlam)
    nuqtaPx = masshtab * 2.54 / 72
    olchamPt = runs[0][1] if runs else 18
    qatorBaland = (qatorPt or olchamPt * 1.5) * nuqtaPx

    # So'zlarni uslubi bilan yig'amiz
    sozlar = []
    for matn, olcham, oila, rang_ in runs:
        for soz in str(matn).split():
            sozlar.append((soz, olcham, oila, rang_))
    if not sozlar:
        return 0, qatorBaland

    shriftlar = {}
    qatorlar, joriy, keng = [], [], 0.0
    for soz, olcham, oila, rang_ in sozlar:
        kalit = (oila, olcham)
        if kalit not in shriftlar:
            shriftlar[kalit] = shriftOl(oila, olcham, masshtab)
        shrift = shriftlar[kalit]
        w = shrift.getlength(soz)
        bosh = shrift.getlength(" ") if joriy else 0
        if joriy and keng + bosh + w > kengPx:
            qatorlar.append(joriy)
            joriy, keng = [], 0.0
            bosh = 0
        joriy.append((soz, shrift, rang_))
        keng += bosh + w
    if joriy:
        qatorlar.append(joriy)

    yy = y
    for qator in qatorlar:
        # Bo'shliqlar har so'zning o'z shrifti bilan o'lchanadi
        jamiKeng = sum(sh.getlength(soz) for soz, sh, _ in qator)
        for i in range(len(qator) - 1):
            jamiKeng += qator[i][1].getlength(" ")
        xx = x + (kengPx - jamiKeng) / 2 if markaz else x
        for i, (soz, shrift, rang_) in enumerate(qator):
            if i:
                xx += shrift.getlength(" ")
            d.text((xx, yy), soz, font=shrift, fill=rang_)
            xx += shrift.getlength(soz)
        yy += qatorBaland
    return len(qatorlar), qatorBaland


def slaydniChiz(slayd, media, chiqish, wpx=KENG_PIKSEL):
    """Bitta slaydni rasmga chizadi."""
    # Slayd o'lchami sm'da (16:9) -> piksel
    kengPx = wpx
    balandPx = round(wpx * 19.05 / 33.87)
    masshtab = kengPx / 33.87  # px / sm
    surat = Image.new("RGBA", (kengPx, balandPx), (16, 18, 24, 255))

    # 1. Fon
    fon = slayd.get("fon")
    if fon and fon in media:
        with Image.open(media[fon]) as im:
            surat.paste(im.convert("RGB").resize((kengPx, balandPx)), (0, 0))
    elif slayd.get("fon-rang"):
        surat.paste(rang(slayd["fon-rang"]), (0, 0, kengPx, balandPx))

    def px(sm):
        return sm * masshtab

    # 2. Shakllar (matnli va matnsiz)
    for sh in slayd["shakllar"]:
        joy = sh["joy"]
        if not joy:
            continue
        k = sh.get("korinish") or {}
        x, y = px(joy["x"]), px(joy["y"])
        w, h = px(joy["w"]), px(joy["h"])

        geom = k.get("geom")
        to = rang(k.get("to"), k.get("shaffoflik"))
        chiziq = rang(k.get("chiziq"), k.get("shaffoflik"))

        if geom == "line":
            d = ImageDraw.Draw(surat)
            d.line([(x, y), (x + w, y + h)], fill=chiziq or (255, 255, 255, 255),
                   width=max(1, round((k.get("qalinlik") or 1) * masshtab * 2.54 / 72)))
        elif to or chiziq:
            qatlam = Image.new("RGBA", (kengPx, balandPx), (0, 0, 0, 0))
            d = ImageDraw.Draw(qatlam)
            radius = round(px(0.3)) if geom == "roundRect" else 0
            if geom == "ellipse":
                d.ellipse([x, y, x + w, y + h], fill=to, outline=chiziq,
                          width=max(1, round((k.get("qalinlik") or 0.75) * masshtab * 2.54 / 72)))
            elif geom == "diamond":
                d.polygon([(x + w / 2, y), (x + w, y + h / 2), (x + w / 2, y + h), (x, y + h / 2)],
                          fill=to, outline=chiziq)
            else:
                d.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=to, outline=chiziq,
                                    width=max(1, round((k.get("qalinlik") or 0.75) * masshtab * 2.54 / 72)))
            surat = Image.alpha_composite(surat, qatlam)

        # Matn
        if sh["matn"]:
            qatlam = Image.new("RGBA", (kengPx, balandPx), (0, 0, 0, 0))
            nuqtaPx = masshtab * 2.54 / 72
            yy = y + px(0.05)
            for i, blok in enumerate(sh["matn"]):
                abzats = (sh.get("abzats") or [{}])[i] if i < len(sh.get("abzats") or []) else {}
                runs = [(r["matn"], r.get("olcham") or 18, r.get("shrift") or "Inter",
                         rang(r.get("rang") or "#FFFFFF")) for r in blok]
                if not any(m.strip() for m, _, _, _ in runs):
                    continue
                qatorlar, qatorBaland = abzatsChiz(
                    qatlam, runs, x, yy, w, masshtab, abzats.get("markaz"), abzats.get("qatorPt"))
                olchamPt = runs[0][1]
                yy += max(qatorlar * qatorBaland, olchamPt * 1.5 * nuqtaPx) + px(0.06)
            surat = Image.alpha_composite(surat, qatlam)

    # 3. Rasmlar
    for r in slayd["rasmlar"]:
        if r["x"] is None or r["fayl"] not in media:
            continue
        with Image.open(media[r["fayl"]]) as im:
            im = im.convert("RGBA")
            im = im.resize((max(1, round(px(r["w"]))), max(1, round(px(r["h"])))))
            qatlam = Image.new("RGBA", (kengPx, balandPx), (0, 0, 0, 0))
            qatlam.paste(im, (round(px(r["x"])), round(px(r["y"]))), im)
            surat = Image.alpha_composite(surat, qatlam)

    surat.convert("RGB").save(chiqish)
    return chiqish


def main():
    ap = argparse.ArgumentParser(description="PPTX geometriyasini rasmga chizish")
    ap.add_argument("pptx")
    ap.add_argument("--chiqish", default=None, help="papka (sukut: pptx yonida)")
    ap.add_argument("--varaq", default=None, help="umumiy varaq (PNG)")
    ap.add_argument("--olcham", type=int, default=KENG_PIKSEL)
    args = ap.parse_args()

    slaydlar = _pptx.main(args.pptx)
    papka = args.chiqish or os.path.join(os.path.dirname(os.path.abspath(args.pptx)), "pptx-geometriya")
    os.makedirs(papka, exist_ok=True)

    # Media fayllarni vaqtinchalik papkaga chiqaramiz (fon + rasmlar)
    asos = os.path.splitext(os.path.basename(args.pptx))[0]
    media = {}
    with zipfile.ZipFile(args.pptx) as z:
        for nom in z.namelist():
            if nom.startswith("ppt/media/"):
                yol = os.path.join(papka, "_media_" + os.path.basename(nom))
                with open(yol, "wb") as f:
                    f.write(z.read(nom))
                media[os.path.basename(nom)] = yol

    fayllar = []
    for i, slayd in enumerate(slaydlar, 1):
        yol = os.path.join(papka, f"{asos}-{i:02d}.png")
        slaydniChiz(slayd, media, yol, args.olcham)
        fayllar.append(yol)
    print(f"🖼  {len(fayllar)} slayd -> {papka}/")

    if args.varaq:
        from PIL import Image as I
        rs = [I.open(f) for f in fayllar]
        kw = 4
        w, h = rs[0].size
        k = 0.33
        w2, h2 = int(w * k), int(h * k)
        qatorlar = (len(rs) + kw - 1) // kw
        varaq = I.new("RGB", (kw * w2 + 12 * (kw + 1), qatorlar * h2 + 12 * (qatorlar + 1)), (8, 9, 13))
        for i, r in enumerate(rs):
            q, u = divmod(i, kw)
            varaq.paste(r.resize((w2, h2)), (12 + u * (w2 + 12), 12 + q * (h2 + 12)))
        varaq.save(args.varaq)
        print("📋 Varaq:", args.varaq)


if __name__ == "__main__":
    main()
