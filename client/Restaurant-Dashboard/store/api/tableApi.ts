import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "./baseApi"
import { CreateTableDto, TableCheckoutDto, TableDto } from "@/types/table"
import { ServiceResult } from "@/types/order"

export const tableApi = createApi({
  reducerPath: "tablesApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Table"],
  endpoints: (builder) => ({
    getTables: builder.query<TableDto[], void>({
      query: () => ({ url: "tables" }),
      transformResponse: (response: ServiceResult<TableDto[]>) => response.data ?? [],
      providesTags: (result) =>
        result
          ? [
            ...result.map((table) => ({ type: "Table" as const, id: table.id })),
            { type: "Table", id: "LIST" },
          ]
          : [{ type: "Table", id: "LIST" }],
    }),

    getTableById: builder.query<TableDto, number>({
      query: (id) => `tables/${id}`,
      transformResponse: (response: ServiceResult<TableDto>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: "Table", id }],
    }),

    createTable: builder.mutation<TableDto, CreateTableDto>({
      query: (table) => ({
        url: "tables",
        method: "POST",
        body: table,
      }),
      invalidatesTags: [{ type: "Table", id: "LIST" }],
    }),

    updateTable: builder.mutation<void, TableDto>({
      query: (table) => ({
        url: `tables/${table.id}`,
        method: "PUT",
        body: table,
      }),
      invalidatesTags: (_result, _error, table) => [
        { type: "Table", id: table.id },
        { type: "Table", id: "LIST" },
      ],
    }),

    deleteTable: builder.mutation<void, number>({
      query: (id) => ({
        url: `tables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Table", id },
        { type: "Table", id: "LIST" },
      ],
    }),

    checkoutTable: builder.mutation<ServiceResult<TableCheckoutDto>, number>({
      query: (id) => ({ url: `tables/${id}/checkout`, method: "POST" }),
      invalidatesTags: [{ type: "Table", id: "LIST" }],
    }),
  }),
})

export const {
  useGetTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useCheckoutTableMutation,
} = tableApi
