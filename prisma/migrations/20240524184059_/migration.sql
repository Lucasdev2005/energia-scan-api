/*
  Warnings:

  - Added the required column `FTR_Exercicio` to the `Fatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fatura" ADD COLUMN     "FTR_Exercicio" TEXT NOT NULL;
