import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { fetchProfile } from "../../redux/profileSlice";
import { fetchFavorites } from "../../redux/favouritesSlice";
import { fetchCategories } from "../../redux/categoriesSlice";

export const BootComponent: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchFavorites());
        dispatch(fetchCategories());
    }, []);

    return null;
}