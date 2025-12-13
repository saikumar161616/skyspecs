/*
  Warnings:

  - Added the required column `createdBy` to the `Turbine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turbine" ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Turbine" ADD CONSTRAINT "Turbine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
