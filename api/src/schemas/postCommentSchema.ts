import { object, string, date, number } from "yup";

export const postCommentSchema = object({
    content: string().required(),
    createdAt: date().required(),
    productId: number().required().positive(),
});