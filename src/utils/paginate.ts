import { Request } from "express";

export class Paginate {

    private offset: number = 0;
    private page: number = 0;
    private pageSize: number = 0;

    constructor(req: Request) {
        const { page = "1", pageSize = "10" } = req.query as { page?: string, pageSize?: string };
        this.page = parseInt(page);
        this.pageSize = parseInt(pageSize);

        this.offset = (this.page - 1) * this.pageSize;
    }

    find() {
        return {
            skip: this.offset,
            take: this.pageSize
        }
    }

    /**
     * @param tableCount é o número de dados em uma tabela.
     */
    getMetadata(tableCount: number) {
        return {
            limit: Math.ceil(tableCount / this.pageSize),
            page: this.page,
            pageSize: this.pageSize
        }
    }
}
