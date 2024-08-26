import { Category } from "./Category";
import { Characteristic } from "./Characteristic";
import { SubCategory } from "./SubCategory";

export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    category: Category;
    categoryId: number;
    subcategory: SubCategory;
    subcategoryId: number;
    views: number;
    likes: number;
    dislikes: number;
    favourites: number;
    imagePath: string;
    characteristics: Characteristic[];
    comments: Comment[];
  }