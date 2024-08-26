import { object, string, boolean } from "yup";

export const loginSchema = object({
    emailOrPhone: string().required('Email or phone number is required'),
    password: string().required('Password is required'),
    rememberMe: boolean(),
});