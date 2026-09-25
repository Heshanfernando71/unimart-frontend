export type ListingStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ARCHIVED'

export interface Listing {
  id: number
  sellerId: number
  sellerName: string
  categoryId: number
  categoryName: string
  title: string
  description: string
  price: number
  status: ListingStatus
  createdAt: string
  updatedAt: string
}

export interface ListingInput {
  title: string
  description: string
  price: number
  categoryId: number
}

export interface ListingQuery {
  page?: number
  size?: number
  q?: string
  categoryId?: number
  status?: ListingStatus
}

export interface UpdateListingInput {
  id: number
  input: ListingInput
}
