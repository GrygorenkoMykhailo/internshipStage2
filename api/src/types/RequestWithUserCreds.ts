import { Request } from "express";

export interface RequestWithUserCreds extends Request {
    user?: { userId: number, userEmail: string, userRole: string };
}