import { Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import type { Listing } from '../listingTypes'

interface ListingCardProps {
  listing: Listing
  actions?: ReactNode
}

const statusColor = (status: Listing['status']) => {
  if (status === 'AVAILABLE') return 'success'
  if (status === 'RESERVED') return 'warning'
  return 'default'
}

export const ListingCard = ({ listing, actions }: ListingCardProps) => {
  const description = listing.description.length > 145
    ? `${listing.description.slice(0, 142).trimEnd()}…`
    : listing.description

  return (
    <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="flex-1">
        <div className="mb-3 flex items-start justify-between gap-3">
          <Typography variant="overline" color="primary" className="font-semibold">
            {listing.categoryName}
          </Typography>
          <Chip label={listing.status} color={statusColor(listing.status)} size="small" />
        </div>
        <Typography component="h2" variant="h6" className="mb-2">
          {listing.title}
        </Typography>
        <Typography color="text.secondary" className="min-h-12">
          {description}
        </Typography>
        <Typography variant="h6" color="primary" className="mt-5">
          LKR {listing.price.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
        </Typography>
      </CardContent>
      <CardActions className="flex-wrap justify-between gap-2 px-4 pb-4">
        <Button component={RouterLink} to={`/listings/${listing.id}`} variant="outlined">
          View listing
        </Button>
        {actions}
      </CardActions>
    </Card>
  )
}
