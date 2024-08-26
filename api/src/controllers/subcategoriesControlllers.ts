import { Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import subCategoriesRepository from "../repositories/subCategoryRepository";


const getSubcategoriesAllowedCharacteristics = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.query;

    if(!id || !+id) {
        res.status(400).send();
    }else{
        res.json((await subCategoriesRepository.getSubcategoriesAllowedCharacteristics(+id))?.keys);
    }
});

const getSubCategoriesByCategoryId = asyncErrorHandler(async (req: Request, res: Response) => {
    const { id } = req.query;

    if(!id || !+id) res.status(400).send();
    else res.json(await subCategoriesRepository.getSubCategoriesByCategoryId(+id));
}); 

export default {
    getSubcategoriesAllowedCharacteristics,
    getSubCategoriesByCategoryId,
}