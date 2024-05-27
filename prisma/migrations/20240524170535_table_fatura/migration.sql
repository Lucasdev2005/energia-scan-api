-- CreateTable
CREATE TABLE "Fatura" (
    "FTR_Id" SERIAL NOT NULL,
    "FTR_NumeroCliente" TEXT NOT NULL,
    "FTR_Consumo_Energia" DOUBLE PRECISION NOT NULL,
    "FTR_Valor_Total" DOUBLE PRECISION NOT NULL,
    "FTR_Economia_GD" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("FTR_Id")
);
