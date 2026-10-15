# -*- coding: utf-8 -*-
"""
Mustaqil ta'lim topshirig'i (6.1) uchun qisqa ilmiy hujjat generatori.
Mavzu: Nanokolloid sistemalarda zarracha o'lchami, shakli va sirt
modifikatsiyasining fizik-kimyoviy xossalarga ta'siri.

Nega skript: matnni keyin tahrirlab qayta yig'ish oson bo'lsin — .docx
qo'lda tahrirlansa, manba bilan hujjat ajralib ketadi.
Ishga tushirish:  python3 nanokolloid_docx.py
"""
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

FONT = "Times New Roman"

doc = Document()

# --- Sahifa va asosiy shrift ---------------------------------------------
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


def rich(parts, align="j"):
    """parts: [(matn, 'b'|'i'|''), ...] — bitta abzats ichida aralash uslub."""
    para = doc.add_paragraph()
    for text, fmt in parts:
        r = para.add_run(text)
        r.bold = "b" in fmt
        r.italic = "i" in fmt
    if align == "j":
        para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    return para


def bullets(items, style="List Bullet"):
    for it in items:
        para = doc.add_paragraph(style=style)
        if isinstance(it, tuple):
            r = para.add_run(it[0])
            r.bold = True
            para.add_run(it[1])
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
            r = cells[i].paragraphs[0].add_run(v)
            r.font.size = Pt(11)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


# --- Sarlavha ---------------------------------------------------------------
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
     "geometrik shakli va sirt modifikatsiyasi nuqtayi nazaridan qisqa "
     "tahlil qilinadi. Gibbs–Tomson, Ostvald–Freyndlix, Stoks, Eynshteyn "
     "tenglamalari va DLVO nazariyasi asosida \"tuzilma → xossa\" "
     "bog'liqligi ko'rsatiladi; nazoratning instrumental usullari "
     "(DLS, ζ-potensial, TEM, XRD, UV-Vis, BET) umumlashtiriladi.", ""),
])
rich([
    ("Kalit so'zlar: ", "b"),
    ("nanokolloid, solishtirma sirt, o'lcham effekti, anizotropiya, "
     "sirt modifikatsiyasi, ζ-potensial, DLVO, sterik stabilizatsiya.", "i"),
])

# --- 1. Kirish --------------------------------------------------------------
doc.add_heading("1. Kirish va mavzuning dolzarbligi", level=1)
p(
    "Nanokolloid sistemalar — dispers fazasi 1–100 nm o'lchamli zarrachalardan "
    "iborat ultramikrogeterogen sistemalardir. Ularning o'ziga xosligi shundaki, "
    "zarracha o'lchami kichrayishi bilan sirt atomlari ulushi keskin ortadi "
    "(10 nm da ≈ 20 %, 2 nm da ≈ 80 %), natijada xossalar moddaning kimyoviy "
    "tarkibidan emas, balki zarrachaning o'lchami, shakli va sirt holatidan "
    "boshqariladigan bo'lib qoladi. Shu sababli zamonaviy nanotexnologiyada "
    "\"tarkib\" emas, \"tuzilma–xossa\" paradigmasi ustuvor. Mavzuning "
    "dolzarbligi dori yetkazish tizimlari, geterogen kataliz, sensorlar, "
    "quyosh elementlari va suvni tozalash kabi sohalarda nazorat qilinadigan "
    "nanokolloidlarga bo'lgan talab bilan belgilanadi.",
    align="j",
)

# --- 2. Maqsad va vazifalar ---------------------------------------------------
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

