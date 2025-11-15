import type { MenuItem, MenuItemPayload } from "@/types/menuItem"
import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "./baseApi"

export const menuApi = createApi({
    reducerPath: "menuApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["MenuItem"],
    endpoints: (builder) => ({
        // GET all menu items
        getMenuItems: builder.query<MenuItem[], void>({
            query: () => ({ url: "menuitems" }),
            providesTags: ["MenuItem"],
        }),

        // GET one item by ID
        getMenuItemById: builder.query<MenuItem, number>({
            query: (id) => ({ url: `menuitems/${id}` }),
            providesTags: ["MenuItem"],
        }),

        // GET distinct categories
        getCategories: builder.query<string[], void>({
            query: () => ({ url: "menuitems/categories" }),
        }),

        // CREATE new menu item
        createMenuItem: builder.mutation<MenuItem, MenuItemPayload>({
            query: (newItem) => ({
                url: "menuitems",
                method: "POST",
                body: newItem,
            }),
            invalidatesTags: ["MenuItem"],
        }),

        // UPDATE existing menu item
        updateMenuItem: builder.mutation<void, { id: number; updates: MenuItemPayload }>({
            query: ({ id, updates }) => ({
                url: `menuitems/${id}`,
                method: "PUT",
                body: updates,
            }),
            invalidatesTags: ["MenuItem"],
        }),

        // DELETE menu item
        deleteMenuItem: builder.mutation<void, number>({
            query: (id) => ({
                url: `menuitems/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItem"],
        }),
    }),
})

// Export hooks
export const {
    useGetMenuItemsQuery,
    useGetMenuItemByIdQuery,
    useGetCategoriesQuery,
    useCreateMenuItemMutation,
    useUpdateMenuItemMutation,
    useDeleteMenuItemMutation,
} = menuApi
