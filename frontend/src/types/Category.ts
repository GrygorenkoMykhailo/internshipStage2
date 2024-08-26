import { SubCategory } from "./SubCategory";

export type Category = {
    id: number;
    name: string;
    imagePath: string;
    subcategories: SubCategory[];
}