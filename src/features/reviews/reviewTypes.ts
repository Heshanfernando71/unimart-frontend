export interface Review {
  id: number
  orderId: number
  reviewerName: string
  revieweeId: number
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
}

export interface ReviewCreateInput {
  orderId: number
  rating: number
  comment?: string | null
}

export interface ReviewUpdateInput {
  rating: number
  comment?: string | null
}

export interface UpdateReviewInput {
  id: number
  input: ReviewUpdateInput
}
