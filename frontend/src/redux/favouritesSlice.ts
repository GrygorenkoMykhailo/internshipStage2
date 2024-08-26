import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";
import axios from "axios";

type Status = 'idle' | 'pending' | 'succeeded' | 'rejected';

interface FavouritesSlice{
    products: Product[];
    status: Status;
}

const initialState: FavouritesSlice = {
    products: [],
    status: 'idle',
}

export const fetchFavorites = createAsyncThunk(
    'favourites/fetchFavourites',
    async () => {
        const response = await axios.get(import.meta.env.VITE_BASE_URL + '/favourites', { withCredentials: true });
        const data = response.data as Product[];
        return data;
    }
)

export const addUserFavourite = createAsyncThunk(
    'favorites/addUserFavorite',
    async (id: number) => {
        const response = await axios.post(import.meta.env.VITE_BASE_URL + '/favourite', { productId: id}, { withCredentials: true });
        const data = response.data as Product;
        return data;
    }
)

export const removeUserFavourite = createAsyncThunk(
    'favourites/removeUserFavourite',
    async (id: number) => {
        await axios.delete(import.meta.env.VITE_BASE_URL + '/favourite/' + id, { withCredentials: true });
        return id;
    }
)

const favoritesSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFavorites.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.status = 'succeeded';
            state.products = action.payload;
        });
        builder.addCase(fetchFavorites.rejected, (state) => {
            state.status = 'rejected';
        });
        builder.addCase(addUserFavourite.fulfilled, (state, action: PayloadAction<Product>) => {
            state.products = [...state.products, action.payload];
            console.log('new favourites: ', state.products);
        });
        builder.addCase(removeUserFavourite.fulfilled, (state, action: PayloadAction<number>) => {
            state.products = state.products.filter(p => p.id !== action.payload);
            console.log('new favourites: ', state.products);
        });
    }
});

export default favoritesSlice.reducer;