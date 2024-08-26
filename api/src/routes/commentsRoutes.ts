import express from "express";
import commentsController from "../controllers/commentsController";
import { authenticate } from "../middleware/authenticate";
import { ensureAdmin } from "../middleware/ensureAdmin";

export const router = express.Router();

router.post('/comment', authenticate, commentsController.addCommentToProduct);
router.delete('/comment/:id', [authenticate, ensureAdmin], commentsController.removeCommentFromProduct);