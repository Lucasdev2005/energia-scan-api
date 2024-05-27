import { Request, Response } from "express"

export interface Route {
    endpoint: string; 
    action: string;
    middleWare?: (req: Request, res: Response, next: Function) => void;
    method: "post" | "put" | "patch" | "get" | "delete";
    useFile?: boolean
}