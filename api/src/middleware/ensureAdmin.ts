import { NextFunction, Response } from "express";
import { RequestWithUserCreds } from "../types/RequestWithUserCreds";

export const ensureAdmin = (req: RequestWithUserCreds, res: Response, next: NextFunction) => {
    const userRole = req.user?.userRole;

    if(userRole != 'admin'){
        res.status(401).send();
    }else{
        next();
    }
}