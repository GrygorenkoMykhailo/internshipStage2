import { Model } from 'objection';
import knex from '../dbConnection';
import CommentModel from './CommentModel';
import ProductModel from './ProductModel';
import { User } from '../types';

Model.knex(knex);

interface UserModel extends User {}

class UserModel extends Model implements User {
  static tableName = 'users';

  static jsonSchema = {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'hash'],

    properties: {
      id: { type: 'integer' },
      firstName: { type: 'string', minLength: 1, maxLength: 255 },
      lastName: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 1, maxLength: 255 },
      hash: { type: 'string', minLength: 1 },
      role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
      phoneNumber: { type: 'string', minLength: 0, maxLength: 255  },
      receiveUpdates: { type: 'boolean', default: false },
      rememberMe: { type: 'boolean', default: false },
      imagePath: { type: 'string', default: '/profile-images/no-profile-image.png' }
    }
  };

  static relationMappings = {
    comments: {
      relation: Model.HasManyRelation,
      modelClass: CommentModel,
      join: {
        from: 'users.id',
        to: 'comments.userId'
      }
    },
    favourites: {
      relation: Model.ManyToManyRelation,
      modelClass: ProductModel,
      join: {
        from: 'users.id',
        through: {
          from: 'usersFavourites.userId',
          to: 'usersFavourites.productId'
        },
        to: 'products.id'
      }
    }
  };
}

export default UserModel;
