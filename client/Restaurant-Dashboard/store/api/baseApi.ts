import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query"

const customBaseQuery = fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
})

// Giữ tối giản như cũ
const sleep = () => new Promise((r) => setTimeout(r, 1000))

export const baseQueryWithErrorHandling = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {
    await sleep()
    const result = await customBaseQuery(args, api, extraOptions)
    if (result.error) {
        const { status, data } = result.error
        console.log({ status, data })
    }
    return result
}
