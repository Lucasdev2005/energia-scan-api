/*
  Warnings:

  - You are about to drop the column `FTR_Exercicio` on the `Fatura` table. All the data in the column will be lost.
  - Added the required column `FTR_Data_Referente` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "FTR_Exercicio",
ADD COLUMN     "FTR_Data_Referente" TEXT NOT NULL;
