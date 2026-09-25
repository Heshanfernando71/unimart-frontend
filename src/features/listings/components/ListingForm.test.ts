import { describe, expect, it } from 'vitest'
import { listingSchema } from '../listingValidation'

describe('listingSchema', () => {
  it('rejects a blank title', () => {
    const result = listingSchema.safeParse({
      title: '   ',
      description: 'A useful item',
      price: 100,
      categoryId: 1,
    })

    expect(result.success).toBe(false)
  })
})
