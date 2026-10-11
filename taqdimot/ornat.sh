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

if command -v npm >/dev/null 2>&1; then
  echo "▸ Node kutubxonalari (PPTX tomoni)..."
  npm install --no-audit --no-fund --silent
else
  echo "  ⚠ npm topilmadi — PPTX chiqaruvi ishlamaydi (PDF tomoni baribir ishlaydi)."
fi

echo "▸ Shriftlar kesib olinmoqda..."
python3 tools/fontlar.py | tail -3

echo "▸ Mavzu sozlamalari chiqarilmoqda..."
python3 tools/theme-chiqar.py | head -1

echo
echo "✅ Tayyor. Sinash uchun:"
echo "   python3 tools/render.py kontent/taqdimot.json -o chiqish/sinov.pdf"
echo "   python3 tools/preview.py chiqish/sinov.pdf"
echo "   npm run pptx"
