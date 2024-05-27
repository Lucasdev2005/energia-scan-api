import { PrismaClient } from '@prisma/client'; // Importe PrismaClient em vez de importar Prisma diretamente
import { FaturaRepository } from './fatura.repository';
import { CreateFaturaDTO } from './types/createFaturaDTO';

// Mockando o Prisma para evitar interações reais com o banco de dados
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    fatura: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  })),
}));

describe('FaturaRepository', () => {
  let faturaRepository: FaturaRepository;
  let prisma: PrismaClient; // Ajuste o tipo de prisma para PrismaClient

  beforeEach(() => {
    prisma = new PrismaClient(); // Inicialize prisma como PrismaClient
    faturaRepository = new FaturaRepository(prisma);
  });

  describe('createFatura', () => {
    it('deve criar uma nova fatura quando nenhuma fatura existente for encontrada', async () => {
      const mockCreateFaturaDTO: CreateFaturaDTO = {
        contribuicaoIlumPublica: 23,
        dataReferente: new Date(),
        energiaCompensada: { quantidade: 2, valor: 3 },
        energiaEletrica: { quantidade: 2, valor: 3 },
        energiaSCEEE: { quantidade: 2, valor: 3 },
        mesReferente: "janeiro",
        numeroCliente: "2423435"
      };

      (prisma.fatura.findFirst as jest.Mock).mockResolvedValueOnce(null);
      (prisma.fatura.create as jest.Mock).mockResolvedValueOnce({});

      await expect(faturaRepository.createFatura(mockCreateFaturaDTO)).resolves.not.toThrow();

      expect(prisma.fatura.findFirst).toHaveBeenCalled();
      expect(prisma.fatura.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('deve lançar um erro quando uma fatura existente for encontrada', async () => {
      const mockCreateFaturaDTO: CreateFaturaDTO = {
        contribuicaoIlumPublica: 23,
        dataReferente: new Date(),
        energiaCompensada: { quantidade: 2, valor: 3 },
        energiaEletrica: { quantidade: 2, valor: 3 },
        energiaSCEEE: { quantidade: 2, valor: 3 },
        mesReferente: "janeiro",
        numeroCliente: "2423435"
      };

      (prisma.fatura.findFirst as jest.Mock).mockResolvedValueOnce({});

      await expect(faturaRepository.createFatura(mockCreateFaturaDTO)).rejects.toThrowError('Fatura já cadastrada.');
      expect(prisma.fatura.findFirst).toHaveBeenCalled();
      expect(prisma.fatura.create).not.toHaveBeenCalled();
    });

    it('deve retornar os arrays de consumo por mês e valor total por mês', async () => {
        const consumoPorMesMock = [
          { FTR_Data_Referente: new Date('2024-01-01'), _sum: { FTR_Consumo_Energia: 100 } },
          { FTR_Data_Referente: new Date('2024-02-01'), _sum: { FTR_Consumo_Energia: 150 } },
        ];
        const valorTotalPorMesMock = [
          { FTR_Data_Referente: new Date('2024-01-01'), _sum: { FTR_Valor_Total: 500 } },
          { FTR_Data_Referente: new Date('2024-02-01'), _sum: { FTR_Valor_Total: 750 } },
        ];
  
        (prisma.fatura.groupBy as jest.Mock).mockResolvedValueOnce(consumoPorMesMock);
        (prisma.fatura.groupBy as jest.Mock).mockResolvedValueOnce(valorTotalPorMesMock);
  
        const result = await faturaRepository.chart({ FTR_NumeroCliente: '123' });
  
        expect(result.consumoPorMes).toEqual([
          { name: '1/2024', valor: 100 },
          { name: '2/2024', valor: 150 },
        ]);
        expect(result.valorTotalPorMes).toEqual([
          { name: '1/2024', valor: 500 },
          { name: '2/2024', valor: 750 },
        ]);
    });
  });

});
