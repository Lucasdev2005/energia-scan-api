import { Request, Response } from "express";
import { Controller } from "../../utils/controller";
import { FaturaService } from "../../service/fatura/fatura.service";
import { Paginate } from "../../utils/paginate";

export class FaturaController extends Controller {

    constructor(private faturaService: FaturaService) {
        super();
    }

    public async extrairFatura(req: Request, res: Response) {
        if (req?.file?.buffer) {
            try {
                const faturaSalva = await this.faturaService.extrairFatura(req.file?.buffer);
                this.created(res, faturaSalva);
            } catch (e: any) {
                this.internalServerError(res, e.message);
            }
        } else {
            this.badRequest(res, "file is missing.");
        }
    }

    public async getFatura(req: Request, res: Response) {
        const paginate = new Paginate(req);
        const result = await this.faturaService.listarFaturas(paginate, {
            FTR_NumeroCliente: req.query?.FTR_NumeroCliente as string
        });

        this.ok(res, result);
    }

    public async chart(req: Request, res: Response) {
        const result = await this.faturaService.chart({
            FTR_NumeroCliente: req.query?.FTR_NumeroCliente as string
        });

        this.ok(res, result);
    }
}