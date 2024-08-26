import express from "express";
import categoriesController from '../controllers/categoriesController'
import { authenticate } from "../middleware/authenticate";

export const router = express.Router();

router.get('/categories', categoriesController.getAllCategories);
router.get('/categoryByName', categoriesController.getCategoryByName);