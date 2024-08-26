import { useState, useEffect, useMemo } from "react";
import { Product } from "../types";
import axios from "axios";

type FetchType = 'byCategory' | 'all' | 'byId'

type ByCategoryType = { category?: string, subcategory?: string } 

type ByIdType = { id?: number }

type ConditionalProps<K extends FetchType> = K extends 'byCategory' ? ByCategoryType : K extends 'all' ? undefined : K extends 'byId' ? ByIdType : never;

export const useFetchProducts = <T extends FetchType>(fetchType: T, additional?: ConditionalProps<T>) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const additionalString = useMemo(() => JSON.stringify(additional), [additional]);

    const setNewProducts = (newState: Product[]) => {
        setProducts(newState);
    }

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                let response;

                if (fetchType === 'byCategory') {
                    if (additional) {
                        const { category, subcategory } = additional as ByCategoryType;
                        if(category){
                            response = await axios.get<Product[]>(import.meta.env.VITE_BASE_URL + '/products', {
                                params: { category, subcategory },
                            });
                        
                        setProducts(response.data);
                        }
                    }
                } else if (fetchType === 'all') {
                    response = await axios.get<Product[]>(import.meta.env.VITE_BASE_URL + '/allProducts', { withCredentials: true });
                    setProducts(response.data);
                } else if (fetchType === 'byId') {
                    if(additional && (additional as ByIdType).id){
                        response = await axios.get<Product>(import.meta.env.VITE_BASE_URL + '/product/' + (additional as ByIdType).id, { withCredentials: true });
                        setProducts([response.data]);
                    }   
                }
            } catch {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [additionalString]);

    return [ products, setNewProducts, loading, error ] as [Product[], (newState: Product[]) => void, boolean, string];
};
