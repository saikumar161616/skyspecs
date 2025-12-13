/*
  Warnings:

  - Added the required column `status` to the `Turbine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turbine" ADD COLUMN     "status" TEXT NOT NULL;
