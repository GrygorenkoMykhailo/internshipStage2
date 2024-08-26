import express from "express";
import productsController from "../controllers/productsController";
import { authenticate } from "../middleware/authenticate";
import { ensureAdmin } from "../middleware/ensureAdmin";
import { createMulterMiddleware } from "../middleware/createMulterMiddleware";

const upload = createMulterMiddleware('public/product-images/');

export const router = express.Router();

router.get('/product/:id', productsController.getProductById);
router.get('/products', productsController.getProductsByCategoryOrSubcategory);
router.get('/searchString', productsController.getCategoriesAndProductsByString);

router.get('/allProducts', [authenticate, ensureAdmin], productsController.getAllProducts);
router.post('/product', [authenticate, ensureAdmin, upload.single('image')], productsController.createProduct);
router.put('/product/:id', [authenticate, ensureAdmin, upload.single('image')], productsController.editProduct);
router.delete('/product/:id', [authenticate, ensureAdmin], productsController.deleteProduct);