import { Button, Chip, Divider, Paper, Snackbar, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { StatePanel } from '../../../components/feedback/StatePanel'
import { getApiError, isNotFoundError } from '../../../utils/apiError'
import { ReviewList } from '../../reviews/components/ReviewList'
import { ArchiveListingButton } from '../components/ArchiveListingButton'
import { useGetListingQuery } from '../listingsApi'

interface DetailsLocationState {
  notice?: string
}

export const ListingDetailsPage = () => {
  const { id: idParam } = useParams()
  const id = Number(idParam)
  const invalidId = !Number.isInteger(id) || id <= 0
  const { data: listing, isLoading, error, refetch } = useGetListingQuery(id, { skip: invalidId })
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()
  const navigate = useNavigate()
  const notice = (location.state as DetailsLocationState | null)?.notice
  const [snackbarOpen, setSnackbarOpen] = useState(Boolean(notice))

  if (invalidId || isNotFoundError(error)) {
    return (
      <StatePanel
        severity="warning"
        title="Listing not found"
        message="This listing may have been removed, or the link may be incorrect."
        action={<Button component={RouterLink} to="/" variant="contained">Back to listings</Button>}
      />
    )
  }

  if (isLoading) return <div className="py-20 text-center" role="status">Loading listing…</div>

  if (error || !listing) {
    return (
      <StatePanel
        severity="error"
        title="Could not load this listing"
        message={getApiError(error).message}
        actionLabel="Retry"
        onAction={() => void refetch()}
      />
    )
  }

  const isOwner = user?.id === listing.sellerId

  return (
    <div className="mx-auto max-w-4xl">
      <Button component={RouterLink} to="/" className="mb-4">← Back to listings</Button>
      <Paper className="p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <Typography color="primary" variant="overline">{listing.categoryName}</Typography>
            <Typography component="h1" variant="h4">{listing.title}</Typography>
            <Typography color="text.secondary" className="mt-2">Sold by {listing.sellerName}</Typography>
          </div>
          <Chip label={listing.status} color={listing.status === 'AVAILABLE' ? 'success' : 'default'} />
        </div>
        <Typography variant="h5" color="primary" className="mt-7">
          LKR {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
        </Typography>
        <Divider className="my-6" />
        <Typography component="h2" variant="h6" gutterBottom>Description</Typography>
        <Typography className="whitespace-pre-line">{listing.description}</Typography>
        {isOwner && (
          <div className="mt-7 flex flex-wrap gap-2">
            <Button component={RouterLink} to={`/listings/${listing.id}/edit`} variant="contained">Edit listing</Button>
            <ArchiveListingButton listingId={listing.id} listingTitle={listing.title} onArchived={() => navigate('/my/listings')} />
          </div>
        )}
      </Paper>
      <Paper className="mt-6 p-5 sm:p-8">
        <Typography component="h2" variant="h5" className="mb-5">Seller reviews</Typography>
        <ReviewList key={listing.id} listingId={listing.id} />
      </Paper>
      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)} message={notice} />
    </div>
  )
}
