// Sifat tekshiruvi tashqi modelga pul sarflamasdan, kimyo dvigateli va formula
// quvurining o'zgarmas xususiyatlarini tekshiradi. Jonli provayder ko'rigi alohida.

import { prisma } from "../prisma";
import { aiSifatNatijasiniHisobla } from "./ai-eval-core.js";

export async function aiSifatSinoviniIshgaTushir({ adminId = null, revision = 0, javobBeruvchi = null } = {}) {
  const boshlandi = Date.now();
  const hisoblangan = await aiSifatNatijasiniHisobla({ revision, javobBeruvchi });
  const natija = {
    ...hisoblangan,
    durationMs: Date.now() - boshlandi,
  };
  await prisma.aiEvalRun.create({ data: { ...natija, adminId } });
  return natija;
}
