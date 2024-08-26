import { SubCategory } from "../types"
import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchSubCategories = (categoryId?: number) => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const setNewSubCategories = (newState: SubCategory[]) => {
        setSubCategories(newState);
    }

    const fetchSubCategories = async () => {
        try{
            const response = await axios.get(import.meta.env.VITE_BASE_URL + '/subcategoriesByCategoryId?id=' + categoryId);
            const data = response.data as SubCategory[];
            setLoading(false);
            setSubCategories(data);
        }catch{
            setError('Error fetching categories');
        }
    }

    useEffect(() => {
        if(categoryId){
            fetchSubCategories();
        }
    }, [categoryId]);

    return [subCategories, setNewSubCategories, loading, error] as [SubCategory[], (newState: SubCategory[]) => void, boolean, string];
}