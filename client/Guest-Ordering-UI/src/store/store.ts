import { configureStore } from "@reduxjs/toolkit"
import { menuApi } from "./api/menuApi"

export const store = configureStore({
    reducer: {
        [menuApi.reducerPath]: menuApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(menuApi.middleware),
})