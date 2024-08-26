import { Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import productRepository from "../repositories/productRepository";
import categoryRepository from "../repositories/categoryRepository";
import { SearchStringDAO } from "../types";
import subCategoriesRepository from "../repositories/subCategoryRepository";
import { createProductSchema } from "../schemas/createProductSchema";
import { editProductSchema } from "../schemas/editProductSchema";

const getAllProducts = asyncErrorHandler(async (req: Request, res: Response) => {
    res.status(200).json(await productRepository.getAllProducts());
});

const deleteProduct = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || !+id) res.status(400).send();

    res.status(200).json(await productRepository.deleteProduct(+id));
});

const getProductById = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || !+id) res.status(400).send();

    const product = await productRepository.getProductById(+id);

    if(product){
        res.status(200).json(product);
    }else{
        res.status(404).send();
    }
});

const getProductsByCategoryOrSubcategory = asyncErrorHandler(async (req: Request, res: Response) => {
    const { category, subcategory } = req.query;

    if(!category && !subcategory) res.status(400).send();
    else{
        if(subcategory){
            res.status(200).json(await productRepository.getProductsBySubCategory(subcategory as string));
        }else if(category){
            res.status(200).json(await productRepository.getProducstByCategory(category as string));
        }
    }
});

const getCategoriesAndProductsByString = asyncErrorHandler(async (req: Request, res: Response) => {
    const { string } = req.query;

    if (!string) {
        res.status(400).send();
        return;
    }else{
        const categories = await categoryRepository.getCategoriesByNameLike(string as string);
        const subCategories = await subCategoriesRepository.getSubcategoriesWhereNameLike(string as string);
        const products = await productRepository.getProductsByNameLike(string as string);

        const data: SearchStringDAO = {
            categories,
            subCategories,
            products
        }

        res.status(200).json(data);
    }
});

const createProduct = asyncErrorHandler(async (req: Request, res: Response) => {
    if(req.file){
        const filePath = `/product-images/${req.file.filename}`;
        await createProductSchema.validate(req.body);
        res.json(await productRepository.createProduct(req.body, filePath));
    }else{
        res.status(400).send();
    } 
});

const editProduct = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id || !+id) res.status(400).send();

    let filePath = undefined;
    if(req.file){  
        filePath = `/product-images/${req.file.filename}`;
    }

    await editProductSchema.validate(req.body);
    res.json(await productRepository.editProduct(+id, req.body, filePath));
});

export default {
    getAllProducts,
    getProductById,
    getProductsByCategoryOrSubcategory,
    getCategoriesAndProductsByString,
    deleteProduct,
    createProduct,
    editProduct,
}