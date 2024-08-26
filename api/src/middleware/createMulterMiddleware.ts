import multer from "multer";
import path from "path";

export const createMulterMiddleware = (dirPath: string) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dirPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
    
    return multer({ storage });
}

