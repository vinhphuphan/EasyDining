import { configureStore } from "@reduxjs/toolkit"
import { menuApi } from "../api/menuApi"
import { uiSlice } from "@/lib/uiSlice"
import { useDispatch, useSelector } from "react-redux"

export const store = configureStore({
    reducer: {
        [menuApi.reducerPath]: menuApi.reducer,
        ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            menuApi.middleware,
        ),
})

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()