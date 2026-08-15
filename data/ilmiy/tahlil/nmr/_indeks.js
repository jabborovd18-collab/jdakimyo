// data/ilmiy/tahlil/nmr/_indeks.js
//
// YaMR bo'limidagi birikmalarni bitta joyga yig'adi.
//
// NEGA STATIK IMPORT, DINAMIK EMAS. `import()` bilan fayl nomini ish
// vaqtida yasash mumkin edi, lekin unda Next.js qaysi fayllar
// kerakligini build paytida BILMAYDI: `generateStaticParams` bo'sh
// ro'yxat qaytaradi va sahifalar statik yasalmaydi. Statik import esa
// bundlerga to'liq ko'rinadi.
//
// Yangi birikma qo'shish: faylni shu papkaga qo'ying, quyida import
// qiling va `_usullar.js` dagi `tartib` ro'yxatiga kalitini yozing.

import alH2O6 from './al-h2o-6.js'
import coEn3 from './co-en-3.js'
import coNh35No2 from './co-nh3-5-no2.js'
import coNh35Ono from './co-nh3-5-ono.js'
import coNh36 from './co-nh3-6.js'
import feAcac3 from './fe-acac-3.js'
import feCn6 from './fe-cn-6.js'
import fePhen3 from './fe-phen-3.js'
import ptCl2Nh32Cis from './pt-cl2-nh3-2-cis.js'
import ptCl2Nh32Trans from './pt-cl2-nh3-2-trans.js'
import ptCl4 from './pt-cl4.js'
import rhPph33Cl from './rh-pph3-3-cl.js'

export const BIRIKMALAR = {
  'al-h2o-6': alH2O6,
  'co-en-3': coEn3,
  'co-nh3-5-no2': coNh35No2,
  'co-nh3-5-ono': coNh35Ono,
  'co-nh3-6': coNh36,
  'fe-acac-3': feAcac3,
  'fe-cn-6': feCn6,
  'fe-phen-3': fePhen3,
  'pt-cl2-nh3-2-cis': ptCl2Nh32Cis,
  'pt-cl2-nh3-2-trans': ptCl2Nh32Trans,
  'pt-cl4': ptCl4,
  'rh-pph3-3-cl': rhPph33Cl,
}

export default BIRIKMALAR
