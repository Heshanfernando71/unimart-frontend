import { baseApi } from '../../services/baseApi'
import type { Page } from '../../utils/types'
import type {
  Listing,
  ListingInput,
  ListingQuery,
  UpdateListingInput,
} from './listingTypes'

const toParams = (query: ListingQuery) => {
  const params: Record<string, string | number> = {}
  if (query.page !== undefined) params.page = query.page
  if (query.size !== undefined) params.size = query.size
  if (query.q?.trim()) params.q = query.q.trim()
  if (query.categoryId !== undefined) params.categoryId = query.categoryId
  if (query.status) params.status = query.status
  return params
}

export const listingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<Page<Listing>, ListingQuery>({
      query: (query) => ({ url: '/listings', params: toParams(query) }),
      providesTags: (result) => [
        { type: 'Listing', id: 'LIST' },
        ...(result?.content.map(({ id }) => ({ type: 'Listing' as const, id })) ?? []),
      ],
    }),
    getListing: builder.query<Listing, number>({
      query: (id) => `/listings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Listing', id }],
    }),
    createListing: builder.mutation<Listing, ListingInput>({
      query: (body) => ({ url: '/listings', method: 'POST', body }),
      invalidatesTags: [{ type: 'Listing', id: 'LIST' }],
    }),
    updateListing: builder.mutation<Listing, UpdateListingInput>({
      query: ({ id, input }) => ({ url: `/listings/${id}`, method: 'PUT', body: input }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Listing', id },
        { type: 'Listing', id: 'LIST' },
      ],
    }),
    archiveListing: builder.mutation<void, number>({
      query: (id) => ({ url: `/listings/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Listing', id },
        { type: 'Listing', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useArchiveListingMutation,
  useCreateListingMutation,
  useGetListingQuery,
  useGetListingsQuery,
  useUpdateListingMutation,
} = listingsApi
