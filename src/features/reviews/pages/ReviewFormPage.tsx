import { Alert, Button, Paper, Snackbar } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { PageHeading } from '../../../components/common/PageHeading'
import { StatePanel } from '../../../components/feedback/StatePanel'
import { ReviewForm } from '../components/ReviewForm'
import { useCreateReviewMutation } from '../reviewsApi'
import type { ReviewUpdateInput } from '../reviewTypes'

export const ReviewFormPage = () => {
  const { orderId: orderIdParam } = useParams()
  const orderId = Number(orderIdParam)
  const [createReview] = useCreateReviewMutation()
  const [submitted, setSubmitted] = useState(false)

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return (
      <StatePanel
        severity="warning"
        title="Invalid order"
        message="This review link does not contain a valid order number."
        action={<Button component={RouterLink} to="/" variant="contained">Browse listings</Button>}
      />
    )
  }

  const submit = async (input: ReviewUpdateInput) => {
    await createReview({ orderId, ...input }).unwrap()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeading
        title="Review your order"
        description="Reviews are available to the buyer after an order is completed. Only one review can be submitted per order."
      />
      <Paper className="p-5 sm:p-8">
        {submitted ? (
          <Alert
            severity="success"
            action={<Button component={RouterLink} to="/" color="inherit">Browse</Button>}
          >
            Your review has been submitted. Thank you for helping the UniMart community.
          </Alert>
        ) : (
          <ReviewForm onSubmit={submit} />
        )}
      </Paper>
      <Snackbar open={submitted} autoHideDuration={5000} message="Review submitted successfully" />
    </div>
  )
}
