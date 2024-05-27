import { Injectable } from "./injectable";
import { Route } from "./route";

export interface InjectableController extends Injectable {
    routes: Route[]
}