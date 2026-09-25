import { Button, MenuItem, Pagination, Paper, TextField } from '@mui/material'
import { type FormEvent, useState } from 'react'
import { PageHeading } from '../../../components/common/PageHeading'
import { ListingGridSkeleton } from '../../../components/feedback/ListingGridSkeleton'
import { StatePanel } from '../../../components/feedback/StatePanel'
import { getApiError } from '../../../utils/apiError'
import { ListingCard } from '../components/ListingCard'
import { useGetListingsQuery } from '../listingsApi'
import type { ListingQuery, ListingStatus } from '../listingTypes'

const PAGE_SIZE = 9

export const ListingsPage = () => {
  const [query, setQuery] = useState<ListingQuery>({ page: 0, size: PAGE_SIZE, status: 'AVAILABLE' })
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<ListingStatus | ''>('AVAILABLE')
  const { data, isLoading, isFetching, error, refetch } = useGetListingsQuery(query)

  const applyFilters = (event: FormEvent) => {
    event.preventDefault()
    const parsedCategory = categoryId ? Number(categoryId) : undefined
    setQuery({
      page: 0,
      size: PAGE_SIZE,
      q: search.trim() || undefined,
      categoryId: parsedCategory && parsedCategory > 0 ? parsedCategory : undefined,
      status: status || undefined,
    })
  }

  const clearFilters = () => {
    setSearch('')
    setCategoryId('')
    setStatus('AVAILABLE')
    setQuery({ page: 0, size: PAGE_SIZE, status: 'AVAILABLE' })
  }

  return (
    <>
      <PageHeading
        title="Browse listings"
        description="Find useful items from members of your university community."
      />
      <Paper component="form" onSubmit={applyFilters} className="mb-7 p-4" aria-label="Listing filters">
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <TextField label="Search listings" value={search} onChange={(event) => setSearch(event.target.value)} />
          <TextField
            label="Category ID"
            type="number"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            inputProps={{ min: 1, step: 1 }}
          />
          <TextField select label="Status" value={status} onChange={(event) => setStatus(event.target.value as ListingStatus | '')}>
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="RESERVED">Reserved</MenuItem>
            <MenuItem value="SOLD">Sold</MenuItem>
            <MenuItem value="ARCHIVED">Archived</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" size="large" disabled={isFetching}>Search</Button>
        </div>
        <Button onClick={clearFilters} className="mt-2">Clear filters</Button>
      </Paper>

      {isLoading ? (
        <ListingGridSkeleton />
      ) : error ? (
        <StatePanel
          severity="error"
          title="Listings are unavailable"
          message={getApiError(error).message}
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : !data?.content.length ? (
        <StatePanel
          title="No listings match"
          message="Try a different search, category, or status."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`} aria-busy={isFetching}>
            {data.content.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
          {data.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={data.number + 1}
                count={data.totalPages}
                color="primary"
                onChange={(_event, page) => setQuery((current) => ({ ...current, page: page - 1 }))}
                aria-label="Listings pages"
              />
            </div>
          )}
        </>
      )}
    </>
  )
}
