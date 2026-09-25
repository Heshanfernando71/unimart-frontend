import { Button, Paper } from '@mui/material'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { PageHeading } from '../../../components/common/PageHeading'
import { StatePanel } from '../../../components/feedback/StatePanel'
import { getApiError, isNotFoundError } from '../../../utils/apiError'
import { ListingForm } from '../components/ListingForm'
import { useCreateListingMutation, useGetListingQuery, useUpdateListingMutation } from '../listingsApi'
import type { ListingInput } from '../listingTypes'

export const ListingFormPage = () => {
  const { id: idParam } = useParams()
  const isEditing = idParam !== undefined
  const id = Number(idParam)
  const invalidId = isEditing && (!Number.isInteger(id) || id <= 0)
  const { data: listing, isLoading, error, refetch } = useGetListingQuery(id, { skip: !isEditing || invalidId })
  const [createListing] = useCreateListingMutation()
  const [updateListing] = useUpdateListingMutation()
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()

  if (invalidId || isNotFoundError(error)) {
    return (
      <StatePanel
        severity="warning"
        title="Listing not found"
        message="The listing you want to edit does not exist."
        action={<Button component={RouterLink} to="/my/listings" variant="contained">My listings</Button>}
      />
    )
  }

  if (isEditing && isLoading) return <div className="py-20 text-center" role="status">Loading listing…</div>

  if (isEditing && error) {
    return (
      <StatePanel severity="error" title="Could not load this listing" message={getApiError(error).message} actionLabel="Retry" onAction={() => void refetch()} />
    )
  }

  if (isEditing && listing && listing.sellerId !== user?.id) {
    return (
      <StatePanel
        severity="error"
        title="Owner access required"
        message="Only the listing owner can edit this listing. The backend also enforces this permission."
        action={<Button component={RouterLink} to={`/listings/${listing.id}`} variant="contained">View listing</Button>}
      />
    )
  }

  const submit = async (input: ListingInput) => {
    if (isEditing) {
      await updateListing({ id, input }).unwrap()
      navigate(`/listings/${id}`, { state: { notice: 'Listing updated successfully.' } })
    } else {
      const created = await createListing(input).unwrap()
      navigate(`/listings/${created.id}`, { state: { notice: 'Listing created successfully.' } })
    }
  }

  const initialValues = listing
    ? { title: listing.title, description: listing.description, price: listing.price, categoryId: listing.categoryId }
    : undefined

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        title={isEditing ? 'Edit listing' : 'Create a listing'}
        description={isEditing ? 'Keep your listing accurate for potential buyers.' : 'Share an item with the UniMart community.'}
      />
      <Paper className="p-5 sm:p-8">
        <ListingForm initialValues={initialValues} submitLabel={isEditing ? 'Save changes' : 'Publish listing'} onSubmit={submit} />
      </Paper>
    </div>
  )
}
