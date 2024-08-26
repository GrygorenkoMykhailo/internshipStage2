import { Model } from 'objection';
import knex from '../dbConnection';
import { UserFavourites } from '../types';
import UserModel from './UserModel';
import ProductModel from './ProductModel';

Model.knex(knex);

interface UserFavouritesModel extends UserFavourites {}

class UserFavouritesModel extends Model implements UserFavouritesModel {
  static tableName = 'usersFavourites';

  static jsonSchema = {
    type: 'object',
    required: ['userId', 'productId'],
    properties: {
      id: { type: 'integer' },
      userId: { type: 'integer' },
      productId: { type: 'integer' }
    }
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'usersFavourites.userId',
        to: 'users.id'
      }
    },
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: ProductModel,
      join: {
        from: 'usersFavourites.productId',
        to: 'products.id'
      }
    }
  };
}

export default UserFavouritesModel;
