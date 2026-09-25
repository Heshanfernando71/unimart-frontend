import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { credentialsReceived, signedOut } from '../features/auth/authSlice'
import type { AuthResponse, AuthState } from '../features/auth/authTypes'

const mutex = new Mutex()

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
  timeout: 10_000,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.accessToken
    headers.set('Accept', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

const baseQueryWithReauthentication: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()
  let result = await rawBaseQuery(args, api, extraOptions)

  const url = typeof args === 'string' ? args : args.url
  if (result.error?.status !== 401 || url === '/auth/refresh') return result

  if (!mutex.isLocked()) {
    const release = await mutex.acquire()
    try {
      const refreshResult = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions,
      )

      if (refreshResult.data) {
        api.dispatch(credentialsReceived(refreshResult.data as AuthResponse))
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        api.dispatch(signedOut())
      }
    } finally {
      release()
    }
  } else {
    await mutex.waitForUnlock()
    result = await rawBaseQuery(args, api, extraOptions)
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauthentication,
  tagTypes: ['Listing', 'Review'],
  endpoints: () => ({}),
})
