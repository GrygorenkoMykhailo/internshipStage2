import { useEffect, useState } from "react";
import { SubCategory } from "../types";
import axios from "axios";

export const useFetchKeysAndValues = (subCategoryId?: number) => {
    const [keys, setKeys] = useState<SubCategory["keys"]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchKeysAndValues = async() => {
        try{
            const response = await axios.get(import.meta.env.VITE_BASE_URL + '/allowedKeysAndValues?id=' + subCategoryId);
            const data = response.data as SubCategory["keys"];
            setKeys(data);
            setLoading(false);
        }catch{
            setError('Error fetching keys and values');
        }
    }

    const setNewKeys = (newState: SubCategory["keys"]) => {
        setKeys(newState);
    }

    useEffect(() => {
        if(subCategoryId){
            fetchKeysAndValues();
        }
    }, [subCategoryId]);

    return [keys, setNewKeys, loading, error] as [SubCategory["keys"], (newState: SubCategory["keys"]) => void, boolean, string];
}