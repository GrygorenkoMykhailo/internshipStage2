import { NextFunction, Request, Response, RequestHandler } from "express";

export const asyncErrorHandler = (fn: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        await fn(req, res, next);
    }catch(e){
        next(e);
    }
}