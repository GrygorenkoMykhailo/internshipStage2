import { Model } from 'objection';
import knex from '../dbConnection';
import ProductModel from './ProductModel';
import { Category } from '../types';
import SubcategoryModel from './SubCategoryModel';

Model.knex(knex);

interface CategoryModel extends Category {}

class CategoryModel extends Model implements CategoryModel {
  static tableName = 'categories';

  static jsonSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 }
    }
  };

  static relationMappings = {
    products: {
      relation: Model.HasManyRelation,
      modelClass: ProductModel,
      join: {
        from: 'categories.id',
        to: 'products.categoryId'
      }
    },
    subcategories: {
        relation: Model.HasManyRelation,
        modelClass: SubcategoryModel,
        join: {
            from: 'categories.id',
            to: 'subcategories.categoryId',
        },
    }
  };
}

export default CategoryModel;
