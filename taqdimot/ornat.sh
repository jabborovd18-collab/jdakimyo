#!/usr/bin/env bash
# Kerakli kutubxonalarni o'rnatish va shriftlarni tayyorlash.
#
# NEGA SKRIPT KERAK: `pylib/` (Python kutubxonalari) va `node_modules/`
# repoda saqlanmaydi — ular har yangi muhitda qaytadan o'rnatiladi.
# Shriftlar (`fonts/`) va kontent esa repoda: ular tarmoqsiz ishlaydi.
set -e
cd "$(dirname "$0")"

echo "▸ Python kutubxonalari (PDF tomoni)..."
pip3 install --quiet --target ./pylib reportlab pypdfium2 pillow fonttools brotli

# python-pptx faqat PPTX ni O'LCHASH uchun kerak (pptx-tekshir.py);
# chiqarish tomoni Node'da. O'rnatilmasa PDF tomoni baribir ishlaydi.
if ! PYTHONPATH=pylib python3 -c "import pptx" 2>/dev/null; then
  echo "▸ python-pptx (PPTX o'lchovi)..."
  pip3 install --quiet --target ./pylib python-pptx || \
    echo "  ⚠ python-pptx o'rnatilmadi — PPTX tekshiruvi ishlamaydi."
fi

if command -v npm >/dev/null 2>&1; then
  echo "▸ Node kutubxonalari (PPTX tomoni)..."
  npm install --no-audit --no-fund --silent
else
  echo "  ⚠ npm topilmadi — PPTX chiqaruvi ishlamaydi (PDF tomoni baribir ishlaydi)."
fi

echo "▸ Shriftlar kesib olinmoqda..."
python3 tools/fontlar.py | tail -3

echo "▸ PPTX uchun rasm nusxalari..."
python3 tools/rasm-fon.py | tail -1
python3 tools/pptx-rasm.py

echo "▸ Mavzu sozlamalari chiqarilmoqda..."
python3 tools/theme-chiqar.py | head -1

echo
echo "✅ Tayyor. Sinash uchun:"
echo "   python3 tools/render.py kontent/taqdimot.json -o chiqish/sinov.pdf --shrift times"
echo "   python3 tools/ustma-ust.py chiqish/sinov.pdf"
echo "   python3 tools/preview.py chiqish/sinov.pdf"
echo "   npm run pptx -- --shrift times"
