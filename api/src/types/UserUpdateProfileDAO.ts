export type UserUpdateProfileDAO = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    newPassword?: string;
    confirmNewPassword?: string;
    receiveUpdates?: boolean;
}