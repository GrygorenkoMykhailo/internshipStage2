import { boolean, object, string } from "yup";

export const authenticateUserSchema = object({
    emailOrPhone: string().required(),
    password: string().required(),
    rememberMe: boolean(),
});