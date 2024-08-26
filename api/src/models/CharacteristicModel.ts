import { Model } from 'objection';
import knex from '../dbConnection';
import { Characteristic } from '../types';
import ProductModel from './ProductModel';

Model.knex(knex);

interface CharacteristicModel extends Characteristic {}

class CharacteristicModel extends Model implements CharacteristicModel {
  static tableName = 'characteristics';

  static jsonSchema = {
    type: 'object',
    required: ['key', 'value', 'productId'],
    properties: {
      id: { type: 'integer' },
      key: { type: 'string', minLength: 1, maxLength: 255 },
      value: { type: 'string', minLength: 1 },
      productId: { type: 'integer' }
    }
  };

  static relationMappings = {
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: ProductModel,
      join: {
        from: 'characteristics.productId',
        to: 'products.id'
      }
    },
  };
}

export default CharacteristicModel;
