/*
  Warnings:

  - You are about to drop the column `inspectorName` on the `Inspection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[turbineId,date]` on the table `Inspection` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inspectorId` to the `Inspection` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Inspection_turbineId_date_idx";

-- AlterTable
ALTER TABLE "Inspection" DROP COLUMN "inspectorName",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "inspectorId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedBy" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Inspection_turbineId_date_key" ON "Inspection"("turbineId", "date");

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
