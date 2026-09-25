import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { Listing } from '../listingTypes'
import { ListingCard } from './ListingCard'

const listing: Listing = {
  id: 42,
  sellerId: 7,
  sellerName: 'Test Seller',
  categoryId: 3,
  categoryName: 'Textbooks',
  title: 'Software Architecture Notes',
  description: 'Clean, complete lecture notes.',
  price: 1250,
  status: 'AVAILABLE',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('ListingCard', () => {
  it('renders the title, LKR price, and detail link', () => {
    render(<MemoryRouter><ListingCard listing={listing} /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: listing.title })).toBeInTheDocument()
    expect(screen.getByText(/LKR 1,250\.00/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view listing/i })).toHaveAttribute('href', '/listings/42')
  })
})
