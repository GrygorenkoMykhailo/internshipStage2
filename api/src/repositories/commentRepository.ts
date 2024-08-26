import CommentModel from "../models/CommentModel";
import { CommentDAO } from "../types/CommentDAO";
import { Comment } from "../types";

class CommentRepository{
    async addCommentToProduct(userId: number, data: CommentDAO): Promise<Comment>{
        return await CommentModel.query().insert({
            ...data,
            userId,
        }).withGraphFetched('user');
    }

    async getCommentsByProductId(id: number): Promise<Comment[]>{
        return await CommentModel.query().where('productId', '=', id).withGraphFetched('user');
    }

    async deleteComment(id: number) {
        const comment = await CommentModel.query().where('id', '=', id).first();
        if(comment){
            await CommentModel.query().deleteById(comment.id)
            return comment.id;
        }
    }
}

export default new CommentRepository();