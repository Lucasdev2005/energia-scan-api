import "reflect-metadata";
import { Request, Response } from "express";
import { FaturaService } from "../../service/fatura/fatura.service";
import { Paginate } from "../../utils/paginate";
import { FaturaController } from "./fatura.controller";
import { ArquivoService } from "../../service/arquivo/arquivo.service";
import { FaturaRepository } from "../../repository/fatura/fatura.repository";
import { Prisma } from "../../utils/prisma";

describe("FaturaController", () => {
    let faturaController: FaturaController;
    let faturaService: FaturaService;
    let arquivoService: ArquivoService;
    let faturaRepository: FaturaRepository;
    let prisma: Prisma;

    beforeEach(() => {
        arquivoService = new ArquivoService();
        faturaRepository = new FaturaRepository(prisma);
        faturaService = new FaturaService(arquivoService, faturaRepository);
        faturaController = new FaturaController(faturaService);
    });
    describe("extrairFatura", () => {
        it("deve retornar um status 400 quando o arquivo estiver ausente", async () => {
            let req!: Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

            await faturaController.extrairFatura(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("deve retornar um status 201 quando a fatura for extraída com sucesso", async () => {
            const req = { file: { buffer: Buffer.from("mockedBuffer") } } as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

            const mockedFaturaSalva = {
                FTR_Id: 1,
                FTR_Consumo_Energia: 2,
                FTR_Data_Referente: new Date(),
                FTR_Economia_GD: 3,
                FTR_NumeroCliente: "344444",
                FTR_Valor_Total: 3
            };

            jest.spyOn(faturaService, "extrairFatura").mockResolvedValue(mockedFaturaSalva);

            await faturaController.extrairFatura(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it("deve retornar um status 500 quando ocorrer um erro durante a extração da fatura", async () => {
            const req = { file: { buffer: Buffer.from("mockedBuffer") } } as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

            const mockedError = new Error("mocked error message");

            jest.spyOn(faturaService, "extrairFatura").mockRejectedValue(mockedError);

            await faturaController.extrairFatura(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe("getFatura", () => {
        it("deve retornar um status 200 e as faturas paginadas", async () => {
            const req = { query: {} } as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockedResult = {
                data: [
                    {
                        FTR_Id: 1,
                        FTR_Consumo_Energia: 2,
                        FTR_Data_Referente: new Date(),
                        FTR_Economia_GD: 3,
                        FTR_NumeroCliente: "344444",
                        FTR_Valor_Total: 3
                    },
                    {
                        FTR_Id: 1,
                        FTR_Consumo_Energia: 2,
                        FTR_Data_Referente: new Date(),
                        FTR_Economia_GD: 3,
                        FTR_NumeroCliente: "344444",
                        FTR_Valor_Total: 3
                    }
                ],
                metaData: {
                    limit: 2,
                    page: 2,
                    pageSize: 5
                }
            }

            jest.spyOn(faturaService, "listarFaturas").mockResolvedValue(mockedResult);

            await faturaController.getFatura(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("chart", () => {
        it("deve retornar um status 200 e os dados do gráfico", async () => {
            const req = { query: {} } as Request;
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
            const mockedResult = { consumoPorMes: [], valorTotalPorMes: [] };

            jest.spyOn(faturaService, "chart").mockResolvedValue(mockedResult);

            await faturaController.chart(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
