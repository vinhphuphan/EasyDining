import { configureStore } from "@reduxjs/toolkit"
import { menuApi } from "../api/menuApi"
import { uiSlice } from "@/lib/uiSlice"
import { useDispatch, useSelector } from "react-redux"
import { ordersApi } from "@/api/ordersApi"
import { tableApi } from "@/api/tableApi"

export const store = configureStore({
    reducer: {
        [menuApi.reducerPath]: menuApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [tableApi.reducerPath]: tableApi.reducer,
        ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            menuApi.middleware,
            ordersApi.middleware,
            tableApi.middleware
        ),
})

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()