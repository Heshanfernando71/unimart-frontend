import React from 'react'
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material'

interface ListingCardProps {
  id: number;
  title: string;
  price: number;
  description: string;
  status: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ title, price, description, status }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent>
        <Typography variant="h5" component="div" className="font-bold text-gray-800">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary" className="text-xl text-green-600 font-semibold">
          ${price.toFixed(2)}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          {description}
        </Typography>
        <div className="mt-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
          </span>
        </div>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" color="primary">View Details</Button>
      </CardActions>
    </Card>
  )
}
