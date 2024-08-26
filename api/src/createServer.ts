import express from "express"
import path from "path";
import { errorHandler } from "./middleware/errorHandler";
import { authRoutes, categoriesRoutes, commentsRoutes, productsRoutes, usersRoutes, subCategoriesRoutes } from './routes'
import cookieParser from "cookie-parser";
import cors from "cors"

export default function(){
    const app = express();
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:5173',
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(subCategoriesRoutes);
    app.use(categoriesRoutes);
    app.use(productsRoutes);
    app.use(authRoutes);
    app.use(usersRoutes);
    app.use(commentsRoutes);
    app.use(errorHandler);
    return app;
}