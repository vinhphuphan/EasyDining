import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query";

const customBaseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:7184/api'
});

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (agrs: string | FetchArgs, api: BaseQueryApi,
    extraOptions: object) => {
    // start loading
    await sleep();
    const result = await customBaseQuery(agrs, api, extraOptions);
    // stop loading
    if (result.error) {
        const { status, data } = result.error;
        console.log({ status, data })
    }
    return result;
};