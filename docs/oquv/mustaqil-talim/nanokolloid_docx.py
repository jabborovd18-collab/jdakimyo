# -*- coding: utf-8 -*-
"""
Mustaqil ta'lim topshirig'i (6.1) uchun qisqa ilmiy hujjat generatori.
Mavzu: Nanokolloid sistemalarda zarracha o'lchami, shakli va sirt
modifikatsiyasining fizik-kimyoviy xossalarga ta'siri.

Nega skript: matnni keyin tahrirlab qayta yig'ish oson bo'lsin — .docx
qo'lda tahrirlansa, manba bilan hujjat ajralib ketadi.

Formulalar Word'ning tabiiy tenglama formatida (OMML) yoziladi — ular
Word'da "Tenglama" sifatida ochiladi, kasr, indeks va ildizlar to'g'ri
chiziladi. Nega matn emas: "ln(c_r/c_inf)" ko'rinishidagi yozuv ilmiy
hujjatda o'qilmaydi.

Ishga tushirish:  python3 nanokolloid_docx.py
"""
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from lxml import etree

FONT = "Times New Roman"
M = "http://schemas.openxmlformats.org/officeDocument/2006/math"
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


# ============================================================================
# OMML (Word tenglamasi) qurish uchun mini-DSL
# ============================================================================
def _m(tag, *children):
    el = etree.Element("{%s}%s" % (M, tag))
    for c in children:
        el.append(c)
    return el


def T(text, plain=False):
    """Matematik run. plain=True — tik shrift (ln, cos, birliklar)."""
    r = etree.Element("{%s}r" % M)
    if plain:
        rpr = etree.SubElement(r, "{%s}rPr" % M)
        sty = etree.SubElement(rpr, "{%s}sty" % M)
        sty.set("{%s}val" % M, "p")
    t = etree.SubElement(r, "{%s}t" % M)
    t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
    t.text = text
    return r


def P(text):
    return T(text, plain=True)


def seq(*items):
    """Bir nechta elementni ketma-ket joylash uchun konteyner (m:e ichiga)."""
    return list(items)


def _wrap(tag, items):
    el = etree.Element("{%s}%s" % (M, tag))
    if not isinstance(items, (list, tuple)):
        items = [items]
    for it in items:
        el.append(it)
    return el


def frac(num, den):
    return _m("f", _wrap("num", num), _wrap("den", den))


def sub(base, s):
    return _m("sSub", _wrap("e", base), _wrap("sub", s))


def sup(base, s):
    return _m("sSup", _wrap("e", base), _wrap("sup", s))


def subsup(base, s, p_):
    return _m("sSubSup", _wrap("e", base), _wrap("sub", s), _wrap("sup", p_))


def par(items, left="(", right=")"):
    """Avtomatik o'lchamli qavslar."""
    d = etree.Element("{%s}d" % M)
    dpr = etree.SubElement(d, "{%s}dPr" % M)
    b = etree.SubElement(dpr, "{%s}begChr" % M)
    b.set("{%s}val" % M, left)
    e = etree.SubElement(dpr, "{%s}endChr" % M)
    e.set("{%s}val" % M, right)
    d.append(_wrap("e", items))
    return d


def sqrt(items):
    rad = etree.Element("{%s}rad" % M)
    rpr = etree.SubElement(rad, "{%s}radPr" % M)
    dh = etree.SubElement(rpr, "{%s}degHide" % M)
    dh.set("{%s}val" % M, "1")
    rad.append(etree.Element("{%s}deg" % M))
    rad.append(_wrap("e", items))
    return rad


def omath(*items):
    om = etree.Element("{%s}oMath" % M)
    for it in items:
        if isinstance(it, (list, tuple)):
            for x in it:
                om.append(x)
        else:
            om.append(it)
    return om


# ============================================================================
# Hujjat sozlamalari
# ============================================================================
doc = Document()
for s in doc.sections:
    s.top_margin = Cm(2)
    s.bottom_margin = Cm(2)
    s.left_margin = Cm(2.5)
    s.right_margin = Cm(1.5)

st = doc.styles["Normal"]
st.font.name = FONT
st.font.size = Pt(12)
st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
st.paragraph_format.space_after = Pt(4)
st.paragraph_format.line_spacing = 1.15

for name, size in (("Heading 1", 14), ("Heading 2", 12.5)):
    h = doc.styles[name]
    h.font.name = FONT
    h.font.size = Pt(size)
    h.font.bold = True
    h.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
    h.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    h.paragraph_format.space_before = Pt(10)
    h.paragraph_format.space_after = Pt(4)

