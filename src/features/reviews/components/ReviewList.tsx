import { Alert, Divider, Pagination, Rating, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import { getApiError } from '../../../utils/apiError'
import { useGetListingReviewsQuery } from '../reviewsApi'

interface ReviewListProps {
  listingId: number
}

export const ReviewList = ({ listingId }: ReviewListProps) => {
  const [page, setPage] = useState(0)
  const { data, isLoading, isFetching, error, refetch } = useGetListingReviewsQuery({ listingId, page })

  if (isLoading) {
    return (
      <div aria-label="Loading reviews" className="space-y-4">
        <Skeleton height={70} />
        <Skeleton height={70} />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={<button className="cursor-pointer underline" onClick={() => void refetch()}>Retry</button>}
      >
        {getApiError(error).message}
      </Alert>
    )
  }

  if (!data?.content.length) {
    return <Alert severity="info">No reviews yet. Completed buyers can leave the first review.</Alert>
  }

  return (
    <div>
      <div className={`space-y-4 ${isFetching ? 'opacity-60' : ''}`} aria-busy={isFetching}>
        {data.content.map((review, index) => (
          <article key={review.id}>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <Typography component="h3" variant="subtitle1" fontWeight={700}>
                  {review.reviewerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.createdAt).toLocaleDateString('en-LK')}
                </Typography>
              </div>
              <Rating value={review.rating} readOnly aria-label={`${review.rating} out of 5 stars`} />
            </div>
            <Typography className="mt-2 whitespace-pre-line">
              {review.comment || 'No written comment.'}
            </Typography>
            {index < data.content.length - 1 && <Divider className="mt-4" />}
          </article>
        ))}
      </div>
      {data.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={data.number + 1}
            count={data.totalPages}
            color="primary"
            disabled={isFetching}
            onChange={(_event, selectedPage) => setPage(selectedPage - 1)}
            aria-label="Review pages"
          />
        </div>
      )}
    </div>
  )
}
