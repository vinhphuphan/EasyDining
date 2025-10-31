import { configureStore } from "@reduxjs/toolkit"
import { menuApi } from "./api/menuApi"
import { tablesApi } from "./api/tablesApi"

export const store = configureStore({
    reducer: {
        [menuApi.reducerPath]: menuApi.reducer,
        [tablesApi.reducerPath]: tablesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            menuApi.middleware,
            tablesApi.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
