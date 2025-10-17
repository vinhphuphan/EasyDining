import type { MenuItem } from "@/models/menuItem"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"


export const menuApi = createApi({
    reducerPath: "menuApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:7184/api", // Server URL
    }),
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
    })
})

export const { useGetMenuItemsQuery, useGetMenuItemByIdQuery } = menuApi;