import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "../types";
import axios from "axios";

type Status = 'idle' | 'pending' | 'succeeded' | 'rejected';

interface CategoriesState {
    categories: Category[];
    status: Status;
}

const initialState: CategoriesState = {
    categories: [],
    status: 'idle',
}

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async () => {
        const response = await axios.get(import.meta.env.VITE_BASE_URL + '/categories');
        const data: Category[] = response.data;
        return data;
    }
);

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.status = 'rejected';
            });
    },
});

export default categoriesSlice.reducer;