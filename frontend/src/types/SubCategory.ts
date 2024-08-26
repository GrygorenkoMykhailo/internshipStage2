import { Category } from "./Category";

type Key = {
    id: number;
    name: string;
    values: Value[];
}

type Value = {
    id: number;
    value: string;
}

export type SubCategory = {
    id: number;
    name: string;
    category: Category
    keys: Key[];
}