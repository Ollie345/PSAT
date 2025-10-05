-- CreateTable
CREATE TABLE "prostate_assessment" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "consent_given" BOOLEAN NOT NULL DEFAULT false,
    "consent_timestamp" TIMESTAMP(3),
    "age" INTEGER NOT NULL,
    "sex" TEXT NOT NULL,
    "medical_conditions" JSONB NOT NULL DEFAULT '[]',
    "medications" TEXT,
    "family_history" TEXT,
    "surgeries" TEXT,
    "q1_incomplete_emptying" INTEGER,
    "q2_frequency" INTEGER,
    "q3_intermittency" INTEGER,
    "q4_urgency" INTEGER,
    "q5_weak_stream" INTEGER,
    "q6_straining" INTEGER,
    "q7_nocturia" INTEGER,
    "total_score" INTEGER,
    "severity_level" TEXT,
    "completed_at" TIMESTAMP(3),
    "lead_status" TEXT NOT NULL DEFAULT 'new',
    "lead_source" TEXT NOT NULL DEFAULT 'prostate_assessment',
    "follow_up_notes" TEXT,

    CONSTRAINT "prostate_assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prostate_assessment_email_key" ON "prostate_assessment"("email");
