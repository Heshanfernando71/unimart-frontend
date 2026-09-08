import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api/v1/',
    prepareHeaders: (headers) => {
      // Use dummy auth token for frontend standalone testing
      headers.set('authorization', `Bearer dummy-mock-token-12345`)
      return headers
    },
  }),
  endpoints: () => ({}),
})
