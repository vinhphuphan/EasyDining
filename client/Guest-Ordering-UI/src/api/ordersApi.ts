import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithErrorHandling } from './baseApi'
import type { Order, CreateOrderRequest, ServiceResult } from '@/models/order'

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        createOrder: builder.mutation<ServiceResult<Order>, CreateOrderRequest>({
            query: (body) => ({
                url: 'orders',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Order'],
        }),
        getOrderById: builder.query<ServiceResult<Order>, number>({
            query: (id) => ({ url: `orders/${id}` }),
            providesTags: ['Order'],
        }),
    }),
})

export const { useCreateOrderMutation, useGetOrderByIdQuery } = ordersApi