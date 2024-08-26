import { Model } from 'objection';
import knex from '../dbConnection';
import { SubCategory } from '../types';

Model.knex(knex);

interface SubcategoryModel extends SubCategory {}

class SubcategoryModel extends Model implements SubcategoryModel {
  static tableName = 'subcategories';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'categoryId'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      categoryId: { type: 'integer' }
    }
  };

  static relationMappings = {
    category: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + '/CategoryModel',
      join: {
        from: 'subcategories.categoryId',
        to: 'categories.id'
      }
    },
    products: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + '/ProductModel',
      join: {
        from: 'subcategories.id',
        to: 'products.subcategoryId'
      }
    },
    keys: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + '/CharacteristicKeyModel',
      join: {
        from: 'subcategories.id',
        to: 'characteristicKeys.subcategoryId',
      }
    }
  };
}

export default SubcategoryModel;