EQ_NO = [0]


def p(text, bold=False, italic=False, align=None, size=None, after=None):
    para = doc.add_paragraph()
    run = para.add_run(text)
    run.bold = bold
    run.italic = italic
    if size:
        run.font.size = Pt(size)
    if align == "c":
        para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif align == "j":
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if after is not None:
        para.paragraph_format.space_after = Pt(after)
    return para


def rich(parts, align="j", para=None):
    """parts: [(matn, 'b'|'i'|''), ...] yoki OMML element (inline tenglama)."""
    if para is None:
        para = doc.add_paragraph()
    for item in parts:
        if isinstance(item, tuple):
            text, fmt = item
            r = para.add_run(text)
            r.bold = "b" in fmt
            r.italic = "i" in fmt
        else:
            para._p.append(item)  # inline m:oMath
    if align == "j":
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    return para


def equation(om, where=None):
    """Raqamlangan, markazlashgan tenglama: chegarasiz 2 ustunli jadval."""
    EQ_NO[0] += 1
    t = doc.add_table(rows=1, cols=2)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    c0, c1 = t.rows[0].cells
    c0.width = Cm(14.5)
    c1.width = Cm(2.0)
    c0.paragraphs[0]._p.append(om)
    c0.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    c1.paragraphs[0].add_run("(%d)" % EQ_NO[0])
    c1.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for c in (c0, c1):
        c.paragraphs[0].paragraph_format.space_after = Pt(2)
        c.paragraphs[0].paragraph_format.space_before = Pt(2)
    if where:
        para = doc.add_paragraph()
        r = para.add_run("bu yerda ")
        rich(where, para=para)
        para.paragraph_format.space_after = Pt(6)
    return EQ_NO[0]


def bullets(items, style="List Bullet"):
    for it in items:
        para = doc.add_paragraph(style=style)
        if isinstance(it, tuple):
            r = para.add_run(it[0])
            r.bold = True
            rest = it[1]
            if isinstance(rest, list):
                rich(rest, para=para)
            else:
                para.add_run(rest)
        elif isinstance(it, list):
            rich(it, para=para)
        else:
            para.add_run(it)
        para.paragraph_format.space_after = Pt(2)
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY


