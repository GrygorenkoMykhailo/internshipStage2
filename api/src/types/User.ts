import { Product } from "./Product";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    hash: string;
    role: 'user' | 'admin';
    phoneNumber?: string;
    receiveUpdates: boolean;
    rememberMe: boolean;
    imagePath: string;
    favourites?: Product[];
  }