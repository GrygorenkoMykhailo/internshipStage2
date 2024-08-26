import { Category } from "./Category"
import { Product } from "./Product";
import { SubCategory } from "./SubCategory";

export type SearchStringDAO = {
    categories: Category[];
    subCategories: SubCategory[];
    products: Product[];
}