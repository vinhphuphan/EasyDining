import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query"

const customBaseQuery = fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
})


export const baseQueryWithErrorHandling = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {
    
    const result = await customBaseQuery(args, api, extraOptions)

    if (result.error) {
        const { status, data } = result.error
        console.log({ status, data })
    }

    return result
}
