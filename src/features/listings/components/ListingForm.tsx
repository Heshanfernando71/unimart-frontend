import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getApiError } from '../../../utils/apiError'
import type { ListingInput } from '../listingTypes'
import {
  listingSchema,
  type ListingFormFields,
  type ListingFormValues,
} from '../listingValidation'

interface ListingFormProps {
  initialValues?: ListingInput
  submitLabel: string
  onSubmit: (input: ListingInput) => Promise<void>
}

const emptyValues: ListingFormFields = {
  title: '',
  description: '',
  price: '',
  categoryId: '',
}

export const ListingForm = ({ initialValues, submitLabel, onSubmit }: ListingFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormFields, unknown, ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: initialValues ?? emptyValues,
  })

  useEffect(() => {
    if (initialValues) reset(initialValues)
  }, [initialValues, reset])

  const submit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      await onSubmit(values)
    } catch (error) {
      const info = getApiError(error)
      for (const [field, message] of Object.entries(info.fieldErrors)) {
        if (field === 'title' || field === 'description' || field === 'price' || field === 'categoryId') {
          setError(field, { message })
        }
      }
      setSubmitError(info.message)
    }
  })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      {submitError && <Alert severity="error">{submitError}</Alert>}
      <TextField
        label="Title"
        required
        fullWidth
        autoFocus
        error={Boolean(errors.title)}
        helperText={errors.title?.message ?? 'Use a clear, specific title.'}
        inputProps={{ maxLength: 160 }}
        {...register('title')}
      />
      <TextField
        label="Description"
        required
        fullWidth
        multiline
        minRows={6}
        error={Boolean(errors.description)}
        helperText={errors.description?.message ?? 'Describe the condition and what is included.'}
        inputProps={{ maxLength: 5000 }}
        {...register('description')}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          label="Price (LKR)"
          required
          type="number"
          error={Boolean(errors.price)}
          helperText={errors.price?.message}
          inputProps={{ min: 0, step: '0.01' }}
          {...register('price')}
        />
        <TextField
          label="Category ID"
          required
          type="number"
          error={Boolean(errors.categoryId)}
          helperText={errors.categoryId?.message ?? 'Use the category ID supplied by UniMart.'}
          inputProps={{ min: 1, step: 1 }}
          {...register('categoryId')}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
