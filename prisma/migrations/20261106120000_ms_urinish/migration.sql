-- CreateTable
CREATE TABLE "MsUrinish" (
    "id" TEXT NOT NULL,
    "sessiyaId" TEXT NOT NULL,
    "userId" TEXT,
    "slug" TEXT NOT NULL,
    "urinishTartibi" INTEGER,
    "theta" DOUBLE PRECISION NOT NULL,
    "se" DOUBLE PRECISION NOT NULL,
    "shkalaBalli" DOUBLE PRECISION NOT NULL,
    "daraja" TEXT NOT NULL,
    "rawScore" INTEGER NOT NULL,
    "jamiSavollar" INTEGER NOT NULL,
    "sarflanganVaqt" INTEGER NOT NULL,
    "kechikkan" BOOLEAN NOT NULL DEFAULT false,
    "boshlanganVaqt" TIMESTAMP(3) NOT NULL,
    "yakunlanganVaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MsUrinish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MsJavob" (
    "id" TEXT NOT NULL,
    "urinishId" TEXT NOT NULL,
    "savolKalit" TEXT NOT NULL,
    "togri" BOOLEAN NOT NULL,
    "javobBerildi" BOOLEAN NOT NULL,
    "qiyinlik" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MsJavob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MsUrinish_sessiyaId_key" ON "MsUrinish"("sessiyaId");

-- CreateIndex
CREATE INDEX "MsUrinish_slug_idx" ON "MsUrinish"("slug");

-- CreateIndex
CREATE INDEX "MsUrinish_userId_slug_idx" ON "MsUrinish"("userId", "slug");

-- CreateIndex
CREATE INDEX "MsJavob_savolKalit_idx" ON "MsJavob"("savolKalit");

-- CreateIndex
CREATE UNIQUE INDEX "MsJavob_urinishId_savolKalit_key" ON "MsJavob"("urinishId", "savolKalit");

-- AddForeignKey
ALTER TABLE "MsUrinish" ADD CONSTRAINT "MsUrinish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MsJavob" ADD CONSTRAINT "MsJavob_urinishId_fkey" FOREIGN KEY ("urinishId") REFERENCES "MsUrinish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

