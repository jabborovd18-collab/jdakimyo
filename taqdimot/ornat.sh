#!/usr/bin/env bash
# Kerakli kutubxonalarni o'rnatish va shriftlarni tayyorlash.
#
# NEGA SKRIPT KERAK: `pylib/` (Python kutubxonalari) repoda saqlanmaydi
# — u har yangi muhitda qaytadan o'rnatiladi. Shriftlar (`fonts/`)
# esa repoda: ular tarmoqsiz ham ishlashi kerak.
set -e
cd "$(dirname "$0")"

echo "▸ Python kutubxonalari..."
pip3 install --quiet --target ./pylib reportlab pypdfium2 pillow fonttools brotli

echo "▸ Shriftlar kesib olinmoqda..."
python3 tools/fontlar.py | tail -3

echo
echo "✅ Tayyor. Sinash uchun:"
echo "   python3 tools/render.py kontent/taqdimot.json -o chiqish/sinov.pdf"
echo "   python3 tools/preview.py chiqish/sinov.pdf"
