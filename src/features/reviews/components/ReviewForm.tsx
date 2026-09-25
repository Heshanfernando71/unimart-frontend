import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Rating, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { getApiError } from '../../../utils/apiError'
import type { ReviewUpdateInput } from '../reviewTypes'
import {
  reviewSchema,
  type ReviewFormFields,
  type ReviewFormValues,
} from '../reviewValidation'

interface ReviewFormProps {
  onSubmit: (input: ReviewUpdateInput) => Promise<void>
}

export const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormFields, unknown, ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  })

  const submit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await onSubmit({ ...values, comment: values.comment?.trim() || null })
    } catch (error) {
      const info = getApiError(error)
      if (info.fieldErrors.rating) setError('rating', { message: info.fieldErrors.rating })
      if (info.fieldErrors.comment) setError('comment', { message: info.fieldErrors.comment })
      setSubmitError(info.message)
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      {submitError && <Alert severity="error">{submitError}</Alert>}
      <div>
        <Typography component="label" htmlFor="review-rating" fontWeight={650}>
          Rating <span aria-hidden="true">*</span>
        </Typography>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              id="review-rating"
              name={field.name}
              value={field.value}
              onChange={(_event, value) => field.onChange(value ?? 0)}
              onBlur={field.onBlur}
              size="large"
              aria-label="Rating from 1 to 5 stars"
            />
          )}
        />
        {errors.rating && (
          <Typography color="error" variant="caption" display="block">
            {errors.rating.message}
          </Typography>
        )}
      </div>
      <TextField
        label="Comment (optional)"
        multiline
        minRows={5}
        error={Boolean(errors.comment)}
        helperText={errors.comment?.message ?? 'Maximum 1,000 characters.'}
        inputProps={{ maxLength: 1000 }}
        {...register('comment')}
      />
      <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  )
}
