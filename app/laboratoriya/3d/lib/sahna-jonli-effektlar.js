// Sahnadagi JONLI effektlar — alanga tebranishi va qaynash pufakchalari.
//
// `useSahna.js` dan ajratildi (BRIF-05). Har kadrda chaqiriladi va
// faqat `userData` da belgilangan ob'ektlarga tegadi.
//
// NEGA ALOHIDA FAYL: bu yagona joy bo'lib, animatsiya sikli sahnaning
// MAZMUNINI biladi (alanga, pufakcha). Qolgan sikl — render, DRS va
// yorliq jadvali — mazmundan mustaqil. Ular bir tanada turganda yangi
// effekt qo'shish har safar siklni ochishni talab qilardi.

export function jonliEffektlarniYangila(scene) {
  // 4-MUAMMO: Sahnadagi alanga tebranishi va qaynash pufakchalarini 60 FPS da harakatlantirish
  const vaqt = performance.now() * 0.006;
  scene.children.forEach((obj) => {
    if (obj.userData?.alanga && obj.userData.yoqilgan) {
      if (obj.userData.sariqAlanga) {
        obj.userData.sariqAlanga.scale.set(
          1 + Math.sin(vaqt * 2.5) * 0.08,
          1 + Math.cos(vaqt * 3.2) * 0.1,
          1 + Math.sin(vaqt * 2.1) * 0.08
        );
      }
      if (obj.userData.alangaNuri) {
        obj.userData.alangaNuri.intensity = 1.3 + Math.sin(vaqt * 4.0) * 0.35;
      }
    }

    if (obj.userData?.qaynashEffekti && obj.userData.qaynashEffekti.group?.visible) {
      const { geo, count, basePos, balandlik } = obj.userData.qaynashEffekti;
      if (geo?.attributes?.position) {
        const posArr = geo.attributes.position.array;
        for (let i = 0; i < count; i++) {
          posArr[i * 3 + 1] += basePos[i].speed;
          if (posArr[i * 3 + 1] > balandlik + 0.02) {
            posArr[i * 3 + 1] = 0.03;
          }
        }
        geo.attributes.position.needsUpdate = true;
      }
    }
  });
}
