import "reflect-metadata";
import express, { NextFunction, Request } from "express";
import { Injectable } from "./utils/types/injectable";
import { InjectableController } from "./utils/types/injectableController";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import multer from "multer";
import cors from 'cors';

export class Main {
    private app = express();
    private multer = multer();

    constructor({controllers}: {controllers: InjectableController[]}) {
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: true }));
      this.app.use(cors({
        origin: "*",
        credentials: true
      }));
      dotenv.config();
      this.applyControllers(controllers);
    }

    private applyControllers(controllers: InjectableController[]) {
      for (const controller of controllers) {
        const controllerInstanced = this.instantiateWithDependencies(controller);
        for (const route of controller.routes) {
          const multerMiddleware = this.useFile(route.useFile ?? false);
          this.app[route.method](route.endpoint, multerMiddleware, (req, res) => {
            controllerInstanced[route.action](req, res);
          });
        }
      }
    }

    private instantiateWithDependencies(injectable: Injectable): any {
      let instances = [];

      if (injectable.dependencies) {
          for (const dependency of injectable.dependencies) {
              instances.push(this.instantiateWithDependencies(dependency));
          }
      }
      
      return new injectable.class(...instances);
    }

    private useFile(use: boolean): any {
      if (use) {
        return this.multer.single('file');
      }
      return (req: Request, res: Response, next: NextFunction) => { next(); };
    }

    public bootstrap() {
      this.app.listen(process.env.PORT, () => {
          console.log("servidor iniciado na porta: ", process.env.PORT);
      });
    } 
}