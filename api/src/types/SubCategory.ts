import { Category } from "./Category";

export type SubCategory = {
    id: number;
    name: string;
    category: Category;
    keys: unknown;
}