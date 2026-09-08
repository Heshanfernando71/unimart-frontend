import { baseApi } from '../../app/api/baseApi'

// In-Memory Mock Data
let mockListings = [
  { id: 1, title: 'Mock Textbook', price: 25.00, description: 'Almost new math textbook (Mock Data)', status: 'AVAILABLE' },
  { id: 2, title: 'Mock Laptop', price: 400.00, description: 'Used for 2 years (Mock Data)', status: 'AVAILABLE' }
];

export const listingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<any[], void>({
      queryFn: () => {
        return { data: [...mockListings] }
      },
    }),
    createListing: builder.mutation<any, any>({
      queryFn: (listing) => {
        const newListing = { ...listing, id: Math.floor(Math.random() * 1000) }
        mockListings = [...mockListings, newListing]
        return { data: newListing }
      },
    }),
  }),
})

export const { useGetListingsQuery, useCreateListingMutation } = listingsApi
