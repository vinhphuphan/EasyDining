import type { MenuItem } from "@/models/menuItem"
import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "./baseApi";


export const menuApi = createApi({
    reducerPath: "menuApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["MenuItem"],
    endpoints: (builder) => ({
        getMenuItems: builder.query<MenuItem[], void>({
            query: () => ({ url: 'menuitems' }),
            providesTags: ["MenuItem"],
        }),
        getMenuItemById: builder.query<MenuItem, number>({
            query: (id) => ({ url: `menuitems/${id}` }),
            providesTags: ["MenuItem"],
        }),
        getCategories: builder.query<string[], void>({
            query: () => ({ url: "menuitems/categories" }),
        })
    })
})

// Export hooks
export const {
    useGetMenuItemsQuery,
    useGetMenuItemByIdQuery,
    useGetCategoriesQuery,
} = menuApi;