import { describe, expect, it } from 'vitest'
import { reviewSchema } from '../reviewValidation'

describe('reviewSchema', () => {
  it.each([0, 6])('rejects an out-of-range rating of %i', (rating) => {
    expect(reviewSchema.safeParse({ rating, comment: '' }).success).toBe(false)
  })
})
