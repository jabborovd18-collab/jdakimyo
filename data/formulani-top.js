const tarixi = (ishora, manba) => ({ ishora, manba })

function chiziq(atomlar, tartib = []) {
  const atomlarRoyxati = atomlar.split(' ')
  return {
    atomlar: atomlarRoyxati.map((belgi, i) => [belgi, 20 + 60 * i / (atomlarRoyxati.length - 1), 30]),
    boglar: atomlarRoyxati.slice(1).map((_, i) => [i, i + 1, tartib[i] || 1]),
  }
}

function markaz(belgi, chetlar) {
  return {
    atomlar: [[belgi, 50, 30], ...chetlar.map(([atom, x, y]) => [atom, x, y])],
    boglar: chetlar.map(([, , , tartib], i) => [0, i + 1, tartib || 1]),
  }
}

function tetraedr(markaziy, a, b, c, d) {
  return markaz(markaziy, [[a, 50, 8], [b, 25, 24], [c, 76, 24], [d, 54, 52]])
}

function egik(markaziy, a, b) {
  return markaz(markaziy, [[a, 25, 45], [b, 75, 45]])
}

function model(formula, nom, tuzilma, trivial = '', tarix = null) {
  return { formula, nom, tuzilma, trivial, tarix }
}

const molekulalar = [
  model('H₂', 'Vodorod', chiziq('H H'), '', tarixi(
    'Genri Kavendish 1766-yilda boshqa gazlardan farqlagan yonuvchan gazni toping.',
    'https://periodic-table.rsc.org/element/1/hydrogen')),
  model('O₂', 'Kislorod', chiziq('O O', [2]), '', tarixi(
    'Jozef Pristli 1774-yilda ajratib olgan, nafas olish uchun zarur gazni toping.',
    'https://www.sciencehistory.org/education/scientific-biographies/joseph-priestley/')),
  model('N₂', 'Azot', chiziq('N N', [3]), '', tarixi(
    'Daniel Rezerford 1772-yilda ilmiy ishida ta’riflagan, havoning asosiy qismini tashkil etuvchi gazni toping.',
    'https://periodic-table.rsc.org/element/7/nitrogen')),
  model('F₂', 'Ftor', chiziq('F F'), '', tarixi(
    'Anri Muassan 1886-yilda ajratib olgan galogenni toping.',
    'https://edu.rsc.org/elements/fluorine/2020008.article')),
  model('Cl₂', 'Xlor', chiziq('Cl Cl'), '', tarixi(
    'Karl Vilgelm Sheele 1774-yilda ajratib olgan sarg‘ish-yashil gazni toping.',
    'https://periodic-table.rsc.org/element/17/chlorine')),
  model('Br₂', 'Brom', chiziq('Br Br')),
  model('I₂', 'Yod', chiziq('I I')),
  model('HF', 'Vodorod ftorid', chiziq('H F')),
  model('HCl', 'Vodorod xlorid', chiziq('H Cl')),
  model('HBr', 'Vodorod bromid', chiziq('H Br')),
  model('HI', 'Vodorod yodid', chiziq('H I')),
  model('CO', 'Uglerod monoksid', chiziq('C O', [3]), 'Is gazi'),
  model('CO₂', 'Uglerod dioksid', chiziq('O C O', [2, 2]), 'Karbonat angidrid', tarixi(
    'Jozef Blek 1755-yilda aniqlagan va uning davrida bog‘langan havo deb atalgan gazni toping.',
    'https://www.sciencehistory.org/education/scientific-biographies/joseph-priestley/')),
  model('H₂O', 'Vodorod oksidi', egik('O', 'H', 'H'), 'Suv'),
  model('H₂S', 'Vodorod sulfid', egik('S', 'H', 'H')),
  model('O₃', 'Trioksigen', egik('O', 'O', 'O'), 'Ozon', tarixi(
    'Kristian Fridrix Shyonbayn 1840-yilda alohida modda deb ta’riflagan, chaqmoqdan keyin ham paydo bo‘ladigan gazni toping.',
    'https://www.sciencehistory.org/stories/magazine/a-killer-of-a-cure/')),
  model('NO', 'Azot monoksid', chiziq('N O', [2])),
  model('N₂O', 'Diazot monoksid', chiziq('N N O', [3, 1]), 'Kuldiruvchi gaz'),
  model('SO₂', 'Oltingugurt dioksid', markaz('S', [['O', 23, 45, 2], ['O', 77, 45, 2]])),
  model('SO₃', 'Oltingugurt trioksid', markaz('S', [['O', 50, 8, 2], ['O', 20, 47, 2], ['O', 80, 47, 2]])),
  model('NH₃', 'Azot trigidridi', markaz('N', [['H', 23, 36], ['H', 76, 35], ['H', 50, 51]]), 'Ammiak'),
  model('PH₃', 'Fosfor trigidridi', markaz('P', [['H', 23, 36], ['H', 76, 35], ['H', 50, 51]]), 'Fosfin'),
  model('CH₄', 'Metan', tetraedr('C', 'H', 'H', 'H', 'H'), 'Botqoq gazi'),
  model('CHCl₃', 'Trixlormetan', tetraedr('C', 'H', 'Cl', 'Cl', 'Cl'), 'Xloroform'),
  model('CCl₄', 'Tetraxlormetan', tetraedr('C', 'Cl', 'Cl', 'Cl', 'Cl')),
  model('CF₄', 'Tetraftormetan', tetraedr('C', 'F', 'F', 'F', 'F')),
  model('SiH₄', 'Kremniy tetragidridi', tetraedr('Si', 'H', 'H', 'H', 'H'), 'Silan'),
  model('HCN', 'Vodorod sianid', chiziq('H C N', [1, 3])),
  model('CS₂', 'Uglerod disulfid', chiziq('S C S', [2, 2])),
  model('H₂O₂', 'Vodorod peroksid', {
    atomlar: [['H', 15, 14], ['O', 38, 36], ['O', 62, 26], ['H', 85, 48]],
    boglar: [[0, 1, 1], [1, 2, 1], [2, 3, 1]],
  }),
]

