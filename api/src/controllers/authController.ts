import { Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import { UserLoginDAO, UserRegisterDAO } from "../types";
import { hashPassword } from "../helpers/hashPassword";
import userRepository from "../repositories/userRepository";
import { verifyPassword } from "../helpers/verifyPassword";
import jwt from "jsonwebtoken";
import { authenticateUserSchema } from "../schemas/authenticateUserSchema";
import { registerSchema } from "../schemas/registerUserSchema";

function generateToken(user: unknown, rememberMe: boolean){
    return jwt.sign(user as object, process.env.JWT_KEY!, { expiresIn: rememberMe ? '7d' : '1h' });
}

function setAuthCookie(res: Response, token: string, rememberMe: boolean){
    res.cookie('Bearer', token, {
        httpOnly: true,
        secure: true,
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    });
}

const registerUser = asyncErrorHandler(async (req: Request, res: Response) => {
    await registerSchema.validate(req.body);

    const hash = hashPassword(req.body.password);

    if(await userRepository.userExistsByEmail(req.body.email)){
        res.status(409).send();
    }else{
        const user = await userRepository.saveUser(req.body);

        const token = generateToken({ userId: user.id, userEmail: user.email, userRole: user.role }, true);
        setAuthCookie(res, token, true);
        res.json(user);
    }
});

const authenticateUser = asyncErrorHandler(async (req: Request, res: Response) => {
    const { emailOrPhone, password, rememberMe } = req.body as UserLoginDAO;
    await authenticateUserSchema.validate(req.body);

    let user;

    if (emailOrPhone.includes('@')) {
        user = await userRepository.userExistsByEmail(emailOrPhone);
    } else {
        user = await userRepository.userExistsByPhone(emailOrPhone);
    }

    if (!user) {
        return res.status(403).send('User not found');
    }

    if (!verifyPassword(password, user.hash)) {
        return res.status(403).send('Invalid password');
    }

    const token = generateToken({ userId: user.id, userEmail: user.email, userRole: user.role }, rememberMe ?? false);
    setAuthCookie(res, token, rememberMe ?? false);

    if (rememberMe) {
        await userRepository.rememberUser(user.id);
    } else {
        await userRepository.forgetUser(user.id);
    }

    const updatedUser = { ...user, remember_me: rememberMe || false };
    res.json(updatedUser);
});

const logOutUser = asyncErrorHandler(async (req: Request, res: Response) => {
    res.clearCookie('Bearer');
    res.status(200).send();
});

export default {
    logOutUser,
    registerUser,
    authenticateUser,
}