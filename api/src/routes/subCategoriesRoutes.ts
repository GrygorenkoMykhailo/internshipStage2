import express from "express";
import subcategoriesControlller from "../controllers/subcategoriesControlllers";

export const router = express.Router();

router.get('/allowedKeysAndValues', subcategoriesControlller.getSubcategoriesAllowedCharacteristics);
router.get('/subcategoriesByCategoryId', subcategoriesControlller.getSubCategoriesByCategoryId);