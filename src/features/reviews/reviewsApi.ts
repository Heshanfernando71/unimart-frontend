import { baseApi } from '../../services/baseApi'
import type { Page } from '../../utils/types'
import type {
  Review,
  ReviewCreateInput,
  UpdateReviewInput,
} from './reviewTypes'

interface ListingReviewsQuery {
  listingId: number
  page?: number
}

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListingReviews: builder.query<Page<Review>, ListingReviewsQuery>({
      query: ({ listingId, page }) => ({
        url: `/listings/${listingId}/reviews`,
        params: page === undefined ? undefined : { page },
      }),
      providesTags: (result, _error, { listingId }) => [
        { type: 'Review', id: 'LIST' },
        { type: 'Review', id: `LISTING-${listingId}` },
        ...(result?.content.map(({ id }) => ({ type: 'Review' as const, id })) ?? []),
      ],
    }),
    createReview: builder.mutation<Review, ReviewCreateInput>({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),
    updateReview: builder.mutation<Review, UpdateReviewInput>({
      query: ({ id, input }) => ({ url: `/reviews/${id}`, method: 'PUT', body: input }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' },
      ],
    }),
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Review', id },
        { type: 'Review', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetListingReviewsQuery,
  useUpdateReviewMutation,
} = reviewsApi
