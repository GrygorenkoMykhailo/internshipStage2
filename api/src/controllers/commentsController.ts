import { Response } from "express";
import { asyncErrorHandler } from "../middleware/asyncErrorHandler";
import { RequestWithUserCreds } from "../types/RequestWithUserCreds";
import { CommentDAO } from "../types/CommentDAO";
import commentRepository from "../repositories/commentRepository";
import { postCommentSchema } from "../schemas/postCommentSchema";

const addCommentToProduct = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    if(req.user){
        await postCommentSchema.validate(req.body);

        const comment = await commentRepository.addCommentToProduct(req.user.userId, req.body);
        res.json(comment);
    }else{
        res.status(403).send();
    }
});

const removeCommentFromProduct = asyncErrorHandler(async (req: RequestWithUserCreds, res: Response) => {
    if(req.user){
        const { id } = req.params;

        if(!id || !+id) res.status(400).send();
        else res.json(await commentRepository.deleteComment(+id));
    }else{
        res.status(403).send();
    }
});

export default {
    addCommentToProduct,
    removeCommentFromProduct,
}