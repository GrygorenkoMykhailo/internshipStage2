import { Model } from "objection";
import knex from '../dbConnection';
import { SubCategory } from "../types";

Model.knex(knex);

interface CharacteristicKey{
    id: number;
    name: string;
    subcategory: SubCategory;
    subcategory_id: number;
}

interface CharacteristicKeyModel extends CharacteristicKey {}

class CharacteristicKeyModel extends Model implements CharacteristicKeyModel{
    static get tableName(){
        return "characteristicKeys";
    }

    static relationMappings = {
        subcategory: {
            relation: Model.BelongsToOneRelation,
            modelClass: __dirname + '/SubCategoryModel',
            join: {
                from: 'characteristicKeys.subcategoryId',
                to: 'subcategories.id'
            }
        },

        values: {
            relation: Model.HasManyRelation,
            modelClass: __dirname + '/CharacteristicValueModel',
            join: {
                from: 'characteristicKeys.id',
                to: 'characteristicValues.keyId',
            }
        }
    }
}

export default CharacteristicKeyModel;