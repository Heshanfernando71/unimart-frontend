import { z } from 'zod'

export const listingSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(160, 'Title must be 160 characters or fewer.'),
  description: z.string().trim().min(1, 'Description is required.').max(5000, 'Description must be 5,000 characters or fewer.'),
  price: z.coerce.number().min(0, 'Price cannot be negative.'),
  categoryId: z.coerce.number().int('Category ID must be a whole number.').positive('Category ID must be positive.'),
})

export type ListingFormFields = z.input<typeof listingSchema>
export type ListingFormValues = z.output<typeof listingSchema>
