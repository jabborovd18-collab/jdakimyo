# -*- coding: utf-8 -*-
"""
Mustaqil ta'lim hujjatlari uchun UMUMIY qurilma: .docx yig'uvchi + Word
tenglamalari (OMML) uchun mini-DSL.

Nega alohida modul: har bir mavzu skripti o'zida nusxa ko'tarsa, uslub
(shrift, maydon, jadval rangi) va OMML qurish mantig'i vaqt o'tishi bilan
ajralib ketadi — bir joyda tuzatilgan xato boshqasida qoladi.

Formulalar OMML da yoziladi: Word'da haqiqiy "Tenglama" bo'lib ochiladi,
kasr, indeks, ildiz va qavslar to'g'ri chiziladi. "ln(c_r/c_inf)" kabi
matnli yozuv ilmiy hujjatda o'qilmaydi.
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
XML_SPACE = "{http://www.w3.org/XML/1998/namespace}space"


# ============================================================================
# OMML mini-DSL
# ============================================================================
def _el(tag):
    return etree.Element("{%s}%s" % (M, tag))


def _wrap(tag, items):
    el = _el(tag)
    if not isinstance(items, (list, tuple)):
        items = [items]
    for it in items:
        el.append(it)
    return el


def T(text, plain=False):
    """Matematik run. plain=True — tik shrift (ln, cos, birliklar, sonlar)."""
    r = _el("r")
    if plain:
        rpr = etree.SubElement(r, "{%s}rPr" % M)
        sty = etree.SubElement(rpr, "{%s}sty" % M)
        sty.set("{%s}val" % M, "p")
    t = etree.SubElement(r, "{%s}t" % M)
    t.set(XML_SPACE, "preserve")
    t.text = text
    return r


def P(text):
    """Tik (plain) matn: sonlar, 'ln', 'cos', qisqartma indekslar."""
    return T(text, plain=True)


def V(text):
    """O'zgaruvchi (kursiv — Word'ning standart matematik uslubi)."""
    return T(text)


def seq(*items):
    return list(items)


def frac(num, den):
    return _wrap("f", [_wrap("num", num), _wrap("den", den)])


def sub(base, s):
    return _wrap("sSub", [_wrap("e", base), _wrap("sub", s)])


def sup(base, s):
    return _wrap("sSup", [_wrap("e", base), _wrap("sup", s)])


def subsup(base, s, p_):
    return _wrap("sSubSup", [_wrap("e", base), _wrap("sub", s), _wrap("sup", p_)])


def par(items, left="(", right=")"):
    """Avtomatik o'lchamli qavslar."""
    d = _el("d")
    dpr = etree.SubElement(d, "{%s}dPr" % M)
    b = etree.SubElement(dpr, "{%s}begChr" % M)
    b.set("{%s}val" % M, left)
    e = etree.SubElement(dpr, "{%s}endChr" % M)
    e.set("{%s}val" % M, right)
    d.append(_wrap("e", items))
    return d


def sqrt(items):
    rad = _el("rad")
    rpr = etree.SubElement(rad, "{%s}radPr" % M)
    dh = etree.SubElement(rpr, "{%s}degHide" % M)
    dh.set("{%s}val" % M, "1")
    rad.append(_el("deg"))
    rad.append(_wrap("e", items))
    return rad


def bar(items):
    """Ustki chiziq (o'rtacha qiymat, v̄ kabi)."""
    acc = _el("acc")
    apr = etree.SubElement(acc, "{%s}accPr" % M)
    chr_ = etree.SubElement(apr, "{%s}chr" % M)
    chr_.set("{%s}val" % M, "\u0305")
    acc.append(_wrap("e", items))
    return acc


def omath(*items):
    om = _el("oMath")
    for it in items:
        if isinstance(it, (list, tuple)):
            for x in it:
                om.append(x)
        else:
            om.append(it)
    return om


