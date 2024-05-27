    import { validateOrReject } from "class-validator";
    import { Fatura } from "@prisma/client";
    import { CreateFaturaDTO } from "./types/createFaturaDTO";
    import { Prisma } from "../../utils/prisma";
    import { Paginate } from "../../utils/paginate";

    export class FaturaRepository {

        constructor(
            private prisma: Prisma
        ) {}

        public async createFatura(fatura: CreateFaturaDTO) {
            try {
                await validateOrReject(fatura);
                const t = this.prisma.fatura;
                const dataReferente = new Date(fatura.dataReferente);

                const foundNumeroFatura = await this.prisma.fatura.findFirst({
                    where: { 
                        FTR_NumeroCliente: fatura.numeroCliente,
                        FTR_Data_Referente: dataReferente
                    }
                });
                if (!foundNumeroFatura) {
                    return await this.prisma.fatura.create({
                        data: {
                            FTR_Valor_Total: fatura.energiaEletrica.valor + 
                                                fatura.energiaSCEEE.valor + 
                                                fatura.contribuicaoIlumPublica,
                            FTR_Consumo_Energia: fatura.energiaEletrica.quantidade + fatura.energiaSCEEE.quantidade,
                            FTR_Economia_GD: fatura.energiaCompensada.valor,
                            FTR_NumeroCliente: fatura.numeroCliente,
                            FTR_Data_Referente: dataReferente
                        }
                    });
                } else {
                    throw new Error("Fatura já cadastrada.");
                }
            } catch (e: any) {
                throw new Error(e);
            }
        }

        public async listarFaturas(paginate: Paginate, where: {FTR_NumeroCliente?: string}) {
            const list = await this.prisma.fatura.findMany({
                ... paginate.find(),
                where
            });

            return {
                data: list,
                metaData: paginate.getMetadata(await this.prisma.fatura.count())
            }
        }

        public async chart(where: {FTR_NumeroCliente?: string}) {
            const consumoPorMes = await this.prisma.fatura.groupBy({
                by: ['FTR_Data_Referente'],
                _sum: {
                    FTR_Consumo_Energia: true,
                },
                where
            });
        
            const valorTotalPorMes = await this.prisma.fatura.groupBy({
                by: ['FTR_Data_Referente'],
                _sum: {
                    FTR_Valor_Total: true,
                },
                where
            });
        
            const consumoArray = consumoPorMes.map((item) => {
                return {
                    name: this.formatDate(item.FTR_Data_Referente.toISOString()),
                    valor: item._sum.FTR_Consumo_Energia
                };
            });
        
            const valorTotalArray = valorTotalPorMes.map((item) => {
                return {
                    name: this.formatDate(item.FTR_Data_Referente.toISOString()),
                    valor: item._sum.FTR_Valor_Total
                };
            });
        
            return {
                consumoPorMes: consumoArray,
                valorTotalPorMes: valorTotalArray
            };
        }
        
        private formatDate(dateString: string): string {
            const date = new Date(dateString);
            const month = date.getUTCMonth() + 1;
            const year = date.getUTCFullYear();
            return `${month}/${year}`;
        }
        
    }