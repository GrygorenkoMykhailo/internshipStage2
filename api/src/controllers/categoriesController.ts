import { Request, Response } from "express";
import categoryRepository from "../repositories/categoryRepository"
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";

const getAllCategories = asyncErrorHandler(async (req: Request, res: Response) => {
    res.json(await categoryRepository.getAllCategories());
});

const getCategoryByName = asyncErrorHandler(async (req: Request, res: Response) => {
    const { name } = req.query;

    if(!name) res.status(400).send();
    res.json((await categoryRepository.getCategoriesByNameLike(name as string))[0]);
});

export default {
    getAllCategories,
    getCategoryByName,
}