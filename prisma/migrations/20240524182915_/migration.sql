/*
  Warnings:

  - A unique constraint covering the columns `[FTR_NumeroCliente]` on the table `Fatura` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fatura_FTR_NumeroCliente_key" ON "Fatura"("FTR_NumeroCliente");
