import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Choose at least one star.').max(5, 'Rating cannot exceed five stars.'),
  comment: z.string().max(1000, 'Comment must be 1,000 characters or fewer.').optional(),
})

export type ReviewFormFields = z.input<typeof reviewSchema>
export type ReviewFormValues = z.output<typeof reviewSchema>
