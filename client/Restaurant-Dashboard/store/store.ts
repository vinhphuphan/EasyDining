import { configureStore } from "@reduxjs/toolkit"
import { menuApi } from "./api/menuApi"
import { tableApi } from "./api/tableApi"
import { ordersApi } from "./api/orderApi"

export const store = configureStore({
    reducer: {
        [menuApi.reducerPath]: menuApi.reducer,
        [tableApi.reducerPath]: tableApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            menuApi.middleware,
            tableApi.middleware,
            ordersApi.middleware
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
