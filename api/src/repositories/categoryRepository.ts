import CategoryModel from "../models/CategoryModel";
import { Category } from "../types";

class CategoryRepository{
    async getAllCategories(): Promise<Category[]>{
        return await CategoryModel.query().withGraphFetched('subcategories');
    }

    async getCategoriesByNameLike(string: string): Promise<Category[]> {
        return await CategoryModel.query()
            .where('name', 'LIKE', `%${string}%`).withGraphFetched('subcategories');
    }  
}

export default new CategoryRepository();