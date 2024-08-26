import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, Req: Request, res: Response, next: NextFunction) => {
    if(res.statusCode !== 500) res.status(500);

    console.log(err);

    res.json({
        message: err.message,
        stack: err.stack,
    });
}