# --- 3. Reja ----------------------------------------------------------------
doc.add_heading("3. Ishning rejasi", level=1)
bullets([
    ("Nanokolloid sistemalar: ", "ta'rif, tasnif, solishtirma sirt va sirt energiyasi."),
    ("Zarracha o'lchami effekti: ", "termodinamika (Gibbs–Tomson, Ostvald–Freyndlix), kinetika (Broun harakati, sedimentatsiya), kvant-o'lcham va plazmon effektlari, superparamagnetizm."),
    ("Zarracha shakli effekti: ", "aspekt nisbati, kristall yuzalar, anizotrop optika, reologiya."),
    ("Sirt modifikatsiyasi: ", "DLVO, ζ-potensial, ligandlar va polimer qobiqlar, core–shell tuzilmalar."),
    ("Tadqiqot usullari ", "va amaliy qo'llanilishi."),
    ("Xulosa.", ""),
], style="List Number")

# --- 4. Asosiy qism ---------------------------------------------------------
doc.add_heading("4. Asosiy qism", level=1)

doc.add_heading("4.1. Nanokolloid sistemalarning umumiy tavsifi", level=2)
rich([
    ("Sferik zarracha uchun solishtirma sirt ", ""),
    ("S", "i"), ("sol", "i"), (" = 6/(ρ·d)", "b"),
    (" ifodasi bilan aniqlanadi: diametr 1 mkm dan 10 nm gacha kichraysa, "
     "sirt 100 marta ortadi (masalan, Au uchun ≈ 0,3 → 31 m²/g). Sirt "
     "atomlarining koordinatsion to'yinmaganligi ortiqcha Gibbs sirt "
     "energiyasini (", ""),
    ("G", "i"), ("s", "i"), (" = σ·S", "b"),
    (") yuzaga keltiradi — aynan shu energiya nanokolloidlarning "
     "termodinamik beqarorligi (agregatsiya, Ostvald yetilishi) va yuqori "
     "reaksion qobiliyatining manbaidir.", ""),
])

doc.add_heading("4.2. Zarracha o'lchamining ta'siri", level=2)
p("Termodinamik va kinetik o'lcham effektlari:", bold=True, after=2)
bullets([
    ("Eruvchanlik (Ostvald–Freyndlix): ", "ln(c_r/c_∞) = 2σV_m/(RT·r). Radius kichraygani sari eruvchanlik eksponensial ortadi — kichik zarrachalar eriydi, yiriklari o'sadi (Ostvald yetilishi)."),
    ("Erish harorati (Gibbs–Tomson): ", "ΔT_m ∝ 1/r. Masalan, 2–3 nm li Au zarrachalar ≈ 600 K da eriydi (massiv Au: 1337 K)."),
    ("Sedimentatsiya (Stoks): ", "v = 2r²(ρ−ρ₀)g/(9η) ∝ r². 10 nm li zarrachalar uchun Broun harakati (D = kT/6πηr) gravitatsiyadan ustun — sistema kinetik jihatdan cho'kmaydi."),
    ("Katalitik faollik: ", "sirtdagi qirra va burchak atomlari ulushi ortadi; Au 3–5 nm da CO oksidlanishida faol, massiv holda inert."),
])
p("Kvant va kollektiv effektlar:", bold=True, after=2)
bullets([
    ("Kvant-o'lcham effekti: ", "yarimo'tkazgich kvant nuqtalarda (CdSe, 2–8 nm) taqiqlangan zona kengligi E_g ∝ 1/r² qonuniyat bilan ortadi — rang ko'kdan qizilga siljiydi."),
    ("Sirt plazmon rezonansi (SPR): ", "Au nanozarrachalar 520 nm atrofida yutadi (qizil-binafsha), o'lcham ortishi va agregatsiya bilan cho'qqi qizil tomonga siljiydi — kolorimetrik sensorlar asosi."),
    ("Superparamagnetizm: ", "Fe₃O₄ zarrachalar ~20 nm dan kichik bo'lsa bir domenli bo'lib, qoldiq magnitlanishsiz kuchli javob beradi (MRT kontrast, magnit ajratish)."),
])

