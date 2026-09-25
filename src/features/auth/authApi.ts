import { baseApi } from '../../services/baseApi'
import { credentialsReceived } from './authSlice'
import type { AuthResponse, LoginInput } from './authTypes'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_input, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(credentialsReceived(data))
      },
    }),
    refreshSession: builder.mutation<AuthResponse, void>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
      async onQueryStarted(_input, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(credentialsReceived(data))
        } catch {
          // A missing/expired refresh cookie is a normal signed-out state.
        }
      },
    }),
  }),
})

export const { useLoginMutation, useRefreshSessionMutation } = authApi
