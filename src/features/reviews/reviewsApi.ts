import { baseApi } from '../../app/api/baseApi'

// In-Memory Mock Data
let mockReviews = [
  { id: 1, rating: 5, comment: 'Great seller! (Mock Data)' }
];

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<any[], void>({
      queryFn: () => {
        return { data: [...mockReviews] }
      },
    }),
    createReview: builder.mutation<any, any>({
      queryFn: (review) => {
        const newReview = { ...review, id: Math.floor(Math.random() * 1000) }
        mockReviews = [...mockReviews, newReview]
        return { data: newReview }
      },
    }),
  }),
})

export const { useGetReviewsQuery, useCreateReviewMutation } = reviewsApi
