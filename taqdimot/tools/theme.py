"""Dizayn tizimi — rang, shrift, o'lcham.

NEGA ALOHIDA FAYL. Slayd dvigateli (`render.py`) va kelajakdagi boshqa
chiqaruvchilar bir xil rangni ishlatishi shart. Rang ikki faylda
yozilsa, biri o'zgartirilganda ikkinchisi eskirib qoladi.

Har bir mavzu — mustaqil to'plam. Yangi mavzu qo'shish uchun shu yerga
bitta lug'at yozish kifoya.
"""

from reportlab.lib.colors import HexColor

SHRIFTLAR = {
    "matn": "Inter-Regular.ttf",
    "matn-o": "Inter-Medium.ttf",
    "matn-yarim": "Inter-SemiBold.ttf",
    "matn-q": "Inter-Bold.ttf",
    "matn-j": "Inter-ExtraBold.ttf",
    "sarlavha": "Manrope-SemiBold.ttf",
    "sarlavha-q": "Manrope-Bold.ttf",
    "sarlavha-j": "Manrope-ExtraBold.ttf",
    "serif": "Playfair-Regular.ttf",
    "serif-q": "Playfair-Bold.ttf",
    # Zaxira: ∠ ⇌ ≡ → ≈ — asosiy shriftlarda yo'q, lekin kimyo matnida
    # kerak. Yetishmagan belgi shu yerdan olinadi.
    "belgi": "NotoSansMath-Regular.ttf",
}

ZAXIRA_SHRIFTLAR = ("belgi",)

SAHIFA = (1280, 720)
CHEKKA = 92
YUQORI = 74
PAST = 66

MAVZULAR = {
    # ── 1. SIYOH — to'q, olijanob, "olim ma'ruzasi" ohangi ──────────
    "siyoh": {
        "nom": "Siyoh",
        "tavsif": "Chuqur to'q fon, oltin urg'u — jiddiy, olijanob",
        "toqmi": True,
        "fon": ["#0A0E1A", "#141B2E"],
        "fon-burchak": ["#1B2440", "#0A0E1A"],
        "yuza": "#161E33",
        "yuza-chiziq": "#2A3552",
        "matn": "#F4F6FB",
        "xira": "#9AA6C4",
        "xira-2": "#6B7794",
        "urgu": "#E9C46A",
        "yorliq-rang": "#E9C46A",
        "urgu-2": "#5EEAD4",
        "urgu-matn": "#0A0E1A",
        "chiziq": "#26304A",
        "yorug-lak": ["#E9C46A", "#5EEAD4"],
        "lak-kuch": 0.075,
        "karta-oq": "#FFFFFF",
        "karta-matn": "#12161F",
        "karta-xira": "#5A6376",
    },
    # ── 2. OQ — klassik ilmiy jurnal ────────────────────────────────
    "oq": {
        "nom": "Oq ilmiy",
        "tavsif": "Oq fon, nozik chiziqlar — jurnal/himoya uslubi",
        "toqmi": False,
        "fon": ["#FFFFFF", "#F4F2EC"],
        "fon-burchak": ["#FBFAF7", "#EDEAE1"],
        "yuza": "#FFFFFF",
        "yuza-chiziq": "#E2DED2",
        "matn": "#12161F",
        "xira": "#5A6376",
        "xira-2": "#8B93A3",
        "urgu": "#8C1D2F",
        "yorliq-rang": "#8C1D2F",
        "urgu-2": "#0F5C58",
        "urgu-matn": "#FFFFFF",
        "chiziq": "#D9D4C7",
        "yorug-lak": ["#8C1D2F", "#C9A227"],
        "lak-kuch": 0.028,
        "karta-oq": "#FFFFFF",
        "karta-matn": "#12161F",
        "karta-xira": "#5A6376",
    },
    # ── 3. NEON — zamonaviy, gradientli ─────────────────────────────
    "neon": {
        "nom": "Neon",
        "tavsif": "To'q fon, binafsha-moviy gradient — zamonaviy",
        "toqmi": True,
        "fon": ["#0B1020", "#221046"],
        "fon-burchak": ["#3B1D6E", "#0B1020"],
        "yuza": "#1A1440",
        "yuza-chiziq": "#3B2E70",
        "matn": "#F7F5FF",
        "xira": "#B9B0E8",
        "xira-2": "#8D82C4",
        "urgu": "#7C5CFF",
        "yorliq-rang": "#C9BCFF",
        "urgu-2": "#22D3EE",
        "urgu-matn": "#FFFFFF",
        "chiziq": "#332A63",
        "yorug-lak": ["#7C5CFF", "#22D3EE"],
        "lak-kuch": 0.085,
        "karta-oq": "#FFFFFF",
        "karta-matn": "#12161F",
        "karta-xira": "#5A6376",
    },
}

MAVZU_SUKUT = "siyoh"


def mavzuOl(kalit):
    return MAVZULAR.get((kalit or "").strip().lower(), MAVZULAR[MAVZU_SUKUT])


def rang(qiymat):
    return HexColor(qiymat)


SARLAVHA_OLCHAM = [56, 48, 42, 36]
SARLAVHA_OLCHAM_MUQOVA = [86, 74, 64, 54]
MATN_OLCHAM = 22
BAND_OLCHAM = 22
BAND_QATOR = 1.5


def sarlavhaOlchami(matn, muqova=False):
    """Sarlavha uzunligiga mos o'lcham.

    NEGA KERAK: bitta qatorga sig'magan sarlavha ikkinchi qatorga
    tushib, sahifaning pastki qismini bosib ketardi. Shuning uchun
    uzunlik bo'yicha o'lcham oldindan tanlanadi.
    """
    belgi = len(matn or "")
    chegaralar = SARLAVHA_OLCHAM_MUQOVA if muqova else SARLAVHA_OLCHAM
    for i, chegara in enumerate((26, 46, 68)):
        if belgi <= chegara:
            return chegaralar[i]
    return chegaralar[3]
