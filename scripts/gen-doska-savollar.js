// scripts/gen-doska-savollar.js
//
// Ushbu skript C:/Users/MixCom/Desktop/jdakimyoquiz/KK_M4_QUIZ_SAVOLLAR.txt
// faylidagi 80 ta savolni o'qib, data/doska/adsorbsiya-savollar.js ga o'tkazadi.
const fs = require('fs');
const path = require('path');

const filePath = 'C:/Users/MixCom/Desktop/jdakimyoquiz/KK_M4_QUIZ_SAVOLLAR.txt';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let currentSection = '';
const questions = [];
let curQ = null;

for (let line of lines) {
  line = line.trim();
  if (line.startsWith('===') && line.endsWith('===')) {
    currentSection = line.replace(/===/g, '').trim();
    continue;
  }
  const match = line.match(/^(\d{2})\.\s*(.*)/);
  if (match) {
    if (curQ) questions.push(curQ);
    curQ = {
      id: parseInt(match[1], 10),
      savol: match[2],
      bolim: currentSection,
      variantlar: [],
      togriJavob: -1,
      slayd: '',
      izoh: '',
      daraja: 1,
    };
    continue;
  }
  if (!curQ) continue;
  if (line.startsWith('+') || line.startsWith('-')) {
    const isCorrect = line.startsWith('+');
    const text = line.substring(1).trim();
    curQ.variantlar.push(text);
    if (isCorrect) {
      curQ.togriJavob = curQ.variantlar.length - 1;
    }
  } else if (line.startsWith('Slayd:')) {
    curQ.slayd = line.replace('Slayd:', '').trim();
  } else if (line.startsWith('Izoh:')) {
    curQ.izoh = line.replace('Izoh:', '').trim();
  }
}
if (curQ) questions.push(curQ);

// Hisoblashlar va chuqur tahlil savollari:
const hisoblar = new Set([23, 31, 32, 43, 48, 61, 62, 79, 39, 40, 46, 58, 64, 66, 71, 72]);
const orta = new Set([9, 10, 15, 21, 25, 26, 29, 30, 33, 37, 38, 41, 42, 44, 45, 47, 49, 50, 54, 55, 56, 57, 59, 60, 63, 65, 67, 68, 69, 73, 74, 75, 76, 77, 80]);

for (const q of questions) {
  if (hisoblar.has(q.id)) {
    q.daraja = 3;
  } else if (orta.has(q.id)) {
    q.daraja = 2;
  } else {
    q.daraja = 1;
  }
}

const dir = path.join(process.cwd(), 'data', 'doska');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const header = `// data/doska/adsorbsiya-savollar.js
//
// KK_M4 — Adsorbsiya jarayonlari va izotermalari bo'yicha 80 ta test savollari.
// Manba: Bahora Nayimova ma'ruza slaydlari (KK_M4.pdf).
// Test tuzuvchisi: @diyorbek_jabborov
//
// Darajalar:
//   1 = Oson (nazariya va asosiy tushunchalar) -> 5 ball
//   2 = O'rta (formulalar va bog'liqliklar) -> 10 ball
//   3 = Murakkab (hisob-kitob va modellar) -> 15 ball
export const ADSORBSIYA_SAVOLLARI = `;

fs.writeFileSync(path.join(dir, 'adsorbsiya-savollar.js'), header + JSON.stringify(questions, null, 2) + ';\n', 'utf8');

console.log('Tayyor! Jami savollar:', questions.length);
console.log('Daraja 1 (Oson):', questions.filter(q => q.daraja === 1).length);
console.log('Daraja 2 (O\'rta):', questions.filter(q => q.daraja === 2).length);
console.log('Daraja 3 (Murakkab):', questions.filter(q => q.daraja === 3).length);
