import { Model } from 'objection';
import knex from '../dbConnection';
import UserModel from './UserModel';
import ProductModel from './ProductModel';
import { Comment } from '../types';

Model.knex(knex);

interface CommentModel extends Comment {}

class CommentModel extends Model implements Comment {
  static tableName = 'comments';

  static jsonSchema = {
    type: 'object',
    required: ['content', 'productId', 'userId'],
    properties: {
      id: { type: 'integer' },
      content: { type: 'string', minLength: 1 },
      createdAt: { type: 'string', format: 'date-time' },
      productId: { type: 'integer' },
      userId: { type: 'integer' }
    }
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + '/UserModel',
      join: {
        from: 'comments.userId',
        to: 'users.id'
      }
    },
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: ProductModel,
      join: {
        from: 'comments.productId',
        to: 'products.id'
      }
    }
  };
}

export default CommentModel;
