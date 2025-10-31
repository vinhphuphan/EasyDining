import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "./baseApi"

// Backend Table DTO shape
export interface TableDto {
  id: number
  name: string
  status: "Available" | "Occupied" | "Reserved"
  hashCode: string
  seats: number
}

export const tablesApi = createApi({
  reducerPath: "tablesApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Table"],
  endpoints: (builder) => ({
    getTables: builder.query<TableDto[], void>({
      query: () => ({ url: "tables" }),
      providesTags: ["Table"],
    }),
  }),
})

export const { useGetTablesQuery } = tablesApi

