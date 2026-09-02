-- Faol AI siyosati: API kalitlari bu jadvalga yozilmaydi.
CREATE TABLE "ai_settings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "revision" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB NOT NULL,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_settings_pkey" PRIMARY KEY ("id")
);

-- Har nashrning o'zgarmas nusxasi rollback va audit uchun kerak.
CREATE TABLE "ai_config_versions" (
    "id" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "note" TEXT,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_config_versions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ai_config_versions_revision_key" ON "ai_config_versions"("revision");
CREATE INDEX "ai_config_versions_createdAt_idx" ON "ai_config_versions"("createdAt");

-- Xom prompt saqlanmaydi; bu jadval faqat shaxssizlantirilgan texnik o'lchovdir.
CREATE TABLE "ai_usage_events" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "direction" TEXT,
    "problemType" TEXT,
    "provider" TEXT,
    "model" TEXT,
    "status" TEXT NOT NULL,
    "errorCode" TEXT,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "cacheHit" BOOLEAN NOT NULL DEFAULT false,
    "deterministicUsed" BOOLEAN NOT NULL DEFAULT false,
    "fallbackIndex" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_usage_events_requestId_idx" ON "ai_usage_events"("requestId");
CREATE INDEX "ai_usage_events_createdAt_idx" ON "ai_usage_events"("createdAt");
CREATE INDEX "ai_usage_events_provider_createdAt_idx" ON "ai_usage_events"("provider", "createdAt");
CREATE INDEX "ai_usage_events_status_createdAt_idx" ON "ai_usage_events"("status", "createdAt");
CREATE INDEX "ai_usage_events_channel_createdAt_idx" ON "ai_usage_events"("channel", "createdAt");

CREATE TABLE "ai_eval_runs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "revision" INTEGER NOT NULL,
    "totalCases" INTEGER NOT NULL,
    "passed" INTEGER NOT NULL,
    "failed" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_eval_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_eval_runs_createdAt_idx" ON "ai_eval_runs"("createdAt");
CREATE INDEX "ai_eval_runs_revision_idx" ON "ai_eval_runs"("revision");
