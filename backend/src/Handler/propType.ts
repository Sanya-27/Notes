import response from "./responseHandler";
import { Request, Response } from "express";

type KeysToObject<T extends readonly string[]> = {
    [K in T[number]]: string;
};

interface customBody<T extends readonly string[]> extends Request {
    body: KeysToObject<T>;
}

const reqBodyValidator = <Keys extends readonly string[]>(
    req: Request,
    keys: Keys
): [false, ReturnType<typeof response.BAD_REQUEST>] | [true, customBody<Keys>] => {
    for (let key of keys) {
        if (!(key in req.body)) {
            return [false, response.BAD_REQUEST(`${key} missing in request`)];
        }
    }
    return [true, req as customBody<Keys>];
}

export { reqBodyValidator };
