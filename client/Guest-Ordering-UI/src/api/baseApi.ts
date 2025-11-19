import { startLoading, stopLoading } from "@/lib/uiSlice";
import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";

const customBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL
});

export const baseQueryWithErrorHandling = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {

    api.dispatch(startLoading());

    const result = await customBaseQuery(args, api, extraOptions);

    api.dispatch(stopLoading());

    if (result.error) {
        const { status, data } = result.error;
        console.log({ status, data })
    }

    return result;
};