/**
 * BRIF-02 namunasi — kimyoviy stakanning shisha qobig'ini `.glb` ga yozadi.
 *
 * NEGA O'ZIMIZ YASAYMIZ, YUKLAB OLMAYMIZ:
 * brif CC0 kutubxonadan model olishni taklif qiladi, lekin quvurni
 * isbotlash uchun tashqi fayl SHART EMAS — kerak bo'lgani formatning
 * haqiqiy `.glb` bo'lishi. O'zimiz yasaganda litsenziya savoli ham
 * yopiladi (loyihaning o'z ishi) va natija qat'iy: har ishga tushirishda
 * AYNAN bir xil bayt chiqadi.
 *
 * NEGA PROTSEDURALDAN YAXSHIROQ:
 * hozirgi stakan ikkita alohida silindr — devor va tub. Ular ulanmagan,
 * ya'ni shisha qalinligi yo'q va chetdan qaralganda idish "qog'ozdan"
 * ko'rinadi. Bu yerdagi profil esa haqiqiy kesim: tashqi devor, jiyak,
 * ichki devor, tub. Bitta yopiq qobiq.
 *
 * Ishga tushirish:
 *   node scripts/lab3d-model-yasa.js
 */

const fs = require("fs");
const path = require("path");

const CHIQISH = path.join(__dirname, "..", "public", "3d", "modellar");

// Stakan o'lchamlari — hozirgi protsedural model bilan BIR XIL, aks holda
// almashtirilganda idish sakrab ketardi (jihoz-modellari.js: stakanYasa).
const R = 0.08;        // tashqi radius
const H = 0.22;        // balandlik (og'iz balandligi)
const DEVOR = 0.004;   // shisha qalinligi
const TUB = 0.008;     // tub qalinligi
const SEGMENT = 48;    // aylana bo'ylab

/**
 * Aylantiriladigan profil — pastdan boshlanadi va yopiq kesim beradi:
 * tub tashqarisi -> tashqi devor -> jiyak -> ichki devor -> tub ichkarisi.
 */
const PROFIL = [
  [0, 0],
  [R, 0],
  [R, H],
  [R - DEVOR, H],
  [R - DEVOR, TUB],
  [0, TUB],
];

/** Profilni Y o'qi atrofida aylantirib mesh ma'lumotini hisoblaydi. */
function lathe(profil, segment) {
  const joy = [];
  const normal = [];
  const uv = [];
  const indeks = [];

  // Har profil nuqtasi uchun segment+1 nusxa (UV uchun oxirgisi takrorlanadi).
  for (let i = 0; i <= segment; i += 1) {
    const burchak = (i / segment) * Math.PI * 2;
    const sin = Math.sin(burchak);
    const cos = Math.cos(burchak);
    for (let j = 0; j < profil.length; j += 1) {
      const [r, y] = profil[j];
      joy.push(r * cos, y, r * sin);
      uv.push(i / segment, j / (profil.length - 1));

      // Normal profil urinmasiga perpendikulyar. Qo'shni nuqtalardan
      // olinadi; qirralarda bir tomonlama farq ishlatiladi.
      const oldin = profil[Math.max(0, j - 1)];
      const keyin = profil[Math.min(profil.length - 1, j + 1)];
      const dr = keyin[0] - oldin[0];
      const dy = keyin[1] - oldin[1];
      const uz = Math.hypot(dr, dy) || 1;
      // (dr, dy) urinma; unga perpendikulyar (dy, -dr).
      const nr = dy / uz;
      const ny = -dr / uz;
      normal.push(nr * cos, ny, nr * sin);
    }
  }

  const qator = profil.length;
  for (let i = 0; i < segment; i += 1) {
    for (let j = 0; j < qator - 1; j += 1) {
      const a = i * qator + j;
      const b = a + qator;
      indeks.push(a, b, a + 1);
      indeks.push(b, b + 1, a + 1);
    }
  }

  return { joy, normal, uv, indeks };
}

/** Ro'yxatni 4 baytga tekislaydi. */
function tekisla(uzunlik) {
  return (4 - (uzunlik % 4)) % 4;
}

/**
 * glTF 2.0 ikkilik konteynerini (GLB) yozadi.
 *
 * Uchinchi tomon eksporteri ishlatilmadi: `three/examples` dagi
 * GLTFExporter brauzer API lariga (FileReader, canvas) tayanadi va Node
 * da shim talab qiladi. Bitta mesh uchun konteyner ta'rifi qisqa va
 * o'zi yozilgani tushunarliroq.
 */