table(
    ["Xossa", "O'lcham kichraygan sari", "Asosiy qonuniyat"],
    [
        ["Solishtirma sirt", "keskin ortadi", "S = 6/(ρd)"],
        ["Eruvchanlik", "ortadi", "Ostvald–Freyndlix"],
        ["Erish harorati", "pasayadi", "Gibbs–Tomson, ΔT ∝ 1/r"],
        ["Cho'kish tezligi", "kamayadi (∝ r²)", "Stoks"],
        ["Diffuziya koeffitsienti", "ortadi (∝ 1/r)", "Stoks–Eynshteyn"],
        ["Taqiqlangan zona (QD)", "kengayadi", "E_g ∝ 1/r²"],
        ["Katalitik faollik", "ortadi", "qirra/burchak atomlar ulushi"],
    ],
    widths=[5, 5, 6.5],
)

doc.add_heading("4.3. Zarracha shaklining ta'siri", level=2)
p(
    "Bir xil hajmdagi zarrachalarda shakl o'zgarishi sirt/hajm nisbatini, "
    "ochiq kristall yuzalar turini va zaryad taqsimotini o'zgartiradi. "
    "Asosiy geometrik parametr — aspekt nisbati (AR = uzunlik/diametr).",
    align="j",
)
bullets([
    ("Optika: ", "Au nanotayoqchalarda ikkita plazmon cho'qqi hosil bo'ladi — ko'ndalang (≈ 520 nm) va bo'ylama; bo'ylama cho'qqi AR ortishi bilan yaqin IQ sohaga (700–1100 nm) siljiydi, bu fototermal terapiyada ishlatiladi."),
    ("Kataliz va selektivlik: ", "kub (100), oktaedr (111), tetraedr yuzalarining sirt energiyasi va adsorbsiya energiyasi farqlanadi; Pt kublari va oktaedrlari bir reaksiyada turli mahsulot selektivligini beradi."),
    ("Reologiya: ", "suyultirilgan sferik zollar uchun Eynshteyn tenglamasi η = η₀(1 + 2,5φ); nosferik zarrachalarda koeffitsient 2,5 dan katta va tizim tiksotrop/psevdoplastik xususiyat oladi (nanoglina, nanoselluloza)."),
    ("Barqarorlik va o'zaro ta'sir: ", "plastinkasimon va tayoqchasimon zarrachalar uchun van-der-Vaals tortishish geometriyaga bog'liq; qirra va uchlarda maydon kontsentratsiyasi ortadi (\"lightning rod\" effekti)."),
    ("Biologik javob: ", "tayoqchasimon zarrachalar sferiklarga nisbatan hujayra membranasidan boshqacha o'tadi; shakl toksiklik va sirkulyatsiya vaqtini belgilaydi."),
])

doc.add_heading("4.4. Sirt modifikatsiyasining ta'siri", level=2)
rich([
    ("DLVO nazariyasiga ko'ra zarrachalar orasidagi natijaviy energiya ", ""),
    ("U = U_el + U_vdW", "b"),
    (" — elektrostatik itarilish va van-der-Vaals tortishish yig'indisidir. "
     "Sirt modifikatsiyasining vazifasi energetik to'siq balandligini "
     "(> 15–25 kT) ta'minlab, zarrachalarni birlamchi minimumga tushishdan "
     "saqlashdir.", ""),
])
bullets([
    ("Elektrostatik stabilizatsiya: ", "ionogen ligandlar (sitrat, SDS, CTAB) qo'sh elektr qavat hosil qiladi; |ζ| > 30 mV — barqaror, |ζ| < 10 mV — koagulyatsiyaga moyil. Elektrolit qo'shilishi Debay uzunligini (κ⁻¹) qisqartirib, Shulse–Gardi qoidasi bo'yicha koagulyatsiya chaqiradi."),
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
        ["Optik/ lyuminessensiya", "SPR siljishi, kvant chiqish ↑", "CdSe → CdSe@ZnS"],
        ["Biouyg'unlik", "opsonizatsiya ↓, sirkulyatsiya ↑", "PEGillangan liposomalar (\"stealth\")"],
    ],
    widths=[4.2, 5.3, 7],
)

