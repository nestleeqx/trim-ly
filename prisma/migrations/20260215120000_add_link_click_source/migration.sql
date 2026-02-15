-- AlterTable
ALTER TABLE "LinkClickEvent"
ADD COLUMN "source" TEXT;

-- CreateIndex
CREATE INDEX "LinkClickEvent_source_clickedAt_idx"
ON "LinkClickEvent"("source", "clickedAt");
