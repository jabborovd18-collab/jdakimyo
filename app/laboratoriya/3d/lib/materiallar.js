import * as THREE from "three";
import { RANGLAR } from "./sozlama.js";
import { fonOl } from "./fonlar.js";

// Materiallarni BIR MARTA yaratib, barcha modellarda qayta ishlatamiz.
// Nega: har bir idish uchun alohida material yasalsa, 20 ta idish bo'lganda GPU xotirasi
// va draw-call sarfi ortib, render sekinlashadi.
//
// `fonKaliti` — tanlangan fon mavzusi (fonlar.js). Shisha va stol rangi
// fonga bog'liq: oq fonda och-havorang shisha ham, to'q binafsha stol ham
// o'rinsiz ko'rinadi.
//
// `arzonRejim` — kuchsiz qurilma aniqlanganda true. Ilgari bu yerda
// `shishaArzon` degan ikkinchi material yaratilardi, lekin uni HECH KIM
// chaqirmasdi: jihoz-modellari.js har doim `materiallar.shisha` ni olardi.
// Ya'ni arzon rejim shishaga umuman ta'sir qilmagan. Endi qaysi material
// yaratilishi shu yerda hal bo'ladi va chaqiruvchi tomon o'zgarmaydi.
export function materiallarniYarat(fonKaliti, arzonRejim = false) {
  const fon = fonOl(fonKaliti);
  const muhitKuchi = fon.muhitKuchi ?? 0.5;

  // Shisha. Nega `opacity` 1 va shaffoflik `transmission` orqali beriladi:
  // ikkalasi birga ishlatilganda ular bir-birini yeydi — transmission nurni
  // o'tkazadi, opacity esa o'sha o'tgan nurni yana susaytiradi va idish
  // butunlay ko'rinmay qoladi. Aynan shuning uchun probirka bo'sh sahnada
  // zo'rg'a bilinardi.
  //
  // `thickness` ham kamaytirildi: 0.4 probirkaning radiusidan (0.045) o'n
  // barobar katta edi, ya'ni ingichka naycha qalin shisha g'o'la kabi
  // hisoblanib, ichidagi hamma narsani qoraytirardi.
  const shisha = arzonRejim
    ? new THREE.MeshStandardMaterial({
        color: fon.shisha,
        transparent: true,
        opacity: 0.34,
        roughness: 0.1,
        metalness: 0,
        envMapIntensity: muhitKuchi,
        side: THREE.DoubleSide,
      })
    : new THREE.MeshPhysicalMaterial({
        color: fon.shisha,
        transparent: true,
        opacity: 1,
        roughness: 0.06,
        metalness: 0,
        transmission: 0.92,
        thickness: 0.03,
        ior: 1.5,
        envMapIntensity: muhitKuchi,
        side: THREE.DoubleSide,
      });

  const metall = new THREE.MeshStandardMaterial({
    color: RANGLAR.metall,
    roughness: 0.3,
    metalness: 0.85,
    envMapIntensity: muhitKuchi,
  });

  const chinni = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.6,
    metalness: 0.05,
    envMapIntensity: muhitKuchi,
  });

  const yogoch = new THREE.MeshStandardMaterial({
    color: fon.stol,
    roughness: 0.8,
    metalness: 0.1,
    envMapIntensity: muhitKuchi * 0.6,
  });

  const rezina = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
    metalness: 0,
    envMapIntensity: muhitKuchi * 0.4,
  });

  // Pol. Stol ostida hech nima bo'lmagani uchun sahna "havoda osilgan taxta"
  // bo'lib ko'rinardi — soyaning tushadigan joyi ham yo'q edi.
  const pol = new THREE.MeshStandardMaterial({
    color: fon.pol ?? fon.fon,
    roughness: 0.95,
    metalness: 0,
    envMapIntensity: muhitKuchi * 0.35,
  });

  return {
    shisha,
    metall,
    chinni,
    yogoch,
    rezina,
    pol,
    // Jihoz modellari suyuqlik materialini o'zi yasaydi — arzon rejimni
    // shu bayroq orqali biladi, aks holda unga alohida argument uzatish
    // uchun `jihozYasa` imzosini butun kod bo'ylab o'zgartirish kerak edi.
    arzon: arzonRejim,
  };
}

