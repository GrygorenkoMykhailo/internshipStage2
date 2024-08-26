
export type UserProfileDAO = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    receiveUpdates: boolean;
    imagePath: string;
}