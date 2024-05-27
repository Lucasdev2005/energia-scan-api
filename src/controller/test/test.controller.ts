import { Request, Response } from "express";
import { Controller } from "../../utils/controller";
import { TestService } from "../../service/teste.service";

export class TestController extends Controller {

    public service!: TestService;

    constructor(testService: TestService) {
        super();
        this.service = testService;
    }

    public async test(req: Request, res: Response) {
        this.ok(res, await this.service.testeInjectable())
    }
}