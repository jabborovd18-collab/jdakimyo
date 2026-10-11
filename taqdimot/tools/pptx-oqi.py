"""PPTX mazmunini o'qish — har bir slayddagi shakllar, matn va rasmlar.

NEGA ALOHIDA SKRIPT: slaydlar shabloni va tuzilishi keyin kerak bo'ladi
(himoya, matn, jadval). PPTX — bu zip: ichida XML. Hech qanday tashqi
kutubxona kerak emas, faqat zipfile va ElementTree.
"""

import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}"

EMU = 914400  # dyuymdagi EMU


def emu_sm(qiymat):
    return round(int(qiymat) / EMU * 2.54, 2)


def shakl_matni(shakl):
    """Shakldagi matn va uning uslubi (o'lcham, qalin, rang)."""
    bloklar = []
    for par in shakl.iter(f"{A}p"):
        qator = []
        for run in par.iter(f"{A}r"):
            t = run.find(f"{A}t")
            if t is None or not (t.text or "").strip():
                continue
            uslub = {"matn": t.text}
            rPr = run.find(f"{A}rPr")
            if rPr is not None:
                if rPr.get("sz"):
                    uslub["olcham"] = int(rPr.get("sz")) / 100  # nuqta
                if rPr.get("b") == "1":
                    uslub["qalin"] = True
                if rPr.get("i") == "1":
                    uslub["kursiv"] = True
                solid = rPr.find(f"{A}solidFill/{A}srgbClr")
                if solid is not None:
                    uslub["rang"] = "#" + solid.get("val")
                shrift = rPr.find(f"{A}latin")
                if shrift is not None and shrift.get("typeface"):
                    uslub["shrift"] = shrift.get("typeface")
            qator.append(uslub)
        if qator:
            bloklar.append(qator)
    return bloklar


def slaydni_oqi(z, nom, rels):
    xml = ET.fromstring(z.read(nom))
    natija = {"fayl": nom, "shakllar": [], "rasmlar": []}
    for shakl in xml.iter(f"{P}sp"):
        nv = shakl.find(f"{P}nvSpPr/{P}cNvPr")
        ph = shakl.find(f"{P}nvSpPr/{P}nvPr/{P}ph")
        tur = ph.get("type") if ph is not None else None
        off = shakl.find(f".//{A}off")
        ext = shakl.find(f".//{A}ext")
        joy = None
        if off is not None and ext is not None:
            joy = {
                "x": emu_sm(off.get("x")), "y": emu_sm(off.get("y")),
                "w": emu_sm(ext.get("cx")), "h": emu_sm(ext.get("cy")),
            }
        matn = shakl_matni(shakl)
        if matn or tur:
            natija["shakllar"].append({
                "tur": tur, "nom": nv.get("name") if nv is not None else None,
                "joy": joy, "matn": matn,
            })
    for pic in xml.iter(f"{P}pic"):
        blip = pic.find(f".//{A}blip")
        if blip is None:
            continue
        rid = blip.get(f"{R}embed")
        off = pic.find(f".//{A}off")
        ext = pic.find(f".//{A}ext")
        natija["rasmlar"].append({
            "fayl": rels.get(rid),
            "x": emu_sm(off.get("x")) if off is not None else None,
            "y": emu_sm(off.get("y")) if off is not None else None,
            "w": emu_sm(ext.get("cx")) if ext is not None else None,
            "h": emu_sm(ext.get("cy")) if ext is not None else None,
        })
    return natija


def main(manzil):
    z = zipfile.ZipFile(manzil)
    slaydlar = sorted(
        [n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)],
        key=lambda x: int(re.findall(r"\d+", x)[0]),
    )
    natijalar = []
    for nom in slaydlar:
        rels_nom = nom.replace("slides/", "slides/_rels/") + ".rels"
        rels = {}
        if rels_nom in z.namelist():
            for rel in ET.fromstring(z.read(rels_nom)):
                if "media" in (rel.get("Target") or "") or "image" in (rel.get("Target") or ""):
                    rels[rel.get("Id")] = os.path.basename(rel.get("Target"))
        natijalar.append(slaydni_oqi(z, nom, rels))
    return natijalar


if __name__ == "__main__":
    manba = sys.argv[1]
    chiqish = sys.argv[2] if len(sys.argv) > 2 else "/dev/stdout"
    d = main(manba)
    json.dump(d, open(chiqish, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(d)} slayd o'qildi -> {chiqish}")