function glbYoz(mesh, nom) {
  const { joy, normal, uv, indeks } = mesh;

  const indeksBuf = Buffer.from(new Uint32Array(indeks).buffer);
  const joyBuf = Buffer.from(new Float32Array(joy).buffer);
  const normalBuf = Buffer.from(new Float32Array(normal).buffer);
  const uvBuf = Buffer.from(new Float32Array(uv).buffer);

  const bolaklar = [indeksBuf, joyBuf, normalBuf, uvBuf];
  const koRinishlar = [];
  let siljish = 0;
  for (const b of bolaklar) {
    koRinishlar.push({ buffer: 0, byteOffset: siljish, byteLength: b.length });
    siljish += b.length + tekisla(b.length);
  }
  const bin = Buffer.alloc(siljish);
  let yoz = 0;
  for (const b of bolaklar) {
    b.copy(bin, yoz);
    yoz += b.length + tekisla(b.length);
  }

  // POSITION uchun min/max MAJBURIY (glTF spetsifikatsiyasi).
  const min = [Infinity, Infinity, Infinity];
  const maks = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < joy.length; i += 3) {
    for (let k = 0; k < 3; k += 1) {
      min[k] = Math.min(min[k], joy[i + k]);
      maks[k] = Math.max(maks[k], joy[i + k]);
    }
  }

  const gltf = {
    asset: {
      version: "2.0",
      generator: "jdakimyo lab3d-model-yasa (BRIF-02)",
    },
    scene: 0,
    scenes: [{ nodes: [0], name: "Stakan_Sahna" }],
    nodes: [{ mesh: 0, name: nom }],
    meshes: [{
      name: nom,
      primitives: [{
        attributes: { POSITION: 1, NORMAL: 2, TEXCOORD_0: 3 },
        indices: 0,
        material: 0,
        mode: 4,
      }],
    }],
    materials: [{
      name: "Shisha_Zaxira",
      // Material sahnada `materiallar.shisha` bilan almashtiriladi;
      // bu yerdagi qiymat faqat modelni alohida ochganda ko'rinadi.
      pbrMetallicRoughness: {
        baseColorFactor: [0.81, 0.91, 1.0, 0.35],
        metallicFactor: 0.0,
        roughnessFactor: 0.08,
      },
      alphaMode: "BLEND",
      doubleSided: true,
    }],
    accessors: [
      { bufferView: 0, componentType: 5125, count: indeks.length, type: "SCALAR" },
      { bufferView: 1, componentType: 5126, count: joy.length / 3, type: "VEC3", min, max: maks },
      { bufferView: 2, componentType: 5126, count: normal.length / 3, type: "VEC3" },
      { bufferView: 3, componentType: 5126, count: uv.length / 2, type: "VEC2" },
    ],
    bufferViews: koRinishlar,
    buffers: [{ byteLength: bin.length }],
  };

  let json = Buffer.from(JSON.stringify(gltf), "utf8");
  const jsonTekis = tekisla(json.length);
  if (jsonTekis) json = Buffer.concat([json, Buffer.alloc(jsonTekis, 0x20)]); // probel

  const jamiUzunlik = 12 + 8 + json.length + 8 + bin.length;
  const bosh = Buffer.alloc(12);
  bosh.writeUInt32LE(0x46546c67, 0);   // "glTF"
  bosh.writeUInt32LE(2, 4);            // versiya
  bosh.writeUInt32LE(jamiUzunlik, 8);

  const jsonBosh = Buffer.alloc(8);
  jsonBosh.writeUInt32LE(json.length, 0);
  jsonBosh.writeUInt32LE(0x4e4f534a, 4); // "JSON"

  const binBosh = Buffer.alloc(8);
  binBosh.writeUInt32LE(bin.length, 0);
  binBosh.writeUInt32LE(0x004e4942, 4);  // "BIN\0"

  return Buffer.concat([bosh, jsonBosh, json, binBosh, bin]);
}

function asosiy() {
  fs.mkdirSync(CHIQISH, { recursive: true });
  const mesh = lathe(PROFIL, SEGMENT);
  const glb = glbYoz(mesh, "Stakan_Shisha");
  const fayl = path.join(CHIQISH, "stakan.glb");
  fs.writeFileSync(fayl, glb);

  const uchburchak = mesh.indeks.length / 3;
  const vertex = mesh.joy.length / 3;
  console.log(`yozildi: ${path.relative(process.cwd(), fayl)}`);
  console.log(`  hajm      ${(glb.length / 1024).toFixed(1)} KB`);
  console.log(`  vertex    ${vertex}`);
  console.log(`  uchburchak ${uchburchak}`);
  console.log(`  o'lcham   R=${R} H=${H} devor=${DEVOR} tub=${TUB}`);
}

asosiy();