# ============================================================================
# Hujjat yig'uvchi
# ============================================================================
class Hujjat:
    def __init__(self):
        self.doc = Document()
        self.eq_no = 0
        for s in self.doc.sections:
            s.top_margin = Cm(2)
            s.bottom_margin = Cm(2)
            s.left_margin = Cm(2.5)
            s.right_margin = Cm(1.5)

        st = self.doc.styles["Normal"]
        st.font.name = FONT
        st.font.size = Pt(12)
        st.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
        st.paragraph_format.space_after = Pt(4)
        st.paragraph_format.line_spacing = 1.15

        for name, size in (("Heading 1", 14), ("Heading 2", 12.5)):
            h = self.doc.styles[name]
            h.font.name = FONT
            h.font.size = Pt(size)
            h.font.bold = True
            h.font.color.rgb = RGBColor(0x1F, 0x3A, 0x5F)
            h.element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
            h.paragraph_format.space_before = Pt(10)
            h.paragraph_format.space_after = Pt(4)

    # -- matn ----------------------------------------------------------------
    def h(self, text, level=1):
        return self.doc.add_heading(text, level=level)

    def p(self, text, bold=False, italic=False, align="j", size=None, after=None):
        para = self.doc.add_paragraph()
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

    def rich(self, parts, align="j", para=None):
        """parts: (matn, 'b'|'i'|'') kortejlar yoki OMML element (inline)."""
        if para is None:
            para = self.doc.add_paragraph()
        for item in parts:
            if isinstance(item, tuple):
                text, fmt = item
                r = para.add_run(text)
                r.bold = "b" in fmt
                r.italic = "i" in fmt
            else:
                para._p.append(item)
        if align == "j":
            para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        return para

    def equation(self, om, where=None):
        """Raqamlangan, markazlashgan tenglama (chegarasiz 2 ustunli jadval).
        where — "bu yerda ..." izohi uchun rich() qismlari."""
        self.eq_no += 1
        t = self.doc.add_table(rows=1, cols=2)
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        c0, c1 = t.rows[0].cells
        c0.width = Cm(14.5)
        c1.width = Cm(2.0)
        c0.paragraphs[0]._p.append(om)
        c0.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        c1.paragraphs[0].add_run("(%d)" % self.eq_no)
        c1.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        for c in (c0, c1):
            c.paragraphs[0].paragraph_format.space_after = Pt(2)
            c.paragraphs[0].paragraph_format.space_before = Pt(2)
        if where:
            para = self.doc.add_paragraph()
            para.add_run("bu yerda ")
            self.rich(where, para=para)
            para.paragraph_format.space_after = Pt(6)
        return self.eq_no

    def bullets(self, items, style="List Bullet"):
        for it in items:
            para = self.doc.add_paragraph(style=style)
            if isinstance(it, tuple):
                r = para.add_run(it[0])
                r.bold = True
                rest = it[1]
                if isinstance(rest, list):
                    self.rich(rest, para=para)
                else:
                    para.add_run(rest)
            elif isinstance(it, list):
                self.rich(it, para=para)
            else:
                para.add_run(it)
            para.paragraph_format.space_after = Pt(2)
            para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    @staticmethod
    def _shade(cell, hex_color):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = OxmlElement("w:shd")
        shd.set(qn("w:val"), "clear")
        shd.set(qn("w:color"), "auto")
        shd.set(qn("w:fill"), hex_color)
        tcPr.append(shd)

    def table(self, headers, rows, widths=None):
        t = self.doc.add_table(rows=1, cols=len(headers))
        t.style = "Table Grid"
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        for i, hd in enumerate(headers):
            c = t.rows[0].cells[i]
            c.text = ""
            r = c.paragraphs[0].add_run(hd)
            r.bold = True
            r.font.size = Pt(11)
            c.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
            self._shade(c, "DCE6F1")
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
        self.doc.add_paragraph().paragraph_format.space_after = Pt(2)
        return t

    def title(self, fan, mavzu):
        self.p("MUSTAQIL TA'LIM TOPSHIRIG'I", bold=True, align="c", size=13, after=2)
        self.p("Fan: " + fan, italic=True, align="c", size=11, after=10)
        self.p(mavzu, bold=True, align="c", size=14, after=10)

    def refs(self, items):
        self.h("Foydalanilgan adabiyotlar", 1)
        for i, r in enumerate(items, 1):
            para = self.doc.add_paragraph()
            para.add_run(f"{i}. {r}").font.size = Pt(11)
            para.paragraph_format.space_after = Pt(2)
            para.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    def save(self, path):
        self.doc.save(path)
        print("Saqlandi:", path, "| tenglamalar soni:", self.eq_no)
