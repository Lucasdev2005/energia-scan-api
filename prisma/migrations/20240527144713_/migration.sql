/*
  Warnings:

  - Changed the type of `FTR_Data_Referente` on the `Fatura` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "FTR_Data_Referente",
ADD COLUMN     "FTR_Data_Referente" TIMESTAMP(3) NOT NULL;
