-- IP bo'yicha tezlik cheklovi.
--
-- Hisob bo'yicha to'siq allaqachon bor edi (User.kirishTaqiqUntil),
-- lekin IP bo'yicha yo'q: bitta kompyuterdan istalgancha hisob ochish
-- mumkin edi va har biri tasdiqlash xatini yuborardi.
CREATE TABLE "SorovLimit" (
    "id" TEXT NOT NULL,
    "kalit" TEXT NOT NULL,
    "soni" INTEGER NOT NULL DEFAULT 0,
    "oynaBoshi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yangilandi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SorovLimit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SorovLimit_kalit_key" ON "SorovLimit"("kalit");

-- Eski yozuvlarni tozalash shu indeks orqali ketadi
CREATE INDEX "SorovLimit_yangilandi_idx" ON "SorovLimit"("yangilandi");
