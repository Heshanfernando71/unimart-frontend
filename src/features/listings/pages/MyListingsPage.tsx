import { Alert, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { PageHeading } from '../../../components/common/PageHeading'
import { ListingGridSkeleton } from '../../../components/feedback/ListingGridSkeleton'
import { StatePanel } from '../../../components/feedback/StatePanel'
import { getApiError } from '../../../utils/apiError'
import { ArchiveListingButton } from '../components/ArchiveListingButton'
import { ListingCard } from '../components/ListingCard'
import { useGetListingsQuery } from '../listingsApi'

// TODO(api): Replace this bounded client-side filter if the backend adds a
// documented current-user listings endpoint or sellerId query parameter.
const MY_LISTINGS_FALLBACK_PAGE_SIZE = 100

export const MyListingsPage = () => {
  const user = useAppSelector((state) => state.auth.user)
  const { data, isLoading, error, refetch } = useGetListingsQuery({ page: 0, size: MY_LISTINGS_FALLBACK_PAGE_SIZE })
  const listings = data?.content.filter((listing) => listing.sellerId === user?.id) ?? []

  return (
    <>
      <PageHeading
        title="My listings"
        description="Manage the items you have posted to UniMart."
        action={<Button component={RouterLink} to="/listings/new" variant="contained">Create listing</Button>}
      />
      <Alert severity="info" className="mb-6">
        UniMart currently filters your listings from the documented listings feed. Up to 100 recent listings are checked.
      </Alert>
      {isLoading ? (
        <ListingGridSkeleton />
      ) : error ? (
        <StatePanel severity="error" title="Could not load your listings" message={getApiError(error).message} actionLabel="Retry" onAction={() => void refetch()} />
      ) : listings.length === 0 ? (
        <StatePanel
          title="You have no listings yet"
          message="Create your first listing and offer an item to the university community."
          action={<Button component={RouterLink} to="/listings/new" variant="contained">Create listing</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              actions={(
                <div className="flex gap-1">
                  <Button component={RouterLink} to={`/listings/${listing.id}/edit`}>Edit</Button>
                  <ArchiveListingButton listingId={listing.id} listingTitle={listing.title} />
                </div>
              )}
            />
          ))}
        </div>
      )}
    </>
  )
}
