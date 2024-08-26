import { object, string, boolean } from "yup";

export const updateUserProfileSchema = object({
    firstName: string().required().max(20),
    lastName: string().required().max(20),
    email: string().required().email(),
    getUpdates: boolean(),
})