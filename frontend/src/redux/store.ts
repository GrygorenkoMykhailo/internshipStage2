import { configureStore } from "@reduxjs/toolkit";
import categoriesSlice from "./categoriesSlice";
import profileSlice from "./profileSlice";
import favoritesSlice from "./favouritesSlice";


export const store = configureStore({
    reducer: {
        categories: categoriesSlice,
        profile: profileSlice,
        favourites: favoritesSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;