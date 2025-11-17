import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithErrorHandling } from "./baseApi"
import type { User, UserPayload } from "@/types/user"

type UserListQuery = {
    search?: string
    sort?: string
    page?: number
    pageSize?: number
} | void

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ["User"],
    endpoints: (builder) => ({

        // GET /api/users
        getUsers: builder.query<User[], UserListQuery>({
            query: (params) => {
                if (!params) {
                    return { url: "users" }
                }

                const searchParams = new URLSearchParams()
                if (params.search) searchParams.set("search", params.search)
                if (params.sort) searchParams.set("sort", params.sort)
                if (params.page) searchParams.set("page", String(params.page))
                if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))

                const qs = searchParams.toString()
                return {
                    url: qs ? `users?${qs}` : "users",
                }
            },
            providesTags: ["User"],
        }),

        // GET /api/users/:id
        getUserById: builder.query<User, number>({
            query: (id) => ({ url: `users/${id}` }),
            providesTags: ["User"],
        }),

        // POST /api/users
        createUser: builder.mutation<User, UserPayload>({
            query: (payload) => ({
                url: "users",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["User"],
        }),

        // PUT /api/users/:id
        updateUser: builder.mutation<
            { success?: boolean; message?: string } | any,
            { id: number; updates: UserPayload }
        >({
            query: ({ id, updates }) => ({
                url: `users/${id}`,
                method: "PUT",
                body: updates,
            }),
            invalidatesTags: ["User"],
        }),

        // DELETE /api/users/:id
        deleteUser: builder.mutation<{ success?: boolean } | any, number>({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
    }),
})

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = userApi
