import { startLoading, stopLoading } from "@/lib/uiSlice";
import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";

const customBaseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:7184/api'
});


export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi,
    extraOptions: object) => {

    console.log("🌐 API Request:", args);

    api.dispatch(startLoading());


    const result = await customBaseQuery(args, api, extraOptions);

    api.dispatch(stopLoading());

    console.log("📡 API Response:", result);

    if (result.error) {
        const { status, data } = result.error;
        console.log({ status, data })
    }

    return result;
};