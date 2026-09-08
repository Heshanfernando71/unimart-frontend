import React, { useState } from 'react'
import { TextField, Button, Paper, Typography } from '@mui/material'
import { useCreateListingMutation } from '../listingsApi'

export const ListingForm = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [createListing] = useCreateListingMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createListing({ title, price: parseFloat(price), description, status: 'AVAILABLE', category: { id: 1 }, seller: { id: 1 } }).unwrap()
      setTitle('')
      setPrice('')
      setDescription('')
      alert('Listing created successfully!')
    } catch (err) {
      console.error('Failed to create listing', err)
      alert('Failed to create listing (Ensure backend is running and authenticated)')
    }
  }

  return (
    <Paper className="p-6 max-w-md mx-auto">
      <Typography variant="h6" className="mb-4">Create New Listing</Typography>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField 
          label="Title" 
          variant="outlined" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <TextField 
          label="Price ($)" 
          type="number" 
          variant="outlined" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
        />
        <TextField 
          label="Description" 
          variant="outlined" 
          multiline 
          rows={4} 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <Button type="submit" variant="contained" color="primary" className="mt-2">
          Submit Listing
        </Button>
      </form>
    </Paper>
  )
}
