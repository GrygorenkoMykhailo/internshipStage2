import { Model, RelationMappings, RelationMappingsThunk } from "objection";
import knex from '../dbConnection';

Model.knex(knex);

interface CharacteristicValue{
    id: number;
    value: string;
    key_id: number;
}

interface CharacteristicValueModel extends CharacteristicValue {}

class CharacteristicValueModel extends Model implements CharacteristicValueModel{
    static get tableName(){
        return "characteristicValues";
    }
}

export default CharacteristicValueModel;