def shade(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tcPr.append(shd)


def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(headers):
        c = t.rows[0].cells[i]
        c.text = ""
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        r.font.size = Pt(11)
        c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        shade(c, "DCE6F1")
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""
            para = cells[i].paragraphs[0]
            if isinstance(v, str):
                r = para.add_run(v)
                r.font.size = Pt(11)
            else:  # OMML
                para._p.append(v)
                para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


# ============================================================================
# Tez-tez ishlatiladigan belgilar
# ============================================================================
def var(x):
    return T(x)


def num(x):
    return P(x)


# ============================================================================
# Sarlavha
# ============================================================================
p("MUSTAQIL TA'LIM TOPSHIRIG'I", bold=True, align="c", size=13, after=2)
p("Fan: Kolloid kimyo / Nanokimyo", italic=True, align="c", size=11, after=10)
p(
    "NANOKOLLOID SISTEMALARDA ZARRACHA O'LCHAMI, SHAKLI VA SIRT "
    "MODIFIKATSIYASINING FIZIK-KIMYOVIY XOSSALARGA TA'SIRI",
    bold=True, align="c", size=14, after=10,
)

rich([
    ("Annotatsiya. ", "b"),
    ("Ishda nanokolloid sistemalarning (1–100 nm) asosiy fizik-kimyoviy "
     "xossalari — sirt energiyasi, eruvchanlik, optik, magnit, katalitik va "
     "reologik xususiyatlar hamda agregativ barqarorlik — zarracha o'lchami, "
     "geometrik shakli va sirt modifikatsiyasi nuqtayi nazaridan qisqa tahlil "
     "qilinadi. Gibbs–Tomson, Ostvald–Freyndlix, Stoks, Brus, Eynshteyn "
     "tenglamalari va DLVO nazariyasi asosida \"tuzilma → xossa\" bog'liqligi "
     "ko'rsatiladi; nazoratning instrumental usullari (DLS, ζ-potensial, TEM, "
     "XRD, UV-Vis, BET) umumlashtiriladi.", ""),
])
rich([
    ("Kalit so'zlar: ", "b"),
    ("nanokolloid, solishtirma sirt, o'lcham effekti, anizotropiya, sirt "
     "modifikatsiyasi, ζ-potensial, DLVO, sterik stabilizatsiya.", "i"),
])

# ============================================================================
# 1. Kirish
# ============================================================================
doc.add_heading("1. Kirish va mavzuning dolzarbligi", level=1)
p(
    "Nanokolloid sistemalar — dispers fazasi 1–100 nm o'lchamli zarrachalardan "
    "iborat ultramikrogeterogen sistemalardir. Ularning o'ziga xosligi shundaki, "
    "zarracha o'lchami kichrayishi bilan sirt atomlari ulushi keskin ortadi "
    "(10 nm da ≈ 20 %, 2 nm da ≈ 80 %), natijada xossalar moddaning kimyoviy "
    "tarkibidan emas, balki zarrachaning o'lchami, shakli va sirt holatidan "
    "boshqariladigan bo'lib qoladi. Shu sababli zamonaviy nanotexnologiyada "
    "\"tarkib\" emas, \"tuzilma–xossa\" paradigmasi ustuvor. Mavzuning "
    "dolzarbligi dori yetkazish tizimlari, geterogen kataliz, sensorlar, quyosh "
    "elementlari va suvni tozalash kabi sohalarda nazorat qilinadigan "
    "nanokolloidlarga bo'lgan talab bilan belgilanadi.",
    align="j",
)

# ============================================================================
# 2. Maqsad va vazifalar
# ============================================================================
doc.add_heading("2. Ishning maqsadi va vazifalari", level=1)
rich([("Maqsad: ", "b"),
      ("nanokolloid zarrachalarning o'lchami, shakli va sirt modifikatsiyasi "
       "bilan ularning fizik-kimyoviy xossalari o'rtasidagi qonuniyatlarni "
       "tizimlashtirish.", "")])
p("Vazifalar:", bold=True, after=2)
bullets([
    "o'lcham effektining termodinamik va kinetik asoslarini yoritish;",
    "shakl anizotropiyasining optik, katalitik va reologik xossalarga ta'sirini ko'rsatish;",
    "sirt modifikatsiyasi mexanizmlarini (elektrostatik, sterik, elektrosterik) DLVO nazariyasi doirasida tahlil qilish;",
    "xossalarni nazorat qilishning instrumental usullarini umumlashtirish.",
], style="List Number")

# ============================================================================
# 3. Reja
# ============================================================================
doc.add_heading("3. Ishning rejasi", level=1)
bullets([
    ("Nanokolloid sistemalar: ", "ta'rif, tasnif, solishtirma sirt va sirt energiyasi."),
    ("Zarracha o'lchami effekti: ", "termodinamika (Gibbs–Tomson, Ostvald–Freyndlix), kinetika (Broun harakati, sedimentatsiya), kvant-o'lcham va plazmon effektlari, superparamagnetizm."),
    ("Zarracha shakli effekti: ", "aspekt nisbati, kristall yuzalar, anizotrop optika, reologiya."),
    ("Sirt modifikatsiyasi: ", "DLVO, ζ-potensial, ligandlar va polimer qobiqlar, core–shell tuzilmalar."),
    ("Tadqiqot usullari ", "va amaliy qo'llanilishi."),
    ("Xulosa.", ""),
], style="List Number")

# ============================================================================
# 4. Asosiy qism
# ============================================================================
doc.add_heading("4. Asosiy qism", level=1)

# ---- 4.1 ------------------------------------------------------------------
doc.add_heading("4.1. Nanokolloid sistemalarning umumiy tavsifi", level=2)
p("Sferik zarracha uchun solishtirma sirt (birlik massaga to'g'ri keladigan "
  "sirt) quyidagicha aniqlanadi:", align="j", after=2)
eq_S = equation(
    omath(sub(var("S"), P("sol")), P(" = "),
          frac(P("6"), seq(var("ρ"), var("d")))),
    where=[omath(var("ρ")), (" — zarracha zichligi, ", ""),
           omath(var("d")), (" — zarracha diametri.", "")],
)
rich([
    ("Diametr 1 mkm dan 10 nm gacha kichraysa, solishtirma sirt 100 marta ortadi "
     "(Au uchun ≈ 0,3 → 31 m²/g). Sirt atomlarining koordinatsion "
     "to'yinmaganligi ortiqcha sirt Gibbs energiyasini yuzaga keltiradi:", ""),
])
equation(
    omath(sub(var("G"), var("s")), P(" = "), var("σ"), P("·"), var("S")),
    where=[omath(var("σ")), (" — sirt tarangligi (solishtirma sirt energiyasi), ", ""),
           omath(var("S")), (" — umumiy fazalararo sirt.", "")],
)
p("Aynan shu energiya nanokolloidlarning termodinamik beqarorligi (agregatsiya, "
  "Ostvald yetilishi) va yuqori reaksion qobiliyatining manbaidir: sistema "
  "o'z-o'zidan sirtni kamaytirishga intiladi.", align="j")

# ---- 4.2 ------------------------------------------------------------------
doc.add_heading("4.2. Zarracha o'lchamining ta'siri", level=2)
p("Termodinamik o'lcham effektlari.", bold=True, after=2)
rich([("Eruvchanlik. ", "b"),
      ("Egri sirt ustidagi kimyoviy potensial yassi sirtdagidan yuqori bo'lgani "
       "uchun kichik zarrachaning eruvchanligi Ostvald–Freyndlix tenglamasi "
       "bo'yicha ortadi:", "")])
equation(
    omath(P("ln"), frac(sub(var("c"), var("r")), sub(var("c"), var("∞"))),
          P(" = "),
          frac(seq(P("2"), var("σ"), sub(var("V"), var("m"))),
               seq(var("R"), var("T"), var("r")))),
    where=[omath(sub(var("c"), var("r"))), (" va ", ""),
           omath(sub(var("c"), var("∞"))),
           (" — radiusi r bo'lgan zarracha va yassi sirt uchun eruvchanlik, ", ""),
           omath(sub(var("V"), var("m"))), (" — molyar hajm, ", ""),
           omath(var("r")), (" — zarracha radiusi.", "")],
)
p("Natijada polidispers sistemada kichik zarrachalar eriydi, yiriklari o'sadi — "
  "Ostvald yetilishi sodir bo'ladi.", align="j")

rich([("Erish harorati. ", "b"),
      ("Gibbs–Tomson tenglamasiga ko'ra nanozarrachaning erish harorati massiv "
       "moddanikidan past bo'ladi:", "")])
equation(
    omath(var("Δ"), sub(var("T"), var("m")), P(" = "),
          subsup(var("T"), var("m"), var("∞")), P(" − "),
          sub(var("T"), var("m")), par(var("r")), P(" = "),
          frac(seq(P("2"), sub(var("σ"), P("sl")), subsup(var("T"), var("m"), var("∞"))),
               seq(var("Δ"), sub(var("H"), var("m")), sub(var("ρ"), var("s")), var("r")))),
    where=[omath(subsup(var("T"), var("m"), var("∞"))),
           (" — massiv modda erish harorati, ", ""),
           omath(sub(var("σ"), P("sl"))), (" — qattiq–suyuqlik sirt tarangligi, ", ""),
           omath(var("Δ"), sub(var("H"), var("m"))), (" — solishtirma erish issiqligi.", "")],
)
p("Masalan, 2–3 nm li Au zarrachalar ≈ 600 K da eriydi (massiv Au: 1337 K).",
  align="j")

p("Kinetik o'lcham effektlari.", bold=True, after=2)
rich([("Sedimentatsiya va Broun harakati. ", "b"),
      ("Stoks qonuniga ko'ra cho'kish tezligi radius kvadratiga, Stoks–Eynshteyn "
       "tenglamasiga ko'ra diffuziya koeffitsienti esa radiusga teskari "
       "proporsional:", "")])
equation(
    omath(var("v"), P(" = "),
          frac(seq(P("2"), sup(var("r"), P("2")), par(seq(var("ρ"), P(" − "), sub(var("ρ"), P("0")))), var("g")),
               seq(P("9"), var("η")))),
)
equation(
    omath(var("D"), P(" = "),
          frac(seq(sub(var("k"), P("B")), var("T")),
               seq(P("6"), var("π"), var("η"), var("r")))),
    where=[omath(var("η")), (" — dispers muhit qovushqoqligi, ", ""),
           omath(sub(var("ρ"), P("0"))), (" — muhit zichligi, ", ""),
           omath(sub(var("k"), P("B"))), (" — Bolsman doimiysi.", "")],
)
p("10 nm li zarrachalar uchun Broun harakati gravitatsiyadan ustun bo'lgani "
  "uchun sistema kinetik jihatdan cho'kmaydi (sedimentatsion barqaror).",
  align="j")

p("Kvant va kollektiv effektlar.", bold=True, after=2)
rich([("Kvant-o'lcham effekti. ", "b"),
      ("Yarimo'tkazgich kvant nuqtalarda (CdSe, 2–8 nm) zarracha radiusi eksiton "
       "Bor radiusidan kichik bo'lsa, taqiqlangan zona kengligi Brus tenglamasi "
       "bo'yicha ortadi:", "")])
equation(
    omath(sub(var("E"), var("g")), par(var("r")), P(" = "),
          subsup(var("E"), var("g"), P("bulk")), P(" + "),
          frac(seq(sup(var("ħ"), P("2")), sup(var("π"), P("2"))),
               seq(P("2"), sup(var("r"), P("2")))),
          par(seq(frac(P("1"), sub(var("m"), var("e"))), P(" + "),
                  frac(P("1"), sub(var("m"), var("h"))))),
          P(" − "),
          frac(seq(P("1,8"), sup(var("e"), P("2"))),
               seq(P("4"), var("π"), var("ε"), sub(var("ε"), P("0")), var("r")))),
    where=[omath(sub(var("m"), var("e"))), (", ", ""), omath(sub(var("m"), var("h"))),
           (" — elektron va kovakning effektiv massalari, ", ""),
           omath(var("ε")), (" — dielektrik singdiruvchanlik.", "")],
)
rich([("Shunday qilib ", ""), omath(sub(var("E"), var("g")), P(" ∝ "), frac(P("1"), sup(var("r"), P("2")))),
      (" — o'lcham kichraygan sari lyuminessensiya rangi qizildan ko'kka siljiydi.", "")])

bullets([
    ("Sirt plazmon rezonansi (SPR): ", "Au nanozarrachalar 520 nm atrofida yutadi (qizil-binafsha rang); o'lcham ortishi va agregatsiya bilan cho'qqi qizil tomonga siljiydi — kolorimetrik sensorlar asosi."),
    ("Superparamagnetizm: ", "Fe₃O₄ zarrachalar ≈ 20 nm dan kichik bo'lsa bir domenli bo'lib, qoldiq magnitlanishsiz kuchli javob beradi (MRT kontrast, magnit ajratish)."),
    ("Katalitik faollik: ", "qirra va burchak atomlari ulushi ortadi; Au 3–5 nm da CO oksidlanishida faol, massiv holda inert."),
])

table(
    ["Xossa", "O'lcham kichraygan sari", "Qonuniyat"],
    [
        ["Solishtirma sirt", "keskin ortadi",
         omath(var("S"), P(" ∝ "), frac(P("1"), var("d")))],
        ["Eruvchanlik", "eksponensial ortadi",
         omath(P("ln"), var("c"), P(" ∝ "), frac(P("1"), var("r")))],
        ["Erish harorati", "pasayadi",
         omath(var("Δ"), sub(var("T"), var("m")), P(" ∝ "), frac(P("1"), var("r")))],
        ["Cho'kish tezligi", "kamayadi",
         omath(var("v"), P(" ∝ "), sup(var("r"), P("2")))],
        ["Diffuziya koeffitsienti", "ortadi",
         omath(var("D"), P(" ∝ "), frac(P("1"), var("r")))],
        ["Taqiqlangan zona (QD)", "kengayadi",
         omath(var("Δ"), sub(var("E"), var("g")), P(" ∝ "), frac(P("1"), sup(var("r"), P("2"))))],
        ["Katalitik faollik", "ortadi", "qirra/burchak atomlar ulushi"],
    ],
    widths=[5, 5, 6.5],
)

# ---- 4.3 ------------------------------------------------------------------
doc.add_heading("4.3. Zarracha shaklining ta'siri", level=2)
rich([
    ("Bir xil hajmdagi zarrachalarda shakl o'zgarishi sirt/hajm nisbatini, ochiq "
     "kristall yuzalar turini va zaryad taqsimotini o'zgartiradi. Asosiy "
     "geometrik parametr — aspekt nisbati ", ""),
    omath(P("AR"), P(" = "), frac(var("L"), var("d"))),
    (" (uzunlikning diametrga nisbati).", ""),
])
rich([("Reologiya. ", "b"),
      ("Suyultirilgan sferik zollar uchun Eynshteyn tenglamasi o'rinli:", "")])
equation(
    omath(var("η"), P(" = "), sub(var("η"), P("0")),
          par(seq(P("1 + "), var("k"), var("φ")))),
    where=[omath(sub(var("η"), P("0"))), (" — muhit qovushqoqligi, ", ""),
           omath(var("φ")), (" — dispers faza hajmiy ulushi, ", ""),
           omath(var("k"), P(" = 2,5")),
           (" — sferik zarrachalar uchun; nosferik (tayoqcha, plastinka) zarrachalarda ", ""),
           omath(var("k"), P(" > 2,5")),
           (" va u aspekt nisbati bilan ortadi, tizim tiksotrop/psevdoplastik xususiyat oladi (nanoglina, nanoselluloza).", "")],
)
bullets([
    ("Optika: ", "Au nanotayoqchalarda ikkita plazmon cho'qqi hosil bo'ladi — ko'ndalang (≈ 520 nm) va bo'ylama; bo'ylama cho'qqi AR ortishi bilan yaqin IQ sohaga (700–1100 nm) siljiydi, bu fototermal terapiyada ishlatiladi."),
    ("Kataliz va selektivlik: ", "kub (100), oktaedr (111), tetraedr yuzalarining sirt energiyasi va adsorbsiya energiyasi farqlanadi; Pt kublari va oktaedrlari bir reaksiyada turli mahsulot selektivligini beradi."),
    ("Barqarorlik va o'zaro ta'sir: ", "plastinkasimon va tayoqchasimon zarrachalar uchun van-der-Vaals tortishish geometriyaga bog'liq; qirra va uchlarda elektr maydon kontsentratsiyasi ortadi (\"lightning rod\" effekti)."),
    ("Biologik javob: ", "tayoqchasimon zarrachalar sferiklarga nisbatan hujayra membranasidan boshqacha o'tadi; shakl toksiklik va sirkulyatsiya vaqtini belgilaydi."),
])

# ---- 4.4 ------------------------------------------------------------------
doc.add_heading("4.4. Sirt modifikatsiyasining ta'siri", level=2)
p("DLVO nazariyasiga ko'ra ikki zarracha orasidagi natijaviy o'zaro ta'sir "
  "energiyasi elektrostatik itarilish va van-der-Vaals tortishish yig'indisidan "
  "iborat:", align="j", after=2)
equation(
    omath(var("U"), par(var("h")), P(" = "),
          sub(var("U"), P("el")), par(var("h")), P(" + "),
          sub(var("U"), P("vdW")), par(var("h")), P(" = "),
          P("2"), var("π"), var("ε"), sub(var("ε"), P("0")), var("r"),
          subsup(var("ψ"), P("0"), P("2")),
          sup(var("e"), seq(P("−"), var("κ"), var("h"))),
          P(" − "),
          frac(seq(var("A"), var("r")), seq(P("12"), var("h")))),
    where=[omath(var("h")), (" — sirtlar orasidagi masofa, ", ""),
           omath(sub(var("ψ"), P("0"))), (" — sirt potensiali, ", ""),
           omath(var("A")), (" — Gamaker doimiysi, ", ""),
           omath(var("κ")), (" — Debay parametri.", "")],
)
rich([("Qo'sh elektr qavat qalinligi (Debay uzunligi) elektrolit "
       "konsentratsiyasiga bog'liq:", "")])
equation(
    omath(sup(var("κ"), P("−1")), P(" = "),
          sqrt(frac(seq(var("ε"), sub(var("ε"), P("0")), sub(var("k"), P("B")), var("T")),
                    seq(P("2"), sub(var("N"), P("A")), sup(var("e"), P("2")), var("I"))))),
    where=[omath(var("I")), (" — eritmaning ion kuchi. Suvda 25 °C da: 1 mM NaCl → ≈ 10 nm, 100 mM → ≈ 1 nm.", "")],
)
p("Sirt modifikatsiyasining vazifasi energetik to'siq balandligini (> 15–25 kT) "
  "ta'minlab, zarrachalarni birlamchi minimumga tushishdan (qaytmas "
  "koagulyatsiyadan) saqlashdir.", align="j")
bullets([
    ("Elektrostatik stabilizatsiya: ", "ionogen ligandlar (sitrat, SDS, CTAB) qo'sh elektr qavat hosil qiladi; |ζ| > 30 mV — barqaror, |ζ| < 10 mV — koagulyatsiyaga moyil. Elektrolit qo'shilishi Debay uzunligini qisqartirib, Shulse–Gardi qoidasi bo'yicha (koagulyatsiya ostonasi ∝ 1/z⁶) koagulyatsiya chaqiradi."),
    ("Sterik stabilizatsiya: ", "adsorbsiyalangan/kovalent bog'langan polimerlar (PEG, PVP, PVA, dekstran) entropik to'siq hosil qiladi; ion kuchi va pH ga sezgir emas, shuning uchun biologik muhitlarda afzal."),
    ("Elektrosterik: ", "polielektrolitlar (PAA, xitozan) ikkala mexanizmni birlashtiradi."),
    ("Kimyoviy funksionallash: ", "tiol–Au (≈ 200 kJ/mol), silanlar (APTES) – oksidlar, fosfonatlar/oleat – Fe₃O₄, TiO₂. Terminal guruhlar (–COOH, –NH₂, –SH) keyingi konyugatsiya (antitelo, dori, bo'yoq) uchun \"yakor\" bo'ladi."),
    ("Core–shell tuzilmalar: ", "SiO₂ yoki Au qobiq yadroni oksidlanish/erishdan saqlaydi, toksiklikni kamaytiradi, optik va magnit xossalarni birlashtiradi (Fe₃O₄@SiO₂, CdSe@ZnS — kvant chiqish 2–3 marta ortadi)."),
])
p("Modifikatsiya natijasida o'zgaradigan xossalar:", bold=True, after=2)
table(
    ["Xossa", "Modifikatsiya ta'siri", "Misol"],
    [
        ["Agregativ barqarorlik", "to'siq ↑, koagulyatsiya ostonasi ↑", "Sitrat-Au → PEG-Au: 0,15 M NaCl da barqaror"],
        ["Gidrofil/gidrofob balans", "dispers muhitga moslashish", "Oleat-Fe₃O₄ (geksan) → DMSA-Fe₃O₄ (suv)"],
        ["Gidrodinamik diametr", "ortadi (qobiq qalinligi)", "TEM 10 nm, DLS 25–30 nm"],
        ["ζ-potensial", "ishorasi va kattaligi o'zgaradi", "–40 mV (sitrat) → +35 mV (CTAB)"],
        ["Optik / lyuminessensiya", "SPR siljishi, kvant chiqish ↑", "CdSe → CdSe@ZnS"],
        ["Biouyg'unlik", "opsonizatsiya ↓, sirkulyatsiya ↑", "PEGillangan liposomalar (\"stealth\")"],
    ],
    widths=[4.2, 5.3, 7],
)

# ---- 4.5 ------------------------------------------------------------------
doc.add_heading("4.5. Tadqiqot va nazorat usullari", level=2)
rich([("Kristallit o'lchami rentgen difraktogrammasidagi cho'qqi kengayishidan "
       "Sherrer tenglamasi orqali topiladi:", "")])
equation(
    omath(var("D"), P(" = "),
          frac(seq(var("K"), var("λ")),
               seq(var("β"), P("cos"), var("θ")))),
    where=[omath(var("K"), P(" ≈ 0,9")), (" — shakl omili, ", ""),
           omath(var("λ")), (" — rentgen nurlanish to'lqin uzunligi, ", ""),
           omath(var("β")), (" — cho'qqining yarim balandlikdagi kengligi (radianlarda), ", ""),
           omath(var("θ")), (" — Bregg burchagi.", "")],
)
rich([("Gidrodinamik diametr DLS usulida Stoks–Eynshteyn tenglamasi (6) "
       "orqali o'lchangan diffuziya koeffitsientidan hisoblanadi: ", ""),
      omath(sub(var("d"), var("H")), P(" = "),
            frac(seq(sub(var("k"), P("B")), var("T")),
                 seq(P("3"), var("π"), var("η"), var("D")))),
      (".", "")])
table(
    ["Usul", "Aniqlanadigan parametr", "Izoh"],
    [
        ["DLS", "gidrodinamik diametr, PDI", "qobiq va solvat qavat bilan birga"],
        ["ζ-potensial (ELS)", "sirt zaryadi, barqarorlik", "pH va ion kuchiga bog'liq"],
        ["TEM / SEM", "haqiqiy o'lcham, shakl, qobiq", "\"quruq\" o'lcham"],
        ["XRD (Sherrer)", "kristallit o'lchami, faza", "tenglama (11)"],
        ["UV-Vis", "SPR / taqiqlangan zona, agregatsiya", "tez va arzon nazorat"],
        ["FTIR, TGA", "ligand bog'lanishi va miqdori", "sirt kimyosi"],
        ["BET (N₂ adsorbsiya)", "solishtirma sirt, g'ovaklik", "kukun holatida"],
    ],
    widths=[4, 6, 6.5],
)

# ---- 4.6 ------------------------------------------------------------------
doc.add_heading("4.6. Amaliy ahamiyati", level=2)
bullets([
    "Tibbiyot: o'lcham (10–100 nm) va PEG qobiq EPR effekti orqali o'smaga tanlab to'planishni ta'minlaydi; Au nanotayoqchalar — fototermal terapiya; Fe₃O₄ — MRT va gipertermiya.",
    "Kataliz: o'lchami 2–5 nm va aniq yuzali Pt, Pd, Au nanozarrachalar — selektiv gidrogenlash va oksidlanish.",
    "Ekologiya va energetika: TiO₂, ZnO nanokolloidlar — fotokataliz va suvni tozalash; kvant nuqtalar — displeylar va quyosh elementlari.",
    "Sensorika: Au/Ag zollarining agregatsiyaga bog'liq rang o'zgarishi — og'ir metallar va biomolekulalarni kolorimetrik aniqlash.",
])

# ============================================================================
# 5. Xulosa
# ============================================================================
doc.add_heading("5. Xulosa", level=1)
bullets([
    "Nanokolloidlarda xossalar tarkibdan ko'ra tuzilma bilan boshqariladi: o'lcham → termodinamika va kvant effektlari; shakl → anizotropiya va selektivlik; sirt → barqarorlik va funksionallik.",
    "O'lcham kichraygan sari solishtirma sirt, eruvchanlik, diffuziya va katalitik faollik ortadi, erish harorati va cho'kish tezligi pasayadi; 1–10 nm oralig'ida kvant-o'lcham effekti ustunlik qiladi.",
    "Shakl anizotropiyasi plazmon rezonansini IQ sohaga siljitish, kristall yuzalar orqali katalitik selektivlikni boshqarish va reologik xossalarni o'zgartirish imkonini beradi.",
    "Sirt modifikatsiyasi DLVO to'sig'ini oshirib agregativ barqarorlikni ta'minlaydi, zarrachani kerakli muhitga moslaydi va maqsadli funksiya beradi; |ζ| > 30 mV yoki sterik qobiq — barqarorlikning amaliy mezoni.",
    "Uchala omil o'zaro bog'liq, shuning uchun nanokolloidni loyihalashda ular birgalikda, DLS–TEM–ζ-potensial–UV-Vis kompleks nazorati ostida optimallashtirilishi lozim.",
], style="List Number")

# ============================================================================
# 6. Adabiyotlar
# ============================================================================
doc.add_heading("Foydalanilgan adabiyotlar", level=1)
refs = [
    "Hiemenz P.C., Rajagopalan R. Principles of Colloid and Surface Chemistry. 3rd ed. – New York: Marcel Dekker, 1997.",
    "Cao G., Wang Y. Nanostructures and Nanomaterials: Synthesis, Properties and Applications. 2nd ed. – World Scientific, 2011.",
    "Israelachvili J.N. Intermolecular and Surface Forces. 3rd ed. – Academic Press, 2011.",
    "Roduner E. Size matters: why nanomaterials are different // Chem. Soc. Rev. – 2006. – Vol. 35. – P. 583–592.",
    "Brus L.E. Electron–electron and electron-hole interactions in small semiconductor crystallites // J. Chem. Phys. – 1984. – Vol. 80. – P. 4403–4409.",
    "Burda C., Chen X., Narayanan R., El-Sayed M.A. Chemistry and properties of nanocrystals of different shapes // Chem. Rev. – 2005. – Vol. 105. – P. 1025–1102.",
    "Sperling R.A., Parak W.J. Surface modification, functionalization and bioconjugation of colloidal inorganic nanoparticles // Phil. Trans. R. Soc. A. – 2010. – Vol. 368. – P. 1333–1383.",
    "Фролов Ю.Г. Курс коллоидной химии. Поверхностные явления и дисперсные системы. – М.: Химия, 2004.",
    "Ahmedov Q.R., Qurbonov A.R. Kolloid kimyo. – Toshkent: O'zbekiston, 2012.",
]
for i, r in enumerate(refs, 1):
    para = doc.add_paragraph()
    para.add_run(f"{i}. {r}").font.size = Pt(11)
    para.paragraph_format.space_after = Pt(2)
    para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

out = __file__.rsplit("/", 1)[0] + "/Nanokolloid-sistemalar-mustaqil-ish.docx"
doc.save(out)
print("Saqlandi:", out, "| tenglamalar soni:", EQ_NO[0])