export const FORMULA_TOP_MODDALAR = [
  ...molekulalar,
  ...[
    ['NaCl', 'Natriy xlorid', 'Osh tuzi'],
    ['NaHCO₃', 'Natriy gidrokarbonat', 'Ichimlik sodasi'],
    ['Na₂CO₃', 'Natriy karbonat', 'Kalsinatsiyalangan soda'],
    ['CaO', 'Kalsiy oksid', 'So‘ndirilmagan ohak'],
    ['Ca(OH)₂', 'Kalsiy gidroksid', 'So‘ndirilgan ohak'],
    ['CaCO₃', 'Kalsiy karbonat'],
    ['CaSO₄·2H₂O', 'Kalsiy sulfat digidrat', 'Gips'],
    ['CuSO₄·5H₂O', 'Mis ikki sulfat pentagidrat', 'Mis kuporosi'],
    ['NaOH', 'Natriy gidroksid', 'Kaustik soda'],
    ['KNO₃', 'Kaliy nitrat', 'Kaliy selitrasi'],
    ['H₂SO₄', 'Sulfat kislota'],
    ['HNO₃', 'Nitrat kislota'],
    ['KOH', 'Kaliy gidroksid'],
    ['MgO', 'Magniy oksid'],
    ['Al₂O₃', 'Alyuminiy oksid'],
    ['Fe₂O₃', 'Temir uch oksid'],
    ['FeO', 'Temir ikki oksid'],
    ['FeCl₂', 'Temir ikki xlorid'],
    ['FeCl₃', 'Temir uch xlorid'],
    ['CH₃COOH', 'Etan kislota', 'Sirka kislotasi'],
  ].map(([formula, nom, trivial]) => ({ formula, nom, trivial })),
]
export function formulaTopIshora(modda, daraja) {
  if (daraja === 4) return modda.tarix?.ishora
  if (daraja === 3 && !modda.tuzilma) return null
  const nom = daraja === 2 ? modda.trivial : modda.nom
  return nom ? `${nom} moddasini toping.` : null
}

export function formulaTopAudioNomi(daraja, indeks) {
  return `${daraja}-${String(indeks + 1).padStart(3, '0')}.mp3`
}
