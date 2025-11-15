import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import type { VerifyTable } from "@/models/table";

export const tableApi = createApi({
    reducerPath: 'tableApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        verifyTable: builder.query<VerifyTable, string>({
            query: (code) => ({
                url: "tables/verify",
                method: 'GET',
                params: { code },
            }),
        }),
    }),
})

export const { useVerifyTableQuery, useLazyVerifyTableQuery } = tableApi