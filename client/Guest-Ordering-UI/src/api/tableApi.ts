import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseApi";
import type { VerifyTable } from "@/models/table";
import type { ServiceResult } from "@/models/order";

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
            transformResponse: (response: ServiceResult<VerifyTable>) => response.data,
        }),
    }),
})

export const { useVerifyTableQuery, useLazyVerifyTableQuery } = tableApi