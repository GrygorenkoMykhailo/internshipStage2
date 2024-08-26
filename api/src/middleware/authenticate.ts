import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUserCreds } from "../types/RequestWithUserCreds";

export const authenticate = (req: RequestWithUserCreds, res: Response, next: NextFunction) => {
    const secretKey = process.env.JWT_KEY!;
    const bearer = req.cookies.Bearer;

    if(!bearer){
        res.status(403).send();
    }else{
        req.user = jwt.verify(bearer, secretKey) as RequestWithUserCreds["user"];
        next();
    }
}   