doc.add_heading("4.5. Tadqiqot va nazorat usullari", level=2)
table(
    ["Usul", "Aniqlanadigan parametr", "Izoh"],
    [
        ["DLS", "gidrodinamik diametr, PDI", "qobiq va solvat qavat bilan birga"],
        ["ζ-potensial (ELS)", "sirt zaryadi, barqarorlik", "pH va ion kuchiga bog'liq"],
        ["TEM / SEM", "haqiqiy o'lcham, shakl, qobiq", "\"quruq\" o'lcham"],
        ["XRD (Sherrer)", "kristallit o'lchami D = Kλ/(β cosθ)", "faza tarkibi"],
        ["UV-Vis", "SPR / E_g, agregatsiya", "tez va arzon nazorat"],
        ["FTIR, TGA", "ligand bog'lanishi va miqdori", "sirt kimyosi"],
        ["BET (N₂ adsorbsiya)", "solishtirma sirt, g'ovaklik", "kukun holatida"],
    ],
    widths=[4, 6, 6.5],
)

doc.add_heading("4.6. Amaliy ahamiyati", level=2)
bullets([
    "Tibbiyot: o'lcham (10–100 nm) va PEG qobiq EPR effekti orqali o'smaga tanlab to'planishni ta'minlaydi; Au nanotayoqchalar — fototermal terapiya; Fe₃O₄ — MRT va gipertermiya.",
    "Kataliz: o'lchami 2–5 nm va aniq yuzali Pt, Pd, Au nanozarrachalar — selektiv gidrogenlash va oksidlanish.",
    "Ekologiya va energetika: TiO₂, ZnO nanokolloidlar — fotokataliz va suvni tozalash; kvant nuqtalar — displeylar va quyosh elementlari.",
    "Sensorika: Au/Ag zollarining agregatsiyaga bog'liq rang o'zgarishi — og'ir metallar va biomolekulalarni kolorimetrik aniqlash.",
])

# --- 5. Xulosa --------------------------------------------------------------
doc.add_heading("5. Xulosa", level=1)
bullets([
    "Nanokolloidlarda xossalar tarkibdan ko'ra tuzilma bilan boshqariladi: o'lcham → termodinamika va kvant effektlari; shakl → anizotropiya va selektivlik; sirt → barqarorlik va funksionallik.",
    "O'lcham kichraygan sari solishtirma sirt, eruvchanlik, diffuziya va katalitik faollik ortadi, erish harorati va cho'kish tezligi pasayadi; 1–10 nm oralig'ida kvant-o'lcham effekti ustunlik qiladi.",
    "Shakl anizotropiyasi plazmon rezonansini IQ sohaga siljitish, kristall yuzalar orqali katalitik selektivlikni boshqarish va reologik xossalarni o'zgartirish imkonini beradi.",
    "Sirt modifikatsiyasi DLVO to'sig'ini oshirib agregativ barqarorlikni ta'minlaydi, zarrachani kerakli muhitga moslaydi va maqsadli funksiya beradi; |ζ| > 30 mV yoki sterik qobiq — barqarorlikning amaliy mezoni.",
    "Uchala omil o'zaro bog'liq, shuning uchun nanokolloidni loyihalashda ular birgalikda, DLS–TEM–ζ-potensial–UV-Vis kompleks nazorati ostida optimallashtirilishi lozim.",
], style="List Number")

# --- 6. Adabiyotlar ---------------------------------------------------------
doc.add_heading("Foydalanilgan adabiyotlar", level=1)
refs = [
    "Hiemenz P.C., Rajagopalan R. Principles of Colloid and Surface Chemistry. 3rd ed. – New York: Marcel Dekker, 1997.",
    "Cao G., Wang Y. Nanostructures and Nanomaterials: Synthesis, Properties and Applications. 2nd ed. – World Scientific, 2011.",
    "Israelachvili J.N. Intermolecular and Surface Forces. 3rd ed. – Academic Press, 2011.",
    "Roduner E. Size matters: why nanomaterials are different // Chem. Soc. Rev. – 2006. – Vol. 35. – P. 583–592.",
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
print("Saqlandi:", out)
