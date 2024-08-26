export type UserRegisterDAO = {
    firstName: string,
    lastName: string,
    email: string;
    password: string;
    repeatPassword: string;
    receiveUpdates?: boolean;
}