import { Model } from 'objection';
import knex from '../dbConnection';
import { PriceInMonth } from '../types';
import ProductModel from './ProductModel';

Model.knex(knex);

interface PriceInMonthModel extends PriceInMonth {}

class PriceInMonthModel extends Model implements PriceInMonthModel {
  static tableName = 'priceInMonth';

  static jsonSchema = {
    type: 'object',
    required: ['month', 'price', 'productId'],
    properties: {
      id: { type: 'integer' },
      month: { type: 'string', minLength: 1 },
      price: { type: 'number' },
      productId: { type: 'integer' }
    }
  };

  static relationMappings = {
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: ProductModel,
      join: {
        from: 'priceInMonth.productId',
        to: 'products.id'
      }
    }
  };
}

export default PriceInMonthModel;
