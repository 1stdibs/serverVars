import {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction
} from "express";

export type ServerVarAddKey =
    | string
    | {
          [key: string]:
              | string
              | number
              | object
              | (string | number | object)[];
      };

export function add(key: ServerVarAddKey, value?: any): void;
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
