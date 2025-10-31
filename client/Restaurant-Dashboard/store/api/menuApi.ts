import type { MenuItem } from "@/types/menuItem"
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
        }),
        // Thêm các endpoints cho CRUD operations
        createMenuItem: builder.mutation<MenuItem, Partial<MenuItem>>({
            query: (newItem) => ({
                url: 'menuitems',
                method: 'POST',
                body: newItem,
            }),
            invalidatesTags: ["MenuItem"],
        }),
        updateMenuItem: builder.mutation<MenuItem, { id: number; updates: Partial<MenuItem> }>({
            query: ({ id, updates }) => ({
                url: `menuitems/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ["MenuItem"],
        }),
        deleteMenuItem: builder.mutation<void, number>({
            query: (id) => ({
                url: `menuitems/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["MenuItem"],
        }),
    })
})

// Export hooks
export const {
    useGetMenuItemsQuery,
    useGetMenuItemByIdQuery,
    useGetCategoriesQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = menuApi;