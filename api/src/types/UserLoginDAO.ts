export type UserLoginDAO = {
    emailOrPhone: string;
    password: string;
    rememberMe?: boolean;
}