import fs from "node:fs/promises";
import path from "node:path";
import {
  masalaPdfChromiumdaYarat,
  pdfChromiumniYop,
} from "../lib/masala-pdf-chromium.js";

const chiqish = path.join(process.cwd(), "output", "pdf", "jda-kimyo-ai-premium-namuna.pdf");

const natija = {
  masalaMatni: "Ikki bosqichli reaksiyaning tezlik tenglamasini tahlil qiling va uglerodning 2p orbitali bilan bog'lanish yo'nalishini ko'rsating.",
  berilgan: [
    { belgi: "k", qiymat: "0.25 s^{-1}" },
    { belgi: "C_0", qiymat: "0.80 mol/L" },
  ],
  topishKerak: [
    { belgi: "C(t)", nom: "Vaqtga bog'liq konsentratsiya" },
    { belgi: "t_{1/2}", nom: "Yarim yemirilish vaqti" },
  ],
  tenglamalar: [
    String.raw`\ce{2H2(g) + O2(g) -> 2H2O(l)}`,
    String.raw`\ce{Fe^{3+} + SCN^- <=> FeSCN^{2+}}`,
  ],
  tuzoqTahlili: {
    kalitNuqta: "Reaksiya tartibi stexiometrik koeffitsiyentdan avtomatik olinmaydi.",
    nimaUchunMuhim: "Tezlik qonuni tajriba ma'lumotidan aniqlanadi.",
    kengTarqalganXato: "Birliklarni tekshirmasdan k qiymatini formulaga qo'yish.",
  },
  yonalish: {
    formulalar: [
      String.raw`\frac{dC}{dt}=-kC`,
      String.raw`C(t)=C_0e^{-kt}`,
      String.raw`A=\begin{pmatrix}1&2\\3&4\end{pmatrix},\qquad \det(A)=-2`,
      String.raw`f(x)=\begin{cases}x^2,&x<0\\\sqrt{x+1},&x\ge 0\end{cases}`,
      String.raw`\int_0^\infty x^2e^{-x}\,dx=\Gamma(3)=2!`,
    ],
    qadamlarRejasi: [
      "Differensial tenglamani ajraluvchi o'zgaruvchilar usulida yechish.",
      "Boshlang'ich shartni qo'llash va birliklarni tekshirish.",
    ],
  },
  bosqichlar: [
    {
      sarlavha: "1-bosqich: integrallash",
      tushuntirish: "Konsentratsiya va vaqt hadlarini alohida tomonlarga ajratamiz.",
      formula: String.raw`\int_{C_0}^{C(t)}\frac{dC}{C}=-\int_0^t k\,dt`,
    },
    {
      sarlavha: "2-bosqich: natijani tekshirish",
      tushuntirish: "Eksponent darajasi o'lchovsiz: k ning birligi s^{-1}, vaqt esa s.",
      formula: String.raw`[k][t]=\mathrm{s}^{-1}\!\cdot\mathrm{s}=1`,
    },
  ],
  vizual: {
    jadvallar: [{
      sarlavha: "Konsentratsiyaning vaqt bo'yicha o'zgarishi",
      ustunlar: ["t, s", "C(t), mol/L", "C/C_0"],
      qatorlar: [
        ["0", "0.800", "1.000"],
        ["2", "0.485", "0.607"],
        ["4", "0.294", "0.368"],
        ["6", "0.179", "0.223"],
      ],
    }],
    grafiklar: [{
      turi: "chiziqli",
      sarlavha: "C(t) eksponensial kamayishi",
      xNomi: "t, s",
      yNomi: "C, mol/L",
      nuqtalar: [
        { nom: "0", qiymat: 0.8 },
        { nom: "2", qiymat: 0.485 },
        { nom: "4", qiymat: 0.294 },
        { nom: "6", qiymat: 0.179 },
      ],
    }],
    orbitallar: [
      { turi: "2p_x", atom: "C", sarlavha: "Uglerodning 2p_x elektron buluti" },
      { turi: "3d_z2", atom: "Fe", sarlavha: "Temirning 3d_z2 orbital kesimi" },
    ],
  },
  yakuniyJavob: String.raw`$$C(t)=0.80e^{-0.25t}\ \mathrm{mol/L},\qquad t_{1/2}=\frac{\ln 2}{k}=2.77\ \mathrm{s}$$`,
};

try {
  await fs.mkdir(path.dirname(chiqish), { recursive: true });
  const pdf = await masalaPdfChromiumdaYarat({
    foydalanuvchiNom: "JDA Kimyo sinovi",
    masalaMatni: natija.masalaMatni,
    natija,
    sana: new Date("2026-09-01T10:00:00+05:00"),
  });
  await fs.writeFile(chiqish, pdf);
  console.log(chiqish);
} finally {
  await pdfChromiumniYop();
}
