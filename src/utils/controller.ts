import { Response } from "express";

export class Controller {
    protected ok(res: Response, body: any) {
        res.status(200).send(body);
    }

    protected badRequest(res: Response, body: any) {
        res.status(400).send(body);
    }

    protected internalServerError(res: Response, body: any) {
        res.status(500).send(body);
    }

    protected created(res: Response, body: any) {
        res.status(201).send(body);
    }

    protected notImplemented(res: Response, body: any) {
        res.status(501).send(body);
    }
}