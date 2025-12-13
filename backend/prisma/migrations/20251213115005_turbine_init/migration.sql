-- DropForeignKey
ALTER TABLE "Turbine" DROP CONSTRAINT "Turbine_createdBy_fkey";

-- AlterTable
ALTER TABLE "Turbine" ADD COLUMN     "updatedBy" TEXT,
ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Turbine" ADD CONSTRAINT "Turbine_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turbine" ADD CONSTRAINT "Turbine_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
