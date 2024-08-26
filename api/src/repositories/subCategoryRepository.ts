import CategoryModel from "../models/CategoryModel";
import SubcategoryModel from "../models/SubCategoryModel";
import { SubCategory } from "../types";

class SubcategoriesRepository{
    async getSubcategoriesWhereNameLike(name: string): Promise<SubCategory[]>{
        return await SubcategoryModel.query().where('name', 'LIKE', `%${name}%`).withGraphFetched('category');
    }

    async getSubcategoriesAllowedCharacteristics(id: number){
        return await SubcategoryModel.query().where('id', '=', id).withGraphFetched('keys.[values]').first();
    }

    async getSubCategoriesByCategoryId(id: number){
        const category = await CategoryModel.query().findOne({ id: id });
        if(category){
            const subcategories = await category.$relatedQuery('subcategories');
            return subcategories;
        }
    }
}

export default new SubcategoriesRepository();