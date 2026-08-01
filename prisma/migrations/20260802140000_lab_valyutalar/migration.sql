-- Laboratoriya valyutalari.
--
-- `stars` reyting va daraja ochkosi bo'lib qoladi va SARFLANMAYDI: agar u
-- sarflansa, xarid qilgan foydalanuvchi leaderboard'da pastga tushib,
-- o'ynagani uchun jazolangan bo'lardi.
--
-- coins — arzon posilka va oddiy jihoz uchun, missiyadan topiladi.
-- gems  — ruda namunasi va nodir reagent uchun, kam topiladi.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "coins" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "gems" INTEGER NOT NULL DEFAULT 0;
