import { Product } from "../types";
import ProductModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";
import SubcategoryModel from "../models/SubCategoryModel";
import CharacteristicModel from "../models/CharacteristicModel";

interface ProductDAO{
    name: string;
    price: number;
    description: string;
    category: string;
    subcategory: string;
    characteristics: { [key: string]: string };
}

class ProductRepository{
    async getAllProducts(): Promise<Product[]>{
        return ProductModel.query().withGraphFetched('category').withGraphFetched('subcategory');
    }

    async createProduct(data: ProductDAO, imagePath: string){
        const category = await CategoryModel.query().findById(data.category);
        const subcategory = await SubcategoryModel.query().findById(data.subcategory);

        if(!category || !subcategory) throw new Error();

        const product = await ProductModel.query().insert({
            name: data.name,
            price: +data.price,
            description: data.description,
            categoryId: +category.id,
            subcategoryId: +subcategory.id,
            imagePath: imagePath,
        });

        for(const [key, value] of Object.entries(data.characteristics)){
            await CharacteristicModel.query().insert({
                key: key,
                value: value,
                productId: product.id
            });
        }

        return product;
    }

    async editProduct(id: number, data: ProductDAO, imagePath?: string ){
        const category = await CategoryModel.query().findById(data.category);
        const subcategory = await SubcategoryModel.query().findById(data.subcategory);

        if(!category || !subcategory) throw new Error();

        const product = await ProductModel.query().where('id', '=', id).first();
        if(product){
            await ProductModel.query().where('id', '=', id).patch({
                name: data.name,
                price: +data.price,
                description: data.description,
                categoryId: category.id,
                subcategoryId: subcategory.id,
                imagePath,
            });

            for(const [key, value] of Object.entries(data.characteristics)){
                const characteristic = await CharacteristicModel.query().where('productId', '=', product.id).andWhere('key', '=', key).first();

                if(characteristic){
                    await CharacteristicModel.query().where('id', '=', characteristic.id).patch({
                        key: key,
                        value: value,
                    });
                }
            }

            return product;
        }else{
            throw new Error();
        }
    }

    async deleteProduct(id: number){
        const product = await ProductModel.query().where('id','=',id).first();

        if(product){
            await ProductModel.query().deleteById(product.id);
            return product.id;
        }else{
            throw new Error();
        }
        
    }

    async getProductById(id: number): Promise<Product | undefined>{
        return ProductModel.query()
        .where('id', '=', id)
        .first()
        .withGraphFetched('comments.[user]')
        .withGraphFetched('characteristics')
        .withGraphFetched('category')
        .withGraphFetched('subcategory.[keys.[values]]')
        .withGraphFetched('priceInMonth');
    }

    async getProducstByCategory(categoryName: string): Promise<Product[] | undefined>{
        const category = await CategoryModel.query().where('name', '=', categoryName).first();
        if(category){
            return ProductModel.query().where('categoryId', '=', category.id).withGraphFetched('characteristics');
        }
    }

    async getProductsBySubCategory(subCategoryName: string): Promise<Product[]| undefined>{
        const subCategory = await SubcategoryModel.query().where('name', '=', subCategoryName).first();
        if(subCategory){
            return ProductModel.query().where('subcategoryId', '=', subCategory.id).withGraphFetched('characteristics');
        }
    }

    async getProductsByNameLike(string: string): Promise<Product[]> {
        return ProductModel.query()
            .where('name', 'LIKE', `%${string}%`)
            .withGraphFetched('characteristics');
    }
}

export default new ProductRepository();