// Fon mavzusi almashganda sahnani qaytadan qurmasdan materiallarni yangilash.
// Nega qayta qurilmaydi: idishdagi eritma, quyilgan hajm va jurnal sahna
// ichida yashaydi — sahna o'chirilsa foydalanuvchining butun tajribasi
// yo'qolardi va fon tanlash "hammasini boshdan boshlash" degani bo'lardi.
export function materiallarniFongaMoslash(materiallar, fonKaliti) {
  if (!materiallar) return;
  const fon = fonOl(fonKaliti);
  const muhitKuchi = fon.muhitKuchi ?? 0.5;

  materiallar.shisha?.color.setHex(fon.shisha);
  materiallar.yogoch?.color.setHex(fon.stol);
  materiallar.pol?.color.setHex(fon.pol ?? fon.fon);

  // Muhit xaritasining kuchi ham mavzu bilan birga o'zgaradi: qorong'u
  // sahnada to'liq kuch bersak, idishlar fonda sun'iy yaltirab turadi.
  if (materiallar.shisha) materiallar.shisha.envMapIntensity = muhitKuchi;
  if (materiallar.metall) materiallar.metall.envMapIntensity = muhitKuchi;
  if (materiallar.chinni) materiallar.chinni.envMapIntensity = muhitKuchi;
  if (materiallar.yogoch) materiallar.yogoch.envMapIntensity = muhitKuchi * 0.6;
  if (materiallar.rezina) materiallar.rezina.envMapIntensity = muhitKuchi * 0.4;
  if (materiallar.pol) materiallar.pol.envMapIntensity = muhitKuchi * 0.35;
}

// Har bir yangi aralashma (eritma) uchun dinamik material yaratish funksiyasi.
// Nega suyuqlik materiali alohida yaratiladi: har bir idish ichidagi moddalarning
// hajmi va rangi o'ziga xos bo'lgani uchun uning rangi va shaffofligi alohida o'zgaradi.
//
// `emissive` ataylab qo'shilgan: eritma rangi faqat tushayotgan yorug'likka
// bog'liq bo'lsa, qorong'i sahnada CuO yoki I₂ kabi to'q moddalar fon bilan
// qo'shilib ketardi. Kuchsiz o'z-o'zidan yorishish rangni har qanday fonda
// ajratib turadi, lekin neon effekt bermaydi.
export function suyuqlikYasa(rang = 0xffffff, shaffoflik = 0.7, arzon = false) {
  const ochiqlik = Math.min(1.0, Math.max(0.1, shaffoflik));

  if (arzon) {
    return new THREE.MeshStandardMaterial({
      color: rang,
      emissive: rang,
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: ochiqlik,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color: rang,
    emissive: rang,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: ochiqlik,
    roughness: 0.08,
    // Ilgari 0.55 edi: yuqori transmission rangni yuvib yuborardi va
    // ko'k CuSO₄ ham deyarli rangsiz ko'rinardi.
    transmission: 0.3,
    ior: 1.33,
    side: THREE.DoubleSide,
  });
}

// Yaratilgan barcha materiallarni GPU xotirasidan tozalash.
// Nega: useEffect unmount bo'lganda dispose() qilinmasa, WebGL kontekstida xotira sizishi
// (memory leak) yuz beradi.
export function materiallarniTozala(materiallar) {
  if (!materiallar) return;

  Object.values(materiallar).forEach((material) => {
    if (material && typeof material.dispose === "function") {
      material.dispose();
    }
  });
}
