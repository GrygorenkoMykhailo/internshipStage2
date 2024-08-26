import { ProfileDAO } from "./ProfileDAO";

export type Comment = {
    id: number;
    content: string;
    createdAt: string; 
    productId: number;
    userId: number;
    user: ProfileDAO;
  }