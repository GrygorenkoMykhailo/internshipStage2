import { Model } from 'objection';
import knex from '../dbConnection';
import CharacteristicModel from './CharacteristicModel';
import PriceInMonthModel from './PriceInMonthModel';
import CommentModel from './CommentModel';
import CategoryModel from './CategoryModel';
import SubCategoryModel from './SubCategoryModel';
import { Product } from '../types';

Model.knex(knex);

interface ProductModel extends Product {}

class ProductModel extends Model implements ProductModel {
  static tableName = 'products';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'price', 'description', 'categoryId', 'subcategoryId'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      price: { type: 'number' },
      description: { type: 'string' },
      categoryId: { type: 'integer' },
      subcategoryId: { type: 'integer' },
      views: { type: 'integer', default: 0 },
      likes: { type: 'integer', default: 0 },
      dislikes: { type: 'integer', default: 0 },
      favourites: { type: 'integer', default: 0 },
      imagePath: { type: 'string' }
    }
  };

  static relationMappings = {
    characteristics: {
      relation: Model.HasManyRelation,
      modelClass: CharacteristicModel,
      join: {
        from: 'products.id',
        to: 'characteristics.productId'
      }
    },
    priceInMonth: {
      relation: Model.HasManyRelation,
      modelClass: PriceInMonthModel,
      join: {
        from: 'products.id',
        to: 'priceInMonth.productId'
      }
    },
    comments: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + '/CommentModel',
      join: {
        from: 'products.id',
        to: 'comments.productId'
      }
    },
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + '/CategoryModel',
      join: {
        from: 'products.categoryId',
        to: 'categories.id'
      }
    },
    subcategory: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + '/SubCategoryModel',
      join: {
        from: 'products.subcategoryId',
        to: 'subcategories.id'
      }
    }
  };
}

export default ProductModel;
