import React from 'react'
import { ListingCard } from './features/listings/components/ListingCard'
import { ListingForm } from './features/listings/components/ListingForm'
import { useGetListingsQuery } from './features/listings/listingsApi'
import { Typography, CircularProgress, Alert } from '@mui/material'

function App() {
  const { data: listings, isLoading, isError } = useGetListingsQuery()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">UniMart Listings (Standalone Mock Mode)</h1>
      <div className="mb-8">
        <ListingForm />
      </div>
      
      {isLoading && <CircularProgress className="mt-4" />}
      {isError && <Alert severity="error">Failed to fetch mock listings!</Alert>}
      
      {listings && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {listings.map((listing) => (
            <ListingCard 
              key={listing.id}
              id={listing.id} 
              title={listing.title} 
              price={listing.price} 
              description={listing.description} 
              status={listing.status} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
