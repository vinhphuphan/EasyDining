import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "./baseApi"
import type { Table } from "@/lib/types"

export const tablesApi = createApi({
    reducerPath: "tablesApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["Table"],
    endpoints: (builder) => ({
        getTables: builder.query<Table[], void>({
            query: () => ({ url: "tables" }),
            providesTags: ["Table"],
        }),
        getTableById: builder.query<Table, number>({
            query: (id) => ({ url: `tables/${id}` }),
            providesTags: (_r, _e, id) => [{ type: "Table", id }],
        }),

        // Tuỳ nhu cầu – bật khi bạn triển khai non-GET:
        createTable: builder.mutation<Table, Partial<Table>>({
            query: (body) => ({ url: "tables", method: "POST", body }),
            invalidatesTags: ["Table"],
        }),
        updateTable: builder.mutation<void, { id: number; updates: Partial<Table> }>({
            query: ({ id, updates }) => ({ url: `tables/${id}`, method: "PUT", body: updates }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "Table", id }, "Table"],
        }),
        deleteTable: builder.mutation<void, number>({
            query: (id) => ({ url: `tables/${id}`, method: "DELETE" }),
            invalidatesTags: ["Table"],
        }),
    }),
})

export const {
    useGetTablesQuery,
    useGetTableByIdQuery,
    useCreateTableMutation,
    useUpdateTableMutation,
    useDeleteTableMutation,
} = tablesApi
