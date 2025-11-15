import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "./baseApi";
import { GetOrdersParams, OrderDto, PagedList, ServiceResult, UpdateOrderStatusDto, CreateOrderRequest } from "@/types/order";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        getOrders: builder.query<ServiceResult<PagedList<OrderDto>>, GetOrdersParams | void>({
            query: (params) => ({ url: "orders", params: params ?? undefined }),
            providesTags: ["Order"],
        }),
        getOrderById: builder.query<ServiceResult<OrderDto>, number>({
            query: (id) => ({ url: `orders/${id}` }),
            providesTags: (_res, _err, id) => [{ type: "Order", id }],
        }),
        updateOrderStatus: builder.mutation<{ message: string }, UpdateOrderStatusDto>({
            query: (body) => ({
                url: "orders/update-status",
                method: "PUT",
                body
            }),
            invalidatesTags: ["Order"]
        }),

        createOrder: builder.mutation<ServiceResult<OrderDto>, CreateOrderRequest>({
            query: (body) => ({
                url: "orders",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Order"],
        }),

    })
})

// Export hooks
export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useCreateOrderMutation,
} = ordersApi
