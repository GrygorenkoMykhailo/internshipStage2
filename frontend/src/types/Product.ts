import { Category } from "./Category";
import { Characteristic } from "./Characteristic";
import { PriceInMonth } from "./PriceInMonth";
import { SubCategory } from "./SubCategory";
import { Comment } from './Comment';

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
  priceInMonth: PriceInMonth[];
}