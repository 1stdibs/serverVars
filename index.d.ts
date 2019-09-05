import {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction
} from "express";

export function add(key: string, value: any): void;
export function get(key: string): any;
export function inject(): string;
export function middleware(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
): void;

export interface ServerVars {
    add: typeof add;
    get: typeof get;
    inject: typeof inject;
    middleware: typeof middleware;
}
